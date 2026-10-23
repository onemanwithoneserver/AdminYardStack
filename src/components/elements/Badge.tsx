import { type ReactNode } from 'react';
import { X } from 'lucide-react';

export type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'neutral'
  | 'glass';

export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantClasses: Record<BadgeVariant, { badge: string; dot: string }> = {
  primary: {
    badge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60',
    dot: 'bg-blue-500',
  },
  success: {
    badge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
  },
  warning: {
    badge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
    dot: 'bg-amber-500',
  },
  danger: {
    badge: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
    dot: 'bg-rose-500',
  },
  purple: {
    badge: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60',
    dot: 'bg-purple-500',
  },
  neutral: {
    badge: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-white/10',
    dot: 'bg-slate-400',
  },
  glass: {
    badge: 'glass-pill text-slate-800 dark:text-slate-200 border-white/60 dark:border-white/10 shadow-xs',
    dot: 'bg-blue-500',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] gap-1 rounded font-semibold',
  sm: 'px-2 py-0.5 text-xs gap-1.5 rounded-md font-semibold',
  md: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-semibold',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  dot = false,
  onRemove,
  className = '',
}: BadgeProps) {
  const { badge: variantClass, dot: dotClass } = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center border tracking-tight leading-none ${variantClass} ${sizeClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 hover:opacity-75 rounded-full transition-opacity cursor-pointer shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

export default Badge;
