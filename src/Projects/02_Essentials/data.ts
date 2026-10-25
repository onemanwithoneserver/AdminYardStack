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
  openSpaceType: '%' | 'Number';
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
  { id: 'rcc', option: 'RCC', status: 'ACTIVE' },
];

// Essentials options extracted from the supplied form. Location, inventory,
// approvals and amenities data belong to their respective project sections.
export const ESSENTIALS_OPTIONS = {
  projectTypes: ['Flats', 'Villa', 'Plots'],
  model: ['Yes, with Interior works', 'Yes', 'No', 'Under Construction'],
  towers: ['Towers', 'Blocks'],
  yesNo: ['Yes', 'No'],
  skyVillaStatus: ['Approved', 'On Request'],
  priceUnits: [
    { value: 'Sqft', label: 'Square Foot (Sqft)' },
    { value: 'Sqm', label: 'Square Meter (Sqm)' },
    { value: 'Acre', label: 'Acre' },
    { value: 'Hectare', label: 'Hectare (Ha)' },
    { value: 'SquareYard', label: 'Square Yard (Sqyd)' },
  ],
  pricingTypes: [
    { value: 'PerFeet', label: 'Per Feet' },
    { value: 'LumpSum', label: 'Lump Sum' },
  ],
};

export const PROJECT_SUBTYPE_OPTIONS: Record<string, string[]> = {
  Flats: ['Stand alone', 'Fully Gated'],
  Villa: ['Ultra Luxury Villas'],
  Plots: ['Plotted Layout'],
};

export const ALL_PROJECT_SUBTYPES = Array.from(new Set(Object.values(PROJECT_SUBTYPE_OPTIONS).flat()));

export const ESSENTIALS_OPTIONS_LOCK_MESSAGE = 'All project parameters and fields are enabled for editing.';

export function isEssentialsFieldEnabled(_data: EssentialsFormData, _field: keyof EssentialsFormData): boolean {
  return true;
}

// Keep both viewport forms consistent
export function updateEssentialsField<K extends keyof EssentialsFormData>(
  previous: EssentialsFormData, field: K, value: EssentialsFormData[K],
): EssentialsFormData {
  const next = { ...previous, [field]: value };
  if (field === 'projectType' && value !== previous.projectType) {
    if (!next.basePriceUnit) {
      next.basePriceUnit = next.projectType === 'Plots' ? 'SquareYard' : 'Sqft';
    }
    if (!next.pricingType) next.pricingType = 'PerFeet';
  }
  return next;
}

export const INITIAL_ESSENTIALS_DATA: EssentialsFormData = {
  projectType: '',
  projectSubType: '',
  modelFlatVilla: '',
  towersType: '',
  optionsLocked: false,
  towersBlocksCount: '',
  skyVillasAvailable: '',
  skyVillaStatus: '',
  openSpaceType: '%',
  openSpaceValue: '',
  greeneryArea: '',
  landExtentUnit: 'Acres',
  landExtentValue: '',
  numberOfUnits: '',
  parkingLevels: '',
  drivewayWidth: '',
  selectedConstructionType: '',
  parkingRegisteredInSaleDeed: '',
  density: '',
  basePrice: '',
  basePriceUnit: '',
  priceUpdatedOn: '',
  priceCardFile: null,
  pricingType: '',
  amenitiesPrice: '',
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
