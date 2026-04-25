import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { RotateCcw } from 'lucide-react';

export default function MRACSimulation() {
  const DEFAULT = { gamma: 0.5 };
  const [gamma, setGamma] = useState(DEFAULT.gamma);

  const reset = () => setGamma(DEFAULT.gamma);

  const getTakeaway = () => {
    if (gamma < 0.2) return "🐢 Low Gain: ההסתגלות איטית מדי. המודל הפיזי (הקו הכתום) מתקשה לעקוב אחרי המודל האידיאלי.";
    if (gamma > 1.5) return "⚡ High Gain: הסתגלות מהירה, אך עלולה לגרום לתנודות חריפות (High Frequency) אם המודל לא מדויק.";
    return "💡 MRAC משנה את הפרמטרים של הבקר 'תוך כדי תנועה' כדי שהמערכת תתנהג בדיוק כמו המודל הייחוס.";
  };

  const data = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const t = i / 10;
      const refModel = 1.0 - Math.exp(-1.5 * t);
      // Actual diverges or adjusts based on gamma
      const actual = 1.0 - Math.exp(-(1.5 + (gamma - 0.5) * Math.sin(t)) * t);
      return { t, refModel, actual };
    });
  }, [gamma]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-5 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Model Reference Adaptive Control (MRAC)</h3>
          <div className="flex gap-2">
            <button 
              onClick={reset}
              className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all shadow-lg"
              title="איפוס"
            >
              <RotateCcw size={16} />
            </button>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-slate-500 font-black tracking-tighter">Adaptation Gain (γ): {gamma.toFixed(2)}</span>
              <input 
                type="range" min={0.01} max={2} step={0.05} 
                value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))}
                className="accent-[#FF6B35] w-32"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Adaptive control for systems with uncertain or changing parameters.
        </p>
      </div>

      <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 italic text-sm text-orange-400">
        {getTakeaway()}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 1.2]} tick={{ fontSize: 9, fill: '#64748b' }} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="refModel" stroke="#475569" strokeWidth={2} dot={false} name="Reference Model" />
            <Line type="monotone" dataKey="actual" stroke="#FF6B35" strokeWidth={3} dot={false} name="Actual Plant" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-800 p-2 rounded-xl text-center">
            <p className="text-[8px] text-slate-500 uppercase">Error (e)</p>
            <p className="text-sm font-mono text-red-400">{(gamma < 0.2 ? 0.35 : 0.04).toFixed(3)}</p>
        </div>
        <div className="flex-1 bg-slate-800 p-2 rounded-xl text-center">
            <p className="text-[8px] text-slate-500 uppercase">Convergence</p>
            <p className="text-sm font-mono text-emerald-400">{gamma > 0.4 ? 'STABLE' : 'SLOW'}</p>
        </div>
      </div>
    </div>
  );
}
