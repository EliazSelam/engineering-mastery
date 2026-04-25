import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, ArrowLeft, X, Check, ChevronDown } from 'lucide-react';
import { Card } from '@/src/ui/Card';
import { H3, H4, Body, Meta, Eyebrow } from '@/src/ui/Typography';
import { Badge } from '@/src/ui/Badge';
import { cn } from '@/src/lib/utils';

interface SummaryPoint {
  text: string;
  tag?: string;
}

interface Misconception {
  myth: string;
  truth: string;
}

interface SummaryPanelProps {
  title: string;
  points: SummaryPoint[];
  misconceptions?: Misconception[];
  nextDayTitle?: string;
  nextDayDesc?: string;
  completedCount?: number;
  totalCount?: number;
}

// SVG progress ring
function ProgressRing({ value, size = 56, stroke = 4 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="hsl(var(--color-primary))"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}

export default function SummaryPanel({
  title,
  points,
  misconceptions = [],
  nextDayTitle,
  nextDayDesc,
  completedCount = 5,
  totalCount = 5,
}: SummaryPanelProps) {
  const pct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Completion Banner (ink) ──────────────────────────────── */}
      <Card tone="ink" elevation="e3" className="p-6">
        <div className="flex items-center gap-5">
          {/* Progress ring */}
          <div className="relative shrink-0">
            <ProgressRing value={pct} size={56} stroke={4} />
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold text-white">
              {pct}%
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <H3 className="text-white leading-tight mb-1 truncate">{title}</H3>
            <Meta className="text-white/50">
              {completedCount === totalCount
                ? '✓ השלמת את כל שלבי הלימוד'
                : `${completedCount} / ${totalCount} שלבים הושלמו`}
            </Meta>
          </div>

          {/* Check badge */}
          {completedCount === totalCount && (
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--color-success))] flex items-center justify-center"
            >
              <Check size={18} className="text-white" />
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="h-full bg-[hsl(var(--color-primary))] rounded-full"
          />
        </div>
      </Card>

      {/* ── Key Points + Misconceptions grid ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Key Points */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} className="text-[hsl(var(--color-success))] shrink-0" />
            <Eyebrow>נקודות מפתח</Eyebrow>
          </div>

          {points.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              <Card tone="surface" elevation="e1" className="px-4 py-3 flex flex-col gap-1.5">
                <Body className="text-[13px] leading-relaxed">{item.text}</Body>
                {item.tag && (
                  <Badge tone="neutral" size="sm" className="self-start font-mono uppercase tracking-wider">
                    {item.tag}
                  </Badge>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Misconceptions */}
        {misconceptions.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-[hsl(var(--color-error))] shrink-0" />
              <Eyebrow>טעויות נפוצות</Eyebrow>
            </div>

            {misconceptions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <Card
                  tone="surface"
                  elevation="e1"
                  className="px-4 py-3 border-r-2 border-r-[hsl(var(--color-error)/0.5)]"
                >
                  {/* Myth */}
                  <div className="flex items-start gap-2.5 mb-2">
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[hsl(var(--color-error)/0.1)] flex items-center justify-center">
                      <X size={9} className="text-[hsl(var(--color-error))]" />
                    </span>
                    <Meta className="text-[hsl(var(--color-error))] leading-snug line-through opacity-70">
                      {item.myth}
                    </Meta>
                  </div>
                  {/* Truth */}
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[hsl(var(--color-success)/0.12)] flex items-center justify-center">
                      <Check size={9} className="text-[hsl(var(--color-success))]" />
                    </span>
                    <Meta className="text-[hsl(var(--color-success))] leading-snug font-medium">
                      {item.truth}
                    </Meta>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bridge to Tomorrow ───────────────────────────────────── */}
      {nextDayTitle && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card tone="ink" elevation="e2" className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Left text */}
              <div className="flex-1 min-w-0">
                <Eyebrow className="text-white/40 mb-2">גשר למחר</Eyebrow>
                <Body className="text-white/80 text-[13px] leading-relaxed">
                  {nextDayDesc}
                </Body>
              </div>

              {/* Right pill */}
              <div className="shrink-0 rounded-[var(--radius-lg)] border border-[hsl(var(--color-primary)/0.35)] bg-[hsl(var(--color-primary)/0.08)] px-4 py-3 flex items-center gap-3">
                <div className="min-w-0">
                  <Meta className="text-white/40 mb-0.5">הנושא מחר</Meta>
                  <Body className="text-white font-semibold text-[13px] leading-snug">
                    {nextDayTitle}
                  </Body>
                </div>
                <ArrowLeft size={16} className="text-[hsl(var(--color-primary))] shrink-0" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Self-check accordion (internal, V2 styled) ─────────────────
export function SelfCheckItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card
      tone="surface"
      elevation="e1"
      className="overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-right hover:bg-[hsl(var(--color-surface-2))] transition-colors"
      >
        <Body className="font-medium text-[13px] flex-1 text-right">{q}</Body>
        <ChevronDown
          size={16}
          className={cn(
            "text-[hsl(var(--color-text-faint))] shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))]">
              <Body className="text-[13px] text-[hsl(var(--color-text-muted))] leading-relaxed">
                {a}
              </Body>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
