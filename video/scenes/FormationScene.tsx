import {AbsoluteFill} from 'remotion';
import {COLOR, TAU, cubicBezier, lerp, progress, seeded, smooth} from '../story';

const W = 1080;
const H = 1920;
const GRAIN_COUNT = 460;

const CIRCUITS = [
  'M 270 975 H 410 V 855 H 535 V 735',
  'M 250 1065 H 360 V 1170 H 505 V 1280',
  'M 810 930 H 690 V 805 H 555',
  'M 830 1050 H 725 V 1175 H 590 V 1305',
  'M 330 820 H 430 V 910 H 625 V 1010 H 790',
  'M 315 1200 H 455 V 1085 H 630 V 950 H 770',
  'M 410 700 V 815 H 520 V 960 H 660',
  'M 675 715 V 835 H 585 V 1080 H 715 V 1260',
  'M 275 1015 H 485 V 1125 H 805',
  'M 340 1260 V 1140 H 540 V 865 H 735 V 760',
] as const;

function shoreline(x: number, frame: number) {
  return 675 + x * 0.36 + Math.sin(x * 0.009 + frame / 28) * 42;
}

function beachPoint(index: number, frame: number) {
  const x = seeded(index, 2) * (W + 140) - 70;
  const y = shoreline(x, frame) + 25 + seeded(index, 5) * 650;
  return {
    x: x + Math.sin(frame / 24 + seeded(index, 11) * TAU) * 10,
    y: y + Math.cos(frame / 31 + seeded(index, 19) * TAU) * 7,
  };
}

function waferPoint(index: number) {
  const u = (index + 0.5) / GRAIN_COUNT;
  const angle = index * 2.399963 + seeded(index, 37) * 0.12;
  const radius = Math.sqrt(u);
  return {
    x: 540 + Math.cos(angle) * radius * 374,
    y: 1010 + Math.sin(angle) * radius * 168,
  };
}

function grainPoint(index: number, frame: number) {
  const start = beachPoint(index, frame);
  const end = waferPoint(index);
  const gather = progress(frame, 118 + seeded(index, 43) * 70, 290 + seeded(index, 47) * 32);
  const lift = {
    x: lerp(start.x, 540, 0.32) + (seeded(index, 53) - 0.5) * 240,
    y: shoreline(start.x, frame) - 360 - seeded(index, 59) * 280,
  };
  const funnel = {
    x: 540 + Math.cos(seeded(index, 61) * TAU) * 190,
    y: 655 + seeded(index, 67) * 190,
  };
  return cubicBezier(start, lift, funnel, end, gather);
}

function Laser({frame, offset, originX}: {frame: number; offset: number; originX: number}) {
  const scan = Math.max(0, (frame - 286 - offset) / 118);
  const row = Math.min(7, Math.floor(scan * 8));
  const local = (scan * 8) % 1;
  const x = 285 + (row % 2 === 0 ? local : 1 - local) * 510 + offset * 0.7;
  const y = 805 + row * 57 + offset * 0.18;
  const opacity = progress(frame, 278 + offset, 300 + offset) * (1 - progress(frame, 414 + offset, 430 + offset));
  const originY = 330;
  return (
    <g opacity={opacity}>
      <path d={`M ${originX - 32} ${originY} L ${x - 10} ${y} L ${x + 10} ${y} L ${originX + 32} ${originY} Z`} fill={COLOR.laser} fillOpacity="0.07" />
      <path d={`M ${originX} ${originY} L ${x} ${y}`} stroke={COLOR.laser} strokeOpacity="0.84" strokeWidth="3.5" />
      <path d={`M ${originX} ${originY} L ${x} ${y}`} stroke={COLOR.paper} strokeOpacity="0.78" strokeWidth="1" />
      <circle cx={x} cy={y} r={18} fill={COLOR.laser} fillOpacity="0.22" />
      <circle cx={x} cy={y} r={5} fill={COLOR.paper} />
      <path d={`M ${originX} 254 V 288`} stroke={COLOR.silicon} strokeOpacity="0.8" strokeWidth="9" />
      <circle cx={originX} cy="254" r="12" fill="#101923" stroke={COLOR.silicon} strokeWidth="4" />
      <rect x={originX - 32} y="286" width="64" height="48" rx="6" fill="#24101a" stroke={COLOR.laser} strokeOpacity="0.72" strokeWidth="2" />
    </g>
  );
}

