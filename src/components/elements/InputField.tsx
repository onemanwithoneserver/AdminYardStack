import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  size?: InputSize;
  glass?: boolean;
  requiredIndicator?: boolean;
}

const sizeClasses: Record<InputSize, { input: string; icon: string; wrapper: string }> = {
  sm: {
    input: 'px-2.5 py-1.5 text-xs rounded-lg',
    icon: 'w-3.5 h-3.5',
    wrapper: 'text-xs',
  },
  md: {
    input: 'px-3 py-2 text-sm rounded-lg',
    icon: 'w-4 h-4',
    wrapper: 'text-sm',
  },
  lg: {
    input: 'px-4 py-2.5 text-base rounded-xl',
    icon: 'w-5 h-5',
    wrapper: 'text-base',
  },
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      size = 'md',
      glass = true,
      requiredIndicator = false,
      className = '',
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const { input: inputSizeClass, icon: iconSizeClass } = sizeClasses[size];

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight"
          >
            {label}
            {requiredIndicator && <span className="text-rose-700 dark:text-rose-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className={`absolute left-3 text-slate-600 dark:text-slate-400 pointer-events-none flex items-center justify-center shrink-0`}>
              <span className={iconSizeClass}>{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full transition-all duration-200 outline-none placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              glass ? 'glass-input' : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
            } ${inputSizeClass} ${leftIcon ? 'pl-9' : ''} ${
              rightIcon || (clearable && hasValue) ? 'pr-9' : ''
            } ${
              error
                ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : ''
            } ${className}`}
            {...props}
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={onClear}
                tabIndex={-1}
                aria-label="Clear input"
                className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {rightIcon && (
              <span className={`text-slate-600 dark:text-slate-400 pointer-events-none ${iconSizeClass}`}>
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {error && (
          <p id={errorId} className="text-xs text-rose-700 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-xs text-slate-600 dark:text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;
