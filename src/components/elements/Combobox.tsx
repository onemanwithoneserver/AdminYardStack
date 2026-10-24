import { useState, useRef, useEffect, useId, forwardRef, type KeyboardEvent } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  id?: string;
  label?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearable?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  requiredIndicator?: boolean;
  allowCustom?: boolean;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      id,
      label,
      options,
      value,
      onChange,
      placeholder = 'Type or select...',
      clearable = true,
      error,
      hint,
      disabled = false,
      className = '',
      requiredIndicator = false,
      allowCustom = true,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const generatedId = useId();
    const comboboxId = id || generatedId;
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentDisplayValue = searchQuery !== null ? searchQuery : value;

    const filteredOptions = options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(currentDisplayValue.toLowerCase()) ||
        opt.value.toLowerCase().includes(currentDisplayValue.toLowerCase())
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchQuery(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          e.preventDefault();
          const opt = filteredOptions[highlightedIndex];
          onChange(opt.value);
          setSearchQuery(null);
          setIsOpen(false);
        } else if (allowCustom && currentDisplayValue) {
          onChange(currentDisplayValue);
          setSearchQuery(null);
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery(null);
      }
    };

    return (
      <div ref={containerRef} className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={comboboxId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight"
          >
            {label}
            {requiredIndicator && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref || inputRef}
            id={comboboxId}
            type="text"
            value={currentDisplayValue}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (allowCustom) onChange(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            className={`w-full px-3 py-2 text-sm rounded-lg pr-16 transition-all duration-200 outline-none glass-input placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? 'border-rose-400 dark:border-rose-500' : ''
            }`}
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            {clearable && currentDisplayValue && !disabled && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(null);
                  onChange('');
                }}
                className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-transform duration-200"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                }`}
              />
            </button>
          </div>

          <AnimatePresence>
            {isOpen && filteredOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-full left-0 right-0 z-50 mt-1 glass-dropdown-menu rounded-xl shadow-xl overflow-hidden py-1 max-h-56 overflow-y-auto"
              >
                {filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setSearchQuery(null);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                          : isHighlighted
                          ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })}
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

Combobox.displayName = 'Combobox';
export default Combobox;
