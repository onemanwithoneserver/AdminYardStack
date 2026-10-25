import { useState, type FormEvent } from 'react';
import { SlidersHorizontal, Plus, X, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { Combobox } from '../../components/elements/Combobox';
import {
  INITIAL_SPECIFICATIONS_DATA,
  INITIAL_CONSTRUCTION_TYPES,
  ALLOWED_TYPES,
  type SpecificationsFormData,
  type ConstructionTypeOption,
  type SpecItem,
} from './data';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[4px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Add Construction Type
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Specify structural wall or masonry material.
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
              Material / Type <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              placeholder="e.g. Porotherm Smart Bricks"
              required
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
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
              Save Type
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
  const [allowedTypes, setAllowedTypes] = useState<string[]>([...ALLOWED_TYPES]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleAddAllowedType = (newType: string) => {
    const trimmed = newType.trim();
    if (trimmed && !allowedTypes.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setAllowedTypes((prev) => [...prev, trimmed]);
    }
  };

  const handleAddConstructionTypeFromCombobox = (newType: string) => {
    const trimmed = newType.trim();
    if (trimmed && !constructionTypes.some((c) => c.option.toLowerCase() === trimmed.toLowerCase())) {
      setConstructionTypes((prev) => {
        const newItem: ConstructionTypeOption = {
          id: `ct-${prev.length + 1}-${trimmed.replace(/\s+/g, '-').toLowerCase()}`,
          option: trimmed,
          status: 'ACTIVE',
        };
        return [...prev, newItem];
      });
      handleFieldChange('selectedConstructionType', trimmed);
    }
  };

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
    setConstructionTypes((prev) => {
      const item: ConstructionTypeOption = {
        id: `ct-${prev.length + 1}-${newItem.option.replace(/\s+/g, '-').toLowerCase()}`,
        ...newItem,
      };
      return [...prev, item];
    });
    handleFieldChange('selectedConstructionType', newItem.option);
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const renderSpecGrid = (
    items: SpecItem[],
    group: 'structureItems' | 'flooringItems'
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`border rounded-[4px] p-3.5 space-y-3 transition-all ${
            item.enabled
              ? 'bg-white dark:bg-slate-900 border-blue-200/90 dark:border-blue-900/40 shadow-xs'
              : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-white/5 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) =>
                  handleSpecItemChange(group, item.id, 'enabled', e.target.checked)
                }
                className="w-3.5 h-3.5 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {item.name}
              </span>
            </label>
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[2px] ${
                item.enabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Allowed Type
              </label>
              <Combobox
                value={item.allowedType}
                onChange={(val) =>
                  handleSpecItemChange(group, item.id, 'allowedType', val)
                }
                onAddItem={handleAddAllowedType}
                options={allowedTypes}
                placeholder="Select or type..."
                size="sm"
                roundedClass="rounded-[4px]"
                className="w-full"
                inputClassName="w-full h-8 px-2.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Brand / Supplier
              </label>
              <input
                type="text"
                placeholder="e.g. Kajaria / Somany / Ultratech"
                value={item.brand}
                onChange={(e) =>
                  handleSpecItemChange(group, item.id, 'brand', e.target.value)
                }
                className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Dimensions / Size / Grade
              </label>
              <input
                type="text"
                placeholder="e.g. 600x600 mm, Grade 53"
                value={item.size}
                onChange={(e) =>
                  handleSpecItemChange(group, item.id, 'size', e.target.value)
                }
                className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Specifications saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-xs shadow-pink-500/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Specifications
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Structural engineering standards, flooring finishes, doors & windows, fittings and material grades
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        {/* Section 1: Structural Specifications & Engineering */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Structural Specifications & Engineering
              </h3>
            </div>
          </div>
          {renderSpecGrid(formData.structureItems, 'structureItems')}
        </section>

        {/* Section 2: Flooring & Surface Finishes */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Flooring & Surface Finishes
              </h3>
            </div>
          </div>
          {renderSpecGrid(formData.flooringItems, 'flooringItems')}
        </section>

        {/* Section 3: Utilities, Fittings & Services */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                03
              </span>
              <span className="w-1 h-3.5 rounded-full bg-amber-600 dark:bg-amber-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Utilities, Fittings & MEP Services
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Utility */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Utility Area Specs
              </label>
              <input
                type="text"
                placeholder="e.g. Provision for washing machine"
                value={formData.utility}
                onChange={(e) => handleFieldChange('utility', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Electrical */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Electrical Specifications
              </label>
              <input
                type="text"
                placeholder="e.g. Concealed copper wiring (Havells)"
                value={formData.electrical}
                onChange={(e) => handleFieldChange('electrical', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Plumbing */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Plumbing & Sanitary
              </label>
              <input
                type="text"
                placeholder="e.g. CPVC pipes (Astral), Kohler fittings"
                value={formData.plumbing}
                onChange={(e) => handleFieldChange('plumbing', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Fire and Safety */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Fire & Life Safety
              </label>
              <input
                type="text"
                placeholder="e.g. Hydrant system, smoke detectors"
                value={formData.fireAndSafety}
                onChange={(e) => handleFieldChange('fireAndSafety', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Safety and Security */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Safety & Security Systems
              </label>
              <input
                type="text"
                placeholder="e.g. 24/7 CCTV surveillance, boom barriers"
                value={formData.safetyAndSecurity}
                onChange={(e) => handleFieldChange('safetyAndSecurity', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* DG Backup */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                DG Power Backup
              </label>
              <input
                type="text"
                placeholder="e.g. 100% backup for common areas, 1.5 KVA per unit"
                value={formData.dgBackup}
                onChange={(e) => handleFieldChange('dgBackup', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Construction Type */}
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Construction Type
              </label>
              <div className="flex items-center gap-2.5 w-full">
                <Combobox
                  value={formData.selectedConstructionType}
                  onChange={(val) => handleFieldChange('selectedConstructionType', val)}
                  onAddItem={handleAddConstructionTypeFromCombobox}
                  options={constructionTypes
                    .filter((c) => c.status === 'ACTIVE')
                    .map((c) => c.option)}
                  placeholder="Select or type Construction Type..."
                  size="md"
                  roundedClass="rounded-[4px]"
                  className="flex-1 min-w-[180px]"
                  inputClassName="w-full h-9 px-3 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Add Type</span>
                </button>
              </div>
            </div>

            {/* Door Height */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Door Height Specs
              </label>
              <input
                type="text"
                placeholder="e.g. 8 ft Main Door, 7 ft Internal"
                value={formData.doorHeight}
                onChange={(e) => handleFieldChange('doorHeight', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>
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

      <AddConstructionTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveConstructionType}
      />
    </div>
  );
}

export default SpecificationsDesktop;
