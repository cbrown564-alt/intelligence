import { useEffect, useRef } from 'react';
import { isLiteExperience, startCanvas2D } from '@/lib/canvas';
import { fbm2 } from '@/lib/noise';
import { ChapterHead } from '@/components/ChapterHead';
import { Reveal } from '@/components/Reveal';
import { Footnote } from '@/components/References';

interface Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  ring: boolean;
}

interface Structure {
  x: number;
  y: number;
  r: number;
  age: number;
}

export function SmellChapter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let molecules: Molecule[] = [];
    let structures: Structure[] = [];
    let lastSpawn = 0;

    const stop = startCanvas2D(canvas, (ctx, w, h, t, p) => {
      ctx.fillStyle = 'rgba(8,10,12,0.16)';
      ctx.fillRect(0, 0, w, h);

      const ex = w * 0.16;
      const ey = h * 0.55;

      // emitter glow
      const grad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 90);
      grad.addColorStop(0, 'rgba(111,224,195,0.20)');
      grad.addColorStop(1, 'rgba(111,224,195,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ex, ey, 90, 0, Math.PI * 2);
      ctx.fill();

      // emit
      for (let i = 0; i < 6; i++) {
        if (molecules.length < (isLiteExperience() ? 320 : 750)) {
          molecules.push({
            x: ex + (Math.random() - 0.5) * 14,
            y: ey + (Math.random() - 0.5) * 14,
            vx: 0.6 + Math.random() * 0.8,
            vy: (Math.random() - 0.5) * 0.6,
            life: 0,
            maxLife: 7 + Math.random() * 7,
            size: 1 + Math.random() * 2.4,
            ring: Math.random() < 0.3,
          });
        }
      }

      // molecular structures bloom in the plume's path
      if (t - lastSpawn > 2.2 && structures.length < 5) {
        lastSpawn = t;
        structures.push({
          x: w * (0.4 + Math.random() * 0.5),
          y: h * (0.2 + Math.random() * 0.6),
          r: 12 + Math.random() * 12,
          age: 0,
        });
      }
      structures = structures.filter((s) => s.age < 4);
      for (const s of structures) {
        s.age += 0.016;
        const alpha =
          s.age < 1 ? s.age : s.age > 3 ? Math.max(0, 1 - (s.age - 3)) : 1;
        ctx.strokeStyle = `rgba(111,224,195,${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let k = 0; k <= 6; k++) {
          const a = (k / 6) * Math.PI * 2 + s.age * 0.1;
          const px = s.x + Math.cos(a) * s.r;
          const py = s.y + Math.sin(a) * s.r;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2 + s.age * 0.1;
          const px = s.x + Math.cos(a) * s.r;
          const py = s.y + Math.sin(a) * s.r;
          ctx.fillStyle = `rgba(237,231,218,${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // plume
      molecules = molecules.filter((m) => m.life < m.maxLife && m.x < w + 30);
      for (const m of molecules) {
        m.life += 0.016;
        const a =
          fbm2(m.x * 0.0035, m.y * 0.0035 + t * 0.02) * Math.PI * 4;
        m.vx += Math.cos(a) * 0.12 + 0.02;
        m.vy += Math.sin(a) * 0.12;
        if (p.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 150 && d > 1) {
            // stir: tangential swirl
            const f = ((150 - d) / 150) * 0.9;
            m.vx += (-dy / d) * f;
            m.vy += (dx / d) * f;
          }
        }
        m.vx *= 0.985;
        m.vy *= 0.985;
        m.x += m.vx;
        m.y += m.vy;

        const fade =
          m.life < 1 ? m.life : Math.max(0, 1 - (m.life - (m.maxLife - 2)) / 2);
        const green = 0.45 + 0.4 * Math.sin(m.x * 0.01 + t);
        ctx.strokeStyle = `rgba(111,224,195,${fade * 0.55})`;
        ctx.fillStyle = `rgba(${m.ring ? '111,224,195' : '180,240,220'},${
          fade * (0.35 + green * 0.65)
        })`;
        if (m.ring) {
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size + 1.6, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 0.95, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    return stop;
  }, []);

  return (
    <section id="scent" className="relative overflow-hidden" style={{ background: '#080a0c' }}>
      <div className="relative mx-auto max-w-7xl px-6 pt-28 md:pt-36">
        <ChapterHead
          title={
            <>
              Teaching computers <em className="text-sea">how to smell</em>.
            </>
          }
          lede={
            <>
              Not every machine intelligence needs to speak in words. Experimental
              sensor arrays and statistical models can distinguish patterns of
              volatile compounds in breath samples.<Footnote reference="ref-breath" />
              These are research systems, not standalone cancer diagnoses.
            </>
          }
        />
      </div>

      <div className="relative h-[58vh] md:h-[64vh] mt-6">
        <canvas ref={canvasRef} className="canvas-cover touch-pan" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-5 left-6 flex items-center gap-3">
          <span className="font-mono-label text-xs tracking-[0.12em] text-sea uppercase">
            exhale · the plume reads you
          </span>
          <span className="h-px w-10 bg-sea/30" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="max-w-xl text-sm leading-relaxed text-paper/70 font-light">
            Long before electronic noses, bacteria were already moving in response
            to chemical gradients through chemotaxis.<Footnote reference="ref-chemotaxis" />
            Sensor arrays give machines access to a chemical spectrum{' '}
            <span className="text-sea">we were never able to perceive</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
