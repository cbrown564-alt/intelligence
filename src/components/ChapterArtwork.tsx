import type { CSSProperties } from 'react';
import type { ChapterSummary } from '@/content/chapters';

type ArtworkId = Exclude<ChapterSummary['id'], 'shape'>;

function indexedStyle(index: number) {
  return {
    '--index': index,
    '--mod-2': index % 2,
    '--mod-3': index % 3,
    '--mod-4': index % 4,
    '--mod-5': index % 5,
    '--mod-6': index % 6,
  } as CSSProperties;
}

export function ChapterArtwork({ chapterId }: { chapterId: ArtworkId }) {
  if (chapterId === 'touch') {
    return (
      <div className="chapter-artwork chapter-artwork--touch" data-static-artwork="touch">
        <span className="touch-study__word">touch</span>
        <div className="touch-study__grains">
          {Array.from({ length: 28 }, (_, index) => (
            <i key={index} style={indexedStyle(index)} />
          ))}
        </div>
      </div>
    );
  }

  if (chapterId === 'forms') {
    return (
      <div className="chapter-artwork chapter-artwork--forms" data-static-artwork="forms">
        {['rhythm', 'interpretation', 'pattern', 'network', 'flock'].map((form, index) => (
          <span key={form} data-form={form} style={indexedStyle(index)}>
            <i />
          </span>
        ))}
      </div>
    );
  }

  if (chapterId === 'scent') {
    return (
      <div className="chapter-artwork chapter-artwork--scent" data-static-artwork="scent">
        <span className="scent-study__emitter" />
        <div className="scent-study__plume">
          {Array.from({ length: 24 }, (_, index) => (
            <i key={index} style={indexedStyle(index)} />
          ))}
        </div>
        <span className="scent-study__sensor" />
      </div>
    );
  }

  if (chapterId === 'shapeshift') {
    return (
      <div
        className="chapter-artwork chapter-artwork--shapeshift"
        data-static-artwork="shapeshift"
      >
        <div className="shapeshift-study__city">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} style={indexedStyle(index)} />
          ))}
        </div>
        <div className="shapeshift-study__dust">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={indexedStyle(index)} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chapter-artwork chapter-artwork--vision" data-static-artwork="vision">
      <span className="vision-study__beam" />
      <span className="vision-study__aperture" />
      <span className="vision-study__horizon" />
    </div>
  );
}
