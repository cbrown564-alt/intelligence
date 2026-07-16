import { lazy, useEffect, useRef, useState } from 'react';
import { Hero } from '@/sections/Hero';
import { LazyChapter } from '@/components/LazyChapter';
import { ChapterNavigation } from '@/components/ChapterNavigation';
import {
  ExperienceControls,
  ExperiencePreferencesProvider,
} from '@/components/ExperiencePreferences';
import { References } from '@/components/References';
import { MatterCurrent } from '@/components/MatterCurrent';
import { CHAPTERS } from '@/content/chapters';

const TouchChapter = lazy(() =>
  import('@/sections/TouchChapter').then((module) => ({ default: module.TouchChapter }))
);
const FormsChapter = lazy(() =>
  import('@/sections/FormsChapter').then((module) => ({ default: module.FormsChapter }))
);
const SandChapter = lazy(() =>
  import('@/sections/SandChapter').then((module) => ({ default: module.SandChapter }))
);
const SmellChapter = lazy(() =>
  import('@/sections/SmellChapter').then((module) => ({ default: module.SmellChapter }))
);
const ShapeshiftChapter = lazy(() =>
  import('@/sections/ShapeshiftChapter').then((module) => ({
    default: module.ShapeshiftChapter,
  }))
);
const SlopChapter = lazy(() =>
  import('@/sections/SlopChapter').then((module) => ({ default: module.SlopChapter }))
);
const Finale = lazy(() =>
  import('@/sections/Finale').then((module) => ({ default: module.Finale }))
);

const LAZY_CHAPTERS = [
  { chapter: CHAPTERS[1], component: TouchChapter },
  { chapter: CHAPTERS[2], component: FormsChapter },
  { chapter: CHAPTERS[3], component: SandChapter },
  { chapter: CHAPTERS[4], component: SmellChapter },
  { chapter: CHAPTERS[5], component: ShapeshiftChapter },
  { chapter: CHAPTERS[6], component: SlopChapter },
  { chapter: CHAPTERS[7], component: Finale },
] as const;

function Essay() {
  const [active, setActive] = useState('shape');
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const probe = window.scrollY + window.innerHeight * 0.42;
      let current = CHAPTERS[0].id;
      for (const chapter of CHAPTERS) {
        const element = document.getElementById(chapter.id);
        if (element && element.offsetTop <= probe) current = chapter.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    let settlingUntil = 0;
    let secondFrame = 0;
    let readyFrame = 0;
    let firstFrame = 0;
    const scrollToChapter = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    };
    const beginSettling = () => {
      settlingUntil = performance.now() + 2200;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      firstFrame = requestAnimationFrame(() => {
        scrollToChapter();
        secondFrame = requestAnimationFrame(scrollToChapter);
      });
    };
    const onChapterReady = (event: Event) => {
      const id = window.location.hash.slice(1);
      if ((event as CustomEvent<string>).detail !== id) return;
      readyFrame = requestAnimationFrame(scrollToChapter);
    };
    const stopSettling = () => {
      settlingUntil = 0;
    };
    const observer = new ResizeObserver(() => {
      if (performance.now() < settlingUntil) scrollToChapter();
    });
    const main = document.querySelector('main');
    if (main) observer.observe(main);
    window.addEventListener('shape:chapter-ready', onChapterReady);
    window.addEventListener('hashchange', beginSettling);
    window.addEventListener('wheel', stopSettling, { passive: true });
    window.addEventListener('pointerdown', stopSettling, { passive: true });
    if (window.location.hash) beginSettling();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      cancelAnimationFrame(readyFrame);
      window.removeEventListener('shape:chapter-ready', onChapterReady);
      window.removeEventListener('hashchange', beginSettling);
      window.removeEventListener('wheel', stopSettling);
      window.removeEventListener('pointerdown', stopSettling);
    };
  }, []);

  return (
    <>
      <a href="#shape" className="skip-link">
        Skip to the essay
      </a>
      <main className="relative bg-ink text-paper antialiased">
        <div className="grain" aria-hidden="true" />
        <MatterCurrent active={active} />

        <header className="masthead">
          <a href="#shape" className="masthead__title">
            The Shape of Intelligence
          </a>
          <ExperienceControls />
        </header>

        <ChapterNavigation active={active} />

        <Hero />
        {LAZY_CHAPTERS.map(({ chapter, component }) => (
          <LazyChapter key={chapter.id} chapter={chapter} component={component} />
        ))}
        <References />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <ExperiencePreferencesProvider>
      <Essay />
    </ExperiencePreferencesProvider>
  );
}
