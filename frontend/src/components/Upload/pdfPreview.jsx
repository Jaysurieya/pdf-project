import { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import pdfjsLib from "../../utils/pdfjs";

const SIGN_WIDTH = 150;
const SIGN_HEIGHT = 60;

export default function PdfPreview({
  file,
  selectedPage,
  setSelectedPage,
  signatureData,
  onPlacement
}) {
  const [pages, setPages] = useState([]);
  const pageImgRef = useRef(null);
  const sigNodeRef = useRef(null); // 🔥 REQUIRED

  // reset pages on file change
  useEffect(() => {
    setPages([]);
  }, [file]);

  // load PDF
  useEffect(() => {
    if (!file || !(file instanceof File)) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const pdf = await pdfjsLib
          .getDocument({ data: new Uint8Array(reader.result) })
          .promise;

        const imgs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
          imgs.push(canvas.toDataURL());
        }

        setPages(imgs);
      } catch (err) {
        console.error("PDF render error:", err);
      }
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  // calculate placement
  const updatePlacement = () => {
    if (!sigNodeRef.current || !pageImgRef.current) return;

    const sigRect = sigNodeRef.current.getBoundingClientRect();
    const pageRect = pageImgRef.current.getBoundingClientRect();

    const x = sigRect.left - pageRect.left;
    const y = sigRect.top - pageRect.top;

    onPlacement({
      page: selectedPage,
      xPercent: x / pageRect.width,
      yPercent: y / pageRect.height,
      widthPercent: SIGN_WIDTH / pageRect.width,
      heightPercent: SIGN_HEIGHT / pageRect.height
    });
  };

  // ensure placement after save
  useEffect(() => {
    if (signatureData && pages[selectedPage]) {
      setTimeout(updatePlacement, 0);
    }
  }, [signatureData, selectedPage, pages]);

  return (
    <div className="flex gap-4">
      {/* PDF PAGE */}
      <div className="flex-1 border relative min-h-[500px]">
        {pages[selectedPage] ? (
          <div className="relative">
            <img
              ref={pageImgRef}
              src={pages[selectedPage]}
              className="w-full select-none"
              draggable={false}
            />

            {/* SIGNATURE */}
            {signatureData && (
              <Draggable
                nodeRef={sigNodeRef}   // 🔥 FIX
                bounds="parent"
                defaultPosition={{ x: 50, y: 50 }}
                onDrag={updatePlacement}
                onStop={updatePlacement}
              >
                <img
                  ref={sigNodeRef}     // 🔥 SAME REF
                  src={signatureData}
                  alt="signature"
                  style={{
                    width: SIGN_WIDTH,
                    height: SIGN_HEIGHT,
                    cursor: "move",
                    position: "absolute",
                    zIndex: 20
                  }}
                />
              </Draggable>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading PDF preview…
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      <div className="w-32 overflow-y-auto">
        {pages.map((p, i) => (
          <img
            key={i}
            src={p}
            onClick={() => setSelectedPage(i)}
            className={`mb-2 cursor-pointer border ${
              selectedPage === i ? "border-blue-500" : "border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
