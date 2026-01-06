const fs = require("fs");
const path = require("path");
const os = require("os");
const archiver = require("archiver");
const { v4: randomUUID } = require("uuid");

const jpgToPdf = require("../Services/Convert_pdf/jpgToPdf.service");
const officeToPdf = require("../Services/Convert_pdf/officeToPdf.service");
const htmlToPdf = require("../Services/Convert_pdf/htmlToPdf.service");

const pdfToJpg = require("../Services/Convert_from_pdf/pdfToJpg.service");
const pdfToWord = require("../Services/Convert_from_pdf/pdfToWord.service");

// Session storage for scan-to-pdf
const scanSessions = new Map(); // In-memory storage: sessionId -> [imageBuffers]

// UUID for session IDs
const { v4: uuidv4 } = require('uuid');


exports.convertToPdf = async (req, res) => {
  console.log("==== CONVERT API HIT ====");
  console.log("QUERY:", req.query);
  console.log("FILES COUNT:", req.files?.length || 0);

  const type = req.query.type; // jpg | word | excel | ppt | html
  const file = req.files?.[0];

  if (!type) {
    return res.status(400).json({ error: "Conversion type missing" });
  }

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("INPUT FILE:", file.originalname);
  console.log("INPUT PATH:", file.path);

  let outputPath;

  try {
    switch (type) {
      case "jpg":
        outputPath = await jpgToPdf(file.path);
        break;

      case "word":
      case "excel":
      case "ppt":
        outputPath = await officeToPdf(file.path);
        break;

      case "html":
        outputPath = await htmlToPdf(file.path);
        break;

      default:
        return res.status(400).json({ error: "Invalid conversion type" });
    }

    console.log("OUTPUT FILE:", outputPath);

    res.download(outputPath, (err) => {
      if (err) {
        console.error("❌ Download error:", err);
      }

      // Safe cleanup
      try {
        fs.unlinkSync(file.path);
        fs.unlinkSync(outputPath);
      } catch (cleanupErr) {
        console.warn("⚠️ Cleanup warning:", cleanupErr.message);
      }
    });

  } catch (err) {
    console.error("🔥 CONVERSION ERROR:", err);

    res.status(500).json({
      error: "Conversion failed",
      message: err.message,
    });
  }
};


// exports.convertFromPdf = async (req, res) => {
//   console.log("==== PDF CONVERT API HIT ====");
//   console.log("ROUTE PARAM TYPE:", req.params.type);
//   console.log("FILES:", req.files);

//   const type = req.params.type;
//   const file = req.files?.[0];

//   // Validate request
//   if (!type) {
//     console.warn("⚠️ Missing conversion type");
//     return res.status(400).json({ error: "Conversion type missing" });
//   }
//   if (!file) {
//     console.warn("⚠️ No file received");
//     return res.status(400).json({ error: "No PDF uploaded" });
//   }

//   console.log("INPUT FILE NAME:", file.originalname);
//   console.log("INPUT FILE PATH:", file.path);

//   try {
//     if (type === "jpg") {
//   console.log("➡️ Calling PDF → JPG service...");
//   const result = await pdfToJpg(file.path);
//   console.log("🧠 Service returned:", result);

//   if (result.mode === "single") {
//     return res.download(result.path, (err) => {
//       if (err) console.error("❌ Download failed:", err);
//       try {
//         fs.unlinkSync(file.path);
//         fs.unlinkSync(result.path);
//         console.log("🧹 Cleanup done for single JPG");
//       } catch (e) {
//         console.warn("⚠️ Cleanup warning:", e.message);
//       }
//     });
//   }

//   if (result.mode === "multiple") {
//     const zipPath = path.join(os.tmpdir(), `pdf-images-${randomUUID()}.zip`);
//     console.log("📦 Zipping images to:", zipPath);

//     const archive = archiver("zip");
//     const stream = fs.createWriteStream(zipPath);
//     archive.pipe(stream);

//     result.files.forEach(img => {
//       archive.file(img, { name: path.basename(img) });
//     });

//     await archive.finalize();

