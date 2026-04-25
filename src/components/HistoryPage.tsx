import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Book,
  Clock,
  ArrowUpLeft,
  Lock,
  CheckCircle2,
  FileText,
  Sparkles,
  Calendar,
  X,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DAYS } from '../content/days';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Eyebrow, Body, Meta, H3 } from '../ui/Typography';

interface HistoryPageProps {
  currentDay: number;
  onNavigateToDay: (day: number) => void;
}

type FilterKey = 'all' | 'available' | 'completed' | 'locked';

export default function HistoryPage({ currentDay, onNavigateToDay }: HistoryPageProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showExtended, setShowExtended] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const filteredDays = useMemo(() => {
    return DAYS.filter(d => {
      const matchesSearch =
        !searchQuery ||
        d.title.includes(searchQuery) ||
        d.day.toString().includes(searchQuery) ||
        d.category.includes(searchQuery);

      const isCompleted = d.day < currentDay;
      const isAvailable = !!d.sections.summary_extended;
      const isLocked = d.day > currentDay;

      const matchesFilter =
        filter === 'all' ||
        (filter === 'available' && isAvailable) ||
        (filter === 'completed' && isCompleted) ||
        (filter === 'locked' && isLocked);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter, currentDay]);

  const selectedSummary = DAYS.find(d => d.day === selectedDay);

  /* Group by week for timeline presentation */
  const byWeek = useMemo(() => {
    const weeks: Record<number, typeof DAYS> = {};
    filteredDays.forEach(d => {
      const w = Math.ceil(d.day / 7);
      if (!weeks[w]) weeks[w] = [];
      weeks[w].push(d);
    });
    return weeks;
  }, [filteredDays]);

  const availableCount = DAYS.filter(d => d.sections.summary_extended).length;
  const completedCount = Math.max(0, currentDay - 1);

  return (
    <div className="flex flex-col gap-10">
      {/* Controls strip — search + filters + stats */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between pb-6 border-b border-[hsl(var(--color-border))]">
        <div className="flex-1 w-full max-w-xl">
          <Eyebrow className="mb-3">חיפוש ומסנן</Eyebrow>
          <div className="relative">
            <Search
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-faint))]"
            />
            <input
              type="text"
              placeholder="חפש לפי נושא, יום, או קטגוריה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-11 pl-4 h-11 bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-[var(--radius-md)] text-[13px] focus:outline-none focus:border-[hsl(var(--color-primary))] focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.15)] transition-all"
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {([
              { key: 'all', label: 'הכל', count: DAYS.length },
              { key: 'completed', label: 'הושלמו', count: completedCount },
              { key: 'available', label: 'עם סיכום', count: availableCount },
              { key: 'locked', label: 'טרם נפתחו', count: DAYS.filter(d => d.day > currentDay).length },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'h-8 px-3 text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors inline-flex items-center gap-1.5 border',
                  filter === f.key
                    ? 'bg-[hsl(var(--ink-900))] border-[hsl(var(--ink-900))] text-[hsl(var(--ink-50))]'
                    : 'bg-[hsl(var(--color-surface))] border-[hsl(var(--color-border))] text-[hsl(var(--color-text-muted))] hover:border-[hsl(var(--color-border-strong))]'
                )}
              >
                {f.label}
                <span
                  className={cn(
                    'text-[10px] font-bold tabular-nums px-1.5 rounded-full',
                    filter === f.key
                      ? 'bg-white/15 text-white'
                      : 'bg-[hsl(var(--color-surface-2))] text-[hsl(var(--color-text-faint))]'
                  )}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <Eyebrow>סה״כ סיכומים זמינים</Eyebrow>
            <div className="mt-1 font-display text-3xl font-semibold tabular-nums text-[hsl(var(--ink-900))]">
              {availableCount}
              <span className="text-sm text-[hsl(var(--color-text-faint))] font-sans mr-1">/ {DAYS.length}</span>
            </div>
          </div>
          <div className="h-12 w-px bg-[hsl(var(--color-border))]" />
          <div className="text-right">
            <Eyebrow>הושלמו על ידיך</Eyebrow>
            <div className="mt-1 font-display text-3xl font-semibold tabular-nums text-[hsl(var(--color-primary))]">
              {completedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline grouped by week */}
      <div className="flex flex-col gap-14">
        {Object.keys(byWeek).length === 0 && (
          <div className="py-20 text-center border border-dashed border-[hsl(var(--color-border))] rounded-[var(--radius-xl)]">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--color-surface-2))] flex items-center justify-center mx-auto mb-4">
              <Book size={24} className="text-[hsl(var(--color-text-faint))]" />
            </div>
            <Body className="text-[hsl(var(--color-text-faint))]">לא נמצאו תוצאות לחיפוש זה.</Body>
          </div>
        )}

        {Object.entries(byWeek).map(([wk, days]) => (
          <section key={wk} className="grid grid-cols-12 gap-6">
            {/* Week eyebrow */}
            <div className="col-span-12 md:col-span-3 md:sticky md:top-28 md:self-start">
              <Eyebrow className="mb-2">Week {String(wk).padStart(2, '0')}</Eyebrow>
              <h3 className="font-display text-xl font-semibold tracking-tight text-[hsl(var(--ink-900))] mb-1">
                ימים {(Number(wk) - 1) * 7 + 1}–{Math.min(Number(wk) * 7, 30)}
              </h3>
              <Meta>{days.length} שיעורים</Meta>
            </div>

            {/* Day list */}
            <ol className="col-span-12 md:col-span-9 flex flex-col">
              {days.map((d, idx) => {
                const isCompleted = d.day < currentDay;
                const isCurrent = d.day === currentDay;
                const isLocked = d.day > currentDay;
                const isAvailable = !!d.sections.summary_extended;
                const isActive = selectedDay === d.day;
                const isLast = idx === days.length - 1;

                return (
                  <li
                    key={d.day}
                    className={cn(
                      'group relative pr-8 py-5',
                      !isLast && 'border-b border-[hsl(var(--color-border))]'
                    )}
                  >
                    {/* Timeline dot */}
                    <span
                      className={cn(
                        'absolute right-0 top-7 w-2.5 h-2.5 rounded-full ring-4',
                        isCompleted && 'bg-[hsl(var(--color-success))] ring-[hsl(var(--color-success)/0.15)]',
                        isCurrent && 'bg-[hsl(var(--color-primary))] ring-[hsl(var(--color-primary)/0.2)] animate-pulse',
                        isLocked && 'bg-[hsl(var(--color-border-strong))] ring-transparent'
                      )}
                    />

                    <button
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedDay(isActive ? null : d.day);
                          setShowExtended(false);
                        }
                      }}
                      disabled={!isAvailable}
                      className={cn(
                        'w-full text-right flex items-start justify-between gap-4 transition-all',
                        !isAvailable && 'cursor-not-allowed opacity-55'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="font-mono text-[11px] uppercase tracking-widest text-[hsl(var(--color-text-faint))]">
                            Day {String(d.day).padStart(2, '0')}
                          </span>
                          <Badge tone="neutral" size="xs">{d.category}</Badge>
                          <Badge tone="neutral" size="xs">{d.level}</Badge>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--color-success))]">
                              <CheckCircle2 size={12} /> הושלם
                            </span>
                          )}
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--color-primary))]">
                              <Clock size={12} /> היום
                            </span>
                          )}
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--color-text-faint))]">
                              <Lock size={11} /> נעול
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-xl font-semibold tracking-tight text-[hsl(var(--ink-900))] leading-tight">
                          {d.title}
                        </h4>
                        <Meta className="mt-1.5 line-clamp-2 max-w-2xl">{d.hero?.subtitle}</Meta>
                      </div>

                      {isAvailable && (
                        <div
                          className={cn(
                            'shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-all',
                            isActive
                              ? 'text-[hsl(var(--color-primary))]'
                              : 'text-[hsl(var(--color-text-muted))] group-hover:text-[hsl(var(--ink-900))]'
                          )}
                        >
                          {isActive ? 'סגור' : 'קרא סיכום'}
                          {isActive ? <X size={14} /> : <ArrowUpLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />}
                        </div>
                      )}
                    </button>

                    {/* Inline expanded reader */}
                    <AnimatePresence initial={false}>
                      {isActive && selectedSummary && selectedSummary.day === d.day && (
                        <motion.div
                          key="reader"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <ReaderPanel
                            summary={selectedSummary}
                            showExtended={showExtended}
                            setShowExtended={setShowExtended}
                            currentDay={currentDay}
                            onNavigateToDay={onNavigateToDay}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Reader panel ─────────── */

function ReaderPanel({
  summary,
  showExtended,
  setShowExtended,
  currentDay,
  onNavigateToDay,
}: {
  summary: any;
  showExtended: boolean;
  setShowExtended: (v: boolean) => void;
  currentDay: number;
  onNavigateToDay: (day: number) => void;
}) {
  const canVisit = summary.day <= currentDay;
  return (
    <div className="mt-8">
      <Card tone="surface" elevation="e2" bordered padded="lg" radius="xl" className="relative overflow-hidden">
        {/* Paper texture */}
        <div className="absolute inset-0 grain pointer-events-none opacity-[0.35]" />

        <div className="relative z-10">
          {/* Toggle strip */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-5 mb-8 border-b border-[hsl(var(--color-border))]">
            <div className="inline-flex items-center gap-1 p-1 rounded-[var(--radius-md)] bg-[hsl(var(--color-surface-2))] border border-[hsl(var(--color-border))]">
              <button
                onClick={() => setShowExtended(false)}
                className={cn(
                  'h-8 px-3.5 text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors inline-flex items-center gap-1.5',
                  !showExtended
                    ? 'bg-[hsl(var(--color-surface))] text-[hsl(var(--ink-900))] shadow-[var(--shadow-e1)]'
                    : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--ink-900))]'
                )}
              >
                <Sparkles size={12} /> סיכום קצר
              </button>
              <button
                onClick={() => setShowExtended(true)}
                disabled={!summary.sections.summary_extended}
                className={cn(
                  'h-8 px-3.5 text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors inline-flex items-center gap-1.5',
                  showExtended
                    ? 'bg-[hsl(var(--color-surface))] text-[hsl(var(--ink-900))] shadow-[var(--shadow-e1)]'
                    : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--ink-900))] disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <FileText size={12} /> סיכום מלא
              </button>
            </div>

            <Button
              size="sm"
              variant={canVisit ? 'primary' : 'ghost'}
              disabled={!canVisit}
              iconRight={<ArrowUpLeft size={14} />}
              onClick={() => onNavigateToDay(summary.day)}
            >
              {canVisit ? 'מעבר לשיעור' : 'שיעור טרם נפתח'}
            </Button>
          </div>

          {/* Header */}
          <div className="mb-10">
            <Eyebrow className="mb-3">Day {String(summary.day).padStart(2, '0')} · Summary</Eyebrow>
            <h2 className="font-display text-[2.4rem] leading-[1.1] tracking-tight text-[hsl(var(--ink-900))]">
              {summary.title}
            </h2>
            <div className="mt-3 flex items-center gap-4 text-[12px] text-[hsl(var(--color-text-faint))]">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {summary.duration_min} דק׳ לימוד
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} /> {summary.category} · {summary.level}
              </span>
            </div>
          </div>

          {/* Content */}
          {!showExtended ? (
            <div className="grid grid-cols-12 gap-8">
              {/* Key points — 7 cols */}
              <div className="col-span-12 lg:col-span-7">
                <Eyebrow className="mb-4">נקודות מפתח</Eyebrow>
                <div className="flex flex-col gap-3">
                  {summary.sections.summary.points.map((p: any, i: number) => (
                    <div
                      key={i}
                      className="flex gap-3 p-4 rounded-[var(--radius-md)] border-r-2 border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary-soft))]"
                    >
                      <span className="font-display font-semibold tabular-nums text-[hsl(var(--color-primary))] text-lg leading-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[14px] text-[hsl(var(--color-text))] leading-relaxed">
                        {p.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Misconceptions — 5 cols */}
              <div className="col-span-12 lg:col-span-5">
                <Eyebrow className="mb-4">תפיסות שגויות</Eyebrow>
                <div className="flex flex-col gap-3">
                  {summary.sections.summary.misconceptions.map((m: any, i: number) => (
                    <div key={i} className="p-4 rounded-[var(--radius-md)] bg-[hsl(var(--color-surface-2))] border border-[hsl(var(--color-border))]">
                      <div className="flex gap-2 items-start mb-1.5">
                        <span className="text-[hsl(var(--color-error))] text-xs font-bold mt-0.5">✘</span>
                        <p className="text-[13px] font-semibold text-[hsl(var(--ink-900))] leading-snug">{m.myth}</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className="text-[hsl(var(--color-success))] text-xs font-bold mt-0.5">✓</span>
                        <p className="text-[12.5px] text-[hsl(var(--color-text-muted))] leading-snug">{m.truth}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key equation — ink panel */}
                {summary.sections?.theory?.key_equation?.latex && (
                  <div className="mt-6 p-6 rounded-[var(--radius-lg)] bg-[hsl(var(--ink-950))] text-[hsl(var(--ink-50))] text-center">
                    <Eyebrow className="!text-[hsl(var(--ink-400))] mb-3">Key Equation</Eyebrow>
                    <div dir="ltr" className="font-mono text-lg text-[hsl(var(--color-accent))]">
                      {summary.sections.theory.key_equation.latex}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="prose-editorial max-w-prose mx-auto">
              {summary.sections.summary_extended?.overview && (
                <>
                  <Eyebrow>סקירה כללית</Eyebrow>
                  <p className="lead mb-10">{summary.sections.summary_extended.overview}</p>
                </>
              )}

              {summary.sections.summary_extended?.theory_deep && (
                <>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-[hsl(var(--ink-900))] mt-10 mb-4">
                    תיאוריה מעמיקה
                  </h3>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {summary.sections.summary_extended.theory_deep}
                  </ReactMarkdown>
                </>
              )}

              {summary.sections.summary_extended?.worked_example && (
                <>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-[hsl(var(--ink-900))] mt-10 mb-4">
                    דוגמה מחושבת
                  </h3>
                  <div className="rounded-[var(--radius-lg)] bg-[hsl(var(--color-surface-2))] border-r-4 border-[hsl(var(--color-primary))] p-6">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {summary.sections.summary_extended.worked_example}
                    </ReactMarkdown>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-[hsl(var(--color-border))]">
                {summary.sections.summary_extended?.applications && (
                  <div>
                    <Eyebrow className="mb-3">יישומים תעשייתיים</Eyebrow>
                    <ul className="list-disc pr-5 space-y-1.5 text-[14px] text-[hsl(var(--color-text))] marker:text-[hsl(var(--color-primary))]">
                      {summary.sections.summary_extended.applications.map((a: string, i: number) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {summary.sections.summary_extended?.further_reading && (
                  <div>
                    <Eyebrow className="mb-3">קריאה נוספת</Eyebrow>
                    <ul className="list-disc pr-5 space-y-1.5 text-[14px] text-[hsl(var(--color-text))] marker:text-[hsl(var(--color-secondary))]">
                      {summary.sections.summary_extended.further_reading.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
