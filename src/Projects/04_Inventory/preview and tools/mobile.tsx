import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { type InventoryVariant } from '../Configuration/data';
import { INITIAL_PREVIEW_FILTERS, type PreviewFilters, type TowerTotalSummary, computeTowerTotals } from './data';
import type { PreviewAndToolsDesktopProps } from './desktop';

export function PreviewAndToolsMobile({
  variants = [],
  onVariantsChange,
}: PreviewAndToolsDesktopProps) {
  const [filters, setFilters] = useState<PreviewFilters>(INITIAL_PREVIEW_FILTERS);

  const handleRowChange = (
    variantId: string,
    field: keyof InventoryVariant,
    value: string
  ) => {
    if (!onVariantsChange) return;
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      return { ...v, [field]: value };
    });
    onVariantsChange(updated);
  };

  const filteredVariants = variants.filter((v) => {
    if (filters.tower !== 'All' && v.towerName !== filters.tower) return false;
    if (filters.facing !== 'All' && v.facing !== filters.facing) return false;
    if (
      filters.availability !== 'All' &&
      v.variantAvailable !== filters.availability
    )
      return false;
    return true;
  });

  const towerTotals: TowerTotalSummary[] = computeTowerTotals(variants);

  return (
    <div className="space-y-5 text-slate-800">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Inventory Preview
        </h3>

        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[10px] text-slate-500 mb-0.5">Tower</label>
            <select
              value={filters.tower}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, tower: e.target.value }))
              }
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
            >
              <option value="All">All</option>
              <option value="Tower 1">Tower 1</option>
              <option value="Tower 2">Tower 2</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 mb-0.5">Facing</label>
            <select
              value={filters.facing}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, facing: e.target.value }))
              }
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
            >
              <option value="All">All</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 mb-0.5">Status</label>
            <select
              value={filters.availability}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, availability: e.target.value }))
              }
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
            >
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>
        </div>

        
        <div className="space-y-3">
          {filteredVariants.map((v) => (
            <div
              key={v.id}
              className="border border-slate-200 rounded-xl p-3 bg-white space-y-2.5 shadow-2xs text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900">
                  Variant {v.variantNumber}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {v.towerName || 'Tower 1'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Unit Type: </span>
                  <span className="font-semibold">{v.unitType || '--'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Facing: </span>
                  <span className="font-semibold">{v.facing || '--'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Saleable Area: </span>
                  <span className="font-semibold">
                    {v.saleableArea ? `${v.saleableArea} Sqft` : '--'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Availability: </span>
                  <span className="font-semibold">
                    {v.variantAvailable || '--'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Series No
                  </label>
                  <input
                    type="text"
                    placeholder="1,2"
                    value={v.seriesNo}
                    onChange={(e) =>
                      handleRowChange(v.id, 'seriesNo', e.target.value)
                    }
                    className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Regular
                  </label>
                  <input
                    type="text"
                    value={v.floorsRegular}
                    onChange={(e) =>
                      handleRowChange(v.id, 'floorsRegular', e.target.value)
                    }
                    className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Shrinked
                  </label>
                  <input
                    type="text"
                    value={v.floorsShrinked}
                    onChange={(e) =>
                      handleRowChange(v.id, 'floorsShrinked', e.target.value)
                    }
                    className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white p-3 space-y-2">
        <span className="text-xs font-bold text-slate-800">Totals by Tower</span>
        <div className="space-y-1.5">
          {towerTotals.map((tot) => (
            <div
              key={tot.tower}
              className="flex items-center justify-between p-2 rounded bg-slate-50 text-xs"
            >
              <span className="font-semibold text-slate-800">{tot.tower}</span>
              <div className="flex items-center gap-3 text-slate-600">
                <span>{tot.variants} Variants</span>
                <span>{tot.saleableArea.toFixed(0)} Sqft</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white p-3 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-800">
            Total Project Inventory
          </span>
          <span className="text-[11px] text-slate-500">
            {variants.length} Records
          </span>
        </div>
        <div className="space-y-2">
          {variants.map((v) => (
            <div
              key={v.id}
              className="p-2 border border-slate-200 rounded-lg space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  {v.towerName} - Flat {v.flatNo}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  {v.unitType || 'Unit'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="relative">
                  <select
                    value={v.inventoryOwner}
                    onChange={(e) =>
                      handleRowChange(v.id, 'inventoryOwner', e.target.value)
                    }
                    className="w-full appearance-none px-2 py-1 border border-slate-200 rounded bg-white text-xs pr-6"
                  >
                    <option value="Builder">Builder</option>
                    <option value="Investor">Investor</option>
                    <option value="Owner">Owner</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={v.flatStatus}
                    onChange={(e) =>
                      handleRowChange(v.id, 'flatStatus', e.target.value)
                    }
                    className="w-full appearance-none px-2 py-1 border border-slate-200 rounded bg-white text-xs pr-6"
                  >
                    <option value="Available">Available</option>
                    <option value="Hold">Hold</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreviewAndToolsMobile;
