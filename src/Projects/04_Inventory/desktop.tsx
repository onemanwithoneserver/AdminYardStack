import { useState } from 'react';
import { Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { INITIAL_INVENTORY_ROOT_DATA, createDefaultVariant, type InventoryRootState } from './data';
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

    setNotification(`Variant ${nextVariantNumber} added to Configurations and Preview & Tools!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 md:p-8 space-y-6 text-slate-800">
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Inventory
        </span>
      </div>

      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Inventory Configuration
          </h2>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleSubTabChange('Configurations')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                state.activeSubTab === 'Configurations'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Configurations
            </button>
            <button
              type="button"
              onClick={() => handleSubTabChange('Preview & Totals')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                state.activeSubTab === 'Preview & Totals'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Preview & Totals
            </button>
          </div>
        </div>

        
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleAddConfiguration}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Activating will create a new variant in both Configuration and Preview & Tools"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Add Configuration</span>
          </button>
        </div>
      </div>

      
      <div className="pt-2">
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

      
      <div className="pt-4 border-t border-slate-200/80 max-w-xs">
        <label className="block text-[11px] font-medium text-slate-600 mb-1">
          Status <span className="text-red-500 font-bold">*</span>
        </label>
        <div className="relative">
          <select
            value={state.status}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                status: e.target.value as 'Active' | 'Inactive',
              }))
            }
            className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
        </div>
      </div>
    </div>
  );
}

export default InventoryDesktop;
