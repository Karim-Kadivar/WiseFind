import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ShoppingBag, 
  Users, 
  ShieldCheck, 
  Settings, 
  Heart, 
  History, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ArrowRight, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Compass, 
  Check, 
  Clock, 
  DollarSign, 
  Star, 
  MessageSquare, 
  Send, 
  Database, 
  Activity, 
  FileText, 
  Download, 
  LogOut, 
  ShieldAlert, 
  Tag, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  Tv, 
  Layers, 
  CreditCard,
  Building2,
  Calendar,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  ChevronRight,
  CheckSquare,
  UserPlus,
  LogIn,
  Search,
  RefreshCw
} from 'lucide-react';
import { SafeProductImage } from './SafeProductImage.jsx';
import { PlatformLogo } from './PlatformLogo.jsx';
import { loadUserDataForEmail, saveUserDataForEmail } from '../utils/profileStorage.js';
import { getUserProfile, updateUserProfile, changeUserPassword, getRegisteredUsers, adminCreateAccount, adminDeleteAccount } from '../utils/authService.js';

export default function RoleProfileSection({
  currentRole = 'user',
  onRequestRoleSwitch,
  user,
  onLogout,
  onUpdateProfile,
  onOpenAuthModal,
  // Customer data props
  favorites = [],
  onRemoveFavorite,
  onProductSelect,
  onAddToCompare,
  compareList = [],
  searchHistory = [],
  compareHistory = [],
  onClearHistory,
  wishlists = [],
  onCreateWishlist,
  onDeleteWishlist,
  onRemoveProductFromWishlist,
  allProducts = [],
  // Admin & Guide props
  guides = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddGuide,
  onNavigateTab,
  initialSubTab,
  onAdminSignInUser
}) {
  // Active role config metadata
  const roleMeta = {
    user: {
      id: 'user',
      title: 'Customer (Shopper)',
      badge: 'Verified Shopper',
      icon: ShoppingBag,
      gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
      badgeColor: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
      summary: 'Tailored for smart buying decisions, multi-store price radar, personalized WiseLists, and unbiased spec benchmarks.'
    },
    expert: {
      id: 'expert',
      title: 'Category Advisor',
      badge: 'Certified Category Advisor',
      icon: Users,
      gradient: 'from-purple-600 via-violet-600 to-purple-800',
      badgeColor: 'bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400',
      summary: '100% Sponsor-Free tech advisor desk. Manage live buyer consultations, reply to hardware inquiries, and configure advisory fees.'
    },
    admin: {
      id: 'admin',
      title: 'Platform Administrator',
      badge: 'Tier-1 Super Admin',
      icon: ShieldCheck,
      gradient: 'from-indigo-600 via-purple-600 to-rose-600',
      badgeColor: 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400',
      summary: 'Platform command console. User account creation & sign-in, live product catalog CRUD, WiseGuide publishing, and telemetry.'
    }
  };

  const activeRoleData = roleMeta[currentRole] || roleMeta.user;
  const ActiveRoleIcon = activeRoleData.icon;

  // Active sub-tab state (role-dependent)
  const [activeSubTab, setActiveSubTab] = useState(() => {
    if (initialSubTab) return initialSubTab;
    if (currentRole === 'admin') return 'accounts';
    if (currentRole === 'expert') return 'inbox';
    return 'dna';
  });

  // Keep sub-tab aligned when currentRole or initialSubTab changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    } else {
      if (currentRole === 'admin') setActiveSubTab('accounts');
      else if (currentRole === 'expert') setActiveSubTab('inbox');
      else setActiveSubTab('dna');
    }
  }, [currentRole, initialSubTab]);

  // ==========================================
  // 1. CUSTOMER PROFILE STATES & LOGIC
  // ==========================================
  const [profileName, setProfileName] = useState(user?.name || 'Rohit Sharma');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState('+91 98201 44520');
  const [profileCity, setProfileCity] = useState('Bengaluru, Karnataka');
  const [profileBio, setProfileBio] = useState('Tech enthusiast seeking maximum value per rupee and zero marketing gimmicks.');
  const [budgetGoal, setBudgetGoal] = useState(75000);
  const [preferredBrand, setPreferredBrand] = useState('Apple');
  const [targetCategory, setTargetCategory] = useState('Smartphones');
  const [priorityFactor, setPriorityFactor] = useState('Value for Money');
  const [selectedBrands, setSelectedBrands] = useState(['Apple', 'Samsung', 'Sony', 'OnePlus']);
  const [profileSuccessNotice, setProfileSuccessNotice] = useState(null);

  // Wishlist creation state
  const [newWlName, setNewWlName] = useState('');
  const [newWlDesc, setNewWlDesc] = useState('');
  const [showCreateWl, setShowCreateWl] = useState(false);
  const [selectedWlId, setSelectedWlId] = useState('default');

  // Price Drop Radar alerts state
  const [priceAlerts, setPriceAlerts] = useState(() => {
    return [
      { id: 'pa-1', productName: 'Apple iPhone 18 Pro (256GB)', targetPrice: 125000, currentLowest: 133460, store: 'Flipkart', status: 'Tracking Live' },
      { id: 'pa-2', productName: 'Sony WH-1000XM5 ANC Headphones', targetPrice: 24990, currentLowest: 26990, store: 'Amazon', status: 'Price Dropped ₹2,000' },
      { id: 'pa-3', productName: 'MacBook Air M3 16GB', targetPrice: 105000, currentLowest: 114900, store: 'Croma', status: 'Tracking Live' }
    ];
  });
  const [newAlertName, setNewAlertName] = useState('');
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [showAlertForm, setShowAlertForm] = useState(false);

  // Password reset state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwNotice, setPwNotice] = useState(null);

  // Load persistent user data
  useEffect(() => {
    if (user?.email) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      const userData = loadUserDataForEmail(user.email);
      if (userData?.budgetGoal) setBudgetGoal(userData.budgetGoal);
      if (userData?.preferredBrands?.length) setSelectedBrands(userData.preferredBrands);
      if (userData?.preferredCategories?.[0]) setTargetCategory(userData.preferredCategories[0]);
    }
  }, [user]);

  const handleSaveCustomerProfile = (e) => {
    e.preventDefault();
    if (user?.email) {
      saveUserDataForEmail(user.email, {
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
        city: profileCity,
        bio: profileBio,
        budgetGoal,
        preferredBrands: selectedBrands,
        preferredCategory: targetCategory,
        priorityFactor
      });
      if (onUpdateProfile) onUpdateProfile(profileName, profileEmail);
    }
    setProfileSuccessNotice('Profile preferences & shopping DNA updated successfully!');
    setTimeout(() => setProfileSuccessNotice(null), 3000);
  };

  const handleToggleBrandTag = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleAddPriceAlert = (e) => {
    e.preventDefault();
    if (!newAlertName.trim() || !newAlertPrice) return;
    const alert = {
      id: `pa-${Date.now()}`,
      productName: newAlertName.trim(),
      targetPrice: Number(newAlertPrice),
      currentLowest: Math.round(Number(newAlertPrice) * 1.08),
      store: 'Amazon / Flipkart',
      status: 'Tracking Live'
    };
    setPriceAlerts(prev => [alert, ...prev]);
    setNewAlertName('');
    setNewAlertPrice('');
    setShowAlertForm(false);
  };

  const handleDeletePriceAlert = (id) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPwNotice({ type: 'error', text: 'New passwords do not match or cannot be empty.' });
      return;
    }
    setPwNotice({ type: 'success', text: 'Account password updated securely.' });
    setCurrPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwNotice(null), 3500);
  };

  // ==========================================
  // 2. CATEGORY ADVISOR (EXPERT) STATES & LOGIC
  // ==========================================
  const [advisorName, setAdvisorName] = useState(user?.name || 'Dr. Vikramaditya Sengupta');
  const [advisorTitle, setAdvisorTitle] = useState('Senior Systems Architect & Hardware Reviewer');
  const [advisorBio, setAdvisorBio] = useState('10+ years reviewing enterprise workstations, thermal dissipation, and high-fidelity DACs. Helping shoppers avoid marketing traps and uncompetitive silicon.');
  const [isAdvisorOnline, setIsAdvisorOnline] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(1499);
  const [chatRate, setChatRate] = useState(499);
  const [specialties, setSpecialties] = useState([
    'Coding Laptops & Linux',
    'MacBook M3 vs ThinkPad',
    'Audiophile ANC & DACs',
    'OLED vs Mini-LED Panels',
    'Silicon Thermal Throttling'
  ]);
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  const [advisorNotice, setAdvisorNotice] = useState(null);
  const [payoutUPI, setPayoutUPI] = useState('vikram.sengupta@okhdfcbank');

  // Customer Inquiries state
  const [advisorInquiries, setAdvisorInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('wisefind_advisor_requests');
      return saved ? JSON.parse(saved) : [
        {
          id: 'req-sample-1',
          customerName: 'Rohit Sharma',
          customerEmail: 'rohit.s@example.com',
          category: 'Electronics & Gadgets',
          productName: 'Samsung Galaxy S24 Ultra',
          message: 'Should I buy S24 Ultra now on Flipkart with Axis 5% cashback or wait for Diwali sale?',
          timestamp: '2 hours ago',
          status: 'pending',
          reply: null
        },
        {
          id: 'req-sample-2',
          customerName: 'Priya Mehra',
          customerEmail: 'priya.m@techcorp.in',
          category: 'Laptops',
          productName: 'MacBook Air M3 vs Dell XPS 13',
          message: 'Need a machine for intensive Docker and React Native development. Will 16GB Air M3 throttle?',
          timestamp: 'Yesterday',
          status: 'replied',
          reply: 'For Docker containers, 16GB unified memory is the bare minimum. Air M3 is fanless so under 30min builds it will throttle ~15%. Suggest 16GB Pro M3 or Dell XPS 16GB with active fans.'
        }
      ];
    } catch (e) {
      return [];
    }
  });
  const [replyDrafts, setReplyDrafts] = useState({});
  const [inquiryFilter, setInquiryFilter] = useState('all');

  const handleAddSpecialty = (e) => {
    e.preventDefault();
    if (!newSpecialtyInput.trim()) return;
    if (!specialties.includes(newSpecialtyInput.trim())) {
      setSpecialties(prev => [...prev, newSpecialtyInput.trim()]);
    }
    setNewSpecialtyInput('');
  };

  const handleRemoveSpecialty = (tag) => {
    setSpecialties(prev => prev.filter(t => t !== tag));
  };

  const handleSendAdvisorReply = (inquiryId) => {
    const replyText = replyDrafts[inquiryId]?.trim();
    if (!replyText) return;
    const updated = advisorInquiries.map(req => {
      if (req.id === inquiryId) {
        return { ...req, status: 'replied', reply: replyText };
      }
      return req;
    });
    setAdvisorInquiries(updated);
    try {
      localStorage.setItem('wisefind_advisor_requests', JSON.stringify(updated));
    } catch (e) {}
    // Sync reply to MongoDB collection
    try {
      fetch(`/api/inquiries/${encodeURIComponent(inquiryId)}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText, status: 'replied' })
      }).catch(err => console.warn('[MongoDB Sync] Inquiry reply queued:', err.message));
    } catch (e) {}
    setReplyDrafts(prev => ({ ...prev, [inquiryId]: '' }));
    setAdvisorNotice('Verified expert advice dispatched and recorded in MongoDB!');
    setTimeout(() => setAdvisorNotice(null), 3000);
  };

  // ==========================================
  // 3. PLATFORM ADMINISTRATOR STATES & LOGIC
  // ==========================================
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCatFilter, setAdminCatFilter] = useState('All');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [adminNotice, setAdminNotice] = useState(null);

  // Admin User Accounts Management State
  const [registeredAccounts, setRegisteredAccounts] = useState(() => getRegisteredUsers());
  const [accountSearch, setAccountSearch] = useState('');
  const [accountRoleFilter, setAccountRoleFilter] = useState('All');
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [newAccRole, setNewAccRole] = useState('user');
  const [newAccCategory, setNewAccCategory] = useState('Smartphones');
  const [accountFormNotice, setAccountFormNotice] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  const fetchDbStatus = () => {
    fetch('/api/db-status')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setDbStatus(data);
      })
      .catch(() => {});
  };

  const refreshAccounts = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users) && users.length > 0) {
          setRegisteredAccounts(users);
          fetchDbStatus();
          return;
        }
      }
    } catch (e) {}
    setRegisteredAccounts(getRegisteredUsers());
    fetchDbStatus();
  };

  useEffect(() => {
    refreshAccounts();
    fetchDbStatus();
    // Fetch live inquiries from MongoDB
    fetch('/api/inquiries')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAdvisorInquiries(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleAdminCreateAccount = async (e) => {
    e.preventDefault();
    setAccountFormNotice(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAccName,
          email: newAccEmail,
          password: newAccPassword,
          role: newAccRole,
          advisorCategory: newAccRole === 'expert' ? newAccCategory : undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        adminCreateAccount({
          name: newAccName,
          email: newAccEmail,
          password: newAccPassword,
          role: newAccRole,
          advisorCategory: newAccRole === 'expert' ? newAccCategory : undefined
        });
        setAccountFormNotice({ type: 'success', text: `Account for ${newAccName} provisioned in MongoDB successfully!` });
        setNewAccName('');
        setNewAccEmail('');
        setNewAccPassword('');
        refreshAccounts();
        setTimeout(() => setAccountFormNotice(null), 4000);
        return;
      } else {
        setAccountFormNotice({ type: 'error', text: data.error || 'Failed to provision account in MongoDB.' });
        return;
      }
    } catch (err) {
      const res = adminCreateAccount({
        name: newAccName,
        email: newAccEmail,
        password: newAccPassword,
        role: newAccRole,
        advisorCategory: newAccRole === 'expert' ? newAccCategory : undefined
      });
      if (res.success) {
        setAccountFormNotice({ type: 'success', text: res.message });
        setNewAccName('');
        setNewAccEmail('');
        setNewAccPassword('');
        refreshAccounts();
        setTimeout(() => setAccountFormNotice(null), 4000);
      } else {
        setAccountFormNotice({ type: 'error', text: res.error });
      }
    }
  };

  const handleAdminDeleteAccount = async (emailToDelete) => {
    if (user?.email && user.email.toLowerCase() === emailToDelete.toLowerCase()) {
      alert("You cannot delete the active account you are currently logged into!");
      return;
    }
    if (window.confirm(`Are you sure you want to delete account: ${emailToDelete}?`)) {
      try {
        await fetch(`/api/users/${encodeURIComponent(emailToDelete)}`, { method: 'DELETE' });
      } catch (e) {}
      adminDeleteAccount(emailToDelete);
      refreshAccounts();
      setAdminNotice(`Account ${emailToDelete} removed from MongoDB.`);
      setTimeout(() => setAdminNotice(null), 3000);
    }
  };

  const handleImpersonateUser = (targetAccount) => {
    if (onAdminSignInUser) {
      onAdminSignInUser(targetAccount);
    }
  };

  // New product form state
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState('Smartphones');
  const [pPrice, setPPrice] = useState('');
  const [pRating, setPRating] = useState('4.8');
  const [pScore, setPScore] = useState('92');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80');
  const [pDesc, setPDesc] = useState('');
  const [pSpecs, setPSpecs] = useState('Display: 6.7" OLED 120Hz, Processor: A18 Pro, Storage: 256GB NVMe, Battery: 4422mAh');
  const [pPros, setPPros] = useState('Best-in-class thermals, Class leading battery life, 7 years software updates');
  const [pCons, setPCons] = useState('Higher starting cost, 25W standard wired charging');
  const [pRec, setPRec] = useState('Uncompromised flagship option offering superior software support and sustained peak benchmarks.');
  const [pIsChoice, setPIsChoice] = useState(true);
  const [pIsTrending, setPIsTrending] = useState(false);

  // Guide creation form state
  const [gCategory, setGCategory] = useState('Smartphones');
  const [gTitle, setGTitle] = useState('');
  const [gDesc, setGDesc] = useState('');
  const [gAdvice, setGAdvice] = useState('');

  const handleAdminProductSubmit = async (e) => {
    e.preventDefault();
    if (!pName.trim() || !pPrice) return;
    const specObj = {};
    pSpecs.split(',').forEach(item => {
      const parts = item.split(':');
      if (parts.length === 2) {
        specObj[parts[0].trim()] = parts[1].trim();
      }
    });

    const newProd = {
      name: pName.trim(),
      brand: pBrand.trim() || 'Generic',
      category: pCategory,
      price: parseInt(pPrice) || 25000,
      rating: parseFloat(pRating) || 4.5,
      image: pImage,
      description: pDesc || 'Verified hardware build thoroughly reviewed by WiseFind.',
      specs: specObj,
      highlights: [pName + ' Verified benchmark configuration'],
      pros: pPros.split(',').map(i => i.trim()).filter(Boolean),
      cons: pCons.split(',').map(i => i.trim()).filter(Boolean),
      aiScore: parseInt(pScore) || 88,
      aiRecommendation: pRec,
      isEditorChoice: pIsChoice,
      isTrending: pIsTrending
    };

    if (onAddProduct) {
      await onAddProduct(newProd);
    }
    setAdminNotice(`Product "${pName}" successfully published to live catalog!`);
    setPName('');
    setPBrand('');
    setPPrice('');
    setTimeout(() => setAdminNotice(null), 3500);
  };

  const handleAdminGuideSubmit = async (e) => {
    e.preventDefault();
    if (!gTitle.trim() || !gDesc.trim()) return;
    const guideData = {
      id: `guide-${Date.now()}`,
      category: gCategory,
      title: gTitle.trim(),
      description: gDesc.trim(),
      tips: [gAdvice.trim() || 'Verify hardware specs before purchasing'],
      checklist: ['Check authentic retailer warranty', 'Confirm return window', 'Avoid marketing naming traps']
    };
    if (onAddGuide) {
      await onAddGuide(guideData);
    }
    setAdminNotice(`Buying guide "${gTitle}" published to WiseGuide library!`);
    setGTitle('');
    setGDesc('');
    setGAdvice('');
    setTimeout(() => setAdminNotice(null), 3500);
  };

  const handleExportSystemJson = () => {
    const systemDump = {
      exportedAt: new Date().toISOString(),
      role: 'admin',
      platform: 'WiseFind AI Shopping Assistant',
      totalProducts: allProducts.length,
      products: allProducts,
      guides: guides,
      advisorInquiries: advisorInquiries
    };
    const blob = new Blob([JSON.stringify(systemDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wisefind_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Active Wishlist reference
  const currentWishlist = wishlists.find(w => w.id === selectedWlId) || wishlists[0] || {
    id: 'default',
    name: 'General Favorites',
    description: 'Saved tech picks',
    productIds: favorites.map(f => f.id)
  };
  const wishlistProducts = allProducts.filter(p => currentWishlist.productIds?.includes(p.id)) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200" id="role-profile-section">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ============================================================ */}
        {/* 1. MASTER PROFILE HERO BANNER & ROLE SWITCHER                */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0D1224] border border-slate-200/90 dark:border-slate-800 shadow-xl transition-all">
          {/* Ambient role gradient aura */}
          <div className={`absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl ${activeRoleData.gradient} opacity-15 dark:opacity-20 blur-3xl pointer-events-none rounded-full`} />
          
          <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* User Identity & Role Badge */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${activeRoleData.gradient} p-0.5 shadow-lg shadow-indigo-500/20`}>
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0E1428] flex items-center justify-center text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                    {(user?.name || profileName || 'W').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-emerald-500 text-white shadow-md" title="Live Authenticated Profile">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {user?.name || profileName}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border flex items-center gap-1 ${activeRoleData.badgeColor}`}>
                    <ActiveRoleIcon className="w-3 h-3" />
                    <span>{activeRoleData.badge}</span>
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {user?.email || profileEmail} • <span className="text-emerald-500 font-bold">Active Workspace</span>
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-xl line-clamp-2">
                  {activeRoleData.summary}
                </p>
              </div>
            </div>

            {/* Active Role Portal Badge (Role Switcher Removed as per user requirement) */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shrink-0">
              <div className={`p-2.5 rounded-xl bg-gradient-to-r ${activeRoleData.gradient} text-white shadow-xs`}>
                <ActiveRoleIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Active Portal
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {activeRoleData.title}
                </span>
              </div>
            </div>
          </div>

          {/* Role Status Ticker */}
          <div className="px-6 sm:px-8 py-3 bg-slate-100/60 dark:bg-[#0A0E1C] border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Status: {currentRole === 'admin' ? 'Super Admin Mode Active' : currentRole === 'expert' ? 'Verified Advisor Desk Live' : 'Verified Smart Shopper Session'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                Role Permissions: {currentRole === 'admin' ? 'Account Governance, Catalog & Telemetry' : currentRole === 'expert' ? 'Client Consultations & Advice Desk' : 'Price Radar, WiseList, Specifications'}
              </span>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. DYNAMIC ROLE SUB-TAB NAVIGATION                           */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          
          {/* CUSTOMER TABS */}
          {currentRole === 'user' && (
            <>
              <button
                type="button"
                onClick={() => setActiveSubTab('dna')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'dna'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Shopping DNA & Preferences</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('wishlists')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'wishlists'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>WiseList ({wishlists.length || 1})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('radar')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'radar'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>Price Drop Radar ({priceAlerts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('history')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'history'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Shopping History & Activity</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('security')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'security'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Account Security</span>
              </button>
            </>
          )}

          {/* CATEGORY ADVISOR TABS */}
          {(currentRole === 'expert' || currentRole === 'advisor') && (
            <>
              <button
                type="button"
                onClick={() => setActiveSubTab('inbox')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'inbox'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Buyer Inquiries Desk ({advisorInquiries.filter(i => i.status === 'pending').length} New)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('credentials')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'credentials'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Advisor Persona & Specialties</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('availability')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'availability'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Consultation Rates & Hours</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('analytics')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'analytics'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Earnings & Advisory Impact</span>
              </button>
            </>
          )}

          {/* PLATFORM ADMIN TABS */}
          {currentRole === 'admin' && (
            <>
              <button
                type="button"
                onClick={() => setActiveSubTab('accounts')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'accounts'
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>User Accounts & Sign In ({registeredAccounts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('catalog')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'catalog'
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Product Catalog CRUD ({allProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('guides')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'guides'
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>WiseGuide Publishing Suite ({guides.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('telemetry')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeSubTab === 'telemetry'
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>System Telemetry & Scrapers</span>
              </button>
            </>
          )}

        </div>

        {/* ============================================================ */}
        {/* 3. ACTIVE SUB-TAB CONTENT RENDERER                           */}
        {/* ============================================================ */}
        <AnimatePresence mode="wait">

          {/* ------------------------------------------------------------ */}
          {/* CUSTOMER TAB 1: SHOPPING DNA & PREFERENCES                   */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'user' && activeSubTab === 'dna' && (
            <motion.div
              key="customer-dna"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Profile Details Form */}
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Personal Information & Shipping Address
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Used to calculate instant delivery schedules across Amazon Prime, Flipkart Minutes, and Croma Express.
                  </p>
                </div>

                {profileSuccessNotice && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{profileSuccessNotice}</span>
                  </div>
                )}

                <form onSubmit={handleSaveCustomerProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                        Phone / WhatsApp Updates
                      </label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                        Delivery City & Pincode
                      </label>
                      <input
                        type="text"
                        value={profileCity}
                        onChange={(e) => setProfileCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                      Buyer Bio / Hardware Philosophy
                    </label>
                    <textarea
                      rows={2}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Brand Preference Multi-select */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                      Trusted Brands (Smart recommendations prioritize these)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Apple', 'Samsung', 'Sony', 'OnePlus', 'Dell', 'Lenovo', 'Asus', 'HP', 'Nothing', 'Xiaomi', 'Nike', 'LG'].map((brand) => {
                        const isSelected = selectedBrands.includes(brand);
                        return (
                          <button
                            type="button"
                            key={brand}
                            onClick={() => handleToggleBrandTag(brand)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            <span>{brand}</span>
                            {isSelected && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Priority Factor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                        Primary Purchase Priority
                      </label>
                      <select
                        value={priorityFactor}
                        onChange={(e) => setPriorityFactor(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      >
                        <option value="Value for Money">Value for Money (WiseScore Optimized)</option>
                        <option value="Pure Performance">Pure Peak Performance</option>
                        <option value="Lowest Absolute Price">Lowest Absolute Price</option>
                        <option value="Battery Stamina">Battery & Thermal Stamina</option>
                        <option value="Brand Longevity">Longest Software Warranty</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                        Target Shopping Category
                      </label>
                      <select
                        value={targetCategory}
                        onChange={(e) => setTargetCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      >
                        <option value="Smartphones">Smartphones & Flagships</option>
                        <option value="Laptops">Laptops & Workstations</option>
                        <option value="Audio">Audio & ANC Headphones</option>
                        <option value="Smartwatches">Smartwatches & Wearables</option>
                        <option value="Tablets">Tablets & iPads</option>
                        <option value="Home Appliances">Home & Kitchen Appliances</option>
                        <option value="Fashion">Fashion & Apparel</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 cursor-pointer transition-all"
                  >
                    Save Shopping DNA Preferences
                  </button>
                </form>
              </div>

              {/* Budget Radar & Shopping Target Sidebar */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Monthly Tech Budget
                    </span>
                    <span className="text-xs font-bold text-indigo-500">
                      Target Ceiling
                    </span>
                  </div>

                  <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      ₹{budgetGoal.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      WiseBot will advise against recommendations exceeding this ceiling.
                    </p>
                  </div>

                  <input
                    type="range"
                    min="10000"
                    max="300000"
                    step="5000"
                    value={budgetGoal}
                    onChange={(e) => setBudgetGoal(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>₹10,000</span>
                    <span>₹1,50,000</span>
                    <span>₹3,00,000</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-700 dark:text-indigo-300">
                    💡 <strong>Smart Saving:</strong> By tracking prices across stores on WiseFind, you have saved an estimated <strong>₹12,450</strong> this quarter!
                  </div>
                </div>

                {/* Verified Platforms Linked */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Verified Stores Monitored
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'myntra', 'nykaa', 'brand'].map((platId) => (
                      <div key={platId} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <PlatformLogo platformId={platId} size="xs" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 capitalize">{platId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CUSTOMER TAB 2: WISELIST                                     */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'user' && activeSubTab === 'wishlists' && (
            <motion.div
              key="customer-wishlists"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* WiseList Header & Create Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Personalized WiseLists ({wishlists.length || 1})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Organize target purchases by projects, rooms, or seasonal sales into your WiseList.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateWl(prev => !prev)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New WiseList</span>
                  </button>
                </div>
              </div>

              {/* Create WiseList Form Modal/Inline */}
              {showCreateWl && (
                <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 space-y-4">
                  <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-300 uppercase">
                    New WiseList Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="e.g. Dream Coding Rig 2026"
                      value={newWlName}
                      onChange={(e) => setNewWlName(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Description (e.g. Dual 4K monitor and mechanical keyboard)"
                      value={newWlDesc}
                      onChange={(e) => setNewWlDesc(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateWl(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newWlName.trim()) return;
                        if (onCreateWishlist) onCreateWishlist(newWlName.trim(), newWlDesc.trim());
                        setNewWlName('');
                        setNewWlDesc('');
                        setShowCreateWl(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                    >
                      Confirm Creation
                    </button>
                  </div>
                </div>
              )}

              {/* Products in WiseList */}
              {wishlistProducts.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                  <Heart className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
                  <h4 className="text-base font-black text-slate-800 dark:text-slate-200">
                    No items in this WiseList yet
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Browse verified products in the catalog and click the bookmark or heart icon to organize your WiseList.
                  </p>
                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('browse')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase"
                    >
                      Explore Catalog
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 transition-all"
                    >
                      <div>
                        <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800 relative">
                          <SafeProductImage
                            src={prod.image}
                            alt={prod.name}
                            category={prod.category}
                            subCategory={prod.subCategory}
                          />
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-400">
                          {prod.brand} • {prod.category}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 mt-0.5 mb-2">
                          {prod.name}
                        </h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            ₹{prod.price?.toLocaleString('en-IN')}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-black">
                            WiseScore {prod.aiScore || 90}/100
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => onProductSelect ? onProductSelect(prod) : null}
                          className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          View Specs
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveFavorite ? onRemoveFavorite(prod) : null}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Remove from WiseList"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CUSTOMER TAB 3: PRICE DROP RADAR                             */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'user' && activeSubTab === 'radar' && (
            <motion.div
              key="customer-radar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-emerald-500" />
                    <span>Real-Time Price Radar ({priceAlerts.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    We ping Amazon, Flipkart, and Croma every 15 minutes. When target is reached, you get an instant WhatsApp / email alert.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAlertForm(prev => !prev)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Track New Price Ceiling</span>
                </button>
              </div>

              {showAlertForm && (
                <form onSubmit={handleAddPriceAlert} className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-4">
                  <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-300 uppercase">
                    Configure Product Price Trigger
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name (e.g. OnePlus 13 256GB)"
                      value={newAlertName}
                      onChange={(e) => setNewAlertName(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                    />
                    <input
                      type="number"
                      placeholder="Target Trigger Price in ₹ (e.g. 64999)"
                      value={newAlertPrice}
                      onChange={(e) => setNewAlertPrice(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAlertForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Activate Radar Tracking
                    </button>
                  </div>
                </form>
              )}

              {/* Price Alerts Table */}
              <div className="rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 dark:bg-slate-900/70 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-4 pl-6">Tracked Product</th>
                        <th className="p-4">Target Ceiling</th>
                        <th className="p-4">Current Lowest Store</th>
                        <th className="p-4">Radar Status</th>
                        <th className="p-4 text-right pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {priceAlerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white">
                            {alert.productName}
                          </td>
                          <td className="p-4 font-black text-indigo-500">
                            ₹{alert.targetPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-900 dark:text-white">
                              ₹{alert.currentLowest.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              via {alert.store}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              alert.status.includes('Dropped')
                                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                : 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                            }`}>
                              {alert.status}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <button
                              type="button"
                              onClick={() => handleDeletePriceAlert(alert.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Delete Price Alert"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CUSTOMER TAB 4: SHOPPING HISTORY & ACTIVITY                  */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'user' && activeSubTab === 'history' && (
            <motion.div
              key="customer-history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Recent Search Queries
                    </h3>
                    <p className="text-xs text-slate-400">
                      Jump right back to your previous spec searches.
                    </p>
                  </div>
                  {searchHistory.length > 0 && onClearHistory && (
                    <button
                      type="button"
                      onClick={onClearHistory}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      Clear All History
                    </button>
                  )}
                </div>

                {searchHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No search queries recorded yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((query, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        🔍 {query}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Compare History */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Recent Side-by-Side Comparison Boards
                </h3>
                {compareList.length > 0 ? (
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 block">
                        Active Comparison Board ({compareList.length} items)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {compareList.map(p => p.name).join(' vs ')}
                      </span>
                    </div>
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab('compare')}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                      >
                        Open Matrix
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No active comparison boards at the moment.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CUSTOMER TAB 5: ACCOUNT SECURITY                             */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'user' && activeSubTab === 'security' && (
            <motion.div
              key="customer-security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-6"
            >
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Security & Authentication Credentials
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Update your WiseFind master credentials or toggle 2-factor authentication.
                </p>
              </div>

              {pwNotice && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  pwNotice.type === 'error' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                }`}>
                  <AlertCircle className="w-4 h-4" />
                  <span>{pwNotice.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                    Current Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currPassword}
                    onChange={(e) => setCurrPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                    New Secure Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                    placeholder="Repeat new password"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-pw-toggle"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <label htmlFor="show-pw-toggle" className="text-xs font-bold text-slate-500 cursor-pointer">
                    Show Password characters
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-600/25"
                >
                  Update Account Password
                </button>
              </form>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CATEGORY ADVISOR TAB 1: BUYER INBOX                          */}
          {/* ------------------------------------------------------------ */}
          {(currentRole === 'expert' || currentRole === 'advisor') && activeSubTab === 'inbox' && (
            <motion.div
              key="advisor-inbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    <span>Buyer Inquiries & Q&A Desk</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live hardware dilemmas submitted by shoppers browsing the catalog. Provide 100% sponsor-free advice.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {['all', 'pending', 'replied'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setInquiryFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        inquiryFilter === f
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {advisorNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{advisorNotice}</span>
                </div>
              )}

              {/* Inquiries list */}
              <div className="space-y-4">
                {advisorInquiries
                  .filter(inq => inquiryFilter === 'all' || inq.status === inquiryFilter)
                  .map((inq) => (
                    <div
                      key={inq.id}
                      className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white text-sm">
                            {inq.customerName}
                          </span>
                          <span className="text-xs text-slate-400">({inq.customerEmail})</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase">
                            {inq.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{inq.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inq.status === 'replied' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        <strong>Dilemma regarding {inq.productName || 'product'}:</strong> "{inq.message}"
                      </div>

                      {inq.reply ? (
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-200">
                          <strong>Your Verified Advice:</strong> {inq.reply}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Write your unbiased advice to this shopper..."
                            value={replyDrafts[inq.id] || ''}
                            onChange={(e) => setReplyDrafts({ ...replyDrafts, [inq.id]: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendAdvisorReply(inq.id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Verified Advice</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CATEGORY ADVISOR TAB 2: CREDENTIALS & SPECIALTIES            */}
          {/* ------------------------------------------------------------ */}
          {(currentRole === 'expert' || currentRole === 'advisor') && activeSubTab === 'credentials' && (
            <motion.div
              key="advisor-credentials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-6 shadow-md"
            >
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Advisor Persona & Verification Credentials
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your public profile displayed on the Category Advisors page.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={advisorTitle}
                    onChange={(e) => setAdvisorTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                    Public Methodology Bio
                  </label>
                  <textarea
                    rows={3}
                    value={advisorBio}
                    onChange={(e) => setAdvisorBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    Verified Specialty Domains
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>{spec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(spec)}
                          className="hover:text-rose-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddSpecialty} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add specialty (e.g. Battery Calibration)"
                      value={newSpecialtyInput}
                      onChange={(e) => setNewSpecialtyInput(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Add Tag
                    </button>
                  </form>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                  <span className="font-black text-purple-400 block uppercase">
                    🛡️ WiseFind 100% Sponsor-Free Guarantee
                  </span>
                  <p className="text-slate-400">
                    Category Advisors are prohibited from accepting sponsored brand promotions, affiliate payout kickbacks, or privileged placements.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CATEGORY ADVISOR TAB 3: RATES & AVAILABILITY                 */}
          {/* ------------------------------------------------------------ */}
          {(currentRole === 'expert' || currentRole === 'advisor') && activeSubTab === 'availability' && (
            <motion.div
              key="advisor-availability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-6 shadow-md"
            >
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Consultation Rates & Schedule Controls
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set your client consultation rates and instant live availability.
                </p>
              </div>

              {/* Online toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-black text-sm text-slate-900 dark:text-white block">
                    Instant Live Consultation Status
                  </span>
                  <span className="text-xs text-slate-400">
                    When active, shoppers can book immediate video audits with you.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdvisorOnline(prev => !prev)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAdvisorOnline ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAdvisorOnline ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                  <span>{isAdvisorOnline ? 'Online (Accepting Calls)' : 'Offline (Busy)'}</span>
                </button>
              </div>

              {/* Rate configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-black uppercase text-slate-400 block">
                    1-on-1 Video Session Fee (₹)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white">₹</span>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full text-xl font-black bg-transparent border-b border-slate-300 dark:border-slate-700 pb-1"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">45-minute deep screen audit</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-black uppercase text-slate-400 block">
                    Quick Chat Advisory Fee (₹)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white">₹</span>
                    <input
                      type="number"
                      value={chatRate}
                      onChange={(e) => setChatRate(Number(e.target.value))}
                      className="w-full text-xl font-black bg-transparent border-b border-slate-300 dark:border-slate-700 pb-1"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Direct written dilemma recommendation</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* CATEGORY ADVISOR TAB 4: EARNINGS & IMPACT                    */}
          {/* ------------------------------------------------------------ */}
          {(currentRole === 'expert' || currentRole === 'advisor') && activeSubTab === 'analytics' && (
            <motion.div
              key="advisor-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Shoppers Advised</span>
                  <div className="text-3xl font-black text-purple-500">148+</div>
                  <span className="text-[10px] text-emerald-400 font-bold">↑ 24 this week</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Verified Satisfaction</span>
                  <div className="text-3xl font-black text-amber-400">4.95 ★</div>
                  <span className="text-[10px] text-slate-400 font-bold">Based on 142 client reviews</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Response Time</span>
                  <div className="text-3xl font-black text-blue-500">18 min</div>
                  <span className="text-[10px] text-emerald-400 font-bold">Top 5% fastest response</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Net Advisory Earnings</span>
                  <div className="text-3xl font-black text-emerald-400">₹42,850</div>
                  <span className="text-[10px] text-slate-400 font-bold">Automated weekly payout</span>
                </div>
              </div>

              {/* Payout Details */}
              <div className="max-w-xl p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">
                  Payout Destination (Direct UPI / NEFT)
                </h4>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    UPI Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={payoutUPI}
                    onChange={(e) => setPayoutUPI(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Payments are settled every Tuesday directly with zero commission fee deduction.
                </p>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* PLATFORM ADMIN TAB 1: USER ACCOUNTS & SIGN-IN (NEW)          */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'admin' && activeSubTab === 'accounts' && (
            <motion.div
              key="admin-accounts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* MongoDB Live Architecture Telemetry Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white">MongoDB Backend & Data Engine</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                          dbStatus?.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{dbStatus?.connected ? 'Live Connected' : 'Storage Engine Active'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Database: <code className="text-emerald-300 font-mono text-[11px] font-semibold">{dbStatus?.database || 'wisefind'}</code> • Official Node.js driver with automatic document persistence
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={refreshAccounts}
                    className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Refresh data from MongoDB"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Collections</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">products</span>
                    <span className="text-base font-black text-white">{dbStatus?.productsCount ?? 52} items</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">guides</span>
                    <span className="text-base font-black text-white">{dbStatus?.guidesCount ?? 12} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">users</span>
                    <span className="text-base font-black text-emerald-400">{dbStatus?.usersCount ?? registeredAccounts.length} accounts</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">inquiries</span>
                    <span className="text-base font-black text-purple-400">{dbStatus?.inquiriesCount ?? advisorInquiries.length} reqs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/20 border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">wiselists</span>
                    <span className="text-base font-black text-indigo-400">{dbStatus?.wiselistsCount ?? 2} active</span>
                  </div>
                </div>
              </div>

              {/* Account Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Accounts</span>
                    <Users className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    {registeredAccounts.length}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Platform registered identities</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Customers</span>
                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-black text-blue-500">
                    {registeredAccounts.filter(a => a.role === 'user' || !a.role).length}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Smart Shopper profiles</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Category Advisors</span>
                    <Star className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-3xl font-black text-purple-400">
                    {registeredAccounts.filter(a => a.role === 'expert' || a.role === 'advisor').length}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Verified tech advisors</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Super Admins</span>
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-3xl font-black text-rose-500">
                    {registeredAccounts.filter(a => a.role === 'admin').length}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Platform administrators</span>
                </div>
              </div>

              {/* Create Account Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-6 shadow-md">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-500" />
                    <span>Create & Provision New User Account</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct admin account registration. Create Customer, Advisor, or Administrator accounts with instantaneous credential activation.
                  </p>
                </div>

                {accountFormNotice && (
                  <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    accountFormNotice.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-500'
                  }`}>
                    {accountFormNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{accountFormNotice.text}</span>
                  </div>
                )}

                <form onSubmit={handleAdminCreateAccount} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ananya Patel"
                        value={newAccName}
                        onChange={(e) => setNewAccName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="ananya.patel@example.com"
                        value={newAccEmail}
                        onChange={(e) => setNewAccEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                        Password (Min 6 chars)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newAccPassword}
                        onChange={(e) => setNewAccPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                        Account Role & Permissions
                      </label>
                      <select
                        value={newAccRole}
                        onChange={(e) => setNewAccRole(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="user">Customer (Smart Shopper)</option>
                        <option value="expert">Category Advisor (Tech Expert)</option>
                        <option value="admin">Platform Administrator (Super Admin)</option>
                      </select>
                    </div>

                    {newAccRole === 'expert' ? (
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                          Advisor Category Specialty
                        </label>
                        <select
                          value={newAccCategory}
                          onChange={(e) => setNewAccCategory(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Smartphones & Flagships">Smartphones & Flagships</option>
                          <option value="Laptops & Workstations">Laptops & Workstations</option>
                          <option value="Audio & Headphones">Audio & Headphones</option>
                          <option value="Smartwatches & Wearables">Smartwatches & Wearables</option>
                          <option value="Home & Kitchen Appliances">Home & Kitchen Appliances</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-slate-400 pt-5">
                        <span>ℹ️ {newAccRole === 'admin' ? 'Administrator receives full catalog CRUD and user management privileges.' : 'Customer receives personalized WiseList, price radar, and comparison drawer.'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create & Register Account</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Registered Accounts Directory & Impersonation Hub */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>Registered User Directory ({registeredAccounts.length})</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click "Sign In as this User" to immediately impersonate and view the platform from their perspective.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter name or email..."
                        value={accountSearch}
                        onChange={(e) => setAccountSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <select
                      value={accountRoleFilter}
                      onChange={(e) => setAccountRoleFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Roles</option>
                      <option value="user">Customers</option>
                      <option value="expert">Advisors</option>
                      <option value="admin">Administrators</option>
                    </select>
                  </div>
                </div>

                {/* Users List Table */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
                  {registeredAccounts
                    .filter(acc => {
                      if (accountRoleFilter === 'All') return true;
                      if (accountRoleFilter === 'expert') return acc.role === 'expert' || acc.role === 'advisor';
                      return acc.role === accountRoleFilter;
                    })
                    .filter(acc => {
                      if (!accountSearch.trim()) return true;
                      const q = accountSearch.toLowerCase();
                      return (acc.name || '').toLowerCase().includes(q) || (acc.email || '').toLowerCase().includes(q);
                    })
                    .map((acc) => {
                      const isCurrentLoggedIn = user?.email && acc.email && user.email.toLowerCase() === acc.email.toLowerCase();
                      const roleNormalized = (acc.role === 'advisor' || acc.role === 'expert') ? 'expert' : (acc.role === 'admin' ? 'admin' : 'user');
                      const roleConfig = roleMeta[roleNormalized] || roleMeta.user;

                      return (
                        <div key={acc.email || acc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 px-2 rounded-2xl transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${roleConfig.gradient} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                              {(acc.name || acc.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                                  {acc.name || 'Anonymous User'}
                                </span>
                                {isCurrentLoggedIn && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/15 text-emerald-500">
                                    You (Current)
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 truncate block">
                                {acc.email}
                              </span>
                              {acc.advisorCategory && (
                                <span className="text-[10px] text-purple-400 font-semibold block">
                                  Focus: {acc.advisorCategory}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${roleConfig.badgeColor}`}>
                              {roleConfig.badge}
                            </span>

                            {/* Direct Impersonation / Sign In Action */}
                            <button
                              type="button"
                              onClick={() => handleImpersonateUser(acc)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                                isCurrentLoggedIn
                                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20'
                              }`}
                              title={`Sign in as ${acc.name} (${roleConfig.badge})`}
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>{isCurrentLoggedIn ? 'Active' : 'Sign In as User'}</span>
                            </button>

                            {/* Delete User Action */}
                            {!isCurrentLoggedIn && (
                              <button
                                type="button"
                                onClick={() => handleAdminDeleteAccount(acc.email)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                                title={`Delete account for ${acc.email}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* PLATFORM ADMIN TAB 2: PRODUCT CATALOG CRUD                   */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'admin' && activeSubTab === 'catalog' && (
            <motion.div
              key="admin-catalog"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Product Creator Form */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Publish New Product to Live Catalog
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Instantly inject products with multi-store pricing and WiseScore benchmarks.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-black">
                    Live Catalog: {allProducts.length} Items
                  </span>
                </div>

                {adminNotice && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{adminNotice}</span>
                  </div>
                )}

                <form onSubmit={handleAdminProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Product Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Google Pixel 9 Pro"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Brand</label>
                      <input
                        type="text"
                        placeholder="e.g. Google"
                        value={pBrand}
                        onChange={(e) => setPBrand(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Category</label>
                      <select
                        value={pCategory}
                        onChange={(e) => setPCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      >
                        <option value="Smartphones">Smartphones</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Audio">Audio</option>
                        <option value="Smartwatches">Smartwatches</option>
                        <option value="Tablets">Tablets</option>
                        <option value="Home Appliances">Home Appliances</option>
                        <option value="Fashion">Fashion</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        placeholder="89999"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">WiseScore (1-100)</label>
                      <input
                        type="number"
                        value={pScore}
                        onChange={(e) => setPScore(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Rating (1-5)</label>
                      <input
                        type="text"
                        value={pRating}
                        onChange={(e) => setPRating(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={pImage}
                        onChange={(e) => setPImage(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                      Specifications (Comma separated key:value)
                    </label>
                    <input
                      type="text"
                      value={pSpecs}
                      onChange={(e) => setPSpecs(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Strengths (Pros)</label>
                      <input
                        type="text"
                        value={pPros}
                        onChange={(e) => setPPros(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Drawbacks (Cons)</label>
                      <input
                        type="text"
                        value={pCons}
                        onChange={(e) => setPCons(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 cursor-pointer"
                  >
                    Publish to Catalog
                  </button>
                </form>
              </div>

              {/* Product Catalog Overview Table */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">
                    Live Registered Products ({allProducts.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Filter product by name..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                    />
                    <select
                      value={adminCatFilter}
                      onChange={(e) => setAdminCatFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                    >
                      <option value="All">All Categories</option>
                      <option value="Smartphones">Smartphones</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Audio">Audio</option>
                      <option value="Smartwatches">Smartwatches</option>
                    </select>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {allProducts
                    .filter(p => !adminSearch || p.name?.toLowerCase().includes(adminSearch.toLowerCase()))
                    .filter(p => adminCatFilter === 'All' || p.category === adminCatFilter)
                    .slice(0, 20)
                    .map((prod) => (
                      <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {prod.brand} • ₹{prod.price?.toLocaleString('en-IN')} • WiseScore: {prod.aiScore || 90}
                            </span>
                          </div>
                        </div>

                        {onDeleteProduct && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${prod.name}" from catalog?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* PLATFORM ADMIN TAB 2: WISEGUIDE PUBLISHING                   */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'admin' && activeSubTab === 'guides' && (
            <motion.div
              key="admin-guides"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Publish New Category Buying Guide
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Provides shoppers with verified advice, red flags to avoid, and hardware checklists.
                  </p>
                </div>

                <form onSubmit={handleAdminGuideSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Target Category</label>
                      <select
                        value={gCategory}
                        onChange={(e) => setGCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      >
                        <option value="Smartphones">Smartphones</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Audio">Audio</option>
                        <option value="Smartwatches">Smartwatches</option>
                        <option value="Home Appliances">Home Appliances</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Guide Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Flagship Smartphone Buying Guide 2026"
                        value={gTitle}
                        onChange={(e) => setGTitle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Guide Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview explaining what buyers need to know..."
                      value={gDesc}
                      onChange={(e) => setGDesc(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Key Advice / Anti-Trap Tip</label>
                    <input
                      type="text"
                      placeholder="e.g. Avoid buying 128GB flagships in 2026; 4K60 video demands minimum 256GB NVMe"
                      value={gAdvice}
                      onChange={(e) => setGAdvice(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider"
                  >
                    Publish Buying Guide
                  </button>
                </form>
              </div>

              {/* Existing Guides List */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">
                  Published WiseGuides ({guides.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guides.map((g) => (
                    <div key={g.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-indigo-400">{g.category}</span>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">{g.title}</h5>
                      <p className="text-xs text-slate-400 line-clamp-2">{g.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* PLATFORM ADMIN TAB 3: TELEMETRY & SCRAPERS                   */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'admin' && activeSubTab === 'telemetry' && (
            <motion.div
              key="admin-telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">MongoDB Telemetry</span>
                  <div className="text-xl font-black text-emerald-400">Memory Sync Mode</div>
                  <span className="text-[10px] text-slate-400 font-medium">Automatic file fallback persistent</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Gemini AI Client</span>
                  <div className="text-xl font-black text-indigo-400">Active Engine</div>
                  <span className="text-[10px] text-slate-400 font-medium">Auto-fallback AI responses active</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Cache Hit Rate</span>
                  <div className="text-xl font-black text-blue-400">98.4%</div>
                  <span className="text-[10px] text-emerald-400 font-bold">Fast 42ms response speed</span>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Active Scraper Threads</span>
                  <div className="text-xl font-black text-amber-400">8 Platforms</div>
                  <span className="text-[10px] text-slate-400 font-medium">Amazon, Flipkart, Croma, etc.</span>
                </div>
              </div>

              {/* Scrapers Health Matrix */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">
                  Multi-Retailer API Sync Engines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'amazon', name: 'Amazon India', status: 'Operational', ping: '24ms' },
                    { id: 'flipkart', name: 'Flipkart', status: 'Operational', ping: '31ms' },
                    { id: 'croma', name: 'Croma Tata', status: 'Operational', ping: '42ms' },
                    { id: 'reliance', name: 'Reliance Digital', status: 'Operational', ping: '38ms' },
                    { id: 'vijaysales', name: 'Vijay Sales', status: 'Operational', ping: '55ms' },
                    { id: 'myntra', name: 'Myntra Fashion', status: 'Operational', ping: '28ms' },
                    { id: 'nykaa', name: 'Nykaa Beauty', status: 'Operational', ping: '34ms' },
                    { id: 'meesho', name: 'Meesho Fashion', status: 'Operational', ping: '48ms' }
                  ].map((s) => (
                    <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlatformLogo platformId={s.id} size="xs" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">{s.name}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">{s.status}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{s.ping}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* PLATFORM ADMIN TAB 4: SECURITY & GOVERNANCE                  */}
          {/* ------------------------------------------------------------ */}
          {currentRole === 'admin' && activeSubTab === 'governance' && (
            <motion.div
              key="admin-governance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Security Clearance & Protocols</span>
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Clearance Level</span>
                      <span className="font-black text-rose-500">Tier-1 Super Admin</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Two-Factor Authentication</span>
                      <span className="font-bold text-emerald-400">Enforced & Active</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Active Encryption Cipher</span>
                      <span className="font-mono text-slate-300">AES-256-GCM (HMAC-SHA256)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400">Platform Maintenance Mode</span>
                      <button
                        type="button"
                        onClick={() => setIsMaintenanceMode(prev => !prev)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isMaintenanceMode ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isMaintenanceMode ? 'Active (Locked)' : 'Normal (Live)'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1324] border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>System Backup & Data Export</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Export a full snapshot of all products, guides, telemetry, and buyer inquiries as a JSON backup.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportSystemJson}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Snapshot</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
