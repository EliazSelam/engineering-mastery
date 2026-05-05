import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'wouter';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { cn } from '@/src/lib/utils';
import LessonShell from '../components/LessonShell';
import { SimErrorBoundary } from '../components/SimErrorBoundary';
import { DAYS } from '../content/days';
import { ArrowLeft, ArrowDown, ArrowRight, Activity, 
  Thermometer, Wind, Flame, Mic, Heart, Navigation, 
  Car, Cpu, Radio, Music, Video, Rocket, Plane, Wifi, 
  Zap, Monitor, Battery, Wrench, Globe, CheckCircle2,
  Menu, Layers, Settings, Circle, Square, Maximize, Play,
  FastForward, RotateCcw, Target,
  Zap as Power, Activity as Pulse } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{size?: number}>> = {
  Thermometer, Wind, Flame, Mic, Heart, Navigation,
  Car, Cpu, Radio, Music, Video, Rocket, Plane, Wifi,
  Activity, Zap, Monitor, Battery, Wrench, Globe
};

// Simulations
import PIDSimulation from '../components/sims/PIDSimulation';
import PoleZeroSimulation from '../components/sims/PoleZeroSimulation';
import BodePlotSimulation from '../components/sims/BodePlotSimulation';
import NyquistSimulation from '../components/sims/NyquistSimulation';
import StateSpaceSimulation from '../components/sims/StateSpaceSimulation';
import KalmanSimulation from '../components/sims/KalmanSimulation';
import LQRSimulation from '../components/sims/LQRSimulation';
import WeeklyReviewProject from '../components/sims/WeeklyReviewProject';
import AutoTuner from '../components/sims/AutoTuner';
import BLDCSimulation from '../components/sims/BLDCSimulation';
import FOCSimulation from '../components/sims/FOCSimulation';
import KinematicsSimulation from '../components/sims/KinematicsSimulation';
import DynamicsSimulation from '../components/sims/DynamicsSimulation';
import PathPlanningSimulation from '../components/sims/PathPlanningSimulation';
import RoboticsProjectSimulation from '../components/sims/RoboticsProjectSimulation';
import ControlLoopSimulation from '../components/sims/ControlLoopSimulation';
import AliasingSimulation from '../components/sims/AliasingSimulation';
import PoleZeroUnitCircle from '../components/sims/PoleZeroUnitCircle';
import SpectrumAnalyzer from '../components/sims/SpectrumAnalyzer';
import FIRDesigner from '../components/sims/FIRDesigner';
import WindowingSimulation from '../components/sims/WindowingSimulation';
import SpectrogramSimulation from '../components/sims/SpectrogramSimulation';
import DSPReviewProject from '../components/sims/DSPReviewProject';
import MPCSimulation from '../components/sims/MPCSimulation';
import MRACSimulation from '../components/sims/MRACSimulation';
import NNControlSimulation from '../components/sims/NNControlSimulation';
import RTOSSimulation from '../components/sims/RTOSSimulation';
import PortfolioBuilder from '../components/sims/PortfolioBuilder';
import DronePIDSimulation from '../components/sims/DronePIDSimulation';
import QuantumSimulation from '../components/sims/QuantumSimulation';
import EntanglementSimulation from '../components/sims/EntanglementSimulation';
import { EntanglementDiagram } from '../components/DiagramComponents';

// New simulations will be imported here as they are created
// import BodePlotSimulation from '../components/sims/BodePlotSimulation';

interface DayPageProps {
  id: number;
  onComplete: (score: number) => void;
  streak: number;
  onPrevDay?: () => void;
  onNextDay?: () => void;
}

export const SIMULATION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  ControlLoopSimulation,
  AliasingSimulation,
  PoleZeroUnitCircle,
  SpectrumAnalyzer,
  FIRDesigner,
  PIDSimulation,
  PoleZeroSimulation,
  BodePlotSimulation,
  NyquistSimulation,
  StateSpaceSimulation,
  KalmanSimulation,
  LQRSimulation,
  WeeklyReviewProject,
  AutoTuner,
  BLDCSimulation,
  FOCSimulation,
  KinematicsSimulation,
  DynamicsSimulation,
  PathPlanningSimulation,
  RoboticsProjectSimulation,
  WindowingSimulation,
  SpectrogramSimulation,
  DSPReviewProject,
  MPCSimulation,
  MRACSimulation,
  NNControlSimulation,
  RTOSSimulation,
  PortfolioBuilder,
  DronePIDSimulation,
  QuantumSimulation,
  EntanglementSimulation,
};

