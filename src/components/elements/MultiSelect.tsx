import { useState, useRef, useEffect, useId, forwardRef, type ReactNode } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  category?: string;
}

export interface MultiSelectProps {
  id?: string;
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayChips?: number;
  requiredIndicator?: boolean;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      id,
      label,
      options,
      value = [],
      onChange,
      placeholder = 'Select multiple...',
      searchable = true,
      error,
      hint,
      disabled = false,
      className = '',
      maxDisplayChips = 2,
      requiredIndicator = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const generatedId = useId();
    const multiSelectId = id || generatedId;
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, []);

    const toggleOption = (val: string) => {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    };

    const handleSelectAll = () => {
      if (value.length === options.length) {
        onChange([]);
      } else {
        onChange(options.map((o) => o.value));
      }
    };

    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    const allSelected = options.length > 0 && value.length === options.length;

    return (
      <div ref={ref || containerRef} className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={multiSelectId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight"
          >
            {label}
            {requiredIndicator && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <div
            id={multiSelectId}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between min-h-[40px] px-3 py-1.5 rounded-lg text-left transition-all duration-200 outline-none cursor-pointer glass-input select-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''} ${
              error ? 'border-rose-400 dark:border-rose-500' : ''
            }`}
          >
            <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 pr-2">
              {selectedOptions.length === 0 ? (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {placeholder}
                </span>
              ) : (
                <>
                  {selectedOptions.slice(0, maxDisplayChips).map((opt) => (
                    <span
                      key={opt.value}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-700/60"
                    >
                      <span className="truncate max-w-[120px]">{opt.label}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOption(opt.value);
                        }}
                        className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedOptions.length > maxDisplayChips && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      +{selectedOptions.length - maxDisplayChips} more
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 text-slate-600 dark:text-slate-400">
              {value.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                  className="p-0.5 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                }`}
              />
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute z-50 left-0 right-0 glass-dropdown-menu rounded-xl shadow-xl overflow-hidden py-1 max-h-64 flex flex-col"
              >
                {searchable && (
                  <div className="p-2 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
                    <div className="relative flex-1 flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 absolute left-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-100/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 outline-none border border-transparent focus:border-blue-500/50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                    >
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                )}

                <div className="overflow-y-auto max-h-52 divide-y divide-slate-50 dark:divide-white/5">
                  {filteredOptions.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-600 dark:text-slate-400">
                      No matching options
                    </div>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isSelected = value.includes(opt.value);

                      return (
                        <div
                          key={opt.value}
                          onClick={() => toggleOption(opt.value)}
                          className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#1956db] border-[#1956db] text-white shadow-xs'
                                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="truncate">{opt.label}</span>
                          </div>

                          {opt.category && (
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-normal ml-2 shrink-0">
                              {opt.category}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-slate-600 dark:text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
export default MultiSelect;
