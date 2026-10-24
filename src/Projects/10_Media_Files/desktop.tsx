import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { INITIAL_MEDIA_FILES_DATA, type MediaFilesFormData } from './data';

export function MediaFilesDesktop() {
  const [formData, setFormData] = useState<MediaFilesFormData>(
    INITIAL_MEDIA_FILES_DATA
  );
  const [savedNotification, setSavedNotification] = useState(false);

  const handleFieldChange = <K extends keyof MediaFilesFormData>(
    field: K,
    value: MediaFilesFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <span>Media & Files saved successfully!</span>
        </div>
      )}

      <div className="pb-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Media & Files
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 uppercase tracking-wider">
          Step 10 / 10
        </span>
      </div>

      
      <section className="border border-slate-200 rounded-xl p-5 space-y-3.5 bg-white shadow-2xs">
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Engagement Options
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
            Choose which engagement features are enabled for this project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          <div className="border border-slate-200 rounded-xl p-3.5 flex items-center gap-3.5 bg-slate-50/50">
            <button
              type="button"
              onClick={() =>
                handleFieldChange('questionsEnabled', !formData.questionsEnabled)
              }
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                formData.questionsEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  formData.questionsEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Questions
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block">
                {formData.questionsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          
          <div className="border border-slate-200 rounded-xl p-3.5 flex items-center gap-3.5 bg-slate-50/50">
            <button
              type="button"
              onClick={() =>
                handleFieldChange(
                  'gamificationEnabled',
                  !formData.gamificationEnabled
                )
              }
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                formData.gamificationEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  formData.gamificationEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Gamification
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block">
                {formData.gamificationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          
          <div className="border border-slate-200 rounded-xl p-3.5 flex items-center gap-3.5 bg-slate-50/50">
            <button
              type="button"
              onClick={() =>
                handleFieldChange(
                  'compatibilityEnabled',
                  !formData.compatibilityEnabled
                )
              }
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                formData.compatibilityEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  formData.compatibilityEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Compatibility
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block">
                {formData.compatibilityEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </section>

      
      <section className="space-y-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Elevations Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Amenities Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Work Progress Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Broucher Upload
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
            />
          </div>
        </div>
      </section>

      
      <section className="space-y-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Drone Video
            </label>
            <input
              type="text"
              value={formData.droneVideo}
              onChange={(e) => handleFieldChange('droneVideo', e.target.value)}
              placeholder="https://youtu.be/dummy-drone-tour"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              3D Video
            </label>
            <input
              type="text"
              value={formData.video3D}
              onChange={(e) => handleFieldChange('video3D', e.target.value)}
              placeholder="https://youtu.be/dummy-3d-tour"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Site Progress
            </label>
            <input
              type="text"
              value={formData.siteProgress}
              onChange={(e) => handleFieldChange('siteProgress', e.target.value)}
              placeholder="https://drive.google.com/dummy-site-progress"
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
    </div>
  );
}

export default MediaFilesDesktop;
