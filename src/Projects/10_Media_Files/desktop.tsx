import { useState, useRef, type ChangeEvent } from 'react';
import { Film, UploadCloud, X, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { INITIAL_MEDIA_FILES_DATA, type MediaFilesFormData } from './data';

export function MediaFilesDesktop() {
  const [formData, setFormData] = useState<MediaFilesFormData>(
    INITIAL_MEDIA_FILES_DATA
  );
  const [savedNotification, setSavedNotification] = useState(false);

  const [elevationsNames, setElevationsNames] = useState<string[]>([]);
  const [amenitiesNames, setAmenitiesNames] = useState<string[]>([]);
  const [workProgressNames, setWorkProgressNames] = useState<string[]>([]);
  const [brochureName, setBrochureName] = useState<string>('');

  const elevationsInputRef = useRef<HTMLInputElement>(null);
  const amenitiesInputRef = useRef<HTMLInputElement>(null);
  const workProgressInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = <K extends keyof MediaFilesFormData>(
    field: K,
    value: MediaFilesFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleElevationsUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((f) => f.name);
      setElevationsNames(names);
      handleFieldChange('elevationsFiles', names.join(', '));
    }
  };

  const handleAmenitiesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((f) => f.name);
      setAmenitiesNames(names);
      handleFieldChange('amenitiesFiles', names.join(', '));
    }
  };

  const handleWorkProgressUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((f) => f.name);
      setWorkProgressNames(names);
      handleFieldChange('workProgressFiles', names.join(', '));
    }
  };

  const handleBrochureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrochureName(file.name);
      handleFieldChange('brochureFile', file.name);
    }
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Media & Files saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-xs shadow-teal-500/20">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Media & Files
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Project brochures, 3D architectural renders, walkthrough videos, floor plans and gallery assets
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        {/* Section 1: Engagement Options */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Engagement & Interactive Modules
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Questions Module */}
            <div className="border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  Questions & FAQ Module
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Allow buyer inquiry prompts & FAQs
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleFieldChange('questionsEnabled', !formData.questionsEnabled)
                }
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  formData.questionsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    formData.questionsEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Gamification */}
            <div className="border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  Gamification Engine
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Interactive quizzes & score badges
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
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  formData.gamificationEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    formData.gamificationEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Compatibility */}
            <div className="border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  Compatibility Matching
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Buyer preferences & lifestyle match
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
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  formData.compatibilityEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
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

        {/* Section 2: Visual Assets & Project Brochure */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Visual Assets & Marketing Brochure
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Elevations Images */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Elevations Gallery
              </label>
              {elevationsNames.length > 0 ? (
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    {elevationsNames.length} image{elevationsNames.length > 1 ? 's' : ''} chosen
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setElevationsNames([]);
                      handleFieldChange('elevationsFiles', null);
                      if (elevationsInputRef.current) elevationsInputRef.current.value = '';
                    }}
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Remove elevations"
                    aria-label="Remove elevations"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={elevationsInputRef}
                    type="file"
                    id="elevations-input"
                    multiple
                    accept="image/*"
                    onChange={handleElevationsUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="elevations-input"
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Choose</span>
                  </label>
                  <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 truncate">
                    No files chosen
                  </div>
                </div>
              )}
            </div>

            {/* Amenities Images */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Amenities Gallery
              </label>
              {amenitiesNames.length > 0 ? (
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    {amenitiesNames.length} image{amenitiesNames.length > 1 ? 's' : ''} chosen
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAmenitiesNames([]);
                      handleFieldChange('amenitiesFiles', null);
                      if (amenitiesInputRef.current) amenitiesInputRef.current.value = '';
                    }}
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Remove amenities images"
                    aria-label="Remove amenities images"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={amenitiesInputRef}
                    type="file"
                    id="amenities-input"
                    multiple
                    accept="image/*"
                    onChange={handleAmenitiesUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="amenities-input"
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Choose</span>
                  </label>
                  <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 truncate">
                    No files chosen
                  </div>
                </div>
              )}
            </div>

            {/* Work Progress Images */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Construction Progress
              </label>
              {workProgressNames.length > 0 ? (
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    {workProgressNames.length} image{workProgressNames.length > 1 ? 's' : ''} chosen
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkProgressNames([]);
                      handleFieldChange('workProgressFiles', null);
                      if (workProgressInputRef.current) workProgressInputRef.current.value = '';
                    }}
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Remove work progress images"
                    aria-label="Remove work progress images"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={workProgressInputRef}
                    type="file"
                    id="work-progress-input"
                    multiple
                    accept="image/*"
                    onChange={handleWorkProgressUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="work-progress-input"
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Choose</span>
                  </label>
                  <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 truncate">
                    No files chosen
                  </div>
                </div>
              )}
            </div>

            {/* Brochure Upload */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Project Brochure (PDF)
              </label>
              {brochureName || formData.brochureFile ? (
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    {brochureName || formData.brochureFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBrochureName('');
                      handleFieldChange('brochureFile', null);
                      if (brochureInputRef.current) brochureInputRef.current.value = '';
                    }}
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Remove brochure"
                    aria-label="Remove brochure"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={brochureInputRef}
                    type="file"
                    id="brochure-input"
                    accept=".pdf,.doc,.docx"
                    onChange={handleBrochureUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="brochure-input"
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Choose</span>
                  </label>
                  <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 truncate">
                    No file chosen
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Virtual Tours & Videos */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                03
              </span>
              <span className="w-1 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Virtual Tours & Video Walkthroughs
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-start">
            {/* Drone Video */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Aerial Drone Walkthrough URL
              </label>
              <input
                type="text"
                value={formData.droneVideo}
                onChange={(e) => handleFieldChange('droneVideo', e.target.value)}
                placeholder="https://youtu.be/dummy-drone-tour"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* 3D Video */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                3D Interactive Tour URL
              </label>
              <input
                type="text"
                value={formData.video3D}
                onChange={(e) => handleFieldChange('video3D', e.target.value)}
                placeholder="https://youtu.be/dummy-3d-tour"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Site Progress */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Site Progress Cloud Link
              </label>
              <input
                type="text"
                value={formData.siteProgress}
                onChange={(e) => handleFieldChange('siteProgress', e.target.value)}
                placeholder="https://drive.google.com/dummy-site-progress"
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
              onChange={(val) =>
                handleFieldChange(
                  'status',
                  val
                )
              }
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

export default MediaFilesDesktop;
