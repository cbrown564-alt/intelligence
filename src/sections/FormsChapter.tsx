import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChapterHead } from '@/components/ChapterHead';
import { ChapterTradeoff } from '@/components/ChapterTradeoff';
import { Reveal } from '@/components/Reveal';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';

function Instrument({
  index,
  name,
  form,
  caption,
  capability,
  blindSpot,
  children,
  reverse = false,
  action,
}: {
  index: string;
  name: string;
  form: string;
  caption: string;
  capability: string;
  blindSpot: string;
  children: ReactNode;
  reverse?: boolean;
  action: ReactNode;
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
          <ChapterTradeoff capability={capability} blindSpot={blindSpot} />
        </div>
      </article>
    </Reveal>
  );
}

function playNote(audioRef: React.RefObject<AudioContext | null>, position: number) {
  try {
    audioRef.current ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const audio = audioRef.current;
    if (audio.state === 'suspended') void audio.resume();
    const scale = [0, 3, 5, 7, 10];
    const degree = Math.min(14, Math.floor(position * 15));
    const semitones = scale[degree % 5] + 12 * Math.floor(degree / 5);
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const start = audio.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.value = 196 * Math.pow(2, semitones / 12);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + 1.7);
  } catch {
    // The ribbon remains a complete visual study when audio is unavailable.
  }
}

