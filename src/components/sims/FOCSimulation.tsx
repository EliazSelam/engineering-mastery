import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Activity, Cpu, Target, Layers, Play, Pause, RotateCw
} from 'lucide-react';

export default function FOCSimulation() {
  const DEFAULT = { iq: 1.0, id: 0.0, speed: 2, isRotating: true };
  const [iq, setIq] = useState(DEFAULT.iq); // Torque component
  const [id, setId] = useState(DEFAULT.id); // Flux component
  const [angle, setAngle] = useState(0); // Electrical angle
  const [isRotating, setIsRotating] = useState(DEFAULT.isRotating);
  const [speed, setSpeed] = useState(DEFAULT.speed);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  const reset = () => {
    setIq(DEFAULT.iq);
    setId(DEFAULT.id);
    setSpeed(DEFAULT.speed);
    setIsRotating(DEFAULT.isRotating);
  };

  const getTakeaway = () => {
    if (id !== 0) return "⚠️ Efficiency Loss: זרם Id שונה מאפס מייצר 'שטף' מיותר בתוך הברזל של המנוע, מה שגורם לחימום ובזבוז אנרגיה ללא תוספת מומנט.";
    if (iq > 1.5) return "🚀 Maximum Torque: זרם Iq גבוה מייצר את המומנט המקסימלי (כוח המשיכה של השדה המגנטי המנחה).";
    return "💡 Field Oriented Control: שים לב איך וקטורי ה-d וה-q נשארים סטטיים ביחס לרוטור, מה שמאפשר שליטה מדויקת כמו במנוע DC.";
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const rad = angle * Math.PI / 180;
    const vectorScale = 80;

    drawAxis(ctx, centerX, centerY, 0, 'α', '#475569');
    drawAxis(ctx, centerX, centerY, -Math.PI/2, 'β', '#475569');
    drawAxis(ctx, centerX, centerY, rad, 'd', '#94a3b8');
    drawAxis(ctx, centerX, centerY, rad - Math.PI/2, 'q', '#94a3b8');

    const ix = id * Math.cos(rad) + iq * Math.cos(rad - Math.PI/2);
    const iy = id * Math.sin(rad) + iq * Math.sin(rad - Math.PI/2);
    
    drawVector(ctx, centerX, centerY, ix * vectorScale, iy * vectorScale, '#3b82f6', 'I_res');
    drawVector(ctx, centerX, centerY, id * Math.cos(rad) * vectorScale, id * Math.sin(rad) * vectorScale, '#10b981', 'Id');
    drawVector(ctx, centerX, centerY, iq * Math.cos(rad - Math.PI/2) * vectorScale, iq * Math.sin(rad - Math.PI/2) * vectorScale, '#f43f5e', 'Iq');

    const statorRadius = 140;
    const phases = [
      { l: 'a', a: -Math.PI/2 },
      { l: 'b', a: Math.PI/6 },
      { l: 'c', a: 5*Math.PI/6 }
    ];

    const valpha = id * Math.cos(rad) - iq * Math.sin(rad);
    const vbeta  = id * Math.sin(rad) + iq * Math.cos(rad);

    const va = valpha;
    const vb = -0.5 * valpha + (Math.sqrt(3)/2) * vbeta;
    const vc = -0.5 * valpha - (Math.sqrt(3)/2) * vbeta;
    const phaseV = [va, vb, vc];

    phases.forEach((p, i) => {
      const px = centerX + Math.cos(p.a) * statorRadius;
      const py = centerY + Math.sin(p.a) * statorRadius;
      const intensity = Math.abs(phaseV[i]);
      const color = phaseV[i] > 0 ? `rgba(244, 63, 94, ${intensity})` : `rgba(59, 130, 246, ${intensity})`;
      ctx.beginPath();
      ctx.arc(px, py, 15, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();
    });

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10, -50, 20, 100);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-10, -50, 20, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-10, 30, 20, 20);
    ctx.restore();
  };

  const drawAxis = (ctx: CanvasRenderingContext2D, cx: number, cy: number, angle: number, label: string, color: string) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * 120, cy + Math.sin(angle) * 120);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.font = '10px monospace';
    ctx.fillText(label, cx + Math.cos(angle) * 135, cy + Math.sin(angle) * 135);
  };

  const drawVector = (ctx: CanvasRenderingContext2D, cx: number, cy: number, vx: number, vy: number, color: string, label: string) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + vx, cy + vy);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    const angle = Math.atan2(vy, vx);
    ctx.beginPath();
    ctx.moveTo(cx + vx, cy + vy);
    ctx.lineTo(cx + vx - 10 * Math.cos(angle - Math.PI/6), cy + vy - 10 * Math.sin(angle - Math.PI/6));
    ctx.lineTo(cx + vx - 10 * Math.cos(angle + Math.PI/6), cy + vy - 10 * Math.sin(angle + Math.PI/6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const animate = () => {
    setAngle(prev => (prev + speed) % 360);
    draw();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRotating) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      draw();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRotating, iq, id, speed]);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-8 font-sans text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                <Cpu className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-black">Vector Control Lab (FOC)</h3>
          </div>
          <button 
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold hover:bg-slate-700 transition-colors border border-slate-700"
          >
            RESET
          </button>
        </div>
        <p className="text-slate-400 text-sm italic">Simulating the transformation of AC signals into a DC-like rotating frame for optimal motor efficiency.</p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 italic text-sm text-blue-400">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 relative aspect-video shadow-inner flex items-center justify-center">
           <canvas ref={canvasRef} width={600} height={400} className="w-full h-full object-contain" />
           <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-1 bg-red-500 rounded-full" />
                 <span className="text-xs font-bold uppercase tracking-tight">Q-Axis (Torque)</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-1 bg-emerald-500 rounded-full" />
                 <span className="text-xs font-bold uppercase tracking-tight">D-Axis (Flux)</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Target className="w-4 h-4" />
                 Real-Time Control
              </h4>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label>Torque Current (Iq)</label>
                       <span className="text-red-400 font-bold">{iq.toFixed(1)}A</span>
                    </div>
                    <input type="range" min="0" max="2" step="0.1" value={iq} onChange={e => setIq(Number(e.target.value))} className="w-full accent-red-500" />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label>Flux Current (Id)</label>
                       <span className="text-emerald-400 font-bold">{id.toFixed(1)}A</span>
                    </div>
                    <input type="range" min="-1" max="1" step="0.1" value={id} onChange={e => setId(Number(e.target.value))} className="w-full accent-emerald-500" />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label>Rotation Speed</label>
                       <span className="text-blue-400 font-bold">{speed}</span>
                    </div>
                    <input type="range" min="0" max="5" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-blue-500" />
                 </div>
              </div>
              <button 
                onClick={() => setIsRotating(!isRotating)}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black transition-all ${
                  isRotating ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-blue-600 text-white shadow-xl shadow-blue-900/20'
                }`}
              >
                {isRotating ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isRotating ? 'PAUSE CONTROL' : 'START VECTOR'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
