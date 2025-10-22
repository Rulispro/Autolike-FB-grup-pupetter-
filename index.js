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
  await page.goto("https://m.facebook.com/groups/514277487342192/", {
    waitUntil: "networkidle2",
  });
  console.log("✅ Masuk ke grup Facebook");

  // Fungsi delay
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Expose log event dari browser ke console Node.js
  await page.exposeFunction("logClickEvent", (e) => {
    console.log("📡 Klik Like terdeteksi di browser:", e);
  });

  // Tambahkan listener event klik di browser (debug)
  await page.evaluate(() => {
    document.addEventListener(
      "click",
      (e) => {
        const el = e.target.closest(
          'div[role="button"][aria-label*="Like"], div[role="button"][aria-label*="Suka"]'
        );
        if (el) {
          window.logClickEvent({
            text: el.innerText,
            tag: el.tagName,
            time: new Date().toLocaleTimeString(),
            isTrusted: e.isTrusted,
          });
        }
      },
      true
    );
  });

  let clicked = 0;
  const max = 10; // jumlah posting yang akan di-like

  while (clicked < max) {
    console.log(`🔎 Mencari tombol Like ke-${clicked + 1}...`);

    // Jalankan simulasi di dalam halaman
    const result = await page.evaluate(async () => {
      const els = [
        ...document.querySelectorAll(
          'div[role="button"], a[role="button"], span, i, svg'
        ),
      ];
      let likeBtn = null;

      for (const el of els) {
        const aria = (el.getAttribute("aria-label") || "").toLowerCase();
        const text = (el.innerText || "").trim();
        if (
          aria.includes("like") ||
          aria.includes("suka") ||
          text === "󱍸" ||
          text.includes("󱍸")
        ) {
          likeBtn = el.closest('div[role="button"]') || el;
          break;
        }
      }

      if (!likeBtn) return { ok: false };

      likeBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      likeBtn.style.outline = "3px solid red";

      // --- Simulasi TAP realistis ---
      function fire(el, type, props = {}) {
        const event = new Event(type, {
          bubbles: true,
          cancelable: true,
          composed: true,
        });
        Object.assign(event, props);
        el.dispatchEvent(event);
        console.log(`🔥 Fired: ${type}`, props);
      }

      const rect = likeBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      try {
        fire(likeBtn, "pointerover", {
          pointerType: "touch",
          clientX: cx,
          clientY: cy,
        });
        fire(likeBtn, "pointerenter", {
          pointerType: "touch",
          clientX: cx,
          clientY: cy,
        });
        fire(likeBtn, "pointerdown", {
          pointerType: "touch",
          clientX: cx,
          clientY: cy,
        });
        fire(likeBtn, "touchstart", {
          touches: [{ clientX: cx, clientY: cy }],
        });

        setTimeout(() => {
          fire(likeBtn, "pointerup", {
            pointerType: "touch",
            clientX: cx,
            clientY: cy,
          });
          fire(likeBtn, "touchend", {
            changedTouches: [{ clientX: cx, clientY: cy }],
          });
          fire(likeBtn, "mouseup", { clientX: cx, clientY: cy });
          fire(likeBtn, "click", { clientX: cx, clientY: cy });
          console.log("✅ Simulasi tap selesai");
        }, 150);
      } catch (err) {
        console.error("⚠️ Gagal simulasi tap:", err);
      }

      return { ok: true };
    });

    if (!result.ok) {
      console.log("❌ Tidak ditemukan tombol Like, scroll ke bawah...");
      await page.evaluate(() => window.scrollBy(0, 800));
      await delay(2000);
      continue;
    }

    // ✅ Coba cek apakah klik benar-benar diterima oleh FB
    const logs = await page.evaluate(() => {
  return [...document.querySelectorAll("div[role='button']")]
    .filter((b) => {
      const aria = b.getAttribute("aria-label") || "";
      return (
        aria.includes("Like") ||
        aria.includes("LIKE") ||
        aria.includes("like") ||
        aria.includes("Suka") ||
        aria.includes("suka")
      );
    })
    .map((b, i) => ({
      index: i,
      aria: b.getAttribute("aria-label"),
      like: b.getAttribute("aria-pressed") === "true",
    }));
});
            
    console.log("🧩 Status tombol Like di DOM:", logs.slice(0, 3));

    // Fallback jika Like tidak berubah (klik simulasi gagal)
    if (!logs.some((b) => b.like)) {
  console.log("⚠️ Klik simulasi gagal, coba fallback sentuhan nyata...");
  try {
    const likeBtn = await page.$(
      'div[role="button"][aria-label*="like"],div[role="button"][aria-label*="LIKE"],div[role="button"][aria-label*="Like"],div[role="button"][aria-label*="Suka"]'
    );
    if (likeBtn) {
      const box = await likeBtn.boundingBox();
      if (box) {
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;

        // 🔹 klik langsung dari puppeteer (event Chrome DevTools)
        await likeBtn.click({ delay: 80 });
        console.log("✅ Fallback .click() berhasil dikirim");

        await likeBtn.tap({ delay: 100 });
        console.log("✅ Fallback .tap() berhasil dikirim");


        // 🔹 simulasi tap via touchscreen API
        await page.touchscreen.tap(cx, cy);
        console.log("✅ Fallback touchscreen.tap() berhasil dikirim");
      } else {
        console.log("❌ Tidak ada bounding box tombol Like");
      }
    } else {
      console.log("❌ Tidak ada tombol Like untuk fallback");
    }
  } catch (err) {
    console.error("❌ Fallback klik fisik error:", err);
  }
}


    console.log(`👍 Like ke-${clicked + 1} selesai`);
    clicked++;
    await delay(4000 + Math.random() * 2000);
    await page.evaluate(() => window.scrollBy(0, 1000));
  }

  console.log(`🎉 Selesai! Total ${clicked} postingan berhasil di-like`);
  await browser.close();
})();
