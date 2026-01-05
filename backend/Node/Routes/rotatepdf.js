const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { PDFDocument, degrees } = require("pdf-lib");

const router = express.Router();

const upload = multer({
  dest: path.join(process.cwd(), "tmp"),
});

router.post("/rotate", upload.single("files"), async (req, res) => {
  try {
    const angle = Number(req.body.angle);
    const filePath = req.file.path;

    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    pdfDoc.getPages().forEach((page) => {
      page.setRotation(degrees(angle));
    });

    const rotatedPdf = await pdfDoc.save();
    fs.unlinkSync(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=result.pdf"
    );

    res.send(Buffer.from(rotatedPdf));
  } catch (err) {
    console.error("Rotate PDF Error:", err);
    res.status(500).json({ message: "Rotate PDF failed" });
  }
});

module.exports = router;
