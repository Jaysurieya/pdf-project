const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const { randomUUID } = require("crypto");

module.exports = async (pdfPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = os.tmpdir();
    const outputName = randomUUID();
    const outputPrefix = path.join(outputDir, outputName);

    // Poppler command → first page only
    const command = `pdftoppm -jpeg -r 200 -f 1 -l 1 "${pdfPath}" "${outputPrefix}"`;

    exec(command, (err) => {
      if (err) {
        console.error("❌ PDF → JPG failed:", err);
        return reject(err);
      }

      const outputPath = `${outputPrefix}-1.jpg`;
      resolve(outputPath);
    });
  });
};
