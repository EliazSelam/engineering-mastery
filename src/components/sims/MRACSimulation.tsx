import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { RotateCcw } from 'lucide-react';

// Real MRAC simulator
function simulateMRAC(gamma: number, T: number = 5, dt: number = 0.05) {
  // Reference model: ẋ_m = -2*x_m + 2*r
  // Plant: ẋ_p = a*x_p + b*u  (a=-1, b=1)
  // Control: u = θ_r * r + θ_x * x_p
  // Adaptation: θ̇_r = -γ*e*r, θ̇_x = -γ*e*x_p

  const r = 1; // step reference
  const a_true = -1;
  const b_true = 1;
  let x_m = 0;
  let x_p = 0;
  let theta_r = 0;
  let theta_x = 0;

  const t_arr: number[] = [];
  const x_m_arr: number[] = [];
  const x_p_arr: number[] = [];
  const e_arr: number[] = [];
  const theta_r_arr: number[] = [];
  const theta_x_arr: number[] = [];

  for (let t = 0; t <= T; t += dt) {
    const e = x_p - x_m;
    const u = theta_r * r + theta_x * x_p;

    // Plant and reference dynamics
    const dx_m = -2 * x_m + 2 * r;
    const dx_p = a_true * x_p + b_true * u;
    x_m += dx_m * dt;
    x_p += dx_p * dt;

    // Adaptation law (gradient)
    theta_r += -gamma * e * r * dt;
    theta_x += -gamma * e * x_p * dt;

    t_arr.push(t);
    x_m_arr.push(x_m);
    x_p_arr.push(x_p);
    e_arr.push(e);
    theta_r_arr.push(theta_r);
    theta_x_arr.push(theta_x);
  }

  // Compute final RMS error
  const rmsError = Math.sqrt(e_arr.reduce((sum, e) => sum + e * e, 0) / e_arr.length);

  return { t: t_arr, x_m: x_m_arr, x_p: x_p_arr, e: e_arr, theta_r: theta_r_arr, theta_x: theta_x_arr, rmsError };
}

export default function MRACSimulation() {
  const DEFAULT = { gamma: 0.5 };
  const [gamma, setGamma] = useState(DEFAULT.gamma);

  const reset = () => setGamma(DEFAULT.gamma);

  const getTakeaway = () => {
    if (gamma < 0.2) return "🐢 Low Gain: ההסתגלות איטית מדי. המודל הפיזי (הקו הכתום) מתקשה לעקוב אחרי המודל האידיאלי.";
    if (gamma > 1.5) return "⚡ High Gain: הסתגלות מהירה, אך עלולה לגרום לתנודות חריפות (High Frequency) אם המודל לא מדויק.";
    return "💡 MRAC משנה את הפרמטרים של הבקר 'תוך כדי תנועה' כדי שהמערכת תתנהג בדיוק כמו המודל הייחוס.";
  };

  const mracResult = useMemo(() => simulateMRAC(gamma), [gamma]);

  const data = useMemo(() => {
    return Array.from({ length: mracResult.t.length }, (_, i) => ({
      t: mracResult.t[i],
      refModel: mracResult.x_m[i],
      actual: mracResult.x_p[i]
    }));
  }, [mracResult]);

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
            <p className="text-[8px] text-slate-500 uppercase">RMS Error</p>
            <p className="text-sm font-mono text-red-400">{mracResult.rmsError.toFixed(4)}</p>
        </div>
        <div className="flex-1 bg-slate-800 p-2 rounded-xl text-center">
            <p className="text-[8px] text-slate-500 uppercase">θ_r (final)</p>
            <p className="text-sm font-mono text-blue-400">{mracResult.theta_r[mracResult.theta_r.length - 1].toFixed(3)}</p>
        </div>
        <div className="flex-1 bg-slate-800 p-2 rounded-xl text-center">
            <p className="text-[8px] text-slate-500 uppercase">θ_x (final)</p>
            <p className="text-sm font-mono text-emerald-400">{mracResult.theta_x[mracResult.theta_x.length - 1].toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
}
