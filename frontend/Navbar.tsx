import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, FileText, Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleAlert = () => alert("Frontend demo only");

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-3 shadow-lg border-b border-slate-200 dark:border-slate-800' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bg-[#0061ff] p-1.5 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            PDF <span className="text-[#0061ff]">AI</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {['Merge PDF', 'Split PDF', 'Compress PDF', 'Convert PDF'].map((item) => (
            <button 
              key={item} 
              onClick={handleAlert}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0061ff] dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              {item}
            </button>
          ))}
          <button onClick={handleAlert} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0061ff] dark:hover:text-blue-400 flex items-center gap-1">
            All Tools <ChevronDown size={14} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={handleAlert}
              className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={handleAlert}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#0061ff] rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Sign up
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {['Merge PDF', 'Split PDF', 'Compress PDF', 'Convert PDF'].map(item => (
            <button key={item} onClick={handleAlert} className="text-left py-3 font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-50 dark:border-slate-800">{item}</button>
          ))}
          <div className="flex flex-col gap-2 mt-2">
            <button onClick={handleAlert} className="w-full py-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 rounded-2xl">Log in</button>
            <button onClick={handleAlert} className="w-full py-4 font-bold text-white bg-[#0061ff] rounded-2xl shadow-xl">Sign up</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;