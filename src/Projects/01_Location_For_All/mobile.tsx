import { useState } from 'react';
import { ChevronDown, MapPin, ExternalLink, Lock } from 'lucide-react';
import { INITIAL_LOCATION_DATA, INITIAL_ORR_ZONING_OPTIONS, type LocationFormData, type OrrExit, type HighwayItem, type OrrZoningOption } from './data';
import { OrrZoningDialog } from './desktop';

export function LocationForAllMobile() {
  const [formData, setFormData] = useState<LocationFormData>(INITIAL_LOCATION_DATA);
  const [zoningOptions, setZoningOptions] = useState<OrrZoningOption[]>(INITIAL_ORR_ZONING_OPTIONS);
  const [isOrrDialogOpen, setIsOrrDialogOpen] = useState(false);

  const handleInputChange = (field: keyof LocationFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  return (
    <div className="w-full ys-panel p-4 sm:p-5 space-y-5 text-slate-800 dark:text-slate-100 text-xs">
      <div className="pb-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Location - For All
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 uppercase">
          01 / 10
        </span>
      </div>

      <div className="space-y-4">
        
        <section className="ys-subcard p-3.5 space-y-3">
          <h3 className="ys-section-title font-bold text-xs text-slate-900 dark:text-white">Seller & Subscription</h3>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">Seller</label>
            <div className="relative">
              <select
                value={formData.seller}
                onChange={(e) => handleInputChange('seller', e.target.value)}
                className="w-full appearance-none px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 pr-7"
              >
                <option value="prasadsa@gmail.com">prasadsa@gmail.com</option>
                <option value="admin@gmail.com">admin@gmail.com</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">Active Sale Subscription</label>
            <div className="relative">
              <select
                value={formData.activeSaleSubscription}
                onChange={(e) => handleInputChange('activeSaleSubscription', e.target.value)}
                className="w-full appearance-none px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 pr-7"
              >
                <option value="">Select subscription</option>
                <option value="standard">Standard Sale Subscription</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>
            <p className="text-[9px] text-slate-600 dark:text-slate-400 mt-0.5">No active Sale subscription available.</p>
          </div>
        </section>

        
        <section className="border border-slate-200/70 rounded-lg p-3 bg-slate-50/40 space-y-2.5">
          <h3 className="font-semibold text-slate-700 text-xs">Location Hierarchy</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">State</label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">City</label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
              >
                <option value="">Select city</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Micro Market</label>
              <select
                value={formData.microMarket}
                onChange={(e) => handleInputChange('microMarket', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
              >
                <option value="">Select Micro Market</option>
                <option value="Financial District">Financial District</option>
              </select>
            </div>
          </div>
        </section>

        
        <section className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">Development Type</label>
            <select
              value={formData.developmentType}
              onChange={(e) => handleInputChange('developmentType', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            >
              <option value="Flats">Flats</option>
              <option value="Villas">Villas</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">Project Name</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">Project Logo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 border border-slate-300 rounded-md p-1 bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">Search Builder Name</label>
            <select
              value={formData.builderName}
              onChange={(e) => handleInputChange('builderName', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            >
              <option value="BUILDER SM 007">BUILDER SM 007</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-slate-700 text-white"
            >
              <Lock className="w-3 h-3" />
              <span>Options locked</span>
            </button>
          </div>
        </section>

        
        <section className="border border-slate-200/70 rounded-lg p-3 bg-slate-50/40 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white border border-slate-300 rounded-md text-[11px] font-semibold text-slate-700"
            >
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Google Maps</span>
            </button>
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white border border-slate-300 rounded-md text-[11px] font-semibold text-slate-700"
            >
              <ExternalLink className="w-3 h-3 text-slate-500" />
              <span>Draw Polygon</span>
            </button>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Location</label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => handleInputChange('locationName', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            />
          </div>
        </section>

        
        <section className="space-y-2">
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">ORR Zoning</label>
            <div className="relative">
              <select
                value={formData.selectedOrrZoning}
                onChange={(e) => handleInputChange('selectedOrrZoning', e.target.value)}
                className="w-full appearance-none px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 pr-7"
              >
                <option value="">Select ORR Zoning</option>
                {zoningOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option} ({opt.status})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrrDialogOpen(true)}
            className="w-full py-1.5 rounded-md text-xs font-semibold text-white bg-[#1956db] hover:bg-[#1447b8] transition-colors"
          >
            + Add ORR Zoning
          </button>
        </section>

        
        <section className="space-y-2">
          <h3 className="font-semibold text-slate-700 text-xs">Nearest ORR Exits</h3>
          {formData.orrExits.map((exit) => (
            <div key={exit.id} className="p-2 border border-slate-200 rounded-lg space-y-1.5 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={exit.exitNumber}
                  onChange={(e) => handleUpdateOrrExit(exit.id, 'exitNumber', e.target.value)}
                  placeholder="Exit No"
                  className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                />
                <input
                  type="text"
                  value={exit.location}
                  onChange={(e) => handleUpdateOrrExit(exit.id, 'location', e.target.value)}
                  placeholder="Location / Name"
                  className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={exit.lat}
                  onChange={(e) => handleUpdateOrrExit(exit.id, 'lat', e.target.value)}
                  placeholder="Lat"
                  className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                />
                <input
                  type="text"
                  value={exit.lng}
                  onChange={(e) => handleUpdateOrrExit(exit.id, 'lng', e.target.value)}
                  placeholder="Lng"
                  className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOrrExit(exit.id)}
                  className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOrrExit}
            className="w-full py-1.5 rounded-md border border-blue-400 text-blue-600 text-xs font-semibold"
          >
            + Add ORR Exit
          </button>
        </section>

        
        <section className="space-y-2">
          <h3 className="font-semibold text-slate-700 text-xs">Nearest Highways/NHs</h3>
          {formData.highways.map((hw) => (
            <div key={hw.id} className="p-2 border border-slate-200 rounded-lg space-y-1.5 bg-white">
              <input
                type="text"
                value={hw.name}
                onChange={(e) => handleUpdateHighway(hw.id, 'name', e.target.value)}
                placeholder="Highway Name"
                className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
              />
              <input
                type="text"
                value={hw.details}
                onChange={(e) => handleUpdateHighway(hw.id, 'details', e.target.value)}
                placeholder="Details"
                className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hw.lat}
                  onChange={(e) => handleUpdateHighway(hw.id, 'lat', e.target.value)}
                  placeholder="Lat"
                  className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                />
                <input
                  type="text"
                  value={hw.lng}
                  onChange={(e) => handleUpdateHighway(hw.id, 'lng', e.target.value)}
                  placeholder="Lng"
                  className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHighway(hw.id)}
                  className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddHighway}
            className="w-full py-1.5 rounded-md border border-blue-400 text-blue-600 text-xs font-semibold"
          >
            + Add Highway
          </button>
        </section>

        
        <section>
          <label className="block text-[10px] font-medium text-slate-600 mb-1">Project USP</label>
          <textarea
            rows={4}
            value={formData.projectUsp}
            onChange={(e) => handleInputChange('projectUsp', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 font-mono"
          />
        </section>

        
        <section>
          <label className="block text-[10px] font-medium text-slate-600 mb-1">
            Status <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as 'Active' | 'Inactive')}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </section>
      </div>

      
      <OrrZoningDialog
        isOpen={isOrrDialogOpen}
        onClose={() => setIsOrrDialogOpen(false)}
        onSave={handleSaveOrrZoning}
      />
    </div>
  );
}

export default LocationForAllMobile;
