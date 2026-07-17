import type { ChapterSummary } from '@/content/chapters';
import { ChapterArtwork } from '@/components/ChapterArtwork';

export function ChapterPreview({
  chapter,
  enhancementError = false,
}: {
  chapter: ChapterSummary;
  enhancementError?: boolean;
}) {
  return (
    <section id={chapter.id} className="chapter-preview" aria-labelledby={`${chapter.id}-title`}>
      <div className="chapter-preview__visual" aria-hidden="true">
        <ChapterArtwork chapterId={chapter.id as Exclude<ChapterSummary['id'], 'shape'>} />
      </div>
      <div className="chapter-preview__copy">
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <p>{chapter.summary}</p>
        <p>{chapter.detail}</p>
        {enhancementError ? (
          <div className="chapter-preview__notice" role="status">
            <span>The interactive study could not load. This static study contains the same argument.</span>
            <button type="button" onClick={() => window.location.reload()}>
              Retry interaction
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
