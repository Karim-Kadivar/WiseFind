import React, { useState, useEffect } from 'react';
import { Product, UserRole } from '../types';
import { SafeProductImage } from './SafeProductImage';
import { 
  Layout, Heart, History, Settings, User, Sparkles, Star, 
  ArrowRight, ShieldCheck, HelpCircle, Folder, Plus, Trash2, 
  Move, Pencil, FileText, CheckCircle2, UserCheck, Key, 
  CheckSquare, Square, Target, BellRing, Clock, Bookmark,
  Tag, BarChart2, DollarSign, Calendar
} from 'lucide-react';
import { UserTaskOrAlert, loadUserDataForEmail, saveUserDataForEmail } from '../utils/profileStorage';

interface Wishlist {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
}

interface UserDashboardProps {
  favorites: Product[]; // All saved products across wishlists
  onRemoveFavorite: (product: Product) => void;
  onProductSelect: (product: Product) => void;
  searchHistory: string[];
  compareHistory: { id: string; names: string[]; timestamp: string }[];
  onClearHistory: () => void;
  
  // Wishlist manager props
  wishlists: Wishlist[];
  onCreateWishlist: (name: string, description?: string) => void;
  onDeleteWishlist: (wishlistId: string) => void;
  onAddProductToWishlist: (wishlistId: string, productId: string) => void;
  onRemoveProductFromWishlist: (wishlistId: string, productId: string) => void;
  allProducts: Product[];
  user: { name: string; email: string } | null;
  onUpdateProfile: (name: string, email: string) => void;
  onOpenAuthModal?: () => void;
}

