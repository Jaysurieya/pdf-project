import { useEffect, useState, useRef } from "react";
import pdfjsLib from "../../utils/pdfjs";

const SIGN_WIDTH = 150;
const SIGN_HEIGHT = 60;

export default function PdfPreview({
  file,
  selectedPage,
  setSelectedPage,
  signatureData,
  onPlacement,
  placements = []
}) {
  const [pages, setPages] = useState([]);
  const [uiPositions, setUiPositions] = useState({});
  const [dragging, setDragging] = useState(false);

  const pageWrapperRef = useRef(null);
  const pageImgRef = useRef(null);

  // Load PDF
  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
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
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  // Default position per page
  useEffect(() => {
    if (signatureData && !uiPositions[selectedPage]) {
      setUiPositions(prev => ({
        ...prev,
        [selectedPage]: { x: 40, y: 40 }
      }));
    }
  }, [signatureData, selectedPage]);

  // Mouse move handler
  const onMouseMove = (e) => {
    if (!dragging || !pageImgRef.current) return;

    const rect = pageImgRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(e.clientX - rect.left - SIGN_WIDTH / 2, rect.width - SIGN_WIDTH)
    );
    const y = Math.max(
      0,
      Math.min(e.clientY - rect.top - SIGN_HEIGHT / 2, rect.height - SIGN_HEIGHT)
    );

    setUiPositions(prev => ({
      ...prev,
      [selectedPage]: { x, y }
    }));

    onPlacement({
      page: selectedPage,
      xPercent: x / rect.width,
      yPercent: y / rect.height,
      widthPercent: SIGN_WIDTH / rect.width,
      heightPercent: SIGN_HEIGHT / rect.height
    });
  };

  return (
    <div className="flex gap-4">
      {/* PDF PAGE */}
      <div
        className="flex-1 border flex justify-center"
        onMouseMove={onMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        {pages[selectedPage] && (
          <div ref={pageWrapperRef} className="relative">
            <img
              ref={pageImgRef}
              src={pages[selectedPage]}
              draggable={false}
              className="select-none"
            />

            {signatureData && uiPositions[selectedPage] && (
              <img
                src={signatureData}
                style={{
                  position: "absolute",
                  left: uiPositions[selectedPage].x,
                  top: uiPositions[selectedPage].y,
                  width: SIGN_WIDTH,
                  height: SIGN_HEIGHT,
                  cursor: "move",
                  zIndex: 1000
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                draggable={false}
              />
            )}
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      <div className="w-36 overflow-y-auto">
        {pages.map((p, i) => {
          const placed = placements.some(pl => pl.page === i);
          return (
            <div key={i} className="mb-2">
              <img
                src={p}
                onClick={() => setSelectedPage(i)}
                className={`cursor-pointer border ${
                  selectedPage === i
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              />
              <div className="text-xs text-center">
                Page {i + 1} {placed ? "✅ Signed" : "❌ Not signed"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
