import { useState } from 'react';
import { Plus, Trash2, Layers, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { ModernCalendar } from '../../components/elements/ModernCalendar';
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
    <div className="p-1.5 space-y-4 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Project layout saved successfully!</span>
        </div>
      )}

      
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

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[9.5px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Tower Matrix & Elevation Specifications
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
                {/* Table Header */}
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

                {/* Tower Cards */}
                <div className="p-2.5 space-y-3">
                  {table.rows.map((row, rIndex) => (
                    <div
                      key={row.id}
                      className="bg-white dark:bg-slate-950 rounded-[4px] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xs"
                    >
                      {/* Card Header */}
                      <div className="px-3 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold font-mono rounded-[3px] bg-white/15 text-white/90 select-none">
                            {String(rIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[13px] font-bold text-white font-display tracking-tight">
                            {row.towerName || `Tower ${rIndex + 1}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(table.id, row.id)}
                          className="p-1 rounded-[3px] text-white/50 hover:text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Key Metrics Badges */}
                      {(row.noOfFloors || row.unitsPerFloor || row.basePrice || row.handOver) && (
                        <div className="px-3 pt-3 pb-1 flex flex-wrap gap-1.5">
                          {row.noOfFloors && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50">
                              {row.noOfFloors} Floors
                            </span>
                          )}
                          {row.unitsPerFloor && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50">
                              {row.unitsPerFloor} Units/Floor
                            </span>
                          )}
                          {row.basePrice && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50">
                              ₹{row.basePrice}
                            </span>
                          )}
                          {row.handOver && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                              row.handOver.includes('Ready')
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/50'
                                : 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200/60 dark:border-orange-900/50'
                            }`}>
                              {row.handOver}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Detail Rows */}
                      <div className="px-3 pt-2.5 pb-3 space-y-2.5">
                        {/* Parking Details */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Parking Levels</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.parkingLevels || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Level Names</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.parkingLevelNames || '—'}</span>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-slate-200/60 dark:border-white/10" />

                        {/* Vertical Transport */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Passenger Lifts</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.noOfPassengerLifts || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Service Lifts</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.noOfServiceLifts || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Flats / Lift</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.avgFlatCountPerLift || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Staircases</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.noOfStaircase || '—'}</span>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-slate-200/60 dark:border-white/10" />

                        {/* Circulation & Extras */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Corridor Width</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.corridorWidth ? `${row.corridorWidth} Ft` : '—'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Lobby</span>
                            <span className={`text-[11.5px] font-semibold ${row.lobbyAvailable === 'Yes' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
                              {row.lobbyAvailable === 'Yes' ? '✓ Available' : 'Not Available'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Completion</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.completionDate || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Distance</span>
                            <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100">{row.flatToFlatDistance ? `${row.flatToFlatDistance} Ft` : '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Footer */}
                <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-start">
                  <button
                    type="button"
                    onClick={() => handleAddRow(table.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      
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
