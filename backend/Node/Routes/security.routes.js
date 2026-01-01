const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFiles = require("../Middleware/upload.middleware");

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



module.exports = router;
