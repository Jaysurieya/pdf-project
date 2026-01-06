import React from 'react';
import { Sparkles, ArrowRight, Upload, FileCheck, Layers, Cpu, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const handleAlert = () => alert("Frontend demo only");

  return (
    <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Content Side */}
        <div className="w-full lg:w-[55%] space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-[#0061ff] dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            Empowering 20 Million+ Users Monthly
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter"
            >
              Master Your <span className="text-[#0061ff] relative">PDFs<span className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 dark:bg-blue-900/40 rounded-full -z-10"></span></span> <br /> 
              <span className="text-slate-800 dark:text-slate-200">With AI Precision.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium"
            >
              Every tool you need to work with PDFs in one place. Combine, split, compress, and convert with our high-speed AI engine.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button 
              onClick={handleAlert}
              className="w-full sm:w-auto px-10 py-5 bg-[#0061ff] text-white font-black text-lg rounded-2xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:shadow-blue-500/60 hover:-translate-y-1.5 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              Select PDF files
              <ArrowRight size={24} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <div className="hidden sm:flex items-center gap-4 px-8 py-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:border-[#0061ff] transition-colors cursor-pointer group">
              <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
              Drop PDFs here
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-x-8 gap-y-4 pt-6"
          >
            {['No Installation', 'High Security', 'Unlimited Access'].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={18} className="text-[#0061ff]" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual Side (Advanced Orbital UI) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-[45%] flex justify-center lg:justify-end relative"
        >
          <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center">
            {/* Animated Glow Rings */}
            <div className="absolute inset-0 bg-[#0061ff]/5 dark:bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute inset-[15%] border border-[#0061ff]/10 dark:border-blue-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-[25%] border border-[#0061ff]/20 dark:border-blue-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            
            {/* Center Engine Core */}
            <div className="relative z-10 w-40 h-40 md:w-64 md:h-64 bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_50px_100px_-20px_rgba(0,97,255,0.15)] flex flex-col items-center justify-center p-8 border border-slate-100 dark:border-slate-800 float-animation">
              <div className="bg-[#0061ff] p-5 rounded-3xl text-white mb-4 shadow-xl shadow-blue-500/30 transform transition-transform group-hover:scale-110">
                <Cpu size={48} strokeWidth={1.5} />
              </div>
              <span className="font-black text-slate-900 dark:text-white text-xl md:text-2xl tracking-tight">PDF AI</span>
              <div className="mt-2 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Active</span>
              </div>
            </div>

            {/* Floating Orbiting Items */}
            <OrbitIcon 
              Icon={FileCheck} 
              delay={0} 
              label="Intelligent Scan" 
              color="bg-blue-500 text-white" 
              pos="-top-4 left-1/2 -translate-x-1/2"
            />
            <OrbitIcon 
              Icon={Layers} 
              delay={0.8} 
              label="Bulk Process" 
              color="bg-indigo-500 text-white" 
              pos="top-1/2 right-0 translate-x-4 -translate-y-1/2"
            />
            <OrbitIcon 
              Icon={FileText} 
              delay={1.6} 
              label="OCR Vision" 
              color="bg-emerald-500 text-white" 
              pos="-bottom-4 left-1/2 -translate-x-1/2"
            />
            <OrbitIcon 
              Icon={ShieldCheck} 
              delay={2.4} 
              label="Encryption" 
              color="bg-[#0061ff] text-white" 
              pos="top-1/2 left-0 -translate-x-4 -translate-y-1/2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const OrbitIcon: React.FC<{ Icon: any, delay: number, label: string, color: string, pos: string }> = ({ Icon, delay, label, color, pos }) => (
  <motion.div 
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: 1, 
      opacity: 1,
      y: [0, -15, 0],
    }}
    transition={{
      scale: { delay: delay + 0.5 },
      opacity: { delay: delay + 0.5 },
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className={`absolute ${pos} flex flex-col items-center gap-3 z-20`}
  >
    <div className={`p-5 ${color} rounded-[1.75rem] shadow-2xl shadow-black/10 backdrop-blur-md border-4 border-white dark:border-slate-800 transition-transform hover:scale-110 cursor-default`}>
      <Icon size={28} />
    </div>
    <div className="hidden md:block">
      <div className="px-4 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-xl border border-slate-100 dark:border-slate-700">
        <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  </motion.div>
);

export default Hero;