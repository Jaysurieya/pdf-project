const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const os = require("os");

module.exports = async (files) => {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const imgBytes = fs.readFileSync(file.path);

    const image = file.mimetype.includes("png")
      ? await pdf.embedPng(imgBytes)
      : await pdf.embedJpg(imgBytes);

    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const outputPath = path.join(os.tmpdir(), `scan-${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, await pdf.save());
  return outputPath;
};
