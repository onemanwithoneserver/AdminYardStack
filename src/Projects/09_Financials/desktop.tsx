import { useState, type FormEvent } from 'react';
import { ChevronDown, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { INITIAL_FINANCIALS_DATA, type FinancialsFormData, type PaymentPlanOption, type VariantPricingField, type BankOption } from './data';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-2 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Add Payment Plan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter name for the new payment scheme.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-600 dark:text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 20:80 Possession Linked Plan"
              required
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Save
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-2 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Add Pricing Field
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter raw amount and select the inventory variant it applies to.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-600 dark:text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g. Clubhouse Fee or Corpus Fund"
              required
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (INR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 150000"
              required
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Charge Type
              </label>
              <select
                value={chargeType}
                onChange={(e) =>
                  setChargeType(e.target.value as 'Fixed' | 'Per SFT')
                }
                className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="Fixed">Fixed Amount</option>
                <option value="Per SFT">Per SFT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applied To
              </label>
              <select
                value={appliedTo}
                onChange={(e) => setAppliedTo(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="All Variants">All Variants</option>
                <option value="Variant 1">Variant 1</option>
                <option value="Variant 2">Variant 2</option>
                <option value="Variant 3">Variant 3</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Save
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 pb-2 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Bank</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Type is fixed to bank tie-up.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-600 dark:text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Option <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              required
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Save
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
    <div className="w-full ys-panel p-6 md:p-8 space-y-7 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 ys-toast px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Finance settings saved successfully!</span>
        </div>
      )}

      <div className="pb-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Financials
          </h2>
        </div>
      </div>

      
      <section className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Payment Types
        </h3>

        <div>
          <button
            type="button"
            onClick={() => setIsPlanDialogOpen(true)}
            className="inline-flex items-center px-3.5 py-1.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Add Payment Plan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2.5 gap-x-6 pt-1">
          {formData.paymentPlans.map((plan) => (
            <label
              key={plan.id}
              className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900 select-none py-0.5"
            >
              <input
                type="checkbox"
                checked={plan.selected}
                onChange={() => handleTogglePlan(plan.id)}
                className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="truncate">{plan.name}</span>
            </label>
          ))}
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-1">
          Select a payment type to add its stages.
        </p>

        {selectedPlan && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Payment Stages for: {selectedPlan.name}
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">
                {selectedPlan.stages.length} Stages Configured
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-white text-[11px] font-semibold text-slate-600">
                  <tr>
                    <th className="py-2 px-3">Stage Name</th>
                    <th className="py-2 px-3">Percentage (%)</th>
                    <th className="py-2 px-3">Milestone Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedPlan.stages.map((stg) => (
                    <tr key={stg.id}>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        {stg.stageName}
                      </td>
                      <td className="py-2 px-3 text-blue-600 font-semibold">
                        {stg.percentage}%
                      </td>
                      <td className="py-2 px-3 text-slate-500">
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

      
      <section className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Variant Pricing
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsPricingDialogOpen(true)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pricing Field</span>
          </button>
        </div>

        {formData.variantPricingFields.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Field Name</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Applied To</th>
                  <th className="py-2.5 px-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.variantPricingFields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {field.fieldName}
                    </td>
                    <td className="py-2 px-3 text-slate-700">
                      ₹{field.amount}
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      {field.chargeType}
                    </td>
                    <td className="py-2 px-3 text-blue-600 font-medium">
                      {field.appliedTo}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeletePricingField(field.id)}
                        className="text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
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
          <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-600 dark:text-slate-400 italic">
            No additional variant pricing fields added. Click "Add Pricing Field" to configure extra charges.
          </div>
        )}
      </section>

      
      <section className="space-y-3.5 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Banking Tie-ups
        </h3>

        <div>
          <button
            type="button"
            onClick={() => setIsBankDialogOpen(true)}
            className="inline-flex items-center px-3.5 py-1.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Add Bank
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2.5 gap-x-6 pt-1">
          {formData.banks.map((bank) => (
            <label
              key={bank.id}
              className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900 select-none py-0.5"
            >
              <input
                type="checkbox"
                checked={bank.selected}
                onChange={() => handleToggleBank(bank.id)}
                className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="truncate">{bank.name}</span>
            </label>
          ))}
        </div>
      </section>

      
      <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xs w-full">
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
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-end"
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

export default FinancialsDesktop;
