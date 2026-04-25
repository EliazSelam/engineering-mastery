import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, MousePointer2, Info, Activity, ShieldAlert, Zap, RotateCcw } from 'lucide-react';

interface Point { x: number; y: number; }

export const PhaseSimulation: React.FC = () => {
  // Matrix A: [[a11, a12], [a21, a22]]
  const [a11, setA11] = useState(-1);
  const [a12, setA12] = useState(1);
  const [a21, setA21] = useState(-2);
  const [a22, setA22] = useState(-1);
  
  const [trajectories, setTrajectories] = useState<Point[][]>([]);
  const [isHovering, setIsHovering] = useState<Point | null>(null);

  // Compute eigenvalues for 2x2 matrix
  const stats = useMemo(() => {
    // Tr(A) = a11 + a22
    // Det(A) = a11*a22 - a12*a21
    const tr = a11 + a22;
    const det = a11 * a22 - a12 * a21;
    const disc = tr * tr - 4 * det;
    
    let type = '';
    let stability = '';
    
    if (disc > 0) {
      const l1 = (tr + Math.sqrt(disc)) / 2;
      const l2 = (tr - Math.sqrt(disc)) / 2;
      if (l1 < 0 && l2 < 0) { type = 'Stable Node'; stability = 'Stable'; }
      else if (l1 > 0 && l2 > 0) { type = 'Unstable Node'; stability = 'Unstable'; }
      else { type = 'Saddle Point'; stability = 'Unstable'; }
    } else if (disc < 0) {
      if (tr < 0) { type = 'Stable Focus'; stability = 'Stable'; }
      else if (tr > 0) { type = 'Unstable Focus'; stability = 'Unstable'; }
      else { type = 'Center'; stability = 'Marginal'; }
    } else {
      if (tr < 0) { type = 'Degenerate Stable'; stability = 'Stable'; }
      else if (tr > 0) { type = 'Degenerate Unstable'; stability = 'Unstable'; }
      else { type = 'Point'; stability = 'Unknown'; }
    }

    return { tr, det, disc, type, stability };
  }, [a11, a12, a21, a22]);

  const size = 500;
  const gridCount = 20;
  const step = size / gridCount;

  // Coordinate conversion (-5 to 5)
  const toCoord = (px: number) => (px - size / 2) / (size / 10);
  const toPx = (val: number) => size / 2 + val * (size / 10);

  const getVector = (x: number, y: number) => {
    const dx = a11 * x + a12 * y;
    const dy = a21 * x + a22 * y;
    return { dx, dy };
  };

  const addTrajectory = (px: number, py: number) => {
    let cx = toCoord(px);
    let cy = toCoord(py);
    const pts = [{ x: cx, y: cy }];
    
    const dt = 0.05;
    for (let i = 0; i < 100; i++) {
        const { dx, dy } = getVector(cx, cy);
        cx += dx * dt;
        cy += dy * dt;
        pts.push({ x: cx, y: cy });
        if (Math.abs(cx) > 10 || Math.abs(cy) > 10) break;
    }
    setTrajectories(prev => [...prev, pts].slice(-5));
  };

  const reset = () => {
    setA11(-1);
    setA12(1);
    setA21(-2);
    setA22(-1);
    setTrajectories([]);
  };

  const getTakeaway = () => {
    if (stats.stability === 'Stable') return "✅ Stable System: כל המסלולים ישאפו לראשית. המערכת תגיע לשיווי משקל גם אחרי הפרעה.";
    if (stats.stability === 'Unstable') return "⚠️ Unstable System: המערכת 'מתפוצצת'. כל הפרעה קטנה גורמת לערכים לברוח לאינסוף.";
    if (stats.type === 'Center') return "♾️ Marginal Stability: המערכת מתנדנדת במסלולים סגורים סביב הראשית (Center) ללא דעיכה.";
    return "💡 Phase Portrait: שימו לב איך שינוי הפרמטרים במטריצה A משנה לחלוטין את אופי הזרימה.";
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <Grid3X3 className="w-5 h-5 text-indigo-400" />
          ניתוח מרחב המצב (Phase Portrait Analysis)
        </h3>
        <p className="text-sm text-slate-400">
          חקרו את היציבות של מערכת ליניארית ẋ = Ax. לחצו על הגרף כדי להוסיף מסלולים ולראות איך המערכת מתפתחת.
        </p>
      </div>

      <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 italic text-sm text-indigo-400 font-sans">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Phase Portrait Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 relative aspect-square overflow-hidden cursor-crosshair group shadow-2xl">
           <svg 
             viewBox={`0 0 ${size} ${size}`} 
             className="w-full h-full"
             onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) * (size / rect.width);
                const y = (e.clientY - rect.top) * (size / rect.height);
                addTrajectory(x, y);
             }}
             onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) * (size / rect.width);
                const y = (e.clientY - rect.top) * (size / rect.height);
                setIsHovering({ x: toCoord(x), y: toCoord(y) });
             }}
             onMouseLeave={() => setIsHovering(null)}
           >
              {/* Axis */}
              <line x1={0} y1={size/2} x2={size} y2={size/2} stroke="#1e293b" strokeWidth="1" />
              <line x1={size/2} y1={0} x2={size/2} y2={size} stroke="#1e293b" strokeWidth="1" />

              {/* Vector Field (Quiver) */}
              {Array.from({ length: 15 }).map((_, i) => 
                Array.from({ length: 15 }).map((_, j) => {
                   const x = (i - 7) * 0.7;
                   const y = (j - 7) * 0.7;
                   const { dx, dy } = getVector(x, y);
                   const mag = Math.sqrt(dx*dx + dy*dy) || 1;
                   const arrowLen = Math.min(15, mag * 2);
                   const ux = (dx / mag) * arrowLen;
                   const uy = (dy / mag) * arrowLen;
                   
                   return (
                     <g key={`${i}-${j}`} transform={`translate(${toPx(x)}, ${toPx(y)})`}>
                        <line x1={0} y1={0} x2={ux} y2={-uy} stroke="#334155" strokeWidth="1" opacity="0.4" />
                        <circle r="1" fill="#475569" />
                     </g>
                   )
                })
              )}

              {/* Trajectories */}
              {trajectories.map((path, idx) => (
                <motion.path 
                  key={idx}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                  d={path.reduce((acc, pt, i) => acc + (i === 0 ? `M ${toPx(pt.x)} ${toPx(pt.y)}` : ` L ${toPx(pt.x)} ${toPx(pt.y)}`), "")}
                  fill="none"
                  stroke={idx === trajectories.length - 1 ? "#6366f1" : "#312e81"}
                  strokeWidth={idx === trajectories.length - 1 ? 4 : 2}
                  strokeLinejoin="round"
                  opacity={0.3 + (idx / trajectories.length) * 0.7}
                />
              ))}

              {/* Hover Cursor Highlight */}
              {isHovering && (
                <g transform={`translate(${toPx(isHovering.x)}, ${toPx(isHovering.y)})`}>
                   <circle r="4" fill="#6366f1" />
                </g>
              )}
           </svg>

           <div className="absolute top-6 left-6 pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-[10px] space-y-1">
                 <div className="flex justify-between gap-4 font-mono">
                    <span className="text-slate-500">x1:</span>
                    <span className="text-white">{(isHovering?.x || 0).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between gap-4 font-mono">
                    <span className="text-slate-500">x2:</span>
                    <span className="text-white">{(isHovering?.y || 0).toFixed(2)}</span>
                 </div>
              </div>
           </div>
           
           <button 
             onClick={() => setTrajectories([])}
             className="absolute bottom-6 right-6 p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white"
           >
             ניקוי גרף
           </button>
        </div>

        {/* Matrix Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Zap className="w-4 h-4 text-amber-400" />
                   ẋ = Ax
                </h4>
                <button 
                  onClick={reset}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                 <MatrixInput label="a11" value={a11} onChange={setA11} />
                 <MatrixInput label="a12" value={a12} onChange={setA12} />
                 <MatrixInput label="a21" value={a21} onChange={setA21} />
                 <MatrixInput label="a22" value={a22} onChange={setA22} />
              </div>

              <div className="pt-6 border-t border-slate-700/50 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Tr(A):</span>
                    <span className="text-white font-black">{stats.tr.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Det(A):</span>
                    <span className="text-white font-black">{stats.det.toFixed(2)}</span>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-indigo-400">
                 <ShieldAlert className="w-4 h-4" />
                 סיווג יציבות
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                המערכת מוגדרת כ-<b>{stats.type}</b>. 
                {stats.stability === 'Stable' ? ' כל המסלולים ישאפו לנקודת שיווי המשקל בראשית.' : 
                 stats.stability === 'Unstable' ? ' המסלולים מתרחקים מהראשית, המערכת "בורחת".' : 
                 ' המסלולים נעים במסלול סגור מסביב לראשית (תנודות מתמידות).'}
              </p>
           </div>

           <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex gap-3 items-start">
             <Info className="w-4 h-4 text-slate-500 mt-1" />
             <div className="text-[10px] text-slate-400 leading-relaxed">
               <span className="font-bold text-slate-300 block mb-1">טיפ אינטואיטיבי</span>
               במערכות תעופה ורובוטיקה, בוחנים את ה-State Space כדי להבין איך שינוי קטן בזווית (State 1) משפיע על מהירות הסיבוב (State 2) ומשם על היציבות הכללית.
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MatrixInput = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <div className="text-[10px] text-slate-500 font-black uppercase text-center">{label}</div>
    <input 
      type="number" 
      step="0.1" 
      value={value} 
      onChange={e => onChange(Number(e.target.value))} 
      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-3 text-center text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    />
  </div>
);

export default PhaseSimulation;
