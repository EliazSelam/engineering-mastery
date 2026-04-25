import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Info, Play, RotateCcw } from 'lucide-react';

const NODES = [
  { id: 'r', label: 'r(t)', sub: 'ערך רצוי', color: '#60a5fa', desc: 'הערך שאליו אנחנו רוצים שהמערכת תגיע (למשל: מהירות רצויה).' },
  { id: 'sum', label: 'Σ', sub: 'השוואה', color: '#818cf8', desc: 'מחשב את השגיאה: e = r - y. ההפרש בין הרצוי למצוי.' },
  { id: 'c', label: 'C(s)', sub: 'בקר', color: '#f59e0b', desc: 'המוח של המערכת. מחליט כמה כוח להפעיל לפי השגיאה.' },
  { id: 'g', label: 'G(s)', sub: 'צמח', color: '#4ade80', desc: 'המערכת הפיזיקלית עצמה (מנוע, תנור, וכו\').' },
  { id: 'y', label: 'y(t)', sub: 'פלט', color: '#f472b6', desc: 'התוצאה הנמדדת של המערכת בזמן אמת.' },
  { id: 'h', label: 'H(s)', sub: 'חיישן', color: '#ef4444', desc: 'מודד את הפלט ומחזיר אותו להשוואה.' },
  { id: 'd', label: 'd(t)', sub: 'הפרעה', color: '#f87171', desc: 'גורם חיצוני שמשפיע על המערכת (למשל: רוח על דרון).' },
];

const STEPS = [
  { id: 'step1', label: 'אות ייחוס', desc: 'הגדרת המטרה הרצויה', path: "M 50 150 L 120 150" },
  { id: 'step2', label: 'חישוב שגיאה', desc: 'השוואה בין המצוי לרצוי בנקודת הסיכום', path: "M 120 150 L 180 150" },
  { id: 'step3', label: 'החלטת בקר', desc: 'הבקר מעבד את השגיאה ומוציא פקודה', path: "M 180 150 L 250 150 L 350 150" },
  { id: 'step4', label: 'פעולת המערכת', desc: 'הפקודה מפעילה את המערכת הפיזיקלית', path: "M 350 150 L 420 150 L 520 150" },
  { id: 'step5', label: 'תוצאה בשטח', desc: 'המערכת מגיעה למצב חדש', path: "M 520 150 L 650 150" },
  { id: 'step6', label: 'מדידת משוב', desc: 'החיישן קורא את המצב החדש ומחזיר אותו', path: "M 600 150 L 600 240 L 520 240 L 420 240 L 150 240 L 150 180" },
];

