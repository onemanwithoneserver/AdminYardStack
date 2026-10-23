import { initialFinancialsData } from './data';

export function FinancialsDesktop() {
  return (
    <div className="w-full bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Section 09
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            {initialFinancialsData.name}
          </h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
          Desktop View
        </span>
      </div>
      <p className="text-sm text-slate-500 mt-3 leading-relaxed">
        {initialFinancialsData.description}
      </p>
    </div>
  );
}

export default FinancialsDesktop;
