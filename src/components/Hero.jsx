import React, { useState } from 'react';
import { 
  Search, Bot, Sparkles, X, Check, ArrowRight, 
  Smartphone, Laptop, Headphones, Watch, Tablet, UtensilsCrossed,
  Globe, Mic, MicOff
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero({ onBrowseSearch, onAskWiseBot, onSelectCategory }) {
    const [query, setQuery] = useState('');
    const [isVoiceListening, setIsVoiceListening] = useState(false);

    const popularSuggestions = [
        "📱 iPhone 16 Pro vs Galaxy S24",
        "💻 MacBook Air M3 16GB",
        "🎧 Sony WH-1000XM5 Headphones",
        "⚡ Best camera phone under ₹40,000",
        "🔥 Air Fryer Deals under ₹6,000"
    ];

    const categoryShortcuts = [
        { label: 'Smartphones', icon: Smartphone, id: 'Smartphones', color: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-400' },
        { label: 'Laptops', icon: Laptop, id: 'Laptops', color: 'from-purple-500/10 to-violet-500/10 hover:border-purple-400' },
        { label: 'Audio & ANC', icon: Headphones, id: 'Audio', color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-400' },
        { label: 'Smartwatches', icon: Watch, id: 'Smartwatches', color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-400' },
        { label: 'Tablets', icon: Tablet, id: 'Tablets', color: 'from-pink-500/10 to-rose-500/10 hover:border-pink-400' },
        { label: 'Kitchen & Home', icon: UtensilsCrossed, id: 'Home Appliances', color: 'from-cyan-500/10 to-blue-500/10 hover:border-cyan-400' }
    ];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        if (onBrowseSearch) {
            onBrowseSearch(trimmed);
        } else if (onAskWiseBot) {
            onAskWiseBot(trimmed);
        }
    };

    const handleSuggestionClick = (text) => {
        const cleanQuery = text.replace(/^[\p{Emoji}\s]+/u, '').trim();
        setQuery(cleanQuery);
        if (onBrowseSearch) {
            onBrowseSearch(cleanQuery);
        } else if (onAskWiseBot) {
            onAskWiseBot(cleanQuery);
        }
    };

    const handleVoiceSearch = () => {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            alert("Voice search is not supported by your current browser. Please use Google Chrome or Microsoft Edge.");
            return;
        }
        try {
            const recognition = new SpeechRec();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            setIsVoiceListening(true);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                setIsVoiceListening(false);
                if (categoryScope !== 'All' && onSelectCategory) {
                    onSelectCategory(categoryScope);
                }
                if (onBrowseSearch) onBrowseSearch(transcript);
            };
            recognition.onerror = () => setIsVoiceListening(false);
            recognition.onend = () => setIsVoiceListening(false);
            recognition.start();
        } catch (err) {
            setIsVoiceListening(false);
        }
    };

    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 dark:from-[#05070E] dark:via-[#090D1C] dark:to-[#05070E] pt-12 pb-12 sm:pt-16 sm:pb-16 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200" id="hero-section">
        {/* Soft, luxury ambient glow and dot mesh without vertical stripe banding */}
        <div 
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient color auras */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[420px] pointer-events-none opacity-70 dark:opacity-40">
          <div className="absolute top-0 left-1/4 w-[400px] h-[360px] rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '6s' }}/>
          <div className="absolute top-12 right-1/4 w-[380px] h-[340px] rounded-full bg-gradient-to-bl from-amber-400/15 via-rose-500/15 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }}/>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* WiseFind Identity Badge with Exact Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35 }} 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#11172B]/90 border border-slate-200/90 dark:border-slate-700/90 shadow-xs backdrop-blur-xl mb-5 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors group cursor-default"
          >
            <img src="/logo.png" alt="WiseFind Logo" className="h-5 w-5 rounded-md object-cover transition-transform group-hover:scale-110"/>
            <span className="text-xs font-black tracking-wide text-slate-900 dark:text-slate-100">
              WiseFind
            </span>
          </motion.div>

          {/* Main Display Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.45, delay: 0.08 }} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.16] tracking-tight mb-3 drop-shadow-xs max-w-4xl mx-auto"
          >
            <span className="block">
              Let's Find The Best
            </span>
            <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B]">
              From Your Wallet.
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.12 }} 
            className="mb-4"
          >
            <span className="inline-block text-xs sm:text-sm font-black tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B]">
              FIND SMARTER. CHOOSE WISELY.
            </span>
          </motion.div>
          
          {/* Simple, relatable human description */}
          <motion.p 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.45, delay: 0.16 }} 
            className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6"
          >
            Stop second-guessing your purchases. Compare verified store prices across Amazon, Flipkart, Meesho, Myntra, Croma & Reliance, decode confusing specifications, and find the smartest options for your budget.
          </motion.p>

          {/* Universal Store Network Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto mb-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-extrabold mr-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Comparing Live:</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FF9900]/15 text-[#FF9900] border border-[#FF9900]/30 font-bold">Amazon</span>
            <span className="px-2 py-0.5 rounded-md bg-[#2874F0]/15 text-[#60A5FA] border border-[#2874F0]/30 font-bold">Flipkart</span>
            <span className="px-2 py-0.5 rounded-md bg-[#F43397]/15 text-[#F472B6] border border-[#F43397]/30 font-bold">Meesho</span>
            <span className="px-2 py-0.5 rounded-md bg-[#FF3F6C]/15 text-[#FDA4AF] border border-[#FF3F6C]/30 font-bold">Myntra</span>
            <span className="px-2 py-0.5 rounded-md bg-[#00E9BF]/15 text-[#2DD4BF] border border-[#00E9BF]/30 font-bold">Croma</span>
            <span className="px-2 py-0.5 rounded-md bg-[#E42529]/15 text-[#F87171] border border-[#E42529]/30 font-bold">Reliance</span>
          </div>

          {/* Browse Sections Search Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.45, delay: 0.2 }} 
            className="max-w-3xl mx-auto relative mb-6"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B] opacity-20 dark:opacity-30 blur-lg rounded-3xl pointer-events-none"/>
            
            <form 
              onSubmit={handleFormSubmit} 
              className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-2 sm:p-2.5 bg-white dark:bg-[#11172A] backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700/90 focus-within:border-[#4F46E5] focus-within:ring-4 focus-within:ring-[#4F46E5]/15 transition-all duration-150"
            >
              <div className="hidden sm:flex pl-3.5 pr-2 text-indigo-600 dark:text-indigo-400 items-center shrink-0">
                <Search className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8]"/>
              </div>

              <div className="relative flex-1 flex items-center">
                <Search className="sm:hidden absolute left-3.5 h-4 w-4 text-[#4F46E5] dark:text-[#818CF8]"/>
                <input 
                  type="text" 
                  id="hero-browse-input" 
                  placeholder="Search products across Flipkart, Amazon, Meesho, Myntra, Croma (e.g. 'OnePlus 13', 'MacBook Air', 'air fryer')..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  className="w-full py-3.5 pl-10 sm:pl-2 pr-14 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                />

                {/* Voice Search Mic Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`absolute right-8 p-1.5 rounded-full transition-all cursor-pointer ${
                    isVoiceListening 
                      ? 'bg-rose-500/20 text-rose-500 animate-pulse' 
                      : 'text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'
                  }`}
                  title={isVoiceListening ? "Listening..." : "Search by voice"}
                >
                  <Mic className="h-4 w-4" />
                </button>

                {query && (
                  <button 
                    type="button" 
                    onClick={() => setQuery('')} 
                    className="absolute right-2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" 
                    title="Clear input"
                  >
                    <X className="h-4 w-4"/>
                  </button>
                )}
              </div>

              <button 
                type="submit" 
                id="hero-browse-submit-btn" 
                disabled={!query.trim()} 
                className="mt-2 sm:mt-0 px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white rounded-xl font-black text-xs sm:text-sm tracking-wide transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md shadow-indigo-500/25 shrink-0"
              >
                <Sparkles className="h-4 w-4 text-amber-300"/>
                <span>Browse Products</span>
              </button>
            </form>
          </motion.div>

          {/* Quick Category Launchers */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-4">
            {categoryShortcuts.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory ? onSelectCategory(cat.id) : (onBrowseSearch && onBrowseSearch(cat.id))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer group"
                >
                  <Icon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-150" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Helpful Ideas */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Popular Searches:</span>
            </span>
            {popularSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer shadow-2xs"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Clean Trust Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500 stroke-[3]"/>
              <span>100% Unbiased Advice</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-indigo-500 stroke-[3]"/>
              <span>Live Indian Store Deals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-amber-500 stroke-[3]"/>
              <span>Bank Discounts Auto-Applied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-purple-500 stroke-[3]"/>
              <span>Free to use forever</span>
            </div>
          </div>

        </div>
      </div>
    );
}
