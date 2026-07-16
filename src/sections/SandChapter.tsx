import { useEffect, useRef } from 'react';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';
import { ChapterHead } from '@/components/ChapterHead';
import { Reveal } from '@/components/Reveal';
import { Footnote } from '@/components/References';

interface Trace {
  pts: { x: number; y: number }[];
  len: number;
  seg: number[];
}

interface Pulse {
  trace: number;
  d: number;
  speed: number;
  color: string;
}

export function SandChapter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let traces: Trace[] = [];
    let pulses: Pulse[] = [];
    let grains: { x: number; y: number; s: number; v: number }[] = [];
    let bw = 0;
    let bh = 0;

    const build = (w: number, h: number) => {
      bw = w;
      bh = h;
      traces = [];
      const cell = 36;
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      for (let i = 0; i < (isLiteExperience() ? 16 : 30); i++) {
        let x = (Math.random() * cols) | 0;
        let y = (Math.random() * rows) | 0;
        let dx = Math.random() < 0.5 ? 1 : -1;
        let dy = 0;
        const pts = [{ x: x * cell, y: y * cell }];
        const segs: number[] = [];
        let len = 0;
        const steps = 5 + ((Math.random() * 12) | 0);
        for (let s = 0; s < steps; s++) {
          const run = 1 + ((Math.random() * 4) | 0);
          const nx = Math.max(0, Math.min(cols, x + dx * run));
          const ny = Math.max(0, Math.min(rows, y + dy * run));
          const px = nx * cell;
          const py = ny * cell;
          const last = pts[pts.length - 1];
          const sl = Math.hypot(px - last.x, py - last.y);
          len += sl;
          segs.push(sl);
          pts.push({ x: px, y: py });
          x = nx;
          y = ny;
          if (Math.random() < 0.7) {
            if (dx !== 0) {
              dx = 0;
              dy = Math.random() < 0.5 ? 1 : -1;
            } else {
              dy = 0;
              dx = Math.random() < 0.5 ? 1 : -1;
            }
          }
        }
        traces.push({ pts, len, seg: segs });
      }
      pulses = Array.from({ length: isLiteExperience() ? 22 : 42 }, () => ({
        trace: (Math.random() * traces.length) | 0,
        d: Math.random() * 600,
        speed: 60 + Math.random() * 140,
        color: Math.random() < 0.6 ? '#e8b36a' : '#a99bff',
      }));
      grains = Array.from({ length: isLiteExperience() ? 80 : 160 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: 0.5 + Math.random() * 1.2,
        v: 4 + Math.random() * 9,
      }));
    };

    const stop = startCanvas2D(canvas, (ctx, w, h, t, p) => {
      if (Math.abs(w - bw) > 40 || Math.abs(h - bh) > 40 || traces.length === 0) {
        build(w, h);
      }
      ctx.clearRect(0, 0, w, h);

      // falling sand
      ctx.fillStyle = 'rgba(232,179,106,0.28)';
      for (const g of grains) {
        g.y += g.v * 0.016;
        g.x += Math.sin(t * 0.6 + g.y * 0.02) * 0.15;
        if (g.y > h) {
          g.y = -4;
          g.x = Math.random() * w;
        }
        ctx.fillRect(g.x, g.y, g.s, g.s);
      }

      // traces
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(140,132,220,0.14)';
      for (const tr of traces) {
        ctx.beginPath();
        ctx.moveTo(tr.pts[0].x, tr.pts[0].y);
        for (let i = 1; i < tr.pts.length; i++) ctx.lineTo(tr.pts[i].x, tr.pts[i].y);
        ctx.stroke();
        // node pads
        ctx.fillStyle = 'rgba(169,155,255,0.25)';
        ctx.fillRect(tr.pts[0].x - 1.5, tr.pts[0].y - 1.5, 3, 3);
        const last = tr.pts[tr.pts.length - 1];
        ctx.fillRect(last.x - 1.5, last.y - 1.5, 3, 3);
        ctx.fillStyle = 'rgba(232,179,106,0.28)';
      }

      // pulses
      for (const pu of pulses) {
        const tr = traces[pu.trace];
        pu.d += pu.speed * 0.016;
        if (pu.d > tr.len) {
          pu.d = 0;
          pu.trace = (Math.random() * traces.length) | 0;
          continue;
        }
        // locate point along polyline
        let rem = pu.d;
        let i = 0;
        while (i < tr.seg.length && rem > tr.seg[i]) {
          rem -= tr.seg[i];
          i++;
        }
        if (i >= tr.seg.length) continue;
        const a = tr.pts[i];
        const b = tr.pts[i + 1];
        const f = tr.seg[i] === 0 ? 0 : rem / tr.seg[i];
        const x = a.x + (b.x - a.x) * f;
        const y = a.y + (b.y - a.y) * f;
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = pu.color;
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // pointer excites nearby pulses: draw a faint field ring
      if (p.active) {
        ctx.strokeStyle = 'rgba(232,179,106,0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 46 + Math.sin(t * 3) * 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    return stop;
  }, []);

  return (
    <section id="silicon" className="relative bg-ink-2 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pt-28 md:pt-36">
        <ChapterHead
          title={
            <>
              Teaching <em className="text-violet-glow">sand</em> how to think.
            </>
          }
          lede={
            <>
              Quartz is silica. Industrial processing turns silica-bearing rock into
              silicon metal, and a small share is refined to the purity required by
              semiconductors.<Footnote reference="ref-silicon" /> Every pulse below
              turns that material history into a metaphor: a signal moving through a
              shape we built.
            </>
          }
        />
      </div>

      <div className="relative h-[60vh] md:h-[70vh] mt-6">
        <canvas ref={canvasRef} className="canvas-cover touch-pan" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <Reveal>
            <p className="font-serif-display text-center text-paper/90 text-3xl md:text-5xl font-light italic leading-snug max-w-3xl glow-violet">
              We refined a mineral into a machine,
              <span className="text-sand"> then taught the machine to answer.</span>
            </p>
            <p className="mt-6 text-center font-mono-label text-xs tracking-[0.12em] uppercase text-paper/65">
              metaphor, not material shorthand · see source 01
            </p>
          </Reveal>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="max-w-xl text-sm leading-relaxed text-paper/70 font-light">
            And if sand can learn to think, what else could? Light, maybe.
            DNA. <span className="text-sea">Chemistry itself</span> — which is
            where we go next.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
