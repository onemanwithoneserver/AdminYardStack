export interface PaymentStage {
  id: string;
  stageName: string;
  percentage: string;
  milestone: string;
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
  chargeType: 'Fixed' | 'Per SFT';
  appliedTo: string;
}

export interface BankOption {
  id: string;
  name: string;
  selected: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FinancialsFormData {
  paymentPlans: PaymentPlanOption[];
  activePaymentPlanId: string | null;
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
      { id: 'stg_1', stageName: 'Booking Token', percentage: '5', milestone: 'At the time of booking' },
      { id: 'stg_2', stageName: 'Agreement Signing', percentage: '5', milestone: 'Within 30 days of booking' },
      { id: 'stg_3', stageName: 'Balance Payment', percentage: '90', milestone: 'Bank loan disbursement' },
    ],
  },
  {
    id: 'plan_custom',
    name: 'Customized Payment Plan',
    selected: false,
    stages: [
      { id: 'stg_c1', stageName: 'On Booking', percentage: '10', milestone: 'Booking date' },
      { id: 'stg_c2', stageName: 'Custom Installment 1', percentage: '40', milestone: 'On Plinth completion' },
      { id: 'stg_c3', stageName: 'Custom Installment 2', percentage: '50', milestone: 'On Handover' },
    ],
  },
  {
    id: 'plan_otp',
    name: '100% Payment - OTP',
    selected: false,
    stages: [
      { id: 'stg_o1', stageName: 'Full Upfront Payment', percentage: '100', milestone: 'Within 15 days of booking' },
    ],
  },
  {
    id: 'plan_clp',
    name: 'Construction Linked Payment',
    selected: false,
    stages: [
      { id: 'stg_clp1', stageName: 'On Booking', percentage: '10', milestone: 'Booking amount' },
      { id: 'stg_clp2', stageName: 'On Foundation', percentage: '15', milestone: 'Foundation casting' },
      { id: 'stg_clp3', stageName: 'On 1st Slab', percentage: '10', milestone: '1st floor slab' },
      { id: 'stg_clp4', stageName: 'On Structure', percentage: '40', milestone: 'Super structure' },
      { id: 'stg_clp5', stageName: 'On Possession', percentage: '25', milestone: 'Handover / Registration' },
    ],
  },
  {
    id: 'plan_emi_holiday',
    name: 'EMI Holiday',
    selected: false,
    stages: [
      { id: 'stg_e1', stageName: 'Down Payment', percentage: '20', milestone: 'At booking' },
      { id: 'stg_e2', stageName: 'EMI Holiday Period', percentage: '0', milestone: 'No Pre-EMI till possession' },
      { id: 'stg_e3', stageName: 'On Possession', percentage: '80', milestone: 'Regular EMI commences' },
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
  activePaymentPlanId: null,
  variantPricingFields: [],
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
  description: 'Payment plans, milestone schedules, taxes, bank tie-ups, and subsidy schemes',
};

export type FinancialsData = FinancialsFormData;
