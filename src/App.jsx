import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Logo from './components/Logo.jsx';
import Hero from './components/Hero.jsx';
import ProductCatalog from './components/ProductCatalog.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import ProductComparer from './components/ProductComparer.jsx';
import BuyingGuides from './components/BuyingGuides.jsx';
import WiseBotPanel from './components/WiseBotPanel.jsx';
import { RoleSelectorModal } from './components/RoleSelectorModal.jsx';
import RoleProfileSection from './components/RoleProfileSection.jsx';
import AdvisorDashboard from './components/AdvisorDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AuthModal from './components/AuthModal.jsx';
import BookmarksView from './components/BookmarksView.jsx';
import { HowWiseFindWorks, WhyChooseWiseFind, WiseFindVsOthers, UserTestimonials, FAQSection } from './components/HomePageSections.jsx';
import { ExpertHub } from './components/ExpertHub.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { ArrowRight, Sparkles, LogOut, CheckCircle2, X } from 'lucide-react';
import { INITIAL_BUYING_GUIDES } from './data/mockData.js';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { loadUserDataForEmail, saveUserDataForEmail } from './utils/profileStorage.js';
export function AppContent() {
    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [products, setProducts] = useState([]);
    const [guides, setGuides] = useState(INITIAL_BUYING_GUIDES);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [wiseBotInitialQuery, setWiseBotInitialQuery] = useState(null);
    const [browseInitialQuery, setBrowseInitialQuery] = useState('');
    const [browseAutoOpenPopup, setBrowseAutoOpenPopup] = useState(false);

    const handleAskWiseBot = (query) => {
        setWiseBotInitialQuery(query);
        setActiveTab('wisebot');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBrowseSearch = (query) => {
        setBrowseInitialQuery(query);
        setBrowseAutoOpenPopup(true);
        setActiveTab('browse');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // User auth and role states
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'
    const [authModalRole, setAuthModalRole] = useState('user');
    const [authModalNotice, setAuthModalNotice] = useState(null);
    const [currentRole, setCurrentRole] = useState(() => {
        const saved = localStorage.getItem('wisefind_user_role');
        if (saved === 'admin') return 'admin';
        if (saved === 'expert' || saved === 'advisor') return 'expert';
        return 'user';
    });
    // Never ask role directly on refresh or initial visit
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    // Direct modal openers
    const handleOpenSignIn = (role = currentRole) => {
        setAuthModalRole(role);
        setAuthModalMode('login');
        setAuthModalNotice(null);
        setIsAuthModalOpen(true);
    };

    const handleOpenSignUp = (role = currentRole) => {
        setAuthModalRole(role);
        setAuthModalMode('signup');
        setAuthModalNotice(null);
        setIsAuthModalOpen(true);
    };

    // Role switching with mandatory authentication check
    const handleRequestRoleSwitch = (targetRole) => {
        setIsRoleModalOpen(false);
        const normalizedRole = (targetRole === 'advisor' || targetRole === 'expert') ? 'expert' : (targetRole === 'admin' ? 'admin' : 'user');
        
        // Check if currently authenticated user has credentials for this exact role
        const isAuthedForRole = user && (user.role === normalizedRole || (normalizedRole === 'expert' && user.role === 'advisor'));

        if (isAuthedForRole) {
            // Already authorized
            setCurrentRole(normalizedRole);
            localStorage.setItem('wisefind_user_role', normalizedRole);
            // When customer logins/switches, land at main home page as usual!
            // But open different dashboards as per roles for advisors and admin!
            if (normalizedRole === 'user') {
                setActiveTab('home');
            } else {
                setProfileInitialSubTab(normalizedRole === 'expert' ? 'inbox' : 'catalog');
                setActiveTab('profile');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Must authenticate for this portal!
            const roleLabels = {
                user: 'Customer (Shopper)',
                expert: 'Category Advisor',
                admin: 'Platform Administrator'
            };
            setAuthModalRole(normalizedRole);
            setAuthModalMode('login');
            setAuthModalNotice(`Please enter your verified credentials for ${roleLabels[normalizedRole]} to access this portal.`);
            setIsAuthModalOpen(true);
        }
    };

    const handleSelectRole = (role) => {
        const normalizedRole = (role === 'advisor' || role === 'expert') ? 'expert' : (role === 'admin' ? 'admin' : 'user');
        setCurrentRole(normalizedRole);
        localStorage.setItem('wisefind_user_role', normalizedRole);
        localStorage.setItem('wisefind_role_selected_ever', 'true');
        setIsRoleModalOpen(false);
        // When customer logins, land him at our main home page sections only as usual!
        // But for advisors and admin, open their dedicated dashboards!
        if (normalizedRole === 'user') {
            setActiveTab('home');
        } else {
            setProfileInitialSubTab(normalizedRole === 'expert' ? 'inbox' : 'catalog');
            setActiveTab('profile');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Profile initial sub-tab controller (e.g. dna, wishlists, radar, inbox, catalog, etc.)
    const [profileInitialSubTab, setProfileInitialSubTab] = useState('dna');

    const handleNavigateToProfile = (subTab = null) => {
        if (subTab) {
            setProfileInitialSubTab(subTab);
        }
        setActiveTab('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Wishlist manager state
    const [wishlists, setWishlists] = useState([]);
    // Client states
    const [favorites, setFavorites] = useState([]);
    const [compareList, setCompareList] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [compareHistory, setCompareHistory] = useState([]);
    // Preselected category state for Catalog
    const [preselectedCategory, setPreselectedCategory] = useState('All');
    const [preselectedGuideCategory, setPreselectedGuideCategory] = useState('All');
    const [preselectedExpertCategory, setPreselectedExpertCategory] = useState('All');

    const handleOpenGuide = (category) => {
        if (category) {
            setPreselectedGuideCategory(category);
        }
        setActiveTab('guides');
        if (selectedProduct) {
            setSelectedProduct(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenAdvisors = (category) => {
        if (category) {
            setPreselectedExpertCategory(category);
        }
        setActiveTab('experts');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Fetch products and guides from server on startup
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.ok ? await res.json() : [];
                setProducts(data);
            }
        }
        catch (err) {
            console.error("Error fetching products", err);
        }
    };
    const fetchGuides = async () => {
        try {
            const res = await fetch('/api/guides');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    const merged = [...INITIAL_BUYING_GUIDES];
                    for (const g of data) {
                        const idx = merged.findIndex(m => m.id === g.id);
                        if (idx !== -1) merged[idx] = { ...merged[idx], ...g };
                        else merged.push(g);
                    }
                    setGuides(merged);
                }
            }
        }
        catch (err) {
            console.error("Error fetching guides", err);
        }
    };
    useEffect(() => {
        fetchProducts();
        fetchGuides();
        const savedUser = localStorage.getItem('wisefind_logged_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                const userData = loadUserDataForEmail(parsed.email);
                setWishlists(userData.wishlists || [{ id: 'default', name: 'General Favorites', description: 'Standard bookmarked items', productIds: [] }]);
                setSearchHistory(userData.searchHistory || []);
                setCompareHistory(userData.compareHistory || []);
            }
            catch (e) {
                setUser(null);
                const guestData = loadUserDataForEmail(null);
                setWishlists(guestData.wishlists);
                setSearchHistory(guestData.searchHistory);
                setCompareHistory(guestData.compareHistory);
            }
        }
        else {
            // Logged out by default!
            setUser(null);
            const guestData = loadUserDataForEmail(null);
            setWishlists(guestData.wishlists);
            setSearchHistory(guestData.searchHistory);
            setCompareHistory(guestData.compareHistory);
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
    const handleToggleFavorite = (product) => {
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
    const handleCreateWishlist = (name, description) => {
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
    const handleDeleteWishlist = (wishlistId) => {
        setWishlists(prev => {
            const updated = prev.filter(w => w.id !== wishlistId);
            localStorage.setItem('wisefind_wishlists', JSON.stringify(updated));
            saveUserDataForEmail(user?.email, { wishlists: updated });
            return updated;
        });
    };
    const handleAddProductToWishlist = (wishlistId, productId) => {
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
    const handleRemoveProductFromWishlist = (wishlistId, productId) => {
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
    const handleUpdateProfile = (nameOrData, maybeEmail) => {
        let updatedUser = {};
        if (typeof nameOrData === 'object' && nameOrData !== null) {
            updatedUser = { ...(user || {}), ...nameOrData };
        } else {
            updatedUser = { ...(user || {}), name: nameOrData, email: maybeEmail };
        }
        setUser(updatedUser);
        localStorage.setItem('wisefind_logged_user', JSON.stringify(updatedUser));
        if (updatedUser.email) {
            saveUserDataForEmail(updatedUser.email, updatedUser);
        }
    };
    const handleAddExternalRecommendationToWishlist = (productName, brand, priceEstimate) => {
        // Generate a temporary item to represent bookmarking AI advice
        const mockFav = {
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
    const handleAddToCompare = (product) => {
        if (compareList.some(item => item.id === product.id)) {
            // Remove it if clicked again
            setCompareList(prev => prev.filter(item => item.id !== product.id));
            return;
        }
        if (compareList.length >= 4) {
            alert("You can compare up to 4 products simultaneously.");
            return;
        }

        // Enforce Category & Subcategory consistency: only similar products can be compared!
        if (compareList.length > 0) {
            const baseProduct = compareList[0];
            const baseCat = (baseProduct.category || '').toLowerCase().trim();
            const prodCat = (product.category || '').toLowerCase().trim();
            
            const isMatch = baseCat === prodCat || 
                            baseCat.includes(prodCat) || 
                            prodCat.includes(baseCat);

            if (!isMatch) {
                alert(`Category Mismatch: Your comparison board is currently comparing "${baseProduct.category}" (${baseProduct.name}).\n\nPlease select other models from the "${baseProduct.category}" category to ensure a meaningful, like-for-like comparison.`);
                return;
            }
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
    const handleRemoveFromCompare = (productId) => {
        setCompareList(prev => prev.filter(p => p.id !== productId));
    };
    const handleClearCompare = () => {
        setCompareList([]);
    };
    // AI query recommendation execution
    const handleSearchRecommendation = async (query) => {
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
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoadingRecommendation(false);
        }
    };
    // Login click simulation
    const handleLogin = () => {
        setIsAuthModalOpen(true);
    };
    // Logout Confirmation & Alert States
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [logoutAlertMessage, setLogoutAlertMessage] = useState(null);

    // Initiates logout confirmation modal
    const handleRequestLogout = () => {
        setIsLogoutConfirmOpen(true);
    };

    // Confirms and executes logout with clear success alert message
    const handleConfirmLogout = () => {
        setUser(null);
        localStorage.removeItem('wisefind_logged_user');
        // Reset back to clean guest state
        const guestData = loadUserDataForEmail(null);
        setWishlists(guestData.wishlists);
        setSearchHistory(guestData.searchHistory);
        setCompareHistory(guestData.compareHistory);
        setIsLogoutConfirmOpen(false);

        // Prominent alert toast message
        setLogoutAlertMessage("You have successfully logged out. Your session has been safely closed.");
        setTimeout(() => {
            setLogoutAlertMessage(null);
        }, 4000);

        // Return to home discover tab
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = handleRequestLogout;
    // Central Login Success handler that loads profile records
    const handleLoginSuccess = (authUser, role) => {
        setUser(authUser);
        localStorage.setItem('wisefind_logged_user', JSON.stringify(authUser));
        // Load this specific user profile's data records
        const userData = loadUserDataForEmail(authUser.email);
        if (userData.wishlists && userData.wishlists.length > 0) {
            setWishlists(userData.wishlists);
        }
        else {
            setWishlists([{ id: 'default', name: 'My Tech WiseList', description: 'Primary tracking list', productIds: [] }]);
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
    const handleAddProduct = async (productData) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                await fetchProducts();
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleUpdateProduct = async (id, productData) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                await fetchProducts();
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleDeleteProduct = async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await fetchProducts();
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    const handleAddGuide = async (guideData) => {
        try {
            const res = await fetch('/api/guides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guideData)
            });
            if (res.ok) {
                await fetchGuides();
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    return (<div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050505] text-[#111827] dark:text-[#F8FAFC] flex flex-col justify-between transition-colors duration-200" id="app-root-frame">
      {/* Unique Animated Splash Screen on Refresh/Visit */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Dynamic Header with Top-Right Profile Control Suite */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Auto scroll to top on tab swap
          window.scrollTo(0, 0);
        }} 
        user={user} 
        onLoginClick={() => handleOpenSignIn(currentRole)} 
        onSignInClick={() => handleOpenSignIn(currentRole)} 
        onGetStartedClick={() => handleOpenSignUp(currentRole)} 
        onLogout={handleLogout} 
        compareCount={compareList.length} 
        favoritesCount={favorites.length} 
        currentRole={currentRole} 
        onOpenRoleSelector={() => setIsRoleModalOpen(true)}
        onNavigateToProfile={handleNavigateToProfile}
      />

      {/* Main Body Routing Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (<motion.div key="home" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }} className="space-y-0">
            {/* Hero Browse & Product Search widget */}
            <Hero 
              onBrowseSearch={handleBrowseSearch} 
              onAskWiseBot={handleAskWiseBot} 
              onSelectCategory={(cat) => {
                setPreselectedCategory(cat);
                setActiveTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 1. How WiseFind Works (User Journey & Core Features) */}
            <HowWiseFindWorks onNavigateTab={(tab) => {
              if (tab === 'browse') {
                setPreselectedCategory('All');
              }
              setActiveTab(tab);
            }} />

            {/* 2. WiseFind vs Others */}
            <WiseFindVsOthers />

            {/* 3. Why Choose WiseFind (Best 6-Card Suite) */}
            <WhyChooseWiseFind onNavigateTab={(tab) => {
              if (tab === 'browse') {
                setPreselectedCategory('All');
              }
              setActiveTab(tab);
            }} onExploreFeature={(tab) => {
              if (tab === 'browse') {
                setPreselectedCategory('All');
              }
              setActiveTab(tab);
            }} />

            {/* 4. User Testimonials */}
            <UserTestimonials />

            {/* 5. FAQ Section */}
            <FAQSection />
          </motion.div>)}

        {activeTab === 'browse' && (<motion.div key="browse" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <ProductCatalog 
              products={products} 
              initialCategory={preselectedCategory} 
              initialSearchQuery={browseInitialQuery}
              autoOpenSearchPopup={browseAutoOpenPopup}
              onClearInitialSearch={() => {
                setBrowseInitialQuery('');
                setBrowseAutoOpenPopup(false);
              }}
              onProductClick={(p) => {
                setSelectedProduct(p);
              }} 
              onAddToCompare={handleAddToCompare} 
              onToggleFavorite={handleToggleFavorite} 
              favorites={favorites.map(f => f.id)} 
              compareList={compareList} 
              onNavigateToCompare={() => setActiveTab('compare')} 
              onAskWiseBot={(q) => {
                handleAskWiseBot(q);
              }} 
              onOpenGuides={handleOpenGuide}
            />
          </motion.div>)}

        {activeTab === 'compare' && (<motion.div key="compare" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <ProductComparer compareList={compareList} onRemoveFromCompare={handleRemoveFromCompare} onClearCompare={handleClearCompare} allProducts={products} onAddToCompare={handleAddToCompare}/>
          </motion.div>)}

        {(activeTab === 'profile' || activeTab === 'user_dashboard' || activeTab === 'expert_dashboard' || activeTab === 'admin_dashboard' || activeTab === 'dashboard') && (
          currentRole === 'admin' ? (
            <motion.div key="admin-dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
              <AdminDashboard
                user={user}
                onLogout={handleRequestLogout}
                allProducts={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                guides={guides}
                onAddGuide={handleAddGuide}
                initialSubTab={profileInitialSubTab}
                onAdminSignInUser={(targetUser) => handleLoginSuccess(targetUser, targetUser.role)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          ) : (currentRole === 'expert' || currentRole === 'advisor') ? (
            <motion.div key="advisor-dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
              <AdvisorDashboard
                user={user}
                onLogout={handleRequestLogout}
                allProducts={products}
                guides={guides}
                initialSubTab={profileInitialSubTab}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          ) : (
            <motion.div key="customer-profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
              <RoleProfileSection
                currentRole="user"
                onRequestRoleSwitch={handleRequestRoleSwitch}
                user={user}
                onLogout={handleRequestLogout}
                onUpdateProfile={handleUpdateProfile}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                favorites={favorites}
                onRemoveFavorite={handleToggleFavorite}
                onProductSelect={(p) => setSelectedProduct(p)}
                onAddToCompare={handleAddToCompare}
                compareList={compareList}
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
                onRemoveProductFromWishlist={handleRemoveProductFromWishlist}
                allProducts={products}
                guides={guides}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddGuide={handleAddGuide}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                initialSubTab={profileInitialSubTab}
                onAdminSignInUser={(targetUser) => handleLoginSuccess(targetUser, targetUser.role)}
              />
            </motion.div>
          )
        )}

        {activeTab === 'experts' && (
          <motion.div key="experts" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <ExpertHub productsCatalog={products} initialCategory={preselectedExpertCategory} onOpenGuides={handleOpenGuide} onProductSelect={(p) => setSelectedProduct(p)}/>
          </motion.div>
        )}

        {activeTab === 'guides' && (
          <motion.div key="guides" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <BuyingGuides 
              guides={guides} 
              products={products} 
              onProductClick={(p) => {
                setSelectedProduct(p);
              }} 
              onAddToCompare={handleAddToCompare} 
              onToggleFavorite={handleToggleFavorite} 
              favorites={favorites}
              initialCategory={preselectedGuideCategory}
              onOpenAdvisors={handleOpenAdvisors}
            />
          </motion.div>
        )}

        {activeTab === 'wisebot' && (
          <motion.div key="wisebot" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <WiseBotPanel 
              products={products} 
              initialQuery={wiseBotInitialQuery}
              onClearInitialQuery={() => setWiseBotInitialQuery(null)}
              onProductSelect={(p) => {
                setSelectedProduct(p);
              }} 
              onAddToCompare={handleAddToCompare} 
              onToggleFavorite={handleToggleFavorite} 
              favorites={favorites}
            />
          </motion.div>
        )}

        {activeTab === 'bookmarks' && (
          <motion.div key="bookmarks" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <BookmarksView favorites={favorites} onRemoveFavorite={handleToggleFavorite} onProductSelect={(p) => setSelectedProduct(p)} onAddToCompare={handleAddToCompare} compareList={compareList} onExploreClick={() => setActiveTab('browse')}/>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Role Selection Modal */}
      <RoleSelectorModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} currentRole={currentRole} onSelectRole={handleRequestRoleSwitch}/>

      {/* Dynamic Specifications Details Overlay Modal */}
      <AnimatePresence>
        {selectedProduct && (<ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} onToggleFavorite={handleToggleFavorite} favorites={favorites.map(f => f.id)} allProducts={products} onSelectProduct={(p) => setSelectedProduct(p)} wishlists={wishlists} onAddProductToWishlist={handleAddProductToWishlist} compareList={compareList} onAddToCompare={handleAddToCompare} onOpenGuides={handleOpenGuide} onAskWiseBot={(q) => {
                setSelectedProduct(null);
                setActiveTab('wisebot');
            }}/>)}
      </AnimatePresence>

      {/* Account Signup/Login Modal Frame Overlay */}
      {isAuthModalOpen && (
        <AuthModal 
          initialRole={authModalRole} 
          initialMode={authModalMode}
          roleNotice={authModalNotice}
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={(authUser, role) => handleLoginSuccess(authUser, role)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="logout-confirm-modal">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0E1322] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-md shadow-rose-500/10">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Are you sure you want to log out?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                You will need to sign in again to access your personalized settings, inquiries, or admin privileges.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="cancel-logout-btn"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-logout-btn"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Logout Alert Toast Notification */}
      {logoutAlertMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md bg-emerald-600 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-600/30 border border-emerald-400/40 flex items-start gap-3 animate-fade-in" id="logout-alert-toast">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <strong className="block font-black text-sm mb-0.5">Signed Out Successfully</strong>
            <span>{logoutAlertMessage}</span>
          </div>
          <button onClick={() => setLogoutAlertMessage(null)} className="text-white/80 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Interactive Comparison Float Bar (Drawer style) */}
      <AnimatePresence>
        {compareList.length > 0 && activeTab !== 'compare' && (<motion.div initial={{ opacity: 0, y: 100, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 100, x: '-50%' }} transition={{ type: 'spring', damping: 25, stiffness: 220 }} className="fixed bottom-6 left-1/2 bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-6 z-40 border border-white/10 max-w-lg w-[90%]">
            <div className="flex-grow flex items-center gap-3.5">
              {/* Overlapping Staged Product Previews */}
              <div className="flex -space-x-3 overflow-hidden flex-shrink-0">
                <AnimatePresence>
                  {compareList.map((item) => (<motion.img key={item.id} initial={{ scale: 0, opacity: 0, x: -15 }} animate={{ scale: 1, opacity: 1, x: 0 }} exit={{ scale: 0, opacity: 0, x: -15 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} src={item.image} alt={item.name} referrerPolicy="no-referrer" className="h-8.5 w-8.5 object-cover rounded-full border-2 border-slate-900 shadow-lg ring-1 ring-white/10" title={item.name}/>))}
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
              <button onClick={() => setActiveTab('compare')} className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                Compare Matrix
              </button>
              <button onClick={handleClearCompare} className="text-[10px] text-slate-400 hover:text-white transition-all font-semibold cursor-pointer">
                Clear
              </button>
            </div>
          </motion.div>)}
      </AnimatePresence>

      {/* Footer block */}
      <footer className="bg-white dark:bg-[#0c101d] border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12 text-slate-500 dark:text-slate-400 text-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-100 dark:border-slate-800/80">
          {/* Column 1: Info and brand */}
          <div className="space-y-4">
            <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
              <Logo size={36} showText={true} subtitle="Find Smarter • Choose Wisely" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-xs">
              Honest shopping advice made simple. We compare real store prices, test product quality, and help you pick what fits your lifestyle and budget.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/80 px-2.5 py-1 rounded-lg w-fit">
              <Sparkles className="h-3 w-3 text-amber-500"/>
              <span>100% UNBIASED & SPONSOR-FREE</span>
            </div>
          </div>

          {/* Column 2: Platform Shortcuts */}
          <div className="space-y-3.5">
            <h4 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[11px]">Explore Products</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => { setPreselectedCategory('Smartphones'); setActiveTab('browse'); }} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer">
                  Smartphones & Mobiles
                </button>
              </li>
              <li>
                <button onClick={() => { setPreselectedCategory('Laptops'); setActiveTab('browse'); }} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer">
                  Laptops for Work & Study
                </button>
              </li>
              <li>
                <button onClick={() => { setPreselectedCategory('Audio'); setActiveTab('browse'); }} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer">
                  Earbuds & Headphones
                </button>
              </li>
              <li>
                <button onClick={() => { setPreselectedCategory('All'); setActiveTab('browse'); }} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer">
                  Full Catalog & Filters
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Helpful Links */}
          <div className="space-y-3.5">
            <h4 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[11px]">Helpful Guides</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => setActiveTab('experts')} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5 text-[#4F46E5] dark:text-indigo-400 font-bold">
                  <span>★ Talk to a Verified Advisor</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('guides')} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                  <span>📖 WiseGuide Consumer Playbooks</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('wisebot')} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer">
                  WiseBot Shopping Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bookmarks')} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer">
                  Saved Products & WiseList
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('home'); setTimeout(() => { const el = document.getElementById('faq'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="hover:text-[#4F46E5] dark:hover:text-white transition-colors text-left cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3.5">
            <h4 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[11px]">Deal & Drop Alerts</h4>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Get an honest ping whenever genuine discounts or price drops happen on verified gear. No spam, ever.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const emailInput = form.elements.namedItem('email');
              if (emailInput && emailInput.value.trim()) {
                localStorage.setItem('subscribed_email', emailInput.value);
                alert(`Great! We will notify ${emailInput.value} when genuine price drops happen.`);
                form.reset();
              }
            }} className="flex gap-2">
              <input type="email" name="email" placeholder="Your email address..." required className="bg-slate-100/80 dark:bg-[#161c2e] border border-slate-200 dark:border-slate-700/80 focus:border-[#4F46E5] rounded-xl px-3.5 py-2.5 w-full text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none"/>
              <button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black uppercase text-[10px] px-4 py-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 shadow-md shadow-indigo-500/20 active:scale-95">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 dark:text-slate-500 font-medium text-xs">
          <span>© 2026 WiseFind. Honest, human-first buying intelligence.</span>
          <div className="flex gap-6">
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">How We Test Products</span>
          </div>
        </div>
      </footer>
    </div>);
}
export default function App() {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ErrorBoundary>
    );
}
