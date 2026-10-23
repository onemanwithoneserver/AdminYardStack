import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
  card?: boolean;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      id,
      checked = false,
      label,
      description,
      card = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const radioId = id || generatedId;

    return (
      <label
        htmlFor={radioId}
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
            id={radioId}
            type="radio"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />

          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
              checked
                ? 'bg-[#1956db] border-[#1956db] shadow-xs'
                : 'bg-white/80 dark:bg-slate-900/80 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30 peer-focus-visible:ring-offset-1`}
          >
            {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-medium text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
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

RadioButton.displayName = 'RadioButton';
export default RadioButton;
