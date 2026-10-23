import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  INITIAL_UTILITIES_INFRA_DATA,
  WATER_SOURCE_OPTIONS,
  GENERIC_SELECT_OPTIONS,
  type UtilitiesInfraFormData,
} from './data';

export function UtilitiesInfraMobile() {
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
    options: readonly string[] = GENERIC_SELECT_OPTIONS
  ) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
      >
        {options.map((opt) => (
          <option key={opt} value={opt === 'Select value' ? '' : opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
    </div>
  );

  const renderInputWithUnit = (
    value: string,
    onChange: (val: string) => void,
    unit: string
  ) => (
    <div className="relative flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 pr-16"
      />
      <span className="absolute right-2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200 pointer-events-none">
        {unit}
      </span>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-6 text-slate-800">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Utilities & Infra saved successfully!</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Utilities & Infra (Mobile)
        </span>
      </div>

      
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Water Infrastructure
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              Water Source
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {WATER_SOURCE_OPTIONS.map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.waterSources.includes(source)}
                    onChange={() => handleToggleWaterSource(source)}
                    className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300"
                  />
                  <span>{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Bore Wells Count
            </label>
            {renderInputWithUnit(
              formData.boreWellsCount,
              (v) => handleFieldChange('boreWellsCount', v),
              'Count'
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Municipal Water Connection
            </label>
            {renderSelect(formData.municipalWaterConnection, (v) =>
              handleFieldChange('municipalWaterConnection', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Underground Sump Capacity
            </label>
            {renderInputWithUnit(
              formData.undergroundSumpCapacity,
              (v) => handleFieldChange('undergroundSumpCapacity', v),
              'Litres'
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Overhead Tank Capacity
            </label>
            {renderInputWithUnit(
              formData.overheadTankCapacity,
              (v) => handleFieldChange('overheadTankCapacity', v),
              'Litres'
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Water Treatment Plant (WTP)
            </label>
            {renderSelect(formData.waterTreatmentPlant, (v) =>
              handleFieldChange('waterTreatmentPlant', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Water Softening Plant
            </label>
            {renderSelect(formData.waterSofteningPlant, (v) =>
              handleFieldChange('waterSofteningPlant', v)
            )}
          </div>
        </div>
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Waste Water Management
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              STP Available
            </label>
            {renderSelect(formData.stpAvailable, (v) =>
              handleFieldChange('stpAvailable', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              STP Capacity
            </label>
            {renderInputWithUnit(
              formData.stpCapacity,
              (v) => handleFieldChange('stpCapacity', v),
              'KLD'
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Dual Plumbing
            </label>
            {renderSelect(formData.dualPlumbing, (v) =>
              handleFieldChange('dualPlumbing', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Recycled Water Usage
            </label>
            {renderSelect(formData.recycledWaterUsage, (v) =>
              handleFieldChange('recycledWaterUsage', v)
            )}
          </div>
        </div>
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Rainwater Management
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Rainwater Harvesting
            </label>
            {renderSelect(formData.rainwaterHarvesting, (v) =>
              handleFieldChange('rainwaterHarvesting', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Recharge Pits
            </label>
            {renderInputWithUnit(
              formData.rechargePits,
              (v) => handleFieldChange('rechargePits', v),
              'Count'
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Storm Water Drainage
            </label>
            {renderSelect(formData.stormWaterDrainage, (v) =>
              handleFieldChange('stormWaterDrainage', v)
            )}
          </div>
        </div>
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Power Infrastructure
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Transformer Capacity
            </label>
            {renderInputWithUnit(
              formData.transformerCapacity,
              (v) => handleFieldChange('transformerCapacity', v),
              'kVA'
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              DG Backup Available
            </label>
            {renderSelect(formData.dgBackupAvailable, (v) =>
              handleFieldChange('dgBackupAvailable', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              DG Capacity
            </label>
            {renderInputWithUnit(
              formData.dgCapacity,
              (v) => handleFieldChange('dgCapacity', v),
              'kVA'
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Apartment Power Backup
            </label>
            {renderInputWithUnit(
              formData.apartmentPowerBackup,
              (v) => handleFieldChange('apartmentPowerBackup', v),
              'Watts / kVA'
            )}
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Per Apartment
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Common Area Power Backup
            </label>
            {renderSelect(formData.commonAreaPowerBackup, (v) =>
              handleFieldChange('commonAreaPowerBackup', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Solar Power
            </label>
            {renderSelect(formData.solarPower, (v) =>
              handleFieldChange('solarPower', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Solar Capacity
            </label>
            {renderInputWithUnit(
              formData.solarCapacity,
              (v) => handleFieldChange('solarCapacity', v),
              'kW'
            )}
          </div>
        </div>
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Fire & Safety
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Fire Fighting System
            </label>
            {renderSelect(formData.fireFightingSystem, (v) =>
              handleFieldChange('fireFightingSystem', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Fire Alarm System
            </label>
            {renderSelect(formData.fireAlarmSystem, (v) =>
              handleFieldChange('fireAlarmSystem', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Sprinkler System
            </label>
            {renderSelect(formData.sprinklerSystem, (v) =>
              handleFieldChange('sprinklerSystem', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Smoke Detection System
            </label>
            {renderSelect(formData.smokeDetectionSystem, (v) =>
              handleFieldChange('smokeDetectionSystem', v)
            )}
          </div>
        </div>
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Utility Services
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              LPG Manifold / PNG
            </label>
            {renderSelect(formData.lpgManifold, (v) =>
              handleFieldChange('lpgManifold', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Fiber Internet Ready
            </label>
            {renderSelect(formData.fiberInternetReady, (v) =>
              handleFieldChange('fiberInternetReady', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Smart Metering
            </label>
            {renderSelect(formData.smartMetering, (v) =>
              handleFieldChange('smartMetering', v)
            )}
          </div>
        </div>
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 border-l-2 border-blue-600 pl-2 py-0.5">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Security Infrastructure
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              CCTV Surveillance
            </label>
            {renderSelect(formData.cctvSurveillance, (v) =>
              handleFieldChange('cctvSurveillance', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Boom Barrier
            </label>
            {renderSelect(formData.boomBarrier, (v) =>
              handleFieldChange('boomBarrier', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              RFID Access
            </label>
            {renderSelect(formData.rfidAccess, (v) =>
              handleFieldChange('rfidAccess', v)
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Visitor Management System
            </label>
            {renderSelect(formData.visitorManagementSystem, (v) =>
              handleFieldChange('visitorManagementSystem', v)
            )}
          </div>
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

export default UtilitiesInfraMobile;
