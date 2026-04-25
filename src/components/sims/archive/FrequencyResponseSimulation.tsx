import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Settings, Info, Waves, Activity, RotateCcw } from 'lucide-react';

export const FrequencyResponseSimulation: React.FC = () => {
  const DEFAULT = {
    freq: 1,      // Fixed Frequency in rad/s
    wc: 5,        // Cutoff Frequency
    K: 1          // Gain
  };

  const [freq, setFreq] = useState(DEFAULT.freq);
  const [wc, setWc] = useState(DEFAULT.wc);
  const [K, setK] = useState(DEFAULT.K);

  const reset = () => {
    setFreq(DEFAULT.freq);
    setWc(DEFAULT.wc);
    setK(DEFAULT.K);
  };

  const getTakeaway = () => {
    if (freq > wc) return "📉 High Frequency Attenuation: התדר גבוה מתדר החיתוך (wc). המערכת מסננת את האות והאמפליטודה שלו דועכת משמעותית.";
    if (freq < wc * 0.2) return "✅ Low Frequency Pass: התדר נמוך משמעותית מ-wc. המערכת מעבירה את האות כמעט ללא שינוי בעוצמה.";
    return "💡 Frequency Response: המוצא עוקב אחרי הכניסה, אך עם שינוי באמפליטודה (Gain) ובפאזה (Lag).";
  };

  const data = useMemo(() => {
    const points = [];
    const duration = 10; // seconds
    const steps = 200;
    
    // G(s) = K * wc / (s + wc)
    // Magnitude = K * wc / sqrt(w^2 + wc^2)
    // Phase = -atan(w / wc)
    const mag = K * wc / Math.sqrt(freq * freq + wc * wc);
    const phase = -Math.atan(freq / wc);

    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * duration;
      const input = Math.sin(freq * t);
      const output = mag * Math.sin(freq * t + phase);
      
      points.push({
        t: parseFloat(t.toFixed(2)),
        input: parseFloat(input.toFixed(3)),
        output: parseFloat(output.toFixed(3))
      });
    }
    return points;
  }, [freq, wc, K]);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-8 font-sans" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex justify-between items-center text-right">
        <div className="space-y-1">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white">
            <Waves className="w-6 h-6 text-blue-400" />
            סימולציית תגובת תדר (Frequency Response)
          </h3>
          <p className="text-sm text-slate-400">
            ראו כיצד מערכת מסדר ראשון (Low-Pass Filter) מגיבה לתדרים שונים של אות הכניסה.
          </p>
        </div>
        <button 
          onClick={reset}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-white transition-all shadow-lg"
          title="איפוס"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 text-right">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-fit">
        {/* Plot */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 h-[350px] relative">
          <div className="absolute top-2 right-4 text-[10px] text-slate-500 uppercase font-black">תגובה בזמן Time Domain</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="t" stroke="#475569" fontSize={10} label={{ value: 'זמן (s)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
              <YAxis stroke="#475569" fontSize={10} domain={[-1.5, 1.5]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="input" stroke="#3b82f6" strokeWidth={2} dot={false} name="כניסה (Input)" isAnimationActive={false} />
              <Line type="monotone" dataKey="output" stroke="#f43f5e" strokeWidth={2} dot={false} name="מוצא (Output)" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 text-right">
                 <Settings className="w-4 h-4" />
                 פרמטרי סימולציה
              </h4>

              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label className="text-white">תדר הכניסה (ω)</label>
                       <span className="text-blue-400 font-bold">{freq.toFixed(1)} rad/s</span>
                    </div>
                    <input type="range" min="0.1" max="20" step="0.1" value={freq} onChange={e => setFreq(Number(e.target.value))} className="w-full accent-blue-500" />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label className="text-white">תדר חיתוך (wc)</label>
                       <span className="text-red-400 font-bold">{wc.toFixed(1)} rad/s</span>
                    </div>
                    <input type="range" min="1" max="20" step="1" value={wc} onChange={e => setWc(Number(e.target.value))} className="w-full accent-red-500" />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label className="text-white">הגבר סטטי (K)</label>
                       <span className="text-slate-300 font-bold">{K}</span>
                    </div>
                    <input type="range" min="0.1" max="2" step="0.1" value={K} onChange={e => setK(Number(e.target.value))} className="w-full accent-slate-500" />
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50 space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">הנחתה (dB):</span>
                    <span className="font-mono font-bold text-white">
                      {(20 * Math.log10(K * wc / Math.sqrt(freq * freq + wc * wc))).toFixed(1)} dB
                    </span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">עיכוב פאזה (deg):</span>
                    <span className="font-mono font-bold text-white">
                      {(-Math.atan(freq / wc) * 180 / Math.PI).toFixed(1)}°
                    </span>
                 </div>
              </div>
           </div>

           <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex gap-3 items-start text-right">
             <Info className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
             <div className="text-[10px] text-slate-400 leading-relaxed">
               <span className="font-bold text-slate-300 block mb-1 text-right">טיפ תגובת תדר</span>
               במערכת מסוג LPF, ככל שהתדר עולה, המערכת "מתאמצת" יותר להגיב, מה שגורם לפיגור בפאזה ולירידה בעוצמת המוצא.
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyResponseSimulation;