const DIAGRAM_COMPONENTS: Record<string, React.ComponentType<Record<string, any>>> = {
  ControlLoopDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
        <div className="flex items-center justify-between w-full max-w-sm mx-auto h-full gap-2 z-10 relative">
          <div className="flex flex-col items-center gap-2">
             <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest pl-2">R(s)</div>
             <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center font-black text-xl text-coral bg-white shadow-lg">Σ</div>
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Reference</span>
          </div>
          
          <div className="flex-1 h-px bg-slate-300 relative">
             <motion.div 
               animate={{ left: ['0%', '100%'] }} 
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute top-[-2px] w-1.5 h-1.5 bg-coral rounded-full shadow-[0_0_8px_#FF6B35]" 
             />
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-slate-300" />
          </div>

          <div className="p-4 bg-deep-blue border-2 border-white/20 rounded-2xl flex flex-col items-center shadow-xl group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-deep-blue to-[#003865]">
             <span className="text-[10px] font-black uppercase italic tracking-tighter text-white">Controller</span>
             <div className="text-[8px] font-mono mt-1 text-white/50 bg-black/20 px-2 rounded">C(s)</div>
          </div>

          <div className="flex-1 h-px bg-slate-300 relative">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-slate-300" />
          </div>

          <div className="p-4 bg-coral border-2 border-white/20 rounded-2xl flex flex-col items-center shadow-xl group-hover:scale-95 transition-transform duration-500 bg-gradient-to-tr from-coral to-[#E55A2A]">
             <span className="text-[10px] font-black uppercase italic tracking-tighter text-white">Plant</span>
             <div className="text-[8px] font-mono mt-1 text-white/50 bg-black/20 px-2 rounded font-black">G(s)</div>
          </div>

          <div className="flex-1 h-px bg-slate-300 relative">
             <div className="absolute -top-4 right-0 w-2 h-2 bg-coral rounded-full animate-ping" />
             <div className="absolute -right-4 -top-2 text-[8px] font-mono text-slate-500 font-black uppercase italic">Y(s) Out</div>
          </div>
        </div>

        {/* Feedback Line with animated dash */}
        <svg className="absolute inset-x-0 bottom-12 h-16 w-full -translate-y-2 pointer-events-none">
           <motion.path 
              d="M 360 0 L 360 40 L 65 40 L 65 15" 
              fill="none" 
              stroke="#FF6B35" 
              strokeWidth="2" 
              strokeDashoffset="0"
              strokeDasharray="10 5"
              animate={{ strokeDashoffset: [45, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           />
        </svg>

        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase font-black opacity-30 italic">Architecture: Unity Feedback Control</div>
        <div className="absolute bottom-4 left-4 text-[8px] font-mono text-emerald-600 font-bold uppercase italic bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Closed Loop System</div>
      </div>
    );
  },
  PIDDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col justify-center gap-8 text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
        <div className="flex justify-between items-center relative z-10 px-4">
           {[ 
             { label: 'P', sub: 'Proportional', desc: 'Present / הווה', color: 'bg-coral', icon: Zap },
             { label: 'I', sub: 'Integral', desc: 'Past / עבר', color: 'bg-deep-blue', icon: Layers },
             { label: 'D', sub: 'Derivative', desc: 'Future / עתיד', color: 'bg-emerald-500', icon: Activity }
           ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.2 }}
               whileHover={{ y: -8, scale: 1.05 }}
               className="flex flex-col items-center gap-3 transition-all duration-300"
             >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl relative text-white bg-gradient-to-br", item.color, "from-inherit to-black/20")}>
                   {item.label}
                   <item.icon size={14} className="absolute -top-1 -right-1 text-white/40" />
                   <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{item.sub}</span>
                   <span className="text-[9px] font-bold text-slate-400 mt-0.5 italic">{item.desc}</span>
                </div>
             </motion.div>
           ))}
        </div>
        
        <div className="flex items-center gap-4 mt-4 px-12 opacity-40">
           <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full" />
           <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white shadow-xl">
              <span className="text-2xl font-black text-slate-300">+</span>
           </div>
           <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full" />
        </div>

        <div className="text-center font-mono text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black italic mt-4">
          u(t) = Kp e(t) + Ki ∫e(t)dt + Kd de/dt
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase font-black opacity-30 italic">Parallel Architecture: PID Loop</div>
      </div>
    );
  },
  PoleZeroDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl flex flex-col items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
         <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-100" />
         <div className="w-64 h-64 border border-slate-100 rounded-full flex items-center justify-center relative bg-white/20">
            {/* Axis */}
            <div className="absolute w-full h-px bg-slate-200" />
            <div className="absolute h-full w-px bg-slate-200" />
            
            {/* Grid Circles */}
            {[0.2, 0.4, 0.6, 0.8].map(s => (
               <div key={s} className="absolute border border-slate-100 rounded-full" style={{ width: `${s*100}%`, height: `${s*100}%` }} />
            ))}

            {/* Poles */}
            <motion.div 
               animate={{ scale: [1, 1.3, 1], x: [-35, -35], y: [45, 45] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute text-coral font-black text-2xl z-20 drop-shadow-[0_0_15px_rgba(255,107,53,0.6)] cursor-help"
               title="Pole 1"
            >×</motion.div>
            <motion.div 
               animate={{ scale: [1, 1.3, 1], x: [-35, -35], y: [-45, -45] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute text-coral font-black text-2xl z-20 drop-shadow-[0_0_15px_rgba(255,107,53,0.6)] cursor-help"
               title="Pole 2"
            >×</motion.div>

            {/* Zero */}
            <motion.div 
               animate={{ scale: [1, 1.1, 1], x: [-90, -90], y: [0, 0] }}
               className="absolute w-6 h-6 border-2 border-emerald-500 rounded-full flex items-center justify-center z-20 bg-white shadow-xl"
            >
               <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </motion.div>
         </div>
         <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase font-black italic tracking-widest opacity-40">Root Locus / s-Plane Mapping</div>
         <div className="absolute bottom-4 left-4 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-coral font-black uppercase tracking-tight bg-white/60 px-2 py-0.5 rounded border border-coral/10 shadow-sm">Stability: Asymptotically Stable</span>
            <span className="text-[7px] font-mono text-slate-400 font-bold uppercase pl-2">Re(s) &lt; 0</span>
         </div>
         <div className="absolute top-4 right-4 text-[8px] font-mono text-slate-400 font-black flex flex-col items-end">
            <span>Im(s) jω</span>
            <div className="w-10 h-px bg-slate-200 mt-1" />
         </div>
      </div>
    );
  },
  BodeDiagram: () => {
    const [freq, setFreq] = useState(3);
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col justify-around text-slate-900 border-4 border-slate-200 relative group overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
        
        {/* Magnitude */}
        <div className="space-y-2 relative z-10">
           <div className="flex justify-between items-end border-b border-slate-200 pb-1">
             <div className="text-[10px] font-black text-coral uppercase tracking-widest pl-1">Magnitude Response (dB)</div>
             <div className="text-[7px] font-mono font-black text-slate-400 uppercase tracking-tighter">Gain Sweep</div>
           </div>
           <div className="h-16 flex items-end gap-0.5 px-1 bg-white/20 rounded-lg">
             {Array.from({ length: 48 }).map((_, i) => {
               const h = Math.max(10, 90 * Math.exp(-Math.pow(i - freq * 5, 2) / 30));
               return <motion.div key={i} animate={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-coral/60 to-coral/20 rounded-t-sm" />;
             })}
           </div>
        </div>

        {/* Phase */}
        <div className="space-y-2 relative z-10">
           <div className="flex justify-between items-end border-b border-slate-200 pb-1">
             <div className="text-[10px] font-black text-deep-blue uppercase tracking-widest pl-1">Phase Response (Deg)</div>
             <div className="text-[7px] font-mono font-black text-slate-400 uppercase tracking-tighter">Delay Mapping</div>
           </div>
           <div className="h-12 flex items-center gap-0.5 px-1 bg-white/20 rounded-lg">
             {Array.from({ length: 48 }).map((_, i) => {
               const y = Math.atan((i - freq * 5) / 4) * 20;
               return <motion.div key={i} animate={{ y: `${y}px` }} className="flex-1 h-1 bg-deep-blue/20 rounded-full shadow-sm" />;
             })}
           </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl border border-slate-200 z-20 shadow-2xl">
           <div className="flex flex-col items-center">
             <span className="text-[7px] font-mono text-slate-400 uppercase font-black">Frequency ω</span>
             <div className="flex items-center gap-3">
               <input 
                 type="range" min="1" max="7" step="0.1" value={freq} onChange={e => setFreq(parseFloat(e.target.value))}
                 className="w-24 accent-coral h-1.5 bg-slate-100 rounded-full appearance-none" 
               />
               <span className="text-[9px] font-mono text-coral font-black bg-coral/10 px-2 py-0.5 rounded">{(Math.pow(10, freq-3)).toFixed(1)} rad/s</span>
             </div>
           </div>
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest opacity-30 italic">L(jω) Frequency Characteristics</div>
      </div>
    );
  },
  NyquistDiagram: () => {
    const [gain, setGain] = useState(1);
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl flex items-center justify-center text-slate-900 border-4 border-slate-200 relative group overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:30px_30px] opacity-100" />
        <div className="relative w-64 h-64 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center bg-white/20">
           {/* Unit Circle (dashed) */}
           <div className="absolute w-32 h-32 border border-slate-300 border-dashed rounded-full" />
           
           {/* Critical point marker */}
           <div className="absolute left-[calc(25%-8px)] top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center z-30">
              <div className="w-2 h-2 bg-coral rounded-full animate-ping absolute" />
              <div className="w-2.5 h-2.5 bg-coral rounded-full shadow-[0_0_10px_#FF6B35]" />
              <div className="absolute -top-6 text-[8px] font-mono text-coral font-black bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded border border-coral/20 shadow-sm pointer-events-none">(-1, 0j)</div>
           </div>
           
           <div className="absolute inset-x-0 h-px bg-slate-200" />
           <div className="absolute inset-y-0 h-full w-px bg-slate-200" />
           
           <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-2 border-deep-blue rounded-full relative shadow-[0_0_40px_rgba(0,78,137,0.1)]"
              style={{ scale: gain }}
           >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-deep-blue rounded-full shadow-[0_0_20px_rgba(0,78,137,0.6)] border-2 border-white ring-4 ring-deep-blue/5" />
           </motion.div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
           <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200 shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[7px] font-mono text-slate-400 uppercase font-black tracking-widest pl-1">Loop Gain K</span>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0.5" max="1.8" step="0.05" value={gain} onChange={e => setGain(parseFloat(e.target.value))}
                    className="w-32 accent-deep-blue h-1.5 bg-slate-100 rounded-full appearance-none" 
                  />
                  <span className="text-[10px] font-mono text-deep-blue font-black bg-deep-blue/10 px-2 rounded">{gain.toFixed(2)}</span>
                </div>
              </div>
           </div>
           <motion.span 
              animate={{ opacity: gain > 1.3 ? [1, 0.4, 1] : 1 }}
              className={cn(
                "text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-full border shadow-sm transition-colors duration-500",
                gain > 1.3 ? "bg-coral/10 text-coral border-coral/20" : "bg-emerald-50 text-emerald-600 border-emerald-200"
              )}
           >
              {gain > 1.3 ? 'CRITICAL: INSTABILITY REACHED' : 'SYSTEM MARGIN: STABLE'}
           </motion.span>
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest opacity-30 italic">Stability Criterion Visualization</div>
      </div>
    );
  },
  StateSpaceDiagram: () => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div 
        className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col justify-center gap-6 text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-grid-slate-900/[0.04]" />
        <div className="flex items-center gap-8 relative z-10 w-full max-w-xs mx-auto">
           <motion.div 
             animate={{ borderColor: isHovered ? '#FF6B35' : '#e2e8f0', scale: isHovered ? 1.1 : 1 }}
             className="w-20 h-20 bg-white border-4 rounded-3xl flex flex-col items-center justify-center shadow-2xl relative transition-colors duration-500"
           >
              <div className="text-3xl font-black text-coral drop-shadow-sm">∫</div>
              <span className="text-[8px] font-black absolute -top-5 text-slate-500 uppercase tracking-tighter">Integrator</span>
           </motion.div>
           
           <div className="flex-1 h-1 bg-slate-200 relative rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: isHovered ? ['-100%', '100%'] : '0%' }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-coral/40 to-transparent" 
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-slate-300" />
           </div>

           <motion.div 
             animate={{ scale: isHovered ? 1.15 : 1 }}
             className="w-20 h-20 bg-gradient-to-br from-deep-blue to-[#003865] border-4 border-white/20 rounded-3xl flex flex-col items-center justify-center shadow-2xl relative"
           >
              <div className="text-3xl font-black text-white italic">x</div>
              <span className="text-[8px] font-black absolute -top-5 text-slate-500 uppercase tracking-tighter font-mono">State Vector</span>
           </motion.div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
           <div className="text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest relative z-10 font-black bg-white/90 backdrop-blur-md px-6 py-1.5 rounded-full border border-slate-200 shadow-xl">
             {isHovered ? 'Active Signal Propagation' : 'Linear State Representation'}
           </div>
           <code className="text-xs text-deep-blue font-black bg-white/40 px-3 py-0.5 rounded border border-white/50">ẋ(t) = Ax(t) + Bu(t)</code>
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 font-black opacity-30 italic">Modern Control Engine v2.0</div>
        <div className="absolute top-4 right-4 text-[8px] font-mono text-slate-400 font-bold flex gap-4">
           <span>dim(x) = n</span>
           <span>dim(u) = m</span>
        </div>
      </div>
    );
  },
  ObserverDiagram: () => {
    const [t, setT] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => setT(prev => (prev + 0.05) % (Math.PI * 2)), 50);
      return () => clearInterval(interval);
    }, []);
    const realY = Math.sin(t) * 40;
    const estY = Math.sin(t - 0.2) * 35; // Slight lag and error

    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/5 opacity-5" />
        <div className="flex flex-col gap-8 w-full max-w-md relative z-10">
          <div className="flex justify-between items-center h-28 relative px-8 border border-slate-200 bg-white/40 rounded-2xl shadow-inner overflow-hidden">
             <div className="absolute inset-x-0 h-px bg-slate-100 top-1/2 -translate-y-1/2" />
             <div className="flex flex-col items-center relative z-10">
                <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-tighter">Estimator</div>
                <motion.div 
                  animate={{ y: estY }}
                  className="w-5 h-5 bg-deep-blue rounded-full shadow-[0_0_20px_rgba(0,78,137,0.5)] border-2 border-white ring-2 ring-deep-blue/10" 
                />
             </div>
             <div className="flex-1 px-4 relative h-full flex items-center justify-center">
                <div className="w-full h-px bg-slate-300 border-t border-dashed opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-[8px] font-mono text-emerald-600 font-black bg-white/80 px-2 py-0.5 rounded border border-emerald-100 shadow-sm animate-pulse">L·(y - ŷ)</div>
                </div>
             </div>
             <div className="flex flex-col items-center relative z-10">
                <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-tighter">Process</div>
                <motion.div 
                  animate={{ y: realY }}
                  className="w-5 h-5 bg-coral rounded-full opacity-30 border-2 border-white" 
                />
             </div>
          </div>
          
          <div className="flex justify-between text-[11px] font-mono group-hover:text-deep-blue transition-colors px-1">
             <span className="text-slate-500 font-medium">Internal State Estimation (x̂)</span>
             <span className="font-black text-emerald-600 uppercase tracking-widest">Converging...</span>
          </div>
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Luenberger Observer Model</div>
      </div>
    );
  },
  FeedforwardDiagram: () => {
    const [pulse, setPulse] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => setPulse(prev => (prev + 1) % 100), 30);
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-coral via-slate-100 to-deep-blue opacity-40" />
        <div className="flex flex-col gap-10 w-full max-w-sm relative z-10">
          <div className="flex items-center gap-6">
             <div className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl relative shadow-xl">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-2">Model Inversion</div>
                <div className="h-1.5 bg-coral/10 rounded-full w-full">
                   <motion.div 
                     animate={{ width: ['0%', '100%'] }} 
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                     className="h-full bg-coral rounded-full shadow-[0_0_12px_#FF6B35]" 
                   />
                </div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 p-2 bg-coral rounded-full border-2 border-white shadow-lg text-white">
                  <Zap size={10} />
                </div>
             </div>
             <div className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl relative shadow-xl">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-2">Error Correction</div>
                <div className="h-1.5 bg-deep-blue/10 rounded-full w-full">
                   <motion.div 
                     animate={{ width: ['0%', '100%'] }} 
                     transition={{ duration: 2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }} 
                     className="h-full bg-deep-blue rounded-full shadow-[0_0_12px_#004E89]" 
                   />
                </div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 p-2 bg-deep-blue rounded-full border-2 border-white shadow-lg text-white">
                  <RotateCcw size={10} />
                </div>
             </div>
          </div>
          
          <div className="p-5 bg-white border-4 border-slate-100 rounded-3xl flex items-center justify-between shadow-2xl relative">
             <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-tighter text-slate-700">Composite Control Output (u)</span>
                <code className="text-[10px] text-coral font-mono italic bg-slate-50 px-2 py-0.5 rounded mt-1">u_total = 1/G(s)·r + C(s)·e</code>
             </div>
             <div className="flex gap-1.5 px-2">
                {[0.1, 0.2, 0.3, 0.4, 0.5].map((d, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [8, 20, 8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * d }}
                    className="w-1.5 bg-gradient-to-t from-deep-blue to-emerald-400 rounded-full"
                  />
                ))}
             </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Strategy: Open-Loop Compensation + Feedback</div>
      </div>
    );
  },
  FrequencyResponseDiagram: () => {
    const [scan, setScan] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => setScan(prev => (prev + 2) % 100), 50);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/5 opacity-40" />
        <div className="flex items-end gap-1 h-36 relative px-4 bg-white/10 rounded-xl border border-white/20 shadow-inner">
           {/* Scanning highlighting effect */}
           <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-deep-blue/10 to-transparent blur-xl pointer-events-none" style={{ left: `${scan}%` }} />
           
           {Array.from({ length: 44 }).map((_, i) => {
             const x = i / 44;
             const resonance = 0.15 + 0.8 * Math.exp(-Math.pow(x - 0.4, 2) / 0.01) + 0.3 * Math.exp(-Math.pow(x - 0.8, 2) / 0.02);
             const isActive = Math.abs(x * 100 - scan) < 5;
             return (
               <motion.div 
                 key={i}
                 className="flex-1 rounded-t-md transition-all duration-300 shadow-sm"
                 animate={{ 
                    height: `${resonance * 100}%`,
                    backgroundColor: isActive ? '#FF6B35' : '#e2e8f0',
                    opacity: isActive ? 1 : 0.6
                 }}
               />
             );
           })}
           <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-lg text-[9px] font-black text-coral uppercase flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse" />
             Resonant Peak @ 12.4 rad/s
           </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-black opacity-30">
          Open-Loop Frequency Response Spectrum
        </div>
        <div className="absolute top-4 left-4 flex gap-4">
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-0.5 bg-coral rounded-full" />
             <span className="text-[7px] font-bold text-slate-400 uppercase">Magnitude</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-0.5 bg-slate-300 rounded-full" />
              <span className="text-[7px] font-bold text-slate-400 uppercase">Phase</span>
           </div>
        </div>
      </div>
    );
  },
  OptimalCostDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#f1f5f9_0%,transparent_70%)] opacity-50" />
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-6">
           {/* 3D-like Paraboloid visualization with enhanced grid */}
           <div className="relative w-56 h-36 bg-white/30 rounded-2xl border border-slate-100 p-4 shadow-inner">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
                 {/* Wireframe lines */}
                 {[20, 30, 40].map(y => (
                   <path key={y} d={`M 0 ${50-y/2} Q 100 ${110-y/2} 200 ${50-y/2}`} fill="none" stroke="#64748b" strokeWidth="0.5" opacity="0.1" />
                 ))}
                 <path d="M 0 50 Q 100 110 200 50" fill="none" stroke="#004E89" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
                 
                 {/* The "Ball" illustrating gradient descent */}
                 <motion.circle 
                   animate={{ 
                      cx: [20, 100, 180, 100, 20],
                      cy: [40, 80, 40, 80, 40] 
                   }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   r="7" fill="#FF6B35" className="shadow-[0_0_20px_#FF6B35]"
                 />
              </svg>
              <div className="absolute top-2 right-2 text-[7px] font-mono text-slate-400 uppercase tracking-widest">Gradient ∇J</div>
           </div>
           
           <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-2xl relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Target size={8} className="text-white" />
              </div>
              <code className="text-[11px] font-black text-deep-blue tracking-tighter">min J = ∫₀^∞ (xᵀQx + uᵀRu) dt</code>
              <p className="text-[8px] text-slate-400 mt-1 uppercase font-black tracking-widest italic opacity-60">Quadratic Performance Index optimality</p>
           </div>
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase font-black opacity-30 italic">LQR Optimization Engine</div>
      </div>
    );
  },
  KalmanBlockDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-grid-emerald-500/[0.05]" />
        <div className="flex items-center gap-1 relative z-10 w-full max-w-sm justify-between">
           {/* Predict Step */}
           <div className="relative flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-white border-2 border-emerald-500 rounded-full flex flex-col items-center justify-center p-3 shadow-2xl relative">
                 <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping pointer-events-none" />
                 <FastForward className="text-emerald-500 mb-1" size={24} />
                 <span className="text-[10px] font-black uppercase text-emerald-500 tracking-tighter">Predict</span>
              </div>
              <div className="text-[8px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase">State Matrix (A)</div>
           </div>

           <div className="flex flex-col items-center gap-2 flex-1">
             <div className="w-full h-px bg-slate-200 border-t border-dashed relative">
                <motion.div 
                   animate={{ x: ['0%', '100%'], opacity: [0, 1, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500/10 rounded-full blur-sm"
                />
             </div>
             <div className="bg-white/80 border border-slate-100 rounded-full p-2 shadow-lg scale-90">
                <ArrowLeft className="text-slate-300 rotate-180" size={20} />
             </div>
             <span className="text-[9px] font-mono text-slate-400 font-black">X̂ₖ|ₖ₋₁</span>
           </div>

           {/* Update Step */}
           <div className="relative flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-white to-coral/5 border-2 border-[#FF6B35] rounded-full flex flex-col items-center justify-center p-3 shadow-2xl relative">
                 <div className="absolute inset-0 border-2 border-coral/20 rounded-full animate-pulse pointer-events-none" />
                 <RotateCcw className="text-coral mb-1" size={24} />
                 <span className="text-[10px] font-black uppercase text-coral tracking-tighter">Correct</span>
              </div>
              <div className="text-[8px] font-mono text-coral font-bold bg-coral/5 px-2 py-0.5 rounded uppercase">Kalman Gain (K)</div>
           </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-2xl">
           <div className="flex items-center gap-1.5 border-r border-slate-100 pr-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tight">Covariance Extrapolation (P)</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-coral animate-ping shadow-[0_0_8px_#FF6B35]" />
              <span className="text-[8px] font-black text-coral uppercase tracking-tight">Measurement Innovation</span>
           </div>
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Recursive Optimal Estimator</div>
      </div>
    );
  },
  MPCHorizonDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04]" />
        <div className="w-full h-full flex flex-col justify-center gap-10 relative z-10">
           <div className="flex items-end h-40 gap-1.5 px-6 pt-4 bg-white/20 rounded-2xl border border-white/40 shadow-inner relative overflow-hidden">
              <div className="absolute top-4 left-6 text-[8px] font-mono text-slate-400 uppercase font-black tracking-widest">Future Cost Optimization J(k)</div>
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${20 + Math.sin(i * 0.4) * 60}%` }}
                  className={cn(
                    "flex-1 rounded-t-md transition-shadow duration-500",
                    i === 0 ? "bg-coral shadow-[0_0_20px_rgba(255,107,53,0.5)] border-t-2 border-white/50" : "bg-emerald-500"
                  )}
                  style={{ 
                    opacity: i === 0 ? 1 : 0.5 - (i/18)*0.4,
                    filter: i === 0 ? 'none' : 'grayscale(30%) brightness(0.9)'
                  }}
                />
              ))}
           </div>
           
           <div className="flex justify-between items-center bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200 shadow-2xl">
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Receding Horizon Strategy</span>
                    <div className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] rounded border border-emerald-200 font-mono">N=18</div>
                 </div>
                 <span className="text-[9px] text-slate-400 font-bold italic mt-0.5">Solving QP for optimal control sequence Δu(k)</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end gap-1">
                   <div className="px-3 py-1 bg-coral/10 border border-coral/30 rounded-full text-[9px] font-black text-coral uppercase tracking-widest flex items-center gap-2">
                     <Play size={10} strokeWidth={3} />
                     Commit u(k)
                   </div>
                 </div>
                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10B981]" />
              </div>
           </div>
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase font-black tracking-[0.2em] opacity-30 italic">Predictive Multivariable Control Engine</div>
      </div>
    );
  },
  MRACDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col justify-center gap-6 text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
         <div className="absolute inset-0 bg-grid-coral/[0.03]" />
         <div className="flex flex-col gap-4 relative z-10 w-full max-w-sm mx-auto">
            <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden">
               <div className="absolute right-0 top-0 w-24 h-full bg-deep-blue/5 -skew-x-12 translate-x-12" />
               <div className="flex flex-col relative z-10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ideal Reference Model</span>
                  <span className="text-xs font-black text-slate-900 italic tracking-tighter">Matched Behavior W_m(s)</span>
               </div>
               <Activity size={18} className="text-deep-blue animate-pulse" />
            </div>
            
            <div className="relative h-16 flex items-center justify-center">
               <div className="absolute inset-x-0 h-1 bg-slate-100 rounded-full" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-12 h-12 bg-white border-2 border-coral rounded-full flex items-center justify-center shadow-xl relative z-20 transition-transform group-hover:scale-110"
               >
                  <Settings size={20} className="text-coral" />
               </motion.div>
               <div className="absolute top-0 right-0 text-[8px] font-black text-coral uppercase tracking-[0.2em] bg-white px-3 py-1.5 rounded-full border border-coral/20 shadow-lg">MIT Adaptation Policy</div>
               
               {/* Signal arrows */}
               <motion.div 
                 animate={{ x: [-20, 20], opacity: [0, 1, 0] }}
                 transition={{ duration: 1, repeat: Infinity }}
                 className="absolute left-1/4 top-1/2 -translate-y-1/2 text-coral"
               >
                 <ArrowRight size={12} strokeWidth={3} />
               </motion.div>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-inner flex items-center justify-between opacity-80 group-hover:opacity-100 transition-all duration-500">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Non-Stationary Plant</span>
                  <span className="text-xs font-black text-slate-500 italic tracking-tighter">Time-Varying Parameters G(s, θ)</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[8px] font-mono text-slate-400">θ̂ → θ</span>
                 <RotateCcw size={18} className="text-slate-300" />
               </div>
            </div>
         </div>
         <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 font-black uppercase opacity-30 italic tracking-widest">A-SMC: Adaptive Model Reference Engine</div>
      </div>
    );
  },
  NNControlDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
         <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:30px_30px] opacity-100" />
         <div className="flex gap-16 items-center relative z-10 p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-white shadow-2xl">
            {/* Input Layer */}
            <div className="flex flex-col gap-8">
               {[0, 1].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full bg-white border-2 border-slate-200 relative shadow-md">
                    <motion.div 
                      animate={{ x: [0, 64], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-0.5 bg-coral shadow-[0_0_8px_#FF6B35]" 
                    />
                 </div>
               ))}
               <div className="text-[7px] font-mono text-slate-400 absolute -bottom-6 w-16 text-center">Reference Input</div>
            </div>

            {/* Hidden Layer */}
            <div className="flex flex-col gap-4">
               {[0, 1, 2].map(i => (
                 <motion.div 
                   key={i}
                   animate={{ backgroundColor: ['#ffffff', '#FF6B3510', '#ffffff'] }}
                   transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                   className="w-8 h-8 rounded-full bg-white border-2 border-coral flex items-center justify-center shadow-lg shadow-coral/5"
                 >
                    <div className="w-1.5 h-1.5 bg-coral rounded-full" />
                 </motion.div>
               ))}
               <div className="text-[7px] font-mono text-slate-400 absolute -bottom-6 w-24 left-1/2 -translate-x-1/2 text-center">Neural Mapping (σ)</div>
            </div>

            {/* Output Layer */}
            <div className="flex flex-col justify-center">
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-deep-blue to-[#003865] flex items-center justify-center shadow-2xl relative border-2 border-white/20">
                  <div className="text-white font-black text-xs">Σ</div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 rounded-2xl blur-md"
                  />
                  <div className="text-[7px] font-mono text-slate-400 absolute -bottom-8 w-16 text-center left-1/2 -translate-x-1/2">Control Law u(t)</div>
               </div>
            </div>
         </div>
         <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Neuro-Adaptive Control Infrastructure</div>
         <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-400 font-bold bg-white/40 px-2 py-1 rounded shadow-sm border border-slate-100">
           Weights Optimization: backprop-v2
         </div>
      </div>
    );
  },
  RTOSSchedulerDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
         <div className="flex flex-col gap-4 w-full">
            {[
              { label: 'Control Task', color: 'bg-coral' },
              { label: 'Safety Task', color: 'bg-emerald-500' },
              { label: 'Network Task', color: 'bg-deep-blue' }
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4">
                 <span className="text-[8px] font-black text-slate-400 w-20 uppercase tracking-tighter">{task.label}</span>
                 <div className="flex-1 h-6 bg-white rounded-xl relative overflow-hidden border border-slate-200 shadow-inner">
                    <motion.div 
                      animate={{ left: ['0%', '80%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                      className={cn("absolute inset-y-1 w-1/4 rounded-lg shadow-lg", task.color)}
                    >
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    </motion.div>
                 </div>
              </div>
            ))}
            <div className="h-px bg-slate-200 mt-4 relative">
               <div className="absolute top-0 left-0 text-[8px] font-mono text-slate-400 mt-2">t=0</div>
               <div className="absolute top-0 right-0 text-[8px] font-mono text-slate-400 mt-2 italic">Pre-emptive Tick</div>
            </div>
         </div>
         <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 font-black tracking-widest uppercase opacity-40">Kernel Task Scheduler</div>
      </div>
    );
  },
  QuantumCircuitDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#f1f5f9_0%,transparent_80%)] opacity-100" />
         <div className="flex flex-col gap-12 w-full max-w-sm relative z-10">
            {[0, 1].map(q => (
              <div key={q} className="h-px bg-slate-200 relative">
                 <div className="absolute -left-12 -top-2 text-[10px] font-mono text-slate-400 font-black">|q{q}⟩</div>
                 <div className="flex absolute inset-0 items-center justify-around translate-y-[-50%] px-8">
                    <div className="w-8 h-8 bg-white border-2 border-emerald-500 rounded flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-500/10">H</div>
                    <div className="w-8 h-8 bg-white border-2 border-coral rounded flex items-center justify-center text-xs font-black shadow-lg shadow-coral/10">X</div>
                    <div className="w-8 h-8 bg-white border-2 border-deep-blue rounded-full flex items-center justify-center relative shadow-lg shadow-deep-blue/10">
                       <div className="w-1 h-1 bg-deep-blue rounded-full animate-ping" />
                    </div>
                 </div>
              </div>
            ))}
            <svg className="absolute inset-0 pointer-events-none stroke-slate-200 fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
               <line x1="10" y1="0" x2="10" y2="100" strokeWidth="0.5" strokeDasharray="2 2" />
               <line x1="50" y1="0" x2="50" y2="100" strokeWidth="0.5" strokeDasharray="2 2" />
               <line x1="90" y1="0" x2="90" y2="100" strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>
         </div>
         <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black opacity-40">Algorithmic State Superposition</div>
      </div>
    );
  },
  DroneSystemDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm transition-all duration-500 hover:border-emerald-200">
         <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
         <div className="grid grid-cols-2 gap-8 relative z-10 w-full max-w-sm">
            <motion.div 
               whileHover={{ y: -5 }}
               className="p-5 bg-white rounded-3xl border border-slate-200 flex flex-col items-center gap-4 shadow-xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 -rotate-45 translate-x-8 -translate-y-8" />
               <div className="p-3 bg-emerald-500/10 rounded-2xl relative z-10">
                  <Activity className="text-emerald-500" size={20} />
               </div>
               <div className="text-center relative z-10">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">Perception</span>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono font-bold">EKF State Fusion</p>
               </div>
            </motion.div>
            
            <motion.div 
               whileHover={{ y: -5 }}
               className="p-5 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200 flex flex-col items-center gap-4 shadow-xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-16 h-16 bg-coral/5 -rotate-45 translate-x-8 -translate-y-8" />
               <div className="p-3 bg-coral/10 rounded-2xl relative z-10">
                  <Zap className="text-coral" size={20} />
               </div>
               <div className="text-center relative z-10">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">Controller</span>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono font-bold">SO(3) Geometric</p>
               </div>
            </motion.div>
         </div>
         
         {/* Animated propellers with improved styling */}
         {[
           { top: '15%', left: '15%' },
           { top: '15%', right: '15%' },
           { bottom: '15%', left: '15%' },
           { bottom: '15%', right: '15%' }
         ].map((pos, i) => (
           <motion.div 
             key={i}
             className="absolute w-16 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full shadow-sm" 
             style={pos}
             animate={{ rotate: 360 }}
             transition={{ duration: 0.08, repeat: Infinity, ease: "linear" }}
           />
         ))}
         
         <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase font-black opacity-30 italic tracking-widest">Autonomous Aerial Navigation Stack</div>
         <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-slate-100 shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-slate-400 uppercase">GPS Lock: RTK Fix</span>
         </div>
      </div>
    );
  },
  SamplingDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path d="M 0 100 Q 50 40 100 100 T 200 100 T 300 100 T 400 100" 
              stroke="#004E89" strokeWidth="2" fill="none" opacity="0.15"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-around px-12 z-10">
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} className="flex flex-col items-center gap-2">
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="w-3 h-3 bg-white border-2 border-coral rounded-full shadow-lg shadow-coral/20 relative z-10" 
               style={{marginTop: `${Math.sin(i*0.8)*35}px`}}
            >
               <div className="absolute inset-0 bg-coral/20 animate-ping rounded-full" />
            </motion.div>
            <div className="w-px h-12 bg-gradient-to-down from-coral/20 to-transparent border-l border-dashed border-slate-300"/>
          </div>
        ))}
      </div>
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">
        A/D Stage: Temporal Discretization
      </div>
      <div className="absolute bottom-4 left-4 text-[9px] font-mono text-coral uppercase font-black flex items-center gap-3 bg-white/60 px-3 py-1.5 rounded-full border border-coral/10 shadow-sm">
        <div className="w-2 h-2 bg-coral rounded-full animate-pulse shadow-[0_0_10px_#FF6B35]"/>
        Sampled Function x[n] = x(nTs)
      </div>
      <div className="absolute top-4 right-4 text-[10px] font-mono text-emerald-600 uppercase font-black italic bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
        Nyquist-Safe: fs &gt; 2fmax
      </div>
    </div>
  ),
  FFTDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
      <div className="flex gap-16 items-center relative z-10 w-full justify-around max-w-sm px-6 py-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white shadow-xl">
        <div className="flex flex-col gap-3 items-center w-36">
          <div className="w-full h-16 flex items-end gap-1 px-2 bg-slate-50/50 rounded-lg border border-slate-100 shadow-inner">
             {Array.from({ length: 24 }).map((_, i) => (
                <motion.div 
                   key={i} 
                   animate={{ height: `${30 + Math.sin(i*0.5)*40}%` }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                   className="flex-1 bg-deep-blue/40 rounded-t-sm"
                />
             ))}
          </div>
          <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase font-black">Time Signal x(t)</span>
        </div>

        <div className="flex flex-col items-center gap-2">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className="w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center relative shadow-inner"
           >
              <div className="absolute inset-0 border-t-2 border-deep-blue rounded-full shadow-[0_0_15px_rgba(0,78,137,0.2)]" />
              <div className="w-2.5 h-2.5 bg-coral rounded-full shadow-[0_0_10px_#FF6B35]" />
           </motion.div>
           <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[7px] font-mono font-black tracking-widest">Butterfly Op</div>
        </div>
        
        <div className="flex flex-col gap-3 items-center w-36">
          <div className="flex items-end gap-1.5 h-16 px-4 bg-slate-50/50 rounded-lg border border-slate-100 shadow-inner">
            <div className="w-2 h-4 bg-coral/10 rounded-t" />
            <motion.div 
               animate={{ height: ['40%', '80%', '40%'] }}
               className="w-2.5 bg-coral rounded-t-md shadow-[0_0_12px_#FF6B35]" 
            />
            <div className="w-2 h-3 bg-coral/5 rounded-t" />
            <motion.div 
               animate={{ height: ['20%', '50%', '20%'] }}
               transition={{ delay: 0.5 }}
               className="w-2.5 bg-coral/40 rounded-t-md shadow-sm" 
            />
          </div>
          <span className="text-[8px] text-coral font-mono tracking-widest uppercase font-black">Frequency X(f)</span>
        </div>
      </div>
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Cooley-Tukey Radix-2 Processor</div>
      <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-400 uppercase font-black tracking-widest opacity-40 bg-white/40 px-2 py-1 rounded">Complexity: O(N log₂ N)</div>
    </div>
  ),
  ZPlaneDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
       <div className="absolute inset-0 bg-grid-slate-900/[0.04]" />
       <div className="absolute w-full h-[1px] bg-slate-200/60" />
       <div className="absolute w-[1px] h-full bg-slate-200/60" />
       
       <div className="relative w-48 h-48 border-2 border-slate-300 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
          <div className="absolute inset-0 border border-deep-blue/10 rounded-full animate-pulse scale-[1.02]" />
          
          {/* Stability Boundary Marker */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
             <span className="text-[8px] font-mono text-slate-400 uppercase font-black tracking-widest">Unit Circle |z|=1</span>
          </div>

          {/* Poles (X) */}
          <motion.div 
            initial={{ scale: 0, rotate: -45 }} 
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-1/4 left-1/4 text-3xl text-coral font-black drop-shadow-[0_0_10px_rgba(255,107,53,0.3)] transition-transform hover:scale-125 cursor-help"
            title="Stable Pole"
          >×</motion.div>
          <motion.div 
            initial={{ scale: 0, rotate: -45 }} 
            animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15 }}
            className="absolute bottom-1/4 left-1/4 text-3xl text-coral font-black drop-shadow-[0_0_10px_rgba(255,107,53,0.3)] transition-transform hover:scale-125 cursor-help"
            title="Stable Pole"
          >×</motion.div>
          
          {/* Zero (O) */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 right-6 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-deep-blue/40 flex items-center justify-center transition-transform hover:scale-125 cursor-help bg-white/50"
            title="System Zero"
          >
             <div className="w-2 h-2 bg-deep-blue rounded-full animate-ping" />
          </motion.div>
       </div>
       
       <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-black opacity-30 italic">Complex Z-Domain Mapping</div>
       <div className="absolute bottom-4 left-4 text-[9px] font-mono font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
          STATUS: MINIMUM PHASE SYSTEM
       </div>
    </div>
  ),
  FIRFilterBlock: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
      <div className="flex items-center gap-1 relative z-10 w-full max-w-sm justify-between px-4 py-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-2xl">
        <div className="flex flex-col items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[9px] font-mono text-slate-500 font-bold shadow-sm">x[n]</div>
          <ArrowDown className="text-slate-300" size={14} />
          <div className="w-3 h-3 bg-deep-blue rounded-full shadow-[0_0_10px_rgba(0,78,137,0.3)] animate-pulse" />
        </div>

        <div className="flex-1 px-4">
           <div className="relative p-6 bg-white border-2 border-deep-blue/10 rounded-3xl flex flex-col items-center shadow-xl">
              <div className="absolute -top-3 px-3 py-1 bg-deep-blue text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">LTI Transfer Function</div>
              <span className="text-[13px] font-black text-slate-800 italic tracking-widest font-mono">H(z) = Σ bₖ z⁻ᵏ</span>
              
              <div className="flex items-end gap-1.5 h-10 mt-4 overflow-hidden">
                {[0.1, 0.3, 0.8, 0.5, 0.2].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${h * 100}%` }}
                    className="w-2 bg-gradient-to-t from-deep-blue/80 to-coral/80 rounded-t-sm"
                  />
                ))}
              </div>
              <p className="text-[7px] text-slate-400 mt-2 uppercase font-black tracking-widest">Weighted Tap Coefficients</p>
           </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[9px] font-mono text-slate-500 font-bold shadow-sm">y[n]</div>
          <ArrowDown className="text-slate-300" size={14} />
          <div className="w-3 h-3 bg-coral rounded-full shadow-[0_0_10px_rgba(255,107,53,0.3)]" />
        </div>
      </div>
      
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Feed-Forward Processing (FIR)</div>
      <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-400 font-bold bg-white/40 px-2 py-1 rounded border border-slate-100">STABILITY: ALWAYS GUARANTEED</div>
    </div>
  ),
  WindowingDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-grid-slate-200/30" />
      <div className="relative w-64 h-32 flex items-end justify-center gap-1">
        {Array.from({ length: 32 }).map((_, i) => {
          const x = (i / 31) * Math.PI;
          const window = 0.54 - 0.46 * Math.cos(2 * x); // Hamming
          return (
            <motion.div 
              key={i}
              className="w-1.5 bg-coral rounded-t-sm shadow-sm"
              style={{ opacity: 0.3 + window * 0.7 }}
              initial={{ height: 0 }}
              animate={{ height: `${window * 100}%` }}
              transition={{ delay: i * 0.02, duration: 0.5 }}
            />
          );
        })}
        <div className="absolute top-0 w-full flex justify-between px-2">
           <div className="p-1 bg-[#F7B801]/10 border border-[#F7B801]/30 rounded text-[8px] font-mono text-[#F7B801]">Bell Curve</div>
           <div className="p-1 bg-deep-blue/10 border border-deep-blue/30 rounded text-[8px] font-mono text-deep-blue">Zero Padding Risk</div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
         <Activity size={12} className="text-coral animate-pulse" />
         <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black opacity-40">Main Lobe Optimization</span>
      </div>
    </div>
  ),
  SpectrogramDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-6 flex flex-col gap-4 text-white border-4 border-slate-200 overflow-hidden relative shadow-sm">
      <div className="absolute inset-0 bg-slate-900" />
      <div className="grid grid-cols-12 grid-rows-8 gap-1 h-full relative z-10 p-2 bg-black/40 rounded-xl border border-white/5 shadow-2xl">
        {Array.from({ length: 96 }).map((_, i) => {
            const row = Math.floor(i / 12);
            const col = i % 12;
            const energy = Math.abs(Math.sin(col * 0.4 + row * 0.2) * Math.cos(row * 0.5 + col * 0.1));
            // Heatmap colors: Blue -> Green -> Yellow -> Red
            const color = energy > 0.8 ? '#ef4444' : energy > 0.6 ? '#f59e0b' : energy > 0.3 ? '#10b981' : '#1e3a8a';
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, backgroundColor: color }}
                transition={{ delay: i * 0.005 }}
                className="rounded shadow-[inset_0_0_5px_rgba(255,255,255,0.05)]" 
              />
            );
        })}
      </div>
      
      <div className="flex items-center justify-between relative z-10 px-2 mt-[-5px]">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-sm bg-[#ef4444]" />
               <span className="text-[7px] font-mono text-slate-400 uppercase font-black">High Power</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-sm bg-[#1e3a8a]" />
               <span className="text-[7px] font-mono text-slate-400 uppercase font-black">Noise Floor</span>
            </div>
         </div>
         <div className="text-[8px] font-mono text-emerald-400 font-black animate-pulse bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">REALTIME SPECTRUM SCAN</div>
      </div>

      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-40 italic">STFT Time-Frequency Distribution</div>
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-90 text-[8px] font-mono text-slate-500 tracking-[0.4em] font-black uppercase opacity-20">Frequency Axis (Hz)</div>
    </div>
  ),
  DSPHierarchy: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-grid-slate-900/[0.02]" />
      
      <div className="z-10 flex flex-col items-center gap-2 w-full max-w-sm">
        <motion.div 
          whileHover={{ y: -4 }}
          className="w-full p-4 bg-gradient-to-br from-[#004E89] to-[#002D50] border-2 border-white/20 rounded-3xl flex items-center justify-between shadow-2xl relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-12" />
           <Cpu size={20} className="text-white relative z-10" />
           <div className="flex flex-col items-center relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-white">Application Layer</span>
              <span className="text-[8px] text-white/60 font-mono italic">Complex Systems & AI</span>
           </div>
           <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse relative z-10" />
        </motion.div>

        <ArrowDown className="text-slate-300" size={18} />

        <motion.div 
          whileHover={{ y: -4 }}
          className="w-[90%] p-4 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center gap-4 shadow-xl relative"
        >
           <Layers size={20} className="text-coral" />
           <div className="flex flex-col items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Digital Processing</span>
              <span className="text-[8px] text-slate-400 font-mono font-bold">FFT / Multirate / Filter</span>
           </div>
        </motion.div>

        <ArrowDown className="text-slate-300" size={18} />

        <motion.div 
          whileHover={{ y: -4 }}
          className="w-[80%] p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-around shadow-inner"
        >
           <Settings size={18} className="text-slate-400" />
           <div className="flex flex-col items-center">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Hardware Abstraction</span>
             <span className="text-[7px] text-slate-400 font-mono">Registers & DMA</span>
           </div>
           <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
           </div>
        </motion.div>
      </div>

      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Signal Processing Structural Model</div>
      <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest px-3 py-1 border border-slate-100 rounded-full bg-white/40">Latency: &lt; 10ms</div>
    </div>
  ),
  ZieglerTable: () => {
    const [selected, setSelected] = useState(2);
    const rows = [
      { id: 0, l: 'P', kp: '0.5·Ku', ti: '—', td: '—', c: 'text-coral border-coral/30 bg-coral/5' },
      { id: 1, l: 'PI', kp: '0.45·Ku', ti: 'Pu/1.2', td: '—', c: 'text-deep-blue border-deep-blue/30 bg-deep-blue/5' },
      { id: 2, l: 'PID', kp: '0.6·Ku', ti: 'Pu/2', td: 'Pu/8', c: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' }
    ];
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
        <div className="grid grid-cols-4 gap-2 text-[11px] font-black text-slate-400 uppercase border-b-2 border-slate-100 pb-4 mb-4 relative z-10 px-2 font-mono italic">
          <span>Control Mode</span><span>Gain Kp</span><span>Integral Ti</span><span>Derivative Td</span>
        </div>
        <div className="flex flex-col gap-3 relative z-10">
          {rows.map(r => (
            <motion.div 
              key={r.id}
              onClick={() => setSelected(r.id)}
              whileHover={{ x: 5, scale: 1.01 }}
              className={cn(
                "grid grid-cols-4 gap-2 items-center p-3 rounded-2xl transition-all duration-300 cursor-pointer border-2",
                selected === r.id ? "bg-white shadow-2xl border-slate-100" : "opacity-30 grayscale-[80%] border-transparent"
              )}
            >
               <div className={cn("px-3 py-1 border-2 rounded-xl font-black text-[10px] text-center shadow-sm uppercase tracking-widest", r.c)}>{r.l} Mode</div>
               <span className="font-mono text-[10px] text-slate-600 font-black">{r.kp}</span>
               <span className="font-mono text-[10px] text-slate-400 italic">{r.ti}</span>
               <span className="font-mono text-[10px] text-slate-400 italic">{r.td}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-auto flex justify-between items-center border-t border-slate-100 pt-4 relative z-10">
           <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest italic font-black opacity-40">Frequency Response Heuristics</div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <span className="w-2 h-2 bg-coral rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-slate-500 uppercase">Ku: Ultimate Gain</span>
           </div>
        </div>
      </div>
    );
  },
  ControlHierarchy: () => {
    const [active, setActive] = useState(0);
    const levels = [
      { t: 'Supervisory Loop (MIMO)', c: 'border-emerald-500 text-emerald-600 bg-emerald-500/5', desc: 'Real-time optimization & multi-agent coordination.' },
      { t: 'Regulation Loop (PID)', c: 'border-deep-blue text-deep-blue bg-deep-blue/5', desc: 'High-speed deterministic feedback (1-10ms).' },
      { t: 'Actuation & Hardware', c: 'border-coral text-coral bg-coral/5', desc: 'Physical signal processing & driver interface.' }
    ];
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
        <div className="flex flex-col items-center w-full max-w-xs gap-3">
           {levels.map((l, i) => (
             <React.Fragment key={i}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full p-4 border-2 rounded-3xl text-[10px] font-black text-center transition-all shadow-xl uppercase tracking-widest",
                    active === i ? l.c : "border-slate-100 text-slate-400 bg-white opacity-40 shadow-none"
                  )}
                >
                  {l.t}
                </motion.button>
                {i < 2 && <ArrowLeft className="rotate-270 text-slate-200" size={16} />}
             </React.Fragment>
           ))}
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase font-black opacity-40">Automation Pyramid</div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={active}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm w-full max-w-sm"
          >
            <p className="text-[9px] text-slate-600 font-bold italic text-center tracking-tight leading-relaxed">
               {levels[active].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  },
  BLDCDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#f8fafc,#f1f5f9,#f8fafc)] opacity-40" />
      <div className="absolute inset-0 bg-grid-slate-900/[0.01]" />
      
      <div className="relative w-56 h-56 border-8 border-slate-100/50 rounded-full flex items-center justify-center shadow-inner">
        {/* Stator Coils */}
        {[0, 120, 240].map((angle, i) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
            <div className="h-14 w-8 bg-white border-2 border-slate-200 rounded-2xl -translate-y-24 flex flex-col items-center justify-center relative shadow-xl overflow-hidden transition-all group-hover:border-coral/50">
               <div className="absolute inset-0 bg-gradient-to-b from-coral/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
               <span className="text-[10px] font-black z-10 text-slate-400 tracking-tighter italic">Φ_{['A', 'B', 'C'][i]}</span>
               <div className="absolute bottom-1 w-4 h-0.5 bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
        {/* Rotor */}
        <motion.div 
          className="w-36 h-36 rounded-full border-4 border-deep-blue/20 flex items-center justify-center relative shadow-2xl bg-white/80 backdrop-blur-sm group cursor-pointer"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-2 w-6 h-6 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center">
             <span className="text-white text-[8px] font-black">N</span>
          </div>
          <div className="absolute bottom-2 w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center">
             <span className="text-white text-[8px] font-black">S</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center shadow-inner">
             <Zap size={20} className="text-[#F7B801] animate-pulse" />
          </div>
        </motion.div>
        
        {/* Magnetic Flux Lines (Decorative) */}
        <div className="absolute w-full h-full border border-dashed border-deep-blue/5 rounded-full animate-spin-slow" />
      </div>

      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">High-Torque Permanent Magnet Synchronous Engine</div>
      <div className="absolute bottom-4 left-4 flex gap-3 px-3 py-1.5 bg-white shadow-sm border border-slate-100 rounded-full items-center">
         <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
         <span className="text-[8px] font-mono font-black text-slate-500 uppercase">Commutation: Sensorless Observer v4</span>
      </div>
    </div>
  ),
  FOCBlockDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
      <div className="flex gap-2 items-center relative z-10 w-full max-w-lg bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white shadow-2xl">
        <div className="flex flex-col items-center gap-2">
           <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[8px] font-mono lowercase text-slate-400 font-bold">I_abc</div>
           <ArrowDown className="text-slate-300" size={12} />
           <motion.div whileHover={{ scale: 1.1 }} className="px-4 py-2 bg-deep-blue text-white rounded-xl font-black text-[10px] shadow-lg shadow-deep-blue/20">CLARKE</motion.div>
        </div>
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1, repeat: Infinity }} className="w-6 h-px bg-slate-200" />
        <div className="flex flex-col items-center gap-2">
           <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[8px] font-mono italic lowercase text-slate-400 font-bold">I_αβ</div>
           <ArrowDown className="text-slate-300" size={12} />
           <motion.div whileHover={{ scale: 1.1 }} className="px-4 py-2 bg-coral text-white rounded-xl font-black text-[10px] shadow-lg shadow-coral/20">PARK</motion.div>
        </div>
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} className="w-6 h-px bg-slate-200" />
        <div className="flex flex-col items-center gap-2">
           <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[8px] font-mono lowercase text-slate-400 font-bold">I_dq</div>
           <ArrowDown className="text-slate-300" size={12} />
           <motion.div whileHover={{ scale: 1.1 }} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] shadow-lg shadow-emerald-500/20">PI_REGS</motion.div>
        </div>
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} className="w-8 h-px bg-slate-200" />
        <div className="flex flex-col items-center gap-2">
           <motion.div whileHover={{ scale: 1.1 }} className="px-4 py-2 bg-[#F7B801] text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-[#F7B801]/20 tracking-widest">SVPWM</motion.div>
           <span className="text-[7px] font-mono text-slate-400 mt-1 uppercase font-black tracking-widest">Vector Drive</span>
        </div>
      </div>
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Torque-Flux Decoupling Architecture</div>
      <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-400 font-bold bg-white/40 px-3 py-1 rounded-full border border-slate-100">Coordinate Transform: Cartesian → Polar</div>
    </div>
  ),
  KinematicsDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
      <div className="relative w-64 h-64">
        {/* Base */}
        <div className="absolute bottom-10 left-10 w-12 h-4 bg-slate-200 rounded-sm" />
        {/* Links */}
        <motion.div 
          className="absolute bottom-14 left-16 w-32 h-3 bg-deep-blue/40 rounded-full origin-left"
          animate={{ rotate: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="absolute left-0 w-6 h-6 bg-white border-2 border-slate-200 rounded-full -translate-x-3 -translate-y-1.5 shadow-sm" />
          <motion.div 
            className="absolute right-0 w-24 h-3 bg-coral/40 rounded-full origin-left"
            animate={{ rotate: [40, -40, 40] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
             <div className="absolute left-0 w-6 h-6 bg-white border-2 border-slate-200 rounded-full -translate-x-3 -translate-y-1.5 shadow-sm" />
             {/* End Effector */}
             <div className="absolute right-0 w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#F7B801] rounded-full shadow-[0_0_12px_#F7B801] animate-pulse" />
                <div className="absolute -top-4 text-[8px] font-mono text-[#F7B801] font-black uppercase whitespace-nowrap">End Effector</div>
             </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase font-black opacity-40">Forward/Inverse Kinematics</div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-deep-blue/40 font-bold italic">Joint Angles θ1, θ2</div>
    </div>
  ),
  DynamicsDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col items-center justify-center gap-6 text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
      <div className="flex gap-16 items-end h-32 relative">
         <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
               <Settings size={120} />
            </motion.div>
         </div>
         <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-deep-blue/10 border-2 border-deep-blue/30 rounded-2xl flex items-center justify-center font-black text-xl text-deep-blue shadow-xl shadow-deep-blue/10">ΣF</div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-black">Forces</span>
         </div>
         <ArrowLeft className="rotate-180 text-slate-200" size={24} />
         <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-coral/10 border-2 border-coral/30 rounded-2xl flex items-center justify-center font-black text-xl text-coral shadow-xl shadow-coral/10">m·a</div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-black">Inertia</span>
         </div>
      </div>
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black opacity-40">Euler-Lagrange Equation</div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-[#F7B801] bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm font-bold">d/dt(∂L/∂q̇) - ∂L/∂q = Q</div>
    </div>
  ),
  PathPlanningDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.03]" />
        <div className="relative w-full h-full max-w-sm max-h-[180px] bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl p-6">
           {/* Obstacles */}
           <motion.div 
             animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
             className="absolute top-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-100 border-2 border-slate-200 rounded-2xl shadow-sm rotate-12 flex items-center justify-center"
           >
              <div className="w-8 h-8 border border-slate-200 rounded-lg opacity-20" />
           </motion.div>
           <motion.div 
             animate={{ scale: [1.05, 1, 1.05] }} transition={{ duration: 5, repeat: Infinity }}
             className="absolute bottom-12 left-1/4 w-20 h-20 bg-slate-100 border-2 border-slate-200 rounded-2xl shadow-sm -rotate-6"
           />
           
           {/* Start/Goal Markers */}
           <div className="absolute bottom-4 left-4 flex flex-col items-center gap-1.5">
              <div className="w-5 h-5 bg-emerald-500/20 rounded-full animate-ping absolute" />
              <div className="w-5 h-5 bg-emerald-500 rounded-full z-10 border-2 border-white shadow-lg flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">S₀</span>
           </div>
           
           <div className="absolute top-4 right-4 flex flex-col items-center gap-1.5">
              <div className="w-5 h-5 bg-coral/20 rounded-full animate-ping absolute" />
              <div className="w-5 h-5 bg-coral rounded-full z-10 border-2 border-white shadow-lg flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <span className="text-[9px] font-black uppercase text-coral tracking-tighter">S_goal</span>
           </div>

           {/* Optimal Path */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(255,107,53,0.4)]">
              <motion.path 
                d="M 40 140 C 120 140, 80 80, 180 80 S 300 40, 360 40" 
                fill="none" 
                stroke="#FF6B35" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="10 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
           </svg>
        </div>
        
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Global Navigation: Dijkstra-A* Hybrid</div>
        <div className="absolute bottom-4 right-4 text-[9px] font-mono text-slate-400 font-bold bg-white/60 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm animate-pulse">
          Recalculating Trajectory...
        </div>
    </div>
  ),
  RoboticsProjectDiagram: () => (
    <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-900/[0.02]" />
        <div className="absolute top-0 left-0 p-5 w-full flex justify-between items-center relative z-20">
           <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest">System Integration Hash: 0x82f4</span>
              <span className="text-[7px] text-slate-300 font-mono">Build Pipeline: stable-deploy-v2</span>
           </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 w-full relative z-10 max-w-sm">
           {[
             { icon: Cpu, label: 'Firmware', color: 'text-deep-blue', bg: 'bg-deep-blue/5' },
             { icon: Zap, label: 'Power', color: 'text-coral', bg: 'bg-coral/5' },
             { icon: Navigation, label: 'Navigation', color: 'text-emerald-500', bg: 'bg-emerald-500/5' }
           ].map((m, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5 }}
               className="p-5 bg-white/80 backdrop-blur-sm border-2 border-slate-100 rounded-3xl flex flex-col items-center gap-3 shadow-xl relative overflow-hidden"
             >
                <div className={cn("p-2.5 rounded-2xl", m.bg)}>
                   <m.icon className={m.color} size={24} />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">{m.label}</span>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5, delay: i * 0.2 }}
                     className={cn("h-full", m.bg.replace('/5', '/60'))} 
                   />
                </div>
             </motion.div>
           ))}
        </div>
        
        <motion.div 
          initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: -5 }}
          className="absolute -bottom-2 -right-4 bg-[#10b981] text-white font-black px-10 py-3 rounded-full text-sm shadow-2xl z-20 border-4 border-white transform hover:scale-110 transition-transform cursor-default select-none"
        >
          BUILD SUCCESSFUL
        </motion.div>
        
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Continuous Integration & Hardware-in-the-Loop</div>
    </div>
  ),
  CareerRoadmapDiagram: () => {
    return (
      <div className="bg-slate-50 aspect-video rounded-3xl p-8 flex flex-col items-center justify-center text-slate-900 border-4 border-slate-200 relative overflow-hidden group shadow-sm">
         <div className="absolute inset-0 bg-grid-deep-blue/5 opacity-5" />
         <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-sm">
            <div className="flex items-center gap-2 w-full">
               {[
                 { id: 1, color: 'text-deep-blue', border: 'border-deep-blue/20' },
                 { id: 2, color: 'text-coral', border: 'border-coral/20' },
                 { id: 3, color: 'text-emerald-500', border: 'border-emerald-500/20' }
               ].map((step, i) => (
                 <React.Fragment key={step.id}>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn("w-14 h-14 bg-white border-2 rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0", step.color, step.border)}
                    >
                      {step.id}
                    </motion.div>
                    {i < 2 && <div className="flex-1 h-0.5 bg-slate-200 border-t border-dashed opacity-50" />}
                 </React.Fragment>
               ))}
            </div>
            
            <div className="grid grid-cols-3 w-full text-center">
               <span className="text-[9px] font-black uppercase text-slate-400 leading-tight">Control<br/>Specialist</span>
               <span className="text-[9px] font-black uppercase text-coral/70 leading-tight">Full-Stack<br/>Roboticist</span>
               <span className="text-[9px] font-black uppercase text-slate-400 leading-tight">CTO /<br/>Architect</span>
            </div>
            
            <motion.div 
              whileHover={{ x: 5 }}
              className="mt-2 p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-100 rounded-3xl w-full flex items-center gap-4 shadow-xl"
            >
               <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Rocket size={20} className="text-emerald-500" />
               </div>
               <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-black uppercase italic tracking-tighter text-slate-400">Growth Trajectory</span>
                  <div className="h-2 bg-slate-100 rounded-full w-full mt-2 relative overflow-hidden">
                     <motion.div 
                        animate={{ left: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80" 
                     />
                  </div>
               </div>
            </motion.div>
         </div>
         <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black opacity-30 italic">Engineering Career Lifecycle</div>
      </div>
    );
  },
  // Aliases for Content Compatibility
  BodeDiagramBase: (props: Record<string, any>) => React.createElement(DIAGRAM_COMPONENTS.BodeDiagram, props),
  PoleZeroSimulation: (props: Record<string, any>) => React.createElement(DIAGRAM_COMPONENTS.PoleZeroDiagram, props),
  // Missing diagram keys — imported from DiagramComponents.tsx
  EntanglementDiagram,
};

