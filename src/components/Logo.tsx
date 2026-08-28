import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ className = '', size = 'md', showText = false, textClassName = '' }: LogoProps) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const finalSize = typeof size === 'number' ? size : sizeMap[size] || 40;

  return (
    <div className={`flex items-center gap-3 ${className}`} id="wisefind-logo">
      <div 
        className="relative flex-shrink-0 select-none overflow-hidden rounded-xl bg-black shadow-md transition-transform duration-300 hover:scale-105 ring-1 ring-white/10"
        style={{ width: finalSize, height: finalSize }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Black Canvas Background */}
          <rect width="100" height="100" fill="#000000" />
          
          {/* Gradients matching the user's uploaded logo */}
          <defs>
            <linearGradient id="fw-left-gradient" x1="28" y1="16" x2="58" y2="84" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="45%" stopColor="#6366F1" />
              <stop offset="85%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="fw-right-gradient" x1="60" y1="16" x2="72" y2="84" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Left Shape: Stylized F Top Component */}
          <path
            d="M 29 17
               H 57
               C 58.5 17, 59 17.5, 59 19
               V 31
               C 59 32.5, 58.5 33, 57 33
               H 39
               V 42
               H 56
               C 57.5 42, 58 42.5, 58 44
               V 53
               C 58 54.5, 57.5 55, 56 55
               H 39
               V 56
               C 39 57.5, 38.5 58, 37 58
               H 29
               C 27.5 58, 27 57.5, 27 56
               V 19
               C 27 17.5, 27.5 17, 29 17
               Z"
            fill="url(#fw-left-gradient)"
          />

          {/* Left Shape: Stylized F Bottom Chevron Ribbon */}
          <path
            d="M 29 62
               H 38
               C 39.5 62, 40 62.5, 40 64
               V 70.5
               L 51 60.5
               C 52.5 59.5, 54 60, 54.5 61.5
               V 73
               C 54.5 74.5, 53.5 75.5, 52 76.5
               L 39.5 84.5
               C 38 85.5, 36.5 85.5, 35 84.5
               L 28.5 80.5
               C 27.5 80, 27 79, 27 77.5
               V 64
               C 27 62.5, 27.5 62, 29 62
               Z"
            fill="url(#fw-left-gradient)"
          />

          {/* Right Shape: Stylized Gold/Amber Vertical Wing with Angled Tail */}
          <path
            d="M 61 17
               H 70
               C 71.5 17, 72.5 17.8, 72.5 19.5
               V 76.5
               C 72.5 78.5, 71.5 79.5, 70 80.5
               L 60.5 84.5
               C 59 85.5, 57.8 84.5, 57.2 83.2
               L 49.5 75.5
               C 48.2 74.2, 48 73.2, 49.2 71.8
               L 61 54
               Z"
            fill="url(#fw-right-gradient)"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`text-xl font-black text-[#111827] dark:text-white tracking-tight leading-none ${textClassName}`}>
              WiseFind
            </span>
          </div>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase mt-0.5">
            Find Smarter • Choose Wisely
          </span>
        </div>
      )}
    </div>
  );
}
