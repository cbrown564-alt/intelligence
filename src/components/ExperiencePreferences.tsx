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
      onClick={() => setMotion(motion === 'full' ? 'reduced' : 'full')}
    >
      <span className="experience-control__label">Motion</span>{' '}
      <span>{motion === 'full' ? 'on' : 'off'}</span>
    </button>
    <button
      type="button"
      className="experience-control"
      aria-pressed={quality === 'full'}
      onClick={() => setQuality(quality === 'full' ? 'lite' : 'full')}
    >
      <span className="experience-control__label">Detail</span>{' '}
      <span>{quality}</span>
    </button>
    </div>
  );
}
