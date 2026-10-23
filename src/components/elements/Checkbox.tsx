import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Check, Minus } from 'lucide-react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  size?: CheckboxSize;
  card?: boolean;
}

const sizeClasses: Record<CheckboxSize, { box: string; icon: string; text: string; desc: string }> = {
  sm: {
    box: 'w-4 h-4 rounded-md',
    icon: 'w-3 h-3',
    text: 'text-xs',
    desc: 'text-[11px]',
  },
  md: {
    box: 'w-5 h-5 rounded-lg',
    icon: 'w-3.5 h-3.5',
    text: 'text-sm',
    desc: 'text-xs',
  },
  lg: {
    box: 'w-6 h-6 rounded-lg',
    icon: 'w-4 h-4',
    text: 'text-base',
    desc: 'text-sm',
  },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      checked = false,
      onChange,
      indeterminate = false,
      label,
      description,
      size = 'md',
      card = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const { box: boxSizeClass, icon: iconSizeClass, text: textSizeClass, desc: descSizeClass } = sizeClasses[size];

    const isCheckedOrIndeterminate = checked || indeterminate;

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-start gap-2.5 select-none transition-all duration-200 ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        } ${
          card
            ? `p-3 rounded-xl border transition-all ${
                checked
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/80 shadow-xs'
                  : 'glass-card border-slate-200/80 dark:border-white/10 hover:border-slate-300'
              }`
            : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="sr-only peer"
            {...props}
          />

          <div
            className={`border flex items-center justify-center transition-all duration-200 ${boxSizeClass} ${
              isCheckedOrIndeterminate
                ? 'bg-[#1956db] border-[#1956db] text-white shadow-xs'
                : 'bg-white/80 dark:bg-slate-900/80 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30 peer-focus-visible:ring-offset-1`}
          >
            {indeterminate ? (
              <Minus className={`${iconSizeClass} stroke-[3]`} />
            ) : checked ? (
              <Check className={`${iconSizeClass} stroke-[3]`} />
            ) : null}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span
                className={`font-medium text-slate-800 dark:text-slate-100 tracking-tight leading-tight ${textSizeClass}`}
              >
                {label}
              </span>
            )}
            {description && (
              <span className={`text-slate-400 dark:text-slate-500 mt-0.5 leading-snug ${descSizeClass}`}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
