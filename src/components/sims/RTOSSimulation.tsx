import React, { useState, useMemo } from 'react';

export default function RTOSSimulation() {
  const DEFAULT = { ticks: 20 };
  const [ticks, setTicks] = useState(DEFAULT.ticks);

  const reset = () => setTicks(DEFAULT.ticks);

  const getTakeaway = () => {
    const usage = Math.round((grid.flat().filter(v => v).length / (ticks * 1)) * 100);
    if (usage > 80) return "⚠️ High Load: המעבד כמעט ב-100% נצילות. במצב כזה, משימות בעדיפות נמוכה (כמו Logs) עלולות לסבול מ-Starvation (רעב).";
    return "💡 RTOS Scheduling: המעבד תמיד מריץ את המשימה החשובה ביותר הזמינה באותו רגע. משימה 1 תקטע את משימה 2 אם שניהן צריכות לרוץ.";
  };

  const tasks = [
    { name: 'T1', period: 3, color: 'bg-emerald-500', label: 'Sensor' },
    { name: 'T2', period: 5, color: 'bg-[#FF6B35]', label: 'Control' },
    { name: 'T3', period: 7, color: 'bg-[#004E89]', label: 'Logs' },
  ];

  const grid = useMemo(() => {
    return tasks.map(task => {
      return Array.from({ length: ticks }, (_, t) => {
        // Simple fixed-priority scheduling (T1 > T2 > T3)
        // Check if higher priorities are running
        const t1Active = t % tasks[0].period === 0;
        const t2Active = t % tasks[1].period === 0 && !t1Active;
        const t3Active = t % tasks[2].period === 0 && !t1Active && !t2Active;

        if (task.name === 'T1') return t1Active ? 1 : 0;
        if (task.name === 'T2') return t2Active ? 1 : 0;
        if (task.name === 'T3') return t3Active ? 1 : 0;
        return 0;
      });
    });
  }, [ticks]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 flex flex-col gap-6 border-4 border-slate-800 text-white" dir="ltr">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-300 uppercase tracking-widest">RTOS Task Scheduler — Gantt Chart</h3>
          <div className="flex gap-4 items-center">
            <button 
              onClick={reset}
              className="px-3 py-1 rounded-lg bg-slate-700 text-[10px] font-bold hover:bg-slate-600 transition-colors"
            >
              RESET
            </button>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Sim Ticks: {ticks}</span>
              <input 
                type="range" min={10} max={30} step={1} 
                value={ticks} onChange={(e) => setTicks(parseInt(e.target.value))}
                className="accent-[#FF6B35] w-32"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 italic">Visualizing fixed-priority pre-emptive scheduling in real-time operating systems.</p>
      </div>

      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 italic text-sm text-emerald-400">
        {getTakeaway()}
      </div>

      <div className="bg-black/40 p-4 rounded-xl border border-slate-700 overflow-x-auto">
        <div className="min-w-[400px]">
          <div className="flex mb-1">
            <div className="w-16 shrink-0" />
            <div className="flex-1 flex justify-between px-1">
               {Array.from({ length: ticks }).map((_, i) => (
                 <span key={i} className="text-[8px] text-slate-600 font-mono w-4 text-center">{i}</span>
               ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {tasks.map((task, r) => (
              <div key={task.name} className="flex items-center gap-2">
                <div className="w-16 shrink-0 flex flex-col">
                  <span className="text-[10px] font-black leading-tight">{task.name}</span>
                  <span className="text-[8px] text-slate-500 uppercase">{task.label}</span>
                </div>
                <div className="flex-1 flex gap-1 h-6">
                   {grid[r].map((val, c) => (
                     <div 
                       key={c}
                       className={`flex-1 rounded-sm transition-all duration-300 ${val ? task.color : 'bg-slate-800/40'}`}
                       title={`${task.name} at tick ${c}: ${val ? 'RUNNING' : 'IDLE'}`}
                     />
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-2 rounded-xl flex items-center justify-center gap-2 border border-slate-700">
           <div className="w-2 h-2 rounded-full bg-emerald-500" />
           <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Utilization: {Math.round((grid.flat().filter(v => v).length / (ticks * 1)) * 100)}%</span>
        </div>
        <div className="bg-slate-800 p-2 rounded-xl flex items-center justify-center gap-2 border border-slate-700">
           <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
           <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Preemption: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
