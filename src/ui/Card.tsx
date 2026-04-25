import React from 'react';
import { cn } from '@/src/lib/utils';

type Elevation = 'flat' | 'e1' | 'e2' | 'e3' | 'e4';
type Tone = 'surface' | 'surface-2' | 'primary-soft' | 'secondary-soft' | 'accent-soft' | 'ink';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  tone?: Tone;
  bordered?: boolean;
  interactive?: boolean;
  padded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  as?: React.ElementType;
}

const tones: Record<Tone, string> = {
  'surface': 'bg-[hsl(var(--color-surface))]',
  'surface-2': 'bg-[hsl(var(--color-surface-2))]',
  'primary-soft': 'bg-[hsl(var(--color-primary-soft))]',
  'secondary-soft': 'bg-[hsl(var(--color-secondary-soft))]',
  'accent-soft': 'bg-[hsl(var(--color-accent-soft))]',
  'ink': 'bg-[hsl(var(--ink-900))] text-[hsl(var(--ink-50))]',
};

const shadows: Record<Elevation, string> = {
  'flat': '',
  'e1': 'shadow-[var(--shadow-e1)]',
  'e2': 'shadow-[var(--shadow-e2)]',
  'e3': 'shadow-[var(--shadow-e3)]',
  'e4': 'shadow-[var(--shadow-e4)]',
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
  xl: 'p-9',
};

const radii = {
  sm: 'rounded-[var(--radius-sm)]',
  md: 'rounded-[var(--radius-md)]',
  lg: 'rounded-[var(--radius-lg)]',
  xl: 'rounded-[var(--radius-xl)]',
  '2xl': 'rounded-[var(--radius-2xl)]',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    elevation = 'e1',
    tone = 'surface',
    bordered = true,
    interactive = false,
    padded = 'md',
    radius = 'xl',
    as: Comp = 'div',
    className,
    children,
    ...rest
  }, ref) => (
    <Comp
      ref={ref as any}
      className={cn(
        'relative transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-standard)]',
        tones[tone],
        shadows[elevation],
        bordered && 'border border-[hsl(var(--color-border))]',
        paddings[padded],
        radii[radius],
        interactive && 'cursor-pointer hover:shadow-[var(--shadow-e3)] hover:-translate-y-0.5 hover:border-[hsl(var(--color-border-strong))]',
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
);
Card.displayName = 'Card';

export default Card;
