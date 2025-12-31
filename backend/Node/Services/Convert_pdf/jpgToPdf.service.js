const fs = require("fs");
const path = require("path");
const os = require("os");
const { PDFDocument } = require("pdf-lib");
const { randomUUID } = require("crypto");

module.exports = async (imagePath) => {
  const pdfDoc = await PDFDocument.create();
  const imageBytes = fs.readFileSync(imagePath);

  const image = await pdfDoc.embedJpg(imageBytes);
  const page = pdfDoc.addPage([image.width, image.height]);

  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height
  });

  const pdfBytes = await pdfDoc.save();

  const outputPath = path.join(os.tmpdir(), `${randomUUID()}.pdf`);
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
};
