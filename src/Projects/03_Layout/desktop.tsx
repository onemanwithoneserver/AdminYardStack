import { useState, type FormEvent } from 'react';
import { Plus, Trash2, X, Layers, CheckCircle2 } from 'lucide-react';
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

interface AddTowerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (towerName: string, noOfFloors?: string) => void;
  suggestedIndex: number;
}

export function AddTowerDialog({
  isOpen,
  onClose,
  onSave,
  suggestedIndex,
}: AddTowerDialogProps) {
  const [towerName, setTowerName] = useState(`Tower ${suggestedIndex}`);
  const [noOfFloors, setNoOfFloors] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!towerName.trim()) return;
    onSave(towerName.trim(), noOfFloors.trim());
    setTowerName(`Tower ${suggestedIndex + 1}`);
    setNoOfFloors('');
    setStatus('ACTIVE');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[4px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Add New Tower Control
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Activating will generate a new tower inventory table.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[2px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tower / Block Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={towerName}
              onChange={(e) => setTowerName(e.target.value)}
              placeholder="e.g. Tower 7 or Block B"
              required
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Initial No. of Floors
            </label>
            <input
              type="number"
              value={noOfFloors}
              onChange={(e) => setNoOfFloors(e.target.value)}
              placeholder="e.g. 14"
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Status
            </label>
            <ModernDropdown<'ACTIVE' | 'INACTIVE'>
              value={status}
              onChange={(val) => setStatus(val)}
              options={['ACTIVE', 'INACTIVE']}
              placeholder="Select Status"
              roundedClass="rounded-[4px]"
              className="w-full"
              buttonClassName="w-full h-9 px-3 text-xs font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LayoutDesktop() {
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
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Project layout saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-xs shadow-orange-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Layout
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Approval details, handover schedule, phased possession timelines, and spatial master plans
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        {/* Section 1: Approval Details & Handover Timelines */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Approval Details & Handover Timelines
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Completion Date */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Completion Date
              </label>
              <ModernCalendar
                value={formData.completionDate}
                onChange={(val) => handleFieldChange('completionDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            {/* HandOver */}
            <div className="flex flex-col items-start w-full sm:col-span-1 md:col-span-2 xl:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                HandOver Status
              </label>
              <ModernDropdown<string>
                value={formData.handOver}
                onChange={(val) => handleFieldChange('handOver', val)}
                options={[...HANDOVER_OPTIONS]}
                placeholder="Select HandOver Status"
                roundedClass="rounded-[4px]"
                className="w-full max-w-sm inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Tower Matrix & Elevation Specifications */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                  Tower Matrix & Elevation Specifications
                </h3>
                {formData.tables.length > 1 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-[3px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/40">
                    {formData.tables.length} Tables Active
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Tower</span>
            </button>
          </div>

          <div className="space-y-5">
            {formData.tables.map((table, tblIndex) => (
              <div
                key={table.id}
                className="border border-slate-200/90 dark:border-white/10 rounded-[4px] overflow-hidden shadow-2xs bg-white dark:bg-slate-950"
              >
                {formData.tables.length > 1 && (
                  <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">
                        Table {tblIndex + 1}: {table.tableName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        ({table.rows.length} {table.rows.length === 1 ? 'Tower' : 'Towers'})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddRow(table.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Row</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTable(table.id)}
                        className="p-1.5 rounded-[4px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Delete this table"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[1400px]">
                    <thead>
                      <tr className="bg-slate-900 dark:bg-slate-800 text-white text-[10.5px] font-bold uppercase tracking-wider select-none divide-x divide-slate-800 dark:divide-slate-700">
                        <th className="py-2.5 px-3 min-w-[120px]">Towers Name</th>
                        <th className="py-2.5 px-2.5 min-w-[95px]">Floors</th>
                        <th className="py-2.5 px-2.5 min-w-[105px]">Units / Floor</th>
                        <th className="py-2.5 px-2.5 min-w-[105px]">Parking Levels</th>
                        <th className="py-2.5 px-2.5 min-w-[130px]">Parking Names</th>
                        <th className="py-2.5 px-2.5 min-w-[115px]">Passenger Lifts</th>
                        <th className="py-2.5 px-2.5 min-w-[105px]">Service Lifts</th>
                        <th className="py-2.5 px-2.5 min-w-[125px]">Avg Flats / Lift</th>
                        <th className="py-2.5 px-2.5 min-w-[100px]">Staircases</th>
                        <th className="py-2.5 px-2.5 min-w-[105px]">Corridor (Ft)</th>
                        <th className="py-2.5 px-2.5 min-w-[105px]">Lobby Available</th>
                        <th className="py-2.5 px-2.5 min-w-[125px]">Completion Date</th>
                        <th className="py-2.5 px-2.5 min-w-[150px]">HandOver Status</th>
                        <th className="py-2.5 px-2.5 min-w-[105px]">Base Price</th>
                        <th className="py-2.5 px-2.5 min-w-[130px]">Distance (Ft)</th>
                        <th className="py-2.5 px-2 w-10 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-xs text-slate-800 dark:text-slate-200">
                      {table.rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors divide-x divide-slate-100 dark:divide-white/5"
                        >
                          <td className="p-1.5 min-w-[120px]">
                            <input
                              type="text"
                              value={row.towerName}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'towerName', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs font-semibold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-slate-50/70 dark:bg-slate-900"
                            />
                          </td>
                          <td className="p-1.5 min-w-[95px]">
                            <input
                              type="number"
                              value={row.noOfFloors}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'noOfFloors', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[105px]">
                            <input
                              type="number"
                              value={row.unitsPerFloor}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'unitsPerFloor', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[105px]">
                            <input
                              type="number"
                              value={row.parkingLevels}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'parkingLevels', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[130px]">
                            <input
                              type="text"
                              value={row.parkingLevelNames}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'parkingLevelNames', e.target.value)
                              }
                              placeholder="e.g. B1, B2"
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[115px]">
                            <input
                              type="number"
                              value={row.noOfPassengerLifts}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'noOfPassengerLifts', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[105px]">
                            <input
                              type="number"
                              value={row.noOfServiceLifts}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'noOfServiceLifts', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[125px]">
                            <input
                              type="number"
                              value={row.avgFlatCountPerLift}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'avgFlatCountPerLift', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[100px]">
                            <input
                              type="number"
                              value={row.noOfStaircase}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'noOfStaircase', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[105px]">
                            <input
                              type="number"
                              value={row.corridorWidth}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'corridorWidth', e.target.value)
                              }
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[105px]">
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
                              roundedClass="rounded-[3px]"
                              className="w-full inline-block"
                              buttonClassName="w-full h-8 px-2 text-xs font-medium gap-1"
                            />
                          </td>
                          <td className="p-1.5 min-w-[130px]">
                            <ModernCalendar
                              value={row.completionDate}
                              onChange={(val) =>
                                handleRowChange(table.id, row.id, 'completionDate', val)
                              }
                              buttonClassName="h-8 text-xs px-2"
                              placeholder="dd-mm-yyyy"
                            />
                          </td>
                          <td className="p-1.5 min-w-[150px]">
                            <ModernDropdown<string>
                              value={row.handOver}
                              onChange={(val) =>
                                handleRowChange(table.id, row.id, 'handOver', val)
                              }
                              options={HANDOVER_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
                              placeholder="Select HandOver"
                              roundedClass="rounded-[3px]"
                              className="w-full inline-block"
                              buttonClassName="w-full h-8 px-2 text-xs font-medium gap-1"
                            />
                          </td>
                          <td className="p-1.5 min-w-[105px]">
                            <input
                              type="number"
                              value={row.basePrice}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'basePrice', e.target.value)
                              }
                              placeholder="Price"
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 min-w-[130px]">
                            <input
                              type="text"
                              value={row.flatToFlatDistance}
                              onChange={(e) =>
                                handleRowChange(table.id, row.id, 'flatToFlatDistance', e.target.value)
                              }
                              placeholder="e.g. 15 Ft"
                              className="w-full h-8 px-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-[3px] focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-950"
                            />
                          </td>
                          <td className="p-1.5 w-10 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(table.id, row.id)}
                              className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                              title="Delete Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleAddRow(table.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tower Row</span>
                  </button>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {table.rows.length} {table.rows.length === 1 ? 'record' : 'records'}
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

export default LayoutDesktop;
