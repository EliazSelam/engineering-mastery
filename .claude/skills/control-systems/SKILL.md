---
name: control-systems
description: >
  Specialized skill for solving control systems problems — transfer functions, Laplace analysis, state-space representation, 
  root locus, Bode plots, Nyquist, stability analysis, PID design, frequency response, and compensator design. 
  Trigger whenever the user mentions: בקרה, transfer function, pole, zero, stability, Bode, root locus, Routh-Hurwitz, 
  state-space, controllability, observability, PID, phase margin, gain margin, compensator, closed-loop, open-loop, 
  Nyquist, מערכת בקרה, פולוס, אפס, יציבות, מרווח פאזה, or similar control theory topics. 
---

# CONTROL SYSTEMS SKILL

## Problem-Solving Workflow
Every control problem follows this exact sequence:

**1. PROBLEM** — What is given? What is asked?
- Identify the plant G(s), controller C(s), feedback H(s)
- Clarify open-loop vs. closed-loop
- State what needs to be found

**2. METHOD** — Choose the appropriate tool:

| Goal | Tool |
|------|------|
| Stability check | Routh-Hurwitz, Nyquist criterion |
| Frequency response | Bode plot (magnitude + phase) |
| Transient response | Poles location, damping ratio ζ |
| Controller design | Root locus, frequency domain specs |
| State feedback | Pole placement, LQR |
| Observability/controllability | Gramians, rank of [B AB A²B...] |

**3. CALCULATION** — Full derivations required
- Show every algebraic step
- Define: ωn (natural frequency), ζ (damping ratio), τ (time constant)
- Use standard forms: 2nd order → H(s) = ωn²/(s² + 2ζωns + ωn²)

**4. VALIDATION** — Always sanity-check:
- Poles in LHP → stable? ✅
- Phase margin > 45°? → good stability margin
- DC gain matches steady-state requirement?
- Step response settling time ≈ 4/σ = 4/(ζωn)?

**5. CONCLUSION** — Compact, actionable answer

## Key Formulas Reference

### Time Domain
- Settling time (2%): Ts ≈ 4/(ζωn)
- Rise time: Tr ≈ 1.8/ωn (for ζ < 1)
- Overshoot: %OS = 100·exp(-πζ/√(1-ζ²))
- Steady-state error: ess = 1/(1 + Kp) for type-0, 0 for type-1+ (step)

### Frequency Domain
- Phase Margin: PM = 180° + ∠G(jωgc) at gain crossover
- Gain Margin: GM = -|G(jωpc)|dB at phase crossover
- Bandwidth: ω_BW where |T(jω)| drops to -3dB

### State-Space
- Ẋ = AX + Bu, Y = CX + Du
- Controllability: rank([B, AB, A²B, ..., Aⁿ⁻¹B]) = n
- Observability: rank([C; CA; CA²; ..., CAⁿ⁻¹]) = n
- Characteristic equation: det(sI - A) = 0

## MATLAB Quick Patterns
```matlab
G = tf([num], [den]);
sys = ss(A, B, C, D);
step(G); grid on;
bode(G); margin(G);
rlocus(G);
K = place(A, B, desired_poles);
[Gm, Pm, Wgm, Wpm] = margin(G);
```

## Output Format
- Axes labels in English, all explanations in Hebrew
- Table of results: poles, margins, specs
- Conclude with: system is [stable/unstable], PM = X°, meets spec? [yes/no]
