import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WindowingSimulation() {
  const DEFAULT = { signalFreq: 5.4 };
  const [signalFreq, setSignalFreq] = useState(DEFAULT.signalFreq);

  const reset = () => setSignalFreq(DEFAULT.signalFreq);

  const getTakeaway = () => {
    if (Math.abs(signalFreq - Math.round(signalFreq)) > 0.1) return "📉 Spectral Leakage: התדר אינו 'נופל' בדיוק על bin. שימוש ב-Windowing מרחיב את הבסיס (Mainlobe) אך מונע 'זליגה' לשאר התדרים.";
    return "💡 Integer Frequency: התדר הוא מספר שלם, ולכן המלבן (Rectangular) נראה מושלם. במציאות זה כמעט אף פעם לא קורה.";
  };
  
  const N = 64;

  const data = useMemo(() => {
    const calculateSpectrum = (winFunc: (n: number) => number) => {
      const timeData = Array.from({ length: N }, (_, n) => {
        const win = winFunc(n);
        const val = Math.sin((2 * Math.PI * signalFreq * n) / N);
        return val * win;
      });

      return Array.from({ length: N / 2 }, (_, k) => {
        let re = 0, im = 0;
        timeData.forEach((val, n) => {
          const angle = (2 * Math.PI * k * n) / N;
          re += val * Math.cos(angle);
          im -= val * Math.sin(angle);
        });
        const mag = Math.sqrt(re * re + im * im) / (N / 2);
        return parseFloat((20 * Math.log10(Math.max(mag, 1e-4))).toFixed(2));
      });
    };

    const rectSpecs = calculateSpectrum(() => 1);
    const hammingSpecs = calculateSpectrum((n) => 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1)));
    const hannSpecs = calculateSpectrum((n) => 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1))));

    return Array.from({ length: N/2 }, (_, k) => ({
      k,
      Rectangular: rectSpecs[k],
      Hamming: hammingSpecs[k],
      Hann: hannSpecs[k]
    }));
  }, [signalFreq]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Windowing & Spectral Leakage</h3>
          <div className="flex gap-4 items-center">
            <button 
              onClick={reset}
              className="px-3 py-1 rounded-lg bg-slate-700 text-[10px] font-bold hover:bg-slate-600 transition-colors"
            >
              RESET
            </button>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Center Freq: {signalFreq.toFixed(1)}</span>
              <input 
                type="range" min={1} max={15} step={0.1} 
                value={signalFreq} onChange={(e) => setSignalFreq(parseFloat(e.target.value))}
                className="accent-[#FF6B35] w-32"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500">Compare different window functions and their impact on frequency resolution and leakage.</p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 italic text-sm text-blue-400">
        {getTakeaway()}
      </div>

      <div className="h-64">
        <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Magnitude Spectrum (dB)</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="k" tick={{ fontSize: 9, fill: '#64748b' }} label={{ value: 'Freq Bin', position: 'bottom', fontSize: 9, fill: '#64748b' }} />
            <YAxis domain={[-70, 10]} tick={{ fontSize: 9, fill: '#64748b' }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="Rectangular" stroke="#FF6B35" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line type="monotone" dataKey="Hamming" stroke="#004E89" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line type="monotone" dataKey="Hann" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2">
         {[
           { name: 'Rect', desc: 'Mainlobe width: 4π/N', lobe: 'High' },
           { name: 'Hamming', desc: 'Sidelobe: -43 dB', lobe: 'Low' },
           { name: 'Hann', desc: 'Sidelobe: -31 dB', lobe: 'Med' }
         ].map(w => (
           <div key={w.name} className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
              <p className="text-[9px] font-black text-slate-300 uppercase">{w.name}</p>
              <p className="text-[8px] text-slate-500">{w.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
