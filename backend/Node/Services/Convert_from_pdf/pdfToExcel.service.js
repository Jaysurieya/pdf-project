const path = require("path");
const os = require("os");
const fs = require("fs");
const { exec } = require("child_process");

module.exports = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = os.tmpdir();
    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    const outputPath = path.join(outputDir, `${baseName}.docx`);

    // LibreOffice command
    const command = `soffice --headless --convert-to docx "${pdfPath}" --outdir "${outputDir}"`;

    console.log("🛠 LibreOffice CMD:", command);

    exec(command, (error) => {
      if (error) {
        console.error("❌ PDF → Word failed");
        return reject(error);
      }

      // ⏳ wait until file exists
      const checkFile = setInterval(() => {
        if (fs.existsSync(outputPath)) {
          clearInterval(checkFile);
          console.log("✅ PDF → Word ready:", outputPath);
          resolve(outputPath);
        }
      }, 300);

      // safety timeout
      setTimeout(() => {
        clearInterval(checkFile);
        reject(new Error("LibreOffice conversion timeout"));
      }, 10000);
    });
  });
};
