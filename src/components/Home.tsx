import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Settings as SettingsIcon,
  History,
  Calendar,
  MessageCircle,
  ChevronLeft,
  Zap,
  Clock,
  BarChart2,
  ArrowUpLeft,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DAYS } from '../content/days';

import { Section } from '../ui/Section';
import { Display, H3, Lead, Eyebrow, Body, Meta } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface HomeProps {
  onNavigate: (page: string) => void;
  streak: number;
  currentDay: number;
  onAdvanceDay: () => void;
}

export default function Home({ onNavigate, streak, currentDay, onAdvanceDay }: HomeProps) {
  const currentLesson = DAYS.find(l => l.day === currentDay) || DAYS[DAYS.length - 1];
  const completedCount = Math.max(0, currentDay - 1);

  // Time until next lesson (midnight)
  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ש ${minutes}ד`;
  };

  const [timeUntil, setTimeUntil] = useState(() => getTimeUntilMidnight());

  useEffect(() => {
    const id = setInterval(() => setTimeUntil(getTimeUntilMidnight()), 60_000);
    return () => clearInterval(id);
  }, []);

  const progressPercent = Math.round((completedCount / 30) * 100);

  return (
    <>
      {/* ─── HERO ─── */}
      <Section pad="hero" max="2xl" className="rise-in">
        <div className="grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-8">
            <Eyebrow className="mb-5">Engineer Daily · Day {currentDay} / 30</Eyebrow>
            <Display className="mb-6 text-[hsl(var(--ink-900))]">
              הנדסה, <span className="text-[hsl(var(--color-primary))] italic">שלב-שלב.</span>
            </Display>
            <Lead className="max-w-2xl">
              30 דקות ביום של אינטואיציה הנדסית — בקרה, הניע חשמלי, עיבוד אותות ואלגוריתמים מתקדמים.
              כל שיעור נבנה מ-5 שכבות: רקע, תיאוריה, סימולציה אינטראקטיבית, אתגר, סיכום.
            </Lead>

            <div className="mt-10 flex items-center gap-3 flex-wrap">
              <Button
                size="lg"
                onClick={() => onNavigate('lesson')}
                iconRight={<ChevronLeft size={18} />}
              >
                התחל יום {currentDay}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => onNavigate('plan')}>
                תוכנית חודשית
              </Button>
              <button
                onClick={onAdvanceDay}
                className="h-12 px-4 text-[13px] text-[hsl(var(--color-text-faint))] hover:text-[hsl(var(--color-primary-ink))] transition-colors flex items-center gap-1.5"
              >
                <Zap size={14} />
                דלג ליום הבא (dev)
              </button>
            </div>
          </div>

          {/* Right spine — stats */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
            <StatLine eyebrow="רצף פעיל" value={streak} unit="ימים" accent />
            <StatLine eyebrow="הושלמו" value={completedCount} unit={`/ 30 · ${progressPercent}%`} />
            <StatLine eyebrow="השיעור הבא" value={timeUntil} mono />
          </div>
        </div>

        {/* Thin progress spine */}
        <div className="mt-14 flex items-center gap-4">
          <Eyebrow>Progress</Eyebrow>
          <div className="flex-1 h-[2px] bg-[hsl(var(--color-border))] relative overflow-hidden">
            <div
              className="absolute inset-y-0 right-0 bg-[hsl(var(--ink-900))]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[13px] font-bold tabular-nums text-[hsl(var(--ink-900))]">
            {completedCount}/30
          </span>
        </div>
      </Section>

      {/* ─── TODAY'S LESSON — feature card ─── */}
      <Section pad="base" max="2xl">
        <div className="flex items-center gap-4 mb-6">
          <Eyebrow>השיעור היום</Eyebrow>
          <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
        </div>

        <Card
          elevation="e2"
          padded="none"
          radius="2xl"
          interactive
          onClick={() => onNavigate('lesson')}
          className="group overflow-hidden"
          as="button"
        >
          <div className="grid grid-cols-12 items-stretch text-right">
            {/* Big day number */}
            <div className="col-span-12 md:col-span-3 flex flex-col justify-between bg-[hsl(var(--ink-950))] text-[hsl(var(--ink-50))] p-8 min-h-[220px] relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-[hsl(var(--color-primary)/0.15)] blur-3xl" />
              <Eyebrow className="text-[hsl(var(--ink-300))] relative z-10">Day</Eyebrow>
              <div className="font-display text-[6.5rem] leading-[0.9] font-semibold tabular-nums relative z-10">
                {String(currentDay).padStart(2, '0')}
              </div>
            </div>

            {/* Content */}
            <div className="col-span-12 md:col-span-9 p-8 flex flex-col gap-4 justify-center">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="brand" size="sm">{currentLesson.category}</Badge>
                <Badge tone="neutral" size="sm">{currentLesson.level}</Badge>
                <Badge tone="secondary" size="sm">{currentLesson.duration_min} דק׳</Badge>
              </div>
              <H3 className="text-right">{currentLesson.title}</H3>
              <Body className="text-[hsl(var(--color-text-muted))] max-w-prose">
                {currentLesson.hero.subtitle}
              </Body>
              <div className="pt-2 flex items-center gap-2 text-[hsl(var(--color-primary-ink))] font-semibold text-sm group-hover:gap-3 transition-all">
                <span>התחל שיעור</span>
                <ArrowUpLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* ─── NAV GRID ─── */}
      <Section pad="base" max="2xl">
        <div className="flex items-center gap-4 mb-6">
          <Eyebrow>ניווט</Eyebrow>
          <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NavCard
            title="תוכנית חודשית"
            desc="מבט-על על 30 הימים"
            icon={Calendar}
            onClick={() => onNavigate('plan')}
          />
          <NavCard
            title="היסטוריה וסיכומים"
            desc={`${completedCount} ימים הושלמו`}
            icon={History}
            onClick={() => onNavigate('history')}
          />
          <NavCard
            title="התקדמות וסטטיסטיקה"
            desc="אנליטיקס מלא"
            icon={BarChart2}
            onClick={() => onNavigate('analytics')}
          />
          <NavCard
            title="הגדרות ותזכורות"
            desc="זמני לימוד והתראות"
            icon={SettingsIcon}
            onClick={() => onNavigate('settings')}
          />
        </div>
      </Section>

      {/* ─── FEEDBACK ─── */}
      <Section pad="base" max="2xl">
        <button
          onClick={() => onNavigate('feedback')}
          className="w-full text-right p-6 rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border-strong))] hover:border-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-soft))] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[hsl(var(--color-surface-2))] text-[hsl(var(--color-primary))] flex items-center justify-center group-hover:bg-white transition-colors">
              <MessageCircle size={20} />
            </div>
            <div>
              <H3 className="text-base font-semibold mb-0.5">איך אנחנו עושים?</H3>
              <Meta>נשמח לשמוע מה היה טוב ומה פחות</Meta>
            </div>
          </div>
          <ChevronLeft className="text-[hsl(var(--color-text-faint))] group-hover:text-[hsl(var(--color-primary))] group-hover:-translate-x-1 transition-all" />
        </button>
      </Section>
    </>
  );
}

/* ─────────── Sub-components ─────────── */

function StatLine({
  eyebrow, value, unit, accent, mono,
}: { eyebrow: string; value: React.ReactNode; unit?: string; accent?: boolean; mono?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-3 border-b py-3',
        accent ? 'border-[hsl(var(--color-primary)/0.3)]' : 'border-[hsl(var(--color-border))]'
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            'text-2xl font-bold tabular-nums tracking-tight',
            accent && 'text-[hsl(var(--color-primary))]',
            mono && 'font-mono text-lg'
          )}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-[hsl(var(--color-text-faint))]">{unit}</span>}
      </div>
    </div>
  );
}

function NavCard({
  title, desc, icon: Icon, onClick,
}: { title: string; desc: string; icon: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-right p-5 rounded-[var(--radius-lg)] bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] shadow-[var(--shadow-e1)] hover:shadow-[var(--shadow-e3)] hover:-translate-y-0.5 hover:border-[hsl(var(--color-border-strong))] transition-all flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[hsl(var(--color-surface-2))] text-[hsl(var(--ink-800))] flex items-center justify-center group-hover:bg-[hsl(var(--ink-900))] group-hover:text-[hsl(var(--ink-50))] transition-colors">
          <Icon size={18} />
        </div>
        <ChevronLeft size={16} className="text-[hsl(var(--color-text-faint))] group-hover:text-[hsl(var(--color-primary))] group-hover:-translate-x-0.5 transition-all" />
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-[hsl(var(--ink-900))] mb-1 tracking-tight">{title}</h3>
        <p className="text-[13px] text-[hsl(var(--color-text-faint))]">{desc}</p>
      </div>
    </button>
  );
}
