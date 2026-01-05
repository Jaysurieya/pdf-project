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

  // Tool behavior detection
  const needsPages = tool === "remove-pages" || tool === "split-pdf";
  const needsOrder = tool === "organize-pdf";

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
