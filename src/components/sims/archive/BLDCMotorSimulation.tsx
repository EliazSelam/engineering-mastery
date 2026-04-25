import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Zap, RotateCcw, Settings2, Info } from 'lucide-react';

export default function BLDCMotorSimulation() {
  const DEFAULT = { speed: 1 };
  const [speed, setSpeed] = useState(DEFAULT.speed);
  const [angle, setAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const animationRef = useRef<number | null>(null);

  const reset = () => {
    setSpeed(DEFAULT.speed);
    setAngle(0);
    setIsPlaying(true);
  };

  const getTakeaway = () => {
    if (speed === 0) return "🛑 Stalled: המנוע נעצר. ללא זרם בסלילים, אין שדה מגנטי שימשוך את הרוטור.";
    if (speed > 8) return "⚡ High Speed: בתדירות גבוהה, הקומוטציה כמעט רציפה. המחשב שולט במתח בכל פאזה בדיוק של מיקרו-שניות.";
    return "💡 Commutation: שים לב איך הסלילים (Phases) נדלקים ונכבים בדיוק כשהמגנטים של הרוטור מתקרבים אליהם.";
  };

  useEffect(() => {
    if (!isPlaying) return;
    
    const step = () => {
      setAngle(prev => (prev + speed) % 360);
      animationRef.current = requestAnimationFrame(step);
    };
    
    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [speed, isPlaying]);

  // Determine which phase is active based on angle
  const getPhaseIntensity = (phaseAngle: number) => {
    const diff = Math.abs((angle - phaseAngle + 180) % 360 - 180);
    return Math.max(0, 1 - diff / 60);
  };

  const phaseA = getPhaseIntensity(0);
  const phaseB = getPhaseIntensity(120);
  const phaseC = getPhaseIntensity(240);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Zap size={20} />
            </div>
            <h4 className="font-bold">Electronic Commutation (BLDC)</h4>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={reset}
              className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold hover:bg-slate-200 transition-colors border border-slate-200"
            >
              RESET
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              {isPlaying ? <RotateCcw size={16} className="animate-spin" /> : <Zap size={16} />}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">Visualizing how a BLDC motor uses electronic control of stator coils to pull permanent magnets.</p>
      </div>

      <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 italic text-sm text-amber-600">
        {getTakeaway()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Motor Visual */}
        <div className="relative flex items-center justify-center h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-0 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full border-4 transition-colors duration-200 ${phaseA > 0.5 ? 'bg-red-500 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-100 border-slate-200'}`} />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Phase A</span>
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1 rotate-[120deg]">
              <div className={`w-8 h-8 rounded-full border-4 transition-colors duration-200 ${phaseB > 0.5 ? 'bg-blue-500 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-100 border-slate-200'}`} />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Phase B</span>
            </div>
            <div className="absolute bottom-4 left-4 flex flex-col items-center gap-1 rotate-[240deg]">
              <div className={`w-8 h-8 rounded-full border-4 transition-colors duration-200 ${phaseC > 0.5 ? 'bg-green-500 border-green-200 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-slate-100 border-slate-200'}`} />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Phase C</span>
            </div>
          </div>

          <motion.div 
            className="w-32 h-32 rounded-full bg-slate-800 border-8 border-slate-700 shadow-2xl flex items-center justify-center relative z-10"
            style={{ rotate: angle }}
          >
            <div className="w-full h-1 bg-red-500 absolute top-1/2 -translate-y-1/2" />
            <div className="w-4 h-4 rounded-full bg-white shadow-inner" />
            <div className="absolute top-2 text-[8px] font-black text-white">N</div>
            <div className="absolute bottom-2 text-[8px] font-black text-white">S</div>
          </motion.div>

          <div className="absolute inset-0 border-4 border-dashed border-slate-100 rounded-full scale-110" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-between">
              <span>Rotation Speed (RPM-ish)</span>
              <span className="text-amber-600">{(speed * 60).toFixed(0)}</span>
            </label>
            <input 
              type="range" min="0" max="10" step="0.1"
              value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <h5 className="text-[10px] font-black text-slate-400 uppercase">Phase Activity</h5>
            <div className="flex gap-2">
              <div className="flex-1 h-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1 overflow-hidden">
                <div className="w-full h-full bg-red-500 transition-all duration-100" style={{ opacity: phaseA }} />
                <span className="absolute text-[8px] font-bold">A</span>
              </div>
              <div className="flex-1 h-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1 overflow-hidden">
                <div className="w-full h-full bg-blue-500 transition-all duration-100" style={{ opacity: phaseB }} />
                <span className="absolute text-[8px] font-bold">B</span>
              </div>
              <div className="flex-1 h-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1 overflow-hidden">
                <div className="w-full h-full bg-green-500 transition-all duration-100" style={{ opacity: phaseC }} />
                <span className="absolute text-[8px] font-bold">C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
