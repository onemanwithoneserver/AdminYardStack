import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Save, RotateCcw, FolderKanban } from 'lucide-react';
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
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl p-4 shadow-sm select-none border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/70 backdrop-blur-xl relative overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-12 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 blur-xl pointer-events-none" />

      {/* Top Controls Row */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/5 mb-3.5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/20">
            <FolderKanban className="w-3.5 h-3.5" />
            <span className="text-xs font-black uppercase tracking-wider">
              Project Specification
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
            Complete the 10-step developmental registry form
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-white/10 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Reset form fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/25 cursor-pointer active:scale-95 border border-white/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Project</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors mr-1.5 shrink-0 cursor-pointer shadow-2xs border border-transparent hover:border-slate-200 dark:hover:border-white/10"
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
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/25 scale-[1.02] border border-blue-400/30'
                    : 'bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/30 shadow-2xs'
                }`}
              >
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.id}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors ml-1.5 shrink-0 cursor-pointer shadow-2xs border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TabControlsDesktop;
