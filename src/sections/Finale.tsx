import { useEffect, useRef } from 'react';
import { Reveal } from '@/components/Reveal';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';

interface Glint {
  offset: number;
  progress: number;
  speed: number;
  size: number;
  phase: number;
  color: string;
}

const COLORS = ['#e8b36a', '#b8adff', '#ede7da', '#86e4ca'];
const LEDGER = [
  ['Contour', 'boundary', 'history'],
  ['Force', 'response', 'cause'],
  ['Instrument', 'pattern', 'remainder'],
  ['Chemical trace', 'presence', 'source'],
  ['Structure', 'order', 'pieces'],
] as const;

export function Finale() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let glints: Glint[] = [];
    let seeded = false;
    const stop = startCanvas2D(canvas, (ctx, w, h, t) => {
      if (!seeded) {
        glints = Array.from({ length: isLiteExperience() ? 72 : 150 }, () => ({
          offset: Math.random() * 2 - 1,
          progress: Math.random(),
          speed: 0.018 + Math.random() * 0.035,
          size: 0.55 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
          color: COLORS[(Math.random() * COLORS.length) | 0],
        }));
        seeded = true;
      }

      ctx.fillStyle = 'rgba(7,7,11,0.2)';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const horizon = h * 0.72;
      const spread = Math.min(w * 0.18, 170);

      const beam = ctx.createLinearGradient(cx - spread, 0, cx + spread, 0);
      beam.addColorStop(0, 'rgba(237,231,218,0)');
      beam.addColorStop(0.42, 'rgba(184,173,255,0.03)');
      beam.addColorStop(0.5, 'rgba(237,231,218,0.11)');
      beam.addColorStop(0.58, 'rgba(232,179,106,0.03)');
      beam.addColorStop(1, 'rgba(237,231,218,0)');
      ctx.fillStyle = beam;
      ctx.fillRect(cx - spread, h * 0.08, spread * 2, horizon - h * 0.08);

      const horizonGradient = ctx.createLinearGradient(w * 0.16, 0, w * 0.84, 0);
      horizonGradient.addColorStop(0, 'rgba(237,231,218,0)');
      horizonGradient.addColorStop(0.5, 'rgba(232,179,106,0.34)');
      horizonGradient.addColorStop(1, 'rgba(237,231,218,0)');
      ctx.strokeStyle = horizonGradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.16, horizon);
      ctx.lineTo(w * 0.84, horizon);
      ctx.stroke();

      ctx.globalCompositeOperation = 'lighter';
      for (const glint of glints) {
        const progress = (glint.progress + t * glint.speed) % 1;
        const taper = Math.sin(progress * Math.PI);
        const x = cx + glint.offset * spread * taper * 0.65 + Math.sin(t + glint.phase) * 2;
        const y = horizon - progress * h * 0.58;
        const alpha = Math.sin(progress * Math.PI) * 0.52;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = glint.color;
        ctx.beginPath();
        ctx.arc(x, y, glint.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    });

    return stop;
  }, []);

  return (
    <section id="vision" className="vision-chapter relative overflow-hidden bg-ink">
      <div className="vision-chapter__stage relative min-h-[100svh]">
        <canvas ref={canvasRef} className="canvas-cover" aria-hidden="true" />
        <div className="finale-copy pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 py-28 text-center">
          <Reveal delay={120}>
            <h2 className="font-serif-display text-paper font-light">
              Every interface is <em className="text-sand">a partial view</em>.
            </h2>
          </Reveal>
          <Reveal delay={260}>
            <p className="vision-chapter__lede">
              Each encounter brought one quality forward and let another fall away.
              The comparison is the conclusion, not a complete picture.
            </p>
          </Reveal>
          <Reveal delay={380}>
            <ul className="vision-ledger" aria-label="What each encounter reveals and obscures">
              {LEDGER.map(([encounter, reveals, obscures]) => (
                <li key={encounter}>
                  <strong>{encounter}</strong>
                  <span>reveals {reveals}</span>
                  <span>obscures {obscures}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={520}>
            <p className="vision-chapter__claim">
              Change the encounter and a different machine comes into view.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="vision-coda relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <p className="font-serif-display text-2xl font-light text-paper md:text-4xl">
            So—what is the shape of intelligence?
          </p>
          <p className="font-serif-display text-2xl font-light text-sand md:text-4xl">
            Whatever shape we give the encounter.
          </p>
          <a href="#shape" className="vision-coda__again">
            Experience it again
          </a>
        </div>
      </div>
    </section>
  );
}
