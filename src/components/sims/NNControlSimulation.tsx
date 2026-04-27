import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, Brain, Zap, RotateCcw, Info, TrendingDown } from 'lucide-react';

// NN State and Training
interface NNState {
  W1: number[][];
  b1: number[];
  W2: number[];
  b2: number;
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
}

function initNN(): NNState {
  return {
    W1: [[0.1, 0.05], [0.05, 0.1], [-0.08, -0.05], [0.06, -0.1]],
    b1: [0, 0, 0, 0],
    W2: [0.05, 0.08, -0.06, 0.07],
    b2: 0
  };
}

function nnForward(nn: NNState, input: number[]): { u: number; hidden: number[] } {
  const hidden = nn.b1.map((b, i) => sigmoid(nn.W1[i][0] * input[0] + nn.W1[i][1] * input[1] + b));
  const u = hidden.reduce((sum, h, i) => sum + nn.W2[i] * h, nn.b2);
  return { u, hidden };
}

function trainStep(nn: NNState, x: number, target: number, alpha: number = 0.05): { nn: NNState; loss: number; u: number } {
  const { u } = nnForward(nn, [x, target]);
  const dx_dt = -x + u;
  const x_next = x + dx_dt * 0.1;
  const loss = (x_next - target) ** 2;

  const eps = 1e-3;
  const newNN: NNState = {
    W1: nn.W1.map(row => [...row]),
    b1: [...nn.b1],
    W2: [...nn.W2],
    b2: nn.b2
  };

  // Gradient on W2
  for (let i = 0; i < nn.W2.length; i++) {
    const W2_eps = [...nn.W2];
    W2_eps[i] += eps;
    const { u: u_eps } = nnForward({ ...nn, W2: W2_eps }, [x, target]);
    const x_eps = x + (-x + u_eps) * 0.1;
    const loss_eps = (x_eps - target) ** 2;
    newNN.W2[i] -= alpha * (loss_eps - loss) / eps;
  }

  // Gradient on b2
  const b2_eps = nn.b2 + eps;
  const { u: u_b2 } = nnForward({ ...nn, b2: b2_eps }, [x, target]);
  const x_b2 = x + (-x + u_b2) * 0.1;
  const loss_b2 = (x_b2 - target) ** 2;
  newNN.b2 -= alpha * (loss_b2 - loss) / eps;

  // Gradient on W1 (selected weights for speed)
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const W1_eps = nn.W1.map(row => [...row]);
      W1_eps[i][j] += eps;
      const { u: u_eps } = nnForward({ ...nn, W1: W1_eps }, [x, target]);
      const x_eps = x + (-x + u_eps) * 0.1;
      const loss_eps = (x_eps - target) ** 2;
      newNN.W1[i][j] -= alpha * (loss_eps - loss) / eps;
    }
  }

  return { nn: newNN, loss, u };
}

export default function NNControlSimulation() {
  const [loss, setLoss] = useState<number[]>([]);
  const [training, setTraining] = useState(false);
  const [performance, setPerformance] = useState(0);
  const [iteration, setIteration] = useState(0);
  const nnRef = useRef<NNState>(initNN());
  const stateRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reset = () => {
    setLoss([]);
    setTraining(false);
    setPerformance(0);
    setIteration(0);
    nnRef.current = initNN();
    stateRef.current = 0;
  };

  useEffect(() => {
    if (!training) return;
    const interval = setInterval(() => {
      const { nn: newNN, loss: newLoss, u } = trainStep(nnRef.current, stateRef.current, 1.0, 0.02);
      nnRef.current = newNN;
      stateRef.current = stateRef.current + (-stateRef.current + u) * 0.1;

      setIteration(i => i + 1);
      setLoss(prev => [...prev, newLoss].slice(-50));
      setPerformance(p => Math.min(100, Math.max(0, 100 * Math.exp(-newLoss * 0.5))));
    }, 100);
    return () => clearInterval(interval);
  }, [training]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw NN: input (2) -> hidden (4) -> output (1)
    const layers = [2, 4, 1];
    const spacingX = 80;
    const spacingY = 40;

    layers.forEach((nodes, l) => {
      for (let i = 0; i < nodes; i++) {
        const x = centerX - (layers.length / 2 - l) * spacingX;
        const y = centerY - (nodes / 2 - i) * spacingY;

        // Connections to next layer
        if (l < layers.length - 1) {
          const nextNodes = layers[l + 1];
          for (let j = 0; j < nextNodes; j++) {
            const nextX = centerX - (layers.length / 2 - (l + 1)) * spacingX;
            const nextY = centerY - (nextNodes / 2 - j) * spacingY;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.strokeStyle = training ? `rgba(16, 185, 129, ${0.1 + Math.random() * 0.3})` : 'rgba(255,255,255,0.1)';
            ctx.lineWidth = training ? 1.5 : 0.5;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = training ? '#10b981' : '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.stroke();
      }
    });
  }, [training, iteration]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white overflow-hidden relative" dir="ltr">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Neural Controller Lab</h3>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Neuro-Adaptive Reinforcement Learning</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-black/40 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-800">
             <div className="flex flex-col items-end">
               <span className="text-[8px] text-slate-500 uppercase font-black">Accuracy</span>
               <span className="text-xs font-mono font-black text-emerald-400">{performance.toFixed(1)}%</span>
             </div>
             <Zap size={16} className={training ? 'text-emerald-400 animate-pulse' : 'text-slate-600'} />
           </div>
           <button onClick={reset} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all">
             <RotateCcw size={16} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-black/30 p-6 rounded-2xl border border-slate-800">
        {/* NETWORK VIZ */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 relative">
           <canvas ref={canvasRef} width={300} height={250} className="w-full h-auto" />
           <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-600 uppercase">Architecture: 2-4-1 FFN</div>
           <div className="mt-4 flex gap-8">
              <div className="flex flex-col items-center">
                 <span className="text-[8px] text-slate-500 uppercase font-black">Input: [x, x_target]</span>
                 <Brain size={16} className="text-emerald-500 mt-1" />
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[8px] text-slate-500 uppercase font-black">Output: u</span>
                 <Zap size={16} className="text-orange-400 mt-1" />
              </div>
           </div>
        </div>

        {/* TRAINING STATS */}
        <div className="flex flex-col gap-6">
           <div className="space-y-2">
              <div className="flex justify-between items-end">
                 <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest flex items-center gap-2">
                    <TrendingDown size={12} />
                    Training Loss Curve
                 </h4>
                 <span className="text-[10px] font-mono text-emerald-400">Iter: {iteration}</span>
              </div>
              <div className="h-32 bg-black/40 rounded-xl border border-slate-800 relative flex items-end p-2 gap-0.5">
                 {loss.map((l, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${(l/2.5) * 100}%` }}
                     className="flex-1 bg-emerald-500/40 rounded-t-sm"
                   />
                 ))}
                 {!training && loss.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-700 font-black uppercase">Ready to Initialize</div>}
              </div>
           </div>

           <button 
             onClick={() => setTraining(!training)}
             className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-sm transition-all shadow-xl ${
               training ? 'bg-rose-600/20 text-rose-500 border border-rose-500/50 hover:bg-rose-600/30' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
             }`}
           >
              {training ? 'Stop Training Evolution' : 'Start Neuro-Optimization'}
           </button>

           <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex gap-4">
              <Info size={16} className="text-indigo-400 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                 <strong>Algorithm:</strong> Plant ẋ = -x + u with target x_t. NN learns u = NN(x, x_t) by minimizing loss = (x_next - x_t)². Weights trained via numerical gradient descent at each step.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
