import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="w-full bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs select-none">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-[#1956db] text-white shadow-xs">
            PROJECT
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Project Information Form
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            RESET
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1956db] hover:bg-[#1546b3] transition-colors shadow-sm cursor-pointer"
          >
            SAVE PROJECT
          </button>
        </div>
      </div>

      
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors mr-1 shrink-0 cursor-pointer"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide py-1"
        >
          {PROJECT_TABS.map((tab) => {
            const isActive = activeTabId === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#1956db] text-white shadow-md scale-[1.02]'
                    : 'bg-[#f8fafc] text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
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
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors ml-1 shrink-0 cursor-pointer"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TabControlsDesktop;
