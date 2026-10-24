export interface ProjectTabItem {
  id: string;
  label: string;
  slug: string;
  iconType?: string;
  badge?: string;
  disabled?: boolean;
}

export const PROJECT_TABS: ProjectTabItem[] = [
  { id: '01', label: 'Location-For all', slug: 'location-for-all', iconType: 'location' },
  { id: '02', label: 'Essentials', slug: 'essentials', iconType: 'essentials' },
  { id: '03', label: 'Layout', slug: 'layout', iconType: 'layout' },
  { id: '04', label: 'Inventory', slug: 'inventory', iconType: 'inventory' },
  { id: '05', label: 'Approvals', slug: 'approvals', iconType: 'approvals' },
  { id: '06', label: 'Amenities', slug: 'amenities', iconType: 'amenities' },
  { id: '07', label: 'Specifications', slug: 'specifications', iconType: 'specifications' },
  { id: '08', label: 'Utilities & Infra', slug: 'utilities-infra', iconType: 'utilities' },
  { id: '09', label: 'Finance', slug: 'financials', iconType: 'finance' },
  { id: '10', label: 'Media Files', slug: 'media-files', iconType: 'media' },
];

export default PROJECT_TABS;
