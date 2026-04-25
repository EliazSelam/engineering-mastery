import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { CheckCircle2, ChevronLeft, HelpCircle, XCircle, Trophy } from 'lucide-react';
import { Card } from '@/src/ui/Card';
import { H3, H4, Body, Meta, Eyebrow } from '@/src/ui/Typography';
import { Button } from '@/src/ui/Button';
import { Badge } from '@/src/ui/Badge';

const QUESTIONS = [
  {
    id: 1,
    question: 'מה יקרה לשגיאת המצב המתמיד (SSE) אם נכפיל את Kp מ-0.5 ל-1.0?',
    options: [
      { id: 'a', text: 'השגיאה תגדל פי 2', correct: false },
      { id: 'b', text: 'השגיאה תקטן בערך פי 2', correct: true },
      { id: 'c', text: 'השגיאה תתאפס לגמרי', correct: false },
      { id: 'd', text: 'לא יהיה שינוי', correct: false },
    ],
    explanation: 'בבקר P, השגיאה ביחס ישר להפרעה וביחס הפוך לרווח (Kp). לכן, הגדלת Kp מקטינה את השגיאה.',
    formula: 'e_ss ≈ d / (Kp · G(0))',
  },
  {
    id: 2,
    question: 'מדוע לא כדאי להעלות את Kp לערך אינסופי כדי לאפס את השגיאה?',
    options: [
      { id: 'a', text: 'כי זה יצרוך יותר מדי חשמל', correct: false },
      { id: 'b', text: 'כי המנוע יסתובב הפוך', correct: false },
      { id: 'c', text: 'כי המערכת תהפוך ללא יציבה ותתחיל להתנדנד', correct: true },
      { id: 'd', text: 'אין בעיה להעלות Kp לאינסוף', correct: false },
    ],
    explanation:
      'במציאות יש תמיד עיכובים (Delays) ודינמיקה מסדר גבוה. Kp גבוה מדי דוחף את קטבי המערכת לחצי המישור הימני, מה שגורם לתנודות הולכות וגדלות.',
  },
  {
    id: 3,
    question: 'יש לך חיישן רועש מאוד (Noise). איזו מערכת תתמודד איתו טוב יותר?',
    options: [
      { id: 'a', text: 'לולאה סגורה עם רווח גבוה', correct: false },
      { id: 'b', text: 'לולאה פתוחה עם מודל מדויק', correct: true },
      { id: 'c', text: 'לולאה סגורה עם בקר P', correct: false },
      { id: 'd', text: 'אין הבדל', correct: false },
    ],
    explanation:
      'זהו Trade-off קלאסי. לולאה סגורה "רואה" את הרעש דרך החיישן ומגיבה אליו, מה שגורם לרעידות במנוע. אם המודל שלנו טוב, לולאה פתוחה תהיה שקטה יותר.',
  },
];

