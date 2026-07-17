import { useEffect, useRef } from 'react';
import { CHAPTERS } from '@/content/chapters';
import { useExperiencePreferences } from '@/lib/experience-preferences';

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  seed: number;
}

const TAU = Math.PI * 2;
const COLORS = [
  [232, 179, 106],
  [232, 179, 106],
  [184, 173, 255],
  [134, 228, 202],
  [167, 151, 255],
  [239, 220, 177],
] as const;

const MATERIALS: Record<string, string> = {
  shape: 'matter',
  touch: 'force',
  forms: 'signal',
  scent: 'chemical',
  shapeshift: 'structure',
  vision: 'light',
};

function fract(value: number) {
  return value - Math.floor(value);
}

function smoothstep(value: number) {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
}

function targetFor(
  stage: number,
  index: number,
  count: number,
  width: number,
  height: number,
  time: number,
  seed: number
) {
  const mobile = width < 720;
  const cx = width * (mobile ? 0.5 : 0.72);
  const cy = height * (mobile ? 0.57 : 0.53);
  const radius = Math.min(width * (mobile ? 0.4 : 0.31), height * 0.37);
  const u = index / Math.max(1, count - 1);
  let x = cx;
  let y = cy;

  switch (stage) {
    case 0: {
      const latitude = Math.acos(1 - 2 * u);
      const longitude = index * 2.399963;
      x += Math.cos(longitude) * Math.sin(latitude) * radius * 0.78;
      y += Math.cos(latitude) * radius * 0.78;
      break;
    }
    case 1: {
      x = width * (0.08 + u * 0.84);
      y = cy + Math.sin(u * TAU * 2.2 + time * 0.42) * radius * 0.22;
      y += (seed - 0.5) * radius * 0.42;
      break;
    }
    case 2: {
      x = width * (0.04 + u * 0.92);
      const harmonic = Math.sin(u * TAU * 2 + time * 0.48);
      const overtone = Math.sin(u * TAU * 7 - time * 0.7) * 0.24;
      y = cy + (harmonic + overtone) * radius * (0.32 + seed * 0.12);
      break;
    }
    case 3: {
      const plume = Math.pow(u, 0.72);
      x = width * (0.12 + plume * 0.82);
      const spread = radius * (0.08 + plume * 0.72);
      y = cy + (seed - 0.5) * spread + Math.sin(seed * 23 + time * 0.23) * 7;
      break;
    }
    case 4: {
      const towers = mobile ? 11 : 19;
      const tower = index % towers;
      const level = Math.floor(index / towers);
      const levels = Math.ceil(count / towers);
      const baseline = cy + radius * 0.62;
      const towerSeed = fract(tower * 0.6180339);
      const towerHeight = radius * (0.25 + towerSeed * 0.95);
      x = cx + (tower / (towers - 1) - 0.5) * radius * 2.05;
      x += (seed - 0.5) * Math.max(4, radius / towers);
      y = baseline - (level / Math.max(1, levels - 1)) * towerHeight;
      break;
    }
    default: {
      const spiral = u * TAU * 3.5;
      const beam = radius * (0.08 + (1 - u) * 0.82);
      x = cx + Math.cos(spiral + time * 0.12) * beam;
      y = cy + (u - 0.5) * radius * 1.9 + Math.sin(spiral) * radius * 0.08;
    }
  }

  return { x, y };
}

