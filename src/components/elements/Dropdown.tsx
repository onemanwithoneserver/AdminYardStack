import {
  useState,
  useRef,
  useEffect,
  useId,
  forwardRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
}

export type DropdownSize = 'sm' | 'md' | 'lg';

export interface DropdownProps {
  id?: string;
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  size?: DropdownSize;
  glass?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  requiredIndicator?: boolean;
}

const sizeClasses: Record<DropdownSize, { trigger: string; text: string; icon: string }> = {
  sm: {
    trigger: 'px-2.5 py-1.5 text-xs rounded-lg min-h-[32px]',
    text: 'text-xs',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    trigger: 'px-3 py-2 text-sm rounded-lg min-h-[40px]',
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    trigger: 'px-4 py-2.5 text-base rounded-xl min-h-[48px]',
    text: 'text-base',
    icon: 'w-5 h-5',
  },
};

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      id,
      label,
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      searchable = false,
      clearable = false,
      size = 'md',
      glass = true,
      error,
      hint,
      disabled = false,
      className = '',
      requiredIndicator = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const generatedId = useId();
    const dropdownId = id || generatedId;
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = searchable && searchQuery.trim() !== ''
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

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

    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement | HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const opt = filteredOptions[highlightedIndex];
          if (!opt.disabled) {
            onChange(opt.value);
            setIsOpen(false);
            setSearchQuery('');
          }
        } else {
          setIsOpen(!isOpen);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const { trigger: triggerSizeClass, text: textSizeClass, icon: iconSizeClass } = sizeClasses[size];

    return (
      <div ref={ref || containerRef} className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={dropdownId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight"
          >
            {label}
            {requiredIndicator && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            id={dropdownId}
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`w-full flex items-center justify-between text-left transition-all duration-200 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${
              glass ? 'glass-input' : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700'
            } ${triggerSizeClass} ${
              isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
            } ${error ? 'border-rose-400 dark:border-rose-500' : ''}`}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedOption?.icon && (
                <span className="shrink-0 text-slate-500">{selectedOption.icon}</span>
              )}
              <span
                className={`truncate ${textSizeClass} ${
                  selectedOption
                    ? 'text-slate-900 dark:text-slate-100 font-medium'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {clearable && selectedOption && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronDown
                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${iconSizeClass} ${
                  isOpen ? 'rotate-180 text-blue-500' : ''
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute z-50 left-0 right-0 glass-dropdown-menu rounded-xl shadow-xl overflow-hidden py-1 max-h-60 flex flex-col"
              >
                {searchable && (
                  <div className="p-2 border-b border-slate-100 dark:border-white/5">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setHighlightedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-100/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 outline-none border border-transparent focus:border-blue-500/50"
                      />
                    </div>
                  </div>
                )}

                <div className="overflow-y-auto max-h-52 divide-y divide-slate-50 dark:divide-white/5">
                  {filteredOptions.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400 dark:text-slate-500">
                      No matching options
                    </div>
                  ) : (
                    filteredOptions.map((opt, idx) => {
                      const isSelected = opt.value === value;
                      const isHighlighted = idx === highlightedIndex;

                      return (
                        <div
                          key={opt.value}
                          onClick={() => {
                            if (!opt.disabled) {
                              onChange(opt.value);
                              setIsOpen(false);
                              setSearchQuery('');
                            }
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                            opt.disabled
                              ? 'opacity-40 cursor-not-allowed'
                              : isSelected
                              ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                              : isHighlighted
                              ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                            <div>
                              <div className="truncate">{opt.label}</div>
                              {opt.description && (
                                <div className="text-[10px] text-slate-400 font-normal">
                                  {opt.description}
                                </div>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
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

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;
