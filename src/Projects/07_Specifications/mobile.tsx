import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { Combobox } from '../../components/elements/Combobox';
import { INITIAL_SPECIFICATIONS_DATA, INITIAL_CONSTRUCTION_TYPES, ALLOWED_TYPES, type SpecificationsFormData, type ConstructionTypeOption, type SpecItem } from './data';
import { AddConstructionTypeDialog } from './desktop';

export function SpecificationsMobile() {
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

  const renderMobileSpecList = (
    items: SpecItem[],
    group: 'structureItems' | 'flooringItems'
  ) => (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`border rounded-[4px] p-3 space-y-2.5 transition-all ${
            item.enabled
              ? 'bg-white dark:bg-slate-900 border-blue-200/90 dark:border-blue-900/40 shadow-xs'
              : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-white/5 opacity-80'
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
              className={`text-[9px] font-mono font-semibold px-1 py-0.5 rounded-[2px] ${
                item.enabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
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
                placeholder="e.g. Kajaria / Somany"
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
                placeholder="e.g. 600x600 mm"
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
    <div className="p-1.5 space-y-4 text-slate-800 dark:text-slate-100 text-xs">
      <AnimatePresence>
        {savedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-3 py-2 rounded-[4px] shadow-lg text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Specifications saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-xs shadow-pink-500/20">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Specifications
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Structural engineering, flooring finishes, doors & windows, and fittings
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pb-4">
        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                01
              </span>
              <span className="w-1 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Structural Specifications & Engineering
              </h3>
            </div>
          </div>
          {renderMobileSpecList(formData.structureItems, 'structureItems')}
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                02
              </span>
              <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Flooring & Surface Finishes
              </h3>
            </div>
          </div>
          {renderMobileSpecList(formData.flooringItems, 'flooringItems')}
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                03
              </span>
              <span className="w-1 h-3 rounded-full bg-amber-600 dark:bg-amber-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Utilities, Fittings & MEP Services
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plumbing & Sanitary
              </label>
              <input
                type="text"
                placeholder="e.g. CPVC pipes (Astral)"
                value={formData.plumbing}
                onChange={(e) => handleFieldChange('plumbing', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Safety & Security Systems
              </label>
              <input
                type="text"
                placeholder="e.g. 24/7 CCTV surveillance"
                value={formData.safetyAndSecurity}
                onChange={(e) => handleFieldChange('safetyAndSecurity', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                DG Power Backup
              </label>
              <input
                type="text"
                placeholder="e.g. 100% backup for common areas"
                value={formData.dgBackup}
                onChange={(e) => handleFieldChange('dgBackup', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Construction Type
              </label>
              <Combobox
                value={formData.selectedConstructionType}
                onChange={(val) => handleFieldChange('selectedConstructionType', val)}
                options={constructionTypes
                  .filter((c) => c.status === 'ACTIVE')
                  .map((c) => c.option)}
                placeholder="Select Construction Type..."
                size="md"
                roundedClass="rounded-[4px]"
                className="w-full"
                inputClassName="w-full h-9 px-3 text-xs font-medium"
                allowCustom={false}
              />
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Door Height Specs
              </label>
              <input
                type="text"
                placeholder="e.g. 8 ft Main Door"
                value={formData.doorHeight}
                onChange={(e) => handleFieldChange('doorHeight', e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>
          </div>
        </section>
      </div>

      
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1">
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
              buttonClassName="w-auto h-8 px-2 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
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

export default SpecificationsMobile;
