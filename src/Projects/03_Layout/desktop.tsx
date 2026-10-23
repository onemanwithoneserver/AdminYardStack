import { useState, type FormEvent } from 'react';
import {
  Plus,
  ChevronDown,
  Calendar,
  Trash2,
  X,
  Layers,
  CheckCircle2,
} from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-2 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Add New Tower Control
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Activating will generate a new tower inventory table.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tower / Block Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={towerName}
              onChange={(e) => setTowerName(e.target.value)}
              placeholder="e.g. Tower 7 or Block B"
              required
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Initial No. of Floors
            </label>
            <input
              type="number"
              value={noOfFloors}
              onChange={(e) => setNoOfFloors(e.target.value)}
              placeholder="e.g. 14"
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 pr-8 cursor-pointer"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
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
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 md:p-8 space-y-7 text-slate-800">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Project layout saved successfully!</span>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Layout
        </span>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Approval Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
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
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
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
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Inventory
            </h3>
            {formData.tables.length > 1 && (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {formData.tables.length} Tables Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1956db] hover:bg-[#1444b0] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Add a new tower control to create a new table"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Tower</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {formData.tables.map((table, tblIndex) => (
            <div
              key={table.id}
              className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white"
            >
              {formData.tables.length > 1 && (
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Table {tblIndex + 1}: {table.tableName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({table.rows.length} {table.rows.length === 1 ? 'Tower' : 'Towers'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddRow(table.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Row</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTable(table.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete this table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1350px]">
                  <thead>
                    <tr className="bg-[#0284c7] text-white text-[11px] font-semibold divide-x divide-sky-500/40 select-none">
                      <th className="py-2.5 px-3 min-w-[100px]">Towers Name</th>
                      <th className="py-2.5 px-2.5 min-w-[85px]">No. of Floors</th>
                      <th className="py-2.5 px-2.5 min-w-[90px]">Units per Floor</th>
                      <th className="py-2.5 px-2.5 min-w-[85px]">Parking Levels</th>
                      <th className="py-2.5 px-2.5 min-w-[120px]">Parking Level Names</th>
                      <th className="py-2.5 px-2.5 min-w-[110px]">No. of Passenger Lifts</th>
                      <th className="py-2.5 px-2.5 min-w-[100px]">No. of Service Lifts</th>
                      <th className="py-2.5 px-2.5 min-w-[115px]">Avg Flat Count Per Lift</th>
                      <th className="py-2.5 px-2.5 min-w-[90px]">No. of Staircase</th>
                      <th className="py-2.5 px-2.5 min-w-[95px]">Corridor Width</th>
                      <th className="py-2.5 px-2.5 min-w-[95px]">Lobby Available?</th>
                      <th className="py-2.5 px-2.5 min-w-[110px]">Completion Date</th>
                      <th className="py-2.5 px-2.5 min-w-[140px]">HandOver</th>
                      <th className="py-2.5 px-2.5 min-w-[90px]">Base Price</th>
                      <th className="py-2.5 px-2.5 min-w-[120px]">Flat to Flat Distance</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                    {table.rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-blue-50/20 transition-colors divide-x divide-slate-100"
                      >
                        <td className="p-1.5 min-w-[100px]">
                          <input
                            type="text"
                            value={row.towerName}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'towerName',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs font-semibold text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600 focus:bg-white bg-slate-50/50"
                          />
                        </td>
                        <td className="p-1.5 min-w-[85px]">
                          <input
                            type="text"
                            value={row.noOfFloors}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'noOfFloors',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[90px]">
                          <input
                            type="text"
                            value={row.unitsPerFloor}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'unitsPerFloor',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[85px]">
                          <input
                            type="text"
                            value={row.parkingLevels}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'parkingLevels',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[120px]">
                          <input
                            type="text"
                            value={row.parkingLevelNames}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'parkingLevelNames',
                                e.target.value
                              )
                            }
                            placeholder="e.g. B1, B2"
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[110px]">
                          <input
                            type="text"
                            value={row.noOfPassengerLifts}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'noOfPassengerLifts',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[100px]">
                          <input
                            type="text"
                            value={row.noOfServiceLifts}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'noOfServiceLifts',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[115px]">
                          <input
                            type="text"
                            value={row.avgFlatCountPerLift}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'avgFlatCountPerLift',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[90px]">
                          <input
                            type="text"
                            value={row.noOfStaircase}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'noOfStaircase',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[95px]">
                          <input
                            type="text"
                            value={row.corridorWidth}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'corridorWidth',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[95px]">
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
                              className="w-full appearance-none px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-6 cursor-pointer"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 pointer-events-none text-slate-400" />
                          </div>
                        </td>
                        <td className="p-1.5 min-w-[110px]">
                          <input
                            type="text"
                            placeholder="dd-mm-yyyy"
                            value={row.completionDate}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'completionDate',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[140px]">
                          <div className="relative">
                            <select
                              value={row.handOver}
                              onChange={(e) =>
                                handleRowChange(
                                  table.id,
                                  row.id,
                                  'handOver',
                                  e.target.value
                                )
                              }
                              className="w-full appearance-none px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-6 cursor-pointer truncate"
                            >
                              {HANDOVER_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1.5 pointer-events-none text-slate-400" />
                          </div>
                        </td>
                        <td className="p-1.5 min-w-[90px]">
                          <input
                            type="text"
                            value={row.basePrice}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'basePrice',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 min-w-[120px]">
                          <input
                            type="text"
                            value={row.flatToFlatDistance}
                            onChange={(e) =>
                              handleRowChange(
                                table.id,
                                row.id,
                                'flatToFlatDistance',
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-1.5 w-10 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(table.id, row.id)}
                            className="p-1 text-slate-300 hover:text-red-600 transition-colors cursor-pointer rounded"
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

              <div className="px-3 py-2 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleAddRow(table.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tower Row</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  {table.rows.length} {table.rows.length === 1 ? 'record' : 'records'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xs w-full">
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
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-end"
        >
          <span>Save Project</span>
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

export default LayoutDesktop;
