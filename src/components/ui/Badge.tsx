import React from 'react';
import { cn } from '@/lib/utils';
import { ChapterStatus } from '@/types/book';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'draft' | 'review' | 'complete' | 'sky' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    draft: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
    review: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20',
    complete: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md font-bold',
    md: 'text-xs px-2.5 py-0.5 rounded-lg font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 leading-none tracking-wide select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ChapterStatus }) {
  const config = {
    draft: { label: 'Draft', variant: 'draft' as const, dot: 'bg-amber-500' },
    review: { label: 'In Review', variant: 'review' as const, dot: 'bg-sky-500' },
    complete: { label: 'Finished', variant: 'complete' as const, dot: 'bg-emerald-500' },
  }[status];

  return (
    <Badge variant={config.variant} size="sm">
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </Badge>
  );
}