import { useEffect, useState,useRef } from "react";
import Draggable from "react-draggable";
import pdfjsLib from "../../utils/pdfjs";


export default function PdfPreview({
  file,
  selectedPage,
  setSelectedPage,
   selectedPages,
  signatureData,
  sigPos,
  setSigPos,
  setPageSize,
  setPageCount,
  currentPlacingPage,
  lockedPages  
}) {
  const [pages, setPages] = useState([]);
  const nodeRef = useRef(null);

useEffect(() => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const uint8Array = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

      setPageCount(pdf.numPages);

      // ✅ GET FIRST PAGE FOR SIZE REFERENCE
      const firstPage = await pdf.getPage(1);
      const firstViewport = firstPage.getViewport({ scale: 1.2 });

      setPageSize({
        canvasWidth: firstViewport.width,
        canvasHeight: firstViewport.height,
        pdfWidth: firstPage.view[2],
        pdfHeight: firstPage.view[3]
      });

      // ✅ RENDER ALL PAGES
      const imgs = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        imgs.push({
          img: canvas.toDataURL(),
          width: canvas.width,
          height: canvas.height
        });
      }

      setPages(imgs);
    } catch (err) {
      console.error("PDF render error:", err);
    }
  };

  reader.readAsArrayBuffer(file);
}, [file]);



  return (
    <div className="flex gap-4">
      <div className="flex-1 border relative">
        {pages[selectedPage] && (
          <div className="relative">
            <img src={pages[selectedPage].img} className="w-full" />
        {signatureData && selectedPages.includes(selectedPage) && (
  <Draggable
  nodeRef={nodeRef}
  bounds="parent"
  disabled={lockedPages?.[selectedPage]}
  position={sigPos[selectedPage] || { x: 50, y: 50 }}
  onStop={(e, data) =>
    setSigPos(prev => ({
      ...prev,
      [selectedPage]: { x: data.x, y: data.y }
    }))
  }
>

   <img
  ref={nodeRef}
  src={signatureData}
  style={{
    position: "absolute",
    width: 150,
    cursor: lockedPages?.[selectedPage] ? "default" : "move",
    opacity: lockedPages?.[selectedPage] ? 0.9 : 1
  }}
/>

  </Draggable>
)}





          </div>
        )}
      </div>

      <div className="w-32 overflow-y-auto">
        {pages.map((p, i) => (
          <img
            key={i}
            src={p.img}
            onClick={() => setSelectedPage(i)}
            className={`cursor-pointer mb-2 border ${
              selectedPage === i ? "border-blue-500" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
