import { useState } from 'react';
import {
  ChevronDown,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  INITIAL_FINANCIALS_DATA,
  type FinancialsFormData,
  type PaymentPlanOption,
  type VariantPricingField,
  type BankOption,
} from './data';
import {
  AddPaymentPlanDialog,
  AddPricingFieldDialog,
  AddBankDialog,
} from './desktop';

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

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const selectedPlan = formData.paymentPlans.find(
    (p) => p.id === formData.activePaymentPlanId
  );

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-6 text-slate-800">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Finance settings saved successfully!</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Finance (Mobile)
        </span>
      </div>

      
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Payment Types
          </h3>
          <button
            type="button"
            onClick={() => setIsPlanDialogOpen(true)}
            className="px-2.5 py-1 bg-[#1956db] text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            Add Plan
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {formData.paymentPlans.map((plan) => (
            <label
              key={plan.id}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
            >
              <input
                type="checkbox"
                checked={plan.selected}
                onChange={() => handleTogglePlan(plan.id)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <span className="font-medium text-slate-800">{plan.name}</span>
            </label>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Select a payment type to add its stages.
        </p>

        {selectedPlan && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">
              Stages: {selectedPlan.name}
            </span>
            <div className="space-y-1.5">
              {selectedPlan.stages.map((stg) => (
                <div
                  key={stg.id}
                  className="flex items-center justify-between p-2 rounded bg-white border border-slate-200"
                >
                  <span className="font-medium text-slate-700">
                    {stg.stageName}
                  </span>
                  <span className="font-semibold text-blue-600">
                    {stg.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Variant Pricing
            </h3>
            <p className="text-[10px] text-slate-400">
              Apply raw amounts to variants.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPricingDialogOpen(true)}
            className="px-2.5 py-1 bg-[#1956db] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1"
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
                className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {field.fieldName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ₹{field.amount} ({field.chargeType}) • {field.appliedTo}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePricingField(field.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 italic">
            No variant pricing fields added.
          </p>
        )}
      </section>

      
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Banking Tie-ups
          </h3>
          <button
            type="button"
            onClick={() => setIsBankDialogOpen(true)}
            className="px-2.5 py-1 bg-[#1956db] text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            Add Bank
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {formData.banks.map((bank) => (
            <label
              key={bank.id}
              className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={bank.selected}
                onChange={() => handleToggleBank(bank.id)}
                className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300"
              />
              <span className="truncate">{bank.name}</span>
            </label>
          ))}
        </div>
      </section>

      
      <div className="pt-3 border-t border-slate-200/80 space-y-4">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Status <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as 'Active' | 'Inactive',
                }))
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-2.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Save Project
        </button>
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
