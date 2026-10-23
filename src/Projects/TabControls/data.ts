export interface ProjectTabItem {
  id: string;
  label: string;
  slug: string;
  badge?: string;
  disabled?: boolean;
}

export const PROJECT_TABS: ProjectTabItem[] = [
  { id: '01', label: 'Location-For all', slug: 'location-for-all' },
  { id: '02', label: 'Essentials', slug: 'essentials' },
  { id: '03', label: 'Layout', slug: 'layout' },
  { id: '04', label: 'Inventory', slug: 'inventory' },
  { id: '05', label: 'Approvals', slug: 'approvals' },
  { id: '06', label: 'Amenities', slug: 'amenities' },
  { id: '07', label: 'Specifications', slug: 'specifications' },
  { id: '08', label: 'Utilities & Infra', slug: 'utilities-infra' },
  { id: '09', label: 'Financials', slug: 'financials' },
  { id: '10', label: 'Media & Files', slug: 'media-files' },
];

export default PROJECT_TABS;