export default function PracticeChallenge({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'done'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelect = (id: string) => {
    if (showExplanation) return;
    setSelectedId(id);
    setShowExplanation(true);
    if (id === currentQ.options.find((o) => o.correct)?.id) {
      setScore((s) => s + 1);
    }
  };

  const nextStep = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedId(null);
      setShowExplanation(false);
    } else {
      setStep('done');
      onComplete();
    }
  };

  const scorePct = Math.round((score / QUESTIONS.length) * 100);

  return (
    <Card tone="surface" elevation="e2" className="min-h-[400px] flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── Intro ──────────────────────────────────────────── */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center justify-center flex-1 text-center gap-6 p-8"
          >
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--color-accent)/0.12)] flex items-center justify-center">
              <HelpCircle size={30} className="text-[hsl(var(--color-accent-ink))]" />
            </div>
            <div>
              <H3 className="mb-2">אתגר האינטואיציה</H3>
              <Body className="text-[hsl(var(--color-text-muted))] max-w-md">
                {QUESTIONS.length} שאלות שיבחנו אם באמת הבנת איך לולאת בקרה מתנהגת. בלי נוסחאות מסובכות — רק הבנה הנדסית.
              </Body>
            </div>
            <Button variant="primary" size="lg" onClick={() => setStep('quiz')}>
              בוא נתחיל
            </Button>
          </motion.div>
        )}

        {/* ── Quiz ───────────────────────────────────────────── */}
        {step === 'quiz' && (
          <motion.div
            key={`quiz-${currentIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 p-6"
          >
            {/* Progress header */}
            <div className="flex items-center justify-between mb-6">
              <Eyebrow>שאלה {currentIdx + 1} מתוך {QUESTIONS.length}</Eyebrow>
              <div className="flex gap-1.5">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      i < currentIdx
                        ? 'w-8 bg-[hsl(var(--color-success))]'
                        : i === currentIdx
                        ? 'w-8 bg-[hsl(var(--color-primary))]'
                        : 'w-8 bg-[hsl(var(--color-border))]'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <H4 className="mb-6 leading-snug">{currentQ.question}</H4>

            {/* Options */}
            <div className="flex flex-col gap-2.5 mb-6">
              {currentQ.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const isCorrect = opt.correct;
                const revealed = showExplanation;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={showExplanation}
                    className={cn(
                      'px-4 py-3.5 rounded-[var(--radius-lg)] border-2 text-right transition-all flex items-center justify-between gap-4',
                      !revealed && 'border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary)/0.5)] hover:bg-[hsl(var(--color-surface-2))]',
                      revealed && isCorrect && 'border-[hsl(var(--color-success))] bg-[hsl(var(--color-success)/0.07)]',
                      revealed && isSelected && !isCorrect && 'border-[hsl(var(--color-error))] bg-[hsl(var(--color-error)/0.06)]',
                      revealed && !isSelected && !isCorrect && 'border-[hsl(var(--color-border))] opacity-45'
                    )}
                  >
                    <Body className="font-medium text-[13px]">{opt.text}</Body>
                    {revealed && isCorrect && (
                      <CheckCircle2 size={18} className="text-[hsl(var(--color-success))] shrink-0" />
                    )}
                    {revealed && isSelected && !isCorrect && (
                      <XCircle size={18} className="text-[hsl(var(--color-error))] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5"
                >
                  <Card tone="surface-2" elevation="flat" className="p-4 border border-[hsl(var(--color-border))]">
                    <Body className="text-[13px] text-[hsl(var(--color-text-muted))] leading-relaxed">
                      {currentQ.explanation}
                    </Body>
                    {currentQ.formula && (
                      <div className="mt-2.5 font-mono text-[12px] text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.06)] px-3 py-1.5 rounded-[var(--radius-md)] inline-block">
                        {currentQ.formula}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next */}
            <div className="mt-auto flex justify-start">
              {showExplanation && (
                <Button variant="primary" size="md" onClick={nextStep} iconLeft={<ChevronLeft size={16} />}>
                  {currentIdx === QUESTIONS.length - 1 ? 'סיים אתגר' : 'לשאלה הבאה'}
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Done ───────────────────────────────────────────── */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center justify-center flex-1 text-center gap-6 p-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 18 }}
              className="w-20 h-20 rounded-full bg-[hsl(var(--color-success)/0.12)] flex items-center justify-center"
            >
              <Trophy size={36} className="text-[hsl(var(--color-success))]" />
            </motion.div>

            <div>
              <H3 className="mb-2">כל הכבוד!</H3>
              <Body className="text-[hsl(var(--color-text-muted))]">
                סיימת את אתגר האינטואיציה.
              </Body>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
              <Badge tone={score === QUESTIONS.length ? 'success' : score > 0 ? 'accent' : 'danger'} size="md">
                {score} / {QUESTIONS.length} נכונות
              </Badge>
              <Badge tone="neutral" size="md">
                {scorePct}%
              </Badge>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </Card>
  );
}
