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

  // === Samakan dengan browser Kiwi (Android Chrome) ===
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  );

  // === Pakai cookies biar langsung login ===
  const cookies = require("./cookies.json");
  await page.setCookie(...cookies);

  // Buka versi mobile Facebook
  await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
  console.log("✅ Berhasil buka Facebook (mobile)");

  // Ganti URL ke grup (pakai m.facebook.com biar sama kayak Kiwi)
  await page.goto("https://m.facebook.com/groups/514277487342192/", { waitUntil: "networkidle2" });

  let max = 10;        // jumlah like maksimal
  let delayMs = 3000;  // delay antar aksi (ms)
  let clicked = 0;

  async function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  while (clicked < max) {
    const liked = await page.evaluate(() => {
      let btn = Array.from(
        document.querySelectorAll('div[role="button"][aria-label]')
      ).find(b => 
        b.offsetParent !== null &&
        !b.dataset.liked &&
        /like|suka/i.test(b.getAttribute("aria-label"))
      );

      if (btn) {
        btn.click();
        btn.dataset.liked = "true";
        return true;
      }
      return false;
    });

    if (liked) {
      clicked++;
      console.log(`👍 Klik tombol Like ke-${clicked}`);
    } else {
      console.log("🔄 Tidak ada tombol Like, scroll...");
    }

    // Scroll sedikit biar postingan baru muncul
    await page.evaluate(() => window.scrollBy(0, 500));
    await delay(delayMs);
  }

  console.log(`🎉 Selesai! ${clicked} tombol Like sudah diklik.`);
  await browser.close();
})();

