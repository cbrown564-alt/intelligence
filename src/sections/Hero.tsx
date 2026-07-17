import { lazy, Suspense, useEffect, useState } from 'react';
import { useExperiencePreferences } from '@/lib/experience-preferences';
import { EnhancementBoundary } from '@/components/EnhancementBoundary';

const HeroVisual = lazy(() =>
  import('@/sections/HeroVisual').then((module) => ({ default: module.HeroVisual }))
);

export function Hero() {
  const { motion, quality } = useExperiencePreferences();
  const [enhance, setEnhance] = useState(false);

  useEffect(() => {
    if (motion !== 'full') return;

    const idle = window.requestIdleCallback?.(() => setEnhance(true), { timeout: 900 });
    const timer = idle === undefined ? window.setTimeout(() => setEnhance(true), 350) : 0;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, [motion]);

  return (
    <section id="shape" className="hero-section" aria-labelledby="hero-title">
      {motion === 'full' && enhance ? (
        <EnhancementBoundary label="Opening particle study">
          <Suspense fallback={null}>
            <HeroVisual quality={quality} />
          </Suspense>
        </EnhancementBoundary>
      ) : null}

      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-copy">
        <p className="hero-kicker">A visual essay in matter, motion, and machine intelligence</p>
        <h1 id="hero-title" aria-label="What is the shape of intelligence?">
          <span>What is the</span>
          <span>
            <em>shape</em> of
          </span>
          <span>
            intelligence<b>?</b>
          </span>
        </h1>
        <p className="hero-lede">
          It arrives as light on glass. A pulse of sound. A pattern caught by
          a sensor. We give it a form, then meet it there.
        </p>
        <p className="hero-sequence" aria-label="Matter becomes signal becomes form">
          <span>Matter</span><i>becomes</i><span>signal</span><i>becomes</i>
          <span>form</span>
        </p>
      </div>

      <a href="#touch" className="hero-cue">
        <span>Enter the field</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
