import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RotateCcw } from 'lucide-react';

const FREQS = [
  { hz: 100, label: '100 Hz', color: '#FF6B35' },
  { hz: 500, label: '500 Hz', color: '#004E89' },
  { hz: 1000, label: '1 kHz', color: '#F7B801' },
  { hz: 3000, label: '3 kHz', color: '#10b981' }
];
const FS = 8000;
const FFT_SIZE = 512;

// Real DFT computation for educational integrity
function computeDFT(x: number[], fs: number): { freqs: number[], magnitudes: number[] } {
  const N = x.length;
  const halfN = Math.floor(N / 2);
  const freqs: number[] = [];
  const magnitudes: number[] = [];

  for (let k = 0; k < halfN; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const angle = 2 * Math.PI * k * n / N;
      re += x[n] * Math.cos(angle);
      im -= x[n] * Math.sin(angle);
    }
    // One-sided amplitude spectrum: 2/N for k > 0, 1/N for DC
    const scale = k === 0 ? 1 / N : 2 / N;
    freqs.push((k * fs) / N);
    magnitudes.push(Math.sqrt(re * re + im * im) * scale);
  }

  return { freqs, magnitudes };
}

export default function SpectrumAnalyzer() {
  const DEFAULT = [true, false, false, false];
  const [active, setActive] = useState<boolean[]>(DEFAULT);
  const activeFreqs = FREQS.filter((_, i) => active[i]);

  const reset = () => setActive(DEFAULT);

  const getTakeaway = () => {
    const count = active.filter(Boolean).length;
    if (count === 0) return "🔇 Silence: אין תדרים פעילים. האות במישור הזמן ובמישור התדר ריקים.";
    if (count > 2) return "🔀 Complex Signal: שים לב איך ריבוי תדרים יוצר 'בלגן' במישור הזמן, אבל ב-FFT כל תדר נשאר מבודד וברור.";
    return "💡 Frequency Isolation: ה-FFT מאפשר לנו לראות את 'טביעת האצבע' של כל תדר בנפרד, גם כשהם מעורבבים יחד.";
  };

  const timeDomain = useMemo(() => Array.from({ length: 100 }, (_, i) => {
    const t = i / FS;
    let y = activeFreqs.reduce((s, f) => s + Math.sin(2 * Math.PI * f.hz * t), 0);
    if (activeFreqs.length > 0) y /= activeFreqs.length;
    return { t: parseFloat((t * 1000).toFixed(2)), y: parseFloat(y.toFixed(3)) };
  }), [active, activeFreqs]);

  const spectrum = useMemo(() => {
    // Generate time-domain signal with actual FFT size
    const signal = Array.from({ length: FFT_SIZE }, (_, i) => {
      const t = i / FS;
      return activeFreqs.reduce((sum, f) => sum + Math.sin(2 * Math.PI * f.hz * t), 0);
    });

    // Compute real DFT
    const { freqs, magnitudes } = computeDFT(signal, FS);

    // Sample the spectrum at common display frequencies for clarity
    const displayFreqs = [50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000];
    return displayFreqs.map(fDisplay => {
      // Find nearest FFT bin to display frequency
      let closestIdx = 0;
      let minDist = Math.abs(freqs[0] - fDisplay);
      for (let i = 1; i < freqs.length; i++) {
        const dist = Math.abs(freqs[i] - fDisplay);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }
      return {
        f: fDisplay >= 1000 ? `${fDisplay/1000}k` : `${fDisplay}`,
        mag: parseFloat(magnitudes[closestIdx].toFixed(3))
      };
    });
  }, [activeFreqs]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Spectrum Analyzer — Time vs Freq</h3>
          <button 
            onClick={reset}
            className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all shadow-lg"
            title="איפוס"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-500">Comparing signals in the time domain with their frequency representation (FFT).</p>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 italic text-sm text-blue-400">
        {getTakeaway()}
      </div>

      <div className="flex gap-2 flex-wrap">
        {FREQS.map((f, i) => (
          <button key={f.hz} onClick={() => setActive(p => { const n=[...p]; n[i]=!n[i]; return n; })}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${active[i] ? 'text-white' : 'bg-transparent text-slate-500 border-slate-700'}`}
            style={active[i] ? { background: f.color, borderColor: f.color } : {}}>{f.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Time Domain (Oscilloscope)</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={timeDomain} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#64748b' }} />
              <YAxis domain={[-1.2, 1.2]} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Line type="monotone" dataKey="y" stroke="#FF6B35" dot={false} strokeWidth={1.5} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1">FFT Magnitude Spectrum</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={spectrum} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="f" tick={{ fontSize: 8, fill: '#64748b' }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Bar dataKey="mag" fill="#004E89" radius={[2,2,0,0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
