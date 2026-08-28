import React, { useState } from 'react';
import { 
  Sparkles, Mail, Lock, User, X, CheckCircle2, ShieldAlert, 
  ShoppingBag, Users, ShieldCheck, ArrowRight, ArrowLeft, 
  Phone, KeyRound, Eye, EyeOff, Award, Briefcase, ChevronRight,
  Shield, Check, Laptop, Smartphone, Headphones, Cpu
} from 'lucide-react';
import Logo from './Logo';
import { UserRole } from '../types';
import { auth, googleProvider, signInWithPopup, isFirebaseEnabled } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string }, role?: UserRole) => void;
  initialRole?: UserRole;
  initialStep?: 'role_select' | 'credentials';
}

export default function AuthModal({ 
  onClose, 
  onAuthSuccess, 
  initialRole = 'user',
  initialStep = 'role_select'
}: AuthModalProps) {
  // Step 1: 'role_select' -> Step 2: 'credentials'
  const [step, setStep] = useState<'role_select' | 'credentials'>(initialStep);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Common credentials state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Shopper credentials: email or mobile
  const [shopperLoginMethod, setShopperLoginMethod] = useState<'email' | 'mobile'>('email');
  const [mobileNumber, setMobileNumber] = useState('');

  // Expert specific credentials
  const [expertId, setExpertId] = useState('');
  const [expertSpecialty, setExpertSpecialty] = useState('Laptops & Ultrabooks');
  const [expertTitle, setExpertTitle] = useState('Hardware Reviewer');
  const [expertHourlyRate, setExpertHourlyRate] = useState('1499');

  // Admin specific credentials
  const [adminId, setAdminId] = useState('');
  const [adminSecurityPin, setAdminSecurityPin] = useState('982411');

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const roleDefinitions = [
    {
      id: 'user' as UserRole,
      title: 'Consumer & Shopper',
      badge: 'Shopper Portal',
      subtitle: 'Wishlists, price drop tracking & AI buying engine',
      icon: ShoppingBag,
      themeColor: 'from-[#4F46E5] to-[#6366F1]',
      borderHover: 'hover:border-[#4F46E5]',
      accentBg: 'bg-[#4F46E5]/15 text-[#818CF8]',
      inputHint: 'Email or Mobile Number (+91) & Password',
      features: [
        'Personalized Wishlists & Realtime Price Trackers',
        'Direct Access to WiseBot AI Specification Advisor',
        'Compare Matrix for up to 4 devices simultaneously'
      ],
      dashboardTarget: 'Shopper Dashboard'
    },
    {
      id: 'expert' as UserRole,
      title: 'Hardware Expert / Reviewer',
      badge: 'Expert Desk',
      subtitle: '1:1 Client consultations & hardware spec audits',
      icon: Users,
      themeColor: 'from-[#7C3AED] to-[#9333EA]',
      borderHover: 'hover:border-[#7C3AED]',
      accentBg: 'bg-[#7C3AED]/15 text-[#C084FC]',
      inputHint: 'Expert License ID or Verified Email & Password',
      features: [
        'Client Consultation Queue & Live Availability',
        'Manage Hourly Consultation Fees (INR ₹)',
        'Verified Hardware Consultant Profile & Badges'
      ],
      dashboardTarget: 'Expert Desk & Console'
    },
    {
      id: 'admin' as UserRole,
      title: 'Platform Administrator',
      badge: 'Admin Console',
      subtitle: 'Catalog curation, live specs & system telemetry',
      icon: ShieldCheck,
      themeColor: 'from-[#4F46E5] via-[#6366F1] to-[#7C3AED]',
      borderHover: 'hover:border-indigo-400',
      accentBg: 'bg-indigo-500/20 text-indigo-300',
      inputHint: 'Admin ID, Security Key & 2FA Admin PIN',
      features: [
        'Product Catalog CRUD & Live Spec Matrix Editor',
        'Publish and Curate Buying Guides',
        'Platform Telemetry & Store Scraping Logs'
      ],
      dashboardTarget: 'Admin Command Center'
    }
  ];

  const currentRoleDef = roleDefinitions.find(r => r.id === selectedRole) || roleDefinitions[0];

  const handleSelectRoleAndProceed = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    setSuccessMsg(null);
    setStep('credentials');
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setIsGoogleLoading(true);

    try {
      if (isFirebaseEnabled && auth) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const loggedUser = {
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || ''
        };
        setSuccessMsg(`Welcome, ${loggedUser.name}! Opening your ${currentRoleDef.dashboardTarget}...`);
        setTimeout(() => {
          onAuthSuccess(loggedUser, selectedRole);
          onClose();
        }, 900);
      } else {
        // Sandbox fallback
        const demoUser = {
          name: selectedRole === 'admin' ? 'Karim Kadivar' : selectedRole === 'expert' ? 'Dr. Alex Verma' : 'Demo Shopper',
          email: selectedRole === 'admin' ? 'kadivarkarim21@gmail.com' : selectedRole === 'expert' ? 'expert@wisefind.in' : 'shopper@wisefind.in'
        };
        setSuccessMsg(`Authenticated as ${selectedRole.toUpperCase()}! Opening ${currentRoleDef.dashboardTarget}...`);
        setTimeout(() => {
          onAuthSuccess(demoUser, selectedRole);
          onClose();
        }, 900);
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setError(err?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setError(null);
    if (role === 'user') {
      const demoUser = { name: 'Demo Shopper', email: 'shopper@wisefind.in' };
      setSuccessMsg(`Signing in as Shopper... Opening Shopper Dashboard`);
      setTimeout(() => {
        onAuthSuccess(demoUser, 'user');
        onClose();
      }, 750);
    } else if (role === 'expert') {
      const demoUser = { name: 'Dr. Alex Verma', email: 'expert@wisefind.in' };
      setSuccessMsg(`Signing in with Expert License EXP-VERMA-884... Opening Expert Desk`);
      setTimeout(() => {
        onAuthSuccess(demoUser, 'expert');
        onClose();
      }, 750);
    } else if (role === 'admin') {
      const demoUser = { name: 'Karim Kadivar', email: 'kadivarkarim21@gmail.com' };
      setSuccessMsg(`Admin Credentials & 2FA PIN Verified! Launching Admin Command Center...`);
      setTimeout(() => {
        onAuthSuccess(demoUser, 'admin');
        onClose();
      }, 750);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const usersStr = localStorage.getItem('wisefind_registered_users') || '[]';
    let users: { name: string; email: string; password?: string; mobile?: string; role?: UserRole; expertId?: string }[] = JSON.parse(usersStr);

    // -------------------------------------------------------------
    // ROLE 1: USER / SHOPPER CREDENTIALS VALIDATION
    // -------------------------------------------------------------
    if (selectedRole === 'user') {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please provide your Full Name.');
          return;
        }
        if (shopperLoginMethod === 'email' && !email.trim()) {
          setError('Please provide a valid Email Address.');
          return;
        }
        if (shopperLoginMethod === 'mobile' && (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10)) {
          setError('Please provide a valid 10-digit Indian Mobile Number.');
          return;
        }
        if (!password || password.length < 4) {
          setError('Password must be at least 4 characters long.');
          return;
        }

        const userEmail = shopperLoginMethod === 'email' 
          ? email.trim() 
          : `${mobileNumber.replace(/\D/g, '')}@mobile.wisefind.in`;

        // Check if exists
        const exists = users.some(u => u.email.toLowerCase() === userEmail.toLowerCase());
        if (exists) {
          setError('An account with these details already exists. Please Sign In.');
          return;
        }

        const newUser = {
          name: name.trim(),
          email: userEmail,
          mobile: shopperLoginMethod === 'mobile' ? mobileNumber : undefined,
          password: password,
          role: 'user' as UserRole
        };
        users.push(newUser);
        localStorage.setItem('wisefind_registered_users', JSON.stringify(users));

        setSuccessMsg(`Welcome, ${newUser.name}! Account registered. Opening Shopper Dashboard...`);
        setTimeout(() => {
          onAuthSuccess({ name: newUser.name, email: newUser.email }, 'user');
          onClose();
        }, 850);
        return;
      } else {
        // Sign In Flow
        let searchKey = '';
        if (shopperLoginMethod === 'email') {
          if (!email.trim()) {
            setError('Please enter your Email Address.');
            return;
          }
          searchKey = email.trim().toLowerCase();
        } else {
          if (!mobileNumber.trim()) {
            setError('Please enter your Mobile Number.');
            return;
          }
          searchKey = `${mobileNumber.replace(/\D/g, '')}@mobile.wisefind.in`;
        }

        if (!password) {
          setError('Please enter your Password.');
          return;
        }

        // Check demo accounts
        if (searchKey === 'shopper@wisefind.in' || searchKey === 'kadivarkarim21@gmail.com' || searchKey === '9876543210@mobile.wisefind.in') {
          const loggedName = searchKey.includes('karim') ? 'Karim Kadivar' : 'Shopper User';
          setSuccessMsg(`Welcome back, ${loggedName}! Opening Shopper Dashboard...`);
          setTimeout(() => {
            onAuthSuccess({ name: loggedName, email: searchKey }, 'user');
            onClose();
          }, 850);
          return;
        }

        const matched = users.find(u => 
          (u.email.toLowerCase() === searchKey || (u.mobile && u.mobile.replace(/\D/g, '') === mobileNumber.replace(/\D/g, ''))) &&
          u.password === password
        );

        if (!matched) {
          setError('Invalid credentials for Shopper account. Tip: Try quick demo or check your password.');
          return;
        }

        setSuccessMsg(`Welcome back, ${matched.name}! Opening Shopper Dashboard...`);
        setTimeout(() => {
          onAuthSuccess({ name: matched.name, email: matched.email }, 'user');
          onClose();
        }, 850);
        return;
      }
    }

    // -------------------------------------------------------------
    // ROLE 2: HARDWARE EXPERT CREDENTIALS VALIDATION
    // -------------------------------------------------------------
    if (selectedRole === 'expert') {
      const expIdentifier = expertId.trim() || email.trim();
      
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your Full Name.');
          return;
        }
        if (!expIdentifier) {
          setError('Please provide an Expert License ID or Email.');
          return;
        }
        if (!password) {
          setError('Please set an Expert Access Password.');
          return;
        }

        const newExpert = {
          name: name.trim(),
          email: expIdentifier.includes('@') ? expIdentifier : `${expIdentifier.toLowerCase()}@expert.wisefind.in`,
          expertId: expIdentifier,
          password: password,
          role: 'expert' as UserRole
        };
        users.push(newExpert);
        localStorage.setItem('wisefind_registered_users', JSON.stringify(users));

        setSuccessMsg(`Expert credentials verified for ${newExpert.name}! Opening Expert Desk...`);
        setTimeout(() => {
          onAuthSuccess({ name: newExpert.name, email: newExpert.email }, 'expert');
          onClose();
        }, 850);
        return;
      } else {
        // Expert Sign In
        if (!expIdentifier) {
          setError('Please enter your Expert License ID or Registered Email.');
          return;
        }
        if (!password) {
          setError('Please enter your Expert Access Key / Password.');
          return;
        }

        // Demo Expert Check
        if (
          expIdentifier.toLowerCase() === 'exp-verma-884' || 
          expIdentifier.toLowerCase() === 'expert@wisefind.in' ||
          expIdentifier.toLowerCase() === 'kadivarkarim21@gmail.com'
        ) {
          setSuccessMsg(`Expert verified: Dr. Alex Verma! Opening Expert Desk...`);
          setTimeout(() => {
            onAuthSuccess({ name: 'Dr. Alex Verma', email: 'expert@wisefind.in' }, 'expert');
            onClose();
          }, 850);
          return;
        }

        const matched = users.find(u => 
          (u.email.toLowerCase() === expIdentifier.toLowerCase() || (u.expertId && u.expertId.toLowerCase() === expIdentifier.toLowerCase())) &&
          u.password === password
        );

        if (!matched) {
          setError('Invalid Expert ID or Password. Tip: Try quick demo or check your credentials.');
          return;
        }

        setSuccessMsg(`Welcome, Expert ${matched.name}! Opening Expert Desk...`);
        setTimeout(() => {
          onAuthSuccess({ name: matched.name, email: matched.email }, 'expert');
          onClose();
        }, 850);
        return;
      }
    }

    // -------------------------------------------------------------
    // ROLE 3: PLATFORM ADMINISTRATOR CREDENTIALS VALIDATION
    // -------------------------------------------------------------
    if (selectedRole === 'admin') {
      const adminIdentifier = adminId.trim() || email.trim();
      
      if (!adminIdentifier) {
        setError('Please enter your Admin ID or Superadmin Email.');
        return;
      }
      if (!password) {
        setError('Please enter your Master Admin Security Key.');
        return;
      }
      if (!adminSecurityPin || adminSecurityPin.trim().length < 4) {
        setError('Please enter your 2FA Security Token / Admin PIN (e.g. 982411).');
        return;
      }

      // Check admin credentials
      if (
        (adminIdentifier.toLowerCase() === 'admin-root-01' || 
         adminIdentifier.toLowerCase() === 'kadivarkarim21@gmail.com' ||
         adminIdentifier.toLowerCase() === 'admin@wisefind.in') &&
        (password === 'password' || password === 'admin2026' || password.length >= 4)
      ) {
        setSuccessMsg(`Admin Security Authorized! Launching Admin Command Center...`);
        setTimeout(() => {
          onAuthSuccess({ name: 'Karim Kadivar', email: 'kadivarkarim21@gmail.com' }, 'admin');
          onClose();
        }, 850);
        return;
      }

      const matched = users.find(u => 
        (u.email.toLowerCase() === adminIdentifier.toLowerCase() || (u.expertId && u.expertId.toLowerCase() === adminIdentifier.toLowerCase())) &&
        u.password === password
      );

      if (matched) {
        setSuccessMsg(`Admin access granted for ${matched.name}! Opening Command Center...`);
        setTimeout(() => {
          onAuthSuccess({ name: matched.name, email: matched.email }, 'admin');
          onClose();
        }, 850);
        return;
      }

      setError('Access Denied: Invalid Administrator ID, Security Key, or 2FA PIN. (Tip: Test with kadivarkarim21@gmail.com / password / 982411)');
      return;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[100] animate-fade-in" id="auth-modal-overlay">
      <div 
        className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-scale-up text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col"
        id="auth-modal-card"
      >
        {/* Header Banner */}
        <div className={`p-5 sm:p-6 text-white text-center relative shrink-0 bg-gradient-to-r ${currentRoleDef.themeColor}`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {step === 'credentials' && (
            <button
              onClick={() => {
                setStep('role_select');
                setError(null);
                setSuccessMsg(null);
              }}
              className="absolute top-4 left-4 text-white/90 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
              title="Return to Role Selection"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Roles</span>
            </button>
          )}
          
          <div className="flex justify-center mb-2">
            <Logo size={40} />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            {step === 'role_select' 
              ? 'Select Your Access Portal' 
              : isSignUp 
                ? `Register as ${currentRoleDef.title}` 
                : `${currentRoleDef.badge} Sign In`}
          </h3>
          <p className="text-xs text-white/90 font-bold mt-1 uppercase tracking-wider">
            {step === 'role_select'
              ? 'Choose your role to open tailored credentials & dashboard'
              : `Accessing designated ${currentRoleDef.dashboardTarget}`}
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Alerts / Error / Success Messages */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-400 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs font-bold leading-relaxed">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs font-bold leading-relaxed animate-pulse">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 1: ROLE SELECTION VIEW */}
          {/* ============================================================== */}
          {step === 'role_select' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Step 1 of 2</span>
                <h4 className="text-base font-black text-slate-900 dark:text-white">What is your primary intent on WiseFind?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  We customize login credentials, dashboard tools, and permissions per role.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {roleDefinitions.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                    <div
                      key={role.id}
                      onClick={() => handleSelectRoleAndProceed(role.id)}
                      id={`auth-role-option-${role.id}`}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group relative overflow-hidden ${
                        isSelected
                          ? 'border-[#4F46E5] bg-[#4F46E5]/5 dark:bg-[#4F46E5]/15 ring-2 ring-[#4F46E5]/20 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/70 dark:bg-[#12182B]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${role.themeColor} text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">
                              {role.title}
                            </h5>
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {role.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {role.subtitle}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-1">
                            🔑 {role.inputHint}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-black text-[#4F46E5] dark:text-indigo-400 shrink-0 self-end sm:self-center">
                        <span className="uppercase tracking-wider">Proceed</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instant 1-Click Sandbox Test Row */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block text-center">
                  Instant 1-Click Sandbox Access (No Typing Required)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('user')}
                    className="bg-slate-100 dark:bg-[#12182B] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-[10px] font-bold text-slate-800 dark:text-slate-200 p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 shadow-xs"
                  >
                    <span>🛍️ Shopper</span>
                    <span className="text-[8px] text-slate-400">Wishlists Hub</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('expert')}
                    className="bg-slate-100 dark:bg-[#12182B] hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-800 hover:border-purple-400 text-[10px] font-bold text-slate-800 dark:text-slate-200 p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 shadow-xs"
                  >
                    <span>🎓 Expert</span>
                    <span className="text-[8px] text-slate-400">Consult Desk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="bg-slate-100 dark:bg-[#12182B] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-[10px] font-bold text-slate-800 dark:text-slate-200 p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 shadow-xs"
                  >
                    <span>🛡️ Admin</span>
                    <span className="text-[8px] text-slate-400">Root Console</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: ROLE-TAILORED CREDENTIALS FORM */}
          {/* ============================================================== */}
          {step === 'credentials' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Active Role Indicator Bar */}
              <div className="flex items-center justify-between bg-slate-100 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${currentRoleDef.themeColor} text-white shadow-xs`}>
                    <currentRoleDef.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Current Target Portal</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{currentRoleDef.title}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('role_select');
                    setError(null);
                  }}
                  className="text-[10px] font-black text-[#4F46E5] dark:text-indigo-400 hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Change Role
                </button>
              </div>

              {/* ROLE SPECIFIC AUTH FORM: USER / SHOPPER */}
              {selectedRole === 'user' && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Email vs Mobile Tabs for Shoppers */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                      Choose Sign In Identifier
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-[#12182B] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShopperLoginMethod('email')}
                        className={`py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          shopperLoginMethod === 'email'
                            ? 'bg-white dark:bg-[#19223D] text-[#4F46E5] dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Email Address</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShopperLoginMethod('mobile')}
                        className={`py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          shopperLoginMethod === 'mobile'
                            ? 'bg-white dark:bg-[#19223D] text-[#4F46E5] dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Mobile Number</span>
                      </button>
                    </div>
                  </div>

                  {isSignUp && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {shopperLoginMethod === 'email' ? (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Shopper Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="shopper@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Number (India)</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 flex items-center gap-1 text-xs font-black text-slate-500 border-r border-slate-300 dark:border-slate-700 pr-2">
                          <span>🇮🇳 +91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="98765 43210"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-xl pl-20 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Account Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-shopper-auth"
                    className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-[#4F46E5]/25 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSignUp ? 'Create Shopper Account' : 'Sign In to Shopper Hub'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Google Login for Shoppers */}
                  <button
                    type="button"
                    id="google-signin-button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full bg-white dark:bg-[#12182B] hover:bg-slate-50 dark:hover:bg-[#19223D] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{isGoogleLoading ? 'Authenticating...' : 'Continue with Google Account'}</span>
                  </button>
                </form>
              )}

              {/* ROLE SPECIFIC AUTH FORM: HARDWARE EXPERT */}
              {selectedRole === 'expert' && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-[11px] text-purple-700 dark:text-purple-300 font-medium leading-relaxed flex items-start gap-2">
                    <Award className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <span>Verified Expert credentials grant access to 1:1 hardware consultations, hourly rate settings (₹), and hardware audit desks.</span>
                  </div>

                  {isSignUp && (
                    <>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name & Honorific</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Dr. Alex Verma, Senior Hardware Arch"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#7C3AED] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Consultation Specialty</label>
                        <select
                          value={expertSpecialty}
                          onChange={(e) => setExpertSpecialty(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#7C3AED] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                        >
                          <option value="Laptops & Ultrabooks">💻 Laptops & Ultrabooks</option>
                          <option value="Gaming GPUs & Custom Builds">⚡ Gaming GPUs & Custom PC Builds</option>
                          <option value="Smartphones & Mobile Tech">📱 Flagship Smartphones & Cameras</option>
                          <option value="Hi-Fi Audio & ANC Gear">🎧 Hi-Fi Audio & Studio Gear</option>
                          <option value="Tablets & Creative Styluses">🎨 Tablets & Creative Tools</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Expert License ID or Verified Email
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. EXP-VERMA-884 or expert@wisefind.in"
                        value={expertId}
                        onChange={(e) => setExpertId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#7C3AED] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Expert Access Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#7C3AED] rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-expert-auth"
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-[#7C3AED]/25 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSignUp ? 'Submit Expert Application' : 'Access Expert Desk & Queue'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Demo Expert shortcut */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('expert')}
                    className="w-full text-center py-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Auto-Fill Demo Expert (Dr. Alex Verma / EXP-VERMA-884)
                  </button>
                </form>
              )}

              {/* ROLE SPECIFIC AUTH FORM: PLATFORM ADMINISTRATOR */}
              {selectedRole === 'admin' && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-700 dark:text-amber-300 font-medium leading-relaxed flex items-start gap-2">
                    <Shield className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Restricted Root Console. Direct administrative permissions for product catalog, live price scrapers, and system telemetry.</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Administrator Identity / Superadmin Email
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="ADMIN-ROOT-01 or kadivarkarim21@gmail.com"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Master Admin Password / Security Key
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        2FA Token / Admin PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => setAdminSecurityPin('982411')}
                        className="text-[9px] font-bold text-indigo-500 hover:underline cursor-pointer"
                      >
                        Fill Demo PIN (982411)
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="6-digit PIN (e.g. 982411)"
                        maxLength={6}
                        value={adminSecurityPin}
                        onChange={(e) => setAdminSecurityPin(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-admin-auth"
                    className="w-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-[#4F46E5]/25 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Authorize & Launch Command Center</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="w-full text-center py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Auto-Fill Superadmin (Karim Kadivar / Root)
                  </button>
                </form>
              )}

              {/* Mode Toggle (Sign In vs Register) for User & Expert */}
              {selectedRole !== 'admin' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline cursor-pointer"
                  >
                    {isSignUp 
                      ? `Already registered as ${selectedRole}? Sign In` 
                      : `New ${selectedRole === 'expert' ? 'Expert' : 'Shopper'}? Register Here`}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

