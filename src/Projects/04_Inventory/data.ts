import { type InventoryVariant, type InventoryCommonConfig, createDefaultVariant } from './Configuration/data';

export interface InventoryRootState {
  activeSubTab: 'Configurations' | 'Preview & Totals';
  commonConfig: InventoryCommonConfig;
  variants: InventoryVariant[];
  status: 'Active' | 'Inactive';
}

export interface InventoryKPIs {
  totalVariants: number;
  totalTowers: number;
  totalSaleableArea: number;
  totalBuiltUpArea: number;
  avgCarpetArea: number;
  totalUnitsEstimate: number;
}

export function calculateInventoryKPIs(variants: InventoryVariant[]): InventoryKPIs {
  const towersSet = new Set<string>();
  let totalSaleable = 0;
  let totalBuiltUp = 0;
  let totalCarpet = 0;
  let totalUnits = 0;

  variants.forEach((v) => {
    if (v.towerName) towersSet.add(v.towerName);
    (v.selectedTowers || []).forEach((t) => towersSet.add(t));

    const s = parseFloat(v.saleableArea) || 0;
    const b = parseFloat(v.builtUpArea) || 0;
    const c = parseFloat(v.carpetArea) || 0;
    totalSaleable += s;
    totalBuiltUp += b;
    totalCarpet += c;

    
    const flatsCount = v.flatNo ? v.flatNo.split(',').filter(Boolean).length : 4;
    totalUnits += flatsCount > 0 ? flatsCount : 1;
  });

  return {
    totalVariants: variants.length,
    totalTowers: towersSet.size > 0 ? towersSet.size : 1,
    totalSaleableArea: Math.round(totalSaleable),
    totalBuiltUpArea: Math.round(totalBuiltUp),
    avgCarpetArea: variants.length > 0 ? Math.round(totalCarpet / variants.length) : 0,
    totalUnitsEstimate: totalUnits,
  };
}

export const INITIAL_INVENTORY_ROOT_DATA: InventoryRootState = {
  activeSubTab: 'Configurations',
  commonConfig: {
    commonAreaCal: '% Only',
    loadingFactor: '20',
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
