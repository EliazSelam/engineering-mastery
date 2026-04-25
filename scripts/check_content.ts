// Quick CLI audit for engineering content quality
// Run: npx tsx scripts/check_content.ts

import { DAYS } from '../src/content/days';

let errors = 0;
let warnings = 0;

console.log('🔍 Engineering Content Audit\n');

for (const day of DAYS) {
  const prefix = `Day ${String(day.day).padStart(2, '0')} (${day.title}):`;

  // Check quiz questions
  const questions = day.sections.challenge?.questions || [];
  if (questions.length === 0) {
    console.error(`❌ ${prefix} has no questions`);
    errors++;
  }

  for (const q of questions) {
    const correctCount = (q.options || []).filter((opt) => opt.correct).length;
    if (correctCount !== 1) {
      console.error(`❌ ${prefix} Q${q.id} has ${correctCount} correct answer(s) (expected 1)`);
      errors++;
    }
    if (!q.explanation || q.explanation.length < 10) {
      console.warn(`⚠️  ${prefix} Q${q.id} has weak explanation`);
      warnings++;
    }
  }

  // Check for placeholders
  const fullText = JSON.stringify(day);
  const placeholders = ['TODO', 'DUMMY', 'lorem ipsum', 'coming soon', 'TBD'];
  for (const p of placeholders) {
    if (fullText.toLowerCase().includes(p.toLowerCase())) {
      console.error(`❌ ${prefix} contains placeholder: "${p}"`);
      errors++;
    }
  }

  // Check key equation
  if (!day.sections.theory?.key_equation?.latex || day.sections.theory.key_equation.latex.length < 3) {
    console.warn(`⚠️  ${prefix} missing or short key_equation.latex`);
    warnings++;
  }

  // Check summary points
  const points = day.sections.summary?.points || [];
  if (points.length < 3) {
    console.warn(`⚠️  ${prefix} only ${points.length} summary points (expected ≥3)`);
    warnings++;
  }

  // Check summary extended
  if (!day.sections.summary_extended) {
    console.warn(`⚠️  ${prefix} missing summary_extended`);
    warnings++;
  }

  // Check prerequisites validity
  const prereqs = day.meta?.prerequisites || [];
  for (const p of prereqs) {
    if (p < 1 || p > 30) {
      console.error(`❌ ${prefix} invalid prerequisite: ${p}`);
      errors++;
    }
  }
}

console.log(`\n${'-'.repeat(50)}`);
console.log(`📊 AUDIT RESULTS`);
console.log(`${'-'.repeat(50)}`);
console.log(`Total days checked: ${DAYS.length}`);
console.log(`❌ Errors: ${errors}`);
console.log(`⚠️  Warnings: ${warnings}`);

if (errors === 0) {
  console.log(`\n✅ All critical checks passed!`);
  process.exit(0);
} else {
  console.log(`\n❌ Critical errors found. Fix them before deployment.`);
  process.exit(1);
}
