import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { INITIAL_SPECIFICATIONS_DATA, INITIAL_CONSTRUCTION_TYPES, ALLOWED_TYPES, type SpecificationsFormData, type ConstructionTypeOption, type SpecItem } from './data';
import { AddConstructionTypeDialog } from './desktop';

export function SpecificationsMobile() {
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

  const renderMobileSpecList = (
    items: SpecItem[],
    group: 'structureItems' | 'flooringItems'
  ) => (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-2.5 text-xs"
        >
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 pb-1 border-b border-slate-100">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) =>
                handleSpecItemChange(group, item.id, 'enabled', e.target.checked)
              }
              className="w-4 h-4 rounded text-blue-600 border-slate-300"
            />
            <span>{item.name}</span>
          </label>

          <div className="space-y-2">
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
                  className="w-full appearance-none px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 pr-7"
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
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
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
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs resize-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-6 text-slate-800">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Specifications saved successfully!</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Specifications (Mobile)
        </span>
      </div>

      
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Structure
          </h3>
        </div>
        {renderMobileSpecList(formData.structureItems, 'structureItems')}
      </section>

      
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Flooring
          </h3>
        </div>
        {renderMobileSpecList(formData.flooringItems, 'flooringItems')}
      </section>

      
      <section className="space-y-3 pt-3 border-t border-slate-100 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Utility
          </label>
          <input
            type="text"
            value={formData.utility}
            onChange={(e) => handleFieldChange('utility', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs pr-8"
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
            className="mt-2 inline-flex items-center px-3 py-1.5 bg-[#1956db] text-white text-xs font-semibold rounded-lg shadow-xs"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
          />
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
                handleFieldChange(
                  'status',
                  e.target.value as 'Active' | 'Inactive'
                )
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
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

      
      <AddConstructionTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveConstructionType}
      />
    </div>
  );
}

export default SpecificationsMobile;
