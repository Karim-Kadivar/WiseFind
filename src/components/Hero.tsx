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
  CheckCircle2,
  Sliders,
  DollarSign,
  Flame,
  Layers,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    icon: Laptop,
    budget: 'Under ₹65,000',
    text: 'Lightweight laptop under ₹65,000 with 16GB RAM and long battery'
  },
  {
    category: 'Smartphones',
    tag: 'Photography',
    icon: Smartphone,
    budget: 'Under ₹30,000',
    text: 'Best phone under ₹30,000 with OIS camera, clean UI and fast charging'
  },
  {
    category: 'Audio',
    tag: 'Work & Travel',
    icon: Headphones,
    budget: 'Under ₹20,000',
    text: 'Wireless ANC headphones with multipoint Bluetooth under ₹20k'
  },
  {
    category: 'Gaming',
    tag: 'High Performance',
    icon: Cpu,
    budget: 'Under ₹95,000',
    text: 'Gaming laptop with RTX 4060 graphics under ₹95,000'
  }
];

const QUICK_BUDGET_QUERIES = [
  { label: '₹15k - ₹25k', query: 'Best budget smartphone with AMOLED display under 25000' },
  { label: '₹30k - ₹50k', query: 'Best mid-range all-rounder phone under 50000' },
  { label: '₹50k - ₹80k', query: 'Best ultrabook laptop for programming and multitasking under 80000' },
  { label: '₹1,00,000+', query: 'Top flagship laptop with 32GB RAM and OLED display' },
];

