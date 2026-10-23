import {
  type InventoryVariant,
  type InventoryCommonConfig,
  createDefaultVariant,
} from './Configuration/data';

export interface InventoryRootState {
  activeSubTab: 'Configurations' | 'Preview & Totals';
  commonConfig: InventoryCommonConfig;
  variants: InventoryVariant[];
  status: 'Active' | 'Inactive';
}

export const INITIAL_INVENTORY_ROOT_DATA: InventoryRootState = {
  activeSubTab: 'Configurations',
  commonConfig: {
    commonAreaCal: '% Only',
    loadingFactor: '',
  },
  variants: [
    createDefaultVariant(1, 'Tower 1'),
    createDefaultVariant(2, 'Tower 1'),
  ],
  status: 'Active',
};

export const sectionInfo = {
  id: '04',
  name: 'Inventory',
  slug: '04_inventory',
};

export const initialInventoryData = {
  id: '04',
  name: 'Inventory',
  description: 'Unit configurations, flat sizes, facing, floor plans, and real-time inventory preview matrix',
};

export type InventoryData = InventoryRootState;

export { createDefaultVariant };
