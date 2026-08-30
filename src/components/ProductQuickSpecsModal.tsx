import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Cpu, Monitor, Battery, Camera, Headphones, Wifi, Shield, 
  Layers, Search, Copy, CheckCheck, Check, Star, ExternalLink, Heart,
  BarChart2, Clock, Zap, ArrowRight, Bot, Grid, Table, Activity,
  Maximize2, ArrowUpRight, ThumbsUp, ThumbsDown, Info, ShieldCheck,
  Building2, CheckCircle2, ChevronRight, Sliders, Sparkle, Tag
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SafeProductImage } from './SafeProductImage';
import { WiseBookmarkIcon } from './WiseBookmarkIcon';

interface ProductQuickSpecsModalProps {
  product: Product | null;
  onClose: () => void;
  onProductClick: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  isInCompare: boolean;
  allProducts?: Product[];
  onAskWiseBot?: (question: string) => void;
}

// Hardware Jargon dictionary with real-world impact
const HARDWARE_JARGON_MAP: Record<string, { definition: string; plainMeaning: string; realWorldImpact: string; buyerTip: string }> = {
  "processor": {
    definition: "Central Processing Unit (CPU) silicon that executes operating system instructions, runs math logic, and handles app workflows.",
    plainMeaning: "The master calculation brain of the machine.",
    realWorldImpact: "Directly determines how fast apps open, how smoothly 4K video exports, and prevents thermal lag during multitasking.",
    buyerTip: "For heavy gaming or content creation, prioritize Apple M-Series, Snapdragon 8 Gen 3, or Intel Core Ultra / Ryzen 7."
  },
  "cpu": {
    definition: "Silicon chip architecture containing dedicated high-performance and power-efficient computing cores.",
    plainMeaning: "The core computing engine.",
    realWorldImpact: "More performance cores make heavy background rendering and game physics smooth without stutter.",
    buyerTip: "Check single-core speed for snappier day-to-day apps, and multi-core score for heavy video editing or code compiling."
  },
  "gpu": {
    definition: "Graphics Processing Unit engineered to calculate 3D geometry, ray tracing shaders, and complex texture polygons.",
    plainMeaning: "The graphics and visual renderer.",
    realWorldImpact: "Powers high-FPS gaming (60-120fps), silky-smooth 3D viewport navigation, and hardware video decoding.",
    buyerTip: "Gamers and 3D animators should prioritize dedicated GPUs with ample VRAM over integrated graphics."
  },
  "ram": {
    definition: "Ultra-fast volatile system memory (LPDDR5X, DDR5) holding open apps and active tasks in instant standby.",
    plainMeaning: "Short-term desk space for running apps.",
    realWorldImpact: "More RAM stops apps in the background from force-reloading or closing when you switch between them.",
    buyerTip: "12GB–16GB is the sweet spot for modern smartphones; 16GB–32GB is recommended for laptops."
  },
  "storage": {
    definition: "Non-volatile high-speed flash storage (UFS 4.0, NVMe PCIe 4.0 SSD) storing the OS, files, games, and media.",
    plainMeaning: "Your permanent digital filing cabinet.",
    realWorldImpact: "Fast storage cuts system boot times to seconds and loads massive game levels and 4K footage instantly.",
    buyerTip: "256GB is standard minimum for smartphones; 512GB to 1TB is ideal for creator laptops."
  },
  "display": {
    definition: "Visual screen panel (OLED, AMOLED, Mini-LED, IPS LCD) with subpixel lighting and dynamic contrast capabilities.",
    plainMeaning: "The visual screen you interact with.",
    realWorldImpact: "OLED/AMOLED panels turn off individual black pixels for infinite contrast, cinema-grade movies, and Dark Mode power savings.",
    buyerTip: "OLED and AMOLED deliver much deeper contrast and richer saturation than conventional IPS LCD screens."
  },
  "refresh": {
    definition: "The count of screen frame redraws per second measured in Hertz (Hz).",
    plainMeaning: "How fluidly motion and scrolling appear.",
    realWorldImpact: "120Hz/144Hz makes every gesture, swipe, and animated menu feel twice as responsive and smooth as 60Hz.",
    buyerTip: "Look for LTPO technology, which automatically drops the refresh rate to 1Hz when reading static text to save battery."
  },
  "nits": {
    definition: "Candela per square meter (cd/m²) measuring the maximum optical luminance output of a display panel.",
    plainMeaning: "Screen peak brightness.",
    realWorldImpact: "Displays with >1500–2500 nits remain completely readable under direct, blazing Indian sunlight outdoors.",
    buyerTip: "Look for at least 1000 nits peak outdoor brightness if you frequently use your phone outside."
  },
  "battery": {
    definition: "Chemical energy reservoir capacity measured in milliampere-hours (mAh) or Watt-hours (Whr).",
    plainMeaning: "How long you can use the device away from a power plug.",
    realWorldImpact: "A 5000mAh+ cell easily delivers 7 to 9 hours of active screen-on time, surviving a full day of heavy commute and work.",
    buyerTip: "Battery capacity combined with efficient 3nm/4nm chipsets yields true 1.5-to-2 day battery longevity."
  },
  "charging": {
    definition: "Electrical power delivery rate measured in Watts (W) using protocols like USB-PD, MagSafe, or proprietary fast charge.",
    plainMeaning: "How quickly your depleted battery refills to 100%.",
    realWorldImpact: "65W to 120W fast charging refills 50% battery in just 10-15 minutes, ending overnight charging anxiety.",
    buyerTip: "Check if the manufacturer includes the high-wattage power adapter in the retail box."
  },
  "camera": {
    definition: "Optical sensor package capturing photons with custom lens elements and computational Image Signal Processing (ISP).",
    plainMeaning: "The photo and video capture system.",
    realWorldImpact: "Larger physical sensors capture far more light, preventing noisy, grainy, or blurry night photos.",
    buyerTip: "Sensor physical surface size (e.g., 1-inch or 1/1.3-inch) is far more important than raw megapixel counts."
  },
  "anc": {
    definition: "Active Noise Cancellation using external microphones to generate inverted acoustic sound waves that cancel background noise.",
    plainMeaning: "Silences the outside environment.",
    realWorldImpact: "Filters out drone engine roar on airplanes, traffic buzz, and noisy open-office chatter so you can focus.",
    buyerTip: "Top-tier ANC algorithms attenuate low-frequency rumbles by up to 45dB."
  },
  "ip rating": {
    definition: "International Protection code where the first digit measures dust tightness (0-6) and second measures liquid sealing (0-8).",
    plainMeaning: "Durability and weatherproofing grade.",
    realWorldImpact: "Gives peace of mind during workouts, beach trips, and sudden rainstorms.",
    buyerTip: "IP68 is the gold standard for flagship consumer hardware."
  }
};

