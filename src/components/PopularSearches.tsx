import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, Sparkles, MessageSquare, ArrowRight, Zap, Flame, BarChart3, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PopularSearchesProps {
  onCategorySelect: (category: string) => void;
}

type MetricType = 'searches' | 'growth' | 'deals';

interface TrendItem {
  category: string;
  searches: number;
  growth: number;
  deals: number;
  color: string;
  gradient: string;
  icon: string;
  topTrend: string;
}

const TRENDS_DATA: TrendItem[] = [
  { category: 'Smartphones', searches: 4820, growth: 28, deals: 34, color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600', icon: '📱', topTrend: 'Snapdragon 8 Elite & Zoom OIS' },
  { category: 'Laptops', searches: 3950, growth: 22, deals: 28, color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-700', icon: '💻', topTrend: 'Core Ultra & OLED Under ₹75k' },
  { category: 'Smartwatches', searches: 2680, growth: 35, deals: 19, color: '#10B981', gradient: 'from-emerald-500 to-teal-700', icon: '⌚', topTrend: 'Dual GPS & ECG AMOLED' },
  { category: 'Headphones', searches: 2250, growth: 18, deals: 15, color: '#EC4899', gradient: 'from-pink-500 to-rose-600', icon: '🎧', topTrend: 'LDAC Hi-Res + 45dB ANC' },
  { category: 'Mechanical Keyboards', searches: 1890, growth: 42, deals: 12, color: '#F59E0B', gradient: 'from-amber-500 to-orange-600', icon: '⌨️', topTrend: 'Wireless Tri-Mode & Aluminum CNC' },
  { category: 'Gaming Accessories', searches: 1450, growth: 15, deals: 21, color: '#EF4444', gradient: 'from-red-500 to-rose-700', icon: '🎮', topTrend: 'Hall Effect Triggers & OLED Decks' },
  { category: 'Tablets', searches: 1180, growth: 12, deals: 9, color: '#06B6D4', gradient: 'from-cyan-500 to-blue-600', icon: '✏️', topTrend: 'Stylus Bundles for Students' },
];

const RECENT_QUERIES = [
  { query: "Best phone for low-light photography under ₹40,000", cat: "Smartphones", tag: "Hot Trend" },
  { query: "Lightweight laptop for coding with 16GB RAM under ₹65,000", cat: "Laptops", tag: "High Demand" },
  { query: "Noise-cancelling wireless headphones with multipoint Bluetooth", cat: "Headphones", tag: "Trending" },
  { query: "Mechanical keyboard with hot-swappable tactile switches", cat: "Mechanical Keyboards", tag: "Elite" },
  { query: "Smartwatch with 7-day battery life and AMOLED display", cat: "Smartwatches", tag: "Popular" }
];

export const PopularSearches: React.FC<PopularSearchesProps> = ({ onCategorySelect }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('searches');

  const getMetricValue = (item: TrendItem) => {
    if (activeMetric === 'searches') return item.searches;
    if (activeMetric === 'growth') return item.growth;
    return item.deals;
  };

  const getMetricUnit = () => {
    if (activeMetric === 'searches') return 'Weekly Inquiries';
    if (activeMetric === 'growth') return '% YoY Growth';
    return 'Active Price Drop Deals';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-[#090D16] dark:via-[#0E1322] dark:to-[#090D16] transition-colors duration-200" id="search-intelligence-section">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Descriptive Left Column */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 px-3.5 py-1.5 rounded-full text-xs font-black text-[#4F46E5] dark:text-indigo-400 uppercase tracking-wider mb-2.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Search Intelligence</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Trending Hardware Indices
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              Real-time telemetry analysis of specifications-driven user query distributions. See what hardware profiles and budget brackets are driving Indian consumer searches this week.
            </p>
          </div>

          {/* Recent Inquiries List */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#4F46E5] dark:text-indigo-400" />
                <span>Live Community Inquiries</span>
              </h4>
              <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">Click to Explore</span>
            </div>

            <div className="space-y-2">
              {RECENT_QUERIES.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  className="bg-white dark:bg-[#12182B] hover:bg-indigo-50/70 dark:hover:bg-[#1A223B] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-2xl p-3 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-all flex flex-col gap-1 group shadow-xs"
                  onClick={() => onCategorySelect(item.cat)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded">
                      {item.cat}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <Flame className="h-2.5 w-2.5" />
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="truncate group-hover:text-[#4F46E5] dark:group-hover:text-indigo-300 transition-colors">
                      {item.query}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Recharts Bar Graph Center-Right */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12182B] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-44 w-44 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          {/* Header & Metric Switches */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                Category Interest Index
              </h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {getMetricUnit()}
              </p>
            </div>
            
            {/* Metric Toggle Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                onClick={() => setActiveMetric('searches')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeMetric === 'searches'
                    ? 'bg-white dark:bg-[#12182B] text-[#4F46E5] dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Inquiries
              </button>
              <button
                onClick={() => setActiveMetric('growth')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeMetric === 'growth'
                    ? 'bg-white dark:bg-[#12182B] text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                % Growth
              </button>
              <button
                onClick={() => setActiveMetric('deals')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeMetric === 'deals'
                    ? 'bg-white dark:bg-[#12182B] text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Price Drops
              </button>
            </div>
          </div>

          <div className="h-88 min-h-[350px] w-full" id="popular-searches-chart">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <BarChart
                data={TRENDS_DATA}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
              >
                <XAxis 
                  type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                  unit={activeMetric === 'growth' ? '%' : ''}
                />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 800 }}
                  width={140}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as TrendItem;
                      return (
                        <div className="bg-slate-900 dark:bg-[#090D16] text-white rounded-2xl p-4 shadow-xl border border-slate-700 text-xs max-w-xs">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-black text-sm text-white flex items-center gap-1.5">
                              <span>{data.icon}</span>
                              <span>{data.category}</span>
                            </span>
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                              +{data.growth}% YoY
                            </span>
                          </div>
                          
                          <div className="space-y-1 py-1 border-t border-slate-800">
                            <p className="text-slate-300 font-medium">
                              <span className="text-slate-400">Search Volume:</span> <strong className="text-indigo-400 font-bold">{data.searches.toLocaleString()}</strong> inquiries/week
                            </p>
                            <p className="text-slate-300 font-medium">
                              <span className="text-slate-400">Verified Deals:</span> <strong className="text-amber-400 font-bold">{data.deals} price drops</strong>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1.5 pt-1 border-t border-slate-800/80 font-medium">
                              🔥 <span className="text-slate-200">{data.topTrend}</span>
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-black text-indigo-300 flex items-center justify-between uppercase">
                            <span>Click to Browse Directory</span>
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey={activeMetric === 'searches' ? 'searches' : activeMetric === 'growth' ? 'growth' : 'deals'} 
                  radius={[0, 10, 10, 0]}
                  barSize={24}
                  onClick={(data) => {
                    if (data && data.category) {
                      onCategorySelect(data.category);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {TRENDS_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      opacity={0.88}
                      className="hover:opacity-100 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Highlights */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Interactive Telemetry: Click any bar to instantly filter products</span>
            </span>
            <button 
              className="font-black text-[#4F46E5] dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 cursor-pointer flex items-center gap-1 uppercase tracking-wider text-[11px]" 
              onClick={() => onCategorySelect('All')}
            >
              <span>Explore All 10 Directories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
