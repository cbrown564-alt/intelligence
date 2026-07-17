import {AbsoluteFill} from 'remotion';
import {COLOR, TAU, lerp, progress, seeded, smooth} from '../story';

const W = 1080;
const H = 1920;
const NEURON_COUNT = 92;

interface Neuron {
  x: number;
  y: number;
  r: number;
}

const NEURONS: Neuron[] = Array.from({length: NEURON_COUNT}, (_, index) => {
  const side = index % 2 === 0 ? -1 : 1;
  const angle = seeded(index, 101) * TAU;
  const radius = Math.sqrt(seeded(index, 103));
  const lobeX = 540 + side * 158;
  return {
    x: lobeX + Math.cos(angle) * radius * 205,
    y: 880 + Math.sin(angle) * radius * 390 + Math.cos(angle * 2) * 28,
    r: 2.4 + seeded(index, 107) * 4.4,
  };
});

const EDGES = Array.from({length: NEURON_COUNT * 2}, (_, index) => {
  const a = index % NEURON_COUNT;
  const offset = index < NEURON_COUNT ? 7 : 19;
  return [a, (a + offset) % NEURON_COUNT] as const;
}).filter(([a, b]) => Math.hypot(NEURONS[a].x - NEURONS[b].x, NEURONS[a].y - NEURONS[b].y) < 260);

function helixX(u: number, side: number, frame: number) {
  return 540 + Math.sin(u * TAU * 5.2 + frame / 42 + side * Math.PI) * 205;
}