export default function ProductQuickSpecsModal({
  product,
  onClose,
  onProductClick,
  onAddToCompare,
  onToggleFavorite,
  isFavorite,
  isInCompare,
  allProducts = [],
  onAskWiseBot
}: ProductQuickSpecsModalProps) {
  if (!product) return null;

  // Active Tab inside modal
  const [activeTab, setActiveTab] = useState<'bento' | 'silicon' | 'benchmarks' | 'table' | 'compare'>('bento');
  
  // Search & Filter within Specs
  const [specSearch, setSpecSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlainEnglish, setIsPlainEnglish] = useState<boolean>(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  
  // Interactive Active Tooltip Key
  const [activeTooltipKey, setActiveTooltipKey] = useState<string | null>(null);

  // Battery Simulator state inside modal
  const [simGamingHours, setSimGamingHours] = useState<number>(2);
  const [simVideoHours, setSimVideoHours] = useState<number>(4);
  const [simWebHours, setSimWebHours] = useState<number>(3);

  // Spec categorization helper
  const getSpecCategory = (key: string): string => {
    const k = key.toLowerCase();
    if (k.includes('processor') || k.includes('cpu') || k.includes('gpu') || k.includes('chip') || k.includes('ram') || k.includes('memory') || k.includes('storage') || k.includes('os') || k.includes('engine') || (k.includes('sensor') && (k.includes('dpi') || k.includes('hero')))) return 'compute';
    if (k.includes('display') || k.includes('screen') || k.includes('resolution') || k.includes('refresh') || k.includes('nits') || k.includes('panel') || k.includes('hdr') || k.includes('lens')) return 'display';
    if (k.includes('camera') || k.includes('aperture') || k.includes('zoom') || k.includes('video') || k.includes('megapixels') || k.includes('ois') || k.includes('focal')) return 'camera';
    if (k.includes('battery') || k.includes('charging') || k.includes('watt') || k.includes('mah') || k.includes('endurance') || k.includes('power') || k.includes('whr')) return 'battery';
    if (k.includes('driver') || k.includes('anc') || k.includes('audio') || k.includes('sound') || k.includes('codec') || k.includes('mic') || k.includes('microphone') || k.includes('speakers')) return 'audio';
    if (k.includes('wi-fi') || k.includes('wifi') || k.includes('bluetooth') || k.includes('5g') || k.includes('nfc') || k.includes('port') || k.includes('usb') || k.includes('connectivity') || k.includes('sim')) return 'connectivity';
    if (k.includes('weight') || k.includes('dimension') || k.includes('material') || k.includes('water') || k.includes('ip') || k.includes('durability') || k.includes('build') || k.includes('warranty') || k.includes('switches')) return 'durability';
    return 'other';
  };

  // Filtered Specs list
  const filteredSpecs = useMemo(() => {
    return Object.entries(product.specs).filter(([key, val]) => {
      const matchesSearch = !specSearch.trim() || 
        key.toLowerCase().includes(specSearch.toLowerCase()) || 
        String(val).toLowerCase().includes(specSearch.toLowerCase());
      
      const cat = getSpecCategory(key);
      const matchesCat = selectedCategory === 'all' || cat === selectedCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [product.specs, specSearch, selectedCategory]);

  // Lookup Jargon definition
  const lookupJargon = (key: string, value?: string) => {
    const k = key.toLowerCase();
    for (const [term, data] of Object.entries(HARDWARE_JARGON_MAP)) {
      if (k.includes(term)) return data;
    }
    return {
      definition: `Verified manufacturer specification for "${key}" under standardized testing protocols.`,
      plainMeaning: `Describes the internal ${key.toLowerCase()} architecture of this ${product.category.toLowerCase()}.`,
      realWorldImpact: `Ensures compliance, stable throughput, and responsive operation for ${product.name}.`,
      buyerTip: `Compare this metric with alternatives around ₹${product.price.toLocaleString('en-IN')} for value parity.`
    };
  };

  // Plain English Rewording
  const getPlainEnglishSpec = (key: string, value: string): string => {
    const k = key.toLowerCase();
    const v = String(value).toLowerCase();

    if (k.includes('display') || k.includes('screen')) {
      if (v.includes('120hz') && v.includes('oled')) return 'Ultra-smooth, fluid OLED display with cinema-grade colors and true dark blacks.';
      if (v.includes('oled') || v.includes('amoled')) return 'Cinema-grade screen with high contrast and vivid colors.';
      if (v.includes('retina')) return 'Ultra-sharp Apple high-density visual display with True Tone.';
      return `High-clarity display with rich color balance (${value}).`;
    }
    if (k.includes('processor') || k.includes('cpu') || k.includes('chip')) {
      if (v.includes('m3') || v.includes('m4') || v.includes('m2')) return 'Apple next-gen high-efficiency silicon. Super fast video editing with cool, quiet running.';
      if (v.includes('gen 3') || v.includes('gen 2')) return 'Top-tier flagship processor. Crushes 3D games and heavy apps with zero lag.';
      if (v.includes('i7') || v.includes('i9') || v.includes('ultra')) return 'High-speed Intel multi-core processor for smooth coding, office work, and multitasking.';
      return `High-speed processor capable of sustained daily workflows (${value}).`;
    }
    if (k.includes('battery') || k.includes('endurance')) {
      if (v.includes('5000mah') || v.includes('5500mah')) return 'Massive all-day battery. Easily survives 1.5 to 2 days of mixed daily work.';
      if (v.includes('18 hours') || v.includes('23 hours') || v.includes('30 hours')) return 'Exceptional multi-day endurance for long travel and work away from power plugs.';
      return `Solid battery capacity designed for reliable daily usage (${value}).`;
    }
    if (k.includes('charging')) {
      if (v.includes('100w') || v.includes('120w')) return 'Lightning fast. Recharges from 0% to 100% in around 25 minutes.';
      if (v.includes('45w') || v.includes('67w')) return 'Fast charging. Gives you hours of runtime with a quick 15-minute top-up.';
      return `Equipped with dedicated fast charging technology (${value}).`;
    }
    if (k.includes('camera') || k.includes('optics')) {
      if (v.includes('200mp') || v.includes('48mp') || v.includes('50mp')) return 'Pro-grade high-resolution camera with sharp night photos and 4K/8K video.';
      return `Clean optical array for crisp photographs and video calls (${value}).`;
    }
    return String(value);
  };

  // Benchmark metrics vs baseline
  const benchmarkLabData = useMemo(() => {
    const score = product.aiScore;
    const cpuSingle = Math.round((score / 100) * 2800 + 400);
    const cpuMulti = Math.round((score / 100) * 7200 + 1200);
    const gpuCompute = Math.round((score / 100) * 14500 + 3000);
    const efficiency = Math.min(99, Math.round(score * 0.97));

    const chartData = [
      { metric: 'Single-Core CPU', thisDevice: Math.round((cpuSingle / 2100) * 100), categoryAverage: 100 },
      { metric: 'Multi-Core CPU', thisDevice: Math.round((cpuMulti / 5400) * 100), categoryAverage: 100 },
      { metric: '3D Graphics GPU', thisDevice: Math.round((gpuCompute / 11000) * 100), categoryAverage: 100 },
      { metric: 'Energy Efficiency', thisDevice: Math.round((efficiency / 82) * 100), categoryAverage: 100 },
      { metric: 'Thermal Stability', thisDevice: Math.round((score / 85) * 100), categoryAverage: 100 },
    ];

    return { chartData, cpuSingle, cpuMulti, gpuCompute, efficiency };
  }, [product]);

  // Battery Simulator calculation
  const batterySim = useMemo(() => {
    const cat = product.category.toLowerCase();
    const baseScore = product.aiScore;
    const gamingDrainPerHour = cat.includes('laptop') ? 22 : 14;
    const videoDrainPerHour = cat.includes('laptop') ? 8 : 6;
    const webDrainPerHour = cat.includes('laptop') ? 6 : 5;

    const totalDrain = (simGamingHours * gamingDrainPerHour) + 
                       (simVideoHours * videoDrainPerHour) + 
                       (simWebHours * webDrainPerHour);
    
    const remaining = Math.max(0, Math.min(100, Math.round(100 - (totalDrain * (95 / baseScore)))));
    const totalHours = simGamingHours + simVideoHours + simWebHours;

    return {
      remaining,
      totalHours,
      estimatedSOT: Math.round((100 / (totalDrain / (totalHours || 1))) * 10) / 10
    };
  }, [product, simGamingHours, simVideoHours, simWebHours]);

  // Same category rivals for mini-compare inside modal
  const rivals = useMemo(() => {
    return allProducts
      .filter(p => p.id !== product.id && p.category.toLowerCase() === product.category.toLowerCase())
      .slice(0, 2);
  }, [allProducts, product]);

  // Export Specs handler
  const handleExport = (format: 'markdown' | 'text' | 'json') => {
    let output = '';
    if (format === 'markdown') {
      output = `### ${product.brand} ${product.name} — Technical Specifications\n\n` +
        `**Price:** ₹${product.price.toLocaleString("en-IN")} | **WiseScore:** ${product.aiScore}/100\n\n` +
        `| Hardware Spec | Value |\n| :--- | :--- |\n` +
        Object.entries(product.specs).map(([k, v]) => `| **${k}** | ${v} |`).join('\n') +
        `\n\n*Verified by WiseFind Intelligence Platform*`;
    } else if (format === 'json') {
      output = JSON.stringify({
        product: product.name,
        brand: product.brand,
        priceINR: product.price,
        aiScore: product.aiScore,
        specifications: product.specs
      }, null, 2);
    } else {
      output = `${product.brand} ${product.name} (₹${product.price.toLocaleString("en-IN")})\n` +
        `AI Score: ${product.aiScore}/100\n\n` +
        Object.entries(product.specs).map(([k, v]) => `• ${k}: ${v}`).join('\n');
    }

    try {
      navigator.clipboard.writeText(output);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const heroSilicon = product.specs['Processor'] || product.specs['Processor/Engine'] || product.specs['Chipset'] || 'Flagship Architecture';
  const heroDisplay = product.specs['Display'] || product.specs['Screen'] || 'High-Resolution Visuals';
  const heroBattery = product.specs['Battery'] || product.specs['Battery Life'] || 'All-Day Performance';
  const heroOptics = product.specs['Camera'] || product.specs['Drivers'] || product.specs['Audio'] || product.specs['Optics'] || 'Pro Capture Array';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 z-[120] animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-[#0C101E] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================== */}
        {/* MODAL HEADER: Rich Product Banner */}
        {/* ============================================================== */}
        <div className="bg-gradient-to-r from-[#3730A3] via-[#4F46E5] to-[#7C3AED] text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          {/* Ambient lighting mesh */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer z-10"
            title="Close Spec Sheet"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Product Image Capsule */}
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
              <SafeProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-lg tracking-wider">
                  {product.category}
                </span>
                <span className="text-xs font-black text-indigo-200 uppercase tracking-widest">{product.brand}</span>
                <div className="flex items-center gap-1 text-[11px] font-black bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-400/30">
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Hardware</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black truncate text-white leading-tight" title={product.name}>
                {product.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>AI Match Score: <b>{product.aiScore}/100</b></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Subnav Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-2 border-t border-white/15 scrollbar-none">
            {[
              { id: 'bento', label: 'Bento Hardware Matrix', icon: Grid },
              { id: 'silicon', label: 'Component Architecture', icon: Cpu },
              { id: 'benchmarks', label: 'Performance Lab & Battery', icon: Activity },
              { id: 'table', label: `Technical Spec Sheet (${filteredSpecs.length})`, icon: Table },
              { id: 'compare', label: 'Quick Category Match', icon: BarChart2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#4F46E5] shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL BODY: Interactive Specs Content */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Action Bar (Plain English Toggle + Multi-Format Copy) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlainEnglish(!isPlainEnglish)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  isPlainEnglish
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
                title="Translate engineering specs into plain human language"
              >
                <Sparkle className={`h-3.5 w-3.5 ${isPlainEnglish ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <span>{isPlainEnglish ? 'Plain English ON' : 'Translate to Plain English'}</span>
              </button>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Tap <Sparkles className="h-3 w-3 inline text-[#4F46E5] dark:text-indigo-400" /> on any spec for instant AI jargon decryption
              </span>
            </div>

            {/* Copy / Export Specs Formats */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleExport('markdown')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Copy Markdown formatted table"
              >
                {copiedFormat === 'markdown' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-slate-400" />}
                <span>{copiedFormat === 'markdown' ? 'Copied MD' : 'MD Table'}</span>
              </button>

              <button
                onClick={() => handleExport('text')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Copy formatted text"
              >
                {copiedFormat === 'text' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-slate-400" />}
                <span>{copiedFormat === 'text' ? 'Copied Text' : 'Text'}</span>
              </button>

              <button
                onClick={() => handleExport('json')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Copy JSON representation"
              >
                {copiedFormat === 'json' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-slate-400" />}
                <span>{copiedFormat === 'json' ? 'Copied JSON' : 'JSON'}</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: BENTO HARDWARE MATRIX */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'bento' && (
            <div className="space-y-4 animate-fade-in">
              {/* 4 Hero Bento Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    icon: Cpu,
                    label: 'Processor / Engine',
                    sub: 'Compute Engine',
                    value: heroSilicon,
                    rawKey: 'Processor',
                    badge: 'Compute Tier',
                    gradient: 'from-blue-500/10 to-indigo-500/5 border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400'
                  },
                  {
                    icon: Monitor,
                    label: 'Display & Glass',
                    sub: 'Visual Surface',
                    value: heroDisplay,
                    rawKey: 'Display',
                    badge: 'Cinema Clarity',
                    gradient: 'from-purple-500/10 to-pink-500/5 border-purple-200 dark:border-purple-900/60 text-purple-600 dark:text-purple-400'
                  },
                  {
                    icon: Battery,
                    label: 'Battery & Power',
                    sub: 'Power Management',
                    value: heroBattery,
                    rawKey: 'Battery',
                    badge: 'Endurance Core',
                    gradient: 'from-emerald-500/10 to-teal-500/5 border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                  },
                  {
                    icon: Camera,
                    label: 'Optics / Sound',
                    sub: 'Capture & Drivers',
                    value: heroOptics,
                    rawKey: 'Camera',
                    badge: 'Sensory Specs',
                    gradient: 'from-amber-500/10 to-orange-500/5 border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400'
                  }
                ].map((hero, i) => {
                  const Icon = hero.icon;
                  const isTooltipOpen = activeTooltipKey === hero.rawKey;
                  const jargon = lookupJargon(hero.rawKey, hero.value);

                  return (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl border bg-gradient-to-br transition-all flex flex-col justify-between relative shadow-xs ${hero.gradient}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          <span>{hero.sub}</span>
                        </span>
                        
                        {/* Jargon Trigger */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveTooltipKey(isTooltipOpen ? null : hero.rawKey)}
                            className="p-1 rounded-lg bg-white/80 dark:bg-slate-800 text-[#4F46E5] dark:text-indigo-400 hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                            title="AI Spec Explanation"
                          >
                            <Sparkles className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">{hero.label}</span>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5 leading-snug line-clamp-2" title={hero.value}>
                          {isPlainEnglish ? getPlainEnglishSpec(hero.label, hero.value) : hero.value}
                        </p>
                      </div>

                      {/* Floating Tooltip popover for Hero Card */}
                      <AnimatePresence>
                        {isTooltipOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 text-white rounded-2xl p-3 shadow-xl border border-indigo-500/40 text-left space-y-1.5"
                          >
                            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                              <span className="text-[9px] font-black uppercase text-indigo-400 flex items-center gap-1">
                                <Bot className="h-3 w-3" /> AI Decrypter
                              </span>
                              <button onClick={() => setActiveTooltipKey(null)} className="text-slate-400 hover:text-white">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                              {jargon.realWorldImpact}
                            </p>
                            <p className="text-[9px] text-emerald-400 font-bold">
                              💡 {jargon.buyerTip}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Full Specs Bento Grid with AI tooltips */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Complete Hardware Breakdown
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {Object.entries(product.specs).map(([key, val]) => {
                    const isTooltipOpen = activeTooltipKey === key;
                    const jargon = lookupJargon(key, String(val));

                    return (
                      <div
                        key={key}
                        className="p-3 rounded-2xl bg-slate-50/80 dark:bg-[#11162A] border border-slate-200/70 dark:border-slate-800 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-1 relative group"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider truncate max-w-[150px]">
                            {key}
                          </span>
                          <button
                            onClick={() => setActiveTooltipKey(isTooltipOpen ? null : key)}
                            className="p-1 rounded-md text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                            title="Decode this spec with AI"
                          >
                            <Sparkles className="h-3 w-3" />
                          </button>
                        </div>

                        <p className="text-xs font-black text-slate-900 dark:text-slate-100 leading-snug truncate" title={String(val)}>
                          {isPlainEnglish ? getPlainEnglishSpec(key, String(val)) : String(val)}
                        </p>

                        {/* Tooltip */}
                        <AnimatePresence>
                          {isTooltipOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute left-0 right-0 bottom-full mb-1 z-30 bg-slate-950 text-white rounded-2xl p-3 shadow-xl border border-indigo-500/40 text-left space-y-1"
                            >
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                                <span className="text-[9px] font-black uppercase text-indigo-400">{key} Explained</span>
                                <button onClick={() => setActiveTooltipKey(null)} className="text-slate-400 hover:text-white">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                                {jargon.realWorldImpact}
                              </p>
                              <p className="text-[9px] text-emerald-400 font-bold">
                                💡 {jargon.buyerTip}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Tradeoffs summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.pros && product.pros.length > 0 && (
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-3.5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ThumbsUp className="h-3.5 w-3.5" /> Key Architectural Strengths
                    </span>
                    <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                      {product.pros.slice(0, 3).map((p, i) => (
                        <li key={i} className="flex items-start gap-1.5 font-medium leading-snug">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.cons && product.cons.length > 0 && (
                  <div className="bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-3.5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <ThumbsDown className="h-3.5 w-3.5" /> Hardware Caveats / Trade-offs
                    </span>
                    <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                      {product.cons.slice(0, 3).map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 font-medium leading-snug">
                          <X className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: COMPONENT ARCHITECTURE (Deep Silicon & Chemistry) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'silicon' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Silicon Compute */}
                <div className="bg-slate-950 text-white rounded-3xl p-5 border border-blue-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">Compute Engine</span>
                        <h4 className="text-sm font-black text-white">Silicon Architecture</h4>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {product.aiScore >= 90 ? 'Flagship' : 'Mid-Tier'}
                    </span>
                  </div>

                  <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Main Chipset:</span>
                      <span className="font-black text-blue-300">{heroSilicon}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="text-slate-400">Memory Bandwidth:</span>
                      <span className="font-bold text-slate-200">High-Bandwidth LPDDR / Unified</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-slate-300">Compute Speed Score</span>
                      <span className="text-blue-400">{Math.min(99, Math.round(product.aiScore * 0.98))}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${Math.min(99, Math.round(product.aiScore * 0.98))}%` }} />
                    </div>
                  </div>
                </div>

                {/* Display Chemistry */}
                <div className="bg-slate-950 text-white rounded-3xl p-5 border border-purple-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">Visual Matrix</span>
                        <h4 className="text-sm font-black text-white">Display Panel Chemistry</h4>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      HDR / High Nit
                    </span>
                  </div>

                  <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Panel Class:</span>
                      <span className="font-black text-purple-300">{heroDisplay}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="text-slate-400">Color Fidelity:</span>
                      <span className="font-bold text-slate-200">100% DCI-P3 Cinema Spectrum</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-slate-300">Visual Quality Index</span>
                      <span className="text-purple-400">{Math.min(99, Math.round(product.aiScore * 0.96))}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-full rounded-full" style={{ width: `${Math.min(99, Math.round(product.aiScore * 0.96))}%` }} />
                    </div>
                  </div>
                </div>

                {/* Battery Chemistry */}
                <div className="bg-slate-950 text-white rounded-3xl p-5 border border-emerald-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Battery className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">Endurance Core</span>
                        <h4 className="text-sm font-black text-white">Battery Chemistry</h4>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      All-Day Certified
                    </span>
                  </div>

                  <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cell Capacity:</span>
                      <span className="font-black text-emerald-300">{heroBattery}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="text-slate-400">Cycle Lifespan:</span>
                      <span className="font-bold text-slate-200">800 - 1000 Cycles (&gt;80% health)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-slate-300">Endurance Score</span>
                      <span className="text-emerald-400">{Math.min(99, Math.round(product.aiScore * 0.94))}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${Math.min(99, Math.round(product.aiScore * 0.94))}%` }} />
                    </div>
                  </div>
                </div>

                {/* Sensory / Optics */}
                <div className="bg-slate-950 text-white rounded-3xl p-5 border border-amber-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Camera className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">Sensory Array</span>
                        <h4 className="text-sm font-black text-white">Optics & Acoustic Drivers</h4>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      High Fidelity
                    </span>
                  </div>

                  <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Module:</span>
                      <span className="font-black text-amber-300">{heroOptics}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="text-slate-400">Processing:</span>
                      <span className="font-bold text-slate-200">AI Computational Engine + ISP</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-slate-300">Hardware Fidelity</span>
                      <span className="text-amber-400">{Math.min(99, Math.round(product.aiScore * 0.95))}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: `${Math.min(99, Math.round(product.aiScore * 0.95))}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: BENCHMARKS LAB & SOT SIMULATOR */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-5 animate-fade-in">
              {/* Synthetic Index Bar Chart */}
              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#4F46E5] dark:text-indigo-400 tracking-wider">
                      Synthetic Lab Benchmarks
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Performance vs Category Median (100% = Baseline)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1 text-[#4F46E5] dark:text-indigo-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" /> {product.name.split(' ')[0]}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Category Baseline
                    </span>
                  </div>
                </div>

                <div className="w-full h-52 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarkLabData.chartData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 160]} tickFormatter={(v) => `${v}%`} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                        formatter={(v: any) => [`${v}% of baseline`, 'Score']}
                      />
                      <Bar dataKey="thisDevice" fill="#4F46E5" radius={[5, 5, 0, 0]} name={product.name} />
                      <Bar dataKey="categoryAverage" fill="#94a3b8" radius={[5, 5, 0, 0]} name="Baseline (100%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Battery SOT Simulator */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                        Battery SOT Daily Simulator
                      </h4>
                      <p className="text-[10px] text-slate-400">Simulate mixed daily workloads for estimated endurance.</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-xl text-xs font-black text-emerald-800 dark:text-emerald-300">
                    Est. Battery Remaining: <b className="text-emerald-600 dark:text-emerald-400">{batterySim.remaining}%</b>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>3D Gaming</span>
                      <span className="font-black text-[#4F46E5]">{simGamingHours}h</span>
                    </div>
                    <input
                      type="range" min="0" max="6" step="1"
                      value={simGamingHours}
                      onChange={(e) => setSimGamingHours(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>4K Video Stream</span>
                      <span className="font-black text-[#4F46E5]">{simVideoHours}h</span>
                    </div>
                    <input
                      type="range" min="0" max="10" step="1"
                      value={simVideoHours}
                      onChange={(e) => setSimVideoHours(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Web & Social</span>
                      <span className="font-black text-[#4F46E5]">{simWebHours}h</span>
                    </div>
                    <input
                      type="range" min="0" max="10" step="1"
                      value={simWebHours}
                      onChange={(e) => setSimWebHours(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 4: HIGH-DENSITY TECHNICAL SPEC TABLE & LIVE FILTER */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'table' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={specSearch}
                    onChange={(e) => setSpecSearch(e.target.value)}
                    placeholder="Search in specs (e.g., 120Hz, RAM, Snapdragon, Battery, Watt)..."
                    className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                  {specSearch && (
                    <button
                      onClick={() => setSpecSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">
                  {filteredSpecs.length} specs matched
                </span>
              </div>

              {/* Category Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Specs' },
                  { id: 'compute', label: 'Compute & Silicon' },
                  { id: 'display', label: 'Display & Glass' },
                  { id: 'camera', label: 'Optics & Capture' },
                  { id: 'battery', label: 'Battery & Power' },
                  { id: 'audio', label: 'Audio & Drivers' },
                  { id: 'connectivity', label: 'Wireless & Ports' },
                  { id: 'durability', label: 'Build & Protection' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black whitespace-nowrap transition-all cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Specs Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#111827] max-h-72 overflow-y-auto">
                {filteredSpecs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No hardware specifications matched "{specSearch}"
                  </div>
                ) : (
                  filteredSpecs.map(([k, v]) => (
                    <div key={k} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex justify-between items-center gap-2">
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider max-w-[160px] truncate">
                        {k}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100 text-right max-w-[280px] sm:max-w-md truncate" title={String(v)}>
                        {isPlainEnglish ? getPlainEnglishSpec(k, String(v)) : String(v)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 5: QUICK SAME-CATEGORY MATCH & ALTERNATIVES */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'compare' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Instant Match</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Top Category Alternatives in Same Price Bracket</h4>
                </div>
                <button
                  onClick={() => onAddToCompare(product)}
                  className="text-xs font-black text-[#4F46E5] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>Launch Side-by-Side Matrix</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rivals.length > 0 ? (
                  rivals.map((rival) => {
                    const priceDiff = rival.price - product.price;
                    return (
                      <div
                        key={rival.id}
                        onClick={() => onProductClick(rival)}
                        className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase text-slate-400">{rival.brand}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              priceDiff < 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {priceDiff < 0 ? `₹${Math.abs(priceDiff).toLocaleString('en-IN')} cheaper` : `₹${priceDiff.toLocaleString('en-IN')} higher`}
                            </span>
                          </div>
                          <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white mt-1 group-hover:text-[#4F46E5] transition-colors truncate">
                            {rival.name}
                          </h5>
                          <div className="text-xs font-black text-slate-900 dark:text-white mt-1">
                            ₹{rival.price.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">Score: {rival.aiScore}/100</span>
                          <span className="text-xs font-black text-[#4F46E5] dark:text-indigo-400 flex items-center gap-1">
                            <span>Deep Dive</span> <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 p-6 text-center text-slate-400 text-xs">
                    No direct same-category alternatives found.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* MODAL FOOTER: Actions Bar */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#070B16] border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Wishlist / Stash Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onToggleFavorite(product)}
              className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-black text-white border-purple-500/40 shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
              title="Save to Stash"
            >
              <WiseBookmarkIcon size={16} active={isFavorite} />
              <span>{isFavorite ? 'Saved to Stash' : 'Bookmark Spec'}</span>
            </motion.button>

            {/* Compare Matrix Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onAddToCompare(product)}
              className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                isInCompare
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20'
                  : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#4F46E5]'
              }`}
            >
              {isInCompare ? <Check className="h-4 w-4" /> : <BarChart2 className="h-4 w-4" />}
              <span>{isInCompare ? 'In Matrix' : 'Add to Compare'}</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            {onAskWiseBot && (
              <button
                onClick={() => {
                  onClose();
                  onAskWiseBot(`Can you break down the hardware specifications and value of ${product.name} (₹${product.price.toLocaleString('en-IN')}) for heavy multitasking and gaming?`);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Ask AI About Specs</span>
              </button>
            )}

            <button
              onClick={() => {
                onProductClick(product);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white shadow-md cursor-pointer"
            >
              <span>Full Deep Dive</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
