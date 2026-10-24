export interface SpecItem {
  id: string;
  name: string;
  enabled: boolean;
  allowedType: string;
  brand: string;
  size: string;
}

export interface ConstructionTypeOption {
  id: string;
  option: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SpecificationsFormData {
  structureItems: SpecItem[];
  flooringItems: SpecItem[];
  utility: string;
  electrical: string;
  plumbing: string;
  fireAndSafety: string;
  safetyAndSecurity: string;
  dgBackup: string;
  selectedConstructionType: string;
  doorHeight: string;
  status: 'Active' | 'Inactive';
}

export const ALLOWED_TYPES = [
  'Vitrified Tiles',
  'Ceramic Tiles',
  'Granite',
  'Marble',
  'Wooden Flooring',
  'Anti-skid Tiles',
  'RCC Shear Wall',
  'Cement Plaster',
  'Gypsum Plaster',
] as const;

export const INITIAL_CONSTRUCTION_TYPES: ConstructionTypeOption[] = [
  { id: '1', option: 'Red Clay Bricks', status: 'ACTIVE' },
  { id: '2', option: 'AAC Blocks', status: 'ACTIVE' },
  { id: '3', option: 'Fly Ash Bricks', status: 'ACTIVE' },
  { id: '4', option: 'Solid Concrete Blocks', status: 'ACTIVE' },
];

export const INITIAL_STRUCTURE_SPECS: SpecItem[] = [
  { id: 'plastering', name: 'Plastering', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'construction_technology', name: 'Construction Technology', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'walls', name: 'Walls', enabled: false, allowedType: '', brand: '', size: '' },
];

export const INITIAL_FLOORING_SPECS: SpecItem[] = [
  { id: 'dining_room_tiles', name: 'Dining Room Tiles', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'utility_flooring', name: 'Utility Flooring', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'master_bedroom_tiles', name: 'Master Bedroom Tiles', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'kitchen_flooring', name: 'Kitchen Flooring', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'living_room_tiles', name: 'Living Room Tiles', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'corridor_flooring', name: 'Corridor Flooring', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'staircase_flooring', name: 'Staircase Flooring', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'bathroom_flooring', name: 'Bathroom Flooring', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'bedroom_tiles', name: 'Bedroom Tiles', enabled: false, allowedType: '', brand: '', size: '' },
  { id: 'balcony_flooring', name: 'Balcony Flooring', enabled: false, allowedType: '', brand: '', size: '' },
];

export const INITIAL_SPECIFICATIONS_DATA: SpecificationsFormData = {
  structureItems: INITIAL_STRUCTURE_SPECS,
  flooringItems: INITIAL_FLOORING_SPECS,
  utility: '',
  electrical: '',
  plumbing: '',
  fireAndSafety: '',
  safetyAndSecurity: '',
  dgBackup: '',
  selectedConstructionType: '',
  doorHeight: '',
  status: 'Active',
};

export const sectionInfo = {
  id: '07',
  name: 'Specifications',
  slug: '07_specifications',
};

export const initialSpecificationsData = {
  id: '07',
  name: 'Specifications',
  description: 'Flooring, fittings, electrical specs, structure details, and finishings',
};

export type SpecificationsData = SpecificationsFormData;
