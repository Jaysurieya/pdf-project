import { useEffect, useState, useRef } from "react";
import pdfjsLib from "../../utils/pdfjs";
import { jsPDF } from "jspdf";
import RedactionBox from "./RedactionBox";

export default function RedactPdfPreview({ file }) {
  const [pages, setPages] = useState([]);
  const [textItems, setTextItems] = useState([]);
  const [rects, setRects] = useState([]);
  const [activeRect, setActiveRect] = useState(null);
  const [pageSizes, setPageSizes] = useState([]);

  const canvasRefs = useRef([]);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const pdf = await pdfjsLib
        .getDocument({ data: new Uint8Array(reader.result) })
        .promise;

      const pageImages = [];
      const extractedItems = [];
      const sizes = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        sizes.push({ width: viewport.width, height: viewport.height });

        // Render page
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        pageImages.push(canvas.toDataURL());

        // TEXT EXTRACTION WITH CORRECT TRANSFORM
        const text = await page.getTextContent();

        text.items.forEach((t) => {
          const transform = pdfjsLib.Util.transform(viewport.transform, t.transform);

          const x = transform[4];
          const y = transform[5] - (t.height * viewport.scale);

          extractedItems.push({
            page: pageNum - 1,
            text: t.str,
            x,
            y,
            width: t.width * viewport.scale,
            height: t.height * viewport.scale
          });
        });
      }

      setPages(pageImages);
      setTextItems(extractedItems);
      setPageSizes(sizes);
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  // SEARCH → SET RECTS
  const handleSearch = (query) => {
    if (!query) return setRects([]);

    const matches = textItems.filter((t) =>
      t.text.toLowerCase().includes(query.toLowerCase())
    );

    const newRects = matches.map((m) => ({
      id: Math.random(),
      page: m.page,
      x: m.x,
      y: m.y,
      width: m.width,
      height: m.height
    }));

    setRects(newRects);
  };

  // BLACKOUT REDACTION
  const applyRedaction = () => {
    rects.forEach((r) => {
      const canvas = canvasRefs.current[r.page];
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "black";
      ctx.fillRect(r.x, r.y, r.width, r.height);
    });

    alert("Redaction Applied!");
  };

  // DOWNLOAD
  const downloadRedactedPdf = () => {
    const pdf = new jsPDF("p", "px", [800, 1100]);

    canvasRefs.current.forEach((canvas, idx) => {
      const img = canvas.toDataURL("image/png");
      if (idx > 0) pdf.addPage();
      pdf.addImage(img, "PNG", 0, 0, 800, 1100);
    });

    pdf.save("redacted.pdf");
  };

  // SERVER EXPORT
  const sendToBackend = async () => {
    const fd = new FormData();

    canvasRefs.current.forEach((canvas) => {
      const png = canvas.toDataURL("image/png");
      const byteStr = atob(png.split(",")[1]);
      const arr = [];
      for (let i = 0; i < byteStr.length; i++) arr.push(byteStr.charCodeAt(i));
      fd.append("pages", new Blob([new Uint8Array(arr)], { type: "image/png" }));
    });

    const res = await fetch("http://localhost:5000/api/security/redact", {
      method: "POST",
      body: fd
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "redacted.pdf";
    a.click();
  };

  return (
    <div className="p-4">

      <input
        type="text"
        placeholder="Search text to redact"
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div className="mb-4 flex gap-3">
        <button onClick={applyRedaction} className="bg-red-600 text-white px-4 py-2 rounded">
          Apply Redaction
        </button>
        <button onClick={downloadRedactedPdf} className="bg-green-600 text-white px-4 py-2 rounded">
          Download Redacted PDF
        </button>
        <button onClick={sendToBackend} className="bg-purple-600 text-white px-4 py-2 rounded">
          Generate Final Redacted PDF (Backend)
        </button>
      </div>

      {pages.map((page, index) => (
        <div key={index} className="relative mt-4">

          <canvas
            ref={(el) => (canvasRefs.current[index] = el)}
            width={pageSizes[index]?.width}
            height={pageSizes[index]?.height}
          />

          <img
            src={page}
            onLoad={(e) => {
              const canvas = canvasRefs.current[index];
              const ctx = canvas.getContext("2d");
              ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
            }}
            style={{ display: "none" }}
          />

          {rects
            .filter((r) => r.page === index)
            .map((r) => (
              <RedactionBox
                key={r.id}
                rect={r}
                selected={activeRect === r.id}
                onSelect={(id) => setActiveRect(id)}
                onChange={(id, updated) => {
                  if (!updated) return setRects(prev => prev.filter(x => x.id !== id));
                  setRects(prev => prev.map(x => x.id === id ? updated : x));
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
