const fs = require("fs");

const mergePdf = require("../Services/Organize_pdf/mergePdf.service");
const splitPdf = require("../Services/Organize_pdf/splitPdf.service");
const removePages = require("../Services/Organize_pdf/removePages.service");
const organizePdf = require("../Services/Organize_pdf/organizePdf.service");
const scanToPdf = require("../Services/Organize_pdf/scanToPdf.service");

exports.organizePdf = async (req, res) => {
  console.log("==== ORGANIZE PDF API HIT ====");
  console.log("QUERY:", req.query);
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const tool = req.body.tool;
  const files = req.files;

  if (!tool) {
    return res.status(400).json({ error: "Tool type missing" });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  let outputPath;

  // Map tool keys to operation types
  const toolToTypeMap = {
    merge_pdf: "merge",
    split_pdf: "split",
    remove_pages: "remove",
    organize_pdf: "organize",
    scan_to_pdf: "scan"
  };

  const type = toolToTypeMap[tool];

  if (!type) {
    return res.status(400).json({ error: "Invalid tool type" });
  }

  try {
    switch (type) {
      case "merge":
        outputPath = await mergePdf(files);
        break;

      case "split":
        outputPath = await splitPdf(files[0].path, req.body.pages);
        break;

      case "remove":
        outputPath = await removePages(files[0].path, req.body.pages);
        break;

      case "organize":
        outputPath = await organizePdf(files[0].path, req.body.order);
        break;

      case "scan":
        outputPath = await scanToPdf(files);
        break;

      default:
        return res.status(400).json({ error: "Invalid organize type" });
    }

    res.download(outputPath, () => {
      try {
        files.forEach(f => fs.unlinkSync(f.path));
        fs.unlinkSync(outputPath);
      } catch (err) {
        console.warn("Cleanup warning:", err.message);
      }
    });

  } catch (err) {
    console.error("🔥 ORGANIZE ERROR:", err);
    res.status(500).json({
      error: "PDF operation failed",
      message: err.message,
    });
  }
};
