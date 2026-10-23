export interface ApprovalAuthorityOption {
  id: string;
  option: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ApprovalsFormData {
  approvingAuthority: string;
  approvalCopyFile: string | null;
  completionDate: string;
  handOver: string;
  handOverDate: string;
  remarks: string;
  
  reraRegistered: 'Yes' | 'No';
  reraRegistrationNumber: string;
  reraValidUpto: string;
  reraFile: string | null;
  reraApprovalDate: string;
  approvalDate: string;
  
  ocReceived: string;
  ocApprovalDates: string;
  
  ccNumber: string;
  ccDate: string;
  
  status: 'Active' | 'Inactive';
}

export const INITIAL_AUTHORITY_OPTIONS: ApprovalAuthorityOption[] = [
  { id: '1', option: 'GHMC', status: 'ACTIVE' },
  { id: '2', option: 'HMDA', status: 'ACTIVE' },
  { id: '3', option: 'DTCP', status: 'ACTIVE' },
  { id: '4', option: 'BDA', status: 'ACTIVE' },
  { id: '5', option: 'BBMP', status: 'ACTIVE' },
  { id: '6', option: 'BMRDA', status: 'INACTIVE' },
];

export const HANDOVER_STATUS_OPTIONS = [
  'Select HandOver Status',
  'Ready to Move',
  'Ready to Move (DL Received)',
  'Ready to Move (OC Received)',
  'Under Construction',
] as const;

export const OC_RECEIVED_OPTIONS = [
  'Select',
  'Yes',
  'No',
  'Partially Received',
  'Applied / In Process',
] as const;

export const INITIAL_APPROVALS_DATA: ApprovalsFormData = {
  approvingAuthority: '',
  approvalCopyFile: null,
  completionDate: '30-11-2026',
  handOver: 'Under Construction',
  handOverDate: '31-05-2027',
  remarks: 'Demo project data for presentation purposes',
  
  reraRegistered: 'Yes',
  reraRegistrationNumber: 'P02400123456',
  reraValidUpto: '',
  reraFile: null,
  reraApprovalDate: '15-09-2023',
  approvalDate: '15-09-2023',
  
  ocReceived: '',
  ocApprovalDates: '',
  
  ccNumber: 'CC/2024/1103',
  ccDate: '01-08-2024',
  
  status: 'Active',
};

export const sectionInfo = {
  id: '05',
  name: 'Approvals',
  slug: '05_approvals',
};

export const initialApprovalsData = {
  id: '05',
  name: 'Approvals',
  description: 'Legal sanctions, approving authorities, RERA certificates, OC, and CC documentation',
};

export type ApprovalsData = ApprovalsFormData;
