const path = require("path");
const os = require("os");
const fs = require("fs");
const { exec } = require("child_process");

// Function to get LibreOffice path based on OS
const getLibreOfficePath = () => {
  if (process.platform === "win32") {
    const windowsPaths = [
      "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
      "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
      "C:\\LibreOffice\\program\\soffice.exe"
    ];

    for (const p of windowsPaths) {
      if (fs.existsSync(p)) return p;
    }
    return "soffice.exe";
  } else {
    return "soffice";
  }
};

module.exports = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(pdfPath);
    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    const outputPath = path.join(outputDir, `${baseName}.docx`);

    const sofficePath = getLibreOfficePath();

    const command = `"${sofficePath}" --headless --infilter="writer_pdf_import" --convert-to docx:"MS Word 2007 XML" "${pdfPath}" --outdir "${outputDir}"`;

    console.log("🛠 LibreOffice CMD:", command);

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ PDF → Word failed");
        console.error("stderr:", stderr);
        return reject(new Error(stderr || "LibreOffice conversion failed"));
      }

      // Wait and check if file exists
      const fileWatcher = setInterval(() => {
        if (fs.existsSync(outputPath)) {
          clearInterval(fileWatcher);
          console.log("🔥 PDF → Word ready:", outputPath);
          resolve(outputPath);
        }
      }, 300);

      // Fallback timeout
      setTimeout(() => {
        clearInterval(fileWatcher);
        reject(new Error("LibreOffice conversion timeout"));
      }, 30000);
    });
  });
};
