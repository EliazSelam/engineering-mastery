import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

interface DataPoint { t: number; position: number; target: number; }

export default function PIDSimulation() {
  const DEFAULT_VALUES = {
    target: 100,
    kp: 0.5,
    ki: 0.01,
    kd: 0.1
  };

  const [target, setTarget] = useState(DEFAULT_VALUES.target);
  const [kp, setKp] = useState(DEFAULT_VALUES.kp);
  const [ki, setKi] = useState(DEFAULT_VALUES.ki);
  const [kd, setKd] = useState(DEFAULT_VALUES.kd);
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);

  const stateRef = useRef({ y: 0, errorSum: 0, lastError: 0, t: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Plant: first-order motor, tau*y' + y = K_m * u
  const DT = 0.05;     // 50ms step
  const TAU = 0.5;     // motor time constant (s)
  const K_M = 1.0;     // motor gain (units / control unit)
  const MAX_POINTS = 120;
  const ANTI_WINDUP = 100; // integral clamp

  const reset = () => {
    setIsActive(false);
    stateRef.current = { y: 0, errorSum: 0, lastError: 0, t: 0 };
    setData([]);
    setKp(DEFAULT_VALUES.kp);
    setKi(DEFAULT_VALUES.ki);
    setKd(DEFAULT_VALUES.kd);
    setTarget(DEFAULT_VALUES.target);
  };

  const getTakeaway = () => {
    if (kp > 1.2) return "⚠️ Kp גבוה מדי: המערכת מגיבה באגרסיביות ויוצרת תנודות חזקות (overshoot).";
    if (ki > 0.05) return "⚠️ Ki גבוה: ביטול שגיאה מהיר אך סיכון ל-windup ותנודות איטיות.";
    if (kd > 0.5) return "✅ Kd גבוה: בלימה מצוינת — המערכת מתקרבת ליעד בחלקות ללא overshoot.";
    if (kp < 0.3 && ki < 0.005) return "ℹ️ הבקר חלש: המערכת איטית ולא מצליחה להגיע ליעד בזמן סביר.";
    return "💡 בקר מאוזן: שלב Kp לתגובה ראשונית + Kd לבלימת overshoot + Ki לאיפוס שגיאה.";
  };

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const s = stateRef.current;
      const error = target - s.y;

      // Anti-windup: clamp accumulated error
      s.errorSum = Math.max(-ANTI_WINDUP, Math.min(ANTI_WINDUP, s.errorSum + error * DT));
      const dError = (error - s.lastError) / DT;
      s.lastError = error;

      const u = kp * error + ki * s.errorSum + kd * dError;

      // First-order plant dynamics: y' = (K_m * u - y) / tau
      const dy = (DT / TAU) * (K_M * u - s.y);
      s.y = s.y + dy;
      s.t += DT;

      setData(prev => {
        const next = [...prev, {
          t: parseFloat(s.t.toFixed(2)),
          position: parseFloat(s.y.toFixed(2)),
          target: target,
        }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, target, kp, ki, kd]);

  const currentY = data.length > 0 ? data[data.length - 1].position : 0;
  const currentError = target - currentY;

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white">
          <Activity size={20} className="text-blue-400" />
          סימולטור בקר PID (Position Control)
        </h3>
        <p className="text-sm text-slate-400">
          חקרו איך פרמטרי PID משפיעים על שליטה במיקום של מנוע DC. מודל: τ·ẏ + y = K_m·u (τ=0.5s, K_m=1.0).
        </p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 font-sans">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">בקרה</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-red-500/20 text-red-500' : 'bg-blue-600 text-white shadow-md'}`}
                  title={isActive ? 'עצור' : 'הפעל'}
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

            {/* Target slider */}
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-700">
              <label className="text-[11px] font-bold text-slate-400 flex justify-between">
                Target (יעד)
                <span className="font-mono text-red-400">{target}</span>
              </label>
              <input
                type="range" min="20" max="180" step="5"
                value={target} onChange={(e) => setTarget(parseFloat(e.target.value))}
                className="accent-red-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* PID Gains */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 flex justify-between">
                  Kp (פרופורציונלי)
                  <span className="font-mono text-blue-400">{kp.toFixed(2)}</span>
                </label>
                <input
                  type="range" min="0" max="2" step="0.05"
                  value={kp} onChange={(e) => setKp(parseFloat(e.target.value))}
                  className="accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 flex justify-between">
                  Ki (אינטגרלי)
                  <span className="font-mono text-emerald-400">{ki.toFixed(3)}</span>
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
                  <span className="font-mono text-amber-400">{kd.toFixed(2)}</span>
                </label>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={kd} onChange={(e) => setKd(parseFloat(e.target.value))}
                  className="accent-amber-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Live status */}
            <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-3 text-[10px]">
              <div className="bg-slate-900 rounded-lg p-2">
                <div className="text-slate-500 uppercase tracking-widest">מיקום</div>
                <div className="font-mono text-blue-400 text-base font-bold">{currentY.toFixed(1)}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-2">
                <div className="text-slate-500 uppercase tracking-widest">שגיאה</div>
                <div className={`font-mono text-base font-bold ${Math.abs(currentError) < 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {currentError.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="t"
                tick={{ fontSize: 10, fill: '#64748b' }}
                label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                domain={[0, 200]}
                tick={{ fontSize: 10, fill: '#64748b' }}
                label={{ value: 'Position', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={target} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Target', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              <Line type="monotone" dataKey="position" stroke="#3b82f6" dot={false} strokeWidth={2.5} name="Position" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
