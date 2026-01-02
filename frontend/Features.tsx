import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../constants';
import { ArrowRight } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900/30 transition-colors">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-6 mb-24">
          <div className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
            Enterprise Infrastructure
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Why Choose PDF AI?</h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Built on a world-class cloud infrastructure that processes billions of files every month with zero downtime.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="w-24 h-24 mb-10 bg-slate-50 dark:bg-slate-800 rounded-[2.25rem] flex items-center justify-center text-[#0061ff] group-hover:bg-[#0061ff] group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <feature.icon size={48} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* High-Impact CTA Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 md:p-24 bg-slate-950 dark:bg-slate-900 rounded-[4rem] text-center space-y-10 relative overflow-hidden"
        >
          {/* Enhanced decorative elements */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0061ff]/30 blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Ready to automate your documents?
            </h3>
            <p className="text-xl text-slate-400 font-medium max-w-xl mx-auto">
              Join millions of professionals who use PDF AI to handle their document workflows every single day.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => alert("Frontend demo only")}
              className="w-full sm:w-auto px-12 py-6 bg-[#0061ff] text-white font-black text-xl rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-900/50 transition-all active:scale-95 group flex items-center gap-3"
            >
              Get Started Free
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => alert("Frontend demo only")}
              className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white font-black text-xl rounded-2xl border border-white/10 transition-all backdrop-blur-sm"
            >
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;