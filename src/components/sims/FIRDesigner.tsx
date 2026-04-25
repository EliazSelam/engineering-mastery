import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Waves } from 'lucide-react';

type Win = 'rectangular'|'hamming'|'hann';
const sinc = (x: number) => x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
const getWindow = (t: Win, N: number) => Array.from({length:N},(_,n) => t==='rectangular'?1:t==='hamming'?0.54-0.46*Math.cos(2*Math.PI*n/(N-1)):0.5*(1-Math.cos(2*Math.PI*n/(N-1))));
const computeFIR = (taps:number,fc:number,wt:Win) => { const M=(taps-1)/2; const w=getWindow(wt,taps); return Array.from({length:taps},(_,n)=>2*fc*sinc(2*fc*(n-M))*w[n]); };
const freqResp = (h:number[]) => Array.from({length:128},(_,k)=>{
  let re=0,im=0; h.forEach((hn,n)=>{const a=2*Math.PI*k*n/256;re+=hn*Math.cos(a);im-=hn*Math.sin(a);});
  const mag=Math.sqrt(re*re+im*im);
  return {f:parseFloat((k/256).toFixed(4)),mag:parseFloat(Math.max(Math.min(20*Math.log10(Math.max(mag,1e-10)),5),-80).toFixed(2))};
});

export default function FIRDesigner() {
  const DEFAULT = { fc: 0.2, taps: 21, win: 'hamming' as Win };
  const [fc, setFc] = useState(DEFAULT.fc);
  const [taps, setTaps] = useState(DEFAULT.taps);
  const [win, setWin] = useState<Win>(DEFAULT.win);

  const reset = () => {
    setFc(DEFAULT.fc);
    setTaps(DEFAULT.taps);
    setWin(DEFAULT.win);
  };

  const data = useMemo(() => freqResp(computeFIR(taps, fc, win)), [taps, fc, win]);

  const getTakeaway = () => {
    if (win === 'rectangular') return "🌊 Gibbs Phenomenon: חלון מלבני יוצר 'ריפל' (תנודות) חזקים ב-Passband וב-Stopband.";
    if (taps > 40) return "🎯 High Order: יותר Taps גורמים ל-Transition Band צר יותר (חיתוך חד יותר), אך יותר חישובים.";
    return "💡 Windowing Selection: חלונות כמו Hamming או Hann מקטינים את התנודות המיותרות במחיר של 'מריחה' קלה בנקודת החיתוך.";
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
          <Waves className="w-5 h-5 text-blue-400" />
          מעבדת תכנון פילטרים (FIR Filter Designer)
        </h3>
        <p className="text-sm text-slate-400">
          תכננו מסנן FIR בזמן אמת. בחרו את חלון הזמן (Window), סדר המסנן (Taps) ותדר החיתוך כדי לראות את תגובת המערכת ב-FFT.
        </p>
      </div>

      <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 italic text-sm text-orange-400">
        {getTakeaway()}
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{ top:5, right:10, bottom:10, left:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="f" tick={{fontSize:9,fill:'#64748b'}} label={{value:'Normalized Freq',position:'insideBottom',offset:-5,fontSize:9,fill:'#64748b'}}/>
          <YAxis domain={[-80,5]} tick={{fontSize:9,fill:'#64748b'}} label={{value:'dB',angle:-90,position:'insideLeft',fontSize:9,fill:'#64748b'}}/>
          <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',fontSize:10}} />
          <ReferenceLine x={fc} stroke="#F7B801" strokeDasharray="4 2" label={{value:'fc',fill:'#F7B801',fontSize:9}}/>
          <ReferenceLine y={-3} stroke="#64748b" strokeDasharray="2 2"/>
          <Line type="monotone" dataKey="mag" stroke="#FF6B35" dot={false} strokeWidth={2} isAnimationActive={false}/>
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-3 flex flex-col gap-2 border border-slate-700">
          <p className="text-[9px] text-slate-500 uppercase">Cutoff fc</p>
          <input type="range" min={0.05} max={0.45} step={0.01} value={fc} onChange={e=>setFc(parseFloat(e.target.value))} className="accent-[#F7B801]"/>
          <span className="font-black font-mono text-[#F7B801] text-sm">{fc.toFixed(2)}π</span>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 flex flex-col gap-2 border border-slate-700">
          <p className="text-[9px] text-slate-500 uppercase">Taps (Order)</p>
          <div className="flex gap-1 flex-wrap">{[5,11,21,31,51].map(t=><button key={t} onClick={()=>setTaps(t)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${taps===t?'bg-[#FF6B35] text-white':'bg-slate-700 text-slate-400'}`}>{t}</button>)}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 flex flex-col gap-1 border border-slate-700">
          <p className="text-[9px] text-slate-500 uppercase">Window Type</p>
          {(['rectangular','hamming','hann'] as Win[]).map(w=><button key={w} onClick={()=>setWin(w)} className={`px-2 py-0.5 rounded text-[10px] font-bold text-left ${win===w?'bg-[#004E89] text-white':'bg-slate-700 text-slate-400 uppercase'}`}>{w}</button>)}
        </div>
      </div>
    </div>
  );
}
