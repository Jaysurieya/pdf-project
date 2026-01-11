const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFiles = require("../Middleware/upload.middleware");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const { PDFDocument } = require("pdf-lib");
const uploadRedact = multer({ storage: multer.memoryStorage() });

const comparePdf = require("../Services/Convert_from_pdf/pdfCompare.service");
const unlockPdf = require("../Services/Convert_from_pdf/pdfUnlock.service");
const pdfProtect = require("../Services/Convert_from_pdf/pdfProtect.service");
const signPdf = require("../Services/Convert_from_pdf/signPdf.service");

router.post("/protect", uploadFiles, async (req, res) => {
  try {
    const file = req.files?.[0];
    const { password } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const outputPath = await pdfProtect(file.path, password);

    res.download(outputPath, () => {
      require("fs").unlinkSync(file.path);
      require("fs").unlinkSync(outputPath);
    });

  } catch (err) {
    console.error("PDF Protect Error:", err);
    res.status(500).json({ error: "Failed to protect PDF" });
  }
});
router.post("/unlock", uploadFiles, async (req, res) => {
  try {
    const { password } = req.body;
    const file = req.files?.[0]; // ✅ FIX

    if (!file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const unlockedPath = await unlockPdf(file.path, password);

    res.download(unlockedPath, "unlocked.pdf", () => {
      const fs = require("fs");
      fs.unlinkSync(file.path);
      fs.unlinkSync(unlockedPath);
    });

  } catch (err) {
  console.error("❌ Unlock error:", err.message);

  if (err.message === "WRONG_PASSWORD") {
    return res.status(400).json({ message: "Incorrect PDF password" });
  }

  res.status(500).json({ message: "Failed to unlock PDF" });
}

});

router.post("/compare", uploadFiles, async (req, res) => {
  try {
    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({ message: "Upload exactly 2 PDF files" });
    }

    const [file1, file2] = req.files;

    const result = await comparePdf(file1.path, file2.path);

    fs.unlinkSync(file1.path);
    fs.unlinkSync(file2.path);

    res.json(result); // 🔥 IMPORTANT
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF comparison failed" });
  }
});
router.post("/sign", upload.single("pdf"), async (req, res) => {
  try {
    const { signatureBase64, placements } = req.body;

    if (!req.file || !signatureBase64 || !placements) {
      return res.status(400).json({ message: "Missing data" });
    }

    const placementArr = JSON.parse(placements);

    // Read PDF
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Embed signature
    const signatureImage = await pdfDoc.embedPng(
      signatureBase64.replace(/^data:image\/png;base64,/, "")
    );

    const pages = pdfDoc.getPages();

    placementArr.forEach((p) => {
      const page = pages[p.page];
      if (!page) return;

      const { width, height } = page.getSize();

      const sigWidth = p.widthPercent * width;
      const sigHeight = p.heightPercent * height;

      const x = p.xPercent * width;
      const y = height - (p.yPercent * height) - sigHeight;

      page.drawImage(signatureImage, {
        x,
        y,
        width: sigWidth,
        height: sigHeight
      });
    });

    const signedPdf = await pdfDoc.save();

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=signed.pdf"
    });

    res.send(Buffer.from(signedPdf));
  } catch (err) {
    console.error("SIGN PDF ERROR:", err);
    res.status(500).json({ message: "Failed to sign PDF" });
  }
});

router.post("/redact", uploadRedact.array("pages"), async (req, res) => {
  try {
    const { PDFDocument } = require("pdf-lib");

    const pdfDoc = await PDFDocument.create();

    for (let file of req.files) {
      const imgBytes = file.buffer;

      const page = pdfDoc.addPage();
      const pngImage = await pdfDoc.embedPng(imgBytes);

      const { width, height } = pngImage.scale(1);

      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width,
        height
      });
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=redacted.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate redacted PDF" });
  }
});


module.exports = router;
