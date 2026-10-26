import { useState, type FormEvent } from 'react';
import { Plus, Trash2, X, Layers, CheckCircle2, Pencil, Eye, Building2, Copy } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { ModernCalendar } from '../../components/elements/ModernCalendar';
import { INITIAL_LAYOUT_DATA, HANDOVER_OPTIONS, createNewTowerRow, duplicateTowerRow, createNewTowerTable, type LayoutFormData, type TowerRow, type TowerTable } from './data';

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
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
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
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Project layout saved successfully!</span>
        </div>
      )}

      
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

            <div className="flex items-center gap-2.5">
              
              <div className="inline-flex p-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('write')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'write'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              {viewMode === 'write' && (
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Tower</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {formData.tables.map((table, tblIndex) => (
              <div key={table.id} className="space-y-6">
                {tblIndex > 0 && (
                  <div className="pt-[1px] pb-[2px]" aria-hidden="true">
                    <div className="border-t border-slate-200 dark:border-slate-800" />
                    <div className="border-t border-slate-200 dark:border-slate-800 mt-[3px]" />
                  </div>
                )}
                <div
                  className={
                    viewMode === 'write'
                      ? 'overflow-hidden'
                      : 'border border-slate-200/90 dark:border-white/10 rounded-[4px] overflow-hidden shadow-2xs bg-white dark:bg-slate-950'
                  }
                >
                  <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 rounded-t-[4px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">
                      Table {tblIndex + 1}: {table.tableName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      ({table.rows.length} {table.rows.length === 1 ? 'Tower' : 'Towers'})
                    </span>
                  </div>

                  {viewMode === 'write' && (
                    <div className="flex items-center gap-2">
                      {formData.tables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTable(table.id)}
                          className="p-1.5 rounded-[4px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                          title="Delete this table"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {viewMode === 'write' ? (
                  
                  (() => {
                    const activeRow = getActiveRow(table);
                    const activeIndex = table.rows.findIndex((r) => r.id === activeRow?.id);

                    if (!activeRow || table.rows.length === 0) {
                      return (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[6px] m-4 space-y-3">
                          <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
                          <p className="text-xs text-slate-500">No tower variants exist in this table.</p>
                          <button
                            type="button"
                            onClick={() => handleAddRow(table.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-[4px] text-xs font-semibold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add First Tower</span>
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="pt-2">
                        
                        <div className="flex items-end gap-1 overflow-x-auto no-scrollbar pt-2 -mb-[1px] relative z-10">
                          {table.rows.map((row, rIndex) => {
                            const isActive = row.id === activeRow.id;
                            return (
                              <button
                                type="button"
                                key={row.id}
                                onClick={() =>
                                  setActiveRowIdMap((prev) => ({
                                    ...prev,
                                    [table.id]: row.id,
                                  }))
                                }
                                className={`relative inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-center cursor-pointer transition-all select-none group font-display tracking-tight text-xs sm:text-[13px] font-bold ${
                                  isActive
                                    ? 'bg-white dark:bg-[#1e2738] text-blue dark:text-sky-400 border-t-2 border-l border-r border-b border-t-blue-600 border-l-slate-300 border-r-slate-300 border-b-white dark:border-t-sky-400 dark:border-l-[#384863] dark:border-r-[#384863] dark:border-b-[#1e2738] rounded-t-[6px] rounded-b-none z-10 shadow-xs'
                                    : 'bg-slate-900 hover:bg-slate-200/90 dark:bg-[#161e2e]/90 dark:hover:bg-[#1e2738]/80 text-white dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300/80 dark:border-slate-700/60 rounded-[6px] mb-[2px] shadow-2xs'
                                }`}
                              >
                                <span className="truncate max-w-[150px]">
                                  {row.towerName || `Tower ${rIndex + 1}`}
                                </span>
                              </button>
                            );
                          })}

                          
                          <button
                            type="button"
                            onClick={() => handleAddRow(table.id)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-[6px] border-2 border-dashed border-blue-400/50 hover:border-blue-600 dark:border-sky-500/40 dark:hover:border-sky-400 bg-blue-50/40 hover:bg-blue-100/60 dark:bg-sky-950/20 text-blue-600 dark:text-sky-400 transition-all cursor-pointer font-bold font-display text-xs mb-[2px] shadow-2xs active:scale-95"
                            title="Add another tower"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Add Tower</span>
                          </button>
                        </div>

                        
                        <div className="bg-white dark:bg-[#1e2738] border-t border-slate-300 dark:border-[#384863] pt-5 px-4 pb-2 space-y-5 relative z-0">
                          

                          
                          <div className="space-y-4">
                            
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-sky-400" />
                                <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                  Basic Details & Pricing
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Tower Name
                                  </label>
                                  <input
                                    type="text"
                                    value={activeRow.towerName}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'towerName', e.target.value)
                                    }
                                    placeholder="e.g. Tower A"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    No. of Floors
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.noOfFloors}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'noOfFloors', e.target.value)
                                    }
                                    placeholder="Floors"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Units / Floor
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.unitsPerFloor}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'unitsPerFloor', e.target.value)
                                    }
                                    placeholder="Units"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Base Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.basePrice}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'basePrice', e.target.value)
                                    }
                                    placeholder="Price"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>

                            
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                            
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                                <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                  Parking Specifications
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Parking Levels
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.parkingLevels}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'parkingLevels', e.target.value)
                                    }
                                    placeholder="e.g. 2"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col col-span-1 md:col-span-2">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Parking Level Names
                                  </label>
                                  <input
                                    type="text"
                                    value={activeRow.parkingLevelNames}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'parkingLevelNames', e.target.value)
                                    }
                                    placeholder="e.g. B1, B2, Stilt"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>

                            
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                            
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                  Vertical Transport & Circulation
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Passenger Lifts
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.noOfPassengerLifts}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'noOfPassengerLifts', e.target.value)
                                    }
                                    placeholder="Count"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Service Lifts
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.noOfServiceLifts}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'noOfServiceLifts', e.target.value)
                                    }
                                    placeholder="Count"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Avg Flats / Lift
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.avgFlatCountPerLift}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'avgFlatCountPerLift', e.target.value)
                                    }
                                    placeholder="Avg"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Staircases
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.noOfStaircase}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'noOfStaircase', e.target.value)
                                    }
                                    placeholder="Count"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Corridor (Ft)
                                  </label>
                                  <input
                                    type="number"
                                    value={activeRow.corridorWidth}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'corridorWidth', e.target.value)
                                    }
                                    placeholder="Width"
                                    className="w-full max-w-[200px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>

                            
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-700/70" />

                            
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                                <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                  Handover & Proximity
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                                <div className="flex flex-col ">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Lobby Available
                                  </label>
                                  <ModernDropdown<'No' | 'Yes'>
                                    value={activeRow.lobbyAvailable}
                                    onChange={(val) =>
                                      handleRowChange(
                                        table.id,
                                        activeRow.id,
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
                                    className="w-24 inline-block"
                                    buttonClassName="w-24 h-8 px-2 text-xs font-medium gap-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Completion Date
                                  </label>
                                  <ModernCalendar
                                    value={activeRow.completionDate}
                                    onChange={(val) =>
                                      handleRowChange(table.id, activeRow.id, 'completionDate', val)
                                    }
                                    className="w-full max-w-[170px]"
                                    buttonClassName="w-full h-8 text-xs px-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600"
                                    placeholder="dd-mm-yyyy"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    HandOver Status
                                  </label>
                                  <ModernDropdown<string>
                                    value={activeRow.handOver}
                                    onChange={(val) =>
                                      handleRowChange(table.id, activeRow.id, 'handOver', val)
                                    }
                                    options={HANDOVER_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
                                    placeholder="Select HandOver"
                                    roundedClass="rounded-[3px]"
                                    className="w-full max-w-[180px] inline-block"
                                    buttonClassName="w-full h-8 px-2.5 text-xs font-medium gap-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 truncate"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    Distance (Ft)
                                  </label>
                                  <input
                                    type="text"
                                    value={activeRow.flatToFlatDistance}
                                    onChange={(e) =>
                                      handleRowChange(table.id, activeRow.id, 'flatToFlatDistance', e.target.value)
                                    }
                                    placeholder="e.g. 15 Ft"
                                    className="w-full max-w-[150px] h-8 px-2.5 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 rounded-[3px] focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-sky-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-sky-400/20 bg-slate-50 dark:bg-slate-950 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1300px]">
                      <thead>
                        <tr className="bg-slate-900 dark:bg-slate-800 text-white text-[10.5px] font-bold uppercase tracking-wider select-none divide-x divide-slate-800 dark:divide-slate-700">
                          <th className="py-2.5 px-2.5 w-12 text-center">#</th>
                          <th className="py-2.5 px-3 min-w-[135px]">Tower Name</th>
                          <th className="py-2.5 px-2.5 min-w-[80px] text-center">Floors</th>
                          <th className="py-2.5 px-2.5 min-w-[95px] text-center">Units / Floor</th>
                          <th className="py-2.5 px-2.5 min-w-[95px] text-center">Parking Levels</th>
                          <th className="py-2.5 px-2.5 min-w-[105px] max-w-[130px]">Parking Names</th>
                          <th className="py-2.5 px-2.5 min-w-[95px] text-center">Passenger Lifts</th>
                          <th className="py-2.5 px-2.5 min-w-[85px] text-center">Service Lifts</th>
                          <th className="py-2.5 px-2.5 min-w-[95px] text-center">Avg Flats / Lift</th>
                          <th className="py-2.5 px-2.5 min-w-[85px] text-center">Staircases</th>
                          <th className="py-2.5 px-2.5 min-w-[90px] text-center">Corridor (Ft)</th>
                          <th className="py-2.5 px-2.5 min-w-[100px] text-center">Lobby</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center">Completion</th>
                          <th className="py-2.5 px-2.5 min-w-[135px]">HandOver Status</th>
                          <th className="py-2.5 px-2.5 min-w-[95px] text-right">Base Price</th>
                          <th className="py-2.5 px-2.5 min-w-[95px] text-center">Distance (Ft)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-xs text-slate-800 dark:text-slate-200">
                        {table.rows.map((row, rIdx) => (
                          <tr
                            key={row.id}
                            className={`transition-colors divide-x divide-slate-100 dark:divide-white/5 ${
                              rIdx % 2 === 0
                                ? 'bg-white dark:bg-slate-950 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
                                : 'bg-slate-50/60 dark:bg-slate-900/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
                            }`}
                          >
                            <td className="py-2.5 px-2 text-center select-none">
                              <span className="inline-flex items-center justify-center w-6 h-5 text-[10px] font-bold font-mono rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10">
                                {String(rIdx + 1).padStart(2, '0')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                              {row.towerName || `Tower ${rIdx + 1}`}
                            </td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.noOfFloors || '—'}</td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.unitsPerFloor || '—'}</td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.parkingLevels || '—'}</td>
                            <td className="py-2.5 px-2.5 text-slate-600 dark:text-slate-400 font-medium max-w-[130px] truncate" title={row.parkingLevelNames}>
                              {row.parkingLevelNames || '—'}
                            </td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.noOfPassengerLifts || '—'}</td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.noOfServiceLifts || '—'}</td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.avgFlatCountPerLift || '—'}</td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.noOfStaircase || '—'}</td>
                            <td className="py-2.5 px-2.5 text-center font-mono font-medium">{row.corridorWidth ? `${row.corridorWidth} Ft` : '—'}</td>
                            <td className="py-2.5 px-2.5 text-center">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-[3px] text-[10px] font-bold ${
                                  row.lobbyAvailable === 'Yes'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/50'
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                                }`}
                              >
                                {row.lobbyAvailable === 'Yes' ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-2.5 px-2.5 text-center font-mono">{row.completionDate || '—'}</td>
                            <td className="py-2.5 px-2.5">
                              {row.handOver ? (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-[3px] text-[10px] font-bold border ${
                                    row.handOver.includes('Ready')
                                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/50'
                                      : 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200/60 dark:border-orange-900/50'
                                  }`}
                                >
                                  {row.handOver}
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="py-2.5 px-2.5 text-right font-semibold font-mono text-slate-900 dark:text-white">
                              {row.basePrice ? `₹${row.basePrice}` : '—'}
                            </td>
                            <td className="py-2.5 px-2.5 text-center font-mono">
                              {row.flatToFlatDistance ? `${row.flatToFlatDistance} Ft` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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

export default LayoutDesktop;
