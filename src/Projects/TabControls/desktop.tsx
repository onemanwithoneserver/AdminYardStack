import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, RotateCcw, MapPin, FileText, Layers, Boxes, ShieldCheck, Sparkles, SlidersHorizontal, Zap, CreditCard, Film } from 'lucide-react';
import { PROJECT_TABS, type ProjectTabItem } from './data';

interface TabControlsDesktopProps {
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
  onReset?: () => void;
  onSave?: () => void;
  hideBanner?: boolean;
}

function getTabIcon(tabId: string, isActive: boolean) {
  const iconClass = 'w-3.5 h-3.5 text-white';

  const getIconElement = () => {
    switch (tabId) {
      case '01':
        return <MapPin className={iconClass} />;
      case '02':
        return <FileText className={iconClass} />;
      case '03':
        return <Layers className={iconClass} />;
      case '04':
        return <Boxes className={iconClass} />;
      case '05':
        return <ShieldCheck className={iconClass} />;
      case '06':
        return <Sparkles className={iconClass} />;
      case '07':
        return <SlidersHorizontal className={iconClass} />;
      case '08':
        return <Zap className={iconClass} />;
      case '09':
        return <CreditCard className={iconClass} />;
      case '10':
      default:
        return <Film className={iconClass} />;
    }
  };

  if (isActive) {
    return {
      icon: getIconElement(),
      iconBox: 'bg-white/20 text-white border border-white/25 shadow-xs backdrop-blur-xs',
    };
  }

  const getUnselectedBoxClass = () => {
    switch (tabId) {
      case '01':
        return 'bg-emerald-600 text-white shadow-xs';
      case '02':
        return 'bg-fuchsia-600 text-white shadow-xs';
      case '03':
        return 'bg-orange-600 text-white shadow-xs';
      case '04':
        return 'bg-amber-600 text-white shadow-xs';
      case '05':
        return 'bg-rose-600 text-white shadow-xs';
      case '06':
        return 'bg-purple-600 text-white shadow-xs';
      case '07':
        return 'bg-pink-600 text-white shadow-xs';
      case '08':
        return 'bg-amber-500 text-white shadow-xs';
      case '09':
        return 'bg-violet-600 text-white shadow-xs';
      case '10':
      default:
        return 'bg-teal-600 text-white shadow-xs';
    }
  };

  return {
    icon: getIconElement(),
    iconBox: getUnselectedBoxClass(),
  };
}

export function TabControlsDesktop({
  activeTabId = '01',
  onTabChange,
  onReset,
  onSave,
  hideBanner = false,
}: TabControlsDesktopProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const currentTab = PROJECT_TABS.find((t) => t.id === activeTabId) || PROJECT_TABS[0];

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    
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
      const scrollStep = Math.max(200, Math.floor(scrollContainerRef.current.clientWidth * 0.65));
      const scrollAmount = direction === 'left' ? -scrollStep : scrollStep;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY !== 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-3">
      {!hideBanner && (
        <div className="w-full bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden py-3.5 px-5 sm:px-6">
          <div className="absolute top-0 right-1/4 w-96 h-16 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-violet-500/15 blur-xl pointer-events-none" />

          <div
            className="absolute right-36 top-0 bottom-0 w-3/5 pointer-events-none opacity-90 dark:opacity-30 bg-contain bg-right bg-no-repeat hidden md:block"
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}project_banner.jpg)`,
              maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[4px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0 hover:scale-105 transition-transform duration-200">
                <div className="scale-125 [&_svg]:w-4.5 [&_svg]:h-4.5">
                  {getTabIcon(currentTab.id, false).icon}
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                  {currentTab.label}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure and manage {currentTab.label.toLowerCase()} details and parameters
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
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
                className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-[4px] text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 cursor-pointer active:scale-95 border border-white/20"
              >
                <Save className="w-3.5 h-3.5 text-white" />
                <span>Save Project</span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      
      <div className="relative w-full flex items-center">
        
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: -6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -6 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => handleScroll('left')}
              className="absolute left-0 z-30 w-7 h-7 rounded-[4px] bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/15 shadow-md backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 cursor-pointer active:scale-95 transition-all"
              title="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className={`w-full flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 scroll-smooth transition-all duration-200 ${canScrollLeft ? 'pl-8' : 'pl-1'} ${canScrollRight ? 'pr-8' : 'pr-1'}`}
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
                  className={`group flex items-center gap-2 px-3.5 py-2 rounded-[4px] text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap active:scale-98 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/30 scale-[1.01] border border-blue-400/40'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-2xs hover:shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  
                  <div
                    className={`w-5 h-5 rounded-[2px] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconBox}`}
                  >
                    {icon}
                  </div>

                  
                  <span className={isActive ? 'font-bold' : 'font-medium'}>
                    {tab.label}
                  </span>
                </button>

                
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute -bottom-1 inset-x-2 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-[2px] blur-[0.5px] shadow-sm shadow-blue-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: 6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 6 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => handleScroll('right')}
              className="absolute right-0 z-30 w-7 h-7 rounded-[4px] bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/15 shadow-md backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 cursor-pointer active:scale-95 transition-all"
              title="Scroll Right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TabControlsDesktop;
