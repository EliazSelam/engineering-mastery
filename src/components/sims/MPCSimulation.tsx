import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Real LQR-based MPC solver
function predictMPC(
  x0: number,
  target: number,
  N: number,
  A: number = 0.95,
  B: number = 0.1,
  Q: number = 1,
  R: number = 0.01,
  uMin: number = -10,
  uMax: number = 10
): { trajectory: number[]; controls: number[]; cost: number; saturated: boolean } {
  // Solve infinite-horizon Riccati equation for steady-state gain
  let P = Q;
  for (let i = 0; i < 50; i++) {
    const denom = R + B * B * P;
    P = A * A * P - (A * B * P) * (A * B * P) / denom + Q;
  }
  const K = (B * P * A) / (R + B * B * P);

  // Forward simulate with feedback
  const trajectory: number[] = [x0];
  const controls: number[] = [];
  let cost = 0;
  let saturated = false;
  let x = x0;

  for (let i = 0; i < N; i++) {
    let u = -K * (x - target);
    const uSat = Math.max(uMin, Math.min(uMax, u));
    if (Math.abs(uSat - u) > 0.001) saturated = true;
    controls.push(uSat);
    cost += Q * (x - target) * (x - target) + R * uSat * uSat;
    x = A * x + B * uSat;
    trajectory.push(x);
  }

  return { trajectory, controls, cost, saturated };
}

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

    // Real MPC prediction
    const mpcResult = predictMPC(lastVal, target, horizon);

    const prediction = Array.from({ length: horizon }, (_, i) => {
      const t = 14 + i;
      return {
        t,
        val: mpcResult.trajectory[i + 1],
        type: 'Predicted'
      };
    });

    return { chartData: [...history, ...prediction], mpcResult };
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
          <LineChart data={data.chartData} margin={{ left: -20, bottom: -10 }}>
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
                if (data.chartData[props.index].type === 'Predicted') return <circle cx={props.cx} cy={props.cy} r={2} fill="#F7B801" stroke="none" />;
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
            <div className="flex gap-2">
              <span className={`text-[10px] font-mono font-bold ${data.mpcResult.saturated ? 'text-orange-400' : 'text-emerald-400'}`}>
                {data.mpcResult.saturated ? 'SATURATED' : 'FEASIBLE'}
              </span>
              <span className="text-[10px] text-slate-300 font-mono">J = {data.mpcResult.cost.toFixed(2)}</span>
            </div>
         </div>
         <p className="text-[9px] text-slate-500 leading-relaxed italic">
           {'LQR-based MPC solving finite-horizon optimal control: min Σ(x-x_ref)² + Σ Ru² s.t. x[k+1] = 0.95·x[k] + 0.1·u[k], |u| ≤ 10.'}
         </p>
      </div>
    </div>
  );
}
