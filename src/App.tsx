import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AISearchResults from './components/AISearchResults';
import ProductCatalog from './components/ProductCatalog';
import ProductDetails from './components/ProductDetails';
import ProductComparer from './components/ProductComparer';
import BuyingGuides from './components/BuyingGuides';
import WiseBotPanel from './components/WiseBotPanel';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { ExpertDashboard } from './components/ExpertDashboard';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import AuthModal from './components/AuthModal';
import TopUserBar from './components/TopUserBar';
import BookmarksView from './components/BookmarksView';
import RecommendedForYou from './components/RecommendedForYou';
import { PopularSearches } from './components/PopularSearches';
import { ExpertHub } from './components/ExpertHub';
import PlatformPriceComparator from './components/PlatformPriceComparator';
import { Product, BuyingGuide, RecommendationResult, UserRole } from './types';
import { ArrowRight, Bot, BookOpen, Star, Sparkles, Scale, Heart, ShieldCheck, CheckCircle2, ChevronDown, Award, Globe, ThumbsUp, Compass, ShieldAlert, Lock, UserCheck } from 'lucide-react';
import { TESTIMONIALS, FAQS } from './data/mockData';
import { isFirebaseEnabled, db, auth, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { loadUserDataForEmail, saveUserDataForEmail } from './utils/profileStorage';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // AI Recommendation engine states
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // User auth and role states
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('wisefind_user_role');
    return (saved === 'admin' || saved === 'expert' || saved === 'user') ? saved : 'user';
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem('wisefind_role_selected_ever');
  });

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('wisefind_user_role', role);
    localStorage.setItem('wisefind_role_selected_ever', 'true');
    setIsRoleModalOpen(false);

    // Smoothly redirect to their designated dashboard
    if (role === 'user') {
      setActiveTab('user_dashboard');
    } else if (role === 'expert') {
      setActiveTab('expert_dashboard');
    } else if (role === 'admin') {
      setActiveTab('admin_dashboard');
    }
  };

  // Top Utility Bar active states
  const [isTopBarOpen, setIsTopBarOpen] = useState(false);
  const [topBarActiveSection, setTopBarActiveSection] = useState<'bookmarks' | 'profile' | 'auth'>('bookmarks');

  // Wishlist manager state
  const [wishlists, setWishlists] = useState<{ id: string; name: string; description?: string; productIds: string[] }[]>([]);

  // Client states
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [compareHistory, setCompareHistory] = useState<{ id: string; names: string[]; timestamp: string }[]>([]);

  // FAQ Active State
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Preselected category state for Catalog
  const [preselectedCategory, setPreselectedCategory] = useState<string>('All');

  // Fetch products and guides from server on startup
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchGuides = async () => {
    try {
      const res = await fetch('/api/guides');
      if (res.ok) {
        const data = await res.json();
        setGuides(data);
      }
    } catch (err) {
      console.error("Error fetching guides", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchGuides();

    if (isFirebaseEnabled && auth && db) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const loggedUser = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
            email: firebaseUser.email || ""
          };
          setUser(loggedUser);
          
          try {
            const wlQuery = query(collection(db, 'wishlists'), where('userId', '==', firebaseUser.uid));
            const wlSnap = await getDocs(wlQuery);
            const loadedWishlists: any[] = [];
            wlSnap.forEach((doc) => loadedWishlists.push(doc.data()));
            
            if (loadedWishlists.length > 0) {
              setWishlists(loadedWishlists);
            } else {
              const defaultWl = {
                id: 'default',
                userId: firebaseUser.uid,
                name: 'General Favorites',
                description: 'Standard bookmarked items',
                productIds: []
              };
              await setDoc(doc(db, 'wishlists', 'default'), defaultWl);
              setWishlists([defaultWl]);
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, 'wishlists');
          }

          try {
            const chQuery = query(collection(db, 'compareHistory'), where('userId', '==', firebaseUser.uid));
            const chSnap = await getDocs(chQuery);
            const loadedCh: any[] = [];
            chSnap.forEach((doc) => loadedCh.push(doc.data()));
            setCompareHistory(loadedCh);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, 'compareHistory');
          }
        } else {
          setUser(null);
          setWishlists([
            { id: 'default', name: 'General Favorites', description: 'Standard bookmarked items', productIds: [] }
          ]);
          setCompareHistory([]);
        }
      });

      return () => unsubscribe();
    } else {
      const savedUser = localStorage.getItem('wisefind_logged_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          const userData = loadUserDataForEmail(parsed.email);
          setWishlists(userData.wishlists || [{ id: 'default', name: 'General Favorites', description: 'Standard bookmarked items', productIds: [] }]);
          setSearchHistory(userData.searchHistory || []);
          setCompareHistory(userData.compareHistory || []);
        } catch (e) {
          setUser(null);
          const guestData = loadUserDataForEmail(null);
          setWishlists(guestData.wishlists);
          setSearchHistory(guestData.searchHistory);
          setCompareHistory(guestData.compareHistory);
        }
      } else {
        // Logged out by default!
        setUser(null);
        const guestData = loadUserDataForEmail(null);
        setWishlists(guestData.wishlists);
        setSearchHistory(guestData.searchHistory);
        setCompareHistory(guestData.compareHistory);
      }
    }
  }, []);

  // Sync favorites state from wishlists list and active products catalog
  useEffect(() => {
    if (products.length > 0 && wishlists.length > 0) {
      const allFavIds = Array.from(new Set(wishlists.flatMap(w => w.productIds)));
      const matched = products.filter(p => allFavIds.includes(p.id));
      setFavorites(matched);
      localStorage.setItem('wisefind_fav_ids', JSON.stringify(allFavIds));
    }
  }, [wishlists, products]);

  // Deep-linking helper for shared product links
  useEffect(() => {
    if (products && products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const deepLinkProdId = params.get('product') || window.location.hash.replace('#', '');
      if (deepLinkProdId) {
        const foundProduct = products.find(p => p.id === deepLinkProdId);
        if (foundProduct) {
          setSelectedProduct(foundProduct);
        }
      }
    }
  }, [products]);

  // Wishlists manipulation helpers
  const handleToggleFavorite = (product: Product) => {
    setWishlists(prev => {
      const updated = prev.map(wl => {
        if (wl.id === 'default') {
          const exists = wl.productIds.includes(product.id);
          return {
            ...wl,
            productIds: exists 
              ? wl.productIds.filter(id => id !== product.id)
              : [...wl.productIds, product.id]
          };
        }
        return wl;
      });
      localStorage.setItem('wisefind_wishlists', JSON.stringify(updated));
      saveUserDataForEmail(user?.email, { wishlists: updated });
      return updated;
    });
  };

  const handleCreateWishlist = (name: string, description?: string) => {
    const newWl = {
      id: `wl-${Date.now()}`,
      name,
      description,
      productIds: []
    };
    setWishlists(prev => {
      const updated = [...prev, newWl];
      localStorage.setItem('wisefind_wishlists', JSON.stringify(updated));
      saveUserDataForEmail(user?.email, { wishlists: updated });
      return updated;
    });
  };

  const handleDeleteWishlist = (wishlistId: string) => {
    setWishlists(prev => {
      const updated = prev.filter(w => w.id !== wishlistId);
      localStorage.setItem('wisefind_wishlists', JSON.stringify(updated));
      saveUserDataForEmail(user?.email, { wishlists: updated });
      return updated;
    });
  };

  const handleAddProductToWishlist = (wishlistId: string, productId: string) => {
    setWishlists(prev => {
      const updated = prev.map(wl => {
        if (wl.id === wishlistId) {
          if (!wl.productIds.includes(productId)) {
            return { ...wl, productIds: [...wl.productIds, productId] };
          }
        }
        return wl;
      });
      localStorage.setItem('wisefind_wishlists', JSON.stringify(updated));
      saveUserDataForEmail(user?.email, { wishlists: updated });
      return updated;
    });
  };

  const handleRemoveProductFromWishlist = (wishlistId: string, productId: string) => {
    setWishlists(prev => {
      const updated = prev.map(wl => {
        if (wl.id === wishlistId) {
          return { ...wl, productIds: wl.productIds.filter(id => id !== productId) };
        }
        return wl;
      });
      localStorage.setItem('wisefind_wishlists', JSON.stringify(updated));
      saveUserDataForEmail(user?.email, { wishlists: updated });
      return updated;
    });
  };

  const handleUpdateProfile = (name: string, email: string) => {
    const updatedUser = { name, email };
    setUser(updatedUser);
    localStorage.setItem('wisefind_logged_user', JSON.stringify(updatedUser));
    saveUserDataForEmail(email, { name, email });
  };

  const handleAddExternalRecommendationToWishlist = (productName: string, brand: string, priceEstimate: string) => {
    // Generate a temporary item to represent bookmarking AI advice
    const mockFav: Product = {
      id: `fav-rec-${Date.now()}`,
      name: productName,
      brand: brand,
      category: "Saved recommendations",
      price: parseInt(priceEstimate.replace(/[^0-9]/g, '')) || 45000,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
      specs: { "Price Estimate": priceEstimate },
      description: "Custom bookmarked recommendation advice directly compiled by WiseFind AI.",
      highlights: ["AI Custom match recommendation"],
      pros: ["Perfect fit", "Realtime priced"],
      cons: [],
      aiScore: 95,
      aiRecommendation: "Excellent custom match recommendation based on your queries."
    };

    // Stash the product locally so other components don't crash
    setProducts(prev => {
      if (!prev.some(p => p.id === mockFav.id)) {
        return [mockFav, ...prev];
      }
      return prev;
    });

    handleAddProductToWishlist('default', mockFav.id);
  };

  // Comparison Matrix helpers
  const handleAddToCompare = (product: Product) => {
    if (compareList.some(item => item.id === product.id)) {
      // Remove it if clicked again
      setCompareList(prev => prev.filter(item => item.id !== product.id));
      return;
    }
    if (compareList.length >= 4) {
      alert("You can compare up to 4 products simultaneously.");
      return;
    }
    const updated = [...compareList, product];
    setCompareList(updated);

    // Save to comparison history log
    if (updated.length >= 2) {
      const names = updated.map(item => item.name);
      const newLog = {
        id: `log-${Date.now()}`,
        names: names,
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updatedHistory = [newLog, ...compareHistory].slice(0, 10);
      setCompareHistory(updatedHistory);
      localStorage.setItem('wisefind_compare_history', JSON.stringify(updatedHistory));
      saveUserDataForEmail(user?.email, { compareHistory: updatedHistory });
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  // AI query recommendation execution
  const handleSearchRecommendation = async (query: string) => {
    setActiveSearchQuery(query);
    setIsLoadingRecommendation(true);
    setRecommendationResult(null);

    // Save to search log
    const updatedSearchLogs = [query, ...searchHistory.filter(q => q !== query)].slice(0, 15);
    setSearchHistory(updatedSearchLogs);
    localStorage.setItem('wisefind_search_history', JSON.stringify(updatedSearchLogs));
    saveUserDataForEmail(user?.email, { searchHistory: updatedSearchLogs });

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendationResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  // Login click simulation
  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    if (isFirebaseEnabled && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Error during Firebase signOut:", err);
      }
    }
    setUser(null);
    localStorage.removeItem('wisefind_logged_user');
    
    // Reset back to clean guest state
    const guestData = loadUserDataForEmail(null);
    setWishlists(guestData.wishlists);
    setSearchHistory(guestData.searchHistory);
    setCompareHistory(guestData.compareHistory);
  };

  // Central Login Success handler that loads profile records
  const handleLoginSuccess = (authUser: { name: string; email: string }, role?: UserRole) => {
    setUser(authUser);
    localStorage.setItem('wisefind_logged_user', JSON.stringify(authUser));

    // Load this specific user profile's data records
    const userData = loadUserDataForEmail(authUser.email);
    if (userData.wishlists && userData.wishlists.length > 0) {
      setWishlists(userData.wishlists);
    } else {
      setWishlists([{ id: 'default', name: 'My Tech Wishlist', description: 'Primary tracking list', productIds: [] }]);
    }
    if (userData.searchHistory) {
      setSearchHistory(userData.searchHistory);
    }
    if (userData.compareHistory) {
      setCompareHistory(userData.compareHistory);
    }

    const targetRole = role || userData.role || currentRole;
    handleSelectRole(targetRole);
  };

  // Admin database actions
  const handleAddProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProduct = async (id: string, productData: any) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddGuide = async (guideData: any) => {
    try {
      const res = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guideData)
      });
      if (res.ok) {
        await fetchGuides();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050505] text-[#111827] dark:text-[#F8FAFC] flex flex-col justify-between transition-colors duration-200" id="app-root-frame">
      {/* Dynamic Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Auto scroll to top on tab swap
          window.scrollTo(0, 0);
        }}
        user={user}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
        compareCount={compareList.length}
        onToggleTopBar={(section) => {
          if (isTopBarOpen && topBarActiveSection === section) {
            setIsTopBarOpen(false);
          } else {
            setTopBarActiveSection(section);
            setIsTopBarOpen(true);
          }
        }}
        isTopBarOpen={isTopBarOpen}
        favoritesCount={favorites.length}
        currentRole={currentRole}
        onOpenRoleSelector={() => setIsRoleModalOpen(true)}
      />

      {/* Top Utility sliding Bar */}
      <TopUserBar
        isOpen={isTopBarOpen}
        onClose={() => setIsTopBarOpen(false)}
        onProductSelect={(p) => setSelectedProduct(p)}
        onAddToCompare={handleAddToCompare}
        compareList={compareList}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onLoginSuccess={(authUser, role) => handleLoginSuccess(authUser, role)}
        onLogout={handleLogout}
        activeSection={topBarActiveSection}
        setActiveSection={setTopBarActiveSection}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}

        // Integrated Dashboard props
        searchHistory={searchHistory}
        compareHistory={compareHistory}
        onClearHistory={() => {
          setSearchHistory([]);
          setCompareHistory([]);
          localStorage.removeItem('wisefind_search_history');
          localStorage.removeItem('wisefind_compare_history');
        }}
        wishlists={wishlists}
        onCreateWishlist={handleCreateWishlist}
        onDeleteWishlist={handleDeleteWishlist}
        onAddProductToWishlist={handleAddProductToWishlist}
        onRemoveProductFromWishlist={handleRemoveProductFromWishlist}
        allProducts={products}

        // Integrated Admin props
        guides={guides}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddGuide={handleAddGuide}
        onRunSearchQuery={handleSearchRecommendation}
      />

      {/* Main Body Routing Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-0"
            >
            {/* Hero search widget */}
            <Hero onSearch={handleSearchRecommendation} isLoading={isLoadingRecommendation} />

            {/* AI Recommendation Panel section */}
            {isLoadingRecommendation && (
              <div className="bg-slate-50 dark:bg-slate-900/80 py-16 text-center border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Querying Buying Intelligence Engine...</h3>
                  <p className="text-slate-400 text-xs leading-relaxed px-4">
                    WiseFind is searching Google databases, scanning hundreds of consumer specification matrices, and constructing custom match parameters in Indian Rupees (₹).
                  </p>
                </div>
              </div>
            )}

            {recommendationResult && !isLoadingRecommendation && (
              <AISearchResults
                result={recommendationResult}
                onSaveToFavorites={handleAddExternalRecommendationToWishlist}
                onAddToCompare={handleAddToCompare}
                allProducts={products}
                onProductClick={(prod) => {
                  setSelectedProduct(prod);
                }}
              />
            )}

            {/* Recommended For You Section based on Search History */}
            <RecommendedForYou
              searchHistory={searchHistory}
              allProducts={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCompare={handleAddToCompare}
              favorites={favorites.map(f => f.id)}
              onToggleFavorite={handleToggleFavorite}
              onSearchQuery={handleSearchRecommendation}
              onExploreAll={() => {
                setPreselectedCategory('All');
                setActiveTab('browse');
              }}
            />

            {/* "How It Works" section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800" id="how-it-works">
              <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>Platform Architecture</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Decide with Absolute Confidence</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 font-medium max-w-lg mx-auto">An objective three-tier telemetry pipeline that values benchmark specifications above sales margins.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Visual horizontal separator lines for desktop */}
                <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-amber-500/20 -z-10" />

                {[
                  {
                    step: "01",
                    title: "Natural Query Input",
                    description: "Describe your custom budget, workflows, brand constraints, and priority features in plain English, technical specs, or Indian Rupees (₹).",
                    badgeColor: "bg-indigo-50 dark:bg-indigo-950/80 text-[#4F46E5] dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
                    hoverGlow: "hover:border-[#4F46E5]/40 hover:shadow-indigo-500/10"
                  },
                  {
                    step: "02",
                    title: "Grounded Specs Harvest",
                    description: "Our system queries search layers in real-time, matching technical manuals, pricing tables, benchmark scores, and independent consumer sentiment.",
                    badgeColor: "bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800",
                    hoverGlow: "hover:border-purple-400 hover:shadow-purple-500/10"
                  },
                  {
                    step: "03",
                    title: "Unbiased Score Matrix",
                    description: "Receive complete structural match quotients, unbiased pros/cons, key specifications, and live store availability without manufacturer bias.",
                    badgeColor: "bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                    hoverGlow: "hover:border-amber-400 hover:shadow-amber-500/10"
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`bg-white dark:bg-[#12182B] border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs ${item.hoverGlow} transition-all duration-200 relative overflow-hidden flex flex-col justify-between`}
                  >
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <span className={`h-10 w-10 rounded-xl border flex items-center justify-center font-black text-xs ${item.badgeColor}`}>
                          {item.step}
                        </span>
                        <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">TIER {idx + 1}</span>
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white text-base">{item.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Category Showcase Panel */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800" id="category-showcase">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                  <span className="text-[10px] font-black text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-2.5 inline-block">
                    Segment Directories
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Browse Core Directories</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Select a specialized segment below to browse active specification sheets, pricing levels, and scores.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setPreselectedCategory('All');
                    setActiveTab('browse');
                  }}
                  className="text-xs font-black text-[#4F46E5] dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-200"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {[
                  { name: 'Smartphones', icon: '📱', desc: 'Titanium, LTPO, Zoom Cameras', badge: "Hot" },
                  { name: 'Laptops', icon: '💻', desc: 'ARM, OLED, Intel Core Ultra', badge: "Popular" },
                  { name: 'Tablets', icon: '✏️', desc: 'Liquid Retina, Stylus support' },
                  { name: 'Smartwatches', icon: '⌚', desc: 'ECG, Always-on AMOLED' },
                  { name: 'Headphones', icon: '🎧', desc: 'ANC, High-fidelity LDAC' },
                  { name: 'Earbuds', icon: '🎵', desc: 'Adaptive ANC, Spatial Audio', badge: "New" },
                  { name: 'Handheld Consoles', icon: '🎮', desc: 'SteamOS, OLED, 120Hz' },
                  { name: 'Cameras', icon: '📷', desc: 'Full Frame, 4K120 Creators' },
                  { name: 'Smart Projectors', icon: '📽️', desc: 'Dolby Vision, Laser 4K' },
                  { name: 'Mechanical Keyboards', icon: '⌨️', desc: 'Hot-swappable, CNC aluminum', badge: "Elite" },
                ].map((cat, idx) => (
                  <motion.div
                    key={cat.name}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPreselectedCategory(cat.name);
                      setActiveTab('browse');
                    }}
                    className="bg-white dark:bg-[#12182B] border border-slate-200/90 dark:border-slate-800 hover:border-[#4F46E5] dark:hover:border-indigo-500 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    {cat.badge && (
                      <span className="absolute top-2.5 right-2.5 text-[8px] font-black uppercase tracking-wider text-[#4F46E5] dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800 px-1.5 py-0.5 rounded-md">
                        {cat.badge}
                      </span>
                    )}
                    <div>
                      <span className="text-2xl sm:text-3xl block mb-2 group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                      <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">{cat.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-1 line-clamp-1">{cat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Popular Searches Trend Dashboard Visualizer using Recharts */}
            <PopularSearches
              onCategorySelect={(cat) => {
                setPreselectedCategory(cat);
                setActiveTab('browse');
              }}
            />

            {/* WiseBot preview prompt chip and testimonials */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-b border-slate-200/50 dark:border-slate-800" id="testimonials">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                <div className="space-y-5">
                  <span className="text-[10px] font-black text-[#6A73E4] dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/50 dark:border-indigo-800 px-3 py-1 rounded-full uppercase tracking-widest">
                    WiseBot AI Co-Pilot
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Your Unbiased Shopping Companion</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    WiseBot is deeply integrated into specifications databases. It contrasts multiple options side-by-side, decodes technical jargon instantly, and protects you from buying over-hyped hardware.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab('wisebot')}
                    className="bg-slate-900 dark:bg-[#7C3AED] hover:bg-black dark:hover:bg-[#6D28D9] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Bot className="h-4 w-4 text-accent animate-pulse" />
                    <span>Initiate Chat Session</span>
                  </motion.button>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {TESTIMONIALS.map((t, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          "{t.text}"
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <img src={t.avatar} className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0" alt={t.name} />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs truncate">{t.name}</h4>
                          <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider truncate">{t.role}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Platform statistics & credibility */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 border-b border-slate-200/50 dark:border-slate-800 text-center" id="stats">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-primary tracking-tight block">24,800+</span>
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider">Decisions Guided</span>
                  <p className="text-[10px] text-slate-400 font-semibold max-w-[150px] mx-auto">Objective matching recommendations formulated</p>
                </div>
                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-primary tracking-tight block">98.4%</span>
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider">User Happiness</span>
                  <p className="text-[10px] text-slate-400 font-semibold max-w-[150px] mx-auto">Users finding their perfect hardware match</p>
                </div>
                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-primary tracking-tight block">0%</span>
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider">Paid Promotion</span>
                  <p className="text-[10px] text-slate-400 font-semibold max-w-[150px] mx-auto">Zero brand deals. Zero sponsored metrics.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-primary tracking-tight block">10+</span>
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider">Active Directories</span>
                  <p className="text-[10px] text-slate-400 font-semibold max-w-[150px] mx-auto">From smartphones and laptops to keyboards</p>
                </div>
              </div>
            </section>

            {/* Collapsible FAQ accordion section */}
            <section className="max-w-4xl mx-auto px-4 py-20 sm:py-28" id="faq">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-[10px] font-black text-primary bg-primary/10 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 inline-block">
                  FAQ Database
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Answered Queries</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">Everything you need to know about our unbiased search indices and data collection pipeline.</p>
              </div>
              <div className="space-y-4">
                {FAQS.map((faq, index) => {
                  const isActive = activeFaqIdx === index;
                  return (
                    <div 
                      key={index} 
                      className={`bg-white dark:bg-[#111827] border rounded-2xl overflow-hidden transition-all duration-300 ${
                        isActive ? 'border-primary shadow-md' : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => setActiveFaqIdx(isActive ? null : index)}
                        className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50/20 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{faq.question}</span>
                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isActive ? 'rotate-180 text-primary' : ''}`} />
                      </button>
                      {isActive && (
                        <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-50/50 dark:border-slate-800 animate-fade-in font-medium">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'browse' && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <ProductCatalog
              products={products}
              initialCategory={preselectedCategory}
              onProductClick={(p) => {
                setSelectedProduct(p);
              }}
              onAddToCompare={handleAddToCompare}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites.map(f => f.id)}
              compareList={compareList}
              onNavigateToCompare={() => setActiveTab('compare')}
            />
          </motion.div>
        )}

        {activeTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <ProductComparer
              compareList={compareList}
              onRemoveFromCompare={handleRemoveFromCompare}
              onClearCompare={handleClearCompare}
              allProducts={products}
              onAddToCompare={handleAddToCompare}
            />
          </motion.div>
        )}

        {activeTab === 'stores' && (
          <motion.div
            key="stores"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <PlatformPriceComparator
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenProductModal={(p) => setSelectedProduct(p)}
            />
          </motion.div>
        )}

        {activeTab === 'experts' && (
          <motion.div
            key="experts"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <ExpertHub productsCatalog={products} />
          </motion.div>
        )}

        {activeTab === 'guides' && (
          <motion.div
            key="guides"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <BuyingGuides
              guides={guides}
              products={products}
              onProductClick={(p) => {
                setSelectedProduct(p);
              }}
            />
          </motion.div>
        )}

        {activeTab === 'wisebot' && (
          <motion.div
            key="wisebot"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <WiseBotPanel
              products={products}
              onProductSelect={(p) => {
                setSelectedProduct(p);
              }}
            />
          </motion.div>
        )}

        {activeTab === 'bookmarks' && (
          <motion.div
            key="bookmarks"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <BookmarksView
              favorites={favorites}
              onRemoveFavorite={handleToggleFavorite}
              onProductSelect={(p) => setSelectedProduct(p)}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
              onExploreClick={() => setActiveTab('browse')}
            />
          </motion.div>
        )}

        {(activeTab === 'user_dashboard' || (activeTab === 'dashboard' && currentRole === 'user')) && (
          <motion.div
            key="user_dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <UserDashboard
              favorites={favorites}
              onRemoveFavorite={handleToggleFavorite}
              onProductSelect={(p) => setSelectedProduct(p)}
              searchHistory={searchHistory}
              compareHistory={compareHistory}
              onClearHistory={() => {
                setSearchHistory([]);
                setCompareHistory([]);
                localStorage.removeItem('wisefind_search_history');
                localStorage.removeItem('wisefind_compare_history');
              }}
              wishlists={wishlists}
              onCreateWishlist={handleCreateWishlist}
              onDeleteWishlist={handleDeleteWishlist}
              onAddProductToWishlist={handleAddProductToWishlist}
              onRemoveProductFromWishlist={handleRemoveProductFromWishlist}
              allProducts={products}
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          </motion.div>
        )}

        {(activeTab === 'expert_dashboard' || (activeTab === 'dashboard' && currentRole === 'expert')) && (
          <motion.div
            key="expert_dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <ExpertDashboard
              user={user}
              productsCatalog={products}
              onOpenGuides={() => setActiveTab('guides')}
            />
          </motion.div>
        )}

        {(activeTab === 'admin_dashboard' || activeTab === 'admin' || (activeTab === 'dashboard' && currentRole === 'admin')) && (
          <motion.div
            key="admin_dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {currentRole !== 'admin' ? (
              <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
                  <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Console Restricted</h2>
                    <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto font-medium">
                      You are currently operating in the <span className="text-[#818CF8] font-bold uppercase">{currentRole}</span> role. Switch to the Administrator role to access live catalog CRUD, buying guide tools, and platform analytics.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleSelectRole('admin')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-[#4F46E5]/25 transition-all flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Elevate to Administrator</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('home')}
                      className="px-6 py-3 rounded-xl bg-[#12182B] hover:bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-wider cursor-pointer border border-slate-700 transition-all"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <AdminDashboard
                products={products}
                guides={guides}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddGuide={handleAddGuide}
              />
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Role Selection Modal */}
      <RoleSelectorModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
      />

      {/* Dynamic Specifications Details Overlay Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites.map(f => f.id)}
            allProducts={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            wishlists={wishlists}
            onAddProductToWishlist={handleAddProductToWishlist}
            compareList={compareList}
            onAddToCompare={handleAddToCompare}
          />
        )}
      </AnimatePresence>

      {/* Account Signup/Login Modal Frame Overlay */}
      {isAuthModalOpen && (
        <AuthModal
          initialRole={currentRole}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(authUser, role) => handleLoginSuccess(authUser, role)}
        />
      )}

      {/* Global Interactive Comparison Float Bar (Drawer style) */}
      <AnimatePresence>
        {compareList.length > 0 && activeTab !== 'compare' && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-6 left-1/2 bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-6 z-40 border border-white/10 max-w-lg w-[90%]"
          >
            <div className="flex-grow flex items-center gap-3.5">
              {/* Overlapping Staged Product Previews */}
              <div className="flex -space-x-3 overflow-hidden flex-shrink-0">
                <AnimatePresence>
                  {compareList.map((item) => (
                    <motion.img
                      key={item.id}
                      initial={{ scale: 0, opacity: 0, x: -15 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0, opacity: 0, x: -15 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-8.5 w-8.5 object-cover rounded-full border-2 border-slate-900 shadow-lg ring-1 ring-white/10"
                      title={item.name}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <div>
                <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Comparison Drawer</span>
                <span className="text-xs font-semibold text-slate-300">
                  {compareList.length} model{compareList.length > 1 ? 's' : ''} staged for comparative analysis.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('compare')}
                className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
              >
                Compare Matrix
              </button>
              <button
                onClick={handleClearCompare}
                className="text-[10px] text-slate-400 hover:text-white transition-all font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer block */}
      <footer className="bg-white dark:bg-[#111827] border-t border-slate-200/60 dark:border-slate-800 pt-20 pb-12 text-slate-500 dark:text-slate-400 text-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-slate-100 dark:border-slate-800">
          {/* Column 1: Info and brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">WiseFind</span>
            </div>
            <p className="text-slate-400 font-semibold leading-relaxed">
              Unbiased decision-intelligence telemetry designed to simplify product discovery, comparisons, and technical spec analysis.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#6A73E4] dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/50 dark:border-indigo-800 px-2.5 py-1 rounded-md w-fit">
              <Sparkles className="h-3 w-3" />
              <span>SPONSOR-FREE METRICS</span>
            </div>
          </div>

          {/* Column 2: Platform Shortcuts */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[10px]">Explore Directories</h4>
            <ul className="space-y-2.5 font-bold">
              <li>
                <button onClick={() => { setPreselectedCategory('Smartphones'); setActiveTab('browse'); }} className="hover:text-primary transition-colors text-left cursor-pointer">
                  Smartphones Specs Index
                </button>
              </li>
              <li>
                <button onClick={() => { setPreselectedCategory('Laptops'); setActiveTab('browse'); }} className="hover:text-primary transition-colors text-left cursor-pointer">
                  High-Performance Laptops
                </button>
              </li>
              <li>
                <button onClick={() => { setPreselectedCategory('Mechanical Keyboards'); setActiveTab('browse'); }} className="hover:text-primary transition-colors text-left cursor-pointer">
                  Tactile Keyboards Directory
                </button>
              </li>
              <li>
                <button onClick={() => { setPreselectedCategory('All'); setActiveTab('browse'); }} className="hover:text-primary transition-colors text-left cursor-pointer">
                  Compare Specs Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[10px]">Academic Resources</h4>
            <ul className="space-y-2.5 font-bold">
              <li>
                <button onClick={() => setActiveTab('experts')} className="hover:text-primary transition-colors text-left cursor-pointer flex items-center gap-1.5 text-primary font-black">
                  <span>★ 1:1 Human Experts Council</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('guides')} className="hover:text-primary transition-colors text-left cursor-pointer">
                  Step-by-step Buying Guides
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('wisebot')} className="hover:text-primary transition-colors text-left cursor-pointer">
                  WiseBot AI Companion
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bookmarks')} className="hover:text-primary transition-colors text-left cursor-pointer">
                  My Active Watchlist
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors text-left cursor-pointer">
                  System Architecture FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Real-time Newsletter Alerts */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[10px]">Spec Alerts</h4>
            <p className="text-slate-400 font-semibold leading-relaxed">
              Get notified immediately when new flagship smartphones, mechanical switches, or laptops are verified.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                if (emailInput && emailInput.value.trim()) {
                  localStorage.setItem('subscribed_email', emailInput.value);
                  alert(`Successfully registered ${emailInput.value} for Unbiased Spec Alerts!`);
                  form.reset();
                }
              }}
              className="flex gap-2"
            >
              <input 
                type="email" 
                name="email"
                placeholder="Enter alert email..." 
                required
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl px-3.5 py-2.5 w-full text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-slate-900 dark:bg-[#7C3AED] hover:bg-black dark:hover:bg-[#6D28D9] text-white font-black uppercase text-[10px] px-4 py-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 shadow-md shadow-slate-900/10"
              >
                Alert Me
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-400 font-bold">
          <span>© 2026 WiseFind Inc. Unbiased specs indexing platform.</span>
          <div className="flex gap-6">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Specifications Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