function MusicCanvas({ onPluck }: { onPluck: (position: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stop = startCanvas2D(canvas, (ctx, w, h, t, pointer) => {
      ctx.clearRect(0, 0, w, h);
      const voices = [
        { color: 'rgba(232,179,106,0.9)', amplitude: 1, frequency: 1, phase: 0 },
        { color: 'rgba(169,155,255,0.7)', amplitude: 0.7, frequency: 1.6, phase: 2.1 },
        { color: 'rgba(111,224,195,0.55)', amplitude: 0.5, frequency: 2.4, phase: 4.2 },
        { color: 'rgba(237,231,218,0.35)', amplitude: 0.35, frequency: 3.2, phase: 1.3 },
      ];
      const px = pointer.active ? pointer.x / w : 0.5;
      const py = pointer.active ? pointer.y / h : 0.5;
      for (const voice of voices) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const u = x / w;
          const envelope = Math.sin(u * Math.PI);
          const drive = 1 + Math.exp(-Math.pow((u - px) * 4, 2)) * 2.2;
          const y = h / 2 +
            Math.sin(u * 6.3 * voice.frequency + t * 2.2 + voice.phase) *
            Math.sin(u * 2.1 * voice.frequency - t * 1.3) *
            26 * voice.amplitude * envelope * drive * (0.5 + py);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = voice.color;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    });
    const onPointerDown = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      onPluck((event.clientX - bounds.left) / bounds.width);
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    return () => {
      stop();
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onPluck]);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

function PatternCanvas({ revision }: { revision: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stop = startCanvas2D(canvas, (ctx, w, h, t, pointer) => {
      ctx.fillStyle = 'rgba(10,10,16,0.28)';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const goldenAngle = 137.508 * (Math.PI / 180);
      const pointerShift = pointer.active ? (pointer.x / w - 0.5) * 0.02 : 0;
      const revisionShift = ((revision % 7) - 3) * 0.0018;
      const maximum = isLiteExperience() ? 420 : 880;
      const spacing = (Math.min(w, h) / 2 - 12) / Math.sqrt(maximum);
      const count = Math.min(maximum, Math.floor((t * 90) % (maximum + 260)));
      for (let index = 0; index < count; index += 1) {
        const angle = index * (goldenAngle + pointerShift + revisionShift) + t * 0.06;
        const radius = spacing * Math.sqrt(index);
        const progress = index / maximum;
        ctx.fillStyle = progress < 0.5
          ? `rgba(232,179,106,${0.35 + progress})`
          : `rgba(169,155,255,${0.4 + (1 - progress) * 0.5})`;
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(angle) * radius,
          cy + Math.sin(angle) * radius,
          0.8 + progress * 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    });
    return stop;
  }, [revision]);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const FLOCK_MOTION_RATE = 0.5;

function FlockCanvas({ revision }: { revision: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let boids: Boid[] = [];
    let seeded = false;
    const stop = startCanvas2D(canvas, (ctx, w, h, _t, pointer) => {
      if (!seeded) {
        const impulse = revision === 0 ? 2 : 5;
        boids = Array.from({ length: isLiteExperience() ? 34 : 64 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * impulse,
          vy: (Math.random() - 0.5) * impulse,
        }));
        seeded = true;
      }
      ctx.fillStyle = 'rgba(10,10,16,0.3)';
      ctx.fillRect(0, 0, w, h);

      for (const boid of boids) {
        let alignX = 0;
        let alignY = 0;
        let centerX = 0;
        let centerY = 0;
        let separateX = 0;
        let separateY = 0;
        let neighbours = 0;
        for (const other of boids) {
          if (other === boid) continue;
          const dx = other.x - boid.x;
          const dy = other.y - boid.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < 2600) {
            centerX += other.x;
            centerY += other.y;
            alignX += other.vx;
            alignY += other.vy;
            neighbours += 1;
            if (distanceSquared < 500 && distanceSquared > 0.01) {
              const distance = Math.sqrt(distanceSquared);
              separateX -= dx / distance;
              separateY -= dy / distance;
            }
          }
        }
        if (neighbours > 0) {
          boid.vx += ((centerX / neighbours - boid.x) * 0.0012 +
            (alignX / neighbours - boid.vx) * 0.05 + separateX * 0.06) * FLOCK_MOTION_RATE;
          boid.vy += ((centerY / neighbours - boid.y) * 0.0012 +
            (alignY / neighbours - boid.vy) * 0.05 + separateY * 0.06) * FLOCK_MOTION_RATE;
        }
        if (pointer.active) {
          const dx = boid.x - pointer.x;
          const dy = boid.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 110 && distance > 1) {
            const force = ((110 - distance) / 110) * 0.9 * FLOCK_MOTION_RATE;
            boid.vx += (dx / distance) * force;
            boid.vy += (dy / distance) * force;
          }
        }
        const speed = Math.hypot(boid.vx, boid.vy);
        if (speed > 2.6) {
          boid.vx = (boid.vx / speed) * 2.6;
          boid.vy = (boid.vy / speed) * 2.6;
        }
        boid.x += boid.vx * FLOCK_MOTION_RATE;
        boid.y += boid.vy * FLOCK_MOTION_RATE;
        if (boid.x < -10) boid.x += w + 20;
        else if (boid.x > w + 10) boid.x -= w + 20;
        if (boid.y < -10) boid.y += h + 20;
        else if (boid.y > h + 10) boid.y -= h + 20;
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);
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
  }, [revision]);
  return <canvas ref={ref} className="canvas-cover touch-pan" aria-hidden="true" />;
}

export function FormsChapter() {
  const audioRef = useRef<AudioContext | null>(null);
  const [patternRevision, setPatternRevision] = useState(0);
  const [flockRevision, setFlockRevision] = useState(0);
  const pluck = useCallback((position: number) => playNote(audioRef, position), []);

  useEffect(() => () => {
    if (audioRef.current) void audioRef.current.close();
  }, []);

  return (
    <section id="forms" className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <ChapterHead
          title={
            <>
              Rhythm. Pattern. <em className="text-violet-glow">Flock.</em>
            </>
          }
          lede="Three instruments receive the same hand differently. Each brings one behaviour forward and lets the rest fall away."
        />

        <div className="instrument-rack mt-16">
          <Instrument
            index="01"
            name="frequency"
            form="Rhythm"
            caption="A pinned ribbon turns frequency into motion. Sound deepens the study when available; the visible interval carries the same meaning in silence."
            capability="Frequency becomes a visible interval."
            blindSpot="The ribbon drops the material and room that gave the sound its timbre."
            action={
              <button type="button" className="instrument__action" onClick={() => pluck(0.48)}>
                Play the middle note
              </button>
            }
          >
            <MusicCanvas onPluck={pluck} />
          </Instrument>
          <Instrument
            index="02"
            name="repetition"
            form="Pattern"
            caption="One angle repeats until a spiral appears. A slight change reorganises the whole field."
            capability="A repeated angle reveals order without a grid."
            blindSpot="The finished spiral hides the sequence and alternatives that produced it."
            reverse
            action={
              <button
                type="button"
                className="instrument__action"
                onClick={() => setPatternRevision((value) => value + 1)}
              >
                Change the angle
              </button>
            }
          >
            <PatternCanvas revision={patternRevision} />
          </Instrument>
          <Instrument
            index="03"
            name="neighbours"
            form="Flock"
            caption="Each particle keeps its distance, follows nearby motion, and stays close. Coordination appears without a leader."
            capability="Neighbour rules reveal collective motion."
            blindSpot="The flock view hides each particle's incomplete local view."
            action={
              <button
                type="button"
                className="instrument__action"
                onClick={() => setFlockRevision((value) => value + 1)}
              >
                Scatter the flock
              </button>
            }
          >
            <FlockCanvas revision={flockRevision} />
          </Instrument>

          <Reveal>
            <div className="instrument-coda">
              <p className="font-serif-display text-3xl md:text-5xl leading-snug text-paper font-light">
                Change the instrument and you change{' '}
                <em className="text-sand">what can be perceived</em>.
              </p>
              <p>
                Next, the signal leaves the hand behind and moves through the air,
                where one confident reading can still be wrong.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
