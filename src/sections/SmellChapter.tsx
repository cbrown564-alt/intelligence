import { useEffect, useRef, useState } from 'react';
import { ChapterHead } from '@/components/ChapterHead';
import { ChapterTradeoff } from '@/components/ChapterTradeoff';
import { Reveal } from '@/components/Reveal';
import { CHAPTER_BY_ID } from '@/content/chapters';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';
import { fbm2 } from '@/lib/noise';

interface Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  trace: 0 | 1;
}

const TRACE_COLORS = [
  [134, 228, 202],
  [232, 179, 106],
] as const;

export function SmellChapter() {
  const chapter = CHAPTER_BY_ID.scent;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const comparisonRef = useRef(false);
  const [comparison, setComparison] = useState(false);

  useEffect(() => {
    comparisonRef.current = comparison;
  }, [comparison]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let molecules: Molecule[] = [];
    const stop = startCanvas2D(canvas, (ctx, w, h, t, pointer) => {
      ctx.fillStyle = 'rgba(8,10,12,0.18)';
      ctx.fillRect(0, 0, w, h);

      const emitters = [
        { x: w * 0.13, y: h * 0.36, trace: 0 as const },
        { x: w * 0.13, y: h * 0.7, trace: 1 as const },
      ];
      for (const emitter of emitters) {
        const visibleColor = comparisonRef.current
          ? TRACE_COLORS[emitter.trace]
          : TRACE_COLORS[0];
        const glow = ctx.createRadialGradient(
          emitter.x,
          emitter.y,
          0,
          emitter.x,
          emitter.y,
          72
        );
        glow.addColorStop(0, `rgba(${visibleColor.join(',')},0.2)`);
        glow.addColorStop(1, `rgba(${visibleColor.join(',')},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(emitter.x, emitter.y, 72, 0, Math.PI * 2);
        ctx.fill();

        for (let index = 0; index < 3; index += 1) {
          if (molecules.length >= (isLiteExperience() ? 260 : 620)) break;
          molecules.push({
            x: emitter.x + (Math.random() - 0.5) * 12,
            y: emitter.y + (Math.random() - 0.5) * 12,
            vx: 0.65 + Math.random() * 0.75,
            vy: (Math.random() - 0.5) * 0.35,
            life: 0,
            maxLife: 7 + Math.random() * 6,
            size: 1 + Math.random() * 2.2,
            trace: emitter.trace,
          });
        }
      }

      molecules = molecules.filter((molecule) =>
        molecule.life < molecule.maxLife && molecule.x < w + 24
      );
      for (const molecule of molecules) {
        molecule.life += 0.016;
        const crossingPull = (h * 0.53 - molecule.y) * 0.00075;
        const current = fbm2(
          molecule.x * 0.0035,
          molecule.y * 0.0035 + t * 0.02
        ) * Math.PI * 4;
        molecule.vx += Math.cos(current) * 0.11 + 0.02;
        molecule.vy += Math.sin(current) * 0.1 + crossingPull;

        if (pointer.active) {
          const dx = molecule.x - pointer.x;
          const dy = molecule.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 150 && distance > 1) {
            const force = ((150 - distance) / 150) * 0.85;
            molecule.vx += (-dy / distance) * force;
            molecule.vy += (dx / distance) * force;
          }
        }

        molecule.vx *= 0.986;
        molecule.vy *= 0.986;
        molecule.x += molecule.vx;
        molecule.y += molecule.vy;

        const fade = molecule.life < 1
          ? molecule.life
          : Math.max(0, 1 - (molecule.life - (molecule.maxLife - 2)) / 2);
        const color = comparisonRef.current
          ? TRACE_COLORS[molecule.trace]
          : TRACE_COLORS[0];
        ctx.fillStyle = `rgba(${color.join(',')},${fade * 0.68})`;
        ctx.beginPath();
        ctx.arc(molecule.x, molecule.y, molecule.size, 0, Math.PI * 2);
        ctx.fill();
      }

      const sensorX = w * 0.88;
      ctx.strokeStyle = comparisonRef.current
        ? 'rgba(237,231,218,0.78)'
        : 'rgba(134,228,202,0.72)';
      ctx.lineWidth = comparisonRef.current ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(sensorX, h * 0.22);
      ctx.lineTo(sensorX, h * 0.82);
      ctx.stroke();
      if (comparisonRef.current) {
        ctx.strokeStyle = 'rgba(232,179,106,0.72)';
        ctx.beginPath();
        ctx.moveTo(sensorX + 12, h * 0.22);
        ctx.lineTo(sensorX + 12, h * 0.82);
        ctx.stroke();
      }
    });

    return stop;
  }, []);

  return (
    <section id="scent" className="scent-chapter relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pt-28 md:pt-36">
        <ChapterHead
          title={
            <>
              What can a machine <em className="text-sea">smell</em>?
            </>
          }
          lede="Two chemical traces cross in the air. A single receptor reports one source with confidence. Compare another channel to find what the first reading merged."
        />
      </div>

      <div className="scent-field relative mt-8 h-[58vh] md:h-[64vh]">
        <canvas ref={canvasRef} className="canvas-cover touch-pan" aria-hidden="true" />
        <div className="scent-reading" aria-live="polite">
          <span>{comparison ? 'Two-channel comparison' : 'Single-channel reading'}</span>
          <strong>
            {comparison ? 'Two traces are crossing' : 'One source detected'}
          </strong>
          <p>
            {comparison
              ? 'The first reading merged signals that this comparison separates.'
              : 'High confidence. Incomplete interpretation.'}
          </p>
        </div>
        <p className="scent-field__cue">Pointer: stir the crossing plumes</p>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal>
          <div className="scent-analysis">
            <div>
              <p>
                The first receptor responds to a molecule shared by both traces. Its
                reading is real, but its conclusion is wrong. A second channel reveals
                the mixture.
              </p>
              <button
                type="button"
                className="scent-analysis__action"
                aria-pressed={comparison}
                onClick={() => setComparison((value) => !value)}
              >
                {comparison ? 'Return to the first reading' : 'Compare a second channel'}
              </button>
            </div>
            <ChapterTradeoff
              capability={chapter.capability}
              blindSpot={chapter.blindSpot}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
