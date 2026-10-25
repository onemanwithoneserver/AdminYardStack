import { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import {
  INITIAL_FINANCIALS_DATA,
  type FinancialsFormData,
  type PaymentPlanOption,
  type VariantPricingField,
  type BankOption,
} from './data';
import { AddPaymentPlanDialog, AddBankDialog } from './desktop';

export function FinancialsMobile() {
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
    <div className="p-1.5 space-y-4 text-slate-800 dark:text-slate-100 text-xs">
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
        {/* Section 01: Payment Types */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                01
              </span>
              <span className="w-1 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Payment Types
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPlanDialogOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
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
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                02
              </span>
              <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Payment Plan Stages
              </h3>
            </div>
          </div>

          {activePlans.length === 0 ? (
            <div className="p-4 text-center bg-slate-50/60 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-xs text-slate-500 dark:text-slate-400 italic">
              No payment plans selected. Check one or more payment types above to configure milestone stages.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {activePlans.map((plan) => {
                const stageTotal = plan.stages.reduce(
                  (sum, s) => sum + (parseFloat(s.percentage) || 0),
                  0
                );
                return (
                  <div
                    key={plan.id}
                    className="p-3.5 rounded-[4px] bg-slate-50/60 dark:bg-slate-950/30 border border-slate-200/70 dark:border-white/5 space-y-3 shadow-2xs"
                  >
                    {/* Plan Card Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/10">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {plan.name}
                        </h4>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          Stage total: {stageTotal}% / 100%
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddStage(plan.id)}
                        className="inline-flex items-center gap-1 px-2.5 h-7 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-[11px] font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Plan Stages Rows */}
                    <div className="space-y-3">
                      {plan.stages.map((stage, idx) => (
                        <div
                          key={stage.id}
                          className="space-y-2 p-2.5 bg-white dark:bg-slate-950/40 border border-slate-200/70 dark:border-white/5 rounded-[4px]"
                        >
                          <div>
                            <label className="block text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Stage {idx + 1}
                            </label>
                            <input
                              type="text"
                              value={stage.milestone}
                              onChange={(e) =>
                                handleStageChange(plan.id, stage.id, 'milestone', e.target.value)
                              }
                              placeholder="Booking, construction milestone..."
                              className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <label className="block text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Payment %
                              </label>
                              <input
                                type="number"
                                value={stage.percentage}
                                onChange={(e) =>
                                  handleStageChange(plan.id, stage.id, 'percentage', e.target.value)
                                }
                                placeholder="0"
                                className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveStage(plan.id, stage.id)}
                              title="Remove stage"
                              aria-label="Remove stage"
                              className="h-8 w-8 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 rounded-[4px] cursor-pointer shadow-2xs transition-all shrink-0 mt-4"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                03
              </span>
              <span className="w-1 h-3 rounded-full bg-amber-600 dark:bg-amber-500" />
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                  Variant Pricing
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddPricingField}
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Variant Pricing Items with Dustbin Icon */}
          {formData.variantPricingFields.length === 0 ? (
            <div className="p-4 text-center bg-white/70 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-xs text-slate-500 dark:text-slate-400 italic">
              No variant pricing fields added. Click "Add" to create one.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {formData.variantPricingFields.map((field) => (
                <div
                  key={field.id}
                  className="p-3.5 bg-white/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/10 rounded-[4px] space-y-3 shadow-2xs"
                >
                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Field Name
                    </label>
                    <input
                      type="text"
                      value={field.fieldName}
                      onChange={(e) =>
                        handleVariantPricingChange(field.id, 'fieldName', e.target.value)
                      }
                      placeholder="e.g. Club house Cost"
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={field.amount}
                        onChange={(e) =>
                          handleVariantPricingChange(field.id, 'amount', e.target.value)
                        }
                        placeholder="100000"
                        className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePricingField(field.id)}
                      title="Remove pricing field"
                      aria-label="Remove pricing field"
                      className="h-8 w-8 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 rounded-[4px] cursor-pointer shadow-2xs transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pt-0.5 space-y-1">
                    <label className="block text-[10.5px] font-semibold text-slate-700 dark:text-slate-300">
                      Type
                    </label>
                    <div className="flex items-center gap-5 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name={`chargeType-m-${field.id}`}
                          checked={field.chargeType === 'Lump Sum'}
                          onChange={() =>
                            handleVariantPricingChange(field.id, 'chargeType', 'Lump Sum')
                          }
                          className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Lump Sum</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name={`chargeType-m-${field.id}`}
                          checked={field.chargeType === 'Per SFT'}
                          onChange={() =>
                            handleVariantPricingChange(field.id, 'chargeType', 'Per SFT')
                          }
                          className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Per SFT</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 04: Banking Tie-ups */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                04
              </span>
              <span className="w-1 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Banking Tie-ups
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsBankDialogOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 h-8 rounded-[4px] bg-[#1a56db] hover:bg-[#1546b8] text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
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
      <div className="pt-1 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
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

export default FinancialsMobile;
