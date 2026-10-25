import { useState, useRef, type ChangeEvent } from 'react';
import { ShieldCheck, Plus, X, UploadCloud, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { ModernCalendar } from '../../components/elements/ModernCalendar';
import {
  INITIAL_APPROVALS_DATA,
  INITIAL_AUTHORITY_OPTIONS,
  HANDOVER_STATUS_OPTIONS,
  OC_RECEIVED_OPTIONS,
  type ApprovalsFormData,
  type ApprovalAuthorityOption,
} from './data';
import { AddApprovalDialog } from './desktop';

export function ApprovalsMobile() {
  const [formData, setFormData] = useState<ApprovalsFormData>(INITIAL_APPROVALS_DATA);
  const [authorityOptions, setAuthorityOptions] = useState<ApprovalAuthorityOption[]>(
    INITIAL_AUTHORITY_OPTIONS
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [approvalCopyName, setApprovalCopyName] = useState<string>('');
  const [reraFileName, setReraFileName] = useState<string>('');
  const approvalCopyInputRef = useRef<HTMLInputElement>(null);
  const reraFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleApprovalCopyUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApprovalCopyName(file.name);
      handleInputChange('approvalCopyFile', file.name);
    }
  };

  const handleReraFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReraFileName(file.name);
      handleInputChange('reraFile', file.name);
    }
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="p-1.5 space-y-4 text-slate-800 dark:text-slate-100 text-xs">
      {savedNotification && (
        <div className="fixed top-4 inset-x-4 z-50 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-3 py-2 rounded-[4px] shadow-lg text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Approvals saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-xs shadow-rose-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Approvals
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Statutory sanctions, RERA registration, and environmental clearances
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pb-4">
        {/* Section 1: Statutory Sanctions & Approval Authority */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                01
              </span>
              <span className="w-1 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Statutory Sanctions & Approval Authority
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Approving Authority */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Approving Authority
              </label>
              <div className="flex items-center gap-2 w-full">
                <ModernDropdown<string>
                  value={formData.approvingAuthority}
                  onChange={(val) => handleInputChange('approvingAuthority', val)}
                  options={authorityOptions.filter((a) => a.status === 'ACTIVE').map((a) => a.option)}
                  placeholder="Select Approving Authority"
                  roundedClass="rounded-[4px]"
                  className="flex-1"
                  buttonClassName="w-full h-9 px-2.5 text-xs font-medium gap-1"
                />
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 h-9 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs shrink-0 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Approval Copy */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Approval Copy (PDF/JPG)
              </label>
              {approvalCopyName || formData.approvalCopyFile ? (
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    {approvalCopyName || formData.approvalCopyFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setApprovalCopyName('');
                      handleInputChange('approvalCopyFile', null);
                      if (approvalCopyInputRef.current) approvalCopyInputRef.current.value = '';
                    }}
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Remove file"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={approvalCopyInputRef}
                    type="file"
                    id="m-approval-copy-input"
                    accept=".pdf,image/*"
                    onChange={handleApprovalCopyUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="m-approval-copy-input"
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Choose</span>
                  </label>
                  <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 truncate">
                    No file chosen
                  </div>
                </div>
              )}
            </div>

            {/* Completion Date */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Completion Date
              </label>
              <ModernCalendar
                value={formData.completionDate}
                onChange={(val) => handleInputChange('completionDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            {/* HandOver */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                HandOver Status
              </label>
              <ModernDropdown<string>
                value={formData.handOver}
                onChange={(val) => handleInputChange('handOver', val)}
                options={[...HANDOVER_STATUS_OPTIONS]}
                placeholder="Select HandOver Status"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* HandOver Date */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                HandOver Date
              </label>
              <ModernCalendar
                value={formData.handOverDate}
                onChange={(val) => handleInputChange('handOverDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            {/* Remarks */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Approval Remarks
              </label>
              <textarea
                rows={2}
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="Enter regulatory or sanction notes..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs resize-none"
              />
            </div>
          </div>
        </section>

        {/* Section 2: RERA Registration & Compliance */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                02
              </span>
              <span className="w-1 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                RERA Registration & Compliance
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* RERA Registered */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RERA Registered
              </label>
              <div className="flex items-center gap-5 h-9">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="m_reraRegistered"
                    checked={formData.reraRegistered === 'Yes'}
                    onChange={() => handleInputChange('reraRegistered', 'Yes')}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="m_reraRegistered"
                    checked={formData.reraRegistered === 'No'}
                    onChange={() => handleInputChange('reraRegistered', 'No')}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* RERA Registration Number */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RERA Registration Number
              </label>
              <input
                type="text"
                value={formData.reraRegistrationNumber}
                onChange={(e) => handleInputChange('reraRegistrationNumber', e.target.value)}
                placeholder="e.g. P02400003412"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* RERA Valid Upto */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RERA Valid Upto
              </label>
              <ModernCalendar
                value={formData.reraValidUpto}
                onChange={(val) => handleInputChange('reraValidUpto', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            {/* RERA File */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RERA Certificate (PDF)
              </label>
              {reraFileName || formData.reraFile ? (
                <div className="flex items-center justify-between gap-2 h-9 w-full px-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] shadow-2xs">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    {reraFileName || formData.reraFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReraFileName('');
                      handleInputChange('reraFile', null);
                      if (reraFileInputRef.current) reraFileInputRef.current.value = '';
                    }}
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Remove file"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 h-9 w-full">
                  <input
                    ref={reraFileInputRef}
                    type="file"
                    id="m-rera-file-input"
                    accept=".pdf,image/*"
                    onChange={handleReraFileUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="m-rera-file-input"
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Choose</span>
                  </label>
                  <div className="flex-1 px-2.5 h-9 flex items-center bg-white/70 dark:bg-slate-950/70 border border-dashed border-slate-200 dark:border-white/10 rounded-[4px] text-[11px] text-slate-400 truncate">
                    No file chosen
                  </div>
                </div>
              )}
            </div>

            {/* RERA Approval Date */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RERA Approval Date
              </label>
              <ModernCalendar
                value={formData.reraApprovalDate}
                onChange={(val) => handleInputChange('reraApprovalDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            {/* Approval Date */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Authority Approval Date
              </label>
              <ModernCalendar
                value={formData.approvalDate}
                onChange={(val) => handleInputChange('approvalDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Occupancy Certificate (OC) Details */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                03
              </span>
              <span className="w-1 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Occupancy Certificate (OC) Details
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* OC Received */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                OC Status
              </label>
              <ModernDropdown<string>
                value={formData.ocReceived}
                onChange={(val) => handleInputChange('ocReceived', val)}
                options={[...OC_RECEIVED_OPTIONS]}
                placeholder="Select OC Status"
                roundedClass="rounded-[4px]"
                className="w-full inline-block"
                buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
              />
            </div>

            {/* OC Approval Dates */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                OC Approval Dates (comma-separated)
              </label>
              <input
                type="text"
                value={formData.ocApprovalDates}
                onChange={(e) => handleInputChange('ocApprovalDates', e.target.value)}
                placeholder="e.g. 12-01-2024, 15-06-2024"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Completion Certificate (CC) Details */}
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-3.5 space-y-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none">
                04
              </span>
              <span className="w-1 h-3 rounded-full bg-amber-600 dark:bg-amber-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Completion Certificate (CC) Details
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* CC Number */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CC Number
              </label>
              <input
                type="text"
                value={formData.ccNumber}
                onChange={(e) => handleInputChange('ccNumber', e.target.value)}
                placeholder="e.g. CC/104/2024"
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* CC Date */}
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CC Date
              </label>
              <ModernCalendar
                value={formData.ccDate}
                onChange={(val) => handleInputChange('ccDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Status Card - Placed at bottom left side */}
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 h-4">
              <span>Status</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <ModernDropdown<'Active' | 'Inactive'>
              value={formData.status}
              onChange={(val) => handleInputChange('status', val)}
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
              buttonClassName="w-auto h-8 px-2 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
            />
          </div>
        </div>
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
