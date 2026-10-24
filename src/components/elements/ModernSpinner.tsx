import React, { type HTMLAttributes } from 'react';

export type SpinnerVariant = 'gradient' | 'ring' | 'dots' | 'dual-ring' | 'pulse' | 'bars';
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'white' | 'slate' | 'emerald' | 'amber' | 'rose' | 'current';

export interface ModernSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  labelPosition?: 'right' | 'bottom' | 'top' | 'left';
  labelClassName?: string;
  overlay?: boolean;
  fullPage?: boolean;
  blur?: boolean;
}

const sizeConfig: Record<
  SpinnerSize,
  {
    container: string;
    icon: string;
    stroke: number;
    dot: string;
    bar: string;
    fontSize: string;
  }
> = {
  xs: {
    container: 'w-3.5 h-3.5',
    icon: 'w-3.5 h-3.5',
    stroke: 3,
    dot: 'w-1 h-1',
    bar: 'w-0.5 h-2.5',
    fontSize: 'text-[10px]',
  },
  sm: {
    container: 'w-4 h-4',
    icon: 'w-4 h-4',
    stroke: 2.8,
    dot: 'w-1.5 h-1.5',
    bar: 'w-0.5 h-3',
    fontSize: 'text-xs',
  },
  md: {
    container: 'w-6 h-6',
    icon: 'w-6 h-6',
    stroke: 2.5,
    dot: 'w-2 h-2',
    bar: 'w-1 h-4',
    fontSize: 'text-xs',
  },
  lg: {
    container: 'w-8 h-8',
    icon: 'w-8 h-8',
    stroke: 2.2,
    dot: 'w-2.5 h-2.5',
    bar: 'w-1 h-6',
    fontSize: 'text-sm',
  },
  xl: {
    container: 'w-12 h-12',
    icon: 'w-12 h-12',
    stroke: 2,
    dot: 'w-3.5 h-3.5',
    bar: 'w-1.5 h-8',
    fontSize: 'text-base font-medium',
  },
};

const colorClasses: Record<SpinnerColor, string> = {
  primary: 'text-blue-600 dark:text-blue-400',
  white: 'text-white',
  slate: 'text-slate-600 dark:text-slate-300',
  emerald: 'text-emerald-500 dark:text-emerald-400',
  amber: 'text-amber-500 dark:text-amber-400',
  rose: 'text-rose-500 dark:text-rose-400',
  current: 'text-current',
};

export const ModernSpinner: React.FC<ModernSpinnerProps> = ({
  variant = 'gradient',
  size = 'md',
  color = 'primary',
  label,
  labelPosition = size === 'xs' || size === 'sm' ? 'right' : 'bottom',
  labelClassName = '',
  overlay = false,
  fullPage = false,
  blur = true,
  className = '',
  ...props
}) => {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  const colorClass = colorClasses[color] || colorClasses.primary;

  const renderVisual = () => {
    switch (variant) {
      case 'ring':
        return (
          <svg
            className={`animate-spin ${currentSize.icon} ${colorClass} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="9.5"
              stroke="currentColor"
              strokeWidth={currentSize.stroke}
            />
            <path
              className="opacity-95"
              d="M12 2.5C6.75329 2.5 2.5 6.75329 2.5 12"
              stroke="currentColor"
              strokeWidth={currentSize.stroke}
              strokeLinecap="round"
            />
          </svg>
        );

      case 'dots':
        return (
          <div
            className={`flex items-center gap-1 ${colorClass} shrink-0`}
            aria-hidden="true"
          >
            <span
              className={`${currentSize.dot} rounded-full bg-current animate-bounce [animation-delay:-0.3s]`}
            />
            <span
              className={`${currentSize.dot} rounded-full bg-current animate-bounce [animation-delay:-0.15s]`}
            />
            <span
              className={`${currentSize.dot} rounded-full bg-current animate-bounce`}
            />
          </div>
        );

      case 'dual-ring':
        return (
          <div
            className={`relative flex items-center justify-center ${currentSize.container} ${colorClass} shrink-0`}
            aria-hidden="true"
          >
            <svg
              className={`absolute inset-0 animate-spin ${currentSize.icon}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9.5"
                stroke="currentColor"
                strokeWidth={currentSize.stroke}
                strokeDasharray="40 25"
                strokeLinecap="round"
                className="opacity-90"
              />
            </svg>
            <svg
              className={`absolute inset-1 animate-spin [animation-direction:reverse] [animation-duration:1.5s] w-auto h-auto`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="6.5"
                stroke="currentColor"
                strokeWidth={currentSize.stroke}
                strokeDasharray="25 15"
                strokeLinecap="round"
                className="opacity-50"
              />
            </svg>
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`relative flex items-center justify-center ${currentSize.container} ${colorClass} shrink-0`}
            aria-hidden="true"
          >
            <span className="absolute inset-0 rounded-full bg-current opacity-25 animate-ping" />
            <span className="relative rounded-full bg-current w-2/3 h-2/3 shadow-xs" />
          </div>
        );

      case 'bars':
        return (
          <div
            className={`flex items-center gap-1 ${colorClass} shrink-0 h-full`}
            aria-hidden="true"
          >
            <span
              className={`${currentSize.bar} rounded-full bg-current animate-pulse [animation-duration:0.8s] [animation-delay:-0.4s]`}
            />
            <span
              className={`${currentSize.bar} rounded-full bg-current animate-pulse [animation-duration:0.8s] [animation-delay:-0.2s]`}
            />
            <span
              className={`${currentSize.bar} rounded-full bg-current animate-pulse [animation-duration:0.8s]`}
            />
          </div>
        );

      case 'gradient':
      default:
        return (
          <svg
            className={`animate-spin ${currentSize.icon} ${colorClass} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="9.5"
              stroke="currentColor"
              strokeWidth={currentSize.stroke}
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  const getFlexDirection = () => {
    switch (labelPosition) {
      case 'bottom':
        return 'flex-col items-center justify-center gap-2 text-center';
      case 'top':
        return 'flex-col-reverse items-center justify-center gap-2 text-center';
      case 'left':
        return 'flex-row-reverse items-center justify-center gap-2';
      case 'right':
      default:
        return 'flex-row items-center justify-center gap-2';
    }
  };

  const content = (
    <div
      role="status"
      aria-label={label || 'Loading...'}
      className={`inline-flex ${getFlexDirection()} ${className}`}
      {...props}
    >
      {renderVisual()}
      {label && (
        <span
          className={`font-medium text-slate-700 dark:text-slate-300 ${currentSize.fontSize} ${labelClassName}`}
        >
          {label}
        </span>
      )}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 ${
          blur ? 'backdrop-blur-sm' : ''
        } transition-all`}
      >
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-white/10 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        className={`absolute inset-0 z-40 flex items-center justify-center rounded-[inherit] bg-white/80 dark:bg-slate-900/80 ${
          blur ? 'backdrop-blur-xs' : ''
        } transition-all`}
      >
        {content}
      </div>
    );
  }

  return content;
};

export const Spinner = ModernSpinner;

export interface SpinnerOverlayProps {
  label?: string;
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  color?: SpinnerColor;
  blur?: boolean;
}

export const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({
  label = 'Loading...',
  variant = 'gradient',
  size = 'md',
  color = 'primary',
  blur = true,
}) => {
  return (
    <ModernSpinner
      overlay
      variant={variant}
      size={size}
      color={color}
      label={label}
      blur={blur}
    />
  );
};

export default ModernSpinner;
