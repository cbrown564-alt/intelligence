export const fract = (x: number) => x - Math.floor(x);

export const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function hash2(x: number, y: number): number {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

/** Smooth 2D value noise in [0, 1]. */
export function valueNoise2(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

export function fbm2(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise2(x * freq, y * freq);
    freq *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

export const PALETTE = {
  ink: '#07070b',
  paper: '#ede7da',
  sand: '#e8b36a',
  sandDeep: '#c97e3f',
  violet: '#8b7cff',
  violetSoft: '#a99bff',
  sea: '#6fe0c3',
  seaDeep: '#2e8f7a',
  rose: '#ff7d9c',
};