export function FormationScene({frame}: {frame: number}) {
  const beachFade = 1 - progress(frame, 185, 282);
  const chamber = progress(frame, 190, 292);
  const wafer = progress(frame, 210, 300) * (1 - progress(frame, 515, 555));
  const laser = progress(frame, 276, 310) * (1 - progress(frame, 410, 438));
  const etched = progress(frame, 292, 410);
  const electric = progress(frame, 406, 462) * (1 - progress(frame, 525, 570));
  const currentDash = -frame * 8;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#092b38" />
            <stop offset="0.55" stopColor={COLOR.water} />
            <stop offset="1" stopColor={COLOR.waterLight} />
          </linearGradient>
          <linearGradient id="beach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c77b36" />
            <stop offset="0.45" stopColor={COLOR.sand} />
            <stop offset="1" stopColor="#482517" />
          </linearGradient>
          <radialGradient id="waferFace">
            <stop offset="0" stopColor="#7e9bab" />
            <stop offset="0.52" stopColor="#345365" />
            <stop offset="1" stopColor={COLOR.siliconDark} />
          </radialGradient>
          <radialGradient id="waferHeat">
            <stop offset="0" stopColor={COLOR.sandLight} stopOpacity="0.72" />
            <stop offset="0.38" stopColor={COLOR.sand} stopOpacity="0.18" />
            <stop offset="1" stopColor={COLOR.sand} stopOpacity="0" />
          </radialGradient>
          <filter id="formationGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          <clipPath id="waferClip">
            <ellipse cx="540" cy="1010" rx="382" ry="176" />
          </clipPath>
        </defs>

        <g opacity={beachFade}>
          <rect width={W} height={H} fill="url(#sea)" />
          <path
            d={`M -80 ${shoreline(-80, frame)} C 230 ${shoreline(230, frame)}, 620 ${shoreline(620, frame)}, 1160 ${shoreline(1160, frame)} L 1160 2020 L -80 2020 Z`}
            fill="url(#beach)"
          />
          {[0, 1, 2, 3].map((wave) => (
            <path
              key={wave}
              d={`M -120 ${shoreline(-120, frame) - wave * 48} C 260 ${shoreline(260, frame) - wave * 48}, 690 ${shoreline(690, frame) - wave * 48}, 1190 ${shoreline(1190, frame) - wave * 48}`}
              fill="none"
              stroke={wave === 0 ? COLOR.paper : COLOR.waterLight}
              strokeOpacity={0.48 - wave * 0.08}
              strokeWidth={wave === 0 ? 8 : 3}
            />
          ))}
          <circle cx="920" cy="235" r="106" fill={COLOR.sandLight} fillOpacity="0.22" />
        </g>

        <rect width={W} height={H} fill="#07080d" opacity={chamber * 0.96} />
        <g opacity={chamber}>
          <path d="M 0 260 H 1080 M 0 1580 H 1080" stroke="#324452" strokeOpacity="0.26" strokeWidth="2" />
          <path d="M 120 0 V 1920 M 960 0 V 1920" stroke="#324452" strokeOpacity="0.16" strokeWidth="2" />
        </g>

        <g style={{mixBlendMode: 'screen'}}>
          {Array.from({length: GRAIN_COUNT}, (_, index) => {
            const point = grainPoint(index, frame);
            const gathering = progress(frame, 118 + seeded(index, 43) * 70, 290 + seeded(index, 47) * 32);
            const size = 1.6 + seeded(index, 73) * 3.8;
            return (
              <g key={index}>
                {gathering > 0.05 && gathering < 0.98 ? (
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={point.x - (540 - point.x) * 0.025}
                    y2={point.y + 10 + seeded(index, 79) * 18}
                    stroke={COLOR.sandLight}
                    strokeOpacity="0.26"
                    strokeWidth={Math.max(0.8, size * 0.42)}
                  />
                ) : null}
                <circle cx={point.x} cy={point.y} r={size} fill={index % 9 === 0 ? COLOR.paper : COLOR.sand} fillOpacity={0.58 + seeded(index, 83) * 0.36} />
              </g>
            );
          })}
        </g>

        <g opacity={wafer}>
          <ellipse cx="540" cy="1040" rx="386" ry="178" fill="#0b1118" stroke="#6f8793" strokeWidth="5" />
          <ellipse cx="540" cy="1010" rx="386" ry="178" fill="url(#waferFace)" stroke={COLOR.silicon} strokeOpacity="0.85" strokeWidth="5" />
          <ellipse cx="540" cy="1010" rx="326" ry="142" fill="url(#waferHeat)" opacity={1 - etched * 0.7} filter="url(#formationGlow)" />
          <g clipPath="url(#waferClip)" opacity={0.42 + etched * 0.42}>
            {Array.from({length: 11}, (_, index) => (
              <path key={`col-${index}`} d={`M ${250 + index * 58} 770 V 1250`} stroke={index % 2 ? COLOR.electricity : COLOR.chemical} strokeOpacity="0.25" strokeWidth="2" transform="skewY(-9)" />
            ))}
            {Array.from({length: 8}, (_, index) => (
              <path key={`row-${index}`} d={`M 130 ${820 + index * 55} H 950`} stroke={index % 2 ? COLOR.chemical : COLOR.electricity} strokeOpacity="0.2" strokeWidth="2" />
            ))}
            {CIRCUITS.map((path, index) => (
              <path
                key={path}
                d={path}
                fill="none"
                pathLength={1}
                stroke={index % 3 === 0 ? COLOR.chemical : index % 2 ? COLOR.electricityLight : COLOR.sandLight}
                strokeOpacity={0.7}
                strokeWidth={index % 3 === 0 ? 5 : 3}
                strokeDasharray={1}
                strokeDashoffset={1 - etched}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {Array.from({length: 18}, (_, index) => {
              const angle = index * 2.399963;
              const radius = 45 + (index % 5) * 52;
              return <circle key={index} cx={540 + Math.cos(angle) * radius} cy={1010 + Math.sin(angle) * radius * 0.45} r={7 + (index % 3) * 2} fill="#0a1118" stroke={index % 2 ? COLOR.electricityLight : COLOR.chemical} strokeWidth="3" />;
            })}
          </g>
        </g>

        {laser > 0 ? (
          <g>
            <path d="M 110 252 H 970" stroke={COLOR.silicon} strokeOpacity={laser * 0.62} strokeWidth="14" />
            <path d="M 110 252 H 970" stroke={COLOR.paper} strokeOpacity={laser * 0.22} strokeWidth="2" />
            {[150, 930].map((x) => <path key={x} d={`M ${x} 252 V 430`} stroke={COLOR.silicon} strokeOpacity={laser * 0.26} strokeWidth="8" />)}
            <Laser frame={frame} offset={0} originX={270} />
            <Laser frame={frame} offset={14} originX={540} />
            <Laser frame={frame} offset={27} originX={810} />
          </g>
        ) : null}

        <g opacity={electric} clipPath="url(#waferClip)" style={{mixBlendMode: 'screen'}}>
          {CIRCUITS.map((path, index) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={index % 3 === 0 ? COLOR.chemical : COLOR.electricityLight}
              strokeOpacity="0.88"
              strokeWidth={index % 3 === 0 ? 7 : 5}
              strokeDasharray="18 36"
              strokeDashoffset={currentDash - index * 13}
              strokeLinecap="round"
              filter="url(#formationGlow)"
            />
          ))}
        </g>

        <path d="M 906 954 L 932 974 L 909 992 Z" fill="#07080d" opacity={wafer} />

        <g opacity={electric} style={{mixBlendMode: 'screen'}}>
          {[0, 1, 2, 3, 4].map((branch) => {
            const x = 360 + branch * 90;
            return (
              <path
                key={branch}
                d={`M 540 910 C ${x + Math.sin(frame / 6 + branch) * 50} 730, ${x - 120} 540, ${180 + branch * 180} 280`}
                fill="none"
                stroke={branch % 2 ? COLOR.electricityLight : COLOR.chemical}
                strokeOpacity={0.32 + (branch % 2) * 0.18}
                strokeWidth={branch === 2 ? 8 : 3}
                strokeDasharray="14 24"
                strokeDashoffset={-frame * (3 + branch * 0.3)}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
}
