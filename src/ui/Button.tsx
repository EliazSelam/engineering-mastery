import React from 'react';
import { cn } from '@/src/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'tonal' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold tracking-tight rounded-[var(--radius-lg)] ' +
  'transition-[background,box-shadow,transform,color,border-color] duration-[var(--dur-base)] ' +
  'ease-[var(--ease-standard)] select-none focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary)/0.4)] focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-[hsl(var(--color-bg))] disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-[hsl(var(--color-primary))] text-white shadow-[var(--shadow-e1)] ' +
    'hover:bg-[hsl(var(--color-primary-hover))] hover:shadow-[var(--shadow-e3)] ' +
    'active:translate-y-[1px]',
  secondary:
    'bg-[hsl(var(--color-surface))] text-[hsl(var(--ink-900))] border border-[hsl(var(--color-border))] ' +
    'shadow-[var(--shadow-e1)] hover:border-[hsl(var(--color-border-strong))] hover:shadow-[var(--shadow-e2)]',
  ghost:
    'bg-transparent text-[hsl(var(--color-text))] ' +
    'hover:bg-[hsl(var(--color-surface-2))]',
  tonal:
    'bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary-ink))] ' +
    'hover:bg-[hsl(var(--color-primary)/0.15)]',
  danger:
    'bg-[hsl(var(--color-error))] text-white shadow-[var(--shadow-e1)] ' +
    'hover:brightness-95 active:translate-y-[1px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth, className, children, ...rest },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(base, sizes[size], variants[variant], fullWidth && 'w-full', className)}
      {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  )
);
Button.displayName = 'Button';

export default Button;
