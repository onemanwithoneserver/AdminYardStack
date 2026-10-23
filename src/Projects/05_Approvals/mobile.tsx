import { useState } from 'react';
import { ChevronDown, Calendar, CheckCircle2 } from 'lucide-react';
import { INITIAL_APPROVALS_DATA, INITIAL_AUTHORITY_OPTIONS, HANDOVER_STATUS_OPTIONS, OC_RECEIVED_OPTIONS, type ApprovalsFormData, type ApprovalAuthorityOption } from './data';
import { AddApprovalDialog } from './desktop';

export function ApprovalsMobile() {
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
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-6 text-slate-800">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Approvals saved successfully!</span>
        </div>
      )}

      
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
          Approvals (Mobile)
        </span>
      </div>

      
      <section className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          Approving Details
        </h3>

        <div className="space-y-3 text-xs">
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
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
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
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="mt-2 inline-flex items-center px-3 py-1.5 bg-[#1956db] text-white text-xs font-semibold rounded-lg shadow-xs"
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
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 border border-slate-300 rounded-lg p-1 bg-white"
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
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
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
                className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs pr-8"
              >
                {HANDOVER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>
          </div>

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
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Remarks
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs resize-none"
            />
          </div>
        </div>
      </section>

      
      <section className="space-y-3.5 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          RERA Details
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              RERA Registered
            </label>
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="m_reraRegistered"
                  checked={formData.reraRegistered === 'Yes'}
                  onChange={() => handleInputChange('reraRegistered', 'Yes')}
                  className="w-3.5 h-3.5 text-blue-600"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="m_reraRegistered"
                  checked={formData.reraRegistered === 'No'}
                  onChange={() => handleInputChange('reraRegistered', 'No')}
                  className="w-3.5 h-3.5 text-blue-600"
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              RERA File
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 border border-slate-300 rounded-lg p-1 bg-white"
            />
          </div>

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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      
      <section className="space-y-3.5 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          OC Details
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              OC Received
            </label>
            <div className="relative">
              <select
                value={formData.ocReceived}
                onChange={(e) => handleInputChange('ocReceived', e.target.value)}
                className="w-full appearance-none px-3 py-2 border border-slate-300 rounded-lg text-xs pr-8 bg-white"
              >
                {OC_RECEIVED_OPTIONS.map((opt) => (
                  <option key={opt} value={opt === 'Select' ? '' : opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-slate-600 dark:text-slate-400" />
            </div>
          </div>

          <div>
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>
      </section>

      
      <section className="space-y-3.5 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 tracking-tight">
          CC Details
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              CC Number
            </label>
            <input
              type="text"
              value={formData.ccNumber}
              onChange={(e) => handleInputChange('ccNumber', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs pr-9"
              />
              <Calendar className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-600 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>
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
                handleInputChange(
                  'status',
                  e.target.value as 'Active' | 'Inactive'
                )
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
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
          className="w-full py-2.5 bg-[#1956db] hover:bg-[#1444b0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
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

export default ApprovalsMobile;
