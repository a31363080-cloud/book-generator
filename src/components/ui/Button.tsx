import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
      sm: 'text-xs font-semibold px-3 py-1.5 rounded-xl gap-1.5',
      md: 'text-sm font-semibold px-4 py-2 rounded-xl gap-2',
      lg: 'text-base font-semibold px-5 py-2.5 rounded-2xl gap-2.5',
    };

    const variantClasses = {
      primary:
        'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-sm active:scale-[0.98]',
      secondary:
        'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 border border-zinc-200/60 dark:border-zinc-700/60 active:scale-[0.98]',
      outline:
        'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 active:scale-[0.98]',
      ghost:
        'hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 active:scale-[0.98]',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';