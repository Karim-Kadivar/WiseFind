import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet, Watch, Headphones, Sparkles, UtensilsCrossed, Shirt, Tv, Activity, BookOpen, Coffee, Car, Baby, Package } from 'lucide-react';
const CATEGORY_FALLBACKS = {
    'electronics & gadgets': {
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-blue-600 to-indigo-600',
        icon: <Smartphone className="h-8 w-8 text-white/90"/>
    },
    'smartphones': {
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-purple-600 to-pink-600',
        icon: <Smartphone className="h-8 w-8 text-white/90"/>
    },
    'laptops': {
        url: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-blue-600 to-indigo-600',
        icon: <Laptop className="h-8 w-8 text-white/90"/>
    },
    'audio': {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-emerald-500 to-teal-500',
        icon: <Headphones className="h-8 w-8 text-white/90"/>
    },
    'smartwatches': {
        url: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-rose-500 to-orange-500',
        icon: <Watch className="h-8 w-8 text-white/90"/>
    },
    'tablets': {
        url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-sky-500 to-cyan-500',
        icon: <Tablet className="h-8 w-8 text-white/90"/>
    },
    'home & kitchen': {
        url: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-amber-600 to-orange-600',
        icon: <UtensilsCrossed className="h-8 w-8 text-white/90"/>
    },
    'fashion & apparel': {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-rose-600 to-pink-600',
        icon: <Shirt className="h-8 w-8 text-white/90"/>
    },
    'beauty & personal care': {
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-purple-600 to-fuchsia-600',
        icon: <Sparkles className="h-8 w-8 text-white/90"/>
    },
    'large appliances': {
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-teal-600 to-emerald-600',
        icon: <Tv className="h-8 w-8 text-white/90"/>
    },
    'sports, fitness & outdoor': {
        url: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-red-600 to-amber-600',
        icon: <Activity className="h-8 w-8 text-white/90"/>
    },
    'books, media & stationery': {
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-indigo-600 to-violet-600',
        icon: <BookOpen className="h-8 w-8 text-white/90"/>
    },
    'groceries & gourmet': {
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-emerald-600 to-teal-600',
        icon: <Coffee className="h-8 w-8 text-white/90"/>
    },
    'automotive & hardware': {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-sky-600 to-blue-600',
        icon: <Car className="h-8 w-8 text-white/90"/>
    },
    'baby, kids & toys': {
        url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
        gradient: 'from-amber-500 to-yellow-500',
        icon: <Baby className="h-8 w-8 text-white/90"/>
    }
};
const DEFAULT_FALLBACK = {
    url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-slate-700 to-slate-900',
    icon: <Package className="h-8 w-8 text-white/90"/>
};
export function SafeProductImage({ src, alt, category = '', subCategory = '', className = 'w-full h-full object-cover' }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // Find the closest matching fallback key
    const catLower = (category || '').toLowerCase();
    const subLower = (subCategory || '').toLowerCase();
    let matchedKey = Object.keys(CATEGORY_FALLBACKS).find(k => subLower.includes(k) || catLower === k || catLower.includes(k));
    if (!matchedKey) {
        if (catLower.includes('phone') || subLower.includes('phone'))
            matchedKey = 'smartphones';
        else if (catLower.includes('laptop') || subLower.includes('laptop'))
            matchedKey = 'laptops';
        else if (catLower.includes('audio') || catLower.includes('headphone') || catLower.includes('earbud'))
            matchedKey = 'audio';
        else if (catLower.includes('watch'))
            matchedKey = 'smartwatches';
        else if (catLower.includes('home') || catLower.includes('kitchen') || subLower.includes('fryer') || subLower.includes('grinder'))
            matchedKey = 'home & kitchen';
        else if (catLower.includes('fashion') || catLower.includes('shoe') || catLower.includes('wear'))
            matchedKey = 'fashion & apparel';
        else if (catLower.includes('beauty') || catLower.includes('serum') || catLower.includes('trimmer'))
            matchedKey = 'beauty & personal care';
        else if (catLower.includes('appliance') || catLower.includes('tv') || catLower.includes('fridge') || catLower.includes('washing'))
            matchedKey = 'large appliances';
        else if (catLower.includes('sport') || catLower.includes('gym') || catLower.includes('fitness'))
            matchedKey = 'sports, fitness & outdoor';
        else if (catLower.includes('book') || catLower.includes('read'))
            matchedKey = 'books, media & stationery';
        else if (catLower.includes('groc') || catLower.includes('coffee') || catLower.includes('food'))
            matchedKey = 'groceries & gourmet';
        else if (catLower.includes('auto') || catLower.includes('tool') || catLower.includes('drill'))
            matchedKey = 'automotive & hardware';
    }
    const fallback = (matchedKey && CATEGORY_FALLBACKS[matchedKey]) || DEFAULT_FALLBACK;
    const resolvedSrc = !src || hasError ? fallback.url : src;
    return (<div className="relative w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden select-none">
      {/* Skeleton loader */}
      {isLoading && (<div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-bounce"/>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">SYNTHESIZING...</span>
        </div>)}

      {/* Fallback graphic when image fails to load */}
      {hasError && (<div className={`absolute inset-0 bg-gradient-to-br ${fallback.gradient} flex flex-col items-center justify-center p-4 text-center space-y-2 select-none`}>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner border border-white/10 animate-pulse">
            {fallback.icon}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-white"/>
              {subCategory || category || 'Product'}
            </span>
            <p className="text-[9px] font-medium text-white/60 truncate max-w-[140px]" title={alt}>
              {alt}
            </p>
          </div>
        </div>)}

      {/* Main product image */}
      {!hasError && (<img src={resolvedSrc} alt={alt} referrerPolicy="no-referrer" className={`${className} transition-all duration-300 ${isLoading ? 'blur-sm scale-95 opacity-0' : 'blur-0 scale-100 opacity-100'}`} onLoad={() => setIsLoading(false)} onError={() => {
                setHasError(true);
                setIsLoading(false);
            }}/>)}
    </div>);
}
