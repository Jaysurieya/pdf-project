/* import { useEffect, useState, useRef } from "react";
import pdfjsLib from "../../utils/pdfjs";
import { jsPDF } from "jspdf";
import RedactionBox from "./RedactionBox";

export default function RedactPdfPreview({ file }) {
  const [pages, setPages] = useState([]);
  const [textItems, setTextItems] = useState([]);
  const [rects, setRects] = useState([]);
  const [activeRect, setActiveRect] = useState(null);
  const canvasRefs = useRef([]);

  // ----------------------------------------
  // LOAD PDF + TEXT EXTRACTION
  // ----------------------------------------
  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const pdf = await pdfjsLib
        .getDocument({ data: new Uint8Array(reader.result) })
        .promise;

      const pageImages = [];
      const extracted = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        pageImages.push(canvas.toDataURL());

        const textContent = await page.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false,
        });

        textContent.items.forEach((item) => {
          const t = pdfjsLib.Util.transform(viewport.transform, item.transform);

          const pdfX = t[4];
          const pdfY = t[5] - item.height;

          extracted.push({
            page: pageNum - 1,
            text: item.str,
            x: pdfX,
            y: viewport.height - pdfY,
            width: item.width * viewport.scale,
            height: item.height * viewport.scale,
          });
        });
      }

      setPages(pageImages);
      setTextItems(extracted);
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  // ----------------------------------------
  // GROUP LINES
  // ----------------------------------------
  const groupLines = (items) => {
    const lines = [];

    items.forEach((item) => {
      let line = lines.find(
        (l) => l.page === item.page && Math.abs(l.y - item.y) < item.height
      );

      if (line) line.items.push(item);
      else lines.push({ page: item.page, y: item.y, items: [item] });
    });

    lines.forEach((l) => l.items.sort((a, b) => a.x - b.x));
    return lines;
  };

  // ----------------------------------------
  // SEARCH WORD
  // ----------------------------------------
  const searchWord = (query) => {
    if (!query) return setRects([]);

    const lower = query.toLowerCase();
    const lines = groupLines(textItems);
    const results = [];

    lines.forEach((line) => {
      const chars = [];

      line.items.forEach((item) => {
        const charWidth = item.width / item.text.length;

        for (let i = 0; i < item.text.length; i++) {
          chars.push({
            page: item.page,
            char: item.text[i],
            x: item.x + i * charWidth,
            y: item.y,
            width: charWidth,
            height: item.height,
          });
        }
      });

      const text = chars.map((c) => c.char).join("").toLowerCase();
      let idx = text.indexOf(lower);

      while (idx !== -1) {
        const start = chars[idx];
        const end = chars[idx + lower.length - 1];

        results.push({
          id: Math.random(),
          page: start.page,
          x: start.x,
          y: start.y - start.height,
          width: end.x + end.width - start.x,
          height: start.height,
        });

        idx = text.indexOf(lower, idx + 1);
      }
    });

    setRects(results);
  };

  // ----------------------------------------
  // APPLY REDACTION TO CANVAS
  // ----------------------------------------
  const applyRedaction = () => {
    rects.forEach((r) => {
      const canvas = canvasRefs.current[r.page];
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      ctx.fillStyle = "black";
      ctx.fillRect(
        r.x * scaleX,
        r.y * scaleY,
        r.width * scaleX,
        r.height * scaleY
      );
    });

    alert("Redaction applied!");
  };

  // ----------------------------------------
  // DOWNLOAD PDF
  // ----------------------------------------
  const downloadPdf = () => {
    const pdf = new jsPDF("p", "px", [800, 1100]);

    canvasRefs.current.forEach((canvas, idx) => {
      const img = canvas.toDataURL("image/png");
      if (idx > 0) pdf.addPage();
      pdf.addImage(img, "PNG", 0, 0, 800, 1100);
    });

    pdf.save("redacted.pdf");
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search to redact..."
        onChange={(e) => searchWord(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div className="flex gap-4 mb-4">
        <button onClick={applyRedaction} className="bg-red-600 px-4 py-2 text-white">
          Apply Redaction
        </button>
        <button onClick={downloadPdf} className="bg-green-600 px-4 py-2 text-white">
          Download PDF
        </button>
      </div>

      {pages.map((page, index) => (
        <div key={index} className="relative mt-6">
          <canvas
            ref={(el) => (canvasRefs.current[index] = el)}
            width={1200}
            height={1600}
            style={{ width: "100%" }}
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
            .map((r) => {
              const canvas = canvasRefs.current[index];
              const rect = canvas?.getBoundingClientRect() || { width: 1, height: 1 };
              const scaleX = rect.width / canvas.width;
              const scaleY = rect.height / canvas.height;

              return (
                <RedactionBox
                  key={r.id}
                  rect={{
                    ...r,
                    x: r.x * scaleX,
                    y: r.y * scaleY,
                    width: r.width * scaleX,
                    height: r.height * scaleY,
                  }}
                  selected={activeRect === r.id}
                  onSelect={(id) => setActiveRect(id)}
                  onChange={(id, updated) => {
                    if (!updated)
                      return setRects((prev) => prev.filter((x) => x.id !== id));

                    setRects((prev) =>
                      prev.map((x) => (x.id === id ? updated : x))
                    );
                  }}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
}
 */

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
  // SEARCH → SET RECTS
const handleSearch = (query) => {
  if (!query) return setRects([]);

  const q = query.toLowerCase();
  const results = [];

  textItems.forEach((item) => {
    const text = item.text.toLowerCase();

    let index = text.indexOf(q);
    while (index !== -1) {
      const charWidth = item.width / item.text.length;

      const x = item.x + index * charWidth;
      const width = q.length * charWidth;

      results.push({
        id: Math.random(),
        page: item.page,
        x,
        y: item.y,
        width,
        height: item.height
      });

      index = text.indexOf(q, index + 1);
    }
  });

  setRects(results);
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