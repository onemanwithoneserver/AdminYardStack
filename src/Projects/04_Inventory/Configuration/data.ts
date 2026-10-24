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
  variantNo: `VAR-0${num}`,
  unitType: num === 1 ? '3 BHK' : num === 2 ? '2 BHK' : '3 BHK',
  facing: num === 1 ? 'East' : num === 2 ? 'West' : 'North',
  saleableArea: num === 1 ? '1750' : num === 2 ? '1280' : '1650',
  commonArea: num === 1 ? '350' : num === 2 ? '256' : '330',
  uds: num === 1 ? '48' : num === 2 ? '35' : '45',
  selectedTowers: [tower],
  plinthArea: num === 1 ? '1480' : num === 2 ? '1080' : '1390',
  builtUpArea: num === 1 ? '1400' : num === 2 ? '1024' : '1320',
  carpetArea: num === 1 ? '1220' : num === 2 ? '895' : '1150',
  balconyArea: num === 1 ? '110' : num === 2 ? '75' : '95',
  utilityArea: num === 1 ? '45' : num === 2 ? '35' : '40',
  noOfBalconies: num === 1 ? '2' : '1',
  ceilingHeight: '10.5',
  designatedAreas: num === 1 ? ['Puja Room', 'Study'] : ['Puja Room'],
  wallStructure: 'RCC Shear Wall',
  floorPlanType: 'Regular',
  variantAvailable: 'Available',
  rooms: num === 1 ? [
    { id: 'room-1', roomName: 'Master Bedroom', length: '14', breadth: '16', size: '224 Sqft', relatedTo: 'Corridor' },
    { id: 'room-2', roomName: 'Living & Dining', length: '16', breadth: '22', size: '352 Sqft', relatedTo: 'Foyer' },
    { id: 'room-3', roomName: 'Kitchen', length: '10', breadth: '12', size: '120 Sqft', relatedTo: 'Dining' },
  ] : [
    { id: 'room-21', roomName: 'Master Bedroom', length: '12', breadth: '14', size: '168 Sqft', relatedTo: 'Corridor' },
    { id: 'room-22', roomName: 'Living & Dining', length: '14', breadth: '18', size: '252 Sqft', relatedTo: 'Foyer' },
  ],
  baseCost: num === 1 ? '9850000' : num === 2 ? '7200000' : '9200000',
  floorPlan2D: null,
  floorPlan3D: null,
  seriesNo: `SER-0${num}`,
  floorsRegular: '1 to 14',
  floorsShrinked: '',
  flatNo: num === 1 ? '101, 201, 301, 401' : '102, 202, 302, 402',
  inventoryOwner: 'Builder',
  flatStatus: 'Available',
});

export const INITIAL_CONFIGURATION_DATA: InventoryConfigurationState = {
  commonConfig: {
    commonAreaCal: '% Only',
    loadingFactor: '20',
  },
  variants: [
    createDefaultVariant(1, 'Tower 1'),
    createDefaultVariant(2, 'Tower 1'),
  ],
  status: 'Active',
};
