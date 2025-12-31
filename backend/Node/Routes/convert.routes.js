const express = require("express");
const router = express.Router();
const uploadFiles = require("../Middleware/upload.middleware");
const { convertToPdf } = require("../Controllers/convert.controller");

router.post("/to-pdf", uploadFiles, convertToPdf);
router.post("/from-pdf", uploadFiles, );

module.exports = router;
