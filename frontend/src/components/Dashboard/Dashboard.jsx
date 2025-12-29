import React from "react";
import NavbarUse from "./Navbar_use";

function Dashboard() {
  // Define the categories and their tools
  const categories = [
    {
      title: "ORGANIZE PDF",
      tools: ["Merge PDF", "Split PDF", "Extract Pages", "Organize PDF", "Scan to PDF", "Remove Pages"]
    },
    {
      title: "OPTIMIZE PDF",
      tools: ["Compress PDF", "Repair PDF", "OCR PDF"]
    },
    {
      title: "CONVERT TO PDF",
      tools: ["JPG to PDF", "Word to PDF", "Excel to PDF", "HTML to PDF", "PowerPoint to PDF"]
    },
    {
      title: "CONVERT FROM PDF",
      tools: ["PDF to JPG", "PDF to Word", "PDF to Excel", "PDF to PDF/A"]
    },
    {
      title: "EDIT PDF",
      tools: ["Rotate PDF", "Crop PDF", "Add watermark", "Edit PDF"]
    },
    {
      title: "PDF SECURITY",
      tools: ["Unlock PDF", "Protect PDF", "Compare PDF", "Sign PDF", "Redact PDF"]
    }
  ];

  const handleToolClick = (toolName) => {
    console.log(`Tool clicked: ${toolName}`);
    // Add functionality here when needed
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarUse />
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-12">PDF Tools Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-300 hover:shadow-md"
            >
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">{category.title}</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {category.tools.map((tool, toolIndex) => (
                  <div 
                    key={toolIndex}
                    onClick={() => handleToolClick(tool)}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md hover:from-blue-50 hover:to-blue-100 border border-gray-100"
                  >
                    <p className="text-sm font-medium text-gray-700">{tool}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

