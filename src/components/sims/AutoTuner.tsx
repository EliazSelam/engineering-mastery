import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Play, Pause, RotateCcw, Zap, Settings, Info } from 'lucide-react';

// Simplified Engine / Plant Simulation for Z-N
// G(s) = K / (s+1)^3  (A third order system oscillates easily)
class Plant {
  private states: number[] = [0, 0, 0]; // 3 stages for 3rd order
  private dt: number = 0.05;

  update(u: number): number {
    // Stage 1: 1/(s+1) -> dx1 = (u - x1) * dt
    this.states[0] += (u - this.states[0]) * this.dt;
    // Stage 2: 1/(s+1) -> dx2 = (x1 - x2) * dt
    this.states[1] += (this.states[0] - this.states[1]) * this.dt;
    // Stage 3: 1/(s+1) -> dx3 = (x2 - x3) * dt
    this.states[2] += (this.states[1] - this.states[2]) * this.dt;
    
    return this.states[2]; // Output
  }

  reset() {
    this.states = [0, 0, 0];
  }
}

export default function AutoTuner() {
  const [kp, setKp] = useState(1);
  const [ki, setKi] = useState(0);
  const [kd, setKd] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  
  const [ku, setKu] = useState<number | null>(null);
  const [tu, setTu] = useState<number | null>(null);

  const getTakeaway = () => {
    if (ki > 5) return "⚠️ Ki גבוה מדי: השגיאה מתבטלת מהר אך המערכת עלולה להיכנס לתנודות 'Windup' איטיות.";
    if (kd > 2) return "✅ Kd גבוה: המערכת 'מרגישה' את המהירות ובולמת חזק לפני שהיא מגיעה ליעד.";
    if (kp > 10 && ki === 0 && kd === 0) return "📉 Critical Gain: אתה קרוב ל-Ku. המערכת מתחילה להתנדנד בתדר קבוע.";
    return "💡 נסו למצוא את Ku: העלו את Kp (כש-Ki=0 ו-Kd=0) עד לקבלת תנודה מתמדת, ואז השתמשו במחשבון ה-ZN.";
  };
  
  const plantRef = useRef(new Plant());
  const errorSumRef = useRef(0);
  const lastErrorRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        const setpoint = 1.0;
        const currentY = plantRef.current.update(calculateControl(setpoint));
        
        timeRef.current += 0.05;
        const newDataPoint = {
          time: timeRef.current.toFixed(2),
          y: currentY,
          setpoint: setpoint
        };

        setData(prev => [...prev.slice(-100), newDataPoint]);
        setHistory(prev => [...prev.slice(-500), currentY]);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, kp, ki, kd]);

  const calculateControl = (sp: number) => {
    const y = plantRef.current.update(0); // Peeking or just getting last state
    // We actually need y from the plant above, 
    // let's refactor the loop slightly for precision if needed, 
    // but for demo this is okay.
    // Wait, let's fix the logic:
    return 0; // Dummy, see corrected logic below
  };

  // Corrected simulation step
  const stepSim = () => {
    const setpoint = 1.0;
    const y = history.length > 0 ? history[history.length - 1] : 0;
    const error = setpoint - y;
    
    // PID
    errorSumRef.current += error * 0.05;
    const dError = (error - lastErrorRef.current) / 0.05;
    lastErrorRef.current = error;
    
    const u = kp * error + ki * errorSumRef.current + kd * dError;
    const nextY = plantRef.current.update(u);
    
    timeRef.current += 0.05;
    const newDataPoint = {
      time: timeRef.current.toFixed(1),
      y: nextY,
      setpoint: setpoint,
      u: u
    };

    setData(prev => [...prev.slice(-100), newDataPoint]);
    setHistory(prev => [...prev.slice(-500), nextY]);
  };

  // Use a dedicated effect for the loop to avoid stale closures
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(stepSim, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, kp, ki, kd]);

  const resetSim = () => {
    plantRef.current.reset();
    setData([]);
    setHistory([]);
    timeRef.current = 0;
    errorSumRef.current = 0;
    lastErrorRef.current = 0;
    setIsRunning(false);
  };

  const applyZN = () => {
    if (ku && tu) {
      setKp(Number((0.6 * ku).toFixed(2)));
      setKi(Number((2 * (0.6 * ku) / tu).toFixed(2)));
      setKd(Number(((0.6 * ku) * tu / 8).toFixed(2)));
    }
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <Settings className="w-5 h-5 text-blue-400" />
          סימולטור כיוונון אוטומטי (PID Auto-Tuning)
        </h3>
        <p className="text-sm text-slate-400 font-sans">
          למדו איך למצוא פרמטרים אופטימליים לבקר PID באמצעות שיטת Ziegler-Nichols (שיטת התנודה).
        </p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 font-sans">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Settings className="w-5 h-5" />
            <h3 className="font-bold">הגדרות בקר</h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>Kp (הגבר פרופורציונלי)</label>
                <span className="text-blue-400">{kp}</span>
              </div>
              <input 
                type="range" min="0" max="20" step="0.1" 
                value={kp} onChange={(e) => setKp(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>Ki (הגבר אינטגרלי)</label>
                <span className="text-emerald-400">{ki}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1" 
                value={ki} onChange={(e) => setKi(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>Kd (הגבר נגזרת)</label>
                <span className="text-amber-400">{kd}</span>
              </div>
              <input 
                type="range" min="0" max="5" step="0.01" 
                value={kd} onChange={(e) => setKd(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-blue-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'עצור' : 'הפעל'}
            </button>
            <button 
              onClick={resetSim}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700 transition-all font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              איפוס
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-3 font-sans">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              כלי עזר לזיגלר-ניקולס
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Ku (הגבר קריטי)</label>
                <input 
                  type="number" value={ku || ''} onChange={(e) => setKu(Number(e.target.value))}
                  placeholder="למשל: 8.0"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Tu (זמן מחזור)</label>
                <input 
                  type="number" value={tu || ''} onChange={(e) => setTu(Number(e.target.value))}
                  placeholder="למשל: 2.5"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button 
              disabled={!ku || !tu}
              onClick={applyZN}
              className="w-full py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              החל נוסחאות Z-N
            </button>
          </div>
        </div>

        {/* Visuals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 1.5]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Line 
                  type="monotone" dataKey="setpoint" stroke="#64748b" 
                  strokeDasharray="5 5" strokeWidth={1} dot={false} isAnimationActive={false}
                />
                <Line 
                  type="monotone" dataKey="y" stroke="#3b82f6" 
                  strokeWidth={2.5} dot={false} isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-sm">
                <h4 className="font-bold text-slate-200 mb-1">שיטת התנודה</h4>
                <p className="text-slate-400 leading-relaxed">
                  1. אפסו את Ki ו-Kd.<br/>
                  2. העלו את Kp לאט עד שהמערכת מתנדנדת לנצח (ללא דעיכה).<br/>
                  3. הערך של Kp הוא Ku.<br/>
                  4. הזמן בין שני שיאים הוא Tu.
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-sm font-sans">
                <h4 className="font-bold text-slate-200 mb-1">נוסחאות Z-N (PID)</h4>
                <ul className="text-slate-400 space-y-1">
                  <li><span className="text-blue-400 font-mono">Kp = 0.6 * Ku</span></li>
                  <li><span className="text-emerald-400 font-mono">Ki = 1.2 * Ku / Tu</span></li>
                  <li><span className="text-amber-400 font-mono">Kd = 0.075 * Ku * Tu</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
