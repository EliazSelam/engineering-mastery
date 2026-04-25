import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check, Linkedin, ExternalLink } from 'lucide-react';
import { Button } from '@/src/ui/Button';
import { cn } from '@/src/lib/utils';

interface ShareCardProps {
  dayNumber: number;
  dayTitle: string;
  streak: number;
  onClose: () => void;
}

export default function ShareCard({ dayNumber, dayTitle, streak, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `השלמתי יום ${dayNumber}/30 באתגר הנדסת 30 הימים! 🎯\n📚 "${dayTitle}"\n🔥 רצף: ${streak} ימים\n\nבנה גם אתה אפליקציית לימוד הנדסה אישית בחינם:\n👤 Eliaz Selam | #30DayEngineeringChallenge #ControlSystems #DSP`;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `יום ${dayNumber}/30 — Engineering Mastery Challenge`,
          text: shareText,
          url: shareUrl,
        });
      } catch (_) {
        // user cancelled — no-op
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
        exit={{ scale: 0.9, y: 20, opacity: 0, transition: { duration: 0.18 } }}
        className="w-full max-w-md"
      >
        {/* ── The shareable card ─────────────────────────────────── */}
        <div
          id="share-card-visual"
          className="rounded-[20px] overflow-hidden bg-[hsl(var(--ink-950))] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
        >
          {/* Top accent bar — blue → cyan → blue */}
          <div className="h-1 bg-gradient-to-r from-[hsl(var(--color-primary))] via-[hsl(var(--color-secondary))] to-[hsl(var(--color-primary))]" />

          {/* Card content */}
          <div className="p-7 text-right" dir="rtl">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <button
                onClick={onClose}
                className="text-white/30 hover:text-white/70 transition-colors mt-0.5"
                aria-label="סגור"
              >
                <X size={18} />
              </button>
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[hsl(var(--color-primary))] mb-1">
                  30-Day Engineering Challenge
                </p>
                <p className="text-white/40 text-[12px]">by Eliaz Selam</p>
              </div>
            </div>

            {/* Day big number */}
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="font-display text-[5rem] leading-[0.85] font-semibold tabular-nums text-white"
                style={{ textShadow: '0 0 40px rgba(37,99,235,0.5)' }}
              >
                {String(dayNumber).padStart(2, '0')}
              </span>
              <span className="text-2xl text-white/40 font-light">/30</span>
            </div>

            {/* Title */}
            <h3 className="text-[15px] font-semibold text-white leading-snug mb-4">
              {dayTitle}
            </h3>

            {/* Stats row */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                {/* flame stays energy-orange — it IS fire */}
                <span className="text-[hsl(var(--color-energy))] text-lg">🔥</span>
                <span className="text-white font-bold tabular-nums">{streak}</span>
                <span className="text-white/40 text-xs">ימים רצוף</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex-1">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] rounded-full transition-all"
                    style={{ width: `${Math.round((dayNumber / 30) * 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-white/50 text-[11px] font-mono tabular-nums">
                {Math.round((dayNumber / 30) * 100)}%
              </span>
            </div>

            {/* Hashtags */}
            <div className="mt-4 flex flex-wrap gap-1.5 justify-end">
              {['#30DayChallenge', '#ControlSystems', '#DSP', '#EngineeringMastery'].map(tag => (
                <span key={tag} className="text-[10px] text-[hsl(var(--color-primary)/0.7)] font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Action footer ─────────────────────────────────────── */}
          <div className="px-7 pb-7 flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleNativeShare}
              className="w-full gap-2 justify-center"
              iconRight={<Share2 size={16} />}
            >
              שתף את ההתקדמות שלי
            </Button>
            <p className="text-center text-[10px] text-white/30 mt-1">
              תייג את @Eliaz Selam ב-LinkedIn כדי שנדע שסיימת 🎯
            </p>

            <div className="grid grid-cols-3 gap-2">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className={cn(
                  'flex items-center justify-center gap-1.5 h-10 rounded-[var(--radius-md)] text-[12px] font-semibold transition-all border',
                  copied
                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                )}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'הועתק!' : 'העתק'}
              </button>

              {/* LinkedIn */}
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 h-10 rounded-[var(--radius-md)] text-[12px] font-semibold bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/30 transition-all"
              >
                <Linkedin size={13} />
                LinkedIn
              </a>

              {/* Twitter/X */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 h-10 rounded-[var(--radius-md)] text-[12px] font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <ExternalLink size={13} />
                X / Twitter
              </a>
            </div>

            {/* LinkedIn Post Template */}
            <details className="mt-3">
              <summary className="text-[11px] text-white/40 cursor-pointer hover:text-white/70 transition-colors select-none">
                📝 העתק פוסט מוכן ל-LinkedIn ▾
              </summary>
              <div className="mt-2 p-3 rounded-[var(--radius-md)] bg-white/5 border border-white/10 text-[11px] text-white/60 leading-relaxed font-mono whitespace-pre-wrap">
                {`השלמתי יום ${dayNumber}/30 באתגר הנדסת 30 הימים 🎯

📚 "${dayTitle}"

${dayNumber === 30 ? '🏆 השלמתי את האתגר המלא!' : `🔥 ${30 - dayNumber} ימים נוספים לסיום`}

אתגר חינמי שמלמד הנדסת בקרה, עיבוד אותות ואלגוריתמים — 30 דקות ביום.
בנה גם אתה: github.com/eliazselam

cc @Eliaz Selam
#30DayChallenge #ControlSystems #DSP #ElectricalEngineering`}
              </div>
            </details>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
