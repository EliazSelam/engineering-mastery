import React from 'react';
import { cn } from '@/src/lib/utils';
import { CheckCircle2, Circle, Clock, ArrowUpLeft } from 'lucide-react';

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Eyebrow, H3, Body, Meta } from '../ui/Typography';

const PLAN = [
  { day: 1, title: 'לולאת בקרה סגורה', category: 'בקרה', emoji: '🎛️' },
  { day: 2, title: 'בקר PID — השלישייה הקדושה', category: 'בקרה', emoji: '📉' },
  { day: 3, title: 'יציבות וקטבים (Root Locus)', category: 'בקרה', emoji: '🔁' },
  { day: 4, title: 'דיאגרמות בודה (Bode Plots)', category: 'בקרה', emoji: '📐' },
  { day: 5, title: 'קריטריון נייקוויסט (Nyquist)', category: 'בקרה', emoji: '🧮' },
  { day: 6, title: 'מרחב המצב (State Space)', category: 'בקרה', emoji: '🏗️' },
  { day: 7, title: 'סיכום שבועי ופרויקט בקרה', category: 'בקרה', emoji: '🧪' },
  { day: 8, title: 'כוונון זיגלר-ניקולס', category: 'בקרה', emoji: '⚡' },
  { day: 9, title: 'מנועי BLDC וקומוטציה', category: 'מנועים', emoji: '🔊' },
  { day: 10, title: 'בקרת וקטור (FOC)', category: 'מנועים', emoji: '🌊' },
  { day: 11, title: 'קינמטיקה רובוטית', category: 'רובוטיקה', emoji: '🔬' },
  { day: 12, title: 'רובוטיקה: דינמיקה', category: 'רובוטיקה', emoji: '🎵' },
  { day: 13, title: 'רובוטיקה: תכנון מסלול', category: 'רובוטיקה', emoji: '🗜️' },
  { day: 14, title: 'סיכום ופרויקט רובוטיקה', category: 'רובוטיקה', emoji: '📡' },
  { day: 15, title: 'דגימה ועליאסינג (Aliasing)', category: 'DSP', emoji: '📻' },
  { day: 16, title: 'התמרת Z ומישור היחידה', category: 'DSP', emoji: '🔍' },
  { day: 17, title: 'DFT ו-FFT', category: 'DSP', emoji: '🎚️' },
  { day: 18, title: 'פילטרים מסוג FIR', category: 'DSP', emoji: '🧠' },
  { day: 19, title: 'פילטרים מסוג IIR', category: 'DSP', emoji: '🤖' },
  { day: 20, title: 'ספקטרוגרמה ו-STFT', category: 'DSP', emoji: '📊' },
  { day: 21, title: 'סיכום שבועי ופרויקט DSP', category: 'DSP', emoji: '🔭' },
  { day: 22, title: 'מסנן קלמן (Kalman Filter)', category: 'אלגוריתמים', emoji: '🛰️' },
  { day: 23, title: 'LQR — בקרה אופטימלית', category: 'בקרה', emoji: '🌐' },
  { day: 24, title: 'בקרת מודל חזוי (MPC)', category: 'אופטימיזציה', emoji: '⚙️' },
  { day: 25, title: 'בקרה אדפטיבית (MRAC)', category: 'אלגוריתמים', emoji: '🔧' },
  { day: 26, title: 'רשתות נוירונים לבקרה', category: 'אלגוריתמים', emoji: '🧠' },
  { day: 27, title: 'מערכות זמן אמת (RTOS)', category: 'תשתית', emoji: '🕹️' },
  { day: 28, title: 'מחשוב קוונטי למהנדסים', category: 'קוונטי', emoji: '💡' },
  { day: 29, title: 'רחפן אוטונומי — פרויקט', category: 'פרויקט', emoji: '🚀' },
  { day: 30, title: 'סיכום, פורטפוליו והדרך לסניור', category: 'פרויקט', emoji: '🎓' },
];

/* Thematic focus per week — used for the spine metadata */
const WEEK_META = [
  { label: 'Week 01', title: 'Control Foundations', desc: 'יסודות בקרה — PID, Root Locus, Bode, State Space' },
  { label: 'Week 02', title: 'Motors & Robotics', desc: 'BLDC, FOC, קינמטיקה ודינמיקה רובוטית' },
  { label: 'Week 03', title: 'Signal Processing', desc: 'דגימה, Z-transform, FFT, פילטרים דיגיטליים' },
  { label: 'Week 04', title: 'Advanced Systems', desc: 'Kalman, LQR, MPC, רשתות נוירונים, RTOS' },
];

interface MonthlyPlanProps {
  currentDay: number;
  onNavigateDay?: (day: number) => void;
}

