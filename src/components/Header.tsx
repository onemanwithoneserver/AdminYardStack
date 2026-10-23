import { Monitor, Smartphone, X } from "lucide-react";
import Dropdown from "./Dropdown";

export type ViewMode = "desktop" | "mobile";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  view: string;
  onViewChange: (view: string) => void;
  onClose?: () => void;
}

export default function Header({
  viewMode,
  onViewModeChange,
  view,
  onViewChange,
  onClose,
}: HeaderProps) {
  const isMobile = viewMode === "mobile";
  const dropdownOptions = [
    { value: "Projects", label: "Projects" },
  ];


  return (
    <header className="h-[60px] bg-white border-b border-[#e2e8f0] px-3 sm:px-4 md:px-6 flex items-center justify-between shrink-0 shadow-sm relative z-[100] gap-2 sm:gap-4 pointer-events-auto">
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <div className="text-[#1e293b] font-black text-lg md:text-xl tracking-wide">
          Admin YardStack
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <div className="flex bg-[#f8fafc] p-0.5 md:p-1 rounded-[4px] border border-[#e2e8f0] shadow-sm">
          <button
            onClick={() => onViewModeChange("desktop")}
            title="Desktop View"
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 md:px-5 py-1 md:py-1.5 rounded-[4px] text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              !isMobile
                ? "bg-[#1e293b] text-white shadow-md"
                : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
            }`}
          >
            <Monitor className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => onViewModeChange("mobile")}
            title="Mobile View"
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 md:px-5 py-1 md:py-1.5 rounded-[4px] text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isMobile
                ? "bg-[#1e293b] text-white shadow-md"
                : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase hidden md:block">
            View
          </span>
          <div className="w-[120px] sm:w-[145px] md:w-[160px]">
            <Dropdown
              options={dropdownOptions}
              value={view}
              onChange={onViewChange}
              size="sm"
            />
          </div>
        </div>
        <button
          onClick={onClose}
          title="Close header (Press Ctrl+M to reopen)"
          aria-label="Close header"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-[8px] border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] flex items-center justify-center shadow-sm cursor-pointer shrink-0 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
}
