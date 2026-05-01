import React from 'react';
import { useLocation } from 'wouter';
import { Home, Calendar, BarChart2, History, BookOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'בית',       icon: Home,      path: '/'          },
  { label: 'שיעור',     icon: BookOpen,  path: '/lesson'    },
  { label: 'תוכנית',   icon: Calendar,  path: '/plan'      },
  { label: 'היסטוריה', icon: History,   path: '/history'   },
  { label: 'נתונים',   icon: BarChart2, path: '/analytics' },
];

export const BottomNav: React.FC = () => {
  const [location, setLocation] = useLocation();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-slate-200/80"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      dir="rtl"
    >
      <div className="flex items-stretch h-[60px]">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = location === path || (path === '/lesson' && location.startsWith('/day/'));
          return (
            <button
              key={path}
              onClick={() => setLocation(path)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-[3px] transition-colors',
                active
                  ? 'text-[hsl(var(--coral))]'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon
                size={active ? 22 : 20}
                strokeWidth={active ? 2.2 : 1.8}
                className="transition-all"
              />
              <span
                className={cn(
                  'text-[9px] font-semibold tracking-wide transition-all',
                  active ? 'opacity-100' : 'opacity-70'
                )}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-6 h-[2px] rounded-full bg-[hsl(var(--coral))]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
