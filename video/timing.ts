export const FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const DURATION_IN_FRAMES = 1440;

// Each transition overlaps the scene before it. The matter never cuts away;
// it is continuously reassigned from one form to the next.
export const STORY_TRANSITIONS = [150, 300, 480, 680, 900, 1140, 1320] as const;
export const STORY_TRANSITION_DURATION = 92;
