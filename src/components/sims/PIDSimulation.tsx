import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

export default function PIDSimulation() {
  const DEFAULT_VALUES = {
    target: 100,
    kp: 0.5,
    ki: 0.01,
    kd: 0.1
  };

  const [target, setTarget] = useState(DEFAULT_VALUES.target);
  const [current, setCurrent] = useState(0);
  const [kp, setKp] = useState(DEFAULT_VALUES.kp);
  const [ki, setKi] = useState(DEFAULT_VALUES.ki);
  const [kd, setKd] = useState(DEFAULT_VALUES.kd);
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  
  const errorSum = useRef(0);
  const lastError = useRef(0);

  const reset = () => {
    setCurrent(0);
    setHistory([]);
    errorSum.current = 0;
    lastError.current = 0;
    setIsActive(false);
    setKp(DEFAULT_VALUES.kp);
    setKi(DEFAULT_VALUES.ki);
    setKd(DEFAULT_VALUES.kd);
    setTarget(DEFAULT_VALUES.target);
  };

  const getTakeaway = () => {
    if (kp > 1.2) return "⚠️ Kp גבוה מדי: המערכת מגיבה באגרסיביות ויוצרת תנודות (Overshoot) חזקות.";
    if (ki > 0.05) return "⚠️ Ki גבוה: השגיאה מתבטלת מהר, אך יש סכנה ל-Windup ותנודות איטיות.";
    if (kd > 0.5) return "✅ Kd גבוה: המערכת 'מרגישה' את המהירות ובולמת את התנודות לפני היעד.";
    if (kp < 0.3 && ki < 0.005) return "ℹ️ הבקר חלש מדי: המערכת איטית מאוד ולא מצליחה להגיע ליעד בזמן.";
    return "💡 בקר מאוזן: נסה לשלב Kd כדי למנוע את הקפיצה מעל הקו המקווקו.";
  };

  const DT = 0.03;   // seconds per step
  const TAU = 0.5;   // motor time constant
  const K_M = 1.0;   // motor gain

  useEffect(() => {
    if (!isActive) return;

    let rafId: number;
    let last = performance.now();

    const step = (now: number) => {
      const elapsed = (now - last) / 1000;
      last = now;

      setCurrent(prevY => {
        const error = target - prevY;
        errorSum.current += error * DT;
        // Anti-windup
        errorSum.current = Math.max(-1000, Math.min(1000, errorSum.current));
        
        const dError = (error - lastError.current) / DT;
        lastError.current = error;

        const u = kp * error + ki * errorSum.current + kd * dError;
        // First-order plant: tau*y' + y = K_m*u
        const dy = (DT / TAU) * (K_M * u - prevY);
        const nextY = prevY + dy;

        setHistory(h => [...h, nextY].slice(-100));
        return nextY;
      });

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, target, kp, ki, kd]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white">
          <Activity size={20} className="text-blue-400" />
          סימולטור בקר PID (Position Control)
        </h3>
        <p className="text-sm text-slate-400">
          חקרו איך פרמטרי ה-PID משפיעים על שליטה במיקום של מנוע DC. שימו לב להבדל בין מהירות ליציבות.
        </p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 font-sans">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">בקרה</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-red-500/20 text-red-500' : 'bg-blue-600 text-white shadow-md'}`}
                  title={isActive ? "עצור" : "הפעל"}
                >
                  {isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button 
                  onClick={reset}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-400"
                  title="איפוס"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 flex justify-between">
                  Kp (פרופורציונלי)
                  <span className="font-mono text-blue-400">{kp}</span>
                </label>
                <input 
                  type="range" min="0" max="2" step="0.1" 
                  value={kp} onChange={(e) => setKp(parseFloat(e.target.value))}
                  className="accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 flex justify-between">
                  Ki (אינטגרלי)
                  <span className="font-mono text-emerald-400">{ki}</span>
                </label>
                <input 
                  type="range" min="0" max="0.1" step="0.001" 
                  value={ki} onChange={(e) => setKi(parseFloat(e.target.value))}
                  className="accent-emerald-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 flex justify-between">
                  Kd (דיפרנציאלי)
                  <span className="font-mono text-amber-400">{kd}</span>
                </label>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={kd} onChange={(e) => setKd(parseFloat(e.target.value))}
                  className="accent-amber-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
            {/* Target Line */}
            <div 
              className="absolute w-full border-t border-dashed border-red-500/50 z-10"
              style={{ bottom: `${target / 2}%` }}
            >
              <span className="absolute right-4 -top-5 text-[8px] font-black text-red-500 uppercase tracking-widest bg-slate-950/80 px-1 rounded">SETPOINT</span>
            </div>

            {/* Graph */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={history.map((val, i) => `${(i / 100) * 100}%,${100 - (val / 2)}%`).join(' ')}
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            </svg>

            {/* Current Value Indicator */}
            <div 
              className="absolute right-4 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-100 z-20"
              style={{ bottom: `${current / 2}%`, transform: 'translateY(50%)' }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              מיקום נוכחי: {current.toFixed(1)}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              שגיאה: {(target - current).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
