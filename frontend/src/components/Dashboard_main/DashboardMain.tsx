    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import Navbar from './Navbar';
    import Footer from './Footer';
    import { Search, ArrowUpRight, Sparkles, FileCheck, Layers, Cpu, CheckCircle2, FileText, ShieldCheck, ArrowRight, Upload } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const DashboardMain = () => {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");

    // Define the categories and their tools from the original Dashboard component
    const categories = [
        {
        id: "organize",
        title: "ORGANIZE PDF",
        tools: ["Merge PDF", "Split PDF", "Organize PDF", "Scan to PDF", "Remove Pages"]
        },
        {
        id: "optimize", 
        title: "OPTIMIZE PDF",
        tools: ["Compress PDF", "Repair PDF", "OCR PDF"]
        },
        {
        id: "convert-to",
        title: "CONVERT TO PDF",
        tools: ["JPG to PDF", "Word to PDF", "Excel to PDF", "HTML to PDF", "PowerPoint to PDF"]
        },
        {
        id: "convert-from",
        title: "CONVERT FROM PDF",
        tools: ["PDF to JPG", "PDF to Word", "PDF to Excel", "PDF to PDF/A"]
        },
        {
        id: "edit",
        title: "EDIT PDF",
        tools: ["Rotate PDF", "Crop PDF", "Add watermark", "Edit PDF"]
        },
        {
        id: "security",
        title: "PDF SECURITY",
        tools: ["Unlock PDF", "Protect PDF", "Compare PDF", "Sign PDF", "Redact PDF"]
        }
    ];

    // Map tool names to their URL paths based on the original Dashboard
    const toolPathMap: Record<string, string> = {
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

    // Filter tools based on search and category
    const filteredCategories = categories.map(category => ({
        ...category,
        tools: category.tools.filter(tool => {
        const matchesSearch = tool.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "all" || 
            category.id === activeCategory ||
            (activeCategory === "convert" && (category.id === "convert-to" || category.id === "convert-from"));
        return matchesSearch && matchesCategory;
        })
    })).filter(category => category.tools.length > 0);

    const handleToolClick = (toolName: string) => {
        const toolKey = toolPathMap[toolName];
        if (!toolKey) {
        console.error(`No path found for tool: ${toolName}`);
        return;
        }
        // Navigation will be handled by Link component
    };

    const customCategories = [
        { id: 'all', label: 'All Tools' },
        { id: 'organize', label: 'Organize' },
        { id: 'optimize', label: 'Optimize' },
        { id: 'convert', label: 'Convert' },
        { id: 'edit', label: 'Edit' },
        { id: 'security', label: 'Security' },
    ];

    // OrbitIcon component for the Hero section
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

    // Features data
    const FEATURES = [
        { title: "Fast & Easy to Use", description: "Our intuitive interface makes PDF editing accessible for everyone. Process your documents in seconds.", icon: CheckCircle2 },
        { title: "Secure Processing", description: "Your files are encrypted using 256-bit SSL and deleted automatically within 2 hours.", icon: ShieldCheck },
        { title: "Works on Any Device", description: "Access our full suite of PDF tools from your desktop, tablet, or smartphone.", icon: FileText }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <Navbar />
        
        {/* Hero Section from Hero.tsx */}
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
                    onClick={() => alert("Frontend demo only")}
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

        {/* Categories Filter */}
        <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-wrap gap-3 mb-8 items-center justify-center">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">Filter By:</span>
            {customCategories.map((cat) => (
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
        </div>

        {/* Tools Grid */}
        <section className="py-8 pb-24">
            <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                {filteredCategories.flatMap((category) => 
                    category.tools.map((tool, idx) => {
                    const toolKey = toolPathMap[tool];
                    if (!toolKey) {
                        console.error(`No path found for tool: ${tool}`);
                        return null;
                    }
                    
                    return (
                        <motion.div
                        key={`${category.id}-${tool}`}
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
                        <Link 
                            to={`/tool/${toolKey}`}
                            className="w-full text-left bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-[#0061ff]/30 dark:hover:border-blue-500/30 hover:shadow-[0_40px_80px_-20px_rgba(0,97,255,0.1)] transition-all group relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
                        >
                            <div className="relative mb-8 w-fit">
                            <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity bg-blue-50" />
                            <div className="relative z-10 p-5 rounded-2xl transition-all group-hover:scale-110 group-hover:-rotate-6 bg-blue-50 text-blue-600">
                                <div className="bg-[#0061ff] p-3 rounded-xl text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                </svg>
                                </div>
                            </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-[#0061ff] dark:group-hover:text-blue-400 transition-colors tracking-tight">
                            {tool}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                            {category.title.replace(' PDF', '')} tool
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs font-black text-[#0061ff] dark:text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                            Open Tool <ArrowUpRight size={16} />
                            </div>

                            <div className="absolute -bottom-6 -right-6 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity rotate-12">
                            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            </div>
                        </Link>
                        </motion.div>
                    );
                    })
                )}
                </AnimatePresence>
            </div>

            {filteredCategories.every(cat => cat.tools.length === 0) && (
                <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
                >
                <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Try searching for something else or select a different category.</p>
                </motion.div>
            )}
            </div>
        </section>

        {/* Features Section from Features.tsx */}
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

        <Footer />
        </div>
    );
    };

    export default DashboardMain;