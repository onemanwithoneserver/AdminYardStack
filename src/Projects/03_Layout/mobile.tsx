import { useState } from 'react';
import { Plus, Trash2, Layers, CheckCircle2, Copy } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { ModernCalendar } from '../../components/elements/ModernCalendar';
import { INITIAL_LAYOUT_DATA, HANDOVER_OPTIONS, createNewTowerRow, duplicateTowerRow, createNewTowerTable, type LayoutFormData, type TowerRow, type TowerTable } from './data';
import { AddTowerDialog } from './desktop';

export function LayoutMobile() {
  const [formData, setFormData] = useState<LayoutFormData>(INITIAL_LAYOUT_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [activeRowIdMap, setActiveRowIdMap] = useState<Record<string, string>>({});

  const getActiveRow = (table: TowerTable): TowerRow => {
    const selectedId = activeRowIdMap[table.id];
    const found = table.rows.find((r) => r.id === selectedId);
    return found || table.rows[0];
  };

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
    const totalRowsAcrossTables = formData.tables.reduce(
      (acc, t) => acc + t.rows.length,
      0
    );
    const newRow = createNewTowerRow(totalRowsAcrossTables + 1);
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.map((tbl) => {
        if (tbl.id !== tableId) return tbl;
        return {
          ...tbl,
          rows: [...tbl.rows, newRow],
        };
      }),
    }));
    setActiveRowIdMap((prev) => ({ ...prev, [tableId]: newRow.id }));
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

    setActiveRowIdMap((prev) => {
      if (prev[tableId] === rowId) {
        const table = formData.tables.find((t) => t.id === tableId);
        const remaining = table?.rows.filter((r) => r.id !== rowId) || [];
        return {
          ...prev,
          [tableId]: remaining[0]?.id || '',
        };
      }
      return prev;
    });
  };

  const handleDuplicateRow = (tableId: string, rowId: string) => {
    const table = formData.tables.find((t) => t.id === tableId);
    if (!table) return;
    const target = table.rows.find((r) => r.id === rowId);
    if (!target) return;

    const duplicated = duplicateTowerRow(target);
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.map((tbl) => {
        if (tbl.id !== tableId) return tbl;
        return {
          ...tbl,
          rows: [...tbl.rows, duplicated],
        };
      }),
    }));
    setActiveRowIdMap((prev) => ({ ...prev, [tableId]: duplicated.id }));
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
    setActiveRowIdMap((prev) => ({ ...prev, [newTable.id]: newTable.rows[0].id }));
  };

  const handleDeleteTable = (tableId: string) => {
    if (formData.tables.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.filter((tbl) => tbl.id !== tableId),
    }));
  };

  const _handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const nextTowerIndex =
    formData.tables.reduce((acc, t) => acc + t.rows.length, 0) + 1;

  return (
    <div className="p-2 sm:p-3 space-y-2.5 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Project layout saved successfully!</span>
        </div>
      )}

      
      <div className="pb-1 flex items-center justify-between">
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
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Approval details, handover schedule, and phased possession
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pb-2">
        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[6px] p-2.5 sm:p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center min-w-[18px] h-[16px] px-1 text-[9px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                01
              </span>
              <span className="w-1 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white font-display">
                Approval & Handover
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                Completion Date
              </label>
              <ModernCalendar
                value={formData.completionDate}
                onChange={(val) => handleFieldChange('completionDate', val)}
                buttonClassName="h-7 text-xs px-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80"
                placeholder="dd-mm-yyyy"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                HandOver Status
              </label>
              <ModernDropdown<string>
                value={formData.handOver}
                onChange={(val) => handleFieldChange('handOver', val)}
                options={[...HANDOVER_OPTIONS]}
                placeholder="Select Status"
                roundedClass="rounded-[3px]"
                className="w-full inline-block"
                buttonClassName="w-full h-7 px-2 text-xs font-medium gap-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80"
              />
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[6px] p-2.5 sm:p-3 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center justify-center min-w-[18px] h-[16px] px-1 text-[9px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                02
              </span>
              <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white font-display truncate">
                Tower Matrix & Specifications
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-[3px] text-[11px] font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-3 h-3" />
              <span>Add Table</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.tables.map((table, tblIndex) => (
              <div
                key={table.id}
                className="border border-slate-300 dark:border-[#384863] rounded-[6px] overflow-hidden bg-slate-50/70 dark:bg-slate-950/40 shadow-xs"
              >
                
                <div className="px-2.5 py-1.5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 font-display">
                      Table {tblIndex + 1}: {table.tableName}
                    </span>
                    <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-mono">
                      ({table.rows.length})
                    </span>
                  </div>
                  {formData.tables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTable(table.id)}
                      className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/70 transition-all cursor-pointer"
                      title="Delete table"
                    >
                      <Trash2 className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                    </button>
                  )}
                </div>

                
                {(() => {
                  const activeRow = getActiveRow(table);
                  const activeIndex = table.rows.findIndex((r) => r.id === activeRow?.id);
                  if (!activeRow || table.rows.length === 0) return null;

                  return (
                    <div>
                      
                      <div className="flex items-end gap-1.5 overflow-x-auto no-scrollbar pt-1.5 px-2 -mb-[1px] relative z-10">
                        {table.rows.map((row, rIndex) => {
                          const isActive = row.id === activeRow.id;
                          return (
                            <button
                              type="button"
                              key={row.id}
                              onClick={() =>
                                setActiveRowIdMap((prev) => ({ ...prev, [table.id]: row.id }))
                              }
                              className={`relative inline-flex items-center justify-center px-3 py-1.5 text-center cursor-pointer transition-all select-none group font-display tracking-tight text-xs font-bold ${
                                isActive
                                  ? 'bg-white dark:bg-[#1e2738] text-blue-600 dark:text-sky-400 border-t-2 border-l border-r border-b border-t-blue-600 border-l-slate-300 border-r-slate-300 border-b-white dark:border-t-sky-400 dark:border-l-[#384863] dark:border-r-[#384863] dark:border-b-[#1e2738] rounded-t-[6px] rounded-b-none z-10 shadow-xs'
                                  : 'bg-slate-100/90 hover:bg-slate-200/90 dark:bg-[#161e2e]/90 dark:hover:bg-[#1e2738]/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300/80 dark:border-slate-700/60 rounded-[6px] mb-[2px] shadow-2xs'
                              }`}
                            >
                              <span className="truncate max-w-[100px]">
                                {row.towerName || `Tower ${rIndex + 1}`}
                              </span>
                            </button>
                          );
                        })}

                        
                        <button
                          type="button"
                          onClick={() => handleAddRow(table.id)}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-[6px] border-2 border-dashed border-blue-400/50 hover:border-blue-600 dark:border-sky-500/40 dark:hover:border-sky-400 bg-blue-50/40 hover:bg-blue-100/60 dark:bg-sky-950/20 text-blue-600 dark:text-sky-400 cursor-pointer font-bold font-display text-xs mb-[2px] active:scale-95 shadow-2xs"
                          title="Add another tower"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Add</span>
                        </button>
                      </div>

                      
                      <div className="bg-white dark:bg-[#1e2738] border-t border-slate-300 dark:border-[#384863] p-2.5 sm:p-3 space-y-2.5 relative z-0">
                        
                        <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-700/70">
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-sky-400 font-display truncate">
                              {activeRow.towerName || `Tower ${activeIndex + 1}`}
                            </h4>
                            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 block -mt-0.5">
                              Adjust Specifications
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDuplicateRow(table.id, activeRow.id)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-[10.5px] font-semibold border border-slate-300 dark:border-slate-600 flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                              title="Duplicate tower"
                            >
                              <Copy className="w-3 h-3 text-blue-600 dark:text-sky-400" />
                              <span>Copy</span>
                            </button>
                            {table.rows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteRow(table.id, activeRow.id)}
                                className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-[10.5px] font-semibold border border-rose-200 dark:border-rose-800/70 flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                                title="Delete tower"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>

                        
                        
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-sky-400" />
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              Basic Details & Pricing
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Tower Name
                              </label>
                              <input
                                type="text"
                                value={activeRow.towerName}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'towerName', e.target.value)
                                }
                                placeholder="Tower Name"
                                className="w-full h-7 px-2 text-xs font-semibold text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                No. of Floors
                              </label>
                              <input
                                type="number"
                                value={activeRow.noOfFloors}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'noOfFloors', e.target.value)
                                }
                                placeholder="Floors"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Units / Floor
                              </label>
                              <input
                                type="number"
                                value={activeRow.unitsPerFloor}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'unitsPerFloor', e.target.value)
                                }
                                placeholder="Units"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Base Price (₹)
                              </label>
                              <input
                                type="number"
                                value={activeRow.basePrice}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'basePrice', e.target.value)
                                }
                                placeholder="Price"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700/60" />

                        
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              Parking Specifications
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Parking Levels
                              </label>
                              <input
                                type="number"
                                value={activeRow.parkingLevels}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'parkingLevels', e.target.value)
                                }
                                placeholder="Levels"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Level Names
                              </label>
                              <input
                                type="text"
                                value={activeRow.parkingLevelNames}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'parkingLevelNames', e.target.value)
                                }
                                placeholder="e.g. B1, B2"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700/60" />

                        
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              Lifts & Circulation
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Pass. Lifts
                              </label>
                              <input
                                type="number"
                                value={activeRow.noOfPassengerLifts}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'noOfPassengerLifts', e.target.value)
                                }
                                placeholder="Count"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Service Lifts
                              </label>
                              <input
                                type="number"
                                value={activeRow.noOfServiceLifts}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'noOfServiceLifts', e.target.value)
                                }
                                placeholder="Count"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Staircases
                              </label>
                              <input
                                type="number"
                                value={activeRow.noOfStaircase}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'noOfStaircase', e.target.value)
                                }
                                placeholder="Count"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Corridor (Ft)
                              </label>
                              <input
                                type="number"
                                value={activeRow.corridorWidth}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'corridorWidth', e.target.value)
                                }
                                placeholder="Width"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700/60" />

                        
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              Handover & Proximity
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Lobby Available
                              </label>
                              <ModernDropdown<'No' | 'Yes'>
                                value={activeRow.lobbyAvailable}
                                onChange={(val) =>
                                  handleRowChange(table.id, activeRow.id, 'lobbyAvailable', val)
                                }
                                options={[
                                  { value: 'No', label: 'No' },
                                  { value: 'Yes', label: 'Yes' },
                                ]}
                                placeholder="Select"
                                roundedClass="rounded-[3px]"
                                className="w-full inline-block"
                                buttonClassName="w-full h-7 px-2 text-xs font-medium bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                HandOver Status
                              </label>
                              <ModernDropdown<string>
                                value={activeRow.handOver}
                                onChange={(val) =>
                                  handleRowChange(table.id, activeRow.id, 'handOver', val)
                                }
                                options={HANDOVER_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
                                placeholder="Status"
                                roundedClass="rounded-[3px]"
                                className="w-full inline-block"
                                buttonClassName="w-full h-7 px-2 text-xs font-medium bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Completion Date
                              </label>
                              <ModernCalendar
                                value={activeRow.completionDate}
                                onChange={(val) =>
                                  handleRowChange(table.id, activeRow.id, 'completionDate', val)
                                }
                                buttonClassName="h-7 text-xs px-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80"
                                placeholder="dd-mm-yyyy"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 block">
                                Distance (Ft)
                              </label>
                              <input
                                type="text"
                                value={activeRow.flatToFlatDistance}
                                onChange={(e) =>
                                  handleRowChange(table.id, activeRow.id, 'flatToFlatDistance', e.target.value)
                                }
                                placeholder="e.g. 15 Ft"
                                className="w-full h-7 px-2 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 bg-slate-50 dark:bg-slate-950 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      </div>

      
      <div className="pt-1 pb-3 flex items-center justify-between">
        <div className="rounded-[4px] p-2 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-2xs">
          <div className="flex items-center gap-2">
            <label className="text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
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
              buttonClassName="w-auto h-7 px-2 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
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
