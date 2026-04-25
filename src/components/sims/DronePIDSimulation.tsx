import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function DronePIDSimulation() {
  const DEFAULT = { wind: 0 };
  const [wind, setWind] = useState(DEFAULT.wind);
  const [data, setData] = useState<{ t: number; angle: number; setpoint: number }[]>([]);

  const reset = () => {
    setWind(DEFAULT.wind);
    setData([]);
  };

  const getTakeaway = () => {
    if (Math.abs(wind) > 3) return "🌪️ Turbulent: ברוח חזקה, הבקר מתאמץ מאוד לשמור על איזון. שים לב לשינויי הזווית המהירים בגרף.";
    if (wind === 0) return "✅ Calm Skies: ללא הפרעות חיצוניות, הרחפן מצליח לשמור על זווית 0 מעלות בדיוק (Hover).";
    return "💡 בקרת יציבות (Attitude Control) היא הלב של כל רחפן. היא מתקנת הפרעות חיצוניות אלפי פעמים בשנייה.";
  };

  useEffect(() => {
    let t = 0;
    let angle = 0;
    let integral = 0;
    let lastError = 0;

    const interval = setInterval(() => {
      const setpoint = 0;
      const error = setpoint - angle;
      integral += error;
      const derivative = error - lastError;
      
      const p = 0.5 * error;
      const i = 0.01 * integral;
      const d = 0.2 * derivative;
      
      const control = p + i + d;
      const physics = (Math.random() - 0.5) * 0.1 + wind * 0.5;
      
      angle += control + physics;
      lastError = error;

      setData(prev => [...prev.slice(-50), { t: t++, angle, setpoint }]);
    }, 100);
    return () => clearInterval(interval);
  }, [wind]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-5 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Drone Attitude Stability Simulator</h3>
          <div className="flex gap-4 items-center">
            <button 
              onClick={reset}
              className="px-3 py-1 rounded-lg bg-slate-700 text-[10px] font-bold hover:bg-slate-600 transition-colors"
            >
              RESET
            </button>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-slate-500 font-black tracking-tighter">Wind Gust Intensity: {wind}</span>
              <input 
                type="range" min={-5} max={5} step={1} 
                value={wind} onChange={(e) => setWind(parseInt(e.target.value))}
                className="accent-[#FF6B35] w-32"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 italic">Visualizing how a PID controller maintains drone balance under varying wind conditions.</p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 italic text-sm text-blue-400">
        {getTakeaway()}
      </div>

      <div className="relative h-48 bg-black/20 rounded-2xl border border-slate-800 overflow-hidden">
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-1 bg-slate-600 relative transition-transform duration-100" style={{ transform: `rotate(${(data[data.length-1]?.angle * 10 || 0)}deg)` }}>
               <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full border-2 border-slate-500 animate-spin" />
               <div className="absolute -right-4 -top-4 w-8 h-8 rounded-full border-2 border-slate-500 animate-spin" />
            </div>
         </div>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
               <YAxis domain={[-10, 10]} hide />
               <Line type="monotone" dataKey="angle" stroke="#FF6B35" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
         </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-slate-500 text-center font-mono uppercase">
        Status: {Math.abs(data[data.length-1]?.angle || 0) < 1 ? 'HOVERING' : 'STABILIZING...'}
      </p>
    </div>
  );
}
