import React from 'react';
import { cn } from '@/src/lib/utils';

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ completed, total, className }: ProgressBarProps) {
  return (
    <div className={cn("flex gap-1 h-2 w-full max-w-[200px]", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-full transition-all duration-500",
            i < completed ? "bg-[hsl(var(--color-primary))]" : "bg-[hsl(var(--color-border))]"
          )}
        />
      ))}
    </div>
  );
}
