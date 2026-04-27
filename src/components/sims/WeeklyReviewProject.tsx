import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Target, Zap, Waves, Activity, AlertTriangle
} from 'lucide-react';

export default function WeeklyReviewProject() {
  const [isRunning, setIsRunning] = useState(false);
  const [method, setMethod] = useState<'PID' | 'LQR'>('PID');
  
  // PID Params
  const [kp, setKp] = useState(150);
  const [ki, setKi] = useState(10);
  const [kd, setKd] = useState(30);

  // Simulation State
  const [theta, setTheta] = useState(0.1); // Angle in radians
  const [omega, setOmega] = useState(0);   // Angular velocity
  const [x, setX] = useState(0);           // Cart position
  const [v, setV] = useState(0);           // Cart velocity
  
  const [disturbance, setDisturbance] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);
  const integralRef = useRef<number>(0);

  // Constants
  const M = 1.0;  // Cart mass
  const m = 0.1;  // Pole mass
  const L = 0.5;  // Pole length
  const g = 9.81; // Gravity
  const dt = 0.01;

  const reset = () => {
    setTheta(0.15); // Start slightly tilted
    setOmega(0);
    setX(0);
    setV(0);
    setIsRunning(false);
    integralRef.current = 0; // Reset integral state
  };

  const simulate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      // Calculate Control Force
      let F = 0;
      if (method === 'PID') {
        const error = 0 - theta;
        // PID control with integral action
        integralRef.current += error * dt;
        F = - (kp * error + ki * integralRef.current + kd * omega);
      } else {
        // Simple LQR-like Gains (Optimized for this system)
        // Gain vector K = [-7, -10, 80, 20] -> [x, v, theta, omega]
        F = -( -7*x + -10*v + 120*theta + 25*omega );
      }

      // Physics Equations (Nonlinear cart-pole dynamics using Lagrangian)
      // d2theta = (g*sin(theta) + cos(theta)*(-F - m*L*omega^2*sin(theta))/(M+m)) / (L*(4/3 - (m*cos(theta)^2)/(M+m)))
      
      const common = (F + m * L * omega * omega * Math.sin(theta)) / (M + m);
      const alpha = (g * Math.sin(theta) - Math.cos(theta) * common) / (L * (4/3 - (m * Math.cos(theta) * Math.cos(theta)) / (M + m)));
      const acceler = common - (m * L * alpha * Math.cos(theta)) / (M + m);

      // Integration
      setOmega(prev => prev + alpha * dt);
      setTheta(prev => prev + (omega + alpha * dt) * dt);
      setV(prev => prev + acceler * dt);
      setX(prev => prev + (v + acceler * dt) * dt);
    }
    
    lastTimeRef.current = time;
    draw();
    requestRef.current = requestAnimationFrame(simulate);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2 + x * 100;
    const centerY = canvas.height * 0.7;
    const poleLength = L * 300;

    // Ground
    ctx.beginPath();
    ctx.moveTo(0, centerY + 25);
    ctx.lineTo(canvas.width, centerY + 25);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cart
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(centerX - 40, centerY - 20, 80, 40);
    
    // Wheels
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(centerX - 25, centerY + 20, 10, 0, Math.PI * 2);
    ctx.arc(centerX + 25, centerY + 20, 10, 0, Math.PI * 2);
    ctx.fill();

    // Pole
    const poleX = centerX + Math.sin(theta) * poleLength;
    const poleY = centerY - Math.cos(theta) * poleLength;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(poleX, poleY);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Mass on top
    ctx.beginPath();
    ctx.arc(poleX, poleY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pivot point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(simulate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      draw();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, x, theta, omega, v, method]);

  // Check for failure (fell over)
  useEffect(() => {
    if (Math.abs(theta) > Math.PI / 2 || Math.abs(x) > 3) {
      setIsRunning(false);
    }
  }, [theta, x]);

  const getTakeaway = () => {
    if (Math.abs(theta) > 0.5) return "⚠️ אזהרת יציבות: המטוטלת קרובה לנפילה! נסה להגדיל את Kd (ב-PID) או לעבור ל-LQR.";
    if (Math.abs(theta) < 0.02 && Math.abs(x) < 0.1) return "✅ הצלחה! המערכת מיוצבת בצורה מושלמת במרכז. שים לב כמה ה-LQR שקט ביחס ל-PID.";
    if (method === 'PID' && kp > 300) return "⚠️ PID אגרסיבי: Kp גבוה מדי גורם לתנודות מהירות וצריכת זרם גבוהה.";
    return "💡 המטרה: לשמור על הזווית ב-0 ועל המיקום ב-0. ה-LQR משתמש ב'משקולות' על כל המצבים כדי למצוא את האיזון האופטימלי.";
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white">
          <Activity size={20} className="text-blue-400" />
          פרויקט סיכום שבועי: ייצוב מטוטלת הפוכה (Inverted Pendulum)
        </h3>
        <p className="text-sm text-slate-400">
          חברו את כל עקרונות הבקרה שלמדתם השבוע. השוו בין בקרת PID קלאסית לבקרת LQR מודרנית במרחב המצב.
        </p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 font-sans text-right">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Project Context */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-3">
            <h3 className="text-blue-400 font-bold flex items-center gap-2">
              <Target className="w-5 h-5" />
              משימת הסיכום
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              השתמשו בכל מה שלמדתם השבוע כדי לייצב את ה-Inverted Pendulum. 
              המטרה היא לשמור על המטוטלת אנכית (0 מעלות) ועל העגלה במרכז.
            </p>
          </div>

          <div className="space-y-4 font-sans">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">שיטת בקרה</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMethod('PID')}
                className={`py-2 rounded-lg border transition-all ${
                  method === 'PID' ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                PID
              </button>
              <button
                onClick={() => setMethod('LQR')}
                className={`py-2 rounded-lg border transition-all ${
                  method === 'LQR' ? 'bg-purple-500 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                LQR
              </button>
            </div>
          </div>

          {method === 'LQR' && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">LQR Gains</div>
              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div>K = [Kx, Kv, Kθ, Kω]</div>
                <div>K = [7, 10, 120, 25]</div>
              </div>
            </div>
          )}

          {method === 'PID' && (
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label>Kp (זווית)</label>
                  <span className="text-blue-400">{kp}</span>
                </div>
                <input type="range" min="0" max="500" value={kp} onChange={e => setKp(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label>Kd (מהירות זוויתית)</label>
                  <span className="text-amber-400">{kd}</span>
                </div>
                <input type="range" min="0" max="100" value={kd} onChange={e => setKd(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                isRunning ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'השהה סימולציה' : 'הפעל מערכת'}
            </button>
            <button 
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 border border-slate-700 transition-all font-bold"
            >
              <RotateCcw className="w-5 h-5" />
              איפוס מצב
            </button>
          </div>
        </div>

        {/* Visual Viewport */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={450} 
              className="w-full h-full"
            />
            
            {/* Overlay Info */}
            <div className="absolute top-4 left-4 flex gap-4">
              <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono text-slate-300">Theta: {(theta * 180 / Math.PI).toFixed(1)}°</span>
              </div>
              <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                <Waves className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-300">Pos: {x.toFixed(2)}m</span>
              </div>
            </div>

            {/* Failure Alert */}
            {(Math.abs(theta) > Math.PI / 2 || Math.abs(x) > 3) && (
              <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-slate-900 border border-red-500 p-6 rounded-2xl text-center space-y-4 max-w-xs shadow-2xl shadow-red-500/20"
                >
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                  <h4 className="text-xl font-bold">המערכת קרסה!</h4>
                  <p className="text-sm text-slate-400">הזווית גדולה מדי או שהעגלה ירדה מהפסים. נסו לשפר את הבקר.</p>
                  <button onClick={reset} className="w-full py-2 bg-red-500 text-white rounded-lg font-bold">איפוס וניסיון חוזר</button>
                </motion.div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 font-sans">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">דיוק יעד</div>
              <div className="text-xl font-bold text-blue-400">{(100 - Math.abs(theta)*100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">צריכת זרם</div>
              <div className="text-xl font-bold text-amber-400">{(Math.abs(theta)*50 + Math.abs(v)*20).toFixed(1)}A</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">מצב יציבות</div>
              <div className={`text-xl font-bold ${Math.abs(theta) < 0.05 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {Math.abs(theta) < 0.05 ? 'יציב' : 'בתנודה'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
