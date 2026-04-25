import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function DSPReviewProject() {
  const DEFAULT = { signalType: 'Sine' as const, filterType: 'Lowpass' as const };
  const [signalType, setSignalType] = useState<'Sine' | 'Square' | 'Noise'>(DEFAULT.signalType);
  const [filterType, setFilterType] = useState<'None' | 'Lowpass' | 'Highpass'>(DEFAULT.filterType);

  const reset = () => {
    setSignalType(DEFAULT.signalType);
    setFilterType(DEFAULT.filterType);
  };

  const getTakeaway = () => {
    if (filterType === 'Lowpass') return "🧹 Lowpass: הבקר מעביר רק את התדירות הנמוכה (האות המקורי) וחוסם את הרעש בתדר הגבוה.";
    if (filterType === 'Highpass') return "🔍 Highpass: האות המקורי נחסם, ורק הרעש בתדר הגבוה עובר. שימושי לזיהוי בעיות במערכת.";
    return "💡 עיבוד אותות (DSP) מאפשר לנו 'לנקות' את המציאות מרעשים. בחר Raw כדי לראות את האות המלכלך.";
  };

  const data = useMemo(() => {
    const N = 100;
    const fs = 1000;
    const fSig = 100; // Hz

    return Array.from({ length: N }, (_, i) => {
      const t = i / fs;
      let raw = 0;
      if (signalType === 'Sine') raw = Math.sin(2 * Math.PI * fSig * t);
      if (signalType === 'Square') raw = Math.sin(2 * Math.PI * fSig * t) > 0 ? 1 : -1;
      if (signalType === 'Noise') raw = (Math.random() - 0.5) * 2;
      
      // Add high freq noise
      const highNoise = Math.sin(2 * Math.PI * 400 * t) * 0.3;
      const combined = raw + highNoise;

      let filtered = combined;
      if (filterType === 'Lowpass') filtered = raw; // Simple conceptual filter
      if (filterType === 'Highpass') filtered = highNoise;

      return { t: parseFloat((t * 1000).toFixed(1)), raw: combined, filtered };
    });
  }, [signalType, filterType]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-5 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Signal Cleaning & Filtering Project</h3>
          <button 
            onClick={reset}
            className="px-3 py-1 rounded-lg bg-slate-700 text-[10px] font-bold hover:bg-slate-600 transition-colors"
          >
            RESET
          </button>
        </div>
        <p className="text-xs text-slate-500">Digital signal processing (DSP) enables us to filter out noise from real-world data.</p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 italic text-sm text-blue-400">
        {getTakeaway()}
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-slate-500 uppercase font-black">Input Signal</p>
          <div className="flex gap-2">
            {['Sine', 'Square', 'Noise'].map((s: any) => (
              <label key={s} className="flex items-center gap-1 cursor-pointer group">
                <input 
                  type="radio" 
                  name="signal" 
                  checked={signalType === s} 
                  onChange={() => setSignalType(s)}
                  className="hidden"
                />
                <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${signalType === s ? 'border-[#004E89]' : 'border-slate-700'}`}>
                  {signalType === s && <div className="w-1.5 h-1.5 rounded-full bg-[#004E89]" />}
                </div>
                <span className={`text-[10px] font-bold ${signalType === s ? 'text-white' : 'text-slate-500'}`}>{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <p className="text-[10px] text-slate-500 uppercase font-black">Filter Stage</p>
          <div className="flex gap-2 justify-end">
            {['None', 'Lowpass', 'Highpass'].map((f: any) => (
              <label key={f} className="flex items-center gap-1 cursor-pointer group">
                <input 
                  type="radio" 
                  name="filter" 
                  checked={filterType === f} 
                  onChange={() => setFilterType(f)}
                  className="hidden"
                />
                <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${filterType === f ? 'border-[#FF6B35]' : 'border-slate-700'}`}>
                  {filterType === f && <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />}
                </div>
                <span className={`text-[10px] font-bold ${filterType === f ? 'text-white' : 'text-slate-500'}`}>{f}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#64748b' }} label={{ value: 'ms', position: 'bottom', fontSize: 9, fill: '#64748b' }} />
            <YAxis domain={[-1.5, 1.5]} tick={{ fontSize: 9, fill: '#64748b' }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="raw" stroke="#475569" strokeDasharray="3 3" dot={false} name="Original + Noise" isAnimationActive={false} />
            <Line type="monotone" dataKey="filtered" stroke="#FF6B35" dot={false} strokeWidth={2} name="Filtered Output" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
        <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
           <span className="text-emerald-400 font-bold">Pipeline:</span> ADC(8kHz) &rarr; Filter({filterType}) &rarr; Analysis(FFT)
           <br/>
           <span className="text-slate-500 italic">Result: Removed {filterType === 'Lowpass' ? '400Hz noise component' : filterType === 'Highpass' ? 'low frequency carrier' : 'nothing'}.</span>
        </p>
      </div>
    </div>
  );
}
