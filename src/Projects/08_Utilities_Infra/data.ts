export interface UtilitiesInfraData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialUtilitiesInfraData: UtilitiesInfraData = {
  id: '08',
  name: 'Utilities & Infra',
  description: 'Power backup, water supply, sewage treatment, roads, and grid connections',
  fields: {},
};

export const sectionInfo = {
  id: '08',
  name: 'Utilities & Infra',
  slug: '08_utilities_infra',
};
