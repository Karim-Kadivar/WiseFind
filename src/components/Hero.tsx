import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Award, 
  ShieldCheck, 
  Zap, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  ArrowRight,
  X,
  Store,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface HeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const CATEGORY_CHIPS = [
  { label: 'All Tech', icon: Sparkles, prompt: 'Compare top tech deals and AI recommendations today' },
  { label: 'Laptops', icon: Laptop, prompt: 'Best lightweight laptop under ₹70,000 for coding and productivity' },
  { label: 'Smartphones', icon: Smartphone, prompt: 'Best camera phone under ₹35,000 with clean OS and high battery life' },
  { label: 'Audio / ANC', icon: Headphones, prompt: 'Best noise-cancelling wireless headphones under ₹25,000' },
  { label: 'Smartwatches', icon: Watch, prompt: 'Best AMOLED smartwatch with accurate fitness tracking under ₹15,000' }
];

const CURATED_PROMPTS = [
  {
    category: 'Laptops',
    tag: 'Student & Dev',
    text: 'Lightweight laptop under ₹65,000 with 16GB RAM and long battery'
  },
  {
    category: 'Smartphones',
    tag: 'Photography',
    text: 'Best phone under ₹30,000 with OIS camera, clean UI and fast charging'
  },
  {
    category: 'Audio',
    tag: 'Work & Travel',
    text: 'Wireless ANC headphones with multipoint Bluetooth under ₹20k'
  },
  {
    category: 'Gaming',
    tag: 'High Performance',
    text: 'Gaming laptop with RTX 4060 graphics under ₹95,000'
  }
];

export default function Hero({ onSearch, isLoading }: HeroProps) {
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All Tech');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const rotatingPlaceholders = [
    "Ask anything... e.g., 'Best coding laptop under ₹70,000'",
    "e.g., 'Compare iPhone 15 vs Samsung S24 for battery & camera'",
    "e.g., 'Best noise-cancelling earbuds under ₹15,000'",
    "e.g., 'MacBook Air M3 vs Dell XPS 13 for design work'"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (chip: typeof CATEGORY_CHIPS[0]) => {
    setActiveChip(chip.label);
    if (chip.label !== 'All Tech') {
      setQuery(chip.prompt);
    }
  };

  const handlePromptClick = (promptText: string) => {
    setQuery(promptText);
    onSearch(promptText);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 16 }
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50/90 to-[#F8FAFC] dark:from-[#090D16] dark:via-[#0F1424] dark:to-[#090D16] pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200" id="hero-section">
      {/* High-quality grid mesh overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_25%,#000_70%,transparent_100%)] opacity-50 dark:opacity-25 pointer-events-none" />

      {/* Dynamic radial glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] pointer-events-none opacity-70 dark:opacity-30">
        <div className="absolute -top-24 left-1/4 w-[380px] h-[380px] rounded-full bg-indigo-200/45 dark:bg-indigo-600/25 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-12 right-1/4 w-[420px] h-[420px] rounded-full bg-cyan-200/35 dark:bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-purple-200/30 dark:bg-purple-600/15 blur-3xl" />
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Subtle Platform Tag */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-black tracking-wider text-[#4F46E5] dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 rounded-full shadow-xs">
            <Sparkles className="h-3 w-3 text-[#4F46E5] dark:text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI-Powered Tech Decision Engine</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-wider text-emerald-700 dark:text-emerald-300 uppercase bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            100% Sponsor-Free
          </span>
        </motion.div>

        {/* Dynamic Display Heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-4 max-w-5xl mx-auto"
        >
          Find the best tech for your budget{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B]">
            with pure AI clarity.
          </span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
        >
          WiseFind synthesizes technical spec sheets, real-time benchmark metrics, and multi-store pricing in Indian Rupees (₹) to calculate your ideal tech match.
        </motion.p>

        {/* Interactive Category Selector Ribbon */}
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {CATEGORY_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const isSelected = activeChip === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-md shadow-[#4F46E5]/25 scale-105'
                    : 'bg-white/90 dark:bg-[#12182B] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Natural Language AI Search Box */}
        <motion.div variants={itemVariants} className="mt-6 max-w-3xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B] opacity-20 dark:opacity-25 blur-2xl rounded-3xl" />
          
          <form 
            onSubmit={handleFormSubmit} 
            className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-2 sm:p-2.5 bg-white dark:bg-[#12182B] rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border border-slate-200 dark:border-slate-700/80 focus-within:border-[#4F46E5] dark:focus-within:border-[#4F46E5] focus-within:ring-4 focus-within:ring-[#4F46E5]/15 transition-all duration-300"
          >
            <div className="hidden sm:flex px-3 text-[#4F46E5] dark:text-indigo-400 items-center shrink-0">
              <Search className="h-5 w-5" />
            </div>

            <div className="relative flex-1 flex items-center">
              <Search className="sm:hidden absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="hero-ai-search-input"
                placeholder={rotatingPlaceholders[placeholderIndex]}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="w-full py-3 pl-9 sm:pl-1 pr-8 sm:pr-4 text-xs sm:text-sm bg-transparent border-none text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  title="Clear input"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              id="hero-ai-search-submit-btn"
              disabled={isLoading || !query.trim()}
              className="mt-2 sm:mt-0 px-5 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md shadow-indigo-500/25 shrink-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Ask WiseBot</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Starter Prompts Grid */}
          <div className="mt-5 text-left">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#4F46E5] dark:text-indigo-400" />
                <span>Popular Buyer Inquiries</span>
              </p>
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline-block">Click any card to analyze</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CURATED_PROMPTS.map((prompt, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="text-left p-2.5 rounded-xl bg-white dark:bg-[#12182B] border border-slate-200/90 dark:border-slate-800 hover:border-[#4F46E5] dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-indigo-50 dark:bg-indigo-950/80 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        {prompt.category}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 truncate">{prompt.tag}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-300 line-clamp-1">
                      {prompt.text}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Telemetry Feature Cards Grid */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-200/70 dark:border-slate-800 pt-8 sm:pt-12"
        >
          {/* Card 1 */}
          <div className="bg-white/80 dark:bg-[#12182B]/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400 shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xs tracking-tight uppercase">Unbiased Spec Matrix</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Zero Sponsored Bias</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
              We never accept paid sponsor placements. Scores are derived mathematically from deep hardware benchmarks and consumer sentiment.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 dark:bg-[#12182B]/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-100 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xs tracking-tight uppercase">Neural Score Algorithm</h3>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Multi-dimensional Index</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
              Combines display quality, real-world battery endurance, thermal throttling, and customer satisfaction into one 0-100 index.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 dark:bg-[#12182B]/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-100 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xs tracking-tight uppercase">Indian Market Grounded</h3>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">INR (₹) & Official Warranty</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
              Live pricing tracked across Amazon, Flipkart, Croma & Reliance Digital with authorized Indian warranty validation.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

