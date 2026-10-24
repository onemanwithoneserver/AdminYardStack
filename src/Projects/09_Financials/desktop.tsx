import { useState, type FormEvent } from 'react';
import { CreditCard, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import {
  INITIAL_FINANCIALS_DATA,
  type FinancialsFormData,
  type PaymentPlanOption,
  type VariantPricingField,
  type BankOption,
} from './data';

interface AddPaymentPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function AddPaymentPlanDialog({
  isOpen,
  onClose,
  onSave,
}: AddPaymentPlanDialogProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[4px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Add Payment Plan
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Enter name for the new payment scheme.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[2px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Plan Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 20:80 Possession Linked Plan"
              required
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddPricingFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Omit<VariantPricingField, 'id'>) => void;
}

export function AddPricingFieldDialog({
  isOpen,
  onClose,
  onSave,
}: AddPricingFieldDialogProps) {
  const [fieldName, setFieldName] = useState('');
  const [amount, setAmount] = useState('');
  const [chargeType, setChargeType] = useState<'Fixed' | 'Per SFT'>('Fixed');
  const [appliedTo, setAppliedTo] = useState('All Variants');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim() || !amount.trim()) return;
    onSave({
      fieldName: fieldName.trim(),
      amount: amount.trim(),
      chargeType,
      appliedTo,
    });
    setFieldName('');
    setAmount('');
    setChargeType('Fixed');
    setAppliedTo('All Variants');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[4px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Add Pricing Field
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Enter raw amount and select the inventory variant it applies to.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[2px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Field Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g. Clubhouse Fee or Corpus Fund"
              required
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (INR) <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 150000"
              required
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Charge Type
              </label>
              <ModernDropdown<'Fixed' | 'Per SFT'>
                value={chargeType}
                onChange={(val) => setChargeType(val)}
                options={['Fixed', 'Per SFT']}
                placeholder="Select Charge Type"
                roundedClass="rounded-[4px]"
                className="w-full"
                buttonClassName="w-full h-9 px-2.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Applied To
              </label>
              <ModernDropdown<string>
                value={appliedTo}
                onChange={(val) => setAppliedTo(val)}
                options={['All Variants', 'Variant 1', 'Variant 2', 'Variant 3']}
                placeholder="Select Applied To"
                roundedClass="rounded-[4px]"
                className="w-full"
                buttonClassName="w-full h-9 px-2.5 text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddBankDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function AddBankDialog({ isOpen, onClose, onSave }: AddBankDialogProps) {
  const [bankName, setBankName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bankName.trim()) return;
    onSave(bankName.trim());
    setBankName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[4px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Add Bank</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Enter approved lender or financial institution.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[2px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Bank Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. HDFC Bank, SBI"
              required
              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FinancialsDesktop() {
  const [formData, setFormData] = useState<FinancialsFormData>(
    INITIAL_FINANCIALS_DATA
  );
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleTogglePlan = (planId: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentPlans: prev.paymentPlans.map((p) =>
        p.id === planId ? { ...p, selected: !p.selected } : p
      ),
      activePaymentPlanId:
        prev.activePaymentPlanId === planId ? null : planId,
    }));
  };

  const handleAddPaymentPlan = (name: string) => {
    const newPlan: PaymentPlanOption = {
      id: `plan_${Date.now()}`,
      name,
      selected: true,
      stages: [
        { id: `stg_1`, stageName: 'Booking', percentage: '10', milestone: 'On booking' },
        { id: `stg_2`, stageName: 'Final', percentage: '90', milestone: 'On possession' },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      paymentPlans: [...prev.paymentPlans, newPlan],
      activePaymentPlanId: newPlan.id,
    }));
  };

  const handleAddPricingField = (
    field: Omit<VariantPricingField, 'id'>
  ) => {
    const newField: VariantPricingField = {
      id: `price_${Date.now()}`,
      ...field,
    };
    setFormData((prev) => ({
      ...prev,
      variantPricingFields: [...prev.variantPricingFields, newField],
    }));
  };

  const handleDeletePricingField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      variantPricingFields: prev.variantPricingFields.filter((f) => f.id !== id),
    }));
  };

  const handleToggleBank = (bankId: string) => {
    setFormData((prev) => ({
      ...prev,
      banks: prev.banks.map((b) =>
        b.id === bankId ? { ...b, selected: !b.selected } : b
      ),
    }));
  };

  const handleAddBank = (name: string) => {
    const newBank: BankOption = {
      id: `bank_${Date.now()}`,
      name,
      selected: true,
      status: 'ACTIVE',
    };
    setFormData((prev) => ({
      ...prev,
      banks: [...prev.banks, newBank],
    }));
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const selectedPlan = formData.paymentPlans.find(
    (p) => p.id === formData.activePaymentPlanId
  );

  return (
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Finance settings saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white shadow-xs shadow-violet-500/20">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Financials
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Payment plans, milestone breakdown, statutory charges, tax schedules and banking partners
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        {/* Section 1: Payment Types */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Payment Plans & Milestone Schedules
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPlanDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Add Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {formData.paymentPlans.map((plan) => {
              const isSelected = plan.selected;
              const isActivePlan = formData.activePaymentPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-[4px] border transition-all cursor-pointer select-none text-xs ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-medium shadow-2xs'
                      : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/15'
                  }`}
                  onClick={() => handleTogglePlan(plan.id)}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="truncate">{plan.name}</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {plan.stages.length} stages
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Select a payment type to view and verify its milestone stages.
          </p>

          {selectedPlan && (
            <div className="mt-2 p-4 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-display">
                  Payment Stages: {selectedPlan.name}
                </span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold font-mono">
                  {selectedPlan.stages.length} Stages Configured
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200/80 dark:divide-white/10">
                  <thead className="bg-white/80 dark:bg-slate-900/60 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="py-2 px-3">Stage Name</th>
                      <th className="py-2 px-3">Percentage (%)</th>
                      <th className="py-2 px-3">Milestone Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-900/40">
                    {selectedPlan.stages.map((stg) => (
                      <tr key={stg.id}>
                        <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {stg.stageName}
                        </td>
                        <td className="py-2 px-3 text-blue-600 dark:text-blue-400 font-bold font-mono">
                          {stg.percentage}%
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {stg.milestone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Variant Pricing */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Variant Pricing & Ancillary Charges
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPricingDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Add Pricing Field</span>
            </button>
          </div>

          {formData.variantPricingFields.length > 0 ? (
            <div className="border border-slate-200/80 dark:border-white/10 rounded-[4px] overflow-hidden bg-white dark:bg-slate-900/40 shadow-2xs">
              <table className="w-full text-left text-xs divide-y divide-slate-200/80 dark:divide-white/10">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-3">Field Name</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Applied To</th>
                    <th className="py-2.5 px-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {formData.variantPricingFields.map((field) => (
                    <tr key={field.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-100">
                        {field.fieldName}
                      </td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-mono font-medium">
                        ₹{field.amount}
                      </td>
                      <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                        {field.chargeType}
                      </td>
                      <td className="py-2 px-3 text-blue-600 dark:text-blue-400 font-medium">
                        {field.appliedTo}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletePricingField(field.id)}
                          className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                          title="Delete pricing field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] p-4 text-center text-xs text-slate-500 dark:text-slate-400 italic">
              No additional variant pricing fields added. Click "Add Pricing Field" to configure extra charges.
            </div>
          )}
        </section>

        {/* Section 3: Banking Tie-ups */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                03
              </span>
              <span className="w-1 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Approved Banking Tie-ups & Home Loans
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsBankDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Add Bank</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
            {formData.banks.map((bank) => {
              const isChecked = bank.selected;
              return (
                <label
                  key={bank.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-[4px] border transition-all cursor-pointer select-none text-xs ${
                    isChecked
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-medium shadow-2xs'
                      : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/15'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleBank(bank.id)}
                    className="w-3.5 h-3.5 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="truncate">{bank.name}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      {/* Status Card - Placed at bottom left side */}
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 sm:p-3 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 h-4">
              <span>Status</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <ModernDropdown<'Active' | 'Inactive'>
              value={formData.status}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  status: val,
                }))
              }
              options={[
                {
                  value: 'Active',
                  label: 'Active',
                  icon: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1" />,
                },
                {
                  value: 'Inactive',
                  label: 'Inactive',
                  icon: <span className="w-2 h-2 rounded-full bg-slate-400 inline-block mr-1" />,
                },
              ]}
              dropUp={true}
              roundedClass="rounded-[4px]"
              className="w-auto inline-block"
              buttonClassName="w-auto h-8 px-2.5 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
            />
          </div>
        </div>
      </div>

      <AddPaymentPlanDialog
        isOpen={isPlanDialogOpen}
        onClose={() => setIsPlanDialogOpen(false)}
        onSave={handleAddPaymentPlan}
      />

      <AddPricingFieldDialog
        isOpen={isPricingDialogOpen}
        onClose={() => setIsPricingDialogOpen(false)}
        onSave={handleAddPricingField}
      />

      <AddBankDialog
        isOpen={isBankDialogOpen}
        onClose={() => setIsBankDialogOpen(false)}
        onSave={handleAddBank}
      />
    </div>
  );
}

export default FinancialsDesktop;
