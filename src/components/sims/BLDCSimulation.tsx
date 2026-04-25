import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, RotateCw, RotateCcw, Zap, Activity, Info 
} from 'lucide-react';

export default function BLDCSimulation() {
  const DEFAULT = { speed: 2, isRotating: false, angle: 0, step: 0 };
  const [step, setStep] = useState(DEFAULT.step); 
  const [angle, setAngle] = useState(DEFAULT.angle); 
  const [isRotating, setIsRotating] = useState(DEFAULT.isRotating);
  const [speed, setSpeed] = useState(DEFAULT.speed);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  const reset = () => {
    setStep(DEFAULT.step);
    setAngle(DEFAULT.angle);
    setIsRotating(DEFAULT.isRotating);
    setSpeed(DEFAULT.speed);
  };

  const getTakeaway = () => {
    if (!isRotating) return "⏸️ Paused: השתמש בכפתורי הצעדים (Steps) כדי לראות איך כל שינוי בפאזות מזיז את השדה המגנטי המנחה.";
    if (speed > 7) return "⚡ High Speed: במהירות גבוהה, הקומוטציה כל כך מהירה שהרוטור נראה כאילו הוא נמשך על ידי שדה חלק ורציף.";
    return "💡 6-Step Pattern: שים לב איך בכל רגע נתון רק 2 סלילים פעילים (אחד מושך, אחד דוחף) והשלישי במנוחה.";
  };

  // 6-step Commutation Table (A, B, C)
  const commutationTable = [
    [1, -1, 0], // Step 0: A+, B-
    [1, 0, -1], // Step 1: A+, C-
    [0, 1, -1], // Step 2: B+, C-
    [-1, 1, 0], // Step 3: B+, A-
    [-1, 0, 1], // Step 4: C+, A-
    [0, -1, 1], // Step 5: C+, B-
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    // Draw Stator Coils
    const coilAngles = [ -Math.PI/2, Math.PI/6, 5*Math.PI/6 ]; // A, B, C positions
    const coilLabels = ['A', 'B', 'C'];
    const currents = commutationTable[step];

    coilAngles.forEach((coilAngle, i) => {
      const x = centerX + Math.cos(coilAngle) * radius;
      const y = centerY + Math.sin(coilAngle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fillStyle = currents[i] === 1 ? '#f43f5e' : (currents[i] === -1 ? '#3b82f6' : '#334155');
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(coilLabels[i], x, y + 6);

      if (currents[i] !== 0) {
        ctx.beginPath();
        ctx.moveTo(x, y - (currents[i] * 35));
        ctx.lineTo(x, y - (currents[i] * 45));
        ctx.strokeStyle = currents[i] === 1 ? '#f43f5e' : '#3b82f6';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    });

    // Draw Magnetic Field Vector
    const statorFieldAngle = (step * 60 - 30) * (Math.PI / 180) - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(statorFieldAngle) * 80, centerY + Math.sin(statorFieldAngle) * 80);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 10;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Rotor
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle * Math.PI / 180);

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 70, -Math.PI/2, Math.PI/2);
    ctx.fill();

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 70, Math.PI/2, 3*Math.PI/2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.stroke();

    ctx.restore();
  };

  const animate = () => {
    setAngle(prev => {
      let nextAngle = prev + speed;
      const normalizedAngle = ((nextAngle % 360) + 360) % 360;
      const nextStep = Math.floor(normalizedAngle / 60) % 6;
      setStep(nextStep);
      return nextAngle;
    });
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
  }, [isRotating, step, angle, speed]);

  const handleManualStep = (dir: number) => {
    setIsRotating(false);
    const nextStep = (step + dir + 6) % 6;
    setStep(nextStep);
    setAngle(nextStep * 60 + 30);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              6-Step Commutation Simulator
            </h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={reset}
              className="px-3 py-1 rounded-lg bg-slate-700 text-[10px] font-bold hover:bg-slate-600 transition-colors"
            >
              RESET
            </button>
            <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button 
                onClick={() => handleManualStep(-1)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="px-4 font-mono font-bold text-blue-400">Step {step + 1}</div>
              <button 
                onClick={() => handleManualStep(1)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400">Deep dive into the sequence of phase switching in trapezoidal BLDC control.</p>
      </div>

      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 italic text-sm text-emerald-400">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 h-[400px] bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            className="w-full h-full object-contain"
          />
          
          <div className="absolute bottom-4 left-4 flex gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl">
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase font-black">A</span>
                <div className={`w-3 h-3 rounded-full ${commutationTable[step][0] === 1 ? 'bg-red-500' : (commutationTable[step][0] === -1 ? 'bg-blue-500' : 'bg-slate-700')}`} />
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase font-black">B</span>
                <div className={`w-3 h-3 rounded-full ${commutationTable[step][1] === 1 ? 'bg-red-500' : (commutationTable[step][1] === -1 ? 'bg-blue-500' : 'bg-slate-700')}`} />
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase font-black">C</span>
                <div className={`w-3 h-3 rounded-full ${commutationTable[step][2] === 1 ? 'bg-red-500' : (commutationTable[step][2] === -1 ? 'bg-blue-500' : 'bg-slate-700')}`} />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rotation Control</div>
             <button 
               onClick={() => setIsRotating(!isRotating)}
               className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                 isRotating ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
               }`}
             >
               {isRotating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
               {isRotating ? 'STOP MOTOR' : 'START MOTOR'}
             </button>

             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-slate-400">Rotation Speed</label>
                  <span className="text-emerald-400 font-mono">{speed} RPM-ish</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.5" 
                  value={speed} onChange={e => setSpeed(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
             </div>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-2">
             <div className="text-[10px] text-slate-500 font-black uppercase">Phase Status</div>
             <div className="text-[11px] font-mono">
                {commutationTable[step].map((val, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-700 last:border-0">
                    <span>Coil {['A', 'B', 'C'][i]}:</span>
                    <span className={val === 1 ? 'text-red-400' : (val === -1 ? 'text-blue-400' : 'text-slate-500')}>
                      {val === 1 ? 'POS (+)' : (val === -1 ? 'NEG (-)' : 'FLOAT')}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
