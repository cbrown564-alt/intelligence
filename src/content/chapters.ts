export type ChapterId =
  | 'shape'
  | 'touch'
  | 'forms'
  | 'scent'
  | 'shapeshift'
  | 'vision';

export interface ChapterSummary {
  id: ChapterId;
  label: string;
  shortLabel: string;
  title: string;
  summary: string;
  detail: string;
  accent: 'sand' | 'violet' | 'sea' | 'rose';
}

export const CHAPTERS: ChapterSummary[] = [
  {
    id: 'shape',
    label: 'Shape',
    shortLabel: 'Shape',
    title: 'What is the shape of intelligence?',
    summary:
      'It arrives as light on glass, a pulse of sound, or a pattern caught by a sensor.',
    detail:
      'A sphere becomes a knot, then a cloud. Matter becomes signal; signal becomes form.',
    accent: 'sand',
  },
  {
    id: 'touch',
    label: 'Touch',
    shortLabel: 'Touch',
    title: 'Can we touch it?',
    summary:
      'A word scatters beneath your hand, carries your momentum, and finds itself again.',
    detail:
      'No grain holds the word. Together, the scattered pieces keep finding their way back.',
    accent: 'sand',
  },
  {
    id: 'forms',
    label: 'Many forms',
    shortLabel: 'Forms',
    title: 'Rhythm. Interpretation. Pattern. Connection. Flock.',
    summary:
      'Five instruments turn touch into rhythm, gesture, pattern, connection, and flocking.',
    detail:
      'Each one gives the hand something different to do and the eye something different to follow.',
    accent: 'violet',
  },
  {
    id: 'scent',
    label: 'Scent',
    shortLabel: 'Scent',
    title: 'What can a machine smell?',
    summary:
      'A scent drifts, thins, mingles, and disappears. The plume gives the invisible a shape.',
    detail:
      'Move through the field and the scattered traces gather into a pattern you can disturb.',
    accent: 'sea',
  },
  {
    id: 'shapeshift',
    label: 'Shapeshift',
    shortLabel: 'Shift',
    title: 'A city, briefly.',
    summary:
      'Towers rise from dust. Streets hold for a moment. Then the structure loosens and begins again.',
    detail:
      'Nothing settles into a final state. The city exists only while its pieces agree to hold.',
    accent: 'violet',
  },
  {
    id: 'vision',
    label: 'Vision',
    shortLabel: 'Vision',
    title: 'The interface shapes the encounter.',
    summary:
      'A voice, a gesture, a chemical trace, a field of light: each form reveals a different machine.',
    detail:
      'Change the encounter and the machine appears to change with it.',
    accent: 'sand',
  },
];

export const CHAPTER_BY_ID = Object.fromEntries(
  CHAPTERS.map((chapter) => [chapter.id, chapter])
) as Record<string, ChapterSummary>;
