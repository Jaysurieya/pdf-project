import { useParams } from "react-router-dom";
import { useState } from "react";
import { TOOLS } from "../../lib/tools";

function Upload() {
  const { tool } = useParams();
  const config = TOOLS[tool];

  if (!config) {
    return (
      <div className="tool-page min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Tool Not Found
          </h1>
          <p className="text-gray-600">
            The requested tool "{tool}" does not exist.
          </p>
        </div>
      </div>
    );
  }

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Organize PDF states
  const [pagesInput, setPagesInput] = useState("");
  const [orderInput, setOrderInput] = useState("");

  // Rotate / option-based tools
  const [selectedOption, setSelectedOption] = useState(
    config.hasOptions ? config.options[0].value : null
  );

  // Watermark states
  const [watermarkText, setWatermarkText] = useState("WATERMARK");
  const [fontSize, setFontSize] = useState(30);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState("gray");
  const [position, setPosition] = useState("center");

  // Crop states
  const [cropLeft, setCropLeft] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);

  // Basic Edit states
  const [editType, setEditType] = useState("metadata");
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [textYPosition, setTextYPosition] = useState(100);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "",
    producer: ""
  });

  // Tool behavior detection
  const needsPages = tool === "remove-pages" || tool === "split-pdf";
  const needsOrder = tool === "organize-pdf";
  const needsWatermark = tool === "add-watermark";
  const needsCrop = tool === "crop-pdf";
  const needsEdit = tool === "edit-pdf";

  // FILE CHANGE
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (config.multiple) {
      setFiles((prev) => {
        const map = new Map(
          prev.map((f) => [`${f.name}-${f.size}`, f])
        );
        selectedFiles.forEach((f) =>
          map.set(`${f.name}-${f.size}`, f)
        );
        return Array.from(map.values());
      });
    } else {
      setFiles(selectedFiles.slice(0, 1));
    }

    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // MAIN PROCESS
  const handleProcess = async () => {
    if (files.length === 0) {
      alert("Please add file");
      return;
    }

    if (needsPages && !pagesInput.trim()) {
      alert("Please enter page numbers or range");
      return;
    }

    if (needsOrder && !orderInput.trim()) {
      alert("Please enter page order");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("tool", config.toolKey);

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (needsPages) {
      formData.append("pages", pagesInput);
    }

    if (needsOrder) {
      formData.append("order", orderInput);
    }

    if (config.hasOptions) {
      formData.append("angle", selectedOption);
    }

    if (needsWatermark) {
      formData.append("watermarkText", watermarkText);
      formData.append("fontSize", fontSize);
      formData.append("opacity", opacity);
      formData.append("color", color);
      formData.append("position", position);
    }

    if (needsCrop) {
      formData.append("left", cropLeft);
      formData.append("right", cropRight);
      formData.append("top", cropTop);
      formData.append("bottom", cropBottom);
    }

    if (needsEdit) {
      formData.append("editType", editType);
      formData.append("searchText", searchText);
      formData.append("replaceText", replaceText);
      formData.append("textYPosition", textYPosition);
      formData.append("metadata", JSON.stringify(metadata));
    }

    try {
      const res = await fetch(
        `http://localhost:3000${config.backendRoute}`,
        {
          method: "POST",
          body: formData,
        }
      );

      // 🔐 SAFE ERROR HANDLING (JSON OR BINARY)
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          throw new Error(errData.message || "Processing failed");
        }
        throw new Error(`Processing failed with status ${res.status}`);
      }

      // ✅ ALWAYS HANDLE AS BLOB (PDF / FILE)
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      let filename = "result.pdf";
      switch (config.toolKey) {
        case "word_to_pdf":
        case "excel_to_pdf":
        case "powerpoint_to_pdf":
        case "jpg_to_pdf":
        case "html_to_pdf":
          filename = "converted.pdf";
          break;
        case "pdf_to_word":
          filename = "converted.docx";
          break;
        case "pdf_to_excel":
          filename = "converted.xlsx";
          break;
        case "pdf_to_jpg":
          filename = "converted.jpg";
          break;
        default:
          filename = "result.pdf";
      }

      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Processing error:", err);
      alert(`Processing failed: ${err.message || "Unknown error"}`);
    }

    setLoading(false);
  };

  return (
    <div className="tool-page min-h-screen bg-white text-black p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {config.title}
        </h1>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          {/* FILE INPUT */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select File(s)
            </label>
            <input
              type="file"
              accept={config.accept}
              multiple={config.multiple}
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* OPTIONS (Rotate PDF) */}
          {config.hasOptions && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Select Option
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {config.options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PAGE INPUT */}
          {needsPages && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="e.g. 1,3,5 or 1-4"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* ORDER INPUT */}
          {needsOrder && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="e.g. 3,1,4,2"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* WATERMARK INPUT */}
          {needsWatermark && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter watermark text"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Font Size</label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="10"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Opacity</label>
                  <input
                    type="number"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0.1"
                    max="1"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="gray">Gray</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="black">Black</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="diagonal">Diagonal</option>
                    <option value="full-page-diagonal">Full Page Diagonal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CROP INPUT */}
          {needsCrop && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Left (points)</label>
                  <input
                    type="number"
                    value={cropLeft}
                    onChange={(e) => setCropLeft(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0"
                    step="1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Right (points)</label>
                  <input
                    type="number"
                    value={cropRight}
                    onChange={(e) => setCropRight(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Top (points)</label>
                  <input
                    type="number"
                    value={cropTop}
                    onChange={(e) => setCropTop(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0"
                    step="1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Bottom (points)</label>
                  <input
                    type="number"
                    value={cropBottom}
                    onChange={(e) => setCropBottom(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mt-2">
                <p>Note: 1 inch = 72 points. Enter the amount to crop from each edge.</p>
              </div>
            </div>
          )}

          {/* BASIC EDIT INPUT */}
          {needsEdit && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Edit Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="metadata">Metadata</option>
                  <option value="text-replace">Text Replace (Overlay)</option>
                </select>
              </div>
              
              {editType === "text-replace" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> This adds new text to the PDF. Enter the text to add and specify position coordinates.
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Text to Add</label>
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter text to add to the PDF"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Position X</label>
                      <input
                        type="number"
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="X coordinate"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Position Y</label>
                      <input
                        type="number"
                        value={textYPosition}
                        onChange={(e) => setTextYPosition(parseInt(e.target.value) || 100)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Y coordinate"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {editType === "metadata" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={metadata.title}
                      onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter document title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Author</label>
                    <input
                      type="text"
                      value={metadata.author}
                      onChange={(e) => setMetadata({...metadata, author: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter author name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={metadata.subject}
                      onChange={(e) => setMetadata({...metadata, subject: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Keywords</label>
                    <input
                      type="text"
                      value={metadata.keywords}
                      onChange={(e) => setMetadata({...metadata, keywords: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter keywords separated by commas"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Creator</label>
                      <input
                        type="text"
                        value={metadata.creator}
                        onChange={(e) => setMetadata({...metadata, creator: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Enter creator"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Producer</label>
                      <input
                        type="text"
                        value={metadata.producer}
                        onChange={(e) => setMetadata({...metadata, producer: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Enter producer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FILE LIST */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">
                Selected Files:
              </h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm bg-white p-2 rounded border"
                  >
                    <span>
                      {file.name} (
                      {(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PROCESS BUTTON */}
          <div className="flex justify-center">
            <button
              onClick={handleProcess}
              disabled={loading || files.length === 0}
              className={`px-6 py-3 rounded-lg font-medium ${
                loading || files.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Process"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
