import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings2, Activity, Zap, Play, RotateCcw, Target, Info } from 'lucide-react';

export default function StateSpaceSimulation() {
  const DEFAULT = {
    matrixA: [[-0.2, 1], [-1, -0.2]], // Stable Spiral defaults
    initialState: { x1: 1.5, x2: 1.5 }
  };

  const [matrixA, setMatrixA] = useState(DEFAULT.matrixA);
  const [particles, setParticles] = useState<{x: number, v: number, life: number, id: number}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleId = useRef(0);

  const reset = () => {
    setMatrixA(DEFAULT.matrixA);
    setParticles([]);
  };

  // Eigenvalue calculation for 2x2
  const eigenvalues = useMemo(() => {
    const a = matrixA[0][0];
    const b = matrixA[0][1];
    const c = matrixA[1][0];
    const d = matrixA[1][1];
    
    const trace = a + d;
    const det = a * d - b * c;
    const disc = trace * trace - 4 * det;
    
    if (disc >= 0) {
      const l1 = (trace + Math.sqrt(disc)) / 2;
      const l2 = (trace - Math.sqrt(disc)) / 2;
      return { type: 'Real', values: [l1, l2] };
    } else {
      const re = trace / 2;
      const im = Math.sqrt(-disc) / 2;
      return { type: 'Complex', values: [{re, im}, {re, im: -im}] };
    }
  }, [matrixA]);

  const stabilityStatus = useMemo(() => {
    let stable = true;
    if (eigenvalues.type === 'Real') {
      stable = (eigenvalues.values as number[]).every(v => v < 0);
    } else {
      stable = (eigenvalues.values as any[])[0].re < 0;
    }
    return stable ? 'Stable' : 'Unstable';
  }, [eigenvalues]);

  const getTakeaway = () => {
    if (stabilityStatus === 'Unstable') return "⚠️ Unstable: הערכים העצמיים בצד ימין (Re > 0). כל סטייה קטנה תלך ותגדל בצורה מעריכית.";
    if (eigenvalues.type === 'Complex') return "🔄 Oscillatory Stable: הערכים המרוכבים גורמים למערכת להסתחרר (Spiral) פנימה לכיוון ה-equilibrium.";
    return "📉 Monotonic Stable: הערכים הממשיים גורמים למערכת 'לזחול' חזרה לאפס ללא תנודות (Overdamped).";
  };

  // Particle System
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const next = prev.map(p => {
          const dx = matrixA[0][0] * p.x + matrixA[0][1] * p.v;
          const dv = matrixA[1][0] * p.x + matrixA[1][1] * p.v;
          const dt = 0.05;
          return {
            ...p,
            x: p.x + dx * dt,
            v: p.v + dv * dt,
            life: p.life - 0.01
          };
        }).filter(p => p.life > 0 && Math.abs(p.x) < 5 && Math.abs(p.v) < 5);

        // Add new random particles
        if (next.length < 15) {
          next.push({
            x: (Math.random() - 0.5) * 8,
            v: (Math.random() - 0.5) * 8,
            life: 1.0,
            id: particleId.current++
          });
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [matrixA]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 50;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = -width; i < width; i += scale) {
      ctx.beginPath(); ctx.moveTo(centerX + i, 0); ctx.lineTo(centerX + i, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, centerY + i); ctx.lineTo(width, centerY + i); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
    ctx.stroke();

    // Arrows (Vector Field)
    ctx.strokeStyle = '#1e293b22';
    ctx.lineWidth = 1;
    for (let x = -4; x <= 4; x += 1) {
      for (let v = -4; v <= 4; v += 1) {
        if (x === 0 && v === 0) continue;
        const dx = matrixA[0][0] * x + matrixA[0][1] * v;
        const dv = matrixA[1][0] * x + matrixA[1][1] * v;
        const mag = Math.sqrt(dx * dx + dv * dv);
        const startX = centerX + x * scale;
        const startY = centerY - v * scale;
        const len = 10;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + (dx/mag)*len, startY - (dv/mag)*len);
        ctx.stroke();
      }
    }

    // Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(centerX + p.x * scale, centerY - p.v * scale, 3, 0, Math.PI * 2);
      ctx.fillStyle = stabilityStatus === 'Stable' ? `rgba(16, 185, 129, ${p.life})` : `rgba(244, 63, 94, ${p.life})`;
      ctx.fill();
    });

  }, [matrixA, particles, stabilityStatus]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 10);
    const v = -(e.clientY - rect.top - rect.height / 2) / (rect.height / 8);
    setParticles(prev => [...prev, { x, v, life: 2.0, id: particleId.current++ }]);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white overflow-hidden relative" dir="ltr">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Phase Portrait Explorer</h3>
          <p className="text-[10px] text-slate-500 uppercase font-bold">State Vector Dynamics Lab</p>
        </div>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
             stabilityStatus === 'Stable' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
           }`}>
              {stabilityStatus === 'Stable' ? 'System Stable' : 'System Divergent'}
           </div>
           <button onClick={reset} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all">
             <RotateCcw size={16} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2 relative group">
           <canvas 
             ref={canvasRef}
             width={500}
             height={400}
             onClick={handleCanvasClick}
             className="w-full bg-black/40 rounded-2xl border border-slate-800 cursor-crosshair"
           />
           <div className="absolute bottom-4 left-4 p-2 bg-black/60 rounded-lg text-[10px] opacity-40 group-hover:opacity-100 transition-opacity whitespace-pre font-mono">
              dx/dt = a11x + a12v{"\n"}
              dv/dt = a21x + a22v
           </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
           <div className="bg-black/20 p-4 rounded-2xl border border-slate-800 space-y-6">
              <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-4">Matrix A Parameterization</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Stiffness (Force)</span>
                    <span className="text-emerald-400">{matrixA[1][0].toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="-2" max="2" step="0.1" 
                    value={matrixA[1][0]} 
                    onChange={e => setMatrixA(m => [[m[0][0], m[0][1]], [parseFloat(e.target.value), m[1][1]]])}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Damping (Resist)</span>
                    <span className="text-[#FF6B35]">{matrixA[1][1].toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="-2" max="2" step="0.1" 
                    value={matrixA[1][1]} 
                    onChange={e => setMatrixA(m => [[m[0][0], m[0][1]], [m[1][0], parseFloat(e.target.value)]])}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                 <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black mb-2">Eigenvalues</div>
                 <div className="bg-black/40 p-3 rounded-xl font-mono text-xs text-emerald-500 flex flex-col gap-1">
                   {eigenvalues.type === 'Real' ? (
                     eigenvalues.values.map((v: any, i: number) => <div key={i}>λ_{i+1} = {v.toFixed(3)}</div>)
                   ) : (
                     <div className="text-[10px]">
                        λ = {(eigenvalues.values as any)[0].re.toFixed(2)} ± {(eigenvalues.values as any)[0].im.toFixed(2)}i
                     </div>
                   )}
                 </div>
              </div>
           </div>

           <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-[10px] leading-relaxed flex gap-3">
              <Info size={16} className="text-indigo-400 shrink-0" />
              <p className="text-slate-400">{getTakeaway()}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
