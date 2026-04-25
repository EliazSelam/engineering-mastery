import React from 'react';
import { Linkedin, Github, ExternalLink } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      dir="rtl"
      className={cn(
        'mt-24 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))]',
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">

          {/* ── Brand column ───────────────────────────────────── */}
          <div className="md:col-span-2">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--color-primary))] mb-2">
              Created by
            </p>
            <h3 className="font-display text-2xl font-semibold text-[hsl(var(--ink-900))] mb-2 tracking-tight">
              Eliaz Selam
            </h3>
            <p className="text-[13px] text-[hsl(var(--color-text-muted))] max-w-sm leading-relaxed">
              מהנדס חשמל — מתמחה בבקרה ועיבוד אותות. בנה את האפליקציה הזו כחלק מאתגר 30 ימי הנדסה אישי.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/eliaz-selam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-pill)] bg-[#0A66C2] text-white text-[12px] font-semibold hover:bg-[#004182] transition-colors"
              >
                <Linkedin size={13} />
                LinkedIn
              </a>
              <a
                href="https://github.com/eliazselam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-pill)] bg-[hsl(var(--ink-900))] text-white text-[12px] font-semibold hover:bg-[hsl(var(--ink-800))] transition-colors"
              >
                <Github size={13} />
                GitHub
              </a>
            </div>
          </div>

          {/* ── Challenge column ────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--color-text-faint))] mb-3">
              האתגר
            </p>
            <ul className="space-y-2">
              {[
                { label: '30 ימים · 30 שיעורים', href: null },
                { label: 'בקרה + DSP + אלגוריתמים', href: null },
                { label: 'סימולציות אינטראקטיביות', href: null },
                { label: 'בנה גם אתה →', href: 'https://github.com/eliazselam', external: true },
              ].map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-[hsl(var(--color-primary-ink))] font-semibold hover:underline flex items-center gap-1"
                    >
                      {item.label}
                      {item.external && <ExternalLink size={11} />}
                    </a>
                  </li>
                ) : (
                  <li key={item.label} className="text-[13px] text-[hsl(var(--color-text-muted))]">
                    {item.label}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-[hsl(var(--color-border))] flex items-center justify-between flex-wrap gap-3">
          <p className="text-[11px] text-[hsl(var(--color-text-faint))]">
            © {new Date().getFullYear()} Eliaz Selam · Engineering Mastery Challenge
          </p>
          <div className="flex items-center gap-3">
            {['#30DayChallenge', '#ControlSystems', '#DSP'].map(tag => (
              <span
                key={tag}
                className="text-[10px] font-mono text-[hsl(var(--color-text-faint))] hover:text-[hsl(var(--color-primary))] transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
