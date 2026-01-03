const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFiles = require("../Middleware/upload.middleware");
const fs = require("fs");

const comparePdf = require("../Services/Convert_from_pdf/pdfCompare.service");
const unlockPdf = require("../Services/Convert_from_pdf/pdfUnlock.service");
const pdfProtect = require("../Services/Convert_from_pdf/pdfProtect.service");

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


module.exports = router;
