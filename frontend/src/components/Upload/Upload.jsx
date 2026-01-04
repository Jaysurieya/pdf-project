import { useParams } from "react-router-dom";
import { useState } from "react";
import { TOOLS } from "../../lib/tools";
import CompareResult from "./compareResults";
import SignaturePad from "./SignaturePad";
import PdfPreview from "./pdfPreview";


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
  const [compareResult, setCompareResult] = useState(null);
  
  const [signatureData, setSignatureData] = useState(null);
  const [selectedPage, setSelectedPage] = useState(0);
const [selectedPages, setSelectedPages] = useState([]);
const [sigPos, setSigPos] = useState({});
const [pageSize, setPageSize] = useState({
  canvasWidth: 0,
  canvasHeight: 0,
  pdfWidth: 0,
  pdfHeight: 0
});

const [pageCount, setPageCount] = useState(0);
const [pagesToPlace, setPagesToPlace] = useState([]);
const [currentPlacingPage, setCurrentPlacingPage] = useState(null);
const [lockedPages, setLockedPages] = useState({});











  // handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };
  const handleCompareFileChange = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles.filter(Boolean)); // remove empty slots
  };
const handleSign = async () => {
  if (!signatureData || selectedPages.length === 0) {
    alert("Signature or pages missing");
    return;
  }

  for (const p of selectedPages) {
    if (!sigPos[p]) {
      alert(`Place signature on Page ${p + 1}`);
      return;
    }
  }

  setLoading(true);

  try {
    const signatureBlob = await fetch(signatureData).then(r => r.blob());

    // ✅ DEFINE SCALE ONCE
    const scaleX = pageSize.pdfWidth / pageSize.canvasWidth;
    const scaleY = pageSize.pdfHeight / pageSize.canvasHeight;

    // ✅ BUILD PLACEMENTS
    const placements = selectedPages.map(page => {
  const scaleX = pageSize.pdfWidth / pageSize.canvasWidth;
  const scaleY = pageSize.pdfHeight / pageSize.canvasHeight;

  const canvasX = sigPos[page].x;
  const canvasY = sigPos[page].y;

  // ✅ convert canvas → pdf correctly
  let pdfX = canvasX * scaleX;
  let pdfY =
    pageSize.pdfHeight -
    (canvasY + 60) * scaleY;

  // ✅ CLAMP so it NEVER goes outside page
  pdfX = Math.max(0, Math.min(pdfX, pageSize.pdfWidth - 150 * scaleX));
  pdfY = Math.max(0, Math.min(pdfY, pageSize.pdfHeight - 60 * scaleY));

  return {
    page,
    x: pdfX,
    y: pdfY
  };
});


    const formData = new FormData();
    formData.append("pdf", files[0]);
    formData.append("signature", signatureBlob);
    formData.append("placements", JSON.stringify(placements));
    formData.append("width", 150 * scaleX);
    formData.append("height", 60 * scaleY);

    const res = await fetch("http://localhost:5000/api/security/sign", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Signing failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "signed.pdf";
    a.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Failed to sign PDF");
  } finally {
    setLoading(false);
  }
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
    if (config.toolKey === "compare_pdf" && files.length !== 2) {
      alert("Please upload exactly 2 PDF files");
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

      if (config.toolKey === "compare_pdf") {
        const data = await res.json();
        setCompareResult(data);
        setLoading(false);
        return;
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
            {config.toolKey === "compare_pdf" ? (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Upload PDF 1
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleCompareFileChange(0, e.target.files[0])}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Upload PDF 2
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleCompareFileChange(1, e.target.files[0])}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept={config.accept}
                multiple={config.multiple}
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            )}

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
         {config.toolKey === "sign_pdf" && (
  <div className="mb-6">
    <label className="block font-medium text-gray-700 mb-2">
      Draw Signature
    </label>
   <SignaturePad
  onSave={(data) => {
    if (selectedPages.length === 0) {
      alert("Please select pages first");
      return;
    }

    setSignatureData(data);

    // 🔥 START PLACEMENT MODE
   
    setPagesToPlace(selectedPages);
    setCurrentPlacingPage(selectedPages[0]);
    setSelectedPage(selectedPages[0]);
  }}
/>

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
          {config.toolKey === "sign_pdf" && files.length === 1 && (
  <PdfPreview
  file={files[0]}
  selectedPage={selectedPage}
  setSelectedPage={setSelectedPage}
  signatureData={signatureData}
  sigPos={sigPos}
setSigPos = {setSigPos}
 selectedPages={selectedPages}
  setPageSize={setPageSize}
  setPageCount={setPageCount}
  currentPlacingPage={currentPlacingPage}
  lockedPages={lockedPages}
/>

)}
{config.toolKey === "sign_pdf" && currentPlacingPage !== null && (
  <div className="flex justify-between mt-4">
    <p className="text-sm text-gray-600">
      Placing signature on Page {currentPlacingPage + 1}
    </p>

    <button
      className="px-4 py-2 bg-green-600 text-white rounded"
      onClick={() => {
        setLockedPages(prev => ({
      ...prev,
      [currentPlacingPage]: true
    }));
        const remaining = pagesToPlace.filter(
          p => p !== currentPlacingPage
        );

        if (remaining.length > 0) {
          setCurrentPlacingPage(remaining[0]);
          setSelectedPage(remaining[0]);
        } else {
          setCurrentPlacingPage(null); // placement done
        }

        setPagesToPlace(remaining);
      }}
    >
      Save position
    </button>
  </div>
)}


{config.toolKey === "sign_pdf" && pageCount > 0 && (
  <div className="mb-4">
    <label className="font-medium block mb-2">
      Select Pages
    </label>
    {[...Array(pageCount)].map((_, i) => (
      <label key={i} className="block">
        <input
          type="checkbox"
          onChange={(e) => {
  let updated;

  if (e.target.checked) {
    updated = [...selectedPages, i];
  } else {
    updated = selectedPages.filter(p => p !== i);
  }

  setSelectedPages(updated);
  setPagesToPlace(updated);
  setCurrentPlacingPage(updated[0] ?? null);
  setSelectedPage(updated[0] ?? 0);
}}

        />
        Page {i + 1}
      </label>
    ))}
  </div>
)}



          <div className="mt-6 text-center">
            <button
              onClick={config.toolKey === "sign_pdf" ? handleSign : handleProcess}
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition
      ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
    `}
            >
              {loading ? "Processing..." : "Process"}
            </button>
          </div>



        </div>
        {config.toolKey === "compare_pdf" && compareResult &&
          (

            <CompareResult
              removed={compareResult.removed}
              added={compareResult.added}
            />
          )}
      </div>

    </div>

  );
}

export default Upload;
