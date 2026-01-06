import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TOOLS } from "../../lib/tools";
import QRCode from "qrcode";

function Upload() {
  const { tool } = useParams();
  const config = TOOLS[tool];
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  
  // Scan to PDF states
  const [scanImages, setScanImages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [receivedImagesCount, setReceivedImagesCount] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // Generate new scan session when scan-to-pdf tool opens
  useEffect(() => {
    if (tool === "scan-to-pdf") {
      fetchScanSession();
    }
  }, [tool]);

  const fetchScanSession = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/convert/generate-scan-session", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate scan session: ${response.status}`);
      }
      
      const { sessionId, uploadUrl } = await response.json();
      setSessionId(sessionId);
      setUploadUrl(uploadUrl);
      
      // Generate QR code from uploadUrl
      generateQRCode(uploadUrl);
      
      // Start polling for received images count
      setIsSessionActive(true);
      startPollingImagesCount(sessionId);
    } catch (error) {
      console.error("Error generating scan session:", error);
      alert("Failed to initialize scan session. Please try again.");
    }
  };

  const generateQRCode = async (url) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url);
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  // Poll for received images count
  const startPollingImagesCount = (sessionId) => {
    // Clear any existing interval
    if (window.imagesPollingInterval) {
      clearInterval(window.imagesPollingInterval);
    }
    
    // Start polling every 2 seconds
    window.imagesPollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/convert/session-images-count?sessionId=${sessionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to get images count: ${response.status}`);
        }
        
        const { count } = await response.json();
        setReceivedImagesCount(count);
      } catch (error) {
        console.error("Error polling images count:", error);
        // Stop polling on error
        if (window.imagesPollingInterval) {
          clearInterval(window.imagesPollingInterval);
        }
      }
    }, 2000);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (window.imagesPollingInterval) {
        clearInterval(window.imagesPollingInterval);
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setCameraStream(stream);
      document.querySelector("video").srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied or unavailable. Please allow camera permissions to use this feature.");
    }
  };

    const handleCapture = async () => {
      const video = document.querySelector("video");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob && sessionId) {
          try {
            const formData = new FormData();
            formData.append("image", blob, `scan_${Date.now()}.jpg`);
            formData.append("sessionId", sessionId);
            
            const response = await fetch("http://localhost:5000/api/convert/upload-scan-image", {
              method: "POST",
              body: formData
            });
            
            if (!response.ok) {
              throw new Error(`Failed to upload image: ${response.status}`);
            }
            
            // Update local state for UI feedback
            setScanImages(prev => [...prev, blob]);
          } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
          }
        }
      }, "image/jpeg");
    };

    const handleScanConfirm = async () => {
      if (receivedImagesCount === 0) {
        alert("No images received yet. Please capture images on your mobile device.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/convert/scan-to-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to generate PDF: ${response.status}`);
        }
        
        const pdfBlob = await response.blob();
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scanned.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
      }
    };

  if (!config) {
    return (
      <div className="tool-page min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Tool Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400">The requested tool "{tool}" does not exist.</p>
        </div>
      </div>
    );
  }

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Organize PDF states
  const [pagesInput, setPagesInput] = useState("");
  const [orderInput, setOrderInput] = useState("");

  // Tool behavior detection
  const needsPages =
    tool === "remove-pages" ||
    tool === "split-pdf";

  const needsOrder = tool === "organize-pdf";

  // ADD / APPEND FILES LOGIC
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (config.multiple) {
      // append files, avoid duplicates (name + size)
      setFiles((prev) => {
        const existing = new Map(
          prev.map((f) => [`${f.name}-${f.size}`, f])
        );

        selectedFiles.forEach((f) => {
          existing.set(`${f.name}-${f.size}`, f);
        });

        return Array.from(existing.values());
      });
    } else {
      setFiles(selectedFiles.slice(0, 1));
    }

    // reset input so same file can be re-added if needed
    e.target.value = "";
  };

  // REMOVE SINGLE FILE
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

    // 👇 SAME VARIABLE, MULTIPLE FILES
    files.forEach((file) => {
      formData.append("files", file);
    });

    if (needsPages) {
      formData.append("pages", pagesInput);
    }

    if (needsOrder) {
      formData.append("order", orderInput);
    }

    try {
      const res = await fetch(
        `http://localhost:5000${config.backendRoute}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Processing failed with status ${res.status}`);
      }

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
    <div className="tool-page min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-white">
          {config.title}
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg transition-all">

          {/* FILE INPUT (Mobile Scan OR Normal Upload) */}
          <div className="mb-8">
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-4">
              {tool === "scan-to-pdf" ? "Scan to PDF" : "Select File(s)"}
            </label>

            {tool === "scan-to-pdf" ? (
              // Special handling for scan-to-pdf tool
              isMobile ? (
                // Mobile view: Show camera interface
                <div className="text-center space-y-4">
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-[#0061ff] text-white rounded-xl font-bold shadow-lg"
                  >
                    Start Camera
                  </button>

                  <video
                    autoPlay
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 shadow-md"
                  ></video>

                  <button
                    onClick={handleCapture}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    Capture & Upload
                  </button>

                  <div className="mt-2">
                    <h3 className="font-bold text-slate-800 dark:text-white">Upload Status</h3>
                    <p className="text-sm opacity-70">Images are automatically uploaded to the session</p>
                  </div>

                  <button
                    onClick={handleScanConfirm}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    Confirm & Create PDF ({receivedImagesCount} images received)
                  </button>
                </div>
              ) : (
                // Laptop/desktop view: Show QR code and status
                <div className="text-center space-y-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Scan QR Code with Mobile Camera</h3>
                    {qrCodeUrl ? (
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-inner inline-block">
                        <img src={qrCodeUrl} alt="QR Code for scan session" className="w-48 h-48" />
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-xl">
                        <div className="text-slate-500 dark:text-slate-400 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0061ff] mx-auto mb-2"></div>
                          <p>Loading QR Code...</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 text-center">
                      <p className="text-slate-600 dark:text-slate-300 mb-2">
                        <span className="font-bold">{receivedImagesCount}</span> image(s) received
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Point your mobile camera to the QR code to start scanning
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={fetchScanSession}
                    className="px-6 py-3 bg-[#0061ff] text-white rounded-xl font-bold shadow-lg"
                  >
                    Refresh Session
                  </button>
                </div>
              )
            ) : (
              // Regular file upload for other tools
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept={config.accept}
                  multiple={config.multiple}
                  onChange={handleFileChange}
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
                />

                {config.multiple && (
                  <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    + Add more
                  </span>
                )}
              </div>
            )}

            {tool !== "scan-to-pdf" && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                Accepted formats:{" "}
                {config.accept.replace(/\./g, "").replace(/,/g, ", ")}
              </p>
            )}
          </div>

          {/* PAGE INPUT */}
          {needsPages && (
            <div className="mb-8">
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-4">
                Enter pages or range
              </label>
              <input
                type="text"
                placeholder="e.g. 1,3,5 or 1-4"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
              />
            </div>
          )}

          {/* ORDER INPUT */}
          {needsOrder && (
            <div className="mb-8">
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-4">
                Enter new page order
              </label>
              <input
                type="text"
                placeholder="e.g. 3,1,4,2"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
              />
            </div>
          )}

          {/* FILE LIST */}
          {files.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-4">
                Selected Files:
              </h3>
              <ul className="space-y-3">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                  >
                    <span>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium"
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
              className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition-all ${
                loading || files.length === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
                  : "bg-[#0061ff] text-white hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95"
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