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
import { Settings2, Target, Activity, Battery, RotateCcw } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LQRSimulation() {
  const DEFAULT = { qPerformance: 10, rEnergy: 1 };
  const [qPerformance, setQPerformance] = useState(DEFAULT.qPerformance);
  const [rEnergy, setREnergy] = useState(DEFAULT.rEnergy);
  const [data, setData] = useState<{t: number, value: number, effort: number}[]>([]);

  const reset = () => {
    setQPerformance(DEFAULT.qPerformance);
    setREnergy(DEFAULT.rEnergy);
  };

  const getTakeaway = () => {
    if (qPerformance / rEnergy > 80) return "🚀 High Performance: הבקר 'תוקפני' מאוד. השגיאה דועכת מיד, אבל מחיר האנרגיה (Effort) בשיא. זה עלול לשרוף מנועים במציאות.";
    if (rEnergy / qPerformance > 5) return "🐢 Energy Saving: הבקר שמרני מאוד. אנחנו חוסכים סוללה, אך המערכת לוקחת המון זמן להגיע ליעד.";
    return "💡 LQR מוצא את הטרייד-אוף המתמטי האופטימלי בין 'כמה מהר נגיע' לבין 'כמה דלק נבזבז'.";
  };

  useEffect(() => {
    let t = 0;
    let x = 10; // Initial state error
    const dt = 0.1;

    // Simple 1D LQR: u = -k*x
    // System: dx = u
    // Cost: J = sum(Q*x^2 + R*u^2)
    // For dx = u (integrator), optimal K = sqrt(Q/R)
    const k = Math.sqrt(qPerformance / rEnergy);

    const newData = [];
    for (let i = 0; i < 50; i++) {
       const u = -k * x;
       x += u * dt;
       
       newData.push({ t, value: x, effort: Math.abs(u) });
       t += dt;
    }
    setData(newData);
  }, [qPerformance, rEnergy]);

  const chartData = useMemo(() => ({
    labels: data.map(d => d.t.toFixed(1)),
    datasets: [
      {
        label: 'Error (Performance)',
        data: data.map(d => d.value),
        borderColor: '#00D4FF',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Effort (Energy)',
        data: data.map(d => d.effort),
        borderColor: '#FF6B35',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.1,
      }
    ]
  }), [data]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex justify-between items-center">
        <div className="space-y-1 text-right">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-blue-400" />
            אופטימיזציית LQR (Linear Quadratic Regulator)
          </h3>
          <p className="text-sm text-slate-400">
            חקרו איך אלגוריתם LQR מוצא את האיזון האופטימלי בין מהירות תגובה (Q) לבין המאמץ והאנרגיה המושקעים (R).
          </p>
        </div>
        <button 
          onClick={reset}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-white transition-all shadow-lg"
          title="איפוס הגדרות"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 mb-6 italic text-sm text-[#00D4FF]">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Weights</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-[10px] text-slate-400 mb-2">Q (Performance)</label>
                <input 
                  type="range" min="1" max="100" step="1" value={qPerformance}
                  onChange={(e) => setQPerformance(parseFloat(e.target.value))}
                  className="w-full accent-deep-blue"
                />
              </div>
              <div>
                <label className="flex justify-between text-[10px] text-slate-400 mb-2">R (Control Effort)</label>
                <input 
                  type="range" min="0.1" max="50" step="0.5" value={rEnergy}
                  onChange={(e) => setREnergy(parseFloat(e.target.value))}
                  className="w-full accent-coral"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
            <div className="flex items-center gap-2 mb-1">
               <Activity className="w-3 h-3 text-coral" />
               <span className="text-[11px] font-bold text-slate-300">Optimal Gain</span>
            </div>
            <p className="text-[10px] text-slate-500 italic">
               LQR minimizes the total cost. High Q makes the controller aggressive. High R makes it conservative.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-800/20 rounded-2xl p-4 border border-slate-700/50 min-h-[300px]">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#64748b' } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
