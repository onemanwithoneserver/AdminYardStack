import { useState, useRef, type ChangeEvent } from 'react';
import { Plus, MapPin, ExternalLink, Lock, Unlock, UploadCloud, Trash2, AlertCircle, ShieldCheck, Building2, Building, Route, FileCheck2, X, Image as ImageIcon } from 'lucide-react';
import { ModernDropdown } from '../../components/ModernDropdown';
import { INITIAL_LOCATION_DATA, INITIAL_ORR_ZONING_OPTIONS, type LocationFormData, type OrrExit, type HighwayItem, type OrrZoningOption } from './data';
import { OrrZoningDialog, AddBuilderDialog, type BuilderData } from './desktop';
import { SearchProjectLocationModal, type MapPoint } from './SearchProjectLocationModal';

export function LocationForAllMobile() {
  const [formData, setFormData] = useState<LocationFormData>(() => ({
    ...INITIAL_LOCATION_DATA,
    seller: INITIAL_LOCATION_DATA.seller || 'prasadsa@gmail.com',
    state: INITIAL_LOCATION_DATA.state || 'Telangana',
    builderName: INITIAL_LOCATION_DATA.builderName || 'BUILDER SM 007',
    developmentType: INITIAL_LOCATION_DATA.developmentType || 'Flats',
    projectEntranceFacing: INITIAL_LOCATION_DATA.projectEntranceFacing || 'East',
    country: INITIAL_LOCATION_DATA.country || 'India',
    selectedOrrZoning: INITIAL_LOCATION_DATA.selectedOrrZoning || 'Residential Commercial Growth Corridor',
    status: INITIAL_LOCATION_DATA.status || 'Active',
  }));

  const [zoningOptions, setZoningOptions] = useState<OrrZoningOption[]>(INITIAL_ORR_ZONING_OPTIONS);
  const [isOrrDialogOpen, setIsOrrDialogOpen] = useState(false);
  const [isBuilderDialogOpen, setIsBuilderDialogOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [builderOptions, setBuilderOptions] = useState<string[]>([
    'BUILDER SM 007',
    'APARNA CONSTRUCTIONS',
    'MY HOME GROUP',
    'PRESTIGE ESTATES',
    'BRIGADE GROUP',
    'LODHA GROUP',
  ]);

  const handleInputChange = (field: keyof LocationFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      setFormData((prev) => ({ ...prev, projectLogo: file.name }));
      const url = URL.createObjectURL(file);
      setLogoPreviewUrl(url);
    }
  };

  const handleRemoveLogo = () => {
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
    }
    setLogoPreviewUrl(null);
    setLogoFileName('');
    setFormData((prev) => ({ ...prev, projectLogo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddOrrExit = () => {
    const newExit: OrrExit = {
      id: String(Date.now()),
      exitNumber: String(formData.orrExits.length + 1).padStart(2, '0'),
      location: '',
      lat: '',
      lng: '',
    };
    setFormData((prev) => ({
      ...prev,
      orrExits: [...prev.orrExits, newExit],
    }));
  };

  const handleRemoveOrrExit = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      orrExits: prev.orrExits.filter((exit) => exit.id !== id),
    }));
  };

  const handleUpdateOrrExit = (id: string, field: keyof OrrExit, val: string) => {
    setFormData((prev) => ({
      ...prev,
      orrExits: prev.orrExits.map((exit) =>
        exit.id === id ? { ...exit, [field]: val } : exit,
      ),
    }));
  };

  const handleAddHighway = () => {
    const newHighway: HighwayItem = {
      id: String(Date.now()),
      name: '',
      details: '',
      lat: '',
      lng: '',
    };
    setFormData((prev) => ({
      ...prev,
      highways: [...prev.highways, newHighway],
    }));
  };

  const handleRemoveHighway = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      highways: prev.highways.filter((hw) => hw.id !== id),
    }));
  };

  const handleUpdateHighway = (id: string, field: keyof HighwayItem, val: string) => {
    setFormData((prev) => ({
      ...prev,
      highways: prev.highways.map((hw) =>
        hw.id === id ? { ...hw, [field]: val } : hw,
      ),
    }));
  };

  const handleSaveOrrZoning = (newZoning: Omit<OrrZoningOption, 'id'>) => {
    const created: OrrZoningOption = {
      id: String(Date.now()),
      ...newZoning,
    };
    setZoningOptions((prev) => [...prev, created]);
    setFormData((prev) => ({ ...prev, selectedOrrZoning: created.option }));
  };

  const handleSaveBuilder = (newBuilder: BuilderData | string) => {
    const builderName = typeof newBuilder === 'string' ? newBuilder : newBuilder.brandName;
    if (!builderOptions.includes(builderName)) {
      setBuilderOptions((prev) => [...prev, builderName]);
    }
    setFormData((prev) => ({ ...prev, builderName }));
  };

  const handleSaveMapLocation = (data: { location: string; lat: string; lng: string; points: MapPoint[] }) => {
    setFormData((prev) => ({
      ...prev,
      googleLocation: data.location,
      latitude: data.lat,
      longitude: data.lng,
    }));
  };

  return (
    <div className="w-full p-3.5  space-y-4 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      
      {/* Header - No sub-paragraph */}
      <div className="pb-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
              Location - For All
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pb-20">
        
        {/* Section 1: Seller & Subscription */}
        <section className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3 hover:border-slate-300 dark:hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <div className="w-5 h-5 rounded-[4px] bg-blue-100/70 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
              Seller & Subscription
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Seller
              </label>
              <ModernDropdown<string>
                value={formData.seller}
                onChange={(val) => handleInputChange('seller', val)}
                options={['prasadsa@gmail.com', 'admin@gmail.com', 'director@yardstack.com']}
                placeholder="Select Seller"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Active Sale Subscription
              </label>
              <ModernDropdown<string>
                value={formData.activeSaleSubscription}
                onChange={(val) => handleInputChange('activeSaleSubscription', val)}
                options={[
                  { value: '', label: 'Select subscription' },
                  { value: 'standard', label: 'Standard Sale Subscription' },
                  { value: 'premium', label: 'Premium Sale Subscription' },
                  { value: 'enterprise', label: 'Enterprise Tier - Pan India' },
                ]}
                placeholder="Select subscription"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
              <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-[4px] bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px]">
                <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                <span>No active Sale subscription available for this seller.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Location Hierarchy */}
        <section className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3 hover:border-slate-300 dark:hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <div className="w-5 h-5 rounded-[4px] bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Building2 className="w-3 h-3" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
              Location Hierarchy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
            {/* State */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                State
              </label>
              <ModernDropdown<string>
                value={formData.state}
                onChange={(val) => handleInputChange('state', val)}
                options={['Telangana', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu']}
                placeholder="Select State"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>

            {/* City */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                City
              </label>
              <ModernDropdown<string>
                value={formData.city}
                onChange={(val) => handleInputChange('city', val)}
                options={['Hyderabad', 'Secunderabad', 'Cyberabad', 'Bengaluru', 'Chennai']}
                placeholder="Select city"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>

            {/* Micro Market */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Micro Market
              </label>
              <ModernDropdown<string>
                value={formData.microMarket}
                onChange={(val) => handleInputChange('microMarket', val)}
                options={['Gachibowli', 'Financial District', 'Hitec City', 'Kokapet', 'Tellapur', 'Madhapur', 'Kondapur']}
                placeholder="Select Micro Market"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>

            {/* Corporations */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Corporations
              </label>
              <ModernDropdown<string>
                value={formData.corporations}
                onChange={(val) => handleInputChange('corporations', val)}
                options={['GHMC', 'HMDA', 'BBMP', 'CMDA']}
                placeholder="Select Corporation"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>

            {/* Zones */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Zones
              </label>
              <ModernDropdown<string>
                value={formData.zones}
                onChange={(val) => handleInputChange('zones', val)}
                options={['West Zone', 'South Zone', 'Central Zone', 'North Zone', 'East Zone']}
                placeholder="Select Zone"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>

            {/* Circles */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Circles
              </label>
              <ModernDropdown<string>
                value={formData.circles}
                onChange={(val) => handleInputChange('circles', val)}
                options={['Serilingampally', 'Rajendranagar', 'Khairatabad', 'Kukatpally']}
                placeholder="Select Circle"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Project Identity & Developer */}
        <section className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3 hover:border-slate-300 dark:hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <div className="w-5 h-5 rounded-[4px] bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Building className="w-3 h-3" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
              Project Identity & Developer
            </h3>
          </div>

          <div className="space-y-3">
            {/* Development Type */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Development Type
              </label>
              <ModernDropdown<string>
                value={formData.developmentType}
                onChange={(val) => handleInputChange('developmentType', val)}
                options={['Flats', 'Villas', 'Plots', 'Commercial', 'Gated Community', 'Mixed Use']}
                placeholder="Select Type"
                roundedClass="rounded-[4px]"
                className="w-auto inline-block"
                buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
              />
            </div>

            {/* Project Name */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="e.g. Phoenix One West"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition-colors"
              />
            </div>

            {/* Project Logo */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Project Logo
              </label>

              {logoFileName || formData.projectLogo ? (
                /* Uploaded State: Choose control disappears, file name with extension and X icon shown */
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {logoPreviewUrl ? (
                      <img
                        src={logoPreviewUrl}
                        alt="Project Logo"
                        className="w-5 h-5 rounded-[2px] object-cover shrink-0 border border-slate-200/80 dark:border-white/10"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                    <span
                      className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate"
                      title={logoFileName || formData.projectLogo || ''}
                    >
                      {logoFileName || formData.projectLogo}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1 rounded-[2px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Empty State: Choose control is visible */
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="mobile-logo-input"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="mobile-logo-input"
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Choose</span>
                  </label>
                  <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    No file chosen
                  </div>
                </div>
              )}

              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-tight">
                Recommended: 512 x 512 px (min 256 x 256), max size 2 MB.
              </span>
            </div>

            {/* Search Builder Name */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Search Builder Name
              </label>
              <div className="flex items-center gap-2 flex-wrap w-full">
                <ModernDropdown<string>
                  value={formData.builderName}
                  onChange={(val) => handleInputChange('builderName', val)}
                  options={builderOptions}
                  placeholder="Select Builder"
                  roundedClass="rounded-[4px]"
                  className="w-auto inline-block"
                  buttonClassName="w-auto h-9 px-2.5 text-xs font-medium gap-1.5 max-w-full"
                />
                <button
                  type="button"
                  onClick={() => setIsBuilderDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Add Builder</span>
                </button>
              </div>
            </div>

            {/* Options Lock */}
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('optionsLocked', !formData.optionsLocked)}
                className={`inline-flex items-center gap-1.5 px-3 h-8.5 rounded-[4px] text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                  formData.optionsLocked
                    ? 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {formData.optionsLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Options locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Options unlocked</span>
                  </>
                )}
              </button>
              <span className="text-[10.5px] text-slate-400">
                {formData.optionsLocked ? 'Options locked' : 'Click to lock builder'}
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: GIS Boundaries & Map Coordinates */}
        <section className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3 hover:border-slate-300 dark:hover:border-white/15 transition-all">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-[4px] bg-sky-100/70 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
                GIS Boundaries & Map Coordinates
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 text-[10.5px] font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Maps</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3 h-3 text-white" />
                <span>Draw</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
            {/* Country */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="India"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* District */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="e.g. Ranga Reddy"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Location
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => handleInputChange('locationName', e.target.value)}
                placeholder="e.g. Kokapet, Gandipet"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Pincode */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="e.g. 500075"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* ORR Zoning */}
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                ORR Zoning
              </label>
              <div className="flex items-center gap-2 flex-wrap w-full">
                <ModernDropdown<string>
                  value={formData.selectedOrrZoning}
                  onChange={(val) => handleInputChange('selectedOrrZoning', val)}
                  options={zoningOptions.map((opt) => ({
                    value: opt.option,
                    label: `${opt.option} (${opt.status})`,
                  }))}
                  placeholder="Select ORR Zoning"
                  roundedClass="rounded-[4px]"
                  className="w-auto inline-block max-w-full"
                  buttonClassName="w-auto min-h-[36px] h-auto px-2.5 py-1.5 text-xs font-medium gap-1.5 max-w-full"
                  menuClassName="w-max max-w-xs"
                />
                <button
                  type="button"
                  onClick={() => setIsOrrDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Add Zoning</span>
                </button>
              </div>
            </div>

            {/* Google Location */}
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Google Location
              </label>
              <input
                type="text"
                value={formData.googleLocation}
                onChange={(e) => handleInputChange('googleLocation', e.target.value)}
                placeholder="e.g. Near Exit 01 Financial District"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Paired Latitude & Longitude */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-2.5 w-full">
              <div className="flex flex-col items-start w-full">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                  Latitude
                </label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="17.4125"
                  className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
              </div>

              <div className="flex flex-col items-start w-full">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                  Longitude
                </label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="78.3412"
                  className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Transit & Connectivity */}
        <section className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3.5 hover:border-slate-300 dark:hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <div className="w-5 h-5 rounded-[4px] bg-purple-100/70 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Route className="w-3 h-3" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
              Transit & Connectivity
            </h3>
          </div>

          {/* Sub-panel: Nearest ORR Exits */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Nearest ORR Exits
                </span>
                <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {formData.orrExits.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddOrrExit}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Add Exit</span>
              </button>
            </div>

            {formData.orrExits.length === 0 ? (
              <div className="p-3 rounded-[4px] border border-dashed border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-950/50 text-center text-slate-400 text-xs">
                No ORR Exits added. Click &quot;Add Exit&quot; to configure.
              </div>
            ) : (
              <div className="space-y-2">
                {formData.orrExits.map((exit, idx) => (
                  <div
                    key={exit.id}
                    className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 w-5 shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={exit.exitNumber}
                        onChange={(e) => handleUpdateOrrExit(exit.id, 'exitNumber', e.target.value)}
                        placeholder="Exit No"
                        className="w-20 h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                      <input
                        type="text"
                        value={exit.location}
                        onChange={(e) => handleUpdateOrrExit(exit.id, 'location', e.target.value)}
                        placeholder="Exit Location / Name"
                        className="flex-1 h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOrrExit(exit.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[2px] transition-colors shrink-0 cursor-pointer"
                        title="Remove exit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-7">
                      <input
                        type="text"
                        value={exit.lat}
                        onChange={(e) => handleUpdateOrrExit(exit.id, 'lat', e.target.value)}
                        placeholder="Latitude"
                        className="w-full h-7.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                      <input
                        type="text"
                        value={exit.lng}
                        onChange={(e) => handleUpdateOrrExit(exit.id, 'lng', e.target.value)}
                        placeholder="Longitude"
                        className="w-full h-7.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-panel: Nearest Highways */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Nearest Highways
                </span>
                <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  {formData.highways.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddHighway}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Add Highway</span>
              </button>
            </div>

            {formData.highways.length === 0 ? (
              <div className="p-3 rounded-[4px] border border-dashed border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-950/50 text-center text-slate-400 text-xs">
                No National Highways configured. Click &quot;Add Highway&quot; to configure.
              </div>
            ) : (
              <div className="space-y-2">
                {formData.highways.map((hw, idx) => (
                  <div
                    key={hw.id}
                    className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 w-5 shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={hw.name}
                        onChange={(e) => handleUpdateHighway(hw.id, 'name', e.target.value)}
                        placeholder="Highway Name"
                        className="w-24 h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                      <input
                        type="text"
                        value={hw.details}
                        onChange={(e) => handleUpdateHighway(hw.id, 'details', e.target.value)}
                        placeholder="Details"
                        className="flex-1 h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighway(hw.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[2px] transition-colors shrink-0 cursor-pointer"
                        title="Remove highway"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-7">
                      <input
                        type="text"
                        value={hw.lat}
                        onChange={(e) => handleUpdateHighway(hw.id, 'lat', e.target.value)}
                        placeholder="Latitude (optional)"
                        className="w-full h-7.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                      <input
                        type="text"
                        value={hw.lng}
                        onChange={(e) => handleUpdateHighway(hw.id, 'lng', e.target.value)}
                        placeholder="Longitude (optional)"
                        className="w-full h-7.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 6: Regulatory Details & USP */}
        <section className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 sm:p-4 space-y-3 hover:border-slate-300 dark:hover:border-white/15 transition-all">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-white/5">
            <div className="w-5 h-5 rounded-[4px] bg-amber-100/70 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-3 h-3" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
              Regulatory Details & USP
            </h3>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              {/* Sub Registrar Office */}
              <div className="flex flex-col items-start w-full">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                  Sub Registrar Office
                </label>
                <ModernDropdown<string>
                  value={formData.subRegistrarOffice}
                  onChange={(val) => handleInputChange('subRegistrarOffice', val)}
                  options={['Gandipet SRO', 'Serilingampally SRO', 'Rajendranagar SRO', 'Vallabhnagar SRO']}
                  placeholder="Select SRO"
                  roundedClass="rounded-[4px]"
                  className="w-auto inline-block"
                  buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
                />
              </div>

              {/* Project Entrance Facing */}
              <div className="flex flex-col items-start w-full">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                  Project Entrance Facing
                </label>
                <ModernDropdown<string>
                  value={formData.projectEntranceFacing}
                  onChange={(val) => handleInputChange('projectEntranceFacing', val)}
                  options={['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']}
                  placeholder="Select Facing"
                  roundedClass="rounded-[4px]"
                  className="w-auto inline-block"
                  buttonClassName="w-auto h-9 px-2 text-xs font-medium gap-1.5 max-w-full"
                />
              </div>
            </div>

            {/* Project USP */}
            <div className="w-full pt-1">
              <div className="flex items-center justify-between mb-1.5 h-4">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Project USP (Unique Selling Proposition)
                </label>
                <span className="text-[10px] text-slate-400">
                  {formData.projectUsp.length} characters
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.projectUsp}
                onChange={(e) => handleInputChange('projectUsp', e.target.value)}
                placeholder="Highlight key value differentiators, landmark proximity, architectural USPs..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-normal text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs leading-relaxed"
              />
            </div>
          </div>
        </section>

      </div>

      {/* Floating Status Card - Fixed at the bottom-right of the screen */}
      <div
        className="fixed bottom-4 right-4 z-[90] rounded-[4px] p-2.5 sm:p-3 transition-all duration-300 border backdrop-blur-xl w-fit shadow-lg hover:shadow-xl bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10"
      >
        <div className="flex flex-col items-start gap-1.5">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 h-4">
            <span>Status</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <ModernDropdown<'Active' | 'Inactive'>
            value={formData.status}
            onChange={(val) => handleInputChange('status', val)}
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

      <OrrZoningDialog
        isOpen={isOrrDialogOpen}
        onClose={() => setIsOrrDialogOpen(false)}
        onSave={handleSaveOrrZoning}
      />

      <AddBuilderDialog
        isOpen={isBuilderDialogOpen}
        onClose={() => setIsBuilderDialogOpen(false)}
        onSave={handleSaveBuilder}
      />

      <SearchProjectLocationModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSave={handleSaveMapLocation}
        initialLocation={formData.googleLocation}
        initialLat={formData.latitude}
        initialLng={formData.longitude}
      />
    </div>
  );
}

export default LocationForAllMobile;