//     stream.on("close", () => {
//       res.download(zipPath, (err) => {
//         if (err) console.error("❌ ZIP download error:", err);
//         try {
//           fs.unlinkSync(file.path);
//           fs.unlinkSync(zipPath);
//           result.files.forEach(f => fs.unlinkSync(f));
//           console.log("🧹 Cleanup done for ZIP + images");
//         } catch (e) {
//           console.warn("⚠️ Cleanup warning:", e.message);
//         }
//       });
//     });
//   }
// }


//     else if (type === "word") {
//       console.log("➡️ Calling Word conversion service...");
//       const wordPath = await pdfToWord(file.path);
//       console.log("✅ Word file created at:", wordPath);

//       res.download(wordPath, err => {
//         if (err) console.error("❌ Download failed:", err);

//         // Cleanup
//         try {
//           fs.unlinkSync(file.path);
//           fs.unlinkSync(wordPath);
//           console.log("🧹 Cleanup done");
//         } catch (e) {
//           console.warn("⚠️ Cleanup issue:", e.message);
//         }
//       });
//     }

//     else {
//       console.warn("⚠️ Unsupported type:", type);
//       return res.status(400).json({ error: "Invalid conversion type" });
//     }

//   } catch (err) {
//     console.error("🔥 SERVICE ERROR:", err);
//     console.error("📌 ERROR MSG:", err.message);
//     res.status(500).json({
//       error: "Conversion service failed",
//       message: err.message,
//       stack: err.stack // for deep debugging
//     });
//   }
// };

exports.convertFromPdf = async (req, res) => { 
  console.log("==== PDF CONVERT API HIT ====");
  console.log("ROUTE PARAM TYPE:", req.params.type);
  console.log("FILES:", req.files);

  const type = req.params.type;
  const file = req.files?.[0];

  if (!type) return res.status(400).json({ error: "Conversion type missing" });
  if (!file) return res.status(400).json({ error: "No PDF uploaded" });

  console.log("INPUT FILE NAME:", file.originalname);
  console.log("INPUT FILE PATH:", file.path);

  try {
    if (type === "jpg") {
      console.log("➡️ Calling PDF → JPG service...");
      const result = await pdfToJpg(file.path);

      // Single JPG download
      if (result.mode === "single") {
        return res.download(result.path, (err) => {
          if (err) console.error("❌ Download failed:", err);
          try {
            fs.unlinkSync(file.path);
            fs.unlinkSync(result.path);
          } catch (e) {}
        });
      }

      // Multiple pages ZIP download
      if (result.mode === "multiple") {
        return res.download(result.zip, (err) => {
          if (err) console.error("❌ ZIP Download failed:", err);
          try {
            fs.unlinkSync(file.path);
            result.files.forEach(f => fs.unlinkSync(f));
            fs.unlinkSync(result.zip);
          } catch (e) {}
        });
      }
    }

    // PDF → Word download
    else if (type === "word") {
      console.log("➡️ Calling Word conversion service...");
      const wordPath = await pdfToWord(file.path);
      console.log("✅ Word ready:", wordPath);

      return res.download(wordPath, (err) => {
        if (err) console.error("❌ Download failed:", err);
        try {
          fs.unlinkSync(file.path);
          fs.unlinkSync(wordPath);
        } catch (e) {}
      });
    }

    else {
      return res.status(400).json({ error: "Invalid conversion type" });
    }

  } catch (err) {
    console.error("🔥 SERVICE ERROR:", err);
    res.status(500).json({ error: "Conversion service failed", message: err.message, stack: err.stack });
  }
};


// Generate new scan session
exports.generateScanSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    // Initialize empty array for this session
    scanSessions.set(sessionId, []);
    
    const uploadUrl = `http://localhost:5000/api/convert/mobile-scan-upload?sessionId=${sessionId}`;
    
    console.log(`📱 New scan session created: ${sessionId}`);
    
    res.status(200).json({
      sessionId,
      uploadUrl
    });
  } catch (err) {
    console.error("🔥 Session generation error:", err);
    res.status(500).json({
      error: "Failed to generate scan session",
      message: err.message
    });
  }
};


