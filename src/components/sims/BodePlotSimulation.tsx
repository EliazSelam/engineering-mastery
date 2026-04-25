import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Activity, Zap, RotateCcw, Target, Info, Waves } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function BodePlotSimulation() {
  const DEFAULT = {
    K: 1.0,
    wc: 10,
    zeta: 0.5
  };

  const [K, setK] = useState(DEFAULT.K);
  const [wc, setWc] = useState(DEFAULT.wc);
  const [zeta, setZeta] = useState(DEFAULT.zeta);
  const [sweepFreq, setSweepFreq] = useState(1);

  const reset = () => {
    setK(DEFAULT.K);
    setWc(DEFAULT.wc);
    setZeta(DEFAULT.zeta);
  };

  const data = useMemo(() => {
    const points = [];
    for (let i = -1; i <= 2; i += 0.05) {
      const w = Math.pow(10, i);
      
      // 2nd Order: H(s) = K * wc^2 / (s^2 + 2*zeta*wc*s + wc^2)
      const num = { re: K * wc * wc, im: 0 };
      const denom = { 
        re: wc * wc - w * w, 
        im: 2 * zeta * wc * w 
      };
      
      const magValue = Math.sqrt(num.re * num.re) / Math.sqrt(denom.re * denom.re + denom.im * denom.im);
      const phaseValue = 0 - Math.atan2(denom.im, denom.re);
      
      points.push({
        w,
        mag: 20 * Math.log10(Math.max(magValue, 0.0001)),
        phase: (phaseValue * 180) / Math.PI
      });
    }
    return points;
  }, [K, wc, zeta]);

  const currentResponse = useMemo(() => {
    const w = sweepFreq;
    const mag = K * wc * wc / Math.sqrt(Math.pow(wc * wc - w * w, 2) + Math.pow(2 * zeta * wc * w, 2));
    return mag;
  }, [sweepFreq, K, wc, zeta]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white overflow-hidden relative" dir="ltr">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Bode Response Analyzer</h3>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Frequency Domain Dynamics Lab</p>
        </div>
        <button onClick={reset} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all text-slate-400">
           <RotateCcw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CHARTS */}
        <div className="lg:col-span-8 flex flex-col gap-4">
           <div className="h-48 bg-black/40 rounded-2xl border border-slate-800 p-4">
              <p className="text-[10px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                <Activity size={12} /> Magnitude Response (dB)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="w" type="number" scale="log" domain={[0.1, 100]} hide />
                    <YAxis domain={[-40, 40]} tick={{ fontSize: 9, fill: '#64748b' }} />
                    <ReferenceLine x={wc} stroke="#FF6B35" strokeDasharray="3 3" label={{ value: 'ωn', fill: '#FF6B35', fontSize: 10, position: 'top' }} />
                    <ReferenceLine x={sweepFreq} stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="mag" stroke="#004E89" strokeWidth={3} dot={false} isAnimationActive={false} />
                 </LineChart>
              </ResponsiveContainer>
           </div>

           <div className="h-40 bg-black/40 rounded-2xl border border-slate-800 p-4">
              <p className="text-[10px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                <Waves size={12} /> Phase Shift (Deg)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="w" type="number" scale="log" domain={[0.1, 100]} tick={{ fontSize: 9, fill: '#64748b' }} label={{ value: 'ω (rad/s)', position: 'insideBottom', offset: -5, fontSize: 9, fill: '#64748b' }} />
                    <YAxis domain={[-180, 0]} ticks={[-180, -90, 0]} tick={{ fontSize: 9, fill: '#64748b' }} />
                    <ReferenceLine x={wc} stroke="#FF6B35" strokeDasharray="3 3" />
                    <ReferenceLine x={sweepFreq} stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="phase" stroke="#004E89" strokeWidth={3} dot={false} isAnimationActive={false} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* INTERACTIVE COMPONENT */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-black/20 p-6 rounded-2xl border border-slate-800 space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] uppercase font-black text-slate-500">
                    <span>Damping (ζ)</span>
                    <span className="text-[#F7B801]">{zeta.toFixed(2)}</span>
                 </div>
                 <input type="range" min="0.05" max="1.5" step="0.05" value={zeta} onChange={e => setZeta(parseFloat(e.target.value))} className="w-full h-1 appearance-none bg-slate-800 rounded-full accent-[#F7B801]" />
                 <div className="flex justify-between text-[8px] text-slate-600 mt-2">
                    <span>Underdamped</span>
                    <span>Overdamped</span>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                 <div className="flex justify-between items-center text-[10px] uppercase font-black text-slate-500">
                    <span>Freq Sweep (ω)</span>
                    <span className="text-emerald-400">{sweepFreq.toFixed(1)} rad/s</span>
                 </div>
                 <input type="range" min="0.1" max="100" step="0.1" value={sweepFreq} onChange={e => setSweepFreq(parseFloat(e.target.value))} className="w-full h-1 appearance-none bg-slate-800 rounded-full accent-emerald-500" />
              </div>

              <div className="flex flex-col items-center justify-center py-6 bg-slate-900/50 rounded-xl border border-slate-800 relative overflow-hidden">
                 <div className="absolute inset-x-0 bottom-0 h-px bg-slate-800" />
                 <span className="text-[8px] text-slate-500 uppercase font-black mb-4">Signal Attenuation</span>
                 
                 <div className="flex items-center gap-12 relative z-10">
                    <div className="flex flex-col items-center gap-2">
                       <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1/sweepFreq * 5 }} className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]" />
                       <span className="text-[8px] text-slate-600 uppercase font-bold">Input</span>
                    </div>
                    <div className="w-12 h-px bg-slate-700" />
                    <div className="flex flex-col items-center gap-2">
                       <motion.div animate={{ scale: [1, 1 + currentResponse * 0.2, 1] }} transition={{ repeat: Infinity, duration: 1/sweepFreq * 5 }} className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                       <span className="text-[8px] text-slate-600 uppercase font-bold">Output</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[10px] leading-relaxed flex gap-3 italic text-slate-400">
              <Info size={16} className="text-blue-400 shrink-0" />
              <p>
                 {zeta < 0.707 ? "⚠️ Resonance Peak: שים לב להגבר ב-ωn. פחות שיכוך גורם למערכת להגיב חזק מדי לתדר זה." : "📉 Smooth Roll-off: שיכוך גבוה מונע רזוננס אך 'מאחר' את התגובה של התדרים הגבוהים."}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
