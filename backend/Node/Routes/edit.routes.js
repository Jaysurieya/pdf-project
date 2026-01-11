const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFDocument, rgb, degrees } = require("pdf-lib");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ADD WATERMARK Element
router.post("/watermark", upload.single("files"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const watermarkText = req.body.watermarkText || "WATERMARK";
    const watermarkSettings = {
      fontSize: parseInt(req.body.fontSize) || 30,
      opacity: parseFloat(req.body.opacity) || 0.5,
      color: req.body.color || "gray",
      position: req.body.position || "center", // center, top-left, top-right, bottom-left, bottom-right, diagonal
    };

    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Define color based on input
    let textColor;
    switch (watermarkSettings.color.toLowerCase()) {
      case 'red':
        textColor = rgb(1, 0, 0);
        break;
      case 'blue':
        textColor = rgb(0, 0, 1);
        break;
      case 'green':
        textColor = rgb(0, 0.5, 0);
        break;
      case 'black':
        textColor = rgb(0, 0, 0);
        break;
      default:
        textColor = rgb(0.5, 0.5, 0.5); // gray
    }

    const pages = pdfDoc.getPages();
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      // Embed font
      const font = await pdfDoc.embedFont("Helvetica-Bold");
      
      if (watermarkSettings.position === 'diagonal') {
        // Draw diagonal watermark across the page
        const diagonalText = watermarkText.toUpperCase();
        
        // Calculate text dimensions
        const textWidth = font.widthOfTextAtSize(diagonalText, watermarkSettings.fontSize);
        
        // Draw diagonal watermark at the center rotated 45 degrees
        page.drawText(diagonalText, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: watermarkSettings.fontSize,
          font: font,
          color: textColor,
          opacity: watermarkSettings.opacity,
          rotate: degrees(-45), // Rotate 45 degrees counter-clockwise
        });
      } else if (watermarkSettings.position === 'full-page-diagonal') {
        // Draw repeated diagonal watermark across the entire page
        const diagonalText = watermarkText.toUpperCase();
        
        // Calculate text dimensions
        const textWidth = font.widthOfTextAtSize(diagonalText, watermarkSettings.fontSize);
        
        // Draw multiple diagonal watermarks across the page
        const spacingX = textWidth * 2; // Horizontal spacing
        const spacingY = textWidth * 1.5; // Vertical spacing
        
        // Calculate how many rows and columns we need to cover the page
        const rows = Math.ceil(height / spacingY) + 2;
        const cols = Math.ceil(width / spacingX) + 2;
        
        // Draw the diagonal text multiple times across the page
        for (let row = -1; row < rows; row++) {
          for (let col = -1; col < cols; col++) {
            const x = col * spacingX - (row * spacingY / 2); // Offset each row to create diagonal effect
            const y = height - (row * spacingY);
            
            page.drawText(diagonalText, {
              x: x,
              y: y,
              size: watermarkSettings.fontSize,
              font: font,
              color: textColor,
              opacity: watermarkSettings.opacity * 0.3, // Make it more subtle for full page
              rotate: degrees(-45), // Rotate 45 degrees counter-clockwise
            });
          }
        }
      } else {
        // Get text size to position it normally
        const textSize = font.widthOfTextAtSize(watermarkText, watermarkSettings.fontSize);
        
        let x, y;
        
        // Position watermark based on settings
        switch (watermarkSettings.position) {
          case 'top-left':
            x = 50;
            y = height - 100;
            break;
          case 'top-right':
            x = width - textSize - 50;
            y = height - 100;
            break;
          case 'bottom-left':
            x = 50;
            y = 100;
            break;
          case 'bottom-right':
            x = width - textSize - 50;
            y = 100;
            break;
          case 'center':
          default:
            x = (width - textSize) / 2;
            y = height / 2;
            break;
        }
        
        // Draw the watermark text
        page.drawText(watermarkText, {
          x: x,
          y: y,
          size: watermarkSettings.fontSize,
          font: font,
          color: textColor,
          opacity: watermarkSettings.opacity,
        });
      }
    }

    const watermarkedPdf = await pdfDoc.save();
    fs.unlinkSync(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=watermarked.pdf");
    res.send(Buffer.from(watermarkedPdf));
  } catch (err) {
    console.error("Add Watermark Error:", err);
    res.status(500).json({ message: "Add watermark failed", error: err.message });
  }
});

