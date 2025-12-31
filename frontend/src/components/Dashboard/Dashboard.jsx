import React from "react";
import { Link } from "react-router-dom";
import NavbarUse from "./Navbar_use";

function Dashboard() {
  // Define the categories and their tools
  const categories = [
    {
      title: "ORGANIZE PDF",
      tools: ["Merge PDF", "Split PDF", "Organize PDF", "Scan to PDF", "Remove Pages"]
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



  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarUse />
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold text-center mb-14 tracking-tight">
          PDF Tools Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-lg rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <h2 className="text-xl font-semibold mb-5 text-center opacity-90 uppercase tracking-wide">
                {category.title}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {category.tools.map((tool, toolIndex) => {
                  // Map tool names to their URL paths based on tools.js
                  const toolPathMap = {
                    // ORGANIZE PDF
                    "Merge PDF": "merge-pdf",
                    "Split PDF": "split-pdf",
                    "Organize PDF": "organize-pdf",
                    "Scan to PDF": "scan-to-pdf",
                    "Remove Pages": "remove-pages",
                    
                    // OPTIMIZE PDF
                    "Compress PDF": "compress-pdf",
                    "Repair PDF": "repair-pdf",
                    "OCR PDF": "ocr-pdf",
                    
                    // CONVERT TO PDF
                    "JPG to PDF": "jpg-to-pdf",
                    "Word to PDF": "word-to-pdf",
                    "Excel to PDF": "excel-to-pdf",
                    "HTML to PDF": "html-to-pdf",
                    "PowerPoint to PDF": "powerpoint-to-pdf",
                    
                    // CONVERT FROM PDF
                    "PDF to JPG": "pdf-to-jpg",
                    "PDF to Word": "pdf-to-word",
                    "PDF to Excel": "pdf-to-excel",
                    "PDF to PDF/A": "pdf-to-pdfa",
                    
                    // EDIT PDF
                    "Rotate PDF": "rotate-pdf",
                    "Crop PDF": "crop-pdf",
                    "Add watermark": "add-watermark",
                    "Edit PDF": "edit-pdf",
                    
                    // PDF SECURITY
                    "Unlock PDF": "unlock-pdf",
                    "Protect PDF": "protect-pdf",
                    "Compare PDF": "compare-pdf",
                    "Sign PDF": "sign-pdf",
                    "Redact PDF": "redact-pdf",
                  };
                  
                  const toolKey = toolPathMap[tool];
                  
                  return (
                    <Link
                      key={toolIndex}
                      to={`/tool/${toolKey}`}
                      className="relative group bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 block"
                    >
                      {/* Glow effect */}
                      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300" />

                      <p className="text-base font-medium text-center opacity-95 group-hover:opacity-100 transition-opacity">
                        {tool}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

