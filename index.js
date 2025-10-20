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

  // === Samakan environment dengan browser Kiwi (Android Chrome) ===
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  );

  await page.setViewport({
    width: 390,   // ukuran layar Android
    height: 844,  // tinggi layar
    isMobile: true,
    hasTouch: true
  });

  // === Pakai cookies biar langsung login ===
  const cookies = require("./cookies.json");
  await page.setCookie(...cookies);

  // Buka versi mobile Facebook
  await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
  console.log("✅ Berhasil buka Facebook (mobile)");

  // Ganti URL ke grup (pakai m.facebook.com biar sama kayak Kiwi)
  await page.goto("https://facebook.com/groups/5763845890292336/", { waitUntil: "networkidle2" });

  let max = 10; // jumlah like maksimal
  let delayMs = 3000; // delay antar aksi (ms)
  let clicked = 0;

  async function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  while (clicked < max) {
    // Tunggu tombol Like muncul
    const likeButton = await page.$('div[role="button"][aria-label*="like"], div[role="button"][aria-label*="LIKE"], div[role="button"][aria-label*="Suka"]');

    if (likeButton) {
      console.log(`🔍 Tombol Like ditemukan ke-${clicked + 1}`);

      // Jalankan di konteks browser
      await page.evaluate((el) => {
        function trigger(el, type, props = {}) {
          const event = new Event(type, { bubbles: true, cancelable: true, composed: true });
          Object.assign(event, props);
          el.dispatchEvent(event);
        }

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        el.style.outline = "3px solid red";

        trigger(el, "pointerover", { pointerType: "touch" });
        trigger(el, "pointerenter", { pointerType: "touch" });
        trigger(el, "pointerdown", { pointerType: "touch", isPrimary: true, clientX: cx, clientY: cy });
        trigger(el, "touchstart", { touches: [{ clientX: cx, clientY: cy }] });

        setTimeout(() => {
          trigger(el, "pointerup", { pointerType: "touch", isPrimary: true, clientX: cx, clientY: cy });
          trigger(el, "touchend", { changedTouches: [{ clientX: cx, clientY: cy }] });
          trigger(el, "mouseup", { clientX: cx, clientY: cy });
          trigger(el, "click", { clientX: cx, clientY: cy });
          console.log("👍 Klik Like berhasil dikirim!");
        }, 150);
      }, likeButton);

      clicked++;
      await delay(delayMs);
    } else {
      console.log("🔄 Tidak ditemukan tombol Like, scroll untuk mencari lagi...");
    }

    
    // ✅ Scroll sedikit biar postingan baru muncul
    await page.evaluate(() => window.scrollBy(0, 500));
    await delay(delayMs);
  }

 console.log(`🎉 Selesai! ${clicked} tombol Like sudah diklik.`);
  await browser.close();
})();

