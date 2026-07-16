import { useEffect, useRef, type ReactNode } from 'react';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';
import { fbm2 } from '@/lib/noise';
import { ChapterHead } from '@/components/ChapterHead';
import { Reveal } from '@/components/Reveal';

/* ------------------------------------------------------------------ */
/*  shared tile chrome                                                 */
/* ------------------------------------------------------------------ */

function Instrument({
  index,
  name,
  form,
  caption,
  children,
  reverse = false,
  action,
}: {
  index: string;
  name: string;
  form: string;
  caption: string;
  children: ReactNode;
  reverse?: boolean;
  action?: ReactNode;
}) {
  return (
    <Reveal>
      <article className={`instrument ${reverse ? 'instrument--reverse' : ''}`}>
        <div className="instrument__visual">{children}</div>
        <div className="instrument__copy">
          <span className="instrument__index">{index}</span>
          <p className="instrument__name">{name}</p>
          <h3>{form}</h3>
          <p>{caption}</p>
          {action}
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  MUSIC — pluckable ribbons                                          */
/* ------------------------------------------------------------------ */

let actx: AudioContext | null = null;
function pluck(fx: number) {
  try {
    actx ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (actx.state === 'suspended') void actx.resume();
    const scale = [0, 3, 5, 7, 10];
    const deg = Math.min(14, Math.floor(fx * 15));
    const semis = scale[deg % 5] + 12 * Math.floor(deg / 5);
    const f = 196 * Math.pow(2, semis / 12);
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    const t = actx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    o.connect(g).connect(actx.destination);
    o.start(t);
    o.stop(t + 1.7);
  } catch {
    /* audio unavailable — the ribbons still dance */
  }
}

function MusicCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stop = startCanvas2D(canvas, (ctx, w, h, t, p) => {
      ctx.clearRect(0, 0, w, h);
      const voices = [
        { col: 'rgba(232,179,106,0.9)', amp: 1.0, fq: 1.0, ph: 0 },
        { col: 'rgba(169,155,255,0.7)', amp: 0.7, fq: 1.6, ph: 2.1 },
        { col: 'rgba(111,224,195,0.55)', amp: 0.5, fq: 2.4, ph: 4.2 },
        { col: 'rgba(237,231,218,0.35)', amp: 0.35, fq: 3.2, ph: 1.3 },
      ];
      const px = p.active ? p.x / w : 0.5;
      const py = p.active ? p.y / h : 0.5;
      for (const v of voices) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const u = x / w;
          const env = Math.sin(u * Math.PI); // pinned ends
          const drive = 1 + Math.exp(-Math.pow((u - px) * 4, 2)) * 2.2;
          const y =
            h / 2 +
            Math.sin(u * 6.3 * v.fq + t * 2.2 + v.ph) *
              Math.sin(u * 2.1 * v.fq - t * 1.3) *
              26 *
              v.amp *
              env *
              drive *
              (0.5 + py);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = v.col;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      if (p.active) {
        ctx.fillStyle = 'rgba(237,231,218,0.8)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pluck((e.clientX - r.left) / r.width);
    };
    canvas.addEventListener('pointerdown', onDown);
    return () => {
      stop();
      canvas.removeEventListener('pointerdown', onDown);
    };
  }, []);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  ART — flow field                                                   */
/* ------------------------------------------------------------------ */

function FlowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let pts: { x: number; y: number; px: number; py: number; hue: number }[] = [];
    let seeded = false;
    const stop = startCanvas2D(canvas, (ctx, w, h, t, p) => {
      if (!seeded) {
        ctx.fillStyle = '#0a0a10';
        ctx.fillRect(0, 0, w, h);
        pts = Array.from({ length: isLiteExperience() ? 150 : 320 }, (_, i) => ({
          x: Math.random() * w,
          y: Math.random() * h,
          px: 0,
          py: 0,
          hue: [36, 258, 168, 340][i % 4],
        }));
        seeded = true;
      }
      ctx.fillStyle = 'rgba(10,10,16,0.055)';
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1.1;
      for (const pt of pts) {
        pt.px = pt.x;
        pt.py = pt.y;
        const a =
          fbm2(pt.x * 0.004, pt.y * 0.004 + t * 0.03) * Math.PI * 4 + t * 0.12;
        let vx = Math.cos(a) * 1.4;
        let vy = Math.sin(a) * 1.4;
        if (p.active) {
          const dx = p.x - pt.x;
          const dy = p.y - pt.y;
          const d = Math.hypot(dx, dy);
          if (d < 120 && d > 1) {
            vx += (dx / d) * 1.1;
            vy += (dy / d) * 1.1;
          }
        }
        pt.x += vx;
        pt.y += vy;
        if (pt.x < 0) pt.x += w;
        if (pt.x > w) pt.x -= w;
        if (pt.y < 0) pt.y += h;
        if (pt.y > h) pt.y -= h;
        if (Math.abs(pt.x - pt.px) < w / 2 && Math.abs(pt.y - pt.py) < h / 2) {
          ctx.strokeStyle = `hsla(${pt.hue + Math.sin(t * 0.3) * 20}, 70%, 68%, 0.5)`;
          ctx.beginPath();
          ctx.moveTo(pt.px, pt.py);
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
        }
      }
    });
    return stop;
  }, []);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  MATH — phyllotaxis                                                 */
