import { useState, type FormEvent } from 'react';
import {
  ChevronDown,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  INITIAL_APPROVALS_DATA,
  INITIAL_AUTHORITY_OPTIONS,
  HANDOVER_STATUS_OPTIONS,
  OC_RECEIVED_OPTIONS,
  type ApprovalsFormData,
  type ApprovalAuthorityOption,
} from './data';

interface AddApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ApprovalAuthorityOption, 'id'>) => void;
}

export function AddApprovalDialog({
  isOpen,
  onClose,
  onSave,
}: AddApprovalDialogProps) {
  const [option, setOption] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!option.trim()) return;
    onSave({ option: option.trim(), status });
    setOption('');
    setStatus('ACTIVE');
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
            <h3 className="text-base font-bold text-slate-900">Add Approval</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Type is fixed to approval.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
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
              value={option}
              onChange={(e) => setOption(e.target.value)}
              placeholder="Enter option"
              required
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 pr-8 cursor-pointer"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
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

export function ApprovalsDesktop() {
  const [formData, setFormData] = useState<ApprovalsFormData>(INITIAL_APPROVALS_DATA);
  const [authorityOptions, setAuthorityOptions] = useState<ApprovalAuthorityOption[]>(
    INITIAL_AUTHORITY_OPTIONS
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleInputChange = <K extends keyof ApprovalsFormData>(
    field: K,
    value: ApprovalsFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveApprovalAuthority = (newItem: Omit<ApprovalAuthorityOption, 'id'>) => {
    const item: ApprovalAuthorityOption = {
      id: `${Date.now()}`,
      ...newItem,
    };
    setAuthorityOptions((prev) => [...prev, item]);
    handleInputChange('approvingAuthority', item.option);
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 md:p-8 space-y-7 text-slate-800">
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Approvals saved successfully!</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Approvals
        </span>
      </div>

      
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Approving Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Approving Authority
            </label>
            <div className="relative">
              <select
                value={formData.approvingAuthority}
                onChange={(e) =>
                  handleInputChange('approvingAuthority', e.target.value)
                }
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
              >
                <option value="">Select Approving Authority</option>
                {authorityOptions
                  .filter((a) => a.status === 'ACTIVE')
                  .map((a) => (
                    <option key={a.id} value={a.option}>
                      {a.option}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="mt-2.5 inline-flex items-center px-3.5 py-1.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Add Approval
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Approval Copy (PDF/JPG)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Completion Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formData.completionDate}
                onChange={(e) =>
                  handleInputChange('completionDate', e.target.value)
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              HandOver
            </label>
            <div className="relative">
              <select
                value={formData.handOver}
                onChange={(e) => handleInputChange('handOver', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
              >
                {HANDOVER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start pt-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              HandOver Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formData.handOverDate}
                onChange={(e) => handleInputChange('handOverDate', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Remarks
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              placeholder="Enter remarks..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>
        </div>
      </section>

      
      <section className="space-y-4 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          RERA Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-2">
              RERA Registered
            </label>
            <div className="flex items-center gap-5 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="reraRegistered"
                  checked={formData.reraRegistered === 'Yes'}
                  onChange={() => handleInputChange('reraRegistered', 'Yes')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="reraRegistered"
                  checked={formData.reraRegistered === 'No'}
                  onChange={() => handleInputChange('reraRegistered', 'No')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              RERA Registration Number
            </label>
            <input
              type="text"
              value={formData.reraRegistrationNumber}
              onChange={(e) =>
                handleInputChange('reraRegistrationNumber', e.target.value)
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              RERA Valid Upto
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="-----------"
                value={formData.reraValidUpto}
                onChange={(e) =>
                  handleInputChange('reraValidUpto', e.target.value)
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              RERA File
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              RERA Approval Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formData.reraApprovalDate}
                onChange={(e) =>
                  handleInputChange('reraApprovalDate', e.target.value)
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Approval Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formData.approvalDate}
                onChange={(e) => handleInputChange('approvalDate', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      
      <section className="space-y-4 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          OC Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              OC Received
            </label>
            <div className="relative">
              <select
                value={formData.ocReceived}
                onChange={(e) => handleInputChange('ocReceived', e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
              >
                {OC_RECEIVED_OPTIONS.map((opt) => (
                  <option key={opt} value={opt === 'Select' ? '' : opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              OC Approval Dates (comma-separated)
            </label>
            <input
              type="text"
              value={formData.ocApprovalDates}
              onChange={(e) =>
                handleInputChange('ocApprovalDates', e.target.value)
              }
              placeholder="e.g. 12-01-2024, 15-06-2024"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      
      <section className="space-y-4 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          CC Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              CC Number
            </label>
            <input
              type="text"
              value={formData.ccNumber}
              onChange={(e) => handleInputChange('ccNumber', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              CC Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formData.ccDate}
                onChange={(e) => handleInputChange('ccDate', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
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
                handleInputChange(
                  'status',
                  e.target.value as 'Active' | 'Inactive'
                )
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8 cursor-pointer"
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
          className="px-6 py-2 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-end"
        >
          Save Project
        </button>
      </div>

      
      <AddApprovalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveApprovalAuthority}
      />
    </div>
  );
}

export default ApprovalsDesktop;
