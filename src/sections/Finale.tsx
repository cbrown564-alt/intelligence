import { useEffect, useRef } from 'react';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';
import { Reveal } from '@/components/Reveal';

interface Mote {
  a: number;
  r: number;
  speed: number;
  fall: number;
  size: number;
  color: string;
}

const COLORS = ['#e8b36a', '#e8b36a', '#a99bff', '#ede7da', '#6fe0c3'];

export function Finale() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let motes: Mote[] = [];
    let seeded = false;

    const stop = startCanvas2D(canvas, (ctx, w, h, t, p) => {
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(w, h) / 2;

      if (!seeded) {
        motes = Array.from({ length: isLiteExperience() ? 380 : 900 }, () => ({
          a: Math.random() * Math.PI * 2,
          r: maxR * (0.25 + Math.random() * 0.9),
          speed: 0.0015 + Math.random() * 0.004,
          fall: 0.14 + Math.random() * 0.5,
          size: 0.6 + Math.random() * 1.7,
          color: COLORS[(Math.random() * COLORS.length) | 0],
        }));
        seeded = true;
      }

      ctx.fillStyle = 'rgba(7,7,11,0.14)';
      ctx.fillRect(0, 0, w, h);

      // core glow
      const pulse = 1 + Math.sin(t * 1.4) * 0.12;
      const coreR = Math.min(w, h) * 0.09 * pulse;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
      grad.addColorStop(0, 'rgba(237,231,218,0.5)');
      grad.addColorStop(0.25, 'rgba(232,179,106,0.22)');
      grad.addColorStop(0.6, 'rgba(139,124,255,0.08)');
      grad.addColorStop(1, 'rgba(139,124,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // pointer becomes a small second sun
      if (p.active) {
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 70);
        pg.addColorStop(0, 'rgba(111,224,195,0.25)');
        pg.addColorStop(1, 'rgba(111,224,195,0)');
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 70, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const m of motes) {
        m.a += m.speed * (40 / Math.max(20, m.r)) * 16;
        m.r -= m.fall;
        // gentle attraction to pointer
        let x = cx + Math.cos(m.a) * m.r;
        let y = cy + Math.sin(m.a) * m.r * 0.72;
        if (p.active) {
          const dx = p.x - x;
          const dy = p.y - y;
          const d = Math.hypot(dx, dy);
          if (d < 160 && d > 1) {
            x += (dx / d) * 1.2;
            y += (dy / d) * 1.2;
          }
        }
        if (m.r < coreR * 0.5) {
          m.r = maxR * (0.8 + Math.random() * 0.4);
          m.a = Math.random() * Math.PI * 2;
          continue;
        }
        const fade = Math.min(1, (maxR * 1.15 - m.r) / (maxR * 0.3));
        ctx.globalAlpha = 0.25 + fade * 0.65;
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(x, y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    return stop;
  }, []);

  return (
    <section id="vision" className="relative bg-ink overflow-hidden">
      <div className="relative h-[100svh]">
        <canvas ref={canvasRef} className="canvas-cover touch-pan" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Reveal delay={150}>
            <h2 className="font-serif-display text-paper font-light leading-[1.05] text-5xl md:text-7xl max-w-4xl">
              We need a <em className="text-sand glow-sand">clear vision</em>.
            </h2>
          </Reveal>
          <Reveal delay={450}>
            <h2 className="font-serif-display text-paper font-light leading-[1.05] text-5xl md:text-7xl max-w-4xl mt-3">
              We need <em className="text-violet-glow glow-violet">inspiration</em>.
            </h2>
          </Reveal>
          <Reveal delay={800}>
            <p className="mt-12 max-w-md text-sm md:text-base leading-relaxed text-paper/75 font-light">
              Not another chatbox. Not another demo. A way of meeting this mind
              that is tactile, visual, musical — worthy of the fact that we
              taught sand to think, and it answered.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col items-center gap-8 text-center">
          <Reveal>
            <p className="font-serif-display italic text-2xl md:text-4xl text-paper font-light">
              So — what is the shape of intelligence?
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="font-serif-display text-2xl md:text-4xl font-light text-sand glow-sand">
              Whatever we dare to give it.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-6 flex flex-col items-center gap-3">
              <span className="h-px w-24 bg-white/10" />
              <p className="font-mono-label text-xs tracking-[0.12em] uppercase text-paper/65">
                the shape of intelligence · a visual essay
              </p>
              <p className="font-mono-label text-xs tracking-[0.12em] uppercase text-paper/65">
                particles · waveforms · phyllotaxis · boids · sand
              </p>
              <a
                href="#shape"
                className="pointer-events-auto mt-4 font-mono-label text-[0.62rem] tracking-[0.3em] uppercase text-sand/70 hover:text-sand transition-colors"
              >
                ↺ experience it again
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
