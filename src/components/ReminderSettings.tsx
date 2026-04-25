import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, Clock, Check, MessageCircle, Smartphone, Zap, Info } from 'lucide-react';
import { Section } from '@/src/ui/Section';
import { H2, Lead, Eyebrow, Body, Meta } from '@/src/ui/Typography';
import { Card } from '@/src/ui/Card';
import { Button } from '@/src/ui/Button';
import { Badge } from '@/src/ui/Badge';
import { cn } from '@/src/lib/utils';

export default function ReminderSettings() {
  const [enabled, setEnabled] = useState(true);
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('08:00');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serverTime, setServerTime] = useState(new Date());
  const [logs, setLogs] = useState<{ time: string; msg: string; type: 'success' | 'info' | 'error' }[]>([]);

  // Load saved settings
  useEffect(() => {
    const raw = localStorage.getItem('reminder_settings');
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.time) setTime(s.time);
        if (s.phone) setPhone(s.phone);
        if (typeof s.enabled === 'boolean') setEnabled(s.enabled);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    const timeStr = new Date().toLocaleTimeString('he-IL');
    setLogs(prev => [{ time: timeStr, msg, type }, ...prev].slice(0, 5));
  };

  const handleSave = () => {
    localStorage.setItem('reminder_settings', JSON.stringify({ enabled, phone, time }));
    setSaved(true);
    addLog(`הגדרות נשמרו — שעה ${time}`, 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  const sendTestMessage = () => {
    if (!phone || phone.length < 9) {
      addLog('מספר טלפון לא תקין', 'error');
      return;
    }
    setLoading(true);
    addLog('מכין הודעת WhatsApp...', 'info');
    setTimeout(() => {
      setLoading(false);
      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '972' + cleanPhone.substring(1);
      else if (!cleanPhone.startsWith('972')) cleanPhone = '972' + cleanPhone;
      const message = encodeURIComponent(`שלום! זו תזכורת מ-Engineer Daily. השיעור היומי שלך מוכן: ${window.location.origin}`);
      addLog(`פותח WhatsApp למספר ${cleanPhone}`, 'success');
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }, 900);
  };

  const istTime = serverTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const utcTime = serverTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });

  return (
    <Section max="md" className="rise-in">
      {/* Header */}
      <div className="mb-10">
        <Eyebrow className="mb-2">⏰ הגדרות</Eyebrow>
        <H2 className="mb-3">תזכורות ולמידה קבועה</H2>
        <Lead className="max-w-lg">
          קבע שעת לימוד יומית וקבל תזכורת ישירות ל-WhatsApp. קביעות היא המנוע מאחורי כל מיומנות.
        </Lead>
      </div>

      {/* Master toggle */}
      <Card tone="ink" elevation="e3" className="mb-6 p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-[var(--radius-lg)] transition-colors",
            enabled ? "bg-[hsl(var(--color-primary)/0.2)]" : "bg-white/10"
          )}>
            {enabled ? <Bell size={22} className="text-[hsl(var(--color-primary))]" /> : <BellOff size={22} className="text-white/40" />}
          </div>
          <div>
            <Body className="font-semibold text-white">{enabled ? 'תזכורות פעילות' : 'תזכורות כבויות'}</Body>
            <Meta className="text-white/50">{enabled ? `מוגדר לשעה ${time}` : 'לחץ כדי להפעיל'}</Meta>
          </div>
        </div>
        {/* Toggle switch */}
        <button
          onClick={() => setEnabled(!enabled)}
          aria-label="toggle reminders"
          className={cn(
            "relative flex h-8 w-16 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/40",
            enabled ? "bg-[hsl(var(--color-primary))]" : "bg-white/20"
          )}
        >
          <span className={cn(
            "absolute h-6 w-6 rounded-full bg-white shadow transition-transform duration-200",
            enabled ? "translate-x-9" : "translate-x-1"
          )} />
        </button>
      </Card>

      {/* Clock display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card tone="surface" elevation="e1" className="p-5">
          <Eyebrow className="mb-1">זמן ישראל</Eyebrow>
          <div className="font-mono text-2xl font-bold text-[hsl(var(--color-primary))] tracking-wider leading-none">
            {istTime}
          </div>
          <Meta className="mt-1 text-[hsl(var(--color-text-faint))]">IST / UTC+3</Meta>
        </Card>
        <Card tone="surface-2" elevation="e1" className="p-5">
          <Eyebrow className="mb-1">זמן UTC</Eyebrow>
          <div className="font-mono text-2xl font-bold tracking-wider leading-none text-[hsl(var(--color-text-muted))]">
            {utcTime}
          </div>
          <Meta className="mt-1 text-[hsl(var(--color-text-faint))]">Coordinated Universal Time</Meta>
        </Card>
      </div>

      {/* Settings fields */}
      <Card tone="surface" elevation="e2" className="mb-6">
        <div className={cn("p-6 flex flex-col gap-6 transition-opacity duration-200", !enabled && "opacity-40 pointer-events-none")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Time input */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[hsl(var(--color-text-faint))]">
                <Clock size={13} />
                שעת לימוד (ישראל)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))] font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.35)] transition-all"
              />
            </div>
            {/* Phone input */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[hsl(var(--color-text-faint))]">
                <Smartphone size={13} />
                מספר WhatsApp
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 pe-12 rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-2))] text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-[#25D366]/30 transition-all"
                />
                <MessageCircle size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-[#25D366]" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              className={cn("flex-1 transition-all", saved && "bg-[hsl(var(--color-success))] border-transparent")}
              onClick={handleSave}
              iconLeft={saved ? <Check size={18} /> : undefined}
            >
              {saved ? 'נשמר!' : 'שמור הגדרות'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
              onClick={sendTestMessage}
              disabled={loading}
              iconLeft={loading
                ? <span className="w-4 h-4 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                : <MessageCircle size={18} />
              }
            >
              {loading ? 'מכין...' : 'שלח ניסיון'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Activity log */}
      <Card tone="ink" elevation="e2" className="mb-6 p-5">
        <div className="flex items-center justify-between mb-3">
          <Eyebrow className="text-white/50">לוג פעולות</Eyebrow>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-success))] animate-pulse" />
            <Meta className="text-white/40">LIVE</Meta>
          </span>
        </div>
        <div className="font-mono text-[11px] space-y-1.5 min-h-[56px]">
          <AnimatePresence>
            {logs.length === 0 ? (
              <Meta className="text-white/25 italic">ממתין לפעולה...</Meta>
            ) : (
              logs.map((log, i) => (
                <motion.div
                  key={`${log.time}-${i}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    log.type === 'success' ? "text-[hsl(var(--color-success))]" :
                    log.type === 'error' ? "text-[hsl(var(--color-error))]" :
                    "text-white/50"
                  )}
                >
                  <span className="opacity-40 shrink-0">[{log.time}]</span>
                  <span>{log.msg}</span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Info card */}
      <Card tone="primary-soft" elevation="flat" className="p-5 border border-[hsl(var(--color-primary)/0.15)]">
        <div className="flex gap-3">
          <Info size={18} className="text-[hsl(var(--color-primary-ink))] mt-0.5 shrink-0" />
          <div>
            <Body className="font-semibold text-[hsl(var(--color-primary-ink))] mb-2">איך זה עובד?</Body>
            <ul className="text-[13px] text-[hsl(var(--color-primary-ink)/0.8)] space-y-1.5">
              <li>• <strong>התראה בממשק:</strong> כשהאתר פתוח, תקבל pop-up בשעה שקבעת.</li>
              <li>• <strong>WhatsApp:</strong> שלח הודעת ניסיון כדי לוודא שהמספר תקין.</li>
              <li>• <strong>PWA:</strong> להתראות ברקע — הוסף לDמסך הבית דרך כפתור השיתוף.</li>
            </ul>
          </div>
        </div>
      </Card>
    </Section>
  );
}