export function BiologicalScene({frame}: {frame: number}) {
  const enter = progress(frame, 500, 548);
  const brain = enter * (1 - progress(frame, 690, 790));
  const dna = progress(frame, 630, 705) * (1 - progress(frame, 790, 850));
  const pulse = frame / 30;

  return (
    <AbsoluteFill style={{opacity: enter}}>
      <svg width={W} height={H} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="brainField">
            <stop offset="0" stopColor={COLOR.biology} stopOpacity="0.18" />
            <stop offset="0.62" stopColor={COLOR.electricity} stopOpacity="0.08" />
            <stop offset="1" stopColor={COLOR.ink} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="neuralCurrent" x1="0" x2="1">
            <stop offset="0" stopColor={COLOR.biologyLight} />
            <stop offset="0.55" stopColor={COLOR.biology} />
            <stop offset="1" stopColor={COLOR.electricityLight} />
          </linearGradient>
          <filter id="brainGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <clipPath id="brainClip">
            <path d="M 540 430 C 452 350 300 390 252 520 C 175 590 178 740 235 820 C 175 930 224 1088 338 1142 C 350 1260 455 1342 540 1252 C 625 1342 730 1260 742 1142 C 856 1088 905 930 845 820 C 902 740 905 590 828 520 C 780 390 628 350 540 430 Z" />
          </clipPath>
        </defs>

        <rect width={W} height={H} fill="#07070d" opacity={brain * 0.98} />
        <ellipse cx="540" cy="875" rx="490" ry="690" fill="url(#brainField)" opacity={brain} />

        <g opacity={brain}>
          <path
            d="M 540 430 C 452 350 300 390 252 520 C 175 590 178 740 235 820 C 175 930 224 1088 338 1142 C 350 1260 455 1342 540 1252 C 625 1342 730 1260 742 1142 C 856 1088 905 930 845 820 C 902 740 905 590 828 520 C 780 390 628 350 540 430 Z"
            fill={COLOR.biology}
            fillOpacity="0.025"
            stroke={COLOR.biologyLight}
            strokeOpacity="0.55"
            strokeWidth="5"
          />
          <path d="M 540 430 C 505 535 576 628 535 724 C 490 832 575 900 532 1012 C 505 1080 552 1160 540 1252" fill="none" stroke={COLOR.paper} strokeOpacity="0.24" strokeWidth="3" />
          {[
            'M 495 520 C 410 470 300 520 285 625',
            'M 475 625 C 360 585 255 690 292 792',
            'M 474 765 C 348 728 292 850 350 942',
            'M 470 930 C 346 916 320 1050 405 1118',
            'M 482 1080 C 412 1124 420 1202 487 1230',
            'M 585 520 C 670 470 780 520 795 625',
            'M 605 625 C 720 585 825 690 788 792',
            'M 606 765 C 732 728 788 850 730 942',
            'M 610 930 C 734 916 760 1050 675 1118',
            'M 598 1080 C 668 1124 660 1202 593 1230',
          ].map((path, index) => (
            <path key={path} d={path} fill="none" stroke={index % 2 ? COLOR.electricityLight : COLOR.biologyLight} strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" />
          ))}
          <g clipPath="url(#brainClip)">
            {EDGES.map(([a, b], index) => {
              const start = NEURONS[a];
              const end = NEURONS[b];
              const current = (pulse * (0.34 + seeded(index, 113) * 0.44) + seeded(index, 127)) % 1;
              const px = lerp(start.x, end.x, current);
              const py = lerp(start.y, end.y, current);
              return (
                <g key={`${a}-${b}`}>
                  <path d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2 + (seeded(index, 131) - 0.5) * 46} ${(start.y + end.y) / 2 + (seeded(index, 137) - 0.5) * 46} ${end.x} ${end.y}`} fill="none" stroke={index % 5 === 0 ? COLOR.electricity : COLOR.biology} strokeOpacity={0.11 + seeded(index, 139) * 0.15} strokeWidth={index % 7 === 0 ? 2.4 : 1.2} />
                  {index % 4 === 0 ? <circle cx={px} cy={py} r="3.4" fill={index % 8 === 0 ? COLOR.electricityLight : COLOR.biologyLight} fillOpacity="0.86" /> : null}
                </g>
              );
            })}
            {NEURONS.map((neuron, index) => {
              const firing = Math.max(0, Math.sin(pulse * (1.1 + seeded(index, 149)) + seeded(index, 151) * TAU));
              return (
                <g key={index}>
                  {firing > 0.84 ? <circle cx={neuron.x} cy={neuron.y} r={neuron.r * 5} fill={COLOR.biology} fillOpacity={0.16 * firing} filter="url(#brainGlow)" /> : null}
                  <circle cx={neuron.x} cy={neuron.y} r={neuron.r + firing * 1.7} fill={index % 6 === 0 ? COLOR.electricityLight : COLOR.biologyLight} fillOpacity={0.5 + firing * 0.38} />
                </g>
              );
            })}
          </g>
          {[0, 1, 2, 3].map((branch) => (
            <path key={branch} d={`M 540 430 C ${350 + branch * 125} 315, ${190 + branch * 230} 245, ${110 + branch * 285} 120`} fill="none" stroke={branch % 2 ? COLOR.electricityLight : COLOR.biologyLight} strokeOpacity="0.28" strokeWidth={branch === 2 ? 6 : 3} strokeDasharray="12 21" strokeDashoffset={-frame * (2.4 + branch * 0.3)} />
          ))}
        </g>

        <g opacity={dna}>
          <rect width={W} height={H} fill="#08070d" opacity="0.84" />
          {Array.from({length: 52}, (_, index) => {
            const u = index / 51;
            const y = 260 + u * 1390;
            const left = helixX(u, 0, frame);
            const right = helixX(u, 1, frame);
            const depth = (Math.cos(u * TAU * 5.2 + frame / 42) + 1) / 2;
            return (
              <g key={index}>
                <line x1={left} y1={y} x2={right} y2={y} stroke={index % 3 === 0 ? COLOR.electricityLight : COLOR.biologyLight} strokeOpacity={0.16 + depth * 0.36} strokeWidth={1.4 + depth * 2.2} />
                <circle cx={left} cy={y} r={3.6 + depth * 4} fill={COLOR.biology} />
                <circle cx={right} cy={y} r={3.6 + (1 - depth) * 4} fill={index % 4 === 0 ? COLOR.electricity : COLOR.biologyLight} />
              </g>
            );
          })}
          {[0, 1].map((side) => {
            const points = Array.from({length: 90}, (_, index) => {
              const u = index / 89;
              return `${index === 0 ? 'M' : 'L'} ${helixX(u, side, frame).toFixed(1)} ${(260 + u * 1390).toFixed(1)}`;
            }).join(' ');
            return <path key={side} d={points} fill="none" stroke={side === 0 ? COLOR.biology : COLOR.electricityLight} strokeOpacity="0.86" strokeWidth="6" />;
          })}
          <path d="M 190 1710 C 320 1620 760 1620 890 1710" fill="none" stroke={COLOR.chemical} strokeOpacity="0.26" strokeWidth="3" />
        </g>
      </svg>
    </AbsoluteFill>
  );
}