// ─── QuizQuestion ──────────────────────────────────────────────────────────────
// Self-contained question with per-option state — shows red for wrong, green for
// correct, explanation after ANY click (not just correct answers).
interface QuizQuestionProps {
  q: { id: number; question: string; options: { id: string; text: string; correct: boolean }[]; explanation: string };
  alreadyCompleted: boolean;
  onCorrect: () => void;
}
function QuizQuestion({ q, alreadyCompleted, onCorrect }: QuizQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const revealed = alreadyCompleted || selectedId !== null;

  const handleClick = (optId: string, isCorrect: boolean) => {
    if (revealed) return;
    setSelectedId(optId);
    if (isCorrect) onCorrect();
  };

  return (
    <div className="space-y-6">
      <p className="text-xl font-bold leading-tight">{q.id}. {q.question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrect = opt.correct;
          let cls = 'bg-white border-slate-100 hover:border-[hsl(var(--color-primary))] cursor-pointer';
          if (revealed) {
            if (isCorrect)
              cls = 'bg-[hsl(var(--color-success)/0.08)] border-[hsl(var(--color-success))] text-[hsl(var(--color-success))]';
            else if (isSelected && !isCorrect)
              cls = 'bg-red-50 border-red-400 text-red-700';
            else
              cls = 'bg-white border-slate-100 opacity-40 cursor-default';
          }
          return (
            <button
              key={opt.id}
              onClick={() => handleClick(opt.id, opt.correct)}
              disabled={revealed}
              className={`text-right p-5 rounded-2xl border-2 transition-all font-bold text-sm flex items-center justify-between gap-3 ${cls}`}
            >
              <span className="flex-1">
                <span className="opacity-50 ml-3">{opt.id.toUpperCase()}.</span>
                {opt.text}
              </span>
              {revealed && isCorrect && <span className="shrink-0 text-base">✅</span>}
              {revealed && isSelected && !isCorrect && <span className="shrink-0 text-base">❌</span>}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed border ${
          alreadyCompleted || q.options.find(o => o.id === selectedId)?.correct
            ? 'bg-[hsl(var(--color-success)/0.07)] border-[hsl(var(--color-success)/0.3)] text-[hsl(var(--color-success))]'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {!alreadyCompleted && selectedId && !q.options.find(o => o.id === selectedId)?.correct && (
            <p className="font-black mb-1">❌ לא נכון — הנה מדוע:</p>
          )}
          {q.explanation}
        </div>
      )}
    </div>
  );
}

export default function DayPage({ id, onComplete, streak, onPrevDay, onNextDay }: DayPageProps) {
  const [, setLocation] = useLocation();
  const [showExtended, setShowExtended] = useState(false);
  const content = DAYS.find(d => d.day === id);

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[hsl(var(--color-bg))]">
        <h1 className="text-4xl font-black mb-4">404 — יום {id} לא נמצא</h1>
        <button 
          onClick={() => setLocation('/')}
          className="bg-[hsl(var(--color-primary))] text-white px-8 py-3 rounded-2xl font-bold"
        >
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  const { background, theory, simulation, challenge, summary, summary_extended } = content.sections;

  return (
    <div className="flex flex-col gap-16">
      <LessonShell dayContent={content as any} onComplete={onComplete} streak={streak} onPrevDay={onPrevDay} onNextDay={onNextDay}>
      {({ markComplete, completed, sectionRefs }) => (
        <>
          {/* Background Section */}
          <section id="background" ref={el => { sectionRefs.current['background'] = el; }} className="scroll-mt-24">
            <h2 className="text-3xl font-black text-[hsl(var(--color-primary))] mb-2">{content.title}</h2>
            <h3 className="text-xl font-bold text-[hsl(var(--color-secondary))] mb-5">{content.hero.subtitle}</h3>

            {/* ── Why Today banner ──────────────────────────────── */}
            <div className="mb-8 rounded-2xl bg-[hsl(var(--color-primary-soft))] border border-[hsl(var(--color-primary)/0.15)] p-5 flex gap-4 items-start">
              <div className="text-2xl shrink-0 mt-0.5">💡</div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-primary-ink))] mb-1">למה זה רלוונטי לך היום</p>
                <p className="text-[15px] font-semibold text-[hsl(var(--ink-800))] leading-snug">{content.hero.why_today}</p>
              </div>
            </div>

            <div className="space-y-10">

              {/* ── Full overview (summary_extended.overview) ────── */}
              {summary_extended?.overview && (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-text-faint))]">הסבר כללי</p>
                  <p className="text-[16px] leading-[1.8] text-[hsl(var(--ink-800))]">{summary_extended.overview}</p>
                </div>
              )}

              {/* ── Problem statement ──────────────────────────── */}
              <div className="border-r-4 border-[hsl(var(--color-secondary))] pr-5 py-1">
                <p className="text-[17px] leading-relaxed text-[hsl(var(--ink-800))]">{background.problem}</p>
              </div>

              {/* ── Real-world products ───────────────────────── */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-text-faint))] mb-3">רואים את זה בעולם האמיתי</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {background.real_world.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-[hsl(var(--color-border))] flex items-center gap-4 shadow-[var(--shadow-e1)]">
                      <div className="w-11 h-11 bg-[hsl(var(--color-primary-soft))] rounded-xl flex items-center justify-center text-[hsl(var(--color-primary))] shrink-0">
                        {(() => {
                          const IconComp = ICON_MAP[(item as any).icon] || Activity;
                          return <IconComp size={22} />;
                        })()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-[14px] text-[hsl(var(--ink-900))] leading-tight">{item.name}</h4>
                        <p className="text-[12px] text-[hsl(var(--color-text-muted))] mt-0.5">{item.sensor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Industrial applications (summary_extended) ─── */}
              {summary_extended?.applications && summary_extended.applications.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-text-faint))] mb-3">יישומים תעשייתיים אמיתיים</p>
                  <div className="flex flex-col gap-2">
                    {summary_extended.applications.map((app, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[hsl(var(--color-border))] shadow-[var(--shadow-e1)]">
                        <span className="w-6 h-6 rounded-full bg-[hsl(var(--color-secondary-soft))] text-[hsl(var(--color-secondary-ink))] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-[13px] leading-relaxed text-[hsl(var(--ink-800))]">{app}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Key ideas ─────────────────────────────────── */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-text-faint))] mb-3">3 רעיונות מרכזיים</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {background.key_ideas.map((idea, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[hsl(var(--color-border))] p-5 shadow-[var(--shadow-e1)] flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary-ink))] text-[11px] font-bold flex items-center justify-center shrink-0">{idea.number}</span>
                        <h4 className="font-bold text-[14px] text-[hsl(var(--ink-900))] leading-tight">{idea.title}</h4>
                      </div>
                      <p className="text-[13px] leading-relaxed text-[hsl(var(--color-text-muted))]">{idea.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Theory Section */}
          <section id="theory" ref={el => { sectionRefs.current['theory'] = el; }} className="scroll-mt-24 space-y-8">
            <div className="h-px bg-[hsl(var(--color-border))]" />

            {/* ── Deep theory — collapsible ─────────────────── */}
            {summary_extended?.theory_deep && (
              <details className="group rounded-2xl border border-[hsl(var(--color-secondary)/0.2)] bg-[hsl(var(--color-secondary-soft))] overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none list-none">
                  <span className="text-[13px] font-bold text-[hsl(var(--color-secondary-ink))]">📖 הסבר מעמיק — לפני שנכנסים לדיאגרמה</span>
                  <span className="text-[hsl(var(--color-secondary-ink))] text-xs opacity-60 group-open:rotate-180 transition-transform duration-200">▼</span>
                </summary>
                <div className="px-5 pb-5 pt-1 border-t border-[hsl(var(--color-secondary)/0.15)]">
                  <p className="text-[14px] leading-[1.85] text-[hsl(var(--ink-800))] whitespace-pre-line">{summary_extended.theory_deep}</p>
                </div>
              </details>
            )}

            <div className="flex flex-col gap-8">
              {React.createElement(DIAGRAM_COMPONENTS[theory.diagram] || (() => <div className="bg-slate-100 aspect-video rounded-3xl flex items-center justify-center">DUMMY DIAGRAM: {theory.diagram}</div>))}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* ── Key Equation ─────────────────────────── */}
                <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] shadow-[var(--shadow-e1)] overflow-hidden">
                  <div className="px-5 pt-5 pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-text-faint))] mb-3">משוואת המפתח</p>
                    <div className="bg-[hsl(var(--color-surface-2))] p-5 rounded-xl flex items-center justify-center min-h-[5rem] overflow-x-auto mb-4">
                      <div 
                        className="text-[hsl(var(--color-primary))]"
                        dangerouslySetInnerHTML={{ 
                          __html: katex.renderToString(theory.key_equation.latex, { 
                            throwOnError: false, 
                            displayMode: true 
                          }) 
                        }} 
                      />
                    </div>
                  </div>
                  {/* ── Plain-language explanation ────────── */}
                  <div className="px-5 pb-5 border-t border-[hsl(var(--color-border))] pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-secondary-ink))] mb-2">מה זה אומר בפשטות</p>
                    <p className="text-[14px] leading-relaxed text-[hsl(var(--ink-800))]">{theory.key_equation.explanation}</p>
                  </div>
                </div>

                {/* ── Trade-offs ────────────────────────── */}
                <div className="bg-[hsl(var(--color-accent-soft))] border border-[hsl(var(--color-accent)/0.25)] p-6 rounded-2xl space-y-5">
                   <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--color-accent-ink))]">יתרונות ומגבלות</p>
                   <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                         <div className="w-8 h-8 bg-white/60 rounded-xl flex items-center justify-center text-sm shrink-0">✅</div>
                         <div>
                            <span className="text-[12px] font-bold block text-[hsl(var(--ink-800))] mb-0.5">{theory.tradeoff.pro_label}</span>
                            <p className="text-[13px] text-[hsl(var(--color-text-muted))] leading-snug">{theory.tradeoff.pro}</p>
                         </div>
                      </div>
                      <div className="flex gap-3 items-start">
                         <div className="w-8 h-8 bg-white/60 rounded-xl flex items-center justify-center text-sm shrink-0">⚠️</div>
                         <div>
                            <span className="text-[12px] font-bold block text-[hsl(var(--ink-800))] mb-0.5">{theory.tradeoff.con_label}</span>
                            <p className="text-[13px] text-[hsl(var(--color-text-muted))] leading-snug">{theory.tradeoff.con}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Simulation Section */}
          <section id="simulation" ref={el => { sectionRefs.current['simulation'] = el; }} className="scroll-mt-24 space-y-8">
            <div className="h-px bg-[hsl(var(--color-border))]" />
            <div className="space-y-5">
              <h4 className="text-2xl font-bold text-[hsl(var(--ink-900))]">🎮 המעבדה הוויזואלית</h4>

              {/* ── Intuition callout ─────────────────────── */}
              <div className="rounded-xl bg-[hsl(var(--color-secondary-soft))] border border-[hsl(var(--color-secondary)/0.2)] px-5 py-4 flex gap-3 items-start">
                <span className="text-[hsl(var(--color-secondary-ink))] text-lg mt-0.5">🔬</span>
                <p className="text-[15px] text-[hsl(var(--ink-800))] leading-relaxed font-medium">{simulation.intuition}</p>
              </div>
            </div>
            <div className="w-full min-h-[420px] rounded-2xl overflow-hidden">
              <SimErrorBoundary simName={simulation.component}>
                {React.createElement(SIMULATION_COMPONENTS[simulation.component] || (() => (
                  <div className="w-full h-[420px] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <span className="text-4xl">🔬</span>
                    <span className="text-sm font-mono">{simulation.component}</span>
                    <span className="text-xs">סימולציה בפיתוח</span>
                  </div>
                )))}
              </SimErrorBoundary>
            </div>
          </section>

          {/* Challenge Section */}
          <section id="challenge" ref={el => { sectionRefs.current['challenge'] = el; }} className="scroll-mt-24 space-y-12">
            <div className="h-px bg-slate-200" />
            <div className="space-y-8">
               <h4 className="text-2xl font-black">בוחן המציאות</h4>
               <div className="flex flex-col gap-12">
                  {challenge.questions.map((q) => (
                    <QuizQuestion
                      key={q.id}
                      q={q}
                      alreadyCompleted={completed.includes(`q${q.id}`)}
                      onCorrect={() => markComplete(`q${q.id}`)}
                    />
                  ))}
               </div>
            </div>
          </section>

          {/* ── Summary Section ─────────────────────────────────── */}
          <section id="summary" ref={el => { sectionRefs.current['summary'] = el; }} className="scroll-mt-24 space-y-8">
            <div className="h-px bg-slate-200" />

            {/* Header + short/long toggle */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h4 className="text-2xl font-black">סיכום היום</h4>
              {summary_extended && (
                <button
                  onClick={() => setShowExtended(v => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold transition-all hover:border-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary))]"
                >
                  {showExtended ? '📝 סיכום קצר' : '📖 סיכום מורחב'}
                </button>
              )}
            </div>

            {!showExtended ? (
              /* ── Short summary ─────────────────────────── */
              <div className="space-y-8">
                {/* Key takeaways */}
                <div className="space-y-3">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">נקודות מפתח</h5>
                  <div className="flex flex-col gap-3">
                    {summary.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <span className="text-[hsl(var(--color-primary))] font-black text-lg leading-none mt-0.5">✓</span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">{pt.tag}</span>
                          <p className="text-sm font-medium leading-relaxed">{pt.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Misconceptions myth vs truth */}
                <div className="space-y-3">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">טעויות נפוצות</h5>
                  <div className="flex flex-col gap-4">
                    {summary.misconceptions.map((m, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block mb-1">מיתוס ❌</span>
                          <p className="text-sm font-medium text-red-700">{m.myth}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-green-400 block mb-1">אמת ✓</span>
                          <p className="text-sm font-medium text-green-700">{m.truth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next day teaser */}
                <div className="p-6 rounded-2xl border flex items-center gap-4"
                     style={{ background: 'hsl(var(--color-primary) / 0.06)', borderColor: 'hsl(var(--color-primary) / 0.2)' }}>
                  <span className="text-3xl shrink-0">→</span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block mb-0.5"
                          style={{ color: 'hsl(var(--color-primary))' }}>מחר</span>
                    <h5 className="font-black text-base">{summary.next_day.title}</h5>
                    <p className="text-xs text-slate-500 mt-1">{summary.next_day.desc}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Extended summary ──────────────────────── */
              <div className="space-y-8">
                {summary_extended && (
                  <>
                    {/* Overview */}
                    <p className="text-base leading-relaxed text-slate-700">{summary_extended.overview}</p>

                    {/* Deep theory */}
                    <div className="p-6 rounded-2xl border"
                         style={{ background: 'hsl(var(--color-secondary) / 0.04)', borderColor: 'hsl(var(--color-secondary) / 0.15)' }}>
                      <h5 className="text-xs font-black uppercase tracking-wider mb-3"
                          style={{ color: 'hsl(var(--color-secondary))' }}>תיאוריה מעמיקה</h5>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">{summary_extended.theory_deep}</p>
                    </div>

                    {/* Worked example */}
                    <div className="p-6 rounded-2xl border"
                         style={{ background: 'hsl(var(--color-accent) / 0.06)', borderColor: 'hsl(var(--color-accent) / 0.2)' }}>
                      <h5 className="text-xs font-black uppercase tracking-wider mb-3"
                          style={{ color: 'hsl(var(--color-accent-ink))' }}>דוגמה מחושבת</h5>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">{summary_extended.worked_example}</p>
                    </div>

                    {/* Industrial applications */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">יישומים תעשייתיים</h5>
                      <div className="flex flex-col gap-2">
                        {summary_extended.applications.map((app, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100">
                            <span className="font-black text-sm shrink-0"
                                  style={{ color: 'hsl(var(--color-primary))' }}>{i + 1}.</span>
                            <p className="text-sm text-slate-700">{app}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Further reading */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">להמשך קריאה</h5>
                      <ul className="flex flex-col gap-1.5">
                        {summary_extended.further_reading.map((ref, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                            <span style={{ color: 'hsl(var(--color-primary))' }}>›</span> {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </LessonShell>
  </div>
);
}
