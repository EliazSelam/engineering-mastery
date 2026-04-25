import React from 'react';
import { cn } from '@/src/lib/utils';

/**
 * Editorial Typography primitives — Design System V2
 * All elements preserve RTL flow and use the new fluid type scale.
 */

type AsProp<T extends React.ElementType> = { as?: T };
type Props<T extends React.ElementType> = AsProp<T> &
  React.ComponentPropsWithoutRef<T> & { className?: string };

export function Display<T extends React.ElementType = 'h1'>({
  as, className, ...rest
}: Props<T>) {
  const Comp = (as || 'h1') as any;
  return (
    <Comp
      className={cn(
        'font-display text-[length:var(--text-display)] leading-[1.05] tracking-[-0.03em] text-[hsl(var(--ink-900))]',
        className
      )}
      {...rest}
    />
  );
}

export function H1<T extends React.ElementType = 'h1'>({
  as, className, ...rest
}: Props<T>) {
  const Comp = (as || 'h1') as any;
  return (
    <Comp
      className={cn(
        'text-[length:var(--text-h1)] font-bold leading-[1.1] tracking-[-0.025em] text-[hsl(var(--ink-900))]',
        className
      )}
      {...rest}
    />
  );
}

export function H2<T extends React.ElementType = 'h2'>({
  as, className, ...rest
}: Props<T>) {
  const Comp = (as || 'h2') as any;
  return (
    <Comp
      className={cn(
        'text-[length:var(--text-h2)] font-bold leading-[1.2] tracking-[-0.02em] text-[hsl(var(--ink-900))]',
        className
      )}
      {...rest}
    />
  );
}

export function H3<T extends React.ElementType = 'h3'>({
  as, className, ...rest
}: Props<T>) {
  const Comp = (as || 'h3') as any;
  return (
    <Comp
      className={cn(
        'text-[length:var(--text-h3)] font-bold leading-[1.3] tracking-[-0.015em] text-[hsl(var(--ink-900))]',
        className
      )}
      {...rest}
    />
  );
}

export function H4<T extends React.ElementType = 'h4'>({
  as, className, ...rest
}: Props<T>) {
  const Comp = (as || 'h4') as any;
  return (
    <Comp
      className={cn(
        'text-[length:var(--text-h4)] font-bold leading-[1.4] tracking-[-0.01em] text-[hsl(var(--ink-900))]',
        className
      )}
      {...rest}
    />
  );
}

export function Lead({ className, ...rest }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn(
        'text-[length:var(--text-lead)] leading-[1.65] text-[hsl(var(--color-text-muted))] font-normal',
        className
      )}
      {...rest}
    />
  );
}

export function Body({ className, ...rest }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn(
        'text-[length:var(--text-base)] leading-[1.65] text-[hsl(var(--color-text))]',
        className
      )}
      {...rest}
    />
  );
}

export function Meta({ className, ...rest }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn(
        'text-[length:var(--text-meta)] leading-[1.4] text-[hsl(var(--color-text-faint))]',
        className
      )}
      {...rest}
    />
  );
}

export function Eyebrow({ className, ...rest }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn(
        'inline-block text-[length:var(--text-eyebrow)] font-bold tracking-[0.14em] uppercase text-[hsl(var(--color-text-faint))]',
        className
      )}
      {...rest}
    />
  );
}

export function Mono({ className, ...rest }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn('font-mono text-[0.92em]', className)}
      {...rest}
    />
  );
}
