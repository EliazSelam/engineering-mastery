/**
 * Basic complex number type
 */
export interface Complex {
  re: number;
  im: number;
}

/**
 * Calculates Magnitude in dB
 */
export const magnitudeDb = (c: Complex): number => {
  const mag = Math.sqrt(c.re * c.re + c.im * c.im);
  return 20 * Math.log10(mag);
};

/**
 * Calculates Phase in degrees
 */
export const phaseDeg = (c: Complex): number => {
  return (Math.atan2(c.im, c.re) * 180) / Math.PI;
};

/**
 * Evaluates a 1st-order Low-Pass Transfer Function G(s) = K * wc / (s + wc) at s = jw
 */
export const evaluate1stOrderLP = (w: number, K: number, wc: number): Complex => {
  // G(jw) = K*wc / (jw + wc)
  // Multiply by (wc - jw) / (wc - jw)
  // G(jw) = K*wc * (wc - jw) / (wc^2 + w^2)
  const denom = wc * wc + w * w;
  return {
    re: (K * wc * wc) / denom,
    im: (-K * wc * w) / denom
  };
};

/**
 * Evaluates a 2nd-order Transfer Function G(s) = K * wc^2 / (s^2 + 2*zeta*wc*s + wc^2) at s = jw
 */
export const evaluate2ndOrder = (w: number, K: number, wc: number, zeta: number): Complex => {
  // G(jw) = K * wc^2 / ((wc^2 - w^2) + j * (2 * zeta * wc * w))
  const realDenom = wc * wc - w * w;
  const imagDenom = 2 * zeta * wc * w;
  const denomSq = realDenom * realDenom + imagDenom * imagDenom;
  
  return {
    re: (K * wc * wc * realDenom) / denomSq,
    im: (-K * wc * wc * imagDenom) / denomSq
  };
};

/**
 * Evaluates G(s) = K * (s + z) / ((s + p1)(s + p2)) at s = jw
 */
export const evaluateCustom2P1Z = (w: number, K: number, z: number, p1: number, p2: number): Complex => {
  // Num: K * (jw + z)
  const numRe = K * z;
  const numIm = K * w;

  // Denom: (jw + p1)(jw + p2) = (p1*p2 - w^2) + j * w*(p1+p2)
  const denRe = p1 * p2 - w * w;
  const denIm = w * (p1 + p2);

  const denSq = denRe * denRe + denIm * denIm;
  
  return {
    re: (numRe * denRe + numIm * denIm) / denSq,
    im: (numIm * denRe - numRe * denIm) / denSq
  };
};
