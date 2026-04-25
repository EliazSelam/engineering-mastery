import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Settings2, Zap, ShieldCheck, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdvancedPIDSimulation() {
  const DEFAULT = { antiWindup: true, target: 10, kp: 2.0, ki: 5.0 };
  const [antiWindup, setAntiWindup] = useState(DEFAULT.antiWindup);
  const [target, setTarget] = useState(DEFAULT.target);
  const [kp, setKp] = useState(DEFAULT.kp);
  const [ki, setKi] = useState(DEFAULT.ki);
  const [data, setData] = useState<{t: number, value: number, integral: number}[]>([]);

  const reset = () => {
    setAntiWindup(DEFAULT.antiWindup);
    setTarget(DEFAULT.target);
    setKp(DEFAULT.kp);
    setKi(DEFAULT.ki);
  };

  const getTakeaway = () => {
    if (!antiWindup && ki > 10) return "⚠️ Windup Alert: ללא הגנת Anti-Windup, האינטגרטור צובר שגיאה עצומה בזמן רוויה. כשהמערכת חוזרת לתחום הליניארי, יש Over-correction קיצוני.";
    if (antiWindup) return "✅ Protected: הגנת Anti-Windup 'עוצרת' את האינטגרטור כשהמפעיל מגיע למקסימום, מה שמונע קפיצות מסוכנות בחזרה.";
    return "💡 נסו להגדיל את Ki ללא Anti-Windup וראו איך הגרף הכתום (Integral) משתגע.";
  };

  useEffect(() => {
    let t = 0;
    let value = 0;
    let integral = 0;
    let lastError = 0;
    const dt = 0.1;
    const maxOutput = 5; // Actuator saturation

    const newData = [];
    for (let i = 0; i < 100; i++) {
       const error = target - value;
       
       // Proportional
       const P = kp * error;
       
       // Integral (with optional Anti-Windup)
       let output = P + ki * (integral + error * dt);
       
       if (antiWindup) {
          // Simplest anti-windup: stop integrating if saturated
          if (Math.abs(output) < maxOutput) {
             integral += error * dt;
          }
       } else {
          integral += error * dt;
       }
       
       output = Math.max(-maxOutput, Math.min(maxOutput, P + ki * integral));
       
       // Simple Plant Dynamics (1st order)
       value += (output * 0.5 - value * 0.1) * dt;
       
       newData.push({ t: parseFloat(t.toFixed(1)), value, integral });
       t += dt;
    }
    setData(newData);
  }, [kp, ki, target, antiWindup]);

  const chartData = useMemo(() => ({
    labels: data.map(d => d.t),
    datasets: [
      {
        label: 'System Output',
        data: data.map(d => d.value),
        borderColor: '#00D4FF',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Target',
        data: data.map(() => target),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: 'Integral State',
        data: data.map(d => d.integral),
        borderColor: '#FF6B35',
        borderWidth: 1,
        pointRadius: 0,
        yAxisID: 'y1',
      }
    ]
  }), [data, target]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          סימולטור Anti-Windup (Integral Windup Protection)
        </h3>
        <p className="text-sm text-slate-400">
          ראו כיצד האינטגרטור "משתגע" כשהמפעיל מגיע לקצה היכולת שלו (Saturation) ואיך מנגנוני הגנה מונעים קפיצות מסוכנות בחזרה.
        </p>
      </div>

      <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 italic text-sm text-orange-400 mb-6">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Tuning</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-[10px] text-slate-400 mb-2">Kp (Gain)</label>
                <input 
                  type="range" min="0" max="10" step="0.5" value={kp}
                  onChange={(e) => setKp(parseFloat(e.target.value))}
                  className="w-full accent-deep-blue"
                />
              </div>
              <div>
                <label className="flex justify-between text-[10px] text-slate-400 mb-2">Ki (Integral)</label>
                <input 
                  type="range" min="0" max="20" step="1" value={ki}
                  onChange={(e) => setKi(parseFloat(e.target.value))}
                  className="w-full accent-coral"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-xl text-[11px] text-slate-400 italic border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3 text-coral" />
              <span className="font-bold">Mechanism:</span>
            </div>
            Windup occurs when the error persists and the integral grows too large while the actuator is saturated.
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-800/20 rounded-2xl p-4 border border-slate-700/50 min-h-[300px]">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#64748b' } },
                y1: { position: 'right', display: false }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
