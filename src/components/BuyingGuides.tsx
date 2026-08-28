import React, { useState } from 'react';
import { BuyingGuide, Product } from '../types';
import { SafeProductImage } from './SafeProductImage';
import { BookOpen, Star, HelpCircle, GraduationCap, ArrowRight, ShieldAlert, Award, Compass, Sparkles } from 'lucide-react';

interface BuyingGuidesProps {
  guides: BuyingGuide[];
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function BuyingGuides({ guides, products, onProductClick }: BuyingGuidesProps) {
  const [selectedGuide, setSelectedGuide] = useState<BuyingGuide | null>(null);

  // Grouped Product Highlights
  const trending = products.filter(p => p.isTrending);
  const editorsChoice = products.filter(p => p.isEditorChoice);
  const bestBudget = products.filter(p => p.isBestBudget);
  const bestPremium = products.filter(p => p.isBestPremium);
  const popular = products.filter(p => p.isPopular);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="buying-guides-panel">
      
      {/* Upper Grid: Editorial Product Picks Showcase */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-2 flex items-center gap-2">
          <Award className="h-6 w-6 text-[#6A73E4]" />
          Editorial Product Highlights
        </h2>
        <p className="text-sm text-slate-500 mb-8 font-medium">Curated shortlists calculated objectively for specific budgets and expectations.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Editors Choice */}
          <div className="bg-white border-2 border-slate-100 hover:border-[#111827] rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-[#6A73E4] bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-md uppercase tracking-wider">
              Editor's Choice
            </span>
            {editorsChoice.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-slate-50 p-1.5 rounded-xl transition-all">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-10 w-10 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-[#6A73E4]">{p.name}</h4>
                  <span className="text-[10px] font-black text-slate-500 block">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Best Budget picks */}
          <div className="bg-white border-2 border-slate-100 hover:border-[#111827] rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-[#37D0C0] bg-teal-50 border border-teal-100 px-3 py-1 rounded-md uppercase tracking-wider">
              Best Budget Picks
            </span>
            {bestBudget.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-slate-50 p-1.5 rounded-xl transition-all">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-10 w-10 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-[#6A73E4]">{p.name}</h4>
                  <span className="text-[10px] font-black text-slate-500 block">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Best Premium */}
          <div className="bg-white border-2 border-slate-100 hover:border-[#111827] rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-md uppercase tracking-wider">
              Best Premium Picks
            </span>
            {bestPremium.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-slate-50 p-1.5 rounded-xl transition-all">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-10 w-10 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-[#6A73E4]">{p.name}</h4>
                  <span className="text-[10px] font-black text-slate-500 block">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trending & Popular */}
          <div className="bg-white border-2 border-slate-100 hover:border-[#111827] rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300">
            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-md uppercase tracking-wider">
              Trending Products
            </span>
            {trending.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => onProductClick(p)} className="group cursor-pointer flex gap-3 items-center hover:bg-slate-50 p-1.5 rounded-xl transition-all">
                <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-10 w-10 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-[#6A73E4]">{p.name}</h4>
                  <span className="text-[10px] font-black text-slate-500 block">₹{p.price.toLocaleString("en-IN")}</span>
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
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-[#6A73E4]" />
            Category Guides
          </h3>

          <div className="space-y-3">
            {guides.map((gd) => (
              <div
                key={gd.id}
                onClick={() => setSelectedGuide(gd)}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex justify-between items-center ${
                  selectedGuide?.id === gd.id
                    ? 'bg-indigo-50/50 border-[#6A73E4] shadow-sm ring-1 ring-[#6A73E4]/20'
                    : 'bg-white border-slate-100 hover:border-black'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black text-[#6A73E4] block uppercase tracking-wider">{gd.category}</span>
                  <h4 className="font-black text-slate-800 text-sm mt-1">{gd.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">{gd.description}</p>
                </div>
                <ArrowRight className={`h-4 w-4 transition-transform ${selectedGuide?.id === gd.id ? 'text-[#6A73E4] translate-x-1' : 'text-slate-400'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Active Selected Guide Reading Frame */}
        <div className="lg:col-span-2">
          {selectedGuide ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              {/* Title Header */}
              <div className="border-b border-slate-150 pb-5">
                <span className="text-[10px] font-black text-[#6A73E4] uppercase tracking-wider">{selectedGuide.category} Academy</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111827] leading-tight mt-1">{selectedGuide.title}</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">{selectedGuide.description}</p>
              </div>

              {/* Factors to Consider */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-[#6A73E4]" />
                  Key Purchasing Factors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedGuide.keyFactors.map((factor, fidx) => (
                    <div key={fidx} className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                      <h5 className="font-black text-slate-800 text-xs">{factor.title}</h5>
                      <p className="text-slate-500 text-[11px] mt-1 leading-relaxed font-medium">{factor.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget-wise advice */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Segment Advice</h4>
                <div className="space-y-2">
                  {selectedGuide.budgetRanges.map((br, bidx) => (
                    <div key={bidx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/50 border border-slate-200/60 rounded-xl gap-2">
                      <span className="text-xs font-black text-slate-800 sm:w-1/3">{br.range}</span>
                      <span className="text-[11px] text-slate-500 sm:w-2/3 font-medium">{br.advice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jargon Buster definitions */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-[#37D0C0]" />
                  Jargon Buster (Understand Terminology)
                </h4>
                <div className="space-y-2.5">
                  {selectedGuide.jargonBuster.map((jb, jidx) => (
                    <div key={jidx} className="text-xs">
                      <span className="font-black text-slate-800 block">✦ {jb.term}</span>
                      <span className="text-slate-500 block mt-0.5 leading-relaxed pl-4 font-medium">{jb.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editors Ultimate Take */}
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-5">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Editor-in-Chief Ultimate Advice</span>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{selectedGuide.editorsAdvice}"
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center">
              <BookOpen className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-slate-700">Select a Buying Guide</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Understand specs, decode tech marketing lies, and pick the perfect configuration level using our educational tools.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
