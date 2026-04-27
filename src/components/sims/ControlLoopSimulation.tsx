import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

interface DataPoint { t: number; position: number; setpoint: number; }

export default function ControlLoopSimulation() {
  const DEFAULT = { Kp: 2, Ki: 0.1, Kd: 0.5 };
  const [Kp, setKp] = useState(DEFAULT.Kp);
  const [Ki, setKi] = useState(DEFAULT.Ki);
  const [Kd, setKd] = useState(DEFAULT.Kd);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);

  const stateRef = useRef({ pos: 0, vel: 0, integral: 0, prevError: 0, t: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SETPOINT = 1.0;
  const DT = 0.05;
  const MAX_POINTS = 80;

  const getTakeaway = () => {
    if (Kp > 6) return "⚠️ Kp גבוה: תגובה אגרסיבית — גרימה ל-overshoot חזק ותנודות מהירות.";
    if (Kd > 3) return "✅ Kd גבוה: בלימה חזקה — המערכת מתקרבת ליעד בחלקות ללא תנודות.";
    if (Ki > 1) return "⚠️ Ki גבוה: סיכון ל-windup — המערכת מתייצבת לאט עקב הצטברות שגיאה.";
    if (Kp < 0.5) return "ℹ️ Kp נמוך מדי: המערכת לא מגיעה ליעד בזמן סביר.";
    return "💡 PID מאוזן: שלב Kp לתגובה, Kd לבלימה, Ki לתיקון שגיאה קבועה.";
  };

  const step = useCallback(() => {
    const s = stateRef.current;
    const error = SETPOINT - s.pos;
    // Anti-windup: clamp integral to ±2 (prevents accumulation when error is persistent)
    s.integral = Math.max(-2, Math.min(2, s.integral + error * DT));
    const derivative = (error - s.prevError) / DT;
    const u = Kp * error + Ki * s.integral + Kd * derivative;
    s.prevError = error;
    // 2nd-order plant: m*x'' + c*x' = u  (m=1, c=1.5)
    const acc = u - 1.5 * s.vel;
    s.vel += acc * DT;
    s.pos += s.vel * DT;
    s.t += DT;
    setData(prev => {
      const next = [...prev, { t: parseFloat(s.t.toFixed(2)), position: parseFloat(s.pos.toFixed(3)), setpoint: SETPOINT }];
      return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
    });
  }, [Kp, Ki, Kd]);

  useEffect(() => {
    if (isRunning) { intervalRef.current = setInterval(step, 50); }
    else { if (intervalRef.current) clearInterval(intervalRef.current); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, step]);

  const handleDisturbance = () => { stateRef.current.vel += (Math.random() - 0.5) * 4; };
  const handleReset = () => { 
    setIsRunning(false); 
    stateRef.current = { pos: 0, vel: 0, integral: 0, prevError: 0, t: 0 }; 
    setData([]); 
    setKp(DEFAULT.Kp); 
    setKi(DEFAULT.Ki); 
    setKd(DEFAULT.Kd);
  };

  const SliderRow = ({ label, value, setter, min, max, step: s }: { label: string; value: number; setter: (v: number) => void; min: number; max: number; step: number }) => (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-400 w-6 text-right font-mono">{label}</span>
      <input type="range" min={min} max={max} step={s} value={value} onChange={e => setter(parseFloat(e.target.value))} className="flex-1 accent-[#FF6B35]" />
      <span className="text-xs font-mono text-[#FF6B35] w-10 text-right">{value.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-blue-400" />
          סימולציית מבוא לבקרת PID (PID Evolution)
        </h3>
        <p className="text-sm text-slate-400">
          חקרו איך חוגי משוב (Feedback loops) פועלים. שנו את פרמטרי ה-PID כדי לייצב מערכת דינמית מסדר שני (מסה-קפיץ-מרסן).
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setIsRunning(r => !r)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${isRunning ? 'bg-red-500 text-white' : 'bg-[#FF6B35] text-white'}`}>{isRunning ? '⏹ עצור' : '▶ הפעל'}</button>
        <button onClick={handleDisturbance} disabled={!isRunning} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#F7B801] text-slate-900 disabled:opacity-30">⚡ הפרעה</button>
        <button onClick={handleReset} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-700 text-white">↺ איפוס</button>
      </div>

      <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 italic text-sm text-[#FF6B35]">
        {getTakeaway()}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: '#64748b' }}
            label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis
            domain={[-0.5, 2.5]}
            tick={{ fontSize: 10, fill: '#64748b' }}
            label={{ value: 'Position', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
          />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="setpoint" stroke="#F7B801" strokeDasharray="4 4" dot={false} strokeWidth={1.5} name="Setpoint" isAnimationActive={false} />
          <Line type="monotone" dataKey="position" stroke="#FF6B35" dot={false} strokeWidth={2} name="Position" isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <SliderRow label="Kp" value={Kp} setter={setKp} min={0} max={10} step={0.1} />
        <SliderRow label="Ki" value={Ki} setter={setKi} min={0} max={2} step={0.05} />
        <SliderRow label="Kd" value={Kd} setter={setKd} min={0} max={5} step={0.1} />
      </div>
      <p className="text-[10px] text-slate-500 text-center">💡 Kp=2 Kd=0 → oscillations | Kp=2 Kd=2 → stable | Disturb → tests robustness</p>
    </div>
  );
}
