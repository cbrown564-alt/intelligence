import {AbsoluteFill} from 'remotion';
import {fbm2} from '../../src/lib/noise';
import {COLOR, TAU, progress, seeded} from '../story';

const W = 1080;
const H = 1920;
const GOLDEN = 137.508 * (Math.PI / 180);

function musicPath(frame: number, voice: number) {
  return Array.from({length: 64}, (_, index) => {
    const u = index / 63;
    const envelope = Math.sin(u * Math.PI);
    const frequency = 1 + voice * 0.58;
    const y = 670 + voice * 150
      + Math.sin(u * 6.3 * frequency + frame / 14 + voice * 2.1)
      * Math.sin(u * 2.1 * frequency - frame / 23)
      * (74 - voice * 9)
      * envelope;
    return `${index === 0 ? 'M' : 'L'} ${(70 + u * 940).toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

interface CityCell {
  i: number;
  j: number;
  x: number;
  y: number;
  height: number;
  delay: number;
  color: string;
}

const CITY_SIDE = 15;
const CITY: CityCell[] = Array.from({length: CITY_SIDE * CITY_SIDE}, (_, index) => {
  const i = index % CITY_SIDE;
  const j = Math.floor(index / CITY_SIDE);
  const gx = i - (CITY_SIDE - 1) / 2;
  const gz = j - (CITY_SIDE - 1) / 2;
  const distance = Math.hypot(gx, gz) / 10;
  const noise = fbm2(gx * 0.17 + 4.2, gz * 0.17 - 2.7);
  const falloff = Math.max(0.18, 1 - distance * 0.58);
  const height = 22 + (28 + 270 * noise * noise) * falloff;
  return {
    i,
    j,
    x: 540 + (i - j) * 30,
    y: 1345 + (i + j - CITY_SIDE + 1) * 14,
    height,
    delay: seeded(index, 241) * 72,
    color: seeded(index, 251) > 0.91 ? COLOR.chemical : distance < 0.48 ? COLOR.sand : COLOR.electricity,
  };
}).sort((a, b) => (a.i + a.j) - (b.i + b.j));

function CityTower({cell, frame, dissolve}: {cell: CityCell; frame: number; dissolve: number}) {
  const rise = progress(frame, 1135 + cell.delay, 1248 + cell.delay * 0.22);
  const height = cell.height * rise * (1 - dissolve * 0.72);
  const drift = dissolve * (seeded(cell.i * 17 + cell.j, 257) - 0.5) * 220;
  const lift = dissolve * seeded(cell.i * 17 + cell.j, 263) * 310;
  const x = cell.x + drift;
  const y = cell.y - lift;
  const top = y - height;
  const halfW = 27;
  const halfD = 13;
  return (
    <g opacity={0.24 + rise * 0.76 - dissolve * 0.3}>
      <path d={`M ${x} ${top} L ${x + halfW} ${top + halfD} L ${x} ${top + halfD * 2} L ${x - halfW} ${top + halfD} Z`} fill={cell.color} fillOpacity="0.72" stroke={COLOR.paper} strokeOpacity="0.16" strokeWidth="1" />
      <path d={`M ${x - halfW} ${top + halfD} L ${x} ${top + halfD * 2} L ${x} ${y + halfD * 2} L ${x - halfW} ${y + halfD} Z`} fill={cell.color} fillOpacity="0.28" />
      <path d={`M ${x + halfW} ${top + halfD} L ${x} ${top + halfD * 2} L ${x} ${y + halfD * 2} L ${x + halfW} ${y + halfD} Z`} fill="#080913" fillOpacity="0.78" stroke={cell.color} strokeOpacity="0.3" strokeWidth="1" />
    </g>
  );
}

function FinalInsect({index, frame}: {index: number; frame: number}) {
  const angle = (index / 18) * TAU + frame / 190;
  const rx = 440;
  const ry = 555;
  const x = 540 + Math.cos(angle) * rx;
  const y = 900 + Math.sin(angle) * ry;
  const rotation = angle * 180 / Math.PI + 90;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`} opacity="0.56">
      <ellipse cx="-2" cy="5" rx="6" ry="3" fill={COLOR.paper} fillOpacity="0.25" />
      <ellipse cx="-2" cy="-5" rx="6" ry="3" fill={COLOR.paper} fillOpacity="0.25" />
      <path d="M 9 0 L -5 4 L -2 0 L -5 -4 Z" fill={index % 3 === 0 ? COLOR.chemical : COLOR.biologyLight} />
    </g>
  );
}

