import { useState, useMemo } from 'react';
import { Search, RotateCcw, Building2, Layers, Sparkles, SlidersHorizontal, Compass, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../../components/elements/ModernDropdown';
import { type InventoryVariant, VARIANT_AVAILABILITY } from '../Configuration/data';
import { INITIAL_PREVIEW_FILTERS, type PreviewFilters, type TowerTotalSummary, computeTowerTotals } from './data';

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

  const handleResetFilters = () => {
    setFilters(INITIAL_PREVIEW_FILTERS);
  };

  const filteredVariants = useMemo(() => {
    return variants.filter((v) => {
      if (filters.tower !== 'All' && v.towerName !== filters.tower) return false;
      if (filters.facing !== 'All' && v.facing !== filters.facing) return false;
      if (
        filters.availability !== 'All' &&
        v.variantAvailable !== filters.availability
      ) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesVariant = (v.variantNo || '').toLowerCase().includes(q);
        const matchesFlat = (v.flatNo || '').toLowerCase().includes(q);
        const matchesSeries = (v.seriesNo || '').toLowerCase().includes(q);
        const matchesUnit = (v.unitType || '').toLowerCase().includes(q);
        const matchesTower = (v.towerName || '').toLowerCase().includes(q);
        if (!matchesVariant && !matchesFlat && !matchesSeries && !matchesUnit && !matchesTower) {
          return false;
        }
      }
      return true;
    });
  }, [variants, filters]);

  const towerTotals: TowerTotalSummary[] = useMemo(() => {
    return computeTowerTotals(variants);
  }, [variants]);

  
  const totalSaleableSum = useMemo(() => {
    return variants.reduce((acc, v) => acc + (parseFloat(v.saleableArea) || 0), 0);
  }, [variants]);

  const totalBuiltUpSum = useMemo(() => {
    return variants.reduce((acc, v) => acc + (parseFloat(v.builtUpArea) || 0), 0);
  }, [variants]);

  const availableCount = useMemo(() => {
    return variants.filter((v) => (v.variantAvailable || 'Available') === 'Available').length;
  }, [variants]);

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              01
            </span>
            <span className="w-1 h-3.5 rounded-full bg-sky-600 dark:bg-sky-500" />
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
              Real-Time Inventory Matrix
            </h3>
            <span className="ml-1 px-2 py-0.5 rounded-[3px] text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              {filteredVariants.length} Displayed
            </span>
          </div>
        </div>

        
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-[4px] bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10">
          
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search by Flat No, Series, Unit Type, Tower..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>

          
          <div className="w-36">
            <ModernDropdown<string>
              value={filters.tower}
              onChange={(val) => setFilters((prev) => ({ ...prev, tower: val }))}
              options={[
                { value: 'All', label: 'All Towers' },
                { value: 'Tower 1', label: 'Tower 1' },
                { value: 'Tower 2', label: 'Tower 2' },
                { value: 'Tower 3', label: 'Tower 3' },
                { value: 'Tower 4', label: 'Tower 4' },
                { value: 'Tower 5', label: 'Tower 5' },
              ]}
              placeholder="Select Tower"
              roundedClass="rounded-[4px]"
              className="w-full"
              buttonClassName="w-full h-8 px-2.5 text-xs font-semibold gap-1"
            />
          </div>

          
          <div className="w-32">
            <ModernDropdown<string>
              value={filters.facing}
              onChange={(val) => setFilters((prev) => ({ ...prev, facing: val }))}
              options={[
                { value: 'All', label: 'All Facings' },
                { value: 'East', label: 'East' },
                { value: 'West', label: 'West' },
                { value: 'North', label: 'North' },
                { value: 'South', label: 'South' },
              ]}
              placeholder="Select Facing"
              roundedClass="rounded-[4px]"
              className="w-full"
              buttonClassName="w-full h-8 px-2.5 text-xs font-semibold gap-1"
            />
          </div>

          
          <div className="w-36">
            <ModernDropdown<string>
              value={filters.availability}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, availability: val }))
              }
              options={[
                { value: 'All', label: 'All Statuses' },
                {
                  value: 'Available',
                  label: 'Available',
                  icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />,
                },
                {
                  value: 'Hold',
                  label: 'Hold',
                  icon: <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" />,
                },
                {
                  value: 'Sold Out',
                  label: 'Sold Out',
                  icon: <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1" />,
                },
              ]}
              placeholder="Select Status"
              roundedClass="rounded-[4px]"
              className="w-full"
              buttonClassName="w-full h-8 px-2.5 text-xs font-semibold gap-1"
            />
          </div>

          
          {(filters.tower !== 'All' ||
            filters.facing !== 'All' ||
            filters.availability !== 'All' ||
            filters.searchQuery !== '') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 h-8 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        
        <div className="border border-slate-200 dark:border-white/10 rounded-[4px] overflow-hidden shadow-2xs bg-white dark:bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-white/10 select-none">
                  <th className="py-2.5 px-3">Variant / Code</th>
                  <th className="py-2.5 px-3">Tower</th>
                  <th className="py-2.5 px-3">Series No</th>
                  <th className="py-2.5 px-3">Flat Numbers</th>
                  <th className="py-2.5 px-3">Unit Type</th>
                  <th className="py-2.5 px-3">Facing</th>
                  <th className="py-2.5 px-3">Saleable (Sqft)</th>
                  <th className="py-2.5 px-3">Carpet (Sqft)</th>
                  <th className="py-2.5 px-3">Base Cost (INR)</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {filteredVariants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="text-center py-8 text-slate-400 dark:text-slate-500 italic text-xs"
                    >
                      No inventory configurations match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((v) => {
                    const isAvailable = (v.variantAvailable || 'Available') === 'Available';
                    const isHold = v.variantAvailable === 'Hold';

                    return (
                      <tr
                        key={v.id}
                        className="hover:bg-blue-50/30 dark:hover:bg-slate-900/60 transition-colors"
                      >
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>{v.variantNo || `VAR-0${v.variantNumber}`}</span>
                          </div>
                        </td>

                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {v.towerName || 'Tower 1'}
                          </span>
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={v.seriesNo}
                            onChange={(e) =>
                              handleRowChange(v.id, 'seriesNo', e.target.value)
                            }
                            placeholder="e.g. SER-01"
                            className="w-24 h-7 px-2 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600"
                          />
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={v.flatNo}
                            onChange={(e) =>
                              handleRowChange(v.id, 'flatNo', e.target.value)
                            }
                            placeholder="e.g. 101, 201, 301"
                            className="w-36 h-7 px-2 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600"
                          />
                        </td>

                        <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {v.unitType || '—'}
                        </td>

                        <td className="py-2 px-3">
                          {v.facing ? (
                            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                              <Compass className="w-3 h-3 text-amber-500" />
                              <span>{v.facing}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-2 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                          {v.saleableArea ? `${v.saleableArea} Sqft` : '—'}
                        </td>

                        <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {v.carpetArea ? `${v.carpetArea} Sqft` : '—'}
                        </td>

                        <td className="py-2 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                          {v.baseCost ? `₹${parseFloat(v.baseCost).toLocaleString()}` : '—'}
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={v.inventoryOwner || 'Builder'}
                            onChange={(e) =>
                              handleRowChange(v.id, 'inventoryOwner', e.target.value)
                            }
                            className="w-20 h-7 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600"
                          />
                        </td>

                        <td className="py-2 px-3">
                          <ModernDropdown<string>
                            value={v.variantAvailable || 'Available'}
                            onChange={(val) =>
                              handleRowChange(v.id, 'variantAvailable', val)
                            }
                            options={VARIANT_AVAILABILITY.filter((a) => a !== 'Select').map((a) => ({
                              value: a,
                              label: a,
                              icon: (
                                <span
                                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                    a === 'Available'
                                      ? 'bg-emerald-500'
                                      : a === 'Hold'
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                />
                              ),
                            }))}
                            placeholder="Select Status"
                            roundedClass="rounded-[3px]"
                            className="w-28"
                            buttonClassName="w-28 h-7 px-2 text-[11px] font-semibold gap-1"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      
      <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              02
            </span>
            <span className="w-1 h-3.5 rounded-full bg-purple-600 dark:bg-purple-500" />
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
              Tower-Wise Aggregation & Summaries
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {towerTotals.map((t) => (
            <div
              key={t.tower}
              className="p-4 rounded-[4px] bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/90 dark:border-white/10 space-y-3 shadow-2xs hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[4px] bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.tower}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {t.variants} Variants &bull; ~{t.units} Units
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Active Tower
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    Total Saleable
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {t.saleableArea.toLocaleString()} Sqft
                  </span>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    Total Built-Up
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {t.builtUpArea.toLocaleString()} Sqft
                  </span>
                </div>
              </div>

              
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Status Breakdown</span>
                  <span>{t.availableCount} Avail &bull; {t.holdCount} Hold &bull; {t.soldOutCount} Sold</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${t.variants > 0 ? (t.availableCount / t.variants) * 100 : 0}%`,
                    }}
                    className="bg-emerald-500 h-full"
                    title={`Available: ${t.availableCount}`}
                  />
                  <div
                    style={{
                      width: `${t.variants > 0 ? (t.holdCount / t.variants) * 100 : 0}%`,
                    }}
                    className="bg-amber-500 h-full"
                    title={`Hold: ${t.holdCount}`}
                  />
                  <div
                    style={{
                      width: `${t.variants > 0 ? (t.soldOutCount / t.variants) * 100 : 0}%`,
                    }}
                    className="bg-rose-500 h-full"
                    title={`Sold Out: ${t.soldOutCount}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PreviewAndToolsDesktop;
