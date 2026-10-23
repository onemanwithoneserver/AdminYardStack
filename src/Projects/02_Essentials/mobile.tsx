import { useState } from 'react';
import { ChevronDown, Lock, Plus } from 'lucide-react';
import { INITIAL_ESSENTIALS_DATA, INITIAL_CONSTRUCTION_TYPES, type EssentialsFormData, type ConstructionTypeOption } from './data';
import { ConstructionTypeDialog } from './desktop';

export function EssentialsMobile() {
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
    <div className="w-full bg-white rounded-xl border border-blue-200/80 shadow-xs p-4 text-slate-800 text-xs select-none">
      <div className="mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-[#1956db] tracking-wide">
          Essentials
        </h2>
      </div>

      <div className="space-y-4">
        
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">
              Project Type <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => handleInputChange('projectType', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            >
              <option value="Flats">Flats</option>
              <option value="Villas">Villas</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">
              Project Sub-Type
            </label>
            <select
              value={formData.projectSubType}
              onChange={(e) => handleInputChange('projectSubType', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            >
              <option value="">-- Select Sub-Type --</option>
              <option value="Gated Community Flats">Gated Community Flats</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">
              Model Flat/Villa
            </label>
            <select
              value={formData.modelFlatVilla}
              onChange={(e) => handleInputChange('modelFlatVilla', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            >
              <option value="Yes, with Interior works">Yes, with Interior works</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">
              Towers
            </label>
            <select
              value={formData.towersType}
              onChange={(e) => handleInputChange('towersType', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
            >
              <option value="Towers">Towers</option>
              <option value="Blocks">Blocks</option>
            </select>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-700 text-white"
            >
              <Lock className="w-3 h-3" />
              <span>Options locked</span>
            </button>
          </div>
        </div>

        
        <div className="border border-slate-200/70 rounded-lg p-3 bg-slate-50/40 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Towers/Blocks</label>
              <input
                type="number"
                value={formData.towersBlocksCount}
                onChange={(e) => handleInputChange('towersBlocksCount', e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Open Space %</label>
              <input
                type="number"
                value={formData.openSpaceValue}
                onChange={(e) => handleInputChange('openSpaceValue', e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-medium text-slate-600">Land Extent</label>
              <div className="flex items-center gap-2 text-[10px]">
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="mobileLandExtentUnit"
                    checked={formData.landExtentUnit === 'Acres'}
                    onChange={() => handleInputChange('landExtentUnit', 'Acres')}
                  />
                  <span>Acres</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="mobileLandExtentUnit"
                    checked={formData.landExtentUnit === 'Sq. Yrds'}
                    onChange={() => handleInputChange('landExtentUnit', 'Sq. Yrds')}
                  />
                  <span>Sq. Yrds</span>
                </label>
              </div>
            </div>
            <input
              type="text"
              value={formData.landExtentValue}
              onChange={(e) => handleInputChange('landExtentValue', e.target.value)}
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Number of Units</label>
              <input
                type="number"
                value={formData.numberOfUnits}
                onChange={(e) => handleInputChange('numberOfUnits', e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Driveway Width</label>
              <input
                type="number"
                value={formData.drivewayWidth}
                onChange={(e) => handleInputChange('drivewayWidth', e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        
        <div className="border border-slate-200/70 rounded-lg p-3 bg-slate-50/40 space-y-2">
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-1">Brick Type</label>
            <div className="relative">
              <select
                value={formData.selectedConstructionType}
                onChange={(e) => handleInputChange('selectedConstructionType', e.target.value)}
                className="w-full appearance-none px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 pr-7"
              >
                <option value="">Select Brick Type</option>
                {constructionTypes.map((c) => (
                  <option key={c.id} value={c.option}>
                    {c.option} ({c.status})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="w-full py-1.5 rounded-md text-xs font-semibold text-white bg-[#1956db] hover:bg-[#1447b8] transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Construction type</span>
          </button>
        </div>

        
        <div className="border border-slate-200/70 rounded-lg p-3 bg-slate-50/40 space-y-2">
          <h3 className="font-semibold text-slate-700 text-xs">Pricing Details</h3>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Base Price (INR)</label>
            <div className="flex gap-1.5">
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => handleInputChange('basePrice', e.target.value)}
                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />
              <select
                value={formData.basePriceUnit}
                onChange={(e) => handleInputChange('basePriceUnit', e.target.value)}
                className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              >
                <option value="Square Feet (Sqft)">Sqft</option>
                <option value="Square Yards">Sq Yds</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Price Updated On</label>
            <input
              type="date"
              value={formData.priceUpdatedOn}
              onChange={(e) => handleInputChange('priceUpdatedOn', e.target.value)}
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Amenities Price</label>
            <input
              type="number"
              value={formData.amenitiesPrice}
              onChange={(e) => handleInputChange('amenitiesPrice', e.target.value)}
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
            />
          </div>
        </div>

        
        <div>
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
        </div>
      </div>

      <ConstructionTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveConstructionType}
      />
    </div>
  );
}

export default EssentialsMobile;
