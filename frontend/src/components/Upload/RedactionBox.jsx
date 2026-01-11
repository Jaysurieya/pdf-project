import { useState, useRef } from "react";

export default function RedactionBox({ rect, onChange, onSelect, selected }) {
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState(null);

  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.stopPropagation();

    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    onSelect(rect.id);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizeDir(null);
  };

  const handleDrag = (e) => {
    if (!selected || !isDragging || resizeDir) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    startPos.current = { x: e.clientX, y: e.clientY };

    onChange(rect.id, {
      ...rect,
      x: rect.x + dx,
      y: rect.y + dy
    });
  };

  const startResize = (e, dir) => {
    e.stopPropagation();
    setResizeDir(dir);

    startPos.current = { x: e.clientX, y: e.clientY };
    onSelect(rect.id);
  };

  const handleResize = (e) => {
    if (!resizeDir) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    startPos.current = { x: e.clientX, y: e.clientY };

    let newRect = { ...rect };

    // Horizontal resize logic
    if (resizeDir.includes("right")) newRect.width += dx;
    if (resizeDir.includes("left")) {
      newRect.width -= dx;
      newRect.x += dx;
    }

    // Vertical resize logic
    if (resizeDir.includes("bottom")) newRect.height += dy;
    if (resizeDir.includes("top")) {
      newRect.height -= dy;
      newRect.y += dy;
    }

    // Minimum size constraint
    newRect.width = Math.max(newRect.width, 10);
    newRect.height = Math.max(newRect.height, 10);

    onChange(rect.id, newRect);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        border: "2px solid red",
        background: "rgba(255, 0, 0, 0.3)",
        cursor: selected ? "move" : "pointer",
        zIndex: 1000
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => {
        handleDrag(e);
        handleResize(e);
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        onChange(rect.id, null); // delete rect
      }}
    >
      {/* Resize handles (8 directions) */}
      {selected && (
        <>
          {[
            "top-left",
            "top",
            "top-right",
            "left",
            "right",
            "bottom-left",
            "bottom",
            "bottom-right"
          ].map((dir) => (
            <div
              key={dir}
              onMouseDown={(e) => startResize(e, dir)}
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                background: "white",
                border: "2px solid red",
                cursor: `${dir}-resize`,
                ...(dir.includes("top") && { top: -6 }),
                ...(dir.includes("bottom") && { bottom: -6 }),
                ...(dir.includes("left") && { left: -6 }),
                ...(dir.includes("right") && { right: -6 }),
                ...(dir === "top" && { left: "50%", transform: "translateX(-50%)" }),
                ...(dir === "bottom" && { left: "50%", transform: "translateX(-50%)" }),
                ...(dir === "left" && { top: "50%", transform: "translateY(-50%)" }),
                ...(dir === "right" && { top: "50%", transform: "translateY(-50%)" })
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
