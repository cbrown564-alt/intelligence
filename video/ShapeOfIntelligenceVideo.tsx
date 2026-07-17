import {fontFamily as atkinson, loadFont as loadAtkinson} from '@remotion/google-fonts/AtkinsonHyperlegibleNext';
import {fontFamily as petrona, loadFont as loadPetrona} from '@remotion/google-fonts/Petrona';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AlienScene} from './scenes/AlienScene';
import {AnimalScene} from './scenes/AnimalScene';
import {BiologicalScene} from './scenes/BiologicalScene';
import {FormationScene} from './scenes/FormationScene';
import {COLOR, progress, windowOpacity} from './story';

loadPetrona('normal', {weights: ['300', '400', '500'], subsets: ['latin']});
loadAtkinson('normal', {weights: ['400', '500'], subsets: ['latin']});

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const COPY = [
  {start: 18, end: 120, text: ['What is the shape', 'of intelligence?'], size: 82, align: 'top'},
  {start: 132, end: 270, text: ['First, we', 'shaped sand.'], size: 82, align: 'bottom'},
  {start: 286, end: 410, text: ['Purified into silicon.', 'Etched with light.'], size: 67, align: 'top'},
  {start: 424, end: 522, text: ['Electricity', 'activated the machine.'], size: 70, align: 'bottom'},
  {start: 538, end: 640, text: ['But intelligence', 'was already alive.'], size: 70, align: 'top'},
  {start: 650, end: 754, text: ['In brains.', 'In every cell.'], size: 80, align: 'bottom'},
  {start: 770, end: 872, text: ['A swarm thinks', 'in motion.'], size: 76, align: 'top'},
  {start: 884, end: 990, text: ['It speaks', 'in chemicals.'], size: 80, align: 'bottom'},
  {start: 1004, end: 1128, text: ['We translate that language', 'into signal.'], size: 68, align: 'top'},
  {start: 1150, end: 1272, text: ['Then build new', 'interfaces with it.'], size: 76, align: 'bottom'},
] as const;

function CopyLayer({frame}: {frame: number}) {
  const finalOpacity = windowOpacity(frame, 1302, 1439, 36);
  const finalY = interpolate(frame, [1302, 1360], [30, 0], {...CLAMP, easing: EASE_OUT});

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {COPY.map((line) => {
        const opacity = windowOpacity(frame, line.start, line.end, 20);
        const y = interpolate(frame, [line.start, line.start + 34, line.end - 18, line.end], [26, 0, 0, -10], {...CLAMP, easing: EASE_OUT});
        return (
          <div
            key={line.start}
            style={{
              position: 'absolute',
              left: 72,
              right: 72,
              top: line.align === 'top' ? 220 : undefined,
              bottom: line.align === 'bottom' ? 220 : undefined,
              color: COLOR.paper,
              fontFamily: petrona,
              fontSize: line.size,
              fontWeight: 350,
              letterSpacing: '-0.032em',
              lineHeight: 1.02,
              opacity,
              transform: `translateY(${y}px)`,
              textShadow: '0 3px 26px rgba(6,5,10,0.98)',
            }}
          >
            {line.text.map((part) => <div key={part}>{part}</div>)}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 94px',
          color: COLOR.paper,
          fontFamily: petrona,
          fontSize: 76,
          fontWeight: 350,
          letterSpacing: '-0.032em',
          lineHeight: 1.04,
          textAlign: 'center',
          background: 'radial-gradient(ellipse 66% 24% at 50% 50%, rgba(6,5,10,0.88), rgba(6,5,10,0.28) 58%, transparent 76%)',
          opacity: finalOpacity,
          transform: `translateY(${finalY}px)`,
          textShadow: '0 3px 34px rgba(6,5,10,1)',
        }}
      >
        <span>New senses bring<br />a different machine into view.</span>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 48,
          bottom: 34,
          color: COLOR.paper,
          fontFamily: atkinson,
          fontSize: 19,
          letterSpacing: '0.04em',
          opacity: interpolate(frame, [1368, 1439], [0, 0.42], CLAMP),
        }}
      >
        THE SHAPE OF INTELLIGENCE
      </div>
    </AbsoluteFill>
  );
}

function SignalFilament({frame}: {frame: number}) {
  const enter = progress(frame, 990, 1055);
  const settle = progress(frame, 1260, 1395);
  const amplitude = 110 * (1 - settle);
  const signalY = 1040;
  const opacity = enter * (0.56 + settle * 0.44);
  const path = [0, 1, 2, 3, 4, 5, 6].map((index) => {
    const x = 90 + index * 150;
    const y = signalY + Math.sin(index * 1.7 + frame / 34) * amplitude;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <linearGradient
            id="handoffSignal"
            gradientUnits="userSpaceOnUse"
            x1="90"
            y1={signalY}
            x2="990"
            y2={signalY}
          >
            <stop offset="0" stopColor={COLOR.chemical} stopOpacity="0" />
            <stop offset="0.48" stopColor={COLOR.chemical} />
            <stop offset="0.52" stopColor={COLOR.paper} />
            <stop offset="1" stopColor={COLOR.sand} stopOpacity="0" />
          </linearGradient>
          <filter id="handoffGlow" x="-100%" y="-300%" width="300%" height="700%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <path d={path} fill="none" stroke="url(#handoffSignal)" strokeWidth={settle > 0.8 ? 3 : 4} strokeLinecap="round" />
        <path d={path} fill="none" stroke={COLOR.chemical} strokeOpacity="0.24" strokeWidth="20" filter="url(#handoffGlow)" />
        <circle cx="540" cy={signalY + Math.sin(3 * 1.7 + frame / 34) * amplitude} r={6 + settle * 2} fill={COLOR.paper} />
      </svg>
    </AbsoluteFill>
  );
}

export function ShapeOfIntelligenceVideo() {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const scale = Math.min(width / 1080, height / 1920);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: COLOR.ink}}>
      <div
        style={{
          position: 'absolute',
          left: (width - 1080 * scale) / 2,
          top: (height - 1920 * scale) / 2,
          width: 1080,
          height: 1920,
          overflow: 'hidden',
          fontFamily: atkinson,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <FormationScene frame={frame} />
        <BiologicalScene frame={frame} />
        <AnimalScene frame={frame} />
        <AlienScene frame={frame} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 98% 88% at 50% 50%, transparent 42%, rgba(6,5,10,0.24) 72%, rgba(6,5,10,0.82) 100%)'}} />
        <SignalFilament frame={frame} />
        <CopyLayer frame={frame} />
      </div>
    </AbsoluteFill>
  );
}
