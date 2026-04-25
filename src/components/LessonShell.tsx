import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Trophy, Download, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';

import ProgressBar from './ProgressBar';
import SummaryPanel from './SummaryPanel';
import StudyTimer from './StudyTimer';
import { DayContent } from '../content/days';

import { TopNav } from '../ui/TopNav';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Eyebrow } from '../ui/Typography';

interface LessonShellProps {
  dayContent: DayContent;
  onComplete: (score: number) => void;
  streak: number;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  children: (props: {
    markComplete: (id: string) => void;
    completed: string[];
    sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  }) => React.ReactNode;
}

const SECTION_LABELS: Record<string, string> = {
  background: 'רקע',
  theory: 'תיאוריה',
  simulation: 'סימולציה',
  challenge: 'אתגר',
  summary: 'סיכום',
};

export default function LessonShell({ dayContent, onComplete, streak, onPrevDay, onNextDay, children }: LessonShellProps) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('background');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const markComplete = (id: string) => {
    setCompleted(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref as Element);
    });
    return () => observer.disconnect();
  }, []);

  const totalSteps = dayContent.sections.challenge.questions.length + 1;
  const currentProgress = completed.filter(id => id.startsWith('q') || id === 'summary').length;

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = ['background', 'theory', 'simulation', 'challenge', 'summary'];

  return (
    <div className="min-h-screen bg-[hsl(var(--color-bg))]">
      {/* Contextual TopNav for DayPage */}
      <TopNav
        streak={streak}
        currentDay={dayContent.day}
        breadcrumb={dayContent.title}
        trailing={<StudyTimer variant="minimal" />}
        progress={{ current: currentProgress, total: totalSteps }}
      />

      {/* Lesson meta strip */}
      <div className="bg-[hsl(var(--color-surface))] border-b border-[hsl(var(--color-border))]">
        <Section pad="tight" max="2xl" className="!py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Eyebrow>יום {dayContent.day} · {dayContent.category}</Eyebrow>
            <span className="text-[hsl(var(--color-border-strong))]">·</span>
            <Badge tone="neutral" size="xs">{dayContent.level}</Badge>
            <Badge tone="neutral" size="xs">{dayContent.duration_min} דק׳</Badge>
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollToSection(s)}
                  className={cn(
                    'h-7 px-2.5 text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors',
                    activeSection === s
                      ? 'bg-[hsl(var(--ink-900))] text-[hsl(var(--ink-50))]'
                      : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--ink-900))] hover:bg-[hsl(var(--color-surface-2))]'
                  )}
                >
                  {SECTION_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* Article body */}
      <main>
        <Section pad="loose" max="lg" className="flex flex-col gap-16">
          {children({ markComplete, completed, sectionRefs })}

          {/* Summary Section */}
          <section id="summary" ref={el => { sectionRefs.current['summary'] = el; }}>
            <div className="mb-8 flex items-baseline gap-4">
              <Eyebrow>05 · Summary</Eyebrow>
              <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
            </div>

            <SummaryPanel
              title={dayContent.title}
              points={dayContent.sections.summary.points}
              misconceptions={dayContent.sections.summary.misconceptions}
              nextDayTitle={dayContent.sections.summary.next_day.title}
              nextDayDesc={dayContent.sections.summary.next_day.desc}
              completedCount={currentProgress}
              totalCount={totalSteps}
              dayNumber={dayContent.day}
              streak={streak}
            />

            <div className="mt-14 pt-10 border-t border-[hsl(var(--color-border))] flex flex-col items-center gap-5">
              <Button
                variant="secondary"
                size="md"
                iconLeft={<Download size={16} />}
                onClick={async () => {
                  const { default: jsPDF } = await import('jspdf');
                  const html2canvasModule = await import('html2canvas');
                  const html2canvas: any = (html2canvasModule as any).default;
                  const el = document.querySelector('main') as HTMLElement;
                  const canvas = await html2canvas(el, { scale: 1.5 });
                  const pdf = new jsPDF({ orientation: 'portrait', format: 'a4' });
                  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
                  pdf.save(`day-${dayContent.day}.pdf`);
                }}
              >
                שמור PDF
              </Button>

              <button
                onClick={() => {
                  const questions = dayContent.sections.challenge.questions;
                  const answeredCount = completed.filter(id => id.startsWith('q')).length;
                  const score = questions.length > 0 ? answeredCount / questions.length : 1;
                  markComplete('summary');
                  onComplete(score);
                }}
                className="group relative px-10 py-5 rounded-[var(--radius-xl)] bg-[hsl(var(--ink-900))] text-[hsl(var(--ink-50))] font-semibold text-lg shadow-[var(--shadow-e3)] hover:shadow-[var(--shadow-e5)] hover:-translate-y-0.5 transition-all overflow-hidden tracking-tight"
              >
                <span className="flex items-center gap-3 relative z-10">
                  <Trophy className="text-[hsl(var(--color-accent))] group-hover:rotate-12 transition-transform" size={20} />
                  סיימתי את יום {dayContent.day}
                  <CheckCircle2 size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="absolute inset-0 bg-[hsl(var(--color-primary))] translate-y-full group-hover:translate-y-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-standard)]" />
              </button>

              {/* ── Prev / Next day navigation ──────────────────── */}
              {(onPrevDay || onNextDay) && (
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft={<ChevronRight size={16} />}
                    onClick={onPrevDay}
                    disabled={!onPrevDay}
                    className="opacity-70 hover:opacity-100"
                  >
                    יום {dayContent.day - 1}
                  </Button>
                  <span className="text-[hsl(var(--color-border-strong))] text-sm">·</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconRight={<ChevronLeft size={16} />}
                    onClick={onNextDay}
                    disabled={!onNextDay}
                    className="opacity-70 hover:opacity-100"
                  >
                    יום {dayContent.day + 1}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </Section>
      </main>
    </div>
  );
}
