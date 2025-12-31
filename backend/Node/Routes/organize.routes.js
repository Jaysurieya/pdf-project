const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload.middleware");
const { organizePdf } = require("../Controllers/organize.controller");

// Use the upload middleware that handles both files and body fields
router.post("/org", upload, organizePdf);

module.exports = router;
