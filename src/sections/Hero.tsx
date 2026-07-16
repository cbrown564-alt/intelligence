import { lazy, Suspense } from 'react';
import { useExperiencePreferences } from '@/lib/experience-preferences';

const HeroVisual = lazy(() =>
  import('@/sections/HeroVisual').then((module) => ({ default: module.HeroVisual }))
);

export function Hero() {
  const { motion, quality } = useExperiencePreferences();

  return (
    <section id="shape" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-poster" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {motion === 'full' ? (
        <Suspense fallback={null}>
          <HeroVisual quality={quality} />
        </Suspense>
      ) : null}

      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-copy">
        <p className="hero-kicker">A visual essay on living with minds we made</p>
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
          It has no body. And yet we reach for it — through glass, through sound,
          through silicon shaped into machines that can answer back.
        </p>
        <p className="hero-sequence" aria-label="Matter becomes pattern, signal, sense, and mind">
          <span>Matter</span><i>becomes</i><span>pattern</span><i>becomes</i>
          <span>signal</span><i>becomes</i><span>sense</span><i>becomes</i><span>mind</span>
        </p>
      </div>

      <a href="#touch" className="hero-cue">
        <span>Follow the matter</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
