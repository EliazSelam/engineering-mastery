import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function MPCSimulation() {
  const DEFAULT = { horizon: 10, target: 10 };
  const [horizon, setHorizon] = useState(DEFAULT.horizon);
  const [target, setTarget] = useState(DEFAULT.target);

  const reset = () => {
    setHorizon(DEFAULT.horizon);
    setTarget(DEFAULT.target);
  };

  const getTakeaway = () => {
    if (horizon < 5) return "⚠️ Short Horizon: האופק קצר מדי. הבקר לא רואה מספיק קדימה ועלול לבצע פעולות אגרסיביות שיובילו לחוסר יציבות בהמשך.";
    if (horizon > 12) return "✅ Long Horizon: האופק הארוך מאפשר לבקר לתכנן מסלול חלק ויעיל, אך דורש כוח חישוב רב יותר בזמן אמת.";
    return "💡 MPC הוא בקר 'חכם' שחושב על העתיד. הוא לא רק מגיב לשגיאה, אלא מתכנן את המסלול האופטימלי להגעה ליעד.";
  };

  const data = useMemo(() => {
    // Current state (history)
    const history = Array.from({ length: 15 }, (_, i) => ({
      t: i,
      val: 5 + Math.sin(i / 3) * 2,
      type: 'History'
    }));

    const lastVal = history[history.length - 1].val;
    
    // Prediction logic: x(k+i) = lastVal + (Target - lastVal) * (1 - e^-0.3*i)
    // Simplified model projection
    const prediction = Array.from({ length: horizon }, (_, i) => {
      const t = 14 + i;
      const predictedVal = lastVal + (target - lastVal) * (1 - Math.exp(-0.3 * i));
      return {
        t,
        val: predictedVal,
        type: 'Predicted'
      };
    });

    return [...history, ...prediction];
  }, [horizon, target]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">MPC Predictive Horizon — Simulation</h3>
          <div className="flex gap-2">
            <div className="flex flex-col items-end gap-1 mr-4">
              <span className="text-[10px] text-slate-500 font-black uppercase">Horizon N: {horizon}</span>
              <input 
                type="range" min={3} max={15} step={1} 
                value={horizon} onChange={(e) => setHorizon(parseInt(e.target.value))}
                className="accent-[#10b981] w-24"
              />
            </div>
            <div className="flex flex-col items-end gap-1 mr-4">
              <span className="text-[10px] text-slate-500 font-black uppercase">Setpoint: {target}</span>
              <input 
                type="range" min={0} max={20} step={1} 
                value={target} onChange={(e) => setTarget(parseInt(e.target.value))}
                className="accent-[#F7B801] w-24"
              />
            </div>
            <button 
              onClick={reset}
              className="px-3 py-1 rounded-lg bg-slate-700 text-[10px] font-bold hover:bg-slate-600 self-end"
            >
              RESET
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Model Predictive Control: Predict the future and optimize the control effort.
        </p>
      </div>

      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 italic text-sm text-emerald-400">
        {getTakeaway()}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20, bottom: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#64748b' }} />
            <YAxis domain={[0, 22]} tick={{ fontSize: 9, fill: '#64748b' }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: '10px' }} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 10, paddingBottom: 10 }} />
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={(props: any) => {
                if (data[props.index].type === 'Predicted') return <circle cx={props.cx} cy={props.cy} r={2} fill="#F7B801" stroke="none" />;
                return null;
              }}
              name="Trajectory"
              isAnimationActive={false} 
            />
            <Line 
              type="step" 
              dataKey={() => target} 
              stroke="#F7B801" 
              strokeDasharray="5 5" 
              name="Setpoint" 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
         <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-slate-400 font-black uppercase">Solver Status</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">FEASIBLE OPTIMUM</span>
         </div>
         <p className="text-[9px] text-slate-500 leading-relaxed italic">
           The MPC controller is solving an optimization problem over the {horizon}-step horizon. 
           Cost Function: J = Σ(x-x_ref)² + Σ u².
         </p>
      </div>
    </div>
  );
}
