import React from 'react';

/**
 * High-fidelity, authentic vector SVG logos and brand accents for major Indian eCommerce platforms
 */
export function PlatformLogo({ platformId, size = 'md', className = '' }) {
  const sizeMap = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
    xl: 'h-12 w-12'
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  switch (platformId) {
    case 'amazon':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#131921] p-1.5 shadow-sm border border-slate-700/60 ${currentSize} ${className}`} title="Amazon India">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#131921"/>
            {/* Amazon 'a' */}
            <path d="M42 36c-7.2 0-12 4.2-12 11.2 0 6.6 4.4 10.4 10.8 10.4 4.5 0 8.2-2.1 10.2-5.4v4.5h8V37.2c0-8.8-6.4-12.8-16.2-12.8-8.2 0-14.8 3.4-15.6 9.5h8.2c.6-2.5 3.1-4.2 7.4-4.2 4.6 0 7.8 2 7.8 6.6v2.2C50.5 37 46.5 36 42 36zm2.2 11.8c0 4.4-3.2 7.2-7.5 7.2-4.1 0-6.6-2.2-6.6-5.8 0-3.8 2.6-6 6.8-6 3.2 0 6 1.2 7.3 2.4v2.2z" fill="#FFFFFF"/>
            {/* Amazon Curved Smile Arrow in #FF9900 */}
            <path d="M22 66c18 12.8 44 11.8 56-2.2" stroke="#FF9900" strokeWidth="6.5" strokeLinecap="round"/>
            <path d="M78 64l4 4-6.5 2.5 2.5-6.5z" fill="#FF9900"/>
          </svg>
        </div>
      );

    case 'flipkart':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#2874F0] p-1.5 shadow-sm border border-blue-400/40 ${currentSize} ${className}`} title="Flipkart">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#2874F0"/>
            {/* Yellow Shopping Bag with Speed Cut */}
            <path d="M26 34h48l-6 48H32L26 34z" fill="#FFE500"/>
            {/* Blue Handle */}
            <path d="M40 34v-8c0-5.5 4.5-10 10-10s10 4.5 10 10v8" stroke="#2874F0" strokeWidth="6" strokeLinecap="round" fill="none"/>
            {/* Speed italic 'f' cut */}
            <path d="M46 44h14M47 54h9M54 36c-2 0-4 1.5-4 4.5v32" stroke="#2874F0" strokeWidth="5.5" strokeLinecap="round"/>
          </svg>
        </div>
      );

    case 'croma':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#001E24] p-1.5 shadow-sm border border-[#00B5B8]/50 ${currentSize} ${className}`} title="Croma (Tata Enterprise)">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#001E24"/>
            {/* Croma Circular Aperture Iris Symbol */}
            <circle cx="50" cy="50" r="32" stroke="#00B5B8" strokeWidth="4.5" strokeDasharray="16 6" fill="none"/>
            <circle cx="50" cy="50" r="18" fill="#00B5B8"/>
            <circle cx="50" cy="50" r="8" fill="#001E24"/>
            <path d="M34 24L50 50M66 24L50 50M76 50L50 50M66 76L50 50M34 76L50 50M24 50L50 50" stroke="#00B5B8" strokeWidth="2.5" opacity="0.6"/>
          </svg>
        </div>
      );

    case 'reliance':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#E42529] p-1.5 shadow-sm border border-red-400/50 ${currentSize} ${className}`} title="Reliance Digital">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#E42529"/>
            {/* Reliance Bold Chevron Crest */}
            <path d="M50 16L82 34V66L50 84L18 66V34L50 16Z" fill="#B71418"/>
            <path d="M50 24L74 38V62L50 76L26 62V38L50 24Z" fill="#FFFFFF"/>
            {/* Stylized R in red */}
            <path d="M42 34h12c5.5 0 9 3 9 7.5s-3.5 7.5-9 7.5h-5v17h-7V34zm7 10h5c2.2 0 3.8-1 3.8-2.8s-1.6-2.7-3.8-2.7h-5v5.5zm4 7l7.5 15h8.5l-8.5-15h-7.5z" fill="#E42529"/>
          </svg>
        </div>
      );

    case 'vijaysales':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#D8232A] p-1.5 shadow-sm border border-rose-400/50 ${currentSize} ${className}`} title="Vijay Sales">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#D8232A"/>
            {/* Vijay Sales Double 'V' Crest */}
            <path d="M22 26l28 48 28-48h-14l-14 26-14-26H22z" fill="#FFFFFF"/>
            <path d="M35 26l15 26 15-26h-8l-7 12-7-12h-8z" fill="#FFE500"/>
          </svg>
        </div>
      );

    case 'myntra':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#1C060E] p-1.5 shadow-sm border border-[#FF3F6C]/40 ${currentSize} ${className}`} title="Myntra">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#1C060E"/>
            {/* Myntra 4-ribbon Geometric Overlapping M */}
            <path d="M22 66L36 32c1.2-3 4-4.5 7-4.5 4 0 7 2.8 7 6.5l-6 32H22z" fill="#FF3F6C"/>
            <path d="M44 66l12-32c1.2-3 4-4.5 7-4.5 4 0 7 2.8 7 6.5l-6 32H44z" fill="#F77728"/>
            <path d="M36 32l14 34c1.5 3.5 4.8 5 8 3.5 3.5-1.5 4.5-5 3.2-8.5L48 27.5C46 25 42 25 39 27.5z" fill="#FFA726" opacity="0.9"/>
          </svg>
        </div>
      );

    case 'nykaa':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#2A0516] p-1.5 shadow-sm border border-[#FC2779]/50 ${currentSize} ${className}`} title="Nykaa">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#2A0516"/>
            {/* Nykaa Heart / Beauty Silhouette in #FC2779 */}
            <path d="M50 78s-26-17-26-36c0-9.4 7.6-17 17-17 5.5 0 10.5 2.6 13.5 6.8 3-4.2 8-6.8 13.5-6.8 9.4 0 17 7.6 17 17 0 19-26 36-26 36z" fill="#FC2779"/>
            <path d="M50 62s-14-10-14-22c0-5.5 4.5-10 10-10 3.8 0 7 2.2 8.5 5.5 1.5-3.3 4.7-5.5 8.5-5.5 5.5 0 10 4.5 10 10 0 12-14 22-14 22z" fill="#FFFFFF"/>
          </svg>
        </div>
      );

    case 'meesho':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#2C0A33] p-1.5 shadow-sm border border-[#9C27B0]/50 ${currentSize} ${className}`} title="Meesho Mall">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#2C0A33"/>
            {/* Meesho Modern 'm' in berry purple */}
            <rect x="20" y="24" width="60" height="60" rx="16" fill="#9C27B0"/>
            <path d="M34 64V46c0-4.5 3.5-8 8-8s8 3.5 8 8v18M50 46c0-4.5 3.5-8 8-8s8 3.5 8 8v18" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        </div>
      );

    case 'brand_store':
    default:
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-[#0F172A] p-1.5 shadow-sm border border-indigo-400/50 ${currentSize} ${className}`} title="Official Brand Store">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#0F172A"/>
            {/* OEM Shield & Laurel Badge */}
            <path d="M50 18L76 28v22c0 18-12 30-26 36-14-6-26-18-26-36V28l26-10z" fill="url(#brandGrad)"/>
            <path d="M42 50l7 7 14-14" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="brandGrad" x1="24" y1="18" x2="76" y2="86" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B"/>
                <stop offset="0.5" stopColor="#FCD34D"/>
                <stop offset="1" stopColor="#D97706"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
  }
}
