import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  MapPin,
  FileText,
  Layers,
  Boxes,
  Shield,
  Star,
  Building2,
  CreditCard,
  ImageIcon,
} from 'lucide-react';
import { PROJECT_TABS, type ProjectTabItem } from './data';

interface TabControlsDesktopProps {
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
  onReset?: () => void;
  onSave?: () => void;
}

function getTabIcon(tabId: string, isActive: boolean) {
  const iconClass = isActive ? 'w-4 h-4 text-white' : 'w-4 h-4';

  switch (tabId) {
    case '01':
      return {
        icon: <MapPin className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      };
    case '02':
      return {
        icon: <FileText className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      };
    case '03':
      return {
        icon: <Layers className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      };
    case '04':
      return {
        icon: <Boxes className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      };
    case '05':
      return {
        icon: <Shield className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
      };
    case '06':
      return {
        icon: <Star className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      };
    case '07':
      return {
        icon: <FileText className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      };
    case '08':
      return {
        icon: <Building2 className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      };
    case '09':
      return {
        icon: <CreditCard className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      };
    case '10':
    default:
      return {
        icon: <ImageIcon className={iconClass} />,
        iconBox: isActive
          ? 'bg-white/20 text-white'
          : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      };
  }
}

export function TabControlsDesktop({
  activeTabId = '01',
  onTabChange,
  onReset,
  onSave,
}: TabControlsDesktopProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Independent dynamic navigation arrows state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Check if the tabs content strictly overflows the visible container width
    const isOverflowing = scrollWidth > clientWidth + 4;
    setCanScrollLeft(isOverflowing && scrollLeft > 8);
    setCanScrollRight(isOverflowing && scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollability();

    el.addEventListener('scroll', checkScrollability, { passive: true });
    const ro = new ResizeObserver(() => checkScrollability());
    ro.observe(el);

    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      ro.disconnect();
      window.removeEventListener('resize', checkScrollability);
    };
  }, []);

  // When active tab changes, smoothly scroll it into view if needed
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      const t = setTimeout(checkScrollability, 350);
      return () => clearTimeout(t);
    }
  }, [activeTabId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* 1. Hero Banner matching reference image */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden p-6">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-12 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 blur-xl pointer-events-none" />

        {/* 3D Modern Residential Cityscape Illustration with smooth fade mask */}
        <div
          className="absolute right-36 top-0 bottom-0 w-3/5 pointer-events-none opacity-90 dark:opacity-30 bg-contain bg-right bg-no-repeat hidden md:block"
          style={{
            backgroundImage: 'url(/project_banner.jpg)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Title & Description with Gradient Icon Box */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
                Project Specification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Complete the development registry form to set up your project details
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Reset form fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/25 cursor-pointer active:scale-95 border border-white/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Project</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 2. Redesigned Tab Navigation Controls with Independent Dynamic Arrows */}
      <div className="relative w-full flex items-center">
        {/* Left Scroll Arrow: Rendered ONLY if required (overflowed and scrolled to right) */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -8 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => handleScroll('left')}
              className="absolute left-1 z-30 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/15 shadow-lg backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 cursor-pointer active:scale-95 transition-all"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Tab Items Horizontal Strip */}
        <div
          ref={scrollContainerRef}
          className="w-full flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {PROJECT_TABS.map((tab) => {
            const isActive = activeTabId === tab.id;
            const { icon, iconBox } = getTabIcon(tab.id, isActive);

            return (
              <div key={tab.id} className="relative shrink-0">
                <button
                  ref={isActive ? activeTabRef : null}
                  type="button"
                  onClick={() => onTabChange?.(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/25 scale-[1.02] border border-blue-400/30'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {/* Tab Icon Box */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${iconBox}`}
                  >
                    {icon}
                  </div>

                  {/* Tab Label */}
                  <span className={isActive ? 'font-bold' : 'font-medium'}>
                    {tab.label}
                  </span>
                </button>

                {/* Neon Glow Indicator Bar directly underneath Active Tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute -bottom-1 inset-x-3 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full blur-[1px] shadow-sm shadow-blue-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Scroll Arrow: Rendered ONLY if required (overflowed and more items to right) */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: 8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 8 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => handleScroll('right')}
              className="absolute right-1 z-30 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/15 shadow-lg backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 cursor-pointer active:scale-95 transition-all"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TabControlsDesktop;