/* Week progress ring — compact SVG indicator for the spine */
function WeekRing({ progress }: { progress: number }) {
  const r = 22;
  const C = 2 * Math.PI * r;
  const offset = C - (progress / 100) * C;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none"
                stroke="hsl(var(--color-border))" strokeWidth="3" />
        <circle cx="28" cy="28" r={r} fill="none"
                stroke="hsl(var(--ink-900))" strokeWidth="3"
                strokeDasharray={C} strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-[var(--dur-xslow)]" />
      </svg>
      <span className="absolute text-[11px] font-bold tabular-nums text-[hsl(var(--ink-900))]">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

export default function MonthlyPlan({ currentDay, onNavigateDay }: MonthlyPlanProps) {
  /* Split the 30-day plan into 4 weeks of 7 days (the last week has 9 days) */
  const weeks = [
    PLAN.slice(0, 7),
    PLAN.slice(7, 14),
    PLAN.slice(14, 21),
    PLAN.slice(21, 30),
  ];

  const totalDone = Math.max(0, currentDay - 1);

  return (
    <div className="flex flex-col gap-12">
      {/* Monthly overview strip */}
      <div className="grid grid-cols-12 gap-6 items-end pb-8 border-b border-[hsl(var(--color-border))]">
        <div className="col-span-12 md:col-span-8">
          <Eyebrow className="mb-3">April 2026 · 30-Day Program</Eyebrow>
          <h2 className="font-display text-[2.5rem] leading-[1.05] tracking-tight text-[hsl(var(--ink-900))]">
            ארבעה שבועות. <span className="italic text-[hsl(var(--color-primary))]">מסלול אחד.</span>
          </h2>
          <Body className="text-[hsl(var(--color-text-muted))] mt-3 max-w-xl">
            כל שבוע נבנה סביב תחום ליבה. התוכנית מתעדכנת דינמית לפי קצב ההתקדמות שלך.
          </Body>
        </div>
        <div className="col-span-12 md:col-span-4 flex items-baseline justify-end gap-2">
          <span className="font-display text-[4rem] leading-none font-semibold tabular-nums text-[hsl(var(--ink-900))]">
            {totalDone}
          </span>
          <span className="text-[hsl(var(--color-text-faint))] text-sm">/ 30 ימים הושלמו</span>
        </div>
      </div>

      {/* Week-by-week editorial layout */}
      <div className="flex flex-col gap-16">
        {weeks.map((weekDays, wIdx) => {
          const completedInWeek = weekDays.filter(d => d.day < currentDay).length;
          const weekProgress = (completedInWeek / weekDays.length) * 100;
          const meta = WEEK_META[wIdx];

          return (
            <section key={wIdx} className="grid grid-cols-12 gap-6 md:gap-10">
              {/* Week spine — left side metadata */}
              <aside className="col-span-12 md:col-span-3 lg:col-span-3 flex flex-col gap-5 md:sticky md:top-28 md:self-start">
                <div className="flex items-center gap-4">
                  <WeekRing progress={weekProgress} />
                  <div>
                    <Eyebrow className="mb-0.5">{meta.label}</Eyebrow>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-[hsl(var(--ink-900))]">
                      {meta.title}
                    </h3>
                  </div>
                </div>
                <Meta>{meta.desc}</Meta>
                <div className="h-px bg-[hsl(var(--color-border))]" />
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[hsl(var(--color-text-faint))]">הושלמו</span>
                  <span className="font-bold tabular-nums text-[hsl(var(--ink-900))]">
                    {completedInWeek} / {weekDays.length}
                  </span>
                </div>
              </aside>

              {/* Day cards — calendar-ish grid */}
              <div className="col-span-12 md:col-span-9 lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {weekDays.map((item) => {
                  const isCompleted = item.day < currentDay;
                  const isCurrent = item.day === currentDay;
                  // All days are accessible — no locking
                  const isFuture = item.day > currentDay;

                  const tone: 'ink' | 'surface' | 'primary-soft' =
                    isCurrent ? 'primary-soft' : isCompleted ? 'ink' : 'surface';

                  return (
                    <Card
                      key={item.day}
                      as="button"
                      tone={tone}
                      elevation={isCurrent ? 'e2' : 'e1'}
                      bordered
                      interactive={!!onNavigateDay}
                      padded="none"
                      radius="lg"
                      onClick={() => onNavigateDay?.(item.day)}
                      className={cn(
                        'group relative overflow-hidden text-right p-4 flex flex-col gap-3 min-h-[150px]',
                        isFuture && 'opacity-70'
                      )}
                    >
                      {/* Day number + status */}
                      <div className="flex items-start justify-between">
                        <span
                          className={cn(
                            'font-display text-[2.25rem] leading-none font-semibold tabular-nums tracking-tight',
                            isCompleted ? 'text-[hsl(var(--ink-50))]' : 'text-[hsl(var(--ink-900))]'
                          )}
                        >
                          {String(item.day).padStart(2, '0')}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 size={16} className="text-[hsl(var(--color-success))]" />
                        )}
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--color-primary))]">
                            <Clock size={11} /> היום
                          </span>
                        )}
                        {isFuture && (
                          <Circle size={14} className="text-[hsl(var(--color-border-strong))]" />
                        )}
                      </div>

                      {/* Title + category */}
                      <div className="flex-1 flex flex-col gap-1.5">
                        <h4
                          className={cn(
                            'text-[13px] font-semibold leading-tight line-clamp-2 tracking-tight',
                            isCompleted ? 'text-[hsl(var(--ink-50))]' : 'text-[hsl(var(--ink-900))]'
                          )}
                        >
                          {item.emoji} {item.title}
                        </h4>
                        <Badge
                          tone={isCompleted ? 'neutral' : isCurrent ? 'brand' : 'neutral'}
                          size="xs"
                          className={isCompleted ? 'bg-white/15 text-white border-white/20' : ''}
                        >
                          {item.category}
                        </Badge>
                      </div>

                      {/* Hover arrow — all days navigable */}
                      {onNavigateDay && (
                        <ArrowUpLeft
                          size={14}
                          className={cn(
                            'absolute bottom-3 left-3 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5',
                            isCompleted ? 'text-[hsl(var(--ink-200))]' : 'text-[hsl(var(--color-text-faint))]'
                          )}
                        />
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="pt-8 mt-4 border-t border-[hsl(var(--color-border))] flex items-center justify-between flex-wrap gap-3">
        <Meta>התוכנית מתעדכנת דינמית לפי קצב ההתקדמות שלך.</Meta>
        <span className="text-[11px] font-mono tracking-widest text-[hsl(var(--color-text-faint))] uppercase">
          Engineer Daily · v2
        </span>
      </div>
    </div>
  );
}
