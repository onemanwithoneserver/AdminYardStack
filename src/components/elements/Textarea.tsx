import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  glass?: boolean;
  requiredIndicator?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      error,
      hint,
      showCount = false,
      maxLength,
      glass = true,
      requiredIndicator = false,
      className = '',
      value,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const currentLength = value !== undefined && value !== null ? String(value).length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight"
            >
              {label}
              {requiredIndicator && <span className="text-rose-700 dark:text-rose-400 ml-1">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full p-3 text-sm rounded-xl transition-all duration-200 outline-none placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
            glass
              ? 'glass-input'
              : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
          } ${
            error
              ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : ''
          } ${className}`}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
export default Textarea;
