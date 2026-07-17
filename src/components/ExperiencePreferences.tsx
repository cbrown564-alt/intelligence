import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ExperiencePreferencesContext,
  useExperiencePreferences,
  type MotionMode,
  type QualityMode,
} from '@/lib/experience-preferences';

function initialMotion(): MotionMode {
  if (typeof window === 'undefined') return 'full';
  const saved = window.localStorage.getItem('shape-motion');
  if (saved === 'full' || saved === 'reduced') return saved;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduced'
    : 'full';
}

function initialQuality(): QualityMode {
  if (typeof window === 'undefined') return 'full';
  const saved = window.localStorage.getItem('shape-quality');
  if (saved === 'full' || saved === 'lite') return saved;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  return nav.connection?.saveData || (nav.deviceMemory ?? 8) < 4 ? 'lite' : 'full';
}

function preserveActiveHeading(change: () => void) {
  const masthead = document.querySelector<HTMLElement>('.masthead');
  const mastheadBottom = masthead?.getBoundingClientRect().bottom ?? 0;
  const headings = Array.from(document.querySelectorAll<HTMLElement>('section[id] h1, section[id] h2'));
  const heading = headings.reduce<HTMLElement | null>((closest, candidate) => {
    if (!closest) return candidate;
    const candidateDistance = Math.abs(candidate.getBoundingClientRect().top - mastheadBottom);
    const closestDistance = Math.abs(closest.getBoundingClientRect().top - mastheadBottom);
    return candidateDistance < closestDistance ? candidate : closest;
  }, null);
  const chapterId = heading?.closest<HTMLElement>('section[id]')?.id;
  const targetTop = masthead
    ? Math.max(heading?.getBoundingClientRect().top ?? 0, masthead.getBoundingClientRect().bottom + 16)
    : heading?.getBoundingClientRect().top ?? 0;

  change();
  if (!chapterId) return;

  let frame = 0;
  const restore = () => {
    const currentHeading = document.querySelector<HTMLElement>(
      `#${CSS.escape(chapterId)} h1, #${CSS.escape(chapterId)} h2`
    );
    if (!currentHeading) return;
    const delta = currentHeading.getBoundingClientRect().top - targetTop;
    if (Math.abs(delta) > 1) window.scrollBy(0, delta);
  };
  const settle = () => {
    restore();
    frame = window.requestAnimationFrame(restore);
  };
  frame = window.requestAnimationFrame(settle);

  const main = document.querySelector('main');
  const observer = new ResizeObserver(restore);
  if (main) observer.observe(main);
  window.setTimeout(() => {
    observer.disconnect();
    window.cancelAnimationFrame(frame);
    restore();
  }, 1200);
}

export function ExperiencePreferencesProvider({ children }: { children: ReactNode }) {
  const [motion, setMotion] = useState<MotionMode>(initialMotion);
  const [quality, setQuality] = useState<QualityMode>(initialQuality);

  useEffect(() => {
    document.documentElement.dataset.motion = motion;
    window.localStorage.setItem('shape-motion', motion);
  }, [motion]);

  useEffect(() => {
    document.documentElement.dataset.quality = quality;
    window.localStorage.setItem('shape-quality', quality);
  }, [quality]);

  const value = useMemo(
    () => ({ motion, quality, setMotion, setQuality }),
    [motion, quality]
  );

  return (
    <ExperiencePreferencesContext.Provider value={value}>
      {children}
    </ExperiencePreferencesContext.Provider>
  );
}

export function ExperienceControls() {
  const { motion, quality, setMotion, setQuality } = useExperiencePreferences();

  return (
    <div className="experience-controls" role="group" aria-label="Experience settings">
    <button
      type="button"
      className="experience-control"
      aria-pressed={motion === 'full'}
      onClick={() => preserveActiveHeading(() => setMotion(motion === 'full' ? 'reduced' : 'full'))}
    >
      <span className="experience-control__label">Motion</span>{' '}
      <span>{motion === 'full' ? 'on' : 'off'}</span>
    </button>
    <button
      type="button"
      className="experience-control"
      aria-pressed={quality === 'full'}
      onClick={() => preserveActiveHeading(() => setQuality(quality === 'full' ? 'lite' : 'full'))}
    >
      <span className="experience-control__label">Graphics</span>{' '}
      <span>{quality === 'full' ? 'standard' : 'low power'}</span>
    </button>
    </div>
  );
}
