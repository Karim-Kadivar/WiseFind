import React, { useState, useMemo } from 'react';
import { Product, ProductPlatformComparison, PlatformDeal, PlatformId } from '../types';
import { generatePlatformComparison, PLATFORM_INFO, calculateCustomCheckoutPrice } from '../data/platformPricing';
import { 
  Building2, 
  ExternalLink, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  Store, 
  Check, 
  Tag, 
  AlertCircle, 
  Bell, 
  BellRing, 
  MapPin, 
  Calculator, 
  ArrowRight, 
  Star, 
  Shield, 
  CheckCircle2, 
  Clock, 
  BadgePercent,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { SafeProductImage } from './SafeProductImage';

interface PlatformPriceComparatorProps {
  products: Product[];
  selectedProduct?: Product | null;
  onSelectProduct?: (product: Product) => void;
  onOpenProductModal?: (product: Product) => void;
}

export default function PlatformPriceComparator({
  products,
  selectedProduct: initialProduct,
  onSelectProduct,
  onOpenProductModal
}: PlatformPriceComparatorProps) {
  // Current active product for comparison
  const [currentProduct, setCurrentProduct] = useState<Product>(() => {
    return initialProduct || products[0] || null;
  });

  // Update current product if prop changes
  React.useEffect(() => {
    if (initialProduct) {
      setCurrentProduct(initialProduct);
    }
  }, [initialProduct]);

  // State for search/filter within comparator
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Interactive Net Price Calculator states
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');
  const [includeExchange, setIncludeExchange] = useState<boolean>(false);
  const [exchangeEstimateINR, setExchangeEstimateINR] = useState<number>(12000);
  const [includeExtendedWarranty, setIncludeExtendedWarranty] = useState<boolean>(false);

  // Pincode local delivery checker state
  const [pincode, setPincode] = useState<string>('110001');
  const [isPincodeChecked, setIsPincodeChecked] = useState<boolean>(true);
  const [pincodeLocation, setPincodeLocation] = useState<string>('Connaught Place, New Delhi');

  // Price Drop Alert state
  const [targetAlertPrice, setTargetAlertPrice] = useState<number>(0);
  const [alertSubscribed, setAlertSubscribed] = useState<boolean>(false);
  const [alertEmail, setAlertEmail] = useState<string>('');

  // Active view tab in comparator
  const [activeTab, setActiveTab] = useState<'matrix' | 'calculator' | 'history' | 'perks'>('matrix');

  // Filtered product suggestions
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchQuery = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Generate platform data for active product
  const comparisonData: ProductPlatformComparison | null = useMemo(() => {
    if (!currentProduct) return null;
    return generatePlatformComparison(currentProduct);
  }, [currentProduct]);

  // Handle pincode check
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setIsPincodeChecked(true);
      const prefix = pincode.substring(0, 2);
      if (prefix === '11') setPincodeLocation('New Delhi Metro Area');
      else if (prefix === '40') setPincodeLocation('Mumbai Metro Area');
      else if (prefix === '56') setPincodeLocation('Bengaluru Central');
      else if (prefix === '70') setPincodeLocation('Kolkata Urban');
      else if (prefix === '60') setPincodeLocation('Chennai City');
      else if (prefix === '50') setPincodeLocation('Hyderabad Metro');
      else setPincodeLocation(`PIN ${pincode} Delivery Zone`);
    }
  };

  // Handle alert submit
  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertEmail) {
      setAlertSubscribed(true);
      setTimeout(() => {
        setAlertSubscribed(false);
      }, 5000);
    }
  };

  if (!currentProduct || !comparisonData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 font-bold">No product selected for platform comparison.</p>
      </div>
    );
  }

  // Precompute calculated prices for each platform based on calculator settings
  const calculatedDeals = comparisonData.platforms.map(deal => {
    const calc = calculateCustomCheckoutPrice(
      deal,
      selectedBank,
      includeExchange,
      exchangeEstimateINR,
      includeExtendedWarranty
    );
    return {
      deal,
      calc
    };
  });

  // Find lowest net calculated price
  const lowestCalculatedPrice = Math.min(...calculatedDeals.map(d => d.calc.netEffectiveCost));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="platform-price-comparator">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-800 text-[#7C3AED] dark:text-[#FBBF24] text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Real-Time Indian Multi-Platform Price Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
              Compare Across Amazon, Flipkart, Reliance & Croma
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-3xl">
              Track live pricing, bank cashbacks, instant store pickups, open-box deliveries, and exchange valuations across all authorized Indian retail channels in real time.
            </p>
          </div>

          {/* Quick Product Switcher Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextIdx = (products.findIndex(p => p.id === currentProduct.id) + 1) % products.length;
                setCurrentProduct(products[nextIdx]);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#111827] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-[#7C3AED]" />
              <span>Next Device</span>
            </button>
            {onOpenProductModal && (
              <button
                onClick={() => onOpenProductModal(currentProduct)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer"
              >
                <span>Full Specs</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product selector carousel pill bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Select Device to Compare:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-md">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#111827] dark:bg-[#7C3AED] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {filteredProducts.slice(0, 10).map(p => (
              <button
                key={p.id}
                onClick={() => setCurrentProduct(p)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  currentProduct.id === p.id
                    ? 'bg-purple-50 dark:bg-purple-950/80 border-[#7C3AED] text-[#7C3AED] dark:text-[#FBBF24] shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
                  <SafeProductImage src={p.image} alt={p.name} category={p.category} className="h-full w-full object-cover" />
                </div>
                <span className="truncate max-w-[130px]">{p.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">₹{(p.price / 1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Product Overview Card */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Product Image & Key Specs */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-44 w-44 sm:h-48 sm:w-48 rounded-2xl bg-[#F8FAFC] dark:bg-[#050505] border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-center shrink-0 shadow-inner">
              <SafeProductImage src={currentProduct.image} alt={currentProduct.name} category={currentProduct.category} className="h-full w-full object-contain" />
              <div className="absolute top-2 left-2 bg-[#111827]/80 backdrop-blur-sm text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                {currentProduct.brand}
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#F59E0B] text-xs font-bold">
                <Star className="h-4 w-4 fill-[#FBBF24] text-[#F59E0B]" />
                <span>{currentProduct.rating} / 5.0</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">({currentProduct.aiScore} AI Score)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-white leading-tight">
                {currentProduct.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-xs text-slate-400 line-through">
                  MRP: ₹{comparisonData.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-black text-[#10B981] bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  Save up to ₹{comparisonData.aiVerdict.maxPossibleSavings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* AI Platform Deal Verdict Pill Box */}
          <div className="lg:col-span-8 bg-[#F8FAFC] dark:bg-[#050505] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-[#7C3AED] dark:text-[#FBBF24] font-black text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>AI Multi-Store Match Recommendation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Price Spread:</span>
                <span className="text-xs font-black text-[#111827] dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  ₹{comparisonData.priceSpread.toLocaleString('en-IN')} variance across stores
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {comparisonData.aiVerdict.summary.replace(/\*\*/g, '')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1">
                  <BadgePercent className="h-3 w-3" />
                  <span>Best Overall Value</span>
                </div>
                <div className="text-xs font-bold text-[#111827] dark:text-white mt-1">
                  {PLATFORM_INFO[comparisonData.bestOverallPlatform].name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Lowest net cost after card discounts
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#3B82F6] flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  <span>Fastest Delivery</span>
                </div>
                <div className="text-xs font-bold text-[#111827] dark:text-white mt-1">
                  Amazon Prime
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Tomorrow by 11:00 AM Guaranteed
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B] flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  <span>Instant Store Pickup</span>
                </div>
                <div className="text-xs font-bold text-[#111827] dark:text-white mt-1">
                  Reliance & Croma
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Ready at local retail counter in 2-3 hrs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Views */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'matrix', label: 'Multi-Store Matrix', icon: Building2 },
            { id: 'calculator', label: 'Effective Price Calculator', icon: Calculator },
            { id: 'history', label: '30-Day Store Price Trends', icon: TrendingUp },
            { id: 'perks', label: 'Warranty, Returns & Perks', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-md shadow-[#7C3AED]/25'
                    : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Pincode Quick Status */}
        <form onSubmit={handleCheckPincode} className="flex items-center gap-2 bg-white dark:bg-[#111827] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
          <MapPin className="h-3.5 w-3.5 text-[#3B82F6]" />
          <span className="text-slate-500 dark:text-slate-400 font-bold">Deliver to:</span>
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="w-16 font-mono font-bold text-[#111827] dark:text-white bg-transparent focus:outline-none"
            placeholder="110001"
          />
          <button type="submit" className="text-[10px] font-black text-[#7C3AED] hover:underline uppercase cursor-pointer">
            Update
          </button>
        </form>
      </div>

      {/* VIEW 1: Multi-Platform Comparison Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculatedDeals.map(({ deal, calc }) => {
              const isLowest = deal.isLowestPrice;
              const isBestOverall = deal.isBestOverallDeal;
              const platformMeta = PLATFORM_INFO[deal.platformId];

              return (
                <div
                  key={deal.platformId}
                  className={`bg-white dark:bg-[#111827] rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                    isBestOverall
                      ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/15'
                      : isLowest
                      ? 'border-[#10B981] ring-2 ring-[#10B981]/15'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Floating Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-sm"
                        style={{ backgroundColor: deal.brandColor }}
                      >
                        {deal.platformName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#111827] dark:text-white text-sm">
                          {deal.platformName}
                        </h3>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                          {deal.sellerName}
                        </span>
                      </div>
                    </div>

                    {isBestOverall && (
                      <span className="bg-[#7C3AED] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                        Best Deal
                      </span>
                    )}
                    {isLowest && !isBestOverall && (
                      <span className="bg-[#10B981] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                        Lowest Price
                      </span>
                    )}
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-[#F8FAFC] dark:bg-[#050505] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2 mb-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-[#111827] dark:text-white">
                        ₹{deal.salePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        MRP ₹{deal.basePrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Effective Price with applied card */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Effective Net Cost:</span>
                      <span className="font-black text-[#10B981] text-sm">
                        ₹{calc.netEffectiveCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Key Platform Highlights */}
                  <div className="space-y-3 text-xs mb-6 flex-grow">
                    {/* Delivery ETA */}
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                      <Truck className="h-4 w-4 text-[#3B82F6] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{deal.deliveryTime}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          Delivery to {pincodeLocation}
                        </span>
                      </div>
                    </div>

                    {/* Bank Card Discount */}
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                      <CreditCard className="h-4 w-4 text-[#7C3AED] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#7C3AED] dark:text-[#FBBF24]">
                          {deal.bankOffers[0]?.description || 'Multiple Bank Card EMI & Discounts'}
                        </span>
                      </div>
                    </div>

                    {/* Store Pickup / Local Availability */}
                    {deal.storePickupAvailable && (
                      <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                        <Store className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#F59E0B]">
                            {deal.nearestStoreDistance || 'Store Pickup Available'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Cashback / Extra Perks */}
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                      <BadgePercent className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-300">
                        {deal.cashbackText}
                      </span>
                    </div>

                    {/* Return & Warranty */}
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                      <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-500 dark:text-slate-400">
                        {deal.returnPolicy}
                      </span>
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <a
                      href={deal.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      style={{ backgroundColor: deal.brandColor === '#111827' ? '#1E293B' : deal.brandColor }}
                    >
                      <span>Buy on {platformMeta.shortName}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center block mt-1.5">
                      {deal.verifiedTimestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Interactive Net Price & Card Discount Calculator */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#7C3AED] font-black text-xs uppercase tracking-wider mb-1">
                <Calculator className="h-4 w-4" />
                <span>Custom Deal Configurator</span>
              </div>
              <h3 className="text-xl font-black text-[#111827] dark:text-white">
                Calculate Exact Final Checkout Price
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select your payment cards and trade-in gear to find the absolute lowest cost.
              </p>
            </div>

            {/* Bank Card Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Select Your Primary Payment Card:
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#050505] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-[#111827] dark:text-white focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="HDFC">HDFC Bank Credit Card / EasyEMI (Up to ₹6,000 Off)</option>
                <option value="ICICI">ICICI Bank Credit Card / Netbanking (Up to ₹5,000 Off)</option>
                <option value="AMAZONPAY">Amazon Pay ICICI Card (5% Unlimited Cashback)</option>
                <option value="TATANEU">Tata Neu Infinity HDFC Card (5% NeuCoins on Croma)</option>
                <option value="SBI">SBI Credit Card (10% Instant Discount on Flipkart)</option>
                <option value="AXIS">Flipkart Axis Bank Card (5% Unlimited Cashback)</option>
                <option value="KOTAK">Kotak Mahindra Bank Card (7.5% Off on Vijay Sales)</option>
                <option value="NONE">Standard Debit Card / UPI / Cash on Delivery (No Card Offer)</option>
              </select>
            </div>

            {/* Old Phone / Gadget Exchange Toggle */}
            <div className="bg-[#F8FAFC] dark:bg-[#050505] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Exchange Old Device:
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeExchange(!includeExchange)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    includeExchange ? 'bg-[#7C3AED]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white absolute top-1 transition-transform ${
                      includeExchange ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {includeExchange && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Estimated Old Device Valuation:</span>
                    <span className="font-bold text-[#111827] dark:text-white">₹{exchangeEstimateINR.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={3000}
                    max={40000}
                    step={1000}
                    value={exchangeEstimateINR}
                    onChange={(e) => setExchangeEstimateINR(Number(e.target.value))}
                    className="w-full accent-[#7C3AED] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>₹3,000 (Budget)</span>
                    <span>₹20,000 (Midrange)</span>
                    <span>₹40,000 (Flagship)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Extended Warranty Toggle */}
            <div className="bg-[#F8FAFC] dark:bg-[#050505] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  3. Extended Brand & Screen Warranty:
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Adds 1 extra year of accidental & liquid damage protection
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIncludeExtendedWarranty(!includeExtendedWarranty)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  includeExtendedWarranty ? 'bg-[#7C3AED]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white absolute top-1 transition-transform ${
                    includeExtendedWarranty ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Real-time Side-by-Side Calculated Results Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-[#111827] dark:text-white text-base">
                  Net Effective Checkout Price Breakdown
                </h3>
                <span className="text-xs font-black text-[#10B981] bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Best Price: ₹{lowestCalculatedPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-3">
                {calculatedDeals.map(({ deal, calc }) => {
                  const isWinning = calc.netEffectiveCost === lowestCalculatedPrice;

                  return (
                    <div
                      key={deal.platformId}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isWinning
                          ? 'bg-purple-50/70 dark:bg-purple-950/40 border-[#7C3AED] shadow-sm'
                          : 'bg-[#F8FAFC] dark:bg-[#050505] border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-sm shrink-0"
                          style={{ backgroundColor: deal.brandColor }}
                        >
                          {deal.platformName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#111827] dark:text-white text-sm">
                              {deal.platformName}
                            </span>
                            {isWinning && (
                              <span className="bg-[#10B981] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                Lowest Net Cost
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {calc.appliedBankOfferName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-black text-[#111827] dark:text-white">
                            ₹{calc.netEffectiveCost.toLocaleString('en-IN')}
                          </div>
                          {calc.bankDiscount > 0 && (
                            <span className="text-[10px] font-bold text-[#10B981] block">
                              -₹{calc.bankDiscount.toLocaleString('en-IN')} Card Discount
                            </span>
                          )}
                        </div>

                        <a
                          href={deal.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-[#111827] dark:bg-slate-800 hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>Checkout</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 30-Day Multi-Store Price Trend Line Chart */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#7C3AED] font-black text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Cross-Platform Price Volatility Telemetry</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-white">
                30-Day Price Fluctuations Across Amazon, Flipkart & Croma
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Compare historical discounts to confirm if the current asking price is an all-time low.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#F8FAFC] dark:bg-[#050505] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Buy Recommendation:</span>
                <span className="font-extrabold text-[#10B981] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Buy Now (Near All-Time Low)
                </span>
              </div>
            </div>
          </div>

          {/* Recharts Multi-line Price History Chart */}
          <div className="h-80 min-h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
              <LineChart data={comparisonData.priceHistory30Days} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="amazon" name="Amazon India" stroke="#FF9900" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="flipkart" name="Flipkart" stroke="#2874F0" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="croma" name="Croma" stroke="#00B5B8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="reliance" name="Reliance Digital" stroke="#E42529" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Price Drop Alert Signup Box */}
          <div className="mt-8 bg-purple-50/60 dark:bg-purple-950/40 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#7C3AED] font-black text-xs uppercase tracking-wider">
                  <Bell className="h-4 w-4" />
                  <span>Set Instant Price Drop Alert</span>
                </div>
                <h4 className="text-base font-extrabold text-[#111827] dark:text-white">
                  Get notified when {currentProduct.name} drops on ANY store
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We check Amazon, Flipkart, Croma and Reliance every 15 minutes automatically.
                </p>
              </div>

              <form onSubmit={handleAlertSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#7C3AED]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer shrink-0"
                >
                  {alertSubscribed ? 'Alert Active!' : 'Track Price'}
                </button>
              </form>
            </div>
            {alertSubscribed && (
              <div className="mt-3 text-xs font-bold text-[#10B981] flex items-center justify-center md:justify-start gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Price drop monitor active for {alertEmail}! You will receive an instant notification if price drops below current rates.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: Warranty, Returns & Platform Perks */}
      {activeTab === 'perks' && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[#7C3AED] font-black text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Consumer Protection & Service Level Agreements</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-white">
              Platform Policies, Return Windows & Service Guarantees
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Understand the exact return process, warranty claims, and physical store network before making your purchase.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Return / Replacement</th>
                  <th className="py-3.5 px-4">Warranty Coverage</th>
                  <th className="py-3.5 px-4">Delivery & Unboxing</th>
                  <th className="py-3.5 px-4">Store Pickup</th>
                  <th className="py-3.5 px-4">Loyalty Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {comparisonData.platforms.map(deal => (
                  <tr key={deal.platformId} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#111827] dark:text-white flex items-center gap-2.5">
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center font-black text-white text-[10px] shrink-0"
                        style={{ backgroundColor: deal.brandColor }}
                      >
                        {deal.platformName.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{deal.platformName}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      {deal.returnPolicy}
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-[#10B981] block">{deal.warranty}</span>
                      <span className="text-[10px] text-slate-500">Optional care: ₹{deal.extendedWarrantyPrice?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      {deal.deliveryTime}
                    </td>
                    <td className="py-4 px-4">
                      {deal.storePickupAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[#10B981] font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <Check className="h-3 w-3" /> Available
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Home delivery only</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      {deal.cashbackText}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
