import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, BuyingGuide, UserRole } from '../types';
import { 
  X, Heart, User, Settings, Sparkles, LogIn, UserPlus, 
  Trash2, ArrowRight, CheckCircle2, AlertCircle, Bookmark, Star, 
  BarChart2, ShieldCheck, History, Folder, Plus, Compass, Info, LogOut,
  ShoppingBag, Users
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, isFirebaseEnabled } from '../firebase';


interface Wishlist {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
}

interface TopUserBarProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  compareList: Product[];
  user: { name: string; email: string } | null;
  onUpdateProfile: (name: string, email: string) => void;
  onLoginSuccess: (user: { name: string; email: string }, role?: UserRole) => void;
  onLogout: () => void;
  activeSection: 'profile' | 'auth';
  setActiveSection: (sec: 'profile' | 'auth') => void;
  currentRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;

  // Integrated Dashboard Props
  searchHistory: string[];
  compareHistory: { id: string; names: string[]; timestamp: string }[];
  onClearHistory: () => void;
  wishlists: Wishlist[];
  onCreateWishlist: (name: string, description?: string) => void;
  onDeleteWishlist: (wishlistId: string) => void;
  onAddProductToWishlist: (wishlistId: string, productId: string) => void;
  onRemoveProductFromWishlist: (wishlistId: string, productId: string) => void;
  allProducts: Product[];
  
  // Integrated Admin Props
  guides: BuyingGuide[];
  onAddProduct: (product: any) => Promise<void>;
  onUpdateProduct: (id: string, product: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onAddGuide: (guide: any) => Promise<void>;
  
  // Quick Search trigger
  onRunSearchQuery?: (q: string) => void;
}

