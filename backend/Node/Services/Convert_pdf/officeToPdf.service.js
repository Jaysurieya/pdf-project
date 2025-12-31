const path = require("path");
const os = require("os");
const fs = require("fs");
const { exec } = require("child_process");

module.exports = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = os.tmpdir();
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputDir, `${baseName}.pdf`);

    const command = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

    console.log("🛠 LibreOffice CMD:", command);

    exec(command, (error) => {
      if (error) {
        console.error("❌ LibreOffice failed");
        return reject(error);
      }

      // ⏳ WAIT until file actually exists
      const checkFile = setInterval(() => {
        if (fs.existsSync(outputPath)) {
          clearInterval(checkFile);
          console.log("✅ Office PDF ready:", outputPath);
          resolve(outputPath);
        }
      }, 300);

      // safety timeout
      setTimeout(() => {
        clearInterval(checkFile);
        reject(new Error("LibreOffice timeout"));
      }, 10000);
    });
  });
};
