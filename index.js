const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
  headless: "new",   // pakai headless chromium modern
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
  const page = await browser.newPage();

  // === Pakai cookies biar langsung login ===
  const cookies = require("./cookies.json");
  await page.setCookie(...cookies);

  await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
  console.log("✅ Berhasil buka Facebook");

  // Ganti URL ke grup kalau mau like post di grup
   await page.goto("https://facebook.com/groups/512223333438818/", { waitUntil: "networkidle2" });

  let max = 10;       // jumlah like maksimal
  let userDelay = 3000; // delay antar klik (ms)

  let clicked = 0;
  async function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  while (clicked < max) {
    // Cari tombol like
    let buttons = await page.$$("div[role='button'][aria-label*='Like']");

    if (buttons.length === 0) {
      console.log("🔄 Scroll cari tombol lagi...");
      await page.evaluate(() => window.scrollBy(0, 500));
      await delay(userDelay);
      continue;
    }

    for (let btn of buttons) {
      if (clicked >= max) break;
      try {
        await btn.click();
        clicked++;
        console.log(`👍 Klik tombol Like ke-${clicked}`);
        await delay(userDelay);

        // Scroll supaya muncul postingan baru
        await page.evaluate(() => window.scrollBy(0, 500));
        await delay(userDelay);
      } catch (err) {
        console.log("⚠️ Error klik tombol:", err.message);
      }
    }
  }

  console.log(`🎉 Selesai! ${clicked} tombol Like sudah diklik.`);
   await browser.close();
})();
