import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Zap, Activity, Info, Dna } from 'lucide-react';

export default function QuantumSimulation() {
  const [gates, setGates] = useState<string[]>([]);
  const [measured, setMeasured] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Simple Quantum State Simulation (Qubit on Sphere)
  // theta (0 to PI), phi (0 to 2PI)
  const state = useMemo(() => {
    let theta = 0; // Starts at |0> (top)
    let phi = 0;

    gates.forEach(gate => {
      if (gate === 'H') {
        // Hadamard: 0 -> (0+1)/sqrt(2), 1 -> (0-1)/sqrt(2)
        // Rotation by PI around X+Z axis, or simply:
        if (theta === 0) theta = Math.PI / 2;
        else if (theta === Math.PI / 2) theta = 0; // Simplified for demo
        else theta = Math.PI - theta;
      }
      if (gate === 'X') theta = Math.PI - theta; // NOT gate
      if (gate === 'Z') phi = (phi + Math.PI) % (2 * Math.PI); // Phase flip
    });

    return { theta, phi };
  }, [gates]);

  const prob0 = Math.pow(Math.cos(state.theta / 2), 2);
  const prob1 = 1 - prob0;

  const measure = () => {
    setIsMeasuring(true);
    setMeasured(null);
    setTimeout(() => {
      const outcome = Math.random() < prob0 ? 0 : 1;
      setMeasured(outcome);
      setIsMeasuring(false);
      // Measurement collapses the state
      setGates(outcome === 0 ? [] : ['X']);
    }, 1500);
  };

  const addGate = (g: string) => {
    if (gates.length < 5) setGates([...gates, g]);
    setMeasured(null);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white overflow-hidden relative" dir="ltr">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Dna size={120} className="text-emerald-500 animate-[spin_20s_linear_infinite]" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Qubit Laboratory</h3>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Probabilistic Processing Unit</p>
        </div>
        <div className="flex gap-2">
          {['H', 'X', 'Z'].map(g => (
            <button 
              key={g}
              onClick={() => addGate(g)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-white transition-all font-black border border-slate-700 active:scale-95 flex items-center justify-center text-xs"
            >
              {g}
            </button>
          ))}
          <button onClick={() => { setGates([]); setMeasured(null); }} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-black/30 p-8 rounded-2xl border border-slate-800 relative">
        {/* BLOCH SPHERE REPRESENTATION */}
        <div className="flex flex-col items-center justify-center gap-4 py-8">
           <div className="relative w-48 h-48">
              {/* Sphere Outer */}
              <div className="absolute inset-0 rounded-full border border-slate-700 opacity-20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-800" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800" />
              
              {/* State Vector */}
              <motion.div 
                className="absolute left-1/2 bottom-1/2 w-1 h-24 origin-bottom z-20"
                style={{ 
                  transform: `translateX(-50%)`,
                }}
                animate={{ 
                  rotateZ: (state.theta * 180) / Math.PI,
                  filter: prob0 > 0.1 && prob0 < 0.9 ? 'drop-shadow(0 0 10px #FF6B35)' : 'none'
                }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <div className={`w-full h-full rounded-full transition-colors ${prob0 > 0.1 && prob0 < 0.9 ? 'bg-[#FF6B35]' : 'bg-emerald-400'}`} />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              </motion.div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-[10px] font-mono text-slate-500">|0⟩</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-[10px] font-mono text-slate-500">|1⟩</div>
           </div>
           <div className="text-[10px] font-black uppercase text-slate-600 tracking-tighter mt-4">Bloch Sphere Visualization</div>
        </div>

        {/* CIRCUIT & PROBS */}
        <div className="flex flex-col gap-6">
           <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                 <span>Probability |0⟩</span>
                 <span>{(prob0 * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-emerald-500" 
                   animate={{ width: `${prob0 * 100}%` }}
                 />
              </div>

              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                 <span>Probability |1⟩</span>
                 <span>{(prob1 * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-[#FF6B35]" 
                   animate={{ width: `${prob1 * 100}%` }}
                 />
              </div>
           </div>

           <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-black/20 rounded-xl border border-slate-800">
              <div className="flex items-center justify-center px-4 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-slate-500">ψ₀</div>
              <div className="h-px w-4 bg-slate-800 self-center" />
              {gates.map((g, i) => (
                <React.Fragment key={i}>
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white font-black text-xs rounded-lg shadow-lg shadow-emerald-500/20"
                  >
                    {g}
                  </motion.div>
                  <div className="h-px w-2 bg-slate-800 self-center" />
                </React.Fragment>
              ))}
           </div>

           <button 
             disabled={isMeasuring}
             onClick={measure}
             className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-sm transition-all relative overflow-hidden group ${
               isMeasuring ? 'bg-slate-800 text-slate-600' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40'
             }`}
           >
              {isMeasuring ? (
                <div className="flex items-center justify-center gap-2">
                   <Activity className="animate-pulse" size={16} />
                   <span>Collapsing Wavefunction...</span>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span>Measure Observation</span>
                </>
              )}
           </button>

           <AnimatePresence>
             {measured !== null && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0 }}
                 className="p-4 bg-slate-800 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-between shadow-2xl"
               >
                  <span className="text-xs font-bold uppercase text-slate-400">Measurement Result</span>
                  <span className="text-4xl font-black text-white px-6 bg-slate-900 rounded-xl border border-slate-700">|{measured}⟩</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-4 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
         <Info size={20} className="text-indigo-400 shrink-0" />
         <p className="text-[10px] text-slate-400 leading-relaxed">
           <strong className="text-indigo-300">Intuition:</strong> Adding gates like <span className="text-emerald-400 font-bold">Hadamard</span> puts the qubit in <span className="text-[#FF6B35] font-bold">Superposition</span>. Measurement forces the probability wave to collapse into a single classical state (0 or 1).
         </p>
      </div>
    </div>
  );
}
