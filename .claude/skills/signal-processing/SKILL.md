---
name: signal-processing
description: >
  Specialized skill for digital and analog signal processing problems — Z-transform, DFT/FFT, FIR/IIR filter design, 
  sampling theory, Fourier analysis, convolution, frequency spectrum analysis, and discrete-time systems.
---

# SIGNAL PROCESSING SKILL

## Problem-Solving Workflow

**1. PROBLEM** — Identify the system type:
- Continuous-time (CT) or Discrete-time (DT)?
- Analysis or Synthesis?

**2. METHOD** — Choose the domain/tool:

| Task | Tool |
|----------|-----|
| System analysis (DT) | Z-transform |
| Frequency analysis | DTFT / DFT / FFT |
| Filter design | FIR or IIR design |
| Sampling | Nyquist-Shannon theorem |
| Stability (DT) | Poles inside unit circle |

**3. CALCULATION** — Full derivations:
- Show ROC for Z-transform, pole-zero maps, frequency response

**4. VALIDATION**
- BIBO stable: all poles inside unit circle |z| < 1
- Nyquist: fs > 2·fmax

## Key Formulas

### Z-Transform
- X(z) = Σ x[n]·z⁻ⁿ
- Convolution: Y(z) = X(z)·H(z)

### DFT / FFT
- X[k] = Σₙ x[n]·e^(-j2πkn/N)
- Δf = fs/N

### FIR vs IIR
| Property | FIR | IIR |
|----------|-----|-----|
| Stability | Always | Conditional |
| Phase | Linear | Non-linear |
| Order | Higher | Lower |

## MATLAB
```matlab
b = fir1(order, Wn, 'low');
[b, a] = butter(order, Wn, 'low');
X = fft(x); f = (0:N-1)*(fs/N);
```

## Python
```python
from scipy import signal
b = signal.firwin(numtaps, cutoff, fs=fs)
b, a = signal.butter(order, cutoff, btype='low', fs=fs)
```
