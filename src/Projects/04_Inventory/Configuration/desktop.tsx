import { useState } from 'react';
import { Plus, ChevronDown, Trash2 } from 'lucide-react';
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

  const handleAddConfigurationClick = () => {
    if (onAddConfiguration) {
      onAddConfiguration();
    } else {
      const nextNum = variants.length + 1;
      const newVar = createDefaultVariant(nextNum, `Tower 1`);
      updateVariants([...variants, newVar]);
    }
  };

  const handleAddRoom = (variantId: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      const newRoom: RoomItem = {
        id: `room-${Date.now()}`,
        roomName: 'Master Bedroom',
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
        rooms: v.rooms.map((r) => (r.id === roomId ? { ...r, [field]: val } : r)),
      };
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

  const handleDesignatedAreaSelection = (variantId: string, area: string) => {
    const updated = variants.map((v) => {
      if (v.id !== variantId) return v;
      const isSelected = v.designatedAreas.includes(area);
      const areas = isSelected
        ? v.designatedAreas.filter((a) => a !== area)
        : [...v.designatedAreas, area];
      return { ...v, designatedAreas: areas.length > 0 ? areas : ['None'] };
    });
    updateVariants(updated);
  };

  return (
    <div className="space-y-6">
      
      <section className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 tracking-tight">
          Common For All Variants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-2">
              Common Area Cal
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="commonAreaCal"
                  checked={commonConfig.commonAreaCal === '% Only'}
                  onChange={() => updateCommonConfig('commonAreaCal', '% Only')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>% Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="commonAreaCal"
                  checked={commonConfig.commonAreaCal === '% of Saleable Area'}
                  onChange={() =>
                    updateCommonConfig('commonAreaCal', '% of Saleable Area')
                  }
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
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

      
      <div className="space-y-6">
        {variants.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs"
          >
            
            <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Variant : {v.variantNumber}
                </span>
                <p className="text-[11px] text-slate-500">
                  {v.towerName || 'Tower 1'} - {v.unitType || '-----'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleCollapse(v.id)}
                  className="px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  {v.isCollapsed ? 'Expand' : 'Collapse'}
                </button>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteVariant(v.id)}
                    className="px-3 py-1 text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            
            {!v.isCollapsed && (
              <div className="p-5 space-y-5 text-slate-800">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Variant No
                    </label>
                    <input
                      type="text"
                      value={v.variantNo}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'variantNo', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Unit Type
                    </label>
                    <div className="relative">
                      <select
                        value={v.unitType}
                        onChange={(e) =>
                          handleVariantFieldChange(v.id, 'unitType', e.target.value)
                        }
                        className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
                      >
                        {UNIT_TYPES.map((u) => (
                          <option key={u} value={u === 'Select' ? '' : u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Facing
                    </label>
                    <div className="relative">
                      <select
                        value={v.facing}
                        onChange={(e) =>
                          handleVariantFieldChange(v.id, 'facing', e.target.value)
                        }
                        className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
                      >
                        {FACING_OPTIONS.map((f) => (
                          <option key={f} value={f === 'Select' ? '' : f}>
                            {f}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Saleable Area
                    </label>
                    <input
                      type="text"
                      value={v.saleableArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'saleableArea', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Common Area
                    </label>
                    <input
                      type="text"
                      value={v.commonArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'commonArea', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      UDS
                    </label>
                    <input
                      type="text"
                      value={v.uds}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'uds', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Towers
                    </label>
                    <div className="border border-slate-300 rounded-lg p-1.5 max-h-24 overflow-y-auto space-y-1 bg-white text-xs">
                      {AVAILABLE_TOWERS.map((t) => (
                        <div
                          key={t}
                          onClick={() => handleTowerSelection(v.id, t)}
                          className={`px-2 py-1 rounded cursor-pointer transition-colors flex items-center justify-between ${
                            v.selectedTowers.includes(t)
                              ? 'bg-slate-200 text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{t}</span>
                          {v.selectedTowers.includes(t) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Plinth Area
                    </label>
                    <input
                      type="text"
                      value={v.plinthArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'plinthArea', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Built up Area
                    </label>
                    <input
                      type="text"
                      value={v.builtUpArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'builtUpArea', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-100/80 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Carpet Area
                    </label>
                    <input
                      type="text"
                      value={v.carpetArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'carpetArea', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Balcony Area
                    </label>
                    <input
                      type="text"
                      value={v.balconyArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'balconyArea', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Utility Area
                    </label>
                    <input
                      type="text"
                      value={v.utilityArea}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'utilityArea', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      No. of Balconies
                    </label>
                    <input
                      type="text"
                      value={v.noOfBalconies}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'noOfBalconies', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Ceiling Height
                    </label>
                    <input
                      type="text"
                      value={v.ceilingHeight}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'ceilingHeight', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Designated Areas
                    </label>
                    <div className="border border-slate-300 rounded-lg p-1.5 max-h-24 overflow-y-auto space-y-1 bg-white text-xs">
                      {DESIGNATED_AREAS_LIST.map((area) => (
                        <div
                          key={area}
                          onClick={() => handleDesignatedAreaSelection(v.id, area)}
                          className={`px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center justify-between ${
                            v.designatedAreas.includes(area)
                              ? 'bg-slate-200 text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Wall Structure
                    </label>
                    <div className="relative">
                      <select
                        value={v.wallStructure}
                        onChange={(e) =>
                          handleVariantFieldChange(v.id, 'wallStructure', e.target.value)
                        }
                        className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
                      >
                        {WALL_STRUCTURES.map((w) => (
                          <option key={w} value={w === 'Select' ? '' : w}>
                            {w}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Floor Plan Type
                    </label>
                    <div className="relative">
                      <select
                        value={v.floorPlanType}
                        onChange={(e) =>
                          handleVariantFieldChange(v.id, 'floorPlanType', e.target.value)
                        }
                        className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
                      >
                        {FLOOR_PLAN_TYPES.map((fp) => (
                          <option key={fp} value={fp === 'Select' ? '' : fp}>
                            {fp}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Variant Available
                    </label>
                    <div className="relative">
                      <select
                        value={v.variantAvailable}
                        onChange={(e) =>
                          handleVariantFieldChange(v.id, 'variantAvailable', e.target.value)
                        }
                        className="w-full appearance-none px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
                      >
                        {VARIANT_AVAILABILITY.map((va) => (
                          <option key={va} value={va === 'Select' ? '' : va}>
                            {va}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-700">Room Sizes</h4>
                    <button
                      type="button"
                      onClick={() => handleAddRoom(v.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Room</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600">
                        <tr>
                          <th className="py-2 px-3">Room Name</th>
                          <th className="py-2 px-3">Length (Ft/In)</th>
                          <th className="py-2 px-3">Breadth (Ft/In)</th>
                          <th className="py-2 px-3">Size</th>
                          <th className="py-2 px-3">Related To</th>
                          <th className="py-2 px-3 w-16 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {v.rooms.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-3 text-slate-600 dark:text-slate-400 text-xs italic"
                            >
                              No rooms added.
                            </td>
                          </tr>
                        ) : (
                          v.rooms.map((room) => (
                            <tr key={room.id} className="hover:bg-slate-50/50">
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
                                  className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-2">
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
                                  className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-2">
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
                                  className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-2">
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
                                  className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
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
                                  className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRoom(v.id, room.id)}
                                  className="text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
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

                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 items-end">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Base Cost
                    </label>
                    <input
                      type="text"
                      value={v.baseCost}
                      onChange={(e) =>
                        handleVariantFieldChange(v.id, 'baseCost', e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-100/70 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Floor Plan 2D
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Floor Plan 3D
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={handleAddConfigurationClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigurationDesktop;
