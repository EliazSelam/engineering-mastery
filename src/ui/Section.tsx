import React from 'react';
import { cn } from '@/src/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  max?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  gutters?: boolean;
  pad?: 'tight' | 'base' | 'loose' | 'hero';
}

const maxes = {
  sm:  'max-w-2xl',   // 672
  md:  'max-w-3xl',   // 768
  lg:  'max-w-4xl',   // 896
  xl:  'max-w-5xl',   // 1024
  '2xl': 'max-w-6xl', // 1152
  full: 'max-w-none',
};

const pads = {
  tight: 'py-6',
  base:  'py-10 md:py-12',
  loose: 'py-16 md:py-20',
  hero:  'py-20 md:py-28',
};

export const Section: React.FC<SectionProps> = ({
  as: Comp = 'section',
  max = '2xl',
  gutters = true,
  pad = 'base',
  className,
  children,
  ...rest
}) => (
  <Comp
    className={cn(
      'mx-auto w-full',
      maxes[max],
      gutters && 'px-5 md:px-8',
      pads[pad],
      className
    )}
    {...rest}
  >
    {children}
  </Comp>
);

interface DividerProps {
  label?: string;
  heavy?: boolean;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, heavy, className }) => {
  if (!label) {
    return (
      <hr
        className={cn(
          'border-0',
          heavy ? 'h-[2px] bg-[hsl(var(--ink-900))]' : 'h-px bg-[hsl(var(--color-border))]',
          className
        )}
      />
    );
  }
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
      <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[hsl(var(--color-text-faint))]">
        {label}
      </span>
      <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
    </div>
  );
};

export default Section;
