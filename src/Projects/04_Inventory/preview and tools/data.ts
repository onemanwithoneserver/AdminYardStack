import { type InventoryVariant, createDefaultVariant } from '../Configuration/data';

export interface PreviewFilters {
  tower: string;
  facing: string;
  availability: string;
}

export interface TowerTotalSummary {
  tower: string;
  variants: number;
  units: number;
  saleableArea: number;
  builtUpArea: number;
}

export const INITIAL_PREVIEW_FILTERS: PreviewFilters = {
  tower: 'All',
  facing: 'All',
  availability: 'All',
};

export const computeTowerTotals = (
  variants: InventoryVariant[]
): TowerTotalSummary[] => {
  const map: Record<string, TowerTotalSummary> = {};

  variants.forEach((v) => {
    const tower = v.towerName || 'Tower 1';
    if (!map[tower]) {
      map[tower] = {
        tower,
        variants: 0,
        units: 0,
        saleableArea: 0,
        builtUpArea: 0,
      };
    }
    map[tower].variants += 1;
    const saleable = parseFloat(v.saleableArea) || 0;
    const builtUp = parseFloat(v.builtUpArea) || 0;
    map[tower].saleableArea += saleable;
    map[tower].builtUpArea += builtUp;
  });

  return Object.values(map);
};

export { createDefaultVariant };
