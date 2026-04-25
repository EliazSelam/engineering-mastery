import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Settings, Info, RefreshCw, Move
} from 'lucide-react';

export default function KinematicsSimulation() {
  const [theta1, setTheta1] = useState(45); // Degrees
  const [theta2, setTheta2] = useState(45); // Degrees
  const [targetX, setTargetX] = useState(200);
  const [targetY, setTargetY] = useState(100);
  const [mode, setMode] = useState<'FK' | 'IK'>('FK');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const l1 = 120; // Length of limb 1
  const l2 = 100; // Length of limb 2

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.8;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 50) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }

    // Positions
    const t1Rad = theta1 * Math.PI / 180;
    const t2Rad = (theta1 + theta2) * Math.PI / 180;

    const x1 = cx + l1 * Math.cos(-t1Rad);
    const y1 = cy + l1 * Math.sin(-t1Rad);
    const x2 = x1 + l2 * Math.cos(-t2Rad);
    const y2 = y1 + l2 * Math.sin(-t2Rad);

    // Target (if in IK)
    if (mode === 'IK') {
      ctx.beginPath();
      ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.fill();
    }

    // Arm shadow
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Arm skeleton
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Joints
    drawJoint(ctx, cx, cy, '#1e293b');
    drawJoint(ctx, x1, y1, '#3b82f6');
    drawJoint(ctx, x2, y2, '#f8fafc'); // End effector
  };

  const drawJoint = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const solveIK = (tx: number, ty: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.8;

    const dx = tx - cx;
    const dy = ty - cy;
    const distSq = dx*dx + dy*dy;
    const dist = Math.sqrt(distSq);

    if (dist > l1 + l2 || dist < Math.abs(l1 - l2)) return;

    // Law of cosines: cos(theta2) = (x^2 + y^2 - l1^2 - l2^2) / (2*l1*l2)
    const cosT2 = (distSq - l1*l1 - l2*l2) / (2 * l1 * l2);
    const t2 = Math.acos(cosT2); // Internal angle

    // theta1 = atan2(y, x) - atan2(l2*sin(t2), l1 + l2*cos(t2))
    const t1 = Math.atan2(dy, dx) - Math.atan2(l2 * Math.sin(t2), l1 + l2 * Math.cos(t2));

    setTheta1(-(t1 * 180 / Math.PI));
    setTheta2(-(t2 * 180 / Math.PI));
  };

  useEffect(() => {
    draw();
  }, [theta1, theta2, targetX, targetY, mode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'IK') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTargetX(x);
    setTargetY(y);
    solveIK(x, y);
  };

  const reset = () => {
    setTheta1(45);
    setTheta2(45);
    setTargetX(200);
    setTargetY(100);
    setMode('FK');
  };

  const getTakeaway = () => {
    if (mode === 'IK') return "🎯 Inverse Kinematics: בשיטה זו אנו מגדירים את היעד הסופי, והבקר מחשב את הזוויות הדרושות למפרקים.";
    if (Math.abs(theta1) > 90 || Math.abs(theta2) > 90) return "📏 Limits: זוויות קיצוניות עלולות לגרום למתיחה מקסימלית של הזרוע (Singularity) - מצב שבו קשה לשלוט בתנועה.";
    return "💡 Forward Kinematics: כאן אנו שולטים ישירות בזוויות המפרקים ורואים לאן הקצה מגיע.";
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-8 font-sans" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black mb-1 flex items-center gap-2 text-white">
             <Move className="w-6 h-6 text-blue-400" />
             סימולטור זרוע דו-מפרקית (Robot Kinematics)
           </h3>
           <p className="text-slate-400 text-sm">הבינו את ההבדל בין קינמטיקה ישירה (FK) להפוכה (IK) בזרוע רובוטית.</p>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={reset}
             className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold border border-slate-700 hover:bg-slate-700 transition-all text-xs"
           >
             איפוס
           </button>
           <div className="bg-slate-800 p-1.5 rounded-2xl border border-slate-700 flex gap-1">
              <button 
                onClick={() => setMode('FK')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'FK' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Forward (FK)
              </button>
              <button 
                onClick={() => setMode('IK')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'IK' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Inverse (IK)
              </button>
           </div>
        </div>
      </div>

      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 italic text-sm text-blue-400">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[450px]">
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden group">
           <canvas 
             ref={canvasRef} 
             width={600} 
             height={400} 
             onClick={handleCanvasClick}
             className={`w-full h-full object-contain ${mode === 'IK' ? 'cursor-crosshair' : ''}`}
           />
           
           {mode === 'IK' && (
             <div className="absolute top-4 right-4 bg-blue-500/10 backdrop-blur border border-blue-500/20 px-4 py-2 rounded-xl text-[10px] text-blue-400 font-bold flex items-center gap-2">
               <RefreshCw className="w-3 h-3 animate-spin" />
               לחצו על המסך לחישוב IK
             </div>
           )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Settings className="w-4 h-4" />
                 מפרקי המערכת
              </h4>

              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label>זווית מפרק 1 (θ1)</label>
                       <span className="text-blue-400 font-bold">{theta1.toFixed(1)}°</span>
                    </div>
                    <input 
                      type="range" min="0" max="180" step="1" 
                      value={theta1} onChange={e => { setMode('FK'); setTheta1(Number(e.target.value)); }} 
                      className="w-full accent-blue-500" 
                    />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-2">
                       <label>זווית מפרק 2 (θ2)</label>
                       <span className="text-blue-300 font-bold">{theta2.toFixed(1)}°</span>
                    </div>
                    <input 
                      type="range" min="-150" max="150" step="1" 
                      value={theta2} onChange={e => { setMode('FK'); setTheta2(Number(e.target.value)); }} 
                      className="w-full accent-blue-400" 
                    />
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <div className="text-[10px] text-slate-500 uppercase font-black">מיקום קצה (EE)</div>
                       <div className="text-lg font-mono text-slate-200">
                         X: {(targetX - 300).toFixed(0)}, Y: {(240 - targetY).toFixed(0)}
                       </div>
                    </div>
                    <div className="p-2 bg-slate-800 rounded-xl">
                       <Target className="w-5 h-5 text-slate-500" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex-1 bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 flex flex-col gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl w-fit">
                 <Info className="w-4 h-4 text-blue-400" />
              </div>
              <h5 className="font-bold text-sm text-slate-200">טיפ מתמטי</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                שימו לב שקינמטיקה ישירה היא פונקציה תלויה (לכל סט זוויות יש מיקום אחד), 
                אבל בקינמטיקה הפוכה ייתכנו מספר פתרונות לאותו מיקום (כמו מצב "מרפק למעלה" או "מרפק למטה").
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
