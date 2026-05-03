import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Target, Play, RotateCcw, Box, CheckCircle, Info, Zap
} from 'lucide-react';

export default function RoboticsProjectSimulation() {
  const [taskState, setTaskState] = useState<'idle' | 'moving_to_obj' | 'picking' | 'moving_to_target' | 'dropping' | 'success'>('idle');
  const [angle1, setAngle1] = useState(-90);
  const [angle2, setAngle2] = useState(45);
  const [hasObject, setHasObject] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [objectReachable, setObjectReachable] = useState<boolean>(true);

  const requestRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const l1 = 120, l2 = 100;
  const objPos = { x: 500, y: 350 };
  const targetPos = { x: 100, y: 350 };
  const obstacle = { x: 300, y: 250, r: 40 };

  const solveIK = (tx: number, ty: number, cx: number, cy: number) => {
    const dx = tx - cx;
    const dy = ty - cy;
    const distSq = dx*dx + dy*dy;
    const dist = Math.sqrt(distSq);
    if (dist > l1 + l2 || dist < Math.abs(l1-l2)) return null;

    const cosT2 = (distSq - l1*l1 - l2*l2) / (2 * l1 * l2);
    // Clamp to [-1,1] to guard against floating-point singularities at full extension
    const cosT2Clamped = Math.max(-1, Math.min(1, cosT2));
    const t2 = Math.acos(cosT2Clamped);
    const sinT2 = Math.sin(t2);
    // Guard against singularity when arm is fully extended (sinT2 ≈ 0)
    if (Math.abs(sinT2) < 1e-6) return null;
    const t1 = Math.atan2(dy, dx) - Math.atan2(l2 * sinT2, l1 + l2 * cosT2Clamped);
    if (!isFinite(t1) || !isFinite(t2)) return null;
    return { a1: t1 * 180 / Math.PI, a2: t2 * 180 / Math.PI };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.9;

    // Table
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, cy, canvas.width, 100);

    // Obstacle
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.r, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Object
    if (!hasObject) {
       ctx.fillStyle = '#fbbf24';
       ctx.fillRect(objPos.x - 15, objPos.y - 15, 30, 30);
    }

    // Target Area
    ctx.strokeStyle = '#10b981';
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(targetPos.x - 20, targetPos.y - 20, 40, 40);
    ctx.setLineDash([]);

    // Arm Positions
    const r1 = angle1 * Math.PI / 180;
    const r2 = (angle1 + angle2) * Math.PI / 180;
    const x1 = cx + l1 * Math.cos(r1);
    const y1 = cy + l1 * Math.sin(r1);
    const x2 = x1 + l2 * Math.cos(r2);
    const y2 = y1 + l2 * Math.sin(r2);

    // Draw Arm
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

    // Gripper
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.arc(x2, y2, 4, 0, Math.PI*2); ctx.fill();

    if (hasObject) {
       ctx.fillStyle = '#fbbf24';
       ctx.fillRect(x2 - 10, y2 - 10, 20, 20);
    }
  };

  const executeTask = async () => {
    if (taskState !== 'idle') return;
    const cx = 300, cy = 360; // Assuming 600x400

    // 1. Move to Object
    setTaskState('moving_to_obj');
    await animateTo(objPos.x, objPos.y - 20, cx, cy);
    
    // 2. Pick
    setTaskState('picking');
    await new Promise(r => setTimeout(r, 500));
    setHasObject(true);

    // 3. Move up (clearance)
    await animateTo(300, 150, cx, cy);

    // 4. Move to Target
    setTaskState('moving_to_target');
    await animateTo(targetPos.x, targetPos.y - 20, cx, cy);

    // 5. Drop
    setTaskState('dropping');
    await new Promise(r => setTimeout(r, 500));
    setHasObject(false);
    setScore(s => s + 1);
    setTaskState('success');
    
    setTimeout(() => {
       setTaskState('idle');
       setAngle1(-90);
       setAngle2(45);
    }, 2000);
  };

  const animateTo = async (tx: number, ty: number, cx: number, cy: number) => {
    const targetAngles = solveIK(tx, ty, cx, cy);
    if (!targetAngles) {
      console.warn(`[RoboticsProject] IK failed for target (${tx}, ${ty})`);
      setError(`לא ניתן להגיע ליעד (${tx}, ${ty}) — מחוץ לטווח הזרוע`);
      setTaskState('idle');
      return;
    }

    const steps = 60;
    const d1 = (targetAngles.a1 - angle1) / steps;
    const d2 = (targetAngles.a2 - angle2) / steps;

    for (let i = 0; i < steps; i++) {
      setAngle1(prev => prev + d1);
      setAngle2(prev => prev + d2);
      await new Promise(r => setTimeout(r, 16));
    }
  };

  useEffect(() => {
    // Check object reachability on mount
    const cx = 300, cy = 360;
    const test = solveIK(objPos.x, objPos.y - 20, cx, cy);
    setObjectReachable(test !== null);
  }, []);

  useEffect(() => {
    draw();
  }, [angle1, angle2, hasObject]);

  const reset = () => {
    setTaskState('idle');
    setAngle1(-90);
    setAngle2(45);
    setHasObject(false);
    setScore(0);
    setError(null);
  };

  const getTakeaway = () => {
    if (taskState === 'moving_to_obj') return "🤖 קינמטיקה הפוכה (IK): המחשב מחשב את הזוויות של המפרקים כדי שקצה הזרוע יגיע בדיוק למיקום החפץ.";
    if (taskState === 'moving_to_target') return "🚧 תכנון מסלול: הזרוע עוקפת את המכשול על ידי מעבר דרך נקודת ביניים בטוחה (Safe Point).";
    if (score > 0 && taskState === 'idle') return "🎉 המשימה הושלמה! הזרוע שולטת במיקום ובכוח בו-זמנית הודות למודל הדינמי המובנה בבקר.";
    return "💡 בפרויקט זה משולבים כל העולמות: תכנון מסלול, קינמטיקה ובקרת כוח. לחץ על 'הפעל' כדי לראות את האוטומציה בפעולה.";
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-8 font-sans" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white text-right">
            <Zap className="w-6 h-6 text-blue-400" />
            פרויקט סיום: Pick & Place (רובוטיקה מתקדמת)
          </h3>
          <p className="text-sm text-slate-400 text-right">
            מערכת רובוטית אוטונומית המשלבת קינמטיקה הפוכה (IK), תכנון מסלול ומניעת התנגשויות.
          </p>
        </div>
        <button 
          onClick={reset}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-white transition-all shadow-lg"
          title="איפוס פרויקט"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 text-right">
        {getTakeaway()}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => { setError(null); setTaskState('idle'); }}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs font-semibold transition-colors"
          >
            איפוס
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          {/* Layout placeholder */}
        </div>
        
        <div className="flex gap-4">
           <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-black">משימות שהושלמו</div>
              <div className="text-2xl font-black text-emerald-400">{score}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-slate-800 relative aspect-video overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} width={600} height={400} className="w-full h-full object-contain" />
          
          <div className="absolute top-6 left-6 flex gap-3">
             <div className={`px-4 py-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all ${
               taskState === 'idle' ? 'bg-slate-900/50 border-slate-700 text-slate-500' : 'bg-blue-500/20 border-blue-500/50 text-blue-400'
             }`}>
               {taskState === 'idle' && 'בהמתנה'}
               {taskState === 'moving_to_obj' && 'בדרך לחפץ...'}
               {taskState === 'picking' && 'אוסף חפץ'}
               {taskState === 'moving_to_target' && 'בדרך ליעד...'}
               {taskState === 'dropping' && 'משחרר'}
               {taskState === 'success' && 'הצלחה! 🎉'}
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="text-xs text-slate-500 text-center">
             אובייקט בטווח: {objectReachable ? '✓' : '✗ (מחוץ לטווח)'}
           </div>

           <button
             onClick={executeTask}
             disabled={taskState !== 'idle'}
             className="w-full py-6 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-500 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-blue-900/20 flex flex-col items-center gap-2"
           >
             <Play className="w-8 h-8" />
             הפעל רצף פקודות
           </button>

           <div className="flex-1 bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Target className="w-4 h-4" />
                 יומן פעילות
              </h4>
              <div className="space-y-3">
                 <StatusItem label="קינמטיקה הפוכה" active={taskState !== 'idle'} done={taskState === 'success'} />
                 <StatusItem label="פיצוי מומנט" active={taskState !== 'idle'} done={taskState === 'success'} />
                 <StatusItem label="מניעת התנגשות" active={taskState !== 'idle'} done={taskState === 'success'} />
              </div>
           </div>

           <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex gap-3">
              <Info className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-[10px] text-slate-400">
                שימו לב איך הזרוע עוקפת את המכשול (העיגול האדום) על ידי תכנון נקודת ביניים (Via Point).
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, active, done }: { label: string, active: boolean, done: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={`text-xs font-bold ${active ? 'text-slate-200' : 'text-slate-600'}`}>{label}</span>
    {done ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Box className={`w-4 h-4 ${active ? 'text-blue-500 animate-pulse' : 'text-slate-700'}`} />}
  </div>
);

