import { useState, type FormEvent } from 'react';
import {
  Plus,
  ChevronDown,
  MapPin,
  ExternalLink,
  Lock,
  X,
} from 'lucide-react';
import {
  INITIAL_LOCATION_DATA,
  INITIAL_ORR_ZONING_OPTIONS,
  type LocationFormData,
  type OrrExit,
  type HighwayItem,
  type OrrZoningOption,
} from './data';

interface OrrZoningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newZoning: Omit<OrrZoningOption, 'id'>) => void;
}

export function OrrZoningDialog({ isOpen, onClose, onSave }: OrrZoningDialogProps) {
  const [option, setOption] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!option.trim()) return;
    onSave({ option: option.trim(), status });
    setOption('');
    setStatus('ACTIVE');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-2 flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add ORR Zoning</h3>
            <p className="text-xs text-slate-500 mt-0.5">Type is fixed to orrZoning.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-3 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Option</label>
            <input
              type="text"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              placeholder="Enter option"
              required
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                className="w-full appearance-none px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 cursor-pointer pr-8"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1956db] hover:bg-[#1447b8] transition-colors shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LocationForAllDesktop() {
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
    <div className="w-full bg-white rounded-xl border border-blue-200/80 shadow-xs p-6 text-slate-800 text-xs">
      <div className="mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1956db] tracking-wide">
          Location-For all
        </h2>
      </div>

      <div className="space-y-6">
        <section className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/40 space-y-3">
          <h3 className="font-semibold text-slate-700 text-xs">
            Seller & Subscription Entitlement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Seller
              </label>
              <div className="relative">
                <select
                  value={formData.seller}
                  onChange={(e) => handleInputChange('seller', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="prasadsa@gmail.com">prasadsa@gmail.com</option>
                  <option value="admin@gmail.com">admin@gmail.com</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Active Sale Subscription
              </label>
              <div className="relative">
                <select
                  value={formData.activeSaleSubscription}
                  onChange={(e) => handleInputChange('activeSaleSubscription', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">Select subscription</option>
                  <option value="standard">Standard Sale Subscription</option>
                  <option value="premium">Premium Sale Subscription</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                No active Sale subscription is available for this seller.
              </p>
            </div>
          </div>
        </section>

        <section className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/40 space-y-3">
          <h3 className="font-semibold text-slate-700 text-xs">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">State</label>
              <div className="relative">
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">City</label>
              <div className="relative">
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">Select city</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Secunderabad">Secunderabad</option>
                  <option value="Cyberabad">Cyberabad</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Micro Market</label>
              <div className="relative">
                <select
                  value={formData.microMarket}
                  onChange={(e) => handleInputChange('microMarket', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">Select Micro Market</option>
                  <option value="Gachibowli">Gachibowli</option>
                  <option value="Financial District">Financial District</option>
                  <option value="Hitec City">Hitec City</option>
                  <option value="Kokapet">Kokapet</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Corporations</label>
              <div className="relative">
                <select
                  value={formData.corporations}
                  onChange={(e) => handleInputChange('corporations', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">Select Corporation</option>
                  <option value="GHMC">GHMC</option>
                  <option value="HMDA">HMDA</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Zones</label>
              <div className="relative">
                <select
                  value={formData.zones}
                  onChange={(e) => handleInputChange('zones', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">Select Zone</option>
                  <option value="West Zone">West Zone</option>
                  <option value="South Zone">South Zone</option>
                  <option value="Central Zone">Central Zone</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Circles</label>
              <div className="relative">
                <select
                  value={formData.circles}
                  onChange={(e) => handleInputChange('circles', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">Select Circle</option>
                  <option value="Serilingampally">Serilingampally</option>
                  <option value="Rajendranagar">Rajendranagar</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Development Type
              </label>
              <div className="relative">
                <select
                  value={formData.developmentType}
                  onChange={(e) => handleInputChange('developmentType', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="Flats">Flats</option>
                  <option value="Villas">Villas</option>
                  <option value="Plots">Plots</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Project Name"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Project Logo
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Recommended: 150 x 150 px (min 200 x 200, max size 2 MB)
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Search Builder Name
              </label>
              <div className="relative">
                <select
                  value={formData.builderName}
                  onChange={(e) => handleInputChange('builderName', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="BUILDER SM 007">BUILDER SM 007</option>
                  <option value="APARNA CONSTRUCTIONS">APARNA CONSTRUCTIONS</option>
                  <option value="MY HOME GROUP">MY HOME GROUP</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
              <button
                type="button"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold mt-1.5 inline-block cursor-pointer"
              >
                + Add Builder
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-700 text-white shadow-xs cursor-default"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Options locked</span>
            </button>
          </div>
        </section>

        <section className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/40 space-y-3">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div>
              <span className="block text-[11px] font-medium text-slate-600 mb-1.5">
                Select Location From Maps
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Open Google Maps</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Draw Polygon</span>
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => handleInputChange('locationName', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Polygon KML</span>
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ORR Zoning
              </label>
              <div className="relative">
                <select
                  value={formData.selectedOrrZoning}
                  onChange={(e) => handleInputChange('selectedOrrZoning', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">Select ORR Zoning</option>
                  {zoningOptions.map((opt) => (
                    <option key={opt.id} value={opt.option}>
                      {opt.option} ({opt.status})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Google Location
              </label>
              <input
                type="text"
                value={formData.googleLocation}
                onChange={(e) => handleInputChange('googleLocation', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsOrrDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1956db] hover:bg-[#1447b8] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add ORR Zoning</span>
            </button>
          </div>
        </section>

        <section>
          <div className="max-w-xs">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Pincode
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-slate-700 text-xs">Nearest ORR Exits</h3>
          <div className="space-y-2">
            {formData.orrExits.map((exit) => (
              <div key={exit.id} className="grid grid-cols-1 md:grid-cols-5 gap-2.5 items-center">
                <input
                  type="text"
                  value={exit.exitNumber}
                  onChange={(e) => handleUpdateOrrExit(exit.id, 'exitNumber', e.target.value)}
                  placeholder="Exit No"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  value={exit.location}
                  onChange={(e) => handleUpdateOrrExit(exit.id, 'location', e.target.value)}
                  placeholder="Exit Location / Name"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 md:col-span-2"
                />
                <input
                  type="text"
                  value={exit.lat}
                  onChange={(e) => handleUpdateOrrExit(exit.id, 'lat', e.target.value)}
                  placeholder="Latitude"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={exit.lng}
                    onChange={(e) => handleUpdateOrrExit(exit.id, 'lng', e.target.value)}
                    placeholder="Longitude"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOrrExit(exit.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddOrrExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add ORR Exit</span>
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-slate-700 text-xs">Nearest Highways/NHs</h3>
          <div className="space-y-2">
            {formData.highways.map((hw) => (
              <div key={hw.id} className="grid grid-cols-1 md:grid-cols-5 gap-2.5 items-center">
                <input
                  type="text"
                  value={hw.name}
                  onChange={(e) => handleUpdateHighway(hw.id, 'name', e.target.value)}
                  placeholder="Highway Name"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  value={hw.details}
                  onChange={(e) => handleUpdateHighway(hw.id, 'details', e.target.value)}
                  placeholder="Highway Details"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 md:col-span-2"
                />
                <input
                  type="text"
                  value={hw.lat}
                  onChange={(e) => handleUpdateHighway(hw.id, 'lat', e.target.value)}
                  placeholder="Latitude"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hw.lng}
                    onChange={(e) => handleUpdateHighway(hw.id, 'lng', e.target.value)}
                    placeholder="Longitude"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighway(hw.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddHighway}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Highway</span>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Sub Registrar Office
            </label>
            <div className="relative">
              <select
                value={formData.subRegistrarOffice}
                onChange={(e) => handleInputChange('subRegistrarOffice', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
              >
                <option value="">Select Sub Registrar Office</option>
                <option value="Gandipet SRO">Gandipet SRO</option>
                <option value="Serilingampally SRO">Serilingampally SRO</option>
                <option value="Rajendranagar SRO">Rajendranagar SRO</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Project Entrance Facing
            </label>
            <div className="relative">
              <select
                value={formData.projectEntranceFacing}
                onChange={(e) => handleInputChange('projectEntranceFacing', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
              >
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="North-East">North-East</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>
        </section>

        <section>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Project USP
          </label>
          <textarea
            rows={5}
            value={formData.projectUsp}
            onChange={(e) => handleInputChange('projectUsp', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 leading-relaxed font-mono"
          />
        </section>

        <section className="max-w-xs">
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Status <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'Active' | 'Inactive')}
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>
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

export default LocationForAllDesktop;
