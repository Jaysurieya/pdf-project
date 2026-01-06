import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TOOLS } from "../../lib/tools";
import CompareResult from "./compareResults";
import SignatureCanvasBox from "./SignaturePad";
import PdfPreview from "./PdfPreview";

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

  // 🔥 SIGN PDF STATES
  const [signatureData, setSignatureData] = useState(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [placements, setPlacements] = useState([]);

  // Debug (keep for now)
  useEffect(() => {
    console.log("signatureData updated:", signatureData);
  }, [signatureData]);

  // =========================
  // File selection
  // =========================
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setSelectedPage(0);
    setPlacements([]);
  };

  // =========================
  // SIGN PDF HANDLER
  // =========================
  const handleSign = async () => {
    if (!files[0] || !signatureData || placements.length === 0) {
      alert("Please upload PDF, draw signature, and place it on the page");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", files[0]);
      formData.append("signatureBase64", signatureData);
      formData.append("placements", JSON.stringify(placements));

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
                onPlacement={(p) => {
                  setPlacements((prev) => {
                    const rest = prev.filter((x) => x.page !== p.page);
                    return [...rest, p];
                  });
                }}
              />
            )}
          </>
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
