import { useEffect, useRef, useState, type ReactNode } from 'react';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';
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
/*  ART — interpretation                                               */
/* ------------------------------------------------------------------ */

function InterpretationCanvas({ revision }: { revision: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    type Point = { x: number; y: number };
    let userGesture: Point[] = [];
    let drawing = false;
    const phase = revision * 1.731 + 0.64;

    const appendGesturePoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const last = userGesture[userGesture.length - 1];
      if (!last || Math.hypot(point.x - last.x, point.y - last.y) > 4) {
        userGesture.push(point);
        if (userGesture.length > 140) userGesture.shift();
      }
    };
    const onGestureStart = (event: PointerEvent) => {
      drawing = true;
      userGesture = [];
      appendGesturePoint(event);
    };
    const onGestureMove = (event: PointerEvent) => {
      if (drawing) appendGesturePoint(event);
    };
    const onGestureEnd = () => {
      drawing = false;
    };
    canvas.addEventListener('pointerdown', onGestureStart);
    canvas.addEventListener('pointermove', onGestureMove);
    canvas.addEventListener('pointerleave', onGestureEnd);
    window.addEventListener('pointerup', onGestureEnd);

    const strokePath = (
      ctx: CanvasRenderingContext2D,
      points: Point[],
      end: number,
      color: string,
      width: number
    ) => {
      if (end < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < end - 1; index++) {
        const point = points[index];
        const next = points[index + 1];
        ctx.quadraticCurveTo(
          point.x,
          point.y,
          (point.x + next.x) / 2,
          (point.y + next.y) / 2
        );
      }
      ctx.lineTo(points[end - 1].x, points[end - 1].y);
      ctx.stroke();
    };

    const stop = startCanvas2D(canvas, (ctx, w, h, t) => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#08080e';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const size = Math.min(w, h);
      const wash = ctx.createRadialGradient(cx, cy, size * 0.04, cx, cy, size * 0.55);
      wash.addColorStop(0, 'rgba(184,173,255,0.08)');
      wash.addColorStop(0.52, 'rgba(134,228,202,0.025)');
      wash.addColorStop(1, 'rgba(8,8,14,0)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      const pointCount = isLiteExperience() ? 110 : 180;
      const centers: Point[] = [];
      const left: Point[] = [];
      const right: Point[] = [];
      const innerLeft: Point[] = [];
      const innerRight: Point[] = [];

      const centerAt = (u: number) => ({
        x:
          cx +
          Math.sin((u - 0.5) * Math.PI * 1.28 + phase * 0.055) * size * 0.105 +
          Math.sin(u * Math.PI * 5 + phase) * size * 0.012,
        y:
          h * (0.84 - u * 0.68) +
          Math.cos(u * Math.PI * 2 + phase) * size * 0.014,
      });

      for (let index = 0; index < pointCount; index++) {
        const u = index / (pointCount - 1);
        const center = centerAt(u);
        const next = centerAt(Math.min(1, u + 1 / (pointCount - 1)));
        const length = Math.max(0.001, Math.hypot(next.x - center.x, next.y - center.y));
        const nx = -(next.y - center.y) / length;
        const ny = (next.x - center.x) / length;
        const envelope = Math.pow(Math.sin(Math.PI * u), 0.72);
        const width =
          size * 0.285 * envelope * (0.96 + Math.sin(u * Math.PI * 6 + phase) * 0.055);
        centers.push(center);
        left.push({ x: center.x + nx * width, y: center.y + ny * width });
        right.push({ x: center.x - nx * width, y: center.y - ny * width });
        innerLeft.push({ x: center.x + nx * width * 0.58, y: center.y + ny * width * 0.58 });
        innerRight.push({ x: center.x - nx * width * 0.58, y: center.y - ny * width * 0.58 });
      }

      const progress = 1 - Math.pow(1 - Math.min(1, t / 4.2), 4);
      const end = Math.max(3, Math.min(pointCount, Math.floor(progress * pointCount)));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(((revision % 5) - 2) * 0.018 + Math.sin(t * 0.18) * 0.004);
      ctx.translate(-cx, -cy);
      ctx.globalAlpha = userGesture.length > 2 ? 0.24 : 1;
      ctx.globalCompositeOperation = 'screen';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.fillStyle = 'rgba(184,173,255,0.032)';
      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let index = 1; index < end; index++) ctx.lineTo(left[index].x, left[index].y);
      for (let index = end - 1; index >= 0; index--) ctx.lineTo(right[index].x, right[index].y);
      ctx.closePath();
      ctx.fill();

      strokePath(ctx, left, end, 'rgba(184,173,255,0.72)', 1.25);
      strokePath(ctx, right, end, 'rgba(134,228,202,0.58)', 1.1);
      strokePath(ctx, innerLeft, end, 'rgba(237,231,218,0.22)', 0.8);
      strokePath(ctx, innerRight, end, 'rgba(237,231,218,0.18)', 0.8);
      strokePath(ctx, centers, end, 'rgba(232,179,106,0.88)', 2.35);

      const ribStep = isLiteExperience() ? 13 : 9;
      for (let index = ribStep; index < end - 2; index += ribStep) {
        const strength = Math.sin((index / pointCount) * Math.PI);
        ctx.strokeStyle = `rgba(237,231,218,${0.055 + strength * 0.12})`;
        ctx.lineWidth = 0.72;
        ctx.beginPath();
        ctx.moveTo(left[index].x, left[index].y);
        ctx.quadraticCurveTo(centers[index].x, centers[index].y, right[index].x, right[index].y);
        ctx.stroke();

        ctx.fillStyle = index % (ribStep * 2) === 0 ? '#e8b36a' : '#b8adff';
        ctx.globalAlpha = (userGesture.length > 2 ? 0.24 : 1) * (0.34 + strength * 0.38);
        ctx.beginPath();
        ctx.arc(left[index].x, left[index].y, 1.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (userGesture.length > 2) {
        const reinterpret = (angle: number, scale: number, mirror = false) =>
          userGesture.map((point) => {
            const dx = (mirror ? w - point.x : point.x) - cx;
            const dy = point.y - cy;
            return {
              x: cx + (dx * Math.cos(angle) - dy * Math.sin(angle)) * scale,
              y: cy + (dx * Math.sin(angle) + dy * Math.cos(angle)) * scale,
            };
          });
        const readings = [
          { points: userGesture, color: 'rgba(232,179,106,0.9)', width: 2.8 },
          { points: reinterpret(0.08, 0.92, true), color: 'rgba(184,173,255,0.7)', width: 1.6 },
          { points: reinterpret(-0.12, 0.8), color: 'rgba(134,228,202,0.58)', width: 1.05 },
        ];
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'screen';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const reading of readings) {
          strokePath(ctx, reading.points, reading.points.length, reading.color, reading.width);
        }
      }
    });
    return () => {
      stop();
      canvas.removeEventListener('pointerdown', onGestureStart);
      canvas.removeEventListener('pointermove', onGestureMove);
      canvas.removeEventListener('pointerleave', onGestureEnd);
      window.removeEventListener('pointerup', onGestureEnd);
    };
  }, [revision]);
  return (
    <canvas
      ref={ref}
      className="canvas-cover interpretation-canvas touch-pan"
      aria-hidden="true"
    />
  );
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
  const [artRevision, setArtRevision] = useState(0);

  return (
    <section id="forms" className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <ChapterHead
          title={
            <>
              Rhythm. Interpretation. Pattern.
              <br />
              Connection. <em className="text-violet-glow">Flock.</em>
            </>
          }
          lede="Pluck a string. Draw a gesture. Turn a spiral. Pull a network. Disturb a flock. Each study gives the same screen a different kind of life."
        />

        <div className="instrument-rack mt-16">
          <Instrument
            index="α"
            name="rhythm"
            form="Music"
            caption="Five strings wait under tension. Pluck one and watch a note travel, fade, and leave the field quiet again."
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
            name="interpretation"
            form="Art"
            caption="Leave a gesture on the canvas. It returns as a mirror, an echo, and a revision of your hand."
            reverse
            action={
              <button
                type="button"
                className="instrument__action"
                onClick={() => setArtRevision((value) => value + 1)}
              >
                Begin another reading
              </button>
            }
          >
            <InterpretationCanvas revision={artRevision} />
          </Instrument>
          <Instrument
            index="γ"
            name="form"
            form="Math"
            caption="Turn one angle again and again. The points refuse a straight row and gather into a spiral."
          >
            <PhylloCanvas />
          </Instrument>
          <Instrument
            index="δ"
            name="signal"
            form="Science"
            caption="Pull one connection. The disturbance travels outward until the whole network settles around it."
            reverse
          >
            <PlexusCanvas />
          </Instrument>
          <Instrument
            index="ε"
            name="flock"
            form="Nature"
            caption="Each particle keeps its distance, follows its neighbours, and stays close. A flock appears without a leader."
          >
            <FlockCanvas />
          </Instrument>

          <Reveal>
            <div className="instrument-coda">
              <p className="font-serif-display text-3xl md:text-5xl leading-snug text-paper font-light">
                Change the form and you change{' '}
                <em className="text-sand">what the hand can do</em>, what the eye
                can follow, and{' '}
                <em className="text-violet-glow">what the machine seems to be.</em>
              </p>
              <p>
                These studies answer touch as it happens. Next, the field leaves
                the hand behind and moves through the air.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
