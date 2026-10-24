import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Unbiased Engine...');
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatusText('Syncing Amazon, Flipkart & Croma Store Matrix...');
      setProgress(48);
      setStage(1);
    }, 550);

    const t2 = setTimeout(() => {
      setStatusText('Connecting Verified Category Advisors...');
      setProgress(84);
      setStage(2);
    }, 1150);

    const t3 = setTimeout(() => {
      setStatusText('Welcome to WiseFind');
      setProgress(100);
      setStage(3);
    }, 1650);

    const t4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050711] text-white overflow-hidden select-none cursor-pointer"
      onClick={() => onComplete && onComplete()}
      title="Click anywhere to enter immediately"
    >
      {/* Background Animated Dynamic Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Radial Gradients */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.25, 0.45, 0.25],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#4F46E5]/40 via-[#7C3AED]/30 to-[#F59E0B]/20 blur-[110px]"
        />

        {/* Ambient Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Center Cinematic Logo Stage */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md w-full">
        
        {/* Pulsing Orbiting Glow Ring */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Orbiting Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 sm:-inset-6 rounded-3xl border border-dashed border-indigo-500/30 dark:border-indigo-400/40 pointer-events-none"
          />

          {/* Exterior Glow Aura */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-3 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B] rounded-3xl blur-xl opacity-60"
          />

          {/* Exact Logo Frame with 3D Pop & Light Sweep */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black border-2 border-white/20 p-1 shadow-2xl overflow-hidden group"
          >
            <img
              src="/logo.png"
              alt="WiseFind Brand Logo"
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Futuristic Light Beam Shimmer across Logo */}
            <motion.div
              animate={{ x: ['-120%', '220%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.3 }}
              className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Brand Name "WiseFind" Animation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-1.5 mb-6"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Wise<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] via-[#C084FC] to-[#FBBF24]">Find</span>
            </h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-xs sm:text-sm font-bold text-slate-300 tracking-wide"
          >
            Let's Find The Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] via-[#C084FC] to-[#FBBF24] font-black">From Your Wallet.</span>
          </motion.p>
        </motion.div>

        {/* Minimal Progress Bar & Status Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-xs space-y-2.5"
        >
          {/* Progress Track */}
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.45 }}
              className="h-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F59E0B] rounded-full shadow-[0_0_12px_rgba(124,58,237,0.7)]"
            />
          </div>

          {/* Realtime status text */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span className="truncate pr-2">{statusText}</span>
            <span className="font-mono text-[10px] text-indigo-300 shrink-0 font-bold">{progress}%</span>
          </div>
        </motion.div>

        {/* Skip Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-[11px] font-semibold text-slate-500 hover:text-slate-300 transition-colors"
        >
          Tap anywhere to skip directly →
        </motion.div>

      </div>
    </motion.div>
  );
}
