import React, { useState, useMemo } from 'react';
import { SafeProductImage } from './SafeProductImage.jsx';
import { 
    BookOpen, HelpCircle, GraduationCap, ArrowRight, ShieldAlert, ShieldCheck, Award, Sparkles, 
    CheckSquare, Square, Volume2, VolumeX, Download, Search, Check, Sliders,
    Lightbulb, CheckCircle2, XCircle, Users, ArrowUpRight, MessageSquare,
    Layers, Zap, AlertTriangle, Bookmark, Compass, Calculator, BarChart3, RefreshCw, Info, Cpu, TrendingUp
} from 'lucide-react';
import { WiseBookmarkIcon } from './WiseBookmarkIcon.jsx';
import WiseScoreModal from './WiseScoreModal.jsx';
import { SUBCATEGORY_MAP } from '../data/wiseGuideSubcategories.js';

export default function BuyingGuides({ 
    guides = [], 
    products = [], 
    onProductClick, 
    onAddToCompare, 
    onToggleFavorite, 
    favorites = [],
    onOpenAdvisors,
    initialCategory = 'All'
}) {
    const [selectedGuide, setSelectedGuide] = useState(guides[0] || null);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');
    const [isWiseScoreModalOpen, setIsWiseScoreModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [checkedFactors, setCheckedFactors] = useState({});
    const [showQuiz, setShowQuiz] = useState(false);
    const [copiedChecklist, setCopiedChecklist] = useState(false);
    const [activeGuideSubTab, setActiveGuideSubTab] = useState('tips'); // Default to General Understanding & Tips

    // Quiz State
    const [quizCategory, setQuizCategory] = useState('Smartphones');
    const [quizBudget, setQuizBudget] = useState('₹30,000 - ₹60,000');
    const [quizPriority, setQuizPriority] = useState('Battery & Display');
    const [quizResultGuide, setQuizResultGuide] = useState(null);

    // Keep selected guide synced if guides or initialCategory changes
    React.useEffect(() => {
        if (initialCategory && initialCategory !== 'All') {
            setSelectedCategory(initialCategory);
            const matched = guides.find(g => 
                g.category?.toLowerCase().includes(initialCategory.toLowerCase()) ||
                initialCategory.toLowerCase().includes(g.category?.toLowerCase()) ||
                (g.subCategory && g.subCategory.toLowerCase().includes(initialCategory.toLowerCase()))
            );
            if (matched) setSelectedGuide(matched);
        } else if (!selectedGuide && guides.length > 0) {
            setSelectedGuide(guides[0]);
        }
    }, [guides, initialCategory]);

    // Categories list covering all product spectrums
    const categories = [
        'All',
        'Smartphones',
        'Laptops',
        'Audio & Headphones',
        'Smartwatches & Wearables',
        'Tablets & iPads',
        'Home & Kitchen',
        'Cameras & Vlogging',
        'Smart TVs & Entertainment',
        'Fashion & Lifestyle'
    ];

    // Filtered Guides based on Category and Search
    const filteredGuides = useMemo(() => {
        return guides.filter((g) => {
            const cat = g.category?.toLowerCase() || '';
            const subCat = g.subCategory?.toLowerCase() || '';
            const sel = selectedCategory.toLowerCase();

            let matchesCat = selectedCategory === 'All';
            if (!matchesCat) {
                if (sel.includes('smartphones') && (cat.includes('smartphone') || subCat.includes('smartphone'))) matchesCat = true;
                else if (sel.includes('laptops') && (cat.includes('laptop') || subCat.includes('laptop'))) matchesCat = true;
                else if (sel.includes('audio') && (cat.includes('audio') || cat.includes('headphone') || subCat.includes('headphone') || subCat.includes('audio'))) matchesCat = true;
                else if (sel.includes('smartwatch') && (cat.includes('smartwatch') || cat.includes('wearable') || subCat.includes('wearable') || subCat.includes('smartwatch'))) matchesCat = true;
                else if (sel.includes('tablet') && (cat.includes('tablet') || cat.includes('ipad') || subCat.includes('tablet') || subCat.includes('ipad'))) matchesCat = true;
                else if (sel.includes('kitchen') && (cat.includes('kitchen') || cat.includes('home') || subCat.includes('kitchen'))) matchesCat = true;
                else if (sel.includes('camera') && (cat.includes('camera') || cat.includes('vlogging') || subCat.includes('camera'))) matchesCat = true;
                else if (sel.includes('tv') && (cat.includes('tv') || cat.includes('entertainment') || subCat.includes('tv'))) matchesCat = true;
                else if (sel.includes('fashion') && (cat.includes('fashion') || cat.includes('lifestyle') || cat.includes('apparel') || subCat.includes('footwear'))) matchesCat = true;
                else matchesCat = cat.includes(sel) || sel.includes(cat);
            }

            const q = searchQuery.toLowerCase().trim();
            const matchesQuery = !q ||
                (g.title && g.title.toLowerCase().includes(q)) ||
                (g.description && g.description.toLowerCase().includes(q)) ||
                (g.category && g.category.toLowerCase().includes(q)) ||
                (g.subCategory && g.subCategory.toLowerCase().includes(q)) ||
                (g.generalTips && g.generalTips.some(t => t.toLowerCase().includes(q))) ||
                (g.jargonBuster && g.jargonBuster.some(j => j.term.toLowerCase().includes(q) || j.explanation.toLowerCase().includes(q)));

            return matchesCat && matchesQuery;
        });
    }, [guides, selectedCategory, searchQuery]);

    // Handle Exporting the Full Purchasing Cheat Sheet
    const handleExportChecklist = () => {
        if (!selectedGuide) return;

        let text = `==========================================================\n` +
            `WISEFIND UNBIASED BUYING GUIDE: ${selectedGuide.title.toUpperCase()}\n` +
            `Category: ${selectedGuide.category} | ${selectedGuide.subCategory || ''}\n` +
            `==========================================================\n\n` +
            `🎯 EXECUTIVE VERDICT:\n"${selectedGuide.editorsAdvice}"\n\n`;

        if (selectedGuide.generalTips && selectedGuide.generalTips.length > 0) {
            text += `⭐ GENERAL UNDERSTANDING & GOLDEN RULES:\n` +
                selectedGuide.generalTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n\n') + `\n\n`;
        }

        if (selectedGuide.quickRulesOfThumb) {
            text += `✅ SMART BUYER DO'S:\n` +
                selectedGuide.quickRulesOfThumb.dos.map(d => `• ${d}`).join('\n') + `\n\n` +
                `❌ COSTLY BUYER DON'TS:\n` +
                selectedGuide.quickRulesOfThumb.donts.map(d => `• ${d}`).join('\n') + `\n\n`;
        }

        if (selectedGuide.whoShouldBuyWhat && selectedGuide.whoShouldBuyWhat.length > 0) {
            text += `👥 WHO SHOULD BUY WHAT:\n` +
                selectedGuide.whoShouldBuyWhat.map(w => 
                    `[${w.persona}] (${w.idealBudget})\n` +
                    `Advice: ${w.recommendation}\n` +
                    `Demanded Spec: ${w.keySpecToDemand}`
                ).join('\n\n') + `\n\n`;
        }

        if (selectedGuide.budgetRanges && selectedGuide.budgetRanges.length > 0) {
            text += `💰 INDIAN RUPEE (₹) PRICE TIERS:\n` +
                selectedGuide.budgetRanges.map(b => `• ${b.range}: ${b.advice}`).join('\n') + `\n\n`;
        }

        if (selectedGuide.keyFactors && selectedGuide.keyFactors.length > 0) {
            text += `📋 SPECIFICATION VERIFICATION CHECKLIST:\n` +
                selectedGuide.keyFactors.map((f, i) => `[ ] ${i + 1}. ${f.title}: ${f.desc}`).join('\n') + `\n\n`;
        }

        text += `Verified by WiseFind Intelligence Core • Free & Unsponsored`;

        try {
            navigator.clipboard.writeText(text);
            setCopiedChecklist(true);
            setTimeout(() => setCopiedChecklist(false), 3000);
        } catch (e) {
            console.error('Clipboard copy failed:', e);
        }
    };

    // Audio Playback simulation / Web Speech API
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
            const generalTipsPreview = selectedGuide.generalTips ? selectedGuide.generalTips.slice(0, 3).join('. ') : '';
            const script = `WiseFind Buying Guide for ${selectedGuide.title}. Category: ${selectedGuide.category}. ` +
                `Here are the core purchasing rules: ${generalTipsPreview}. ` +
                `Editor's verdict: ${selectedGuide.editorsAdvice}`;
            const utterance = new SpeechSynthesisUtterance(script);
            utterance.rate = 1.05;
            utterance.onend = () => setIsPlayingAudio(false);
            utterance.onerror = () => setIsPlayingAudio(false);
            window.speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => setIsPlayingAudio(false), 5000);
        }
    };

    // Run Guide Matcher Quiz
    const handleRunQuiz = () => {
        const matched = guides.find(g => 
            g.category.toLowerCase().includes(quizCategory.toLowerCase()) ||
            quizCategory.toLowerCase().includes(g.category.toLowerCase())
        ) || guides[0];
        setQuizResultGuide(matched);
        setSelectedGuide(matched);
        setActiveGuideSubTab('tips');
    };

    // Toggle factor check in checklist
    const handleToggleFactor = (factorKey) => {
        setCheckedFactors(prev => ({
            ...prev,
            [factorKey]: !prev[factorKey]
        }));
    };

    // Editorial Shortlists from products
    const trending = products.filter(p => p.isTrending);
    const editorsChoice = products.filter(p => p.isEditorChoice);
    const bestBudget = products.filter(p => p.isBestBudget);
    const bestPremium = products.filter(p => p.isBestPremium);

    // Find subcategories list for current category
    const currentSubCategories = useMemo(() => {
        if (!selectedGuide) return [];
        const cat = selectedGuide.category;
        for (const [key, list] of Object.entries(SUBCATEGORY_MAP)) {
            if (cat.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cat.toLowerCase())) {
                return list;
            }
        }
        return SUBCATEGORY_MAP['Smartphones'] || [];
    }, [selectedGuide]);

    // Active subcategory object
    const activeSubCategoryObj = useMemo(() => {
        if (!currentSubCategories || currentSubCategories.length === 0) return null;
        if (selectedSubCategory === 'All') return currentSubCategories[0];
        return currentSubCategories.find(s => s.id === selectedSubCategory) || currentSubCategories[0];
    }, [currentSubCategories, selectedSubCategory]);

    // Find Products that match the selected guide's category & subcategory
    const matchingProducts = useMemo(() => {
        if (!selectedGuide) return [];
        const guideCat = selectedGuide.category.toLowerCase();
        const guideSubCat = (selectedGuide.subCategory || '').toLowerCase();
        const subId = selectedSubCategory.toLowerCase();

        return products.filter(p => {
            const pCat = (p.category || '').toLowerCase();
            const pSubCat = (p.subCategory || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();

            const matchesCat = pCat.includes(guideCat) || guideCat.includes(pCat) ||
                   (guideSubCat && pSubCat.includes(guideSubCat)) ||
                   (guideCat.includes('smartphone') && (pSubCat.includes('smartphone') || pCat.includes('gadget'))) ||
                   (guideCat.includes('laptop') && pSubCat.includes('laptop')) ||
                   (guideCat.includes('audio') && (pSubCat.includes('audio') || pSubCat.includes('headphone'))) ||
                   (guideCat.includes('wearable') && (pSubCat.includes('smartwatch') || pSubCat.includes('wearable'))) ||
                   (guideCat.includes('kitchen') && (pCat.includes('kitchen') || pSubCat.includes('kitchen') || pCat.includes('home'))) ||
                   (guideCat.includes('fashion') && (pCat.includes('fashion') || pCat.includes('apparel')));

            if (!matchesCat) return false;

            // Subcategory-specific filtering
            if (subId.includes('budget')) {
                return p.price < 25000 || p.isBestBudget;
            }
            if (subId.includes('flagship')) {
                return p.price >= 55000 || p.isBestPremium;
            }
            if (subId.includes('gaming')) {
                return pName.includes('gaming') || pName.includes('iqoo') || pName.includes('tuf') || pName.includes('rog') || pName.includes('loq');
            }
            if (subId.includes('tws')) {
                return pSubCat.includes('tws') || pName.includes('buds') || pName.includes('airpods');
            }
            if (subId.includes('anc')) {
                return pName.includes('wh-1000') || pName.includes('quietcomfort') || pName.includes('headphones');
            }
            if (subId.includes('fryer')) {
                return pName.includes('fryer');
            }
            if (subId.includes('mixer')) {
                return pName.includes('mixer') || pName.includes('grinder');
            }
            return true;
        }).slice(0, 6);
    }, [products, selectedGuide, selectedSubCategory]);

    // Active traps list for selected guide
    const currentTraps = useMemo(() => {
        if (!selectedGuide) return [];
        if (selectedGuide.marketingTraps && selectedGuide.marketingTraps.length > 0) {
            return selectedGuide.marketingTraps;
        }
        return [];
    }, [selectedGuide]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="buying-guides-panel">
            
            {/* Header Hero Banner: Rebranded to WiseGuide */}
            <div className="bg-gradient-to-br from-[#090D16] via-[#12182B] to-[#1E293B] border border-slate-800 rounded-3xl p-6 sm:p-10 text-white mb-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-72 w-72 bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 h-56 w-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                            <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                            <span>WiseGuide™ Consumer Intelligence Hub</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                            WiseGuide — Category & Subcategory Buying Playbooks
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                            Plain-language explanations, subcategory deep dives, 5 golden rules per category, smart buyer Do's & Don'ts, rupee price tiers, and our transparent 0–100 WiseScore formula so you never overpay or fall for marketing gimmicks.
                        </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
                        <button 
                            type="button"
                            onClick={() => setIsWiseScoreModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-2xl transition-all shadow-md shadow-amber-500/20 cursor-pointer flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                            title="Understand the 5 pillars, mathematical weights, and anti-gaming algorithm behind WiseScore"
                        >
                            <Zap className="h-4 w-4 text-amber-200" />
                            <span>How WiseScore Works</span>
                        </button>

                        <button 
                            onClick={() => setShowQuiz(!showQuiz)} 
                            className="flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-2xl transition-all border border-slate-700 shadow-md cursor-pointer flex-shrink-0"
                        >
                            <Sparkles className="h-4 w-4 text-[#FBBF24]" />
                            <span>{showQuiz ? 'Close Matcher' : '30-Sec Guide Matcher'}</span>
                        </button>
                    </div>
                </div>

                {/* Interactive Guide Matcher Quiz Drawer */}
                {showQuiz && (
                    <div className="mt-8 pt-8 border-t border-slate-800 animate-fade-in bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#FBBF24]" />
                            <span>Instant Guide Matcher (Find Your Category Playbook)</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Category */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Product Category</label>
                                <select 
                                    value={quizCategory} 
                                    onChange={(e) => setQuizCategory(e.target.value)} 
                                    className="w-full bg-[#090D16] border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="Smartphones">📱 Smartphones</option>
                                    <option value="Laptops">💻 Laptops & Ultrabooks</option>
                                    <option value="Audio">🎧 Audio & Headphones</option>
                                    <option value="Smartwatches">⌚ Smartwatches & Wearables</option>
                                    <option value="Tablets">📱 Tablets & iPads</option>
                                    <option value="Home & Kitchen">🍳 Home & Kitchen</option>
                                    <option value="Cameras">📷 Cameras & Vlogging</option>
                                    <option value="Smart TVs">📺 Smart TVs & Entertainment</option>
                                    <option value="Fashion">👟 Footwear & Lifestyle</option>
                                </select>
                            </div>

                            {/* Budget */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Target Budget in ₹</label>
                                <select 
                                    value={quizBudget} 
                                    onChange={(e) => setQuizBudget(e.target.value)} 
                                    className="w-full bg-[#090D16] border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="Under ₹15,000">Under ₹15,000 (Entry Budget)</option>
                                    <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000 (Value Sweet Spot)</option>
                                    <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000 (Upper Midrange)</option>
                                    <option value="Above ₹75,000">Above ₹75,000 (Premium Flagship)</option>
                                </select>
                            </div>

                            {/* Priority */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Expectation</label>
                                <select 
                                    value={quizPriority} 
                                    onChange={(e) => setQuizPriority(e.target.value)} 
                                    className="w-full bg-[#090D16] border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="Battery & Display">🔋 Battery Longevity & Display Clarity</option>
                                    <option value="Maximum Speed & Gaming">⚡ Maximum Raw Speed & Smoothness</option>
                                    <option value="Pro Content Creation">🎨 Studio Quality Photos, Video & Sound</option>
                                    <option value="Durability & Longevity">🛡️ Built to Last 5+ Years without Slowdown</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={handleRunQuiz} 
                                className="bg-white text-slate-950 hover:bg-slate-100 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer flex items-center gap-1.5"
                            >
                                <span>Open Matched Guide & Tips</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Section: Interactive Guides Navigation & Detailed View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Category Filter and Guides List (4 Cols) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-[#4F46E5]" />
                            Category Guides
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {filteredGuides.length} Available
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search buying tips, rules, jargon..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] shadow-xs"
                        />
                    </div>

                    {/* Category Filter Pills (Scrollable) */}
                    <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
                        {categories.map((c) => {
                            const isSelected = selectedCategory === c;
                            return (
                                <button 
                                    key={c} 
                                    onClick={() => {
                                        setSelectedCategory(c);
                                        setSelectedSubCategory('All');
                                    }} 
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                                        isSelected
                                            ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm'
                                            : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>

                    {/* Subcategories Filter Chips */}
                    {currentSubCategories.length > 0 && (
                        <div className="pt-2 pb-1 border-t border-slate-200/60 dark:border-slate-800">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-indigo-400" />
                                <span>Subcategories ({currentSubCategories.length}):</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {currentSubCategories.map(sub => {
                                    const isSubSelected = selectedSubCategory === sub.id || (selectedSubCategory === 'All' && sub.id.endsWith('-all'));
                                    return (
                                        <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSubCategory(sub.id);
                                                setActiveGuideSubTab('subcategories');
                                            }}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                                                isSubSelected
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                            }`}
                                        >
                                            {sub.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Guides List Cards */}
                    <div className="space-y-2.5 pt-1 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin">
                        {filteredGuides.map((gd) => {
                            const isSelected = selectedGuide?.id === gd.id;
                            return (
                                <div 
                                    key={gd.id} 
                                    onClick={() => setSelectedGuide(gd)} 
                                    className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex justify-between items-start group ${
                                        isSelected
                                            ? 'bg-indigo-50/90 dark:bg-[#161D33] border-indigo-500 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                                            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-md'
                                    }`}
                                >
                                    <div className="pr-3">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-100/60 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
                                                {gd.category}
                                            </span>
                                            {gd.generalTips && (
                                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                                                    {gd.generalTips.length} Rules
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-[#4F46E5] transition-colors leading-snug">
                                            {gd.title}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium leading-relaxed">
                                            {gd.description}
                                        </p>
                                    </div>
                                    <ArrowRight className={`h-4 w-4 mt-1 flex-shrink-0 transition-transform ${isSelected ? 'text-[#4F46E5] translate-x-1' : 'text-slate-400'}`} />
                                </div>
                            );
                        })}

                        {filteredGuides.length === 0 && (
                            <div className="text-center py-10 bg-slate-50 dark:bg-[#111827] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
                                <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No guides matching query</p>
                                <button 
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} 
                                    className="mt-2 text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                >
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Active Selected Guide Detailed Reading Frame (8 Cols) */}
                <div className="lg:col-span-8">
                    {selectedGuide ? (
                        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
                            
                            {/* Guide Header Banner */}
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                            {selectedGuide.category}
                                        </span>
                                        {selectedGuide.subCategory && (
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                / {selectedGuide.subCategory}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button 
                                            type="button" 
                                            onClick={handleExportChecklist} 
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-[#12182B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
                                        >
                                            {copiedChecklist ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Download className="h-3.5 w-3.5 text-[#4F46E5]" />}
                                            <span>{copiedChecklist ? 'Cheat Sheet Copied!' : 'Export Cheat Sheet'}</span>
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
                                            <span>{isPlayingAudio ? 'Stop Audio' : 'Audio Brief'}</span>
                                        </button>

                                        {onOpenAdvisors && (
                                            <button 
                                                onClick={() => onOpenAdvisors(selectedGuide.category)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all cursor-pointer"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                                <span>Talk to Advisor</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mt-3">
                                    {selectedGuide.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                                    {selectedGuide.description}
                                </p>

                                {/* 💡 30-Second Quick Verdict Banner */}
                                {selectedGuide.editorsAdvice && (
                                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/30 flex items-start gap-3">
                                        <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 block mb-0.5">
                                                💡 30-Second Quick Verdict
                                            </span>
                                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                                                "{selectedGuide.editorsAdvice}"
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Sub-Tab Navigation Bar - Simplified into 4 User-Friendly Sections */}
                                <div className="flex items-center gap-2 overflow-x-auto pt-5 scrollbar-none">
                                    {[
                                        { 
                                            id: 'tips', 
                                            label: '💡 5 Simple Rules (Do\'s & Don\'ts)', 
                                            icon: Lightbulb, 
                                            activeClass: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-500/20 font-black' 
                                        },
                                        { 
                                            id: 'ranges', 
                                            label: '💰 What to Buy by Budget', 
                                            icon: Sliders, 
                                            activeClass: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md shadow-amber-500/20 font-black' 
                                        },
                                        { 
                                            id: 'traps', 
                                            label: '⚠️ Marketing Gimmicks to Avoid', 
                                            icon: ShieldAlert, 
                                            activeClass: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-transparent shadow-md shadow-rose-500/20 font-black' 
                                        },
                                        { 
                                            id: 'checklist', 
                                            label: '📋 60-Second Buyer Checklist', 
                                            icon: GraduationCap, 
                                            activeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/20 font-black' 
                                        }
                                    ].map(tab => {
                                        const Icon = tab.icon;
                                        const isActive = activeGuideSubTab === tab.id;
                                        return (
                                            <button 
                                                key={tab.id} 
                                                type="button" 
                                                onClick={() => setActiveGuideSubTab(tab.id)} 
                                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap border ${
                                                    isActive
                                                        ? tab.activeClass
                                                        : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 font-bold'
                                                }`}
                                            >
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ============================================================== */}
                            {/* TAB 1: General Understanding & Practical Category Tips (NEW)  */}
                            {/* ============================================================== */}
                            {activeGuideSubTab === 'tips' && (
                                <div className="space-y-6 animate-fade-in">
                                    
                                    {/* 1. Golden Rules of General Understanding */}
                                    {selectedGuide.generalTips && selectedGuide.generalTips.length > 0 && (
                                        <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50/50 dark:from-[#0F172A] dark:via-[#131B33] dark:to-[#0B101D] border border-indigo-200/80 dark:border-indigo-900/60 rounded-3xl p-5 sm:p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs sm:text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                                    The Golden Rules of Purchasing {selectedGuide.category}
                                                </h4>
                                                <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                                                    Must-Know Principles
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                {selectedGuide.generalTips.map((tip, idx) => {
                                                    const parts = tip.split('—');
                                                    const ruleTitle = parts[0]?.trim();
                                                    const ruleBody = parts[1]?.trim() || '';

                                                    return (
                                                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-[#111827]/80 border border-indigo-100 dark:border-slate-800 shadow-2xs">
                                                            <div className="flex-shrink-0 h-6 w-6 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-[11px] flex items-center justify-center mt-0.5 shadow-xs">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="text-xs leading-relaxed">
                                                                <span className="font-black text-slate-900 dark:text-white block sm:inline">
                                                                    {ruleTitle} {parts.length > 1 && '—'}
                                                                </span>{' '}
                                                                <span className="text-slate-600 dark:text-slate-300 font-medium">
                                                                    {ruleBody}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. Quick Rules of Thumb (Do's and Don'ts) */}
                                    {selectedGuide.quickRulesOfThumb && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* DO's */}
                                            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-5 space-y-3">
                                                <h5 className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    Smart Buyer DO's
                                                </h5>
                                                <ul className="space-y-2.5">
                                                    {selectedGuide.quickRulesOfThumb.dos.map((item, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* DONT's */}
                                            <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 space-y-3">
                                                <h5 className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                                                    <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                                    Costly Buyer DON'Ts
                                                </h5>
                                                <ul className="space-y-2.5">
                                                    {selectedGuide.quickRulesOfThumb.donts.map((item, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                            <span className="text-rose-600 dark:text-rose-400 font-bold mt-0.5">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. Who Should Buy What? Decision Matrix */}
                                    {selectedGuide.whoShouldBuyWhat && selectedGuide.whoShouldBuyWhat.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                                <Users className="h-4 w-4 text-[#4F46E5]" />
                                                Who Should Buy What? (Tailored Buyer Recommendations)
                                            </h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                {selectedGuide.whoShouldBuyWhat.map((item, idx) => (
                                                    <div key={idx} className="bg-slate-50 dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-2.5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all">
                                                        <div>
                                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                                                    {item.persona}
                                                                </span>
                                                                <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-900/60 whitespace-nowrap">
                                                                    {item.idealBudget}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                                                {item.recommendation}
                                                            </p>
                                                        </div>

                                                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1.5 text-[10px] text-purple-700 dark:text-purple-300 font-bold">
                                                            <Zap className="h-3 w-3 text-amber-500 flex-shrink-0" />
                                                            <span className="truncate">Key Spec: {item.keySpecToDemand}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Must-Have vs Nice-to-Have vs Skip Feature Sorter */}
                                    {selectedGuide.mustHaveVsNiceToHave && (
                                        <div className="bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                                <Layers className="h-4 w-4 text-[#4F46E5]" />
                                                Feature Priority: Must-Have vs Nice-to-Have vs Gimmicks
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {/* Must Have */}
                                                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                                        Must-Have Baseline
                                                    </span>
                                                    <div className="space-y-1.5">
                                                        {selectedGuide.mustHaveVsNiceToHave.mustHave.map((m, i) => (
                                                            <div key={i} className="text-[11px] text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5">
                                                                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                                                <span>{m}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Nice to Have */}
                                                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                                                        Nice-to-Have (Worth It)
                                                    </span>
                                                    <div className="space-y-1.5">
                                                        {selectedGuide.mustHaveVsNiceToHave.niceToHave.map((n, i) => (
                                                            <div key={i} className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                                                                <span className="text-amber-500 font-black">+</span>
                                                                <span>{n}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Skip / Gimmicks */}
                                                <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                                                        Skip / Don't Overpay
                                                    </span>
                                                    <div className="space-y-1.5">
                                                        {selectedGuide.mustHaveVsNiceToHave.skipGimmicks.map((s, i) => (
                                                            <div key={i} className="text-[11px] text-rose-900 dark:text-rose-300 font-medium flex items-center gap-1.5">
                                                                <XCircle className="h-3 w-3 text-rose-500 flex-shrink-0" />
                                                                <span>{s}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}

                            {/* ============================================================== */}
                            {/* TAB: Subcategory Deep-Dive Playbooks (WiseGuide)               */}
                            {/* ============================================================== */}
                            {activeGuideSubTab === 'subcategories' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-900/40 p-4 sm:p-5 rounded-2xl">
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block mb-1">
                                                🎯 Subcategory Deep-Dive Field Guide
                                            </span>
                                            <h3 className="text-base sm:text-lg font-black text-white">
                                                {selectedGuide.category}: Subcategory Playbooks
                                            </h3>
                                            <p className="text-xs text-slate-300 font-medium mt-0.5">
                                                Don't treat all devices the same. Switch subcategories below for tailored specs, rupee budget targets, and pitfalls.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Subcategory Pills Selector inside tab */}
                                    <div className="flex flex-wrap gap-2">
                                        {currentSubCategories.map(sub => {
                                            const isSubSelected = selectedSubCategory === sub.id || (selectedSubCategory === 'All' && sub.id.endsWith('-all'));
                                            return (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    onClick={() => setSelectedSubCategory(sub.id)}
                                                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                                                        isSubSelected
                                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                                                            : 'bg-slate-50 dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                                                    }`}
                                                >
                                                    <span>{sub.name}</span>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                                        isSubSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                                    }`}>
                                                        {sub.tag}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Active Subcategory Detailed Playbook */}
                                    {activeSubCategoryObj && (
                                        <div className="bg-slate-50/80 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider mb-1.5">
                                                        <span>{activeSubCategoryObj.tag}</span>
                                                    </div>
                                                    <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                                                        {activeSubCategoryObj.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                                                        <strong className="text-slate-900 dark:text-white">Target Persona:</strong> {activeSubCategoryObj.persona}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-left sm:text-right">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 block">Rupee Price Sweet-Spot</span>
                                                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                                        {activeSubCategoryObj.idealBudget}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Key Specs Demanded vs Red Flags */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Demanded Specs */}
                                                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-4 sm:p-5 space-y-3">
                                                    <h5 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                        <span>Non-Negotiable Specs to Demand</span>
                                                    </h5>
                                                    <div className="space-y-2">
                                                        {activeSubCategoryObj.keySpecs.map((spec, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                                                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                                <span>{spec}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Costly Red Flags to Avoid */}
                                                <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-4 sm:p-5 space-y-3">
                                                    <h5 className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                                                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                                        <span>Costly Traps & Don'ts for this Subcategory</span>
                                                    </h5>
                                                    <div className="space-y-2">
                                                        {activeSubCategoryObj.dontBuy.map((trap, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-xs text-rose-900 dark:text-rose-300 font-medium leading-relaxed">
                                                                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                                                <span>{trap}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subcategory Editorial Verdict */}
                                            <div className="bg-white dark:bg-[#111827] border border-indigo-200 dark:border-indigo-900/60 p-4 rounded-2xl flex items-start gap-3">
                                                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                                                    <strong className="text-slate-900 dark:text-white font-black block mb-0.5">WiseGuide Subcategory Verdict:</strong>
                                                    {activeSubCategoryObj.verdict}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ============================================================== */}
                            {/* TAB: How WiseScore Works (Transparency & Calculation Engine)    */}
                            {/* ============================================================== */}
                            {activeGuideSubTab === 'wisescore' && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Top Banner */}
                                    <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-600/15 border border-amber-500/30 p-5 sm:p-7 rounded-3xl relative overflow-hidden">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                                                    <Zap className="w-3.5 h-3.5" />
                                                    <span>WiseScore™ Transparency Engine</span>
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-black text-white">
                                                    How WiseScore™ Determines & Calculates Value (0–100)
                                                </h3>
                                                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                                                    WiseScore is an independent, non-sponsored buying intelligence metric computed across 5 weighted pillars. Star ratings on e-commerce sites are flooded with bots; WiseScore mathematically strips marketing bias to find what's truly worth your rupees.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setIsWiseScoreModalOpen(true)}
                                                className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/25 shrink-0 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <Sliders className="w-4 h-4" />
                                                <span>Open Live Simulator</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* The Mathematical Formula */}
                                    <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                <Calculator className="w-4 h-4 text-indigo-400" />
                                                <span>Mathematical Composite Formula</span>
                                            </h4>
                                            <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-950 px-2.5 py-0.5 rounded-full">
                                                100% Deterministic & Audited
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 font-mono text-xs sm:text-sm text-indigo-300 overflow-x-auto text-center font-bold">
                                            WiseScore = (0.30 × HW_Value) + (0.25 × Reliability) + (0.20 × Spec_Authenticity) + (0.15 × Software) + (0.10 × Price_Stability) − Gimmick_Penalties
                                        </div>

                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                            Each dimension is scored 0–100 after normalizing against current market class leaders. Then marketing gimmick penalties are surgically subtracted (e.g., −7 pts for 2MP filler camera, −5 pts for virtual RAM tricks, −10 pts for slow eMMC storage).
                                        </p>
                                    </div>

                                    {/* 5 Pillars Cards */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-emerald-400" />
                                            <span>The 5 Core Scoring Pillars</span>
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                {
                                                    title: 'Hardware Value & Benchmarks',
                                                    weight: '30%',
                                                    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
                                                    icon: Cpu,
                                                    desc: 'Processor benchmark speed (AnTuTu/Geekbench), display quality (120Hz LTPO AMOLED, 100% sRGB), physical RAM type (LPDDR5X), and real thermal heat dissipation per rupee spent.'
                                                },
                                                {
                                                    title: 'Real-World Reliability & User Sentiment',
                                                    weight: '25%',
                                                    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                                                    icon: ShieldCheck,
                                                    desc: 'Aggregates thousands of verified buyer reviews across Amazon, Flipkart, Croma, and Reddit. NLP de-biasing filters out incentivized bot reviews; measures 12-month durability and Indian service network quality.'
                                                },
                                                {
                                                    title: 'Feature Authenticity & Anti-Gimmick',
                                                    weight: '20%',
                                                    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                                                    icon: AlertTriangle,
                                                    desc: 'Penalizes deceptive marketing illusions: 2MP macro filler lenses (-7 pts), Virtual RAM expansion tricks (-5 pts), 1-second peak brightness claims (-4 pts), and slow eMMC flash storage (-10 pts).'
                                                },
                                                {
                                                    title: 'Software Support & OS Longevity',
                                                    weight: '15%',
                                                    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
                                                    icon: RefreshCw,
                                                    desc: 'Guaranteed Android/iOS/Windows version upgrades (3 to 7 years), security patch frequency, and interface cleanliness (zero glance lockscreen ads, push ad spam, or uninstallable bloatware).'
                                                },
                                                {
                                                    title: 'Multi-Store Price Stability',
                                                    weight: '10%',
                                                    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
                                                    icon: TrendingUp,
                                                    desc: 'Tracks live Amazon, Flipkart, Meesho, and Croma prices against 90-day historic lows to detect artificial price hikes before festival sales and confirm if an advertised discount is genuine.'
                                                }
                                            ].map((pillar, i) => {
                                                const Icon = pillar.icon;
                                                return (
                                                    <div key={i} className={`p-4 rounded-2xl border ${pillar.color} space-y-2`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4 text-white" />
                                                                <h5 className="font-black text-xs text-white">{pillar.title}</h5>
                                                            </div>
                                                            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono">
                                                                {pillar.weight}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                                            {pillar.desc}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Score Tiers Table */}
                                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-amber-400" />
                                            <span>Score Classification & What It Means For You</span>
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                                            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                                                <span className="text-base">🏆</span>
                                                <h6 className="font-black text-amber-300">93 – 100: Wise Choice</h6>
                                                <p className="text-[11px] text-slate-300 font-medium">Top 5% market leader. Zero gimmick compromises; unmatched value.</p>
                                            </div>
                                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                                                <span className="text-base">⭐</span>
                                                <h6 className="font-black text-emerald-300">85 – 92: Smart Buy</h6>
                                                <p className="text-[11px] text-slate-300 font-medium">Dependable daily driver. High user satisfaction and great specs.</p>
                                            </div>
                                            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                                                <span className="text-base">⚖️</span>
                                                <h6 className="font-black text-blue-300">75 – 84: Balanced Value</h6>
                                                <p className="text-[11px] text-slate-300 font-medium">Solid performer, but buy primarily when accompanied by a price drop.</p>
                                            </div>
                                            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                                                <span className="text-base">⚠️</span>
                                                <h6 className="font-black text-rose-300">Below 75: Caution</h6>
                                                <p className="text-[11px] text-slate-300 font-medium">Heavy marketing gimmicks, slow eMMC storage, or uncompetitive pricing.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ============================================================== */}
                            {/* TAB 2: Hardware Specification Checklist                        */}
                            {/* ============================================================== */}
                            {activeGuideSubTab === 'checklist' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <GraduationCap className="h-4 w-4 text-[#4F46E5]" />
                                            Essential Specification Verification Checklist
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
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
                                                        <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 leading-relaxed font-medium">
                                                            {factor.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ============================================================== */}
                            {/* TAB 3: Marketing Traps & Gimmick Scanner                       */}
                            {/* ============================================================== */}
                            {activeGuideSubTab === 'traps' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <ShieldAlert className="h-4 w-4 text-rose-500" />
                                            Marketing Traps & Gimmicks to Avoid
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            100% Unsponsored & Unbiased Analysis
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {currentTraps.map((item, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
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

                                        {currentTraps.length === 0 && (
                                            <div className="p-6 text-center text-xs text-slate-500">
                                                No known traps reported for this category.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ============================================================== */}
                            {/* TAB 4: Rupee Price Tiers & Budgets                             */}
                            {/* ============================================================== */}
                            {activeGuideSubTab === 'ranges' && (
                                <div className="space-y-3 animate-fade-in">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sliders className="h-4 w-4 text-cyan-500" />
                                        Indian Rupee (₹) Price Tiers & Value Expectations
                                    </h4>
                                    <div className="space-y-2.5">
                                        {selectedGuide.budgetRanges.map((br, bidx) => (
                                            <div key={bidx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/80 dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800 rounded-2xl gap-3">
                                                <span className="text-xs font-black text-slate-900 dark:text-white sm:w-1/3 flex items-center gap-1.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]"></span>
                                                    <span>{br.range}</span>
                                                </span>
                                                <span className="text-xs text-slate-600 dark:text-slate-300 sm:w-2/3 font-medium leading-relaxed">
                                                    {br.advice}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ============================================================== */}
                            {/* TAB 5: Jargon Decrypter Definitions                            */}
                            {/* ============================================================== */}
                            {activeGuideSubTab === 'jargon' && (
                                <div className="space-y-3 animate-fade-in">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <HelpCircle className="h-4 w-4 text-[#37D0C0]" />
                                        Jargon Decrypter (Confusing Tech Specs Translated)
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedGuide.jargonBuster.map((jb, jidx) => (
                                            <div key={jidx} className="bg-slate-50 dark:bg-[#0B101D] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
                                                <span className="font-extrabold text-xs block text-purple-600 dark:text-purple-400">
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

                            {/* ============================================================== */}
                            {/* Matching Curated Hardware Products for this category          */}
                            {/* ============================================================== */}
                            {matchingProducts.length > 0 && (
                                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Sparkles className="h-4 w-4 text-amber-500" />
                                            Curated Products Matching {selectedGuide.category}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            {matchingProducts.length} Verified Picks
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {matchingProducts.map((p) => {
                                            const isFav = favorites.some(f => f.id === p.id);
                                            return (
                                                <div 
                                                    key={p.id} 
                                                    className="group bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-between space-y-2 hover:border-indigo-400 dark:hover:border-indigo-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-150"
                                                >
                                                    <div>
                                                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 mb-2">
                                                            <SafeProductImage 
                                                                src={p.image} 
                                                                alt={p.name} 
                                                                category={p.category} 
                                                                className="h-24 w-full object-cover group-hover:scale-105 transition-transform duration-150"
                                                            />
                                                        </div>
                                                        <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
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

                            {/* ============================================================== */}
                            {/* Editor-in-Chief Ultimate Verdict                               */}
                            {/* ============================================================== */}
                            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-300/60 dark:border-amber-900/60 rounded-2xl p-5 space-y-1.5 shadow-2xs">
                                <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                                    <Award className="h-4 w-4 text-amber-600" />
                                    <span>Editor-in-Chief Category Verdict</span>
                                </span>
                                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold italic">
                                    "{selectedGuide.editorsAdvice}"
                                </p>
                            </div>

                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-[#111827] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center space-y-3">
                            <BookOpen className="h-12 w-12 text-slate-300 animate-pulse" />
                            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Select a Buying Guide</h3>
                            <p className="text-xs text-slate-500 max-w-sm">
                                Choose a product category to unlock 5 golden rules, Do's & Don'ts, rupee price tiers, and marketing gimmick warnings.
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* Global WiseScore Transparency & Formula Modal */}
            <WiseScoreModal 
                isOpen={isWiseScoreModalOpen} 
                onClose={() => setIsWiseScoreModalOpen(false)} 
                initialProduct={matchingProducts[0] || null}
            />
        </div>
    );
}
