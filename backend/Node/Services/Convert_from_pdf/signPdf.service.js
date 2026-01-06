const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

module.exports = async (
  pdfPath,
  signaturePath,
  placements,
  options
) => {
  console.log("PLACEMENTS:", placements);

  const pdfBytes = fs.readFileSync(pdfPath);
  const sigBytes = fs.readFileSync(signaturePath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pdfPages = pdfDoc.getPages();

  const signatureImage = await pdfDoc.embedPng(sigBytes);

  // debug
  console.log("[signPdf] received placements:", placements);
  console.log("[signPdf] options:", options);

  placements.forEach(({ page, x, y }) => {
    // tolerate 1-based page numbers by falling back to page-1
    let pdfPage = pdfPages[page];
    if (!pdfPage && typeof page === "number") {
      pdfPage = pdfPages[page - 1];
    }
    if (!pdfPage) return;

    const { width: pageW, height: pageH } = pdfPage.getSize();

    console.log(`[signPdf] page ${page} size ->`, { pageW, pageH });
    // try to get embedded image natural size if available
    try {
      console.log("[signPdf] signature image size (embed):", {
        imgWidth: signatureImage.width,
        imgHeight: signatureImage.height
      });
    } catch (e) {
      // ignore
    }

    // Coordinates from many frontends are given with origin at top-left.
    // PDF pages use bottom-left origin. Convert if `options.origin` === 'top-left'
    const isTopLeft = options && options.origin === "top-left";

    let drawX = x;
    let drawY = y;
    if (isTopLeft) {
      // convert top-left y -> bottom-left y
      drawY = pageH - y - (options.height || 0);
    }

    // 🛡️ Clamp safety
    const safeX = Math.max(0, Math.min(drawX, pageW - (options.width || 0)));
    const safeY = Math.max(0, Math.min(drawY, pageH - (options.height || 0)));

    console.log(`[signPdf] drawing on page ${page} at:`, {
      requested: { x: x, y: y },
      draw: { drawX, drawY },
      safe: { safeX, safeY },
      usedSize: { width: options.width, height: options.height }
    });

    pdfPage.drawImage(signatureImage, {
      x: safeX,
      y: safeY,
      width: options.width,
      height: options.height
    });
  });

  return await pdfDoc.save();
};
