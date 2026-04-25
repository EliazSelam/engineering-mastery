import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RotateCcw } from 'lucide-react';

export default function AliasingSimulation() {
  const DEFAULT = { signalFreq: 3, samplingRate: 10 };
  const [signalFreq, setSignalFreq] = useState(DEFAULT.signalFreq);
  const [samplingRate, setSamplingRate] = useState(DEFAULT.samplingRate);

  const reset = () => {
    setSignalFreq(DEFAULT.signalFreq);
    setSamplingRate(DEFAULT.samplingRate);
  };

  const nyquist = samplingRate / 2;
  const isAliasing = signalFreq >= nyquist;
  const aliasedFreq = isAliasing ? Math.abs(signalFreq - samplingRate * Math.round(signalFreq / samplingRate)) : signalFreq;
  const N_CONT = 500;

  const getTakeaway = () => {
    if (isAliasing) return "⚠️ Aliasing: האות המקורי מהיר מדי לקצב הדגימה. התוצאה היא 'קיפול' התדרים (Folding), והאות נתפס כתדר נמוך ושגוי.";
    return "✅ Nyquist Path: קצב הדגימה שלך גדול פי 2 ומעלה מהתדר. האות משוחזר בצורה נאמנה למציאות.";
  };

  const chartData = useMemo(() => Array.from({ length: N_CONT }, (_, i) => {
    const t = (i / N_CONT);
    return { t: parseFloat(t.toFixed(3)), original: Math.sin(2 * Math.PI * signalFreq * t), reconstructed: parseFloat(Math.sin(2 * Math.PI * aliasedFreq * t).toFixed(3)) };
  }), [signalFreq, aliasedFreq]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-5 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Nyquist-Shannon Aliasing Simulator</h3>
          <button 
            onClick={reset}
            className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all shadow-lg"
            title="איפוס"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-500">Visualizing the effects of insufficient sampling rates on periodic signals.</p>
      </div>

      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 italic text-sm text-emerald-400">
        {getTakeaway()}
      </div>

      <div className={`flex items-center justify-between px-5 py-3 rounded-2xl font-black text-sm ${isAliasing ? 'bg-red-900/60 border border-red-500 text-red-100' : 'bg-emerald-900/60 border border-emerald-500 text-emerald-100'}`}>
        <span>{isAliasing ? '⚠️ ALIASING DETECTED' : '✓ NYQUIST CONDITION MET'}</span>
        <span className="font-mono text-xs">{isAliasing ? `Appears as ${aliasedFreq.toFixed(1)} Hz` : `Fs/2 = ${nyquist} Hz > ${signalFreq} Hz`}</span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
          <YAxis domain={[-1.3, 1.3]} tick={{ fontSize: 10, fill: '#64748b' }} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="original" stroke="#004E89" dot={false} strokeWidth={2} name={`Original (${signalFreq} Hz)`} isAnimationActive={false} />
          <Line type="monotone" dataKey="reconstructed" stroke="#F7B801" dot={false} strokeWidth={2} strokeDasharray={isAliasing ? "5 3" : "0"} name={`Reconstructed (${aliasedFreq.toFixed(1)} Hz)`} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-2 border border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase">Signal Frequency</p>
          <input type="range" min={1} max={25} step={0.5} value={signalFreq} onChange={e => setSignalFreq(parseFloat(e.target.value))} className="accent-[#004E89]" />
          <span className="text-lg font-black text-[#004E89] font-mono">{signalFreq} Hz</span>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-2 border border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase">Sampling Rate (Fs)</p>
          <input type="range" min={5} max={60} step={1} value={samplingRate} onChange={e => setSamplingRate(parseFloat(e.target.value))} className="accent-[#FF6B35]" />
          <span className="text-lg font-black text-[#FF6B35] font-mono">{samplingRate} Hz</span>
        </div>
      </div>
    </div>
  );
}
