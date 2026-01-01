const fs = require("fs");

const jpgToPdf = require("../Services/Convert_pdf/jpgToPdf.service");
const officeToPdf = require("../Services/Convert_pdf/officeToPdf.service");
const htmlToPdf = require("../Services/Convert_pdf/htmlToPdf.service");

const pdfToJpg = require("../Services/Convert_from_pdf/pdfToJpg.service");
//const pdfToWord = require("../Services/Convert_from_pdf/pdfToWord.service");
const pdfToExcel = require("../Services/Convert_from_pdf/pdfToExcel.service");
//const pdfToPdfA = require("../Services/Convert_from_pdf/pdfToPdfA.service");

//PDF SECURITY
const pdfProtect = require("../Services/Convert_from_pdf/pdfProtect.service");
const unlockPdf = require("../Services/Convert_from_pdf/pdfUnlock.service");

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

exports.convertFromPdf = async (req, res) => {
  const type = req.query.type; // jpg | word | excel | pdfa
  const file = req.files?.[0];

  if (!type) return res.status(400).json({ error: "Conversion type missing" });
  if (!file) return res.status(400).json({ error: "No PDF uploaded" });

  let outputPath;
  try {
    switch (type) {
      case "jpg":
        outputPath = await pdfToJpg(file.path);
        break;

      /* case "word":
        outputPath = await pdfToWord(file.path);
        break;  */

      case "excel":
        outputPath = await pdfToExcel(file.path);
        break;

      /* case "pdfa":
        outputPath = await pdfToPdfA(file.path);
        break; */

      case "protect":
        const password = req.body.password;
        if (!password) {
          return res.status(400).json({ error: "Password required" });
        }
        outputPath = await pdfProtect(file.path, password);
        break;

     case "unlock": {   // ✅ MATCH FRONTEND
        const password = req.body.password;
        if (!password) {
          return res.status(400).json({ error: "Password required" });
        }
        outputPath = await unlockPdf(file.path, password);
        break;
      }
      
      default:
        return res.status(400).json({ error: "Invalid conversion type" });
    }
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
    res.status(500).json({ error: "PDF conversion failed", message: err.message });
  }
};