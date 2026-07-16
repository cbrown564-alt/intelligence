import { CHAPTERS } from '@/content/chapters';

export function ChapterNavigation({ active }: { active: string }) {
  return (
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
  );
}

