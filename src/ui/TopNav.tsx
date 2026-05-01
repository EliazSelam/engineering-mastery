import React from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/src/lib/utils';
import { Flame } from 'lucide-react';
import logoIcon from '../../public/logo-icon.png';

interface TopNavProps {
  streak?: number;
  currentDay?: number;
  breadcrumb?: string;
  trailing?: React.ReactNode;
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
  const [, setLocation] = useLocation();

  return (
    <header
      className={cn(
        'relative sticky top-0 z-50 border-b border-slate-200/70 bg-white',
        'h-16 sm:h-20',
        className
      )}
      dir="ltr"
    >
      <div
        className="mx-auto flex h-full max-w-7xl items-center gap-2"
        style={{ paddingLeft: '16px', paddingRight: '80px' }}
      >

        {/* LEFT: stats */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {streak !== undefined && (
            <div className="flex h-7 sm:h-9 items-center gap-1 sm:gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 sm:px-3.5 text-orange-700">
              <span className="text-xs sm:text-sm font-bold">{streak}</span>
              <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </div>
          )}
          {currentDay !== undefined && (
            <div className="flex h-7 sm:h-9 items-center gap-1 sm:gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 sm:px-3.5 text-slate-800">
              <span className="text-xs sm:text-sm font-bold">{currentDay}/30</span>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.18em] text-slate-500">DAY</span>
            </div>
          )}
          {trailing}
        </div>

        {/* CENTER: breadcrumb */}
        {breadcrumb && (
          <span className="hidden md:block text-sm font-semibold text-slate-600 truncate max-w-[30vw]">
            {breadcrumb}
          </span>
        )}

      </div>

      {/* LOGO — fixed to viewport, zero chance of clipping */}
      <button
        onClick={() => setLocation('/')}
        className="fixed top-3 sm:top-4 flex items-center gap-2 sm:gap-3 focus-visible:outline-none z-[60]"
        style={{ right: '16px' }}
        aria-label="דף הבית"
      >
        <span className="hidden sm:inline text-sm sm:text-lg font-bold tracking-tight text-slate-900">
          Engineering Mastery
        </span>
        <img
          src={logoIcon}
          alt="Engineering Mastery"
          className="shrink-0 select-none"
          style={{
            width: '30px',
            height: '30px',
            objectFit: 'contain',
            display: 'block',
            paddingRight: '8px',
            boxSizing: 'content-box',
          }}
          draggable={false}
        />
      </button>

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
