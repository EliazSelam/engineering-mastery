import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ArrowLeft,
  Zap,
  Brain,
  Cpu,
  BarChart2,
  PlayCircle,
  CheckCircle2,
  Layers,
  Target,
  Users,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/src/ui/Button';
import { cn } from '@/src/lib/utils';

interface OnboardingProps {
  onComplete: (role: string) => void;
}

/* ───────────────────────────────────────────────
   DATA
─────────────────────────────────────────────── */
const ROLES = [
  {
    id: 'pm',
    icon: '🎯',
    title: 'Product Manager',
    description: 'תבין למה המפתחים דוחים features ותדבר שפת המהנדסים בישיבה הבאה',
  },
  {
    id: 'dev',
    icon: '💻',
    title: 'Developer / Frontend',
    description: 'תוסיף שכבת עומק — לדעת מה קורה ב-backend החומרתי ו-embedded',
  },
  {
    id: 'ux',
    icon: '🎨',
    title: 'UX / Designer',
    description: 'תעצב ממשקים למערכות מורכבות עם הבנה של הלוגיקה שמאחוריהן',
  },
  {
    id: 'curious',
    icon: '🔍',
    title: 'Curious Mind',
    description: 'רוצה להבין איך הטכנולוגיה באמת עובדת — ממנועים ועד אלגוריתמים',
  },
];

const WHY_CARDS = [
  {
    icon: '🚗',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20',
    question: 'איך Waze מחשב מסלול תוך שניות ומתאים את עצמו בזמן אמת?',
    answer: 'בקרת מצב + אלגוריתמי אופטימיזציה',
    topic: 'Control Systems',
  },
  {
    icon: '🎵',
    color: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/20',
    question: 'למה AirPods מסוגלים לבטל רעש ולשמר את הקול שלך בדיוק?',
    answer: 'עיבוד אותות דיגיטלי + פילטרים אדפטיביים',
    topic: 'DSP & Signal Processing',
  },
  {
    icon: '⚡',
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20',
    question: 'איך Tesla Model S מאיצה 0-100 ב-2.9 שניות ועדיין יציבה?',
    answer: 'כוונון PID + שליטה בספין של המנוע',
    topic: 'Motor Drive & Robotics',
  },
];

