const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const os = require("os");

module.exports = async (filePath, pages = null) => {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  
  // If no specific pages are requested, just return the first page
  if (!pages || pages.trim() === '') {
    const newPdf = await PDFDocument.create();
    const [firstPage] = await newPdf.copyPages(pdf, [0]);
    newPdf.addPage(firstPage);
    
    const outputPath = path.join(os.tmpdir(), `split-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, await newPdf.save());
    return outputPath;
  }
  
  // Parse the pages string to get the page indices
  const totalPages = pdf.getPageCount();
  const pageIndices = parsePagesString(pages, totalPages);
  
  const newPdf = await PDFDocument.create();
  const pagesToCopy = await newPdf.copyPages(pdf, pageIndices);
  
  pagesToCopy.forEach(page => newPdf.addPage(page));
  
  const outputPath = path.join(os.tmpdir(), `split-${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, await newPdf.save());
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
  
  return Array.from(indices).sort((a, b) => a - b); // Return sorted array of indices
}
