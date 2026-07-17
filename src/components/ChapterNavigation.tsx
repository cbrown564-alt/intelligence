import { useRef } from 'react';
import { CHAPTERS } from '@/content/chapters';

export function ChapterNavigation({ active }: { active: string }) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const currentIndex = Math.max(0, CHAPTERS.findIndex((chapter) => chapter.id === active));
  const current = CHAPTERS[currentIndex];
  const previous = CHAPTERS[currentIndex - 1];
  const next = CHAPTERS[currentIndex + 1];

  return (
    <>
      <nav className="chapter-navigation" aria-label="Essay chapters">
        <ol>
          {CHAPTERS.map((chapter, index) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={active === chapter.id ? 'location' : undefined}
              >
                <span className="chapter-navigation__number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{chapter.shortLabel}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav className="chapter-mobile" aria-label="Chapter controls">
        {previous ? (
          <a href={`#${previous.id}`} className="chapter-mobile__step" aria-label={`Previous chapter: ${previous.label}`}>
            <span aria-hidden="true">←</span>
            <span className="chapter-mobile__step-label">{previous.shortLabel}</span>
          </a>
        ) : (
          <span className="chapter-mobile__step is-disabled" aria-hidden="true">←</span>
        )}

        <details ref={menuRef} className="chapter-mobile__menu">
          <summary>
            <span>{String(currentIndex + 1).padStart(2, '0')} of {String(CHAPTERS.length).padStart(2, '0')}</span>
            <strong>{current.shortLabel}</strong>
          </summary>
          <ol>
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={active === chapter.id ? 'location' : undefined}
                  onClick={() => {
                    if (menuRef.current) menuRef.current.open = false;
                  }}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{chapter.label}</strong>
                </a>
              </li>
            ))}
          </ol>
        </details>

        {next ? (
          <a href={`#${next.id}`} className="chapter-mobile__step" aria-label={`Next chapter: ${next.label}`}>
            <span className="chapter-mobile__step-label">{next.shortLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <span className="chapter-mobile__step is-disabled" aria-hidden="true">→</span>
        )}
      </nav>
    </>
  );
}
