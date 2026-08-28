import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface PopularSearchesProps {
  onCategorySelect: (category: string) => void;
}

const TRENDS_DATA = [
  { category: 'Smartphones', searches: 3420, color: '#3B82F6', icon: '📱' },
  { category: 'Laptops', searches: 2850, color: '#8B5CF6', icon: '💻' },
  { category: 'Smartwatches', searches: 1980, color: '#10B981', icon: '⌚' },
  { category: 'Headphones', searches: 1650, color: '#EC4899', icon: '🎧' },
  { category: 'Mechanical Keyboards', searches: 1210, color: '#F59E0B', icon: '⌨' },
  { category: 'Gaming Accessories', searches: 940, color: '#EF4444', icon: '🎮' },
  { category: 'Tablets', searches: 820, color: '#06B6D4', icon: '✏️' },
];

const RECENT_QUERIES = [
  "Best phone for photography under 80000",
  "High refresh rate laptop for video editing",
  "Apple Watch Ultra 2 battery life reviews",
  "Mechanical keyboard with silent tactile switches",
  "Wireless earbuds with custom EQ capabilities"
];

export const PopularSearches: React.FC<PopularSearchesProps> = ({ onCategorySelect }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50/40 to-white dark:from-[#090D16] dark:via-[#0E1322] dark:to-[#090D16] transition-colors duration-200" id="search-intelligence-section">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Descriptive Left Column */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 px-3 py-1 rounded-full text-xs font-black text-[#4F46E5] dark:text-indigo-400 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Search Intelligence</span>
          </div>
          
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Trending Search Insights</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              Real-time analysis of specifications-driven user query distributions. See what hardware profiles are currently driving consumer searches.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-[#4F46E5] dark:text-indigo-400" />
              Recent Community Inquiries
            </h4>
            <div className="space-y-2">
              {RECENT_QUERIES.map((q, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#12182B] hover:bg-indigo-50/70 dark:hover:bg-[#1A223B] border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#4F46E5] dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all flex justify-between items-center group shadow-xs"
                  onClick={() => {
                    // Navigate to smartphones, laptops, etc. based on keyword match
                    if (q.toLowerCase().includes('phone')) onCategorySelect('Smartphones');
                    else if (q.toLowerCase().includes('laptop')) onCategorySelect('Laptops');
                    else if (q.toLowerCase().includes('watch')) onCategorySelect('Smartwatches');
                    else if (q.toLowerCase().includes('earbuds')) onCategorySelect('Earbuds');
                    else if (q.toLowerCase().includes('keyboard')) onCategorySelect('Mechanical Keyboards');
                    else onCategorySelect('All');
                  }}
                >
                  <span className="truncate pr-3">{q}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Recharts Bar Graph Center-Right */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12182B] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">Category Interest Index</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weekly Search Inquiries</p>
            </div>
            
            <span className="text-[9px] font-black text-[#4F46E5] dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-amber-500" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="h-80 min-h-[320px] w-full" id="popular-searches-chart">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
              <BarChart
                data={TRENDS_DATA}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis 
                  type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 800 }}
                  width={130}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 dark:bg-[#090D16] text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs font-semibold">
                          <p className="font-black text-white mb-1">{data.icon} {data.category}</p>
                          <p className="text-indigo-400 font-bold">{data.searches.toLocaleString()} inquiries</p>
                          <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Click bar to view directory</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="searches" 
                  radius={[0, 8, 8, 0]}
                  barSize={20}
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

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>💡 Click on any bar or tag to inspect specifications and pricing.</span>
            <span className="font-bold text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1" onClick={() => onCategorySelect('All')}>
              View Full Catalog
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
