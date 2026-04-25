import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Info, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { evaluate1stOrderLP, evaluate2ndOrder, evaluateCustom2P1Z } from '../../lib/math/transferFunction';

type PlantType = '1st' | '2nd' | 'integrator';

export default function NyquistSimulation() {
  const DEFAULT = {
    plantType: '1st' as PlantType,
    K: 1,
    wc: 2,
    delay: 0
  };

  const [plantType, setPlantType] = useState<PlantType>(DEFAULT.plantType);
  const [K, setK] = useState(DEFAULT.K);
  const [wc, setWc] = useState(DEFAULT.wc);
  const [delay, setDelay] = useState(DEFAULT.delay);

  const reset = () => {
    setPlantType(DEFAULT.plantType);
    setK(DEFAULT.K);
    setWc(DEFAULT.wc);
    setDelay(DEFAULT.delay);
  };

  const getTakeaway = () => {
    if (delay > 0.5 && isEncircled) return "⚠️ Delay Impact: העיכוב מסובב את העקום (Spiraling) וגורם להקפת הנקודה הקריטית. המערכת הופכת ללא יציבה.";
    if (K > 3 && isEncircled) return "⚠️ High Gain: הגבר גבוה הגדיל את העקום עד שהוא 'בלע' את נקודת ה-1-. הקטן את K כדי לייצב.";
    if (plantType === 'integrator') return "ℹ️ Integrator: ישנה קפיצה ב-Imaginary axis בתדר 0. שים לב איך העיכוב משפיע עליה מהר יותר.";
    return "💡 Nyquist מראה לנו את הדרך ל-1-: כל עוד העקום הכחול 'מחטיא' את ה-X האדום משמאל, המערכת יציבה.";
  };

  const points = useMemo(() => {
    const pts = [];
    const omega = [];
    
    // Create omega range from small to large
    // We need positive and negative freq for full Nyquist
    for (let i = -100; i <= 100; i++) {
        const sign = i < 0 ? -1 : 1;
        const mag = Math.pow(10, (Math.abs(i) / 100) * 4 - 2); // 10^-2 to 10^2
        omega.push(sign * mag);
    }
    omega.sort((a,b) => a - b);

    omega.forEach(w => {
        let g;
        if (plantType === '1st') {
            g = evaluate1stOrderLP(w, K, wc);
        } else if (plantType === '2nd') {
            g = evaluate2ndOrder(w, K, wc, 0.5);
        } else {
            // Integrator: G(s) = K / (s * (s + wc))
            g = evaluateCustom2P1Z(w, K, 1000000, 0, wc); // approximate z very far
        }

        // Apply delay: G_delayed = G(jw) * e^(-j * w * delay)
        // e^(-jwT) = cos(wT) - j*sin(wT)
        if (delay > 0) {
            const re_delay = Math.cos(w * delay);
            const im_delay = -Math.sin(w * delay);
            const re_new = g.re * re_delay - g.im * im_delay;
            const im_new = g.re * im_delay + g.im * re_delay;
            g = { re: re_new, im: im_new };
        }
        
        pts.push({ ...g, w });
    });
    return pts;
  }, [plantType, K, wc, delay]);

  // View parameters
  const size = 500;
  const padding = 50;
  const scale = 150; // pixels per unit

  const toScreen = (re: number, im: number) => ({
      x: size / 2 + re * scale,
      y: size / 2 - im * scale
  });

  const pathD = points.reduce((acc, pt, i) => {
      const { x, y } = toScreen(pt.re, pt.im);
      // Clamp values to prevent SVG artifacts if they go to infinity
      const cx = Math.max(-1000, Math.min(2000, x));
      const cy = Math.max(-1000, Math.min(2000, y));
      return acc + (i === 0 ? `M ${cx} ${cy}` : ` L ${cx} ${cy}`);
  }, "");

  // Marker for -1 point
  const minusOne = toScreen(-1, 0);

  // Encirclements count (simplistic check)
  const isEncircled = points.some(p => p.re < -1.1 && Math.abs(p.im) < 0.1);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-8 font-sans" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-red-500" />
            דיאגרמת Nyquist
          </h3>
          <p className="text-slate-400 text-sm">ניתוח יציבות חוג סגור לפי מיקום העקום ביחס לנקודה (0, 1-).</p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl items-center gap-2">
           <button 
             onClick={reset}
             className="p-1.5 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
             title="איפוס"
           >
             <RefreshCw className="w-3 h-3" />
           </button>
           {(['1st', '2nd', 'integrator'] as PlantType[]).map(type => (
              <button 
                key={type}
                onClick={() => setPlantType(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${plantType === type ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {type === '1st' ? 'סדר ראשון' : type === '2nd' ? 'סדר שני' : 'אינטגרטור'}
              </button>
           ))}
        </div>
      </div>

      <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 italic text-sm text-red-400">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Complex Plane Visualizer */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 relative aspect-square overflow-hidden shadow-inner">
           <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
              {/* Grid Lines */}
              <defs>
                 <pattern id="nyquistGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                    <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#1e293b" strokeWidth="1" />
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#nyquistGrid)" />
              
              {/* Axis */}
              <line x1={0} y1={size/2} x2={size} y2={size/2} stroke="#334155" strokeWidth="2" />
              <line x1={size/2} y1={0} x2={size/2} y2={size} stroke="#334155" strokeWidth="2" />

              {/* Unit Circle */}
              <circle cx={size/2} cy={size/2} r={scale} fill="none" stroke="#475569" strokeDasharray="5,5" />

              {/* Nyquist Path */}
              <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />

              {/* -1 Critical Point */}
              <g transform={`translate(${minusOne.x}, ${minusOne.y})`}>
                 <circle r="6" fill="#f43f5e" className="animate-pulse" />
                 <line x1="-10" y1="-10" x2="10" y2="10" stroke="#f43f5e" strokeWidth="2" />
                 <line x1="10" y1="-10" x2="-10" y2="10" stroke="#f43f5e" strokeWidth="2" />
                 <text y="20" x="10" fill="#f43f5e" fontSize="12" fontWeight="bold">(-1, 0j)</text>
              </g>

              {/* Labels */}
              <text x={size-20} y={size/2-10} fill="#475569" fontSize="10" textAnchor="end">Real</text>
              <text x={size/2+10} y={20} fill="#475569" fontSize="10">Imag</text>
           </svg>

           <div className="absolute bottom-6 left-6 flex gap-2">
              <button 
                onClick={() => { setK(1); setWc(2); setDelay(0); }}
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                title="איפוס"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">מאפייני מערכת</h4>
              
              <div className="space-y-4">
                 <ControlSlider label="הגבר (K)" value={K} min={0.1} max={5} step={0.1} onChange={setK} color="blue" />
                 <ControlSlider label="תדר (wc)" value={wc} min={0.1} max={10} step={0.1} onChange={setWc} color="blue" />
                 <ControlSlider label="זמן עיכוב (Delay)" value={delay} min={0} max={2} step={0.01} onChange={setDelay} color="red" />
              </div>
           </div>

           <div className={`p-6 rounded-3xl border flex flex-col gap-3 transition-all ${
             isEncircled ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
           }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                 {isEncircled ? (
                   <AlertTriangle className="w-4 h-4 text-red-500" />
                 ) : (
                   <Activity className="w-4 h-4 text-emerald-500" />
                 )}
                 {isEncircled ? 'חוסר יציבות!' : 'המערכת יציבה'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isEncircled 
                  ? "העקום מקיף את הנקודה (1-, 0j). לפי קריטריון נייקוויסט, זה מעיד על קיומם של קטבים בחצי המישור הימני (RHP) של החוג הסגור."
                  : "העקום אינו מקיף את נקודת הקריטית. המערכת תהיה יציבה בחוג סגור."}
              </p>
           </div>

           <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-3">
              <div className="flex items-start gap-3">
                 <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                 <div className="text-[10px] text-slate-400">
                    <span className="font-bold text-slate-200 block mb-1">משפט המספרים N=Z-P</span>
                    במערכת זו אין קטבים לא יציבים בחוג פתוח (P=0), ולכן כדי שהיא תהיה יציבה (Z=0), עלינו לוודא שאין הקפות סביב (1-, 0j).
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ControlSlider = ({ label, value, min, max, step, onChange, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px]">
      <label className="text-slate-400">{label}</label>
      <span className="text-white font-mono">{value.toFixed(2)}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={e => onChange(Number(e.target.value))} 
      className={`w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
    />
  </div>
);

