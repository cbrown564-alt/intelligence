import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface ChapterHeadProps {
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function ChapterHead({
  title,
  lede,
  align = 'left',
  className = '',
}: ChapterHeadProps) {
  const alignClass =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <div className={`chapter-head ${alignClass} ${className}`}>
      <Reveal>
        <h2>{title}</h2>
      </Reveal>
      {lede ? (
        <Reveal delay={100}>
          <p>{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

