import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, Map as MapIcon, RotateCcw, Play, Target, AlertCircle
} from 'lucide-react';

interface Node {
  x: number;
  y: number;
  parent: number | null;
}

export default function PathPlanningSimulation() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [path, setPath] = useState<Node[]>([]);
  const [obstacles, setObstacles] = useState<{x: number, y: number, r: number}[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const solvingRef = useRef(false);

  const start = { x: 50, y: 50 };
  const goal = { x: 550, y: 350 };

  const initObstacles = () => {
    setObstacles([
      { x: 300, y: 200, r: 50 },
      { x: 150, y: 300, r: 40 },
      { x: 450, y: 100, r: 60 },
      { x: 400, y: 300, r: 45 },
    ]);
  };

  useEffect(() => {
    initObstacles();
    reset();
  }, []);

  const reset = () => {
    setNodes([{ ...start, parent: null }]);
    setPath([]);
    setIsSolving(false);
    solvingRef.current = false;
  };

  const solveRRT = async () => {
    if (solvingRef.current) return;
    solvingRef.current = true;
    setIsSolving(true);

    let currentNodes: Node[] = [{ ...start, parent: null }];
    const stepSize = 30;
    const goalThreshold = 40;

    for (let i = 0; i < 500; i++) {
      if (!solvingRef.current) break;

      // 1. Sample random point (with 10% bias towards goal)
      let randX, randY;
      if (Math.random() < 0.1) {
        randX = goal.x;
        randY = goal.y;
      } else {
        randX = Math.random() * 600;
        randY = Math.random() * 400;
      }

      // 2. Find nearest node
      let nearestIdx = 0;
      let minDist = Infinity;
      currentNodes.forEach((n, idx) => {
        const d = Math.hypot(n.x - randX, n.y - randY);
        if (d < minDist) {
          minDist = d;
          nearestIdx = idx;
        }
      });

      const nearestNode = currentNodes[nearestIdx];

      // 3. Steer
      const angle = Math.atan2(randY - nearestNode.y, randX - nearestNode.x);
      const newNode = {
        x: nearestNode.x + Math.cos(angle) * stepSize,
        y: nearestNode.y + Math.sin(angle) * stepSize,
        parent: nearestIdx
      };

      // 4. Collision Check
      let collision = false;
      for (const obs of obstacles) {
        const d = Math.hypot(newNode.x - obs.x, newNode.y - obs.y);
        if (d < obs.r + 5) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        currentNodes.push(newNode);
        setNodes([...currentNodes]);

        // Check if goal reached
        const distToGoal = Math.hypot(newNode.x - goal.x, newNode.y - goal.y);
        if (distToGoal < goalThreshold) {
          // Trace back path
          const fullPath: Node[] = [];
          let curr: Node | null = newNode;
          while (curr) {
            fullPath.unshift(curr);
            curr = curr.parent !== null ? currentNodes[curr.parent] : null;
          }
          setPath(fullPath);
          setIsSolving(false);
          solvingRef.current = false;
          return;
        }

        // Slow down for visualization
        if (i % 2 === 0) await new Promise(r => setTimeout(r, 10));
      }
    }

    setIsSolving(false);
    solvingRef.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Obstacles
    ctx.fillStyle = '#1e293b';
    obstacles.forEach(obs => {
      ctx.beginPath();
      ctx.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();
    });

    // Draw Tree
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    nodes.forEach(node => {
      if (node.parent !== null) {
        const parent = nodes[node.parent];
        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      }
    });

    // Draw Path
    if (path.length > 0) {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Start & Goal
    drawPoint(ctx, start.x, start.y, '#10b981', 'S');
    drawPoint(ctx, goal.x, goal.y, '#f43f5e', 'G');

  }, [nodes, path, obstacles]);

  const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y + 4);
  };

  const getTakeaway = () => {
    if (isSolving) return "🔍 השטח נסרק... האלגוריתם שולח 'זרועות' אקראיות לכל הכיוונים כדי למצוא פרצה במבוך המכשולים.";
    if (path.length > 0) return "✅ מסלול נמצא! שים לב שהמסלול אינו 'חלק' לגמרי. ברובוטיקה מתקדמת, נבצע אופטימיזציה נוספת כדי להפוך אותו לקשתות רציפות.";
    return "💡 RRT הוא אלגוריתם חזק עבור מרחבים עם הרבה מכשולים. הוא לא מחפש את המסלול הקצר ביותר (כמו A*), אלא את המסלול המהיר ביותר למציאה.";
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-8 font-sans" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white text-right">
          <Navigation className="w-6 h-6 text-emerald-400" />
          מתכנן מסלול RRT (Rapidly-exploring Random Tree)
        </h3>
        <p className="text-sm text-slate-400 text-right">
          גלו איך רובוטים אוטונומיים מוצאים את הדרך שלהם בסביבה לא מוכרת ומלאת מכשולים באמצעות דגימה אקראית.
        </p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 text-right">
        {getTakeaway()}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          {/* Empty to keep the grid layout or removed if not needed */}
        </div>

        <div className="flex gap-2 h-fit">
          <button 
            onClick={reset}
            className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={solveRRT}
            disabled={isSolving || path.length > 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
          >
            {isSolving ? 'מתכנן...' : <><Play className="w-5 h-5" /> חשב מסלול</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-slate-800 relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900/50" />
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            className="w-full h-full object-contain relative z-10"
          />
          
          <AnimatePresence>
            {path.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-6 right-6 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between z-20"
              >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500 rounded-xl">
                      <Target className="w-5 h-5 text-white" />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">מסלול נמצא!</h4>
                      <p className="text-[10px] text-emerald-300 uppercase font-black">{nodes.length} צמתים נדגמו</p>
                   </div>
                </div>
                <button onClick={reset} className="text-xs font-bold text-emerald-400 hover:text-white">ניסיון נוסף</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
           <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50 space-y-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <MapIcon className="w-4 h-4" />
                 איך זה עובד?
              </h4>
              <ol className="text-xs text-slate-400 space-y-4">
                 <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center shrink-0">1</span>
                    <span>דגימה אקראית של נקודה במרחב.</span>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center shrink-0">2</span>
                    <span>חיבור הנקודה לצומת הקרוב ביותר בעץ הקיים.</span>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center shrink-0">3</span>
                    <span>וידוא שאין התנגשות עם מכשולים.</span>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center shrink-0">4</span>
                    <span>חזרה על התהליך עד שהעץ נוגע ביעד.</span>
                 </li>
              </ol>
           </div>

           <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                 <AlertCircle className="w-4 h-4" />
                 שים לב
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                RRT הוא אלגוריתם "הסתברותי שלם" — הוא ימצא פתרון אם הוא קיים, אבל המסלול לא תמיד יהיה הכי קצר או הכי חלק. במציאות, מפעילים עליו "Smoothing" אחרי המציאה.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