export function MatterCurrent({ active }: { active: string }) {
  const { motion, quality } = useExperiencePreferences();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (motion !== 'full') return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const count = quality === 'full' ? 210 : 92;
    const particles: Particle[] = Array.from({ length: count }, (_, index) => {
      const seed = fract(Math.sin(index * 91.73 + 17.31) * 43758.5453);
      return { x: innerWidth / 2, y: innerHeight / 2, px: innerWidth / 2, py: innerHeight / 2, seed };
    });
    const pointer = { x: -9999, y: -9999, active: false, down: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let targetStage = 0;
    let stage = 0;
    let raf = 0;
    let last = performance.now();
    let visible = !document.hidden;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, quality === 'full' ? 1.6 : 1);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.52;
      const offsets = CHAPTERS.map((chapter) => document.getElementById(chapter.id)?.offsetTop ?? 0);
      let index = 0;
      while (index < offsets.length - 1 && probe >= offsets[index + 1]) index += 1;
      if (index >= offsets.length - 1) {
        targetStage = offsets.length - 1;
        return;
      }
      const span = Math.max(1, offsets[index + 1] - offsets[index]);
      targetStage = index + smoothstep((probe - offsets[index]) / span);
    };

    const setPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerDown = (event: PointerEvent) => {
      pointer.down = true;
      setPointer(event);
    };
    const onPointerUp = () => {
      pointer.down = false;
      if (matchMedia('(pointer: coarse)').matches) pointer.active = false;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.down = false;
    };
    const onVisibility = () => {
      visible = !document.hidden;
      canvas.dataset.rendering = String(visible);
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      if (quality === 'lite' && now - last < 30) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      stage += (targetStage - stage) * (1 - Math.exp(-dt * 4.8));
      const from = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(stage)));
      const to = Math.min(CHAPTERS.length - 1, from + 1);
      const mix = smoothstep(stage - from);
      const colorA = COLORS[from];
      const colorB = COLORS[to];
      const red = Math.round(colorA[0] + (colorB[0] - colorA[0]) * mix);
      const green = Math.round(colorA[1] + (colorB[1] - colorA[1]) * mix);
      const blue = Math.round(colorA[2] + (colorB[2] - colorA[2]) * mix);
      const time = now / 1000;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      context.lineCap = 'round';

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const a = targetFor(from, index, count, width, height, time, particle.seed);
        const b = targetFor(to, index, count, width, height, time, particle.seed);
        let targetX = a.x + (b.x - a.x) * mix;
        let targetY = a.y + (b.y - a.y) * mix;

        if (pointer.active) {
          const dx = targetX - pointer.x;
          const dy = targetY - pointer.y;
          const distance = Math.hypot(dx, dy);
          const reach = pointer.down ? 190 : 105;
          if (distance < reach) {
            const force = (1 - distance / reach) ** 2 * (pointer.down ? 92 : 24);
            targetX += (dx / Math.max(distance, 1)) * force;
            targetY += (dy / Math.max(distance, 1)) * force;
          }
        }

        particle.px = particle.x;
        particle.py = particle.y;
        const response = 1 - Math.exp(-dt * (pointer.down ? 9.5 : 6.2));
        particle.x += (targetX - particle.x) * response;
        particle.y += (targetY - particle.y) * response;

        const speed = Math.min(1, Math.hypot(particle.x - particle.px, particle.y - particle.py) / 12);
        const alpha = 0.18 + particle.seed * 0.34 + speed * 0.18;
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha * 0.38})`;
        context.lineWidth = 0.45 + particle.seed * 0.9;
        context.beginPath();
        context.moveTo(particle.px, particle.py);
        context.lineTo(particle.x, particle.y);
        context.stroke();

        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, 0.7 + particle.seed * 1.45, 0, TAU);
        context.fill();
      }

      if (from === 4 || to === 4 || from === 5) {
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, 0.08)`;
        context.lineWidth = 0.5;
        for (let index = 0; index < particles.length - 1; index += 3) {
          const one = particles[index];
          const two = particles[index + 1];
          if (Math.hypot(one.x - two.x, one.y - two.y) > 45) continue;
          context.beginPath();
          context.moveTo(one.x, one.y);
          context.lineTo(two.x, two.y);
          context.stroke();
        }
      }
    };

    resize();
    readScroll();
    canvas.dataset.rendering = String(visible);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('pointermove', setPointer, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      delete canvas.dataset.rendering;
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('pointermove', setPointer);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [motion, quality]);

  if (motion === 'reduced') {
    return (
      <div className="matter-atlas" aria-hidden="true">
        {CHAPTERS.map((chapter) => <span key={chapter.id} data-accent={chapter.accent} />)}
      </div>
    );
  }

  return (
    <div className="matter-current" data-stage={active} aria-hidden="true">
      <canvas ref={canvasRef} aria-hidden="true" />
      <p className="matter-current__legend">
        <span>{String(CHAPTERS.findIndex((chapter) => chapter.id === active) + 1).padStart(2, '0')}</span>
        <i />
        {MATERIALS[active] ?? 'matter'}
      </p>
    </div>
  );
}
