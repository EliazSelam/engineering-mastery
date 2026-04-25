import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ThumbsUp, ThumbsDown, Star, CheckCircle } from 'lucide-react';
import { Section } from '@/src/ui/Section';
import { H2, Lead, Eyebrow, Body, Meta } from '@/src/ui/Typography';
import { Card } from '@/src/ui/Card';
import { Button } from '@/src/ui/Button';
import { cn } from '@/src/lib/utils';

const RATING_LABELS = ['', 'גרוע', 'חלש', 'סביר', 'טוב', 'מצוין'];

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({ good: '', bad: '', rating: 0 });
  const [hovered, setHovered] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbacks = JSON.parse(localStorage.getItem('user_feedbacks') ?? '[]');
    feedbacks.push({ ...feedback, timestamp: Date.now() });
    localStorage.setItem('user_feedbacks', JSON.stringify(feedbacks));
    setSubmitted(true);
  };

  const canSubmit = feedback.good.trim() || feedback.bad.trim() || feedback.rating > 0;
  const displayRating = hovered || feedback.rating;

  if (submitted) {
    return (
      <Section max="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-[hsl(var(--color-success-soft))] flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-[hsl(var(--color-success))]" />
          </div>
          <H2 className="mb-3">תודה על המשוב!</H2>
          <Lead className="text-[hsl(var(--color-text-muted))]">
            התגובה שלך מגיעה ישירות ומעצבת את השיעורים הבאים.
          </Lead>
        </motion.div>
      </Section>
    );
  }

  return (
    <Section max="sm" className="rise-in">
      {/* Header */}
      <div className="mb-10">
        <Eyebrow className="mb-2">💬 משוב</Eyebrow>
        <H2 className="mb-3">עזור לנו להשתפר</H2>
        <Lead className="max-w-sm">
          כל הערה — גדולה או קטנה — עוזרת לבנות קורס טוב יותר.
        </Lead>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Star rating */}
        <Card tone="surface" elevation="e1" className="p-6">
          <Eyebrow className="mb-4">דירוג כולל</Eyebrow>
          <div className="flex items-center gap-2 justify-center" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFeedback(f => ({ ...f, rating: star }))}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                aria-label={`דירוג ${star}`}
              >
                <Star
                  size={32}
                  className={cn(
                    "transition-colors",
                    star <= displayRating
                      ? "fill-[hsl(var(--color-accent))] text-[hsl(var(--color-accent))]"
                      : "text-[hsl(var(--color-border))]"
                  )}
                />
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {displayRating > 0 && (
              <motion.div
                key={displayRating}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-3"
              >
                <Meta className="text-[hsl(var(--color-accent-ink))] font-semibold">
                  {RATING_LABELS[displayRating]}
                </Meta>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Good */}
        <Card tone="surface" elevation="e1" className="p-6">
          <label className="flex items-center gap-2 mb-3">
            <ThumbsUp size={16} className="text-[hsl(var(--color-success))]" />
            <Eyebrow>מה היה טוב?</Eyebrow>
          </label>
          <textarea
            value={feedback.good}
            onChange={(e) => setFeedback(f => ({ ...f, good: e.target.value }))}
            placeholder="הסימולציה הייתה ברורה, הדוגמה עזרה לי להבין..."
            rows={3}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))] text-[var(--text-sm)] outline-none resize-none focus:ring-2 focus:ring-[hsl(var(--color-success)/0.25)] transition-all placeholder:text-[hsl(var(--color-text-faint))]"
          />
        </Card>

        {/* Bad */}
        <Card tone="surface" elevation="e1" className="p-6">
          <label className="flex items-center gap-2 mb-3">
            <ThumbsDown size={16} className="text-[hsl(var(--color-error))]" />
            <Eyebrow>מה דורש שיפור?</Eyebrow>
          </label>
          <textarea
            value={feedback.bad}
            onChange={(e) => setFeedback(f => ({ ...f, bad: e.target.value }))}
            placeholder="ההסבר על פונקציית המעבר היה מהיר מדי..."
            rows={3}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))] text-[var(--text-sm)] outline-none resize-none focus:ring-2 focus:ring-[hsl(var(--color-error)/0.2)] transition-all placeholder:text-[hsl(var(--color-text-faint))]"
          />
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit}
          className="w-full"
          iconRight={<Send size={18} />}
        >
          שלח משוב
        </Button>

        <Meta className="text-center text-[hsl(var(--color-text-faint))]">
          המשוב נשמר מקומית ומסייע לשיפור הקורס.
        </Meta>
      </form>
    </Section>
  );
}
