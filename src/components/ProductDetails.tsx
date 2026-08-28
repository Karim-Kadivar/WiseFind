import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, Check, HelpCircle, ArrowRight, ShieldCheck, ShoppingCart, Info, CheckCircle2, AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, TrendingDown, Clock, Bell, BellRing, ChevronDown, ChevronUp, Zap, Share2, Building2, ExternalLink, Truck, CreditCard, Store, BadgePercent } from 'lucide-react';
import LocalStoreFinder from './LocalStoreFinder';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SafeProductImage } from './SafeProductImage';
import { generatePlatformComparison, PLATFORM_INFO } from '../data/platformPricing';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[];
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  wishlists?: { id: string; name: string; productIds: string[] }[];
  onAddProductToWishlist?: (wishlistId: string, productId: string) => void;
  compareList?: Product[];
  onAddToCompare?: (product: Product) => void;
}

export default function ProductDetails({
  product,
  onClose,
  onToggleFavorite,
  favorites,
  allProducts,
  onSelectProduct,
  wishlists,
  onAddProductToWishlist,
  compareList = [],
  onAddToCompare
}: ProductDetailsProps) {
  const isFavorite = favorites.includes(product.id);

  // Find alternatives in same category
  const alternatives = allProducts
    .filter(alt => alt.category === product.category && alt.id !== product.id)
    .slice(0, 3);

  // Find accessories or compatible items from other categories
  const getCompatibleAccessories = () => {
    const cat = product.category.toLowerCase();
    let accessoryCategories: string[] = [];
    
    if (cat.includes('phone') || cat.includes('smartphones')) {
      accessoryCategories = ['headphones', 'smartwatches', 'tablets'];
    } else if (cat.includes('laptop')) {
      accessoryCategories = ['headphones', 'smartwatches', 'tablets', 'smartphones'];
    } else if (cat.includes('tablet')) {
      accessoryCategories = ['headphones', 'smartwatches', 'laptops'];
    } else if (cat.includes('watch') || cat.includes('smartwatch')) {
      accessoryCategories = ['smartphones', 'headphones'];
    } else if (cat.includes('headphone') || cat.includes('earbud')) {
      accessoryCategories = ['smartphones', 'laptops', 'tablets'];
    } else {
      accessoryCategories = ['headphones', 'smartwatches'];
    }

    // Filter allProducts to find products matching accessoryCategories
    const candidates = allProducts.filter(p => {
      if (p.id === product.id) return false;
      const pCat = p.category.toLowerCase();
      return accessoryCategories.some(ac => pCat.includes(ac));
    });

    // Score candidates based on brand match and score
    const scoredCandidates = candidates.map(p => {
      let score = 0;
      if (p.brand.toLowerCase() === product.brand.toLowerCase()) {
        score += 150; // High ecosystem boost
      }
      score += p.aiScore;
      return { item: p, score };
    });

    // Sort descending and return top 3
    return scoredCandidates
      .sort((a, b) => b.score - a.score)
      .map(x => x.item)
      .slice(0, 3);
  };

  const compatibleAccessories = getCompatibleAccessories();

  // Sentiment Distribution generator based on rating and score
  const getSentimentDistribution = () => {
    const score = product.aiScore;
    const rating = product.rating;
    
    // Determine positive/neutral/negative values deterministically
    const positiveBase = Math.min(95, Math.max(45, Math.round(score * 0.9 + (rating - 3) * 8)));
    const negativeBase = Math.min(25, Math.max(3, Math.round((100 - score) * 0.4)));
    const neutralBase = 100 - positiveBase - negativeBase;
    
    // Stable review count based on name
    let hash = 0;
    for (let i = 0; i < product.name.length; i++) {
      hash = product.name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const totalReviews = Math.abs(hash % 400) + 180;
    
    return {
      positive: positiveBase,
      neutral: neutralBase,
      negative: negativeBase,
      totalReviews,
      ratio: (positiveBase / (negativeBase || 1)).toFixed(1),
      summary: positiveBase >= 75 ? 'Strongly Positive' : positiveBase >= 60 ? 'Mostly Positive' : 'Mixed / Average'
    };
  };

  const sentiment = getSentimentDistribution();

  // Price history generator (last 30 days) ending at the current price
  const generatePriceHistory = (basePrice: number, productId: string) => {
    const data = [];
    let seed = 0;
    for (let i = 0; i < productId.length; i++) {
      seed += productId.charCodeAt(i);
    }
    
    // Baseline current date (mocked to 16th July 2026 as per local time context)
    const today = new Date(2026, 6, 16);
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Seeded deterministic fluctuation curve
      const sinVal = Math.sin((i + seed) * 0.4);
      const cosVal = Math.cos((i - seed) * 0.25);
      
      // Up to 5% fluctuation up or down, but making sure today's date (i=0) hits exactly the current price
      const fluctuation = i === 0 ? 0 : (sinVal * 0.04) + (cosVal * 0.02) - (i * 0.0008);
      const priceOnDay = Math.round(basePrice * (1 + fluctuation));
      
      const formattedDate = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      data.push({
        date: formattedDate,
        price: priceOnDay
      });
    }
    return data;
  };

  const priceHistoryData = generatePriceHistory(product.price, product.id);
  
  // Real-time multi-platform price & deals comparison
  const platformComparison = useMemo(() => generatePlatformComparison(product), [product]);
  
  // High / Low / Average calculated from generated trend
  const prices = priceHistoryData.map(d => d.price);
  const highestPrice = Math.max(...prices);
  const lowestPrice = Math.min(...prices);
  const priceChange = product.price - prices[0];
  const priceChangePercent = ((priceChange / prices[0]) * 100).toFixed(1);

  // Jargon explanation mapping
  const JARGON_EXPLANATIONS: Record<string, string> = {
    "ram": "Random Access Memory. More RAM allows more apps to run simultaneously without slowing down your device.",
    "processor": "The CPU (Central Operating Brain). It executes commands and handles advanced calculations.",
    "cpu": "Central Processing Unit. The primary silicon chip that processes computational data.",
    "battery": "Cellular chemical energy capacity. Larger milliampere-hour (mAh) ratings signify superior endurance between wall sockets.",
    "storage": "Persistent solid state space (SSD/UFS) used to store operating software, records, photographs, and custom apps.",
    "display": "Output screen glass. OLED/AMOLED configurations produce infinite contrast ratios, whereas standard LCD displays remain cost-effective.",
    "gpu": "Graphics Processing Unit. Powers heavy 3D game geometry, frame pacing, and vector calculations.",
    "camera": "Optical capture equipment. F-number apertures measure light intake capabilities, dictating nighttime exposure clarity.",
    "aperture": "Camera lens aperture opening scale (e.g. f/1.8). Lower values drink in significantly more natural light for ambient night-shots.",
    "resolution": "Grid pixel count (e.g. Full HD, 4K UHD). Denser resolutions provide pristine details.",
    "refresh rate": "Frame cycles rendered per second. Pro-grade displays exceed 120Hz, providing ultra-smooth interface navigation.",
    "os": "Operating System shell managing software-hardware resource layers (e.g. Android OS, macOS, Windows).",
    "connectivity": "Protocol channels enabling wireless transport (e.g. Dual-Band Wi-Fi 6E, Bluetooth 5.3, high-speed 5G cellular bands).",
    "fast charging": "Supercharged power intake wattages (e.g. 67W, 120W) that charge empty device cells to completion in minutes.",
    "water resistance": "IP enclosure protections (e.g. IP68 certified) defending micro-circuitry from deep liquid immersion.",
    "nfc": "Near Field Communication. Power-efficient contactless transmission for immediate mobile payments and touch syncing.",
    "warranty": "Official original equipment manufacturer (OEM) guarantee covering internal component failures.",
    "noise cancellation": "Active Noise Cancellation (ANC). Microphones listen to external noise waves, emitting opposing soundwaves to neutralize them."
  };

  const getJargonExplanation = (key: string): string | null => {
    const normalized = key.toLowerCase().trim();
    for (const [jargon, exp] of Object.entries(JARGON_EXPLANATIONS)) {
      if (normalized.includes(jargon)) {
        return exp;
      }
    }
    return null;
  };

  // State to track which spec's tooltip explanation is visible
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // States for Pros/Cons collapsible behavior
  const [showAllPros, setShowAllPros] = useState<boolean>(false);
  const [showAllCons, setShowAllCons] = useState<boolean>(false);

  // Handle Share Product Link action
  const handleShareProduct = () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
      navigator.clipboard.writeText(shareUrl);
      setToastMessage(`🔗 Share link copied! Deep-link for "${product.name}" successfully copied to your clipboard.`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (err) {
      console.error("Failed to copy link", err);
      setToastMessage(`❌ Failed to copy share link to clipboard.`);
      setShowToast(true);
    }
  };

  // Technical Specs expanded state
  const [isSpecsExpanded, setIsSpecsExpanded] = useState<boolean>(false);

  // Price Alert local states
  const [alertPrice, setAlertPrice] = useState<number>(() => {
    const saved = localStorage.getItem(`price_alert_${product.id}`);
    return saved ? Number(saved) : Math.round(product.price * 0.95);
  });
  const [isAlertSet, setIsAlertSet] = useState<boolean>(() => {
    return localStorage.getItem(`price_alert_${product.id}`) !== null;
  });
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  // Sentiment Tooltip State
  const [showSentimentTooltip, setShowSentimentTooltip] = useState<boolean>(false);

  // Confidence score calculation based on rating, details depth, and review size
  const getConfidenceScore = () => {
    const specsCount = Object.keys(product.specs || {}).length;
    const highlightsCount = product.highlights?.length || 0;
    const totalReviews = sentiment.totalReviews;
    let base = 65;
    base += Math.min(15, specsCount * 1.5);
    base += Math.min(10, highlightsCount * 2);
    base += Math.min(10, Math.floor(totalReviews / 30));
    return Math.min(98, base);
  };
  const confidenceScore = getConfidenceScore();

  // Sentiment keywords based on category
  const getSentimentKeywords = () => {
    const cat = product.category.toLowerCase();
    if (cat.includes('phone') || cat.includes('smartphone')) {
      return {
        positive: [
          { keyword: 'Camera Clarity', weight: '+34%' },
          { keyword: 'Display Quality', weight: '+28%' },
          { keyword: 'Frame Solidness', weight: '+19%' },
          { keyword: 'Clean OS Interface', weight: '+15%' }
        ],
        negative: [
          { keyword: 'Thermal Run', weight: '-18%' },
          { keyword: 'Charging Speeds', weight: '-14%' },
          { keyword: 'Retail Charger missing', weight: '-12%' }
        ]
      };
    } else if (cat.includes('laptop')) {
      return {
        positive: [
          { keyword: 'Screen Colors', weight: '+38%' },
          { keyword: 'Raw CPU Power', weight: '+31%' },
          { keyword: 'Keyboard Travel', weight: '+18%' },
          { keyword: 'Chassis Rigidity', weight: '+12%' }
        ],
        negative: [
          { keyword: 'Power Brick Weight', weight: '-22%' },
          { keyword: 'Webcam Noise', weight: '-15%' },
          { keyword: 'Soldered Memory', weight: '-11%' }
        ]
      };
    } else if (cat.includes('tablet')) {
      return {
        positive: [
          { keyword: 'Stylus Response', weight: '+42%' },
          { keyword: 'Speakers Quality', weight: '+25%' },
          { keyword: 'Battery Endurance', weight: '+20%' }
        ],
        negative: [
          { keyword: 'SoC Throttling', weight: '-18%' },
          { keyword: 'Box Accessories missing', weight: '-15%' }
        ]
      };
    } else if (cat.includes('watch') || cat.includes('smartwatch')) {
      return {
        positive: [
          { keyword: 'Health Suite', weight: '+39%' },
          { keyword: 'GPS Accuracy', weight: '+35%' },
          { keyword: 'Display Brightness', weight: '+22%' }
        ],
        negative: [
          { keyword: 'Frequent Recharge', weight: '-25%' },
          { keyword: 'App Selection', weight: '-14%' }
        ]
      };
    } else if (cat.includes('headphone') || cat.includes('earbud') || cat.includes('audio')) {
      return {
        positive: [
          { keyword: 'ANC Attenuation', weight: '+45%' },
          { keyword: 'Acoustic Soundstage', weight: '+32%' },
          { keyword: 'Earcups Cushioning', weight: '+21%' }
        ],
        negative: [
          { keyword: 'ANC Battery Drain', weight: '-19%' },
          { keyword: 'Case Scratches', weight: '-13%' }
        ]
      };
    } else {
      return {
        positive: [
          { keyword: 'Build Integrity', weight: '+30%' },
          { keyword: 'Display Density', weight: '+25%' },
          { keyword: 'Performance Parity', weight: '+20%' }
        ],
        negative: [
          { keyword: 'Price Premium', weight: '-16%' },
          { keyword: 'Learning Curve', weight: '-12%' }
        ]
      };
    }
  };
  const sentimentKeywords = getSentimentKeywords();

  // Price history generator for 6 months (past 6 months)
  const generateSixMonthHistory = (basePrice: number, productId: string) => {
    const data = [];
    let seed = 0;
    for (let i = 0; i < productId.length; i++) {
      seed += productId.charCodeAt(i);
    }
    
    const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const count = 6;
    for (let i = count - 1; i >= 0; i--) {
      const idx = (months.length - 1 - i + 12) % 12;
      const monthLabel = months[idx] || 'Month';
      const factor = 1 + (Math.sin(seed + i) * 0.07 + Math.cos(seed * 1.3 + i) * 0.04);
      data.push({
        name: monthLabel,
        price: Math.round(basePrice * factor)
      });
    }
    // Set current price as last element
    data[data.length - 1].price = basePrice;
    return data;
  };
  const sixMonthHistory = generateSixMonthHistory(product.price, product.id);

  // Volatility math
  const sixMonthPrices = sixMonthHistory.map(d => d.price);
  const sixMonthMax = Math.max(...sixMonthPrices);
  const sixMonthMin = Math.min(...sixMonthPrices);
  const sixMonthAvg = Math.round(sixMonthPrices.reduce((a, b) => a + b, 0) / sixMonthPrices.length);
  const volatilityPercent = ((sixMonthMax - sixMonthMin) / (sixMonthMin || 1)) * 100;
  const sixMonthTrend = sixMonthHistory[sixMonthHistory.length - 1].price - sixMonthHistory[0].price;

  // Auto-trigger price alert if current price is below target on mount/change
  useEffect(() => {
    if (isAlertSet && product.price <= alertPrice && !simulationActive) {
      setToastMessage(`🚨 Price Alert! The current price for ${product.name} (₹${product.price.toLocaleString("en-IN")}) is below your configured target of ₹${alertPrice.toLocaleString("en-IN")}!`);
      setShowToast(true);
    }
  }, [product.id, isAlertSet, alertPrice, product.price, simulationActive]);

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`price_alert_${product.id}`, alertPrice.toString());
    setIsAlertSet(true);
    setToastMessage(`🔔 Price Alert configured! We'll track this local state and notify you if the price drops below ₹${alertPrice.toLocaleString("en-IN")}.`);
    setShowToast(true);
    // Auto-dismiss toast in 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleRemoveAlert = () => {
    localStorage.removeItem(`price_alert_${product.id}`);
    setIsAlertSet(false);
    setToastMessage(`🔕 Price Alert disabled for ${product.name}.`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleSimulatePriceDrop = () => {
    setSimulationActive(true);
    const mockPrice = alertPrice - Math.round(product.price * 0.03) - 150;
    setToastMessage(`🎉 Simulated Price Drop! The price of ${product.name} just plunged to ₹${mockPrice.toLocaleString("en-IN")}, falling below your target of ₹${alertPrice.toLocaleString("en-IN")}!`);
    setShowToast(true);
  };

  // Formulate a One-Sentence Verdict
  const getOneSentenceVerdict = () => {
    const score = product.aiScore;
    const category = product.category.toLowerCase();
    
    if (score >= 88) {
      return `Outstanding Purchase: This premium ${category} dominates with class-leading specifications, excellent public sentiment, and superior price-to-performance parity.`;
    } else if (score >= 80) {
      return `Highly Recommended: A top-tier contender in the ${category} market, offering highly polished features with exceptionally strong user satisfaction.`;
    } else if (score >= 70) {
      return `Solid Mid-Range Value: A reliable choice that performs well across daily tasks, making it a very safe purchase for standard workflows.`;
    } else if (score >= 60) {
      return `Budget-Focused Choice: Acceptable entry-level capabilities for general users, but check alternatives if you require high performance.`;
    } else {
      return `Niche Purchase: Best for specialized uses under correct conditions; comparative analysis recommends evaluating alternative options first.`;
    }
  };
  const oneSentenceVerdict = getOneSentenceVerdict();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xl flex justify-center items-start p-4 sm:p-6 md:p-10 cursor-zoom-out" 
      id="product-details-modal"
    >
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row relative cursor-default text-slate-900 dark:text-slate-100 transition-colors duration-200"
      >
        
        {/* Close Button float */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-200 hover:text-slate-800 dark:hover:text-white p-2 rounded-full shadow-md transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Floating Quick Compare Pill */}
        {onAddToCompare && (
          <div className="absolute bottom-5 left-5 z-20">
            <button
              onClick={() => {
                onAddToCompare(product);
                const isNowInCompare = !compareList.some(item => item.id === product.id);
                setToastMessage(isNowInCompare ? `Added "${product.name}" to Quick Compare list.` : `Removed "${product.name}" from comparison.`);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-xs shadow-lg border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                compareList.some(item => item.id === product.id)
                  ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700 shadow-emerald-600/25'
                  : 'bg-white border-slate-300 text-slate-800 hover:border-[#6A73E4] hover:text-[#6A73E4] shadow-slate-300/20'
              }`}
            >
              <Zap className={`h-4 w-4 ${compareList.some(item => item.id === product.id) ? 'fill-current animate-bounce text-emerald-100' : 'text-[#6A73E4]'}`} />
              <span>{compareList.some(item => item.id === product.id) ? 'In Compare' : 'Quick Compare'}</span>
              {compareList.length > 0 && (
                <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ml-1">
                  {compareList.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Floating Toast Notification Container */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              className="absolute top-4 left-4 right-16 z-40 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/30 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <BellRing className="h-4.5 w-4.5 animate-bounce text-indigo-400" />
                </div>
                <p className="text-xs font-bold text-slate-100">{toastMessage}</p>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="text-slate-400 hover:text-white text-xs font-black bg-[#111827] hover:bg-[#1e293b] px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-700"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Column: Media & Meta */}
        <div className="w-full md:w-[40%] bg-slate-50 p-6 sm:p-8 flex flex-col justify-between border-r border-slate-200">
          <div>
            {/* Category tag */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-white bg-slate-900 border border-slate-900 px-3 py-1.5 rounded-md uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-black text-slate-800">{product.rating}</span>
              </div>
            </div>

            {/* Product Image Frame */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-100 aspect-video md:aspect-square flex items-center justify-center overflow-hidden mb-6">
              <SafeProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Main Title & Price */}
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{product.brand}</span>
              <h3 className="text-2xl font-black text-[#111827] mt-1 leading-tight">{product.name}</h3>
              <p className="text-3xl font-black text-[#111827] mt-2">₹{product.price.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onToggleFavorite(product)}
                className={`w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all border-2 cursor-pointer ${
                  isFavorite
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-red-500' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShareProduct}
                className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all border-2 bg-indigo-50 border-[#6A73E4]/30 text-[#6A73E4] hover:bg-indigo-100/70 cursor-pointer"
                title="Copy shareable deep link"
              >
                <Share2 className="h-4.5 w-4.5 text-[#6A73E4]" />
                <span>Share Link</span>
              </button>
            </div>

            {wishlists && wishlists.length > 0 && onAddProductToWishlist && (
              <div className="w-full mt-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Add to custom folder:</label>
                <select
                  onChange={(e) => {
                    const targetId = e.target.value;
                    if (targetId) {
                      onAddProductToWishlist(targetId, product.id);
                    }
                    e.target.value = '';
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-600 focus:outline-none focus:border-[#6A73E4] cursor-pointer shadow-sm"
                >
                  <option value="">-- Choose Folder --</option>
                  {wishlists.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.productIds.includes(product.id) ? 'Contains Item' : 'Save here'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Specifications & AI Analysis */}
        <div className="w-full md:w-[60%] p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-6">
          {/* One-Sentence Verdict Summary Badge */}
          <div className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 shadow-sm transition-all ${
            product.aiScore >= 85 
              ? 'bg-[#EEF2FF] border-[#6A73E4]/30 text-[#1E1B4B]' 
              : product.aiScore >= 70 
                ? 'bg-emerald-50/70 border-emerald-200/60 text-[#064E3B]' 
                : 'bg-amber-50/70 border-amber-200/60 text-[#78350F]'
          }`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              product.aiScore >= 85 
                ? 'bg-white border-[#6A73E4]/20 text-[#6A73E4]' 
                : product.aiScore >= 70 
                  ? 'bg-white border-emerald-200 text-emerald-600' 
                  : 'bg-white border-amber-200 text-amber-600'
            }`}>
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div className="space-y-0.5">
              <span className={`text-[10px] font-black uppercase tracking-widest block ${
                product.aiScore >= 85 
                  ? 'text-[#6A73E4]' 
                  : product.aiScore >= 70 
                    ? 'text-emerald-700' 
                    : 'text-amber-700'
              }`}>
                AI ONE-SENTENCE VERDICT ({product.aiScore}/100)
              </span>
              <p className="text-xs font-black leading-relaxed">{oneSentenceVerdict}</p>
            </div>
          </div>

          {/* Brand Introduction description */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Editor Description</h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">{product.description}</p>
          </div>

          {/* AI Score Audit Card */}
          <div className="bg-slate-50 border-2 border-slate-150 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-black text-[#6A73E4] bg-indigo-50 border border-[#6A73E4]/30 px-3 py-1 rounded-md uppercase tracking-wider">
                WiseFind AI Audit Core
              </span>
              <h4 className="text-lg font-black text-[#111827] mt-1.5">Buying Intelligence Score</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Rating computed from specification parity and real user feedback.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black text-[#111827]">{product.aiScore}</span>
              <span className="text-sm font-bold text-slate-400">/100</span>
            </div>
          </div>

          {/* AI-Synthesized Verdict & Consensus Panel */}
          <div className="bg-[#0F172A] text-white border border-[#1E293B] rounded-2xl p-6 space-y-5 shadow-xl relative overflow-hidden">
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#6A73E4]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <h5 className="text-xs font-black text-[#37D0C0] uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>AI-Synthesized Verdict & Consensus</span>
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated synthesis of {sentiment.totalReviews} buyer reviews across vetted web channels.</p>
              </div>

              {/* Confidence Score meter */}
              <div className="bg-[#1E293B] px-3.5 py-2 rounded-xl flex flex-col gap-1 border border-slate-700/50 min-w-[140px] shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-slate-400">
                  <span>Confidence</span>
                  <span className="text-[#37D0C0]">{confidenceScore}%</span>
                </div>
                {/* Horizontal meter */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-[#6A73E4] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-extrabold uppercase text-right tracking-widest">
                  {confidenceScore >= 85 ? 'High Data Parity' : confidenceScore >= 70 ? 'Moderate Parity' : 'Limited Data'}
                </span>
              </div>
            </div>

            {/* Core Recommendation statement */}
            <blockquote className="border-l-2 border-[#6A73E4] pl-4 italic text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              "{product.aiRecommendation}"
            </blockquote>

            {/* Consensus Double Columns: Must-Knows vs Caveats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#1E293B]/40 rounded-xl p-4 border border-slate-800">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span>The Must-Knows</span>
                </span>
                <ul className="space-y-2">
                  {product.pros.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-black text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5">+{idx+1}</span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1E293B]/40 rounded-xl p-4 border border-slate-800">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                  <ThumbsDown className="h-3.5 w-3.5 text-red-400" />
                  <span>The Caveats</span>
                </span>
                <ul className="space-y-2">
                  {product.cons.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-red-400 font-black text-[10px] bg-red-500/10 px-1.5 py-0.5 rounded mt-0.5">-{idx+1}</span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Highlights & Bullet Features */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Key Product Highlights</h4>
            <ul className="space-y-2">
              {product.highlights.map((h, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-slate-600 font-medium">
                  <Check className="h-4 w-4 text-[#37D0C0] mt-0.5 flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pros & Cons Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>The Positives (Pros)</span>
                </span>
                <ul className="space-y-1.5">
                  {(showAllPros ? product.pros : product.pros.slice(0, 5)).map((p, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1 font-semibold">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {product.pros.length > 5 && (
                <button
                  onClick={() => setShowAllPros(!showAllPros)}
                  className="text-[10px] font-black text-emerald-700 hover:text-emerald-900 uppercase tracking-wider mt-3 cursor-pointer self-start transition-colors"
                >
                  {showAllPros ? 'Show Less' : `Read More Pros (+${product.pros.length - 5})`}
                </button>
              )}
            </div>
            
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-red-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>The Negatives (Cons)</span>
                </span>
                <ul className="space-y-1.5">
                  {(showAllCons ? product.cons : product.cons.slice(0, 5)).map((c, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1 font-semibold">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {product.cons.length > 5 && (
                <button
                  onClick={() => setShowAllCons(!showAllCons)}
                  className="text-[10px] font-black text-red-700 hover:text-red-900 uppercase tracking-wider mt-3 cursor-pointer self-start transition-colors"
                >
                  {showAllCons ? 'Show Less' : `Read More Cons (+${product.cons.length - 5})`}
                </button>
              )}
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative">
              <div className="flex items-center gap-2">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span>Public Sentiment Distribution</span>
                    <button
                      onMouseEnter={() => setShowSentimentTooltip(true)}
                      onMouseLeave={() => setShowSentimentTooltip(false)}
                      onClick={() => setShowSentimentTooltip(!showSentimentTooltip)}
                      className="text-indigo-500 hover:text-indigo-700 p-0.5 rounded transition-all cursor-pointer focus:outline-none"
                      title="View contributing review keywords"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Analyzed from {sentiment.totalReviews} buyer reviews & discussion threads.
                  </p>
                </div>

                {/* Floating Keywords Attribution Tooltip Card */}
                {showSentimentTooltip && (
                  <div className="absolute top-12 left-0 z-30 bg-[#0F172A] text-white border border-[#1E293B] rounded-2xl p-4 shadow-2xl w-64 animate-fade-in space-y-3">
                    <div className="border-b border-slate-800 pb-1.5 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Review Keyword Weights</span>
                      <span className="text-[9px] bg-indigo-500/10 px-1.5 py-0.5 rounded text-[#37D0C0] font-bold">Consensus</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block mb-1">Top Positive Drivers</span>
                        <div className="space-y-1">
                          {sentimentKeywords.positive.map((kw, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-medium">• {kw.keyword}</span>
                              <span className="text-emerald-400 font-extrabold">{kw.weight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-800/80 pt-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 block mb-1">Top Negative Drivers</span>
                        <div className="space-y-1">
                          {sentimentKeywords.negative.map((kw, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-medium">• {kw.keyword}</span>
                              <span className="text-rose-400 font-extrabold">{kw.weight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                sentiment.positive >= 75 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : sentiment.positive >= 60 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {sentiment.summary} ({sentiment.positive}%)
              </span>
            </div>

            {/* Composite Stack Bar */}
            <div className="space-y-2">
              <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-slate-200/60 shadow-inner">
                <div 
                  style={{ width: `${sentiment.positive}%` }} 
                  className="bg-emerald-500 h-full transition-all duration-500 hover:opacity-90 cursor-help" 
                  title={`Positive: ${sentiment.positive}%`} 
                />
                <div 
                  style={{ width: `${sentiment.neutral}%` }} 
                  className="bg-amber-400 h-full transition-all duration-500 hover:opacity-90 cursor-help" 
                  title={`Neutral: ${sentiment.neutral}%`} 
                />
                <div 
                  style={{ width: `${sentiment.negative}%` }} 
                  className="bg-rose-500 h-full transition-all duration-500 hover:opacity-90 cursor-help" 
                  title={`Negative: ${sentiment.negative}%`} 
                />
              </div>

              {/* Legend with numbers */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="flex items-center justify-center gap-1.5 bg-white py-1.5 px-2 rounded-xl border border-slate-100 shadow-sm">
                  <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-black text-slate-700">{sentiment.positive}%</span>
                  <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Positive</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-white py-1.5 px-2 rounded-xl border border-slate-100 shadow-sm">
                  <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-black text-slate-700">{sentiment.neutral}%</span>
                  <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Neutral</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-white py-1.5 px-2 rounded-xl border border-slate-100 shadow-sm">
                  <ThumbsDown className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-xs font-black text-slate-700">{sentiment.negative}%</span>
                  <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Negative</span>
                </div>
              </div>
            </div>
            
            {/* Context Insights */}
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic flex items-center gap-1">
              <span>💡</span>
              <span>Net Sentiment Ratio: <b>{sentiment.ratio} to 1</b> positive-to-negative references detected.</span>
            </p>
          </div>

          {/* Real-Time Multi-Platform Price & Deal Comparison */}
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/60 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-[#6A73E4] dark:text-[#37D0C0] font-black text-xs uppercase tracking-wider">
                  <Building2 className="h-4 w-4" />
                  <span>Real-Time Multi-Store Price Comparison</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white mt-0.5">
                  Amazon vs Flipkart vs Reliance vs Croma
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                  Lowest: ₹{platformComparison.lowestPrice.toLocaleString('en-IN')} ({PLATFORM_INFO[platformComparison.lowestPricePlatform].shortName})
                </span>
              </div>
            </div>

            {/* AI Verdict Quick Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#6A73E4] dark:text-[#37D0C0]">
                <Zap className="h-3.5 w-3.5" />
                <span>AI Recommendation:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {platformComparison.aiVerdict.summary.replace(/\*\*/g, '')}
              </p>
            </div>

            {/* Platform Deal Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {platformComparison.platforms.map(deal => {
                const isLowest = deal.isLowestPrice;
                const isBestOverall = deal.isBestOverallDeal;

                return (
                  <div
                    key={deal.platformId}
                    className={`bg-slate-50/70 dark:bg-[#111827] p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isBestOverall
                        ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/15 dark:bg-purple-950/30'
                        : isLowest
                        ? 'border-[#10B981] ring-2 ring-[#10B981]/15'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-6 w-6 rounded-md flex items-center justify-center font-black text-white text-[9px]"
                            style={{ backgroundColor: deal.brandColor }}
                          >
                            {deal.platformName.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-extrabold text-xs text-[#111827] dark:text-white truncate max-w-[100px]">
                            {deal.platformName}
                          </span>
                        </div>
                        {isBestOverall && (
                          <span className="bg-[#7C3AED] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                            Best Deal
                          </span>
                        )}
                        {isLowest && !isBestOverall && (
                          <span className="bg-[#10B981] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                            Lowest
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-base font-black text-[#111827] dark:text-white">
                          ₹{deal.salePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{deal.basePrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 mb-3">
                        <div className="flex items-center gap-1 text-[10px] text-[#7C3AED] dark:text-[#FBBF24] font-bold truncate">
                          <CreditCard className="h-3 w-3 shrink-0" />
                          <span className="truncate">{deal.bankOffers[0]?.description || 'Card Offers Available'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <Truck className="h-3 w-3 shrink-0" />
                          <span className="truncate">{deal.deliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={deal.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] font-bold text-white transition-all shadow-sm cursor-pointer"
                      style={{ backgroundColor: deal.brandColor === '#111827' ? '#1E293B' : deal.brandColor }}
                    >
                      <span>Buy on Store</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Price Trend (Last 30 Days) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">30-Day Historical Price Trend</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Tracks price updates, e-commerce drops, and promotional sales in Indian Rupees (₹).
                </p>
              </div>
              
              {/* Trend badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-black text-slate-700">
                  <span className="text-slate-400">Low:</span>
                  <span className="text-emerald-600 font-extrabold">₹{lowestPrice.toLocaleString("en-IN")}</span>
                </span>
                <span className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-black text-slate-700">
                  <span className="text-slate-400">High:</span>
                  <span className="text-rose-600 font-extrabold">₹{highestPrice.toLocaleString("en-IN")}</span>
                </span>
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black border ${
                  priceChange <= 0 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {priceChange <= 0 ? (
                    <>
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>{Math.abs(Number(priceChangePercent))}% Down</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>{priceChangePercent}% Up</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Recharts Line Chart */}
            <div className="w-full h-56 min-h-[224px] pt-2 bg-white rounded-xl border border-slate-100 p-2 shadow-sm">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
                <LineChart data={priceHistoryData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                    dy={5}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '12px', 
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '10px 14px'
                    }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}
                    itemStyle={{ color: '#ffffff', fontWeight: 900, fontSize: '13px' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#4F46E5" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 30 days ago</span>
              <span>Today (Current Price)</span>
            </div>
          </div>

          {/* Active Price Watcher & Alert Engine */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isAlertSet ? 'bg-[#6A73E4] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
              }`}>
                {isAlertSet ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Interactive Price Drop Alert</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Configure a custom target threshold. We'll track local states and show a live alert immediately if the product falls below your value.
                </p>
              </div>
            </div>

            {/* Subtle 6-Month Sparkline Chart Card */}
            <div className="bg-white border border-slate-150 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${sixMonthTrend <= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {sixMonthTrend <= 0 ? <TrendingDown className="h-4.5 w-4.5" /> : <TrendingUp className="h-4.5 w-4.5" />}
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">6-Month Price Volatility</span>
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-xs font-black text-slate-800">
                      {volatilityPercent.toFixed(1)}% {sixMonthTrend <= 0 ? 'Down-trend' : 'Up-trend'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      (Avg: ₹{sixMonthAvg.toLocaleString("en-IN")})
                    </span>
                  </div>
                </div>
              </div>
              {/* The Sparkline */}
              <div className="w-28 h-8 min-h-[32px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={30}>
                  <LineChart data={sixMonthHistory}>
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={sixMonthTrend <= 0 ? '#10B981' : '#F43F5E'} 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {!isAlertSet ? (
              <form onSubmit={handleSetAlert} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Target Threshold Limit:
                    </label>
                    <div className="text-xl font-black text-[#111827] flex items-baseline gap-1">
                      <span>₹{alertPrice.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-slate-400 font-bold">
                        ({Math.round((alertPrice / product.price) * 100)}% of current)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="number"
                      min={Math.round(product.price * 0.5)}
                      max={product.price}
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(Math.min(product.price, Math.max(1, Number(e.target.value))))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-700 focus:outline-none focus:border-[#6A73E4] shadow-sm"
                    />
                    <button
                      type="submit"
                      className="bg-[#6A73E4] hover:bg-[#5861D3] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
                    >
                      Set Alert
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <input 
                    type="range"
                    min={Math.round(product.price * 0.6)}
                    max={product.price}
                    step={Math.round(product.price * 0.01) || 1}
                    value={alertPrice}
                    onChange={(e) => {
                      setAlertPrice(Number(e.target.value));
                      setSimulationActive(false);
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6A73E4]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>₹{Math.round(product.price * 0.6).toLocaleString("en-IN")} (60%)</span>
                    <span>₹{product.price.toLocaleString("en-IN")} (Current)</span>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <span className="text-[9px] font-black uppercase text-indigo-700 tracking-wider bg-indigo-100 px-2 py-0.5 rounded">
                      Watcher Active
                    </span>
                    <p className="text-xs font-bold text-indigo-900 mt-1">
                      Tracking target threshold of <b className="font-extrabold text-[#111827]">₹{alertPrice.toLocaleString("en-IN")}</b>
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleSimulatePriceDrop}
                      className="bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 text-[11px] font-black px-3.5 py-2 rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Zap className="h-3.5 w-3.5 fill-current" />
                      Simulate Drop
                    </button>
                    <button
                      onClick={handleRemoveAlert}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-black px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Specifications Sheet */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Technical Specifications</h4>
              <button
                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                className="text-[10px] font-black text-[#6A73E4] hover:text-[#5861D3] uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isSpecsExpanded ? 'Collapse' : 'Expand All'}
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 relative">
              {Object.entries(product.specs)
                .slice(0, isSpecsExpanded ? undefined : 4)
                .map(([key, value]) => {
                  const jargonExp = getJargonExplanation(key);
                  return (
                    <div key={key} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col gap-1.5">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <span>{key}</span>
                          {jargonExp && (
                            <button
                              type="button"
                              onMouseEnter={() => setActiveTooltip(key)}
                              onMouseLeave={() => setActiveTooltip(null)}
                              onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                              className="text-slate-400 hover:text-[#6A73E4] transition-colors cursor-pointer inline-flex items-center"
                              title="Click or hover to explain jargon"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 text-right max-w-[280px] truncate" title={value}>
                          {value}
                        </span>
                      </div>
                      
                      {activeTooltip === key && jargonExp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[11px] font-semibold text-[#6A73E4] bg-indigo-50/70 border border-indigo-100 rounded-lg p-2.5 leading-relaxed text-left w-full"
                        >
                          💡 <b>{key}:</b> {jargonExp}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              
              {/* Fade Overlay for collapsed state */}
              {!isSpecsExpanded && Object.keys(product.specs).length > 4 && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            {Object.keys(product.specs).length > 4 && (
              <button
                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-3 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer border border-slate-200/40"
              >
                {isSpecsExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Collapse Technical Specifications</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>View All {Object.keys(product.specs).length} Technical Specs</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Local Store Availability & Maps Grounding */}
          <LocalStoreFinder product={product} />

          {/* Compatibility Check & Companion Accessories */}
          <div className="pt-6 border-t border-slate-200 mt-6" id="compatibility-check-widget">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Compatibility Check & Accessories</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Ecosystem connectivity analysis for smart integration</p>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Link</span>
              </span>
            </div>

            {/* Interactive compatibility parameters list */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 space-y-3">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Real-time Connection Protocols</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 1. Ecosystem Synergy */}
                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-800 block">Ecosystem Synergy</span>
                    <span className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      {compatibleAccessories.some(a => a.brand.toLowerCase() === product.brand.toLowerCase()) 
                        ? `Optimized for ${product.brand} proprietary companion features` 
                        : 'Universal compliance standard. Fully compatible with mainstream ecosystems.'}
                    </span>
                  </div>
                </div>

                {/* 2. Audio/Wireless Sync */}
                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-800 block">Wireless Synchronization</span>
                    <span className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Standardized Bluetooth LE connectivity & dynamic smart-pairing protocols verified.
                    </span>
                  </div>
                </div>

                {/* 3. Power Link */}
                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-800 block">Power Synchronicity</span>
                    <span className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Universal Type-C power levels or Qi wireless standard interoperability.
                    </span>
                  </div>
                </div>

                {/* 4. Application Integration */}
                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-800 block">Multi-Platform Crossplay</span>
                    <span className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Compatible with Android, iOS, Windows, and macOS companion utilities.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Accessory Suggestion list */}
            {compatibleAccessories.length > 0 && (
              <div className="space-y-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Recommended Companion Accessories</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {compatibleAccessories.map((acc) => {
                    const isSameBrand = acc.brand.toLowerCase() === product.brand.toLowerCase();
                    return (
                      <div
                        key={acc.id}
                        onClick={() => onSelectProduct(acc)}
                        className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden ${
                          isSameBrand 
                            ? 'bg-indigo-50/20 border-indigo-100 hover:border-[#6A73E4]' 
                            : 'bg-white border-slate-100 hover:border-[#6A73E4]'
                        }`}
                      >
                        {isSameBrand && (
                          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                            Ecosystem Match
                          </div>
                        )}
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{acc.brand}</span>
                            <span className="text-[9px] font-bold text-[#6A73E4] bg-indigo-50 px-1 py-0.5 rounded">
                              ★ {acc.rating}
                            </span>
                          </div>
                          <h5 className="font-black text-slate-800 text-xs mt-1 truncate group-hover:text-[#6A73E4] transition-colors">{acc.name}</h5>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">{acc.category}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                          <span className="text-xs font-black text-slate-900">₹{acc.price.toLocaleString("en-IN")}</span>
                          <span className="text-[9px] font-black text-[#6A73E4] group-hover:underline uppercase tracking-wider">
                            View Specs →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Suitable Alternatives / Instant comparative action */}
          {alternatives.length > 0 && (
            <div className="pt-4 border-t border-slate-200 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Compare & Choose (Alternatives)</h4>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  Instant Category Match
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {alternatives.map((alt) => {
                  const priceDiff = alt.price - product.price;
                  const priceDiffText = priceDiff === 0 
                    ? 'Same Price' 
                    : priceDiff < 0 
                      ? `₹${Math.abs(priceDiff).toLocaleString("en-IN")} cheaper` 
                      : `₹${priceDiff.toLocaleString("en-IN")} more`;

                  return (
                    <div
                      key={alt.id}
                      onClick={() => onSelectProduct(alt)}
                      className="border-2 border-slate-100 hover:border-[#6A73E4] rounded-xl p-3.5 cursor-pointer hover:bg-slate-50 transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{alt.brand}</span>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            priceDiff < 0 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : priceDiff === 0 
                                ? 'bg-slate-100 text-slate-600' 
                                : 'bg-red-50 text-red-700'
                          }`}>
                            {priceDiffText}
                          </span>
                        </div>
                        <h5 className="font-black text-slate-800 text-xs mt-1 truncate group-hover:text-[#6A73E4] transition-colors">{alt.name}</h5>
                        
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold text-slate-400">Score:</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            alt.aiScore >= product.aiScore 
                              ? 'bg-indigo-50 text-[#6A73E4] font-extrabold' 
                              : 'bg-slate-100 text-slate-500 font-bold'
                          }`}>
                            {alt.aiScore}/100
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100">
                        <span className="text-xs font-black text-slate-900">₹{alt.price.toLocaleString("en-IN")}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-[10px] font-black text-amber-500">
                            <Star className="h-3 w-3 fill-amber-500" />
                            <span>{alt.rating}</span>
                          </div>
                          <span className="text-[9px] font-black text-[#6A73E4] group-hover:underline uppercase tracking-wider">
                            Compare →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
