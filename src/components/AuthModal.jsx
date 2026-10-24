import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  ShoppingBag, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles,
  ExternalLink,
  Send,
  Shield,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import Logo from './Logo.jsx';
import { 
  loginUser, 
  registerUser, 
  requestRegistrationActivation,
  verifyRegistrationActivation,
  resendRegistrationActivation,
  requestPasswordReset, 
  completePasswordReset,
  getRegisteredUsers,
  registerOrSyncGoogleUser
} from '../utils/authService.js';

export default function AuthModal({ 
  onClose, 
  onAuthSuccess, 
  initialRole = 'user', 
  initialMode = 'login',
  roleNotice = null 
}) {
  // Step: 'role_select' | 'credentials' | 'activation_otp' | 'forgot_password'
  // Always start with asking "Continue to WiseFind as: Customer, Advisor, Admin"
  const [step, setStep] = useState('role_select');

  const [selectedRole, setSelectedRole] = useState(
    initialRole === 'advisor' ? 'expert' : initialRole
  );
  // 'login' vs 'signup'
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  
  // Show / Hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Common Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Account Activation Flow State
  const [activationEmail, setActivationEmail] = useState('');
  const [activationOtp, setActivationOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Customer specific credentials
  const [customerInterest, setCustomerInterest] = useState('Smartphones & Flagships');

  // Advisor specific credentials
  const [advisorCategory, setAdvisorCategory] = useState('Laptops & Workstations');
  const [advisorExperience, setAdvisorExperience] = useState('8');
  const [advisorPortfolio, setAdvisorPortfolio] = useState('');

  // Admin specific credentials
  const [adminSecurityPin, setAdminSecurityPin] = useState('');

  // Forgot Password Real Flow State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetStep, setResetStep] = useState('request'); // 'request' | 'verify' | 'success'
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Feedback states
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Role Metadata
  const roleConfigs = {
    user: {
      id: 'user',
      title: 'Customer (Shopper)',
      badge: 'Customer Portal',
      subtitle: 'Best verified prices, instant bank discounts & AI buying guidance',
      icon: ShoppingBag,
      gradient: 'from-[#4F46E5] to-[#6366F1]',
      border: 'border-[#4F46E5]',
      accentBg: 'bg-[#4F46E5]/15 text-[#4F46E5] dark:text-[#818CF8]',
      dashboardName: 'WiseFind Home'
    },
    expert: {
      id: 'expert',
      title: 'Category Advisor',
      badge: 'Advisor Desk',
      subtitle: '1:1 Client consultations, custom spec audits & advisory fees',
      icon: Users,
      gradient: 'from-[#7C3AED] to-[#9333EA]',
      border: 'border-[#7C3AED]',
      accentBg: 'bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC]',
      dashboardName: 'Advisor Desk'
    },
    admin: {
      id: 'admin',
      title: 'Platform Administrator',
      badge: 'Admin Console',
      subtitle: 'Hardware catalog curation, advisor verifications & system telemetry',
      icon: ShieldCheck,
      gradient: 'from-[#4F46E5] via-[#6366F1] to-[#7C3AED]',
      border: 'border-indigo-500',
      accentBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
      dashboardName: 'Admin Command Center'
    }
  };

  const currentRoleConfig = roleConfigs[selectedRole] || roleConfigs.user;
  const RoleIcon = currentRoleConfig.icon;

  // Sync initial state if props change
  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
    setSelectedRole(initialRole === 'advisor' ? 'expert' : initialRole);
    setError(null);
    setSuccessMsg(null);
  }, [initialMode, initialRole]);

  // Handle Role Selection from Step 1
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setStep('credentials');
    setError(null);
    setSuccessMsg(null);
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Google Sign-in Handler supporting Localhost Callback & Node.js OAuth
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setIsGoogleLoading(true);

    // Direct Localhost Google OAuth 2.0 Backend Flow
    try {
      const statusRes = await fetch('/api/auth/google/status');
      const status = statusRes.ok 
        ? await statusRes.json() 
        : { configured: false, callbackUrl: 'http://localhost:3000/api/auth/google/callback' };

      if (!status.configured) {
        setError('Google Sign-In is not configured on this server. Please sign in using your account email & password.');
        setIsGoogleLoading(false);
        return;
      }

      // Open centered OAuth popup window
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        `/api/auth/google?role=${encodeURIComponent(selectedRole)}`,
        'wisefind_google_auth',
        `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no`
      );

      if (!popup) {
        window.location.href = `/api/auth/google?role=${encodeURIComponent(selectedRole)}`;
        return;
      }

      const handleAuthMessage = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === 'WISEFIND_GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleAuthMessage);
          const loggedUser = event.data.user;
          registerOrSyncGoogleUser(loggedUser);
          setSuccessMsg(`Authenticated successfully as ${loggedUser.name}! Opening ${currentRoleConfig.dashboardName}...`);
          setTimeout(() => {
            onAuthSuccess(loggedUser, selectedRole);
            onClose();
          }, 600);
        } else if (event.data?.type === 'WISEFIND_GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', handleAuthMessage);
          setError(event.data.error || 'Google Sign-In failed.');
          setIsGoogleLoading(false);
        }
      };

      window.addEventListener('message', handleAuthMessage);

      const checkTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkTimer);
          window.removeEventListener('message', handleAuthMessage);
          setIsGoogleLoading(false);
        }
      }, 500);

    } catch (err) {
      console.error('Google Auth Error:', err);
      setError('Google Sign-In could not be initiated. Please verify backend server is running.');
      setIsGoogleLoading(false);
    }
  };

  // Credentials Submission Handler
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (isSignUp) {
      // Sign Up Flow: Request actual account activation email with 6-digit OTP
      setIsSubmitting(true);
      const result = await requestRegistrationActivation({
        name: name.trim(),
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword,
        role: selectedRole,
        advisorCategory: selectedRole === 'expert' ? advisorCategory : undefined,
        advisorExperience: selectedRole === 'expert' ? advisorExperience : undefined,
        adminPin: selectedRole === 'admin' ? adminSecurityPin : undefined
      });

      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setActivationEmail(result.email);
      setActivationOtp('');
      setStep('activation_otp');
      setSuccessMsg(result.message || `Activation code sent to ${result.email} from hello.wisefind@gmail.com.`);
      setResendCooldown(30);

    } else {
      // Login Flow
      setIsSubmitting(true);
      const result = loginUser({
        email: email.trim(),
        password: password,
        role: selectedRole,
        adminPin: selectedRole === 'admin' ? adminSecurityPin : undefined
      });

      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccessMsg(`Credentials verified! Welcome back, ${result.user.name}. Opening ${currentRoleConfig.dashboardName}...`);
      setTimeout(() => {
        onAuthSuccess(result.user, selectedRole);
        onClose();
      }, 700);
    }
  };

  // Account Activation Code Verification Handler
  const handleVerifyActivation = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const result = await verifyRegistrationActivation({
      email: activationEmail,
      otp: activationOtp
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccessMsg(`Account activated successfully! Welcome to WiseFind, ${result.user.name}. Opening ${currentRoleConfig.dashboardName}...`);
    setTimeout(() => {
      onAuthSuccess(result.user, selectedRole);
      onClose();
    }, 800);
  };

  // Resend Activation Code Handler
  const handleResendActivationCode = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    const result = await resendRegistrationActivation(activationEmail);
    if (result.success) {
      setSuccessMsg(`A fresh activation code has been sent to ${activationEmail} from hello.wisefind@gmail.com.`);
      setResendCooldown(30);
    } else {
      setError(result.error || 'Failed to resend activation code.');
    }
  };

  // Step 1: Request Password Reset & Dispatch Real Email from hello.wisefind@gmail.com
  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await requestPasswordReset(forgotEmail);
      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error);
        return;
      }

      setResetStep('verify');
      setResetOtp('');
      setSuccessMsg(`Verification email dispatched from hello.wisefind@gmail.com to ${res.email}. Valid for 15 minutes.`);
    } catch (err) {
      setIsSubmitting(false);
      setError("Failed to request password reset. Please try again.");
    }
  };

  // Step 2: Verify OTP and Reset Password in MongoDB
  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await completePasswordReset({
        email: forgotEmail,
        otp: resetOtp,
        newPassword,
        confirmNewPassword
      });
      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error);
        return;
      }

      setResetStep('success');
      setSuccessMsg(res.message);
    } catch (err) {
      setIsSubmitting(false);
      setError("Failed to verify code. Please try again.");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in" 
      id="auth-modal-overlay"
    >
      <div 
        className="relative w-full max-w-lg mx-auto bg-white dark:bg-[#0E1322] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto transition-all"
        id="auth-modal-content"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7C3AED]/20 via-[#4F46E5]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Modal Close Button */}
        <button 
          onClick={onClose}
          id="auth-modal-close-btn"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <Logo size={26} showText={true} />
          <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Access Portal
          </span>
        </div>

        {/* Dynamic Role Notice Banner if passed */}
        {roleNotice && (
          <div className="mb-4 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500 shrink-0" />
            <span>{roleNotice}</span>
          </div>
        )}

        {/* =========================================================================
            STAGE 1: ROLE SELECTION ("Continue as Customer, Advisor, Admin")
           ========================================================================= */}
        {step === 'role_select' && (
          <div className="space-y-4 animate-fade-in" id="auth-role-select-screen">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Continue to WiseFind
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                First select your role to tailor your experience and open your dedicated dashboard:
              </p>
            </div>

            {/* 3 Prominent Role Choice Cards */}
            <div className="space-y-2.5 pt-1">
              {/* Card 1: Customer */}
              <div
                onClick={() => handleSelectRole('user')}
                id="role-select-card-user"
                className="group p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#4F46E5] dark:hover:border-[#4F46E5] bg-slate-50/70 hover:bg-indigo-50/40 dark:bg-[#12182B]/60 dark:hover:bg-[#161E36] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-[#4F46E5]/15 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">Customer (Shopper)</span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4F46E5]/15 text-[#4F46E5] dark:text-[#818CF8]">
                        Customer Hub
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      Find verified deals, compare specs across stores & get AI buying advice
                    </p>
                  </div>
                </div>
                <div className="shrink-0 h-8 w-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Card 2: Advisor */}
              <div
                onClick={() => handleSelectRole('expert')}
                id="role-select-card-expert"
                className="group p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#7C3AED] dark:hover:border-[#7C3AED] bg-slate-50/70 hover:bg-purple-50/40 dark:bg-[#12182B]/60 dark:hover:bg-[#161E36] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">Category Advisor</span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C084FC]">
                        Advisor Desk
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      Offer 1:1 client consultations, conduct tech audits & earn advisory fees
                    </p>
                  </div>
                </div>
                <div className="shrink-0 h-8 w-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-[#7C3AED] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Card 3: Admin */}
              <div
                onClick={() => handleSelectRole('admin')}
                id="role-select-card-admin"
                className="group p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/40 dark:bg-[#12182B]/60 dark:hover:bg-[#161E36] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">Platform Administrator</span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                        Admin Console
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      Catalog CRUD, advisor verification approvals, security & system telemetry
                    </p>
                  </div>
                </div>
                <div className="shrink-0 h-8 w-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Bottom info note */}
            <div className="pt-2 text-center border-t border-slate-200 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Already registered? Pick your role to directly sign in to your dashboard.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2: CREDENTIALS FLOW (TAILORED FOR SELECTED ROLE)
           ========================================================================= */}
        {step === 'credentials' && (
          <div className="space-y-4 animate-fade-in" id="auth-credentials-screen">
            
            {/* Top Navigation: Change Role button & Role Badge */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setStep('role_select');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-white transition-colors cursor-pointer"
                id="auth-change-role-btn"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Change Role</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${currentRoleConfig.accentBg}`}>
                  {currentRoleConfig.badge}
                </span>
              </div>
            </div>

            {/* Title & Mode Switcher Pills */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isSignUp ? `Create ${currentRoleConfig.title} Account` : `Sign In as ${currentRoleConfig.title}`}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {isSignUp 
                      ? `Register credentials to unlock access to ${currentRoleConfig.dashboardName}.`
                      : `Enter credentials to open ${currentRoleConfig.dashboardName}.`}
                  </p>
                </div>
              </div>

              {/* Mode Toggle Pills (Sign In vs Create Account) */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-[#12182B] rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  id="auth-tab-signin"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    !isSignUp
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="auth-tab-signup"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    isSignUp
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Error & Success Feedback Banners */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2 animate-shake" id="auth-error-banner">
                <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2 animate-pulse" id="auth-success-banner">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Google Sign-in Button (Customer and Advisor) */}
            {selectedRole !== 'admin' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isSubmitting}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isGoogleLoading ? 'Connecting...' : `Continue with Google (${currentRoleConfig.badge})`}</span>
                </button>

                <div className="flex items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                  <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Or with account credentials
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                </div>
              </>
            )}

            {/* Special Notice for Admin Sign Up */}
            {isSignUp && selectedRole === 'admin' ? (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                      Admin Accounts Restricted
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Platform Administrator accounts require security clearance. Verified staff can authenticate with their master credentials and Security PIN <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">982411</span>.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Main Role-Specific Credentials Form */
              <form onSubmit={handleCredentialsSubmit} className="space-y-3" id="auth-credentials-form">
                
                {/* Full Name (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ankit Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {selectedRole === 'admin' ? 'Admin Staff Email' : selectedRole === 'expert' ? 'Advisor Professional Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder={selectedRole === 'admin' ? 'admin@company.com' : selectedRole === 'expert' ? 'advisor@domain.com' : 'you@example.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Customer Specific Interest on Sign Up */}
                {isSignUp && selectedRole === 'user' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Primary Tech Interest
                    </label>
                    <select
                      value={customerInterest}
                      onChange={(e) => setCustomerInterest(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Smartphones & Flagships">Smartphones & Flagships</option>
                      <option value="Laptops & Workstations">Laptops & Workstations</option>
                      <option value="Audio & Headphones">Audio & Headphones</option>
                      <option value="Smart Home & Kitchen">Smart Home & Kitchen</option>
                      <option value="Photography & Cameras">Photography & Cameras</option>
                      <option value="PC Gaming & Hardware">PC Gaming & Hardware</option>
                    </select>
                  </div>
                )}

                {/* Advisor Specific Fields on Sign Up */}
                {isSignUp && selectedRole === 'expert' && (
                  <div className="space-y-2.5 pt-0.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Advisory Specialty
                        </label>
                        <select
                          value={advisorCategory}
                          onChange={(e) => setAdvisorCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="Laptops & Workstations">Laptops & Workstations</option>
                          <option value="Smartphones & Flagships">Smartphones & Flagships</option>
                          <option value="Audio & Headphones">Audio & Acoustics</option>
                          <option value="Smart Home & Kitchen">Smart Home Automation</option>
                          <option value="Photography & Cameras">Cameras & Optics</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={advisorExperience}
                          onChange={(e) => setAdvisorExperience(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        Portfolio / LinkedIn Profile Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={advisorPortfolio}
                        onChange={(e) => setAdvisorPortfolio(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}

                {/* Admin Master PIN (required for Admin portal) */}
                {selectedRole === 'admin' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        Admin Security PIN
                      </label>
                      <span className="text-[10px] text-indigo-500 font-bold">Standard Key: 982411</span>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Enter 6-digit Admin Security PIN"
                      value={adminSecurityPin}
                      onChange={(e) => setAdminSecurityPin(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Account Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        id="auth-forgot-password-link"
                        onClick={() => {
                          setForgotEmail(email);
                          setStep('forgot_password');
                          setResetStep('request');
                          setError(null);
                          setSuccessMsg(null);
                        }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="auth-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>{isSignUp ? 'Sending Activation Code...' : 'Verifying...'}</span>
                  ) : isSignUp ? (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Activation Code</span>
                    </>
                  ) : (
                    <span>Sign In to {currentRoleConfig.dashboardName}</span>
                  )}
                </button>
              </form>
            )}

          </div>
        )}

        {/* =========================================================================
            STAGE: ACCOUNT ACTIVATION & EMAIL VERIFICATION OTP
           ========================================================================= */}
        {step === 'activation_otp' && (
          <div className="space-y-4 animate-fade-in" id="auth-activation-screen">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Edit Details</span>
              </button>

              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                <ShieldCheck className="h-3 w-3" />
                <span>Email Verification</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Verify Your Email Address
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                We've sent an activation email with a 6-digit verification code to your address.
              </p>
            </div>

            {/* Email Info Banner */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                <Mail className="h-4 w-4" />
                <span>Activation Email Dispatched</span>
              </div>
              <p className="text-[12px] text-slate-600 dark:text-slate-300">
                Check your inbox at <strong className="text-slate-900 dark:text-white">{activationEmail}</strong> for the verification code sent from <strong className="text-indigo-500 dark:text-indigo-400">hello.wisefind@gmail.com</strong>.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2 animate-shake">
                <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerifyActivation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Enter 6-Digit Activation Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="• • • • • •"
                  value={activationOtp}
                  onChange={(e) => setActivationOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-center font-mono text-2xl font-black tracking-[0.4em] text-indigo-600 dark:text-indigo-400 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || activationOtp.length !== 6}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Activate Account & Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Didn't receive the email?{' '}
                <button
                  type="button"
                  onClick={handleResendActivationCode}
                  disabled={resendCooldown > 0}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Activation Email'}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 3: FORGOT PASSWORD FLOW (REAL EMAIL DISPATCH & 6-DIGIT OTP)
           ========================================================================= */}
        {step === 'forgot_password' && (
          <div className="space-y-4 animate-fade-in" id="auth-forgot-password-screen">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </button>

              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">
                <KeyRound className="h-3 w-3" />
                <span>Password Recovery</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {resetStep === 'request' && 'Reset Account Password'}
                {resetStep === 'verify' && 'Enter 6-Digit Security Code'}
                {resetStep === 'success' && 'Password Reset Complete!'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {resetStep === 'request' && 'Enter your registered email address to receive your 6-digit security OTP.'}
                {resetStep === 'verify' && 'Security email dispatched. Enter the verification code and set your new password.'}
                {resetStep === 'success' && 'Your account security credentials have been updated successfully.'}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* SUB-STEP 1: REQUEST EMAIL */}
            {resetStep === 'request' && (
              <form onSubmit={handleRequestPasswordReset} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Registered Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="your.registered.email@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="dispatch-reset-email-btn"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</span>
                </button>
              </form>
            )}

            {/* SUB-STEP 2: VERIFY OTP AND SET NEW PASSWORD */}
            {resetStep === 'verify' && (
              <form onSubmit={handleVerifyOtpAndReset} className="space-y-3">
                
                {/* Email Dispatch Info Banner */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                    <Mail className="h-4 w-4" />
                    <span>Verification Email Dispatched</span>
                  </div>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300">
                    A 6-digit security code was sent to <strong className="text-slate-900 dark:text-white">{forgotEmail}</strong> from <strong className="text-amber-500 dark:text-amber-400">hello.wisefind@gmail.com</strong>. Please check your inbox or spam folder.
                  </p>
                </div>

                {/* 6-Digit OTP Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Enter 6-Digit Security Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-mono text-xl font-black tracking-[0.3em] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Establish New Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Confirm New Security Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  id="confirm-reset-btn"
                  disabled={isSubmitting || resetOtp.length !== 6}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isSubmitting ? 'Verifying...' : 'Update Password & Save'}</span>
                </button>
              </form>
            )}

            {/* SUB-STEP 3: SUCCESS */}
            {resetStep === 'success' && (
              <div className="text-center py-4 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your new credentials have been persisted. You can now log into your WiseFind profile immediately.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setIsSignUp(false);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
                >
                  Sign In Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
