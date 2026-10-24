import { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { AMENITY_CATEGORIES, INITIAL_AMENITIES_DATA, type AmenitiesFormData } from './data';

const ACCENT_COLORS = [
  'bg-blue-600 dark:bg-blue-500',
  'bg-indigo-600 dark:bg-indigo-500',
  'bg-emerald-600 dark:bg-emerald-500',
  'bg-amber-600 dark:bg-amber-500',
  'bg-purple-600 dark:bg-purple-500',
  'bg-rose-600 dark:bg-rose-500',
  'bg-teal-600 dark:bg-teal-500',
  'bg-sky-600 dark:bg-sky-500',
  'bg-violet-600 dark:bg-violet-500',
  'bg-cyan-600 dark:bg-cyan-500',
];

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

  const totalSelected = formData.selectedAmenities.length;

  return (
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Amenities saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center text-white shadow-xs shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Amenities
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Clubhouse, sports facilities, landscape parks, eco-friendly features, and leisure amenities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Total Selected:
          </span>
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-[3px] text-xs font-bold font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
            {totalSelected}
          </span>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        {AMENITY_CATEGORIES.map((category, idx) => {
          const accentColor = ACCENT_COLORS[idx % ACCENT_COLORS.length];
          const categorySelectedCount = category.items.filter((item) =>
            formData.selectedAmenities.includes(item.id)
          ).length;

          return (
            <section
              key={category.id}
              className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={`w-1 h-3.5 rounded-full ${accentColor}`} />
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                    {category.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {categorySelectedCount} / {category.items.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {category.items.map((item) => {
                  const isChecked = formData.selectedAmenities.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-[4px] border transition-all cursor-pointer select-none text-xs ${
                        isChecked
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-medium shadow-2xs'
                          : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-50/80 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAmenity(item.id)}
                        className="w-3.5 h-3.5 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="truncate">{item.name}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
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
              onChange={(val) => handleStatusChange(val)}
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
    </div>
  );
}

export default AmenitiesDesktop;
