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
import { Settings2, Search, Activity, Cpu } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SystemIDSimulation() {
  const DEFAULT = { noiseLevel: 0.5, modelType: 'linear' as const };
  const [noiseLevel, setNoiseLevel] = useState(DEFAULT.noiseLevel);
  const [modelType, setModelType] = useState<'linear' | 'parabolic'>(DEFAULT.modelType);
  const [data, setData] = useState<{x: number, y: number, fit: number}[]>([]);

  const reset = () => {
    setNoiseLevel(DEFAULT.noiseLevel);
    setModelType(DEFAULT.modelType);
  };

  const getTakeaway = () => {
    if (noiseLevel > 0.8) return "⚠️ High Noise: הערבוב של רעש גבוה הופך את זיהוי המודל למשימה קשה ולא אמינה. נדרש סינון (Filtering) של הנתונים.";
    if (modelType === 'parabolic') return "🔄 Non-linear ID: זיהוי מודלים ריבועיים מאפשר לתאר מערכות עם תאוצה קבועה או הפסדי אנרגיה לא ליניאריים.";
    return "💡 System ID: המטרה היא למצוא את הקו הכחול שעובר הכי קרוב לכל הנקודות המפוזרות. זהו הבסיס לכל בקרת מודל (MPC).";
  };

  useEffect(() => {
    const rawData = [];
    const points = 20;
    
    // Generate noisy data
    for (let i = 0; i < points; i++) {
       const x = i;
       let yTrue = modelType === 'linear' ? 2 * x + 5 : 0.5 * x * x - 2 * x + 10;
       const yNoisy = yTrue + (Math.random() - 0.5) * noiseLevel * 20;
       rawData.push({ x, y: yNoisy, fit: 0 });
    }

    // Simple Least Squares (Linear only for now to keep it clean)
    let fitData = [...rawData];
    if (modelType === 'linear') {
       const n = points;
       const sumX = rawData.reduce((acc, d) => acc + d.x, 0);
       const sumY = rawData.reduce((acc, d) => acc + d.y, 0);
       const sumXY = rawData.reduce((acc, d) => acc + d.x * d.y, 0);
       const sumX2 = rawData.reduce((acc, d) => acc + d.x * d.x, 0);
       
       const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
       const intercept = (sumY - slope * sumX) / n;
       
       fitData = rawData.map(d => ({ ...d, fit: slope * d.x + intercept }));
    } else {
       // Mock parabolic fit for visualization
       fitData = rawData.map(d => ({ ...d, fit: 0.5 * d.x * d.x - 2 * d.x + 10 }));
    }
    
    setData(fitData);
  }, [noiseLevel, modelType]);

  const chartData = useMemo(() => ({
    labels: data.map(d => d.x),
    datasets: [
      {
        label: 'Collected Data',
        data: data.map(d => d.y),
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        showLine: false,
        pointRadius: 4,
      },
      {
        label: 'Identified Model',
        data: data.map(d => d.fit),
        borderColor: '#00D4FF',
        borderWidth: 3,
        pointRadius: 0,
        tension: modelType === 'parabolic' ? 0.4 : 0,
      }
    ]
  }), [data, modelType]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <Search className="w-5 h-5 text-blue-400" />
          זיהוי מערכות (System Identification)
        </h3>
        <p className="text-sm text-slate-400">
          למדו כיצד אלגוריתמים מוצאים מודל מתמטי (קו רציף) מתוך נתונים רועשים (נקודות). זהו הצעד הראשון בבניית בקרים מתקדמים.
        </p>
      </div>

      <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 mb-6 italic text-sm text-blue-400">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Params</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 mb-2 block uppercase">Noise Intensity</label>
                <input 
                  type="range" min="0" max="1" step="0.1" value={noiseLevel}
                  onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                  className="w-full accent-deep-blue"
                />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] text-slate-400 uppercase">Model Structure</label>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setModelType('linear')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${modelType === 'linear' ? 'bg-deep-blue text-white' : 'bg-slate-700 text-slate-400'}`}
                    >
                      LINEAR
                    </button>
                    <button 
                      onClick={() => setModelType('parabolic')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${modelType === 'parabolic' ? 'bg-deep-blue text-white' : 'bg-slate-700 text-slate-400'}`}
                    >
                      PARABOLIC
                    </button>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
            <div className="flex items-center gap-2 mb-1">
               <Activity className="w-3 h-3 text-deep-blue" />
               <span className="text-[11px] font-bold text-slate-300">Observation</span>
            </div>
            <p className="text-[10px] text-slate-500 italic">
               More noise makes identification harder. Real sensors always have stochastic errors.
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
                x: { grid: { display: false }, ticks: { color: '#64748b' } },
                y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#64748b' } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
