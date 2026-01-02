import React, { useState } from 'react';
import { Search, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOOLS } from '../constants';
import { PDFTool } from '../types';

const Tools: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) || 
                         tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAlert = () => alert("Frontend demo only");

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'edit', label: 'Edit & Sign' },
    { id: 'convert', label: 'Convert' },
    { id: 'optimize', label: 'Optimize' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors" id="tools">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#0061ff] font-black text-xs uppercase tracking-[0.2em]">
              <Sparkles size={16} />
              The Intelligence Hub
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Your AI Toolbox.</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg font-medium">Streamline your document workflow with 20+ specialized PDF tools optimized by AI.</p>
          </div>
          
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0061ff] transition-colors" size={22} />
            <input 
              type="text"
              placeholder="Search AI tools..."
              className="w-full pl-14 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#0061ff] dark:focus:border-blue-500 transition-all font-semibold text-slate-700 dark:text-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-3 mb-12 items-center">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">Filter By:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xl scale-105' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ 
                  duration: 0.6, 
                  delay: (idx % 4) * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <ToolCard tool={tool} onClick={handleAlert} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try searching for something else like "Merge" or "Word".</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const ToolCard: React.FC<{ tool: PDFTool; onClick: () => void }> = ({ tool, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-[#0061ff]/30 dark:hover:border-blue-500/30 hover:shadow-[0_40px_80px_-20px_rgba(0,97,255,0.1)] transition-all group relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
    >
      <div className="relative mb-8 w-fit">
        <div className={`absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${tool.color}`} />
        <div className={`relative z-10 p-5 rounded-2xl transition-all group-hover:scale-110 group-hover:-rotate-6 ${tool.color}`}>
          <tool.icon size={32} strokeWidth={2} />
        </div>
      </div>

      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-[#0061ff] dark:group-hover:text-blue-400 transition-colors tracking-tight">
        {tool.title}
      </h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
        {tool.description}
      </p>
      
      <div className="flex items-center gap-2 text-xs font-black text-[#0061ff] dark:text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
        Open Tool <ArrowUpRight size={16} />
      </div>

      <div className="absolute -bottom-6 -right-6 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity rotate-12">
        <tool.icon size={120} />
      </div>
    </button>
  );
};

export default Tools;