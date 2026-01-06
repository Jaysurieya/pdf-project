const path = require("path");
const os = require("os");
const fs = require("fs");
const { exec } = require("child_process");
const archiver = require("archiver");
const { randomUUID } = require("crypto");

module.exports = async (pdfPath) => {
  return new Promise((resolve, reject) => {
    console.log("==== SERVICE STARTED: PDF → JPG ====");
    console.log("PDF PATH:", pdfPath);

    if (!fs.existsSync(pdfPath)) {
      console.error("❌ PDF FILE NOT FOUND");
      return reject(new Error("Input PDF file does not exist"));
    }

    const tempDir = os.tmpdir();
    const prefix = path.join(tempDir, randomUUID());

    const command = `pdftoppm -jpeg -r 200 "${pdfPath}" "${prefix}"`;
    console.log("Running:", command);

    exec(command, async (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Poppler failed");
        console.error(stderr);
        return reject(new Error(err.message || stderr));
      }

      const files = fs.readdirSync(tempDir);
      const uuidPrefix = path.basename(prefix);

      const jpgFiles = files.filter(f =>
        f.startsWith(uuidPrefix + "-") && f.toLowerCase().endsWith(".jpg")
      );

      if (jpgFiles.length === 0) {
        console.error("❌ MATCHING JPG FILES NOT FOUND");
        console.error("⚠️ Debug: Folder or prefix not found / no images generated");
        console.error("Expected pattern:", uuidPrefix + "-*.jpg");
        return reject(new Error("JPG output folder/prefix not found"));
      }


      // Single page → return one JPG
      if (jpgFiles.length === 1) {
        const imgPath = path.join(tempDir, jpgFiles[0]);
        console.log("✅ Single JPG created:", imgPath);
        return resolve({ mode: "single", path: imgPath });
      }

      // Multiple pages → zip them
      if (jpgFiles.length > 1) {
        const zipPath = path.join(tempDir, `pdf-images-${randomUUID()}.zip`);
        console.log("📦 Creating ZIP:", zipPath);

        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip");
        archive.pipe(output);

        jpgFiles.forEach(file => {
          const filePath = path.join(tempDir, file);
          archive.file(filePath, { name: file });
        });

        await archive.finalize();

        output.on("close", () => {
          console.log("🔥 ZIP Ready:", zipPath);
          resolve({ mode: "multiple", zip: zipPath, files: jpgFiles.map(f => path.join(tempDir, f)) });
        });
      }

      // No images → error
      else if (jpgFiles.length === 0) {
        reject(new Error("No JPG files created"));
      }
    });
  });
};
