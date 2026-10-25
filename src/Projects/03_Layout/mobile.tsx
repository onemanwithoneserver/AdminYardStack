import { useState } from 'react';
import { Plus, Trash2, Layers, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { ModernCalendar } from '../../components/elements/ModernCalendar';
import {
  INITIAL_LAYOUT_DATA,
  HANDOVER_OPTIONS,
  createNewTowerRow,
  createNewTowerTable,
  type LayoutFormData,
  type TowerRow,
  type TowerTable,
} from './data';
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
    <div className="p-1.5 space-y-4 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Project layout saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-xs shadow-orange-500/20">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Layout
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Approval details, handover schedule, and phased possession timelines
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pb-4">
        {/* Section 1: Approval Details & Handover Timelines */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Approval & Handover
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Completion Date
              </label>
              <ModernCalendar
                value={formData.completionDate}
                onChange={(val) => handleFieldChange('completionDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                HandOver Status
              </label>
              <ModernDropdown<string>
                value={formData.handOver}
                onChange={(val) => handleFieldChange('handOver', val)}
                options={[...HANDOVER_OPTIONS]}
                placeholder="Select Status"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Tower Matrix & Elevation Specifications */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Tower Matrix
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tower</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.tables.map((table, tblIndex) => (
              <div
                key={table.id}
                className="border border-slate-200/80 dark:border-white/10 rounded-[4px] overflow-hidden shadow-2xs bg-slate-50/50 dark:bg-slate-900/40"
              >
                <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">
                      Table {tblIndex + 1}: {table.tableName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      ({table.rows.length})
                    </span>
                  </div>
                  {formData.tables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTable(table.id)}
                      className="p-1.5 rounded-[4px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    </button>
                  )}
                </div>

                <div className="p-2.5 space-y-3">
                  {table.rows.map((row, rIndex) => (
                    <div
                      key={row.id}
                      className="bg-white dark:bg-slate-950 rounded-[4px] border border-slate-200 dark:border-white/10 p-3 space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-white/10">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">
                          {row.towerName || `Tower ${rIndex + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(table.id, row.id)}
                          className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Tower Name
                          </label>
                          <input
                            type="text"
                            value={row.towerName}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'towerName', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Floors
                          </label>
                          <input
                            type="number"
                            value={row.noOfFloors}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'noOfFloors', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Units / Floor
                          </label>
                          <input
                            type="number"
                            value={row.unitsPerFloor}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'unitsPerFloor', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Parking Levels
                          </label>
                          <input
                            type="number"
                            value={row.parkingLevels}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'parkingLevels', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Parking Level Names
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. B1, B2"
                            value={row.parkingLevelNames}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'parkingLevelNames', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Passenger Lifts
                          </label>
                          <input
                            type="number"
                            value={row.noOfPassengerLifts}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'noOfPassengerLifts', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Service Lifts
                          </label>
                          <input
                            type="number"
                            value={row.noOfServiceLifts}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'noOfServiceLifts', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Flats / Lift
                          </label>
                          <input
                            type="number"
                            value={row.avgFlatCountPerLift}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'avgFlatCountPerLift', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Staircase
                          </label>
                          <input
                            type="number"
                            value={row.noOfStaircase}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'noOfStaircase', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Corridor (Ft)
                          </label>
                          <input
                            type="number"
                            value={row.corridorWidth}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'corridorWidth', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Lobby Available
                          </label>
                          <ModernDropdown<'No' | 'Yes'>
                            value={row.lobbyAvailable}
                            onChange={(val) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'lobbyAvailable',
                                val
                              )
                            }
                            options={[
                              { value: 'No', label: 'No' },
                              { value: 'Yes', label: 'Yes' },
                            ]}
                            placeholder="Select"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-8 px-2 text-xs font-medium gap-1"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Completion Date
                          </label>
                          <ModernCalendar
                            value={row.completionDate}
                            onChange={(val) =>
                              handleRowChange(table.id, row.id, 'completionDate', val)
                            }
                            buttonClassName="h-8 text-xs px-2"
                            placeholder="dd-mm-yyyy"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            HandOver Status
                          </label>
                          <ModernDropdown<string>
                            value={row.handOver}
                            onChange={(val) =>
                              handleRowChange(table.id, row.id, 'handOver', val)
                            }
                            options={HANDOVER_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
                            placeholder="Select HandOver"
                            roundedClass="rounded-[4px]"
                            className="w-full inline-block"
                            buttonClassName="w-full h-8 px-2 text-xs font-medium gap-1"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Base Price
                          </label>
                          <input
                            type="number"
                            value={row.basePrice}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'basePrice', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Distance (Ft)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 15 Ft"
                            value={row.flatToFlatDistance}
                            onChange={(e) =>
                              handleRowChange(table.id, row.id, 'flatToFlatDistance', e.target.value)
                            }
                            className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-white/10 rounded-[4px] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleAddRow(table.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
                    {table.rows.length} records
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Status Card - Placed at bottom left side */}
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 sm:p-3 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 h-4">
              <span>Status</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <ModernDropdown<'Active' | 'Inactive'>
              value={formData.status}
              onChange={(val) => handleFieldChange('status', val)}
              options={[
                {
                  value: 'Active',
                  label: 'Active',
                  icon: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1" />,
                },
                {
                  value: 'Inactive',
                  label: 'Inactive',
                  icon: <span className="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1" />,
                },
              ]}
              dropUp={true}
              roundedClass="rounded-[4px]"
              className="w-auto inline-block"
              buttonClassName="w-auto h-8 px-2.5 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
            />
          </div>
        </div>
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
