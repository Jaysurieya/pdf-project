const express = require("express");
const router = express.Router();
const uploadFiles = require("../Middleware/upload.middleware");
const { convertToPdf } = require("../Controllers/convert.controller");
const { convertFromPdf } = require("../Controllers/convert.controller");
const { generateScanSession, mobileScanUpload, sessionImagesCount, scanToPdf } = require("../Controllers/convert.controller");
const { uploadMemory } = require("../Middleware/upload.middleware");


router.post("/to-pdf", uploadFiles, convertToPdf);
router.post("/from-pdf/:type", uploadFiles, convertFromPdf);

// Scan to PDF routes
router.post("/generate-scan-session", generateScanSession);
router.post("/mobile-scan-upload", uploadMemory.array("image", 10), mobileScanUpload);
router.get("/session-images-count", sessionImagesCount);
router.post("/scan-to-pdf", scanToPdf);

module.exports = router;
