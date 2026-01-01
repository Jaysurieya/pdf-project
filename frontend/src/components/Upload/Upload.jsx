import { useParams } from "react-router-dom";
import { useState } from "react";
import { TOOLS } from "../../lib/tools";

function Upload() {
  const { tool } = useParams(); // word-to-pdf

  // Get the tool configuration from TOOLS
  const config = TOOLS[tool];

  // If tool doesn't exist in config, show an error
  if (!config) {
    return (
      <div className="tool-page min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Tool Not Found</h1>
          <p className="text-gray-600">The requested tool "{tool}" does not exist.</p>
        </div>
      </div>
    );
  }

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");


  // handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // MAIN BUTTON CLICK LOGIC
  const handleProcess = async () => {

    if (files.length === 0) {
      alert("Please add file");
      return;
    }
    if (
      (config.toolKey === "protect_pdf" || config.toolKey === "unlock_pdf") &&
      !password
    ) {
      alert("Please enter the PDF password");
      return;
    }



    setLoading(true);

    const formData = new FormData();
    formData.append("tool", config.toolKey);


    if (config.toolKey === "protect_pdf" || config.toolKey === "unlock_pdf") {
      formData.append("password", password);
    }


    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(
        `http://localhost:5000${config.backendRoute}`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!res.ok) {
        let errorMessage = "Processing failed";

        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          
        }

        throw new Error(errorMessage);
      }


      const blob = await res.blob();

      // download result
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Set appropriate download filename based on tool
      let filename = "result";
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
        case "protect_pdf":
          filename = "protected.pdf";
          break;
        default:
          filename = "result.pdf";
      }

      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      if (config.toolKey === "protect_pdf") {
        setPassword("");
      }


    } catch (err) {
      console.error("Processing error:", err);
      alert(`Processing failed: ${err.message || "An unknown error occurred"}`);
    }

    setLoading(false);
  };

  return (
    <div className="tool-page min-h-screen bg-white text-black p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{config.title}</h1>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select File(s)
            </label>
            <input
              type="file"
              accept={config.accept}
              multiple={config.multiple}
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Accepted formats: {config.accept.replace(/\./g, '').replace(/,/g, ', ')}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Selected Files:</h3>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600 bg-white p-2 rounded border">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(config.toolKey === "protect_pdf" || config.toolKey === "unlock_pdf") && (
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Set PDF Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter password"
              />
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleProcess}
              disabled={loading || files.length === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${loading || files.length === 0
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
