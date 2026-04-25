import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Settings, X, Check } from 'lucide-react';

export default function StudyTimer({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      playCompletionSound();
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft]);

  const playCompletionSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch { /* silent */ }
  };

  const pct = timeLeft / (customMinutes * 60);
  const isWarning = timeLeft <= 5 * 60;
  const isDone = timeLeft === 0;
  const timerColor = isDone
    ? 'text-[hsl(var(--color-success))]'
    : isWarning
    ? 'text-[hsl(var(--color-error))]'
    : 'text-[hsl(var(--color-text))]';

  const toggleTimer = () => setIsActive((v) => !v);
  const resetTimer = () => { setIsActive(false); setTimeLeft(customMinutes * 60); };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const formatClock = (d: Date) =>
    d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ── Minimal variant — lives in TopNav ──────────────────────────
  if (variant === 'minimal') {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 h-8 px-3 rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))]">
          {/* clock + timer stack */}
          <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] font-mono text-[hsl(var(--color-text-faint))] tabular-nums">
              {formatClock(currentTime)}
            </span>
            <span className={cn('text-[13px] font-mono font-black tabular-nums', timerColor)}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* divider */}
          <div className="w-px h-5 bg-[hsl(var(--color-border))]" />

          {/* play/pause */}
          <button
            onClick={toggleTimer}
            aria-label={isActive ? 'עצור' : 'הפעל'}
            className={cn(
              'p-1 rounded-[var(--radius-sm)] transition-colors',
              isActive
                ? 'text-[hsl(var(--color-error))] hover:bg-[hsl(var(--color-error)/0.08)]'
                : 'text-[hsl(var(--color-success))] hover:bg-[hsl(var(--color-success)/0.08)]'
            )}
          >
            {isActive ? <Pause size={13} /> : <Play size={13} />}
          </button>

          {/* settings */}
          <button
            onClick={() => setIsSettingsOpen((v) => !v)}
            aria-label="הגדרות טיימר"
            className="p-1 rounded-[var(--radius-sm)] text-[hsl(var(--color-text-faint))] hover:text-[hsl(var(--color-text-muted))] transition-colors"
          >
            <Settings size={12} />
          </button>
        </div>

        {/* Settings popover */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 w-48 z-50 rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] shadow-[var(--shadow-e3)] p-3"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--color-text-faint))]">
                  זמן למידה (דק׳)
                </span>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-[hsl(var(--color-text-faint))] hover:text-[hsl(var(--color-text-muted))]"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customMinutes}
                  min={1} max={120}
                  onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 30)}
                  className="flex-1 px-2.5 py-1.5 rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))] font-mono text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.3)]"
                />
                <button
                  onClick={() => { setTimeLeft(customMinutes * 60); setIsActive(false); setIsSettingsOpen(false); }}
                  className="p-1.5 rounded-[var(--radius-md)] bg-[hsl(var(--color-primary))] text-white hover:bg-[hsl(var(--color-primary-hover))] transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Default (full) variant ─────────────────────────────────────
  const circumference = 2 * Math.PI * 22;

  return (
    <div className="relative rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] shadow-[var(--shadow-e2)] p-4 flex items-center gap-4">
      {/* Arc ring */}
      <div className="relative shrink-0 w-14 h-14">
        <svg width="56" height="56" className="-rotate-90">
          <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--color-border))" strokeWidth="3" />
          <circle
            cx="28" cy="28" r="22" fill="none"
            stroke={isWarning ? 'hsl(var(--color-error))' : 'hsl(var(--color-primary))'}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <TimerIcon size={16} className="text-[hsl(var(--color-text-faint))]" />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--color-text-faint))] mb-0.5">
          טיימר למידה
        </div>
        <div className={cn('text-xl font-mono font-black tabular-nums transition-colors', timerColor)}>
          {formatTime(timeLeft)}
        </div>
        <div className="text-[10px] font-mono text-[hsl(var(--color-text-faint))] mt-0.5">
          {formatClock(currentTime)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={toggleTimer}
          aria-label={isActive ? 'עצור' : 'הפעל'}
          className={cn(
            'p-2 rounded-[var(--radius-md)] transition-colors',
            isActive
              ? 'bg-[hsl(var(--color-error)/0.08)] text-[hsl(var(--color-error))]'
              : 'bg-[hsl(var(--color-success)/0.1)] text-[hsl(var(--color-success))]'
          )}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
          onClick={resetTimer}
          aria-label="אפס"
          className="p-2 rounded-[var(--radius-md)] bg-[hsl(var(--color-surface-2))] text-[hsl(var(--color-text-muted))] hover:bg-[hsl(var(--color-border))] transition-colors"
        >
          <RotateCcw size={16} />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen((v) => !v)}
            aria-label="הגדרות"
            className="p-2 rounded-[var(--radius-md)] bg-[hsl(var(--color-surface-2))] text-[hsl(var(--color-text-muted))] hover:bg-[hsl(var(--color-border))] transition-colors"
          >
            <Settings size={16} />
          </button>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 w-52 z-50 rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] shadow-[var(--shadow-e4)] p-3"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--color-text-faint))]">
                    זמן למידה (דק׳)
                  </span>
                  <button onClick={() => setIsSettingsOpen(false)}>
                    <X size={13} className="text-[hsl(var(--color-text-faint))]" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customMinutes}
                    min={1} max={120}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 30)}
                    className="flex-1 px-3 py-2 rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))] font-mono text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.3)]"
                  />
                  <button
                    onClick={() => { setTimeLeft(customMinutes * 60); setIsActive(false); setIsSettingsOpen(false); }}
                    className="px-3 py-2 rounded-[var(--radius-md)] bg-[hsl(var(--color-primary))] text-white text-sm font-bold hover:bg-[hsl(var(--color-primary-hover))] transition-colors"
                  >
                    קבע
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
