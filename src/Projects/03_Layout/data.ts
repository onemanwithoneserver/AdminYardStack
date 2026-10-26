export interface TowerRow {
  id: string;
  towerName: string;
  noOfFloors: string;
  unitsPerFloor: string;
  parkingLevels: string;
  parkingLevelNames: string;
  noOfPassengerLifts: string;
  noOfServiceLifts: string;
  avgFlatCountPerLift: string;
  noOfStaircase: string;
  corridorWidth: string;
  lobbyAvailable: 'No' | 'Yes';
  completionDate: string;
  handOver: string;
  basePrice: string;
  flatToFlatDistance: string;
}

export interface TowerTable {
  id: string;
  tableName: string;
  towerName: string;
  rows: TowerRow[];
}

export interface LayoutFormData {
  completionDate: string;
  handOver: string;
  status: 'Active' | 'Inactive';
  tables: TowerTable[];
}

export const HANDOVER_OPTIONS = [
  'Ready to Move',
  'Ready to Move (DL Received)',
  'Ready to Move (OC Received)',
  'Under Construction',
] as const;

export const INITIAL_TOWERS_OVERVIEW: TowerRow[] = [
  {
    id: 'row-1',
    towerName: '',
    noOfFloors: '',
    unitsPerFloor: '',
    parkingLevels: '',
    parkingLevelNames: '',
    noOfPassengerLifts: '',
    noOfServiceLifts: '',
    avgFlatCountPerLift: '',
    noOfStaircase: '',
    corridorWidth: '',
    lobbyAvailable: 'No',
    completionDate: '',
    handOver: '',
    basePrice: '',
    flatToFlatDistance: '',
  },
];

export const INITIAL_LAYOUT_DATA: LayoutFormData = {
  completionDate: '',
  handOver: '',
  status: 'Active',
  tables: [
    {
      id: 'table-towers-overview',
      tableName: 'TOWERS OVERVIEW',
      towerName: 'Overview',
      rows: INITIAL_TOWERS_OVERVIEW,
    },
  ],
};

export const createNewTowerRow = (
  rowIndexOrName?: number | string,
  rowIndex?: number
): TowerRow => {
  const index = typeof rowIndexOrName === 'number' ? rowIndexOrName : rowIndex || 1;
  const name = typeof rowIndexOrName === 'string' ? rowIndexOrName : `Tower ${index}`;
  return {
    id: `row-${Date.now()}-${index}`,
    towerName: name,
    noOfFloors: '',
    unitsPerFloor: '',
    parkingLevels: '',
    parkingLevelNames: '',
    noOfPassengerLifts: '',
    noOfServiceLifts: '',
    avgFlatCountPerLift: '',
    noOfStaircase: '',
    corridorWidth: '',
    lobbyAvailable: 'No',
    completionDate: '',
    handOver: '',
    basePrice: '',
    flatToFlatDistance: '',
  };
};

export const duplicateTowerRow = (target: TowerRow): TowerRow => {
  return {
    ...target,
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    towerName: `${target.towerName || 'Tower'} (Copy)`,
  };
};

export const createNewTowerTable = (
  tableIndexOrName: number | string = 1,
  towerName?: string
): TowerTable => {
  const name =
    typeof tableIndexOrName === 'string'
      ? tableIndexOrName
      : towerName?.trim() || `Tower ${tableIndexOrName}`;
  return {
    id: `table-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tableName: `${name} Inventory Table`,
    towerName: name,
    rows: [
      {
        id: `row-${Date.now()}-1`,
        towerName: name,
        noOfFloors: '',
        unitsPerFloor: '',
        parkingLevels: '',
        parkingLevelNames: '',
        noOfPassengerLifts: '',
        noOfServiceLifts: '',
        avgFlatCountPerLift: '',
        noOfStaircase: '',
        corridorWidth: '',
        lobbyAvailable: 'No',
        completionDate: '',
        handOver: '',
        basePrice: '',
        flatToFlatDistance: '',
      },
    ],
  };
};

export const sectionInfo = {
  id: '03',
  name: 'Layout',
  slug: '03_layout',
};

export const initialLayoutData = {
  id: '03',
  name: 'Layout',
  description: 'Master plans, approval details, handover timelines, and tower-wise inventory specifications',
};

export type LayoutData = LayoutFormData;
