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
  seller: 'prasadsa@gmail.com',
  activeSaleSubscription: '',
  state: 'Telangana',
  city: '',
  microMarket: '',
  corporations: '',
  zones: '',
  circles: '',
  developmentType: 'Flats',
  projectName: 'Gully Heights Phase 2',
  projectLogo: null,
  builderName: 'BUILDER SM 007',
  optionsLocked: true,
  country: 'India',
  district: 'Ranga Reddy',
  locationName: 'Financial District',
  selectedOrrZoning: '',
  googleLocation: 'CHHM+47P, Prashash Nagar, Khairatabad, Hyderabad, Telangana 500096, India',
  latitude: '17.424177',
  longitude: '78.3651',
  pincode: '500032',
  orrExits: [
    { id: '1', exitNumber: '01', location: 'Nanakramguda', lat: '17.4122', lng: '78.3395' },
    { id: '2', exitNumber: '02', location: 'Narsingi', lat: '17.3894', lng: '78.3541' },
  ],
  highways: [
    { id: '1', name: 'NH 44', details: 'Bengaluru - Hyderabad Highway', lat: '17.2620', lng: '78.4754' },
    { id: '2', name: 'NH 65', details: 'Pune - Hyderabad Highway', lat: '17.5050', lng: '78.2987' },
  ],
  subRegistrarOffice: '',
  projectEntranceFacing: 'East',
  projectUsp: `• Gated community with dual clubhouses
• Separate central park with walking track
• Smart security with facial access
• 100% Vastu compliant floor plans
• 25,000 sq.ft. amenities hub`,
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