const HOW_LAYERS = [
  {
    num: '01',
    icon: <Lightbulb size={16} />,
    label: 'הקשר',
    time: '2 דק׳',
    description: 'הסיפור הגדול — למה זה קיים ומה הבעיה שהוא פותר',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    num: '02',
    icon: <Brain size={16} />,
    label: 'תיאוריה',
    time: '5 דק׳',
    description: 'הרעיון המרכזי — הסברים ויזואליים, בלי להיכנס לנוסחאות',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    num: '03',
    icon: <PlayCircle size={16} />,
    label: 'סימולציה',
    time: '10 דק׳',
    description: 'משחק אינטראקטיבי — מסובבים ידיות, רואים מה קורה',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    num: '04',
    icon: <Target size={16} />,
    label: 'אתגר',
    time: '8 דק׳',
    description: '3 שאלות שבודקות שהאינטואיציה נקלטה — לא שינון',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    num: '05',
    icon: <CheckCircle2 size={16} />,
    label: 'סיכום',
    time: '5 דק׳',
    description: 'מה ניקח הלאה — כרטיס ידע לשיתוף + הקדמה ליום הבא',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
];

/* ───────────────────────────────────────────────
   STEP COMPONENTS
─────────────────────────────────────────────── */

function StepWelcome() {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[11px] font-bold tracking-[0.14em] uppercase">
        <Zap size={11} />
        30 ימים · 30 דקות ביום · 0 דוקטורט נדרש
      </div>

      {/* Headline */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
          הנדסה לא הייתה{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-400">
            בשבילך?
          </span>
        </h1>
        <p className="text-lg text-white/55 max-w-md leading-relaxed">
          אנחנו הולכים לשנות את זה. תוך 30 יום תבין את הרעיונות ההנדסיים שמניעים
          כל מוצר טכנולוגי — בלשון אנושית.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6">
        {[
          { n: '30', label: 'שיעורים' },
          { n: '36+', label: 'סימולציות' },
          { n: '90+', label: 'שאלות' },
        ].map(({ n, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold text-white tabular-nums">{n}</p>
            <p className="text-[11px] text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepWhy() {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="text-center mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          למה זה רלוונטי{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-400">
            לך?
          </span>
        </h2>
        <p className="text-[14px] text-white/50">
          כל השאלות האלה — יש להן תשובה הנדסית. ותוך 30 יום תדע אותה.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {WHY_CARDS.map((card) => (
          <div
            key={card.topic}
            className={cn(
              'rounded-[14px] p-4 border bg-gradient-to-br',
              card.color,
              card.border
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 shrink-0">{card.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white/70 leading-snug mb-1.5">
                  {card.question}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-white/90">{card.answer}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 font-mono">
                    {card.topic}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepHow() {
  return (
    <div className="flex flex-col gap-5 py-2">
      <div className="text-center mb-1">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          כל שיעור בנוי{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-400">
            5 שכבות
          </span>
        </h2>
        <p className="text-[14px] text-white/50">
          30 דקות מובנות — מהבנה לפעולה
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {HOW_LAYERS.map((layer, i) => (
          <motion.div
            key={layer.num}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-[12px] bg-white/[0.04] border border-white/[0.06]"
          >
            <div className={cn('p-2 rounded-[8px] shrink-0', layer.bg)}>
              <span className={layer.color}>{layer.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] font-bold text-white">{layer.label}</span>
                <span className="text-[10px] text-white/35 font-mono">{layer.time}</span>
              </div>
              <p className="text-[11px] text-white/50 leading-snug">{layer.description}</p>
            </div>
            <span className="text-[10px] font-mono text-white/20 shrink-0">{layer.num}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StepRole({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-5 py-2">
      <div className="text-center mb-1">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          מי אתה{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-400">
            בחיים?
          </span>
        </h2>
        <p className="text-[14px] text-white/50">
          נתאים את הדגשים לפי הפרספקטיבה שלך
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={cn(
              'flex flex-col items-start gap-2 p-4 rounded-[14px] border text-right transition-all duration-200',
              selected === role.id
                ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
            )}
          >
            <span className="text-2xl">{role.icon}</span>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight mb-1">{role.title}</p>
              <p className="text-[11px] text-white/45 leading-snug">{role.description}</p>
            </div>
            {selected === role.id && (
              <CheckCircle2 size={14} className="text-blue-400 self-end mt-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────── */

const STEPS = [
  { id: 'welcome', label: 'ברוך הבא' },
  { id: 'why',     label: 'למה זה?' },
  { id: 'how',     label: 'איך עובד?' },
  { id: 'role',    label: 'מי אתה?' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('curious');
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      onComplete(role);
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const stepContent = [
    <StepWelcome key="welcome" />,
    <StepWhy key="why" />,
    <StepHow key="how" />,
    <StepRole key="role" selected={role} onSelect={setRole} />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-[400] flex flex-col bg-[hsl(var(--ink-950))]"
      dir="rtl"
    >
      {/* ── Top accent ─────────────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

      {/* ── Step dots ─────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2 shrink-0">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => i < step && setStep(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === step
                ? 'w-6 h-2 bg-blue-400'
                : i < step
                ? 'w-2 h-2 bg-white/40 hover:bg-white/60'
                : 'w-2 h-2 bg-white/15'
            )}
            aria-label={s.label}
          />
        ))}
      </div>

      {/* ── Scrollable content ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom actions ────────────────────────────────── */}
      <div className="shrink-0 px-6 pb-8 pt-4 max-w-lg mx-auto w-full flex items-center gap-3">
        {/* Back */}
        {step > 0 ? (
          <button
            onClick={back}
            className="flex items-center justify-center w-11 h-11 rounded-[var(--radius-md)] bg-white/[0.06] border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all shrink-0"
            aria-label="חזור"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div className="w-11 shrink-0" />
        )}

        {/* Main CTA */}
        <button
          onClick={next}
          className="flex-1 h-12 flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-white font-bold text-[15px] shadow-[0_4px_24px_rgba(37,99,235,0.4)]"
        >
          {isLast ? (
            <>
              <Zap size={16} className="text-white" />
              בוא נתחיל — יום 1
            </>
          ) : (
            <>
              המשך
              <ChevronLeft size={16} />
            </>
          )}
        </button>
      </div>

      {/* ── Skip link ─────────────────────────────────────── */}
      {step === 0 && (
        <button
          onClick={() => onComplete(role)}
          className="absolute top-5 left-5 text-[11px] text-white/25 hover:text-white/50 transition-colors"
        >
          דלג
        </button>
      )}
    </motion.div>
  );
}
