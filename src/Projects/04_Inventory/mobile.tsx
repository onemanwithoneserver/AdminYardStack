import { useState, useMemo } from 'react';
import { Boxes, CheckCircle2, Layers, Columns } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { INITIAL_INVENTORY_ROOT_DATA, createDefaultVariant, calculateInventoryKPIs, type InventoryRootState } from './data';
import { ConfigurationMobile } from './Configuration';
import { PreviewAndToolsMobile } from './preview and tools';
import type { InventoryVariant, InventoryCommonConfig } from './Configuration/data';

export function InventoryMobile() {
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

    setNotification(`Variant ${nextVariantNumber} added!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const kpis = useMemo(() => {
    return calculateInventoryKPIs(state.variants);
  }, [state.variants]);

  return (
    <div className="p-1.5 space-y-3.5 text-slate-800 dark:text-slate-100 text-xs">
      {notification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-3 py-2 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs shadow-amber-500/20">
            <Boxes className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Inventory
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Unit configurations, flat sizes, dimensional specifications, and real-time inventory matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-slate-600 dark:text-slate-300">
          <span>{kpis.totalVariants} Variants</span>
          <span>&bull;</span>
          <span>{kpis.totalSaleableArea.toLocaleString()} Sqft</span>
        </div>
      </div>

      
      <div className="flex items-center gap-1.5 p-1 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => handleSubTabChange('Configurations')}
          className={`flex-1 py-1.5 rounded-[3px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
            state.activeSubTab === 'Configurations'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Config ({state.variants.length})</span>
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange('Preview & Totals')}
          className={`flex-1 py-1.5 rounded-[3px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
            state.activeSubTab === 'Preview & Totals'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Matrix Preview</span>
        </button>
      </div>

      
      <div className="pb-24">
        {state.activeSubTab === 'Configurations' ? (
          <ConfigurationMobile
            variants={state.variants}
            commonConfig={state.commonConfig}
            onVariantsChange={handleVariantsChange}
            onCommonConfigChange={handleCommonConfigChange}
            onAddConfiguration={handleAddConfiguration}
          />
        ) : (
          <PreviewAndToolsMobile
            variants={state.variants}
            onVariantsChange={handleVariantsChange}
            onAddConfiguration={handleAddConfiguration}
          />
        )}
      </div>

      
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2 sm:p-2.5 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1">
            <label className="text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 h-3.5">
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
              buttonClassName="w-auto h-7 px-2 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryMobile;
