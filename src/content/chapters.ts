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
  capability: string;
  blindSpot: string;
  accent: 'sand' | 'violet' | 'sea' | 'rose';
}

export const CHAPTERS: ChapterSummary[] = [
  {
    id: 'shape',
    label: 'Shape',
    shortLabel: 'Shape',
    title: 'What is the shape of intelligence?',
    summary:
      'We give a signal an interface, then meet the machine through what that interface can reveal.',
    detail:
      'Change the encounter and a different machine comes into view. Every form reveals something and obscures something else.',
    capability: 'A contour makes boundary and relation legible.',
    blindSpot: 'A clean outline hides the material, scale, and history inside it.',
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
      'Force makes response, resistance, and recovery visible. It cannot explain why the pieces return.',
    capability: 'Force reveals response, resistance, and recovery.',
    blindSpot: 'The hand feels motion but not the rule that draws the pieces back.',
    accent: 'sand',
  },
  {
    id: 'forms',
    label: 'Many forms',
    shortLabel: 'Forms',
    title: 'Rhythm. Pattern. Flock.',
    summary:
      'Three instruments turn one screen into a string, a spiral, and a flock.',
    detail:
      'Each instrument magnifies one behaviour and discards the rest.',
    capability: 'Different instruments expose frequency, repeated order, and collective motion.',
    blindSpot: 'Each instrument reduces the signal to the features it can measure.',
    accent: 'violet',
  },
  {
    id: 'scent',
    label: 'Scent',
    shortLabel: 'Scent',
    title: 'What can a machine smell?',
    summary:
      'A chemical trace drifts, thins, mingles, and disappears. A sensor gives the invisible a reading.',
    detail:
      'One receptor can confuse crossing plumes. Compare a second channel to see what the first reading missed.',
    capability: 'Chemical sensing detects traces beyond image and sound.',
    blindSpot: 'A single reading can point to the wrong source when traces mix or drift.',
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
      'The skyline makes local rules visible at scale, but hides the individual pieces and costs inside the pattern.',
    capability: 'Procedural rules reveal how local agreements form a large structure.',
    blindSpot: 'The skyline hides the pieces and costs displaced by the pattern.',
    accent: 'violet',
  },
  {
    id: 'vision',
    label: 'Vision',
    shortLabel: 'Vision',
    title: 'Every interface is a partial view.',
    summary:
      'A voice, a gesture, a chemical trace, a field of light: each encounter reveals a different machine.',
    detail:
      'No synthesis is complete. The form that gathers the views also decides what falls away.',
    capability: 'Comparison reveals that no single interface is the machine.',
    blindSpot: 'A synthesis can falsely suggest that the whole machine is finally in view.',
    accent: 'sand',
  },
];

export const CHAPTER_BY_ID = Object.fromEntries(
  CHAPTERS.map((chapter) => [chapter.id, chapter])
) as Record<string, ChapterSummary>;
