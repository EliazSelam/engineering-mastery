import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, Target, AlertTriangle, Info, RotateCcw } from 'lucide-react';

export default function PoleZeroSimulation() {
  const [poleX, setPoleX] = useState(-2);
  const [poleY, setPoleY] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  
  const time = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const step = () => {
      time.current += 0.1;
      
      // System Response calculation: y(t) = e^(sigma*t) * cos(omega*t)
      // sigma = poleX, omega = poleY
      const sigma = poleX;
      const omega = poleY;
      
      let val = Math.exp(sigma * (time.current % 10)) * Math.cos(omega * (time.current % 10));
      
      // Clamp for visualization
      if (val > 50) val = 50;
      if (val < -50) val = -50;

      setHistory(h => [...h, val].slice(-100));
      animationRef.current = requestAnimationFrame(step);
    };
    
    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [poleX, poleY]);

  const resetTime = () => {
    time.current = 0;
    setHistory([]);
  };

  const fullReset = () => {
    setPoleX(-2);
    setPoleY(0);
    resetTime();
  };

  const isStable = poleX < 0;
  const isOscillatory = Math.abs(poleY) > 0.1;

  const getTakeaway = () => {
    if (!isStable) return "⚠️ המערכת לא יציבה! הקוטב נמצא בחצי המישור הימני. כל הפרעה קטנה תגרום למערכת להתפוצץ לאינסוף.";
    if (isOscillatory) return "🔄 המערכת יציבה אך תנודתית. ככל שהקוטב רחוק יותר מהציר הממשי, התדר של התנודות גבוה יותר.";
    if (poleX < -4) return "⚡ המערכת יציבה ומהירה מאוד. הקוטב רחוק שמאלה מהציר המדומה, מה שמעיד על דעיכה מהירה.";
    return "💡 המערכת יציבה אסימפטוטית. הקוטב בחצי המישור השמאלי, ולכן המערכת תמיד תחזור לאפס לאורך זמן.";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col gap-8" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white">
            <Activity size={20} className="text-blue-400" />
            סימולטור יציבות וקטבים (Pole-Zero Analysis)
          </h3>
          <p className="text-sm text-slate-400">
            חקרו איך מיקום הקטבים במישור המרוכב (s-plane) קובע את סוג התגובה של המערכת במישור הזמן.
          </p>
        </div>
        <button 
          onClick={fullReset}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-white transition-all shadow-lg"
          title="איפוס מוחלט"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-500">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* S-Plane (Complex Plane) */}
        <div className="flex flex-col gap-4">
          <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
            <Target size={12} />
            מישור S (מישור מרוכב)
          </label>
          <div className="relative h-64 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden cursor-crosshair"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = ((e.clientX - rect.left) / rect.width) * 10 - 5;
                 const y = (1 - (e.clientY - rect.top) / rect.height) * 10 - 5;
                 setPoleX(x);
                 setPoleY(y);
                 resetTime();
               }}>
            {/* Axes */}
            <div className="absolute left-1/2 top-0 w-px h-full bg-slate-300" />
            <div className="absolute left-0 top-1/2 w-full h-px bg-slate-300" />
            
            {/* LHP / RHP Labels */}
            <div className="absolute left-4 top-4 text-[8px] font-bold text-green-600/40 uppercase">יציב (LHP)</div>
            <div className="absolute right-4 top-4 text-[8px] font-bold text-red-600/40 uppercase">לא יציב (RHP)</div>

            {/* The Pole (X) */}
            <motion.div 
              className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center text-blue-600 font-black text-xl z-20"
              animate={{ 
                left: `${(poleX + 5) * 10}%`, 
                top: `${(5 - poleY) * 10}%` 
              }}
            >
              ×
            </motion.div>

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10% 10%' }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>σ (Real): {poleX.toFixed(2)}</span>
            <span>jω (Imag): {poleY.toFixed(2)}</span>
          </div>
        </div>

        {/* Time Response */}
        <div className="flex flex-col gap-4">
          <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
            <Activity size={12} />
            תגובה בזמן (Time Response)
          </label>
          <div className="relative h-64 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#334155" strokeDasharray="4" />
              <polyline
                fill="none"
                stroke={isStable ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
                points={history.map((val, i) => `${i}%,${128 - val * 20}`).join(' ')}
              />
            </svg>
            {!isStable && (
              <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                <div className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold animate-bounce">התבדרות!</div>
              </div>
            )}
          </div>
          <button 
            onClick={resetTime}
            className="text-[10px] font-bold text-blue-600 hover:underline self-end"
          >
            אפס תצוגה
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <h5 className="text-xs font-bold">מה אנחנו רואים כאן?</h5>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            ככל שהקוטב <strong>שמאלה</strong> יותר, המערכת דועכת מהר יותר. ככל שהוא <strong>רחוק מציר ה-X</strong>, המערכת מתנדנדת מהר יותר. 
            ברגע שהקוטב חוצה את הציר האנכי ימינה – המערכת הופכת ל"פצצה" מתקתקת ומתבדרת לאינסוף.
          </p>
        </div>
      </div>
    </div>
  );
}
