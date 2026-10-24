import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  HelpCircle, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Quote,
  ShieldCheck, 
  TrendingDown, 
  CreditCard, 
  BookOpen, 
  Users, 
  Store, 
  Star, 
  ArrowRight,
  Sliders,
  DollarSign,
  HeartHandshake,
  Sparkles,
  Award,
  Search,
  Heart,
  Scale,
  UserCheck,
  CheckCircle2,
  Bookmark,
  Compass,
  Layers,
  ExternalLink,
  Bot
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. WHY CHOOSE WISEFIND                                                     */
/* -------------------------------------------------------------------------- */
/* 1. HOW WISEFIND WORKS (Feature & User-Journey Accurate Flow)                */
export function HowWiseFindWorks({ onNavigateTab }) {
  const steps = [
    {
      number: "01",
      badge: "DISCOVERY",
      title: "Filter What Actually Matters",
      desc: "Zero sponsored vendor ad placements. Browse verified hardware filtered by raw silicon architecture, 120Hz display refresh rates, and hard Indian Rupee (₹) ceilings.",
      icon: Search,
      tab: "browse",
      action: "Explore Catalog",
      accentGradient: "from-blue-600 to-cyan-500",
      accentBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
      tags: ["Zero Sponsored Ads", "Silicon Architecture", "Hard Rupee Ceilings"]
    },
    {
      number: "02",
      badge: "PRICE RADAR",
      title: "Live Multi-Retailer Deals",
      desc: "Compare live inventory across Amazon, Flipkart, Croma, and official stores in one view. Automatically factor in bank card offers and instant exchange bonuses.",
      icon: TrendingDown,
      tab: "browse",
      action: "Browse Multi-Store Deals",
      accentGradient: "from-emerald-600 to-teal-500",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400",
      tags: ["Amazon & Flipkart Sync", "Bank Card Calculator", "Effective Savings"]
    },
    {
      number: "03",
      badge: "COMPARISON",
      title: "Hardware Jargon Decoded",
      desc: "Direct side-by-side matrices comparing thermals, battery endurance, and processors. Every technical specification is translated into plain-English everyday meaning.",
      icon: Scale,
      tab: "compare",
      action: "Open Comparison Matrix",
      accentGradient: "from-amber-600 to-orange-500",
      accentBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400",
      tags: ["Side-by-Side Matrix", "Jargon Decrypter", "Composite WiseScore™"]
    },
    {
      number: "04",
      badge: "ADVISORY",
      title: "Objective Specialist Guidance",
      desc: "Direct 1:1 chat and live video audits with genuine hardware reviewers and category specialists who physically benchmark devices without affiliate kickbacks.",
      icon: UserCheck,
      tab: "experts",
      action: "Talk to Advisors",
      accentGradient: "from-purple-600 to-indigo-500",
      accentBg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
      tags: ["1:1 Advisor Chat", "Zero Affiliate Bias", "Verified Reviewers"]
    }
  ];

  const handleStepClick = (tab) => {
    if (onNavigateTab && tab) {
      onNavigateTab(tab);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors" id="how-wisefind-works">
      {/* Section Header: Slide-up on Scroll */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/90 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Compass className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400"/>
          <span>The Connected Decision Continuum</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B]">WiseFind Works</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 font-medium leading-relaxed max-w-2xl mx-auto">
          Instead of jumping across 20 browser tabs and sponsored ads, WiseFind connects every stage of intelligent buying into one clean, objective pathway.
        </p>
      </motion.div>

      {/* Streamlined 4-Step Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              onClick={() => handleStepClick(step.tab)}
              className="group relative p-6 rounded-3xl bg-white dark:bg-[#0C1020] border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400 dark:hover:border-indigo-600/80 transition-all duration-150 ease-out cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header: Step Number & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`h-8 px-2.5 rounded-xl bg-gradient-to-r ${step.accentGradient} text-white font-mono font-black text-xs flex items-center justify-center gap-1.5 shadow-xs`}>
                    <Icon className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{step.number}</span>
                  </span>

                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${step.accentBg}`}>
                    {step.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                  {step.desc}
                </p>

                {/* Micro Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {step.tags.map((tag, ti) => (
                    <span
                      key={ti}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#12182B] group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 border border-slate-200/80 dark:border-slate-700/70 group-hover:border-transparent text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-between transition-all duration-150 cursor-pointer shadow-2xs group-hover:shadow-md"
                >
                  <span>{step.action}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-150" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. WISEFIND VS TRADITIONAL PRODUCT SEARCH (Decision Process Comparison)    */
/* -------------------------------------------------------------------------- */

export function WiseFindVsOthers() {
  const comparisonRows = [
    {
      basis: "Product Discovery",
      traditional: "Search through ad-promoted and sponsored product listings",
      wisefind: "Discover through organized categories, verified spec filters & price drops",
      icon: Search
    },
    {
      basis: "Finding Relevant Options",
      traditional: "Users manually filter through hundreds of conflicting results",
      wisefind: "Explore options matched directly to your exact budget & usage criteria",
      icon: Compass
    },
    {
      basis: "Shortlisting & Tracking",
      traditional: "Manage open browser tabs and bookmarks manually across sites",
      wisefind: "Save products to personal WiseList with integrated price alert tracking",
      icon: Heart
    },
    {
      basis: "Side-by-Side Comparison",
      traditional: "Manual copy-pasting of specs across multiple retail pages",
      wisefind: "Dedicated side-by-side specification, benchmark & value matrix",
      icon: Scale
    },
    {
      basis: "Product Evaluation",
      traditional: "Research conflicting influencer reviews and sponsored articles",
      wisefind: "Evaluate objective 0-100 WiseScores, thermal audits & real benchmarks",
      icon: Star
    },
    {
      basis: "Buying Guidance",
      traditional: "No unbiased advice available; retail clerks driven by sales commission",
      wisefind: "WiseBot AI assistant and 1:1 consultations with verified category advisors",
      icon: UserCheck
    },
    {
      basis: "Decision Support",
      traditional: "Fragmented trial-and-error with high risk of buyer remorse",
      wisefind: "All 6 decision-support stages connected in one cohesive continuum",
      icon: Layers
    },
    {
      basis: "Overall Experience",
      traditional: "Designed primarily to push sponsored items and make you buy fast",
      wisefind: "Built from the ground up to protect your wallet and empower smart decisions",
      isHighlight: true
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800 transition-colors" id="wisefind-vs-others">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
          <span>Decision Process Comparison</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          WiseFind vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500">Traditional Product Search</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 font-semibold leading-relaxed">
          A More Connected Way to Make Product Decisions
        </p>
      </motion.div>

      {/* Visual Journey Cards: Traditional (Cross Sign) vs WiseFind (Checkmark) */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Traditional Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4 }}
          className="p-5 sm:p-6 rounded-3xl bg-slate-50/90 dark:bg-[#111627] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-150 ease-out flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <X className="h-3.5 w-3.5 stroke-[3]"/>
                </div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Traditional Product Search
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 shrink-0">
                Fragmented Steps
              </span>
            </div>

            {/* In ONE SINGLE LINE without side scroll, accurate and only steps */}
            <div className="w-full py-2.5 px-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between text-[11px] font-black text-slate-700 dark:text-slate-300">
              <span className="shrink-0">🔎 Search</span>
              <span className="text-slate-400 font-black">→</span>
              <span className="shrink-0">📄 Research</span>
              <span className="text-slate-400 font-black">→</span>
              <span className="shrink-0">⚖️ Compare</span>
              <span className="text-slate-400 font-black">→</span>
              <span className="shrink-0 text-rose-600 dark:text-rose-400 font-black flex items-center gap-0.5">
                <X className="h-3 w-3 stroke-[3]" /> Decide
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
            Search listings, leave to read articles elsewhere, manually track tabs, and decide on your own.
          </p>
        </motion.div>

        {/* WiseFind Connected Journey Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4 }}
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-blue-50/70 dark:from-[#131733] dark:via-[#16172E] dark:to-[#121B30] border border-indigo-200/90 dark:border-indigo-900/70 shadow-sm hover:shadow-xl transition-all duration-150 ease-out flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 stroke-[3]"/>
                </div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#4F46E5] dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  WiseFind Connected Journey
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                All-in-One Journey
              </span>
            </div>

            {/* In ONE SINGLE LINE without side scroll, accurate and only steps */}
            <div className="w-full py-2.5 px-2.5 bg-white/90 dark:bg-[#151B30] rounded-2xl border border-indigo-200/90 dark:border-indigo-900/60 shadow-2xs flex items-center justify-between text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-slate-100">
              <span className="shrink-0 text-blue-600 dark:text-blue-400">🔎 Discover</span>
              <span className="text-indigo-400 font-bold">→</span>
              <span className="shrink-0 text-rose-600 dark:text-rose-400">❤️ Shortlist</span>
              <span className="text-indigo-400 font-bold">→</span>
              <span className="shrink-0 text-amber-600 dark:text-amber-400">⚖️ Compare</span>
              <span className="text-indigo-400 font-bold">→</span>
              <span className="shrink-0 text-purple-600 dark:text-purple-400">⭐ Evaluate</span>
              <span className="text-indigo-400 font-bold">→</span>
              <span className="shrink-0 text-teal-600 dark:text-teal-400">👨‍💼 Guidance</span>
              <span className="text-indigo-400 font-bold">→</span>
              <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-0.5">
                <Check className="h-3 w-3 stroke-[3]" /> Decide
              </span>
            </div>
          </div>

          <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-3 font-semibold leading-relaxed">
            One unified continuum connecting discovery, shortlisting, side-by-side matrices, reviews, and verified advisors.
          </p>
        </motion.div>

      </div>

      {/* Comparison Matrix Table with slideup animation */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-x-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-[#101526]"
      >
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#141A30]">
              <th className="py-4.5 px-6 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider w-1/4">
                Basis
              </th>
              <th className="py-4.5 px-6 text-xs sm:text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[37.5%]">
                <div className="flex items-center gap-2">
                  <div className="h-4.5 w-4.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <X className="h-3 w-3 stroke-[3]"/>
                  </div>
                  <span>Traditional Product Search</span>
                </div>
              </th>
              <th className="py-4.5 px-6 text-xs sm:text-sm font-black text-[#4F46E5] dark:text-indigo-400 uppercase tracking-wider bg-indigo-50/70 dark:bg-indigo-950/40 border-l border-indigo-200/80 dark:border-indigo-900/60 w-[37.5%]">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="WiseFind" className="h-4 w-4 rounded-sm object-cover"/>
                  <span>WiseFind</span>
                  <div className="h-4.5 w-4.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]"/>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {comparisonRows.map((row, idx) => {
              const RowIcon = row.icon;
              return (
                <tr 
                  key={idx} 
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                    row.isHighlight ? 'bg-indigo-50/20 dark:bg-indigo-950/10 font-bold' : ''
                  }`}
                >
                  {/* Basis Column */}
                  <td className="py-4 px-6 font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white align-middle">
                    <div className="flex items-center gap-2">
                      {RowIcon && (
                        <RowIcon className="h-4 w-4 text-[#4F46E5] dark:text-indigo-400 shrink-0" />
                      )}
                      <span>{row.basis}</span>
                    </div>
                  </td>
                  
                  {/* Traditional Product Search Column with Red Cross Sign */}
                  <td className="py-4 px-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed align-middle">
                    <div className="flex items-start gap-2.5">
                      <div className="h-4.5 w-4.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="h-3 w-3 stroke-[3]"/>
                      </div>
                      <span className="text-xs sm:text-sm">
                        {row.traditional}
                      </span>
                    </div>
                  </td>

                  {/* WiseFind Column with Green Checkmark Sign */}
                  <td className="py-4 px-6 bg-indigo-50/40 dark:bg-indigo-950/20 border-l border-indigo-200/60 dark:border-indigo-900/40 align-middle">
                    <div className="flex items-start gap-2.5">
                      <div className="h-4.5 w-4.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]"/>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-indigo-200 leading-snug">
                        {row.wisefind}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. WHY CHOOSE WISEFIND? (Best 6-Card Suite)                                */
/* -------------------------------------------------------------------------- */
export function WhyChooseWiseFind({ onExploreFeature, onNavigateTab }) {
  const handleNav = (tab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else if (onExploreFeature) {
      onExploreFeature(tab);
    }
  };

  const cards = [
    {
      id: "discover",
      label: "Discover",
      emoji: "🔎",
      icon: Search,
      title: "Find What Fits",
      desc: "Explore products and categories based on your needs.",
      tab: "browse",
      actionText: "Explore Products",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800",
      accentColor: "text-blue-600 dark:text-blue-400",
      glowColor: "from-blue-500/10 via-sky-500/5 to-transparent",
      borderColor: "border-blue-200/90 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400"
    },
    {
      id: "compare",
      label: "Compare",
      emoji: "⚖️",
      icon: Scale,
      title: "See the Difference",
      desc: "Compare products side by side with relevant details.",
      tab: "compare",
      actionText: "Compare Side by Side",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800",
      accentColor: "text-amber-600 dark:text-amber-400",
      glowColor: "from-amber-500/10 via-orange-500/5 to-transparent",
      borderColor: "border-amber-200/90 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400"
    },
    {
      id: "recommendations",
      label: "Recommendations",
      emoji: "🤖",
      icon: Bot,
      title: "Get Smarter Suggestions",
      desc: "Use AI-assisted recommendations to narrow your options.",
      tab: "wisebot",
      actionText: "Try AI Recommendations",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800",
      accentColor: "text-purple-600 dark:text-purple-400",
      glowColor: "from-purple-500/10 via-indigo-500/5 to-transparent",
      borderColor: "border-purple-200/90 dark:border-purple-900/60 hover:border-purple-400 dark:hover:border-purple-500",
      iconBg: "bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400"
    },
    {
      id: "reviews",
      label: "Reviews",
      emoji: "⭐",
      icon: Star,
      title: "Learn From Experiences",
      desc: "Consider ratings and reviews before making a choice.",
      tab: "browse",
      actionText: "Check Reviews & Scores",
      badgeColor: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/80 dark:text-yellow-300 dark:border-yellow-800",
      accentColor: "text-amber-600 dark:text-amber-400",
      glowColor: "from-yellow-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-yellow-200/90 dark:border-yellow-900/60 hover:border-yellow-400 dark:hover:border-yellow-500",
      iconBg: "bg-yellow-50 dark:bg-yellow-950/80 text-yellow-600 dark:text-yellow-400"
    },
    {
      id: "wishlist",
      label: "Wishlist",
      emoji: "❤️",
      icon: Heart,
      title: "Save Your Options",
      desc: "Keep products you're considering in one convenient place.",
      tab: "bookmarks",
      actionText: "Organize Wishlist",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800",
      accentColor: "text-rose-600 dark:text-rose-400",
      glowColor: "from-rose-500/10 via-pink-500/5 to-transparent",
      borderColor: "border-rose-200/90 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-500",
      iconBg: "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400"
    },
    {
      id: "guidance",
      label: "Advisor Guidance",
      emoji: "👨‍💼",
      icon: UserCheck,
      title: "Get Another Perspective",
      desc: "Connect with verified category advisors for objective 1:1 guidance.",
      tab: "experts",
      actionText: "Talk to Advisors",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800",
      accentColor: "text-teal-600 dark:text-teal-400",
      glowColor: "from-teal-500/10 via-emerald-500/5 to-transparent",
      borderColor: "border-teal-200/90 dark:border-teal-900/60 hover:border-teal-400 dark:hover:border-teal-500",
      iconBg: "bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-b border-slate-200/80 dark:border-slate-800 transition-colors" id="why-choose-wisefind">
      {/* Header with fast, crisp reveal */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-[#4F46E5] dark:text-indigo-300 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B]">WiseFind?</span>
        </h2>
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 mt-3 font-semibold leading-relaxed">
          Better tools for better-informed product decisions.
        </p>
      </motion.div>

      {/* 6-Card Grid: Snappy, Smooth, Non-Delayed Reveal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className={`bg-white dark:bg-[#12182B] bg-gradient-to-b ${card.glowColor} border ${card.borderColor} rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-150 ease-out flex flex-col justify-between group cursor-pointer`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`h-12 w-12 rounded-2xl ${card.iconBg} flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6"/>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                    {card.emoji} {card.label}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleNav(card.tab)}
                className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-black uppercase tracking-wider ${card.accentColor} hover:opacity-80 cursor-pointer w-full text-left`}
              >
                <span>{card.actionText}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform"/>
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// Backward-compatible alias for existing imports
export const FeaturesSection = WhyChooseWiseFind;

/* -------------------------------------------------------------------------- */
/* 4. USER TESTIMONIALS (Interactive Auto-Carousel & Touch Swipes)            */
/* -------------------------------------------------------------------------- */
export function UserTestimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Rohan Varma",
      role: "Software Developer, Bengaluru",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80",
      rating: 5,
      savings: "Saved ₹14,500",
      item: "MacBook Air M3 (16GB)",
      category: "Laptops",
      verified: true,
      store: "Flipkart vs Store",
      quote: "I was just about to buy in a local showroom for ₹1.24 Lakh. WiseFind showed me a card discount on Flipkart that dropped the price to ₹1.09 Lakh with No Cost EMI. That's real money saved in two clicks!"
    },
    {
      id: 2,
      name: "Sneha Mukherjee",
      role: "Creator & Photographer, Mumbai",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&q=80",
      rating: 5,
      savings: "Saved ₹8,200",
      item: "BenQ 4K Color Accurate Monitor",
      category: "Monitors",
      verified: true,
      store: "Amazon India",
      quote: "The side-by-side comparison made it so easy to compare DCI-P3 color gamut and panel nits without getting confused by technical jargon. Found the perfect creator screen in 10 minutes flat."
    },
    {
      id: 3,
      name: "Arunodoy Sen",
      role: "College Student, Pune",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80",
      rating: 5,
      savings: "Saved ₹6,000",
      item: "Sony WH-1000XM5 Headphones",
      category: "Audio",
      verified: true,
      store: "Croma Online",
      quote: "WiseFind stopped me from wasting money on an over-hyped brand. The honest pros and cons list and WiseScore breakdown gave me insights no sponsored YouTube influencer mentioned."
    },
    {
      id: 4,
      name: "Pooja Hegde",
      role: "Home Cook & Baker, Hyderabad",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80",
      rating: 5,
      savings: "Saved ₹3,400",
      item: "Philips XXL Digital Air Fryer",
      category: "Appliances",
      verified: true,
      store: "Reliance Digital",
      quote: "I saved the air fryer to my wishlist and was notified of an ICICI bank flash discount. The multi-store tracker found a warranty bonus that made my purchase completely stress-free."
    },
    {
      id: 5,
      name: "Vikramaditya Roy",
      role: "Product Manager, Gurugram",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80",
      rating: 5,
      savings: "Saved ₹11,200",
      item: "Samsung Galaxy S24 Ultra",
      category: "Smartphones",
      verified: true,
      store: "Samsung Store vs Amazon",
      quote: "Used the 1:1 Advisor Guidance feature before buying. The advisor walked me through trade-in bonuses and helped me skip unnecessary bundle add-ons. That single chat saved me over ₹11,000!"
    },
    {
      id: 6,
      name: "Ananya Iyer",
      role: "Architect & Designer, Chennai",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&q=80",
      rating: 5,
      savings: "Saved ₹5,600",
      item: "iPad Air M2 + Apple Pencil Pro",
      category: "Tablets",
      verified: true,
      store: "Vijay Sales",
      quote: "The AI recommendation engine asked me what apps I draft in and immediately suggested the 128GB version with cloud storage, saving me from overspending on unused SSD space."
    },
    {
      id: 7,
      name: "Karan Johar Sharma",
      role: "Fitness Coach & Runner, Delhi",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&q=80",
      rating: 5,
      savings: "Saved ₹4,500",
      item: "Garmin Forerunner 265 GPS Watch",
      category: "Wearables",
      verified: true,
      store: "Amazon Prime Deal",
      quote: "I was torn between Apple Watch and Garmin for marathon training. WiseFind's side-by-side battery and GPS accuracy matrix made the right choice crystal clear. 14 days of battery confirmed!"
    },
    {
      id: 8,
      name: "Deepa Nambiar",
      role: "Professor & Researcher, Kochi",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&q=80",
      rating: 5,
      savings: "Saved ₹7,800",
      item: "LG 55-inch 4K OLED Smart TV",
      category: "Television",
      verified: true,
      store: "Croma Retail",
      quote: "The spec translator decoded confusing acronyms like OLED vs QNED, refresh rates, and HDMI 2.1 in plain English. I got the perfect cinematic TV without the showroom sales push."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive cards to display per slide
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setCardsToShow(1);
        } else if (window.innerWidth < 1024) {
          setCardsToShow(2);
        } else {
          setCardsToShow(3);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - cardsToShow);

  // Auto carousel rotation
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  return (
    <section 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-b border-slate-200/80 dark:border-slate-800 transition-colors overflow-hidden" 
      id="user-testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header and Prev/Next Navigation Controls with slide-up animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500"/>
            <span>Real Verified Buyers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">Smart Buyers</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed max-w-xl">
            See how real consumers across India save thousands, avoid bad purchases, and find genuine product clarity.
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="h-11 w-11 rounded-2xl bg-white dark:bg-[#141A2E] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs flex items-center justify-center transition-all cursor-pointer group"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="h-11 w-11 rounded-2xl bg-white dark:bg-[#141A2E] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs flex items-center justify-center transition-all cursor-pointer group"
          >
            <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Swipeable Carousel Track with Side Navigation Buttons */}
      <div className="relative group/carousel">
        {/* Left End Floating Swipe Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Swipe previous reviews"
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-white/95 dark:bg-[#12182B]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer group"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right End Floating Swipe Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Swipe next reviews"
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-white/95 dark:bg-[#12182B]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer group"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Inner Swipeable Container */}
        <div 
          className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none px-1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="flex gap-6"
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                style={{ flex: `0 0 calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)` }}
                className="min-w-0"
              >
                <div className="h-full bg-white dark:bg-[#12182B] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-150 ease-out flex flex-col justify-between group relative overflow-hidden">
                  {/* Background decorative quote watermark */}
                  <Quote className="absolute right-4 bottom-20 h-16 w-16 text-slate-100 dark:text-slate-800/40 pointer-events-none -z-0" />

                  <div className="relative z-10">
                    {/* Top Meta: Category, Rating & Savings */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                        {t.category}
                      </span>
                      <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                        {t.savings}
                      </span>
                    </div>

                    {/* Stars Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400"/>
                      ))}
                      <span className="text-[11px] font-bold text-slate-400 ml-1">5.0</span>
                    </div>

                    {/* Item Purchased & Store */}
                    <div className="mb-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {t.item}
                      </h3>
                      <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                        Deal via: <span className="font-semibold text-slate-600 dark:text-slate-300">{t.store}</span>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="relative z-10 flex items-center gap-3 pt-5 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-11 w-11 rounded-full object-cover border-2 border-emerald-500/20 dark:border-emerald-500/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-900 dark:text-white text-xs truncate">
                          {t.name}
                        </h4>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" title="Verified WiseFind User" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {[...Array(maxIndex + 1)].map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setCurrentIndex(dotIdx)}
            aria-label={`Go to slide ${dotIdx + 1}`}
            className={`transition-all duration-300 cursor-pointer rounded-full ${
              currentIndex === dotIdx
                ? "w-8 h-2.5 bg-indigo-600 dark:bg-indigo-500 shadow-xs"
                : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. FAQ SECTION (Accordion)                                                 */
/* -------------------------------------------------------------------------- */
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What makes WiseFind different from search engines or shopping sites?",
      a: "WiseFind is NOT a store and we never accept brand sponsorships or sell products. Traditional search engines and marketplaces overwhelm you with paid sponsored listings and confusing specs. WiseFind provides an all-in-one buying continuum: verified 0-100 WiseScores, factual multi-store price comparisons across India (Amazon, Flipkart, Croma, Vijay Sales), WiseBot AI hardware analysis, and 1:1 access to verified human category advisors."
    },
    {
      q: "How does WiseBot AI provide exact buying answers instead of generic text?",
      a: "WiseBot is directly integrated with our verified hardware catalog and live Indian Rupee (₹) database. Instead of generic marketing jargon, WiseBot calculates exact price differences in ₹, evaluates processor benchmarks and thermal cooling limits, inspects display refresh rates (like 120Hz LTPO AMOLED vs 60Hz OLED), and provides direct, actionable verdicts based on your exact budget and use-case."
    },
    {
      q: "How is the WiseScore™ (0–100) calculated for each product?",
      a: "Every product's WiseScore is computed objectively across 5 core pillars: 1) Raw Performance & Architecture, 2) Display & Build Ergonomics, 3) Battery Endurance & Thermal Stability, 4) Software Support Longevity, and 5) Indian Rupee Price-to-Value Index. No manufacturer can pay to boost their score."
    },
    {
      q: "How does the Multi-Store Price Comparator work?",
      a: "We monitor live market prices across India's premier authorized retailers—including Amazon, Flipkart, Croma, Vijay Sales, and official brand stores. We calculate instant price differentials and factor in available bank card discounts so you find the genuine lowest price without opening a dozen tabs."
    },
    {
      q: "Can I consult verified human category advisors before making a purchase?",
      a: "Yes! In our Advisor Hub, you can connect directly with verified specialists, hardware reviewers, and category advisors across Smartphones, Laptops, Audio, and Home Appliances for personalized 1:1 guidance and unbiased second opinions."
    },
    {
      q: "Is WiseFind 100% free to use?",
      a: "Yes, completely free! You can browse the catalog, compare models side by side, chat with WiseBot, check live store prices, and read our comprehensive buying guides without paying a single rupee or being subjected to paywalls."
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 transition-colors" id="faq-section">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200/80 dark:border-cyan-800/80 text-cyan-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
          <HelpCircle className="h-3.5 w-3.5 text-cyan-500"/>
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">Questions</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 font-medium leading-relaxed">
          Simple, straightforward answers to how WiseFind works and helps you save.
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.28, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl border transition-all duration-150 ease-out overflow-hidden shadow-xs hover:shadow-md ${
                isOpen 
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-md' 
                  : 'bg-white dark:bg-[#111627] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full py-5 px-6 flex items-center justify-between text-left cursor-pointer focus:outline-none"
              >
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white pr-4">
                  {faq.q}
                </span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#4F46E5]' : ''}`}/>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-t border-indigo-100 dark:border-indigo-900/40 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
