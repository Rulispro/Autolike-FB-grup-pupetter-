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
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();

  // Simulasikan perangkat Android
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

  // Ambil cookies login
  const cookies = require("./cookies.json");
  await page.setCookie(...cookies);

  // Buka Facebook
  await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
  console.log("✅ Berhasil buka Facebook");

  // Masuk ke grup
  await page.goto("https://m.facebook.com/groups/514277487342192/", { waitUntil: "networkidle2" });
  console.log("✅ Masuk ke grup Facebook");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  let clicked = 0;
  const max = 10; // jumlah posting yang akan di-like

  while (clicked < max) {
    console.log(`🔎 Mencari tombol Like ke-${clicked + 1}...`);

    const result = await page.evaluate(() => {
      const els = [...document.querySelectorAll('div[role="button"], a[role="button"], span, i, svg')];
      let likeBtn = null;

      for (const el of els) {
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        const text = (el.innerText || '').trim();

        if (
          aria.includes('like') ||
          aria.includes('Like') ||
          aria.includes('LIKE') ||
          aria.includes('Suka') ||
          aria.includes('suka') ||
          text === '󱍸' ||
          text.includes('󱍸')
        ) {
          likeBtn = el.closest('div[role="button"]') || el;
          break;
        }
      }

      if (!likeBtn) return { ok: false };

      likeBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      likeBtn.style.outline = "3px solid red";

      const rect = likeBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      function fire(el, type, props = {}) {
        const ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
        Object.assign(ev, props);
        el.dispatchEvent(ev);
      }

      // Simulasikan sentuhan
      fire(likeBtn, "pointerover", { pointerType: "touch" });
      fire(likeBtn, "pointerenter", { pointerType: "touch" });
      fire(likeBtn, "pointerdown", { pointerType: "touch", clientX: cx, clientY: cy });
      fire(likeBtn, "touchstart", { touches: [{ clientX: cx, clientY: cy }] });

      setTimeout(() => {
        fire(likeBtn, "pointerup", { pointerType: "touch", clientX: cx, clientY: cy });
        fire(likeBtn, "touchend", { changedTouches: [{ clientX: cx, clientY: cy }] });
        fire(likeBtn, "mouseup", { clientX: cx, clientY: cy });
        fire(likeBtn, "click", { clientX: cx, clientY: cy });
      }, 150);

      return { ok: true };
    });

    if (!result.ok) {
      console.log("❌ Tidak ditemukan tombol Like, scroll ke bawah...");
      await page.evaluate(() => window.scrollBy(0, 800));
      await delay(2000);
      continue;
    }

    console.log(`👍 Like ke-${clicked + 1} berhasil!`);
    clicked++;
    await delay(4000 + Math.random() * 2000);
    await page.evaluate(() => window.scrollBy(0, 1000));
  }

  console.log(`🎉 Selesai! Total ${clicked} postingan berhasil di-like`);
  await browser.close();
})();
