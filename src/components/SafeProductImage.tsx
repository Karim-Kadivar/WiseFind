import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet, Watch, Headphones, Cpu, Sparkles } from 'lucide-react';

interface SafeProductImageProps {
  src?: string;
  alt: string;
  category: string;
  className?: string;
}

const CATEGORY_FALLBACKS: Record<string, { url: string; gradient: string; icon: React.ReactNode }> = {
  Laptops: {
    url: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-blue-600 to-indigo-600',
    icon: <Laptop className="h-8 w-8 text-white/90" />
  },
  Smartphones: {
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-purple-600 to-pink-600',
    icon: <Smartphone className="h-8 w-8 text-white/90" />
  },
  Tablets: {
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-sky-500 to-cyan-500',
    icon: <Tablet className="h-8 w-8 text-white/90" />
  },
  Smartwatches: {
    url: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-rose-500 to-orange-500',
    icon: <Watch className="h-8 w-8 text-white/90" />
  },
  Audio: {
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-emerald-500 to-teal-500',
    icon: <Headphones className="h-8 w-8 text-white/90" />
  },
  Accessories: {
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-amber-500 to-yellow-500',
    icon: <Cpu className="h-8 w-8 text-white/90" />
  }
};

const DEFAULT_FALLBACK = {
  url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  gradient: 'from-slate-700 to-slate-950',
  icon: <Cpu className="h-8 w-8 text-white/90" />
};

export function SafeProductImage({ src, alt, category, className = 'w-full h-full object-cover' }: SafeProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Parse category key safely
  const normCategory = Object.keys(CATEGORY_FALLBACKS).find(
    (key) => key.toLowerCase() === category?.toLowerCase() || category?.toLowerCase().includes(key.toLowerCase())
  ) || 'Accessories';

  const fallback = CATEGORY_FALLBACKS[normCategory] || DEFAULT_FALLBACK;

  // Use either the original src (if it exists and hasn't failed) or the high-quality curated fallback image
  const resolvedSrc = !src || hasError ? fallback.url : src;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-50 overflow-hidden select-none">
      {/* Background elegant skeleton / gradient when loading or errored */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-bounce" />
          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">SYNTHESIZING...</span>
        </div>
      )}

      {/* Styled vector card in case images totally fail (offline fallback) */}
      {hasError && (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallback.gradient} flex flex-col items-center justify-center p-4 text-center space-y-2 select-none`}>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner border border-white/10 animate-pulse">
            {fallback.icon}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-white animate-spin" style={{ animationDuration: '6s' }} />
              {category}
            </span>
            <p className="text-[9px] font-medium text-white/60 truncate max-w-[140px]" title={alt}>
              {alt}
            </p>
          </div>
        </div>
      )}

      {/* Actual Image component */}
      {!hasError && (
        <img
          src={resolvedSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`${className} transition-all duration-300 ${isLoading ? 'blur-sm scale-95 opacity-0' : 'blur-0 scale-100 opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}
