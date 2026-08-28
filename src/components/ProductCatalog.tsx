import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  BarChart2, 
  Star, 
  Eye, 
  Check, 
  Sparkles, 
  LayoutGrid, 
  List, 
  X, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  Tablet, 
  Camera, 
  Tv, 
  Layers, 
  Tag, 
  ThumbsUp, 
  ShieldCheck, 
  ArrowUpDown,
  RotateCcw,
  Zap,
  IndianRupee,
  Cpu,
  Flame,
  Scale,
  Award,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  TrendingDown,
  Percent,
  Sliders,
  DollarSign,
  Info,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeProductImage } from './SafeProductImage';
import { WalkthroughTooltip } from './WalkthroughTooltip';

interface ProductCatalogProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[]; // List of product IDs
  compareList: Product[];
  initialCategory?: string;
  onNavigateToCompare?: () => void;
}

// Category icon mapper helper
const getCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('laptop') || normalized.includes('computer')) return Laptop;
  if (normalized.includes('phone') || normalized.includes('mobile')) return Smartphone;
  if (normalized.includes('audio') || normalized.includes('headphone') || normalized.includes('earbud')) return Headphones;
  if (normalized.includes('watch') || normalized.includes('wearable')) return Watch;
  if (normalized.includes('tablet') || normalized.includes('ipad')) return Tablet;
  if (normalized.includes('camera')) return Camera;
  if (normalized.includes('tv') || normalized.includes('display') || normalized.includes('monitor')) return Tv;
  return Layers;
};

// Budget Presets with Quick Ranges
const BUDGET_PRESETS = [
  { id: 'all', label: 'All Budgets', min: 0, max: 250000 },
  { id: 'under15k', label: 'Under ₹15,000', min: 0, max: 15000, desc: 'Entry Level & Essentials' },
  { id: '15k-30k', label: '₹15,000 - ₹30,000', min: 15000, max: 30000, desc: 'Budget Champions' },
  { id: '30k-60k', label: '₹30,000 - ₹60,000', min: 30000, max: 60000, desc: 'Mid-range Value' },
  { id: '60k-1L', label: '₹60,000 - ₹1,00,000', min: 60000, max: 100000, desc: 'Premium Flagships' },
  { id: '1L-plus', label: '₹1,00,000+', min: 100000, max: 250000, desc: 'Ultra-Performance' }
];

