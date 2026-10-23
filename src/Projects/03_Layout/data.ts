export interface LayoutData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialLayoutData: LayoutData = {
  id: '03',
  name: 'Layout',
  description: 'Master plans, floor layouts, spatial configurations, and block structures',
  fields: {},
};

export const sectionInfo = {
  id: '03',
  name: 'Layout',
  slug: '03_layout',
};
