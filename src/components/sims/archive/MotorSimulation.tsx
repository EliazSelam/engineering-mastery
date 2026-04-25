import React, { useState, useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Filler,
  type ChartConfiguration,
} from 'chart.js';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { cn } from '@/src/lib/utils';
import { HelpCircle, Info, Play, RotateCcw, Zap, Terminal } from 'lucide-react';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler);

const KM = 10;   // motor gain (rad/s per Volt)
const TAU = 0.8;  // time constant (seconds)
const DT = 0.04; // timestep (seconds) -> 25fps
const HIST = 150;  // samples shown

const GLOSSARY: Record<string, string> = {
  Kp: 'רווח פרופורציונלי (Proportional Gain). קובע כמה חזק הבקר יגיב לשגיאה. Kp גבוה = תגובה חזקה.',
  ref: 'ערך רצוי (Setpoint). המהירות שאליה אנחנו רוצים שהמנוע יגיע.',
  friction: 'חיכוך/עומס. כוח שמתנגד לתנועת המנוע. בסימולציה זה מדמה הפרעה קבועה.',
  error: 'שגיאה (e). ההפרש בין המהירות הרצויה למהירות בפועל.',
  u: 'אות בקרה (Control Signal). המתח שהבקר שולח למנוע.',
  y: 'מהירות בפועל (Output). המהירות הנמדדת של המנוע בזמן אמת.',
  sse: 'שגיאת מצב מתמיד (Steady-State Error). השגיאה שנשארת אחרי שהמערכת התייצבה.',
};

interface Trace {
  y: number[];
  ref: number[];
  e: number[];
  u: number[];
  labels: string[];
}

