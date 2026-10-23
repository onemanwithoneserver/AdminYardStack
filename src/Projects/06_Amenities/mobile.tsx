import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  AMENITY_CATEGORIES,
  INITIAL_AMENITIES_DATA,
  type AmenitiesFormData,
} from './data';

export function AmenitiesMobile() {
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
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-5 text-slate-800">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Amenities saved successfully!</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Amenities (Mobile)
        </span>
      </div>

      
      <div className="space-y-5">
        {AMENITY_CATEGORIES.map((category) => (
          <section key={category.id} className="space-y-2">
            <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                {category.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {category.items.map((item) => {
                const isChecked = formData.selectedAmenities.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-xs text-slate-700 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleAmenity(item.id)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{item.name}</span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      
      <div className="pt-3 border-t border-slate-200/80 space-y-4">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Status <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as 'Active' | 'Inactive')
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
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
          className="w-full py-2.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Save Project
        </button>
      </div>
    </div>
  );
}

export default AmenitiesMobile;
