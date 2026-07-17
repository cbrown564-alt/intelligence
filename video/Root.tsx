import {Composition} from 'remotion';
import {ShapeOfIntelligenceVideo} from './ShapeOfIntelligenceVideo';
import {DURATION_IN_FRAMES, FPS, VIDEO_HEIGHT, VIDEO_WIDTH} from './timing';

export function VideoRoot() {
  return (
    <>
      <Composition
        id="ShapeOfIntelligence"
        component={ShapeOfIntelligenceVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="ShapeOfIntelligenceDelivery"
        component={ShapeOfIntelligenceVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={720}
        height={1280}
      />
    </>
  );
}
