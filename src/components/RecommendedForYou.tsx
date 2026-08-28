import React, { useMemo, useState } from 'react';
import { Product } from '../types';
import { 
  Sparkles, 
  Heart, 
  Scale, 
  ArrowRight, 
  Star, 
  History, 
  Flame, 
  CheckCircle, 
  Tag, 
  Eye,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeProductImage } from './SafeProductImage';

interface RecommendedForYouProps {
  searchHistory: string[];
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (product: Product) => void;
  onSearchQuery?: (query: string) => void;
  onExploreAll?: () => void;
}

export default function RecommendedForYou({
  searchHistory,
  allProducts,
  onSelectProduct,
  onAddToCompare,
  favorites,
  onToggleFavorite,
  onSearchQuery,
  onExploreAll
}: RecommendedForYouProps) {
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');

  // Derive relevant categories & matched keywords from user's search history
  const { matchedCategories, matchedKeywords, recommendedProducts, recommendationReason } = useMemo(() => {
    const keywords: string[] = [];
    const categoriesSet = new Set<string>();

    const categoryKeywordsMap: Record<string, string[]> = {
      'Smartphones': ['phone', 'mobile', 'iphone', 'galaxy', 'smartphone', 'oneplus', 'pixel', 'camera phone'],
      'Laptops': ['laptop', 'macbook', 'notebook', 'thinkpad', 'dell', 'coding', 'gaming laptop', 'pc'],
      'Tablets': ['tablet', 'ipad', 'tab', 'stylus'],
      'Smartwatches': ['watch', 'smartwatch', 'fitness', 'tracker', 'apple watch', 'garmin'],
      'Headphones': ['headphone', 'headphones', 'sony', 'bose', 'anc', 'over-ear'],
      'Earbuds': ['earbuds', 'airpods', 'tws', 'in-ear', 'buds'],
      'Cameras': ['camera', 'dslr', 'mirrorless', 'sony alpha', 'canon', 'fujifilm', 'vlog'],
      'Televisions': ['tv', 'television', 'oled', '4k', 'qled', 'smart tv'],
      'Gaming Accessories': ['game', 'gaming', 'controller', 'console', 'deck', 'rog'],
      'Mechanical Keyboards': ['keyboard', 'mechanical', 'switches', 'keychron'],
    };

    searchHistory.forEach(rawQuery => {
      const q = rawQuery.toLowerCase();
      keywords.push(rawQuery);

      Object.entries(categoryKeywordsMap).forEach(([cat, aliases]) => {
        if (aliases.some(alias => q.includes(alias))) {
          categoriesSet.add(cat);
        }
      });
    });

    const categories = Array.from(categoriesSet);

    let filtered: { product: Product; reason: string; priority: number }[] = [];

    if (categories.length > 0) {
      // Find products in matched categories
      allProducts.forEach(p => {
        const isCatMatch = categories.includes(p.category);
        const isBrandMatch = keywords.some(k => k.toLowerCase().includes(p.brand.toLowerCase()));
        const isNameMatch = keywords.some(k => p.name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(p.name.toLowerCase()));

        if (isCatMatch || isBrandMatch || isNameMatch) {
          let reason = `Matched search for "${searchHistory[0]}"`;
          let priority = p.aiScore || 80;

          if (isBrandMatch) {
            reason = `Brand match for "${p.brand}" inquiry`;
            priority += 10;
          } else if (isCatMatch) {
            reason = `Recommended in "${p.category}" category`;
            priority += 5;
          }

          filtered.push({ product: p, reason, priority });
        }
      });
    }

    // If search history yielded few results, supplement with top rated & trending products
    if (filtered.length < 4) {
      allProducts
        .filter(p => !filtered.some(f => f.product.id === p.id))
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 8 - filtered.length)
        .forEach(p => {
          filtered.push({
            product: p,
            reason: p.isEditorChoice ? "Editor's Unbiased Top Pick" : p.isTrending ? "Trending in Top Value Index" : "High Reliability Benchmark",
            priority: p.aiScore
          });
        });
    }

    // Sort by priority/aiScore descending
    filtered.sort((a, b) => b.priority - a.priority);

    const reason = searchHistory.length > 0 
      ? `Tuned based on your ${searchHistory.length} recent search ${searchHistory.length === 1 ? 'query' : 'queries'}`
      : 'Personalized based on current market value quotients & editor benchmarks';

    return {
      matchedCategories: categories,
      matchedKeywords: keywords,
      recommendedProducts: filtered,
      recommendationReason: reason
    };
  }, [searchHistory, allProducts]);

  // Apply quick category filter
  const displayedItems = useMemo(() => {
    if (selectedFilterCategory === 'All') {
      return recommendedProducts.slice(0, 8);
    }
    return recommendedProducts.filter(item => item.product.category === selectedFilterCategory);
  }, [recommendedProducts, selectedFilterCategory]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    recommendedProducts.forEach(item => cats.add(item.product.category));
    return ['All', ...Array.from(cats)];
  }, [recommendedProducts]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200" id="recommended-for-you-section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-[#4F46E5] dark:text-indigo-400 text-xs font-black uppercase tracking-wider mb-2.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>Recommended For You</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Tailored To Your Specifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium max-w-2xl">
            {recommendationReason}
          </p>
        </div>

        {/* Action Button */}
        {onExploreAll && (
          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreAll}
            className="text-xs font-black text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 uppercase tracking-wider transition-all shrink-0"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* History Indicators & Quick Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Filter by:
          </span>
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                selectedFilterCategory === cat
                  ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-md shadow-[#4F46E5]/25'
                  : 'bg-white dark:bg-[#12182B] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search History Context Tags */}
        {searchHistory.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <History className="h-3 w-3 text-[#818CF8]" />
              Recent queries:
            </span>
            {searchHistory.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSearchQuery && onSearchQuery(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0E1322] hover:bg-slate-200 dark:hover:bg-[#18213A] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold truncate max-w-[150px] transition-colors cursor-pointer"
                title={`Re-run search: ${q}`}
              >
                "{q}"
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {displayedItems.map(({ product, reason }) => {
            const isFav = favorites.includes(product.id);

            // Extract quick key specs
            const specEntries = Object.entries(product.specs || {}).slice(0, 2);

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="bg-white dark:bg-[#12182B] border border-slate-200/90 dark:border-slate-800 hover:border-[#4F46E5] dark:hover:border-indigo-500 rounded-3xl p-5 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Meta: Recommendation Match Reason Badge & Heart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800 text-[#4F46E5] dark:text-indigo-300 text-[9px] font-black uppercase tracking-wider truncate max-w-[175px]" title={reason}>
                      <Sparkles className="h-2.5 w-2.5 flex-shrink-0 text-amber-500" />
                      <span className="truncate">{reason}</span>
                    </span>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => onToggleFavorite(product)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isFav 
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-xs' 
                          : 'bg-slate-50 dark:bg-[#1A223B] border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                      }`}
                      title={isFav ? 'Remove from Bookmarks' : 'Bookmark Product'}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Product Image Stage */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="h-44 w-full bg-slate-50/80 dark:bg-[#0B0F19] rounded-2xl p-4 flex items-center justify-center relative overflow-hidden cursor-pointer border border-slate-100 dark:border-slate-800/80 group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-colors"
                  >
                    <SafeProductImage
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                    />
                    
                    {/* AI Score Badge overlay */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border border-indigo-500/40 text-white text-[10px] font-black flex items-center gap-1.5 shadow-md">
                      <span className="text-indigo-400 font-bold">AI MATCH</span>
                      <span className="text-amber-300 font-black">{product.aiScore}</span>
                    </div>

                    {product.isEditorChoice && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-md">
                        Top Pick
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-extrabold">{product.brand}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 hover:text-[#4F46E5] dark:hover:text-indigo-400 cursor-pointer transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Spec preview badges */}
                    {specEntries.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {specEntries.map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold truncate max-w-[130px]">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Price & Interaction Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Best Live Price</span>
                    <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAddToCompare(product)}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#1A223B] hover:bg-indigo-50 dark:hover:bg-indigo-950/80 text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
                      title="Add to Comparison Matrix"
                    >
                      <Scale className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shadow-indigo-500/20"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Specs</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
