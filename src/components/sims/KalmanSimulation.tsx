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
import { Settings2, Zap, Sliders, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function KalmanSimulation() {
  const DEFAULT = { processNoise: 0.1, measureNoise: 1.0 };
  const [processNoise, setProcessNoise] = useState(DEFAULT.processNoise);
  const [measureNoise, setMeasureNoise] = useState(DEFAULT.measureNoise);
  const [data, setData] = useState<{t: number, true: number, measured: number, estimate: number}[]>([]);

  const reset = () => {
    setProcessNoise(DEFAULT.processNoise);
    setMeasureNoise(DEFAULT.measureNoise);
  };

  const getTakeaway = () => {
    if (measureNoise > 3.0 && processNoise < 0.05) return "🐢 Laggy Filter: המערכת בוטחת יותר מדי במודל ומתעלמת מהחיישן. זה יוצר סינון חלק מאוד אבל עם איחור (Delay) משמעותי.";
    if (processNoise > 0.5) return "⚡ Nervous Filter: המערכת בוטחת בחיישן יותר מדי. הקו הכתום 'קופץ' ועוקב אחרי הרעש במקום אחרי הערך האמיתי.";
    return "💡 ההגבר של קלמן (K) משתנה בכל צעד כדי למצוא את האיזון המושלם בין המודל לחיישן.";
  };

  useEffect(() => {
    let t = 0;
    let x_true = 0;
    let x_est = 0;
    let P = 1;
    const Q = processNoise * 0.1;
    const R = measureNoise;
    
    const newData = [];
    for (let i = 0; i < 50; i++) {
       // Truth
       x_true += (Math.random() - 0.5) * 0.5;
       
       // Measurement
       const z = x_true + (Math.random() - 0.5) * R * 2;
       
       // Kalman Predict
       // x_est = x_est
       P = P + Q;
       
       // Kalman Update
       const K = P / (P + R);
       x_est = x_est + K * (z - x_est);
       P = (1 - K) * P;
       
       newData.push({ t, true: x_true, measured: z, estimate: x_est });
       t += 1;
    }
    setData(newData);
  }, [processNoise, measureNoise]);

  const chartData = useMemo(() => ({
    labels: data.map(d => d.t),
    datasets: [
      {
        label: 'True Value',
        data: data.map(d => d.true),
        borderColor: '#00D4FF',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Measured (Noisy)',
        data: data.map(d => d.measured),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        pointRadius: 2,
        showLine: false,
      },
      {
        label: 'Kalman Estimate',
        data: data.map(d => d.estimate),
        borderColor: '#FF6B35',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.1,
      }
    ]
  }), [data]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-blue-400" />
          סימולטור מסנן קלמן (Kalman Filter Tuning)
        </h3>
        <p className="text-sm text-slate-400">
          למדו איך מסנן קלמן משלב בין מודל מתמטי (Predict) למדידות חיישן (Update) כדי להעריך את המצב האמיתי של המערכת.
        </p>
      </div>

      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 mb-6 italic text-sm text-[#FF6B35]">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Parameters</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-[10px] text-slate-400 uppercase mb-2">
                  Process Noise (Q)
                  <span className="text-deep-blue">{processNoise.toFixed(2)}</span>
                </label>
                <input 
                  type="range" min="0" max="1" step="0.01" value={processNoise}
                  onChange={(e) => setProcessNoise(parseFloat(e.target.value))}
                  className="w-full accent-deep-blue"
                />
              </div>
              <div>
                <label className="flex justify-between text-[10px] text-slate-400 uppercase mb-2">
                  Measure Noise (R)
                  <span className="text-coral">{measureNoise.toFixed(2)}</span>
                </label>
                <input 
                  type="range" min="0.1" max="5" step="0.1" value={measureNoise}
                  onChange={(e) => setMeasureNoise(parseFloat(e.target.value))}
                  className="w-full accent-coral"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-xl text-[11px] text-slate-400 italic border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-3 h-3 text-deep-blue" />
              <span className="font-bold">Insight:</span>
            </div>
            Lower Q and higher R makes the filter "laggy" but smoother. 
            Higher Q makes it follow the noise more closely.
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-800/20 rounded-2xl p-4 border border-slate-700/50 min-h-[300px]">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } } },
                tooltip: { backgroundColor: '#1e293b' }
              },
              scales: {
                x: { display: false },
                y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#64748b', font: { size: 10 } } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
