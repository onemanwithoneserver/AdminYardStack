import { useState, useRef, useEffect, useLayoutEffect, useCallback, type ReactNode } from 'react';
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
  wrapText = true,
}: ModernDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [actualDropUp, setActualDropUp] = useState<boolean>(dropUp);
  const [actualAlign, setActualAlign] = useState<'left' | 'right'>(align);
  const [maxMenuHeight, setMaxMenuHeight] = useState<number | undefined>(undefined);
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

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Dynamic positioning calculation based on viewport space and scroll
  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Use measured height if menu is rendered, otherwise sensible fallback
    const menuEl = menuRef.current;
    const requiredHeight = menuEl ? menuEl.offsetHeight : 220;

    let shouldDropUp = dropUp === true;

    // If dropUp wasn't strictly forced to true, auto-detect clearance:
    // If space below is not enough to show full dropdown without truncating / scrolling,
    // and space above has more clearance, float should appear at the top!
    if (dropUp !== true) {
      if (spaceBelow < requiredHeight && spaceAbove > spaceBelow) {
        shouldDropUp = true;
      } else if (spaceBelow < 180 && spaceAbove >= 180) {
        shouldDropUp = true;
      } else {
        shouldDropUp = false;
      }
    }

    setActualDropUp(shouldDropUp);

    // Dynamic max-height constraint so it never overflows off-screen or gets truncated
    const availableSpace = shouldDropUp ? spaceAbove - 16 : spaceBelow - 16;
    const boundedMaxHeight = Math.max(100, Math.min(260, Math.floor(availableSpace)));
    setMaxMenuHeight(boundedMaxHeight);

    // Horizontal bounds check: if opening aligned to left would overflow right viewport boundary
    let shouldAlignRight = align === 'right';
    const estimatedWidth = menuEl ? menuEl.offsetWidth : 240;
    if (align !== 'right') {
      if (rect.left + estimatedWidth > viewportWidth - 12 && rect.right >= estimatedWidth) {
        shouldAlignRight = true;
      }
    }
    setActualAlign(shouldAlignRight ? 'right' : 'left');
  }, [align, dropUp]);

  // Keep dropUp in sync if parent prop changes
  useEffect(() => {
    if (dropUp !== undefined) {
      setActualDropUp(dropUp);
    }
  }, [dropUp]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  // Recalculate on scroll and resize to keep dropdown float perfectly positioned
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
    };
  }, [isOpen, updatePosition]);

  // Handle outside click & Escape
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

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      // Pre-calculate position immediately on click to prevent any 1-frame visual jump
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const shouldDropUp = dropUp === true || (spaceBelow < 220 && spaceAbove > spaceBelow);
      setActualDropUp(shouldDropUp);

      const availableSpace = shouldDropUp ? spaceAbove - 16 : spaceBelow - 16;
      setMaxMenuHeight(Math.max(100, Math.min(260, Math.floor(availableSpace))));

      if (align !== 'right' && rect.left + 240 > viewportWidth - 12 && rect.right >= 240) {
        setActualAlign('right');
      } else {
        setActualAlign(align);
      }
    }
    setIsOpen((prev) => !prev);
  };

  const sizeClasses = {
    xs: `px-1.5 py-1 text-[11px] ${roundedClass || 'rounded-lg'} gap-1`,
    sm: `px-2 py-1.5 text-xs ${roundedClass || 'rounded-xl'} gap-1.5`,
    md: `px-2.5 py-2 text-xs ${roundedClass || 'rounded-xl'} gap-2`,
    lg: `px-3 py-2.5 text-sm ${roundedClass || 'rounded-2xl'} gap-2.5`,
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
      className={`relative inline-block text-left max-w-full ${isOpen ? 'z-[9999]' : ''} ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex items-center justify-between font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none border shadow-2xs active:scale-[0.98] w-auto max-w-full ${
          wrapText ? 'text-left min-h-[36px] h-auto' : 'whitespace-nowrap'
        } ${
          sizeClasses[size]
        } ${
          isOpen
            ? 'border-blue-500/80 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-3 ring-blue-500/15'
            : `border-slate-200/90 dark:border-white/10 ${hasCustomBg ? '' : 'bg-white/90 dark:bg-slate-900/80'} text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800/70`
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <div className={`flex items-center gap-1.5 min-w-0 ${wrapText ? 'text-left' : 'whitespace-nowrap'}`}>
          {prefix && <span className="shrink-0 text-slate-400">{prefix}</span>}
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500 dark:text-slate-400">{selectedOption.icon}</span>
          )}
          <span className={wrapText ? 'break-words text-left min-w-0 leading-snug' : 'whitespace-nowrap'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`px-1.5 py-0.2 ${roundedClass || 'rounded-full'} text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0`}>
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

      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          className={`absolute z-[9999] min-w-full w-max max-w-sm ${roundedClass || 'rounded-2xl'} p-1.5 border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col ${
            actualDropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${actualAlign === 'right' ? 'right-0' : 'left-0'} ${menuClassName}`}
        >
          <div
            className="overflow-y-auto space-y-0.5"
            style={maxMenuHeight ? { maxHeight: `${Math.max(80, maxMenuHeight - 12)}px` } : { maxHeight: '240px' }}
          >
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
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {option.icon && (
                      <span className={`shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {option.icon}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="break-words whitespace-normal text-left leading-snug">{option.label}</div>
                      {option.description && (
                        <div
                          className={`text-[10px] font-normal break-words leading-tight ${
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
