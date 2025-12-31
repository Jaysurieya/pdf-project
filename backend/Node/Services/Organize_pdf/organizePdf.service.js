const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const os = require("os");

module.exports = async (filePath, orderStr = '') => {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  
  // If no specific order is provided, just return the original PDF
  if (!orderStr || orderStr.trim() === '') {
    const outputPath = path.join(os.tmpdir(), `organized-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    return outputPath;
  }
  
  // Parse the order string to get the page indices
  const totalPages = pdf.getPageCount();
  const pageOrder = parseOrderString(orderStr, totalPages);
  
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pageOrder);
  
  pages.forEach(page => newPdf.addPage(page));
  
  const outputPath = path.join(os.tmpdir(), `organized-${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, await newPdf.save());
  return outputPath;
};

// Helper function to parse order string like "3,2,1" or "2,1,4,3"
function parseOrderString(orderStr, totalPages) {
  if (!orderStr || orderStr.trim() === '') {
    return [];
  }
  
  // Split by commas to handle multiple page numbers
  const pageNumbers = orderStr.split(',').map(part => parseInt(part.trim(), 10));
  
  // Filter out invalid page numbers and convert to 0-based indices
  const validIndices = [];
  
  for (const pageNum of pageNumbers) {
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      validIndices.push(pageNum - 1); // Convert to 0-based index
    }
  }
  
  return validIndices;
}
