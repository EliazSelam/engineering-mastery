import React from 'react';
import { cn } from '@/src/lib/utils';

type Tone = 'neutral' | 'brand' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'ink';
type Size = 'xs' | 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  dot?: boolean;
  icon?: React.ReactNode;
}

const tones: Record<Tone, string> = {
  neutral:   'bg-[hsl(var(--color-surface-2))] text-[hsl(var(--color-text-muted))] border-[hsl(var(--color-border))]',
  brand:     'bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary-ink))] border-[hsl(var(--color-primary)/0.2)]',
  secondary: 'bg-[hsl(var(--color-secondary-soft))] text-[hsl(var(--color-secondary-ink))] border-[hsl(var(--color-secondary)/0.2)]',
  accent:    'bg-[hsl(var(--color-accent-soft))] text-[hsl(var(--color-accent-ink))] border-[hsl(var(--color-accent)/0.25)]',
  success:   'bg-[hsl(var(--color-success-soft))] text-[hsl(var(--color-success))] border-[hsl(var(--color-success)/0.25)]',
  warning:   'bg-[hsl(var(--color-warning-soft))] text-[hsl(var(--color-warning))] border-[hsl(var(--color-warning)/0.25)]',
  danger:    'bg-[hsl(var(--color-error-soft))] text-[hsl(var(--color-error))] border-[hsl(var(--color-error)/0.25)]',
  ink:       'bg-[hsl(var(--ink-900))] text-[hsl(var(--ink-50))] border-[hsl(var(--ink-900))]',
};

const sizes: Record<Size, string> = {
  xs: 'h-5 px-2 text-[10px] tracking-[0.1em]',
  sm: 'h-6 px-2.5 text-[11px] tracking-[0.08em]',
  md: 'h-7 px-3 text-[12px] tracking-[0.06em]',
};

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  size = 'sm',
  dot = false,
  icon,
  className,
  children,
  ...rest
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 font-semibold uppercase rounded-[var(--radius-pill)] border',
      tones[tone],
      sizes[size],
      className
    )}
    {...rest}
  >
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
    {icon}
    {children}
  </span>
);

export default Badge;
