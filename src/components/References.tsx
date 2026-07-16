const REFERENCES = [
  {
    id: 'ref-silicon',
    title: 'Silicon Statistics and Information',
    source: 'U.S. Geological Survey',
    href: 'https://www.usgs.gov/centers/national-minerals-information-center/silicon-statistics-and-information',
    note: 'Quartz or quartzite supplies silica for silicon metal; a small share is refined into semiconductor-grade silicon.',
  },
  {
    id: 'ref-breath',
    title:
      'Detection of lung, breast, colorectal, and prostate cancers from exhaled breath using a single array of nanosensors',
    source: 'Peng et al., British Journal of Cancer 103, 542–551 (2010)',
    href: 'https://www.nature.com/articles/6605810',
    note: 'A 177-participant research study of breath VOC patterns. It does not establish a standalone clinical diagnosis.',
  },
  {
    id: 'ref-chemotaxis',
    title: 'Chemotaxis in bacteria',
    source: 'Julius Adler, Science 153, 708–716 (1966)',
    href: 'https://pubmed.ncbi.nlm.nih.gov/4957395/',
    note: 'Experimental evidence that E. coli moves preferentially toward oxygen and several energy sources.',
  },
] as const;

export function Footnote({ reference }: { reference: (typeof REFERENCES)[number]['id'] }) {
  const index = REFERENCES.findIndex((item) => item.id === reference) + 1;
  return (
    <sup className="footnote-link">
      <a href={`#${reference}`} aria-label={`Reference ${index}`}>
        {index}
      </a>
    </sup>
  );
}

export function References() {
  return (
    <section className="references" aria-labelledby="references-title">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <h2 id="references-title">Sources, not scenery.</h2>
        <p className="references__lede">
          The visual language is speculative. These factual claims are not. Medical
          research cited here is promising evidence, not diagnostic advice.
        </p>
        <ol>
          {REFERENCES.map((reference, index) => (
            <li id={reference.id} key={reference.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <a href={reference.href} target="_blank" rel="noreferrer">
                  {reference.title}
                </a>
                <p>{reference.source}</p>
                <p>{reference.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

