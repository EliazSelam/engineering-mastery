import { week1Days } from './weeks/week1';
import { week2Days } from './weeks/week2';
import { week3Days } from './weeks/week3';
import { week4Days } from './weeks/week4';
import { DayContent } from './types';

export type { DayContent };

export const allDays: DayContent[] = [
  ...week1Days,
  ...week2Days,
  ...week3Days,
  ...week4Days,
];

// Alias for backward compatibility
export const DAYS = allDays;

export const getDayById = (id: number) => allDays.find(d => d.day === id);
