//const puppeteer = require("puppeteer");

//(async () => {
  //const browser = await puppeteer.launch({
   // headless: "new",
    //args: ["--no-sandbox", "--disable-setuid-sandbox"]
//  });
//  const page = await browser.newPage();

  // === Pakai cookies biar langsung login ===
//  const cookies = require("./cookies.json");
 // await page.setCookie(...cookies);

//  await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
//  console.log("✅ Berhasil buka Facebook");

  // Ganti URL ke grup kalau mau like post di grup
//  await page.goto("https://facebook.com/groups/514277487342192/", { waitUntil: "networkidle2" });

//  let max = 10;        // jumlah like maksimal
//  let delayMs = 3000;  // delay antar aksi (ms)
//  let clicked = 0;

//  async function delay(ms) {
//    return new Promise(res => setTimeout(res, ms));
//  }
//
  //while (clicked < max) {
  //  try {
      // Cari tombol like yang belum diklik (paling atas yang terlihat)
  //    const btn = await page.$(
    //    "div[role='button'][aria-label*='Like'], " +
   //     "div[role='button'][aria-label*='Suka']"
  //    );

  //    if (!btn) {
  //      console.log("🔄 Tidak ada tombol Like kelihatan, scroll...");
   //     await page.evaluate(() => window.scrollBy(0, 500));
  //      await delay(delayMs);
   //     continue;
 //     }

      // Klik tombol like
  //    await btn.click();
 //     clicked++;
  //    console.log(`👍 Klik tombol Like ke-${clicked}`);

      // Tunggu sebentar
  //    await delay(delayMs);

      // Scroll ke bawah sedikit agar postingan baru muncul
    //  await page.evaluate(() => window.scrollBy(0, 500));
  //    await delay(delayMs);

//    } catch (err) {
 //     console.log("⚠️ Error klik tombol:", err.message);
  //    await page.evaluate(() => window.scrollBy(0, 500));
 // //    await delay(delayMs);
 //   }
//  }

 // console.log(`🎉 Selesai! ${clicked} tombol Like sudah diklik.`);
 // await browser.close();
//})();

 const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  // === Pakai cookies biar langsung login ===
  const cookies = require("./cookies.json");
  await page.setCookie(...cookies);

  await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
  console.log("✅ Berhasil buka Facebook");

  // Ganti URL ke grup kalau mau like post di grup
  await page.goto("https://facebook.com/groups/514277487342192/", { waitUntil: "networkidle2" });

  let max = 10;        // jumlah like maksimal
  let delayMs = 3000;  // delay antar aksi (ms)
  let clicked = 0;

  async function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  while (clicked < max) {
    const newlyClicked = await page.evaluate((max, clicked) => {
      let buttons = Array.from(document.querySelectorAll('div[role="button"][aria-label*="like"]'))
        .filter(btn => btn.offsetParent !== null && !btn.dataset.liked);

      let localClicks = 0;

      for (let btn of buttons) {
        if (clicked + localClicks >= max) break;
        btn.click();
        btn.dataset.liked = "true"; // tandai supaya tidak diklik ulang
        localClicks++;
      }

      return localClicks;
    }, max, clicked);

    if (newlyClicked > 0) {
      clicked += newlyClicked;
      console.log(`👍 Klik ${newlyClicked} tombol Like, total: ${clicked}`);
    } else {
      console.log("🔄 Tidak ada tombol Like baru, scroll...");
    }

    // Scroll biar postingan baru muncul
    await page.evaluate(() => window.scrollBy(0, 500));
    await delay(delayMs);
  }

  console.log(`🎉 Selesai! ${clicked} tombol Like sudah diklik.`);
  await browser.close();
})();
