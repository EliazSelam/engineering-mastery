import React from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/src/lib/utils';
import { Home as HomeIcon, Flame, ChevronLeft } from 'lucide-react';
import logoIcon from '../../public/logo-icon.png';

interface TopNavProps {
  streak?: number;
  currentDay?: number;
  /** If set, show back arrow + breadcrumb label */
  breadcrumb?: string;
  /** Optional right-side slot (e.g., timer) */
  trailing?: React.ReactNode;
  /** Show the thin progress bar under the nav */
  progress?: { current: number; total: number };
  className?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  streak,
  currentDay,
  breadcrumb,
  trailing,
  progress,
  className,
}) => {
  const [location, setLocation] = useLocation();
  const isHome = location === '/';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 glass border-b border-[hsl(var(--color-border))] overflow-visible',
        className
      )}
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-20 flex items-center gap-4">
        {/* Logo / Home */}
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2.5 group focus-visible:outline-none rounded-[var(--radius-sm)]"
          aria-label="דף הבית"
        >
          <span className="flex items-center justify-center h-14 w-14 flex-shrink-0 overflow-visible">
            <img
              src={logoIcon}
              alt="Eliaz Selam"
              className="h-14 w-14 object-contain"
            />
          </span>
          <span className="hidden md:inline font-semibold tracking-tight text-[hsl(var(--ink-900))]">
            Engineering Mastery
          </span>
        </button>

        {/* Breadcrumb */}
        {breadcrumb && !isHome && (
          <>
            <span className="text-[hsl(var(--color-text-faint))] text-xs mx-1">›</span>
            <button
              onClick={() => setLocation('/')}
              className="text-[13px] text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-primary-ink))] transition-colors flex items-center gap-1"
            >
              <HomeIcon size={13} />
              Home
            </button>
            <span className="text-[hsl(var(--color-text-faint))] text-xs mx-1">›</span>
            <span className="text-[13px] font-semibold text-[hsl(var(--ink-900))] truncate max-w-[40vw]">
              {breadcrumb}
            </span>
          </>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Trailing slot (timer etc.) */}
        {trailing}

        {/* Day chip */}
        {currentDay !== undefined && (
          <div className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-pill)] bg-[hsl(var(--color-surface-2))] border border-[hsl(var(--color-border))]">
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[hsl(var(--color-text-faint))]">Day</span>
            <span className="text-[13px] font-bold text-[hsl(var(--ink-900))]">{currentDay}/30</span>
          </div>
        )}

        {/* Streak — energy orange (flame = energy accent) */}
        {streak !== undefined && (
          <div className="flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-pill)] bg-[hsl(var(--color-energy-soft))] border border-[hsl(var(--color-energy)/0.25)]">
            <Flame size={14} className="text-[hsl(var(--color-energy))]" />
            <span className="text-[13px] font-bold text-[hsl(var(--color-energy-ink))]">{streak}</span>
          </div>
        )}
      </div>

      {/* Thin progress bar */}
      {progress && progress.total > 0 && (
        <div className="h-[3px] bg-[hsl(var(--color-surface-2))] relative overflow-hidden">
          <div
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-hover))] transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-standard)]"
            style={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
          />
        </div>
      )}
    </header>
  );
};

export default TopNav;
