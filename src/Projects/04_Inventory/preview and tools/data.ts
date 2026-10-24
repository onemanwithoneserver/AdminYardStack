import { type InventoryVariant, createDefaultVariant } from '../Configuration/data';

export interface PreviewFilters {
  tower: string;
  facing: string;
  availability: string;
  searchQuery: string;
}

export interface TowerTotalSummary {
  tower: string;
  variants: number;
  units: number;
  saleableArea: number;
  builtUpArea: number;
  availableCount: number;
  holdCount: number;
  soldOutCount: number;
}

export const INITIAL_PREVIEW_FILTERS: PreviewFilters = {
  tower: 'All',
  facing: 'All',
  availability: 'All',
  searchQuery: '',
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
        availableCount: 0,
        holdCount: 0,
        soldOutCount: 0,
      };
    }
    map[tower].variants += 1;
    const flatsCount = v.flatNo ? v.flatNo.split(',').filter(Boolean).length : 4;
    map[tower].units += flatsCount > 0 ? flatsCount : 1;

    const saleable = parseFloat(v.saleableArea) || 0;
    const builtUp = parseFloat(v.builtUpArea) || 0;
    map[tower].saleableArea += saleable;
    map[tower].builtUpArea += builtUp;

    const status = v.variantAvailable || 'Available';
    if (status === 'Available') map[tower].availableCount += 1;
    else if (status === 'Hold') map[tower].holdCount += 1;
    else if (status === 'Sold Out') map[tower].soldOutCount += 1;
    else map[tower].availableCount += 1;
  });

  return Object.values(map);
};

export { createDefaultVariant };
