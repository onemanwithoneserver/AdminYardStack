import { Save, RotateCcw, MapPin, FileText, Layers, Boxes, Shield, Star, Building2, CreditCard, ImageIcon } from 'lucide-react';
import { PROJECT_TABS, type ProjectTabItem } from './data';

interface TabControlsMobileProps {
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
  onReset?: () => void;
  onSave?: () => void;
  hideBanner?: boolean;
}

function getTabIcon(tabId: string, isActive: boolean) {
  const iconClass = 'w-3 h-3 text-white';

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
        return <Shield className={iconClass} />;
      case '06':
        return <Star className={iconClass} />;
      case '07':
        return <FileText className={iconClass} />;
      case '08':
        return <Building2 className={iconClass} />;
      case '09':
        return <CreditCard className={iconClass} />;
      case '10':
      default:
        return <ImageIcon className={iconClass} />;
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
        return 'bg-blue-600 text-white shadow-xs';
      case '02':
        return 'bg-indigo-600 text-white shadow-xs';
      case '03':
        return 'bg-emerald-600 text-white shadow-xs';
      case '04':
        return 'bg-amber-600 text-white shadow-xs';
      case '05':
        return 'bg-rose-600 text-white shadow-xs';
      case '06':
        return 'bg-purple-600 text-white shadow-xs';
      case '07':
        return 'bg-sky-600 text-white shadow-xs';
      case '08':
        return 'bg-orange-600 text-white shadow-xs';
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

export function TabControlsMobile({
  activeTabId = '01',
  onTabChange,
  onReset,
  onSave,
  hideBanner = false,
}: TabControlsMobileProps) {
  return (
    <div className={`w-full glass-card rounded-[4px] shadow-sm select-none border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/70 backdrop-blur-xl ${hideBanner ? 'p-1.5' : 'p-3.5 space-y-3'}`}>
      {!hideBanner && (
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
      )}

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {PROJECT_TABS.map((tab) => {
          const isActive = activeTabId === tab.id;
          const { icon, iconBox } = getTabIcon(tab.id, isActive);

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
              <span className={`w-5 h-5 rounded-[2px] flex items-center justify-center shrink-0 ${iconBox}`}>
                {icon}
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