export default function TopUserBar({
  isOpen,
  onClose,
  onProductSelect,
  onAddToCompare,
  compareList,
  user,
  onUpdateProfile,
  onLoginSuccess,
  onLogout,
  activeSection,
  setActiveSection,
  currentRole = 'user',
  onSelectRole,

  // Integrated Dashboard
  searchHistory,
  compareHistory,
  onClearHistory,
  wishlists,
  onCreateWishlist,
  onDeleteWishlist,
  onAddProductToWishlist,
  onRemoveProductFromWishlist,
  allProducts,

  // Integrated Admin
  guides,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddGuide,
  onRunSearchQuery
}: TopUserBarProps) {
  // Sidebar sub-tab routing for authenticated state
  const [sidebarTab, setSidebarTab] = useState<'profile' | 'wishlists' | 'logs' | 'admin'>('profile');

  // Authenticating state (login vs signup)
  const [isSignUp, setIsSignUp] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>(currentRole || 'user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Profile forms
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // User preferences (brand, target category, priority)
  const [preferredBrand, setPreferredBrand] = useState<string>('Flexible');
  const [targetCategory, setTargetCategory] = useState<string>('All');
  const [priorityFactor, setPriorityFactor] = useState<string>('Value for Money');
  const [prefSuccess, setPrefSuccess] = useState(false);

  // New wishlist state
  const [showNewWishlistForm, setShowNewWishlistForm] = useState(false);
  const [newWlName, setNewWlName] = useState('');
  const [newWlDesc, setNewWlDesc] = useState('');
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('default');

  // New admin product form state
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState('Smartphones');
  const [pPrice, setPPrice] = useState('');
  const [pRating, setPRating] = useState('4.5');
  const [pScore, setPScore] = useState('85');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80');
  const [pDesc, setPDesc] = useState('');
  const [pSpecs, setPSpecs] = useState('Display: 6.7-inch Super Retina, Processor: A18 Pro, Storage: 256GB');
  const [pPros, setPPros] = useState('Beautiful OLED, Elite processor performance, Fantastic zoom');
  const [pCons, setPCons] = useState('Premium pricing model');
  const [pRecommendation, setPRecommendation] = useState('Strongly recommended for power users seeking premium longevity.');
  const [pIsChoice, setPIsChoice] = useState(false);
  const [pIsTrending, setPIsTrending] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);

  // Load state and sync on changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
    const savedBrand = localStorage.getItem('wisefind_pref_brand') || 'Flexible';
    const savedCat = localStorage.getItem('wisefind_pref_cat') || 'All';
    const savedFactor = localStorage.getItem('wisefind_pref_factor') || 'Value for Money';
    setPreferredBrand(savedBrand);
    setTargetCategory(savedCat);
    setPriorityFactor(savedFactor);
  }, [user]);

  // Handle local preference submission
  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('wisefind_pref_brand', preferredBrand);
    localStorage.setItem('wisefind_pref_cat', targetCategory);
    localStorage.setItem('wisefind_pref_factor', priorityFactor);
    setPrefSuccess(true);
    setTimeout(() => setPrefSuccess(false), 2500);
  };

  // Submit profile edit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName && profileEmail) {
      onUpdateProfile(profileName, profileEmail);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2500);
    }
  };

  // Create wishlist submission
  const handleCreateWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWlName.trim()) return;
    onCreateWishlist(newWlName.trim(), newWlDesc.trim());
    setNewWlName('');
    setNewWlDesc('');
    setShowNewWishlistForm(false);
  };

  // Quick Google Sign-In with Firebase
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsGoogleLoading(true);
    try {
      if (isFirebaseEnabled && auth) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const loggedUser = {
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || ''
        };
        setAuthSuccess(`Welcome, ${loggedUser.name}! Logging you in as ${authRole.toUpperCase()}...`);
        setTimeout(() => {
          onLoginSuccess(loggedUser, authRole);
          setActiveSection('profile');
          setSidebarTab('profile');
          setAuthSuccess(null);
        }, 1000);
      } else {
        handleQuickLogin('kadivarkarim21@gmail.com', 'Karim Kadivar', authRole);
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setAuthError(err?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Quick Login for testing / Karim Kadivar
  const handleQuickLogin = (emailStr: string, nameStr: string, roleToSet: UserRole = authRole) => {
    setAuthSuccess(`Welcome, ${nameStr}! Logging you in as ${roleToSet.toUpperCase()}...`);
    setTimeout(() => {
      onLoginSuccess({ name: nameStr, email: emailStr }, roleToSet);
      setActiveSection('profile');
      setSidebarTab('profile');
      setAuthSuccess(null);
    }, 1000);
  };

  // Submit login / signup form
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!email || !password || (isSignUp && !name)) {
      setAuthError('Please fill in all inputs.');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('wisefind_registered_users') || '[]');

    if (isSignUp) {
      const exists = registeredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setAuthError('An account with this email address already exists.');
        return;
      }
      const newUser = { name, email, password, role: authRole };
      registeredUsers.push(newUser);
      localStorage.setItem('wisefind_registered_users', JSON.stringify(registeredUsers));

      setAuthSuccess(`Account created successfully as ${authRole.toUpperCase()}!`);
      setTimeout(() => {
        onLoginSuccess({ name, email }, authRole);
        setActiveSection('profile');
        setSidebarTab('profile');
        setAuthSuccess(null);
        setName('');
        setEmail('');
        setPassword('');
      }, 1000);
    } else {
      const found = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      // Default credentials match
      if (!found && email.toLowerCase() === 'kadivarkarim21@gmail.com' && password === 'password') {
        handleQuickLogin('kadivarkarim21@gmail.com', 'Karim Kadivar', authRole);
        return;
      }

      if (!found) {
        setAuthError('Invalid credentials. Tip: use kadivarkarim21@gmail.com / password');
        return;
      }

      const roleForLogin = authRole || found.role || 'user';
      setAuthSuccess(`Welcome back, ${found.name}! Logging in as ${roleForLogin.toUpperCase()}...`);
      setTimeout(() => {
        onLoginSuccess({ name: found.name, email: found.email }, roleForLogin);
        setActiveSection('profile');
        setSidebarTab('profile');
        setAuthSuccess(null);
        setEmail('');
        setPassword('');
      }, 1000);
    }
  };

  // Handle Admin product submission
  const handleAdminProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice) return;

    // Spec strings to object
    const specObj: Record<string, string> = {};
    pSpecs.split(',').forEach(item => {
      const parts = item.split(':');
      if (parts.length === 2) {
        specObj[parts[0].trim()] = parts[1].trim();
      }
    });

    const newProductData = {
      name: pName,
      brand: pBrand || 'Custom',
      category: pCategory,
      price: parseInt(pPrice) || 25000,
      rating: parseFloat(pRating) || 4.5,
      image: pImage,
      description: pDesc || 'High performance tech asset.',
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
      setAdminSuccess(true);
      setTimeout(() => setAdminSuccess(false), 3000);
      
      // Reset
      setPName('');
      setPBrand('');
      setPPrice('');
      setPDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  // Find products in selected wishlist
  const activeWishlist = wishlists.find(w => w.id === selectedWishlistId) || wishlists[0] || { id: 'default', name: 'General Favorites', productIds: [] };
  const wishlistProducts = allProducts.filter(p => activeWishlist.productIds.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-md cursor-pointer"
            id="sidebar-backdrop-blur"
          />

          {/* Right Sliding Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[580px] bg-[#090d16] border-l border-slate-800/80 shadow-2xl z-50 flex flex-col text-slate-100"
            id="sidebar-profile-dashboard"
          >
            {/* Top Header Section */}
            <div className="p-5 border-b border-slate-800 bg-[#0f1524] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[#6A73E4]">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight text-white uppercase">
                    {user ? 'My Member Desk' : 'Authenticate Session'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {user ? `${user.name.split(' ')[0]} • Premium Account` : 'Unlock Custom Lists & Specification Engines'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors border border-slate-700/80 cursor-pointer"
                title="Minimize Drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Authenticated Desktop Navigation Tabs */}
            {user && (
              <div className="grid grid-cols-4 bg-[#0d1220] border-b border-slate-850 p-2 gap-1 flex-shrink-0">
                {[
                  { id: 'profile', label: 'Profile & Prefs', icon: Settings },
                  { id: 'wishlists', label: 'My Lists', icon: Folder },
                  { id: 'logs', label: 'Activity Logs', icon: History },
                  { id: 'admin', label: 'Admin Hub', icon: ShieldCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = sidebarTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSidebarTab(item.id as any)}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-[#6A73E4] border-[#6A73E4] text-white font-extrabold shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Content Body Area (Scrollable) */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* UNAUTHENTICATED: LOGIN & SIGNUP FORMS */}
              {!user && (
                <div className="space-y-6 max-w-md mx-auto py-4">
                  <div className="text-center space-y-2">
                    <Sparkles className="h-8 w-8 text-[#37D0C0] mx-auto animate-pulse" />
                    <h4 className="text-lg font-black text-white">{isSignUp ? 'Activate Free Membership' : 'Sign In To WiseFind'}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      Store private specification sheets, save comparison matrices, and log real-time AI searches.
                    </p>
                  </div>

                  {authError && (
                    <div className="bg-red-950/40 border border-red-500/20 rounded-xl p-3.5 text-red-400 text-xs font-semibold flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3.5 text-emerald-400 text-xs font-semibold flex items-start gap-2 animate-pulse">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                  </button>

                  <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-slate-800" />
                    <span className="px-2.5 text-[9px] font-black uppercase tracking-wider text-slate-500">Or with email</span>
                    <div className="flex-grow border-t border-slate-800" />
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {/* Role Choice */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Select Role Portal</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'user' as UserRole, label: 'Shopper', icon: '🛍️' },
                          { id: 'expert' as UserRole, label: 'Expert', icon: '🎓' },
                          { id: 'admin' as UserRole, label: 'Admin', icon: '🛡️' }
                        ].map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setAuthRole(r.id)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              authRole === r.id
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <span>{r.icon}</span>
                            <span>{r.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {isSignUp && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Display Name</label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Address</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Security Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-center mt-2"
                    >
                      {isSignUp ? `Register as ${authRole.toUpperCase()}` : `Login as ${authRole.toUpperCase()}`}
                    </button>
                  </form>

                  {/* Quick-test accounts widget */}
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Quick Sandbox Access</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickLogin('shopper@wisefind.in', 'Demo Shopper', 'user')}
                        className="bg-[#0f1524] hover:bg-indigo-950/40 text-[10px] font-bold text-indigo-300 p-2 rounded-lg border border-indigo-500/20 text-center transition-colors cursor-pointer"
                      >
                        🛍️ Shopper
                      </button>
                      <button
                        onClick={() => handleQuickLogin('expert@wisefind.in', 'Dr. Alex Verma', 'expert')}
                        className="bg-[#0f1524] hover:bg-purple-950/40 text-[10px] font-bold text-purple-300 p-2 rounded-lg border border-purple-500/20 text-center transition-colors cursor-pointer"
                      >
                        🎓 Expert
                      </button>
                      <button
                        onClick={() => handleQuickLogin('kadivarkarim21@gmail.com', 'Karim Kadivar', 'admin')}
                        className="bg-[#0f1524] hover:bg-indigo-950/40 text-[10px] font-bold text-indigo-300 p-2 rounded-lg border border-indigo-500/20 text-center transition-colors cursor-pointer"
                      >
                        🛡️ Admin
                      </button>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
                    >
                      {isSignUp ? 'Already registered? Sign In instead' : 'New to WiseFind? Create a Member Account'}
                    </button>
                  </div>
                </div>
              )}

              {/* AUTHENTICATED SECTION: TAB 1 (PROFILE & PREFERENCES) */}
              {user && sidebarTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* General Profile Form */}
                  <form onSubmit={handleProfileSubmit} className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#6A73E4] flex justify-between items-center">
                      <span>Basic Member Credentials</span>
                      {profileSuccess && (
                        <span className="text-emerald-400 font-semibold lowercase flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> updated!
                        </span>
                      )}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Display Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Account Email</label>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#6A73E4] hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Save Details
                      </button>
                    </div>
                  </form>

                  {/* Realtime Smart Buying Preferences */}
                  <form onSubmit={handlePreferencesSubmit} className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 sm:p-5 space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#37D0C0]">Buying Engine Filters</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">This adjusts your personal WiseBot AI recommendation biases.</p>
                      </div>
                      {prefSuccess && (
                        <span className="text-emerald-400 font-semibold text-[10px] uppercase flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Persisted!
                        </span>
                      )}
                    </div>

                    {/* Preferred Brand select */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Favored Brand Profile</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Flexible', 'Apple', 'Samsung', 'Lenovo', 'Sony', 'OnePlus'].map((brand) => (
                          <button
                            type="button"
                            key={brand}
                            onClick={() => setPreferredBrand(brand)}
                            className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              preferredBrand === brand
                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-black'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority Factor */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Buying Priority Anchor</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'Value for Money', desc: 'Price-to-perf ratio' },
                          { id: 'Maximum Specifications', desc: 'Raw power and memory' },
                          { id: 'Brand Prestige', desc: 'Ecosystem & Support' },
                          { id: 'Absolute Lowest Budget', desc: 'Maximize savings' }
                        ].map((factor) => (
                          <button
                            type="button"
                            key={factor.id}
                            onClick={() => setPriorityFactor(factor.id)}
                            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                              priorityFactor === factor.id
                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="font-extrabold text-[11px] block">{factor.id}</span>
                            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{factor.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                      <span className="text-[9px] text-slate-400 font-semibold">Saved in local browser cookies</span>
                      <button
                        type="submit"
                        className="bg-[#37D0C0] text-slate-950 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-all hover:brightness-110 cursor-pointer"
                      >
                        Apply Parameters
                      </button>
                    </div>
                  </form>

                  {/* Log out block */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log out from {user.name} session</span>
                    </button>
                  </div>

                </div>
              )}

              {/* AUTHENTICATED SECTION: TAB 2 (CUSTOM WISHLISTS & STASHES) */}
              {user && sidebarTab === 'wishlists' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Select active list */}
                  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#6A73E4]">Choose active list</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Separate research collections by project or intent.</p>
                      </div>
                      
                      <button
                        onClick={() => setShowNewWishlistForm(!showNewWishlistForm)}
                        className="flex items-center gap-1 bg-[#6A73E4]/15 hover:bg-[#6A73E4]/25 text-[#6A73E4] text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-[#6A73E4]/25 transition-all cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create List</span>
                      </button>
                    </div>

                    {showNewWishlistForm && (
                      <form onSubmit={handleCreateWishlist} className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-3.5 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">List Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Office laptop upgrade"
                            value={newWlName}
                            onChange={(e) => setNewWlName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Short Purpose Description</label>
                          <input
                            type="text"
                            placeholder="Targeting thin laptops with OLED below 80K"
                            value={newWlDesc}
                            onChange={(e) => setNewWlDesc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex justify-end gap-2 text-[10px] font-black uppercase tracking-wider">
                          <button
                            type="button"
                            onClick={() => setShowNewWishlistForm(false)}
                            className="text-slate-400 hover:text-white px-3 py-1.5"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-[#6A73E4] hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg"
                          >
                            Save List
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Wishlist list switches */}
                    <div className="space-y-1.5">
                      {wishlists.map((wl) => (
                        <div
                          key={wl.id}
                          className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                            selectedWishlistId === wl.id
                              ? 'bg-indigo-500/10 border-indigo-500/45 text-white'
                              : 'bg-slate-950 border-slate-850 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="cursor-pointer flex-grow" onClick={() => setSelectedWishlistId(wl.id)}>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs">{wl.name}</span>
                              <span className="bg-slate-900 text-slate-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-800">
                                {wl.productIds.length} items
                              </span>
                            </div>
                            {wl.description && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{wl.description}</p>}
                          </div>

                          {wl.id !== 'default' && (
                            <button
                              onClick={() => {
                                onDeleteWishlist(wl.id);
                                if (selectedWishlistId === wl.id) {
                                  setSelectedWishlistId('default');
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete custom list"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products listed inside selected list */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Items inside "{activeWishlist.name}"</h5>
                    
                    {wishlistProducts.length === 0 ? (
                      <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                        <Folder className="h-8 w-8 text-slate-500 mx-auto animate-pulse" />
                        <span className="text-xs font-extrabold text-slate-300 block">No items in this collection</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                          Browse our product directories and click on specifications to save items to your selected lists.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5">
                        {wishlistProducts.map((p) => (
                          <div
                            key={p.id}
                            className="bg-slate-900/60 border border-slate-850 hover:border-slate-800 rounded-xl p-3 flex justify-between items-center transition-all"
                          >
                            <div className="cursor-pointer" onClick={() => onProductSelect(p)}>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.brand}</span>
                                <span className="bg-[#6A73E4]/10 text-[#6A73E4] text-[9px] font-bold px-1 rounded">Score {p.aiScore}</span>
                              </div>
                              <h6 className="font-extrabold text-xs text-white truncate max-w-[280px] mt-0.5">{p.name}</h6>
                              <span className="text-[10px] font-black text-indigo-400 block mt-1">₹{p.price.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onProductSelect(p)}
                                className="text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
                              >
                                Specs
                              </button>
                              
                              <button
                                onClick={() => onRemoveProductFromWishlist(activeWishlist.id, p.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                title="Remove from list"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* AUTHENTICATED SECTION: TAB 3 (ACTIVITY HISTORY LOGS) */}
              {user && sidebarTab === 'logs' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Search history logs */}
                  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#37D0C0]">Search Logs</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Click any log item to re-query the recommendation engine.</p>
                      </div>
                      
                      {searchHistory.length > 0 && (
                        <button
                          onClick={onClearHistory}
                          className="text-[9px] text-red-400 hover:underline uppercase font-black tracking-wider cursor-pointer"
                        >
                          Clear Logs
                        </button>
                      )}
                    </div>

                    {searchHistory.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                        No previous searches found.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {searchHistory.map((queryText, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (onRunSearchQuery) {
                                onRunSearchQuery(queryText);
                                onClose();
                              }
                            }}
                            className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                          >
                            <Compass className="h-3.5 w-3.5 text-[#37D0C0]" />
                            <span className="truncate max-w-[200px]">{queryText}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Compare history logs */}
                  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 sm:p-5 space-y-3.5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#6A73E4]">Comparison Logs</h4>
                    
                    {compareHistory.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                        No comparison records found.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {compareHistory.map((log) => (
                          <div
                            key={log.id}
                            className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-1.5 hover:border-slate-800 transition-colors"
                          >
                            <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-wider">
                              <span>Matrix comparison</span>
                              <span>{log.timestamp}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {log.names.map((n, i) => (
                                <span key={i} className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  {n}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* AUTHENTICATED SECTION: TAB 4 (ADMIN HUB & SPEC BUILDER) */}
              {user && sidebarTab === 'admin' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Create product form */}
                  <form onSubmit={handleAdminProductSubmit} className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#6A73E4]">Spec Sheet Builder</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Integrate items directly into the WiseFind catalog.</p>
                      </div>
                      {adminSuccess && (
                        <span className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Added!
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Product Name</label>
                        <input
                          type="text"
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          placeholder="e.g. iPhone 16 Pro Max"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Brand</label>
                        <input
                          type="text"
                          value={pBrand}
                          onChange={(e) => setPBrand(e.target.value)}
                          placeholder="Apple"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Category</label>
                        <select
                          value={pCategory}
                          onChange={(e) => setPCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Smartphones">Smartphones</option>
                          <option value="Laptops">Laptops</option>
                          <option value="Tablets">Tablets</option>
                          <option value="Smartwatches">Smartwatches</option>
                          <option value="Headphones">Headphones</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Price in INR (₹)</label>
                        <input
                          type="number"
                          value={pPrice}
                          onChange={(e) => setPPrice(e.target.value)}
                          placeholder="144900"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Wise Score (0-100)</label>
                        <input
                          type="number"
                          value={pScore}
                          onChange={(e) => setPScore(e.target.value)}
                          placeholder="95"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">User Rating (0-5)</label>
                        <input
                          type="text"
                          value={pRating}
                          onChange={(e) => setPRating(e.target.value)}
                          placeholder="4.8"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Image URL</label>
                      <input
                        type="text"
                        value={pImage}
                        onChange={(e) => setPImage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Specifications (Comma Separated)</label>
                      <textarea
                        value={pSpecs}
                        onChange={(e) => setPSpecs(e.target.value)}
                        className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Short Description</label>
                      <input
                        type="text"
                        value={pDesc}
                        onChange={(e) => setPDesc(e.target.value)}
                        placeholder="Premium OLED panels with real-time refresh..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex gap-4 pt-1.5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                        <input
                          type="checkbox"
                          checked={pIsChoice}
                          onChange={(e) => setPIsChoice(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-0 h-4 w-4 bg-slate-950 border-slate-800"
                        />
                        <span>Editor's Choice Badge</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                        <input
                          type="checkbox"
                          checked={pIsTrending}
                          onChange={(e) => setPIsTrending(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-0 h-4 w-4 bg-slate-950 border-slate-800"
                        />
                        <span>Trending Badge</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#6A73E4] hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider py-2.5 rounded-xl transition-all shadow cursor-pointer text-center"
                    >
                      Publish to Active Database
                    </button>
                  </form>

                  {/* Active list with quick trash deletes */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Current Directory Inventory ({allProducts.length})</h5>
                    
                    <div className="max-h-72 overflow-y-auto space-y-2 border border-slate-800 rounded-2xl p-2.5 bg-slate-950">
                      {allProducts.map((p) => (
                        <div key={p.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-800 transition-colors">
                          <div className="truncate pr-4">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.brand}</span>
                            <span className="text-xs font-bold text-white block truncate max-w-[240px]">{p.name}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete permanently from master catalog"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
