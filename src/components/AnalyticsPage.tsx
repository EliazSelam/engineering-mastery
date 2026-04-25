import React, { useMemo, useState } from 'react';
import { useStudySystem } from '../hooks/useStudySystem';
import { DAYS } from '../content/days';
import {
  Trophy, Clock, Flame, GraduationCap,
  Target, Zap, Waves, Settings, Atom,
  TrendingUp, Calendar, Activity, Gauge,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area,
} from 'recharts';

import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { KPIStat } from '../ui/KPIStat';
import { Eyebrow, Body, Meta, H3, Display, Lead } from '../ui/Typography';

/* ─── Brand-tinted category map ─── */
const CATEGORIES = [
  { name: 'בקרה',     icon: Target,   color: 'hsl(var(--color-primary))' },
  { name: 'DSP',       icon: Waves,    color: 'hsl(var(--color-secondary))' },
  { name: 'רובוטיקה',  icon: Zap,      color: 'hsl(var(--color-success))' },
  { name: 'מנועים',    icon: Settings, color: 'hsl(var(--color-accent))' },
  { name: 'אלגוריתמים', icon: Atom,     color: '#8B5CF6' },
];

/* ─── Editorial progress ring (ink-style) ─── */
function ProgressRing({
  percentage, color, icon: Icon, label,
}: { percentage: number; color: string; icon: any; label: string }) {
  const r = 34;
  const C = 2 * Math.PI * r;
  const offset = C - (percentage / 100) * C;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[88px] h-[88px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none"
                  stroke="hsl(var(--color-border))" strokeWidth="5" />
          <motion.circle
            cx="44" cy="44" r={r} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={22} style={{ color }} />
        </div>
      </div>
      <div className="text-center">
        <div className="text-[13px] font-semibold text-[hsl(var(--ink-900))] tracking-tight">{label}</div>
        <div className="text-[11px] font-mono tabular-nums text-[hsl(var(--color-text-faint))]">
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { progress } = useStudySystem();
  const { completedDays, streak, maxStreak, totalStudyTime, mastery } = progress;
  const [tab, setTab] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const totalHours = Math.floor(totalStudyTime / 3600);
  const totalMinutes = Math.floor((totalStudyTime % 3600) / 60);

  const averageScore = useMemo(() => {
    const s = Object.values(mastery).map((m: any) => m.score);
    return s.length ? (s.reduce((a: number, b: number) => a + b, 0) / s.length) * 100 : 0;
  }, [mastery]);

  const forecast = useMemo(() => {
    const times = Object.values(mastery).map((m: any) => m.lastAttempt).filter(t => t > 0);
    const startTime = times.length > 0 ? Math.min(...times) : Date.now();
    const weeksElapsed = Math.max(0.1, (Date.now() - startTime) / (7 * 86400 * 1000));
    const rate = completedDays.length / weeksElapsed;
    const remaining = 30 - completedDays.length;
    const weeksToFinish = rate > 0 ? remaining / rate : 0;
    return {
      rate: Math.round(rate * 10) / 10,
      weeksToFinish: Math.round(weeksToFinish * 10) / 10,
      health: weeksToFinish < 2 ? 'excellent' : weeksToFinish < 4 ? 'good' : 'behind',
    } as const;
  }, [mastery, completedDays]);

  const categoryProgress = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    CATEGORIES.forEach(c => { counts[c.name] = { total: 0, completed: 0 }; });
    const done = new Set(completedDays);
    DAYS.forEach(day => {
      const cat = CATEGORIES.find(c => c.name === day.category || day.category.includes(c.name));
      if (cat) {
        counts[cat.name].total++;
        if (done.has(day.day)) counts[cat.name].completed++;
      }
    });
    return CATEGORIES.map(cat => ({
      ...cat,
      percentage: counts[cat.name].total > 0
        ? (counts[cat.name].completed / counts[cat.name].total) * 100
        : 0,
    }));
  }, [completedDays]);

  const dailyScoresData = useMemo(() => {
    const data: { day: string; score: number }[] = [];
    [...completedDays].sort((a, b) => a - b).forEach(d => {
      data.push({ day: `D${d}`, score: Math.round((mastery[d]?.score || 0) * 100) });
    });
    return data;
  }, [completedDays, mastery]);

  const last7DaysScores = useMemo(() => {
    return Object.values(mastery)
      .sort((a: any, b: any) => b.lastAttempt - a.lastAttempt)
      .slice(0, 7)
      .reverse()
      .map((m: any) => ({ name: `D${m.dayId}`, score: Math.round(m.score * 100) }));
  }, [mastery]);

  const weeklyAverages = useMemo(() => {
    return [1, 2, 3, 4].map(w => {
      const days = Array.from({ length: 7 }, (_, i) => (w - 1) * 7 + i + 1);
      const scores = days.map(d => mastery[d]?.score || 0).filter(s => s > 0);
      return {
        name: `W${w}`,
        score: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : 0,
      };
    });
  }, [mastery]);

  const cumulativeData = useMemo(() => {
    const data: { day: number; completed: number }[] = [];
    let c = 0;
    const done = new Set(completedDays);
    for (let i = 1; i <= 30; i++) {
      if (done.has(i)) c++;
      data.push({ day: i, completed: c });
    }
    return data;
  }, [completedDays]);

  const radarData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const days = DAYS.filter(d => d.category === cat.name || d.category.includes(cat.name));
      const scores = days.map(d => mastery[d.day]?.score || 0).filter(s => s > 0);
      const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) * 100 : 0;
      return { subject: cat.name, A: Math.round(avg), fullMark: 100 };
    });
  }, [mastery]);

  const heatmap = useMemo(() => {
    const done = new Set(completedDays);
    return Array.from({ length: 5 }, (_, w) => {
      return Array.from({ length: 7 }, (__, d) => {
        const num = w * 7 + d + 1;
        const score = mastery[num]?.score || 0;
        let intensity = 0;
        if (done.has(num)) {
          if (score >= 0.9) intensity = 4;
          else if (score >= 0.7) intensity = 3;
          else if (score >= 0.5) intensity = 2;
          else intensity = 1;
        }
        return { num, intensity, valid: num <= 30 };
      });
    });
  }, [completedDays, mastery]);

  const forecastTone = forecast.health === 'excellent' ? 'success' : forecast.health === 'good' ? 'warning' : 'danger';
  const forecastLabel = forecast.health === 'excellent' ? 'בקצב מצוין' : forecast.health === 'good' ? 'בקצב תקין' : 'מתחת לקצב';

  return (
    <Section pad="base" max="2xl" className="rise-in">
      {/* ─── Editorial header ─── */}
      <div className="pb-10 mb-10 border-b border-[hsl(var(--color-border))]">
        <div className="grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-8">
            <Eyebrow className="mb-4">Analytics · Performance Intelligence</Eyebrow>
            <Display className="text-[hsl(var(--ink-900))]">
              התקדמות, <span className="italic text-[hsl(var(--color-primary))]">נמדדת.</span>
            </Display>
            <Lead className="mt-4 max-w-xl">
              מבט-על על הקצב, האיכות והפערים — כל המספרים במקום אחד, עם המסקנה קודם.
            </Lead>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Card tone="ink" padded="lg" radius="xl" elevation="e3" className="text-[hsl(var(--ink-50))] relative overflow-hidden">
              <div className="absolute -left-8 -top-8 w-36 h-36 rounded-full bg-[hsl(var(--color-primary)/0.25)] blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-[hsl(var(--color-accent))]" />
                  <Eyebrow className="!text-[hsl(var(--ink-300))]">Forecast</Eyebrow>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[3.5rem] leading-none font-semibold tabular-nums">
                    {forecast.weeksToFinish}
                  </span>
                  <span className="text-sm text-[hsl(var(--ink-300))]">שבועות לסיום</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${forecastTone === 'success' ? 'bg-[hsl(var(--color-success))]' : forecastTone === 'warning' ? 'bg-[hsl(var(--color-accent))]' : 'bg-[hsl(var(--color-error))]'}`} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--ink-200))]">
                    {forecastLabel}
                  </span>
                  <span className="text-[12px] text-[hsl(var(--ink-400))] mr-auto">
                    {forecast.rate} ימים / שבוע
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ─── KPI Row ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <KPIStat
          label="הושלמו"
          value={completedDays.length}
          unit={`/ 30`}
          icon={<Trophy size={16} />}
          tone="brand"
        />
        <KPIStat
          label="Streak מקסימלי"
          value={maxStreak || streak}
          unit="ימים"
          icon={<Flame size={16} />}
          tone="accent"
        />
        <KPIStat
          label="ציון ממוצע"
          value={`${Math.round(averageScore)}%`}
          icon={<GraduationCap size={16} />}
          tone="secondary"
        />
        <KPIStat
          label="זמן לימוד"
          value={`${totalHours}h ${totalMinutes}m`}
          icon={<Clock size={16} />}
          tone="success"
        />
      </div>

      {/* ─── Time window tabs ─── */}
      <div className="flex items-center gap-4 mb-8">
        <Eyebrow>חתך זמן</Eyebrow>
        <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
        <div className="inline-flex items-center gap-1 p-1 rounded-[var(--radius-md)] bg-[hsl(var(--color-surface-2))] border border-[hsl(var(--color-border))]">
          {(['daily', 'weekly', 'monthly'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-8 px-3.5 text-[12px] font-semibold rounded-[var(--radius-sm)] transition-colors ${
                tab === t
                  ? 'bg-[hsl(var(--ink-900))] text-[hsl(var(--ink-50))]'
                  : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--ink-900))]'
              }`}
            >
              {t === 'daily' ? 'יומי' : t === 'weekly' ? 'שבועי' : 'חודשי'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          >
            <Card elevation="e2" bordered padded="lg" radius="xl">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <Eyebrow>Last 7 Days</Eyebrow>
                  <H3 className="mt-1">ביצועים ב-7 הימים האחרונים</H3>
                </div>
                <Meta>ציון לכל שיעור</Meta>
              </div>
              <div className="h-[320px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7DaysScores} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--color-border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} stroke="hsl(var(--color-text-faint))" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--color-text-faint))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--ink-900))', border: 'none', borderRadius: 8, color: 'white' }} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={36}>
                      {last7DaysScores.map((e, i) => (
                        <Cell key={i} fill={
                          e.score >= 90 ? 'hsl(var(--color-success))' :
                          e.score >= 70 ? 'hsl(var(--color-primary))' :
                          e.score >= 50 ? 'hsl(var(--color-accent))' :
                          'hsl(var(--color-error))'
                        } />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'weekly' && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          >
            <Card elevation="e2" bordered padded="lg" radius="xl">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <Eyebrow>Weekly Average</Eyebrow>
                  <H3 className="mt-1">ממוצע שבועי</H3>
                </div>
                <Meta>חודש הנוכחי</Meta>
              </div>
              <div className="h-[320px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyAverages} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--color-border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} stroke="hsl(var(--color-text-faint))" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--color-text-faint))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--ink-900))', border: 'none', borderRadius: 8, color: 'white' }} />
                    <Bar dataKey="score" fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} barSize={56} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'monthly' && (
          <motion.div
            key="monthly"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col gap-10"
          >
            {/* Row: cumulative area + mastery rings */}
            <div className="grid grid-cols-12 gap-6">
              {/* Cumulative progress — 7 cols */}
              <Card className="col-span-12 lg:col-span-7" elevation="e2" bordered padded="lg" radius="xl">
                <div className="flex items-baseline justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[hsl(var(--color-secondary))]" />
                    <Eyebrow>Cumulative Progress</Eyebrow>
                  </div>
                  <Meta>30-day arc</Meta>
                </div>
                <div className="h-[240px] w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cumulativeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradInk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--ink-900))" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="hsl(var(--ink-900))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--color-border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }} stroke="hsl(var(--color-text-faint))" />
                      <YAxis domain={[0, 30]} tick={{ fontSize: 10 }} stroke="hsl(var(--color-text-faint))" />
                      <Tooltip contentStyle={{ background: 'hsl(var(--ink-900))', border: 'none', borderRadius: 8, color: 'white' }} />
                      <Area type="monotone" dataKey="completed"
                            stroke="hsl(var(--ink-900))" strokeWidth={2.5}
                            fill="url(#gradInk)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Mastery by category — 5 cols */}
              <Card className="col-span-12 lg:col-span-5" elevation="e2" bordered padded="lg" radius="xl">
                <div className="flex items-baseline justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Gauge size={16} className="text-[hsl(var(--color-primary))]" />
                    <Eyebrow>Mastery by Category</Eyebrow>
                  </div>
                  <Meta>אחוז כיסוי</Meta>
                </div>
                <div className="grid grid-cols-3 gap-y-6 gap-x-2 place-items-center">
                  {categoryProgress.map((c, i) => (
                    <ProgressRing key={i} label={c.name} percentage={c.percentage} color={c.color} icon={c.icon} />
                  ))}
                </div>
              </Card>
            </div>

            {/* Row: heatmap (dark) + radar */}
            <div className="grid grid-cols-12 gap-6">
              {/* Calendar heatmap — 7 cols, ink-dark */}
              <Card
                tone="ink"
                className="col-span-12 lg:col-span-7 relative overflow-hidden"
                elevation="e3"
                padded="lg"
                radius="xl"
              >
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[hsl(var(--color-primary)/0.18)] blur-3xl pointer-events-none" />
                <div className="relative z-10 text-[hsl(var(--ink-50))]">
                  <div className="flex items-baseline justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[hsl(var(--color-accent))]" />
                      <Eyebrow className="!text-[hsl(var(--ink-300))]">Activity Heatmap</Eyebrow>
                    </div>
                    <span className="text-[11px] font-mono text-[hsl(var(--ink-400))]">30-day map</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {heatmap.map((week, wi) => (
                      <div key={wi} className="flex items-center gap-3">
                        <span className="w-10 text-[10px] font-mono uppercase text-[hsl(var(--ink-500))]">
                          W{wi + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-7 gap-1.5">
                          {week.map((d, di) => (
                            <div
                              key={di}
                              title={d.valid ? `Day ${d.num}` : ''}
                              className={`aspect-square rounded-sm transition-all ${
                                !d.valid ? 'bg-transparent' :
                                d.intensity === 0 ? 'bg-white/5' :
                                d.intensity === 1 ? 'bg-[hsl(var(--color-primary)/0.25)]' :
                                d.intensity === 2 ? 'bg-[hsl(var(--color-primary)/0.5)]' :
                                d.intensity === 3 ? 'bg-[hsl(var(--color-primary)/0.75)]' :
                                'bg-[hsl(var(--color-primary))] shadow-[0_0_12px_hsl(var(--color-primary)/0.5)]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3 text-[11px] font-mono text-[hsl(var(--ink-400))]">
                    <span>פחות</span>
                    {[0, 1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          i === 0 ? 'bg-white/5' :
                          i === 1 ? 'bg-[hsl(var(--color-primary)/0.25)]' :
                          i === 2 ? 'bg-[hsl(var(--color-primary)/0.5)]' :
                          i === 3 ? 'bg-[hsl(var(--color-primary)/0.75)]' :
                          'bg-[hsl(var(--color-primary))]'
                        }`}
                      />
                    ))}
                    <span>יותר</span>
                  </div>
                </div>
              </Card>

              {/* Radar — 5 cols */}
              <Card
                className="col-span-12 lg:col-span-5"
                elevation="e2"
                bordered
                padded="lg"
                radius="xl"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-[hsl(var(--color-secondary))]" />
                    <Eyebrow>Engineering Profile</Eyebrow>
                  </div>
                  <Meta>חוזק יחסי</Meta>
                </div>
                <div className="h-[320px] w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="hsl(var(--color-border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 600, fill: 'hsl(var(--ink-700))' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="שליטה"
                        dataKey="A"
                        stroke="hsl(var(--color-secondary))"
                        fill="hsl(var(--color-secondary))"
                        fillOpacity={0.28}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Daily scores strip */}
            <Card elevation="e2" bordered padded="lg" radius="xl">
              <div className="flex items-baseline justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-[hsl(var(--color-success))]" />
                  <Eyebrow>Per-Day Scores</Eyebrow>
                </div>
                <Meta>כל השיעורים שהושלמו</Meta>
              </div>
              <div className="h-[220px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyScoresData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--color-border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }} stroke="hsl(var(--color-text-faint))" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--color-text-faint))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--ink-900))', border: 'none', borderRadius: 8, color: 'white' }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {dailyScoresData.map((e, i) => (
                        <Cell key={i} fill={
                          e.score >= 90 ? 'hsl(var(--color-success))' :
                          e.score >= 70 ? 'hsl(var(--color-primary))' :
                          e.score >= 50 ? 'hsl(var(--color-accent))' :
                          'hsl(var(--color-error))'
                        } />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Motivational close — pull-quote ─── */}
      <div className="mt-16 pt-14 border-t border-[hsl(var(--color-border))]">
        <figure className="max-w-3xl mx-auto text-center">
          <span className="font-display text-[4rem] leading-none text-[hsl(var(--color-primary))]">“</span>
          <blockquote className="font-display text-[1.75rem] leading-[1.3] tracking-tight text-[hsl(var(--ink-900))] -mt-2">
            העתיד שייך למי שמתמיד. כבר השלמת ידע השווה ערך ל-
            <span className="italic text-[hsl(var(--color-primary))]"> {Math.ceil(completedDays.length * 1.5)} שעות</span>
            {' '}הרצאה באוניברסיטה.
          </blockquote>
          <figcaption className="mt-5">
            <Eyebrow>LUMINA × ELIAZ</Eyebrow>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
