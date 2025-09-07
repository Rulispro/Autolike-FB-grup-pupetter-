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
// const puppeteer = require("puppeteer");

//(async () => {
 // const browser = await puppeteer.launch({
  //  headless: "new",
 //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
//  });
//  const page = await browser.newPage();

  // === Samakan environment dengan browser Kiwi (Android Chrome) ===
 // await page.setUserAgent(
   // "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
   // "(KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
//  );

 // await page.setViewport({
    //width: 390,   // ukuran layar Android
   // height: 844,  // tinggi layar
  //  isMobile: true,
  //  hasTouch: true
//  });

  // === Pakai cookies biar langsung login ===
  //const cookies = require("./cookies.json");
  //await page.setCookie(...cookies);

  // Buka versi mobile Facebook
  //await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
 // console.log("✅ Berhasil buka Facebook (mobile)");

  // Ganti URL ke grup (pakai m.facebook.com biar sama kayak Kiwi)
 // await page.goto("https://m.facebook.com/groups/514277487342192/", { waitUntil: "networkidle2" });

 // let max = 10;        // jumlah like maksimal
 // let delayMs = 3000;  // delay antar aksi (ms)
 // let clicked = 0;

  //async function delay(ms) {
   // return new Promise(res => setTimeout(res, ms));
//  }

 // while (clicked < max) {
   // const button = await page.$(
      //'div[role="button"][aria-label*="Like"],div[role="button"][aria-label*="like"], div[role="button"][aria-label*="Suka"]'
   // );

   // if (button) {
      //await button.tap(); // ✅ simulate tap (touchscreen)
     // clicked++;
    //  console.log(`👍 Klik tombol Like ke-${clicked}`);
  //  } else {
     // console.log("🔄 Tidak ada tombol Like, scroll...");
   // }

    // Scroll sedikit biar postingan baru muncul
    //await page.evaluate(() => window.scrollBy(0, 500));
   // await delay(delayMs);
 // }

 // console.log(`🎉 Selesai! ${clicked} tombol Like sudah diklik.`);
  //await browser.close();
//})();

const puppeteer = require("puppeteer");
const fs = require("fs");
const XLSX = require("xlsx");

// === Load Excel Template ===
const workbook = XLSX.readFile("template.xlsx");
const sheet = workbook.Sheets["Tasks"];
const tasks = XLSX.utils.sheet_to_json(sheet);

// === Helper delay ===
const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]; // format YYYY-MM-DD

  // Filter task sesuai tanggal hari ini
  const todayTasks = tasks.filter(t => t.Date === dateStr);

  for (const task of todayTasks) {
    const { Account, GroupURL, TotalLikes } = task;

    // Ambil cookies dari Secrets
    const cookiesStr = process.env[`COOKIE_${Account.toUpperCase()}`];
    if (!cookiesStr) {
      console.log(`❌ Cookies untuk ${Account} tidak ditemukan`);
      continue;
    }
    const cookies = JSON.parse(cookiesStr);

    console.log(`\n🚀 Jalankan akun ${Account} di grup ${GroupURL}`);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    // Samakan environment dengan mobile
    await page.setUserAgent(
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
    );
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    await page.setCookie(...cookies);

    // Masuk ke grup
    await page.goto(GroupURL, { waitUntil: "networkidle2" });

    let clicked = 0;
    while (clicked < TotalLikes) {
      const button = await page.$(
        'div[role="button"][aria-label*="Like"], div[role="button"][aria-label*="Suka"]'
      );
      if (button) {
        await button.tap();
        clicked++;
        console.log(`👍 ${Account} klik tombol Like ke-${clicked}`);
      } else {
        console.log("🔄 Tidak ada tombol Like, scroll...");
      }
      await page.evaluate(() => window.scrollBy(0, 500));
      await delay(3000);
    }

    console.log(`🎉 ${Account} selesai Like ${clicked} postingan`);
    await browser.close();

    // Jeda 3 detik sebelum pindah akun berikutnya
    await delay(3000);
  }

  console.log("\n✅ Semua akun selesai");
})();

