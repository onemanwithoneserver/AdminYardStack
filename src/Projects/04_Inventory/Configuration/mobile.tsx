import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { INITIAL_CONFIGURATION_DATA, UNIT_TYPES, FACING_OPTIONS, WALL_STRUCTURES, AVAILABLE_TOWERS, type InventoryVariant, type InventoryCommonConfig, type RoomItem } from './data';
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

  const commonConfig = externalCommonConfig ?? internalCommonConfig;
  const variants = externalVariants ?? internalVariants;

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

  const handleDeleteVariant = (variantId: string) => {
    if (variants.length <= 1) return;
    const updated = variants.filter((v) => v.id !== variantId);
    updateVariants(updated);
  };

  const handleAddRoom = (variantId: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      const newRoom: RoomItem = {
        id: `room-${Date.now()}`,
        roomName: 'Bedroom',
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

  const handleTowerSelection = (variantId: string, tower: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      const isSelected = v.selectedTowers.includes(tower);
      const selected = isSelected
        ? v.selectedTowers.filter((t) => t !== tower)
        : [...v.selectedTowers, tower];
      return {
        ...v,
        selectedTowers: selected.length > 0 ? selected : [tower],
        towerName: selected[0] || tower,
      };
    });
    updateVariants(updated);
  };

  return (
    <div className="space-y-4">
      <section className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 tracking-tight">
          Common For All Variants
        </h3>
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              Common Area Cal
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="m_commonAreaCal"
                  checked={commonConfig.commonAreaCal === '% Only'}
                  onChange={() => updateCommonConfig('commonAreaCal', '% Only')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>% Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="m_commonAreaCal"
                  checked={commonConfig.commonAreaCal === '% of Saleable Area'}
                  onChange={() =>
                    updateCommonConfig('commonAreaCal', '% of Saleable Area')
                  }
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>% of Saleable Area</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Loading Factor
            </label>
            <input
              type="text"
              placeholder="Enter value"
              value={commonConfig.loadingFactor}
              onChange={(e) => updateCommonConfig('loadingFactor', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {variants.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs"
          >
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Variant : {v.variantNumber}
                </span>
                <p className="text-[10px] text-slate-500">
                  {v.towerName || 'Tower 1'} - {v.unitType || '-----'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleCollapse(v.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded"
                >
                  {v.isCollapsed ? 'Expand' : 'Collapse'}
                </button>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteVariant(v.id)}
                    className="p-1 text-rose-700 dark:text-rose-400 hover:text-rose-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {!v.isCollapsed && (
              <div className="p-4 space-y-3.5 text-xs text-slate-800">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Variant No
                    </label>
                    <input
                      type="text"
                      value={v.variantNo}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'variantNo', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Unit Type
                    </label>
                    <select
                      value={v.unitType}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'unitType', e.target.value)
                      }
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      {UNIT_TYPES.map((u) => (
                        <option key={u} value={u === 'Select' ? '' : u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Facing
                    </label>
                    <select
                      value={v.facing}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'facing', e.target.value)
                      }
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      {FACING_OPTIONS.map((f) => (
                        <option key={f} value={f === 'Select' ? '' : f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Saleable Area
                    </label>
                    <input
                      type="text"
                      value={v.saleableArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'saleableArea', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Common Area
                    </label>
                    <input
                      type="text"
                      value={v.commonArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'commonArea', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      UDS
                    </label>
                    <input
                      type="text"
                      value={v.uds}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'uds', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Tower
                    </label>
                    <div className="flex flex-wrap gap-1.5 border border-slate-200 rounded p-1.5">
                      {AVAILABLE_TOWERS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleTowerSelection(v.id, t)}
                          className={`px-2 py-1 text-[11px] rounded transition-colors ${
                            v.selectedTowers.includes(t)
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Plinth Area
                    </label>
                    <input
                      type="text"
                      value={v.plinthArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'plinthArea', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Built up Area
                    </label>
                    <input
                      type="text"
                      value={v.builtUpArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'builtUpArea', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-slate-100/70"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Carpet Area
                    </label>
                    <input
                      type="text"
                      value={v.carpetArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'carpetArea', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Balcony Area
                    </label>
                    <input
                      type="text"
                      value={v.balconyArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'balconyArea', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Utility Area
                    </label>
                    <input
                      type="text"
                      value={v.utilityArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'utilityArea', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Balconies Count
                    </label>
                    <input
                      type="text"
                      value={v.noOfBalconies}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'noOfBalconies', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Ceiling Height
                    </label>
                    <input
                      type="text"
                      value={v.ceilingHeight}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'ceilingHeight', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Wall Structure
                    </label>
                    <select
                      value={v.wallStructure}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'wallStructure', e.target.value)
                      }
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs"
                    >
                      {WALL_STRUCTURES.map((w) => (
                        <option key={w} value={w === 'Select' ? '' : w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700">Room Sizes</span>
                    <button
                      type="button"
                      onClick={() => handleAddRoom(v.id)}
                      className="text-blue-600 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Room</span>
                    </button>
                  </div>

                  {v.rooms.length === 0 ? (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">No rooms added.</p>
                  ) : (
                    <div className="space-y-2">
                      {v.rooms.map((room) => (
                        <div
                          key={room.id}
                          className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-800">
                              {room.roomName}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteRoom(v.id, room.id)}
                              className="text-slate-600 dark:text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                            <input
                              type="text"
                              placeholder="L"
                              value={room.length}
                              onChange={(e) => {
                                const newRooms = v.rooms.map((r) =>
                                  r.id === room.id ? { ...r, length: e.target.value } : r
                                );
                                handleVariantFieldChange(v.id, 'rooms', newRooms);
                              }}
                              className="px-1.5 py-1 border border-slate-200 rounded bg-white"
                            />
                            <input
                              type="text"
                              placeholder="B"
                              value={room.breadth}
                              onChange={(e) => {
                                const newRooms = v.rooms.map((r) =>
                                  r.id === room.id ? { ...r, breadth: e.target.value } : r
                                );
                                handleVariantFieldChange(v.id, 'rooms', newRooms);
                              }}
                              className="px-1.5 py-1 border border-slate-200 rounded bg-white"
                            />
                            <input
                              type="text"
                              placeholder="Size"
                              value={room.size}
                              onChange={(e) => {
                                const newRooms = v.rooms.map((r) =>
                                  r.id === room.id ? { ...r, size: e.target.value } : r
                                );
                                handleVariantFieldChange(v.id, 'rooms', newRooms);
                              }}
                              className="px-1.5 py-1 border border-slate-200 rounded bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Base Cost
                  </label>
                  <input
                    type="text"
                    value={v.baseCost}
                    onChange={(e) =>
                      handleVariantFieldChange(v.id, 'baseCost', e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-slate-100/70"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {onAddConfiguration && (
          <button
            type="button"
            onClick={onAddConfiguration}
            className="w-full py-2 bg-blue-50 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Configuration</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ConfigurationMobile;
