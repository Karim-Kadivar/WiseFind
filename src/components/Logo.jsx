import React, { useState } from 'react';
import { WiseFindMonogramSVG } from './WiseFindLoader.jsx';

export default function Logo({ 
  className = '', 
  size = 'md', 
  showText = false, 
  textClassName = '', 
  subtitle = 'Find Smarter • Choose Wisely',
  useVector = false 
}) {
    const [imgFailed, setImgFailed] = useState(false);
    const sizeMap = {
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64,
    };
    const finalSize = typeof size === 'number' ? size : sizeMap[size] || 40;

    return (
      <div className={`flex items-center gap-3 select-none ${className}`} id="wisefind-logo">
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <div 
            className="relative flex-shrink-0 overflow-hidden rounded-xl bg-black shadow-md transition-all duration-300 ring-1 ring-white/10 flex items-center justify-center hover:scale-105" 
            style={{ width: finalSize, height: finalSize }}
            title="WiseFind Brand Logo"
          >
            {useVector || imgFailed ? (
              <WiseFindMonogramSVG size={finalSize} badge={false} animateGlow={false} animateSweep={false} />
            ) : (
              <img 
                src="/logo.png" 
                alt="WiseFind Logo" 
                className="w-full h-full object-cover rounded-xl"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
        </div>
        
        {showText && (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className={`text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none ${textClassName}`}>
                Wise<span className="text-[#6366F1] dark:text-[#818CF8]">Find</span>
              </span>
            </div>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase mt-0.5">
              {subtitle}
            </span>
          </div>
        )}
      </div>
    );
}