export default function ProductCatalog({
  products,
  onProductClick,
  onAddToCompare,
  onToggleFavorite,
  favorites,
  compareList,
  initialCategory = 'All',
  onNavigateToCompare
}: ProductCatalogProps) {
  // Primary Navigation and Display Mode
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState<string>('');

  // Interactive Walkthrough state
  const [walkthroughActive, setWalkthroughActive] = useState<boolean>(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number>(0);
  const totalWalkthroughSteps = 4;

  // Search and Sort
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('score'); // 'score', 'price-low', 'price-high', 'rating', 'value'

  // Advanced Interactive Filters
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(250000);
  const [customMinInput, setCustomMinInput] = useState<string>('0');
  const [customMaxInput, setCustomMaxInput] = useState<string>('250000');
  const [selectedBudgetPreset, setSelectedBudgetPreset] = useState<string>('all');

  const [minRating, setMinRating] = useState<number>(0);
  const [minAiScore, setMinAiScore] = useState<number>(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyEditorChoice, setOnlyEditorChoice] = useState<boolean>(false);
  const [onlyBestBudget, setOnlyBestBudget] = useState<boolean>(false);
  const [onlyTrending, setOnlyTrending] = useState<boolean>(false);

  // Quick Spec Tag Filter (e.g. 5G, OLED, M3, 16GB, ANC, etc.)
  const [selectedSpecTag, setSelectedSpecTag] = useState<string>('All');

  // Quick Compare Drawer / Tray state
  const [isCompareTrayExpanded, setIsCompareTrayExpanded] = useState<boolean>(true);

  // Quick Spec Modal (for instant hover / quick view without full page switch)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync selectedCategory with initialCategory when prop updates
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Extract unique categories and counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  // Extract common tech tags for the active category
  const availableSpecTags = useMemo(() => {
    const tags = new Set<string>();
    const filteredByCategory = selectedCategory === 'All' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    filteredByCategory.forEach(p => {
      Object.values(p.specs).forEach(val => {
        const lower = val.toLowerCase();
        if (lower.includes('oled') || lower.includes('amoled')) tags.add('OLED / AMOLED');
        if (lower.includes('120hz') || lower.includes('144hz') || lower.includes('165hz') || lower.includes('240hz')) tags.add('High Refresh Rate');
        if (lower.includes('m2') || lower.includes('m3') || lower.includes('snapdragon') || lower.includes('i7') || lower.includes('i9') || lower.includes('ryzen')) tags.add('Flagship Processor');
        if (lower.includes('5g')) tags.add('5G Enabled');
        if (lower.includes('anc') || lower.includes('noise cancel')) tags.add('Active Noise Cancelling');
        if (lower.includes('titanium') || lower.includes('aluminum')) tags.add('Metal / Premium Build');
        if (lower.includes('1tb') || lower.includes('512gb')) tags.add('High Storage (512GB+)');
        if (lower.includes('fast charging') || lower.includes('100w') || lower.includes('67w') || lower.includes('45w')) tags.add('Fast Charging');
      });
    });

    return ['All', ...Array.from(tags).slice(0, 8)];
  }, [products, selectedCategory]);

  // Filtered brand list for in-sidebar search
  const filteredBrandList = useMemo(() => {
    if (!brandSearchTerm.trim()) return brands;
    return brands.filter(b => b.toLowerCase().includes(brandSearchTerm.toLowerCase()));
  }, [brands, brandSearchTerm]);

  // Synchronize manual inputs with slider state
  const handleApplyCustomBudget = () => {
    const parsedMin = parseInt(customMinInput.replace(/\D/g, ''), 10) || 0;
    const parsedMax = parseInt(customMaxInput.replace(/\D/g, ''), 10) || 250000;
    const safeMin = Math.max(0, Math.min(parsedMin, parsedMax));
    const safeMax = Math.max(safeMin, Math.min(parsedMax, 300000));
    
    setMinPrice(safeMin);
    setMaxPrice(safeMax);
    setCustomMinInput(safeMin.toString());
    setCustomMaxInput(safeMax.toString());
    setSelectedBudgetPreset('custom');
  };

  const handleSelectBudgetPreset = (preset: typeof BUDGET_PRESETS[0]) => {
    setSelectedBudgetPreset(preset.id);
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
    setCustomMinInput(preset.min.toString());
    setCustomMaxInput(preset.max.toString());
  };

  // Main filter and sort computation
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        
        // Search query across name, brand, description, specs and highlights
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query || 
          p.name.toLowerCase().includes(query) || 
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          Object.values(p.specs).some(v => v.toLowerCase().includes(query)) ||
          (p.highlights && p.highlights.some(h => h.toLowerCase().includes(query)));

        // Price range
        const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

        // Rating & AI Score
        const matchesRating = p.rating >= minRating;
        const matchesAiScore = p.aiScore >= minAiScore;

        // Brands
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);

        // Feature flags
        const matchesEditor = !onlyEditorChoice || p.isEditorChoice;
        const matchesBudgetBadge = !onlyBestBudget || p.isBestBudget;
        const matchesTrendingBadge = !onlyTrending || p.isTrending || p.isPopular;

        // Spec Tag Filter
        let matchesSpecTag = true;
        if (selectedSpecTag !== 'All') {
          const tagLower = selectedSpecTag.toLowerCase();
          const specsString = Object.values(p.specs).join(' ').toLowerCase();
          if (tagLower.includes('oled')) matchesSpecTag = specsString.includes('oled') || specsString.includes('amoled');
          else if (tagLower.includes('refresh')) matchesSpecTag = specsString.includes('120hz') || specsString.includes('144hz') || specsString.includes('165hz');
          else if (tagLower.includes('processor')) matchesSpecTag = specsString.includes('m2') || specsString.includes('m3') || specsString.includes('snapdragon') || specsString.includes('i7') || specsString.includes('i9') || specsString.includes('ryzen');
          else if (tagLower.includes('5g')) matchesSpecTag = specsString.includes('5g');
          else if (tagLower.includes('noise')) matchesSpecTag = specsString.includes('anc') || specsString.includes('noise');
          else if (tagLower.includes('metal') || tagLower.includes('titanium')) matchesSpecTag = specsString.includes('titanium') || specsString.includes('aluminum') || specsString.includes('metal');
          else if (tagLower.includes('storage')) matchesSpecTag = specsString.includes('512gb') || specsString.includes('1tb');
          else if (tagLower.includes('charging')) matchesSpecTag = specsString.includes('fast charging') || specsString.includes('100w') || specsString.includes('67w') || specsString.includes('45w');
        }

        return (
          matchesCategory && 
          matchesSearch && 
          matchesPrice && 
          matchesRating && 
          matchesAiScore && 
          matchesBrand && 
          matchesEditor && 
          matchesBudgetBadge && 
          matchesTrendingBadge &&
          matchesSpecTag
        );
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.aiScore - a.aiScore;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'value') {
          // AI Value metric: AI score per price ratio
          const aValue = (a.aiScore / a.price) * 10000;
          const bValue = (b.aiScore / b.price) * 10000;
          return bValue - aValue;
        }
        return 0;
      });
  }, [
    products, 
    selectedCategory, 
    searchQuery, 
    minPrice, 
    maxPrice, 
    minRating, 
    minAiScore, 
    sortBy, 
    selectedBrands, 
    onlyEditorChoice, 
    onlyBestBudget, 
    onlyTrending,
    selectedSpecTag
  ]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (searchQuery.trim() !== '') count++;
    if (minPrice > 0 || maxPrice < 250000) count++;
    if (minRating > 0) count++;
    if (minAiScore > 0) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (onlyEditorChoice) count++;
    if (onlyBestBudget) count++;
    if (onlyTrending) count++;
    if (selectedSpecTag !== 'All') count++;
    return count;
  }, [
    selectedCategory, 
    searchQuery, 
    minPrice, 
    maxPrice, 
    minRating, 
    minAiScore, 
    selectedBrands, 
    onlyEditorChoice, 
    onlyBestBudget, 
    onlyTrending,
    selectedSpecTag
  ]);

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(250000);
    setCustomMinInput('0');
    setCustomMaxInput('250000');
    setSelectedBudgetPreset('all');
    setMinRating(0);
    setMinAiScore(0);
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('score');
    setSelectedBrands([]);
    setOnlyEditorChoice(false);
    setOnlyBestBudget(false);
    setOnlyTrending(false);
    setSelectedSpecTag('All');
    setBrandSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8" id="product-catalog-panel">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & INTERACTIVE COMMAND BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Verified Multi-Platform Specs
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing <strong className="text-indigo-600 dark:text-indigo-400 font-black">{filteredProducts.length}</strong> of {products.length} devices
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore & Compare Hardware
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Interactive specs matrix, unbiased AI benchmark scoring, custom budget constraints, and side-by-side comparison engine.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap gap-2 sm:gap-2.5 items-center justify-between sm:justify-end">
          
          {/* Quick Guided Tour Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setWalkthroughStep(0);
              setWalkthroughActive(!walkthroughActive);
            }}
            id="catalog-guide-btn"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all ${
              walkthroughActive 
                ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/25' 
                : 'bg-white dark:bg-[#12182B] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-300 shadow-xs'
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${walkthroughActive ? 'text-white animate-spin' : 'text-[#4F46E5] dark:text-indigo-400'}`} style={{ animationDuration: '4s' }} />
            <span>{walkthroughActive ? 'Exit Guide' : 'Catalog Tour'}</span>
          </motion.button>

          {/* Quick Reset Button if Filters Active */}
          {activeFiltersCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset ({activeFiltersCount})</span>
            </motion.button>
          )}

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center bg-slate-100 dark:bg-[#12182B] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              id="view-mode-grid-btn"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-[#4F46E5] dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid View (Cards)"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              id="view-mode-list-btn"
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-[#4F46E5] dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="List / Matrix View (Detailed)"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Filter Sheet Trigger */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            id="mobile-filter-drawer-toggle"
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-indigo-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. CATEGORY HORIZONTAL CAROUSEL TABS */}
      {/* ------------------------------------------------------------- */}
      <div className="relative mb-5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-2 px-2">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat);
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                id={`category-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSpecTag('All');
                }}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white border-transparent shadow-md shadow-[#4F46E5]/25 scale-[1.02]'
                    : 'bg-white dark:bg-[#12182B] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{cat}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  isSelected 
                    ? 'bg-white/25 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. QUICK SPEC TAG CHIPS RIBBON (Category Dynamic) */}
      {/* ------------------------------------------------------------- */}
      {availableSpecTags.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1">
            <Cpu className="h-3 w-3 text-indigo-500" />
            Specs:
          </span>
          {availableSpecTags.map(tag => {
            const isSelected = selectedSpecTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedSpecTag(tag)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-[#4F46E5] text-[#4F46E5] dark:text-indigo-300 shadow-xs font-black'
                    : 'bg-white dark:bg-[#12182B] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {tag === 'All' ? 'All Hardware' : tag}
              </button>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. SEARCH & QUICK SORT CONTROL BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 mb-5 shadow-xs">
        {/* Search Input with Clear Button */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            id="catalog-search-input"
            placeholder="Search specs, chipset, resolution, brand (e.g., M3 Max, OLED, 16GB, RTX 4080, Sony)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-9 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 p-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {walkthroughActive && (
            <WalkthroughTooltip
              step={0}
              currentStep={walkthroughStep}
              title="Search & Interactive Filters"
              description="Type any specific chip or component, or use the interactive sidebar to fine-tune your exact budget and benchmark standards."
              position="bottom"
              onNext={() => setWalkthroughStep(1)}
              onBack={() => {}}
              onClose={() => setWalkthroughActive(false)}
              totalSteps={totalWalkthroughSteps}
            />
          )}
        </div>

        {/* Quick Sorter with Multiple Intelligence Options */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Sort By</span>
          <select
            value={sortBy}
            id="catalog-sort-select"
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
          >
            <option value="score">⚡ AI Match Rating (Highest)</option>
            <option value="value">💎 Best Value (AI Score / ₹ Price)</option>
            <option value="price-low">💰 Price: Low to High</option>
            <option value="price-high">👑 Price: High to Low</option>
            <option value="rating">⭐ Customer Reviews (High to Low)</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. ACTIVE FILTER CHIPS RIBBON */}
      {/* ------------------------------------------------------------- */}
      {activeFiltersCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap items-center gap-1.5 mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-[#12182B]/60 border border-slate-200/80 dark:border-slate-800/80"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-indigo-500" />
            Active ({activeFiltersCount}):
          </span>

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="hover:text-indigo-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-indigo-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(minPrice > 0 || maxPrice < 250000) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Budget: ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
              <button onClick={() => { setMinPrice(0); setMaxPrice(250000); setCustomMinInput('0'); setCustomMaxInput('250000'); setSelectedBudgetPreset('all'); }} className="hover:text-indigo-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedSpecTag !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Spec: {selectedSpecTag}
              <button onClick={() => setSelectedSpecTag('All')} className="hover:text-indigo-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedBrands.map(b => (
            <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Brand: {b}
              <button onClick={() => setSelectedBrands(prev => prev.filter(x => x !== b))} className="hover:text-indigo-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Rating: {minRating}+ Stars
              <button onClick={() => setMinRating(0)} className="hover:text-indigo-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {minAiScore > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              AI Score: {minAiScore}+
              <button onClick={() => setMinAiScore(0)} className="hover:text-indigo-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {onlyEditorChoice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Editor's Choice
              <button onClick={() => setOnlyEditorChoice(false)} className="hover:text-amber-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {onlyBestBudget && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Best Budget Flag
              <button onClick={() => setOnlyBestBudget(false)} className="hover:text-emerald-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {onlyTrending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Trending & Popular
              <button onClick={() => setOnlyTrending(false)} className="hover:text-rose-900 dark:hover:text-white cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[10px] font-black text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline cursor-pointer ml-auto flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All</span>
          </button>
        </motion.div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. MAIN WORKSPACE: FILTERS SIDEBAR + RESULTS GRID/LIST */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        
        {/* FILTERS SIDEBAR */}
        <aside 
          id="catalog-filters-sidebar"
          className={`${
            mobileFilterOpen ? 'block fixed inset-x-3 top-20 bottom-6 z-50 overflow-y-auto' : 'hidden lg:block'
          } bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg lg:shadow-xs space-y-6 lg:sticky lg:top-28`}
        >
          {/* Mobile Close Button Header */}
          <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
            <span className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <SlidersHorizontal className="h-4 w-4 text-[#4F46E5] dark:text-indigo-400" />
              Smart Hardware Filters
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                id="filters-reset-all-btn"
                className="text-xs font-bold text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* MANUAL BUDGET INPUT TOOL & DYNAMIC SLIDER */}
          {/* ============================================================== */}
          <div className="space-y-3 bg-slate-50/80 dark:bg-[#090D16] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-indigo-500" />
                Custom Budget
              </label>
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60">
                INR (₹)
              </span>
            </div>

            {/* Manual Min and Max Input Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Min Price (₹)</span>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={maxPrice}
                    step={1000}
                    value={customMinInput}
                    onChange={(e) => setCustomMinInput(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Max Price (₹)</span>
                <div className="relative">
                  <input
                    type="number"
                    min={minPrice}
                    max={300000}
                    step={2000}
                    value={customMaxInput}
                    onChange={(e) => setCustomMaxInput(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>
            </div>

            {/* Apply Manual Budget Button */}
            <button
              type="button"
              onClick={handleApplyCustomBudget}
              className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-black text-[11px] uppercase tracking-wider py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Custom Range</span>
            </button>

            {/* Visual Slider Bar for Max Price */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-1">
                <span>Slider Limit</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={maxPrice}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setMaxPrice(val);
                  setCustomMaxInput(val.toString());
                  setSelectedBudgetPreset('custom');
                }}
                className="w-full accent-[#4F46E5] bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer h-2"
              />
            </div>

            {/* Quick Budget Presets Chips */}
            <div className="pt-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Preset Segments:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {BUDGET_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectBudgetPreset(preset)}
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all text-left truncate cursor-pointer ${
                      selectedBudgetPreset === preset.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-[#4F46E5] text-[#4F46E5] dark:text-indigo-300 font-black shadow-xs'
                        : 'bg-white dark:bg-[#12182B] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={preset.desc}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* QUICK TOGGLE FLAGS: Editor Choice / Budget / Trending */}
          {/* ============================================================== */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Curated Badges
            </label>

            {/* Editor Choice Toggle */}
            <div 
              onClick={() => setOnlyEditorChoice(!onlyEditorChoice)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                onlyEditorChoice 
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' 
                  : 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">Editor's Choice</span>
              </div>
              <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${
                onlyEditorChoice ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                  onlyEditorChoice ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Best Budget Value Toggle */}
            <div 
              onClick={() => setOnlyBestBudget(!onlyBestBudget)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                onlyBestBudget 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' 
                  : 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">Value Champions</span>
              </div>
              <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${
                onlyBestBudget ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                  onlyBestBudget ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Trending & Popular Toggle */}
            <div 
              onClick={() => setOnlyTrending(!onlyTrending)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                onlyTrending 
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' 
                  : 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">Trending Right Now</span>
              </div>
              <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${
                onlyTrending ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                  onlyTrending ? 'translate-x-3.5' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* AI BENCHMARK SCORE THRESHOLD */}
          {/* ============================================================== */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-indigo-500" />
                Min AI Score
              </label>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {minAiScore === 0 ? 'Any Score' : `${minAiScore}+ / 100`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0, 80, 88, 92].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setMinAiScore(sc)}
                  className={`py-1.5 rounded-xl text-[11px] font-black border transition-all text-center cursor-pointer ${
                    minAiScore === sc
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-[#4F46E5] text-[#4F46E5] dark:text-indigo-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sc === 0 ? 'All' : `${sc}+`}
                </button>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* DYNAMIC BRANDS WITH SEARCH */}
          {/* ============================================================== */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Brands</label>
              {selectedBrands.length > 0 && (
                <button
                  onClick={() => setSelectedBrands([])}
                  className="text-[10px] font-bold text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Clear ({selectedBrands.length})
                </button>
              )}
            </div>

            {/* In-Filter Brand Search */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-slate-400" />
              <input
                type="text"
                placeholder="Find brand (e.g. Apple, Sony)..."
                value={brandSearchTerm}
                onChange={(e) => setBrandSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 rounded-xl pl-7 pr-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="max-h-40 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
              {filteredBrandList.map((brand) => {
                const isSelected = selectedBrands.includes(brand);
                const brandCount = products.filter(p => p.brand === brand).length;
                return (
                  <label 
                    key={brand} 
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#090D16] cursor-pointer text-xs font-bold transition-colors select-none ${
                      isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-[#4F46E5] dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedBrands(prev =>
                            isSelected ? prev.filter(b => b !== brand) : [...prev, brand]
                          );
                        }}
                        className="rounded text-[#4F46E5] focus:ring-[#4F46E5] h-3.5 w-3.5 accent-[#4F46E5] cursor-pointer"
                      />
                      <span className="truncate">{brand}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold ml-1">{brandCount}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* MINIMUM USER RATING FILTER */}
          {/* ============================================================== */}
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">User Review Stars</label>
            <div className="grid grid-cols-4 gap-1">
              {[0, 4, 4.5, 4.7].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    minRating === stars
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-[#4F46E5] text-[#4F46E5] dark:text-indigo-300 font-black shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Star className={`h-3 w-3 ${minRating === stars ? 'fill-[#4F46E5] text-[#4F46E5] dark:fill-indigo-400 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{stars === 0 ? 'Any' : `${stars}+`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Neutrality & Benchmark Note */}
          <div className="bg-slate-50 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>WiseFind Neutrality</span>
            </div>
            <p>Scores are calculated mathematically from real benchmark specs, thermals, battery degradation metrics, and multi-store pricing.</p>
          </div>
        </aside>

        {/* ------------------------------------------------------------- */}
        {/* 7. PRODUCTS RESULTS VIEW (GRID OR LIST) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            /* Empty State with Interactive Recovery CTAs */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-xs"
            >
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto mb-4 text-[#4F46E5] dark:text-indigo-400">
                <SlidersHorizontal className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">No hardware matches your exact parameters</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
                Try widening your budget range (currently ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}) or clearing specific brand filters.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/25 hover:opacity-95 cursor-pointer"
                >
                  Reset All Filters
                </button>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                  >
                    Clear Search "{searchQuery}"
                  </button>
                )}
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                  >
                    Show All Categories
                  </button>
                )}
              </div>
            </motion.div>
          ) : viewMode === 'grid' ? (
            /* ========================================================== */
            /* INTERACTIVE GRID VIEW */
            /* ========================================================== */
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((prod, index) => {
                  const isFavorite = favorites.includes(prod.id);
                  const isInCompare = compareList.some(item => item.id === prod.id);

                  return (
                    <motion.div
                      key={prod.id}
                      id={`product-card-${prod.id}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 260,
                        damping: 24,
                        delay: Math.min(index * 0.025, 0.12) 
                      }}
                      className={`bg-white dark:bg-[#12182B] border rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative ${
                        isInCompare 
                          ? 'border-[#4F46E5] dark:border-indigo-500 ring-2 ring-[#4F46E5]/25' 
                          : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      {/* Image Header with float badges */}
                      <div className="h-50 bg-slate-50 dark:bg-[#090D16] relative overflow-hidden flex items-center justify-center p-3">
                        <SafeProductImage
                          src={prod.image}
                          alt={prod.name}
                          category={prod.category}
                          className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500"
                        />
                        
                        {/* Top Badging Ribbons */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          <span className="text-[9px] font-black text-white bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                            {prod.category}
                          </span>
                          {prod.isEditorChoice && (
                            <span className="text-[9px] font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" />
                              Editor's Pick
                            </span>
                          )}
                          {prod.isBestBudget && (
                            <span className="text-[9px] font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
                              <Tag className="h-2.5 w-2.5" />
                              Best Value
                            </span>
                          )}
                        </div>

                        {/* Neural AI Match Rating */}
                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#12182B]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-xs z-10">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">AI SCORE</span>
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{prod.aiScore}</span>

                          {index === 0 && walkthroughActive && (
                            <WalkthroughTooltip
                              step={1}
                              currentStep={walkthroughStep}
                              title="Neural AI Match Score"
                              description="Our AI dynamically synthesizes technical specs, benchmarks, thermals, and real consumer feedback to assign an objective rating from 1 to 100."
                              position="bottom"
                              onNext={() => setWalkthroughStep(2)}
                              onBack={() => setWalkthroughStep(0)}
                              onClose={() => setWalkthroughActive(false)}
                              totalSteps={totalWalkthroughSteps}
                            />
                          )}
                        </div>

                        {/* Quick Spec Popover Button */}
                        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => setQuickViewProduct(prod)}
                            className="bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-xl text-xs font-black backdrop-blur-sm shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                            title="Quick Spec Sheet"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="text-[10px]">Specs</span>
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Brand & Price Header */}
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{prod.brand}</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">
                              ₹{prod.price.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* Title */}
                          <h4
                            onClick={() => onProductClick(prod)}
                            className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer mb-2.5"
                            title={prod.name}
                          >
                            {prod.name}
                          </h4>

                          {/* Key Specs Breakdown Matrix */}
                          <div className="bg-slate-50 dark:bg-[#090D16] rounded-2xl p-3 border border-slate-200/70 dark:border-slate-800/70 space-y-1.5 mb-3">
                            {Object.entries(prod.specs).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-400 font-bold uppercase tracking-wider truncate max-w-[85px]">{key}:</span>
                                <span className="text-slate-700 dark:text-slate-200 font-extrabold truncate max-w-[140px]">{value}</span>
                              </div>
                            ))}
                          </div>

                          {/* AI Recommendation Snippet Pill */}
                          {prod.pros && prod.pros.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-3.5 line-clamp-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60">
                              <ThumbsUp className="h-3 w-3 shrink-0" />
                              <span className="truncate">{prod.pros[0]}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex justify-between items-center border-t border-slate-150 dark:border-slate-800 pt-3">
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-xl border border-amber-200/60 dark:border-amber-900/60">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-black text-slate-800 dark:text-slate-100">{prod.rating}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Favorite Button */}
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => onToggleFavorite(prod)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isFavorite
                                  ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-500'
                                  : 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white'
                              }`}
                              title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
                            >
                              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                            </motion.button>

                            {/* Add to Compare Button */}
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => onAddToCompare(prod)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer shadow-xs ${
                                isInCompare
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500 text-white shadow-emerald-500/20'
                                  : 'bg-white dark:bg-[#090D16] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
                              }`}
                              title={isInCompare ? 'Remove from Comparison' : 'Add to Comparison'}
                            >
                              {isInCompare ? (
                                <Check className="h-3.5 w-3.5 text-white" />
                              ) : (
                                <BarChart2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#4F46E5]" />
                              )}
                              <span>{isInCompare ? 'In Matrix' : 'Compare'}</span>
                            </motion.button>

                            {/* Direct View Button */}
                            <button
                              onClick={() => onProductClick(prod)}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#4F46E5] hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
                            >
                              Explore
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ========================================================== */
            /* DETAILED LIST / MATRIX VIEW */
            /* ========================================================== */
            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((prod, index) => {
                  const isFavorite = favorites.includes(prod.id);
                  const isInCompare = compareList.some(item => item.id === prod.id);

                  return (
                    <motion.div
                      key={prod.id}
                      id={`product-list-card-${prod.id}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.1) }}
                      className={`bg-white dark:bg-[#12182B] border rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-5 group ${
                        isInCompare 
                          ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' 
                          : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div 
                        className="h-36 w-36 shrink-0 bg-slate-50 dark:bg-[#090D16] rounded-2xl overflow-hidden relative cursor-pointer p-2 flex items-center justify-center"
                        onClick={() => onProductClick(prod)}
                      >
                        <SafeProductImage
                          src={prod.image}
                          alt={prod.name}
                          category={prod.category}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="text-[8px] font-black text-white bg-slate-900/90 px-1.5 py-0.5 rounded uppercase">
                            {prod.category}
                          </span>
                        </div>
                      </div>

                      {/* Main Details & Specs Matrix */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{prod.brand}</span>
                          {prod.isEditorChoice && (
                            <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                              Editor's Choice
                            </span>
                          )}
                          {prod.isBestBudget && (
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              Best Budget
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-[11px] font-black text-slate-700 dark:text-slate-200 ml-auto">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{prod.rating}</span>
                          </div>
                        </div>

                        <h4 
                          onClick={() => onProductClick(prod)}
                          className="font-black text-base text-slate-900 dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors cursor-pointer truncate"
                        >
                          {prod.name}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 mb-2.5">
                          {prod.description}
                        </p>

                        {/* Specs Pill Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(prod.specs).slice(0, 4).map(([key, val]) => (
                            <span key={key} className="text-[10px] font-bold bg-slate-100 dark:bg-[#090D16] text-slate-600 dark:text-slate-300 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                              <strong className="text-slate-400">{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right-hand Pricing, Score & Action Bar */}
                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                        <div className="text-left md:text-right">
                          <div className="flex items-center gap-1.5 md:justify-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase">AI SCORE</span>
                            <span className="text-xs font-black text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                              {prod.aiScore}/100
                            </span>
                          </div>
                          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => onToggleFavorite(prod)}
                            className={`p-2 rounded-xl border cursor-pointer ${
                              isFavorite
                                ? 'bg-red-50 dark:bg-red-950/50 border-red-200 text-red-500'
                                : 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-slate-800 text-slate-400'
                            }`}
                            title="Favorite"
                          >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                          </motion.button>

                          <button
                            onClick={() => onAddToCompare(prod)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border cursor-pointer ${
                              isInCompare
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-white dark:bg-[#090D16] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#4F46E5]'
                            }`}
                          >
                            {isInCompare ? <Check className="h-3.5 w-3.5" /> : <BarChart2 className="h-3.5 w-3.5" />}
                            <span>{isInCompare ? 'In Matrix' : 'Compare'}</span>
                          </button>

                          <button
                            onClick={() => onProductClick(prod)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#4F46E5] text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 8. FLOATING ACTIVE COMPARE DOCK TRAY (Sticky Bottom Bar) */}
      {/* ------------------------------------------------------------- */}
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-900/95 dark:bg-[#0E1322]/95 backdrop-blur-md text-white border border-slate-700/80 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-black/50"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-600 text-white">
                <BarChart2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-black">Comparison Matrix</span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {compareList.length} device{compareList.length > 1 ? 's' : ''} queued (Max 4)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsCompareTrayExpanded(!isCompareTrayExpanded)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                title={isCompareTrayExpanded ? 'Collapse' : 'Expand'}
              >
                {isCompareTrayExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isCompareTrayExpanded && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-4 gap-2">
                {compareList.map((item) => (
                  <div key={item.id} className="relative group bg-slate-800/80 rounded-2xl p-1.5 border border-slate-700/70 text-center">
                    <button
                      onClick={() => onAddToCompare(item)}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white p-0.5 rounded-full hover:scale-110 cursor-pointer z-10"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="h-10 w-full flex items-center justify-center overflow-hidden mb-1">
                      <SafeProductImage src={item.image} alt={item.name} category={item.category} className="h-full object-contain" />
                    </div>
                    <span className="text-[9px] font-black truncate block text-slate-200">{item.name.split(' ')[0]}</span>
                    <span className="text-[8px] font-bold text-indigo-400 block">₹{(item.price / 1000).toFixed(0)}k</span>
                  </div>
                ))}

                {Array.from({ length: Math.max(0, 4 - compareList.length) }).map((_, i) => (
                  <div key={i} className="h-18 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-[9px] font-bold">
                    <span>+ Empty</span>
                  </div>
                ))}
              </div>

              {/* Action to switch to Compare tab */}
              <button
                onClick={() => {
                  if (onNavigateToCompare) {
                    onNavigateToCompare();
                  } else {
                    const compareBtn = document.querySelector('[data-tab="compare"]') as HTMLButtonElement;
                    if (compareBtn) compareBtn.click();
                    else {
                      window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'compare' }));
                    }
                  }
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Launch Side-by-Side Matrix ({compareList.length})</span>
                <BarChart2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. QUICK SPECS MODAL POPOVER (Interactive Quick View) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[100] animate-fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header Banner */}
              <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-5 text-white relative">
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white/20 rounded-md">
                    {quickViewProduct.category}
                  </span>
                  <span className="text-xs font-bold text-white/80">{quickViewProduct.brand}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black">{quickViewProduct.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-black">₹{quickViewProduct.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    ⚡ AI Match Score: {quickViewProduct.aiScore}/100
                  </span>
                </div>
              </div>

              {/* Modal Body Specs Grid */}
              <div className="p-5 overflow-y-auto space-y-4">
                {/* Description */}
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Overview</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{quickViewProduct.description}</p>
                </div>

                {/* Technical Specifications */}
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Verified Specs</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-[#090D16] p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {Object.entries(quickViewProduct.specs).map(([k, v]) => (
                      <div key={k} className="text-xs">
                        <span className="text-slate-400 font-bold uppercase text-[9px] block">{k}</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickViewProduct.pros && quickViewProduct.pros.length > 0 && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl p-3">
                      <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">Strengths</span>
                      <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                        {quickViewProduct.pros.slice(0, 3).map((p, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {quickViewProduct.cons && quickViewProduct.cons.length > 0 && (
                    <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/80 rounded-2xl p-3">
                      <span className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider block mb-1">Considerations</span>
                      <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                        {quickViewProduct.cons.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <X className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => onToggleFavorite(quickViewProduct)}
                  className="flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(quickViewProduct.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{favorites.includes(quickViewProduct.id) ? 'Saved' : 'Wishlist'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToCompare(quickViewProduct)}
                    className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
                  >
                    <BarChart2 className="h-3.5 w-3.5" />
                    <span>Compare</span>
                  </button>
                  <button
                    onClick={() => {
                      onProductClick(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md hover:opacity-95 cursor-pointer"
                  >
                    Open Full Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
