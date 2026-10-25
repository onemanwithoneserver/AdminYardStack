export interface PaymentStage {
  id: string;
  milestone: string;
  percentage: string;
}

export interface PaymentPlanOption {
  id: string;
  name: string;
  selected: boolean;
  stages: PaymentStage[];
}

export interface VariantPricingField {
  id: string;
  fieldName: string;
  amount: string;
  chargeType: 'Lump Sum' | 'Per SFT';
}

export interface BankOption {
  id: string;
  name: string;
  selected: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FinancialsFormData {
  paymentPlans: PaymentPlanOption[];
  variantPricingFields: VariantPricingField[];
  banks: BankOption[];
  status: 'Active' | 'Inactive';
}

export const INITIAL_PAYMENT_PLANS: PaymentPlanOption[] = [
  {
    id: 'plan_low_dp',
    name: 'Low Down Payment (5 to 10%)',
    selected: false,
    stages: [
      { id: 'stg_1', milestone: 'Booking, construction milestone...', percentage: '0' },
    ],
  },
  {
    id: 'plan_custom',
    name: 'Customized Payment Plans',
    selected: false,
    stages: [
      { id: 'stg_c1', milestone: 'Booking, construction milestone...', percentage: '0' },
    ],
  },
  {
    id: 'plan_otp',
    name: '100% Payment - OTP',
    selected: false,
    stages: [
      { id: 'stg_o1', milestone: 'Booking, construction milestone...', percentage: '0' },
    ],
  },
  {
    id: 'plan_clp',
    name: 'Construction Linked Payment',
    selected: false,
    stages: [
      { id: 'stg_clp1', milestone: 'Booking, construction milestone...', percentage: '0' },
    ],
  },
  {
    id: 'plan_emi_holiday',
    name: 'EMI Holiday',
    selected: false,
    stages: [
      { id: 'stg_e1', milestone: 'Booking, construction milestone...', percentage: '0' },
    ],
  },
];

export const INITIAL_BANKS: BankOption[] = [
  
  { id: 'bank_axis', name: 'Axis Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_pnb', name: 'Punjab National Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_sbi', name: 'SBI Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_kotak', name: 'Kotak Mahindra Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_union', name: 'Union Bank of India', selected: false, status: 'ACTIVE' },

  
  { id: 'bank_uco', name: 'UCO', selected: false, status: 'ACTIVE' },
  { id: 'bank_canara', name: 'Canara Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_cbi', name: 'Central Bank of India', selected: false, status: 'ACTIVE' },
  { id: 'bank_hdfc', name: 'HDFC Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_boi', name: 'Bank of India', selected: false, status: 'ACTIVE' },

  
  { id: 'bank_iob', name: 'Indian Overseas Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_yes', name: 'YES Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_indian', name: 'Indian Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_idfc', name: 'IDFC Bank', selected: false, status: 'ACTIVE' },

  
  { id: 'bank_icici', name: 'ICICI Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_federal', name: 'Federal Bank', selected: false, status: 'ACTIVE' },
  { id: 'bank_bom', name: 'Bank of Maharashtra', selected: false, status: 'ACTIVE' },
  { id: 'bank_indusind', name: 'IndusInd Bank', selected: false, status: 'ACTIVE' },
];

export const INITIAL_FINANCIALS_DATA: FinancialsFormData = {
  paymentPlans: INITIAL_PAYMENT_PLANS,
  variantPricingFields: [
    {
      id: 'vp_1',
      fieldName: 'Club house Cost',
      amount: '100000',
      chargeType: 'Lump Sum',
    },
  ],
  banks: INITIAL_BANKS,
  status: 'Active',
};

export const sectionInfo = {
  id: '09',
  name: 'Financials',
  slug: '09_financials',
};

export const initialFinancialsData = {
  id: '09',
  name: 'Financials',
  description: 'Payment plans, milestone schedules, variant pricing, and banking tie-ups',
};

export type FinancialsData = FinancialsFormData;
