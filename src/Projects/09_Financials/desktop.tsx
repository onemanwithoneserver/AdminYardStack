import { useState, type FormEvent } from 'react';
import { CreditCard, X, Plus, Trash2 } from 'lucide-react';
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
              className="px-3.5 py-1.5 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Plan
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
              className="px-3.5 py-1.5 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddPricingFieldDialog(_props: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Omit<VariantPricingField, 'id'>) => void;
}) {
  return null;
}

export function FinancialsDesktop() {
  const [formData, setFormData] = useState<FinancialsFormData>(INITIAL_FINANCIALS_DATA);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);

  // Toggle plan selection in Section 01
  const handleTogglePlan = (planId: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentPlans: prev.paymentPlans.map((p) =>
        p.id === planId ? { ...p, selected: !p.selected } : p
      ),
    }));
  };

  // Add new payment plan
  const handleAddPaymentPlan = (name: string) => {
    const newPlan: PaymentPlanOption = {
      id: `plan_${Date.now()}`,
      name,
      selected: true,
      stages: [
        { id: `stg_${Date.now()}_1`, milestone: '', percentage: '0' },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      paymentPlans: [...prev.paymentPlans, newPlan],
    }));
  };

  // Add stage to a specific plan
  const handleAddStage = (planId: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentPlans: prev.paymentPlans.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          stages: [
            ...p.stages,
            { id: `stg_${Date.now()}`, milestone: '', percentage: '0' },
          ],
        };
      }),
    }));
  };

  // Update a stage in a plan
  const handleStageChange = (
    planId: string,
    stageId: string,
    field: 'milestone' | 'percentage',
    val: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      paymentPlans: prev.paymentPlans.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          stages: p.stages.map((s) =>
            s.id === stageId ? { ...s, [field]: val } : s
          ),
        };
      }),
    }));
  };

  // Remove a stage from a plan
  const handleRemoveStage = (planId: string, stageId: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentPlans: prev.paymentPlans.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          stages: p.stages.filter((s) => s.id !== stageId),
        };
      }),
    }));
  };

  // Add a variant pricing field inline
  const handleAddPricingField = () => {
    const newField: VariantPricingField = {
      id: `price_${Date.now()}`,
      fieldName: '',
      amount: '',
      chargeType: 'Lump Sum',
    };
    setFormData((prev) => ({
      ...prev,
      variantPricingFields: [...prev.variantPricingFields, newField],
    }));
  };

  // Update a variant pricing field
  const handleVariantPricingChange = (
    fieldId: string,
    key: keyof VariantPricingField,
    val: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      variantPricingFields: prev.variantPricingFields.map((f) =>
        f.id === fieldId ? { ...f, [key]: val } : f
      ),
    }));
  };

  // Delete a variant pricing field
  const handleDeletePricingField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      variantPricingFields: prev.variantPricingFields.filter((f) => f.id !== id),
    }));
  };

  // Toggle bank
  const handleToggleBank = (bankId: string) => {
    setFormData((prev) => ({
      ...prev,
      banks: prev.banks.map((b) =>
        b.id === bankId ? { ...b, selected: !b.selected } : b
      ),
    }));
  };

  // Add bank
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

  // Filter plans that are active based on Section 01 selection
  const activePlans = formData.paymentPlans.filter((p) => p.selected);

  return (
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
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
              Payment plans, milestone breakdown, variant pricing, and banking partners
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        {/* Section 01: Payment Types */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Payment Types
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPlanDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Payment Plan</span>
            </button>
          </div>

          {/* Checkboxes row matching Reference Image 1 */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-1">
            {formData.paymentPlans.map((plan) => (
              <label
                key={plan.id}
                className="inline-flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={plan.selected}
                  onChange={() => handleTogglePlan(plan.id)}
                  className="w-4 h-4 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>{plan.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Section 02: Payment Plan Milestone Schedules (Active based on Section 01) */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Payment Plan Stages
              </h3>
            </div>
          </div>

          {activePlans.length === 0 ? (
            <div className="p-5 text-center bg-slate-50/60 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-xs text-slate-500 dark:text-slate-400 italic">
              No payment plans selected. Check one or more payment types above to configure milestone stages.
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {activePlans.map((plan) => {
                const stageTotal = plan.stages.reduce(
                  (sum, s) => sum + (parseFloat(s.percentage) || 0),
                  0
                );
                return (
                  <div
                    key={plan.id}
                    className="p-3.5 sm:p-4 rounded-[4px] bg-slate-50/60 dark:bg-slate-950/30 border border-slate-200/70 dark:border-white/5 space-y-3 shadow-2xs"
                  >
                    {/* Plan Card Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/10">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {plan.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          Stage total: {stageTotal}% / 100%
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddStage(plan.id)}
                        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stage</span>
                      </button>
                    </div>

                    {/* Plan Stages Rows */}
                    <div className="space-y-2.5">
                      {plan.stages.map((stage, idx) => (
                        <div
                          key={stage.id}
                          className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-1 max-w-2xl"
                        >
                          <div className="flex-1 min-w-[180px] max-w-md">
                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                              Stage {idx + 1}
                            </label>
                            <input
                              type="text"
                              value={stage.milestone}
                              onChange={(e) =>
                                handleStageChange(plan.id, stage.id, 'milestone', e.target.value)
                              }
                              placeholder="Booking, construction milestone..."
                              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                            />
                          </div>
                          <div className="w-full sm:w-36 md:w-40 shrink-0">
                            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                              Payment %
                            </label>
                            <input
                              type="number"
                              value={stage.percentage}
                              onChange={(e) =>
                                handleStageChange(plan.id, stage.id, 'percentage', e.target.value)
                              }
                              placeholder="0"
                              className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveStage(plan.id, stage.id)}
                            title="Remove stage"
                            aria-label="Remove stage"
                            className="h-9 w-9 inline-flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 rounded-[4px] cursor-pointer shadow-2xs transition-all shrink-0 sm:self-end active:scale-95"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 03: Variant Pricing */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                03
              </span>
              <span className="w-1 h-3.5 rounded-full bg-amber-600 dark:bg-amber-500" />
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                  Variant Pricing
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddPricingField}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pricing Field</span>
            </button>
          </div>

          {/* Variant Pricing Items with Reduced Width & Dustbin Icon */}
          {formData.variantPricingFields.length === 0 ? (
            <div className="p-5 max-w-2xl text-center bg-white/70 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-xs text-slate-500 dark:text-slate-400 italic">
              No variant pricing fields added. Click "Add Pricing Field" to create one.
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {formData.variantPricingFields.map((field) => (
                <div
                  key={field.id}
                  className="p-4 max-w-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] space-y-3.5 shadow-2xs hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                    <div className="flex-1 min-w-[200px] max-w-sm">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={field.fieldName}
                        onChange={(e) =>
                          handleVariantPricingChange(field.id, 'fieldName', e.target.value)
                        }
                        placeholder="e.g. Club house Cost"
                        className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                      />
                    </div>
                    <div className="w-full sm:w-36 md:w-44 shrink-0">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={field.amount}
                        onChange={(e) =>
                          handleVariantPricingChange(field.id, 'amount', e.target.value)
                        }
                        placeholder="100000"
                        className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePricingField(field.id)}
                      title="Remove pricing field"
                      aria-label="Remove pricing field"
                      className="h-9 w-9 inline-flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 rounded-[4px] cursor-pointer shadow-2xs transition-all shrink-0 sm:self-end active:scale-95"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    </button>
                  </div>

                  <div className="pt-0.5 space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Type
                    </label>
                    <div className="flex items-center gap-6 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
                        <input
                          type="radio"
                          name={`chargeType-${field.id}`}
                          checked={field.chargeType === 'Lump Sum'}
                          onChange={() =>
                            handleVariantPricingChange(field.id, 'chargeType', 'Lump Sum')
                          }
                          className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          Lump Sum
                        </span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
                        <input
                          type="radio"
                          name={`chargeType-${field.id}`}
                          checked={field.chargeType === 'Per SFT'}
                          onChange={() =>
                            handleVariantPricingChange(field.id, 'chargeType', 'Per SFT')
                          }
                          className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          Per SFT
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 04: Banking Tie-ups */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                04
              </span>
              <span className="w-1 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Banking Tie-ups
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsBankDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bank</span>
            </button>
          </div>

          {/* 4-column bank checkboxes matching Reference Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2.5 pt-1">
            {formData.banks.map((bank) => (
              <label
                key={bank.id}
                className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={bank.selected}
                  onChange={() => handleToggleBank(bank.id)}
                  className="w-3.5 h-3.5 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>{bank.name}</span>
              </label>
            ))}
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

      <AddBankDialog
        isOpen={isBankDialogOpen}
        onClose={() => setIsBankDialogOpen(false)}
        onSave={handleAddBank}
      />
    </div>
  );
}

export default FinancialsDesktop;
