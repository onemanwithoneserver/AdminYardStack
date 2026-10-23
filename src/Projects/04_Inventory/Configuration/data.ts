export interface RoomItem {
  id: string;
  roomName: string;
  length: string;
  breadth: string;
  size: string;
  relatedTo: string;
}

export interface InventoryVariant {
  id: string;
  variantNumber: number;
  towerName: string;
  isCollapsed: boolean;
  variantNo: string;
  unitType: string;
  facing: string;
  saleableArea: string;
  commonArea: string;
  uds: string;
  selectedTowers: string[];
  plinthArea: string;
  builtUpArea: string;
  carpetArea: string;
  balconyArea: string;
  utilityArea: string;
  noOfBalconies: string;
  ceilingHeight: string;
  designatedAreas: string[];
  wallStructure: string;
  floorPlanType: string;
  variantAvailable: string;
  rooms: RoomItem[];
  baseCost: string;
  floorPlan2D: string | null;
  floorPlan3D: string | null;
  
  seriesNo: string;
  floorsRegular: string;
  floorsShrinked: string;
  flatNo: string;
  inventoryOwner: string;
  flatStatus: string;
}

export interface InventoryCommonConfig {
  commonAreaCal: '% Only' | '% of Saleable Area';
  loadingFactor: string;
}

export interface InventoryConfigurationState {
  commonConfig: InventoryCommonConfig;
  variants: InventoryVariant[];
  status: 'Active' | 'Inactive';
}

export const UNIT_TYPES = ['Select', '1 BHK', '2 BHK', '2.5 BHK', '3 BHK', '3.5 BHK', '4 BHK', '5 BHK', 'Penthouse', 'Villa'];
export const FACING_OPTIONS = ['Select', 'East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];
export const WALL_STRUCTURES = ['Select', 'RCC Shear Wall', 'RCC Framed Structure', 'AAC Block Masonry', 'Fly Ash Brick'];
export const FLOOR_PLAN_TYPES = ['Select', 'Regular', 'Duplex', 'Penthouse', 'Simplex'];
export const VARIANT_AVAILABILITY = ['Select', 'Available', 'Hold', 'Sold Out'];
export const DESIGNATED_AREAS_LIST = ['None', 'Puja Room', 'Dressing', 'Study', 'Home Theater', 'Maid Room'];
export const AVAILABLE_TOWERS = ['Tower 1', 'Tower 2', 'Tower 3', 'Tower 4', 'Tower 5', 'Tower 6'];

export const createDefaultVariant = (num: number, tower = 'Tower 1'): InventoryVariant => ({
  id: `variant-${num}-${Date.now()}`,
  variantNumber: num,
  towerName: tower,
  isCollapsed: false,
  variantNo: `${num}`,
  unitType: '',
  facing: '',
  saleableArea: '',
  commonArea: '',
  uds: '',
  selectedTowers: [tower],
  plinthArea: '',
  builtUpArea: '',
  carpetArea: '',
  balconyArea: '',
  utilityArea: '',
  noOfBalconies: '',
  ceilingHeight: '',
  designatedAreas: ['None'],
  wallStructure: '',
  floorPlanType: '',
  variantAvailable: '',
  rooms: [],
  baseCost: '0',
  floorPlan2D: null,
  floorPlan3D: null,
  seriesNo: '',
  floorsRegular: '',
  floorsShrinked: '',
  flatNo: `10${num}`,
  inventoryOwner: 'Builder',
  flatStatus: 'Available',
});

export const INITIAL_CONFIGURATION_DATA: InventoryConfigurationState = {
  commonConfig: {
    commonAreaCal: '% Only',
    loadingFactor: '',
  },
  variants: [createDefaultVariant(1, 'Tower 1')],
  status: 'Active',
};
