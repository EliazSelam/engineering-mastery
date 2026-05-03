import React from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/src/lib/utils';
import { Flame, ChevronLeft, BookOpen, Calendar, History, BarChart2 } from 'lucide-react';
import logoIcon from '../../public/logo-icon.png';

interface TopNavProps {
  streak?: number;
  currentDay?: number;
  breadcrumb?: string;
  trailing?: React.ReactNode;
  progress?: { current: number; total: number };
  className?: string;
}

/* Desktop nav links — mirrors BottomNav items */
const DESKTOP_NAV = [
  { label: 'שיעור',     path: '/lesson'    },
  { label: 'תוכנית',   path: '/plan'      },
  { label: 'היסטוריה', path: '/history'   },
  { label: 'נתונים',   path: '/analytics' },
];

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
        'sticky top-0 z-50 border-b border-slate-200/70 bg-white',
        'h-14 sm:h-16',
        className
      )}
      dir="ltr"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center px-4 md:px-8 gap-3">

        {/* ── LOGO (left on desktop, right on mobile via order) ── */}
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 focus-visible:outline-none shrink-0 order-last md:order-first"
          aria-label="דף הבית"
        >
          <img
            src={logoIcon}
            alt="Engineering Mastery"
            className="shrink-0 select-none"
            style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }}
            draggable={false}
          />
          <span className="hidden md:inline text-base font-bold tracking-tight text-slate-900">
            Engineering Mastery
          </span>
        </button>

        {/* ── DESKTOP: nav links (center) — hidden on mobile ── */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" dir="rtl">
          {DESKTOP_NAV.map(({ label, path }) => {
            const active = location === path || (path === '/lesson' && location.startsWith('/day/'));
            return (
              <button
                key={path}
                onClick={() => setLocation(path)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  active
                    ? 'bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* ── DESKTOP: stats + MOBILE: back/stats (right side) ── */}
        <div className="flex items-center gap-2 shrink-0 order-first md:order-last">

          {/* Mobile: back button (when not home) */}
          {!isHome && (
            <button
              onClick={() => setLocation('/')}
              className="md:hidden flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="חזור לדף הבית"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold truncate max-w-[40vw]">
                {breadcrumb ?? 'בית'}
              </span>
            </button>
          )}

          {/* Stats — always visible on desktop, only on home on mobile */}
          <div className={cn(
            'flex items-center gap-1.5',
            !isHome && 'hidden md:flex'
          )}>
            {streak !== undefined && (
              <div className="flex h-8 items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 text-orange-700">
                <span className="text-xs font-bold">{streak}</span>
                <Flame className="h-3 w-3" />
              </div>
            )}
            {currentDay !== undefined && (
              <div className="flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-3 text-slate-800">
                <span className="text-xs font-bold">{currentDay}/30</span>
                <span className="text-[8px] font-bold tracking-[0.18em] text-slate-500 hidden sm:inline">DAY</span>
              </div>
            )}
            {trailing}
          </div>
        </div>

      </div>

      {/* Progress bar */}
      {progress && progress.total > 0 && (
        <div className="h-[3px] bg-slate-100">
          <div
            className="h-full bg-[hsl(var(--color-primary))] transition-[width] duration-500"
            style={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
          />
        </div>
      )}
    </header>
  );
};

export default TopNav;
