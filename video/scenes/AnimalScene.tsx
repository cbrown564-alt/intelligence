import {AbsoluteFill} from 'remotion';
import {COLOR, TAU, progress, seeded} from '../story';

const W = 1080;
const H = 1920;
const INSECT_COUNT = 84;

function swarmPoint(index: number, frame: number) {
  const time = (frame - 748) / 30;
  const migration = progress(frame, 748, 1008);
  const orbit = seeded(index, 173) * TAU + time * (0.55 + seeded(index, 179) * 0.72);
  const radius = 55 + Math.sqrt(seeded(index, 181)) * 320;
  const centerX = 260 + migration * 430 + Math.sin(time * 0.37) * 70;
  const centerY = 845 + Math.sin(time * 0.48) * 140;
  const stream = progress(frame, 890 + seeded(index, 191) * 45, 1020);
  return {
    x: centerX + Math.cos(orbit) * radius * (1.15 - stream * 0.35) + stream * seeded(index, 193) * 230,
    y: centerY + Math.sin(orbit) * radius * 0.65 + stream * (seeded(index, 197) - 0.5) * 420,
    angle: orbit + Math.PI / 2 + Math.sin(time + index) * 0.28,
    scale: 0.65 + seeded(index, 199) * 0.8,
  };
}

function insectPath(scale: number) {
  return `M ${8 * scale} 0 L ${-4 * scale} ${3.6 * scale} L ${-1.8 * scale} 0 L ${-4 * scale} ${-3.6 * scale} Z`;
}