// CROP PDF
router.post("/crop", upload.single("files"), async (req, res) => {
  try {
    const filePath = req.file.path;
    
    // Parse crop settings from query parameters or body
    const left = parseFloat(req.body.left) || 0;
    const right = parseFloat(req.body.right) || 0;
    const top = parseFloat(req.body.top) || 0;
    const bottom = parseFloat(req.body.bottom) || 0;
    
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Validate that PDF has only one page for cropping
    const initialPages = pdfDoc.getPages();
    if (initialPages.length > 1) {
      return res.status(400).json({ 
        message: "Crop functionality only supports single-page PDFs. Please upload a PDF with only one page." 
      });
    }

    const pages = initialPages;
    
    // Create new pages with cropped content
    const newPages = [];
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      // Convert percentages to actual points
      const leftPoints = (left / 100) * width;
      const rightPoints = (right / 100) * width;
      const topPoints = (top / 100) * height;
      const bottomPoints = (bottom / 100) * height;
      
      // Calculate new dimensions after cropping
      const newWidth = width - leftPoints - rightPoints;
      const newHeight = height - topPoints - bottomPoints;
      
      // Create a new page with the cropped dimensions
      const newPage = pdfDoc.addPage([newWidth, newHeight]);
      
      // Embed the original page content onto the new page
      const embeddedPage = await pdfDoc.embedPage(page, {
        left: leftPoints,
        bottom: bottomPoints,
        right: width - rightPoints,
        top: height - topPoints
      });
      
      // Draw the cropped content on the new page
      newPage.drawPage(embeddedPage, {
        x: 0,
        y: 0,
        width: newWidth,
        height: newHeight
      });
      
      newPages.push(newPage);
    }
    
    // Remove all original pages after processing
    for (let i = pages.length - 1; i >= 0; i--) {
      pdfDoc.removePage(0); // Always remove the first page since indices shift
    }

    const croppedPdf = await pdfDoc.save();
    fs.unlinkSync(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cropped.pdf");
    res.send(Buffer.from(croppedPdf));
  } catch (err) {
    console.error("Crop PDF Error:", err);
    res.status(500).json({ message: "Crop PDF failed", error: err.message });
  }
});

// BASIC EDIT PDF (supports text annotation and metadata changes)
router.post("/basic", upload.single("files"), async (req, res) => {
  try {
    const filePath = req.file.path;
    
    // Parse edit parameters
    const editType = req.body.editType || "metadata"; // "metadata", "text-replace" (annotation)
    const searchText = req.body.searchText || "";
    const replaceText = req.body.replaceText || "";
    const textYPosition = req.body.textYPosition || 100;
    const metadata = JSON.parse(req.body.metadata || "{}") || {};
    
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Apply edits based on type
    if (editType === "text-replace" && searchText) {
      // Add text annotation functionality
      console.log(`Text annotation requested: ${searchText} at position X=${replaceText || 100}, Y=${textYPosition || 100}`);
      
      // Add the text annotation to all pages
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont('Helvetica-Bold');
      
      // Add the text annotation to each page
      pages.forEach(page => {
        const x = parseInt(replaceText) || 100; // Use provided X position or default to 100
        const y = parseInt(textYPosition) || 100; // Use provided Y position or default to 100
        page.drawText(searchText, {
          x: x,
          y: y, // Use the configurable Y position
          size: 14,
          font,
          color: rgb(0, 0, 0), // Black color for text
        });
      });
    }
    
    // Update metadata if provided
    if (Object.keys(metadata).length > 0) {
      if (metadata.title) pdfDoc.setTitle(metadata.title);
      if (metadata.author) pdfDoc.setAuthor(metadata.author);
      if (metadata.subject) pdfDoc.setSubject(metadata.subject);
      if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords.split(","));
      if (metadata.creator) pdfDoc.setCreator(metadata.creator);
      if (metadata.producer) pdfDoc.setProducer(metadata.producer);
    }
    
    const editedPdf = await pdfDoc.save();
    fs.unlinkSync(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=edited.pdf");
    res.send(Buffer.from(editedPdf));
  } catch (err) {
    console.error("Basic Edit PDF Error:", err);
    res.status(500).json({ message: "Basic edit PDF failed", error: err.message });
  }
});

module.exports = router;