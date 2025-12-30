// toolsConfig.js
export const TOOLS = {
  // ORGANIZE PDF tools
  "merge-pdf": {
    title: "Merge PDF",
    accept: ".pdf",
    multiple: true,
    toolKey: "merge_pdf"
  },
  "split-pdf": {
    title: "Split PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "split_pdf"
  },
  "extract-pages": {
    title: "Extract Pages",
    accept: ".pdf",
    multiple: false,
    toolKey: "extract_pages"
  },
  "organize-pdf": {
    title: "Organize PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "organize_pdf"
  },
  "scan-to-pdf": {
    title: "Scan to PDF",
    accept: ".jpg,.jpeg,.png",
    multiple: true,
    toolKey: "scan_to_pdf"
  },
  "remove-pages": {
    title: "Remove Pages",
    accept: ".pdf",
    multiple: false,
    toolKey: "remove_pages"
  },
  
  // OPTIMIZE PDF tools
  "compress-pdf": {
    title: "Compress PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "compress_pdf"
  },
  "repair-pdf": {
    title: "Repair PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "repair_pdf"
  },
  "ocr-pdf": {
    title: "OCR PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "ocr_pdf"
  },
  
  // CONVERT TO PDF tools
  "jpg-to-pdf": {
    title: "JPG to PDF",
    accept: ".jpg,.jpeg,.png",
    multiple: true,
    toolKey: "jpg_to_pdf"
  },
  "word-to-pdf": {
    title: "Word to PDF",
    accept: ".doc,.docx",
    multiple: false,
    toolKey: "word_to_pdf"
  },
  "excel-to-pdf": {
    title: "Excel to PDF",
    accept: ".xls,.xlsx",
    multiple: false,
    toolKey: "excel_to_pdf"
  },
  "html-to-pdf": {
    title: "HTML to PDF",
    accept: ".html,.htm",
    multiple: false,
    toolKey: "html_to_pdf"
  },
  "powerpoint-to-pdf": {
    title: "PowerPoint to PDF",
    accept: ".ppt,.pptx",
    multiple: false,
    toolKey: "powerpoint_to_pdf"
  },
  
  // CONVERT FROM PDF tools
  "pdf-to-jpg": {
    title: "PDF to JPG",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_jpg"
  },
  "pdf-to-word": {
    title: "PDF to Word",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_word"
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_excel"
  },
  "pdf-to-pdfa": {
    title: "PDF to PDF/A",
    accept: ".pdf",
    multiple: false,
    toolKey: "pdf_to_pd_fa"
  },
  
  // EDIT PDF tools
  "rotate-pdf": {
    title: "Rotate PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "rotate_pdf"
  },
  "crop-pdf": {
    title: "Crop PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "crop_pdf"
  },
  "add-watermark": {
    title: "Add Watermark",
    accept: ".pdf",
    multiple: false,
    toolKey: "add_watermark"
  },
  "edit-pdf": {
    title: "Edit PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "edit_pdf"
  },
  
  // PDF SECURITY tools
  "unlock-pdf": {
    title: "Unlock PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "unlock_pdf"
  },
  "protect-pdf": {
    title: "Protect PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "protect_pdf"
  },
  "compare-pdf": {
    title: "Compare PDF",
    accept: ".pdf",
    multiple: true,
    toolKey: "compare_pdf"
  },
  "sign-pdf": {
    title: "Sign PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "sign_pdf"
  },
  "redact-pdf": {
    title: "Redact PDF",
    accept: ".pdf",
    multiple: false,
    toolKey: "redact_pdf"
  }
};
