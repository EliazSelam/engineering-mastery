import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface SubjectMastery {
  dayId: number;
  score: number; // 0 to 1
  lastAttempt: number; // Timestamp
  nextRecall: number; // Timestamp
  interval: number; // Days to next recall
  attempts: number;
}

export interface UserProgress {
  completedDays: number[];
  mastery: Record<number, SubjectMastery>;
  lastActive: number;
  streak: number;
  maxStreak: number;
  totalStudyTime: number; // seconds
}

const INITIAL_PROGRESS: UserProgress = {
  completedDays: [],
  mastery: {},
  lastActive: Date.now(),
  streak: 0,
  maxStreak: 0,
  totalStudyTime: 0
};

export function useStudySystem() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('eng-app-progress', INITIAL_PROGRESS);
  const [sessionStart] = useState(Date.now());

  // Analytics: Track total study time
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      setProgress(prev => ({
        ...prev,
        totalStudyTime: prev.totalStudyTime + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [setProgress]);

  const markDayComplete = useCallback((dayId: number, score: number) => {
    setProgress(prev => {
      const isNew = !prev.completedDays.includes(dayId);
      const newCompleted = isNew ? [...prev.completedDays, dayId] : prev.completedDays;
      
      // Spaced Repetition Logic (Simple version of SM-2)
      const currentMastery = prev.mastery[dayId] || {
        dayId,
        score: 0,
        lastAttempt: 0,
        nextRecall: 0,
        interval: 1,
        attempts: 0
      };

      const newInterval = score >= 0.8 ? currentMastery.interval * 2 : 1;
      const nextRecall = Date.now() + (newInterval * 24 * 60 * 60 * 1000);

      const updatedMastery = {
        ...currentMastery,
        score: Math.max(currentMastery.score, score),
        lastAttempt: Date.now(),
        nextRecall,
        interval: newInterval,
        attempts: currentMastery.attempts + 1
      };

      // Streak logic
      const lastActiveDate = new Date(prev.lastActive).toDateString();
      const todayDate = new Date().toDateString();
      const yesterdayDate = new Date(Date.now() - 86400000).toDateString();
      
      let newStreak = prev.streak;
      if (lastActiveDate === yesterdayDate) {
        newStreak += 1;
      } else if (lastActiveDate !== todayDate) {
        newStreak = 1;
      }

      return {
        ...prev,
        completedDays: newCompleted,
        mastery: { ...prev.mastery, [dayId]: updatedMastery },
        lastActive: Date.now(),
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak || 0, newStreak)
      };
    });
  }, [setProgress]);

  const getRecallItems = useCallback(() => {
    const now = Date.now();
    return (Object.values(progress.mastery) as SubjectMastery[]).filter(m => m.nextRecall < now);
  }, [progress.mastery]);

  return {
    progress,
    markDayComplete,
    getRecallItems,
    isDayComplete: (dayId: number) => progress.completedDays.includes(dayId)
  };
}