export default function MotorSimulation() {
  const [kp, setKp] = useState(0.5);
  const [setpoint, setSetpoint] = useState(10);
  const [friction, setFriction] = useState(2);
  const [mode, setMode] = useState<'closed' | 'open'>('closed');
  const [running, setRunning] = useState(true);
  const [disturbance, setDisturbance] = useState(false);
  
  const [currentY, setCurrentY] = useState(0);
  const [currentE, setCurrentE] = useState(0);
  const [currentU, setCurrentU] = useState(0);

  const chartRef1 = useRef<HTMLCanvasElement>(null);
  const chartRef2 = useRef<HTMLCanvasElement>(null);
  const chartInstance1 = useRef<Chart | null>(null);
  const chartInstance2 = useRef<Chart | null>(null);
  
  const stateRef = useRef({ y: 0, t: 0 });
  const historyRef = useRef<Trace>({ y: [], ref: [], e: [], u: [], labels: [] });

  // Initialize charts
  useEffect(() => {
    if (chartRef1.current && !chartInstance1.current) {
      const config1: ChartConfiguration = {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            { label: 'y(t) — מהירות בפועל', data: [], borderColor: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', fill: true, tension: 0.3, pointRadius: 0 },
            { label: 'ref — מטרה', data: [], borderColor: '#60a5fa', borderDash: [6, 3], fill: false, pointRadius: 0 },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: 'index', intersect: false },
          scales: {
            x: { display: false },
            y: { min: 0, max: 20, ticks: { color: 'hsl(222 15% 50%)' }, grid: { color: 'hsl(220 20% 92%)' } }
          },
          plugins: { 
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              rtl: true,
              textDirection: 'rtl',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              titleColor: 'hsl(222 25% 18%)',
              bodyColor: 'hsl(222 15% 45%)',
              borderColor: 'hsl(220 20% 88%)',
              borderWidth: 1,
              padding: 12,
              boxPadding: 6,
              usePointStyle: true,
              titleFont: { size: 13, weight: 'bold' },
              bodyFont: { size: 11 },
              callbacks: {
                label: (context: any) => {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.parsed.y !== null) label += context.parsed.y.toFixed(2);
                  return label;
                },
                afterLabel: (context: any) => {
                  const label = context.dataset.label;
                  const key = label.includes('y(t)') ? 'y' : 
                              label.includes('ref') ? 'ref' : null;
                  if (!key) return '';
                  const text = GLOSSARY[key];
                  const words = text.split(' ');
                  const lines = [];
                  let currentLine = '';
                  words.forEach(word => {
                    if ((currentLine + word).length > 45) {
                      lines.push(currentLine);
                      currentLine = word + ' ';
                    } else {
                      currentLine += word + ' ';
                    }
                  });
                  lines.push(currentLine);
                  return lines.map(l => '  ' + l);
                }
              }
            }
          }
        }
      };
      chartInstance1.current = new Chart(chartRef1.current, config1);
    }

    if (chartRef2.current && !chartInstance2.current) {
      const config2: ChartConfiguration = {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            { label: 'e(t) — שגיאה', data: [], borderColor: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.1)', fill: true, tension: 0.3, pointRadius: 0 },
            { label: 'u(t) — אות בקרה', data: [], borderColor: '#f59e0b', fill: false, tension: 0.3, pointRadius: 0 },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: 'index', intersect: false },
          scales: {
            x: { display: false },
            y: { min: -5, max: 15, ticks: { color: 'hsl(222 15% 50%)' }, grid: { color: 'hsl(220 20% 92%)' } }
          },
          plugins: { 
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              rtl: true,
              textDirection: 'rtl',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              titleColor: 'hsl(222 25% 18%)',
              bodyColor: 'hsl(222 15% 45%)',
              borderColor: 'hsl(220 20% 88%)',
              borderWidth: 1,
              padding: 12,
              boxPadding: 6,
              usePointStyle: true,
              titleFont: { size: 13, weight: 'bold' },
              bodyFont: { size: 11 },
              callbacks: {
                label: (context: any) => {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.parsed.y !== null) label += context.parsed.y.toFixed(2);
                  return label;
                },
                afterLabel: (context: any) => {
                  const label = context.dataset.label;
                  const key = label.includes('e(t)') ? 'error' : 
                              label.includes('u(t)') ? 'u' : null;
                  if (!key) return '';
                  const text = GLOSSARY[key];
                  const words = text.split(' ');
                  const lines = [];
                  let currentLine = '';
                  words.forEach(word => {
                    if ((currentLine + word).length > 45) {
                      lines.push(currentLine);
                      currentLine = word + ' ';
                    } else {
                      currentLine += word + ' ';
                    }
                  });
                  lines.push(currentLine);
                  return lines.map(l => '  ' + l);
                }
              }
            }
          }
        }
      };
      chartInstance2.current = new Chart(chartRef2.current, config2);
    }

    return () => {
      chartInstance1.current?.destroy();
      chartInstance2.current?.destroy();
      chartInstance1.current = null;
      chartInstance2.current = null;
    };
  }, []);

  // Simulation Loop
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      const { y } = stateRef.current;
      
      let u = 0;
      let e = 0;

      if (mode === 'closed') {
        e = setpoint - y;
        u = kp * e;
      } else {
        // Open loop: just send a fixed voltage based on setpoint
        u = setpoint / 2; 
        e = setpoint - y;
      }

      // Physics: First order motor model + friction
      const totalFriction = disturbance ? friction * 3 : friction;
      const dy = (DT / TAU) * (KM * u - y - totalFriction);
      const nextY = Math.max(0, y + dy);

      stateRef.current.y = nextY;
      stateRef.current.t += DT;

      // Update History
      const h = historyRef.current;
      h.y.push(nextY);
      h.ref.push(setpoint);
      h.e.push(e);
      h.u.push(u);
      h.labels.push('');

      if (h.y.length > HIST) {
        h.y.shift();
        h.ref.shift();
        h.e.shift();
        h.u.shift();
        h.labels.shift();
      }

      // Update UI State (throttled)
      setCurrentY(nextY);
      setCurrentE(e);
      setCurrentU(u);

      // Update Charts
      if (chartInstance1.current) {
        chartInstance1.current.data.labels = h.labels;
        chartInstance1.current.data.datasets[0].data = h.y;
        chartInstance1.current.data.datasets[1].data = h.ref;
        chartInstance1.current.update('none');
      }
      if (chartInstance2.current) {
        chartInstance2.current.data.labels = h.labels;
        chartInstance2.current.data.datasets[0].data = h.e;
        chartInstance2.current.data.datasets[1].data = h.u;
        chartInstance2.current.update('none');
      }

    }, DT * 1000);

    return () => clearInterval(interval);
  }, [running, kp, setpoint, friction, mode, disturbance]);

  const resetSim = () => {
    stateRef.current = { y: 0, t: 0 };
    historyRef.current = { y: [], ref: [], e: [], u: [], labels: [] };
    setCurrentY(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1">בקרת מהירות מנוע (DC Motor Control)</h3>
        <p className="text-sm text-[hsl(var(--color-text-muted))]">
          חקר ההבדלים בין חוג פתוח לחוג סגור, השפעת החיכוך ותגובת הבקר להפרעות חיצוניות.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-xl p-5 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">פרמטרים</h4>
            <div className="flex gap-2">
              <button onClick={() => setRunning(!running)} className="p-2 rounded-lg bg-[hsl(var(--color-surface-2))] hover:bg-[hsl(var(--color-border))] transition-colors">
                <Play size={18} className={running ? 'fill-current' : ''} />
              </button>
              <button onClick={resetSim} className="p-2 rounded-lg bg-[hsl(var(--color-surface-2))] hover:bg-[hsl(var(--color-border))] transition-colors">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          <div className="flex p-1 bg-[hsl(var(--color-surface-2))] rounded-lg">
            <button 
              onClick={() => setMode('closed')}
              className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-all", mode === 'closed' ? "bg-white shadow-sm text-[hsl(var(--color-primary))]" : "text-[hsl(var(--color-text-muted))]")}
            >
              לולאה סגורה
            </button>
            <button 
              onClick={() => setMode('open')}
              className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-all", mode === 'open' ? "bg-white shadow-sm text-[hsl(var(--color-primary))]" : "text-[hsl(var(--color-text-muted))]")}
            >
              לולאה פתוחה
            </button>
          </div>

          <SliderRow label="ω_ref (מטרה)" value={setpoint} min={0} max={15} step={1} unit="rad/s" onChange={setSetpoint} term="ref" />
          <SliderRow label="Kp (רווח)" value={kp} min={0.1} max={5} step={0.1} onChange={setKp} term="Kp" danger={kp > 3} />
          <SliderRow label="חיכוך" value={friction} min={0} max={5} step={0.5} onChange={setFriction} term="friction" />

          <button 
            onMouseDown={() => setDisturbance(true)}
            onMouseUp={() => setDisturbance(false)}
            onMouseLeave={() => setDisturbance(false)}
            onTouchStart={() => setDisturbance(true)}
            onTouchEnd={() => setDisturbance(false)}
            className={cn(
              "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2",
              disturbance ? "bg-[hsl(var(--color-error))] text-white border-[hsl(var(--color-error))]" : "bg-[hsl(var(--color-pastel-red))] text-[hsl(var(--color-error))] border-transparent hover:border-[hsl(var(--color-error))]"
            )}
          >
            <Zap size={18} />
            הפעל הפרעה חיצונית
          </button>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-xl p-4 h-[240px] shadow-sm relative">
            <canvas ref={chartRef1} />
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded border text-xs font-mono">
              y: {currentY.toFixed(2)} | ref: {setpoint.toFixed(1)}
            </div>
          </div>
          <div className="bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-xl p-4 h-[180px] shadow-sm relative">
            <canvas ref={chartRef2} />
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded border text-xs font-mono">
              e: {currentE.toFixed(2)} | u: {currentU.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dynamic Equation */}
        <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col gap-4 shadow-xl border border-slate-800">
           <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
              <Terminal size={14} />
              מודל פיזיקלי חי (First-Order Plant)
           </div>
           <div 
             className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-center min-h-[80px]"
             dangerouslySetInnerHTML={{ 
               __html: katex.renderToString(
                 `\\tau\\dot{y} + y = K_m u \\implies \\dot{y} = \\frac{${KM} \\cdot ${currentU.toFixed(2)} - ${currentY.toFixed(2)} - ${(disturbance ? friction * 3 : friction).toFixed(2)}}{${TAU}}`,
                 { throwOnError: false, displayMode: true }
               ) 
             }} 
           />
           <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              המשוואה מתארת את שינוי המהירות בזמן כפונקציה של המתח (u), המהירות הנוכחית (y) והחיכוך.
           </p>
        </div>

        {/* Insights */}
        <div className="bg-[hsl(var(--color-pastel-teal))] border border-[hsl(var(--color-primary))] rounded-xl p-6 flex flex-col gap-3">
          <h5 className="font-bold text-[hsl(var(--color-primary))] flex items-center gap-2">
            <Info size={16} />
            תובנה הנדסית
          </h5>
          <p className="text-sm text-[hsl(var(--color-text-muted))] leading-relaxed h-full flex items-center">
            {mode === 'open' ? (
              "בלולאה פתוחה, המנוע לא יודע מה המהירות שלו. אם תפעיל הפרעה, המהירות תצנח והמערכת לא תתקן את עצמה."
            ) : kp > 3 ? (
              "שים לב! Kp גבוה מדי גורם לתנודות חריפות. המערכת הופכת למהירה מאוד אבל פחות יציבה."
            ) : Math.abs(currentE) > 0.5 ? (
              "בקר P לבד תמיד משאיר שגיאת מצב מתמיד (SSE). ככל ש-Kp גדל השגיאה קטנה, אבל היא לעולם לא תתאפס לגמרי בלי אינטגרטור (I)."
            ) : (
              "המערכת יציבה. נסה להגדיל את החיכוך ולראות איך הבקר 'נלחם' כדי לשמור על המהירות קרובה למטרה."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange, term, danger }: any) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-[hsl(var(--color-text-muted))]">{label}</label>
          <button onClick={() => setShowTip(!showTip)} className="text-[hsl(var(--color-text-faint))] hover:text-[hsl(var(--color-primary))] transition-colors">
            <HelpCircle size={14} />
          </button>
        </div>
        <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded bg-[hsl(var(--color-surface-2))]", danger && "text-[hsl(var(--color-error))] font-bold")}>
          {value.toFixed(2)} {unit}
        </span>
      </div>
      {showTip && (
        <div className="text-xs bg-[hsl(var(--color-surface-2))] p-2 rounded border border-[hsl(var(--color-border))] mb-1 leading-tight text-right">
          {GLOSSARY[term]}
        </div>
      )}
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-[hsl(var(--color-border))] rounded-lg appearance-none cursor-pointer accent-[hsl(var(--color-primary))]"
      />
    </div>
  );
}
