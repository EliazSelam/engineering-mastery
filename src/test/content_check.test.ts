import { describe, it, expect } from 'vitest';
import { DAYS } from '../content/days';

describe('Content validation — 30-day engineering challenge', () => {
  describe('1. Day count and uniqueness', () => {
    it('has exactly 30 days', () => {
      expect(DAYS.length).toBe(30);
    });

    it('all days have unique day numbers (1-30)', () => {
      const dayNumbers = DAYS.map(d => d.day);
      const unique = new Set(dayNumbers);
      expect(unique.size).toBe(30);
      expect(dayNumbers.every(n => n >= 1 && n <= 30)).toBe(true);
    });

    it('days are in sequential order', () => {
      const expected = Array.from({ length: 30 }, (_, i) => i + 1);
      const actual = DAYS.map(d => d.day);
      expect(actual).toEqual(expected);
    });
  });

  describe('2. Required section structure', () => {
    it('every day has all required sections: hero, background, theory, simulation, challenge, summary', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        if (!day.hero) errors.push(`Day ${day.day}: missing hero`);
        if (!day.sections?.background) errors.push(`Day ${day.day}: missing sections.background`);
        if (!day.sections?.theory) errors.push(`Day ${day.day}: missing sections.theory`);
        if (!day.sections?.simulation) errors.push(`Day ${day.day}: missing sections.simulation`);
        if (!day.sections?.challenge) errors.push(`Day ${day.day}: missing sections.challenge`);
        if (!day.sections?.summary) errors.push(`Day ${day.day}: missing sections.summary`);
      }
      expect(errors).toEqual([]);
    });

    it('every day has hero.badge, subtitle, why_today, prepares_for', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        if (!day.hero?.badge) errors.push(`Day ${day.day}: missing hero.badge`);
        if (!day.hero?.subtitle) errors.push(`Day ${day.day}: missing hero.subtitle`);
        if (!day.hero?.why_today) errors.push(`Day ${day.day}: missing hero.why_today`);
        if (!day.hero?.prepares_for) errors.push(`Day ${day.day}: missing hero.prepares_for`);
      }
      expect(errors).toEqual([]);
    });
  });

  describe('3. Challenge questions structure', () => {
    it('every day has at least 1 challenge question', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const count = day.sections.challenge?.questions?.length ?? 0;
        if (count < 1) {
          errors.push(`Day ${day.day}: has ${count} questions (expected ≥1)`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('every question has at least 2 answer options', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        for (const q of day.sections.challenge?.questions ?? []) {
          const optCount = q.options?.length ?? 0;
          if (optCount < 2) {
            errors.push(`Day ${day.day}, Q${q.id}: has ${optCount} options (expected ≥2)`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every question has exactly one correct option', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        for (const q of day.sections.challenge?.questions ?? []) {
          const correctCount = q.options?.filter(o => o.correct).length ?? 0;
          if (correctCount !== 1) {
            errors.push(`Day ${day.day}, Q${q.id}: has ${correctCount} correct answers (expected 1)`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every question has a non-empty explanation (>10 chars)', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        for (const q of day.sections.challenge?.questions ?? []) {
          if (!q.explanation || q.explanation.length < 10) {
            errors.push(`Day ${day.day}, Q${q.id}: explanation too short ("${q.explanation || ''}")`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('no duplicate question IDs within the same day', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const qIds = day.sections.challenge?.questions?.map(q => q.id) ?? [];
        const unique = new Set(qIds);
        if (unique.size !== qIds.length) {
          errors.push(`Day ${day.day}: has duplicate question IDs`);
        }
      }
      expect(errors).toEqual([]);
    });
  });

  describe('4. Content quality — no placeholders', () => {
    it('no placeholder text: TODO, DUMMY, lorem, placeholder, coming soon, TBD', () => {
      const placeholders = ['TODO', 'DUMMY', 'lorem', 'placeholder', 'coming soon', 'TBD'];
      const errors: string[] = [];

      for (const day of DAYS) {
        const dayText = JSON.stringify(day);
        for (const p of placeholders) {
          if (dayText.toLowerCase().includes(p.toLowerCase())) {
            errors.push(`Day ${day.day}: contains placeholder "${p}"`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has a non-empty title', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        if (!day.title || day.title.length === 0) {
          errors.push(`Day ${day.day}: missing or empty title`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('no duplicate titles across days', () => {
      const titles = DAYS.map(d => d.title);
      const unique = new Set(titles);
      expect(unique.size).toBe(30);
    });
  });

  describe('5. LaTeX and formula fields', () => {
    it('every day has a non-empty key_equation.latex', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const latex = day.sections.theory?.key_equation?.latex;
        if (!latex || latex.length < 3) {
          errors.push(`Day ${day.day}: missing or too short key_equation.latex`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('every question with formula field has non-empty formula', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        for (const q of day.sections.challenge?.questions ?? []) {
          if (q.formula !== undefined && (!q.formula || q.formula.length === 0)) {
            errors.push(`Day ${day.day}, Q${q.id}: has empty formula field`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every theory section has a non-empty key_equation explanation', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const exp = day.sections.theory?.key_equation?.explanation;
        if (!exp || exp.length === 0) {
          errors.push(`Day ${day.day}: missing key_equation explanation`);
        }
      }
      expect(errors).toEqual([]);
    });
  });

  describe('6. Summary and key points', () => {
    it('every day has at least 3 summary points', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const points = day.sections.summary?.points ?? [];
        if (points.length < 3) {
          errors.push(`Day ${day.day}: only ${points.length} summary points (expected ≥3)`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('every summary point has non-empty text and tag', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        for (let i = 0; i < (day.sections.summary?.points?.length ?? 0); i++) {
          const p = day.sections.summary!.points![i];
          if (!p.text || p.text.length === 0) {
            errors.push(`Day ${day.day}, point ${i}: missing text`);
          }
          if (!p.tag || p.tag.length === 0) {
            errors.push(`Day ${day.day}, point ${i}: missing tag`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has misconceptions with myth and truth', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const misconceptions = day.sections.summary?.misconceptions ?? [];
        if (misconceptions.length === 0) {
          errors.push(`Day ${day.day}: no misconceptions`);
        }
        for (let i = 0; i < misconceptions.length; i++) {
          const m = misconceptions[i];
          if (!m.myth || m.myth.length === 0) {
            errors.push(`Day ${day.day}, misconception ${i}: missing myth`);
          }
          if (!m.truth || m.truth.length === 0) {
            errors.push(`Day ${day.day}, misconception ${i}: missing truth`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has next_day with title and desc', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const nd = day.sections.summary?.next_day;
        if (!nd?.title || nd.title.length === 0) {
          errors.push(`Day ${day.day}: missing next_day.title`);
        }
        if (!nd?.desc || nd.desc.length === 0) {
          errors.push(`Day ${day.day}: missing next_day.desc`);
        }
      }
      expect(errors).toEqual([]);
    });
  });

  describe('7. Meta and prerequisites', () => {
    it('all prerequisites reference valid day numbers (1-30)', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const prereqs = day.meta?.prerequisites ?? [];
        for (const p of prereqs) {
          if (p < 1 || p > 30) {
            errors.push(`Day ${day.day}: prerequisite ${p} is out of range [1-30]`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has a category from the allowed set', () => {
      const validCategories = ['בקרה', 'הניע חשמלי', 'DSP', 'אלגוריתמים', 'קוונטי', 'מבוא', 'פרויקט', 'רובוטיקה'];
      const errors: string[] = [];
      for (const day of DAYS) {
        if (!validCategories.includes(day.category)) {
          errors.push(`Day ${day.day}: invalid category "${day.category}"`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has a level from: מתחיל, בינוני, מתקדם', () => {
      const validLevels = ['מתחיל', 'בינוני', 'מתקדם'];
      const errors: string[] = [];
      for (const day of DAYS) {
        if (!validLevels.includes(day.level)) {
          errors.push(`Day ${day.day}: invalid level "${day.level}"`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has estimated_complexity 1-5', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const c = day.meta?.estimated_complexity;
        if (!c || c < 1 || c > 5) {
          errors.push(`Day ${day.day}: estimated_complexity is ${c} (expected 1-5)`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has duration_min >= 1', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        if (!day.duration_min || day.duration_min < 1) {
          errors.push(`Day ${day.day}: duration_min is ${day.duration_min} (expected ≥1)`);
        }
      }
      expect(errors).toEqual([]);
    });
  });

  describe('8. Section-specific content', () => {
    it('background section has problem, real_world array, and key_ideas array', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const bg = day.sections.background;
        if (!bg?.problem) errors.push(`Day ${day.day}: missing background.problem`);
        if (!Array.isArray(bg?.real_world) || (bg?.real_world ?? []).length === 0) {
          errors.push(`Day ${day.day}: missing or empty background.real_world`);
        }
        if (!Array.isArray(bg?.key_ideas) || (bg?.key_ideas ?? []).length === 0) {
          errors.push(`Day ${day.day}: missing or empty background.key_ideas`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('theory section has diagram, key_equation, and tradeoff', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const th = day.sections.theory;
        if (!th?.diagram) errors.push(`Day ${day.day}: missing theory.diagram`);
        if (!th?.key_equation) errors.push(`Day ${day.day}: missing theory.key_equation`);
        if (!th?.tradeoff) errors.push(`Day ${day.day}: missing theory.tradeoff`);
      }
      expect(errors).toEqual([]);
    });

    it('simulation section has component and intuition', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const sim = day.sections.simulation;
        if (!sim?.component) errors.push(`Day ${day.day}: missing simulation.component`);
        if (!sim?.intuition) errors.push(`Day ${day.day}: missing simulation.intuition`);
      }
      expect(errors).toEqual([]);
    });

    it('tradeoff section has pro, con, pro_label, con_label (all non-empty)', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const tf = day.sections.theory?.tradeoff;
        if (!tf?.pro || tf.pro.length === 0) errors.push(`Day ${day.day}: missing tradeoff.pro`);
        if (!tf?.con || tf.con.length === 0) errors.push(`Day ${day.day}: missing tradeoff.con`);
        if (!tf?.pro_label || tf.pro_label.length === 0) errors.push(`Day ${day.day}: missing tradeoff.pro_label`);
        if (!tf?.con_label || tf.con_label.length === 0) errors.push(`Day ${day.day}: missing tradeoff.con_label`);
      }
      expect(errors).toEqual([]);
    });
  });

  describe('9. Extended content (summary_extended)', () => {
    it('every day has summary_extended section', () => {
      const missing = DAYS.filter(d => !d.sections.summary_extended).map(d => d.day);
      expect(missing).toEqual([]);
    });

    it('every summary_extended has overview, theory_deep, worked_example, applications, further_reading', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const ext = day.sections.summary_extended;
        if (!ext?.overview) errors.push(`Day ${day.day}: missing overview`);
        if (!ext?.theory_deep) errors.push(`Day ${day.day}: missing theory_deep`);
        if (!ext?.worked_example) errors.push(`Day ${day.day}: missing worked_example`);
        if (!Array.isArray(ext?.applications) || (ext?.applications ?? []).length === 0) {
          errors.push(`Day ${day.day}: missing or empty applications array`);
        }
        if (!Array.isArray(ext?.further_reading) || (ext?.further_reading ?? []).length === 0) {
          errors.push(`Day ${day.day}: missing or empty further_reading array`);
        }
      }
      expect(errors).toEqual([]);
    });

    it('extended content fields have minimum length (50+ chars)', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const ext = day.sections.summary_extended!;
        if ((ext.overview ?? '').length < 50) errors.push(`Day ${day.day}: overview too short`);
        if ((ext.theory_deep ?? '').length < 50) errors.push(`Day ${day.day}: theory_deep too short`);
        if ((ext.worked_example ?? '').length < 50) errors.push(`Day ${day.day}: worked_example too short`);
      }
      expect(errors).toEqual([]);
    });
  });

  describe('10. Data consistency', () => {
    it('question IDs are sequential within each day', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const questions = day.sections.challenge?.questions ?? [];
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].id !== i + 1) {
            errors.push(`Day ${day.day}: Q${i} has id ${questions[i].id} (expected ${i + 1})`);
          }
        }
      }
      expect(errors).toEqual([]);
    });

    it('every day has consistent tags in meta.tags (if present)', () => {
      const errors: string[] = [];
      for (const day of DAYS) {
        const tags = day.meta?.tags ?? [];
        for (let i = 0; i < tags.length; i++) {
          if (typeof tags[i] !== 'string' || tags[i].length === 0) {
            errors.push(`Day ${day.day}: tag ${i} is invalid`);
          }
        }
      }
      expect(errors).toEqual([]);
    });
  });

  describe('11. Summary statistics', () => {
    it('total questions across all days >= 30', () => {
      const totalQuestions = DAYS.reduce((sum, d) => sum + (d.sections.challenge?.questions?.length ?? 0), 0);
      expect(totalQuestions).toBeGreaterThanOrEqual(30);
    });

    it('total summary points across all days >= 90', () => {
      const totalPoints = DAYS.reduce((sum, d) => sum + (d.sections.summary?.points?.length ?? 0), 0);
      expect(totalPoints).toBeGreaterThanOrEqual(90);
    });

    it('all 30 days are fully populated with core structure', () => {
      let validDays = 0;
      for (const day of DAYS) {
        const hasAllSections = day.hero && day.sections?.background && day.sections?.theory &&
                               day.sections?.simulation && day.sections?.challenge &&
                               day.sections?.summary && day.sections?.summary_extended;
        const hasAtLeastOneQuestion = (day.sections.challenge?.questions?.length ?? 0) >= 1;
        if (hasAllSections && hasAtLeastOneQuestion) {
          validDays++;
        }
      }
      expect(validDays).toBe(30);
    });
  });
});
