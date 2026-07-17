import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import { ChapterPreview } from '@/components/ChapterPreview';
import { EnhancementBoundary } from '@/components/EnhancementBoundary';
import { useExperiencePreferences } from '@/lib/experience-preferences';
import type { ChapterSummary } from '@/content/chapters';

interface LazyChapterProps {
  chapter: ChapterSummary;
  component: LazyExoticComponent<ComponentType>;
}

function LoadedChapter({
  id,
  component: Component,
}: {
  id: string;
  component: LazyExoticComponent<ComponentType>;
}) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('shape:chapter-ready', { detail: id }));
  }, [id]);
  return <Component />;
}

export function LazyChapter({ chapter, component: Component }: LazyChapterProps) {
  const { motion, quality } = useExperiencePreferences();
  const markerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || motion === 'reduced') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${Math.round(Math.min(900, window.innerHeight * 0.9))}px 0px` }
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, [motion]);

  return (
    <div ref={markerRef} data-lazy-chapter={chapter.id}>
      {motion === 'full' && nearViewport ? (
        <EnhancementBoundary
          label={`${chapter.label} interactive study`}
          fallback={<ChapterPreview chapter={chapter} enhancementError />}
        >
          <Suspense fallback={<ChapterPreview chapter={chapter} />}>
            <LoadedChapter key={quality} id={chapter.id} component={Component} />
          </Suspense>
        </EnhancementBoundary>
      ) : (
        <ChapterPreview chapter={chapter} />
      )}
    </div>
  );
}
