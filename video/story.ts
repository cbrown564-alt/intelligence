export const TAU = Math.PI * 2;

export const COLOR = {
  ink: '#06050a',
  paper: '#f4efe5',
  sand: '#e8a24d',
  sandLight: '#ffd38a',
  water: '#1c7180',
  waterLight: '#69d8cf',
  silicon: '#8da8b7',
  siliconDark: '#182733',
  laser: '#ff547e',
  electricity: '#9f8cff',
  electricityLight: '#d4caff',
  biology: '#ff8c69',
  biologyLight: '#ffd0a6',
  chemical: '#62e7ca',
  chemicalDark: '#176b61',
} as const;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function smooth(value: number) {
  const x = clamp01(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function progress(frame: number, start: number, end: number) {
  return smooth((frame - start) / (end - start));
}

export function windowOpacity(frame: number, start: number, end: number, edge = 24) {
  return Math.min(progress(frame, start, start + edge), 1 - progress(frame, end - edge, end));
}

export function fract(value: number) {
  return value - Math.floor(value);
}

export function seeded(index: number, salt: number) {
  return fract(Math.sin(index * 91.73 + salt * 17.31) * 43758.5453);
}

export function lerp(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

export interface Point {
  x: number;
  y: number;
}

export function cubicBezier(a: Point, b: Point, c: Point, d: Point, amount: number): Point {
  const t = clamp01(amount);
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
}
