import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Route, Switch, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Analytics } from '@vercel/analytics/react';
import { useStudySystem } from './hooks/useStudySystem';
import Home from './components/Home';
import DayPage from './pages/DayPage';
import NotFound from './pages/NotFound';
import HistoryPage from './components/HistoryPage';
import MonthlyPlan from './components/MonthlyPlan';
import ReminderSettings from './components/ReminderSettings';
import FeedbackForm from './components/FeedbackForm';
import AnalyticsPage from './components/AnalyticsPage';
import { TopNav } from './ui/TopNav';
import { Section } from './ui/Section';
import { H1, Lead } from './ui/Typography';
import { Button } from './ui/Button';
import { Bell } from 'lucide-react';

// Page-level fade + slide transition
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as [number,number,number,number] } },
};

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [location, setLocation] = useLocation();
  const { progress, markDayComplete } = useStudySystem();
  const [showNotification, setShowNotification] = useState(false);
  const [lastTriggeredMinute, setLastTriggeredMinute] = useState<string | null>(null);

  const handleDayComplete = (dayId: number, score: number) => {
    markDayComplete(dayId, score);
    setLocation('/');
  };

  const streak     = progress.streak;
  const currentDay = Math.min(Math.max(1, ...progress.completedDays, 0) + 1, 30);

  // ── Reminder notification check ───────────────────────────────
  useEffect(() => {
    const checkReminder = () => {
      const raw = localStorage.getItem('reminder_settings');
      if (!raw) return;
      const settings = JSON.parse(raw);
      if (!settings.enabled) return;

      const now       = new Date();
      const currentIST = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false });
      const triggerKey = `${now.toDateString()}_${currentIST}`;

      if (currentIST === settings.time && lastTriggeredMinute !== triggerKey) {
        setLastTriggeredMinute(triggerKey);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 15000);
      }
    };

    const interval = setInterval(checkReminder, 10000);
    checkReminder();
    return () => clearInterval(interval);
  }, [lastTriggeredMinute]);

  // ── Breadcrumb ────────────────────────────────────────────────
  const breadcrumb = (() => {
    if (location.startsWith('/day/') || location === '/lesson') return `יום ${currentDay}`;
    if (location === '/plan')      return 'תוכנית חודשית';
    if (location === '/settings')  return 'הגדרות';
    if (location === '/feedback')  return 'משוב';
    if (location === '/history')   return 'היסטוריה';
    if (location === '/analytics') return 'התקדמות';
    return undefined;
  })();

  // Hide global nav on DayPage — LessonShell renders its own nav
  const hideGlobalNav = location.startsWith('/day/') || location === '/lesson';

  return (
    <div className="min-h-screen bg-[hsl(var(--color-bg))] text-[hsl(var(--color-text))] font-sans" dir="rtl">
      {!hideGlobalNav && (
        <TopNav streak={streak} currentDay={currentDay} breadcrumb={breadcrumb} />
      )}

      {/* ── Page routes with transitions ───────────────────────── */}
      <AnimatePresence mode="wait">
        <Switch key={location}>

          <Route path="/">
            <PageTransition>
              <Home
                onNavigate={(p) => setLocation(`/${p}`)}
                streak={streak}
                currentDay={currentDay}
                onAdvanceDay={() => handleDayComplete(currentDay, 1)}
              />
            </PageTransition>
          </Route>

          <Route path="/lesson">
            <PageTransition>
              <DayPage
                id={currentDay}
                onComplete={(score) => handleDayComplete(currentDay, score)}
                streak={streak}
                onPrevDay={currentDay > 1 ? () => setLocation(`/day/${currentDay - 1}`) : undefined}
                onNextDay={currentDay < 30 ? () => setLocation(`/day/${currentDay + 1}`) : undefined}
              />
            </PageTransition>
          </Route>

          <Route path="/day/:id">
            {(params: any) => {
              const id = params ? parseInt(params.id) : 1;
              return (
                <PageTransition>
                  <DayPage
                    id={id}
                    onComplete={(score) => handleDayComplete(id, score)}
                    streak={streak}
                    onPrevDay={id > 1 ? () => setLocation(`/day/${id - 1}`) : undefined}
                    onNextDay={id < 30 ? () => setLocation(`/day/${id + 1}`) : undefined}
                  />
                </PageTransition>
              );
            }}
          </Route>

          <Route path="/plan">
            <PageTransition>
              <Section>
                <PageHeader title="תוכנית חודשית" subtitle="30 ימי למידה — בקרה ו-DSP" />
                <MonthlyPlan currentDay={currentDay} onNavigateDay={(day) => setLocation(`/day/${day}`)} />
              </Section>
            </PageTransition>
          </Route>

          <Route path="/settings">
            <PageTransition>
              <Section max="lg">
                <PageHeader title="הגדרות ותזכורות" subtitle="ניהול התראות וזמני לימוד" />
                <ReminderSettings />
              </Section>
            </PageTransition>
          </Route>

          <Route path="/feedback">
            <PageTransition>
              <Section max="lg">
                <PageHeader title="משוב" subtitle="עזור לנו לשפר את החוויה" />
                <FeedbackForm />
              </Section>
            </PageTransition>
          </Route>

          <Route path="/history">
            <PageTransition>
              <Section>
                <PageHeader title="היסטוריית למידה" subtitle="כל הסיכומים שלך במקום אחד" />
                <HistoryPage currentDay={currentDay} onNavigateToDay={(day) => setLocation(`/day/${day}`)} />
              </Section>
            </PageTransition>
          </Route>

          <Route path="/analytics">
            <PageTransition>
              <AnalyticsPage />
            </PageTransition>
          </Route>

          {/* ── 404 ──────────────────────────────────────────── */}
          <Route>
            <PageTransition>
              <NotFound />
            </PageTransition>
          </Route>

        </Switch>
      </AnimatePresence>

      {/* ── Reminder toast notification ─────────────────────────── */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 inset-x-4 z-[200] max-w-md mx-auto"
          >
            <div className="bg-[hsl(var(--ink-900))] text-white p-5 rounded-[var(--radius-xl)] shadow-[var(--shadow-e5)] border border-white/10 flex items-center gap-4">
              <div className="p-2.5 bg-[hsl(var(--color-primary))] rounded-[var(--radius-md)] shrink-0 animate-bounce">
                <Bell size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base leading-tight">זמן ללמוד</p>
                <p className="text-[13px] opacity-70 mt-0.5">השיעור היומי שלך מחכה.</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => { setShowNotification(false); setLocation('/lesson'); }}
              >
                התחל
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}

// ── Shared page header ───────────────────────────────────────────
function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 rise-in">
      <H1 className="mb-2">{title}</H1>
      {subtitle && <Lead className="max-w-2xl">{subtitle}</Lead>}
    </div>
  );
}