export function AlienScene({frame}: {frame: number}) {
  const enter = progress(frame, 990, 1034);
  const forms = enter * (1 - progress(frame, 1160, 1225));
  const spiral = progress(frame, 1015, 1080) * (1 - progress(frame, 1190, 1260));
  const city = progress(frame, 1125, 1185) * (1 - progress(frame, 1260, 1325));
  const dissolve = progress(frame, 1210, 1315);
  const finale = progress(frame, 1215, 1255) * (1 - progress(frame, 1280, 1340));
  const phylloCount = Math.floor(520 * progress(frame, 1020, 1138));

  return (
    <AbsoluteFill style={{opacity: enter}}>
      <svg width={W} height={H} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="alienField">
            <stop offset="0" stopColor="#173c43" stopOpacity="0.44" />
            <stop offset="0.44" stopColor="#2a214d" stopOpacity="0.3" />
            <stop offset="1" stopColor={COLOR.ink} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="alienThread" x1="0" x2="1">
            <stop offset="0" stopColor={COLOR.biology} />
            <stop offset="0.5" stopColor={COLOR.electricityLight} />
            <stop offset="1" stopColor={COLOR.chemical} />
          </linearGradient>
          <filter id="alienGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        <rect width={W} height={H} fill="#06060b" />
        <ellipse cx="540" cy="960" rx="620" ry="810" fill="url(#alienField)" />

        <g opacity={forms} fill="none" style={{mixBlendMode: 'screen'}}>
          {[0, 1, 2, 3].map((voice) => (
            <path key={voice} d={musicPath(frame, voice)} stroke={voice === 0 ? COLOR.sand : voice === 1 ? COLOR.electricityLight : voice === 2 ? COLOR.chemical : COLOR.paper} strokeOpacity={0.72 - voice * 0.1} strokeWidth={5 - voice * 0.7} />
          ))}
          <path d="M 70 1220 C 270 1010 375 1290 540 1100 C 710 900 860 1140 1010 970" stroke="url(#alienThread)" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="9 18" strokeDashoffset={-frame * 3.6} />
        </g>

        <g opacity={spiral} style={{mixBlendMode: 'screen'}}>
          {Array.from({length: phylloCount}, (_, index) => {
            const angle = index * GOLDEN + frame * 0.003;
            const radius = 11.8 * Math.sqrt(index);
            const x = 540 + Math.cos(angle) * radius;
            const y = 1010 + Math.sin(angle) * radius;
            const u = index / 520;
            return <circle key={index} cx={x} cy={y} r={1.8 + u * 3.4} fill={u < 0.38 ? COLOR.sandLight : u < 0.74 ? COLOR.electricityLight : COLOR.chemical} fillOpacity={0.42 + (1 - u) * 0.46} />;
          })}
          <circle cx="540" cy="1010" r={320} fill="none" stroke={COLOR.chemical} strokeOpacity="0.12" strokeWidth="2" />
        </g>

        <g opacity={city}>
          <path d="M 100 1378 L 540 1590 L 980 1378 L 540 1168 Z" fill="#0c1018" stroke={COLOR.silicon} strokeOpacity="0.38" strokeWidth="3" />
          {CITY.map((cell) => <CityTower key={`${cell.i}-${cell.j}`} cell={cell} frame={frame} dissolve={dissolve} />)}
        </g>

        <g opacity={finale} style={{mixBlendMode: 'screen'}}>
          <ellipse cx="540" cy="900" rx="330" ry="430" fill={COLOR.electricity} fillOpacity="0.07" filter="url(#alienGlow)" />
          {Array.from({length: 420}, (_, index) => {
            const angle = index * GOLDEN - frame * 0.002;
            const radius = 14.4 * Math.sqrt(index);
            const petal = 0.72 + Math.sin(angle * 5) * 0.22;
            const x = 540 + Math.cos(angle) * radius * petal;
            const y = 900 + Math.sin(angle) * radius * petal;
            const u = index / 420;
            return <circle key={index} cx={x} cy={y} r={1.5 + u * 2.8} fill={index % 11 === 0 ? COLOR.chemical : index % 3 === 0 ? COLOR.electricityLight : COLOR.biologyLight} fillOpacity={0.34 + (1 - u) * 0.5} />;
          })}
          {Array.from({length: 46}, (_, index) => {
            const u = index / 45;
            const y = 305 + u * 1230;
            const wave = Math.sin(u * TAU * 4.2 + frame / 48) * (130 + Math.sin(u * Math.PI) * 110);
            return (
              <g key={index}>
                <line x1={540 + wave} y1={y} x2={540 - wave} y2={y} stroke={index % 2 ? COLOR.electricityLight : COLOR.biologyLight} strokeOpacity="0.17" strokeWidth="2" />
                <circle cx={540 + wave} cy={y} r="4" fill={COLOR.biology} />
                <circle cx={540 - wave} cy={y} r="4" fill={COLOR.electricityLight} />
              </g>
            );
          })}
          {[0, 1, 2, 3, 4, 5].map((branch) => (
            <path key={branch} d={`M 540 900 C ${280 + branch * 105} ${730 - branch * 36}, ${160 + branch * 155} ${520 + branch * 70}, ${100 + branch * 180} ${260 + branch * 110}`} fill="none" stroke={branch % 3 === 0 ? COLOR.chemical : branch % 2 ? COLOR.electricityLight : COLOR.biologyLight} strokeOpacity="0.32" strokeWidth={branch % 2 ? 3 : 5} strokeDasharray="8 17" strokeDashoffset={-frame * (2.2 + branch * 0.2)} />
          ))}
          {Array.from({length: 18}, (_, index) => <FinalInsect key={index} index={index} frame={frame} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
