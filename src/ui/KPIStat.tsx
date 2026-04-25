import React from 'react';
import { cn } from '@/src/lib/utils';
import { Eyebrow, Meta } from './Typography';

interface KPIStatProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: string;
  tone?: 'neutral' | 'brand' | 'secondary' | 'accent' | 'success' | 'warning';
  icon?: React.ReactNode;
  trend?: { delta: number; label?: string };
  className?: string;
}

const toneBar: Record<NonNullable<KPIStatProps['tone']>, string> = {
  neutral:   'bg-[hsl(var(--ink-400))]',
  brand:     'bg-[hsl(var(--color-primary))]',
  secondary: 'bg-[hsl(var(--color-secondary))]',
  accent:    'bg-[hsl(var(--color-accent))]',
  success:   'bg-[hsl(var(--color-success))]',
  warning:   'bg-[hsl(var(--color-warning))]',
};

export const KPIStat: React.FC<KPIStatProps> = ({
  label, value, unit, hint, tone = 'neutral', icon, trend, className,
}) => (
  <div
    className={cn(
      'relative bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))]',
      'rounded-[var(--radius-lg)] p-5 overflow-hidden shadow-[var(--shadow-e1)]',
      'transition-shadow duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:shadow-[var(--shadow-e2)]',
      className
    )}
  >
    {/* Right edge color strip */}
    <span className={cn('absolute top-0 right-0 bottom-0 w-[3px]', toneBar[tone])} />

    <div className="flex items-start justify-between mb-3">
      <Eyebrow>{label}</Eyebrow>
      {icon && <span className="text-[hsl(var(--color-text-faint))]">{icon}</span>}
    </div>

    <div className="flex items-baseline gap-1.5">
      <span className="text-[2rem] md:text-[2.5rem] font-bold tracking-[-0.025em] leading-[1] text-[hsl(var(--ink-900))] tabular-nums">
        {value}
      </span>
      {unit && (
        <span className="text-[hsl(var(--color-text-muted))] font-semibold text-sm">{unit}</span>
      )}
    </div>

    {(hint || trend) && (
      <div className="mt-2.5 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-bold tabular-nums',
              trend.delta > 0 ? 'text-[hsl(var(--color-success))]' :
              trend.delta < 0 ? 'text-[hsl(var(--color-error))]' :
              'text-[hsl(var(--color-text-faint))]'
            )}
          >
            {trend.delta > 0 ? '↑' : trend.delta < 0 ? '↓' : '·'} {Math.abs(trend.delta)}%
            {trend.label && <span className="font-normal text-[hsl(var(--color-text-faint))]">· {trend.label}</span>}
          </span>
        )}
        {hint && <Meta>{hint}</Meta>}
      </div>
    )}
  </div>
);

export default KPIStat;
