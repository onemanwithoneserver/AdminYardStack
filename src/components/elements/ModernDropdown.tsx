import { useState, useRef, useEffect, useLayoutEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
  wrapText?: boolean;
}

interface DropdownCoords {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  actualDropUp: boolean;
}

export function ModernDropdown<T extends string | number = string | number>({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  size = 'sm',
  disabled = false,
  prefix,
  align = 'left',
  dropUp = false,
  roundedClass,
  wrapText = true,
}: ModernDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: DropdownOption<T>[] = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as DropdownOption<T>;
    }
    return {
      value: opt as T,
      label: String(opt),
    };
  });

  const isStringVal = typeof value === 'string';
  const trimmedVal = isStringVal ? (value as string).trim().toLowerCase() : '';

  const isEmptyValue =
    value === undefined ||
    value === null ||
    value === '' ||
    (isStringVal && trimmedVal.startsWith('select'));

  const selectedOption = isEmptyValue
    ? undefined
    : normalizedOptions.find(
        (opt) => opt.value === value && opt.value !== '' && String(opt.value).trim() !== ''
      );

  const labelString =
    selectedOption && typeof selectedOption.label === 'string'
      ? selectedOption.label.trim().toLowerCase()
      : '';

  const isPlaceholder =
    !selectedOption ||
    !selectedOption.label ||
    (typeof selectedOption.label === 'string' &&
      (labelString === '' || labelString.startsWith('select')));

  const displayPlaceholder = placeholder || 'Select option...';
  const displayLabel = isPlaceholder ? displayPlaceholder : selectedOption.label;

  
  const displayOptions = normalizedOptions.filter((opt) => {
    const valStr = String(opt.value ?? '').trim().toLowerCase();
    const labelStr = (typeof opt.label === 'string' ? opt.label : '').trim().toLowerCase();
    if (valStr === '' || valStr.startsWith('select')) {
      if (!opt.label || labelStr === '' || labelStr.startsWith('select')) {
        return false;
      }
    }
    return true;
  });

  
  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    
    if (rect.bottom < -20 || rect.top > viewportHeight + 20) {
      setIsOpen(false);
      return;
    }

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let shouldDropUp = dropUp === true;
    if (dropUp !== true) {
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        shouldDropUp = true;
      } else {
        shouldDropUp = false;
      }
    }

    const availableSpace = shouldDropUp ? spaceAbove - 16 : spaceBelow - 16;
    const boundedMaxHeight = Math.max(120, Math.min(300, Math.floor(availableSpace)));

    const width = Math.max(rect.width, 180);

    let left = rect.left;
    if (align === 'right' || rect.left + width > viewportWidth - 12) {
      left = Math.max(10, rect.right - width);
    } else {
      left = Math.max(10, Math.min(left, viewportWidth - width - 10));
    }

    
    const top = shouldDropUp ? Math.max(10, rect.top - 6) : rect.bottom + 6;

    setCoords({
      top,
      left,
      width,
      maxHeight: boundedMaxHeight,
      actualDropUp: shouldDropUp,
    });
  }, [align, dropUp]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  const handleSelect = (option: DropdownOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  const sizeClasses = {
    xs: `px-1.5 py-1 text-[11px] ${roundedClass || 'rounded-[4px]'} gap-1`,
    sm: `px-2.5 py-1.5 text-xs ${roundedClass || 'rounded-[4px]'} gap-1.5`,
    md: `px-2.5 py-2 text-xs ${roundedClass || 'rounded-[4px]'} gap-2`,
    lg: `px-3 py-2.5 text-sm ${roundedClass || 'rounded-[4px]'} gap-2.5`,
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  };

  const hasCustomBg = buttonClassName.includes('bg-');

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left max-w-full ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex items-center justify-between tracking-tight transition-all duration-150 cursor-pointer select-none border shadow-2xs active:scale-[0.98] w-auto max-w-full ${
          wrapText ? 'text-left min-h-[36px] h-auto' : 'whitespace-nowrap'
        } ${
          sizeClasses[size]
        } ${
          isOpen
            ? 'border-blue-500/80 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/15'
            : `border-slate-200/90 dark:border-white/10 ${hasCustomBg ? '' : 'bg-white/90 dark:bg-slate-900/80'} text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800/70`
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <div className={`flex items-center gap-1.5 min-w-0 ${wrapText ? 'text-left' : 'whitespace-nowrap'}`}>
          {prefix && <span className="shrink-0 text-slate-400">{prefix}</span>}
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500 dark:text-slate-400">{selectedOption.icon}</span>
          )}
          <span
            className={`${wrapText ? 'break-words text-left min-w-0 leading-snug' : 'whitespace-nowrap'} ${
              isPlaceholder
                ? 'text-slate-400 dark:text-slate-500 font-normal'
                : 'text-slate-800 dark:text-slate-100 font-semibold'
            }`}
          >
            {displayLabel}
          </span>
          {selectedOption?.badge && (
            <span className={`px-1.5 py-0.2 ${roundedClass || 'rounded-[2px]'} text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0`}>
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`${iconSizes[size]} text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ml-1.5 self-center ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
        />
      </button>

      
      {isOpen && coords && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            minWidth: `${coords.width}px`,
            maxWidth: 'calc(100vw - 20px)',
            transform: coords.actualDropUp ? 'translateY(-100%)' : undefined,
            zIndex: 999999,
          }}
          className={`p-1.5 border border-slate-200/90 dark:border-white/15 bg-white dark:bg-slate-900 shadow-2xl backdrop-blur-2xl ${
            roundedClass || 'rounded-[6px]'
          } flex flex-col animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
        >
          <div
            className="overflow-y-auto space-y-0.5 overscroll-contain"
            style={{ maxHeight: `${coords.maxHeight}px` }}
          >
            {displayOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic text-center">
                No options available
              </div>
            ) : (
              displayOptions.map((opt, i) => {
                const isSelected = !isEmptyValue && opt.value === value;
                return (
                  <button
                    key={`${String(opt.value)}-${i}`}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 ${roundedClass || 'rounded-[4px]'} text-xs font-semibold transition-all duration-100 text-left select-none ${
                      opt.disabled
                        ? 'opacity-35 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {opt.icon && <span className="shrink-0 text-slate-500 dark:text-slate-400">{opt.icon}</span>}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{opt.label}</span>
                        {opt.description && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                      {opt.badge && (
                        <span className={`px-1.5 py-0.2 ${roundedClass || 'rounded-[2px]'} text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300`}>
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ModernDropdown;
