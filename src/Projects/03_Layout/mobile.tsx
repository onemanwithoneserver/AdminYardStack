import { useState } from 'react';
import { Plus, ChevronDown, Calendar, Trash2, Layers, Building, CheckCircle2 } from 'lucide-react';
import { INITIAL_LAYOUT_DATA, HANDOVER_OPTIONS, createNewTowerRow, createNewTowerTable, type LayoutFormData, type TowerRow, type TowerTable } from './data';
import { AddTowerDialog } from './desktop';

export function LayoutMobile() {
  const [formData, setFormData] = useState<LayoutFormData>(INITIAL_LAYOUT_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleFieldChange = <K extends keyof LayoutFormData>(
    field: K,
    value: LayoutFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRowChange = (
    tableId: string,
    rowId: string,
    field: keyof TowerRow,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.map((tbl) => {
        if (tbl.id !== tableId) return tbl;
        return {
          ...tbl,
          rows: tbl.rows.map((row) => {
            if (row.id !== rowId) return row;
            return { ...row, [field]: value };
          }),
        };
      }),
    }));
  };

  const handleAddRow = (tableId: string) => {
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.map((tbl) => {
        if (tbl.id !== tableId) return tbl;
        const totalRowsAcrossTables = prev.tables.reduce(
          (acc, t) => acc + t.rows.length,
          0
        );
        const newRow = createNewTowerRow(totalRowsAcrossTables + 1);
        return {
          ...tbl,
          rows: [...tbl.rows, newRow],
        };
      }),
    }));
  };

  const handleDeleteRow = (tableId: string, rowId: string) => {
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.map((tbl) => {
        if (tbl.id !== tableId) return tbl;
        return {
          ...tbl,
          rows: tbl.rows.filter((r) => r.id !== rowId),
        };
      }),
    }));
  };

  const handleCreateNewTowerTable = (towerName: string, noOfFloors?: string) => {
    const tableIndex = formData.tables.length + 1;
    const newTable: TowerTable = createNewTowerTable(tableIndex, towerName);
    if (noOfFloors) {
      newTable.rows[0].noOfFloors = noOfFloors;
    }

    setFormData((prev) => ({
      ...prev,
      tables: [...prev.tables, newTable],
    }));
  };

  const handleDeleteTable = (tableId: string) => {
    if (formData.tables.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.filter((tbl) => tbl.id !== tableId),
    }));
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const nextTowerIndex =
    formData.tables.reduce((acc, t) => acc + t.rows.length, 0) + 1;

  return (
    <div className="w-full ys-panel p-4 sm:p-5 space-y-6 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 ys-toast px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Project layout saved successfully!</span>
        </div>
      )}

      <div className="pb-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Layout
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 uppercase">
          03 / 10
        </span>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Approval Details
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Completion Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formData.completionDate}
                onChange={(e) => handleFieldChange('completionDate', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              HandOver
            </label>
            <div className="relative">
              <select
                value={formData.handOver}
                onChange={(e) => handleFieldChange('handOver', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
              >
                {HANDOVER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-1">
        <div className="flex items-center justify-between gap-2 pb-1">
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Inventory
            </h3>
            <span className="text-[11px] text-slate-500">
              {formData.tables.length} {formData.tables.length === 1 ? 'Table' : 'Tables'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1956db] hover:bg-[#1444b0] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Tower</span>
          </button>
        </div>

        <div className="space-y-5">
          {formData.tables.map((table, tblIndex) => (
            <div
              key={table.id}
              className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-slate-50/40"
            >
              <div className="px-3.5 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Table {tblIndex + 1}: {table.tableName}
                  </span>
                </div>
                {formData.tables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTable(table.id)}
                    className="p-1 text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-3 space-y-4">
                {table.rows.map((row, rIndex) => (
                  <div
                    key={row.id}
                    className="bg-white rounded-lg border border-slate-200 p-3 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">
                          {row.towerName || `Tower ${rIndex + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(table.id, row.id)}
                        className="text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Towers Name
                        </label>
                        <input
                          type="text"
                          value={row.towerName}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'towerName', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          No. of Floors
                        </label>
                        <input
                          type="text"
                          value={row.noOfFloors}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'noOfFloors', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Units per Floor
                        </label>
                        <input
                          type="text"
                          value={row.unitsPerFloor}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'unitsPerFloor', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Parking Levels
                        </label>
                        <input
                          type="text"
                          value={row.parkingLevels}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'parkingLevels', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Parking Level Names
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B1, B2"
                          value={row.parkingLevelNames}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'parkingLevelNames', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Passenger Lifts
                        </label>
                        <input
                          type="text"
                          value={row.noOfPassengerLifts}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'noOfPassengerLifts', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Service Lifts
                        </label>
                        <input
                          type="text"
                          value={row.noOfServiceLifts}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'noOfServiceLifts', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Avg Flat/Lift
                        </label>
                        <input
                          type="text"
                          value={row.avgFlatCountPerLift}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'avgFlatCountPerLift', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Staircase Count
                        </label>
                        <input
                          type="text"
                          value={row.noOfStaircase}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'noOfStaircase', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Corridor Width
                        </label>
                        <input
                          type="text"
                          value={row.corridorWidth}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'corridorWidth', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Lobby Available?
                        </label>
                        <div className="relative">
                          <select
                            value={row.lobbyAvailable}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'lobbyAvailable',
                                e.target.value as 'No' | 'Yes'
                              )
                            }
                            className="w-full appearance-none px-2 py-1 text-xs bg-white border border-slate-200 rounded pr-6"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 pointer-events-none text-slate-600 dark:text-slate-400" />
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Completion Date
                        </label>
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          value={row.completionDate}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'completionDate', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          HandOver Status
                        </label>
                        <div className="relative">
                          <select
                            value={row.handOver}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'handOver', e.target.value)
                            }
                            className="w-full appearance-none px-2 py-1 text-xs bg-white border border-slate-200 rounded pr-6"
                          >
                            {HANDOVER_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 pointer-events-none text-slate-600 dark:text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Base Price
                        </label>
                        <input
                          type="text"
                          value={row.basePrice}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'basePrice', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Flat to Flat Dist
                        </label>
                        <input
                          type="text"
                          value={row.flatToFlatDistance}
                          onChange={(e) =>
                            handleRowChange(table.id, row.id, 'flatToFlatDistance', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddRow(table.id)}
                  className="w-full py-2 border border-dashed border-blue-300 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50/60 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tower Row</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-3 border-t border-slate-200/80 space-y-4">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Status <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                handleFieldChange('status', e.target.value as 'Active' | 'Inactive')
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-2.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Save Project
        </button>
      </div>

      <AddTowerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleCreateNewTowerTable}
        suggestedIndex={nextTowerIndex}
      />
    </div>
  );
}

export default LayoutMobile;