function Molecule({x, y, radius, rotation = 0, opacity = 1}: {x: number; y: number; radius: number; rotation?: number; opacity?: number}) {
  const points = Array.from({length: 6}, (_, index) => {
    const angle = rotation + (index / 6) * TAU;
    return {x: x + Math.cos(angle) * radius, y: y + Math.sin(angle) * radius};
  });
  return (
    <g opacity={opacity}>
      <path d={`${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} Z`} fill={COLOR.chemical} fillOpacity="0.05" stroke={COLOR.chemical} strokeOpacity="0.68" strokeWidth="2" />
      {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.2" fill={index % 2 ? COLOR.paper : COLOR.chemical} />)}
    </g>
  );
}

export function AnimalScene({frame}: {frame: number}) {
  const enter = progress(frame, 748, 790);
  const swarm = enter * (1 - progress(frame, 985, 1060));
  const chemical = progress(frame, 850, 900) * (1 - progress(frame, 1030, 1090));
  const receptor = progress(frame, 930, 982) * (1 - progress(frame, 1050, 1100));
  const time = (frame - 748) / 30;

  return (
    <AbsoluteFill style={{opacity: enter}}>
      <svg width={W} height={H} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="swarmField">
            <stop offset="0" stopColor={COLOR.chemicalDark} stopOpacity="0.26" />
            <stop offset="0.58" stopColor={COLOR.biology} stopOpacity="0.07" />
            <stop offset="1" stopColor={COLOR.ink} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pheromone" x1="0" x2="1">
            <stop offset="0" stopColor={COLOR.biology} />
            <stop offset="0.48" stopColor={COLOR.chemical} />
            <stop offset="1" stopColor={COLOR.electricityLight} />
          </linearGradient>
          <filter id="chemicalGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <rect width={W} height={H} fill="#05090a" opacity="0.98" />
        <ellipse cx="510" cy="900" rx="570" ry="680" fill="url(#swarmField)" opacity={swarm} />

        <g opacity={chemical} fill="none" strokeLinecap="round">
          {[0, 1, 2, 3].map((trail) => (
            <path
              key={trail}
              d={`M ${60 - trail * 50} ${710 + trail * 170} C ${260 + Math.sin(time + trail) * 80} ${470 + trail * 230}, ${570 + Math.cos(time * 0.7 + trail) * 100} ${1260 - trail * 150}, ${1080 + trail * 55} ${610 + trail * 230}`}
              stroke="url(#pheromone)"
              strokeOpacity={0.22 + trail * 0.07}
              strokeWidth={trail % 2 ? 5 : 3}
              strokeDasharray={trail % 2 ? '3 18' : '10 20'}
              strokeDashoffset={-frame * (2.2 + trail * 0.45)}
            />
          ))}
        </g>

        <g opacity={swarm}>
          {Array.from({length: INSECT_COUNT}, (_, index) => {
            const point = swarmPoint(index, frame);
            const wing = 4 + Math.sin(frame / 2.3 + index * 1.8) * 2.4;
            return (
              <g key={index} transform={`translate(${point.x} ${point.y}) rotate(${point.angle * 180 / Math.PI})`}>
                <ellipse cx={-1} cy={wing} rx={5 * point.scale} ry={2.6 * point.scale} fill={COLOR.paper} fillOpacity="0.22" transform="rotate(-28)" />
                <ellipse cx={-1} cy={-wing} rx={5 * point.scale} ry={2.6 * point.scale} fill={COLOR.paper} fillOpacity="0.22" transform="rotate(28)" />
                <path d={insectPath(1.25 * point.scale)} fill={index % 9 === 0 ? COLOR.chemical : COLOR.biologyLight} fillOpacity={0.7 + seeded(index, 211) * 0.25} />
                <circle cx={4.5 * point.scale} cy="0" r={2 * point.scale} fill={COLOR.sandLight} />
              </g>
            );
          })}
        </g>

        <g opacity={chemical}>
          {Array.from({length: 16}, (_, index) => {
            const u = (index + ((frame - 850) * 0.005)) % 1;
            const x = 120 + u * 820;
            const y = 880 + Math.sin(u * TAU * 2.2 + index) * (120 + u * 240);
            return <Molecule key={index} x={x} y={y} radius={11 + (index % 3) * 4} rotation={time * 0.15 + index} opacity={0.28 + seeded(index, 223) * 0.55} />;
          })}
          <circle cx="180" cy="910" r="96" fill={COLOR.chemical} fillOpacity="0.08" filter="url(#chemicalGlow)" />
        </g>

        <g opacity={receptor}>
          <path d="M 870 420 C 780 540 790 710 845 825 C 900 940 820 1055 840 1235 C 855 1375 940 1470 1020 1545" fill="none" stroke={COLOR.silicon} strokeOpacity="0.52" strokeWidth="24" />
          <path d="M 905 455 C 842 580 850 720 897 820 C 947 930 875 1060 892 1215 C 905 1325 960 1410 1025 1475" fill="none" stroke={COLOR.electricity} strokeOpacity="0.34" strokeWidth="5" />
          {Array.from({length: 7}, (_, index) => {
            const y = 610 + index * 125;
            const x = 855 + Math.sin(index * 0.9) * 24;
            const active = progress(frame, 946 + index * 9, 1000 + index * 9);
            return (
              <g key={index}>
                <path d={`M ${x} ${y} C ${x - 92} ${y - 44}, ${x - 92} ${y + 44}, ${x} ${y + 18}`} fill="none" stroke={index % 2 ? COLOR.chemical : COLOR.electricityLight} strokeOpacity={0.35 + active * 0.5} strokeWidth={3 + active * 3} />
                <circle cx={x - 84} cy={y - 2} r={6 + active * 5} fill={COLOR.chemical} fillOpacity={0.45 + active * 0.4} />
              </g>
            );
          })}
          {[0, 1, 2].map((signal) => (
            <path key={signal} d={`M 882 ${680 + signal * 220} C 940 ${720 + signal * 170}, 930 ${870 + signal * 130}, 1045 ${930 + signal * 110}`} fill="none" stroke={signal === 1 ? COLOR.chemical : COLOR.electricityLight} strokeOpacity="0.7" strokeWidth="4" strokeDasharray="9 17" strokeDashoffset={-frame * 4.5 - signal * 12} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
