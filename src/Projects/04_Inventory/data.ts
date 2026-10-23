export interface InventoryData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialInventoryData: InventoryData = {
  id: '04',
  name: 'Inventory',
  description: 'Unit availability, pricing tiers, flat sizes, facing, and status matrix',
  fields: {},
};

export const sectionInfo = {
  id: '04',
  name: 'Inventory',
  slug: '04_inventory',
};
