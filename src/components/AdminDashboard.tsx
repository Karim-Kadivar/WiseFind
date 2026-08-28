import React, { useState } from 'react';
import { Product, BuyingGuide } from '../types';
import { SafeProductImage } from './SafeProductImage';
import { ShieldCheck, Plus, Trash2, Edit, Save, PlusCircle, CheckCircle, BarChart, Database, ListOrdered, FileText } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  guides: BuyingGuide[];
  onAddProduct: (product: any) => Promise<void>;
  onUpdateProduct: (id: string, product: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onAddGuide: (guide: any) => Promise<void>;
}

export default function AdminDashboard({
  products,
  guides,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddGuide
}: AdminDashboardProps) {
  // Navigation
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'products' | 'guides' | 'analytics'>('products');

  // Product form state
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState('Smartphones');
  const [pPrice, setPPrice] = useState('');
  const [pRating, setPRating] = useState('4.5');
  const [pScore, setPScore] = useState('85');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80');
  const [pDesc, setPDesc] = useState('');
  const [pSpecs, setPSpecs] = useState('Display: 6.1-inch, Processor: Base, Storage: 128GB');
  const [pPros, setPPros] = useState('Compact design, Clear screen');
  const [pCons, setPCons] = useState('High price');
  const [pRecommendation, setPRecommendation] = useState('Excellent baseline entry choice.');
  const [pIsChoice, setPIsChoice] = useState(false);
  const [pIsTrending, setPIsTrending] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Guide form state
  const [gCategory, setGCategory] = useState('Smartphones');
  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');
  const [gAdvice, setGAdvice] = useState('');

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice) return;

    // Convert comma specs to object
    const specObj: Record<string, string> = {};
    pSpecs.split(',').forEach(item => {
      const parts = item.split(':');
      if (parts.length === 2) {
        specObj[parts[0].trim()] = parts[1].trim();
      }
    });

    const newProductData = {
      name: pName,
      brand: pBrand || 'Generic',
      category: pCategory,
      price: parseInt(pPrice) || 20000,
      rating: parseFloat(pRating) || 4.5,
      image: pImage,
      description: pDesc || 'High quality tech choice.',
      specs: specObj,
      highlights: [pName + ' ultimate configuration level'],
      pros: pPros.split(',').map(i => i.trim()).filter(Boolean),
      cons: pCons.split(',').map(i => i.trim()).filter(Boolean),
      aiScore: parseInt(pScore) || 85,
      aiRecommendation: pRecommendation,
      isEditorChoice: pIsChoice,
      isTrending: pIsTrending
    };

    try {
      await onAddProduct(newProductData);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      
      // Reset
      setPName('');
      setPBrand('');
      setPPrice('');
      setPDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gTitle || !gDesc) return;

    const newGuideData = {
      category: gCategory,
      title: gTitle,
      description: gDesc,
      keyFactors: [
        { title: "Standard factor", desc: "Always evaluate the brand durability, standard battery levels, and after-sales service quality." }
      ],
      budgetRanges: [
        { range: "Standard bracket", advice: "Verify local retailer rates before purchasing." }
      ],
      jargonBuster: [
        { term: "Default Term", explanation: "Explanation level description for the category." }
      ],
      editorsAdvice: gAdvice || "Neutral buying recommendation for optimal value."
    };

    try {
      await onAddGuide(newGuideData);
      setGTitle('');
      setGDesc('');
      setGAdvice('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in" id="admin-dashboard-panel">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/40 text-[#818CF8] text-[10px] font-black uppercase tracking-widest mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#818CF8]" />
            <span>Administrator Command Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            WiseFind Platform Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Manage product catalog specifications, author buying guides, and monitor telemetry.</p>
        </div>

        {/* Horizontal Navigation tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'products', label: 'Catalog & CRUD', icon: Database },
            { id: 'guides', label: 'Buying Guides', icon: FileText },
            { id: 'analytics', label: 'Telemetry & Logs', icon: BarChart },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminSubTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white border-transparent shadow-md shadow-[#4F46E5]/20'
                    : 'bg-[#0E1322] text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-4 text-xs font-black text-emerald-300 mb-6 flex items-center gap-2 shadow-lg shadow-emerald-950/40">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Database transaction committed successfully!</span>
        </div>
      )}

      {/* PRODUCTS MANAGEMENT SUB PANEL */}
      {activeAdminSubTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm h-fit space-y-4">
            <h3 className="font-black text-white text-sm flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-[#818CF8]" />
              <span>Add New Product Entry</span>
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-bold text-slate-300">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="iPhone 15 Pro..."
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    placeholder="Apple..."
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold cursor-pointer"
                  >
                    {['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Earbuds', 'Headphones', 'Cameras', 'Televisions', 'Gaming Accessories', 'Home Appliances'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="79900"
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Rating *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={pRating}
                    onChange={(e) => setPRating(e.target.value)}
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">AI Score *</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={pScore}
                    onChange={(e) => setPScore(e.target.value)}
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Media URL</label>
                  <input
                    type="text"
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Specs (Comma separated Key:Value)</label>
                <textarea
                  value={pSpecs}
                  onChange={(e) => setPSpecs(e.target.value)}
                  placeholder="Display: OLED 120Hz, Processor: Apple M3, Storage: 256GB"
                  rows={2}
                  className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl p-3 text-white font-bold focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Pros (Comma separated)</label>
                  <input
                    type="text"
                    value={pPros}
                    onChange={(e) => setPPros(e.target.value)}
                    placeholder="Design, Camera"
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Cons (Comma separated)</label>
                  <input
                    type="text"
                    value={pCons}
                    onChange={(e) => setPCons(e.target.value)}
                    placeholder="Price, Box charger missing"
                    className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">AI Recommendation Verdict</label>
                <textarea
                  value={pRecommendation}
                  onChange={(e) => setPRecommendation(e.target.value)}
                  rows={2}
                  className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl p-3 text-white focus:outline-none font-bold text-xs"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-black text-slate-300">
                  <input
                    type="checkbox"
                    checked={pIsChoice}
                    onChange={(e) => setPIsChoice(e.target.checked)}
                    className="rounded-md h-4 w-4 border-slate-700 accent-[#4F46E5]"
                  />
                  <span>Editor's Choice</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-black text-slate-300">
                  <input
                    type="checkbox"
                    checked={pIsTrending}
                    onChange={(e) => setPIsTrending(e.target.checked)}
                    className="rounded-md h-4 w-4 border-slate-700 accent-[#4F46E5]"
                  />
                  <span>Trending</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white font-black py-3 rounded-xl cursor-pointer transition-all shadow-md shadow-[#4F46E5]/20 uppercase tracking-wider"
              >
                Insert Product Object
              </button>
            </form>
          </div>

          {/* Existing Database Products List */}
          <div className="lg:col-span-2 bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-white text-base">Active Database Objects ({products.length})</h3>

            <div className="divide-y divide-slate-800 max-h-[550px] overflow-y-auto pr-2 space-y-2.5">
              {products.map((prod) => (
                <div key={prod.id} className="py-3.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl border border-slate-700 overflow-hidden bg-black flex items-center justify-center p-1">
                      <SafeProductImage src={prod.image} alt={prod.name} category={prod.category} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm">{prod.name}</h4>
                      <p className="text-slate-400 font-bold mt-0.5">{prod.category} • ₹{prod.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        setIsDeletingId(prod.id);
                        await onDeleteProduct(prod.id);
                        setIsDeletingId(null);
                      }}
                      disabled={isDeletingId === prod.id}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/40 px-3.5 py-2 rounded-xl border border-red-900/50 font-black cursor-pointer transition-all"
                    >
                      {isDeletingId === prod.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE BUYING GUIDES SUB PANEL */}
      {activeAdminSubTab === 'guides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Guide Form */}
          <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="font-black text-white text-sm">Create New Buying Guide</h3>
            <form onSubmit={handleGuideSubmit} className="space-y-4 text-xs font-bold text-slate-300">
              <div>
                <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Target Category *</label>
                <select
                  value={gCategory}
                  onChange={(e) => setGCategory(e.target.value)}
                  className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold cursor-pointer"
                >
                  {['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Cameras', 'Televisions'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Guide Title *</label>
                <input
                  type="text"
                  required
                  value={gTitle}
                  onChange={(e) => setGTitle(e.target.value)}
                  placeholder="How to Choose Smartwatches (2026 Edition)..."
                  className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Guide Description *</label>
                <textarea
                  required
                  value={gDesc}
                  onChange={(e) => setGDesc(e.target.value)}
                  placeholder="Summarize what this guide covers..."
                  rows={3}
                  className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl p-3 text-white focus:outline-none font-bold text-xs"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-black uppercase tracking-wider text-[10px]">Editor Core Advice</label>
                <textarea
                  value={gAdvice}
                  onChange={(e) => setGAdvice(e.target.value)}
                  placeholder="E.g., Prioritize screen parity over brand loyalty..."
                  rows={2}
                  className="w-full bg-[#12182B] border border-slate-700 focus:border-[#4F46E5] rounded-xl p-3 text-white focus:outline-none font-bold text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white font-black py-3 rounded-xl cursor-pointer transition-all shadow-md shadow-[#4F46E5]/20 uppercase tracking-wider"
              >
                Insert Guide Object
              </button>
            </form>
          </div>

          {/* Active Guides */}
          <div className="lg:col-span-2 bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-white text-base">Active Buying Guides ({guides.length})</h3>
            <div className="space-y-3.5 divide-y divide-slate-800 max-h-[450px] overflow-y-auto pr-2">
              {guides.map((gd) => (
                <div key={gd.id} className="pt-3.5 flex justify-between items-start text-xs">
                  <div>
                    <span className="text-[10px] font-black text-[#818CF8] uppercase block tracking-wider">{gd.category}</span>
                    <h4 className="font-black text-white text-sm mt-0.5">{gd.title}</h4>
                    <p className="text-slate-400 font-semibold mt-1 max-w-[400px] truncate">{gd.description}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-black px-2.5 py-1 rounded-xl border border-emerald-500/30 uppercase tracking-wider">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN STATISTICS ANALYTICS */}
      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Total Database Products</span>
              <span className="text-3xl font-black text-white block mt-2">{products.length}</span>
              <span className="text-[10px] text-[#818CF8] font-bold mt-1.5 block">Tuned in Indian Rupees (₹)</span>
            </div>
            <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Total Buying Guides</span>
              <span className="text-3xl font-black text-white block mt-2">{guides.length}</span>
              <span className="text-[10px] text-[#C084FC] font-bold mt-1.5 block">Synced with Academy directory</span>
            </div>
            <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Registered Member Accounts</span>
              <span className="text-3xl font-black text-white block mt-2">1,208</span>
              <span className="text-[10px] text-emerald-400 font-bold mt-1.5 block">● 42 active today</span>
            </div>
          </div>

          <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-white text-sm mb-4">Buying Engine telemetry logs</h3>
            <div className="space-y-3 font-mono text-[10px] text-slate-400 max-h-60 overflow-y-auto pr-1">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>[12:14:10] AI Recommendation computed for query "programming laptop under 70k"</span>
                <span className="text-emerald-400 font-bold">SUCCESS</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>[12:08:42] WiseBot session active with User Karim Kadivar</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>[11:55:01] Database synchronized to system file storage products.json</span>
                <span className="text-emerald-400 font-bold">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
