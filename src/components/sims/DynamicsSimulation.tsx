import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Zap, Weight, Activity, Info, RotateCcw, Pause, Play 
} from 'lucide-react';

export default function DynamicsSimulation() {
  const [gravityComp, setGravityComp] = useState(false);
  const [mass, setMass] = useState(1.0);
  const [theta, setTheta] = useState(0); // Angle from horizontal
  const [omega, setOmega] = useState(0); // Vel
  const [torque, setTorque] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const requestRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reset = () => {
    setIsRunning(false);
    setGravityComp(false);
    setMass(1.0);
    setTheta(0);
    setOmega(0);
    setTorque(0);
  };

  const getTakeaway = () => {
    if (!gravityComp && mass > 2.5) return "❌ Steady State Error: המסה כבדה מדי לבקר ה-PD הרגיל. הידית צונחת מטה.";
    if (gravityComp && mass > 2.5) return "✅ Gravity Comp: למרות המסה הכבדה, המודל המקדים מאפשר לידית להישאר אופקית!";
    if (!gravityComp) return "ℹ️ ללא פיצוי כבידה: המערכת סובלת משגיאה קבועה כי אין כוח שמקזז את המשקל.";
    return "💡 פיצוי כבידה פעיל: הבקר משתמש במודל הפיזיקלי כדי 'לנחש' את הכוח הדרוש.";
  };

  // Constants
  const L = 1.0;
  const g = 9.81;
  const dt = 0.02;

  const simulate = () => {
    // Desired position: 0 (horizontal)
    const setpoint = 0;
    const error = setpoint - theta;
    
    // PD Control
    const kp = 200;
    const kd = 40;
    let baseTorque = kp * error - kd * omega;

    // Gravity Compensation: Tau_g = m * g * L/2 * cos(theta)
    const gComp = gravityComp ? mass * g * (L/2) * Math.cos(theta) : 0;
    const totalTorque = baseTorque + gComp;
    setTorque(totalTorque);

    // Physics: d2theta = (TotalTorque - m*g*L/2*cos(theta)) / (m*L^2/3)
    const inertia = (mass * L * L) / 3;
    const alpha = (totalTorque - mass * g * (L/2) * Math.cos(theta)) / inertia;

    setOmega(prev => prev + alpha * dt);
    setTheta(prev => prev + (omega + alpha * dt) * dt);

    draw();
    requestRef.current = requestAnimationFrame(simulate);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = 100;
    const cy = canvas.height / 2;
    const drawL = L * 300;

    // Reference Line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + drawL, cy);
    ctx.strokeStyle = '#1e293b';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arm
    const endX = cx + Math.cos(theta) * drawL;
    const endY = cy + Math.sin(theta) * drawL;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Mass indicator
    ctx.beginPath();
    ctx.arc(cx + Math.cos(theta) * drawL * 0.7, cy + Math.sin(theta) * drawL * 0.7, mass * 15, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();

    // Pivot
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Torque Arrow
    if (Math.abs(torque) > 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI/2 * (torque / 50));
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(simulate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      draw();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, theta, gravityComp, mass]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <Weight className="w-5 h-5 text-blue-400" />
          סימולציית פיצוי כבידה (Dynamics & Gravity Compensation)
        </h3>
        <p className="text-sm text-slate-400">
          גלו איך מודל פיזיקלי של המערכת (Feed-forward) משפר את הדיוק של בקר PD על ידי ביטול השפעת המשקל העצמי.
        </p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 font-sans">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 aspect-video bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
           <canvas ref={canvasRef} width={600} height={350} className="w-full h-full object-contain" />
           
           <div className="absolute top-4 left-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center gap-4">
                 <span className="text-[10px] text-slate-500 font-black">זווית (Error)</span>
                 <span className={`text-xs font-mono font-bold ${Math.abs(theta) < 0.05 ? 'text-emerald-400' : 'text-red-400'}`}>
                   {(theta * 180 / Math.PI).toFixed(1)}°
                 </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                 <span className="text-[10px] text-slate-500 font-black">מומנט (Torque)</span>
                 <span className="text-xs font-mono font-bold text-amber-400">
                   {torque.toFixed(1)} Nm
                 </span>
              </div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">הגדרות בקר</div>
                <button 
                  onClick={reset}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
             </div>
             
             <button 
               onClick={() => setGravityComp(!gravityComp)}
               className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border ${
                 gravityComp 
                   ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                   : 'bg-slate-700 border-slate-600 text-slate-400'
               }`}
             >
               {gravityComp ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
               פיצוי כבידה: {gravityComp ? 'פעיל' : 'כבוי'}
             </button>

             <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                   <label>מסה בקצה (Kg)</label>
                   <span className="font-mono text-blue-400">{mass.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.5" max="5" step="0.1" 
                  value={mass} onChange={e => setMass(Number(e.target.value))} 
                  className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
             </div>

             <button 
               onClick={() => setIsRunning(!isRunning)}
               className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                 isRunning ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
               }`}
             >
               {isRunning ? <Pause size={18} /> : <Play size={18} />}
               {isRunning ? 'עצור סימולציה' : 'הפעל סימולציה'}
             </button>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-3 items-start">
             <div className="p-2 bg-blue-500/10 rounded-lg">
                <Info className="w-4 h-4 text-blue-400" />
             </div>
             <div className="text-[11px] text-slate-400 leading-relaxed">
               <span className="font-bold text-slate-300 block mb-1">מדוע זה חשוב?</span>
               ללא פיצוי כבידה, לבקר ה-PD תמיד תהיה "שגיאת מצב מתמיד" (Static Error) כי הוא לא יודע שהוא צריך להפעיל כוח קבוע רק כדי לעמוד במקום.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
