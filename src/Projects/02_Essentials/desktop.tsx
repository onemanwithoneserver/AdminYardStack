import { useState, type FormEvent } from 'react';
import { ChevronDown, Lock, X, Plus } from 'lucide-react';
import {
  INITIAL_ESSENTIALS_DATA,
  INITIAL_CONSTRUCTION_TYPES,
  type EssentialsFormData,
  type ConstructionTypeOption,
} from './data';

interface ConstructionTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ConstructionTypeOption, 'id'>) => void;
}

export function ConstructionTypeDialog({
  isOpen,
  onClose,
  onSave,
}: ConstructionTypeDialogProps) {
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
            <h3 className="text-base font-bold text-slate-900">
              Add Construction Type
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Type is fixed to constructionType.
            </p>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Option
            </label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status
            </label>
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

export function EssentialsDesktop() {
  const [formData, setFormData] = useState<EssentialsFormData>(INITIAL_ESSENTIALS_DATA);
  const [constructionTypes, setConstructionTypes] = useState<ConstructionTypeOption[]>(INITIAL_CONSTRUCTION_TYPES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (field: keyof EssentialsFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveConstructionType = (item: Omit<ConstructionTypeOption, 'id'>) => {
    const created: ConstructionTypeOption = {
      id: String(Date.now()),
      ...item,
    };
    setConstructionTypes((prev) => [...prev, created]);
    setFormData((prev) => ({ ...prev, selectedConstructionType: created.option }));
  };

  return (
    <div className="w-full bg-white rounded-xl border border-blue-200/80 shadow-xs p-6 text-slate-800 text-xs select-none">
      <div className="mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1956db] tracking-wide">
          Essentials
        </h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Project Type <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
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
                Project Sub-Type
              </label>
              <div className="relative">
                <select
                  value={formData.projectSubType}
                  onChange={(e) => handleInputChange('projectSubType', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="">-- Select Sub-Type --</option>
                  <option value="Gated Community Flats">Gated Community Flats</option>
                  <option value="High Rise Apartments">High Rise Apartments</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Model Flat/Villa
              </label>
              <div className="relative">
                <select
                  value={formData.modelFlatVilla}
                  onChange={(e) => handleInputChange('modelFlatVilla', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="Yes, with Interior works">Yes, with Interior works</option>
                  <option value="Yes, Bare shell">Yes, Bare shell</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Towers
              </label>
              <div className="relative">
                <select
                  value={formData.towersType}
                  onChange={(e) => handleInputChange('towersType', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="Towers">Towers</option>
                  <option value="Blocks">Blocks</option>
                  <option value="Wings">Wings</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Towers/Blocks
            </label>
            <input
              type="number"
              value={formData.towersBlocksCount}
              onChange={(e) => handleInputChange('towersBlocksCount', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Sky Villas Available
            </label>
            <div className="relative">
              <select
                value={formData.skyVillasAvailable}
                onChange={(e) => handleInputChange('skyVillasAvailable', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Sky Villa Status
            </label>
            <div className="relative">
              <select
                value={formData.skyVillaStatus}
                onChange={(e) => handleInputChange('skyVillaStatus', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
              >
                <option value="">Select</option>
                <option value="Available">Available</option>
                <option value="Sold Out">Sold Out</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Open Space Type
            </label>
            <div className="relative">
              <select
                value={formData.openSpaceType}
                onChange={(e) => handleInputChange('openSpaceType', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
              >
                <option value="%">%</option>
                <option value="Sq. Yds">Sq. Yds</option>
                <option value="Acres">Acres</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Open Space Value
            </label>
            <input
              type="number"
              value={formData.openSpaceValue}
              onChange={(e) => handleInputChange('openSpaceValue', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Greenery Area
            </label>
            <input
              type="number"
              value={formData.greeneryArea}
              onChange={(e) => handleInputChange('greeneryArea', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-slate-600">Land Extent</label>
              <div className="flex items-center gap-3 text-[11px] text-slate-700">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="landExtentUnit"
                    checked={formData.landExtentUnit === 'Acres'}
                    onChange={() => handleInputChange('landExtentUnit', 'Acres')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Acres</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="landExtentUnit"
                    checked={formData.landExtentUnit === 'Sq. Yrds'}
                    onChange={() => handleInputChange('landExtentUnit', 'Sq. Yrds')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Sq. Yrds</span>
                </label>
              </div>
            </div>
            <input
              type="text"
              value={formData.landExtentValue}
              onChange={(e) => handleInputChange('landExtentValue', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Number of Units
            </label>
            <input
              type="number"
              value={formData.numberOfUnits}
              onChange={(e) => handleInputChange('numberOfUnits', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Parking Levels
            </label>
            <input
              type="number"
              value={formData.parkingLevels}
              onChange={(e) => handleInputChange('parkingLevels', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Driveway Width
            </label>
            <input
              type="number"
              value={formData.drivewayWidth}
              onChange={(e) => handleInputChange('drivewayWidth', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Brick Type
            </label>
            <div className="relative">
              <select
                value={formData.selectedConstructionType}
                onChange={(e) => handleInputChange('selectedConstructionType', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
              >
                <option value="">Select Brick Type</option>
                {constructionTypes.map((c) => (
                  <option key={c.id} value={c.option}>
                    {c.option} ({c.status})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#1956db] hover:bg-[#1447b8] px-3.5 py-1.5 rounded-lg mt-2 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Construction type</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Parking registered in sale deed
            </label>
            <div className="relative">
              <select
                value={formData.parkingRegisteredInSaleDeed}
                onChange={(e) => handleInputChange('parkingRegisteredInSaleDeed', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Density
            </label>
            <input
              type="text"
              value={formData.density}
              onChange={(e) => handleInputChange('density', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        
        <section className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-700 text-xs">Pricing Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Base Price (INR)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <div className="relative flex-1">
                  <select
                    value={formData.basePriceUnit}
                    onChange={(e) => handleInputChange('basePriceUnit', e.target.value)}
                    className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                  >
                    <option value="Square Feet (Sqft)">Square Feet (Sqft)</option>
                    <option value="Square Yards">Square Yards</option>
                    <option value="Lumpsum">Lumpsum</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Price Updated On
              </label>
              <input
                type="date"
                value={formData.priceUpdatedOn}
                onChange={(e) => handleInputChange('priceUpdatedOn', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Upload Price Card (PDF/JPG)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start pt-1">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Pricing Type
              </label>
              <div className="relative">
                <select
                  value={formData.pricingType}
                  onChange={(e) => handleInputChange('pricingType', e.target.value)}
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                >
                  <option value="Per Feet">Per Feet</option>
                  <option value="Per Unit">Per Unit</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amenities Price
              </label>
              <input
                type="number"
                value={formData.amenitiesPrice}
                onChange={(e) => handleInputChange('amenitiesPrice', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Other Pricing (Text)
              </label>
              <input
                type="text"
                value={formData.otherPricingText}
                onChange={(e) => handleInputChange('otherPricingText', e.target.value)}
                placeholder="Enter additional pricing notes"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Other Pricing (Numeric)
              </label>
              <input
                type="number"
                value={formData.otherPricingNumeric}
                onChange={(e) => handleInputChange('otherPricingNumeric', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </section>

        
        <section className="pt-2 border-t border-slate-100 max-w-xs">
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

      <ConstructionTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveConstructionType}
      />
    </div>
  );
}

export default EssentialsDesktop;
