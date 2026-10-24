import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string | number = string | number> {
  value: T;
  label: string | ReactNode;
  icon?: ReactNode;
  badge?: string | number;
  description?: string;
  disabled?: boolean;
}

export interface ModernDropdownProps<T extends string | number = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: (DropdownOption<T> | T)[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  prefix?: ReactNode;
  align?: 'left' | 'right';
  dropUp?: boolean;
  roundedClass?: string;
}

export function ModernDropdown<T extends string | number = string | number>({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  size = 'sm',
  disabled = false,
  prefix,
  align = 'left',
  dropUp = false,
  roundedClass,
}: ModernDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options into DropdownOption shape
  const normalizedOptions: DropdownOption<T>[] = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as DropdownOption<T>;
    }
    return {
      value: opt as T,
      label: String(opt),
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const sizeClasses = {
    xs: `px-2 py-1 text-[11px] ${roundedClass || 'rounded-lg'} gap-1.5`,
    sm: `px-2.5 py-1.5 text-xs ${roundedClass || 'rounded-xl'} gap-2`,
    md: `px-3.5 py-2 text-xs ${roundedClass || 'rounded-xl'} gap-2.5`,
    lg: `px-4 py-2.5 text-sm ${roundedClass || 'rounded-2xl'} gap-3`,
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex items-center justify-between font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none border shadow-2xs active:scale-[0.98] ${
          sizeClasses[size]
        } ${
          isOpen
            ? 'border-blue-500/80 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-3 ring-blue-500/15'
            : 'border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800/70'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {prefix && <span className="shrink-0 text-slate-400">{prefix}</span>}
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500 dark:text-slate-400">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`px-1.5 py-0.2 ${roundedClass || 'rounded-full'} text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300`}>
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`${iconSizes[size]} text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute z-50 min-w-[140px] max-w-xs ${roundedClass || 'rounded-2xl'} p-1.5 border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
            dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${align === 'right' ? 'right-0' : 'left-0'} ${menuClassName}`}
        >
          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {normalizedOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 text-xs font-semibold ${roundedClass || 'rounded-xl'} transition-all cursor-pointer text-left select-none ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : option.disabled
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50/70 dark:hover:bg-white/[0.07] hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {option.icon && (
                      <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                        {option.icon}
                      </span>
                    )}
                    <div className="truncate">
                      <div className="truncate">{option.label}</div>
                      {option.description && (
                        <div
                          className={`text-[10px] font-normal truncate ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {option.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModernDropdown;
