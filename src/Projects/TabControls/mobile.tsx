import { Save, RotateCcw } from 'lucide-react';
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
    <div className="w-full glass-card rounded-[4px] p-3.5 shadow-sm select-none border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/70 backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/5">
        <span className="px-2.5 py-0.5 rounded-[2px] text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xs">
          Form Steps
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200/60 dark:border-white/5 transition-all active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1 px-3 py-1 rounded-[4px] text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-xs active:scale-95 border border-white/20"
          >
            <Save className="w-3 h-3" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {PROJECT_TABS.map((tab) => {
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-sm shadow-blue-500/25 border border-blue-400/30'
                  : 'bg-white/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/5'
              }`}
            >
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                {tab.id}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TabControlsMobile;
