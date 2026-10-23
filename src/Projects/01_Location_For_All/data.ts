export interface OrrExit {
  id: string;
  exitNumber: string;
  location: string;
  lat: string;
  lng: string;
}

export interface HighwayItem {
  id: string;
  name: string;
  details: string;
  lat: string;
  lng: string;
}

export interface OrrZoningOption {
  id: string;
  option: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LocationFormData {
  seller: string;
  activeSaleSubscription: string;
  state: string;
  city: string;
  microMarket: string;
  corporations: string;
  zones: string;
  circles: string;
  developmentType: string;
  projectName: string;
  projectLogo: string | null;
  builderName: string;
  optionsLocked: boolean;
  country: string;
  district: string;
  locationName: string;
  selectedOrrZoning: string;
  googleLocation: string;
  latitude: string;
  longitude: string;
  pincode: string;
  orrExits: OrrExit[];
  highways: HighwayItem[];
  subRegistrarOffice: string;
  projectEntranceFacing: string;
  projectUsp: string;
  status: 'Active' | 'Inactive';
}

export const INITIAL_ORR_ZONING_OPTIONS: OrrZoningOption[] = [
  { id: '1', option: 'Residential Commercial Growth Corridor', status: 'ACTIVE' },
  { id: '2', option: 'Special Development Zone (SDZ)', status: 'ACTIVE' },
  { id: '3', option: 'Conservation Zone', status: 'INACTIVE' },
  { id: '4', option: 'Multipurpose Zone', status: 'ACTIVE' },
];

export const INITIAL_LOCATION_DATA: LocationFormData = {
  seller: '',
  activeSaleSubscription: '',
  state: '',
  city: '',
  microMarket: '',
  corporations: '',
  zones: '',
  circles: '',
  developmentType: 'Flats',
  projectName: '',
  projectLogo: null,
  builderName: '',
  optionsLocked: false,
  country: '',
  district: '',
  locationName: '',
  selectedOrrZoning: '',
  googleLocation: '',
  latitude: '',
  longitude: '',
  pincode: '',
  orrExits: [],
  highways: [],
  subRegistrarOffice: '',
  projectEntranceFacing: '',
  projectUsp: '',
  status: 'Active',
};

export const sectionInfo = {
  id: '01',
  name: 'Location-For all',
  slug: '01_location_for_all',
};

export const initialLocationForAllData = {
  id: '01',
  name: 'Location-For all',
  description: 'Seller & subscription entitlement, location coordinates, maps, landmarks and boundaries',
};

export type LocationForAllData = LocationFormData;
