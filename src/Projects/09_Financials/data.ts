export interface FinancialsData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialFinancialsData: FinancialsData = {
  id: '09',
  name: 'Financials',
  description: 'Payment plans, milestone schedules, taxes, bank tie-ups, and subsidy schemes',
  fields: {},
};

export const sectionInfo = {
  id: '09',
  name: 'Financials',
  slug: '09_financials',
};
