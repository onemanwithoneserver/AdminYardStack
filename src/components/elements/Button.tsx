import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ModernSpinner, type SpinnerSize } from './ModernSpinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 border border-white/20 focus-visible:ring-blue-500/30',
  secondary:
    'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-slate-300 dark:hover:border-white/20',
  outline:
    'border border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-slate-700 dark:text-slate-200 bg-transparent hover:bg-blue-50/40 dark:hover:bg-blue-950/20',
  ghost:
    'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10 bg-transparent',
  glass:
    'glass-surface border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-2xs hover:shadow-xs',
  danger:
    'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-md shadow-rose-500/25 border border-white/20 focus-visible:ring-rose-500/30',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1 rounded-lg font-semibold',
  sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-xl font-semibold',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl font-semibold',
  lg: 'px-6 py-2.5 text-base gap-2.5 rounded-2xl font-bold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${
          variantClasses[variant]
        } ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <ModernSpinner
            size={size === 'xs' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
            color="current"
            className="shrink-0"
          />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
