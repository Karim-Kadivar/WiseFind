import React, { useState } from 'react';
import { 
  Compass, ShoppingBag, BarChart2, BookOpen, Bot, Layout, 
  Heart, User, Sparkles, Users, Sun, Moon, 
  Building2, ShieldCheck, ChevronDown, LogIn, LogOut,
  UserPlus, Check, Sparkle, Search
} from 'lucide-react';
import Logo from './Logo';
import { WiseBookmarkIcon } from './WiseBookmarkIcon';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; email: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  compareCount: number;
  onToggleTopBar: (section: 'bookmarks' | 'profile' | 'auth') => void;
  isTopBarOpen: boolean;
  favoritesCount: number;
  currentRole: UserRole;
  onOpenRoleSelector: () => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLoginClick, 
  onLogout, 
  compareCount,
  onToggleTopBar,
  isTopBarOpen,
  favoritesCount,
  currentRole,
  onOpenRoleSelector
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleConfigs = {
    user: {
      label: 'Shopper',
      badge: 'Shopper',
      icon: ShoppingBag,
      gradient: 'from-[#4F46E5] to-[#6366F1]',
      border: 'border-[#4F46E5]/40',
      badgeColor: 'bg-[#4F46E5]/15 text-[#4F46E5] dark:text-[#818CF8]',
      dashboardTab: 'user_dashboard',
      dashboardTitle: 'My Hub'
    },
    expert: {
      label: 'Expert',
      badge: 'Expert',
      icon: Users,
      gradient: 'from-[#7C3AED] to-[#9333EA]',
      border: 'border-[#7C3AED]/40',
      badgeColor: 'bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC]',
      dashboardTab: 'expert_dashboard',
      dashboardTitle: 'Expert Desk'
    },
    admin: {
      label: 'Admin',
      badge: 'Admin',
      icon: ShieldCheck,
      gradient: 'from-[#4F46E5] via-[#6366F1] to-[#7C3AED]',
      border: 'border-indigo-500/40',
      badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
      dashboardTab: 'admin_dashboard',
      dashboardTitle: 'Admin Console'
    }
  };

  const currentRoleConfig = roleConfigs[currentRole] || roleConfigs.user;
  const RoleIcon = currentRoleConfig.icon;

  const isDashboardActive = ['user_dashboard', 'expert_dashboard', 'admin_dashboard'].includes(activeTab);

  const navItems = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'browse', label: 'Browse', icon: ShoppingBag },
    { id: 'compare', label: 'Compare', icon: BarChart2, count: compareCount },
    { id: 'stores', label: 'Store Deals', icon: Building2 },
    { id: 'experts', label: '1:1 Experts', icon: Users },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'wisebot', label: 'WiseBot AI', icon: Bot },
    { id: 'bookmarks', label: 'Bookmarks', icon: (props: any) => <WiseBookmarkIcon size={14} active={props?.isActive} className={props?.className} />, count: favoritesCount },
  ];

  return (
    <header 
      className="sticky top-0 z-40 bg-white/90 dark:bg-[#070913]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg dark:shadow-black/40 transition-colors duration-200" 
      id="main-header"
    >
      {/* Top micro-glow accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#4F46E5] via-[#7C3AED] to-transparent opacity-80" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Tier 1: Brand Logo, Role Switcher, Hub Shortcut & Profile / Actions */}
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

            {/* Quick Role Switcher Pill with live status dot */}
            <button
              onClick={onOpenRoleSelector}
              id="header-role-switcher-btn"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider bg-slate-100/90 hover:bg-slate-200/90 dark:bg-[#111627] dark:hover:bg-[#182038] border border-slate-300/70 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm group shrink-0"
              title="Click to Switch User / Expert / Admin Role Profile"
            >
              <div className={`p-1 rounded-lg bg-gradient-to-r ${currentRoleConfig.gradient} text-white shadow-xs`}>
                <RoleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
              <span className="font-extrabold">{currentRoleConfig.badge}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* Right: Role Dashboard Hub, Theme Toggle, & Authentication / Profile */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            
            {/* Direct Role Dashboard Button */}
            <button
              onClick={() => setActiveTab(currentRoleConfig.dashboardTab)}
              id="header-dashboard-link-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border shrink-0 ${
                isDashboardActive
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white border-transparent shadow-md shadow-[#4F46E5]/30 ring-2 ring-[#4F46E5]/20'
                  : 'bg-slate-100/90 hover:bg-indigo-50 dark:bg-[#111627] dark:hover:bg-[#182038] text-[#4F46E5] dark:text-[#818CF8] border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-500/50'
              }`}
              title={`Open ${currentRoleConfig.dashboardTitle}`}
            >
              <Layout className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{currentRoleConfig.dashboardTitle}</span>
              <span className="sm:hidden">Hub</span>
            </button>

            {/* Theme Toggle Button (Light/Dark) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 dark:bg-[#111627] dark:hover:bg-[#182038] border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-[#FBBF24] transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs shrink-0 hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[#FBBF24] fill-[#FBBF24]/20" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 fill-slate-200" />
              )}
            </button>

            {/* User Profile / Authentication Area */}
            {user ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onToggleTopBar('profile')}
                  id="header-user-profile-btn"
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all duration-200 cursor-pointer shadow-xs ${
                    isTopBarOpen 
                      ? 'border-[#7C3AED] bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC] ring-2 ring-[#7C3AED]/20' 
                      : 'bg-slate-100/90 dark:bg-[#111627] hover:bg-slate-200/90 dark:hover:bg-[#182038] border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                  }`}
                  title={`Logged in as ${user.name} (${user.email})`}
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={onLogout}
                  id="header-logout-btn"
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200 cursor-pointer shrink-0"
                  title="Sign Out Profile"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onToggleTopBar('auth')}
                  id="header-signin-btn"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:text-[#4F46E5] dark:hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#111627] transition-all duration-200 cursor-pointer shrink-0"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => onLoginClick()}
                  id="header-getstarted-btn"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 shadow-md shadow-[#4F46E5]/30 hover:shadow-lg hover:shadow-[#4F46E5]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#FBBF24]" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tier 2: Dedicated, Centered Main Navigation Bar with Glass Island */}
        <div className="flex items-center justify-center py-2 px-1 border-t border-slate-100/90 dark:border-slate-800/60">
          <nav 
            className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-100/95 dark:bg-[#101526]/95 border border-slate-200/90 dark:border-slate-700/80 backdrop-blur-xl max-w-full shadow-xs" 
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white border-transparent shadow-md shadow-[#4F46E5]/30 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-[#1A223B] border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 shadow-none'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} isActive={isActive} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`ml-0.5 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs ${
                      isActive ? 'bg-white/30 text-white' : 'bg-[#EF4444]'
                    }`}>
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
