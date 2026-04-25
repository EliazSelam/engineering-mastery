# Engineering Mastery — CLAUDE.md

## Project Overview
React 19 + TypeScript + Vite 6 PWA — 30-day engineering mastery program.
Stack: wouter (hash router for file:// compat), Tailwind CSS v4, Fraunces + Heebo fonts.

## Architecture
- `src/content/days.ts` — exports `DAYS: DayContent[]` (all 30 days)
- `src/pages/DayPage.tsx` — main lesson page, exports `SIMULATION_COMPONENTS`
- `src/components/sims/` — individual simulation TSX components
- `src/test/` — Vitest tests

## Build Commands
```bash
npm test                           # run all tests (must pass before any claim of "done")
npx tsc --noEmit                   # TypeScript check
VITE_STATIC=true npx vite build --outDir /path/to/output  # file:// compatible build
```

## Key Rules
1. **Never claim done without running tests** — `npm test` must show all green
2. **Hash routing** — App uses `useHashLocation` from wouter. Navigation uses `#/path` format.
3. **SIMULATION_COMPONENTS** — Every `simulation.component` in content must be registered here
4. **summary_extended** — Every day must have it in `sections.summary_extended`

## Design System
Colors: `--color-primary: 14 92% 59%` (Coral), `--color-secondary: 207 100% 27%` (Deep Blue), `--color-accent: 43 97% 49%` (Gold)
Fonts: Fraunces (display), Heebo/Inter (sans), JetBrains Mono (mono)

## Available Skills
- `.claude/skills/control-systems/` — PID, Bode, Root Locus, State-Space workflows
- `.claude/skills/signal-processing/` — Z-transform, FFT, FIR/IIR workflows  
- `.claude/skills/engineering-solver/` — General engineering problem workflow
- `.claude/skills/eliaz-core/` — User profile and communication style
