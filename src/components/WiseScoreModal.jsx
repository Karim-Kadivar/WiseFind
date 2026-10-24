import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    X, Zap, ShieldCheck, Scale, Cpu, Award, TrendingUp, AlertTriangle, 
    CheckCircle2, XCircle, Sliders, Sparkles, Calculator, Info, 
    BarChart3, RefreshCw, ShoppingCart, Clock, Check
} from 'lucide-react';

export default function WiseScoreModal({ isOpen, onClose, initialProduct = null }) {
    // Interactive Simulator States
    const [hwScore, setHwScore] = useState(initialProduct ? Math.min(100, (initialProduct.aiScore || 90) + 4) : 92);
    const [reliabilityScore, setReliabilityScore] = useState(initialProduct ? Math.min(100, (initialProduct.aiScore || 88) + 2) : 89);
    const [authenticityScore, setAuthenticityScore] = useState(initialProduct ? (initialProduct.aiScore || 91) : 90);
    const [softwareScore, setSoftwareScore] = useState(88);
    const [priceStabilityScore, setPriceStabilityScore] = useState(85);
    
    // Gimmick Penalties toggles
    const [penalties, setPenalties] = useState({
        fakeFillerLens: false, // -7 pts
        virtualRamTrick: false, // -5 pts
        peakNitsInflation: false, // -4 pts
        emmcStorage: false, // -10 pts
        fakeDiscountSpike: false // -6 pts
    });

    const [activeTab, setActiveTab] = useState('simple'); // 'simple', 'tiers', 'simulator', 'pillars', 'formula'

    if (!isOpen) return null;

    // Calculate total penalty deduction
    const totalPenalty = 
        (penalties.fakeFillerLens ? 7 : 0) +
        (penalties.virtualRamTrick ? 5 : 0) +
        (penalties.peakNitsInflation ? 4 : 0) +
        (penalties.emmcStorage ? 10 : 0) +
        (penalties.fakeDiscountSpike ? 6 : 0);

    // Weighted composite formula:
    // (0.30 * HW) + (0.25 * Reliability) + (0.20 * Authenticity) + (0.15 * Software) + (0.10 * PriceStability) - Penalty
    const rawCalculatedScore = (
        (hwScore * 0.30) +
        (reliabilityScore * 0.25) +
        (authenticityScore * 0.20) +
        (softwareScore * 0.15) +
        (priceStabilityScore * 0.10)
    ) - totalPenalty;

    const finalScore = Math.max(10, Math.min(100, Math.round(rawCalculatedScore)));

    const getScoreTier = (score) => {
        if (score >= 93) return { label: 'Wise Choice / Gold Tier', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', badge: '🏆 Top 5% Market Leader' };
        if (score >= 85) return { label: 'Smart Buy / Silver Tier', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', badge: '⭐ Dependable Daily Value' };
        if (score >= 75) return { label: 'Balanced / Bronze Tier', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', badge: '⚖️ Good If Bought On Sale' };
        return { label: 'Caution / Compromised', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30', badge: '⚠️ Gimmicks or Overpriced' };
    };

    const currentTier = getScoreTier(finalScore);

    const pillars = [
        {
            id: 'hardware',
            title: '1. Price-to-Performance & Hardware Value',
            weight: '30%',
            weightValue: 0.30,
            icon: Cpu,
            color: 'from-indigo-500 to-blue-500',
            textColor: 'text-indigo-400',
            borderColor: 'border-indigo-500/30',
            bgLight: 'bg-indigo-500/10',
            desc: 'Physical chipset benchmarks (AnTuTu, Geekbench, Cinebench), display tier (120Hz LTPO AMOLED, 100% sRGB), sustained thermal efficiency, and physical RAM architecture vs current Indian retail price.',
            auditCriteria: [
                'Processor efficiency & thermal dissipation under sustained workloads',
                'Physical memory bandwidth (LPDDR5X vs LPDDR4X) and SSD speeds (UFS 4.0 vs eMMC)',
                'True display color calibration and sustained High Brightness Mode (HBM nits)',
                'Rupee-to-performance ratio normalized across current market peers'
            ]
        },
        {
            id: 'reliability',
            title: '2. Real-World Reliability & Verified User Sentiment',
            weight: '25%',
            weightValue: 0.25,
            icon: ShieldCheck,
            color: 'from-emerald-500 to-teal-500',
            textColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/30',
            bgLight: 'bg-emerald-500/10',
            desc: 'Synthesizes thousands of verified owner reviews from Amazon, Flipkart, Croma, and Reddit communities. Algorithms strip out compensated / bot reviews and measure 12+ month durability and service center turnaround.',
            auditCriteria: [
                'De-biasing algorithm detects and discards fake 5-star seller incentive reviews',
                'Long-term failure reports (green screen lines, battery swelling, hinge wobble)',
                'After-sales service network density and average repair turnaround in India',
                'Verified return rate and customer satisfaction index over 6-12 months'
            ]
        },
        {
            id: 'authenticity',
            title: '3. Feature Authenticity & Anti-Gimmick Spec Honesty',
            weight: '20%',
            weightValue: 0.20,
            icon: AlertTriangle,
            color: 'from-amber-500 to-orange-500',
            textColor: 'text-amber-400',
            borderColor: 'border-amber-500/30',
            bgLight: 'bg-amber-500/10',
            desc: 'Penalizes deceptive marketing jargon that tricks unsuspecting consumers. Ensures you get genuine usable hardware instead of filler specs created solely for promotional posters.',
            auditCriteria: [
                'Heavily penalizes 2MP macro and depth filler cameras added to claim "Quad Camera"',
                'Penalizes "Virtual RAM" marketing where slow flash storage is disguised as physical memory',
                'Verifies actual sustained screen nits vs 1-second 1% window peak nits claims',
                'Flags missing essentials (chargers removed from box, non-standard cables)'
            ]
        },
        {
            id: 'software',
            title: '4. Software Longevity & Operating System Health',
            weight: '15%',
            weightValue: 0.15,
            icon: RefreshCw,
            color: 'from-purple-500 to-pink-500',
            textColor: 'text-purple-400',
            borderColor: 'border-purple-500/30',
            bgLight: 'bg-purple-500/10',
            desc: 'Evaluates guaranteed major OS version upgrades, security patch frequency, and interface cleanliness (zero intrusive lockscreen ads, push notification spam, or pre-installed bloatware).',
            auditCriteria: [
                'Manufacturer written guarantee of 3 to 7 years of OS and security patches',
                'Cleanliness of UI (no push ad notifications, glance screens, or non-removable bloatware)',
                'History of software stability (does the brand release bug-ridden battery-draining updates?)',
                'Ecosystem integration smoothness (cross-device clipboard, quick file transfer)'
            ]
        },
        {
            id: 'pricing',
            title: '5. Multi-Store Price Stability & Deal Genuineness',
            weight: '10%',
            weightValue: 0.10,
            icon: TrendingUp,
            color: 'from-cyan-500 to-teal-500',
            textColor: 'text-cyan-400',
            borderColor: 'border-cyan-500/30',
            bgLight: 'bg-cyan-500/10',
            desc: 'Continuously tracks live pricing across Amazon, Flipkart, Meesho, and Croma against 90-day historic lows to verify if an advertised "sale discount" is genuine or an inflated price spike illusion.',
            auditCriteria: [
                'Compares current price against 90-day and all-time lowest recorded prices',
                'Detects artificial price hikes immediately before festival sales',
                'Live multi-store price gap analysis (highlights when another store is ₹3,000+ cheaper)',
                'Bank card discount validation (checks if terms and conditions actually apply)'
            ]
        }
    ];

    const scoreTiers = [
        {
            range: '93 – 100',
            tier: 'Wise Choice / Gold Tier',
            verdict: 'Ultimate benchmark class leader. Delivers class-leading hardware, zero marketing gimmick compromises, pristine owner sentiment, and outstanding long-term software support. Highest possible buying recommendation.',
            color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
            icon: '🏆'
        },
        {
            range: '85 – 92',
            tier: 'Smart Buy / Silver Tier',
            verdict: 'Dependable, high-satisfaction purchase. Great price-to-performance sweet spot with minor, well-defined trade-offs (e.g. plastic back or slightly slower charging). Safe purchase for 90% of buyers.',
            color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
            icon: '⭐'
        },
        {
            range: '75 – 84',
            tier: 'Balanced Value / Bronze Tier',
            verdict: 'Decent everyday device, but compromises exist (older chip, 2-year update lifecycle, or moderate bloatware). Recommended primarily when accompanied by a steep discount or bank offer.',
            color: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
            icon: '⚖️'
        },
        {
            range: 'Below 75',
            tier: 'Caution / Sub-Optimal Value',
            verdict: 'Heavy marketing gimmicks detected, uncompetitive pricing, slow eMMC flash storage, or poor customer reliability history. WiseFind recommends considering higher-ranked category alternatives.',
            color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
            icon: '⚠️'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-4xl bg-[#0B0F19] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-200"
            >
                {/* Header Banner */}
                <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#0F172A] border-b border-slate-800">
                    <button 
                        onClick={onClose}
                        className="absolute right-5 top-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Close Breakdown"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2">
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span>Unbiased Algorithmic Standard</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                                <span>How WiseScore™ is Determined & Calculated</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
                                Transparent mathematical breakdown of our proprietary 0–100 buying intelligence index. Never sponsored, zero affiliate bias, built purely to protect consumers.
                            </p>
                        </div>

                        {/* Live Score Badge */}
                        <div className="shrink-0 flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 p-3 rounded-2xl">
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Calculated Rating</span>
                                <span className="text-xs font-bold text-amber-400">{currentTier.badge}</span>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30">
                                <span className="text-xl leading-none">{finalScore}</span>
                                <span className="text-[9px] uppercase tracking-wider text-indigo-200">/ 100</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pt-6 scrollbar-none">
                        {[
                            { id: 'simple', label: '💡 Plain English View', icon: Sparkles },
                            { id: 'tiers', label: '🏆 Score Tiers & Meaning', icon: Award },
                            { id: 'simulator', label: '🎛️ Score Simulator', icon: Sliders },
                            { id: 'pillars', label: '🔬 5 Pillars Breakdown', icon: BarChart3 },
                            { id: 'formula', label: '📐 Math & Pipeline', icon: Calculator }
                        ].map(t => {
                            const Icon = t.icon;
                            const isActive = activeTab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25' 
                                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto scrollbar-thin">
                    
                    {/* TAB 0: SIMPLE PLAIN-ENGLISH VIEW (EVERYDAY USERS) */}
                    {activeTab === 'simple' && (
                        <div className="space-y-6">
                            {/* 30-Second Quick Verdict Box */}
                            <div className="bg-gradient-to-br from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-700/50 p-5 sm:p-6 rounded-3xl shadow-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <h3 className="text-base sm:text-lg font-black text-white">
                                        WiseScore Explained in 30 Seconds
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                                    Online star ratings can be manipulated by fake reviews and paid promotions. <strong>WiseScore is our independent 0–100 honesty index</strong> built to protect Indian buyers. It gives an honest answer: <em>"Is this product built to last and worth your hard-earned rupees, or is it overpriced marketing hype?"</em>
                                </p>
                            </div>

                            {/* The 4 Core Truths */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/40 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg mb-3">
                                        ⚡
                                    </div>
                                    <h4 className="text-sm font-black text-white mb-1">
                                        1. Real-World Speed & Battery (30%)
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                        Does it open apps instantly without lag? Does the battery easily last all day without heating up during video calls, commutes, or casual gaming?
                                    </p>
                                </div>

                                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/40 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg mb-3">
                                        🛡️
                                    </div>
                                    <h4 className="text-sm font-black text-white mb-1">
                                        2. 3+ Year Durability & Service (25%)
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                        We audit thousands of verified owners after 6–12 months of daily use. Do screens fail? Does the build creak? Are authorized service centers fast and helpful in India?
                                    </p>
                                </div>

                                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-amber-500/40 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg mb-3">
                                        🚫
                                    </div>
                                    <h4 className="text-sm font-black text-white mb-1">
                                        3. No Marketing Gimmicks (25%)
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                        We strictly penalize marketing tricks: useless 2MP filler camera lenses added just to claim "Quad Camera", and slow "Virtual RAM" that slows down storage.
                                    </p>
                                </div>

                                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-cyan-500/40 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg mb-3">
                                        💰
                                    </div>
                                    <h4 className="text-sm font-black text-white mb-1">
                                        4. Genuine Value per Rupee (20%)
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                        We track live real-time prices across Flipkart, Amazon, Croma, and Reliance Digital. If another store is selling it ₹3,000 cheaper today, WiseScore warns you immediately!
                                    </p>
                                </div>
                            </div>

                            {/* Easy Buyer Tier Guide */}
                            <div className="bg-[#080C16] border border-slate-800 p-5 rounded-2xl">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                                    Simple Score Buying Rule of Thumb:
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                        <div className="font-black text-sm">🏆 90 – 100: Gold Tier (Best Buy)</div>
                                        <div className="text-slate-300 text-[11px] mt-0.5">Top 5% products. Outstanding value, zero gimmicks, buy with complete confidence.</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                        <div className="font-black text-sm">⭐ 80 – 89: Silver Tier (Solid Daily Workhorse)</div>
                                        <div className="text-slate-300 text-[11px] mt-0.5">Safe and dependable daily purchase for 90% of buyers. Minimal minor trade-offs.</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300">
                                        <div className="font-black text-sm">⚖️ 70 – 79: Bronze Tier (Good on Sale)</div>
                                        <div className="text-slate-300 text-[11px] mt-0.5">Decent product, but has noticeable trade-offs. Recommended primarily during festive sales or card discounts.</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                                        <div className="font-black text-sm">⚠️ Below 70: Caution Tier</div>
                                        <div className="text-slate-300 text-[11px] mt-0.5">Contains marketing traps, weak durability history, or overpriced. Look at alternatives!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 1: 5 PILLARS */}
                    {activeTab === 'pillars' && (
                        <div className="space-y-6">
                            <div className="bg-indigo-950/30 border border-indigo-800/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-indigo-200">
                                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="font-black text-white block mb-0.5">Weighted Multi-Dimensional Architecture</strong>
                                    WiseScore does not rely on simple average star ratings, which are frequently manipulated by bot farms and paid promotional reviews. Every product is evaluated across 5 distinct, independently verified pillars.
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {pillars.map((pillar) => {
                                    const Icon = pillar.icon;
                                    return (
                                        <div 
                                            key={pillar.id}
                                            className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-black text-white flex items-center gap-2">
                                                            <span>{pillar.title}</span>
                                                        </h3>
                                                        <span className="text-[11px] font-bold text-slate-400">
                                                            Contributes {pillar.weight} of Total Composite Rating
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-xs font-black text-white border border-slate-700 self-start sm:self-auto">
                                                    <span>Weight:</span>
                                                    <span className={pillar.textColor}>{pillar.weight}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
                                                {pillar.desc}
                                            </p>

                                            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Audited Data Points:</span>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                                                    {pillar.auditCriteria.map((c, i) => (
                                                        <div key={i} className="flex items-start gap-1.5">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                            <span>{c}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: MATHEMATICAL FORMULA & PIPELINE */}
                    {activeTab === 'formula' && (
                        <div className="space-y-6">
                            {/* The Formula Equation */}
                            <div className="bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-950 p-6 rounded-3xl border border-indigo-800/50 text-center relative overflow-hidden">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-3">
                                    <span>Core Calculation Formula</span>
                                </div>
                                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mb-4">
                                    WiseScore = Σ (Pillar_Score × Weight) − Gimmick_Penalties
                                </h3>

                                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 max-w-2xl mx-auto text-xs sm:text-sm font-mono text-indigo-300 text-left space-y-2">
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">1. Hardware Performance & Spec Value:</span>
                                        <span className="font-bold text-white">0.30 × HW_Score</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">2. Reliability & Verified Reviews:</span>
                                        <span className="font-bold text-white">0.25 × Reliability_Score</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">3. Anti-Gimmick Authenticity:</span>
                                        <span className="font-bold text-white">0.20 × Authenticity_Score</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">4. Software Longevity & OS Health:</span>
                                        <span className="font-bold text-white">0.15 × Software_Score</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">5. Multi-Store Price Stability:</span>
                                        <span className="font-bold text-white">0.10 × Price_Stability</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1 text-rose-400">
                                        <span>Gimmick & Marketing Penalties:</span>
                                        <span className="font-bold">− (Deductions: 0 to 25 pts)</span>
                                    </div>
                                </div>
                            </div>

                            {/* 4-Stage Auditing Engine Pipeline */}
                            <h4 className="text-sm font-black text-white uppercase tracking-wider mt-6">
                                4-Stage Auditing Engine Pipeline
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs mb-2">
                                        01
                                    </div>
                                    <h5 className="font-black text-white text-xs uppercase mb-1">Multi-Store Data Extraction</h5>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Extracts real-time pricing, stock availability, and verified buyer reviews from Amazon, Flipkart, Croma, and Meesho, keeping product telemetry fresh.
                                    </p>
                                </div>

                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs mb-2">
                                        02
                                    </div>
                                    <h5 className="font-black text-white text-xs uppercase mb-1">Anti-Bot & Review De-biasing</h5>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Natural language models analyze reviews for bot copy patterns, identical seller timestamps, and unverified purchases to weed out artificial 5-star ratings.
                                    </p>
                                </div>

                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs mb-2">
                                        03
                                    </div>
                                    <h5 className="font-black text-white text-xs uppercase mb-1">Spec Normalization & Gimmick Scan</h5>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Cross-checks manufacturer claims against independent lab tear-downs. Applies automatic penalties for 2MP filler sensors, virtual RAM, or washed-out panels.
                                    </p>
                                </div>

                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs mb-2">
                                        04
                                    </div>
                                    <h5 className="font-black text-white text-xs uppercase mb-1">Composite Scoring & Tier Badge</h5>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                        Weights each normalized factor into the final 0–100 integer score and assigns the consumer recommendation tier (Gold, Silver, Bronze, or Caution).
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: INTERACTIVE SIMULATOR */}
                    {activeTab === 'simulator' && (
                        <div className="space-y-6">
                            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                                            Test the WiseScore Engine Yourself
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium">
                                            Adjust the 5 core pillar sliders and toggle marketing gimmick penalties to see how the score recalculates dynamically.
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-black text-slate-400 block">Live Score</span>
                                            <span className="text-xs font-bold text-amber-400">{currentTier.badge}</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-lg">
                                            {finalScore}
                                        </div>
                                    </div>
                                </div>

                                {/* Sliders */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-slate-300">1. Hardware & Benchmark Spec Value (30% Weight)</span>
                                            <span className="text-indigo-400 font-mono">{hwScore}/100</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="30" 
                                            max="100" 
                                            value={hwScore} 
                                            onChange={(e) => setHwScore(Number(e.target.value))} 
                                            className="w-full accent-indigo-500 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-slate-300">2. Reliability & Verified Sentiment (25% Weight)</span>
                                            <span className="text-emerald-400 font-mono">{reliabilityScore}/100</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="30" 
                                            max="100" 
                                            value={reliabilityScore} 
                                            onChange={(e) => setReliabilityScore(Number(e.target.value))} 
                                            className="w-full accent-emerald-500 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-slate-300">3. Spec Authenticity (20% Weight)</span>
                                            <span className="text-amber-400 font-mono">{authenticityScore}/100</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="30" 
                                            max="100" 
                                            value={authenticityScore} 
                                            onChange={(e) => setAuthenticityScore(Number(e.target.value))} 
                                            className="w-full accent-amber-500 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-slate-300">4. Software Longevity & OS Health (15% Weight)</span>
                                            <span className="text-purple-400 font-mono">{softwareScore}/100</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="30" 
                                            max="100" 
                                            value={softwareScore} 
                                            onChange={(e) => setSoftwareScore(Number(e.target.value))} 
                                            className="w-full accent-purple-500 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-slate-300">5. Multi-Store Price Stability (10% Weight)</span>
                                            <span className="text-cyan-400 font-mono">{priceStabilityScore}/100</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="30" 
                                            max="100" 
                                            value={priceStabilityScore} 
                                            onChange={(e) => setPriceStabilityScore(Number(e.target.value))} 
                                            className="w-full accent-cyan-500 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Marketing Gimmick Penalty Checkboxes */}
                                <div className="mt-6 pt-5 border-t border-slate-800">
                                    <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Simulate Marketing Gimmick Penalties:</span>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        {[
                                            { key: 'fakeFillerLens', label: 'Includes 2MP Macro / Depth Filler Sensor', penalty: '−7 pts' },
                                            { key: 'virtualRamTrick', label: 'Virtual RAM Expansion Marketing Claim', penalty: '−5 pts' },
                                            { key: 'peakNitsInflation', label: '1% Screen Window Peak Nits Inflation', penalty: '−4 pts' },
                                            { key: 'emmcStorage', label: 'Sluggish eMMC Flash instead of NVMe/UFS', penalty: '−10 pts' },
                                            { key: 'fakeDiscountSpike', label: 'Price Jacked Up Before "Sale Discount"', penalty: '−6 pts' }
                                        ].map(item => (
                                            <label 
                                                key={item.key}
                                                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                                                    penalties[item.key]
                                                        ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                                                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={penalties[item.key]} 
                                                        onChange={(e) => setPenalties(prev => ({ ...prev, [item.key]: e.target.checked }))} 
                                                        className="rounded accent-rose-500"
                                                    />
                                                    <span className="text-[11px] font-bold">{item.label}</span>
                                                </div>
                                                <span className="font-mono text-[10px] font-bold text-rose-400 shrink-0 ml-2">{item.penalty}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: TIERS */}
                    {activeTab === 'tiers' && (
                        <div className="space-y-4">
                            <p className="text-xs text-slate-300 font-medium mb-4">
                                Every score produced by the WiseScore Engine is mapped to a clear, actionable verdict tier so consumers can make instant, informed decisions.
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                {scoreTiers.map((t, i) => (
                                    <div key={i} className={`p-5 rounded-2xl border ${t.color}`}>
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{t.icon}</span>
                                                <h4 className="font-black text-sm text-white">{t.tier}</h4>
                                            </div>
                                            <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono font-bold text-white">
                                                {t.range}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                            {t.verdict}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                        Audited by WiseFind Intelligence Core • Updated 2026
                    </span>
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                        Got It, Thanks!
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
