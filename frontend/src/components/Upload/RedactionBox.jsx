import { useState, useRef } from "react";

export default function RedactionBox({ rect, onChange, onSelect, selected }) {
  const [dragging, setDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState(null);
  const start = useRef({ x: 0, y: 0 });

  // scale factors (screen → PDF coords)
  const scaleX = rect.scaleX || 1;
  const scaleY = rect.scaleY || 1;

  const mouseDown = (e) => {
    e.stopPropagation();
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    onSelect(rect.id);
  };

  const mouseUp = () => {
    setDragging(false);
    setResizeDir(null);
  };

  const mouseMove = (e) => {
    if (resizeDir) return resize(e);
    if (!dragging || !selected) return;

    const dxScreen = e.clientX - start.current.x;
    const dyScreen = e.clientY - start.current.y;

    start.current = { x: e.clientX, y: e.clientY };

    onChange(rect.id, {
      ...rect,
      x: rect.x + dxScreen,
      y: rect.y + dyScreen,
      realX: rect.realX + dxScreen / scaleX,
      realY: rect.realY + dyScreen / scaleY,
    });
  };

  const startResize = (e, dir) => {
    e.stopPropagation();
    setResizeDir(dir);
    start.current = { x: e.clientX, y: e.clientY };
  };

  const resize = (e) => {
    const dxScreen = e.clientX - start.current.x;
    const dyScreen = e.clientY - start.current.y;

    start.current = { x: e.clientX, y: e.clientY };

    let newX = rect.x;
    let newY = rect.y;
    let newW = rect.width;
    let newH = rect.height;

    let newRealX = rect.realX;
    let newRealY = rect.realY;
    let newRealW = rect.realWidth;
    let newRealH = rect.realHeight;

    if (resizeDir.includes("right")) {
      newW += dxScreen;
      newRealW += dxScreen / scaleX;
    }
    if (resizeDir.includes("left")) {
      newX += dxScreen;
      newW -= dxScreen;
      newRealX += dxScreen / scaleX;
      newRealW -= dxScreen / scaleX;
    }
    if (resizeDir.includes("bottom")) {
      newH += dyScreen;
      newRealH += dyScreen / scaleY;
    }
    if (resizeDir.includes("top")) {
      newY += dyScreen;
      newH -= dyScreen;
      newRealY += dyScreen / scaleY;
      newRealH -= dyScreen / scaleY;
    }

    if (newW < 10) newW = 10;
    if (newH < 10) newH = 10;

    onChange(rect.id, {
      ...rect,
      x: newX,
      y: newY,
      width: newW,
      height: newH,
      realX: newRealX,
      realY: newRealY,
      realWidth: newRealW,
      realHeight: newRealH,
    });
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
        backgroundColor: "rgba(255,0,0,0.3)",
        cursor: "move",
        zIndex: 1000,
      }}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseLeave={mouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        onChange(rect.id, null);
      }}
    >
      {selected &&
        [
          "top-left",
          "top",
          "top-right",
          "left",
          "right",
          "bottom-left",
          "bottom",
          "bottom-right",
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
              ...(dir === "top" && {
                left: "50%",
                transform: "translateX(-50%)",
              }),
              ...(dir === "bottom" && {
                left: "50%",
                transform: "translateX(-50%)",
              }),
              ...(dir === "left" && {
                top: "50%",
                transform: "translateY(-50%)",
              }),
              ...(dir === "right" && {
                top: "50%",
                transform: "translateY(-50%)",
              }),
            }}
          />
        ))}
    </div>
  );
}
