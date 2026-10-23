import { forwardRef, useId, type ReactNode } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleSwitchProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: ToggleSize;
  disabled?: boolean;
  className?: string;
}

const switchSizes: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'w-8 h-4.5 p-0.5',
    thumb: 'w-3.5 h-3.5',
    translate: 'translate-x-3.5',
  },
  md: {
    track: 'w-11 h-6 p-0.5',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7.5 p-1',
    thumb: 'w-5.5 h-5.5',
    translate: 'translate-x-6.5',
  },
};

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  (
    {
      id,
      checked = false,
      onChange,
      label,
      description,
      size = 'md',
      disabled = false,
      className = '',
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const { track, thumb, translate } = switchSizes[size];

    return (
      <label
        htmlFor={switchId}
        className={`inline-flex items-start gap-3 select-none transition-all ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      >
        <div className="relative flex items-center shrink-0 mt-0.5">
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="sr-only peer"
          />

          <div
            className={`rounded-full transition-colors duration-200 border flex items-center ${track} ${
              checked
                ? 'bg-[#1956db] border-[#1956db] shadow-xs'
                : 'bg-slate-200/90 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30 peer-focus-visible:ring-offset-1`}
          >
            <div
              className={`rounded-full bg-white shadow-sm transform transition-transform duration-200 ${thumb} ${
                checked ? translate : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedToggleProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export function SegmentedToggle<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
}: SegmentedToggleProps<T>) {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl glass-surface border border-slate-200/80 dark:border-white/10 ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all duration-200 select-none cursor-pointer ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
            } ${
              isSelected
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ToggleSwitch;
