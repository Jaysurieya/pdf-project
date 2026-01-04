import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

function SignaturePad({ onSave }) {
  const sigRef = useRef(null);

  const clear = () => sigRef.current.clear();

  const save = () => {
    if (sigRef.current.isEmpty()) {
      alert("Please draw signature");
      return;
    }
    const dataURL = sigRef.current.toDataURL("image/png");
    onSave(dataURL);
  };

  return (
    <div className="border rounded p-4 bg-white">
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: "border" }}
      />

      <div className="flex gap-3 mt-3">
        <button onClick={clear} className="px-3 py-1 bg-gray-200 rounded">
          Clear
        </button>
        <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded">
          Save Signature
        </button>
      </div>
    </div>
  );
}

export default SignaturePad;
