import { PROJECT_TABS, type ProjectTabItem } from './data';

interface TabControlsMobileProps {
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
  onReset?: () => void;
  onSave?: () => void;
}

export function TabControlsMobile({
  activeTabId = '01',
  onTabChange,
  onReset,
  onSave,
}: TabControlsMobileProps) {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs select-none">
      
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#1956db] text-white">
          PROJECT
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-3 py-1 rounded-md text-[11px] font-semibold text-white bg-[#1956db] hover:bg-[#1546b3]"
          >
            Save
          </button>
        </div>
      </div>

      
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
        {PROJECT_TABS.map((tab) => {
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1956db] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TabControlsMobile;
