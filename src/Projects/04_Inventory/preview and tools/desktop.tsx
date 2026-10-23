import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  type InventoryVariant,
} from '../Configuration/data';
import {
  INITIAL_PREVIEW_FILTERS,
  type PreviewFilters,
  type TowerTotalSummary,
  computeTowerTotals,
} from './data';

export interface PreviewAndToolsDesktopProps {
  variants?: InventoryVariant[];
  onVariantsChange?: (variants: InventoryVariant[]) => void;
  onAddConfiguration?: () => void;
}

export function PreviewAndToolsDesktop({
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
    <div className="space-y-6 text-slate-800">
      
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Inventory Preview
        </h3>

        
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-600">Tower:</span>
            <div className="relative">
              <select
                value={filters.tower}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, tower: e.target.value }))
                }
                className="appearance-none px-3 py-1 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 pr-7 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Tower 1">Tower 1</option>
                <option value="Tower 2">Tower 2</option>
                <option value="Tower 3">Tower 3</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-600">Facing:</span>
            <div className="relative">
              <select
                value={filters.facing}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, facing: e.target.value }))
                }
                className="appearance-none px-3 py-1 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 pr-7 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North">North</option>
                <option value="South">South</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-600">
              Availability:
            </span>
            <div className="relative">
              <select
                value={filters.availability}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, availability: e.target.value }))
                }
                className="appearance-none px-3 py-1 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 pr-7 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Hold">Hold</option>
                <option value="Sold Out">Sold Out</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#0284c7] text-white text-[11px] font-semibold divide-x divide-sky-500/40 select-none">
                  <th className="py-2.5 px-3 min-w-[65px]">Variant</th>
                  <th className="py-2.5 px-3 min-w-[85px]">Tower</th>
                  <th className="py-2.5 px-3 min-w-[85px]">Area/Size</th>
                  <th className="py-2.5 px-3 min-w-[90px]">Unit Type</th>
                  <th className="py-2.5 px-3 min-w-[80px]">Facing</th>
                  <th className="py-2.5 px-3 min-w-[140px]">Series No</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Floors (Regular)</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Floors (Shrinked)</th>
                  <th className="py-2.5 px-3 min-w-[95px]">Availability</th>
                  <th className="py-2.5 px-3 min-w-[90px]">Total Flats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {filteredVariants.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-blue-50/20 transition-colors divide-x divide-slate-100"
                  >
                    <td className="p-2 text-center font-semibold text-slate-700">
                      {v.variantNumber}
                    </td>
                    <td className="p-2 font-medium text-slate-700">
                      {v.towerName || 'Tower 1'}
                    </td>
                    <td className="p-2 text-slate-500">
                      {v.saleableArea ? `${v.saleableArea} Sqft` : '--'}
                    </td>
                    <td className="p-2 text-slate-500">{v.unitType || '--'}</td>
                    <td className="p-2 text-slate-500">{v.facing || '--'}</td>
                    <td className="p-1.5">
                      <input
                        type="text"
                        placeholder="Ex: 1 or 1,2"
                        value={v.seriesNo}
                        onChange={(e) =>
                          handleRowChange(v.id, 'seriesNo', e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="text"
                        value={v.floorsRegular}
                        onChange={(e) =>
                          handleRowChange(v.id, 'floorsRegular', e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="text"
                        value={v.floorsShrinked}
                        onChange={(e) =>
                          handleRowChange(v.id, 'floorsShrinked', e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                      />
                    </td>
                    <td className="p-2 text-slate-500">
                      {v.variantAvailable || '--'}
                    </td>
                    <td className="p-2 text-slate-500">
                      {v.floorsRegular ? `${parseInt(v.floorsRegular) * 2}` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
        <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-800">Totals by Tower</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50/60 text-[11px] font-semibold text-slate-600">
              <tr>
                <th className="py-2 px-3">Tower</th>
                <th className="py-2 px-3">Variants</th>
                <th className="py-2 px-3">Units</th>
                <th className="py-2 px-3">Saleable Area</th>
                <th className="py-2 px-3">Built-up Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {towerTotals.map((tot) => (
                <tr key={tot.tower} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-700">
                    {tot.tower}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {tot.variants}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{tot.units}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {tot.saleableArea.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {tot.builtUpArea.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
        <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Total Project Inventory
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {variants.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50/60 text-[11px] font-semibold text-slate-600">
              <tr>
                <th className="py-2 px-3">Tower</th>
                <th className="py-2 px-3">Flat No</th>
                <th className="py-2 px-3">BHK Type</th>
                <th className="py-2 px-3">Saleable Area (SFT)</th>
                <th className="py-2 px-3">Inventory Owner</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-slate-700">
                    {v.towerName || 'Tower 1'}
                  </td>
                  <td className="py-1.5 px-3">
                    <input
                      type="text"
                      value={v.flatNo}
                      onChange={(e) =>
                        handleRowChange(v.id, 'flatNo', e.target.value)
                      }
                      className="px-2 py-1 text-xs border border-slate-200 rounded w-20"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{v.unitType || '--'}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {v.saleableArea ? `${v.saleableArea}` : '--'}
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="relative inline-block w-28">
                      <select
                        value={v.inventoryOwner}
                        onChange={(e) =>
                          handleRowChange(v.id, 'inventoryOwner', e.target.value)
                        }
                        className="w-full appearance-none px-2 py-1 text-xs bg-white border border-slate-200 rounded pr-6"
                      >
                        <option value="Builder">Builder</option>
                        <option value="Investor">Investor</option>
                        <option value="Owner">Owner</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="relative inline-block w-28">
                      <select
                        value={v.flatStatus}
                        onChange={(e) =>
                          handleRowChange(v.id, 'flatStatus', e.target.value)
                        }
                        className="w-full appearance-none px-2 py-1 text-xs bg-white border border-slate-200 rounded pr-6"
                      >
                        <option value="Available">Available</option>
                        <option value="Hold">Hold</option>
                        <option value="Booked">Booked</option>
                        <option value="Sold">Sold</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-200 text-xs font-semibold text-slate-700">
          Total Project Inventory: {variants.length}
        </div>
      </div>
    </div>
  );
}

export default PreviewAndToolsDesktop;
