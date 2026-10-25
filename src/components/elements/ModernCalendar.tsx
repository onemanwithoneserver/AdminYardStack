import { useState, useRef, useEffect, useLayoutEffect, useCallback, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';

export interface ModernCalendarProps {
  value?: string; 
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  dropUp?: boolean;
  align?: 'left' | 'right';
  roundedClass?: string;
  clearable?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseISODate(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d);
    }
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  if (!d) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTH_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function ModernCalendar({
  value = '',
  onChange,
  placeholder = 'dd-mm-yyyy',
  minDate,
  maxDate,
  disabled = false,
  className = '',
  buttonClassName = '',
  dropUp = false,
  align = 'left',
  roundedClass = 'rounded-[4px]',
  clearable = true,
  id,
  name,
  required = false,
}: ModernCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; actualDropUp: boolean } | null>(null);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  const selectedDate = parseISODate(value);
  const today = new Date();

  
  const [viewDate, setViewDate] = useState<Date>(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  
  const [yearRangeStart, setYearRangeStart] = useState<number>(() => {
    const currentYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
    return Math.floor(currentYear / 12) * 12;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (value) {
      const parsed = parseISODate(value);
      if (parsed) {
        setViewDate(new Date(parsed));
      }
    }
  }, [value]);

  
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
    const popoverHeight = 310;

    let shouldDropUp = dropUp === true;
    if (dropUp !== true) {
      if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
        shouldDropUp = true;
      } else {
        shouldDropUp = false;
      }
    }

    let left = rect.left;
    if (align === 'right' || rect.left + 280 > viewportWidth - 12) {
      left = Math.max(10, rect.right - 280);
    } else {
      left = Math.max(10, Math.min(left, viewportWidth - 280 - 10));
    }

    const top = shouldDropUp ? Math.max(10, rect.top - 6) : rect.bottom + 6;

    setCoords({ top, left, actualDropUp: shouldDropUp });
  }, [align, dropUp]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScrollOrResize = () => updatePosition();
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
    };
  }, [isOpen, updatePosition]);

  
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setViewMode('days');
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
    if (!isOpen) {
      if (selectedDate) {
        setViewDate(new Date(selectedDate));
      } else {
        setViewDate(new Date());
      }
      setViewMode('days');
    }
    setIsOpen((prev) => !prev);
  };

  const handlePrevMonth = (e: MouseEvent) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (viewMode === 'months') {
      setViewDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
    } else if (viewMode === 'years') {
      setYearRangeStart((prev) => prev - 12);
    }
  };

  const handleNextMonth = (e: MouseEvent) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (viewMode === 'months') {
      setViewDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
    } else if (viewMode === 'years') {
      setYearRangeStart((prev) => prev + 12);
    }
  };

  const handleSelectDay = (day: number, e: MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(formatISODate(newDate));
    setIsOpen(false);
    setViewMode('days');
  };

  const handleSelectMonth = (monthIdx: number, e: MouseEvent) => {
    e.stopPropagation();
    setViewDate((prev) => new Date(prev.getFullYear(), monthIdx, 1));
    setViewMode('days');
  };

  const handleSelectYear = (year: number, e: MouseEvent) => {
    e.stopPropagation();
    setViewDate((prev) => new Date(year, prev.getMonth(), 1));
    setViewMode('months');
  };

  const handleSelectToday = (e: MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    setViewDate(new Date(now));
    onChange(formatISODate(now));
    setIsOpen(false);
    setViewMode('days');
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setViewMode('days');
  };

  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: Array<{
    day: number;
    monthOffset: -1 | 0 | 1;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
  }> = [];

  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      monthOffset: -1,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: true,
    });
  }

  
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d;

    const isSelected =
      !!selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === d;

    let isDayDisabled = false;
    if (minDate) {
      const minD = parseISODate(minDate);
      if (minD && new Date(year, month, d) < minD) isDayDisabled = true;
    }
    if (maxDate) {
      const maxD = parseISODate(maxDate);
      if (maxD && new Date(year, month, d) > maxD) isDayDisabled = true;
    }

    calendarDays.push({
      day: d,
      monthOffset: 0,
      isCurrentMonth: true,
      isToday,
      isSelected,
      isDisabled: isDayDisabled,
    });
  }

  
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      monthOffset: 1,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: true,
    });
  }

  return (
    <div
      ref={containerRef}
      style={{ zIndex: isOpen ? 99999 : undefined }}
      className={`relative inline-block text-left w-full ${isOpen ? 'z-[99999]' : ''} ${className}`}
    >
      
      <input
        type="hidden"
        id={id}
        name={name}
        value={value}
        required={required}
      />

      
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full h-9 px-3 flex items-center justify-between text-xs font-medium border shadow-2xs transition-all duration-150 select-none cursor-pointer ${roundedClass} ${
          isOpen
            ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 text-slate-900 dark:text-white ring-2 ring-blue-500/20'
            : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-white/20'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className={`truncate ${value ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {clearable && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClear(e as unknown as MouseEvent);
                }
              }}
              className="p-1 -mr-1 rounded-[2px] text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear date"
            >
              <X className="w-3 h-3" />
            </span>
          )}
        </div>
      </button>

      
      {isOpen && coords && typeof document !== 'undefined' && createPortal(
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Date Picker"
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: coords.actualDropUp ? 'translateY(-100%)' : undefined,
            zIndex: 999999,
          }}
          className="w-[280px] p-3 rounded-[6px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-[3px] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 font-display text-xs font-bold text-slate-900 dark:text-white">
              {viewMode === 'days' && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    className="px-1.5 py-0.5 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {MONTH_NAMES[month]}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setYearRangeStart(Math.floor(year / 12) * 12);
                      setViewMode('years');
                    }}
                    className="px-1.5 py-0.5 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-mono"
                  >
                    {year}
                  </button>
                </>
              )}

              {viewMode === 'months' && (
                <button
                  type="button"
                  onClick={() => {
                    setYearRangeStart(Math.floor(year / 12) * 12);
                    setViewMode('years');
                  }}
                  className="px-2 py-0.5 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 font-mono text-xs cursor-pointer"
                >
                  {year}
                </button>
              )}

              {viewMode === 'years' && (
                <span className="font-mono text-xs text-slate-700 dark:text-slate-200">
                  {yearRangeStart} – {yearRangeStart + 11}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-[3px] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          
          {viewMode === 'days' && (
            <div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {WEEKDAY_NAMES.map((name) => (
                  <div
                    key={name}
                    className="text-[10px] font-bold text-slate-400 dark:text-slate-500 py-1"
                  >
                    {name}
                  </div>
                ))}
              </div>

              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((cell, idx) => {
                  if (!cell.isCurrentMonth) {
                    return (
                      <div
                        key={`cell-${idx}`}
                        className="h-7 flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-700 select-none font-mono"
                      >
                        {cell.day}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={`day-${cell.day}`}
                      type="button"
                      disabled={cell.isDisabled}
                      onClick={(e) => handleSelectDay(cell.day, e)}
                      className={`h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-[3px] font-mono transition-all cursor-pointer ${
                        cell.isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-xs active:scale-95'
                          : cell.isToday
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95'
                      } ${cell.isDisabled ? 'opacity-25 cursor-not-allowed pointer-events-none' : ''}`}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          
          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-2 py-1">
              {MONTH_SHORT.map((mName, mIdx) => {
                const isCurrent = viewDate.getMonth() === mIdx;
                const isSelected = selectedDate && selectedDate.getMonth() === mIdx && selectedDate.getFullYear() === viewDate.getFullYear();
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={(e) => handleSelectMonth(mIdx, e)}
                    className={`h-9 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-300 dark:border-blue-800'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {mName}
                  </button>
                );
              })}
            </div>
          )}

          
          {viewMode === 'years' && (
            <div className="grid grid-cols-3 gap-2 py-1">
              {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yNum) => {
                const isCurrent = viewDate.getFullYear() === yNum;
                const isSelected = selectedDate && selectedDate.getFullYear() === yNum;
                return (
                  <button
                    key={yNum}
                    type="button"
                    onClick={(e) => handleSelectYear(yNum, e)}
                    className={`h-9 rounded-[3px] text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-300 dark:border-blue-800'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {yNum}
                  </button>
                );
              })}
            </div>
          )}

          
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-white/10 text-[11px]">
            <button
              type="button"
              onClick={handleSelectToday}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Today</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ModernCalendar;
