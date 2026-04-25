import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { Home, AlertCircle } from 'lucide-react';
import { Section } from '@/src/ui/Section';
import { H1, Lead, Meta } from '@/src/ui/Typography';
import { Button } from '@/src/ui/Button';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <Section max="sm" className="flex min-h-[calc(100vh-80px)] items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center w-full py-16"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[hsl(var(--color-error)/0.1)] flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={36} className="text-[hsl(var(--color-error))]" />
        </div>

        {/* Code */}
        <div className="font-mono text-7xl font-black text-[hsl(var(--color-border))] mb-4 select-none">
          404
        </div>

        {/* Text */}
        <H1 className="mb-3">הדף לא נמצא</H1>
        <Lead className="text-[hsl(var(--color-text-muted))] max-w-sm mx-auto mb-10">
          אופס! הדף שחיפשת לא קיים. אולי הוא עדיין בשלבי פיתוח, או שעבר למקום אחר.
        </Lead>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            iconLeft={<Home size={18} />}
            onClick={() => setLocation('/')}
          >
            חזרה לדף הבית
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.history.back()}
          >
            הדף הקודם
          </Button>
        </div>

        {/* Footer note */}
        <Meta className="mt-10 text-[hsl(var(--color-text-faint))]">
          Engineering Mastery · {new Date().getFullYear()}
        </Meta>
      </motion.div>
    </Section>
  );
}
