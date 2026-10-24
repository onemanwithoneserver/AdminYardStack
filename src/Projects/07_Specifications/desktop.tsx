import { useState, type FormEvent } from 'react';
import { ChevronDown, X, CheckCircle2 } from 'lucide-react';
import { INITIAL_SPECIFICATIONS_DATA, INITIAL_CONSTRUCTION_TYPES, ALLOWED_TYPES, type SpecificationsFormData, type ConstructionTypeOption, type SpecItem } from './data';

interface AddConstructionTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ConstructionTypeOption, 'id'>) => void;
}

export function AddConstructionTypeDialog({
  isOpen,
  onClose,
  onSave,
}: AddConstructionTypeDialogProps) {
  const [option, setOption] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!option.trim()) return;
    onSave({ option: option.trim(), status });
    setOption('');
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
              Add Construction Type
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Type is fixed to constructionType.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-600 dark:text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Option <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              placeholder="Enter option"
              required
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
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SpecificationsDesktop() {
  const [formData, setFormData] = useState<SpecificationsFormData>(
    INITIAL_SPECIFICATIONS_DATA
  );
  const [constructionTypes, setConstructionTypes] = useState<
    ConstructionTypeOption[]
  >(INITIAL_CONSTRUCTION_TYPES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSpecItemChange = (
    group: 'structureItems' | 'flooringItems',
    id: string,
    field: keyof SpecItem,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [group]: prev[group].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleFieldChange = <K extends keyof SpecificationsFormData>(
    field: K,
    value: SpecificationsFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveConstructionType = (
    newItem: Omit<ConstructionTypeOption, 'id'>
  ) => {
    const item: ConstructionTypeOption = {
      id: `${Date.now()}`,
      ...newItem,
    };
    setConstructionTypes((prev) => [...prev, item]);
    handleFieldChange('selectedConstructionType', item.option);
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const renderSpecGrid = (
    items: SpecItem[],
    group: 'structureItems' | 'flooringItems'
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3"
        >
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 select-none pb-1 border-b border-slate-100">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) =>
                handleSpecItemChange(group, item.id, 'enabled', e.target.checked)
              }
              className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span>{item.name}</span>
          </label>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">
                Allowed Type
              </label>
              <div className="relative">
                <select
                  value={item.allowedType}
                  onChange={(e) =>
                    handleSpecItemChange(
                      group,
                      item.id,
                      'allowedType',
                      e.target.value
                    )
                  }
                  className="w-full appearance-none px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-7 cursor-pointer"
                >
                  {ALLOWED_TYPES.map((t) => (
                    <option key={t} value={t === 'Select type' ? '' : t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-600 dark:text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">
                Brand
              </label>
              <input
                type="text"
                placeholder="Brand"
                value={item.brand}
                onChange={(e) =>
                  handleSpecItemChange(group, item.id, 'brand', e.target.value)
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">
                Size
              </label>
              <textarea
                rows={2}
                placeholder="Size"
                value={item.size}
                onChange={(e) =>
                  handleSpecItemChange(group, item.id, 'size', e.target.value)
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full ys-panel p-6 md:p-8 space-y-7 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 ys-toast px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Specifications saved successfully!</span>
        </div>
      )}

      <div className="pb-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Specifications
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 uppercase tracking-wider">
          Step 07 / 10
        </span>
      </div>

      
      <section className="space-y-3.5">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Structure
          </h3>
        </div>
        {renderSpecGrid(formData.structureItems, 'structureItems')}
      </section>

      
      <section className="space-y-3.5 pt-2">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Flooring
          </h3>
        </div>
        {renderSpecGrid(formData.flooringItems, 'flooringItems')}
      </section>

      
      <section className="space-y-4 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Utility
            </label>
            <input
              type="text"
              value={formData.utility}
              onChange={(e) => handleFieldChange('utility', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Electrical
            </label>
            <input
              type="text"
              value={formData.electrical}
              onChange={(e) => handleFieldChange('electrical', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Plumbing
            </label>
            <input
              type="text"
              value={formData.plumbing}
              onChange={(e) => handleFieldChange('plumbing', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Fire and Safety
            </label>
            <input
              type="text"
              value={formData.fireAndSafety}
              onChange={(e) => handleFieldChange('fireAndSafety', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Safety and Security
            </label>
            <input
              type="text"
              value={formData.safetyAndSecurity}
              onChange={(e) =>
                handleFieldChange('safetyAndSecurity', e.target.value)
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              DG Backup
            </label>
            <input
              type="text"
              value={formData.dgBackup}
              onChange={(e) => handleFieldChange('dgBackup', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Construction Type
            </label>
            <div className="relative">
              <select
                value={formData.selectedConstructionType}
                onChange={(e) =>
                  handleFieldChange('selectedConstructionType', e.target.value)
                }
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
              >
                <option value="">Select Construction Type</option>
                {constructionTypes
                  .filter((c) => c.status === 'ACTIVE')
                  .map((c) => (
                    <option key={c.id} value={c.option}>
                      {c.option}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="mt-2.5 inline-flex items-center px-3.5 py-1.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Add Construction Type
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Door Height
            </label>
            <input
              type="text"
              value={formData.doorHeight}
              onChange={(e) => handleFieldChange('doorHeight', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
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
                handleFieldChange(
                  'status',
                  e.target.value as 'Active' | 'Inactive'
                )
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
          className="px-6 py-2 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-end"
        >
          Save Project
        </button>
      </div>

      
      <AddConstructionTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveConstructionType}
      />
    </div>
  );
}

export default SpecificationsDesktop;
