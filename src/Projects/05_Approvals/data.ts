export interface ApprovalsData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialApprovalsData: ApprovalsData = {
  id: '05',
  name: 'Approvals',
  description: 'Legal approvals, government clearances, environmental NOCs, and sanctions',
  fields: {},
};

export const sectionInfo = {
  id: '05',
  name: 'Approvals',
  slug: '05_approvals',
};
