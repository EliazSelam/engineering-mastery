import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, RefreshCw, Activity } from 'lucide-react';

// Bell State Entanglement Simulator
// Demonstrates: H gate on Q1 → CNOT(Q1,Q2) → Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2
// Measuring Q1 instantly determines Q2 with 100% correlation

type QubitState = '0' | '1' | 'superposition';

interface MeasurementResult {
  q1: 0 | 1;
  q2: 0 | 1;
  trial: number;
}

export default function EntanglementSimulation() {
  const [step, setStep] = useState<'init' | 'hadamard' | 'cnot' | 'entangled'>('init');
  const [measuring, setMeasuring] = useState(false);
  const [results, setResults] = useState<MeasurementResult[]>([]);
  const [trialCount, setTrialCount] = useState(0);

  // Current qubit states per step
  const q1State: QubitState =
    step === 'init' ? '0' :
    step === 'hadamard' ? 'superposition' :
    step === 'cnot' ? 'superposition' : 'superposition';

  const q2State: QubitState =
    step === 'init' ? '0' :
    step === 'hadamard' ? '0' :
    step === 'cnot' ? 'superposition' : 'superposition';

  const isEntangled = step === 'entangled';

  const applyHadamard = () => setStep('hadamard');
  const applyCNOT = () => setStep(prev => prev === 'hadamard' ? 'cnot' : prev);
  const createBellState = () => setStep('entangled');

  const measure = async () => {
    if (!isEntangled || measuring) return;
    setMeasuring(true);
    await new Promise(r => setTimeout(r, 700));

    // Bell state |Φ+⟩: 50% |00⟩, 50% |11⟩ — perfect correlation
    const q1 = (Math.random() < 0.5 ? 0 : 1) as 0 | 1;
    const q2 = q1 as 0 | 1; // Always same — entanglement!
    const trial = trialCount + 1;

    setResults(prev => [{ q1, q2, trial }, ...prev].slice(0, 8));
    setTrialCount(trial);
    setMeasuring(false);
  };

  const reset = () => {
    setStep('init');
    setResults([]);
    setTrialCount(0);
    setMeasuring(false);
  };

  const correlation = results.length > 0
    ? (results.filter(r => r.q1 === r.q2).length / results.length * 100).toFixed(0)
    : null;

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-sans" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-black text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-400" />
            Bell State — שזירה קוונטית
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 — שני קיוביטים שזורים
          </p>
        </div>
        <button onClick={reset} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Circuit builder */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 font-bold">מעגל קוונטי</p>

        <div className="flex items-center gap-3">
          {/* Q1 wire */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 w-6">Q₁</span>
              <div className="h-[2px] w-6 bg-slate-700" />
              {/* H gate */}
              <motion.div
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-black cursor-pointer select-none transition-colors
                  ${step === 'init' ? 'border-slate-600 text-slate-500 hover:border-violet-500 hover:text-violet-400' :
                    'border-violet-500 bg-violet-500/20 text-violet-300'}`}
                onClick={step === 'init' ? applyHadamard : undefined}
                whileTap={{ scale: 0.95 }}
                title="Hadamard Gate"
              >H</motion.div>
              <div className="h-[2px] w-4 bg-slate-700" />
              {/* CNOT control dot */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-colors
                    ${step !== 'hadamard' ? 'border-slate-600' : 'border-emerald-400 bg-emerald-400 cursor-pointer'}`}
                  onClick={step === 'hadamard' ? createBellState : undefined}
                  title="CNOT control"
                  whileTap={{ scale: 0.9 }}
                />
                {/* Vertical line of CNOT */}
                <div className={`w-[2px] h-8 transition-colors ${step !== 'hadamard' ? 'bg-slate-700' : 'bg-emerald-400'}`} />
              </div>
              <div className="h-[2px] flex-1 bg-slate-700" />
              {/* Measurement */}
              <motion.button
                onClick={measure}
                disabled={!isEntangled || measuring}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide border transition-all
                  ${isEntangled ? 'border-amber-500 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' :
                    'border-slate-700 text-slate-600 cursor-not-allowed'}`}
                whileTap={isEntangled ? { scale: 0.95 } : {}}
              >
                {measuring ? '...' : 'מדוד'}
              </motion.button>
            </div>

            {/* Q2 wire */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 w-6">Q₂</span>
              <div className="h-[2px] w-24 bg-slate-700" />
              {/* CNOT target ⊕ */}
              <motion.div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-black transition-colors
                  ${step !== 'hadamard' ? 'border-slate-700 text-slate-600' : 'border-emerald-400 text-emerald-400'}`}
              >⊕</motion.div>
              <div className="h-[2px] flex-1 bg-slate-700" />
              <motion.button
                onClick={measure}
                disabled={!isEntangled || measuring}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide border transition-all
                  ${isEntangled ? 'border-amber-500 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' :
                    'border-slate-700 text-slate-600 cursor-not-allowed'}`}
                whileTap={isEntangled ? { scale: 0.95 } : {}}
              >
                {measuring ? '...' : 'מדוד'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mt-5 flex gap-2 justify-center">
          {(['init','hadamard','entangled'] as const).map((s, i) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step === s || (s === 'entangled' && step === 'cnot') ? 'w-8 bg-violet-500' : step > s ? 'w-4 bg-violet-800' : 'w-4 bg-slate-700'}`} />
          ))}
        </div>
      </div>

      {/* State visualization */}
      <div className="grid grid-cols-2 gap-3">
        <QubitCard label="Q₁" state={q1State} entangled={isEntangled} />
        <QubitCard label="Q₂" state={q2State} entangled={isEntangled} />
      </div>

      {/* Entanglement indicator */}
      <AnimatePresence>
        {isEntangled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 text-center"
          >
            <div className="text-violet-300 font-black text-sm mb-1">
              ⚛️ מצב שזור: |Φ⁺⟩ = (|00⟩ + |11⟩) / √2
            </div>
            <p className="text-slate-400 text-xs">
              מדידה על Q₁ מגדירה מיידית את Q₂ — ללא תלות במרחק
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Measurement log */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> תוצאות מדידה
            </p>
            {correlation !== null && (
              <span className="text-[10px] font-black text-emerald-400">
                קורלציה: {correlation}%
              </span>
            )}
          </div>
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-4 text-[10px] font-black text-slate-500 uppercase px-3 py-2 border-b border-slate-800">
              <span>#</span><span className="text-center">Q₁</span><span className="text-center">Q₂</span><span className="text-center">קורלציה</span>
            </div>
            {results.map(r => (
              <motion.div
                key={r.trial}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-4 text-xs px-3 py-2 border-b border-slate-800/50 last:border-0"
              >
                <span className="text-slate-500 font-mono">{r.trial}</span>
                <span className={`text-center font-black font-mono ${r.q1 === 0 ? 'text-blue-400' : 'text-rose-400'}`}>|{r.q1}⟩</span>
                <span className={`text-center font-black font-mono ${r.q2 === 0 ? 'text-blue-400' : 'text-rose-400'}`}>|{r.q2}⟩</span>
                <span className="text-center">{r.q1 === r.q2 ? '✅' : '❌'}</span>
              </motion.div>
            ))}
          </div>
          {results.length >= 4 && (
            <p className="text-[10px] text-slate-500 text-center">
              {parseInt(correlation ?? '0') === 100
                ? '🎯 קורלציה מושלמת — עדות ישירה לשזירה קוונטית'
                : `קורלציה ${correlation}% — המשך למדוד לאימות`}
            </p>
          )}
        </div>
      )}

      {/* Instruction hint */}
      {step === 'init' && (
        <p className="text-xs text-slate-500 text-center">
          לחץ <span className="font-black text-violet-400">H</span> על Q₁ כדי להכניסו לסופרפוזיציה
        </p>
      )}
      {step === 'hadamard' && (
        <p className="text-xs text-slate-500 text-center">
          עכשיו לחץ על <span className="font-black text-emerald-400">⊕ CNOT</span> כדי לשזור את הקיוביטים
        </p>
      )}
      {isEntangled && results.length === 0 && (
        <p className="text-xs text-slate-500 text-center">
          לחץ <span className="font-black text-amber-400">מדוד</span> כמה פעמים וצפה בקורלציה
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
const QubitCard = ({ label, state, entangled }: { label: string; state: QubitState; entangled: boolean }) => {
  const isSuperposition = state === 'superposition';
  return (
    <div className={`bg-slate-950 border rounded-2xl p-4 text-center transition-all ${entangled ? 'border-violet-500/40' : 'border-slate-800'}`}>
      <div className="text-xs text-slate-500 font-black uppercase tracking-widest mb-2">{label}</div>
      <div className={`text-2xl font-black font-mono mb-1 ${isSuperposition ? 'text-violet-400' : 'text-slate-300'}`}>
        {isSuperposition ? (entangled ? '(|0⟩+|1⟩)/√2' : '|+⟩') : '|0⟩'}
      </div>
      <div className={`text-[9px] uppercase font-black tracking-wider ${isSuperposition ? 'text-violet-500' : 'text-slate-600'}`}>
        {isSuperposition ? (entangled ? 'שזור' : 'סופרפוזיציה') : 'בסיס'}
      </div>
      {isSuperposition && (
        <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${entangled ? 'bg-violet-500' : 'bg-blue-500'}`}
            animate={{ width: ['50%', '60%', '40%', '55%', '45%', '50%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
    </div>
  );
};
