import React, { useState, useMemo } from 'react';

export default function SpectrogramSimulation() {
  const DEFAULT = { freq: 5 };
  const [freq, setFreq] = useState(DEFAULT.freq);

  const reset = () => setFreq(DEFAULT.freq);

  const getTakeaway = () => {
    if (freq > 8) return "🔥 High Frequency: האלומה הזוהרת עברה לחלק העליון של הגרף. זה מדגים איך STFT מנתח תדרים כפונקציה של זמן.";
    if (freq < 3) return "🌊 Low Frequency: התדר הנוכחי נמצא בבסיס הגרף. שים לב איך העוצמה משתנה בזמן (Dynamic Power).";
    return "💡 ספקטרוגרמה מאפשרת לראות 'מוזיקה' כציור. הציר האופקי הוא זמן, האנכי הוא תדר, והצבע הוא עוצמה.";
  };
  
  // Create a 10x20 grid (10 frequency bins, 20 time slices)
  const grid = useMemo(() => {
    const rows = 10;
    const cols = 20;
    return Array.from({ length: rows }, (_, r) => {
      return Array.from({ length: cols }, (_, c) => {
        // Simple STFT mock: Power is high if row matches signal freq
        const dist = Math.abs(r - freq);
        const power = Math.max(0, 1 - dist / 3) * (0.8 + 0.2 * Math.sin(c / 2));
        return power;
      });
    });
  }, [freq]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">Time-Frequency Spectrogram</h3>
          <div className="flex gap-4 items-center">
            <button 
              onClick={reset}
              className="px-3 py-1 rounded-lg bg-slate-700 text-[10px] font-bold hover:bg-slate-600 transition-colors"
            >
              RESET
            </button>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-slate-500 font-black uppercase">Signal Frequency: {freq} Hz</span>
              <input 
                type="range" min={1} max={10} step={1} 
                value={freq} onChange={(e) => setFreq(parseInt(e.target.value))}
                className="accent-[#FF6B35] w-32"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 italic">Short-Time Fourier Transform (STFT) visualization over time.</p>
      </div>

      <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 italic text-sm text-orange-400">
        {getTakeaway()}
      </div>

      <div className="relative flex flex-col gap-1 bg-black/40 p-4 rounded-xl border border-slate-700">
        <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase mb-1">
           <span>Freq (Bin)</span>
           <span>Time &rarr;</span>
        </div>
        
        <div className="flex flex-col gap-[2px]">
          {grid.map((row, r) => (
            <div key={r} className="flex gap-[2px] h-4">
              <div className="w-6 text-[8px] flex items-center text-slate-600 font-mono">{9-r}</div>
              {row.map((val, c) => (
                <div 
                  key={c} 
                  className="flex-1 rounded-sm transition-all duration-300"
                  style={{ 
                    backgroundColor: `rgba(255, 107, 53, ${grid[9-r][c]})`,
                    boxShadow: grid[9-r][c] > 0.8 ? 'inset 0 0 4px rgba(255,255,255,0.3)' : 'none'
                  }}
                  title={`Bin ${9-r}, t=${c}: ${val.toFixed(2)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-4">
         <div className="w-full h-2 bg-gradient-to-r from-slate-900 to-[#FF6B35] rounded-full" />
         <div className="flex justify-between w-24 text-[8px] text-slate-500 font-black uppercase shrink-0">
            <span>Low Power</span>
            <span>Max</span>
         </div>
      </div>
    </div>
  );
}
