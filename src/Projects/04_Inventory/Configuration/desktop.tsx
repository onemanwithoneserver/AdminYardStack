import { useState, useRef, type ChangeEvent } from 'react';
import { Plus, ChevronDown, ChevronsDown, ChevronsUp, Trash2, Copy, UploadCloud, X, Check, Layers, Sparkles, Building2, SlidersHorizontal, Compass } from 'lucide-react';
import { ModernDropdown } from '../../../components/elements/ModernDropdown';
import { INITIAL_CONFIGURATION_DATA, UNIT_TYPES, FACING_OPTIONS, WALL_STRUCTURES, FLOOR_PLAN_TYPES, VARIANT_AVAILABILITY, DESIGNATED_AREAS_LIST, AVAILABLE_TOWERS, createDefaultVariant, type InventoryVariant, type InventoryCommonConfig, type RoomItem } from './data';

export interface ConfigurationDesktopProps {
  variants?: InventoryVariant[];
  commonConfig?: InventoryCommonConfig;
  onVariantsChange?: (variants: InventoryVariant[]) => void;
  onCommonConfigChange?: (config: InventoryCommonConfig) => void;
  onAddConfiguration?: () => void;
}

export function ConfigurationDesktop({
  variants: externalVariants,
  commonConfig: externalCommonConfig,
  onVariantsChange,
  onCommonConfigChange,
  onAddConfiguration,
}: ConfigurationDesktopProps) {
  const [internalCommonConfig, setInternalCommonConfig] =
    useState<InventoryCommonConfig>(INITIAL_CONFIGURATION_DATA.commonConfig);
  const [internalVariants, setInternalVariants] = useState<InventoryVariant[]>(
    INITIAL_CONFIGURATION_DATA.variants
  );

  const [notification, setNotification] = useState<string | null>(null);

  const commonConfig = externalCommonConfig ?? internalCommonConfig;
  const variants = externalVariants ?? internalVariants;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateCommonConfig = (field: keyof InventoryCommonConfig, value: string) => {
    const updated = { ...commonConfig, [field]: value };
    if (onCommonConfigChange) {
      onCommonConfigChange(updated);
    } else {
      setInternalCommonConfig(updated);
    }
  };

  const updateVariants = (newVariants: InventoryVariant[]) => {
    if (onVariantsChange) {
      onVariantsChange(newVariants);
    } else {
      setInternalVariants(newVariants);
    }
  };

  const handleVariantFieldChange = (
    variantId: string,
    field: keyof InventoryVariant,
    value: unknown
  ) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      return { ...v, [field]: value };
    });
    updateVariants(updated);
  };

  const handleToggleCollapse = (variantId: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      return { ...v, isCollapsed: !v.isCollapsed };
    });
    updateVariants(updated);
  };

  const handleExpandAll = () => {
    updateVariants(variants.map((v) => ({ ...v, isCollapsed: false })));
  };

  const handleCollapseAll = () => {
    updateVariants(variants.map((v) => ({ ...v, isCollapsed: true })));
  };

  const handleDeleteVariant = (variantId: string) => {
    if (variants.length <= 1) {
      showToast('At least one configuration is required.');
      return;
    }
    const updated = variants.filter((v) => v.id !== variantId);
    updateVariants(updated);
    showToast('Configuration removed.');
  };

  const handleDuplicateVariant = (variant: InventoryVariant) => {
    const nextNum = variants.length + 1;
    const duplicated: InventoryVariant = {
      ...variant,
      id: `variant-${nextNum}-${Date.now()}`,
      variantNumber: nextNum,
      variantNo: `VAR-0${nextNum}`,
      isCollapsed: false,
      rooms: variant.rooms.map((r) => ({ ...r, id: `room-${Date.now()}-${Math.random()}` })),
    };
    updateVariants([...variants, duplicated]);
    showToast(`Variant ${nextNum} created as copy of Variant ${variant.variantNumber}`);
  };

  const handleAddConfigurationClick = () => {
    if (onAddConfiguration) {
      onAddConfiguration();
    } else {
      const nextNum = variants.length + 1;
      const newVar = createDefaultVariant(nextNum, `Tower 1`);
      updateVariants([...variants, newVar]);
      showToast(`Variant ${nextNum} added successfully.`);
    }
  };

  const handleAddRoom = (variantId: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      const newRoom: RoomItem = {
        id: `room-${Date.now()}`,
        roomName: 'New Room',
        length: '12',
        breadth: '14',
        size: '168 Sqft',
        relatedTo: 'Living',
      };
      return { ...v, rooms: [...v.rooms, newRoom] };
    });
    updateVariants(updated);
  };

  const handleDeleteRoom = (variantId: string, roomId: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      return { ...v, rooms: v.rooms.filter((r) => r.id !== roomId) };
    });
    updateVariants(updated);
  };

  const handleRoomChange = (
    variantId: string,
    roomId: string,
    field: keyof RoomItem,
    val: string
  ) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      return {
        ...v,
        rooms: v.rooms.map((r) => {
          if (r.id !== roomId) return r;
          const updatedRoom = { ...r, [field]: val };
          
          if (field === 'length' || field === 'breadth') {
            const l = parseFloat(field === 'length' ? val : r.length);
            const b = parseFloat(field === 'breadth' ? val : r.breadth);
            if (!isNaN(l) && !isNaN(b) && l > 0 && b > 0) {
              updatedRoom.size = `${Math.round(l * b)} Sqft`;
            }
          }
          return updatedRoom;
        }),
      };
    });
    updateVariants(updated);
  };

  const handleTowerToggle = (variantId: string, tower: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      const isSelected = v.selectedTowers.includes(tower);
      const selected = isSelected
        ? v.selectedTowers.filter((t) => t !== tower)
        : [...v.selectedTowers, tower];
      const finalSelected = selected.length > 0 ? selected : [tower];
      return {
        ...v,
        selectedTowers: finalSelected,
        towerName: finalSelected[0] || tower,
      };
    });
    updateVariants(updated);
  };

  const handleDesignatedAreaToggle = (variantId: string, area: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      const isSelected = v.designatedAreas.includes(area);
      const areas = isSelected
        ? v.designatedAreas.filter((a) => a !== area)
        : [...v.designatedAreas, area];
      return { ...v, designatedAreas: areas.length > 0 ? areas : [] };
    });
    updateVariants(updated);
  };

  return (
    <div className="space-y-5">
      {notification && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-[4px] shadow-2xl text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
          <span>{notification}</span>
        </div>
      )}

      
      <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs mt-0.5">
              01
            </span>
            <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500 mt-1" />
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Common Area & Loading Specifications
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Specify computation formula and percentage loading applied across unit variants.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-6 sm:gap-8">
          
          <div className="flex flex-col items-start">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
              Common Area Calculation Method
            </label>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateCommonConfig('commonAreaCal', '% Only')}
                className={`h-9 px-3.5 inline-flex items-center gap-2 rounded-[4px] text-xs font-semibold border transition-all cursor-pointer ${
                  commonConfig.commonAreaCal === '% Only'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-2xs ring-1 ring-blue-600/20'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                    commonConfig.commonAreaCal === '% Only'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-white/20'
                  }`}
                >
                  {commonConfig.commonAreaCal === '% Only' && <Check className="w-2.5 h-2.5" />}
                </span>
                <span>% Only</span>
              </button>

              <button
                type="button"
                onClick={() => updateCommonConfig('commonAreaCal', '% of Saleable Area')}
                className={`h-9 px-3.5 inline-flex items-center gap-2 rounded-[4px] text-xs font-semibold border transition-all cursor-pointer ${
                  commonConfig.commonAreaCal === '% of Saleable Area'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-2xs ring-1 ring-blue-600/20'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                    commonConfig.commonAreaCal === '% of Saleable Area'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-white/20'
                  }`}
                >
                  {commonConfig.commonAreaCal === '% of Saleable Area' && <Check className="w-2.5 h-2.5" />}
                </span>
                <span>% of Saleable Area</span>
              </button>
            </div>
          </div>

          
          <div className="flex flex-col items-start w-36 sm:w-44">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
              Loading Factor (%)
            </label>
            <div className="relative w-full">
              <input
                type="number"
                placeholder="e.g. 20"
                value={commonConfig.loadingFactor}
                onChange={(e) => updateCommonConfig('loadingFactor', e.target.value)}
                className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition-all"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 dark:text-slate-500 select-none">
                %
              </span>
            </div>
          </div>
        </div>
      </section>

      
      <section className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[4px] bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              02
            </span>
            <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
              Unit Configurations & Flat Variants
            </h3>
            <span className="ml-1 px-2 py-0.5 rounded-[3px] text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {variants.length} Configured
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center p-0.5 rounded-[4px] bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 shadow-2xs">
              <button
                type="button"
                onClick={handleExpandAll}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                  variants.length > 0 && variants.every((v) => !v.isCollapsed)
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/70 dark:hover:bg-slate-700/50'
                }`}
                title="Expand all variants"
              >
                <ChevronsDown className="w-3.5 h-3.5" />
                <span>Expand All</span>
              </button>
              <span className="w-px h-3.5 bg-slate-200 dark:bg-white/10 my-auto" />
              <button
                type="button"
                onClick={handleCollapseAll}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                  variants.length > 0 && variants.every((v) => v.isCollapsed)
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/70 dark:hover:bg-slate-700/50'
                }`}
                title="Collapse all variants"
              >
                <ChevronsUp className="w-3.5 h-3.5" />
                <span>Collapse All</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddConfigurationClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 ml-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>
        </div>

        
        <div className="space-y-4">
          {variants.map((v) => {
            const isAvailable = v.variantAvailable === 'Available';
            const isHold = v.variantAvailable === 'Hold';
            const isSoldOut = v.variantAvailable === 'Sold Out';

            return (
              <div
                key={v.id}
                className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/90 dark:border-white/10 rounded-[4px] overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200"
              >
                
                <div
                  onClick={() => handleToggleCollapse(v.id)}
                  className="px-4 py-3 bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3 flex-wrap min-w-0">
                    
                    <div className="w-6 h-6 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <Layers className="w-3.5 h-3.5" />
                    </div>

                    <span className="w-1 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />

                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white font-display">
                        Variant {v.variantNumber}
                      </h4>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({v.variantNo || `VAR-0${v.variantNumber}`})
                      </span>
                    </div>

                    
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80">
                        {v.towerName || 'Tower 1'}
                      </span>
                      <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
                        {v.unitType || 'Unassigned'}
                      </span>
                      {v.facing && (
                        <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 flex items-center gap-1">
                          <Compass className="w-2.5 h-2.5" />
                          <span>{v.facing}</span>
                        </span>
                      )}
                      {v.saleableArea && (
                        <span className="px-2 py-0.5 rounded-[3px] text-[10.5px] font-mono font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {v.saleableArea} Sqft
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : isHold
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable
                              ? 'bg-emerald-500 animate-pulse'
                              : isHold
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span>{v.variantAvailable || 'Available'}</span>
                      </span>
                    </div>
                  </div>

                  
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleDuplicateVariant(v)}
                      className="w-7 h-7 rounded-[4px] flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-700 dark:hover:text-rose-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                      title="Duplicate Variant (Copy)"
                      aria-label="Duplicate Variant"
                    >
                      <Copy className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(v.id)}
                        className="w-7 h-7 rounded-[4px] flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-700 dark:hover:text-rose-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                        title="Delete Variant"
                        aria-label="Delete Variant"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.8] text-rose-600 dark:text-rose-400" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleCollapse(v.id)}
                      className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[4px] text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                        !v.isCollapsed
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/90 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                          : 'bg-white/95 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                      }`}
                      title={v.isCollapsed ? 'Expand Variant Details' : 'Collapse Variant Details'}
                      aria-label={v.isCollapsed ? 'Expand Variant' : 'Collapse Variant'}
                    >
                      <span className="text-[11px] font-semibold tracking-tight">
                        {v.isCollapsed ? 'Expand' : 'Collapse'}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-250 ease-out ${
                          v.isCollapsed ? 'rotate-0 text-slate-500 dark:text-slate-400' : 'rotate-180 text-indigo-600 dark:text-indigo-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                
                {!v.isCollapsed && (
                  <div className="p-4 sm:p-5 space-y-5 text-slate-800 dark:text-slate-100 animate-in fade-in duration-150">
                    
                    <div>
                      <h5 className="text-[12px] font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Core Unit Parameters</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Variant Identifier
                          </label>
                          <input
                            type="text"
                            value={v.variantNo}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'variantNo', e.target.value)
                            }
                            placeholder="e.g. VAR-01"
                            className="w-full h-9 px-3 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Unit Type
                          </label>
                          <ModernDropdown<string>
                            value={v.unitType}
                            onChange={(val) => handleVariantFieldChange(v.id, 'unitType', val)}
                            options={UNIT_TYPES.filter((u) => u !== 'Select').map((u) => ({
                              value: u,
                              label: u,
                            }))}
                            placeholder="Select Unit Type"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Facing
                          </label>
                          <ModernDropdown<string>
                            value={v.facing}
                            onChange={(val) => handleVariantFieldChange(v.id, 'facing', val)}
                            options={FACING_OPTIONS.filter((f) => f !== 'Select').map((f) => ({
                              value: f,
                              label: f,
                            }))}
                            placeholder="Select Facing"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Variant Availability
                          </label>
                          <ModernDropdown<string>
                            value={v.variantAvailable}
                            onChange={(val) =>
                              handleVariantFieldChange(v.id, 'variantAvailable', val)
                            }
                            options={VARIANT_AVAILABILITY.filter((a) => a !== 'Select').map((a) => ({
                              value: a,
                              label: a,
                              icon: (
                                <span
                                  className={`w-2 h-2 rounded-full inline-block mr-1.5 ${
                                    a === 'Available'
                                      ? 'bg-emerald-500'
                                      : a === 'Hold'
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                />
                              ),
                            }))}
                            placeholder="Select Availability"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>
                      </div>
                    </div>

                    
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                      <h5 className="text-[12px] font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Area & Dimensional Measurements</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Saleable Area (Sqft)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.saleableArea}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'saleableArea', e.target.value)
                              }
                              placeholder="e.g. 1750"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqft
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Built-Up Area (Sqft)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.builtUpArea}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'builtUpArea', e.target.value)
                              }
                              placeholder="e.g. 1400"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqft
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Carpet Area (Sqft)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.carpetArea}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'carpetArea', e.target.value)
                              }
                              placeholder="e.g. 1220"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqft
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Plinth Area (Sqft)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.plinthArea}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'plinthArea', e.target.value)
                              }
                              placeholder="e.g. 1480"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqft
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Common Area (Sqft)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.commonArea}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'commonArea', e.target.value)
                              }
                              placeholder="e.g. 350"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqft
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Undivided Share (UDS)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.uds}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'uds', e.target.value)
                              }
                              placeholder="e.g. 48"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqyd
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Balcony Area (Sqft)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.balconyArea}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'balconyArea', e.target.value)
                              }
                              placeholder="e.g. 110"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqft
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Utility Area (Sqft)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.utilityArea}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'utilityArea', e.target.value)
                              }
                              placeholder="e.g. 45"
                              className="w-full h-9 pl-3 pr-11 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Sqft
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                      <h5 className="text-[12px] font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Architecture & Structural Specifications</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Wall Structure
                          </label>
                          <ModernDropdown<string>
                            value={v.wallStructure}
                            onChange={(val) =>
                              handleVariantFieldChange(v.id, 'wallStructure', val)
                            }
                            options={WALL_STRUCTURES.filter((w) => w !== 'Select').map((w) => ({
                              value: w,
                              label: w,
                            }))}
                            placeholder="Select Structure"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Floor Plan Type
                          </label>
                          <ModernDropdown<string>
                            value={v.floorPlanType}
                            onChange={(val) =>
                              handleVariantFieldChange(v.id, 'floorPlanType', val)
                            }
                            options={FLOOR_PLAN_TYPES.filter((fp) => fp !== 'Select').map((fp) => ({
                              value: fp,
                              label: fp,
                            }))}
                            placeholder="Select Plan Type"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Ceiling Height (Feet)
                          </label>
                          <div className="relative w-full">
                            <input
                              type="text"
                              value={v.ceilingHeight}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'ceilingHeight', e.target.value)
                              }
                              placeholder="e.g. 10.5"
                              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                            <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-slate-400">
                              Ft
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            No. of Balconies
                          </label>
                          <input
                            type="number"
                            value={v.noOfBalconies}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'noOfBalconies', e.target.value)
                            }
                            placeholder="e.g. 2"
                            className="w-full h-9 px-3 text-xs font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Applicable Towers
                          </label>
                          <div className="flex items-center gap-2 flex-wrap p-2 w-full rounded-[4px] bg-slate-50/80 dark:bg-slate-950 border border-slate-200 dark:border-white/10 min-h-[44px]">
                            {AVAILABLE_TOWERS.map((t) => {
                              const isChecked = v.selectedTowers.includes(t);
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => handleTowerToggle(v.id, t)}
                                  className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-blue-600 text-white shadow-2xs'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-300'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  <span>{t}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Designated Living Spaces & Extra Rooms
                          </label>
                          <div className="flex items-center gap-2 flex-wrap p-2 w-full rounded-[4px] bg-slate-50/80 dark:bg-slate-950 border border-slate-200 dark:border-white/10 min-h-[44px]">
                            {DESIGNATED_AREAS_LIST.filter((a) => a !== 'None').map((area) => {
                              const isSelected = v.designatedAreas.includes(area);
                              return (
                                <button
                                  key={area}
                                  type="button"
                                  onClick={() => handleDesignatedAreaToggle(v.id, area)}
                                  className={`px-3 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white shadow-2xs'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  <span>{area}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[12px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Detailed Room Dimensions Matrix</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => handleAddRoom(v.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Room</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                        <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-white/10">
                          <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <tr>
                              <th className="py-2.5 px-3">Room / Space Name</th>
                              <th className="py-2.5 px-3">Length (Ft)</th>
                              <th className="py-2.5 px-3">Breadth (Ft)</th>
                              <th className="py-2.5 px-3">Size (Calculated)</th>
                              <th className="py-2.5 px-3">Connected / Related To</th>
                              <th className="py-2.5 px-3 w-16 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-950">
                            {v.rooms.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="text-center py-4 text-slate-400 dark:text-slate-500 text-xs italic"
                                >
                                  No room dimensions added yet. Click &ldquo;Add Room&rdquo; to define individual room sizes.
                                </td>
                              </tr>
                            ) : (
                              v.rooms.map((room) => (
                                <tr
                                  key={room.id}
                                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                                >
                                  <td className="p-2">
                                    <input
                                      type="text"
                                      value={room.roomName}
                                      onChange={(e) =>
                                        handleRoomChange(
                                          v.id,
                                          room.id,
                                          'roomName',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. Master Bedroom"
                                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                    />
                                  </td>
                                  <td className="p-2 w-32">
                                    <input
                                      type="text"
                                      value={room.length}
                                      onChange={(e) =>
                                        handleRoomChange(
                                          v.id,
                                          room.id,
                                          'length',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. 14"
                                      className="w-full h-8 px-2.5 font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                    />
                                  </td>
                                  <td className="p-2 w-32">
                                    <input
                                      type="text"
                                      value={room.breadth}
                                      onChange={(e) =>
                                        handleRoomChange(
                                          v.id,
                                          room.id,
                                          'breadth',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. 16"
                                      className="w-full h-8 px-2.5 font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                    />
                                  </td>
                                  <td className="p-2 w-36">
                                    <input
                                      type="text"
                                      value={room.size}
                                      onChange={(e) =>
                                        handleRoomChange(
                                          v.id,
                                          room.id,
                                          'size',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. 224 Sqft"
                                      className="w-full h-8 px-2.5 font-mono bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-[3px] text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:border-blue-600"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="text"
                                      value={room.relatedTo}
                                      onChange={(e) =>
                                        handleRoomChange(
                                          v.id,
                                          room.id,
                                          'relatedTo',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. Living / Foyer"
                                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRoom(v.id, room.id)}
                                      className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                                      title="Remove room"
                                      aria-label="Remove room"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Base Cost (INR)
                          </label>
                          <div className="relative w-full">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 select-none">
                              ₹
                            </span>
                            <input
                              type="text"
                              value={v.baseCost}
                              onChange={(e) =>
                                handleVariantFieldChange(v.id, 'baseCost', e.target.value)
                              }
                              placeholder="e.g. 98,50,000"
                              className="w-full h-9 pl-7 pr-3 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Floor Plan 2D (CAD / PDF)
                          </label>
                          <FloorPlanUploadBox
                            value={v.floorPlan2D}
                            onChange={(fileName) =>
                              handleVariantFieldChange(v.id, 'floorPlan2D', fileName)
                            }
                            inputId={`fp-2d-${v.id}`}
                            placeholder="Upload 2D Blueprint"
                          />
                        </div>

                        
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                            Floor Plan 3D (Render / Isometric)
                          </label>
                          <FloorPlanUploadBox
                            value={v.floorPlan3D}
                            onChange={(fileName) =>
                              handleVariantFieldChange(v.id, 'floorPlan3D', fileName)
                            }
                            inputId={`fp-3d-${v.id}`}
                            placeholder="Upload 3D Isometric"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAddConfigurationClick}
            className="w-full py-3.5 border-2 border-dashed border-blue-300 dark:border-blue-800/80 hover:border-blue-600 dark:hover:border-blue-500 rounded-[4px] bg-blue-50/50 hover:bg-blue-50/80 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add New Variant Configuration</span>
          </button>
        </div>
      </section>
    </div>
  );
}

interface FloorPlanUploadBoxProps {
  value: string | null;
  onChange: (fileName: string | null) => void;
  inputId: string;
  placeholder: string;
}

function FloorPlanUploadBox({ value, onChange, inputId, placeholder }: FloorPlanUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file.name);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (value) {
    return (
      <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
        <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
          {value}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
          title="Remove blueprint"
          aria-label="Remove blueprint"
        >
          <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 h-9 w-full">
      <input
        ref={fileInputRef}
        type="file"
        id={inputId}
        accept=".pdf,image/*"
        onChange={handleFile}
        className="sr-only"
      />
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
      >
        <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Choose</span>
      </label>
      <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 truncate">
        {placeholder}
      </div>
    </div>
  );
}

export default ConfigurationDesktop;
