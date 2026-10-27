import { useState, useRef, useMemo, useEffect, type ChangeEvent } from 'react';
import { Check, Sparkles, Plus, Trash2, UploadCloud, Copy, X, Boxes } from 'lucide-react';
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
  const [customDesignatedAreas, setCustomDesignatedAreas] = useState<string[]>([]);
  const [addingSpaceForVariant, setAddingSpaceForVariant] = useState<string | null>(null);
  const [newSpaceInput, setNewSpaceInput] = useState<string>('');

  const commonConfig = externalCommonConfig ?? internalCommonConfig;
  const variants = externalVariants ?? internalVariants;

  const [activeVariantId, setActiveVariantId] = useState<string>(() => variants[0]?.id || '');
  const prevVariantsLenRef = useRef(variants.length);

  // Synchronize activeVariantId if current variant is missing or a new variant was appended
  useEffect(() => {
    if (variants.length > prevVariantsLenRef.current) {
      const newestVariant = variants[variants.length - 1];
      if (newestVariant) {
        setActiveVariantId(newestVariant.id);
      }
    } else if (variants.length > 0 && !variants.some((v) => v.id === activeVariantId)) {
      setActiveVariantId(variants[variants.length - 1].id);
    }
    prevVariantsLenRef.current = variants.length;
  }, [variants, activeVariantId]);

  const activeVariant = variants.find((v) => v.id === activeVariantId) || variants[0];
  const activeIndex = variants.findIndex((v) => v.id === activeVariant?.id);

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

  const handleDeleteVariant = (variantId: string) => {
    if (variants.length <= 1) {
      showToast('At least one configuration is required.');
      return;
    }
    const targetIndex = variants.findIndex((v) => v.id === variantId);
    const updated = variants.filter((v) => v.id !== variantId);
    if (activeVariantId === variantId) {
      const nextActive = updated[targetIndex] || updated[targetIndex - 1] || updated[0];
      if (nextActive) {
        setActiveVariantId(nextActive.id);
      }
    }
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
    const nextList = [...variants, duplicated];
    setActiveVariantId(duplicated.id);
    updateVariants(nextList);
    showToast(`Variant ${nextNum} created as copy of Variant ${variant.variantNumber}`);
  };

  const handleAddConfigurationClick = () => {
    if (onAddConfiguration) {
      onAddConfiguration();
    } else {
      const nextNum = variants.length + 1;
      const newVar = createDefaultVariant(nextNum, `Tower 1`);
      const nextList = [...variants, newVar];
      setActiveVariantId(newVar.id);
      updateVariants(nextList);
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
    <div className="space-y-5">
      {notification && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-[4px] shadow-2xl text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
          <span>{notification}</span>
        </div>
      )}

      
      <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              01
            </span>
            <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
              Common Area & Loading Specifications
            </h3>
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
                  {commonConfig.commonAreaCal === '% of Saleable Area' && (
                    <Check className="w-2.5 h-2.5" />
                  )}
                </span>
                <span>% of Saleable Area</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start w-40">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 dark:text-slate-500 select-none">
                %
              </span>
            </div>
          </div>
        </div>
      </section>

      
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[4px] bg-white/95 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
              02
            </span>
            <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display tracking-tight">
                Unit Configurations & Flat Variants
              </h3>
              <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
                {variants.length} {variants.length === 1 ? 'Variant' : 'Variants'} Configured
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddConfigurationClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Variant</span>
            </button>
          </div>
        </div>

        {/* Variant Tabs & Content Container */}
        {!activeVariant || variants.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[6px] m-4 space-y-3">
            <Boxes className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">No unit variants configured yet.</p>
            <button
              type="button"
              onClick={handleAddConfigurationClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-[4px] text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Variant</span>
            </button>
          </div>
        ) : (
          <div className="pt-1">
            {/* Horizontal Tabs: Side by side */}
            <div className="flex items-end gap-1 overflow-x-auto no-scrollbar pt-2 -mb-[1px] relative z-10">
              {variants.map((v, vIndex) => {
                const isActive = v.id === activeVariant.id;
                return (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => setActiveVariantId(v.id)}
                    className={`relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-center cursor-pointer transition-all select-none group font-display tracking-tight text-xs sm:text-[13px] font-bold ${
                      isActive
                        ? 'bg-white dark:bg-[#1e2738] text-blue-600 dark:text-sky-400 border-t-2 border-l border-r border-b border-t-blue-600 border-l-slate-300 border-r-slate-300 border-b-white dark:border-t-sky-400 dark:border-l-[#384863] dark:border-r-[#384863] dark:border-b-[#1e2738] rounded-t-[6px] rounded-b-none z-10 shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-[#161e2e]/90 dark:hover:bg-[#1e2738]/80 text-white dark:text-slate-300 hover:text-white dark:hover:text-white border border-slate-300/80 dark:border-slate-700/60 rounded-[6px] mb-[2px] shadow-2xs'
                    }`}
                  >
                    <span className="truncate max-w-[150px]">
                      {v.variantNo || `Variant ${vIndex + 1}`}
                    </span>
                    {v.unitType && (
                      <span
                        className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-[2px] ${
                          isActive
                            ? 'bg-blue-50 dark:bg-sky-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/70 dark:border-sky-800/60'
                            : 'bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {v.unitType}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleAddConfigurationClick}
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[6px] border-2 border-dashed border-blue-400/50 hover:border-blue-600 dark:border-sky-500/40 dark:hover:border-sky-400 bg-blue-50/40 hover:bg-blue-100/60 dark:bg-sky-950/20 text-blue-600 dark:text-sky-400 transition-all cursor-pointer font-bold font-display text-xs mb-[2px] shadow-2xs active:scale-95 shrink-0"
                title="Add another variant"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Variant</span>
              </button>
            </div>

            {/* Active Variant Card */}
            <div className="bg-white dark:bg-[#1e2738] border-t border-b border-l border-r border-slate-300 dark:border-[#384863] rounded-b-[6px] rounded-tr-[6px] pt-4 px-4 sm:px-5 pb-5 space-y-5 relative z-0 shadow-xs">
              {/* Active Variant Top Header: Title, Availability, Duplicate, Delete */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-sky-400 font-display flex items-center gap-2">
                    <span>
                      {activeVariant.variantNo
                        ? `${activeVariant.variantNo} : Variant ${activeVariant.variantNumber}`
                        : `Variant ${activeVariant.variantNumber}`}
                    </span>
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] text-[10.5px] font-bold ${
                      activeVariant.variantAvailable === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : activeVariant.variantAvailable === 'Hold'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeVariant.variantAvailable === 'Available'
                          ? 'bg-emerald-500 animate-pulse'
                          : activeVariant.variantAvailable === 'Hold'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>{activeVariant.variantAvailable || 'Available'}</span>
                  </span>
                  {activeVariant.unitType && (
                    <span className="px-2 py-0.5 rounded-[3px] text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-900/50 font-mono">
                      {activeVariant.unitType}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateVariant(activeVariant)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-semibold border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer shadow-2xs active:scale-95"
                    title="Duplicate this variant"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                    <span>Duplicate</span>
                  </button>

                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(activeVariant.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/70 transition-colors cursor-pointer shadow-2xs active:scale-95"
                      title="Delete this variant"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-sections Form */}
              <div className="space-y-4">
                {/* 01 / Core Unit Parameters */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-sky-400" />
                    <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      01 / Basic Unit Parameters
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 items-start">
                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Variant Identifier
                      </label>
                      <input
                        type="text"
                        value={activeVariant.variantNo}
                        onChange={(e) =>
                          handleVariantFieldChange(activeVariant.id, 'variantNo', e.target.value)
                        }
                        placeholder="e.g. VAR-01"
                        className="w-full h-8 px-2.5 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Unit Type
                      </label>
                      <ModernDropdown<string>
                        value={activeVariant.unitType}
                        onChange={(val) => handleVariantFieldChange(activeVariant.id, 'unitType', val)}
                        options={UNIT_TYPES.filter((u) => u !== 'Select').map((u) => ({
                          value: u,
                          label: u,
                        }))}
                        placeholder="Select Unit Type"
                        roundedClass="rounded-[3px]"
                        className="w-full inline-block"
                        buttonClassName="w-full h-8 px-2.5 text-xs font-medium gap-1.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600"
                      />
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Facing
                      </label>
                      <ModernDropdown<string>
                        value={activeVariant.facing}
                        onChange={(val) => handleVariantFieldChange(activeVariant.id, 'facing', val)}
                        options={FACING_OPTIONS.filter((f) => f !== 'Select').map((f) => ({
                          value: f,
                          label: f,
                        }))}
                        placeholder="Select Facing"
                        roundedClass="rounded-[3px]"
                        className="w-full inline-block"
                        buttonClassName="w-full h-8 px-2.5 text-xs font-medium gap-1.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600"
                      />
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Variant Availability
                      </label>
                      <ModernDropdown<string>
                        value={activeVariant.variantAvailable}
                        onChange={(val) =>
                          handleVariantFieldChange(activeVariant.id, 'variantAvailable', val)
                        }
                        options={VARIANT_AVAILABILITY.filter((a) => a !== 'Select').map((a) => ({
                          value: a,
                          label: a,
                        }))}
                        placeholder="Select Availability"
                        roundedClass="rounded-[3px]"
                        className="w-full inline-block"
                        buttonClassName="w-full h-8 px-2.5 text-xs font-medium gap-1.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                {/* 02 / Area & Dimensional Measurements */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                    <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      02 / Area & Dimensional Measurements
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 items-start">
                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Saleable Area (Sqft)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.saleableArea}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'saleableArea', e.target.value)
                          }
                          placeholder="e.g. 1750"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqft
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Built-Up Area (Sqft)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.builtUpArea}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'builtUpArea', e.target.value)
                          }
                          placeholder="e.g. 1400"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqft
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Carpet Area (Sqft)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.carpetArea}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'carpetArea', e.target.value)
                          }
                          placeholder="e.g. 1220"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqft
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Plinth Area (Sqft)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.plinthArea}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'plinthArea', e.target.value)
                          }
                          placeholder="e.g. 1480"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqft
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Common Area (Sqft)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.commonArea}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'commonArea', e.target.value)
                          }
                          placeholder="e.g. 350"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqft
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Undivided Share (UDS)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.uds}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'uds', e.target.value)
                          }
                          placeholder="e.g. 48"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqyd
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Balcony Area (Sqft)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.balconyArea}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'balconyArea', e.target.value)
                          }
                          placeholder="e.g. 110"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqft
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Utility Area (Sqft)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.utilityArea}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'utilityArea', e.target.value)
                          }
                          placeholder="e.g. 45"
                          className="w-full h-8 pl-2.5 pr-10 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Sqft
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                {/* 03 / Architectural & Structural Specifications */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                    <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      03 / Architectural & Structural Specifications
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 items-start">
                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Wall Structure
                      </label>
                      <ModernDropdown<string>
                        value={activeVariant.wallStructure}
                        onChange={(val) =>
                          handleVariantFieldChange(activeVariant.id, 'wallStructure', val)
                        }
                        options={WALL_STRUCTURES.filter((w) => w !== 'Select').map((w) => ({
                          value: w,
                          label: w,
                        }))}
                        placeholder="Select Structure"
                        roundedClass="rounded-[3px]"
                        className="w-full inline-block"
                        buttonClassName="w-full h-8 px-2.5 text-xs font-medium gap-1.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600"
                      />
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Floor Plan Type
                      </label>
                      <ModernDropdown<string>
                        value={activeVariant.floorPlanType}
                        onChange={(val) =>
                          handleVariantFieldChange(activeVariant.id, 'floorPlanType', val)
                        }
                        options={FLOOR_PLAN_TYPES.filter((fp) => fp !== 'Select').map((fp) => ({
                          value: fp,
                          label: fp,
                        }))}
                        placeholder="Select Plan Type"
                        roundedClass="rounded-[3px]"
                        className="w-full inline-block"
                        buttonClassName="w-full h-8 px-2.5 text-xs font-medium gap-1.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600"
                      />
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Ceiling Height (Feet)
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={activeVariant.ceilingHeight}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'ceilingHeight', e.target.value)
                          }
                          placeholder="e.g. 10.5"
                          className="w-full h-8 pl-2.5 pr-8 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          Ft
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        No. of Balconies
                      </label>
                      <input
                        type="number"
                        value={activeVariant.noOfBalconies}
                        onChange={(e) =>
                          handleVariantFieldChange(activeVariant.id, 'noOfBalconies', e.target.value)
                        }
                        placeholder="e.g. 2"
                        className="w-full h-8 px-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                {/* 04 / Applicable Towers & Designated Spaces */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                    <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      04 / Applicable Towers & Designated Spaces
                    </span>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex flex-col items-start shrink-0">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Applicable Towers
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {AVAILABLE_TOWERS.map((t) => {
                          const isChecked = activeVariant.selectedTowers.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleTowerToggle(activeVariant.id, t)}
                              className={`h-7 px-3 inline-flex items-center justify-center rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400'
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Designated Living Spaces & Extra Rooms
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {allDesignatedAreas.map((area) => {
                          const isSelected = activeVariant.designatedAreas.includes(area);
                          const isPredefined = DESIGNATED_AREAS_LIST.includes(area);
                          return (
                            <button
                              key={area}
                              type="button"
                              onClick={() => handleDesignatedAreaToggle(activeVariant.id, area)}
                              className={`group h-7 inline-flex items-center gap-1.5 px-3 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400'
                              }`}
                            >
                              <span>{area}</span>
                              {!isPredefined && (
                                <span
                                  onClick={(e) => handleRemoveCustomDesignatedArea(area, e)}
                                  className={`p-0.5 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors ${
                                    isSelected ? 'text-indigo-200 hover:text-white' : 'text-slate-400 hover:text-rose-600'
                                  }`}
                                  title={`Delete ${area}`}
                                >
                                  <X className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </button>
                          );
                        })}

                        {addingSpaceForVariant === activeVariant.id ? (
                          <div className="h-7 inline-flex items-center gap-1 p-0.5 pl-2 bg-slate-50 dark:bg-slate-950 border border-indigo-500 rounded-[3px] shadow-2xs">
                            <input
                              type="text"
                              value={newSpaceInput}
                              onChange={(e) => setNewSpaceInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddNewDesignatedArea(activeVariant.id);
                                } else if (e.key === 'Escape') {
                                  setAddingSpaceForVariant(null);
                                  setNewSpaceInput('');
                                }
                              }}
                              placeholder="Room name..."
                              autoFocus
                              className="h-5 text-xs bg-transparent text-slate-800 dark:text-slate-100 outline-none w-24 placeholder:text-slate-400"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddNewDesignatedArea(activeVariant.id)}
                              className="w-5 h-5 flex items-center justify-center rounded-[2px] bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
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
                              className="w-5 h-5 flex items-center justify-center rounded-[2px] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAddingSpaceForVariant(activeVariant.id);
                              setNewSpaceInput('');
                            }}
                            className="h-7 inline-flex items-center gap-1.5 px-2.5 rounded-[3px] text-xs font-semibold border border-dashed border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-all cursor-pointer active:scale-95"
                            title="Add custom designated room"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                            <span>Add Room</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                {/* 05 / Detailed Room Dimensions Matrix */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
                      <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                        05 / Detailed Room Dimensions Matrix
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddRoom(activeVariant.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 bg-blue-50/60 dark:bg-blue-950/40 rounded-[3px] border border-blue-200/60 dark:border-blue-900/40 transition-colors cursor-pointer"
                    >
                      + Add Room
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                    <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-white/10">
                      <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <tr>
                          <th className="py-2 px-3">Room / Space Name</th>
                          <th className="py-2 px-3">Length (Ft)</th>
                          <th className="py-2 px-3">Breadth (Ft)</th>
                          <th className="py-2 px-3">Size (Calculated)</th>
                          <th className="py-2 px-3">Connected / Related To</th>
                          <th className="py-2 px-3 w-16 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-950">
                        {activeVariant.rooms.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-4 text-slate-400 dark:text-slate-500 text-xs italic"
                            >
                              No room dimensions added yet. Click &ldquo;+ Add Room&rdquo; to define individual room sizes.
                            </td>
                          </tr>
                        ) : (
                          activeVariant.rooms.map((room) => (
                            <tr
                              key={room.id}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                            >
                              <td className="p-1.5">
                                <input
                                  type="text"
                                  value={room.roomName}
                                  onChange={(e) =>
                                    handleRoomChange(
                                      activeVariant.id,
                                      room.id,
                                      'roomName',
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. Master Bedroom"
                                  className="w-full h-7 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                />
                              </td>
                              <td className="p-1.5 w-28">
                                <input
                                  type="text"
                                  value={room.length}
                                  onChange={(e) =>
                                    handleRoomChange(
                                      activeVariant.id,
                                      room.id,
                                      'length',
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. 14"
                                  className="w-full h-7 px-2 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                />
                              </td>
                              <td className="p-1.5 w-28">
                                <input
                                  type="text"
                                  value={room.breadth}
                                  onChange={(e) =>
                                    handleRoomChange(
                                      activeVariant.id,
                                      room.id,
                                      'breadth',
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. 16"
                                  className="w-full h-7 px-2 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                />
                              </td>
                              <td className="p-1.5 w-32">
                                <input
                                  type="text"
                                  value={room.size}
                                  onChange={(e) =>
                                    handleRoomChange(
                                      activeVariant.id,
                                      room.id,
                                      'size',
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. 224 Sqft"
                                  className="w-full h-7 px-2 font-mono bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700/80 rounded-[3px] text-xs font-bold text-blue-600 dark:text-sky-400 focus:outline-none focus:border-blue-600"
                                />
                              </td>
                              <td className="p-1.5">
                                <input
                                  type="text"
                                  value={room.relatedTo}
                                  onChange={(e) =>
                                    handleRoomChange(
                                      activeVariant.id,
                                      room.id,
                                      'relatedTo',
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. Living / Foyer"
                                  className="w-full h-7 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-[3px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                                />
                              </td>
                              <td className="p-1.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRoom(activeVariant.id, room.id)}
                                  className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95 inline-flex items-center justify-center"
                                  title="Remove room"
                                  aria-label="Remove room"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                {/* 06 / Base Pricing & Floor Plan Blueprints */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400" />
                    <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      06 / Base Pricing & Floor Plan Blueprints
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Base Cost (INR)
                      </label>
                      <div className="relative w-full">
                        <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400 select-none">
                          ₹
                        </span>
                        <input
                          type="text"
                          value={activeVariant.baseCost}
                          onChange={(e) =>
                            handleVariantFieldChange(activeVariant.id, 'baseCost', e.target.value)
                          }
                          placeholder="e.g. 98,50,000"
                          className="w-full h-8 pl-6 pr-2.5 text-xs font-mono font-medium bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-[3px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Floor Plan 2D (CAD / PDF)
                      </label>
                      <FloorPlanUploadBox
                        value={activeVariant.floorPlan2D}
                        onChange={(fileName) =>
                          handleVariantFieldChange(activeVariant.id, 'floorPlan2D', fileName)
                        }
                        inputId={`fp-2d-${activeVariant.id}`}
                        placeholder="Upload 2D Blueprint"
                      />
                    </div>

                    <div className="flex flex-col items-start w-full">
                      <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                        Floor Plan 3D (Render / Isometric)
                      </label>
                      <FloorPlanUploadBox
                        value={activeVariant.floorPlan3D}
                        onChange={(fileName) =>
                          handleVariantFieldChange(activeVariant.id, 'floorPlan3D', fileName)
                        }
                        inputId={`fp-3d-${activeVariant.id}`}
                        placeholder="Upload 3D Isometric"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default ConfigurationDesktop;
