import { useEffect, useRef } from 'react';
import { lerp, smoothstep } from '@/lib/noise';

const BUZZ =
  'SYNERGY · 10X · LEVERAGE · THOUGHT LEADER · GAME-CHANGER · DISRUPT · AGITATED? NO — AGENTIC · ';

export function SlopChapter() {
  const wrapRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const marquee = marqueeRef.current;
    const veil = veilRef.current;
    const verdict = verdictRef.current;
    const explanation = explanationRef.current;
    const status = statusRef.current;
    if (!wrap || !card || !marquee || !veil || !verdict || !explanation || !status) {
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));

      const degrade = smoothstep(0, 0.45, progress);
      const dissolve = smoothstep(0.42, 0.85, progress);
      const reveal = smoothstep(0.62, 0.9, progress);
      const explain = smoothstep(0.75, 1, progress);

      card.style.transform = `rotate(${degrade * 12}deg) scale(${
        1 - degrade * 0.15 - dissolve * 0.35
      }) translateY(${degrade * 36}px)`;
      card.style.filter = `saturate(${1 - degrade}) blur(${degrade * 1.5}px)`;
      card.style.opacity = `${1 - dissolve}`;
      marquee.style.opacity = `${0.6 * (1 - degrade)}`;
      status.style.opacity = `${1 - dissolve}`;
      veil.style.opacity = `${dissolve}`;
      verdict.style.opacity = `${reveal}`;
      verdict.style.transform = `translateY(${lerp(24, 0, reveal)}px)`;
      explanation.style.opacity = `${explain}`;
      explanation.style.transform = `translateY(${lerp(18, 0, explain)}px)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="slop" ref={wrapRef} className="relative h-[230vh]" aria-labelledby="slop-title">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-[#26262a]">
        <div ref={veilRef} className="pointer-events-none absolute inset-0 bg-ink opacity-0" />

        <div ref={marqueeRef} className="absolute top-20 left-0 w-full overflow-hidden opacity-60" aria-hidden="true">
          <div className="slop-marquee">
            <span>{BUZZ.repeat(3)}</span>
            <span>{BUZZ.repeat(3)}</span>
          </div>
        </div>

        <div ref={cardRef} className="slop-card relative mx-6 w-full max-w-md rounded-xl border border-neutral-600 bg-[#2e2e33] p-5">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 80 80" className="h-11 w-11 rounded-full bg-neutral-700" aria-hidden="true">
              <ellipse cx="40" cy="42" rx="24" ry="27" fill="#8a7f74" />
              <circle cx="31" cy="37" r="6.5" fill="#f5f5f5" />
              <circle cx="32" cy="38" r="3" fill="#222" />
              <circle cx="55" cy="35" r="3" fill="#f5f5f5" />
              <circle cx="55.5" cy="35.5" r="1.4" fill="#222" />
              <path d="M28 55 Q40 62 53 53" stroke="#3a3a3a" strokeWidth="2.5" fill="none" />
              <path d="M22 26 Q30 20 38 25" stroke="#4a4a4a" strokeWidth="2" fill="none" />
              <ellipse cx="63" cy="50" rx="4" ry="8" fill="#8a7f74" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-neutral-100">Definitely A. Human</p>
              <p className="text-xs text-neutral-300">CEO · Visionary · AI Evangelist · 3rd+</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-neutral-100">
            🚀 Thrilled to announce that I leveraged AI to 10x my synergy!! This
            changes EVERYTHING. Agree?? 👇
            <span className="block mt-2 text-neutral-300">#innovation #disruption #blessed</span>
          </p>

          <div className="relative mt-4 flex h-32 items-end justify-center gap-1.5 overflow-hidden rounded-lg border border-neutral-600 bg-[#3a3a40] pb-4" aria-hidden="true">
            {[52, 74, 88, 95, 82, 68, 45].map((height, index) => (
              <div
                key={height}
                className="w-4 rounded-t-full bg-[#8a7f74]"
                style={{ height: `${height}%`, transform: `rotate(${(index - 3) * 6}deg)` }}
              />
            ))}
            <span className="absolute bottom-1.5 right-2 text-xs text-red-300">7 fingers detected</span>
          </div>

          <div className="mt-4 flex items-center gap-3" aria-hidden="true">
            <span className="rounded-md bg-neutral-600 px-4 py-2 text-xs text-neutral-300 line-through">Click here</span>
            <span className="text-xs text-red-300">Error: undefined is not a function</span>
          </div>
        </div>

        <div ref={statusRef} className="absolute bottom-20 flex items-center gap-3 text-neutral-300" aria-hidden="true">
          <span className="slop-spinner block h-4 w-4 rounded-full border-2 border-neutral-600 border-t-neutral-200" />
          <span className="text-xs uppercase tracking-[0.22em]">generating…</span>
        </div>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div ref={verdictRef} className="opacity-0">
            <h2 id="slop-title" className="font-serif-display text-paper text-4xl md:text-6xl font-light leading-tight max-w-3xl">
              This is what magic becomes
              <br />
              <em className="text-sand">without a vision.</em>
            </h2>
          </div>
          <p ref={explanationRef} className="mt-8 max-w-lg text-sm md:text-base leading-relaxed text-paper/70 font-light opacity-0">
            Badly written posts. Deformed faces. Software that does not work. The
            slop is not a failure of intelligence — it is a failure of{' '}
            <span className="text-violet-glow">imagination and judgment</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
