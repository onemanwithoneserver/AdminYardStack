import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { AMENITY_CATEGORIES, INITIAL_AMENITIES_DATA, type AmenitiesFormData } from './data';

export function AmenitiesDesktop() {
  const [formData, setFormData] = useState<AmenitiesFormData>(INITIAL_AMENITIES_DATA);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleToggleAmenity = (id: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedAmenities.includes(id);
      return {
        ...prev,
        selectedAmenities: isSelected
          ? prev.selectedAmenities.filter((item) => item !== id)
          : [...prev.selectedAmenities, id],
      };
    });
  };

  const handleStatusChange = (status: 'Active' | 'Inactive') => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="w-full ys-panel p-6 md:p-8 space-y-7 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 ys-toast px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Amenities saved successfully!</span>
        </div>
      )}

      <div className="pb-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Amenities
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 uppercase tracking-wider">
          Step 06 / 10
        </span>
      </div>

      
      <div className="space-y-6">
        {AMENITY_CATEGORIES.map((category) => (
          <section key={category.id} className="space-y-2.5">
            <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                {category.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2.5 gap-x-4 pt-1">
              {category.items.map((item) => {
                const isChecked = formData.selectedAmenities.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-slate-900 select-none py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleAmenity(item.id)}
                      className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="truncate">{item.name}</span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      
      <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xs w-full">
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Status <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as 'Active' | 'Inactive')
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
    </div>
  );
}

export default AmenitiesDesktop;
