import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BrandLogoProps {
  collapsed?: boolean;
  onOrganizationClick?: () => void;
  variant?: 'blue' | 'default';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  collapsed = false,
  onOrganizationClick,
  variant = 'blue',
}) => {
  const isBlueVariant = variant === 'blue';

  return (
    <div className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center w-full py-1' : 'w-full gap-3'}`}>
      <div
        className="relative shrink-0 group cursor-pointer"
        onClick={onOrganizationClick}
        title="YardStack PropTech Global HQ"
      >
        <div className={`absolute -inset-1.5 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 ${
          isBlueVariant
            ? 'bg-gradient-to-tr from-white/30 via-blue-300/30 to-white/40'
            : 'bg-gradient-to-tr from-blue-600/40 via-indigo-500/30 to-cyan-400/40'
        }`} />

        <div className={`relative w-10 h-10 rounded-xl p-0.5 border shadow-lg flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
          isBlueVariant
            ? 'bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 border-white/40 shadow-blue-900/40'
            : 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-white/25 shadow-blue-900/30'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 transform transition-transform duration-300 group-hover:rotate-3"
          >
            <defs>
              <linearGradient id="ys-brand-top" x1="18" y1="4" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#93C5FD" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="ys-brand-left" x1="6" y1="11" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="ys-brand-right" x1="30" y1="11" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#93C5FD" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
              <radialGradient id="ys-brand-glow" cx="18" cy="18" r="8" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
              </radialGradient>
            </defs>

            <polygon points="18,4 30,11 18,18 6,11" fill="url(#ys-brand-top)" fillOpacity="0.95" />
            <polygon points="6,11 18,18 18,30 6,23" fill="url(#ys-brand-left)" fillOpacity="0.9" />
            <polygon points="18,18 30,11 30,23 18,30" fill="url(#ys-brand-right)" fillOpacity="0.95" />

            <path
              d="M18 4L30 11V23L18 30L6 23V11L18 4Z"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <path
              d="M18 18V30M18 18L30 11M18 18L6 11"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.25"
              strokeLinecap="round"
            />

            <circle cx="18" cy="18" r="5" fill="url(#ys-brand-glow)" />
            <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold text-[15px] tracking-[0.14em] uppercase leading-none font-sans ${
              isBlueVariant
                ? 'text-white drop-shadow-xs'
                : 'bg-gradient-to-r from-slate-950 via-slate-800 to-blue-950 dark:from-white dark:via-slate-100 dark:to-blue-200 bg-clip-text text-transparent'
            }`}>
              YardStack
            </span>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase leading-none shadow-2xs ${
              isBlueVariant
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-500/25 dark:border-blue-400/30'
            }`}>
              PRO
            </span>
          </div>

          <button
            type="button"
            onClick={onOrganizationClick}
            className={`flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-semibold mt-1 group/org transition-colors text-left cursor-pointer ${
              isBlueVariant
                ? 'text-blue-100 hover:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="truncate max-w-[130px]">PropTech Global HQ</span>
            <ChevronRight className={`w-2.5 h-2.5 opacity-60 group-hover/org:opacity-100 group-hover/org:translate-x-0.5 transition-all ${
              isBlueVariant ? 'text-white' : 'text-blue-500'
            }`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
