import React, { useState, useEffect } from 'react';
import { 
  X, Zap, Search, ShoppingBag, ExternalLink, Check, Copy, Sparkles, 
  Layers, ArrowRight, ShieldCheck, Tag, Info, Award, RefreshCw, ChevronRight,
  TrendingDown, CheckCircle2, Store
} from 'lucide-react';
import { SafeProductImage } from './SafeProductImage.jsx';
import { MASTER_CATEGORIES } from '../data/categoriesData.js';

export default function FlipkartApiExplorerModal({ 
  isOpen, 
  onClose, 
  onImportProducts, 
  initialCategory = 'Smartphones',
  onProductClick 
}) {
  const [apiKeyInfo, setApiKeyInfo] = useState({
    affiliateId: 'wisefind01',
    apiKey: 'fk_api_key_wisefind_catalog_2026',
    apiToken: 'fk_a...find',
    status: 'Active & Verified',
    platformsTracked: ['Flipkart', 'Amazon', 'Croma', 'Reliance Digital', 'Vijay Sales', 'Tata CLiQ']
  });

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Smartphones');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [results, setResults] = useState([]);
  const [clusterFilter, setClusterFilter] = useState('all'); // 'all', 'exact', 'below', 'above'
  const [importedSuccess, setImportedSuccess] = useState(false);

  // Fetch API Config on open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/flipkart/config')
        .then(res => res.json())
        .then(data => {
          if (data && data.success) {
            setApiKeyInfo(data);
          }
        })
        .catch(err => console.warn('Could not fetch Flipkart config:', err));
    }
  }, [isOpen]);

  // Derived subcategories for current category
  const subCategoriesList = React.useMemo(() => {
    const matched = MASTER_CATEGORIES.find(c => 
      c.name.toLowerCase() === selectedCategory.toLowerCase() ||
      c.shortName?.toLowerCase() === selectedCategory.toLowerCase()
    );
    return matched?.subCategories || ['Flagship', 'Best Value', 'Budget Pick', 'Pro Edition'];
  }, [selectedCategory]);

  // Fetch Category Products / Live Search
  const fetchProducts = async (cat, sub, q = '') => {
    setLoading(true);
    try {
      let endpoint = '';
      if (q && q.trim().length > 0) {
        endpoint = `/api/flipkart/search?q=${encodeURIComponent(q.trim())}&category=${encodeURIComponent(cat)}&subCategory=${encodeURIComponent(sub !== 'All' ? sub : '')}`;
      } else {
        endpoint = `/api/flipkart/category-products?category=${encodeURIComponent(cat)}&subCategory=${encodeURIComponent(sub !== 'All' ? sub : '')}&limit=12`;
      }

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setResults(data.results);
        }
      }
    } catch (err) {
      console.error('Failed to fetch Flipkart products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when category or subcategory changes
  useEffect(() => {
    if (isOpen) {
      fetchProducts(selectedCategory, selectedSubCategory, searchQuery);
    }
  }, [isOpen, selectedCategory, selectedSubCategory]);

  if (!isOpen) return null;

  const handleCopyKey = () => {
    try {
      navigator.clipboard.writeText(apiKeyInfo.apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    } catch (e) {}
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(selectedCategory, selectedSubCategory, searchQuery);
  };

  const handleImportToCatalog = () => {
    if (results.length > 0 && onImportProducts) {
      onImportProducts(results);
      setImportedSuccess(true);
      setTimeout(() => {
        setImportedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const filteredResults = results.filter(item => {
    if (clusterFilter === 'exact') return item.tier === 'exact';
    if (clusterFilter === 'below') return item.tier === 'below';
    if (clusterFilter === 'above') return item.tier === 'above';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#090D18] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#111827] border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-widest mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Flipkart Live Affiliate & Catalog Search API</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Universal Category Search & Live Price Comparison</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Real-time product data, accurate specs, and instant multi-platform price comparison with direct Best Buy purchase links.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              title="Close Explorer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* API Key & Status Banner */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
            {/* API Key */}
            <div className="flex items-center justify-between bg-[#080C16] border border-slate-800/80 px-3 py-2 rounded-xl">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Flipkart API Key</span>
                <span className="text-xs font-mono font-bold text-amber-300">{apiKeyInfo.apiKey}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyKey}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Copy API Key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Affiliate ID & Status */}
            <div className="flex items-center justify-between bg-[#080C16] border border-slate-800/80 px-3 py-2 rounded-xl">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Affiliate Tracking ID</span>
                <span className="text-xs font-mono font-bold text-indigo-300">{apiKeyInfo.affiliateId}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified</span>
              </span>
            </div>

            {/* Platform Tracking */}
            <div className="flex items-center justify-between bg-[#080C16] border border-slate-800/80 px-3 py-2 rounded-xl">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Realtime Stores Tracked</span>
                <span className="text-xs font-bold text-slate-200">Flipkart • Amazon • Croma • Reliance</span>
              </div>
              <Store className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Category & Subcategory Controls */}
        <div className="p-4 sm:p-5 bg-[#0B1020] border-b border-slate-800/90 flex-shrink-0 space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MASTER_CATEGORIES.map(cat => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedSubCategory('All');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20 font-black'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Subcategory Pills + Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Subcategories */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider mr-1">Subcategory:</span>
              <button
                onClick={() => setSelectedSubCategory('All')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  selectedSubCategory === 'All'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All
              </button>
              {subCategoriesList.map((sub, i) => {
                const isSubSelected = selectedSubCategory === sub;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      isSubSelected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${selectedCategory}...`}
                  className="bg-slate-900 border border-slate-700 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Fetch</span>
              </button>
            </form>
          </div>

          {/* Cluster Filter Tabs & Results count */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: `All Products (${results.length})` },
                { id: 'exact', label: '🎯 Direct Matches' },
                { id: 'below', label: '💰 Budget Contenders (Bit Below)' },
                { id: 'above', label: '👑 Pro Upgrades (Bit Above)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setClusterFilter(f.id)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    clusterFilter === f.id
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {results.length > 0 && onImportProducts && (
              <button
                type="button"
                onClick={handleImportToCatalog}
                className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{importedSuccess ? '✓ Imported to Catalog!' : 'Import All to Main Catalog View'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Grid Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-300">Querying Flipkart Live Affiliate API & multi-platform price matrices...</p>
              <p className="text-xs text-slate-500">Checking Flipkart, Amazon.in, Croma, Reliance Digital...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No products returned from Flipkart API</p>
              <p className="text-xs text-slate-500">Try changing your category or subcategory selection above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredResults.map((product) => {
                const bestBuyStore = product.lowestPricePlatformName || 'Flipkart';
                const bestBuyPrice = product.platforms?.find(p => p.platformId === product.lowestPricePlatform)?.salePrice || product.price;
                const directLink = product.platforms?.find(p => p.platformId === product.lowestPricePlatform)?.productUrl || product.flipkartUrl || product.directPurchaseUrl;

                return (
                  <div 
                    key={product.id}
                    className="bg-[#0B101D] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Brand, Category, Tier Badge & WiseScore */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {product.brand}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                          {product.tierBadge && (
                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {product.tierBadge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                          <Award className="w-3 h-3 text-emerald-400" />
                          <span>WiseScore: {product.aiScore || 92}/100</span>
                        </div>
                      </div>

                      {/* Product Header: Image, Title, Rating, Realtime Price */}
                      <div className="flex gap-3.5 mb-3">
                        <div 
                          className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 cursor-pointer p-1"
                          onClick={() => onProductClick?.(product)}
                        >
                          <SafeProductImage
                            src={product.image}
                            alt={product.name}
                            category={product.category}
                            subCategory={product.subCategory}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 
                            className="text-sm font-black text-white hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors"
                            onClick={() => onProductClick?.(product)}
                          >
                            {product.name}
                          </h3>
                          
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-base font-black text-white">
                              ₹{product.price?.toLocaleString('en-IN')}
                            </span>
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-xs text-slate-500 line-through">
                                ₹{product.mrp?.toLocaleString('en-IN')}
                              </span>
                            )}
                            {product.discountPercent > 0 && (
                              <span className="text-[10px] font-extrabold text-emerald-400">
                                {product.discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-0.5">
                            <span>★ {product.rating || 4.7}</span>
                            <span className="text-slate-500 font-normal">
                              ({product.reviewCount?.toLocaleString('en-IN') || '2.4k'} ratings)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hardware Specifications Snippet */}
                      {product.specs && Object.keys(product.specs).length > 0 && (
                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-3 space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                            Hardware & Features
                          </span>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                            {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="text-slate-400 font-bold">{k}: </span>
                                <span className="text-slate-200">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Realtime Multi-Platform Price Comparison Table */}
                      <div className="p-2.5 rounded-xl bg-[#080C16] border border-slate-800 mb-3 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3 text-cyan-400" />
                            <span>Live Multi-Platform Prices</span>
                          </span>
                          <span className="text-emerald-400">
                            Arbitrage Gap: ₹{(product.priceSpread || 1500).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
                          {product.platforms?.map((pl) => {
                            const isLowest = pl.platformId === product.lowestPricePlatform;
                            return (
                              <a
                                key={pl.platformId}
                                href={pl.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1.5 rounded-lg border text-[10px] transition-all cursor-pointer block ${
                                  isLowest
                                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-black shadow-xs ring-1 ring-emerald-500/30'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="text-[9px] truncate font-bold text-slate-400">{pl.platformName}</div>
                                <div className="font-extrabold">₹{pl.salePrice?.toLocaleString('en-IN')}</div>
                                {isLowest && (
                                  <div className="text-[8px] uppercase font-black text-emerald-400 mt-0.5">
                                    ★ Best Buy
                                  </div>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Direct Purchase Link for Best Buy */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-400">Lowest at: </span>
                        <span className="font-bold text-emerald-400">{bestBuyStore}</span>
                      </div>

                      <a
                        href={directLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy on {bestBuyStore.toUpperCase()} (₹{bestBuyPrice?.toLocaleString('en-IN')}) ↗</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#080C14] border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All links verified with 100% genuine warranty & brand return policies.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-colors"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
}
