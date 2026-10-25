import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Plus, X, UploadCloud, CheckCircle2 } from 'lucide-react';
import { ModernDropdown } from '../../components/elements/ModernDropdown';
import { ModernCalendar } from '../../components/elements/ModernCalendar';
import { INITIAL_APPROVALS_DATA, INITIAL_AUTHORITY_OPTIONS, HANDOVER_STATUS_OPTIONS, OC_RECEIVED_OPTIONS, type ApprovalsFormData, type ApprovalAuthorityOption } from './data';

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!option.trim()) return;
    onSave({ option: option.trim(), status });
    setOption('');
    setStatus('ACTIVE');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[4px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-slate-100 dark:border-white/10">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Add Approving Authority
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Specify municipal, urban development, or planning authority.
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
                  Authority Name <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                  placeholder="e.g. DTCP / HMDA / GHMC"
                  required
                  className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Status
                </label>
                <ModernDropdown<'ACTIVE' | 'INACTIVE'>
                  value={status}
                  onChange={(val) => setStatus(val)}
                  options={['ACTIVE', 'INACTIVE']}
                  placeholder="Select Status"
                  roundedClass="rounded-[4px]"
                  className="w-full"
                  buttonClassName="w-full h-9 px-3 text-xs font-medium"
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
                  Save Authority
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ApprovalsDesktop() {
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
    <div className="p-2 space-y-5 text-slate-800 dark:text-slate-100 text-xs no-scrollbar">
      <AnimatePresence>
        {savedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-[4px] shadow-lg text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Approvals saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-xs shadow-rose-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Approvals
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Statutory sanctions, RERA registration numbers, environmental clearances, and legal certificates
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4">
        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                01
              </span>
              <span className="w-1 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                Statutory Sanctions & Approval Authority
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Approving Authority
              </label>
              <div className="flex items-center gap-2.5 w-full">
                <ModernDropdown<string>
                  value={formData.approvingAuthority}
                  onChange={(val) => handleInputChange('approvingAuthority', val)}
                  options={authorityOptions.filter((a) => a.status === 'ACTIVE').map((a) => a.option)}
                  placeholder="Select Approving Authority"
                  roundedClass="rounded-[4px]"
                  className="flex-1 min-w-[180px]"
                  buttonClassName="w-full h-9 px-3 text-xs font-medium gap-1.5"
                />
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-[4px] border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Add Approval</span>
                </button>
              </div>
            </div>

            
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
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
                    id="approval-copy-input"
                    accept=".pdf,image/*"
                    onChange={handleApprovalCopyUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="approval-copy-input"
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Completion Date
              </label>
              <ModernCalendar
                value={formData.completionDate}
                onChange={(val) => handleInputChange('completionDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                HandOver Date
              </label>
              <ModernCalendar
                value={formData.handOverDate}
                onChange={(val) => handleInputChange('handOverDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            
            <div className="flex flex-col items-start w-full sm:col-span-2 max-w-xl">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                Approval Remarks
              </label>
              <textarea
                rows={4}
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="Enter regulatory or sanction notes..."
                className="w-full min-h-[96px] px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[4px] text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 shadow-2xs resize-y leading-relaxed"
              />
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                02
              </span>
              <span className="w-1 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white font-display">
                RERA Registration & Compliance
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                RERA Registered
              </label>
              <div className="flex items-center gap-5 h-9">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="reraRegistered"
                    checked={formData.reraRegistered === 'Yes'}
                    onChange={() => handleInputChange('reraRegistered', 'Yes')}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                RERA Valid Upto
              </label>
              <ModernCalendar
                value={formData.reraValidUpto}
                onChange={(val) => handleInputChange('reraValidUpto', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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
                    className="p-1 rounded-[3px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0 cursor-pointer shadow-2xs active:scale-95"
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
                    id="rera-file-input"
                    accept=".pdf,image/*"
                    onChange={handleReraFileUpload}
                    className="sr-only"
                  />
                  <label
                    htmlFor="rera-file-input"
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                RERA Approval Date
              </label>
              <ModernCalendar
                value={formData.reraApprovalDate}
                onChange={(val) => handleInputChange('reraApprovalDate', val)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                03
              </span>
              <span className="w-1 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider font-display">
                Occupancy Certificate (OC) Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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

            
            <div className="flex flex-col items-start w-full sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
                OC Approval Dates
              </label>
              <div className="flex items-center gap-2.5 w-full">
                <div className="flex-1 min-w-0">
                  <ModernCalendar
                    value={formData.ocStartDate || (formData.ocApprovalDates && formData.ocApprovalDates.includes('to') ? formData.ocApprovalDates.split('to')[0].trim() : '')}
                    onChange={(val) => {
                      handleInputChange('ocStartDate', val);
                      const end = formData.ocEndDate || (formData.ocApprovalDates && formData.ocApprovalDates.includes('to') ? formData.ocApprovalDates.split('to')[1].trim() : '');
                      handleInputChange(
                        'ocApprovalDates',
                        val ? (end ? `${val} to ${end}` : val) : end
                      );
                    }}
                    maxDate={formData.ocEndDate || (formData.ocApprovalDates && formData.ocApprovalDates.includes('to') ? formData.ocApprovalDates.split('to')[1].trim() : undefined)}
                    placeholder="Start Date"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 select-none">
                  to
                </span>
                <div className="flex-1 min-w-0">
                  <ModernCalendar
                    value={formData.ocEndDate || (formData.ocApprovalDates && formData.ocApprovalDates.includes('to') ? formData.ocApprovalDates.split('to')[1].trim() : '')}
                    onChange={(val) => {
                      handleInputChange('ocEndDate', val);
                      const start = formData.ocStartDate || (formData.ocApprovalDates && formData.ocApprovalDates.includes('to') ? formData.ocApprovalDates.split('to')[0].trim() : '');
                      handleInputChange(
                        'ocApprovalDates',
                        start ? (val ? `${start} to ${val}` : start) : val
                      );
                    }}
                    minDate={formData.ocStartDate || (formData.ocApprovalDates && formData.ocApprovalDates.includes('to') ? formData.ocApprovalDates.split('to')[0].trim() : undefined)}
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-white/10 rounded-[4px] p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 text-[10px] font-bold font-mono tracking-wider rounded-[3px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 select-none shadow-2xs">
                04
              </span>
              <span className="w-1 h-3.5 rounded-full bg-amber-600 dark:bg-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider font-display">
                Completion Certificate (CC) Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-start">
            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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

            
            <div className="flex flex-col items-start w-full">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-4 flex items-center">
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

      
      <div className="pt-2 pb-6 flex items-center justify-start">
        <div className="rounded-[4px] p-2.5 sm:p-3 border backdrop-blur-xl w-fit bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-white/10 shadow-xs">
          <div className="flex flex-col items-start gap-1.5">
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
              buttonClassName="w-auto h-8 px-2.5 text-xs font-semibold gap-1.5 bg-transparent border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 shadow-none"
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

export default ApprovalsDesktop;
