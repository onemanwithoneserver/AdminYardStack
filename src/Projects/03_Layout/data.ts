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
  'Select HandOver Status',
  'Ready to Move',
  'Ready to Move (DL Received)',
  'Ready to Move (OC Received)',
  'Under Construction',
] as const;

export const INITIAL_TOWERS_OVERVIEW: TowerRow[] = [
  {
    id: 'row-1',
    towerName: 'Tower 1',
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
    handOver: 'Ready to Move',
    basePrice: '',
    flatToFlatDistance: '',
  },
  {
    id: 'row-2',
    towerName: 'Tower 2',
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
    handOver: 'Select HandOver Status',
    basePrice: '',
    flatToFlatDistance: '',
  },
  {
    id: 'row-3',
    towerName: 'Tower 3',
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
    handOver: 'Select HandOver Status',
    basePrice: '',
    flatToFlatDistance: '',
  },
  {
    id: 'row-4',
    towerName: 'Tower 4',
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
    handOver: 'Ready to Move (DL Received)',
    basePrice: '',
    flatToFlatDistance: '',
  },
  {
    id: 'row-5',
    towerName: 'Tower 5',
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
    handOver: 'Select HandOver Status',
    basePrice: '',
    flatToFlatDistance: '',
  },
  {
    id: 'row-6',
    towerName: 'Tower 6',
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
    handOver: 'Under Construction',
    basePrice: '',
    flatToFlatDistance: '',
  },
];

export const INITIAL_LAYOUT_DATA: LayoutFormData = {
  completionDate: '',
  handOver: 'Under Construction',
  status: 'Active',
  tables: [
    {
      id: 'table-1',
      tableName: 'Tower Inventory Table 1',
      towerName: 'Towers 1 - 6',
      rows: INITIAL_TOWERS_OVERVIEW,
    },
  ],
};

export const createNewTowerRow = (towerNumber: number): TowerRow => ({
  id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  towerName: `Tower ${towerNumber}`,
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
  handOver: 'Select HandOver Status',
  basePrice: '',
  flatToFlatDistance: '',
});

export const createNewTowerTable = (
  tableIndex: number,
  towerName?: string
): TowerTable => {
  const name = towerName?.trim() || `Tower ${tableIndex}`;
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
        handOver: 'Under Construction',
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
