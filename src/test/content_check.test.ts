import { describe, it, expect } from 'vitest';
import { DAYS } from '../content/days';
import { SIMULATION_COMPONENTS } from '../pages/DayPage';

describe('Content completeness — all 30 days', () => {
  it('has exactly 30 days', () => {
    expect(DAYS.length).toBe(30);
  });

  it('every day has required section fields', () => {
    const missing: string[] = [];
    for (const day of DAYS) {
      const s = day.sections;
      if (!s.background)  missing.push(`Day ${day.day}: background`);
      if (!s.theory)      missing.push(`Day ${day.day}: theory`);
      if (!s.simulation)  missing.push(`Day ${day.day}: simulation`);
      if (!s.challenge)   missing.push(`Day ${day.day}: challenge`);
      if (!s.summary)     missing.push(`Day ${day.day}: summary`);
    }
    expect(missing).toEqual([]);
  });

  it('every day has summary.points, misconceptions, next_day', () => {
    const missing: string[] = [];
    for (const day of DAYS) {
      const sum = day.sections.summary;
      if (!sum?.points?.length)        missing.push(`Day ${day.day}: points`);
      if (!sum?.misconceptions?.length) missing.push(`Day ${day.day}: misconceptions`);
      if (!sum?.next_day?.title)       missing.push(`Day ${day.day}: next_day`);
    }
    expect(missing).toEqual([]);
  });

  it('every day has summary_extended', () => {
    const missing = DAYS.filter(d => !d.sections.summary_extended).map(d => d.day);
    expect(missing).toEqual([]);
  });

  it('every simulation.component is registered in SIMULATION_COMPONENTS', () => {
    const missing: string[] = [];
    for (const day of DAYS) {
      const comp = day.sections.simulation?.component;
      if (comp && !SIMULATION_COMPONENTS[comp]) {
        missing.push(`Day ${day.day}: "${comp}" not registered`);
      }
    }
    expect(missing).toEqual([]);
  });
});
