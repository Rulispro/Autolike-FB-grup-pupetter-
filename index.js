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

  // === Samakan dengan environment Kiwi (Android) ===
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  );

  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  });

  // === Pakai cookies login ===
  const cookies = require("./cookies.json");
  await page.setCookie(...cookies);

  // === Buka Facebook mobile ===
  await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
  console.log("✅ Berhasil buka Facebook");

  // === Masuk ke grup ===
  await page.goto("https://m.facebook.com/groups/514277487342192/", {
    waitUntil: "networkidle2",
  });

  const max = 10;
  const delayMs = 3000;
  let clicked = 0;

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  while (clicked < max) {
    console.log(`\n🔎 Mencari tombol Like ke-${clicked + 1}...`);

    // Dapatkan posisi tombol Like
    const box = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div[role="button"]'));
      const el = els.find(
        (e) =>
          e.innerText?.toLowerCase().includes("suka") ||
          e.innerText?.toLowerCase().includes("like")
      );

      if (!el) return null;

      el.style.outline = "2px solid red";
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
    });

    if (!box) {
      console.log("❌ Tidak ditemukan tombol Like, scroll ke bawah...");
      await page.evaluate(() => window.scrollBy(0, 600));
      await delay(2000);
      continue;
    }

    // Scroll ke posisi tombol biar kelihatan
    await page.evaluate((y) => window.scrollTo(0, y - 200), box.y);
    await delay(800);

    // Tap gesture asli (bukan dispatch event manual)
    await page.touchscreen.tap(box.x, box.y);
    console.log(`👍 Like ke-${clicked + 1} berhasil dikirim (gesture asli)`);

    clicked++;
    await delay(delayMs);

    // Scroll agar postingan baru muncul
    await page.evaluate(() => window.scrollBy(0, 500));
    await delay(1500);
  }

  console.log(`🎉 Selesai! ${clicked} postingan berhasil di-Like.`);
  await browser.close();
})();
