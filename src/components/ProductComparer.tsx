import React, { useState } from 'react';
import { Product } from '../types';
import { SafeProductImage } from './SafeProductImage';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Plus, Star, BarChart2, Check, CheckCircle2, 
  Scale, Cpu, Monitor, Battery, Camera, Shield, Award, 
  Sparkles, Zap, ArrowDown, HelpCircle, RefreshCw, Eye, TrendingUp, Info,
  DollarSign, ArrowUpRight, ArrowDownRight, Activity, Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';

interface ProductComparerProps {
  compareList: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onClearCompare: () => void;
  allProducts: Product[];
  onAddToCompare: (product: Product) => void;
}

export default function ProductComparer({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  allProducts,
  onAddToCompare
}: ProductComparerProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [activeChartTab, setActiveChartTab] = useState<'summary' | 'bar' | 'radar' | 'bang'>('summary');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);

  // Extract all unique spec keys from compared products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap((p) => Object.keys(p.specs || {})))
  );

  // Intelligent context: if comparing items, guide them to the same category
  const activeCategory = compareList.length > 0 ? compareList[0].category : null;

  // Filter available products to add
  const availableToCompare = allProducts
    .filter((p) => !compareList.some((item) => item.id === p.id))
    .filter((p) => {
      if (activeCategory) {
        return p.category === activeCategory;
      }
      return selectedCategoryFilter === 'All' ? true : p.category === selectedCategoryFilter;
    });

  // Get categories for quick tab filters when comparing list is empty
  const allCategories = ['All', ...Array.from(new Set(allProducts.map(p => p.category)))];

  // Core spec keys that we will render with custom styled rows
  const coreSpecKeys = ['Display', 'Processor', 'Storage', 'Memory', 'Battery', 'Camera', 'Warranty'];
  
  // Remaining keys to prevent double render but still display all details
  const remainingSpecKeys = allSpecKeys.filter(
    (key) => !coreSpecKeys.some((ck) => ck.toLowerCase() === key.toLowerCase())
  );

  // ==========================================
  // STATISTICAL & ANALYTICS CALCULATIONS
  // ==========================================

  // 1. Average Rating Calculation
  const averageRating = compareList.length > 0
    ? compareList.reduce((acc, p) => acc + (p.rating || 0), 0) / compareList.length
    : 0;

  // 2. Median Price Calculation
  const calculateMedianPrice = (items: Product[]): number => {
    if (items.length === 0) return 0;
    const sorted = [...items.map(p => p.price)].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  };

  const medianPrice = calculateMedianPrice(compareList);

  // 3. Mean (Average) Price
  const meanPrice = compareList.length > 0
    ? Math.round(compareList.reduce((acc, p) => acc + p.price, 0) / compareList.length)
    : 0;

  // 4. Min, Max, and Price Spread
  const minPrice = compareList.length > 0 ? Math.min(...compareList.map(p => p.price)) : 0;
  const maxPrice = compareList.length > 0 ? Math.max(...compareList.map(p => p.price)) : 0;
  const priceSpread = maxPrice - minPrice;

  // 5. Average AI WiseScore
  const averageWiseScore = compareList.length > 0
    ? Math.round(compareList.reduce((acc, p) => acc + (p.aiScore || 0), 0) / compareList.length)
    : 0;

  // 6. Top Rated Product
  const topRatedProduct = compareList.length > 0
    ? [...compareList].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
    : null;

  // 7. Value Leader (Highest Score to Price Ratio)
  const valueLeaderProduct = compareList.length > 0
    ? [...compareList].sort((a, b) => (b.aiScore / b.price) - (a.aiScore / a.price))[0]
    : null;

  // 8. Flagship Performance Leader
  const flagshipLeaderProduct = compareList.length > 0
    ? [...compareList].sort((a, b) => b.aiScore - a.aiScore)[0]
    : null;

  // Quick value metric generator
  const getValueForMoney = (p: Product) => {
    if (p.price < 40000 && p.aiScore >= 90) {
      return { label: 'Outstanding Value', desc: 'Budget Champion', color: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30' };
    }
    if (p.isBestPremium || p.isEditorChoice) {
      return { label: 'Premium Value', desc: 'Editor\'s Choice', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' };
    }
    if (p.aiScore >= 93) {
      return { label: 'Excellent Value', desc: 'Top Spec Choice', color: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30' };
    }
    return { label: 'High Value', desc: 'Solid Investment', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
  };

  // Helper to extract specific performance highlights
  const getPerformanceMetrics = (p: Product) => {
    const specsStr = Object.values(p.specs).join(' ').toLowerCase();
    
    if (specsStr.includes('a17 pro') || specsStr.includes('m3') || specsStr.includes('snapdragon 8 gen 3') || specsStr.includes('m4')) {
      return { label: 'Extreme Flagship', rating: '9.8 / 10', details: 'Industry-leading silicon, superb multi-core benchmarks and hardware ray-tracing.' };
    }
    if (specsStr.includes('snapdragon 8 gen 2') || specsStr.includes('m2') || specsStr.includes('i7') || specsStr.includes('h-series')) {
      return { label: 'Heavy Productivity', rating: '9.3 / 10', details: 'High-power H-series or flagship-tier CPU suited for intensive multitasking & gaming.' };
    }
    if (p.category === 'Laptops' || p.category === 'Smartphones') {
      return { label: 'Capable Daily Multitasker', rating: '8.8 / 10', details: 'Smooth rendering, responsive active core load-balancing.' };
    }
    return { label: 'High-Fidelity Tuning', rating: '9.0 / 10', details: 'Optimized response curve, customized DSP hardware processing.' };
  };

  const getPerformanceValue = (p: Product): number => {
    const metrics = getPerformanceMetrics(p);
    const ratingStr = metrics.rating.split(' ')[0];
    const parsed = parseFloat(ratingStr);
    if (!isNaN(parsed)) return Math.round(parsed * 10);
    
    if (p.price > 80000) return 96;
    if (p.price > 50000) return 88;
    if (p.price > 30000) return 78;
    return 68;
  };

  const getBatteryValue = (p: Product): number => {
    const batterySpec = (p.specs['Battery'] || p.specs['Battery Life'] || '').toLowerCase();
    
    const hrsMatch = batterySpec.match(/(\d+(?:\.\d+)?)\s*(?:hours|hrs)/);
    if (hrsMatch) {
      const hrs = parseFloat(hrsMatch[1]);
      return Math.min(100, Math.round((hrs / 22) * 100)); // Normalize 22 hours as 100
    }
    
    const mahMatch = batterySpec.match(/(\d+)\s*mah/);
    if (mahMatch) {
      const mah = parseInt(mahMatch[1], 10);
      return Math.min(100, Math.round((mah / 6000) * 100)); // Normalize 6000 mAh as 100
    }

    if (p.category === 'Smartphones') return 82;
    if (p.category === 'Laptops') return 75;
    if (p.category === 'Headphones') return 95;
    return 80;
  };

  const getWiseScoreColorClass = (score: number) => {
    if (score >= 90) return { bg: 'bg-emerald-500/10 dark:bg-emerald-950/40', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', hex: '#10B981' };
    if (score >= 75) return { bg: 'bg-purple-500/10 dark:bg-purple-950/40', border: 'border-purple-500/30', text: 'text-purple-600 dark:text-purple-400', hex: '#8B5CF6' };
    if (score >= 60) return { bg: 'bg-amber-500/10 dark:bg-amber-950/40', border: 'border-amber-500/30', text: 'text-amber-600 dark:text-amber-400', hex: '#F59E0B' };
    if (score >= 40) return { bg: 'bg-orange-500/10 dark:bg-orange-950/40', border: 'border-orange-500/30', text: 'text-orange-600 dark:text-orange-400', hex: '#F97316' };
    return { bg: 'bg-rose-500/10 dark:bg-rose-950/40', border: 'border-rose-500/30', text: 'text-rose-600 dark:text-rose-400', hex: '#EF4444' };
  };

  // Color palette matching the uploaded logo theme
  const getProductColor = (index: number) => {
    const colors = ['#3B82F6', '#8B5CF6', '#FBBF24', '#10B981'];
    return colors[index % colors.length];
  };

  const maxItems = 4;
  const emptySlotsCount = maxItems - compareList.length;

  // Preparing Data for Recharts
  const barChartData = compareList.map((p) => {
    const perfScore = getPerformanceValue(p);
    const battScore = getBatteryValue(p);
    return {
      name: p.name.length > 20 ? `${p.brand} ${p.name.slice(0, 17)}...` : `${p.brand} ${p.name}`,
      fullName: p.name,
      'WiseScore': p.aiScore,
      'Performance Benchmark': perfScore,
      'Battery Endurance': battScore,
    };
  });

  const subjects = [
    { key: 'WiseScore', label: 'WiseScore (AI)' },
    { key: 'Performance', label: 'Performance' },
    { key: 'Battery', label: 'Battery Life' },
    { key: 'Rating', label: 'User Rating' },
    { key: 'Value', label: 'Price Value' }
  ];

  const radarChartData = subjects.map(subj => {
    const item: any = { subject: subj.label };
    compareList.forEach(p => {
      const perf = getPerformanceValue(p);
      const batt = getBatteryValue(p);
      const ratingScore = Math.round(p.rating * 20);
      
      const maxPriceInCatalog = Math.max(...allProducts.map(i => i.price), 150000);
      const minPriceInCatalog = Math.min(...allProducts.map(i => i.price), 10000);
      const priceRange = maxPriceInCatalog - minPriceInCatalog || 1;
      const priceScore = Math.round(100 - ((p.price - minPriceInCatalog) / priceRange) * 70);

      let val = 80;
      if (subj.key === 'WiseScore') val = p.aiScore;
      else if (subj.key === 'Performance') val = perf;
      else if (subj.key === 'Battery') val = batt;
      else if (subj.key === 'Rating') val = ratingScore;
      else if (subj.key === 'Value') val = priceScore;

      item[p.name] = val;
    });
    return item;
  });

  const bangChartData = compareList.map((p) => {
    const val = Math.round((p.aiScore / (p.price / 10000)) * 10) / 10;
    return {
      name: p.name.length > 20 ? `${p.brand} ${p.name.slice(0, 17)}...` : `${p.brand} ${p.name}`,
      fullName: p.name,
      'Bang for the Buck Index': val,
      'Price (INR)': p.price,
    };
  });

  // Custom tooltips to maintain brand styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-700 p-3 rounded-2xl shadow-xl space-y-1.5" id="recharts-custom-tooltip">
          <p className="text-xs font-black text-[#111827] dark:text-white">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-[11px] font-bold">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
                <span className="text-[#111827] dark:text-white font-extrabold">
                  {entry.value}{entry.name.includes('Bang') ? ' index' : entry.name.includes('Price') ? ' INR' : ' pts'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="product-comparer-panel">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-2 border-slate-150 dark:border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider w-fit mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>Interactive Specs Engine v3.0</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white tracking-tight flex items-center gap-2.5">
            <Scale className="h-7 w-7 text-[#7C3AED] dark:text-purple-400" />
            Side-by-Side Comparison Matrix
          </h2>
          <p className="text-sm text-[#475569] dark:text-slate-300 mt-1 font-medium">
            Compare up to <span className="font-bold text-[#111827] dark:text-white">4 models</span> with real-time visual analytics, average ratings, median price calculations, and deep spec benchmarks.
          </p>
        </div>
        
        {compareList.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-4 py-2.5 rounded-xl text-xs font-black text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>{showAnalytics ? 'Hide Analytics Dashboard' : 'Show Analytics Dashboard'}</span>
            </button>

            <button
              onClick={onClearCompare}
              className="px-4 py-2.5 rounded-xl text-xs font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Matrix</span>
            </button>
          </div>
        )}
      </div>

      {compareList.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-10 sm:p-16 text-center shadow-sm">
          <div className="h-20 w-20 bg-purple-50 dark:bg-purple-950/60 rounded-3xl flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto mb-6">
            <Scale className="h-10 w-10 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-[#111827] dark:text-white">Your Comparison Board is Empty</h3>
          <p className="text-[#475569] dark:text-slate-300 text-sm mt-2 max-w-lg mx-auto font-medium">
            Add models to unlock the visual analytics summary, median price index, average rating breakdown, and multi-vector spec radar.
          </p>
          
          {/* Category Tabs for Quick Suggestion filtering */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 mb-6">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                  selectedCategoryFilter === cat
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white border-transparent shadow-md'
                    : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {availableToCompare.length > 0 && (
            <div className="mt-4 max-w-4xl mx-auto">
              <span className="text-xs font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest block mb-4">Quick Add Suggestions:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {availableToCompare.slice(0, 8).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => onAddToCompare(prod)}
                    className="flex flex-col justify-between items-start text-left bg-white dark:bg-slate-800/80 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-500 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3 w-full mb-3">
                      <div className="h-10 w-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-1 rounded-lg flex items-center justify-center overflow-hidden">
                        <SafeProductImage src={prod.image} alt={prod.name} category={prod.category} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="truncate flex-1">
                        <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider block">{prod.brand}</span>
                        <h4 className="font-bold text-[#111827] dark:text-white text-xs truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">{prod.name}</h4>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full mt-1 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">₹{prod.price.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded font-bold text-purple-600 dark:text-purple-300">
                        Add +
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* ========================================================================= */}
          {/* VISUAL ANALYTICS SUMMARY PANEL (Average Rating & Median Price Engine)     */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {showAnalytics && (
              <motion.div 
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#111827] border-2 border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md space-y-6"
                id="analytics-summary-card"
              >
                {/* Header section with category and controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 bg-gradient-to-br from-[#3B82F6] via-[#7C3AED] to-[#A855F7] rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-black text-[#111827] dark:text-white tracking-tight">
                          Visual Analytics & Decision Telemetry
                        </h3>
                        <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Live Metrics
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] dark:text-slate-400 font-medium">
                        Real-time statistical synthesis of user ratings, median market values, and specification indices across {compareList.length} selected products.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Navigation Tab Selector */}
                  <div className="flex bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl self-stretch sm:self-auto overflow-x-auto">
                    <button
                      onClick={() => setActiveChartTab('summary')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        activeChartTab === 'summary'
                          ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                          : 'text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
                      }`}
                    >
                      Summary Matrix
                    </button>
                    <button
                      onClick={() => setActiveChartTab('bar')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        activeChartTab === 'bar'
                          ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                          : 'text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
                      }`}
                    >
                      Benchmarking
                    </button>
                    <button
                      onClick={() => setActiveChartTab('radar')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        activeChartTab === 'radar'
                          ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                          : 'text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
                      }`}
                    >
                      Radar Profile
                    </button>
                    <button
                      onClick={() => setActiveChartTab('bang')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        activeChartTab === 'bang'
                          ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                          : 'text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
                      }`}
                    >
                      Bang For Buck
                    </button>
                  </div>
                </div>

                {/* 4 CORE ANALYTICS KPI TILES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="analytics-kpi-tiles">
                  
                  {/* KPI 1: AVERAGE USER RATING */}
                  <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/15 dark:from-amber-950/20 dark:to-amber-900/10 border-2 border-amber-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-3 opacity-10 text-amber-500">
                      <Star className="h-16 w-16" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          Average Rating
                        </span>
                        <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {(averageRating * 20).toFixed(0)}% Approval
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                          {averageRating.toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                      </div>
                      {/* Star icons indicator */}
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= Math.round(averageRating) 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-slate-300 dark:text-slate-600'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>Top Rated:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[130px]" title={topRatedProduct?.name}>
                        {topRatedProduct?.brand} ({topRatedProduct?.rating}★)
                      </span>
                    </div>
                  </div>

                  {/* KPI 2: MEDIAN PRICE */}
                  <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/15 dark:from-purple-950/20 dark:to-purple-900/10 border-2 border-purple-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-500">
                      <DollarSign className="h-16 w-16" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                          Median Price
                        </span>
                        <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                          Midpoint Benchmark
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                          ₹{medianPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1.5">
                        Mean: <span className="text-slate-800 dark:text-slate-200 font-extrabold">₹{meanPrice.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-purple-500/20 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>Price Range:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        ₹{(minPrice / 1000).toFixed(0)}k - ₹{(maxPrice / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>

                  {/* KPI 3: AVERAGE AI WISESCORE */}
                  <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/15 dark:from-blue-950/20 dark:to-blue-900/10 border-2 border-blue-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-3 opacity-10 text-blue-500">
                      <Sparkles className="h-16 w-16" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                          Average WiseScore
                        </span>
                        <span className="bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                          AI Spec Index
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                          {averageWiseScore}
                        </span>
                        <span className="text-sm font-bold text-slate-400">/ 100</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1.5">
                        Aggregate silicon & thermal rating
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-blue-500/20 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>Spec Leader:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[130px]" title={flagshipLeaderProduct?.name}>
                        {flagshipLeaderProduct?.name} ({flagshipLeaderProduct?.aiScore})
                      </span>
                    </div>
                  </div>

                  {/* KPI 4: VALUE / BANG-FOR-BUCK CHAMPION */}
                  <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/15 dark:from-emerald-950/20 dark:to-emerald-900/10 border-2 border-emerald-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-500">
                      <Award className="h-16 w-16" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Value Champion
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                          Bang For Buck
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight block truncate" title={valueLeaderProduct?.name}>
                          {valueLeaderProduct?.name}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Maximum spec efficiency per Rupee</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>Priced at:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        ₹{valueLeaderProduct?.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                </div>

                {/* VISUAL ANALYTICS EXPANDED VIEWS */}
                {activeChartTab === 'summary' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    
                    {/* VISUAL 1: MEDIAN PRICE SPECTRUM AXIS */}
                    <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            Median Price Range Spectrum
                          </h4>
                        </div>
                        <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                          Median: ₹{medianPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Compare where each product is positioned relative to the group's median benchmark.
                      </p>

                      {/* Spectrum Axis Bar */}
                      <div className="space-y-4 pt-2">
                        {compareList.map((prod, idx) => {
                          const delta = prod.price - medianPrice;
                          const isAbove = delta > 0;
                          const isAt = delta === 0;
                          const percentOfMax = maxPrice > 0 ? (prod.price / maxPrice) * 100 : 50;

                          return (
                            <div key={prod.id} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs">
                                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getProductColor(idx) }} />
                                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{prod.brand} {prod.name}</span>
                                </div>
                                <div className="flex items-center gap-2 font-bold">
                                  <span className="text-slate-900 dark:text-white font-extrabold">₹{prod.price.toLocaleString('en-IN')}</span>
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                    isAt 
                                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                                      : isAbove 
                                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' 
                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  }`}>
                                    {isAt ? 'At Median' : isAbove ? `+₹${delta.toLocaleString('en-IN')}` : `-₹${Math.abs(delta).toLocaleString('en-IN')}`}
                                  </span>
                                </div>
                              </div>

                              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                <div 
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${Math.max(10, Math.min(100, percentOfMax))}%`,
                                    backgroundColor: getProductColor(idx)
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>Low: ₹{minPrice.toLocaleString('en-IN')}</span>
                        <span className="text-purple-600 dark:text-purple-400 font-extrabold">Median Anchor: ₹{medianPrice.toLocaleString('en-IN')}</span>
                        <span>High: ₹{maxPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* VISUAL 2: AVERAGE RATING COMPARISON MATRIX */}
                    <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            Rating Dispersion vs Average ({averageRating.toFixed(2)}★)
                          </h4>
                        </div>
                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Category Benchmark
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Visualizing how each product measures up to consumer satisfaction thresholds.
                      </p>

                      {/* Rating Progress Bars */}
                      <div className="space-y-4 pt-2">
                        {compareList.map((prod, idx) => {
                          const ratingDelta = (prod.rating || 0) - averageRating;
                          const ratingPercent = ((prod.rating || 0) / 5) * 100;

                          return (
                            <div key={prod.id} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs">
                                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getProductColor(idx) }} />
                                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{prod.brand} {prod.name}</span>
                                </div>
                                <div className="flex items-center gap-2 font-bold">
                                  <span className="text-slate-900 dark:text-white font-extrabold flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {prod.rating}
                                  </span>
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                    Math.abs(ratingDelta) < 0.05
                                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                      : ratingDelta > 0 
                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}>
                                    {Math.abs(ratingDelta) < 0.05 ? 'At Avg' : ratingDelta > 0 ? `+${ratingDelta.toFixed(1)}★ Above` : `${ratingDelta.toFixed(1)}★ Below`}
                                  </span>
                                </div>
                              </div>

                              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                <div 
                                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 to-amber-500"
                                  style={{ width: `${ratingPercent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>0.0 Rating Floor</span>
                        <span className="text-amber-500 font-extrabold">Avg Rating Benchmark: {averageRating.toFixed(2)}★</span>
                        <span>5.0 Perfect Rating</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* CHARTS TABS: BENCHMARKING, RADAR & BANG-FOR-BUCK */}
                {activeChartTab !== 'summary' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left explanation and score tracking */}
                    <div className="space-y-4">
                      <div className="bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full">
                        <div className="space-y-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Insights</span>
                          <h4 className="text-sm font-black text-[#111827] dark:text-white flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-[#22C55E]" />
                            {activeChartTab === 'bar' && 'Performance & Endurance Benchmarking'}
                            {activeChartTab === 'radar' && 'Multidimensional Specifications Radar'}
                            {activeChartTab === 'bang' && 'Value Efficiency Index (Bang per ₹10k)'}
                          </h4>
                          <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed font-semibold">
                            {activeChartTab === 'bar' && 'This grouping presents performance scores alongside measured battery indexes. High silicon benchmarks paired with endurance.'}
                            {activeChartTab === 'radar' && 'The radar plots WiseScore, performance, user rating, battery, and price metrics. A larger web indicates an all-round flagship.'}
                            {activeChartTab === 'bang' && 'Calculates pure specifications-to-price ratio. A higher value means exceptional hardware strength for every Rupee spent.'}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 mt-4 space-y-3">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Compared Scorecards</span>
                          <div className="space-y-2">
                            {compareList.map((prod, idx) => {
                              const scoreDetails = getWiseScoreColorClass(prod.aiScore);
                              return (
                                <div key={prod.id} className="flex justify-between items-center text-xs">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getProductColor(idx) }} />
                                    <span className="font-extrabold text-[#111827] dark:text-white truncate">{prod.name}</span>
                                  </div>
                                  <span className={`font-black px-2 py-0.5 rounded-md text-[10px] ${scoreDetails.bg} ${scoreDetails.text} border ${scoreDetails.border}`}>
                                    {prod.aiScore} pts
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side charts canvas */}
                    <div className="lg:col-span-2 h-[280px] sm:h-[320px] min-h-[280px] w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
                        {activeChartTab === 'bar' ? (
                          <BarChart
                            data={barChartData}
                            margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 10, fontWeight: '700', fill: '#94A3B8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              domain={[0, 100]} 
                              tick={{ fontSize: 10, fontWeight: '700', fill: '#94A3B8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                              verticalAlign="top" 
                              height={36} 
                              iconType="circle"
                              wrapperStyle={{ fontSize: 11, fontWeight: '700', color: '#94A3B8' }} 
                            />
                            <Bar dataKey="WiseScore" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20}>
                              {barChartData.map((entry, index) => (
                                <Cell key={`cell-w-${index}`} fill={getProductColor(index)} />
                              ))}
                            </Bar>
                            <Bar dataKey="Performance Benchmark" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={12} opacity={0.8} />
                            <Bar dataKey="Battery Endurance" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} opacity={0.8} />
                          </BarChart>
                        ) : activeChartTab === 'radar' ? (
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                            <PolarGrid stroke="#334155" opacity={0.4} />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tick={{ fontSize: 10, fontWeight: '800', fill: '#94A3B8' }} 
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              tick={{ fontSize: 8, fontWeight: '600' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {compareList.map((p, idx) => (
                              <Radar
                                key={p.id}
                                name={p.brand + ' ' + (p.name.length > 12 ? p.name.slice(0, 10) + '..' : p.name)}
                                dataKey={p.name}
                                stroke={getProductColor(idx)}
                                fill={getProductColor(idx)}
                                fillOpacity={0.2}
                                strokeWidth={2}
                              />
                            ))}
                            <Legend 
                              verticalAlign="bottom" 
                              height={24} 
                              iconType="circle"
                              wrapperStyle={{ fontSize: 10, fontWeight: '700', color: '#94A3B8' }} 
                            />
                          </RadarChart>
                        ) : (
                          <BarChart
                            layout="vertical"
                            data={bangChartData}
                            margin={{ top: 20, right: 20, left: 30, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.3} />
                            <XAxis 
                              type="number" 
                              tick={{ fontSize: 10, fontWeight: '700', fill: '#94A3B8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              type="category" 
                              dataKey="name" 
                              tick={{ fontSize: 10, fontWeight: '800', fill: '#94A3B8' }}
                              axisLine={false}
                              tickLine={false}
                              width={110}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="Bang for the Buck Index" fill="#10B981" radius={[0, 4, 4, 0]} barSize={16}>
                              {bangChartData.map((entry, index) => (
                                <Cell key={`cell-b-${index}`} fill={getProductColor(index)} />
                              ))}
                            </Bar>
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* MAIN SPECIFICATIONS TABLE MATRIX                                          */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm" id="comparison-specs-table-card">
            {activeCategory && (
              <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Category Scope: <span className="font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2.5 py-0.5 rounded-md ml-1">{activeCategory}</span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                  Median price for selection: <span className="text-slate-700 dark:text-slate-200 font-black">₹{medianPrice.toLocaleString('en-IN')}</span> • Avg Rating: <span className="text-amber-500 font-black">{averageRating.toFixed(2)}★</span>
                </span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[900px] border-collapse">
                {/* Table Header with Product Cards */}
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    {/* Attributes index col */}
                    <th className="w-1/5 min-w-[200px] p-6 text-left align-middle sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 border-r border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">COMPARATIVE INDEX</span>
                      <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-3 py-1 rounded-xl mt-2 inline-block">
                        Comparing {compareList.length} of {maxItems}
                      </span>
                    </th>
                    
                    {/* Active Products Col */}
                    {compareList.map((prod, idx) => {
                      const delta = prod.price - medianPrice;
                      const isAbove = delta > 0;
                      const isAt = delta === 0;

                      return (
                        <th key={prod.id} className="p-6 text-left align-top relative group border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                          {/* Delete item button */}
                          <button
                            onClick={() => onRemoveFromCompare(prod.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all cursor-pointer"
                            title="Remove product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          {/* Top Indicator Color strip */}
                          <div className="h-1.5 w-14 rounded-full mb-4" style={{ backgroundColor: getProductColor(idx) }} />

                          {/* Image container */}
                          <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden border-2 border-slate-100 dark:border-slate-700 p-1.5 mb-3 flex items-center justify-center shadow-sm">
                            <SafeProductImage src={prod.image} alt={prod.name} category={prod.category} className="max-h-full max-w-full object-contain" />
                          </div>

                          <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 block uppercase tracking-widest">{prod.brand}</span>
                          <h4 className="font-black text-[#111827] dark:text-white text-xs sm:text-sm line-clamp-2 mt-0.5" title={prod.name}>
                            {prod.name}
                          </h4>
                          <p className="text-sm sm:text-base font-black text-[#111827] dark:text-white mt-1.5">₹{prod.price.toLocaleString("en-IN")}</p>
                          <span className={`inline-block mt-1 text-[9px] font-black px-1.5 py-0.5 rounded ${
                            isAt 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : isAbove 
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' 
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {isAt ? 'Exact Median' : isAbove ? `+₹${delta.toLocaleString('en-IN')} vs Median` : `-₹${Math.abs(delta).toLocaleString('en-IN')} vs Median`}
                          </span>
                        </th>
                      );
                    })}

                    {/* Empty Slots Column(s) for Dropdown Selector */}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <th key={`empty-${idx}`} className="p-6 text-left align-top border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/30 dark:bg-slate-900/30">
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-center items-center text-center space-y-3 min-h-[140px]">
                          <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center">
                            <Plus className="h-4 w-4" />
                          </div>
                          <div className="w-full">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">ADD ITEM</span>
                            {availableToCompare.length > 0 ? (
                              <select
                                onChange={(e) => {
                                  const selected = allProducts.find(p => p.id === e.target.value);
                                  if (selected) onAddToCompare(selected);
                                  e.target.value = ''; // reset select
                                }}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-[#475569] dark:text-slate-300 font-black focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
                              >
                                <option value="">-- Choose Model --</option>
                                {availableToCompare.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.brand} {p.name} (₹{p.price.toLocaleString("en-IN")})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <p className="text-[10px] text-slate-400 font-bold leading-tight">No more products in this category</p>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body Content Matrix */}
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  
                  {/* AI Match Score Row */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>AI WISE SCORE</span>
                      </div>
                    </td>
                    {compareList.map((prod) => {
                      const scoreDetails = getWiseScoreColorClass(prod.aiScore);
                      return (
                        <td key={prod.id} className="p-4 text-xs font-bold border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                          <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center">
                              <div className={`h-11 w-11 rounded-full flex items-center justify-center text-base font-black border-2 ${scoreDetails.bg} ${scoreDetails.text} ${scoreDetails.border}`}>
                                {prod.aiScore}
                              </div>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-black block">INTELLIGENCE SCORE</span>
                              <span className="text-[9px] text-[#475569] dark:text-slate-400 font-bold block">Smart matched index</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-aiscore-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Value For Money Rating */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span>Value for Money</span>
                      </div>
                    </td>
                    {compareList.map((prod) => {
                      const val = getValueForMoney(prod);
                      return (
                        <td key={prod.id} className="p-4 text-xs border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-top">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider mb-1 ${val.color}`}>
                            {val.label}
                          </span>
                          <p className="text-[10px] text-[#475569] dark:text-slate-400 font-bold mt-0.5">{val.desc}</p>
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-val-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* User Rating */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span>User Satisfaction</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs font-bold border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                        <div className="flex items-center gap-1 text-[#111827] dark:text-white">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-black text-sm">{prod.rating}</span>
                          <span className="text-[#475569] dark:text-slate-400 text-[11px] font-bold">/ 5.0</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-usr-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Processor */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        <span>Processor</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#111827] dark:text-slate-100 font-extrabold border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-normal leading-relaxed">
                        {prod.specs['Processor'] || prod.specs['Processor/Engine'] || <span className="text-slate-400 font-normal">N/A</span>}
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-proc-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Display Quality */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Monitor className="h-4 w-4 text-indigo-500" />
                        <span>Display Quality</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#111827] dark:text-slate-100 font-extrabold border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-normal leading-relaxed">
                        {prod.specs['Display'] || <span className="text-slate-400 font-normal">N/A</span>}
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-disp-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Memory & Storage */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Zap className="h-4 w-4 text-emerald-500" />
                        <span>Storage / RAM</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#111827] dark:text-slate-100 font-extrabold border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                        {prod.specs['Storage'] || prod.specs['Memory'] || prod.specs['Memory/Storage'] || <span className="text-slate-400 font-normal">N/A</span>}
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-stor-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Battery Life */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Battery className="h-4 w-4 text-emerald-500" />
                        <span>Battery Endurance</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#111827] dark:text-slate-100 font-extrabold border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-normal leading-relaxed">
                        {prod.specs['Battery'] || prod.specs['Battery Life'] || <span className="text-slate-400 font-normal">N/A</span>}
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-batt-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Camera Capabilities */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Camera className="h-4 w-4 text-rose-500" />
                        <span>Camera Specs</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#111827] dark:text-slate-100 font-extrabold border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-normal leading-relaxed">
                        {prod.specs['Camera'] || <span className="text-slate-400 font-bold">Standard / Dynamic Audio-Video Drivers</span>}
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-cam-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Performance Metrics */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Zap className="h-4 w-4 text-amber-500 animate-pulse" />
                        <span>Performance Ratings</span>
                      </div>
                    </td>
                    {compareList.map((prod) => {
                      const perf = getPerformanceMetrics(prod);
                      return (
                        <td key={prod.id} className="p-4 text-xs border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-top">
                          <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <span className="font-black text-[#111827] dark:text-white">{perf.label}</span>
                            <span className="bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-black text-[10px] px-2 py-0.5 rounded-md">
                              {perf.rating}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#475569] dark:text-slate-400 leading-relaxed font-semibold">{perf.details}</p>
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-perf-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Warranty Information */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-[#111827] dark:text-white">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span>Warranty Specs</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#111827] dark:text-slate-100 font-extrabold border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                        {prod.specs['Warranty'] || <span className="text-[#475569] dark:text-slate-400 font-bold">1 Year Domestic Retail Support</span>}
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-warr-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Technical Specifications - Remaining Keys if any */}
                  {remainingSpecKeys.map((key) => (
                    <tr key={key} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                      <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-wider bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] capitalize">
                        {key}
                      </td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4 text-xs text-[#111827] dark:text-slate-100 font-extrabold border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                          {prod.specs[key] || <span className="text-slate-400 font-normal">Not Applicable</span>}
                        </td>
                      ))}
                      {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                        <td key={`empty-rem-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                      ))}
                    </tr>
                  ))}

                  {/* Pros */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Strengths (Pros)</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#475569] dark:text-slate-300 align-top pr-6 font-semibold border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                        <ul className="space-y-1.5">
                          {prod.pros.slice(0, 4).map((p, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-emerald-500 font-black text-sm">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-pro-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* Cons */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-rose-500">
                        <Trash2 className="h-4 w-4" />
                        <span>Drawbacks (Cons)</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#475569] dark:text-slate-300 align-top pr-6 font-semibold border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                        <ul className="space-y-1.5">
                          {prod.cons.slice(0, 4).map((c, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-rose-500 font-black text-sm">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-con-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                  {/* AI Verdict */}
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                    <td className="p-4 pl-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-[#111827] sticky left-0 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span>AI Recommendation</span>
                      </div>
                    </td>
                    {compareList.map((prod) => (
                      <td key={prod.id} className="p-4 text-xs text-[#475569] dark:text-slate-300 leading-relaxed italic pr-6 align-top font-medium border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                        "{prod.aiRecommendation || 'Excellent balanced model with outstanding benchmarks.'}"
                      </td>
                    ))}
                    {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                      <td key={`empty-ver-${idx}`} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 bg-slate-50/10 dark:bg-slate-900/10" />
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
