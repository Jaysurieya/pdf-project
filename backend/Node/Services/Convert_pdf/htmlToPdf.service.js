const puppeteer = require("puppeteer-core");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { v4: uuid } = require("uuid");

/**
 * Decide Chrome / Chromium path based on environment
 */
const getChromePath = () => {
  // 1️⃣ Prefer env variable (BEST for deployment)
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  // 2️⃣ Windows (local dev)
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }

  // 3️⃣ Linux (Render / VPS)
  return "/usr/bin/chromium";
};

module.exports = async (htmlPath) => {
  console.log("🌐 HTML → PDF input:", htmlPath);
  console.log("🚀 Using browser:", getChromePath());

  // Read HTML file
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  const browser = await puppeteer.launch({
    executablePath: getChromePath(),
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0"
    });

    const outputPath = path.join(os.tmpdir(), `${uuid()}.pdf`);

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true
    });

    console.log("✅ HTML → PDF output:", outputPath);
    return outputPath;

  } finally {
    await browser.close();
  }
};
