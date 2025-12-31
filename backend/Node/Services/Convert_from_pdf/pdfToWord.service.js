const path = require("path");
const pdf2docx = require("pdf2docx");

module.exports = async (pdfPath) => {
  const outputPath = pdfPath.replace(".pdf", ".docx");

  await pdf2docx.convert(pdfPath, outputPath);

  return outputPath;
};
