import { forwardRef, type ReactNode } from 'react';
import RadioButton from './RadioButton';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  layout?: 'horizontal' | 'vertical' | 'grid';
  card?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  requiredIndicator?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      name,
      options,
      value,
      onChange,
      layout = 'vertical',
      card = false,
      error,
      hint,
      disabled = false,
      className = '',
      requiredIndicator = false,
    },
    ref
  ) => {
    const layoutClasses =
      layout === 'horizontal'
        ? 'flex flex-wrap items-center gap-4'
        : layout === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'
        : 'flex flex-col gap-2.5';

    return (
      <div ref={ref} className={`w-full space-y-2 ${className}`}>
        {label && (
          <div className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
            {label}
            {requiredIndicator && <span className="text-rose-700 dark:text-rose-400 ml-1">*</span>}
          </div>
        )}

        <div role="radiogroup" className={layoutClasses}>
          {options.map((opt) => (
            <RadioButton
              key={opt.value}
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              label={opt.label}
              description={opt.description}
              card={card}
              disabled={disabled || opt.disabled}
            />
          ))}
        </div>

        {error && <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-slate-600 dark:text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