export default function UserDashboard({
  favorites,
  onRemoveFavorite,
  onProductSelect,
  searchHistory,
  compareHistory,
  onClearHistory,
  wishlists,
  onCreateWishlist,
  onDeleteWishlist,
  onAddProductToWishlist,
  onRemoveProductFromWishlist,
  allProducts,
  user,
  onUpdateProfile,
  onOpenAuthModal
}: UserDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'wishlists' | 'tasks' | 'history' | 'preferences' | 'profile'>('wishlists');
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('default');

  // New wishlist inputs
  const [newWishlistName, setNewWishlistName] = useState('');
  const [newWishlistDesc, setNewWishlistDesc] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // User profile edit inputs
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileBio, setProfileBio] = useState('');
  const [budgetGoal, setBudgetGoal] = useState<number>(75000);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Tasks & Price Alerts State
  const [tasks, setTasks] = useState<UserTaskOrAlert[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<'todo' | 'price_alert' | 'purchase_plan'>('todo');
  const [newTaskTargetPrice, setNewTaskTargetPrice] = useState<string>('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  // User profile preferences state
  const [preferredBrand, setPreferredBrand] = useState<string>('Flexible');
  const [targetCategory, setTargetCategory] = useState<string>('All');
  const [priorityFactor, setPriorityFactor] = useState<string>('Value for Money');
  const [isSaved, setIsSaved] = useState(false);

  // Load user-specific tasks and profile fields
  useEffect(() => {
    if (user?.email) {
      const userData = loadUserDataForEmail(user.email);
      setTasks(userData.tasks || []);
      setProfileName(userData.name || user.name);
      setProfileEmail(userData.email || user.email);
      setProfileBio(userData.bio || '');
      if (userData.budgetGoal) setBudgetGoal(userData.budgetGoal);
      if (userData.preferredBrands?.[0]) setPreferredBrand(userData.preferredBrands[0]);
      if (userData.preferredCategories?.[0]) setTargetCategory(userData.preferredCategories[0]);
    } else {
      const guestData = loadUserDataForEmail(null);
      setTasks(guestData.tasks || []);
    }
  }, [user?.email, user?.name]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.email) {
      saveUserDataForEmail(user.email, {
        preferredBrands: [preferredBrand],
        preferredCategories: [targetCategory],
        budgetGoal: budgetGoal
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName && profileEmail) {
      onUpdateProfile(profileName, profileEmail);
      if (user?.email) {
        saveUserDataForEmail(user.email, {
          name: profileName,
          email: profileEmail,
          bio: profileBio,
          budgetGoal: budgetGoal
        });
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handleCreateWishlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;
    onCreateWishlist(newWishlistName, newWishlistDesc);
    setNewWishlistName('');
    setNewWishlistDesc('');
    setShowCreateForm(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: UserTaskOrAlert = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      type: newTaskType,
      targetPrice: newTaskTargetPrice ? parseInt(newTaskTargetPrice) : undefined,
      status: 'active',
      createdAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveUserDataForEmail(user?.email, { tasks: updatedTasks });

    setNewTaskTitle('');
    setNewTaskTargetPrice('');
    setShowTaskForm(false);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'active' ? ('completed' as const) : ('active' as const) };
      }
      return t;
    });
    setTasks(updatedTasks);
    saveUserDataForEmail(user?.email, { tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    saveUserDataForEmail(user?.email, { tasks: updatedTasks });
  };

  // Find the selected wishlist object
  const activeWishlist = wishlists.find(w => w.id === selectedWishlistId) || wishlists[0] || { id: 'default', name: 'General Favorites', productIds: [] };

  // Resolve products in the currently active wishlist
  const wishlistProducts = allProducts.filter(p => activeWishlist.productIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in" id="user-dashboard-panel">
      
      {/* Upper Welcome banner */}
      <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative overflow-hidden shadow-sm dark:shadow-2xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-[#7C3AED]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-gradient-to-tr from-[#4F46E5]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#4F46E5]/30">
            {user ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user ? user.name : "Guest Shopper Session"}
              </h2>
              {user ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  Logged In Profile
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  Guest Scratchpad
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 mt-1">
              <UserCheck className="h-3.5 w-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
              <span>{user ? user.email : "Local temporary mode • Sign in to sync across devices"}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <div className="bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center min-w-[95px]">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Wishlists</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{wishlists.length}</span>
          </div>
          <div className="bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center min-w-[95px]">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Saved Items</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{favorites.length}</span>
          </div>
          <div className="bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center min-w-[95px]">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Active Tasks</span>
            <span className="text-xl font-black text-[#4F46E5] dark:text-[#818CF8]">
              {tasks.filter(t => t.status === 'active').length}
            </span>
          </div>
        </div>
      </div>

      {/* Guest Callout Prompt if logged out */}
      {!user && (
        <div className="bg-gradient-to-r from-[#4F46E5]/10 via-[#7C3AED]/10 to-[#F59E0B]/10 border border-[#4F46E5]/30 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Save Your Custom Profile & Hardware Records</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Create a free profile or sign in to permanently preserve wishlists, price alerts, and custom specs.</p>
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs font-black uppercase tracking-wider hover:opacity-95 cursor-pointer whitespace-nowrap shadow-md shadow-[#4F46E5]/20"
            >
              Sign In or Register
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Navigation tabs + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm h-fit space-y-1.5">
          {[
            { id: 'wishlists', label: 'My Wishlists', icon: Folder, badge: wishlists.length },
            { id: 'tasks', label: 'Tasks & Price Alerts', icon: CheckSquare, badge: tasks.filter(t => t.status === 'active').length },
            { id: 'history', label: 'Activity Logs', icon: History },
            { id: 'preferences', label: 'Buying Preferences', icon: Settings },
            { id: 'profile', label: 'Manage Profile', icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white border-transparent shadow-md shadow-[#4F46E5]/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#12182B] hover:text-slate-900 dark:hover:text-white border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Panel Frame */}
        <div className="lg:col-span-3">
          
          {/* 1. WISHLISTS SUB PANEL */}
          {activeSubTab === 'wishlists' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Folder className="h-5.5 w-5.5 text-[#4F46E5] dark:text-[#818CF8]" />
                    <span>My Wishlists & Collections</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Create categorized folders to organize tech gear for personal, professional, or gaming builds.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#4F46E5]/20"
                >
                  <Plus className="h-4 w-4 text-[#FBBF24]" />
                  <span>Create Wishlist</span>
                </button>
              </div>

              {/* Create Wishlist Form */}
              {showCreateForm && (
                <form onSubmit={handleCreateWishlistSubmit} className="bg-slate-50 dark:bg-[#0E1322] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-5 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Wishlist Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Next Laptop Setup"
                        value={newWishlistName}
                        onChange={(e) => setNewWishlistName(e.target.value)}
                        className="w-full bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Short Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Models for coding and video editing"
                        value={newWishlistDesc}
                        onChange={(e) => setNewWishlistDesc(e.target.value)}
                        className="w-full bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Initialize Folder
                    </button>
                  </div>
                </form>
              )}

              {/* Wishlists Selector Horizontal Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
                {wishlists.map((wl) => {
                  const isSelected = selectedWishlistId === wl.id;
                  return (
                    <button
                      key={wl.id}
                      onClick={() => setSelectedWishlistId(wl.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-2xl border whitespace-nowrap transition-all cursor-pointer text-xs font-black uppercase tracking-wider ${
                        isSelected
                          ? 'bg-[#4F46E5]/15 border-[#4F46E5] text-[#4F46E5] dark:text-white shadow-sm'
                          : 'bg-white dark:bg-[#0E1322] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#12182B]'
                      }`}
                    >
                      <Folder className={`h-4 w-4 ${isSelected ? 'text-[#4F46E5] dark:text-[#818CF8]' : 'text-slate-400'}`} />
                      <span>{wl.name}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black px-1.5 py-0.5 rounded text-[9px] ml-1">
                        {wl.productIds.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Wishlist Product Cards */}
              <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{activeWishlist.name}</h4>
                    {activeWishlist.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{activeWishlist.description}</p>
                    )}
                  </div>

                  {activeWishlist.id !== 'default' && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete the wishlist "${activeWishlist.name}"?`)) {
                          onDeleteWishlist(activeWishlist.id);
                          setSelectedWishlistId('default');
                        }
                      }}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Folder</span>
                    </button>
                  )}
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <Heart className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">No Items in this Wishlist</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Explore devices in the catalog or search and click the bookmark icon to populate this folder.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between group hover:border-[#4F46E5]/50 transition-all shadow-xs"
                      >
                        <div className="space-y-3">
                          <div className="h-32 w-full bg-white dark:bg-[#090D16] rounded-xl p-3 flex items-center justify-center relative overflow-hidden border border-slate-100 dark:border-slate-800">
                            <SafeProductImage
                              src={p.image}
                              alt={p.name}
                              category={p.category}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                            />
                            <button
                              onClick={() => onRemoveProductFromWishlist(activeWishlist.id, p.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 border border-rose-200 dark:border-rose-800 hover:scale-105 transition-all cursor-pointer"
                              title="Remove from Wishlist"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{p.brand}</span>
                            <h5 
                              onClick={() => onProductSelect(p)}
                              className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-2 hover:text-[#4F46E5] cursor-pointer transition-colors"
                            >
                              {p.name}
                            </h5>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="font-black text-sm text-slate-900 dark:text-white">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => onProductSelect(p)}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-[#4F46E5] hover:text-white text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. TASKS & PRICE ALERTS SUB PANEL */}
          {activeSubTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="h-5.5 w-5.5 text-[#4F46E5] dark:text-[#818CF8]" />
                    <span>Tasks, Goals & Price Alerts</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Record tech goals, planned upgrades, target price thresholds, and purchasing checklist items.
                  </p>
                </div>

                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#4F46E5]/20"
                >
                  <Plus className="h-4 w-4 text-[#FBBF24]" />
                  <span>Add Task / Alert</span>
                </button>
              </div>

              {/* Task Creation Form */}
              {showTaskForm && (
                <form onSubmit={handleAddTask} className="bg-slate-50 dark:bg-[#0E1322] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-5 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Task or Goal Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Save ₹20,000 for Dell XPS 15 or Compare noise cancellation"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Type</label>
                      <select
                        value={newTaskType}
                        onChange={(e) => setNewTaskType(e.target.value as any)}
                        className="w-full bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="todo">General Checklist Task</option>
                        <option value="price_alert">Target Price Alert</option>
                        <option value="purchase_plan">Hardware Purchase Plan</option>
                      </select>
                    </div>
                  </div>

                  {newTaskType === 'price_alert' && (
                    <div>
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Target Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 64999"
                        value={newTaskTargetPrice}
                        onChange={(e) => setNewTaskTargetPrice(e.target.value)}
                        className="w-full max-w-xs bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 focus:border-[#4F46E5] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Save to Profile Records
                    </button>
                  </div>
                </form>
              )}

              {/* Tasks List */}
              <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                {tasks.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <CheckSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">No active tasks recorded</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Add a price alert or checklist to track your tech shopping goals and benchmarks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map(task => {
                      const isCompleted = task.status === 'completed';
                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            isCompleted 
                              ? 'bg-slate-50 dark:bg-[#090D16]/60 border-slate-200 dark:border-slate-800/80 opacity-70' 
                              : 'bg-slate-50 dark:bg-[#12182B] border-slate-200 dark:border-slate-800 hover:border-[#4F46E5]/40 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <button
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'bg-white dark:bg-[#090D16] border-slate-300 dark:border-slate-700 text-transparent hover:text-emerald-500'
                              }`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-extrabold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                  {task.title}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {task.type.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-bold">
                                <span>Recorded: {task.createdAt}</span>
                                {task.targetPrice && (
                                  <span className="text-[#4F46E5] dark:text-[#818CF8] font-black">
                                    Target: ₹{task.targetPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. HISTORY LOGS SUB PANEL */}
          {activeSubTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="h-5.5 w-5.5 text-[#4F46E5] dark:text-[#818CF8]" />
                    <span>Search Queries & Comparison History</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Review past queries, compared hardware pairs, and diagnostic specs.
                  </p>
                </div>

                <button
                  onClick={onClearHistory}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All History</span>
                </button>
              </div>

              {/* Comparison runs history */}
              <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-400">Previous Side-by-Side Comparisons</h4>
                {compareHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No comparison sessions logged yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {compareHistory.map(log => (
                      <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-4 w-4 text-[#4F46E5] dark:text-[#818CF8]" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{log.names.join(" vs ")}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Search Queries */}
              <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-400">Recent Search Queries</h4>
                {searchHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No search queries recorded yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((q, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold">
                        "{q}"
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. BUYING PREFERENCES SUB PANEL */}
          {activeSubTab === 'preferences' && (
            <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="h-5.5 w-5.5 text-[#4F46E5] dark:text-[#818CF8]" />
                  <span>Buying Preferences & Budget Goals</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Customize the AI engine to calibrate recommendations according to your budget and favored tech ecosystem.
                </p>
              </div>

              {isSaved && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fade-in">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Preferences saved successfully to your profile records!</span>
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Preferred Ecosystem / Brand</label>
                    <select
                      value={preferredBrand}
                      onChange={(e) => setPreferredBrand(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    >
                      <option value="Flexible">Brand Agnostic (Best Value)</option>
                      <option value="Apple">Apple Ecosystem</option>
                      <option value="Samsung">Samsung Galaxy</option>
                      <option value="Sony">Sony Audio / Visual</option>
                      <option value="Dell / Lenovo">Dell & Lenovo Business</option>
                      <option value="ASUS ROG">ASUS ROG Gaming</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Primary Target Category</label>
                    <select
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    >
                      <option value="All">All Hardware Categories</option>
                      <option value="Laptops">Laptops & Ultrabooks</option>
                      <option value="Smartphones">Smartphones</option>
                      <option value="Headphones">Headphones & TWS</option>
                      <option value="Televisions">Televisions & Displays</option>
                      <option value="Smartwatches">Smartwatches</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">
                    Target Hardware Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={budgetGoal}
                    onChange={(e) => setBudgetGoal(parseInt(e.target.value) || 0)}
                    className="w-full max-w-md bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Current budget cap: ₹{budgetGoal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#4F46E5]/20 cursor-pointer"
                >
                  Save Hardware Preferences
                </button>
              </form>
            </div>
          )}

          {/* 5. PROFILE SUB PANEL */}
          {activeSubTab === 'profile' && (
            <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="h-5.5 w-5.5 text-[#4F46E5] dark:text-[#818CF8]" />
                  <span>Profile Information</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Update your identity details, consultation contact info, and profile bio.
                </p>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fade-in">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Bio / Notes</label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Short description of your tech interests or hardware usage..."
                    className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#4F46E5]/20 cursor-pointer"
                >
                  Save Profile Details
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
