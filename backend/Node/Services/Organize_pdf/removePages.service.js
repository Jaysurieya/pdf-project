const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const os = require("os");

module.exports = async (filePath, pagesToRemoveStr = '') => {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  
  // If no specific pages to remove are provided, return the original PDF
  if (!pagesToRemoveStr || pagesToRemoveStr.trim() === '') {
    const outputPath = path.join(os.tmpdir(), `removed-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    return outputPath;
  }
  
  // Parse the pages string to get the page indices to remove
  const totalPages = pdf.getPageCount();
  const pagesToRemove = parsePagesString(pagesToRemoveStr, totalPages);
  
  // Sort in descending order to avoid index shifting issues when removing pages
  pagesToRemove
    .sort((a, b) => b - a)
    .forEach(p => pdf.removePage(p));
  
  const outputPath = path.join(os.tmpdir(), `removed-${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, await pdf.save());
  return outputPath;
};

// Helper function to parse pages string like "1,3,5" or "2-5" or "1,3,5-7"
function parsePagesString(pagesStr, totalPages) {
  const indices = new Set();
  
  // Split by commas to handle multiple ranges/values
  const parts = pagesStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    
    if (trimmed.includes('-')) {
      // Handle ranges like "2-5"
      const [start, end] = trimmed.split('-').map(Number);
      
      // Convert to 0-based indices and ensure they're within bounds
      const startIdx = Math.max(0, start - 1);
      const endIdx = Math.min(totalPages - 1, end - 1);
      
      for (let i = startIdx; i <= endIdx; i++) {
        indices.add(i);
      }
    } else {
      // Handle single page numbers
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        indices.add(pageNum - 1); // Convert to 0-based index
      }
    }
  }
  
  return Array.from(indices); // Return array of indices
}