/* ------------------------------------------------------------------ */

function PhylloCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stop = startCanvas2D(canvas, (ctx, w, h, t, p) => {
      ctx.fillStyle = 'rgba(10,10,16,0.28)';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const golden = 137.508 * (Math.PI / 180);
      const wob = p.active ? (p.x / w - 0.5) * 0.02 : 0;
      const maxN = isLiteExperience() ? 420 : 880;
      const c = (Math.min(w, h) / 2 - 12) / Math.sqrt(maxN);
      const n = Math.min(maxN, Math.floor(((t * 90) % (maxN + 260))));
      for (let i = 0; i < n; i++) {
        const a = i * (golden + wob) + t * 0.06;
        const r = c * Math.sqrt(i);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        const f = i / maxN;
        ctx.fillStyle =
          f < 0.5
            ? `rgba(232,179,106,${0.35 + f})`
            : `rgba(169,155,255,${0.4 + (1 - f) * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.8 + f * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    return stop;
  }, []);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  SCIENCE — plexus                                                   */
/* ------------------------------------------------------------------ */

function PlexusCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let nodes: { x: number; y: number; vx: number; vy: number; c: string }[] = [];
    let seeded = false;
    const stop = startCanvas2D(canvas, (ctx, w, h, _t, p) => {
      if (!seeded) {
        nodes = Array.from({ length: isLiteExperience() ? 28 : 52 }, (_, i) => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          c: i % 3 === 0 ? '#6fe0c3' : i % 3 === 1 ? '#a99bff' : '#e8b36a',
        }));
        seeded = true;
      }
      ctx.clearRect(0, 0, w, h);
      for (const nd of nodes) {
        if (p.active) {
          const dx = p.x - nd.x;
          const dy = p.y - nd.y;
          const d = Math.hypot(dx, dy);
          if (d < 140 && d > 1) {
            nd.vx += (dx / d) * 0.03;
            nd.vy += (dy / d) * 0.03;
          }
        }
        nd.vx = Math.max(-0.9, Math.min(0.9, nd.vx));
        nd.vy = Math.max(-0.9, Math.min(0.9, nd.vy));
        nd.x += nd.vx;
        nd.y += nd.vy;
        if (nd.x < 0 || nd.x > w) nd.vx *= -1;
        if (nd.y < 0 || nd.y > h) nd.vy *= -1;
        nd.x = Math.max(0, Math.min(w, nd.x));
        nd.y = Math.max(0, Math.min(h, nd.y));
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 95) {
            ctx.strokeStyle = `rgba(140,150,200,${(1 - d / 95) * 0.35})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const nd of nodes) {
        ctx.fillStyle = nd.c;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    return stop;
  }, []);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  NATURE — boids                                                     */
/* ------------------------------------------------------------------ */

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function FlockCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let boids: Boid[] = [];
    let seeded = false;
    const stop = startCanvas2D(canvas, (ctx, w, h, _t, p) => {
      if (!seeded) {
        boids = Array.from({ length: isLiteExperience() ? 34 : 64 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        }));
        seeded = true;
      }
      ctx.fillStyle = 'rgba(10,10,16,0.3)';
      ctx.fillRect(0, 0, w, h);

      for (const b of boids) {
        let ax = 0;
        let ay = 0;
        let cx = 0;
        let cy = 0;
        let cnt = 0;
        let sx = 0;
        let sy = 0;
        for (const o of boids) {
          if (o === b) continue;
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 2600) {
            cx += o.x;
            cy += o.y;
            ax += o.vx;
            ay += o.vy;
            cnt++;
            if (d2 < 500 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              sx -= dx / d;
              sy -= dy / d;
            }
          }
        }
        if (cnt > 0) {
          b.vx += (cx / cnt - b.x) * 0.0012 + (ax / cnt - b.vx) * 0.05 + sx * 0.06;
          b.vy += (cy / cnt - b.y) * 0.0012 + (ay / cnt - b.vy) * 0.05 + sy * 0.06;
        }
        if (p.active) {
          const dx = b.x - p.x;
          const dy = b.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 110 && d > 1) {
            const f = ((110 - d) / 110) * 0.9;
            b.vx += (dx / d) * f;
            b.vy += (dy / d) * f;
          }
        }
        const sp = Math.hypot(b.vx, b.vy);
        const max = 2.6;
        if (sp > max) {
          b.vx = (b.vx / sp) * max;
          b.vy = (b.vy / sp) * max;
        }
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -10) b.x += w + 20;
        if (b.x > w + 10) b.x -= w + 20;
        if (b.y < -10) b.y += h + 20;
        if (b.y > h + 10) b.y -= h + 20;

        const ang = Math.atan2(b.vy, b.vx);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(ang);
        ctx.fillStyle = 'rgba(111,224,195,0.85)';
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(-3.5, 2.4);
        ctx.lineTo(-3.5, -2.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    });
    return stop;
  }, []);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  chapter                                                            */
