import { useState } from 'react';
import {
  Plus,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ModernDropdown } from '../../../components/elements/ModernDropdown';
import {
  INITIAL_CONFIGURATION_DATA,
  UNIT_TYPES,
  FACING_OPTIONS,
  WALL_STRUCTURES,
  FLOOR_PLAN_TYPES,
  VARIANT_AVAILABILITY,
  AVAILABLE_TOWERS,
  createDefaultVariant,
  type InventoryVariant,
  type InventoryCommonConfig,
  type RoomItem,
} from './data';
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

      {/* SECTION 01: Common Area & Loading Specifications */}
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

      {/* SECTION 02: Unit Configurations */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              02
            </span>
            <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white font-display">
              Variants ({variants.length})
            </h3>
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
                title="Expand all"
              >
                <ChevronsDown className="w-3 h-3" />
                <span>Expand</span>
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
                title="Collapse all"
              >
                <ChevronsUp className="w-3 h-3" />
                <span>Collapse</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddConfigurationClick}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] text-xs font-semibold shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Variants List */}
        <div className="space-y-3">
          {variants.map((v) => {
            const isAvailable = v.variantAvailable === 'Available';
            const isHold = v.variantAvailable === 'Hold';

            return (
              <div
                key={v.id}
                className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/90 dark:border-white/10 rounded-[4px] overflow-hidden shadow-xs"
              >
                {/* Header */}
                <div
                  onClick={() => handleToggleCollapse(v.id)}
                  className="px-3 py-2.5 bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5.5 h-5.5 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center shadow-2xs shrink-0">
                      <Layers className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {v.unitType || 'Unit'} &bull; {v.towerName || 'Tower'}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-[2px] text-[9.5px] font-bold ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isHold
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {v.variantAvailable || 'Available'}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleDuplicateVariant(v)}
                      className="w-7 h-7 rounded-[4px] flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 shadow-2xs transition-all active:scale-95"
                      title="Duplicate (Copy)"
                    >
                      <Copy className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(v.id)}
                        className="w-7 h-7 rounded-[4px] flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 transition-all shadow-2xs active:scale-95"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.8] text-rose-600 dark:text-rose-400" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleCollapse(v.id)}
                      className={`inline-flex items-center gap-1 h-7 px-2 rounded-[4px] text-[11px] font-semibold border shadow-2xs transition-all active:scale-95 ${
                        !v.isCollapsed
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-white/10'
                      }`}
                      title={v.isCollapsed ? 'Expand' : 'Collapse'}
                    >
                      <span>{v.isCollapsed ? 'Expand' : 'Collapse'}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          v.isCollapsed ? 'rotate-0 text-slate-500' : 'rotate-180 text-indigo-600 dark:text-indigo-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Body */}
                {!v.isCollapsed && (
                  <div className="p-3.5 space-y-4">
                    {/* Basic specs */}
                    <div className="space-y-3">
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
                          className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
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
                          Availability
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

                    {/* Areas */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
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

                    {/* Architecture */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
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
                    </div>

                    {/* Multi-Select Towers */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        Assigned Towers
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {AVAILABLE_TOWERS.map((t) => {
                          const isChecked = v.selectedTowers.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleTowerToggle(v.id, t)}
                              className={`px-2.5 py-1 rounded-[3px] text-xs font-semibold flex items-center gap-1 transition-all ${
                                isChecked
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              <span>{t}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Room sizes */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Rooms ({v.rooms.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddRoom(v.id)}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400"
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
                                className="h-8 px-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px] flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteRoom(v.id, room.id)}
                                className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 transition-all shadow-2xs active:scale-95"
                                title="Remove room"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
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
                                className="h-8 px-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px]"
                              />
                              <input
                                type="text"
                                value={room.breadth}
                                onChange={(e) =>
                                  handleRoomChange(v.id, room.id, 'breadth', e.target.value)
                                }
                                placeholder="B (Ft)"
                                className="h-8 px-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px]"
                              />
                              <input
                                type="text"
                                value={room.size}
                                onChange={(e) =>
                                  handleRoomChange(v.id, room.id, 'size', e.target.value)
                                }
                                placeholder="Size"
                                className="h-8 px-2 text-xs font-mono font-bold text-blue-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Commercials & blueprints */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
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
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ConfigurationMobile;
