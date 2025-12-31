const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const ExcelJS = require("exceljs");

module.exports = async (pdfPath) => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("PDF Data");

  const lines = data.text.split("\n");

  lines.forEach((line, index) => {
    sheet.addRow([line]);
  });

  const outputPath = pdfPath.replace(".pdf", ".xlsx");
  await workbook.xlsx.writeFile(outputPath);

  return outputPath;
};
