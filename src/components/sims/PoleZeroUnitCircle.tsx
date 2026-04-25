import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RotateCcw } from 'lucide-react';

export default function PoleZeroUnitCircle() {
  const [poleR, setPoleR] = useState(0.7);
  const [poleTheta, setPoleTheta] = useState(60);
  const [zeroR, setZeroR] = useState(0.5);
  const [zeroTheta, setZeroTheta] = useState(120);

  const tRad = (poleTheta * Math.PI) / 180;
  const zRad = (zeroTheta * Math.PI) / 180;
  const pole = { re: poleR * Math.cos(tRad), im: poleR * Math.sin(tRad) };
  const zero = { re: zeroR * Math.cos(zRad), im: zeroR * Math.sin(zRad) };
  const isStable = poleR < 1.0;

  const reset = () => {
    setPoleR(0.7);
    setPoleTheta(60);
    setZeroR(0.5);
    setZeroTheta(120);
  };

  const getTakeaway = () => {
    if (!isStable) return "⚠️ המערכת לא יציבה! במישור הדיסקרטי (Z), קוטב מחוץ לעיגול היחידה (|z| > 1) גורם להתבדרות.";
    if (poleR > 0.9) return "🔄 תגובה איטית ותהודה: הקוטב קרוב מאוד לשפת העיגול. המערכת תגיב עם תנודות ארוכות שדועכות לאט.";
    return "💡 יציבות במישור Z: כל עוד הקטבים (X) בתוך עיגול היחידה, המערכת יציבה. האפסים (O) קובעים את ה'בורות' בתגובת התדר.";
  };

  const freqResponse = useMemo(() => Array.from({ length: 200 }, (_, i) => {
    const w = (i / 200) * Math.PI;
    const ejwRe = Math.cos(w); const ejwIm = Math.sin(w);
    const numRe = ejwRe - zero.re; const numIm = ejwIm - zero.im;
    const d1Re = ejwRe - pole.re; const d1Im = ejwIm - pole.im;
    const d2Re = ejwRe - pole.re; const d2Im = ejwIm + pole.im;
    const denRe = d1Re * d2Re - d1Im * d2Im; const denIm = d1Re * d2Im + d1Im * d2Re;
    const denMag2 = denRe * denRe + denIm * denIm;
    const numMag = Math.sqrt(numRe * numRe + numIm * numIm);
    const mag = denMag2 > 1e-10 ? numMag / Math.sqrt(denMag2) : 10;
    return { w: parseFloat(((w / Math.PI) * 0.5).toFixed(3)), mag: parseFloat(Math.min(Math.max(20 * Math.log10(Math.max(mag, 1e-6)), -40), 20).toFixed(2)) };
  }), [pole, zero]);

  const SIZE = 180; const C = SIZE / 2; const R = 70;
  const toSvg = (re: number, im: number) => ({ x: C + re * R, y: C - im * R });
  const polePos = toSvg(pole.re, pole.im); const poleConj = toSvg(pole.re, -pole.im);
  const zeroPos = toSvg(zero.re, zero.im); const zeroConj = toSvg(zero.re, -zero.im);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-5 border-4 border-slate-800 text-white" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm flex justify-between items-center text-right">
        <div className="space-y-1">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-3 text-white">
            בדיקת יציבות במישור ה-Z
          </h3>
          <p className="text-sm text-slate-400">
            הזיזו את הקטבים והאפסים בתוך ומחוץ לעיגול היחידה כדי לראות את ההשפעה על המסנן הדיגיטלי.
          </p>
        </div>
        <button 
          onClick={reset}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-white transition-all shadow-lg"
          title="איפוס"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 italic text-sm text-blue-400 text-right">
        {getTakeaway()}
      </div>

      <div className={`text-center py-2 rounded-xl font-black text-sm relative z-20 ${isStable ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-100' : 'bg-red-900/60 border border-red-500 text-red-100'}`}>
        {isStable ? '✓ יציב — הקוטב בתוך העיגול' : '✗ לא יציב — הקוטב בחוץ!'} <span className="font-mono text-xs ml-2">|z| = {poleR.toFixed(2)}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-black text-slate-400 uppercase">Z-Plane</p>
          <svg width={SIZE} height={SIZE} className="bg-slate-800 rounded-xl">
            <line x1={C} y1={0} x2={C} y2={SIZE} stroke="#334155" strokeWidth={1} />
            <line x1={0} y1={C} x2={SIZE} y2={C} stroke="#334155" strokeWidth={1} />
            <circle cx={C} cy={C} r={R} fill="none" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 2" />
            <text x={C+R+3} y={C+4} fill="#64748b" fontSize="8">1</text>
            <circle cx={zeroPos.x} cy={zeroPos.y} r={6} fill="none" stroke="#004E89" strokeWidth={2} />
            <circle cx={zeroConj.x} cy={zeroConj.y} r={6} fill="none" stroke="#004E89" strokeWidth={2} />
            {[polePos, poleConj].map((p, i) => <g key={i}><line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke="#FF6B35" strokeWidth={2.5}/><line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke="#FF6B35" strokeWidth={2.5}/></g>)}
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">|H(f)| dB</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={freqResponse} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="w" tick={{ fontSize: 9, fill: '#64748b' }} />
              <YAxis domain={[-40, 20]} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Line type="monotone" dataKey="mag" stroke="#FF6B35" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[['Pole |z|', poleR, setPoleR, 0, 1.3, 0.01, '#FF6B35'], ['Pole θ°', poleTheta, setPoleTheta, 0, 180, 1, '#FF6B35'], ['Zero |z|', zeroR, setZeroR, 0, 1.2, 0.01, '#004E89'], ['Zero θ°', zeroTheta, setZeroTheta, 0, 180, 1, '#004E89']].map(([label, val, set, min, max, step, color]: any) => (
          <div key={label} className="bg-slate-800 rounded-lg p-2 flex flex-col gap-1">
            <p className="text-[9px] text-slate-500 uppercase">{label}</p>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(parseFloat(e.target.value))} style={{ accentColor: color }} className="w-full" />
            <span className="text-xs font-black font-mono" style={{ color }}>{(val as number).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
