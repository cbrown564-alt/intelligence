export function ChapterTradeoff({
  capability,
  blindSpot,
  className = '',
}: {
  capability: string;
  blindSpot: string;
  className?: string;
}) {
  return (
    <dl className={`chapter-tradeoff ${className}`}>
      <div>
        <dt>Reveals</dt>
        <dd>{capability}</dd>
      </div>
      <div>
        <dt>Obscures</dt>
        <dd>{blindSpot}</dd>
      </div>
    </dl>
  );
}
