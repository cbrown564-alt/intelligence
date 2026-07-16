export interface ChapterSummary {
  id: string;
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
      'It has no body. And yet we reach for it — through glass, sound, and silicon.',
    detail:
      'The opening particle form moves between a sphere, a knot, and a cloud. The motion is optional; the question is not.',
    accent: 'sand',
  },
  {
    id: 'touch',
    label: 'Touch',
    shortLabel: 'Touch',
    title: 'Can we touch it?',
    summary:
      'A word built from simple particles scatters under a pointer, then remembers its shape.',
    detail:
      'The interaction demonstrates emergence: no grain knows the word, but local movement preserves a larger form.',
    accent: 'sand',
  },
  {
    id: 'forms',
    label: 'Many forms',
    shortLabel: 'Forms',
    title: 'Music. Art. Math. Science. Nature.',
    summary:
      'Five small instruments translate the same idea into rhythm, flow, pattern, connection, and flocking.',
    detail:
      'The canvas layer is playful, not required. Each instrument is described in text and can be skipped without losing the chapter’s point.',
    accent: 'violet',
  },
  {
    id: 'silicon',
    label: 'Silicon',
    shortLabel: 'Silicon',
    title: 'Teaching sand how to think.',
    summary:
      'Silica-bearing quartz is refined into silicon; small quantities become the high-purity material used in semiconductors.',
    detail:
      'The metaphor compresses a long industrial process. The references below separate the physical fact from the poetic claim.',
    accent: 'violet',
  },
  {
    id: 'scent',
    label: 'Scent',
    shortLabel: 'Scent',
    title: 'Teaching computers how to smell.',
    summary:
      'Experimental sensor arrays classify patterns of volatile compounds in breath. They are research systems, not standalone diagnoses.',
    detail:
      'Bacteria also respond to chemical gradients through chemotaxis — a reminder that sensing is older and broader than vision or language.',
    accent: 'sea',
  },
  {
    id: 'shapeshift',
    label: 'Shapeshift',
    shortLabel: 'Shift',
    title: 'A shapeshifter, caught mid-form.',
    summary:
      'A procedural city assembles, loosens into dust, and reforms without a fixed final state.',
    detail:
      'The scene treats machine intelligence as a changing space of possibilities rather than a single face or chat box.',
    accent: 'violet',
  },
  {
    id: 'slop',
    label: 'Slop',
    shortLabel: 'Slop',
    title: 'What magic becomes without a vision.',
    summary:
      'Bad output is not evidence that the underlying capability is trivial. It is evidence that direction, care, and judgment still matter.',
    detail:
      'In reduced-motion mode the critique appears directly, without the long degradation sequence.',
    accent: 'rose',
  },
  {
    id: 'vision',
    label: 'Vision',
    shortLabel: 'Vision',
    title: 'We need a clear vision.',
    summary:
      'Not another chat box by default. A way of meeting machine intelligence that can be tactile, visual, musical, and legible.',
    detail:
      'The ending returns to the opening question: the shape is partly determined by the interfaces and intentions we give it.',
    accent: 'sand',
  },
];

export const CHAPTER_BY_ID = Object.fromEntries(
  CHAPTERS.map((chapter) => [chapter.id, chapter])
) as Record<string, ChapterSummary>;

