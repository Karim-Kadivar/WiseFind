import React from 'react';
import { UserRole } from '../types';
import { ShoppingBag, Users, ShieldCheck, Sparkles, X, CheckCircle2, ArrowRight, Bot, Cpu, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  title?: string;
  subtitle?: string;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  title = "Select Your Experience",
  subtitle = "WiseFind tailors tools, navigation, and dashboards according to your operational role."
}) => {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'user' as UserRole,
      title: 'Consumer & Shopper',
      badge: 'Shopper Workspace',
      icon: ShoppingBag,
      themeColor: 'from-[#4F46E5] to-[#6366F1]',
      borderHover: 'hover:border-[#4F46E5]',
      accentBg: 'bg-[#4F46E5]/15 text-[#818CF8]',
      description: 'Explore unbiased hardware specifications, compare devices side-by-side, track price drops across Croma & Amazon, and manage smart wishlists.',
      features: [
        'Personalized Wishlists & Price Tracker',
        'Direct Access to WiseBot AI Advisor',
        'Compare Matrix with up to 4 devices',
        'Book 1:1 sessions with verified experts'
      ],
      dashboardName: 'Shopper Dashboard'
    },
    {
      id: 'expert' as UserRole,
      title: 'Hardware Expert / Reviewer',
      badge: 'Expert Desk',
      icon: Users,
      themeColor: 'from-[#7C3AED] to-[#9333EA]',
      borderHover: 'hover:border-[#7C3AED]',
      accentBg: 'bg-[#7C3AED]/15 text-[#C084FC]',
      description: 'Manage 1:1 client consultation requests, conduct live text and video spec audits, adjust your hourly consultation rate (₹), and review analytics.',
      features: [
        'Live Client Consultation Management',
        'Toggle Live Availability & Hourly Pricing',
        'Expert Profile & Verified Badge Status',
        'Client Reviews & Consultation History'
      ],
      dashboardName: 'Expert Desk & Console'
    },
    {
      id: 'admin' as UserRole,
      title: 'Platform Administrator',
      badge: 'Admin Console',
      icon: ShieldCheck,
      themeColor: 'from-[#4F46E5] via-[#6366F1] to-[#7C3AED]',
      borderHover: 'hover:border-[#818CF8]',
      accentBg: 'bg-indigo-500/20 text-indigo-300',
      description: 'Full administrative access to manage product databases, add and update specifications, publish buying guides, and monitor telemetry analytics.',
      features: [
        'Product Catalog CRUD & Live Spec Editor',
        'Publish & Edit Buying Guides',
        'Review Expert Verification Applications',
        'System Telemetry & Performance Logs'
      ],
      dashboardName: 'Admin Command Center'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#0E1322] border-2 border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 overflow-hidden"
          id="role-selector-modal"
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#7C3AED]/20 via-[#4F46E5]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#4F46E5]/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 border border-[#4F46E5]/40 text-[#818CF8] text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
              <span>Role-Based Operational Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {roles.map((role) => {
              const Icon = role.icon;
              const isCurrent = currentRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => {
                    onSelectRole(role.id);
                    onClose();
                  }}
                  className={`group relative flex flex-col justify-between p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer bg-[#12182B]/90 hover:bg-[#151D35] ${
                    isCurrent
                      ? 'border-[#4F46E5] ring-2 ring-[#7C3AED]/40 shadow-lg shadow-[#4F46E5]/20'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                  id={`role-card-${role.id}`}
                >
                  {/* Top Badge */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className={`p-3 rounded-xl ${role.accentBg} border border-white/10 group-hover:scale-105 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200">
                          {role.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-white group-hover:text-[#818CF8] transition-colors mb-2">
                      {role.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {role.description}
                    </p>

                    <div className="space-y-2 border-t border-slate-800/80 pt-3 mb-6">
                      {role.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#4F46E5] flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select button */}
                  <button
                    type="button"
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-[#4F46E5]/30'
                        : 'bg-slate-800 hover:bg-[#4F46E5] text-slate-200 hover:text-white border border-slate-700 group-hover:border-[#4F46E5]'
                    }`}
                  >
                    <span>{isCurrent ? 'Open ' + role.dashboardName : 'Switch to ' + role.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick info note */}
          <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
              <span>You can effortlessly switch roles anytime from the top navigation bar.</span>
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white font-bold text-xs underline cursor-pointer"
            >
              Continue to general shopping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
