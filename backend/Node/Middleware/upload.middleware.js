const multer = require("multer");
const os = require("os");
const path = require("path");

// Allowed file types (basic safety)
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".jpg",
  ".jpeg",
  ".png",
  ".html",
  ".htm"
];

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = os.tmpdir();
    console.log("📁 Upload destination:", tempDir);
    cb(null, tempDir);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    const finalName = `${Date.now()}-${safeName}`;
    console.log("📄 Saving file as:", finalName);
    cb(null, finalName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    console.error("❌ Blocked file type:", file.originalname);
    return cb(
      new Error(`Unsupported file type: ${ext}`),
      false
    );
  }

  console.log("✅ Accepted file:", file.originalname);
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
  },
});

// Debug wrapper middleware
const uploadFiles = (req, res, next) => {
  const uploader = upload.array("files");

  uploader(req, res, (err) => {
    if (err) {
      console.error("❌ Multer error:", err.message);
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    console.log("📦 Files received:", req.files?.length || 0);
    console.log("🧾 Body fields:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    next();
  });
};

module.exports = uploadFiles;
