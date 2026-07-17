import { useEffect, useRef } from 'react';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';
import { ChapterHead } from '@/components/ChapterHead';
import { ChapterTradeoff } from '@/components/ChapterTradeoff';
import { Reveal } from '@/components/Reveal';
import { CHAPTER_BY_ID } from '@/content/chapters';

interface Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
}

const COLORS = ['#e8b36a', '#e8b36a', '#ede7da', '#a99bff', '#a99bff', '#6fe0c3'];

export function TouchChapter() {
  const chapter = CHAPTER_BY_ID.touch;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let grains: Grain[] = [];
    let built = false;
    let stop: (() => void) | null = null;

    const build = (w: number, h: number) => {
      const off = document.createElement('canvas');
      const scale = isLiteExperience() ? 0.36 : 0.5;
      off.width = Math.max(1, Math.round(w * scale));
      off.height = Math.max(1, Math.round(h * scale));
      const octx = off.getContext('2d');
      if (!octx) return;
      octx.fillStyle = '#fff';
      const fontSize = Math.min(w * 0.16, h * 0.3) * scale;
      octx.font = `italic 500 ${fontSize}px Petrona, Georgia, serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText('touch it', off.width / 2, off.height / 2);

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const next: Grain[] = [];
      const step = Math.max(2, Math.round((isLiteExperience() ? 4 : 3) * scale));
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 128) {
            next.push({
              x: Math.random() * w,
              y: Math.random() * h,
              vx: 0,
              vy: 0,
              tx: x / scale,
              ty: y / scale,
              size: 0.8 + Math.random() * 1.6,
              color: COLORS[(Math.random() * COLORS.length) | 0],
            });
          }
        }
      }
      grains = next;
      built = true;
    };

    const boot = () => {
      stop = startCanvas2D(canvas, (ctx, w, h, _t, p) => {
        if (!built) build(w, h);
        ctx.clearRect(0, 0, w, h);

        const radius = p.down ? 130 : 90;
        const r2 = radius * radius;
        for (const g of grains) {
          // spring home
          g.vx += (g.tx - g.x) * 0.012;
          g.vy += (g.ty - g.y) * 0.012;
          // pointer burst
          if (p.active) {
            const dx = g.x - p.x;
            const dy = g.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = ((radius - d) / radius) * (p.down ? 2.6 : 1.7);
              g.vx += (dx / d) * f;
              g.vy += (dy / d) * f;
            }
          }
          g.vx *= 0.9;
          g.vy *= 0.9;
          g.x += g.vx;
          g.y += g.vy;

          const speed = Math.min(1, (Math.abs(g.vx) + Math.abs(g.vy)) * 0.15);
          ctx.globalAlpha = 0.55 + speed * 0.45;
          ctx.fillStyle = g.color;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size + speed * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
    };

    if (document.fonts?.load) {
      Promise.all([
        document.fonts.load('italic 500 100px Petrona'),
        document.fonts.ready,
      ])
        .then(boot)
        .catch(boot);
    } else {
      boot();
    }

    return () => {
      stop?.();
    };
  }, []);

  return (
    <section id="touch" className="relative bg-ink-2 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pt-28 md:pt-36">
        <ChapterHead
          title={
            <>
              Can we <em className="text-sand">touch</em> it?
          </>
          }
          lede="Move through the word below. Its grains scatter, carry your momentum, and find one another again. The word survives by coming apart."
        />
      </div>

      <div className="relative h-[52vh] md:h-[62vh] mt-4">
        <canvas
          ref={canvasRef}
          className="canvas-cover touch-pan cursor-crosshair"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute bottom-5 right-6 flex items-center gap-3">
          <span className="h-px w-10 bg-sand/40" />
          <span className="font-mono-label text-xs tracking-[0.12em] text-paper/70 uppercase">
            drag through it
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-28 md:pb-36">
        <Reveal>
          <p className="max-w-xl text-sm leading-relaxed text-paper/70 font-light">
            No grain holds the word. Each knows only where it is and where it is
            going. Together, the scattered pieces keep finding{' '}
            <span className="text-sand">their way back</span>.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <ChapterTradeoff
            capability={chapter.capability}
            blindSpot={chapter.blindSpot}
          />
        </Reveal>
      </div>
    </section>
  );
}
