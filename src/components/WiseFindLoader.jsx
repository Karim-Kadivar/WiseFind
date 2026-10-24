import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bot, Search, CheckCircle2 } from 'lucide-react';

/**
 * WiseFind Logo Geometric Vector (Replicating exact monogram: Blue/Violet "F" & "W" left + Gold "W" right)
 * Coordinates calibrated on a 100 x 100 viewBox for crisp scaling at any resolution.
 */
export function WiseFindMonogramSVG({ 
  className = '', 
  size = 48,
  animateGlow = true,
  animateSweep = true,
  animatePulse = false,
  strokeMode = false,
  badge = true
}) {
  return (
    <div 
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          {/* Blue-Indigo-Violet Gradient for "F" & Left Wing of "W" */}
          <linearGradient id="wf-grad-blue-violet" x1="20" y1="15" x2="52" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Golden Amber Gradient for Right Wing & Pillar of "W" */}
          <linearGradient id="wf-grad-amber-gold" x1="58" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Holographic light sweep gradient */}
          <linearGradient id="wf-sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.65" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Dynamic neon glow filter */}
          <filter id="wf-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Clip path for light shimmer across the monogram */}
          <clipPath id="wf-monogram-clip">
            {/* Top "F" */}
            <path d="M 28 16 C 24 16, 22 18, 22 23 L 22 47 C 22 51, 24 51.5, 27 51.5 L 49 51.5 C 51 51.5, 52 50, 52 48 L 52 42 C 52 40, 51 39, 49 39 L 36 39 L 36 29 L 52 29 C 54 29, 55 27.5, 55 25.5 L 55 19.5 C 55 17.5, 54 16, 50 16 Z" />
            {/* Bottom-left "W" wing */}
            <path d="M 22 57 C 22 55.5, 23 55, 24.5 55 L 34 55 C 35.5 55, 36 55.5, 36 57 L 36 63.5 L 48 54 C 49.5 52.8, 50 53.5, 50 55.5 L 50 71.5 C 50 73.5, 49 74, 47.5 75.2 L 34 85 C 31.5 86.8, 28 86.8, 25 84.5 C 23 83, 22 81.5, 22 78 Z" />
            {/* Right golden pillar "W" wing */}
            <path d="M 60 16 C 58 16, 57 17.5, 57 19.5 L 57 63.5 L 50 58 C 48.5 56.8, 48 57.5, 48 59.5 L 48 71.5 C 48 73.5, 49 74.2, 50.5 75.4 L 64 85 C 66.5 86.8, 70 86.8, 73 84.5 C 75 83, 76 81.5, 76 78 L 76 23 C 76 18, 74 16, 69 16 Z" />
          </clipPath>
        </defs>

        {/* Optional Black / Dark Badge Base */}
        {badge && (
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="22"
            className="fill-slate-950/90 dark:fill-black stroke-slate-800/80 dark:stroke-white/10"
            strokeWidth="1.5"
          />
        )}

        {/* Group with optional animated pulse */}
        <motion.g
          animate={animatePulse ? { scale: [1, 1.03, 1] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {/* 1. TOP "F" (Blue to Violet Gradient) */}
          <motion.path
            d="M 28 16 C 24 16, 22 18, 22 23 L 22 47 C 22 51, 24 51.5, 27 51.5 L 49 51.5 C 51 51.5, 52 50, 52 48 L 52 42 C 52 40, 51 39, 49 39 L 36 39 L 36 29 L 52 29 C 54 29, 55 27.5, 55 25.5 L 55 19.5 C 55 17.5, 54 16, 50 16 Z"
            fill="url(#wf-grad-blue-violet)"
            stroke={strokeMode ? '#818CF8' : 'none'}
            strokeWidth={strokeMode ? '1.5' : '0'}
            filter={animateGlow ? 'url(#wf-glow)' : undefined}
            initial={strokeMode ? { pathLength: 0, opacity: 0 } : undefined}
            animate={strokeMode ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          />

          {/* 2. LOWER-LEFT "W" WING (Violet / Indigo Gradient) */}
          <motion.path
            d="M 22 57 C 22 55.5, 23 55, 24.5 55 L 34 55 C 35.5 55, 36 55.5, 36 57 L 36 63.5 L 48 54 C 49.5 52.8, 50 53.5, 50 55.5 L 50 71.5 C 50 73.5, 49 74, 47.5 75.2 L 34 85 C 31.5 86.8, 28 86.8, 25 84.5 C 23 83, 22 81.5, 22 78 Z"
            fill="url(#wf-grad-blue-violet)"
            stroke={strokeMode ? '#C084FC' : 'none'}
            strokeWidth={strokeMode ? '1.5' : '0'}
            filter={animateGlow ? 'url(#wf-glow)' : undefined}
          />

          {/* 3. RIGHT GOLDEN PILLAR & "W" RIGHT WING (Amber-Gold Gradient) */}
          <motion.path
            d="M 60 16 C 58 16, 57 17.5, 57 19.5 L 57 63.5 L 50 58 C 48.5 56.8, 48 57.5, 48 59.5 L 48 71.5 C 48 73.5, 49 74.2, 50.5 75.4 L 64 85 C 66.5 86.8, 70 86.8, 73 84.5 C 75 83, 76 81.5, 76 78 L 76 23 C 76 18, 74 16, 69 16 Z"
            fill="url(#wf-grad-amber-gold)"
            stroke={strokeMode ? '#FBBF24' : 'none'}
            strokeWidth={strokeMode ? '1.5' : '0'}
            filter={animateGlow ? 'url(#wf-glow)' : undefined}
          />

          {/* 4. SHIMMERING LIGHT SWEEP BEAM */}
          {animateSweep && (
            <g clipPath="url(#wf-monogram-clip)">
              <motion.rect
                x="-80"
                y="-10"
                width="40"
                height="120"
                fill="url(#wf-sweep-grad)"
                transform="rotate(25 50 50)"
                animate={{ x: [-80, 160] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 0.4
                }}
              />
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * Compact WiseFind Spinner (Drop-in replacement for generic circular spinners)
 * Features triple counter-rotating glowing orbital arcs with luminous particle nodes.
 */
export function WiseFindSpinner({ size = 28, className = '', showCore = true }) {
  const coreSize = Math.max(14, Math.round(size * 0.58));
  
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {/* Outer Orbit Ring: Triple-Color Gradient Stroke */}
      <svg
        className="absolute inset-0 w-full h-full animate-spin"
        style={{ animationDuration: '1.1s' }}
        viewBox="0 0 44 44"
        fill="none"
      >
        <defs>
          <linearGradient id="spin-arc-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="1" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="spin-arc-gold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Ambient Track */}
        <circle
          cx="22"
          cy="22"
          r="18"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-slate-200/40 dark:text-slate-800/80"
        />

        {/* Purple/Indigo Active Arc */}
        <path
          d="M 22 4 A 18 18 0 0 1 40 22"
          stroke="url(#spin-arc-indigo)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Amber/Gold Active Arc (Opposite side) */}
        <path
          d="M 22 40 A 18 18 0 0 1 4 22"
          stroke="url(#spin-arc-gold)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Reverse Micro Particle Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-1 rounded-full border border-dashed border-cyan-400/30 dark:border-cyan-400/40 pointer-events-none"
      />

      {/* Center Stylized Monogram */}
      {showCore && (
        <div className="relative z-10 flex items-center justify-center">
          <WiseFindMonogramSVG 
            size={coreSize} 
            badge={false} 
            animateGlow={false} 
            animateSweep={false}
            animatePulse={true}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Top Dynamic Website Refresh Bar (Appears during page/tab refreshes and queries)
 */
export function WiseFindRefreshBar({ isRefreshing = true }) {
  if (!isRefreshing) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent overflow-hidden pointer-events-none">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#4F46E5] to-[#F59E0B] shadow-[0_0_12px_#6366F1]"
      />
    </div>
  );
}

/**
 * Unique Liquid Pulse Wave Loader (Hypnotic, state-of-the-art loading animation)
 */
export function WiseFindPulseWaveLoader({ text = "Syncing Buying Engine...", size = 64 }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center" style={{ width: size * 1.8, height: size * 1.8 }}>
        {/* Pulsing Ripple 1 */}
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-4 rounded-3xl bg-indigo-500/20 border border-indigo-500/40 pointer-events-none"
        />
        {/* Pulsing Ripple 2 (Delay) */}
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
          className="absolute inset-4 rounded-3xl bg-purple-500/20 border border-purple-500/40 pointer-events-none"
        />
        {/* Pulsing Ripple 3 (Gold) */}
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 1.6 }}
          className="absolute inset-4 rounded-3xl bg-amber-500/20 border border-amber-500/40 pointer-events-none"
        />

        {/* Counter-Rotating Gyroscopic Ring */}
        <motion.div
          animate={{ rotate: 360, rotateY: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-2xl border-2 border-dashed border-indigo-400/40 dark:border-indigo-500/40 pointer-events-none"
        />

        {/* Central Luminous Monogram */}
        <div className="relative z-10 p-2.5 rounded-2xl bg-slate-950/80 dark:bg-black/90 border border-white/15 shadow-2xl backdrop-blur-md">
          <WiseFindMonogramSVG size={size} animateGlow animateSweep animatePulse />
        </div>
      </div>

      {text && (
        <div className="space-y-1">
          <p className="text-sm font-black text-slate-800 dark:text-white tracking-tight">
            {text}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>AI Verified Telemetry</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Full-Featured WiseFind Loader Component
 * Supports multiple cinematic variants: 'spinner', 'card', 'scan', 'orbit', 'inline'
 */
export default function WiseFindLoader({
  variant = 'spinner',
  size = 'md',
  text = 'Loading...',
  subtext = '',
  className = '',
  fullScreen = false
}) {
  const sizeMap = {
    xs: 18,
    sm: 24,
    md: 44,
    lg: 72,
    xl: 96
  };
  const numericSize = typeof size === 'number' ? size : sizeMap[size] || 44;

  // 1. INLINE SPINNER (Inside Buttons or Inputs)
  if (variant === 'inline' || variant === 'icon') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <WiseFindSpinner size={numericSize} showCore={numericSize >= 22} />
        {text && <span className="text-xs font-bold leading-none">{text}</span>}
      </div>
    );
  }

  // 2. ORBITING PARTICLES VARIANT
  if (variant === 'orbit') {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-6 ${className}`}>
        <div className="relative flex items-center justify-center" style={{ width: numericSize * 1.5, height: numericSize * 1.5 }}>
          {/* Orbital Ring 1 (Indigo/Violet) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-indigo-500/30 border-t-indigo-500 dark:border-indigo-400/40 dark:border-t-indigo-400 pointer-events-none"
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50" />
          </motion.div>

          {/* Orbital Ring 2 (Amber/Gold - Reverse) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-amber-500/30 border-b-amber-500 dark:border-amber-400/40 dark:border-b-amber-400 pointer-events-none"
          >
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
          </motion.div>

          {/* Center Monogram */}
          <WiseFindMonogramSVG size={numericSize} animateGlow animateSweep animatePulse />
        </div>

        {text && (
          <h4 className="mt-4 text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {text}
          </h4>
        )}
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs">
            {subtext}
          </p>
        )}
      </div>
    );
  }

  // 3. HOLOGRAPHIC SCANNER VARIANT (For AI recommendation, comparisons, and intelligent matching)
  if (variant === 'scan' || variant === 'card') {
    const content = (
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-white/95 dark:bg-[#0E1322]/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-xl max-w-md w-full mx-auto text-center">
        {/* Ambient Radial Gradient Background */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Central Stage */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Pulsing Aura */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-28 w-28 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 blur-xl opacity-50"
          />

          {/* Outer Rotating Dashed Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute h-28 w-28 rounded-3xl border border-dashed border-indigo-400/40 dark:border-indigo-500/40 pointer-events-none"
          />

          {/* The Monogram */}
          <div className="relative z-10">
            <WiseFindMonogramSVG 
              size={numericSize || 76} 
              animateGlow 
              animateSweep 
              animatePulse 
            />
          </div>

          {/* Scanning Laser Line */}
          <motion.div
            animate={{ y: [-38, 38, -38] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-20 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#38BDF8] pointer-events-none"
          />
        </div>

        {/* Text Header */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse text-[#4F46E5] dark:text-indigo-400" />
            <span>WiseFind Decision Engine</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {text || 'Querying Buying Intelligence Engine...'}
          </h3>

          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto font-medium">
            {subtext || 'Scanning hundreds of verified specification matrices, evaluating value-for-money metrics, and ranking smart choices in INR (₹).'}
          </p>

          {/* Dynamic Loading Step Pill Sequence */}
          <div className="pt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400"
            >
              🔎 Discover
            </motion.span>
            <span>→</span>
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400"
            >
              ⚖️ Compare
            </motion.span>
            <span>→</span>
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400"
            >
              ⭐ Evaluate
            </motion.span>
            <span>→</span>
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
              className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-black"
            >
              ✓ Decide
            </motion.span>
          </div>
        </div>
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md">
          {content}
        </div>
      );
    }

    return content;
  }

  // 4. DEFAULT SPINNER WITH LOGO CORE
  return (
    <div className={`flex flex-col items-center justify-center text-center p-6 ${className}`}>
      <WiseFindSpinner size={numericSize} />
      {text && (
        <h4 className="mt-3 text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          {text}
        </h4>
      )}
      {subtext && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs">
          {subtext}
        </p>
      )}
    </div>
  );
}
