import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TOOLS } from "../../lib/tools";
import CompareResult from "./compareResults";
import SignatureCanvasBox from "./SignaturePad";
import PdfPreview from "./PdfPreview";
import RedactPdfPreview from "./RedactPreview";

function Upload() {
  const { tool } = useParams();
  const config = TOOLS[tool];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Tool Not Found
      </div>
    );
  }

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [activeRect, setActiveRect] = useState(null);


  // 🔥 SIGN PDF STATES
  const [signatureData, setSignatureData] = useState(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [placements, setPlacements] = useState([]);

  // Debug (keep this one only)
  useEffect(() => {
    console.log("Current placements:", placements);
  }, [placements]);

  // =========================
  // File selection
  // =========================
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setSelectedPage(0);
    setPlacements([]);
    setSignatureData(null);
  };

  // =========================
  // SIGN PDF HANDLER (FINAL)
  // =========================
  const handleSign = async () => {
    // ✅ FILTER VALID PLACEMENTS
    const validPlacements = placements.filter(
      (p) =>
        typeof p.page === "number" &&
        typeof p.xPercent === "number" &&
        typeof p.yPercent === "number" &&
        !isNaN(p.xPercent) &&
        !isNaN(p.yPercent)
    );

    console.log("PLACEMENTS SENT TO BACKEND:", validPlacements);

    if (!files[0] || !signatureData || validPlacements.length === 0) {
      alert("Please upload PDF and place the signature on at least one page");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", files[0]);
      formData.append("signatureBase64", signatureData);
      formData.append("placements", JSON.stringify(validPlacements));

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

  // =========================
  // OTHER TOOLS HANDLER
  // =========================
  const handleProcess = async () => {
    if (files.length === 0) {
      alert("Please add file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("tool", config.toolKey);

    if (password) formData.append("password", password);
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch(
        `http://localhost:5000${config.backendRoute}`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Processing failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "result.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{config.title}</h1>

        {/* FILE INPUT */}
        <input
          type="file"
          accept={config.accept}
          onChange={handleFileChange}
          className="mb-4"
        />
        {config.toolKey === "protect_pdf" && (
          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 ml-2"
            />
          </div>
        )}
        {config.toolKey === "unlock_pdf" && (
          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 ml-2"
            />
          </div>
        )}
        {/* SIGN PDF UI */}
        {config.toolKey === "sign_pdf" && (
          <>
            <SignatureCanvasBox onSave={setSignatureData} />

            {files[0] && (
              <PdfPreview
                file={files[0]}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                signatureData={signatureData}
                placements={placements}
                onPlacement={(p) => {
                  setPlacements((prev) => {
                    // ✅ ensure one placement per page
                    const rest = prev.filter((x) => x.page !== p.page);
                    return [...rest, p];
                  });
                }}
              />
            )}
          </>
        )}

        {config.toolKey === "redact_pdf" && (
  <RedactPdfPreview
    file={files[0]}
  />
)}


        {/* PROCESS BUTTON */}
        <div className="mt-6 text-center">
          <button
            onClick={config.toolKey === "sign_pdf" ? handleSign : handleProcess}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded"
          >
            {loading ? "Processing..." : "Process"}
          </button>
        </div>

        {/* COMPARE RESULT */}
        {config.toolKey === "compare_pdf" && <CompareResult />}
      </div>
    </div>
  );
}

export default Upload;
