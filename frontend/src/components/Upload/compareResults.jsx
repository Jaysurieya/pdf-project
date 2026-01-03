function CompareResult({ removed, added }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        📄 PDF Comparison Result
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT - REMOVED */}
        <div className="border rounded-lg shadow-sm bg-red-50">
          <div className="p-4 border-b bg-red-100">
            <h3 className="font-semibold text-red-700">
              ➖ Removed (Only in PDF-1)
            </h3>
          </div>

          <div className="p-4 h-96 overflow-y-auto text-sm text-red-900 whitespace-pre-wrap">
            {removed || "No removed content 🎉"}
          </div>
        </div>

        {/* RIGHT - ADDED */}
        <div className="border rounded-lg shadow-sm bg-green-50">
          <div className="p-4 border-b bg-green-100">
            <h3 className="font-semibold text-green-700">
              ➕ Added (Only in PDF-2)
            </h3>
          </div>

          <div className="p-4 h-96 overflow-y-auto text-sm text-green-900 whitespace-pre-wrap">
            {added || "No added content 🎉"}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CompareResult;
