import React from 'react';
import { FileText, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const handleAlert = () => alert("Frontend demo only");

  const footerLinks = {
    product: ['Merge PDF', 'Split PDF', 'Compress PDF', 'Office to PDF', 'PDF to JPG', 'Edit PDF', 'OCR PDF'],
    solutions: ['Business', 'Education', 'Developers', 'Enterprise'],
    company: ['About us', 'Features', 'Sustainability', 'Media Kit', 'Contact'],
    support: ['Help Center', 'Security', 'Legal', 'Privacy Policy', 'Cookies Policy']
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 dark:bg-slate-950 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-[#0061ff] p-1.5 rounded-lg text-white">
                <FileText size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PDF <span className="text-[#0061ff]">AI</span></span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, idx) => (
                <button 
                  key={idx} 
                  onClick={handleAlert}
                  className="p-2 text-slate-400 hover:text-[#0061ff] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest text-xs">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <button 
                      onClick={handleAlert}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-[#0061ff] transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-900 gap-4">
          <p className="text-sm text-slate-400 font-medium">
            © 2026 PDF AI – Frontend UI Demo. Made with Passion.
          </p>
          <div className="flex items-center gap-8">
            <button onClick={handleAlert} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white">Privacy Policy</button>
            <button onClick={handleAlert} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white">Terms of Use</button>
            <button onClick={handleAlert} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white">Status</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;