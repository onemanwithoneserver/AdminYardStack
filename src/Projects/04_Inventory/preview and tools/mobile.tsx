import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ModernDropdown } from '../../../components/elements/ModernDropdown';
import { type InventoryVariant, VARIANT_AVAILABILITY } from '../Configuration/data';
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

  const availableCount = useMemo(() => {
    return variants.filter((v) => (v.variantAvailable || 'Available') === 'Available').length;
  }, [variants]);

  return (
    <div className="space-y-4 text-slate-800 dark:text-slate-100">
      
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-2.5 rounded-[4px] bg-white/95 dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
            Total Saleable
          </span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
            {totalSaleableSum.toLocaleString()} Sqft
          </span>
        </div>
        <div className="p-2.5 rounded-[4px] bg-white/95 dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
            Available
          </span>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            {availableCount} / {variants.length} Units
          </span>
        </div>
      </div>

      
      <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              01
            </span>
            <span className="w-1 h-3 rounded-full bg-sky-600 dark:bg-sky-500" />
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white font-display">
              Inventory Matrix ({filteredVariants.length})
            </h3>
          </div>
        </div>

        
        <div className="space-y-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search flat, series, tower..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ModernDropdown<string>
              value={filters.tower}
              onChange={(val) => setFilters((prev) => ({ ...prev, tower: val }))}
              options={[
                { value: 'All', label: 'All Towers' },
                { value: 'Tower 1', label: 'Tower 1' },
                { value: 'Tower 2', label: 'Tower 2' },
                { value: 'Tower 3', label: 'Tower 3' },
              ]}
              placeholder="Select Tower"
              roundedClass="rounded-[4px]"
              className="w-full"
              buttonClassName="w-full h-8 px-2 text-xs font-medium gap-1"
            />

            <ModernDropdown<string>
              value={filters.availability}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, availability: val }))
              }
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Available', label: 'Available' },
                { value: 'Hold', label: 'Hold' },
                { value: 'Sold Out', label: 'Sold Out' },
              ]}
              placeholder="Select Status"
              roundedClass="rounded-[4px]"
              className="w-full"
              buttonClassName="w-full h-8 px-2 text-xs font-medium gap-1"
            />
          </div>
        </div>

        
        <div className="space-y-3 pt-1">
          {filteredVariants.length === 0 ? (
            <div className="text-center py-6 text-slate-400 dark:text-slate-500 italic text-xs">
              No matching inventory configurations.
            </div>
          ) : (
            filteredVariants.map((v) => {
              const isAvailable = (v.variantAvailable || 'Available') === 'Available';
              const isHold = v.variantAvailable === 'Hold';

              return (
                <div
                  key={v.id}
                  className="p-3 rounded-[4px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {v.variantNo || `VAR-0${v.variantNumber}`}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {v.towerName || 'Tower 1'}
                      </span>
                    </div>

                    <ModernDropdown<string>
                      value={v.variantAvailable || 'Available'}
                      onChange={(val) => handleRowChange(v.id, 'variantAvailable', val)}
                      options={VARIANT_AVAILABILITY.filter((a) => a !== 'Select').map((a) => ({
                        value: a,
                        label: a,
                      }))}
                      placeholder="Select Status"
                      roundedClass="rounded-[3px]"
                      className="w-24"
                      buttonClassName="w-24 h-7 px-1.5 text-[10.5px] font-semibold gap-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Unit & Facing</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {v.unitType || '—'} &bull; {v.facing || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Saleable Area</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {v.saleableArea ? `${v.saleableArea} Sqft` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Series</span>
                      <input
                        type="text"
                        value={v.seriesNo}
                        onChange={(e) => handleRowChange(v.id, 'seriesNo', e.target.value)}
                        placeholder="SER-01"
                        className="h-7 px-2 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] w-full"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Flats</span>
                      <input
                        type="text"
                        value={v.flatNo}
                        onChange={(e) => handleRowChange(v.id, 'flatNo', e.target.value)}
                        placeholder="101, 201"
                        className="h-7 px-2 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] w-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      
      <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              02
            </span>
            <span className="w-1 h-3 rounded-full bg-purple-600 dark:bg-purple-500" />
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white font-display">
              Tower Summaries
            </h3>
          </div>
        </div>

        <div className="space-y-2.5">
          {towerTotals.map((t) => (
            <div
              key={t.tower}
              className="p-3 rounded-[4px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{t.tower}</span>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                  {t.variants} Variants &bull; ~{t.units} Units
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <span>Saleable: {t.saleableArea.toLocaleString()} Sqft</span>
                <span>Built-Up: {t.builtUpArea.toLocaleString()} Sqft</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PreviewAndToolsMobile;