export default function ClosedLoopDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isAnimating) {
      if (currentStep < STEPS.length - 1) {
        timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 1500);
      } else {
        timer = setTimeout(() => {
          setIsAnimating(false);
          setCurrentStep(-1);
        }, 2000);
      }
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep]);

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setActiveNode(null);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(-1);
    setActiveNode(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative bg-[hsl(var(--color-surface-2))] rounded-xl p-8 overflow-hidden border border-[hsl(var(--color-border))]">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
              isAnimating ? "bg-[hsl(var(--color-surface))] text-[hsl(var(--color-text-faint))]" : "bg-[hsl(var(--color-primary))] text-white hover:bg-[hsl(var(--color-primary-hover))]"
            )}
          >
            <Play size={14} fill={isAnimating ? "none" : "currentColor"} />
            {isAnimating ? 'מריץ...' : 'הפעל זרימה'}
          </button>
          <button
            onClick={resetAnimation}
            className="p-1.5 bg-white border border-[hsl(var(--color-border))] rounded-lg hover:bg-[hsl(var(--color-surface))] transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <svg viewBox="0 0 800 300" className="w-full h-auto drop-shadow-sm">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--color-text-muted))" />
            </marker>
          </defs>

          {/* Static Paths */}
          <path d="M 50 150 L 120 150" stroke="hsl(var(--color-text-muted))" strokeWidth="1" opacity="0.2" />
          <path d="M 180 150 L 250 150" stroke="hsl(var(--color-text-muted))" strokeWidth="1" opacity="0.2" />
          <path d="M 350 150 L 420 150" stroke="hsl(var(--color-text-muted))" strokeWidth="1" opacity="0.2" />
          <path d="M 520 150 L 650 150" stroke="hsl(var(--color-text-muted))" strokeWidth="1" opacity="0.2" />
          <path d="M 600 150 L 600 240 L 520 240" stroke="hsl(var(--color-text-muted))" strokeWidth="1" opacity="0.2" />
          <path d="M 420 240 L 150 240 L 150 180" stroke="hsl(var(--color-text-muted))" strokeWidth="1" opacity="0.2" />

          {/* Animated Steps */}
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <motion.path
                d={step.path}
                stroke={idx === currentStep ? "hsl(var(--color-primary))" : idx < currentStep ? "hsl(var(--color-primary)/0.3)" : "none"}
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: idx === currentStep ? 1 : idx < currentStep ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                markerEnd={idx === currentStep ? "url(#arrowhead)" : "none"}
              />
              {idx === currentStep && (
                <motion.circle
                  r="4"
                  fill="hsl(var(--color-primary))"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 1, ease: "linear" }}
                  style={{ offsetPath: `path("${step.path}")` }}
                />
              )}
            </React.Fragment>
          ))}

          {/* Nodes */}
          {NODES.map((node) => {
            const isActive = activeNode === node.id;
            const isStepActive = currentStep !== -1 && (
              (currentStep === 0 && node.id === 'r') ||
              (currentStep === 1 && node.id === 'sum') ||
              (currentStep === 2 && node.id === 'c') ||
              (currentStep === 3 && node.id === 'g') ||
              (currentStep === 4 && node.id === 'y') ||
              (currentStep === 5 && node.id === 'h')
            );

            return (
              <g key={node.id} className="cursor-pointer" onClick={() => setActiveNode(node.id)}>
                {node.id === 'sum' ? (
                  <circle 
                    cx="150" cy="150" r="30" 
                    fill={node.color} 
                    opacity={isActive ? 1 : 0.8}
                    stroke={isStepActive ? "white" : "none"}
                    strokeWidth="3"
                  />
                ) : (
                  <rect 
                    x={node.id === 'r' ? 20 : node.id === 'y' ? 650 : node.id === 'c' ? 250 : node.id === 'g' ? 420 : node.id === 'h' ? 420 : 440} 
                    y={node.id === 'h' ? 210 : node.id === 'd' ? 10 : 120} 
                    width={node.id === 'r' || node.id === 'y' || node.id === 'd' ? 60 : 100} 
                    height={node.id === 'r' || node.id === 'y' || node.id === 'd' ? 40 : 60} 
                    rx="8" 
                    fill={node.color} 
                    opacity={isActive ? 1 : 0.8}
                    stroke={isStepActive ? "white" : "none"}
                    strokeWidth="3"
                  />
                )}
                <text 
                  x={node.id === 'sum' ? 150 : node.id === 'r' ? 50 : node.id === 'y' ? 680 : node.id === 'c' ? 300 : node.id === 'g' ? 470 : node.id === 'h' ? 470 : 470} 
                  y={node.id === 'sum' ? 158 : node.id === 'h' ? 245 : node.id === 'd' ? 35 : 155} 
                  textAnchor="middle" 
                  fill="white" 
                  className="font-bold text-sm pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <AnimatePresence mode="wait">
        {(activeNode || currentStep !== -1) && (
          <motion.div
            key={activeNode || currentStep}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <div className="p-2 bg-[hsl(var(--color-pastel-teal))] text-[hsl(var(--color-primary))] rounded-lg shrink-0">
                <Info size={20} />
              </div>
              <div>
                {currentStep !== -1 ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-[hsl(var(--color-primary))]">שלב {currentStep + 1}: {STEPS[currentStep].label}</h4>
                    </div>
                    <p className="text-[hsl(var(--color-text-muted))] leading-relaxed">
                      {STEPS[currentStep].desc}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">{NODES.find(n => n.id === activeNode)?.label}</h4>
                      <span className="text-[hsl(var(--color-text-muted))] text-sm">— {NODES.find(n => n.id === activeNode)?.sub}</span>
                    </div>
                    <p className="text-[hsl(var(--color-text-muted))] leading-relaxed">
                      {NODES.find(n => n.id === activeNode)?.desc}
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!activeNode && currentStep === -1 && (
        <p className="text-center text-[hsl(var(--color-text-faint))] text-sm italic">
          לחץ על אחד הבלוקים או על "הפעל זרימה" כדי לראות איך המערכת עובדת
        </p>
      )}
    </div>
  );
}
