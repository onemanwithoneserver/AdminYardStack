import React from 'react';

interface BrandLogoProps {
  collapsed?: boolean;
  onOrganizationClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ collapsed = false, onOrganizationClick }) => {
  return (
    <div className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center w-full py-1' : 'w-full gap-3'}`}>
      {/* Precision Geometric Architectural Insignia */}
      <div className="relative shrink-0 group cursor-pointer" onClick={onOrganizationClick}>
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-sky-400/30 blur-xs opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-black p-0.5 border border-white/20 dark:border-white/25 shadow-lg shadow-black/20 flex items-center justify-center overflow-hidden">
          {/* Subtle Ambient Refraction Line */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 transform group-hover:scale-105 transition-transform duration-300"
          >
            <defs>
              <linearGradient id="yardstack-prism-1" x1="4" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="0.5" stopColor="#3B82F6" />
                <stop offset="1" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="yardstack-prism-2" x1="18" y1="4" x2="18" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#93C5FD" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="yardstack-gold" x1="18" y1="12" x2="28" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Architectural Isometric Stacks */}
            <path
              d="M18 4L30 11V23L18 30L6 23V11L18 4Z"
              stroke="url(#yardstack-prism-1)"
              strokeWidth="1.75"
              strokeLinejoin="round"
              className="opacity-90"
            />
            {/* Inner Isometric Cube Ribs */}
            <path
              d="M18 4V18M18 18L30 11M18 18L6 11M18 18V30M18 18L30 23M18 18L6 23"
              stroke="url(#yardstack-prism-2)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70"
            />
            {/* Center Core Monolith Jewel */}
            <polygon
              points="18,12 24,15.5 24,22 18,25 12,22 12,15.5"
              fill="url(#yardstack-prism-1)"
              fillOpacity="0.4"
            />
            <circle cx="18" cy="18" r="2.25" fill="#38BDF8" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Typography & Organization Details (Shown when expanded) */}
      {!collapsed && (
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[15px] tracking-[0.16em] text-slate-900 dark:text-white uppercase leading-none font-sans drop-shadow-xs">
              YardStack
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-500/10 dark:bg-blue-400/15 text-blue-700 dark:text-blue-300 border border-blue-500/20 dark:border-blue-400/25 leading-none">
              PRO
            </span>
          </div>
          
          <button
            type="button"
            onClick={onOrganizationClick}
            className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-slate-600 dark:text-slate-400 font-semibold mt-1 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">PropTech Global HQ</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
