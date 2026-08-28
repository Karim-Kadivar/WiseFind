import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Heart, Trash2, Scale, ArrowRight, Bookmark, Sparkles, Star } from 'lucide-react';
import { SafeProductImage } from './SafeProductImage';

interface BookmarksViewProps {
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onProductSelect: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  compareList: Product[];
  onExploreClick: () => void;
}

export default function BookmarksView({
  favorites,
  onRemoveFavorite,
  onProductSelect,
  onAddToCompare,
  compareList,
  onExploreClick
}: BookmarksViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="bookmarks-view-panel">
      {/* Upper Header section */}
      <div className="bg-gradient-to-br from-red-500/10 via-rose-500/5 to-slate-50 border border-red-500/15 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-red-400/10 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <Heart className="h-7 w-7 fill-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Saved Specifications</h2>
            <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
              <Bookmark className="h-3.5 w-3.5 text-rose-500" />
              <span>{favorites.length} {favorites.length === 1 ? 'specification sheet' : 'specification sheets'} bookmarked</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 bg-[#111827] hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow cursor-pointer"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="h-4 w-4 text-[#37D0C0]" />
          </button>
        </div>
      </div>

      {/* Grid of Favorited items */}
      {favorites.length === 0 ? (
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm animate-fade-in">
          <Heart className="h-12 w-12 text-slate-300 mx-auto stroke-[1.5]" />
          <h3 className="font-extrabold text-slate-850 text-base">Your stashed specifications list is empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the heart icon on any device card in the Product Catalog to save specs for instant comparisons, technical audits, and personalized purchase guides.
          </p>
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#6A73E4] text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
          >
            <span>Browse Catalog</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => {
            const isComparing = compareList.some((p) => p.id === product.id);
            return (
              <motion.div
                key={product.id}
                layout
                className="bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-md rounded-2xl p-5 transition-all flex flex-col justify-between group relative shadow-sm"
              >
                {/* Floating score or badge */}
                <div className="absolute top-4 right-4 bg-indigo-50 text-[#6A73E4] font-black text-[10px] uppercase px-2 py-1 rounded-lg border border-indigo-100 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Score {product.aiScore}</span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex gap-3.5 items-start">
                    <SafeProductImage
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="h-16 w-16 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-grow pr-12">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">
                        {product.brand} • {product.category}
                      </span>
                      <h4
                        onClick={() => onProductSelect(product)}
                        className="font-extrabold text-slate-900 text-sm hover:text-[#6A73E4] transition-colors truncate cursor-pointer mt-0.5"
                      >
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-black text-slate-700">{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and spec summaries */}
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-slate-400 text-[10px] font-bold">Estimated Cost</span>
                    <span className="text-sm font-black text-[#111827]">₹{product.price.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Highlights or Specs preview */}
                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-[11px]">
                      {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                        <div key={key} className="flex justify-between font-medium">
                          <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black">{key}</span>
                          <span className="text-slate-700 font-extrabold truncate max-w-[160px]">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action items */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100">
                  <button
                    onClick={() => onProductSelect(product)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all text-center cursor-pointer"
                  >
                    Specifications
                  </button>

                  <button
                    onClick={() => onAddToCompare(product)}
                    className={`text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isComparing
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/60'
                        : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                    title="Add to comparison board"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    <span>{isComparing ? 'Added' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(product)}
                    className="bg-red-50/60 hover:bg-red-100/60 text-red-500 border border-red-100/50 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Unstash</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
