/* import SignatureCanvas from "react-signature-canvas";
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
 */

import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";

export default function SignaturePadComponent({ onSave }) {
  const canvasRef = useRef(null);
  let sigPad = useRef(null);

  useEffect(() => {
    sigPad.current = new SignaturePad(canvasRef.current);
  }, []);

  const saveSignature = () => {
    const dataURL = sigPad.current.toDataURL("image/png");
    onSave(dataURL); // send base64 to Upload.jsx
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="border"
      />
      <button onClick={saveSignature}>Save Signature</button>
    </div>
  );
}
