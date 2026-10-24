import { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import {
  INITIAL_FINANCIALS_DATA,
  type FinancialsFormData,
  type PaymentPlanOption,
  type VariantPricingField,
  type BankOption,
} from './data';
import { AddPaymentPlanDialog, AddPricingFieldDialog, AddBankDialog } from './desktop';

export function FinancialsMobile() {
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

  const selectedPlan = formData.paymentPlans.find(
    (p) => p.id === formData.activePaymentPlanId
  );

  return (
    <div className="p-1.5 space-y-4 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-3 py-2 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Finance settings saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white shadow-xs shadow-violet-500/20">
            <CreditCard className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Financials
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Payment plans, milestone breakdown, and banking partners
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pb-4">
        {/* Section 1: Payment Types */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                01
              </span>
              <span className="w-1 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Payment Plans & Schedules
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPlanDialogOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {formData.paymentPlans.map((plan) => {
              const isSelected = plan.selected;
              return (
                <div
                  key={plan.id}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-[4px] border transition-all cursor-pointer select-none text-xs ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-medium'
                      : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-white/5 text-slate-700 dark:text-slate-300'
                  }`}
                  onClick={() => handleTogglePlan(plan.id)}
                >
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded-[2px] text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="truncate">{plan.name}</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {plan.stages.length} stg
                  </span>
                </div>
              );
            })}
          </div>

          {selectedPlan && (
            <div className="mt-2 p-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                  Stages: {selectedPlan.name}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold font-mono">
                  {selectedPlan.stages.length} Stages
                </span>
              </div>

              <div className="space-y-2">
                {selectedPlan.stages.map((stg) => (
                  <div
                    key={stg.id}
                    className="p-2 bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/5 rounded-[4px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {stg.stageName}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
                        {stg.percentage}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {stg.milestone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Variant Pricing */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                02
              </span>
              <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Variant Pricing & Charges
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPricingDialogOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {formData.variantPricingFields.length > 0 ? (
            <div className="space-y-2">
              {formData.variantPricingFields.map((field) => (
                <div
                  key={field.id}
                  className="p-2.5 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 rounded-[4px] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {field.fieldName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">₹{field.amount}</span> ({field.chargeType}) • <span className="text-blue-600 dark:text-blue-400">{field.appliedTo}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePricingField(field.id)}
                    className="p-1.5 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/90 dark:border-rose-900/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] p-3 text-center text-xs text-slate-500 dark:text-slate-400 italic">
              No variant pricing fields added.
            </div>
          )}
        </section>

        {/* Section 3: Banking Tie-ups */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                03
              </span>
              <span className="w-1 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Approved Banking Tie-ups
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsBankDialogOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {formData.banks.map((bank) => {
              const isChecked = bank.selected;
              return (
                <label
                  key={bank.id}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] border transition-all cursor-pointer select-none text-xs ${
                    isChecked
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-medium'
                      : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-white/5 text-slate-700 dark:text-slate-300'
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

export default FinancialsMobile;
