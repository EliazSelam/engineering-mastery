import React, { useState } from 'react';
import { useStudySystem } from '../../hooks/useStudySystem';
import { DAYS } from '../../content/days';
import { CheckCircle2, Circle, Share2, Award } from 'lucide-react';

export default function PortfolioBuilder() {
  const { progress } = useStudySystem();
  const { completedDays } = progress;
  const [copied, setCopied] = useState(false);

  const total = 30;
  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / total) * 100);

  const copyToLinkedIn = () => {
    const text = `🚀 I just completed ${completedCount}/30 days of the Engineering Mastery program! 

Topics mastered include:
- Digital Signal Processing (DSP)
- Advanced Control Systems (MPC, LQR)
- Robotics Dynamics & Kinematics
- RTOS & Embedded Systems

Verified via interactive simulations and deep theory. 
Check out my portfolio at EngMastery 🎓 #Engineeering #DSP #ControlSystems`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-[40px] p-8 flex flex-col gap-8 border-4 border-slate-800 text-white shadow-2xl relative overflow-hidden" dir="ltr">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Award size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-1 mb-6 border-b border-slate-800 pb-6">
          <h3 className="font-black text-2xl text-white leading-none">Career Mastery Portfolio</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Interactive Engineering Curriculum Trace</p>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            מעקב אחר התקדמותך ב-30 ימי הלמידה. כל נקודה מייצגת ידע שנרכש בסימולציות, תיאוריה ותרגול מעשי.
          </p>
        </div>

        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 italic text-sm text-emerald-400 mb-8">
          {progressPercent === 100 
            ? "🏆 וואו! השלמת את כל 30 הימים. אתה מוכן לכבוש את עולם ההנדסה." 
            : progressPercent > 50 
            ? "💪 עברת את חצי הדרך! המשך כך, כל יום מקדם אותך צעד נוסף למומחיות." 
            : progressPercent > 0 
            ? "🚀 התחלה מצוינת! הקפד על התמדה יומית כדי לבנות את ה-Streak שלך." 
            : "🎓 ברוך הבא לתוכנית! התחל את היום הראשון כדי לבנות את התיק המקצועי שלך."}
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="opacity-0">
             <h3 className="font-black text-2xl text-white mb-2 leading-none">Career Mastery Portfolio</h3>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Interactive Engineering Curriculum Trace</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex flex-col items-center">
             <span className="text-2xl font-black text-emerald-400 leading-none">{progressPercent}%</span>
             <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Mastery</span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full mb-10 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="grid grid-cols-5 md:grid-cols-6 gap-3 mb-10">
           {DAYS.map((day) => {
             const isDone = completedDays.includes(day.day);
             return (
               <div 
                 key={day.day} 
                 className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${
                   isDone ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-600'
                 }`}
               >
                 {isDone ? <CheckCircle2 size={16} /> : <Circle size={14} className="opacity-20" />}
                 <span className="text-[9px] font-black mt-1">{day.day}</span>
               </div>
             );
           })}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
           <button 
             onClick={copyToLinkedIn}
             className="flex-1 bg-[#10b981] hover:bg-[#0da673] py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-900/40 group active:scale-95"
           >
             <Share2 size={16} className={copied ? 'animate-bounce' : 'group-hover:rotate-12'} />
             {copied ? 'Copied to Clipboard!' : 'Copy to LinkedIn'}
           </button>
           <button 
             className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest transition-all border border-slate-700"
             disabled={completedCount < 30}
           >
             <Award size={16} />
             {completedCount < 30 ? `Finish ${30 - completedCount} more` : 'Claim Professional Certificate'}
           </button>
        </div>
      </div>

      {progressPercent === 100 && (
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
      )}
    </div>
  );
}
