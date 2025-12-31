// toolsConfig.js
export const TOOLS = {
  // ======================
  // ORGANIZE PDF
  // ======================
  "merge-pdf": {
    title: "Merge PDF",
    accept: ".pdf",
    multiple: true,
    toolKey: "merge_pdf",
    backendRoute: "/api/organize/merge"
  },
  "split-pdf": {
    title: "Split PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "split_pdf",
    backendRoute: "/api/organize/split"
  },
  "extract-pages": {
    title: "Extract Pages",
    accept: ".pdf",
    multiple: false,
    toolKey: "extract_pages",
    backendRoute: "/api/organize/extract"
  },
  "organize-pdf": {
    title: "Organize PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "organize_pdf",
    backendRoute: "/api/organize/reorder"
  },
  "scan-to-pdf": {
    title: "Scan to PDF",
    accept: ".jpg,.jpeg,.png",
    multiple: true,
    toolKey: "scan_to_pdf",
    backendRoute: "/api/organize/scan-to-pdf"
  },
  "remove-pages": {
    title: "Remove Pages",
    accept: ".pdf",
    multiple: false,
    toolKey: "remove_pages",
    backendRoute: "/api/organize/remove"
  },

  // ======================
  // OPTIMIZE PDF
  // ======================
  "compress-pdf": {
    title: "Compress PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "compress_pdf",
    backendRoute: "/api/optimize/compress"
  },
  "repair-pdf": {
    title: "Repair PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "repair_pdf",
    backendRoute: "/api/optimize/repair"
  },
  "ocr-pdf": {
    title: "OCR PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "ocr_pdf",
    backendRoute: "/api/optimize/ocr"
  },

  // ======================
  // CONVERT TO PDF
  // ======================
  "jpg-to-pdf": {
    title: "JPG to PDF",
    accept: ".jpg,.jpeg,.png",
    multiple: true,
    toolKey: "jpg_to_pdf",
    backendRoute: "/api/convert/to-pdf?type=jpg"
  },
  "word-to-pdf": {
    title: "Word to PDF",
    accept: ".doc,.docx",
    multiple: false,
    toolKey: "word_to_pdf",
    backendRoute: "/api/convert/to-pdf?type=word"
  },
  "excel-to-pdf": {
    title: "Excel to PDF",
    accept: ".xls,.xlsx",
    multiple: false,
    toolKey: "excel_to_pdf",
    backendRoute: "/api/convert/to-pdf?type=excel"
  },
  "html-to-pdf": {
    title: "HTML to PDF",
    accept: ".html,.htm",
    multiple: false,
    toolKey: "html_to_pdf",
    backendRoute: "/api/convert/to-pdf?type=html"
  },
  "powerpoint-to-pdf": {
    title: "PowerPoint to PDF",
    accept: ".ppt,.pptx",
    multiple: false,
    toolKey: "powerpoint_to_pdf",
    backendRoute: "/api/convert/to-pdf?type=ppt"
  },

  // ======================
  // CONVERT FROM PDF
  // ======================
  "pdf-to-jpg": {
    title: "PDF to JPG",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_jpg",
    backendRoute: "/api/convert/from-pdf?type=jpg"
  },
  "pdf-to-word": {
    title: "PDF to Word",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_word",
    backendRoute: "/api/convert/from-pdf?type=word"
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_excel",
    backendRoute: "/api/convert/from-pdf?type=excel"
  },
  "pdf-to-pdfa": {
    title: "PDF to PDF/A",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_pdfa",
    backendRoute: "/api/convert/from-pdf?type=pdfa"
  },

  // ======================
  // EDIT PDF
  // ======================
  "rotate-pdf": {
    title: "Rotate PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "rotate_pdf",
    backendRoute: "/api/edit/rotate"
  },
  "crop-pdf": {
    title: "Crop PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "crop_pdf",
    backendRoute: "/api/edit/crop"
  },
  "add-watermark": {
    title: "Add Watermark",
    accept: ".pdf",
    multiple: false,
    toolKey: "add_watermark",
    backendRoute: "/api/edit/watermark"
  },
  "edit-pdf": {
    title: "Edit PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "edit_pdf",
    backendRoute: "/api/edit/basic"
  },

  // ======================
  // PDF SECURITY
  // ======================
  "unlock-pdf": {
    title: "Unlock PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "unlock_pdf",
    backendRoute: "/api/security/unlock"
  },
  "protect-pdf": {
    title: "Protect PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "protect_pdf",
    backendRoute: "/api/security/protect"
  },
  "compare-pdf": {
    title: "Compare PDF",
    accept: ".pdf",
    multiple: true,
    toolKey: "compare_pdf",
    backendRoute: "/api/security/compare"
  },
  "sign-pdf": {
    title: "Sign PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "sign_pdf",
    backendRoute: "/api/security/sign"
  },
  "redact-pdf": {
    title: "Redact PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "redact_pdf",
    backendRoute: "/api/security/redact"
  }
};