// Handle mobile image uploads
exports.mobileScanUpload = async (req, res) => {
  try {
    const sessionId = req.body.sessionId || req.query.sessionId;
    
    if (!sessionId) {
      console.log("❌ Session ID missing in mobile upload");
      return res.status(400).json({
        error: "Session ID is required"
      });
    }
    
    if (!req.files || req.files.length === 0) {
      console.log("❌ No image files received in mobile upload");
      return res.status(400).json({
        error: "No image files uploaded"
      });
    }
    
    const sessionImages = scanSessions.get(sessionId);
    if (!sessionImages) {
      console.log(`❌ Session not found: ${sessionId}`);
      return res.status(404).json({
        error: "Session not found or expired"
      });
    }
    
    // Add image buffers to session
    for (const file of req.files) {
      sessionImages.push({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
      
      console.log(`📱 Image added to session ${sessionId}: ${file.originalname}, size: ${file.size} bytes`);
    }
    
    res.status(200).json({
      message: "Images uploaded successfully",
      count: req.files.length,
      totalInSession: sessionImages.length
    });
    
  } catch (err) {
    console.error("🔥 Mobile upload error:", err);
    res.status(500).json({
      error: "Failed to upload images",
      message: err.message
    });
  }
};


// Get count of images in session
exports.sessionImagesCount = async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({
        error: "Session ID is required"
      });
    }
    
    const sessionImages = scanSessions.get(sessionId);
    if (!sessionImages) {
      console.log(`❌ Session not found for count: ${sessionId}`);
      return res.status(404).json({
        error: "Session not found or expired",
        count: 0
      });
    }
    
    res.status(200).json({
      count: sessionImages.length
    });
    
  } catch (err) {
    console.error("🔥 Session count error:", err);
    res.status(500).json({
      error: "Failed to get session count",
      message: err.message,
      count: 0
    });
  }
};


// Convert scanned images to PDF
exports.scanToPdf = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      console.log("❌ Session ID missing in PDF conversion");
      return res.status(400).json({
        error: "Session ID is required"
      });
    }
    
    const sessionImages = scanSessions.get(sessionId);
    if (!sessionImages || sessionImages.length === 0) {
      console.log(`❌ No images found for session: ${sessionId}`);
      return res.status(404).json({
        error: "No images found for this session"
      });
    }
    
    console.log(`📱 Converting ${sessionImages.length} images to PDF for session: ${sessionId}`);
    
    // Import PDF creation function
    const createPdfFromImages = require("../Services/Organize_pdf/scanToPdf.service");
    
    // Create temporary files from buffers
    const tempFiles = [];
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    
    for (const img of sessionImages) {
      const tempPath = path.join(os.tmpdir(), `scan_${Date.now()}_${img.originalname}`);
      fs.writeFileSync(tempPath, img.buffer);
      tempFiles.push({
        path: tempPath,
        mimetype: img.mimetype
      });
    }
    
    // Create PDF from temporary files
    const pdfPath = await createPdfFromImages(tempFiles);
    
    // Clean up temporary image files
    tempFiles.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.warn(`⚠️ Could not delete temp file: ${file.path}`, e.message);
      }
    });
    
    // Remove session from memory after PDF creation
    scanSessions.delete(sessionId);
    
    console.log(`✅ PDF created successfully for session: ${sessionId}, path: ${pdfPath}`);
    
    // Send PDF as response
    res.download(pdfPath, 'scanned.pdf', (err) => {
      if (err) {
        console.error("❌ PDF download error:", err);
      }
      
      // Clean up PDF file after download
      try {
        fs.unlinkSync(pdfPath);
        console.log(`🧹 Cleaned up PDF file: ${pdfPath}`);
      } catch (cleanupErr) {
        console.warn("⚠️ PDF cleanup warning:", cleanupErr.message);
      }
    });
    
  } catch (err) {
    console.error("🔥 PDF conversion error:", err);
    res.status(500).json({
      error: "Failed to create PDF",
      message: err.message
    });
  }
};