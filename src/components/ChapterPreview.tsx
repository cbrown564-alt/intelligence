import type { ChapterSummary } from '@/content/chapters';
import { useExperiencePreferences } from '@/lib/experience-preferences';

const accentClasses: Record<ChapterSummary['accent'], string> = {
  sand: 'text-sand',
  violet: 'text-violet-glow',
  sea: 'text-sea',
  rose: 'text-rose-300',
};

export function ChapterPreview({ chapter }: { chapter: ChapterSummary }) {
  const { motion } = useExperiencePreferences();
  return (
    <section id={chapter.id} className="chapter-preview" aria-labelledby={`${chapter.id}-title`}>
      <div className="chapter-preview__visual" aria-hidden="true">
        <span className={`chapter-preview__orb ${accentClasses[chapter.accent]}`} />
      </div>
      <div className="chapter-preview__copy">
        <p className="chapter-preview__status">
          Interactive layer {motion === 'reduced' ? 'paused' : 'loading'}
        </p>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <p>{chapter.summary}</p>
        <p>{chapter.detail}</p>
      </div>
    </section>
  );
}