export default function Hero({ onSearch, isLoading }: HeroProps) {
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All Tech');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const rotatingPlaceholders = [
    "Ask anything... e.g., 'Best coding laptop under ₹70,000'",
    "e.g., 'Compare iPhone 15 vs Samsung S24 for battery & camera'",
    "e.g., 'Best noise-cancelling earbuds under ₹15,000'",
    "e.g., 'MacBook Air M3 vs Dell XPS 13 for design work'",
    "e.g., 'Best OLED gaming monitor with 144Hz+ under ₹40,000'"
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

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80 dark:from-[#060810] dark:via-[#0A0E1C] dark:to-[#060810] pt-14 pb-18 sm:pt-22 sm:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200" id="hero-section">
      {/* High-definition grid mesh background with radial mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_25%,#000_70%,transparent_100%)] opacity-50 dark:opacity-25 pointer-events-none" />

      {/* Dynamic multi-color ambient lighting orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[580px] pointer-events-none opacity-90 dark:opacity-40">
        <div className="absolute -top-24 left-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 dark:from-indigo-600/30 dark:to-purple-600/30 blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute top-8 right-1/4 w-[460px] h-[460px] rounded-full bg-gradient-to-bl from-cyan-400/25 to-blue-500/25 dark:from-cyan-500/25 dark:to-blue-600/25 blur-3xl" />
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[380px] h-[260px] rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-amber-500/20 dark:from-purple-600/20 dark:to-amber-500/15 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Badges Ribbon with Glass Sheen */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-7"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-black tracking-wider text-[#4F46E5] dark:text-indigo-300 uppercase bg-indigo-50/95 dark:bg-indigo-950/90 border border-indigo-200/90 dark:border-indigo-800/90 rounded-full shadow-xs backdrop-blur-xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F46E5]"></span>
            </span>
            <span>AI-Powered Tech Decision Engine</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black tracking-wider text-emerald-700 dark:text-emerald-300 uppercase bg-emerald-50/95 dark:bg-emerald-950/80 border border-emerald-200/90 dark:border-emerald-800/90 rounded-full shadow-xs backdrop-blur-xl">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Sponsor-Free Grounding
          </span>

          <span className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black tracking-wider text-amber-700 dark:text-amber-300 uppercase bg-amber-50/95 dark:bg-amber-950/80 border border-amber-200/90 dark:border-amber-800/90 rounded-full shadow-xs backdrop-blur-xl">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Indian Rupee (₹) Real-Time Matrix
          </span>
        </motion.div>

        {/* Dynamic Main Display Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-4 max-w-5xl mx-auto drop-shadow-xs"
        >
          Let's Find The Best{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B]">
            From Your Wallet.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
        >
          WiseFind synthesizes verified technical spec sheets, real-time benchmark metrics, and multi-store pricing in Indian Rupees (₹) to calculate your ideal tech match.
        </motion.p>

        {/* Interactive Category Selector Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-9 flex items-center justify-center gap-2 flex-wrap"
        >
          {CATEGORY_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const isSelected = activeChip === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white border-transparent shadow-lg shadow-[#4F46E5]/30 scale-105'
                    : 'bg-white/95 dark:bg-[#111627]/95 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Natural Language AI Search Box with Dynamic Outer Glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 max-w-3xl mx-auto relative"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B] opacity-30 dark:opacity-40 blur-2xl rounded-3xl" />
          
          <form 
            onSubmit={handleFormSubmit} 
            className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-2.5 sm:p-3 bg-white/95 dark:bg-[#101526]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700/90 focus-within:border-[#4F46E5] dark:focus-within:border-[#4F46E5] focus-within:ring-4 focus-within:ring-[#4F46E5]/20 transition-all duration-300"
          >
            <div className="hidden sm:flex px-4 text-[#4F46E5] dark:text-indigo-400 items-center shrink-0">
              <Search className="h-5 w-5" />
            </div>

            <div className="relative flex-1 flex items-center">
              <Search className="sm:hidden absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="hero-ai-search-input"
                placeholder={rotatingPlaceholders[placeholderIndex]}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="w-full py-3.5 pl-10 sm:pl-1 pr-8 sm:pr-4 text-xs sm:text-sm md:text-base bg-transparent border-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Clear input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              id="hero-ai-search-submit-btn"
              disabled={isLoading || !query.trim()}
              className="mt-2 sm:mt-0 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-lg shadow-indigo-500/30 shrink-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Ask WiseBot</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Budget Ranges Shortcuts */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">
              Quick Budget:
            </span>
            {QUICK_BUDGET_QUERIES.map((bq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(bq.query)}
                className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 hover:text-[#4F46E5] dark:hover:text-indigo-300 border border-slate-200/90 dark:border-slate-700/90 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                {bq.label}
              </button>
            ))}
          </div>

          {/* Quick Starter Prompts Grid */}
          <div className="mt-8 text-left">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#4F46E5] dark:text-indigo-400" />
                <span>Popular Buyer Inquiries</span>
              </p>
              <span className="text-[11px] text-slate-400 font-bold hidden sm:inline-block">Click any card to analyze instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CURATED_PROMPTS.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="text-left p-3.5 rounded-2xl bg-white/95 dark:bg-[#111627]/95 border border-slate-200/90 dark:border-slate-800/90 hover:border-[#4F46E5] dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-3 backdrop-blur-md"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-indigo-50 dark:bg-indigo-950/80 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-1">
                          <Icon className="h-2.5 w-2.5" />
                          {prompt.category}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 truncate">{prompt.tag}</span>
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded ml-auto">
                          {prompt.budget}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-300 line-clamp-1">
                        {prompt.text}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Wallet & Intelligence Feature Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-200/70 dark:border-slate-800 pt-10 sm:pt-14"
        >
          {/* Card 1: Performance Per Rupee Quotient */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/90 dark:bg-[#111627]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 mb-3">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight uppercase">Performance per Rupee</h3>
                <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Max Value per ₹1,000 Spent
                </span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              We mathematically rank hardware by computing raw processor benchmarks, battery endurance, and build quality against every single rupee spent.
            </p>
          </motion.div>

          {/* Card 2: Live Multi-Store Lowest Price Tracker */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/90 dark:bg-[#111627]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 mb-3">
              <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400 shrink-0 shadow-xs">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight uppercase">Live Store Price Tracker</h3>
                <span className="text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Amazon, Flipkart & Croma
                </span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Instant price comparison across top Indian authorized retailers with active coupon discounts, bank offers, and verified manufacturer warranties.
            </p>
          </motion.div>

          {/* Card 3: Zero-Hype AI Match Intelligence */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/90 dark:bg-[#111627]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 mb-3">
              <div className="h-11 w-11 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-100 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight uppercase">Zero-Hype AI Index</h3>
                <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Zero Paid Sponsor Bias
                </span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Get 100% unbiased recommendations tailored strictly to your workload and budget constraints, protecting you from overspending on marketing hype.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
