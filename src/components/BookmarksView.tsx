import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { 
  Trash2, Scale, ArrowRight, Sparkles, Star, Search, 
  Share2, Check, Download, Filter, MessageSquare, 
  ExternalLink, Tag, ShieldCheck, Edit3, Save, X, Layers
} from 'lucide-react';
import { SafeProductImage } from './SafeProductImage';
import { WiseBookmarkIcon } from './WiseBookmarkIcon';

interface BookmarksViewProps {
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onProductSelect: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  compareList: Product[];
  onExploreClick: () => void;
  onOpenExpertForProduct?: (product: Product) => void;
}

export default function BookmarksView({
  favorites,
  onRemoveFavorite,
  onProductSelect,
  onAddToCompare,
  compareList,
  onExploreClick,
  onOpenExpertForProduct
}: BookmarksViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'price_asc' | 'price_desc' | 'rating'>('score');
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load custom notes from localStorage
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('wisefind_bookmark_notes');
      if (savedNotes) {
        setUserNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  }, []);

  // Save note helper
  const handleSaveNote = (productId: string) => {
    const updated = { ...userNotes, [productId]: tempNoteText.trim() };
    setUserNotes(updated);
    localStorage.setItem('wisefind_bookmark_notes', JSON.stringify(updated));
    setEditingNoteId(null);
  };

  // Categories present in favorites
  const categories = useMemo(() => {
    const set = new Set<string>();
    favorites.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [favorites]);

  // Filtered and sorted favorites
  const filteredFavorites = useMemo(() => {
    return favorites
      .filter((p) => {
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesQuery =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (userNotes[p.id] && userNotes[p.id].toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return (b.aiScore || 0) - (a.aiScore || 0);
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [favorites, selectedCategory, searchQuery, sortBy, userNotes]);

  // Key metrics calculation
  const totalValue = useMemo(() => {
    return favorites.reduce((acc, curr) => acc + curr.price, 0);
  }, [favorites]);

  const avgWiseScore = useMemo(() => {
    if (favorites.length === 0) return 0;
    const totalScore = favorites.reduce((acc, curr) => acc + (curr.aiScore || 80), 0);
    return Math.round(totalScore / favorites.length);
  }, [favorites]);

  // Copy shareable summary
  const handleCopySummary = () => {
    if (favorites.length === 0) return;
    const summary = favorites
      .map((p, idx) => `${idx + 1}. ${p.brand} ${p.name} - ₹${p.price.toLocaleString('en-IN')} (WiseScore: ${p.aiScore}/100)`)
      .join('\n');
    const textToCopy = `📌 My WiseFind Bookmarked Specifications (${favorites.length} items • Total: ₹${totalValue.toLocaleString('en-IN')}):\n\n${summary}\n\nGenerated via WiseFind AI Shopping Assistant`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Compare All button action
  const handleCompareAll = () => {
    favorites.slice(0, 4).forEach((p) => onAddToCompare(p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in" id="bookmarks-view-panel">
      {/* Upper Brand Header section with WiseBookmarkIcon */}
      <div className="bg-gradient-to-br from-[#090D16] via-[#12182B] to-[#1E293B] border border-slate-800 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-gradient-to-bl from-purple-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-black/80 border-2 border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0 group hover:scale-105 transition-transform">
              <WiseBookmarkIcon size={36} active={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FBBF24] bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  WiseFind Stash Engine
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Saved Specifications & Hardware Wishlist
              </h2>
              <p className="text-xs text-slate-300 font-semibold mt-0.5 flex items-center gap-2">
                <span>{favorites.length} {favorites.length === 1 ? 'specification sheet' : 'specification sheets'} bookmarked</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Auto-synced for instant comparative analysis</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleCopySummary}
              disabled={favorites.length === 0}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-40 shadow-sm"
              title="Copy formatted wishlist summary"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-indigo-400" />}
              <span>{copiedLink ? 'Wishlist Copied!' : 'Share Stash'}</span>
            </button>

            {favorites.length >= 2 && (
              <button
                onClick={handleCompareAll}
                className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                title="Send first 4 bookmarked models to comparison board"
              >
                <Scale className="h-4 w-4 text-[#37D0C0]" />
                <span>Compare Stashed</span>
              </button>
            )}

            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow cursor-pointer ml-auto lg:ml-0"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="h-4 w-4 text-[#7C3AED]" />
            </button>
          </div>
        </div>

          {/* Quick Metrics Bar */}
          {favorites.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Total Stashed Value</span>
                <span className="text-lg font-black text-white block mt-0.5">₹{totalValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Avg WiseScore</span>
                <span className="text-lg font-black text-purple-400 block mt-0.5">{avgWiseScore}/100</span>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Saved Categories</span>
                <span className="text-lg font-black text-cyan-400 block mt-0.5">{categories.length - 1} Diverse</span>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Hardware Council</span>
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1 mt-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> 100% Sponsor-Free
                </span>
              </div>
            </div>
          )}
      </div>

      {/* Main Content Area */}
      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-5 shadow-sm animate-fade-in">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-black flex items-center justify-center shadow-md">
            <WiseBookmarkIcon size={38} active={false} />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Your Stashed Specifications List is Empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Click the official <strong>WiseFind Bookmark (Save)</strong> symbol on any hardware card in the catalog to pin specifications, attach private purchase notes, and run instant multi-device comparisons.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md hover:opacity-95 cursor-pointer"
            >
              <span>Browse Tech Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar: Search, Category Filter, and Sorting */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search saved specs or your private notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                        : 'bg-slate-50 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-black text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="score">Highest WiseScore</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest User Rating</option>
              </select>
            </div>
          </div>

          {/* Grid of Favorited items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((product) => {
              const isComparing = compareList.some((p) => p.id === product.id);
              const note = userNotes[product.id] || '';
              const isEditingNote = editingNoteId === product.id;

              return (
                <motion.div
                  key={product.id}
                  layout
                  className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-lg rounded-3xl p-5 transition-all flex flex-col justify-between group relative shadow-sm"
                >
                  {/* Floating WiseBookmarkIcon & WiseScore */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 rounded-xl shadow-xs border border-white/10">
                      <WiseBookmarkIcon size={16} active={true} />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Saved</span>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-[10px] uppercase px-2.5 py-1 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span>WiseScore {product.aiScore}/100</span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex gap-3.5 items-start">
                      <SafeProductImage
                        src={product.image}
                        alt={product.name}
                        category={product.category}
                        className="h-20 w-20 rounded-2xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex-shrink-0 shadow-sm"
                      />
                      <div className="min-w-0 flex-grow">
                        <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
                          {product.brand} • {product.category}
                        </span>
                        <h4
                          onClick={() => onProductSelect(product)}
                          className="font-black text-slate-900 dark:text-slate-100 text-sm hover:text-[#4F46E5] dark:hover:text-purple-400 transition-colors line-clamp-1 cursor-pointer mt-0.5"
                          title={product.name}
                        >
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-black text-slate-700 dark:text-slate-200">{product.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">•</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Specs Breakdown */}
                    {product.specs && Object.keys(product.specs).length > 0 && (
                      <div className="bg-slate-50 dark:bg-[#0B101D] rounded-2xl p-3 space-y-1.5 text-xs border border-slate-100 dark:border-slate-800/80">
                        {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center font-medium">
                            <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black">{key}</span>
                            <span className="text-slate-800 dark:text-slate-200 font-extrabold truncate max-w-[150px] text-[11px]">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Personal Note Box */}
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 rounded-2xl p-2.5 text-xs">
                      {isEditingNote ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            placeholder="Add note (e.g. 'Wait for festival discount', 'Ideal for college')..."
                            className="w-full bg-white dark:bg-[#111827] border border-amber-300 dark:border-amber-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2 py-1 text-[10px] font-black uppercase text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(product.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] text-amber-900 dark:text-amber-300 font-semibold italic truncate">
                            {note ? `📝 "${note}"` : '+ Add personal shopping note...'}
                          </p>
                          <button
                            onClick={() => {
                              setEditingNoteId(product.id);
                              setTempNoteText(note);
                            }}
                            className="text-amber-700 dark:text-amber-400 hover:text-amber-900 p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer flex-shrink-0"
                            title="Edit Note"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onProductSelect(product)}
                      className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all text-center cursor-pointer shadow-xs"
                    >
                      Specs
                    </button>

                    <button
                      onClick={() => onAddToCompare(product)}
                      className={`text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isComparing
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-50 dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                      title="Add to comparison board"
                    >
                      <Scale className="h-3.5 w-3.5" />
                      <span>{isComparing ? 'Added' : 'Compare'}</span>
                    </button>

                    <button
                      onClick={() => onRemoveFavorite(product)}
                      className="bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 border border-red-200/60 dark:border-red-800/40 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Remove from saved bookmarks"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Unstash</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
