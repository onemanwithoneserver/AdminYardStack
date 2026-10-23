export interface SpecificationsData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialSpecificationsData: SpecificationsData = {
  id: '07',
  name: 'Specifications',
  description: 'Flooring, fittings, electrical specs, structure details, and finishings',
  fields: {},
};

export const sectionInfo = {
  id: '07',
  name: 'Specifications',
  slug: '07_specifications',
};
