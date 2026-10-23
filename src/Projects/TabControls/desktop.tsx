import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Save, RotateCcw } from 'lucide-react';
import { PROJECT_TABS, type ProjectTabItem } from './data';

interface TabControlsDesktopProps {
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
  onReset?: () => void;
  onSave?: () => void;
}

export function TabControlsDesktop({
  activeTabId = '01',
  onTabChange,
  onReset,
  onSave,
}: TabControlsDesktopProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl p-4 shadow-sm select-none border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/60 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
            PROJECT
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Project Information Form
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-white/5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm shadow-blue-500/30 cursor-pointer active:scale-[0.98]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE PROJECT</span>
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mr-1 shrink-0 cursor-pointer"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
        >
          {PROJECT_TABS.map((tab) => {
            const isActive = activeTabId === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02] border border-blue-500/30'
                    : 'bg-white/60 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/70 dark:border-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ml-1 shrink-0 cursor-pointer"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TabControlsDesktop;
