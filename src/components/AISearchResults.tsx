import React from 'react';
import { RecommendationResult, Product } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, Heart, BarChart2, Plus, ArrowRight, Share2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { WiseBookmarkIcon } from './WiseBookmarkIcon';

interface AISearchResultsProps {
  result: RecommendationResult;
  onSaveToFavorites: (productName: string, category: string, price: string) => void;
  onAddToCompare: (product: any) => void;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
}

export default function AISearchResults({ result, onSaveToFavorites, onAddToCompare, allProducts, onProductClick }: AISearchResultsProps) {
  // Helper to check if recommended product exists in our database
  const getProductFromDB = (productName: string): Product | null => {
    const found = allProducts.find(p => 
      productName.toLowerCase().includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(productName.toLowerCase())
    );
    return found || null;
  };

  return (
    <div className="bg-slate-50 py-12 border-b border-slate-100" id="ai-results-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Extracted Requirements Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-accent animate-pulse"></span>
                WiseFind AI Intel Analysis
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Here is how our Buying Intelligence decoded your requirements:</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Sponsor-Free Audit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Budget</span>
              <span className="text-base font-bold text-slate-800 block mt-1">{result.extractedRequirements.budget || 'Flexible'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Core Intent</span>
              <span className="text-base font-bold text-slate-800 block mt-1 truncate">{result.extractedRequirements.purpose || 'General Use'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Brand Preferences</span>
              <span className="text-base font-bold text-slate-800 block mt-1">{result.extractedRequirements.brandPreference || 'None'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Scenario</span>
              <span className="text-sm font-semibold text-slate-800 block mt-1 line-clamp-2" title={result.extractedRequirements.usageScenario}>
                {result.extractedRequirements.usageScenario || 'Daily Multitasking'}
              </span>
            </div>
          </div>

          {result.extractedRequirements.preferredFeatures && result.extractedRequirements.preferredFeatures.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Key Filter Targets:</span>
              {result.extractedRequirements.preferredFeatures.map((feat, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
                  ✓ {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Buying Recommendations Cards Grid */}
        <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2">
          <span>Primary Matches</span>
          <span className="text-xs text-slate-400 font-bold lowercase tracking-normal bg-slate-100 px-2.5 py-1 rounded-md">Sorted by highest alignment score</span>
        </h3>

        <div className="grid grid-cols-1 gap-8 mb-10">
          {result.recommendations.map((rec, index) => {
            const dbProduct = getProductFromDB(rec.productName);
            const isTopMatch = index === 0;

            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.1, 0.4), ease: 'easeOut' }}
                className={`bg-white rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isTopMatch 
                    ? 'border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20' 
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Top Match Tag */}
                {isTopMatch && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-white" />
                    <span>AI Recommendation Crown</span>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Title & Brand Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md uppercase tracking-wider border border-primary/10">
                          {rec.brand}
                        </span>
                        <span className="text-sm text-slate-400">• Est. {rec.priceEstimate}</span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 hover:text-primary transition-all cursor-pointer" onClick={() => dbProduct && onProductClick(dbProduct)}>
                        {rec.productName}
                      </h4>
                    </div>

                    {/* AI Score Badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Match Score</span>
                        <span className="text-2xl font-black text-slate-900">{rec.aiMatchScore}%</span>
                      </div>
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-extrabold ${
                        rec.aiMatchScore >= 90 ? 'bg-emerald-500' : rec.aiMatchScore >= 80 ? 'bg-primary' : 'bg-amber-500'
                      }`}>
                        {rec.aiMatchScore}
                      </div>
                    </div>
                  </div>

                  {/* Match Reason Text */}
                  <p className="text-slate-600 text-sm sm:text-base border-l-4 border-slate-200 pl-4 mb-6 leading-relaxed italic">
                    "{rec.matchReason}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-slate-100 py-6 mb-6">
                    {/* Key Technical Highlights */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Key Intel specs</span>
                      <div className="space-y-2">
                        {Object.entries(rec.specsHighlight || {}).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">{key}:</span>
                            <span className="text-slate-800 font-bold max-w-[150px] truncate" title={val}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>Key Strengths</span>
                        </span>
                        <ul className="space-y-1.5">
                          {rec.strengths.slice(0, 3).map((st, sidx) => (
                            <li key={sidx} className="text-xs text-slate-600 flex items-start gap-1">
                              <span className="text-emerald-500 font-bold mt-0.5">•</span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <span>Potential Drawbacks</span>
                        </span>
                        <ul className="space-y-1.5">
                          {rec.weaknesses.slice(0, 3).map((wk, widx) => (
                            <li key={widx} className="text-xs text-slate-600 flex items-start gap-1">
                              <span className="text-red-400 font-bold mt-0.5">•</span>
                              <span>{wk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Buying Advice Column */}
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">WiseFind Pro Advice</span>
                      <p className="text-xs text-slate-700 mt-1 font-medium">{rec.buyingAdvice}</p>
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onSaveToFavorites(rec.productName, rec.brand, rec.priceEstimate)}
                        className="flex items-center gap-1.5 text-xs text-[#111827] hover:text-white font-extrabold bg-white hover:bg-[#111827] px-3.5 py-2 rounded-xl border border-slate-200 hover:border-black transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        <WiseBookmarkIcon size={14} active={false} />
                        <span>Bookmark Advice</span>
                      </button>

                      <button
                        onClick={() => {
                          const itemToCompare = dbProduct || {
                            id: `rec-${index}`,
                            name: rec.productName,
                            brand: rec.brand,
                            price: parseInt(rec.priceEstimate.replace(/[^0-9]/g, '')) || 50000,
                            category: "Compare Targets",
                            rating: 4.5,
                            specs: rec.specsHighlight,
                            pros: rec.strengths,
                            cons: rec.weaknesses,
                            aiScore: rec.aiMatchScore
                          };
                          onAddToCompare(itemToCompare);
                        }}
                        className="flex items-center gap-1.5 text-xs text-[#111827] hover:text-white font-extrabold bg-white hover:bg-[#111827] px-3.5 py-2 rounded-xl border border-slate-200 hover:border-black transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        <span>Add to Compare</span>
                      </button>
                    </div>

                    {dbProduct ? (
                      <button 
                        onClick={() => onProductClick(dbProduct)}
                        className="flex items-center gap-1 text-sm text-primary font-black hover:underline"
                      >
                        <span>View Specs & Alternatives</span>
                        <ArrowRight className="h-3.5 w-3.5 font-bold" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">Market Spec (External)</span>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Verdict Card */}
        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
          <h4 className="text-base font-bold text-accent uppercase tracking-wider mb-2">The Ultimate Buying Verdict</h4>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
            {result.overallBuyingVerdict}
          </p>
        </div>

      </div>
    </div>
  );
}
