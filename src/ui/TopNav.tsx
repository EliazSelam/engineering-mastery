import React from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/src/lib/utils';
import { Flame } from 'lucide-react';
import logoIcon from '../../public/logo.png';

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
        'sticky top-0 z-50 h-24 border-b border-slate-200/70 bg-white/95',
        className
      )}
      dir="ltr"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">

        {/* LEFT: stats */}
        <div className="flex items-center gap-3">
          {streak !== undefined && (
            <div className="flex h-11 items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 text-orange-700">
              <span className="text-base font-bold">{streak}</span>
              <Flame className="h-4 w-4" />
            </div>
          )}
          {currentDay !== undefined && (
            <div className="flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-5 text-slate-800">
              <span className="text-base font-bold">{currentDay}/30</span>
              <span className="text-[10px] font-bold tracking-[0.18em] text-slate-500">DAY</span>
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

        {/* RIGHT: brand + logo */}
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-3 focus-visible:outline-none"
          aria-label="דף הבית"
        >
          <span className="hidden md:inline text-2xl font-bold tracking-tight text-slate-900">
            Engineering Mastery
          </span>
          <img
            src={logoIcon}
            alt="Engineering Mastery"
            className="h-16 w-16 object-contain"
          />
        </button>

      </div>

      {/* Progress bar */}
      {progress && progress.total > 0 && (
        <div className="h-[3px] bg-slate-100">
          <div
            className="h-full bg-blue-500 transition-[width] duration-500"
            style={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
          />
        </div>
      )}
    </header>
  );
};

export default TopNav;
