import { useState, useRef, useMemo, type ChangeEvent } from 'react';
import { Check, Sparkles, Plus, Trash2, UploadCloud, ChevronsDown, ChevronsUp, Copy, ChevronDown, X } from 'lucide-react';
import { ModernDropdown } from '../../../components/elements/ModernDropdown';
import { INITIAL_CONFIGURATION_DATA, UNIT_TYPES, FACING_OPTIONS, WALL_STRUCTURES, FLOOR_PLAN_TYPES, VARIANT_AVAILABILITY, DESIGNATED_AREAS_LIST, AVAILABLE_TOWERS, createDefaultVariant, type InventoryVariant, type InventoryCommonConfig, type RoomItem } from './data';
import type { ConfigurationDesktopProps } from './desktop';

export function ConfigurationMobile({
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
  const [customDesignatedAreas, setCustomDesignatedAreas] = useState<string[]>([]);
  const [addingSpaceForVariant, setAddingSpaceForVariant] = useState<string | null>(null);
  const [newSpaceInput, setNewSpaceInput] = useState<string>('');

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
    showToast(`Variant ${nextNum} duplicated.`);
  };

  const handleAddConfigurationClick = () => {
    if (onAddConfiguration) {
      onAddConfiguration();
    } else {
      const nextNum = variants.length + 1;
      const newVar = createDefaultVariant(nextNum, `Tower 1`);
      updateVariants([...variants, newVar]);
      showToast(`Variant ${nextNum} added.`);
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

  const allDesignatedAreas = useMemo(() => {
    const list = [...DESIGNATED_AREAS_LIST.filter((a) => a !== 'None')];
    customDesignatedAreas.forEach((item) => {
      if (!list.includes(item)) list.push(item);
    });
    variants.forEach((v) => {
      (v.designatedAreas || []).forEach((item) => {
        if (item && item !== 'None' && !list.includes(item)) {
          list.push(item);
        }
      });
    });
    return list;
  }, [customDesignatedAreas, variants]);

  const handleAddNewDesignatedArea = (variantId: string) => {
    const trimmed = newSpaceInput.trim();
    if (!trimmed) {
      setAddingSpaceForVariant(null);
      return;
    }

    if (!customDesignatedAreas.includes(trimmed)) {
      setCustomDesignatedAreas((prev) => [...prev, trimmed]);
    }

    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      if (v.designatedAreas.includes(trimmed)) return v;
      return {
        ...v,
        designatedAreas: [...v.designatedAreas, trimmed],
      };
    });
    updateVariants(updated);

    showToast(`Added "${trimmed}" to designated rooms`);
    setAddingSpaceForVariant(null);
    setNewSpaceInput('');
  };

  const handleRemoveCustomDesignatedArea = (area: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomDesignatedAreas((prev) => prev.filter((a) => a !== area));
    const updated = variants.map((v) => ({
      ...v,
      designatedAreas: (v.designatedAreas || []).filter((a) => a !== area),
    }));
    updateVariants(updated);
    showToast(`Removed "${area}"`);
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
    <div className="space-y-4">
      {notification && (
        <div className="fixed top-3 inset-x-3 z-[9999] flex items-center justify-center gap-2 bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 px-3 py-2 rounded-[4px] shadow-2xl text-xs font-semibold backdrop-blur-md animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
          <span>{notification}</span>
        </div>
      )}

      
      <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs mt-0.5">
              01
            </span>
            <span className="w-1 h-3 rounded-full bg-blue-600 dark:bg-blue-500 mt-1" />
            <div>
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white font-display">
                Common Area & Loading Specs
              </h3>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                Calculation formula & loading percentage for variants.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col items-start w-full">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Common Area Calculation
            </label>
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
              <button
                type="button"
                onClick={() => updateCommonConfig('commonAreaCal', '% Only')}
                className={`h-9 px-2 flex items-center justify-center gap-1.5 rounded-[4px] text-xs font-semibold border transition-all ${
                  commonConfig.commonAreaCal === '% Only'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/20'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>% Only</span>
              </button>
              <button
                type="button"
                onClick={() => updateCommonConfig('commonAreaCal', '% of Saleable Area')}
                className={`h-9 px-2 flex items-center justify-center gap-1.5 rounded-[4px] text-xs font-semibold border transition-all ${
                  commonConfig.commonAreaCal === '% of Saleable Area'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/20'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>% of Saleable Area</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start w-36">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Loading Factor (%)
            </label>
            <div className="relative w-full">
              <input
                type="number"
                placeholder="e.g. 20"
                value={commonConfig.loadingFactor}
                onChange={(e) => updateCommonConfig('loadingFactor', e.target.value)}
                className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 select-none">
                %
              </span>
            </div>
          </div>
        </div>
      </section>

      
      <section className="space-y-3">
        
        <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              02
            </span>
            <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white font-display">
              Unit Configurations & Flat Variants
            </h3>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[3px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              {variants.length}
            </span>
          </div>

          
          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center p-0.5 rounded-[4px] bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 shadow-2xs">
              <button
                type="button"
                onClick={handleExpandAll}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold transition-all active:scale-95 ${
                  variants.length > 0 && variants.every((v) => !v.isCollapsed)
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
                title="Expand all variants"
              >
                <ChevronsDown className="w-3 h-3" />
                <span>Expand All</span>
              </button>
              <span className="w-px h-3 bg-slate-200 dark:bg-white/10 my-auto" />
              <button
                type="button"
                onClick={handleCollapseAll}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10.5px] font-semibold transition-all active:scale-95 ${
                  variants.length > 0 && variants.every((v) => v.isCollapsed)
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
                title="Collapse all variants"
              >
                <ChevronsUp className="w-3 h-3" />
                <span>Collapse All</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddConfigurationClick}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] text-xs font-semibold shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Variant</span>
            </button>
          </div>
        </div>

        
        <div className="space-y-3">
          {variants.map((v) => {
            const isAvailable = v.variantAvailable === 'Available';
            const isHold = v.variantAvailable === 'Hold';

            return (
              <div
                key={v.id}
                className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/90 dark:border-white/10 rounded-[4px] overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all"
              >
                
                <div
                  onClick={() => handleToggleCollapse(v.id)}
                  className="px-3 py-2.5 bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs shrink-0">
                      {v.variantNo || `VAR-0${v.variantNumber}`}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Variant {v.variantNumber} &bull; {v.unitType || 'Unit'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                          : isHold
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-500'
                            : isHold
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span>{v.variantAvailable || 'Available'}</span>
                    </span>
                  </div>

                  
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleDuplicateVariant(v)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[10.5px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 shadow-2xs transition-all active:scale-95"
                      title="Duplicate variant"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(v.id)}
                        className="w-7 h-7 rounded-[3px] flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 transition-all shadow-2xs active:scale-95 shrink-0"
                        title="Delete variant"
                        aria-label="Delete variant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleCollapse(v.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[10.5px] font-semibold border shadow-2xs transition-all active:scale-95 ${
                        !v.isCollapsed
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-white/10'
                      }`}
                      title={v.isCollapsed ? 'Expand' : 'Collapse'}
                    >
                      <span>{v.isCollapsed ? 'Expand' : 'Collapse'}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          v.isCollapsed ? 'rotate-0 text-slate-400' : 'rotate-180 text-indigo-600 dark:text-indigo-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                
                {!v.isCollapsed && (
                  <div className="p-3.5 space-y-6">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
                          01 / Core Unit Parameters
                        </span>
                      </div>

                      <div className="flex flex-col items-start w-full">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Unit Type
                          </label>
                          <ModernDropdown<string>
                            value={v.unitType}
                            onChange={(val) => handleVariantFieldChange(v.id, 'unitType', val)}
                            options={UNIT_TYPES.filter((u) => u !== 'Select').map((u) => ({
                              value: u,
                              label: u,
                            }))}
                            placeholder="Unit Type"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>

                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Facing
                          </label>
                          <ModernDropdown<string>
                            value={v.facing}
                            onChange={(val) => handleVariantFieldChange(v.id, 'facing', val)}
                            options={FACING_OPTIONS.filter((f) => f !== 'Select').map((f) => ({
                              value: f,
                              label: f,
                            }))}
                            placeholder="Facing"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-start w-full">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                          }))}
                          placeholder="Select Availability"
                          roundedClass="rounded-[4px]"
                          className="w-full inline-block"
                          buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                        />
                      </div>
                    </div>

                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
                          02 / Area & Dimensional Measurements
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Saleable Area (Sqft)
                          </label>
                          <input
                            type="text"
                            value={v.saleableArea}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'saleableArea', e.target.value)
                            }
                            placeholder="e.g. 1750"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Built-Up Area (Sqft)
                          </label>
                          <input
                            type="text"
                            value={v.builtUpArea}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'builtUpArea', e.target.value)
                            }
                            placeholder="e.g. 1400"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Carpet Area (Sqft)
                          </label>
                          <input
                            type="text"
                            value={v.carpetArea}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'carpetArea', e.target.value)
                            }
                            placeholder="e.g. 1220"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Common Area (Sqft)
                          </label>
                          <input
                            type="text"
                            value={v.commonArea}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'commonArea', e.target.value)
                            }
                            placeholder="e.g. 350"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Balcony Area (Sqft)
                          </label>
                          <input
                            type="text"
                            value={v.balconyArea}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'balconyArea', e.target.value)
                            }
                            placeholder="e.g. 110"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Utility Area (Sqft)
                          </label>
                          <input
                            type="text"
                            value={v.utilityArea}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'utilityArea', e.target.value)
                            }
                            placeholder="e.g. 45"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Plinth Area (Sqft)
                          </label>
                          <input
                            type="text"
                            value={v.plinthArea}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'plinthArea', e.target.value)
                            }
                            placeholder="e.g. 1480"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            UDS (Sqyd)
                          </label>
                          <input
                            type="text"
                            value={v.uds}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'uds', e.target.value)
                            }
                            placeholder="e.g. 48"
                            className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
                          03 / Architectural & Structural Specifications
                        </span>
                      </div>

                      <div className="flex flex-col items-start w-full">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                          placeholder="Wall Structure"
                          roundedClass="rounded-[4px]"
                          className="w-full inline-block"
                          buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                            placeholder="Plan Type"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Ceiling Height (Ft)
                          </label>
                          <input
                            type="text"
                            value={v.ceilingHeight}
                            onChange={(e) =>
                              handleVariantFieldChange(v.id, 'ceilingHeight', e.target.value)
                            }
                            placeholder="e.g. 10.5"
                            className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-start w-full">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          No. of Balconies
                        </label>
                        <input
                          type="text"
                          value={v.noOfBalconies}
                          onChange={(e) =>
                            handleVariantFieldChange(v.id, 'noOfBalconies', e.target.value)
                          }
                          placeholder="e.g. 2"
                          className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                      </div>
                    </div>

                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
                          04 / Applicable Towers & Designated Spaces
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                            Applicable Towers
                          </label>
                          <div className="flex items-center gap-2 flex-wrap">
                            {AVAILABLE_TOWERS.map((t) => {
                              const isChecked = v.selectedTowers.includes(t);
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => handleTowerToggle(v.id, t)}
                                  className={`h-8 px-3.5 inline-flex items-center justify-center rounded-[4px] text-xs font-semibold transition-all active:scale-95 ${
                                    isChecked
                                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-300'
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                            Designated Living Spaces & Extra Rooms
                          </label>
                          <div className="flex items-center gap-2 flex-wrap">
                            {allDesignatedAreas.map((area) => {
                              const isChecked = v.designatedAreas.includes(area);
                              const isPredefined = DESIGNATED_AREAS_LIST.includes(area);
                              return (
                                <button
                                  key={area}
                                  type="button"
                                  onClick={() => handleDesignatedAreaToggle(v.id, area)}
                                  className={`group h-8 inline-flex items-center gap-1.5 px-3 rounded-[4px] text-xs font-semibold border transition-all active:scale-95 ${
                                    isChecked
                                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                }`}
                              >
                                <span>{area}</span>
                                {!isPredefined && (
                                  <span
                                    onClick={(e) => handleRemoveCustomDesignatedArea(area, e)}
                                    className={`p-0.5 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors ${
                                      isChecked ? 'text-indigo-200 hover:text-white' : 'text-slate-400 hover:text-rose-600'
                                    }`}
                                    title={`Delete ${area}`}
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </button>
                            );
                          })}

                          {addingSpaceForVariant === v.id ? (
                            <div className="h-8 inline-flex items-center gap-1 p-1 pl-2.5 bg-white dark:bg-slate-900 border border-indigo-500 rounded-[4px] shadow-2xs">
                              <input
                                type="text"
                                value={newSpaceInput}
                                onChange={(e) => setNewSpaceInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddNewDesignatedArea(v.id);
                                  } else if (e.key === 'Escape') {
                                    setAddingSpaceForVariant(null);
                                    setNewSpaceInput('');
                                  }
                                }}
                                placeholder="Room name..."
                                autoFocus
                                className="h-6 text-xs bg-transparent text-slate-800 dark:text-slate-100 outline-none w-24 placeholder:text-slate-400"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddNewDesignatedArea(v.id)}
                                className="w-5 h-5 flex items-center justify-center rounded-[2px] bg-indigo-600 hover:bg-indigo-700 text-white"
                                title="Save room"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAddingSpaceForVariant(null);
                                  setNewSpaceInput('');
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded-[2px] text-slate-400 hover:text-slate-600"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setAddingSpaceForVariant(v.id);
                                setNewSpaceInput('');
                              }}
                              className="h-8 inline-flex items-center gap-1 px-3 rounded-[4px] text-xs font-semibold border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all active:scale-95"
                              title="Add custom designated room"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Add Room</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    </div>

                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
                          05 / Room Dimensions Matrix ({v.rooms.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddRoom(v.id)}
                          className="px-2 py-0.5 rounded-[3px] text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          + Add Room
                        </button>
                      </div>

                      <div className="space-y-2">
                        {v.rooms.map((room) => (
                          <div
                            key={room.id}
                            className="p-2.5 rounded-[3px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={room.roomName}
                                onChange={(e) =>
                                  handleRoomChange(v.id, room.id, 'roomName', e.target.value)
                                }
                                placeholder="Room Name"
                                className="h-8 px-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] flex-1 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteRoom(v.id, room.id)}
                                className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 transition-all shadow-2xs active:scale-95 shrink-0 inline-flex items-center justify-center"
                                title="Remove room"
                                aria-label="Remove room"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={room.length}
                                onChange={(e) =>
                                  handleRoomChange(v.id, room.id, 'length', e.target.value)
                                }
                                placeholder="L (Ft)"
                                className="h-8 px-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                              />
                              <input
                                type="text"
                                value={room.breadth}
                                onChange={(e) =>
                                  handleRoomChange(v.id, room.id, 'breadth', e.target.value)
                                }
                                placeholder="B (Ft)"
                                className="h-8 px-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                              />
                              <input
                                type="text"
                                value={room.size}
                                onChange={(e) =>
                                  handleRoomChange(v.id, room.id, 'size', e.target.value)
                                }
                                placeholder="Size"
                                className="h-8 px-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
                          06 / Base Pricing & Floor Plan Blueprints
                        </span>
                      </div>

                      <div className="flex flex-col items-start w-full">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Base Cost (INR)
                        </label>
                        <input
                          type="text"
                          value={v.baseCost}
                          onChange={(e) =>
                            handleVariantFieldChange(v.id, 'baseCost', e.target.value)
                          }
                          placeholder="e.g. 98,50,000"
                          className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Floor Plan 2D (PDF / JPG)
                          </label>
                          <FloorPlanUploadBox
                            inputId={`mobile-fp2d-${v.id}`}
                            value={v.floorPlan2D}
                            onChange={(fileName) =>
                              handleVariantFieldChange(v.id, 'floorPlan2D', fileName)
                            }
                            placeholder="Upload 2D Blueprint"
                          />
                        </div>

                        <div className="flex flex-col items-start w-full">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Floor Plan 3D (PDF / JPG)
                          </label>
                          <FloorPlanUploadBox
                            inputId={`mobile-fp3d-${v.id}`}
                            value={v.floorPlan3D}
                            onChange={(fileName) =>
                              handleVariantFieldChange(v.id, 'floorPlan3D', fileName)
                            }
                            placeholder="Upload 3D Blueprint"
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

        
        <div className="pt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={handleAddConfigurationClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-dashed border-blue-300 dark:border-blue-800/80 hover:border-blue-600 dark:hover:border-blue-500 rounded-[4px] bg-blue-50/50 hover:bg-blue-50/80 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-xs transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <div className="w-5.5 h-5.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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
          className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95 inline-flex items-center justify-center"
          title="Remove blueprint"
          aria-label="Remove blueprint"
        >
          <Trash2 className="w-3.5 h-3.5" />
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
      <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 dark:text-slate-500 truncate">
        {placeholder || 'No file chosen'}
      </div>
    </div>
  );
}

export default ConfigurationMobile;
