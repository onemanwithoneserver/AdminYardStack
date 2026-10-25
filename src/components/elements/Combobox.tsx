import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
  forwardRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X, Plus } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export interface ComboboxProps {
  id?: string;
  label?: string;
  options: (ComboboxOption | string)[];
  value: string;
  onChange: (value: string) => void;
  onAddItem?: (newItem: string) => void;
  placeholder?: string;
  clearable?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  menuClassName?: string;
  requiredIndicator?: boolean;
  allowCustom?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  roundedClass?: string;
  dropUp?: boolean;
  align?: 'left' | 'right';
}

interface DropdownCoords {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  actualDropUp: boolean;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      id,
      label,
      options,
      value,
      onChange,
      onAddItem,
      placeholder = 'Type or select...',
      clearable = true,
      error,
      hint,
      disabled = false,
      className = '',
      inputClassName = '',
      menuClassName = '',
      requiredIndicator = false,
      allowCustom = true,
      size = 'sm',
      roundedClass = 'rounded-[4px]',
      dropUp,
      align = 'left',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [coords, setCoords] = useState<DropdownCoords | null>(null);

    const generatedId = useId();
    const comboboxId = id || generatedId;
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Normalize options
    const normalizedOptions: ComboboxOption[] = options.map((opt) => {
      if (typeof opt === 'object' && opt !== null && 'value' in opt) {
        return opt as ComboboxOption;
      }
      return {
        value: String(opt),
        label: String(opt),
      };
    });

    const selectedOption = normalizedOptions.find(
      (opt) => opt.value === value || opt.label === value
    );

    const currentDisplayValue =
      searchQuery !== null
        ? searchQuery
        : selectedOption
        ? selectedOption.label
        : value || '';

    // Filter options based on query
    const trimmedQuery = (searchQuery !== null ? searchQuery : '').trim().toLowerCase();
    const filteredOptions = normalizedOptions.filter((opt) => {
      if (!trimmedQuery) return true;
      return (
        opt.label.toLowerCase().includes(trimmedQuery) ||
        opt.value.toLowerCase().includes(trimmedQuery)
      );
    });

    // Check if query is an exact match to any existing option
    const hasExactMatch =
      trimmedQuery.length > 0 &&
      normalizedOptions.some(
        (opt) =>
          opt.label.trim().toLowerCase() === trimmedQuery ||
          opt.value.trim().toLowerCase() === trimmedQuery
      );

    const canAddNew = allowCustom && trimmedQuery.length > 0 && !hasExactMatch;

    // Calculate fixed coordinates for portal
    const updatePosition = useCallback(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let shouldDropUp = dropUp === true;
      if (dropUp !== true) {
        if (spaceBelow < 220 && spaceAbove > spaceBelow) {
          shouldDropUp = true;
        } else {
          shouldDropUp = false;
        }
      }

      const availableSpace = shouldDropUp ? spaceAbove - 16 : spaceBelow - 16;
      const boundedMaxHeight = Math.max(140, Math.min(280, Math.floor(availableSpace)));
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
    }, [isOpen, updatePosition, filteredOptions.length, canAddNew]);

    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        const target = e.target as Node;
        if (
          containerRef.current &&
          !containerRef.current.contains(target) &&
          menuRef.current &&
          !menuRef.current.contains(target)
        ) {
          setIsOpen(false);
          setSearchQuery(null);
        }
      };

      const handleScrollOrResize = () => {
        updatePosition();
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }, [isOpen, updatePosition]);

    const handleAddNew = (newItem: string) => {
      const trimmed = newItem.trim();
      if (!trimmed) return;
      onAddItem?.(trimmed);
      onChange(trimmed);
      setSearchQuery(null);
      setIsOpen(false);
    };

    const handleSelectOption = (optValue: string) => {
      onChange(optValue);
      setSearchQuery(null);
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      const totalItems = filteredOptions.length + (canAddNew ? 1 : 0);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          updatePosition();
        } else {
          setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          updatePosition();
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        }
      } else if (e.key === 'Enter') {
        if (isOpen) {
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelectOption(filteredOptions[highlightedIndex].value);
          } else if (
            canAddNew &&
            (highlightedIndex === filteredOptions.length || highlightedIndex === -1)
          ) {
            handleAddNew(searchQuery || currentDisplayValue);
          } else if (filteredOptions.length > 0 && highlightedIndex === -1) {
            handleSelectOption(filteredOptions[0].value);
          }
        } else {
          setIsOpen(true);
          updatePosition();
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery(null);
      }
    };

    // Size styling
    const sizeClasses = {
      xs: 'h-7 text-xs px-2',
      sm: 'h-8 text-xs px-2.5',
      md: 'h-9 text-xs px-3',
      lg: 'h-10 text-sm px-3.5',
    }[size];

    return (
      <div ref={containerRef} className={`relative w-full ${className}`}>
        {label && (
          <label
            htmlFor={comboboxId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            {label}
            {requiredIndicator && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <input
            ref={ref || inputRef}
            id={comboboxId}
            type="text"
            value={currentDisplayValue}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(0);
              updatePosition();
            }}
            onFocus={() => {
              setIsOpen(true);
              updatePosition();
            }}
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
                updatePosition();
              }
            }}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            className={`w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 ${roundedClass} text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-14 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${inputClassName} ${
              error ? 'border-rose-400 dark:border-rose-500' : ''
            }`}
          />

          <div className="absolute right-1.5 flex items-center gap-0.5 pointer-events-auto">
            {clearable && currentDisplayValue && !disabled && (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                  setSearchQuery(null);
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="p-1 rounded-[2px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Clear"
                aria-label="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => {
                  const next = !prev;
                  if (next) {
                    setSearchQuery(null);
                    setHighlightedIndex(-1);
                  }
                  return next;
                });
                if (!isOpen) updatePosition();
              }}
              className="p-1 rounded-[2px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle options"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}

        {isOpen &&
          coords &&
          createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                maxHeight: `${coords.maxHeight}px`,
                zIndex: 99999,
              }}
              className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 ${roundedClass} shadow-xl overflow-hidden py-1 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
            >
              {/* Option List */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value || opt.label === value;
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectOption(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex items-center justify-between px-2.5 py-1.5 text-xs cursor-pointer transition-colors select-none ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold'
                          : isHighlighted
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                        {opt.badge && (
                          <span className="text-[10px] font-mono px-1 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[2px]">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : !canAddNew ? (
                <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center italic">
                  No matching options
                </div>
              ) : null}

              {/* Add New Item Button */}
              {canAddNew && (
                <div
                  role="button"
                  tabIndex={0}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleAddNew(searchQuery || currentDisplayValue)}
                  onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                  className={`flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-[4px] cursor-pointer transition-colors border mx-1.5 my-1 active:scale-[0.98] select-none ${
                    highlightedIndex === filteredOptions.length
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                      : 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/90 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                  }`}
                >
                  <span className="w-4 h-4 rounded-[3px] bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </span>
                  <span className="truncate">
                    Add "{searchQuery || currentDisplayValue}"
                  </span>
                </div>
              )}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';
export default Combobox;
