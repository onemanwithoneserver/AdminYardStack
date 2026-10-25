import { useState } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { INITIAL_UTILITIES_INFRA_DATA, WATER_SOURCE_OPTIONS, GENERIC_SELECT_OPTIONS, type UtilitiesInfraFormData } from './data';

export function UtilitiesInfraDesktop() {
  const [formData, setFormData] = useState<UtilitiesInfraFormData>(
    INITIAL_UTILITIES_INFRA_DATA
  );
  const [savedNotification, setSavedNotification] = useState(false);

  const handleFieldChange = <K extends keyof UtilitiesInfraFormData>(
    field: K,
    value: UtilitiesInfraFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleWaterSource = (source: string) => {
    setFormData((prev) => {
      const isSelected = prev.waterSources.includes(source);
      return {
        ...prev,
        waterSources: isSelected
          ? prev.waterSources.filter((s) => s !== source)
          : [...prev.waterSources, source],
      };
    });
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const renderSelect = (
    value: string,
    onChange: (val: string) => void,
    options: readonly string[] = GENERIC_SELECT_OPTIONS,
    placeholder = 'Select value'
  ) => (
    <ModernDropdown<string>
      value={value}
      onChange={onChange}
      options={[...options]}
      placeholder={placeholder}
      roundedClass="rounded-[4px]"
      className="w-full inline-block"
      buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
    />
  );

  const renderInputWithUnit = (
    value: string,
    onChange: (val: string) => void,
    unit: string,
    placeholder = ''
  ) => (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs pr-16"
      />
      <span className="absolute right-2 px-2 py-0.5 text-[10px] font-semibold font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-[2px] border border-slate-200 dark:border-white/10 pointer-events-none">
        {unit}
      </span>
    </div>
  );

  return (
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Utilities & Infra saved successfully!</span>
        </div>
      )}

      
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-xs shadow-amber-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Utilities & Infra
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Power substations, water supply networks, drainage, security surveillance and connectivity
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Water Supply & Purification Infrastructure
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Water Sources
              </label>
              <div className="flex flex-wrap items-center gap-4 h-9">
                {WATER_SOURCE_OPTIONS.map((source) => (
                  <label
                    key={source}
                    className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formData.waterSources.includes(source)}
                      onChange={() => handleToggleWaterSource(source)}
                      className="w-3.5 h-3.5 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Bore Wells Count
              </label>
              {renderInputWithUnit(
                formData.boreWellsCount,
                (v) => handleFieldChange('boreWellsCount', v),
                'Count',
                'e.g. 4'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Municipal Water Connection
              </label>
              {renderSelect(formData.municipalWaterConnection, (v) =>
                handleFieldChange('municipalWaterConnection', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Underground Sump Capacity
              </label>
              {renderInputWithUnit(
                formData.undergroundSumpCapacity,
                (v) => handleFieldChange('undergroundSumpCapacity', v),
                'Litres',
                'e.g. 150000'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Overhead Tank Capacity
              </label>
              {renderInputWithUnit(
                formData.overheadTankCapacity,
                (v) => handleFieldChange('overheadTankCapacity', v),
                'Litres',
                'e.g. 75000'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Water Treatment Plant (WTP)
              </label>
              {renderSelect(formData.waterTreatmentPlant, (v) =>
                handleFieldChange('waterTreatmentPlant', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Water Softening Plant
              </label>
              {renderSelect(formData.waterSofteningPlant, (v) =>
                handleFieldChange('waterSofteningPlant', v)
              )}
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Sewage & Waste Water Management (STP)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                STP Available
              </label>
              {renderSelect(formData.stpAvailable, (v) =>
                handleFieldChange('stpAvailable', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                STP Capacity
              </label>
              {renderInputWithUnit(
                formData.stpCapacity,
                (v) => handleFieldChange('stpCapacity', v),
                'KLD',
                'e.g. 100'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Dual Plumbing
              </label>
              {renderSelect(formData.dualPlumbing, (v) =>
                handleFieldChange('dualPlumbing', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Recycled Water Usage
              </label>
              {renderSelect(formData.recycledWaterUsage, (v) =>
                handleFieldChange('recycledWaterUsage', v)
              )}
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                03
              </span>
              <span className="w-1 h-3.5 rounded-full bg-cyan-600 dark:bg-cyan-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Rainwater Harvesting & Storm Drainage
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Rainwater Harvesting
              </label>
              {renderSelect(formData.rainwaterHarvesting, (v) =>
                handleFieldChange('rainwaterHarvesting', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Recharge Pits
              </label>
              {renderInputWithUnit(
                formData.rechargePits,
                (v) => handleFieldChange('rechargePits', v),
                'Count',
                'e.g. 12'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Storm Water Drainage
              </label>
              {renderSelect(formData.stormWaterDrainage, (v) =>
                handleFieldChange('stormWaterDrainage', v)
              )}
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                04
              </span>
              <span className="w-1 h-3.5 rounded-full bg-amber-600 dark:bg-amber-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Power Generation, Backup & Solar Grid
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Transformer Capacity
              </label>
              {renderInputWithUnit(
                formData.transformerCapacity,
                (v) => handleFieldChange('transformerCapacity', v),
                'kVA',
                'e.g. 500'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                DG Backup Available
              </label>
              {renderSelect(formData.dgBackupAvailable, (v) =>
                handleFieldChange('dgBackupAvailable', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                DG Capacity
              </label>
              {renderInputWithUnit(
                formData.dgCapacity,
                (v) => handleFieldChange('dgCapacity', v),
                'kVA',
                'e.g. 250'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Apartment Power Backup
              </label>
              {renderInputWithUnit(
                formData.apartmentPowerBackup,
                (v) => handleFieldChange('apartmentPowerBackup', v),
                'Watts / kVA',
                'e.g. 1.5 kVA'
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Common Area Backup
              </label>
              {renderSelect(formData.commonAreaPowerBackup, (v) =>
                handleFieldChange('commonAreaPowerBackup', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Solar Power Integration
              </label>
              {renderSelect(formData.solarPower, (v) =>
                handleFieldChange('solarPower', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Solar Generation Capacity
              </label>
              {renderInputWithUnit(
                formData.solarCapacity,
                (v) => handleFieldChange('solarCapacity', v),
                'kW',
                'e.g. 50'
              )}
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                05
              </span>
              <span className="w-1 h-3.5 rounded-full bg-rose-600 dark:bg-rose-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Fire Fighting & Emergency Detection
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Fire Fighting System
              </label>
              {renderSelect(formData.fireFightingSystem, (v) =>
                handleFieldChange('fireFightingSystem', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Fire Alarm System
              </label>
              {renderSelect(formData.fireAlarmSystem, (v) =>
                handleFieldChange('fireAlarmSystem', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Sprinkler System
              </label>
              {renderSelect(formData.sprinklerSystem, (v) =>
                handleFieldChange('sprinklerSystem', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Smoke Detection System
              </label>
              {renderSelect(formData.smokeDetectionSystem, (v) =>
                handleFieldChange('smokeDetectionSystem', v)
              )}
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                06
              </span>
              <span className="w-1 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Piped Gas, Telecom & Smart Metering
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                LPG Manifold / PNG
              </label>
              {renderSelect(formData.lpgManifold, (v) =>
                handleFieldChange('lpgManifold', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Fiber Internet Ready
              </label>
              {renderSelect(formData.fiberInternetReady, (v) =>
                handleFieldChange('fiberInternetReady', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Smart Metering
              </label>
              {renderSelect(formData.smartMetering, (v) =>
                handleFieldChange('smartMetering', v)
              )}
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                07
              </span>
              <span className="w-1 h-3.5 rounded-full bg-purple-600 dark:bg-purple-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Perimeter Security & Access Surveillance
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                CCTV Surveillance
              </label>
              {renderSelect(formData.cctvSurveillance, (v) =>
                handleFieldChange('cctvSurveillance', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Boom Barrier
              </label>
              {renderSelect(formData.boomBarrier, (v) =>
                handleFieldChange('boomBarrier', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                RFID Access System
              </label>
              {renderSelect(formData.rfidAccess, (v) =>
                handleFieldChange('rfidAccess', v)
              )}
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Visitor Management System
              </label>
              {renderSelect(formData.visitorManagementSystem, (v) =>
                handleFieldChange('visitorManagementSystem', v)
              )}
            </div>
          </div>
        </section>
      </div>

      
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 sm:p-3 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 h-4">
              <span>Status</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <ModernDropdown<'Active' | 'Inactive'>
              value={formData.status}
              onChange={(val) => handleFieldChange('status', val)}
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

export default UtilitiesInfraDesktop;
