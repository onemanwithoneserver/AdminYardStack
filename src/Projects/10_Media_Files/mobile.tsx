import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  INITIAL_MEDIA_FILES_DATA,
  type MediaFilesFormData,
} from './data';

export function MediaFilesMobile() {
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
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-6 text-slate-800">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Media & Files saved successfully!</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Media & Files (Mobile)
        </span>
      </div>

      
      <section className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Engagement Options
          </h3>
          <p className="text-[10px] text-slate-400">
            Enable or disable interactive features.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between bg-slate-50/50 text-xs">
            <div>
              <span className="font-semibold text-slate-800 block">Questions</span>
              <span className="text-[10px] text-slate-400">
                {formData.questionsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
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
          </div>

          <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between bg-slate-50/50 text-xs">
            <div>
              <span className="font-semibold text-slate-800 block">Gamification</span>
              <span className="text-[10px] text-slate-400">
                {formData.gamificationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
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
          </div>

          <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between bg-slate-50/50 text-xs">
            <div>
              <span className="font-semibold text-slate-800 block">Compatibility</span>
              <span className="text-[10px] text-slate-400">
                {formData.compatibilityEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
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
          </div>
        </div>
      </section>

      
      <section className="space-y-3 pt-1 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Elevations Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 border border-slate-300 rounded-lg p-1 bg-white"
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
            className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 border border-slate-300 rounded-lg p-1 bg-white"
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
            className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 border border-slate-300 rounded-lg p-1 bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Broucher Upload
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 border border-slate-300 rounded-lg p-1 bg-white"
          />
        </div>
      </section>

      
      <section className="space-y-3 pt-1 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Drone Video
          </label>
          <input
            type="text"
            value={formData.droneVideo}
            onChange={(e) => handleFieldChange('droneVideo', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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

export default MediaFilesMobile;
