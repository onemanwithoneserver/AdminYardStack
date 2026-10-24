import { useState, useMemo } from 'react';
import { Plus, Boxes, CheckCircle2, Layers, Columns, Building2, Sparkles } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import {
  INITIAL_INVENTORY_ROOT_DATA,
  createDefaultVariant,
  calculateInventoryKPIs,
  type InventoryRootState,
} from './data';
import { ConfigurationDesktop } from './Configuration';
import { PreviewAndToolsDesktop } from './preview and tools';
import type { InventoryVariant, InventoryCommonConfig } from './Configuration/data';

export function InventoryDesktop() {
  const [state, setState] = useState<InventoryRootState>(INITIAL_INVENTORY_ROOT_DATA);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubTabChange = (tab: 'Configurations' | 'Preview & Totals') => {
    setState((prev) => ({ ...prev, activeSubTab: tab }));
  };

  const handleVariantsChange = (variants: InventoryVariant[]) => {
    setState((prev) => ({ ...prev, variants }));
  };

  const handleCommonConfigChange = (commonConfig: InventoryCommonConfig) => {
    setState((prev) => ({ ...prev, commonConfig }));
  };

  const handleAddConfiguration = () => {
    const nextVariantNumber = state.variants.length + 1;
    const newVariant = createDefaultVariant(nextVariantNumber, `Tower 1`);
    setState((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));

    setNotification(`Variant ${nextVariantNumber} added successfully!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const kpis = useMemo(() => {
    return calculateInventoryKPIs(state.variants);
  }, [state.variants]);

  return (
    <div className="p-2 space-y-4 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {notification && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner & Live KPI Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs shadow-amber-500/20">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Inventory
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Unit configurations, flat sizes, dimensional specifications, and real-time inventory matrix
            </p>
          </div>
        </div>

        {/* Live Top Quick Stat Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-2xs flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Configs:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              {kpis.totalVariants}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-2xs flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Towers:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              {kpis.totalTowers}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-2xs flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Saleable:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              {kpis.totalSaleableArea.toLocaleString()} Sqft
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Control Bar */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-[4px] bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-1.5 p-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10">
          <button
            type="button"
            onClick={() => handleSubTabChange('Configurations')}
            className={`px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              state.activeSubTab === 'Configurations'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Configurations</span>
            <span
              className={`px-1.5 py-0.2 rounded-[2px] text-[10px] font-mono font-bold ${
                state.activeSubTab === 'Configurations'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {state.variants.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSubTabChange('Preview & Totals')}
            className={`px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              state.activeSubTab === 'Preview & Totals'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Preview & Matrix</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddConfiguration}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Configuration</span>
        </button>
      </div>

      {/* Main Tab View Content */}
      <div className="pb-24">
        {state.activeSubTab === 'Configurations' ? (
          <ConfigurationDesktop
            variants={state.variants}
            commonConfig={state.commonConfig}
            onVariantsChange={handleVariantsChange}
            onCommonConfigChange={handleCommonConfigChange}
            onAddConfiguration={handleAddConfiguration}
          />
        ) : (
          <PreviewAndToolsDesktop
            variants={state.variants}
            onVariantsChange={handleVariantsChange}
            onAddConfiguration={handleAddConfiguration}
          />
        )}
      </div>

      {/* Status Card - Placed at bottom left side */}
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 sm:p-3 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 h-4">
              <span>Status</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <ModernDropdown<'Active' | 'Inactive'>
              value={state.status}
              onChange={(val) =>
                setState((prev) => ({
                  ...prev,
                  status: val,
                }))
              }
              options={[
                {
                  value: 'Active',
                  label: 'Active',
                  icon: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1" />,
                },
                {
                  value: 'Inactive',
                  label: 'Inactive',
                  icon: <span className="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1" />,
                },
              ]}
              dropUp={true}
              roundedClass="rounded-[4px]"
              className="w-auto inline-block"
              buttonClassName="w-auto h-8 px-2.5 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDesktop;
