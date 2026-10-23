export interface EssentialsData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialEssentialsData: EssentialsData = {
  id: '02',
  name: 'Essentials',
  description: 'Core project metadata, classification, RERA numbers, and basic parameters',
  fields: {},
};

export const sectionInfo = {
  id: '02',
  name: 'Essentials',
  slug: '02_essentials',
};
