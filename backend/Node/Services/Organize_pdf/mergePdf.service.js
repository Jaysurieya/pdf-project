const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const os = require("os");

module.exports = async (files) => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => mergedPdf.addPage(p));
  }

  const outputPath = path.join(os.tmpdir(), `merged-${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, await mergedPdf.save());
  return outputPath;
};
