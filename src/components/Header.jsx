import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  ShoppingBag, 
  BarChart2, 
  BookOpen, 
  Bot, 
  Sparkles, 
  Users, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ChevronDown, 
  LogIn, 
  LogOut, 
  User,
  Sliders,
  Heart,
  TrendingDown,
  History,
  Lock,
  MessageSquare,
  Tag,
  DollarSign,
  Database,
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import Logo from './Logo.jsx';
import { WiseBookmarkIcon } from './WiseBookmarkIcon.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLoginClick, 
  onSignInClick, 
  onGetStartedClick, 
  onLogout, 
  compareCount, 
  favoritesCount, 
  currentRole, 
  onOpenRoleSelector,
  onNavigateToProfile
}) {
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleConfigs = {
    user: {
      label: 'Customer',
      badge: 'Customer',
      titleBadge: 'Verified Shopper',
      icon: ShoppingBag,
      gradient: 'from-[#4F46E5] to-[#6366F1]',
      border: 'border-[#4F46E5]/40',
      badgeColor: 'bg-[#4F46E5]/15 text-[#4F46E5] dark:text-[#818CF8]',
      dashboardTab: 'profile',
      dashboardTitle: 'Smart Shopper Hub',
      primaryActionLabel: 'Open Customer Hub'
    },
    expert: {
      label: 'Advisor',
      badge: 'Advisor',
      titleBadge: 'Certified Category Advisor',
      icon: Users,
      gradient: 'from-[#7C3AED] to-[#9333EA]',
      border: 'border-[#7C3AED]/40',
      badgeColor: 'bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC]',
      dashboardTab: 'profile',
      dashboardTitle: 'Advisor Desk',
      primaryActionLabel: 'Open Advisor Desk'
    },
    advisor: {
      label: 'Advisor',
      badge: 'Advisor',
      titleBadge: 'Certified Category Advisor',
      icon: Users,
      gradient: 'from-[#7C3AED] to-[#9333EA]',
      border: 'border-[#7C3AED]/40',
      badgeColor: 'bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC]',
      dashboardTab: 'profile',
      dashboardTitle: 'Advisor Desk',
      primaryActionLabel: 'Open Advisor Desk'
    },
    admin: {
      label: 'Admin',
      badge: 'Admin',
      titleBadge: 'Tier-1 Super Admin',
      icon: ShieldCheck,
      gradient: 'from-[#4F46E5] via-[#6366F1] to-[#7C3AED]',
      border: 'border-indigo-500/40',
      badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
      dashboardTab: 'profile',
      dashboardTitle: 'Admin Console',
      primaryActionLabel: 'Open Admin Console'
    }
  };

  const currentRoleConfig = roleConfigs[currentRole] || roleConfigs.user;
  const RoleIcon = currentRoleConfig.icon;

  // Streamlined central navigation: Profile removed from navbar per user request
  const navItems = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'browse', label: 'Browse', icon: ShoppingBag },
    { id: 'compare', label: 'Compare', icon: BarChart2, count: compareCount },
    { id: 'experts', label: 'Advisors', icon: Users },
    { id: 'guides', label: 'WiseGuide', icon: BookOpen },
    { id: 'wisebot', label: 'WiseBot AI', icon: Bot },
    { id: 'bookmarks', label: 'WiseList', icon: WiseBookmarkIcon, count: favoritesCount },
  ];

  const handleOpenProfileSubTab = (subTab) => {
    setIsProfileMenuOpen(false);
    if (onNavigateToProfile) {
      onNavigateToProfile(subTab);
    } else {
      setActiveTab('profile');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#070913]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg dark:shadow-black/40 transition-colors duration-200" id="main-header">
      {/* Top micro-glow accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#4F46E5] via-[#7C3AED] to-transparent opacity-80" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Tier 1: Brand Logo, Role Switcher & Top-Right Profile Control Suite */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 py-2.5 min-h-14 sm:min-h-16">
          
          {/* Left: Brand Logo & Interactive Role Switcher Pill */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div 
              className="cursor-pointer flex items-center shrink-0 group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]" 
              onClick={() => setActiveTab('home')} 
              title="WiseFind - Back to Home"
            >
              <Logo size={34} showText={true} />
            </div>

            {/* Quick Role Switcher Pill */}
            <button 
              onClick={onOpenRoleSelector} 
              id="header-role-switcher-btn" 
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider bg-slate-100/90 hover:bg-slate-200/90 dark:bg-[#111627] dark:hover:bg-[#182038] border border-slate-300/70 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-sm group shrink-0" 
              title="Click to Switch Customer / Advisor / Admin Role"
            >
              <div className={`p-1 rounded-lg bg-gradient-to-r ${currentRoleConfig.gradient} text-white shadow-xs`}>
                <RoleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
              <span className="font-extrabold">{currentRoleConfig.badge}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* Right: Theme Toggle & Top-Right Profile Section */}
          <div className="flex items-center justify-end gap-2 sm:gap-3" ref={profileDropdownRef}>
            
            {/* Theme Toggle Button (Light/Dark) */}
            <button 
              id="theme-toggle-btn" 
              onClick={toggleTheme} 
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Active: Dark Mode' : 'Active: Light Mode'}
              className="relative p-2 rounded-xl bg-slate-100/95 hover:bg-slate-200 dark:bg-[#111627] dark:hover:bg-[#182038] border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-[#FBBF24] transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs shrink-0 hover:scale-105 active:scale-95 group focus:outline-none"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[#FBBF24] fill-[#FBBF24]/20 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600 dark:text-slate-400 fill-indigo-100 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Profile Section at Top Right Corner */}
            <div className="relative">
              {user ? (
                /* Authenticated User Profile Pill */
                <button
                  id="top-right-profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-black transition-all duration-200 cursor-pointer shadow-xs ${
                    isProfileMenuOpen
                      ? 'border-[#7C3AED] bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC] ring-2 ring-[#7C3AED]/20 shadow-md'
                      : 'bg-slate-100/90 dark:bg-[#111627] hover:bg-slate-200/90 dark:hover:bg-[#182038] border-slate-300/70 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                  }`}
                  title={`Open ${currentRoleConfig.label} Profile & Options`}
                >
                  <div className={`h-6 w-6 rounded-lg bg-gradient-to-r ${currentRoleConfig.gradient} text-white text-[11px] font-black flex items-center justify-center shadow-xs ring-1 ring-white/20`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[11px] font-black leading-tight text-slate-900 dark:text-white max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none">
                      {currentRoleConfig.badge}
                    </div>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>
              ) : (
                /* Guest User Profile Action */
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => onSignInClick ? onSignInClick() : onLoginClick?.()} 
                    id="header-signin-btn" 
                    className="inline-flex items-center gap-1 text-xs font-black text-slate-700 dark:text-slate-200 hover:text-[#4F46E5] dark:hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#111627] transition-all duration-200 cursor-pointer shrink-0"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Sign In</span>
                  </button>

                  <button 
                    onClick={() => onGetStartedClick ? onGetStartedClick() : onLoginClick?.()} 
                    id="header-getstarted-btn" 
                    className="btn-shine flex items-center gap-1.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 shadow-md shadow-[#4F46E5]/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#FBBF24]" />
                    <span>Get Started</span>
                  </button>
                </div>
              )}

              {/* Floating Top-Right Profile Dropdown Panel */}
              {isProfileMenuOpen && user && (
                <div 
                  id="top-right-profile-dropdown"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-[#0D1224]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Profile Card Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-r ${currentRoleConfig.gradient} text-white font-black text-lg flex items-center justify-center shadow-md ring-2 ring-white/10 shrink-0`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                          {user.name}
                        </h4>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Active Session" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${currentRoleConfig.badgeColor}`}>
                          <RoleIcon className="h-2.5 w-2.5" />
                          <span>{currentRoleConfig.titleBadge}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Profile Section CTA */}
                  <button
                    onClick={() => handleOpenProfileSubTab(
                      currentRole === 'admin' ? 'catalog' : (currentRole === 'expert' ? 'inbox' : 'dna')
                    )}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r ${currentRoleConfig.gradient} hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-500/20 cursor-pointer transition-all duration-150`}
                  >
                    <span>{currentRoleConfig.primaryActionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  {/* Role-Specific Options Menu */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 pt-1">
                      {currentRoleConfig.label} Options & Features
                    </div>

                    {/* CUSTOMER (SHOPPER) RELEVANT OPTIONS */}
                    {currentRole === 'user' && (
                      <div className="grid grid-cols-1 gap-1">
                        <button
                          onClick={() => handleOpenProfileSubTab('dna')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-600 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Sliders className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Shopping DNA & Tech Budget</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('wishlists')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-600 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className="h-3.5 w-3.5 text-rose-500" />
                            <span>WiseList</span>
                          </div>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {favoritesCount} items
                          </span>
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('radar')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-600 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Price Drop Radar</span>
                          </div>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            3 Alerts
                          </span>
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('history')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-600 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <History className="h-3.5 w-3.5 text-amber-500" />
                            <span>Search & Compare History</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('security')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-600 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Lock className="h-3.5 w-3.5 text-blue-500" />
                            <span>Security & Delivery Address</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      </div>
                    )}

                    {/* ADVISOR (EXPERT) RELEVANT OPTIONS */}
                    {(currentRole === 'expert' || currentRole === 'advisor') && (
                      <div className="grid grid-cols-1 gap-1">
                        <button
                          onClick={() => handleOpenProfileSubTab('inbox')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-purple-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
                            <span>Buyer Inquiries & Dilemmas</span>
                          </div>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
                            Active
                          </span>
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('persona')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-purple-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Tag className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Sponsor-Free Bio & Specialties</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('rates')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-purple-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Consultation Rates & Hours</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('payouts')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-purple-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Activity className="h-3.5 w-3.5 text-amber-500" />
                            <span>Earnings & Bank Payouts</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      </div>
                    )}

                    {/* ADMIN RELEVANT OPTIONS */}
                    {currentRole === 'admin' && (
                      <div className="grid grid-cols-1 gap-1">
                        <button
                          onClick={() => handleOpenProfileSubTab('accounts')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Users className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Manage Accounts & Sign In</span>
                          </div>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                            Users
                          </span>
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('catalog')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Database className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Product Catalog CRUD</span>
                          </div>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                            70 Items
                          </span>
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('guides')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                            <span>WiseGuide Publishing Suite</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>

                        <button
                          onClick={() => handleOpenProfileSubTab('telemetry')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D38] hover:text-indigo-500 dark:hover:text-white transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Activity className="h-3.5 w-3.5 text-emerald-500" />
                            <span>System Security & Telemetry</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sign Out Footer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      id="profile-dropdown-logout-btn"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: Dedicated, Centered Main Navigation Bar */}
        <div className="flex items-center justify-center py-2 px-1 border-t border-slate-100/90 dark:border-slate-800/60 overflow-x-auto no-scrollbar">
          <nav className="flex items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-100/95 dark:bg-[#101526]/95 border border-slate-200/90 dark:border-slate-700/80 backdrop-blur-xl max-w-full shadow-xs" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  id={`nav-link-${item.id}`} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 hover:-translate-y-0.5 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white border-transparent shadow-md shadow-[#4F46E5]/35 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-[#1A223B] border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 shadow-none'
                  }`}
                >
                  {item.id === 'bookmarks' ? (
                    <WiseBookmarkIcon size={14} active={isActive} className={`h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  ) : (
                    <Icon className={`h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  )}
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`ml-0.5 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs animate-pulse ${isActive ? 'bg-white/30 text-white' : 'bg-[#EF4444]'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
