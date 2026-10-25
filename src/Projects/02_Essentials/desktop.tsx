import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import {
  FileText,
  Lock,
  Unlock,
  Plus,
  X,
  UploadCloud,
  ChevronDown,
} from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { ModernCalendar } from '../../components/elements/ModernCalendar';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[4px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Add Construction Type
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Specify material or masonry construction specification.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[2px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Option Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              placeholder="e.g. Porotherm Smart Bricks"
              required
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Status
            </label>
            <ModernDropdown<'ACTIVE' | 'INACTIVE'>
              value={status}
              onChange={(val) => setStatus(val)}
              options={[
                {
                  value: 'ACTIVE',
                  label: 'ACTIVE',
                  icon: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5" />,
                },
                {
                  value: 'INACTIVE',
                  label: 'INACTIVE',
                  icon: <span className="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1.5" />,
                },
              ]}
              roundedClass="rounded-[4px]"
              className="w-full inline-block"
              buttonClassName="w-full h-9 px-3 text-xs font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Option
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
  const [priceCardFileName, setPriceCardFileName] = useState<string>('');
  const priceCardInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof EssentialsFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceCardUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPriceCardFileName(file.name);
      handleInputChange('priceCardFile', file.name);
    }
  };

  const handleRemovePriceCard = () => {
    setPriceCardFileName('');
    handleInputChange('priceCardFile', null);
    if (priceCardInputRef.current) {
      priceCardInputRef.current.value = '';
    }
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
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {/* Header Banner */}
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center text-white shadow-xs shadow-fuchsia-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Essentials
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Core project parameters, dimensions, land extent, units, construction type and pricing details
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        {/* Section 1: Project Classification & Structure */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Project Classification & Structure
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Project Type */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                <span>Project Type</span>
                <span className="text-rose-500 font-bold ml-1">*</span>
              </label>
              <ModernDropdown<string>
                value={formData.projectType}
                onChange={(val) => handleInputChange('projectType', val)}
                options={['Flats', 'Villas', 'Plots', 'Commercial']}
                placeholder="Select Project Type"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* Project Sub-Type */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Project Sub-Type
              </label>
              <ModernDropdown<string>
                value={formData.projectSubType}
                onChange={(val) => handleInputChange('projectSubType', val)}
                options={[
                  'Gated Community Flats',
                  'High Rise Apartments',
                  'Ultra Luxury Villas',
                  'Commercial Office Space',
                  'Plotted Layout',
                ]}
                placeholder="Select Sub-Type"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* Model Flat/Villa */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Model Flat/Villa
              </label>
              <ModernDropdown<string>
                value={formData.modelFlatVilla}
                onChange={(val) => handleInputChange('modelFlatVilla', val)}
                options={['Yes, with Interior works', 'Yes, Bare shell', 'No']}
                placeholder="Select Model Flat"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* Towers Type */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Towers Nomenclature
              </label>
              <ModernDropdown<string>
                value={formData.towersType}
                onChange={(val) => handleInputChange('towersType', val)}
                options={['Towers', 'Blocks', 'Wings']}
                placeholder="Select Towers"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>
          </div>

          {/* Options Lock Indicator */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleInputChange('optionsLocked', !formData.optionsLocked)}
              className={`inline-flex items-center gap-1.5 px-3 h-8.5 rounded-[4px] text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                formData.optionsLocked
                  ? 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 border border-transparent'
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
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {formData.optionsLocked
                ? 'Primary structure options are locked against accidental changes'
                : 'Click to lock structure classification settings'}
            </span>
          </div>
        </section>

        {/* Section 2: Scale, Dimensions & Land Extent */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Scale, Dimensions & Land Extent
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Towers/Blocks Count */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Towers / Blocks Count
              </label>
              <input
                type="number"
                value={formData.towersBlocksCount}
                onChange={(e) => handleInputChange('towersBlocksCount', e.target.value)}
                placeholder="e.g. 5"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Sky Villas Available */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Sky Villas Available
              </label>
              <ModernDropdown<string>
                value={formData.skyVillasAvailable}
                onChange={(val) => handleInputChange('skyVillasAvailable', val)}
                options={['Yes', 'No']}
                placeholder="Select availability"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* Sky Villa Status */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Sky Villa Status
              </label>
              <ModernDropdown<string>
                value={formData.skyVillaStatus}
                onChange={(val) => handleInputChange('skyVillaStatus', val)}
                options={['Available', 'Sold Out']}
                placeholder="Select status"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* Open Space */}
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center justify-between w-full mb-1.5 h-4">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Open Space
                </label>
                <div className="flex items-center gap-3 text-xs">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <input
                      type="radio"
                      name="openSpaceType"
                      checked={formData.openSpaceType === '%'}
                      onChange={() => handleInputChange('openSpaceType', '%')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>%</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <input
                      type="radio"
                      name="openSpaceType"
                      checked={formData.openSpaceType === 'Number'}
                      onChange={() => handleInputChange('openSpaceType', 'Number')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Number</span>
                  </label>
                </div>
              </div>
              <input
                type="number"
                value={formData.openSpaceValue}
                onChange={(e) => handleInputChange('openSpaceValue', e.target.value)}
                placeholder={formData.openSpaceType === '%' ? 'e.g. 78' : 'e.g. 1500'}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Greenery Area */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Greenery Area (%)
              </label>
              <input
                type="number"
                value={formData.greeneryArea}
                onChange={(e) => handleInputChange('greeneryArea', e.target.value)}
                placeholder="e.g. 35"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2 sm:gap-5 items-end">
              {/* Land Extent */}
              <div className="flex min-w-0 flex-col items-start w-full">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 w-full mb-1.5 min-h-4">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Land Extent
                  </label>
                  <div className="flex shrink-0 items-center gap-2 text-xs">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <input
                        type="radio"
                        name="landExtentUnit"
                        checked={formData.landExtentUnit === 'Acres'}
                        onChange={() => handleInputChange('landExtentUnit', 'Acres')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Acres</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-300">
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
                  placeholder="e.g. 12.5"
                  className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
              </div>

              {/* Number of Units */}
              <div className="flex min-w-0 flex-col items-start w-full">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                  Number of Units
                </label>
                <input
                  type="number"
                  value={formData.numberOfUnits}
                  onChange={(e) => handleInputChange('numberOfUnits', e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Engineering, Parking & Site Parameters */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                03
              </span>
              <span className="w-1 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Engineering, Parking & Site Parameters
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Parking Levels */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Parking Levels
              </label>
              <input
                type="number"
                value={formData.parkingLevels}
                onChange={(e) => handleInputChange('parkingLevels', e.target.value)}
                placeholder="e.g. 3 Basements"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Driveway Width */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Driveway Width (Feet)
              </label>
              <input
                type="number"
                value={formData.drivewayWidth}
                onChange={(e) => handleInputChange('drivewayWidth', e.target.value)}
                placeholder="e.g. 30"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Brick / Construction Type */}
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Brick / Construction Type
              </label>
              <div className="flex items-center gap-2.5 flex-wrap w-full">
                <ModernDropdown<string>
                  value={formData.selectedConstructionType}
                  onChange={(val) => handleInputChange('selectedConstructionType', val)}
                  options={constructionTypes.map((c) => ({
                    value: c.option,
                    label: `${c.option} (${c.status})`,
                  }))}
                  placeholder="Select Construction Type"
                  roundedClass="rounded-[4px]"
                  className="flex-1 min-w-[180px]"
                  buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                />
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Add Construction Type</span>
                </button>
              </div>
            </div>

            {/* Parking Registered in Sale Deed */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Parking in Sale Deed
              </label>
              <ModernDropdown<string>
                value={formData.parkingRegisteredInSaleDeed}
                onChange={(val) => handleInputChange('parkingRegisteredInSaleDeed', val)}
                options={['Yes', 'No']}
                placeholder="Select option"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* Density */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Density
              </label>
              <input
                type="text"
                value={formData.density}
                onChange={(e) => handleInputChange('density', e.target.value)}
                placeholder="e.g. High / Low Density"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Pricing Specifications & Commercials */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                04
              </span>
              <span className="w-1 h-3.5 rounded-full bg-amber-600 dark:bg-amber-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Pricing Specifications & Commercials
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            {/* Base Price + Unit */}
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Base Price (INR) & Unit
              </label>
              <div className="flex items-center gap-2 w-full">
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  placeholder="e.g. 8500"
                  className="w-36 h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
                <ModernDropdown<string>
                  value={formData.basePriceUnit}
                  onChange={(val) => handleInputChange('basePriceUnit', val)}
                  options={['Square Feet (Sqft)', 'Square Yards', 'Lumpsum']}
                  placeholder="Select Unit"
                  roundedClass="rounded-[4px]"
                  className="flex-1"
                  buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                />
              </div>
            </div>

            {/* Price Updated On */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Price Updated On
              </label>
              <ModernCalendar
                value={formData.priceUpdatedOn}
                onChange={(val) => handleInputChange('priceUpdatedOn', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            {/* Upload Price Card */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Upload Price Card (PDF/JPG)
              </label>
              {priceCardFileName || formData.priceCardFile ? (
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    {priceCardFileName || formData.priceCardFile}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemovePriceCard}
                    className="p-1 rounded-[2px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={priceCardInputRef}
                    type="file"
                    id="price-card-input"
                    accept=".pdf,image/*"
                    onChange={handlePriceCardUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="price-card-input"
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
            </div>

            {/* Pricing Type */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Pricing Type
              </label>
              <ModernDropdown<string>
                value={formData.pricingType}
                onChange={(val) => handleInputChange('pricingType', val)}
                options={['Per Feet', 'Per Unit']}
                placeholder="Select Type"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* Amenities Price */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Amenities Price (INR)
              </label>
              <input
                type="number"
                value={formData.amenitiesPrice}
                onChange={(e) => handleInputChange('amenitiesPrice', e.target.value)}
                placeholder="e.g. 500000"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Other Pricing (Text) */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Other Pricing (Notes)
              </label>
              <input
                type="text"
                value={formData.otherPricingText}
                onChange={(e) => handleInputChange('otherPricingText', e.target.value)}
                placeholder="e.g. Club membership extra"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>

            {/* Other Pricing (Numeric) */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Other Pricing (Numeric)
              </label>
              <input
                type="number"
                value={formData.otherPricingNumeric}
                onChange={(e) => handleInputChange('otherPricingNumeric', e.target.value)}
                placeholder="e.g. 25000"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
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
              buttonClassName="w-auto h-8 px-2.5 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
            />
          </div>
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

export default EssentialsDesktop;
