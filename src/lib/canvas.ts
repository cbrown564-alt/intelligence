export interface PointerState {
  x: number;
  y: number;
  px: number;
  py: number;
  down: boolean;
  active: boolean;
}

export function isLiteExperience(): boolean {
  return document.documentElement.dataset.quality === 'lite';
}

/**
 * Boots a resolution-aware, visibility-gated 2D canvas loop.
 * The draw callback receives css-pixel dimensions (ctx is pre-scaled by dpr).
 * Returns a cleanup function.
 */
export function startCanvas2D(
  canvas: HTMLCanvasElement,
  draw: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    p: PointerState
  ) => void
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let w = 0;
  let h = 0;
  let raf = 0;
  let running = false;
  const dpr = Math.min(window.devicePixelRatio || 1, isLiteExperience() ? 1 : 2);
  const pointer: PointerState = {
    x: -9999,
    y: -9999,
    px: -9999,
    py: -9999,
    down: false,
    active: false,
  };
  const t0 = performance.now();

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const setP = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.px = pointer.x;
    pointer.py = pointer.y;
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.active = true;
  };
  const onMove = (e: PointerEvent) => setP(e);
  const onDown = (e: PointerEvent) => {
    pointer.down = true;
    setP(e);
  };
  const onUp = () => {
    pointer.down = false;
  };
  const onLeave = () => {
    pointer.active = false;
    pointer.down = false;
    pointer.x = -9999;
    pointer.y = -9999;
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', onLeave);

  const loop = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) return;
    draw(ctx, w, h, (now - t0) / 1000, pointer);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        canvas.dataset.rendering = 'true';
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        canvas.dataset.rendering = 'false';
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0.02 }
  );
  io.observe(canvas);

  const onVisibilityChange = () => {
    if (!document.hidden && running) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  return () => {
    running = false;
    delete canvas.dataset.rendering;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointerleave', onLeave);
  };
}