/* ------------------------------------------------------------------ */

export function FormsChapter() {
  return (
    <section id="forms" className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <ChapterHead
          title={
            <>
              Music. Art. Math.
              <br />
              Science. <em className="text-violet-glow">Nature.</em>
            </>
          }
          lede="The chatbox made intelligence look like a blinking cursor. But it was never a cursor — it is rhythm, flow, energy. Five small machines, each one a different accent of the same voice. Play them."
        />

        <div className="instrument-rack mt-16">
          <Instrument
            index="α"
            name="rhythm"
            form="Music"
            caption="Strings with pinned ends, driven by your hand. Tap — it plucks a note from a pentatonic scale. Intelligence you can hear."
            action={
              <button type="button" className="instrument__action" onClick={() => pluck(0.48)}>
                Play a note
              </button>
            }
          >
            <MusicCanvas />
          </Instrument>
          <Instrument
            index="β"
            name="flow"
            form="Art"
            caption="Three hundred brushes follow an invisible wind of noise. It never repeats. It never stops. It paints because that is what it does."
            reverse
          >
            <FlowCanvas />
          </Instrument>
          <Instrument
            index="γ"
            name="form"
            form="Math"
            caption="The golden angle — 137.508° — the same one sunflowers use to pack their seeds. Beauty with a proof attached."
          >
            <PhylloCanvas />
          </Instrument>
          <Instrument
            index="δ"
            name="signal"
            form="Science"
            caption="Nodes and edges, reaching for each other. Proteins fold, neurons wire, and somewhere in the connections, knowing happens."
            reverse
          >
            <PlexusCanvas />
          </Instrument>
          <Instrument
            index="ε"
            name="flock"
            form="Nature"
            caption="No leader. Three rules — separate, align, cohere — and a murmuration appears. Mind as something that emerges, not something installed."
          >
            <FlockCanvas />
          </Instrument>

          <Reveal>
            <div className="instrument-coda">
              <p className="font-serif-display text-3xl md:text-5xl leading-snug text-paper font-light">
                Intelligence comes in{' '}
                <em className="text-sand">all forms</em>. What it can do. What
                it can tell us.{' '}
                <em className="text-violet-glow">What it can make you feel.</em>
              </p>
              <p>
                Every canvas on this page is computed live, for you alone. None
                of it is footage. That is the point.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
