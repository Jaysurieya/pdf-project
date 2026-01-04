const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

module.exports = async (
  pdfPath,
  signaturePath,
  placements,
  options
) => {
  console.log("PLACEMENTS:", placements);

  const pdfBytes = fs.readFileSync(pdfPath);
  const sigBytes = fs.readFileSync(signaturePath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pdfPages = pdfDoc.getPages();

  const signatureImage = await pdfDoc.embedPng(sigBytes);

  placements.forEach(({ page, x, y }) => {
    const pdfPage = pdfPages[page];
    if (!pdfPage) return;

    const { width: pageW, height: pageH } = pdfPage.getSize();

    // 🛡️ Clamp safety
    const safeX = Math.max(0, Math.min(x, pageW - options.width));
    const safeY = Math.max(0, Math.min(y, pageH - options.height));

    pdfPage.drawImage(signatureImage, {
      x: safeX,
      y: safeY,
      width: options.width,
      height: options.height
    });
  });

  return await pdfDoc.save();
};
