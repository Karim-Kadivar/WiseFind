import React, { useState, useMemo } from 'react';
import { BuyingGuide, Product } from '../types';
import { SafeProductImage } from './SafeProductImage';
import { 
  BookOpen, Star, HelpCircle, GraduationCap, ArrowRight, ShieldAlert, 
  Award, Compass, Sparkles, CheckSquare, Square, Volume2, VolumeX, 
  Download, Search, Filter, Layers, Share2, Check, ExternalLink,
  ChevronDown, ChevronUp, Cpu, Battery, Sliders, ShieldCheck
} from 'lucide-react';
import { WiseBookmarkIcon } from './WiseBookmarkIcon';

interface BuyingGuidesProps {
  guides: BuyingGuide[];
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCompare?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  favorites?: Product[];
}

export default function BuyingGuides({
  guides,
  products,
  onProductClick,
  onAddToCompare,
  onToggleFavorite,
  favorites = []
}: BuyingGuidesProps) {
  const [selectedGuide, setSelectedGuide] = useState<BuyingGuide | null>(guides[0] || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [checkedFactors, setCheckedFactors] = useState<Record<string, boolean>>({});
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // Quiz State
  const [quizCategory, setQuizCategory] = useState<string>('Smartphones');
  const [quizBudget, setQuizBudget] = useState<string>('₹30,000 - ₹60,000');
  const [quizPriority, setQuizPriority] = useState<string>('Battery & Display');
  const [quizResultGuide, setQuizResultGuide] = useState<BuyingGuide | null>(null);

  // Interactive Red Flag / Marketing Trap Map per category
  const MARKETING_TRAPS_MAP: Record<string, Array<{ trap: string; reality: string; advice: string; severity: 'high' | 'medium' | 'critical' }>> = {
    'Smartphones': [
      {
        trap: 'Virtual RAM Expansion (e.g., "16GB RAM" via 8GB+8GB Virtual)',
        reality: 'Uses slow flash storage as swap memory. Up to 100x slower than true LPDDR5X RAM and wears down internal NAND storage.',
        advice: 'Only look at physical hardware RAM. 8GB physical RAM is plenty for 99% of users.',
        severity: 'high'
      },
      {
        trap: '2MP Depth / 2MP Macro Sensor Padding (The "Quad Camera" Myth)',
        reality: 'Low-resolution filler sensors added solely to advertise 3 or 4 cameras on marketing posters.',
        advice: 'Prioritize a large primary sensor with OIS (Optical Image Stabilization) and an Ultra-wide over multi-lens filler setups.',
        severity: 'critical'
      },
      {
        trap: '4000+ Peak Nits Brightness Claims',
        reality: 'Peak brightness only activates for a 1% screen window under direct sunlight with auto-brightness enabled for a few seconds.',
        advice: 'Check "High Brightness Mode (HBM)" which is typically 1200-1600 nits across the full screen.',
        severity: 'medium'
      },
      {
        trap: 'Mega-Watt Charging with Missing Charger in Box',
        reality: 'Advertised 80W/100W speeds often require buying a ₹2,500+ proprietary adapter and special high-amp cable.',
        advice: 'Verify whether the fast-charging adapter and USB cable are included in the retail packaging.',
        severity: 'high'
      }
    ],
    'Laptops': [
      {
        trap: 'eMMC Storage vs NVMe SSD in Sub-₹35,000 Laptops',
        reality: 'eMMC speeds top out around 150-250 MB/s, causing system freezes and sluggish boot times compared to NVMe SSDs (2,000+ MB/s).',
        advice: 'Never purchase a laptop with eMMC storage. Always ensure PCIe NVMe M.2 SSD.',
        severity: 'critical'
      },
      {
        trap: 'TGP (Total Graphics Power) throttling on Gaming GPUs',
        reality: 'An RTX 4060 limited to 45W TGP will perform significantly worse than an RTX 4050 running at 95W-105W TGP.',
        advice: 'Always verify the wattage (TGP) of the dedicated GPU before buying gaming machines.',
        severity: 'high'
      },
      {
        trap: 'Soldered Single-Channel RAM with No Expansion Slot',
        reality: '8GB non-upgradable RAM cuts graphics bandwidth in half and renders the laptop obsolete within 2-3 years.',
        advice: 'Look for dual-channel memory or at least 1 user-accessible SO-DIMM slot.',
        severity: 'high'
      }
    ],
    'Headphones': [
      {
        trap: 'Hi-Res Audio Sticker with Standard SBC / AAC Codecs',
        reality: 'The yellow Hi-Res Audio sticker only means hardware drivers can output 40kHz; without LDAC or LHDC Bluetooth codecs, sound is compressed.',
        advice: 'Ensure your smartphone supports LDAC or aptX Adaptive if buying high-end wireless headphones.',
        severity: 'medium'
      },
      {
        trap: 'Exaggerated 60-Hour Battery with ANC and High Volume Disabled',
        reality: 'Advertised numbers are measured at 50% volume with Active Noise Cancellation turned OFF.',
        advice: 'Expect around 50-60% of advertised runtime when ANC is actively running on daily commutes.',
        severity: 'medium'
      }
    ],
    'Smartwatches': [
      {
        trap: 'Calling Bluetooth Trackers "Smartwatches" (RTOS vs WearOS/watchOS)',
        reality: 'Sub-₹3,000 trackers cannot install third-party apps, reply to messages, or support contactless payments.',
        advice: 'If you want standalone apps and rich messaging, look for WearOS or Apple Watch.',
        severity: 'high'
      }
    ]
  };

  const [copiedChecklist, setCopiedChecklist] = useState<boolean>(false);
  const [activeGuideSubTab, setActiveGuideSubTab] = useState<'checklist' | 'traps' | 'ranges' | 'jargon'>('checklist');

  // Handle Exporting the Purchasing Checklist
  const handleExportChecklist = () => {
    if (!selectedGuide) return;
    const text = `📋 WiseFind Hardware Purchasing Checklist: ${selectedGuide.title}\n\n` +
      `Category: ${selectedGuide.category}\n` +
      `Editor's Advice: ${selectedGuide.editorsAdvice}\n\n` +
      `Essential Hardware Verification Points:\n` +
      selectedGuide.keyFactors.map((f, i) => `[ ] ${i + 1}. ${f.title}: ${f.desc}`).join('\n') +
      `\n\nPrice Tier Spectrum:\n` +
      selectedGuide.budgetRanges.map(b => `• ${b.range}: ${b.advice}`).join('\n') +
      `\n\nVerified by WiseFind Intelligence Core`;

    try {
      navigator.clipboard.writeText(text);
      setCopiedChecklist(true);
      setTimeout(() => setCopiedChecklist(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Editorial Shortlists
  const trending = products.filter(p => p.isTrending);
  const editorsChoice = products.filter(p => p.isEditorChoice);
  const bestBudget = products.filter(p => p.isBestBudget);
  const bestPremium = products.filter(p => p.isBestPremium);

  // Filtered Guides
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchesCat = selectedCategory === 'All' || g.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesQuery = 
        !searchQuery.trim() ||
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.jargonBuster.some(j => j.term.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [guides, selectedCategory, searchQuery]);

  // Categories list
  const categories = ['All', 'Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Tablets'];

  // Toggle factor check in checklist
  const handleToggleFactor = (factorKey: string) => {
    setCheckedFactors(prev => ({
      ...prev,
      [factorKey]: !prev[factorKey]
    }));
  };

  // Audio Playback simulation
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    if (!selectedGuide) return;
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const script = `WiseFind Buying Guide: ${selectedGuide.title}. Category: ${selectedGuide.category}. Editor's Advice: ${selectedGuide.editorsAdvice}`;
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 5000);
    }
  };

  // Run Quiz Matcher
  const handleRunQuiz = () => {
    const matched = guides.find(g => g.category.toLowerCase().includes(quizCategory.toLowerCase())) || guides[0];
    setQuizResultGuide(matched);
    setSelectedGuide(matched);
  };

  // Find Products that match the selected guide's category
  const matchingProducts = useMemo(() => {
    if (!selectedGuide) return [];
    return products.filter(p => p.category.toLowerCase().includes(selectedGuide.category.toLowerCase()) || selectedGuide.category.toLowerCase().includes(p.category.toLowerCase())).slice(0, 3);
  }, [products, selectedGuide]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="buying-guides-panel">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#090D16] via-[#12182B] to-[#1E293B] border border-slate-800 rounded-3xl p-6 sm:p-10 text-white mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-gradient-to-bl from-purple-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-black uppercase tracking-widest">
              <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
              <span>WiseFind Hardware Academy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Master Technical Specifications & Avoid Marketing Traps.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Unbiased purchasing checklists, rupee segment breakdowns, jargon decrypters, and objective hardware verdicts prepared by veteran tech reviewers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowQuiz(!showQuiz)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-2xl transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <Sparkles className="h-4 w-4 text-[#FBBF24]" />
              <span>{showQuiz ? 'Close Guide Matcher' : 'Guide Matcher Quiz'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Guide Matcher Quiz Drawer */}
        {showQuiz && (
          <div className="mt-8 pt-8 border-t border-slate-800 animate-fade-in bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FBBF24]" />
              <span>30-Second Guide Matcher (Find Your Tailored Guide)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Product Category</label>
                <select
                  value={quizCategory}
                  onChange={(e) => setQuizCategory(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="Smartphones">📱 Smartphones</option>
                  <option value="Laptops">💻 Laptops</option>
                  <option value="Headphones">🎧 Headphones / Audio</option>
                  <option value="Smartwatches">⌚ Smartwatches</option>
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Target Budget in ₹</label>
                <select
                  value={quizBudget}
                  onChange={(e) => setQuizBudget(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="Under ₹25,000">Under ₹25,000 (Budget Champion)</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Sweet Spot Value)</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Premium Flagship)</option>
                  <option value="Above ₹1,00,000">Above ₹1,00,000 (Pro Workstation)</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Priority</label>
                <select
                  value={quizPriority}
                  onChange={(e) => setQuizPriority(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="Battery & Display">🔋 Battery Longevity & Display Quality</option>
                  <option value="Maximum Speed & Gaming">⚡ Maximum Performance & Gaming</option>
                  <option value="Pro Content Creation">🎨 Color Accuracy & Video Editing</option>
                  <option value="Durability & Longevity">🛡️ Build Quality & Long Software Updates</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleRunQuiz}
                className="bg-white text-slate-950 hover:bg-slate-100 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer"
              >
                Match Guide & Recommendations →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upper Grid: Editorial Product Picks Showcase */}
      <div className="mb-14">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6 text-[#4F46E5]" />
              Editorial Product Highlights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Curated shortlists calculated objectively for specific budgets and expectations in Indian Rupees.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Editors Choice */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-3 py-1 rounded-xl uppercase tracking-wider block w-fit">
              Editor's Choice
            </span>
            {editorsChoice.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-slate-50 dark:hover:bg-[#1A223B] p-2 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-12 w-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                <div className="min-w-0 flex-grow">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-[#4F46E5]">{p.name}</h4>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white block mt-0.5">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Best Budget picks */}
          <div className="bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent bg-white dark:bg-[#111827] border border-teal-200/80 dark:border-teal-900/60 hover:border-teal-400 dark:hover:border-teal-700 rounded-3xl p-5 shadow-xs space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-teal-700 dark:text-teal-300 bg-teal-100/80 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 px-3 py-1 rounded-xl uppercase tracking-wider block w-fit shadow-2xs">
              Best Budget Picks
            </span>
            {bestBudget.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-teal-500/5 dark:hover:bg-[#1A223B] p-2 rounded-2xl transition-all border border-transparent hover:border-teal-200/50 dark:hover:border-slate-700">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-12 w-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                <div className="min-w-0 flex-grow">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">{p.name}</h4>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white block mt-0.5">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Best Premium */}
          <div className="bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent bg-white dark:bg-[#111827] border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-700 rounded-3xl p-5 shadow-xs space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-xl uppercase tracking-wider block w-fit shadow-2xs">
              Best Premium Picks
            </span>
            {bestPremium.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-amber-500/5 dark:hover:bg-[#1A223B] p-2 rounded-2xl transition-all border border-transparent hover:border-amber-200/50 dark:hover:border-slate-700">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-12 w-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                <div className="min-w-0 flex-grow">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">{p.name}</h4>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white block mt-0.5">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trending Products */}
          <div className="bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent bg-white dark:bg-[#111827] border border-indigo-200/80 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-700 rounded-3xl p-5 shadow-xs space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-xl uppercase tracking-wider block w-fit shadow-2xs">
              Trending Devices
            </span>
            {trending.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-indigo-500/5 dark:hover:bg-[#1A223B] p-2 rounded-2xl transition-all border border-transparent hover:border-indigo-200/50 dark:hover:border-slate-700">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-12 w-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                <div className="min-w-0 flex-grow">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{p.name}</h4>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white block mt-0.5">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Section: Interactive Jargon & Strategy Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Guides List Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#4F46E5]" />
              Tech Guides
            </h3>
            <span className="text-xs font-bold text-slate-400">{filteredGuides.length} Guides</span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter guides by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          {/* Categories Pill bar */}
          <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === c
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            {filteredGuides.map((gd) => {
              const isSelected = selectedGuide?.id === gd.id;
              return (
                <div
                  key={gd.id}
                  onClick={() => setSelectedGuide(gd)}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex justify-between items-center group ${
                    isSelected
                      ? 'bg-purple-50/70 dark:bg-[#161D33] border-purple-500 dark:border-purple-500 shadow-md ring-1 ring-purple-500/30'
                      : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="pr-3">
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 block uppercase tracking-wider">
                      {gd.category}
                    </span>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm mt-0.5 group-hover:text-[#4F46E5] transition-colors">
                      {gd.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                      {gd.description}
                    </p>
                  </div>
                  <ArrowRight className={`h-4 w-4 flex-shrink-0 transition-transform ${isSelected ? 'text-[#4F46E5] translate-x-1' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Active Selected Guide Detailed Reading Frame */}
        <div className="lg:col-span-2">
          {selectedGuide ? (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in">
              
              {/* Header Title with Audio Simulator, Copy Checklist & Sponsor-Free Badge */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                    {selectedGuide.category} Masterclass
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportChecklist}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-[#12182B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                    >
                      {copiedChecklist ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Download className="h-3.5 w-3.5 text-[#4F46E5]" />}
                      <span>{copiedChecklist ? 'Checklist Copied!' : 'Export Checklist'}</span>
                    </button>

                    <button
                      onClick={handleToggleAudio}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                          : 'bg-slate-100 dark:bg-[#12182B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {isPlayingAudio ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-[#4F46E5]" />}
                      <span>{isPlayingAudio ? 'Stop Audio' : '60s Audio Brief'}</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mt-2">
                  {selectedGuide.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                  {selectedGuide.description}
                </p>

                {/* Sub-tab Pill Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
                  {[
                    { id: 'checklist', label: 'Spec Checklist', icon: GraduationCap, activeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/20' },
                    { id: 'traps', label: 'Marketing Red Flags', icon: ShieldAlert, activeClass: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-transparent shadow-md shadow-rose-500/20' },
                    { id: 'ranges', label: 'Price Tiers', icon: Sliders, activeClass: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md shadow-amber-500/20' },
                    { id: 'jargon', label: 'Jargon Buster', icon: HelpCircle, activeClass: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-500/20' }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeGuideSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveGuideSubTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isActive
                            ? tab.activeClass
                            : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAB 1: Interactive Purchasing Checklist (Checkable Factors) */}
              {activeGuideSubTab === 'checklist' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-[#4F46E5]" />
                      Essential Hardware Verification Checklist
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {Object.values(checkedFactors).filter(Boolean).length} / {selectedGuide.keyFactors.length} verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedGuide.keyFactors.map((factor, fidx) => {
                      const factorKey = `${selectedGuide.id}-factor-${fidx}`;
                      const isChecked = !!checkedFactors[factorKey];

                      return (
                        <div
                          key={fidx}
                          onClick={() => handleToggleFactor(factorKey)}
                          className={`rounded-2xl p-4 border transition-all cursor-pointer select-none flex items-start gap-3 ${
                            isChecked
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isChecked ? (
                              <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h5 className={`font-black text-xs ${isChecked ? 'text-emerald-900 dark:text-emerald-300 line-through opacity-80' : 'text-slate-900 dark:text-white'}`}>
                              {factor.title}
                            </h5>
                            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-relaxed font-medium">
                              {factor.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Red Flag Marketing Trap Scanner */}
              {activeGuideSubTab === 'traps' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-500" />
                      Marketing Traps & Gimmicks to Avoid
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Zero-Sponsor Unbiased Analysis
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(MARKETING_TRAPS_MAP[selectedGuide.category] || MARKETING_TRAPS_MAP['Smartphones']).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                            <span>{item.trap}</span>
                          </span>
                          <span className="text-[9px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                            {item.severity} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          <b className="text-slate-900 dark:text-white">The Reality:</b> {item.reality}
                        </p>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#0B101D] border border-rose-100 dark:border-slate-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                          <span>💡 WiseFind Advice: {item.advice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Segment & Rupee Tier Advice */}
              {activeGuideSubTab === 'ranges' && (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-cyan-500" />
                    Rupee Price Tier Spectrum & Expectations
                  </h4>
                  <div className="space-y-2.5">
                    {selectedGuide.budgetRanges.map((br, bidx) => (
                      <div
                        key={bidx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/80 dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800 rounded-2xl gap-3"
                      >
                        <span className="text-xs font-black text-slate-900 dark:text-white sm:w-1/3 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]"></span>
                          <span>{br.range}</span>
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 sm:w-2/3 font-medium leading-relaxed">
                          {br.advice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Jargon Buster definitions */}
              {activeGuideSubTab === 'jargon' && (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-[#37D0C0]" />
                    Jargon Buster (Decrypted Terminology)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedGuide.jargonBuster.map((jb, jidx) => (
                      <div key={jidx} className="bg-slate-50 dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs block text-purple-600 dark:text-purple-400">
                          ✦ {jb.term}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 text-xs block leading-relaxed font-medium">
                          {jb.explanation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Curated Hardware Picks for this guide */}
              {matchingProducts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Recommended Hardware Models for this Guide
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {matchingProducts.map((p) => {
                      const isFav = favorites.some(f => f.id === p.id);
                      return (
                        <div
                          key={p.id}
                          className="bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-between space-y-2 hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-xs"
                        >
                          <div>
                            <SafeProductImage
                              src={p.image}
                              alt={p.name}
                              category={p.category}
                              className="h-24 w-full rounded-xl object-cover border border-slate-200 dark:border-slate-700 mb-2"
                            />
                            <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
                              {p.brand}
                            </span>
                            <h5 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                              {p.name}
                            </h5>
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100 block mt-0.5">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <button
                              onClick={() => onProductClick(p)}
                              className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-[9px] font-black uppercase py-1.5 rounded-lg text-center cursor-pointer"
                            >
                              Specs
                            </button>
                            {onAddToCompare && (
                              <button
                                onClick={() => onAddToCompare(p)}
                                className="flex-1 bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-black uppercase py-1.5 rounded-lg text-center cursor-pointer"
                              >
                                Compare
                              </button>
                            )}
                            {onToggleFavorite && (
                              <button
                                onClick={() => onToggleFavorite(p)}
                                className="p-1.5 rounded-lg bg-black border border-white/10 cursor-pointer hover:scale-105 transition-transform"
                                title={isFav ? 'Remove from Stash' : 'Bookmark Spec'}
                              >
                                <WiseBookmarkIcon size={14} active={isFav} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Editor-in-Chief Ultimate Advice */}
              <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl p-5 space-y-1.5">
                <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                  Editor-in-Chief Hardware Verdict
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold italic">
                  "{selectedGuide.editorsAdvice}"
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-[#111827] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center space-y-3">
              <BookOpen className="h-12 w-12 text-slate-300 animate-pulse" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Select a Buying Guide</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Understand specs, decode tech marketing traps, and pick the perfect configuration level using our educational tools.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
