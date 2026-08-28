import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface WalkthroughTooltipProps {
  step: number;
  currentStep: number;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  totalSteps: number;
}

export const WalkthroughTooltip: React.FC<WalkthroughTooltipProps> = ({
  step,
  currentStep,
  title,
  description,
  position = 'top',
  onNext,
  onBack,
  onClose,
  totalSteps,
}) => {
  if (step !== currentStep) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-3';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-3';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-3';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent';
      case 'top':
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent';
    }
  };

  return (
    <div className={`absolute z-50 w-72 ${getPositionClasses()}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 relative"
      >
        {/* Tooltip Arrow */}
        <div className={`absolute border-8 ${getArrowClasses()}`} />

        {/* Header */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Guide • Step {step + 1}/{totalSteps}</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <h5 className="font-extrabold text-sm text-white mb-1.5">{title}</h5>
        <p className="text-xs text-slate-300 leading-relaxed font-semibold mb-4">{description}</p>

        {/* Controls */}
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <button
            onClick={onBack}
            disabled={step === 0}
            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
              step === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white cursor-pointer'
            }`}
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-1 bg-[#6A73E4] hover:bg-[#5A63D4] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-[#6A73E4]/10"
          >
            {step === totalSteps - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </motion.div>

      {/* Ripple Ring around Target */}
      <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping pointer-events-none opacity-40 scale-110" style={{ animationDuration: '2s' }} />
    </div>
  );
};
