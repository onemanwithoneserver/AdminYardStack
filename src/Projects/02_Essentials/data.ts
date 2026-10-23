export interface ConstructionTypeOption {
  id: string;
  option: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface EssentialsFormData {
  projectType: string;
  projectSubType: string;
  modelFlatVilla: string;
  towersType: string;
  optionsLocked: boolean;
  towersBlocksCount: string;
  skyVillasAvailable: string;
  skyVillaStatus: string;
  openSpaceType: string;
  openSpaceValue: string;
  greeneryArea: string;
  landExtentUnit: 'Acres' | 'Sq. Yrds';
  landExtentValue: string;
  numberOfUnits: string;
  parkingLevels: string;
  drivewayWidth: string;
  selectedConstructionType: string;
  parkingRegisteredInSaleDeed: string;
  density: string;
  basePrice: string;
  basePriceUnit: string;
  priceUpdatedOn: string;
  priceCardFile: string | null;
  pricingType: string;
  amenitiesPrice: string;
  otherPricingText: string;
  otherPricingNumeric: string;
  status: 'Active' | 'Inactive';
}

export const INITIAL_CONSTRUCTION_TYPES: ConstructionTypeOption[] = [
  { id: '1', option: 'Red Clay Bricks', status: 'ACTIVE' },
  { id: '2', option: 'AAC Blocks', status: 'ACTIVE' },
  { id: '3', option: 'Fly Ash Bricks', status: 'ACTIVE' },
  { id: '4', option: 'Solid Concrete Blocks', status: 'INACTIVE' },
];

export const INITIAL_ESSENTIALS_DATA: EssentialsFormData = {
  projectType: 'Flats',
  projectSubType: '',
  modelFlatVilla: 'Yes, with Interior works',
  towersType: 'Towers',
  optionsLocked: true,
  towersBlocksCount: '1',
  skyVillasAvailable: '',
  skyVillaStatus: '',
  openSpaceType: '%',
  openSpaceValue: '40',
  greeneryArea: '10',
  landExtentUnit: 'Acres',
  landExtentValue: '12.5',
  numberOfUnits: '220',
  parkingLevels: '0',
  drivewayWidth: '10',
  selectedConstructionType: '',
  parkingRegisteredInSaleDeed: 'Yes',
  density: '0.01',
  basePrice: '9500',
  basePriceUnit: 'Square Feet (Sqft)',
  priceUpdatedOn: '2024-05-01',
  priceCardFile: null,
  pricingType: 'Per Feet',
  amenitiesPrice: '150000',
  otherPricingText: '',
  otherPricingNumeric: '',
  status: 'Active',
};

export const sectionInfo = {
  id: '02',
  name: 'Essentials',
  slug: '02_essentials',
};

export const initialEssentialsData = {
  id: '02',
  name: 'Essentials',
  description: 'Core project parameters, dimensions, land extent, units, construction type and pricing details',
};

export type EssentialsData = EssentialsFormData;
