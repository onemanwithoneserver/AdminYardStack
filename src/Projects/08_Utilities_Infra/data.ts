export interface UtilitiesInfraFormData {
  
  waterSources: string[];
  boreWellsCount: string;
  municipalWaterConnection: string;
  undergroundSumpCapacity: string;
  overheadTankCapacity: string;
  waterTreatmentPlant: string;
  waterSofteningPlant: string;

  
  stpAvailable: string;
  stpCapacity: string;
  dualPlumbing: string;
  recycledWaterUsage: string;

  
  rainwaterHarvesting: string;
  rechargePits: string;
  stormWaterDrainage: string;

  
  transformerCapacity: string;
  dgBackupAvailable: string;
  dgCapacity: string;
  apartmentPowerBackup: string;
  commonAreaPowerBackup: string;
  solarPower: string;
  solarCapacity: string;

  
  fireFightingSystem: string;
  fireAlarmSystem: string;
  sprinklerSystem: string;
  smokeDetectionSystem: string;

  
  lpgManifold: string;
  fiberInternetReady: string;
  smartMetering: string;

  
  cctvSurveillance: string;
  boomBarrier: string;
  rfidAccess: string;
  visitorManagementSystem: string;

  
  status: 'Active' | 'Inactive';
}

export const WATER_SOURCE_OPTIONS = [
  'Municipal',
  'Borewell',
  'Tanker',
  'Mixed',
] as const;

export const GENERIC_SELECT_OPTIONS = [
  'Select value',
  'Available',
  'Not Available',
  'Yes',
  'No',
  'Planned / In Process',
] as const;

export const INITIAL_UTILITIES_INFRA_DATA: UtilitiesInfraFormData = {
  waterSources: ['Borewell'],
  boreWellsCount: '',
  municipalWaterConnection: '',
  undergroundSumpCapacity: '',
  overheadTankCapacity: '',
  waterTreatmentPlant: '',
  waterSofteningPlant: '',

  stpAvailable: '',
  stpCapacity: '',
  dualPlumbing: '',
  recycledWaterUsage: '',

  rainwaterHarvesting: '',
  rechargePits: '',
  stormWaterDrainage: '',

  transformerCapacity: '',
  dgBackupAvailable: '',
  dgCapacity: '',
  apartmentPowerBackup: '',
  commonAreaPowerBackup: '',
  solarPower: '',
  solarCapacity: '',

  fireFightingSystem: '',
  fireAlarmSystem: '',
  sprinklerSystem: '',
  smokeDetectionSystem: '',

  lpgManifold: '',
  fiberInternetReady: '',
  smartMetering: '',

  cctvSurveillance: '',
  boomBarrier: '',
  rfidAccess: '',
  visitorManagementSystem: '',

  status: 'Active',
};

export const sectionInfo = {
  id: '08',
  name: 'Utilities & Infra',
  slug: '08_utilities_infra',
};

export const initialUtilitiesInfraData = {
  id: '08',
  name: 'Utilities & Infra',
  description: 'Power backup, water supply, sewage treatment, roads, and grid connections',
};

export type UtilitiesInfraData = UtilitiesInfraFormData;
