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
"use strict";
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  );
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const cookies = require("./cookies.json");
  await page.setCookie(...cookies);

  await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
  console.log("✅ Berhasil buka Facebook");

  await page.goto("https://m.facebook.com/groups/514277487342192/", { waitUntil: "networkidle2" });
  console.log("✅ Masuk ke grup");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  let clicked = 0;
  const max = 10;

  while (clicked < max) {
    console.log(`🔎 Mencari tombol Like ke-${clicked + 1}...`);

    // cari link tombol like nyata (URL mengandung "reaction")
    const likeBtn = await page.$('a[href*="/ufi/reaction/"][role="button"]');

    if (!likeBtn) {
      console.log("❌ Tidak ditemukan tombol Like, scroll dulu...");
      await page.evaluate(() => window.scrollBy(0, 800));
      await delay(2000);
      continue;
    }

    await likeBtn.evaluate((btn) => {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      btn.style.outline = "3px solid red";
    });

    await delay(500);
    await likeBtn.click(); // klik DOM langsung
    console.log(`👍 Like ke-${clicked + 1} berhasil dikirim`);

    clicked++;
    await delay(3000 + Math.random() * 2000);
    await page.evaluate(() => window.scrollBy(0, 800));
  }

  console.log(`🎉 Selesai: ${clicked} postingan berhasil di-like`);
  await browser.close();
})();
