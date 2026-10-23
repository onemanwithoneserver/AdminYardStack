export interface AmenitiesData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialAmenitiesData: AmenitiesData = {
  id: '06',
  name: 'Amenities',
  description: 'Clubhouse, sports facilities, security systems, parks, and leisure zones',
  fields: {},
};

export const sectionInfo = {
  id: '06',
  name: 'Amenities',
  slug: '06_amenities',
};
