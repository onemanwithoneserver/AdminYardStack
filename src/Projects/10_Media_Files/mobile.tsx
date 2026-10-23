import { initialMediaFilesData } from './data';

export function MediaFilesMobile() {
  return (
    <div className="w-full bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            Section 10
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            {initialMediaFilesData.name}
          </h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
          Mobile View
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
        {initialMediaFilesData.description}
      </p>
    </div>
  );
}

export default MediaFilesMobile;
