export interface LocationForAllData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialLocationForAllData: LocationForAllData = {
  id: '01',
  name: 'Location-For all',
  description: 'Seller & subscription entitlement, location coordinates, maps, landmarks and boundaries',
  fields: {},
};

export const sectionInfo = {
  id: '01',
  name: 'Location-For all',
  slug: '01_location_for_all',
};
