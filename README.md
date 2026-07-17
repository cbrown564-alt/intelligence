# The Shape of Intelligence

An interactive visual essay about the forms, materials, and interfaces people give machine intelligence.

The written argument is the product. WebGL, canvas, audio, and scroll motion are progressive enhancements: readers must still receive the complete essay when motion is reduced, data saving is enabled, WebGL is unavailable, or an interaction cannot be used.

## Requirements

- Node.js 20 LTS
- npm 10 (the committed `package-lock.json` is canonical)
- Google Chrome for the committed desktop and mobile visual checks

## Commands

```powershell
npm ci
npm run dev
npm run check
```

`npm run check` runs ESLint, the semantic/source contract tests, the production build, the initial JavaScript budget, and Playwright checks at 1280 px, 390 px, and 320 px widths. The suite also exercises the layout at a 200% equivalent viewport. The entry bundle must remain below 150 KB gzip.

## Architecture

- `src/pages/Home.tsx` owns the essay shell, active chapter state, and near-viewport dynamic imports.
- `src/content/chapters.ts` owns the semantic preview shown before an interactive chapter loads or whenever motion is reduced.
- `src/components/ChapterArtwork.tsx` owns the five subject-specific static studies used by reduced motion and loading states.
- `src/components/EnhancementBoundary.tsx` keeps the semantic chapter available and offers recovery when a lazy interactive module fails.
- `src/components/ExperiencePreferences.tsx` owns persistent motion and rendering-detail preferences.
- `src/components/MatterCurrent.tsx` owns the continuous scroll and touch-responsive transformation shared by all six chapters.
- `src/components/LazyChapter.tsx` keeps chapter engines out of the initial route and mounts them near the viewport.
- `src/lib/canvas.ts` owns DPR, pointer, resize, visibility, and cleanup behavior for 2D canvases.
- `src/sections/*` owns the optional chapter-specific interaction layer.

The Hero's Three.js engine is also dynamically imported, so readable opening copy and a static poster arrive before WebGL.

## Accessibility contract

Every chapter must provide:

1. A unique heading.
2. A readable summary and explanation in the DOM.
3. A stable static composition before the interactive module loads.
4. A reduced-motion path that never imports the animated engine.
5. Pointer interaction that is optional rather than the only route to meaning.
6. WCAG AA text contrast and visible keyboard focus.

Canvas elements are hidden from the accessibility tree because their meaning is supplied by adjacent semantic text. Controls remain native buttons and links with 44 px minimum targets.

## Performance policy

- Dynamic-import every chapter engine.
- Keep no more than the near-viewport chapters active.
- Pause animation when a canvas or browser tab is hidden.
- Cap DPR and simulation size in Lite detail mode.
- Keep initial JavaScript below 150 KB gzip.
- Treat new continuous animation loops as a budget decision, not a default.
- The matter current is the single deliberate exception: 210 particles in Full detail, 92 particles at a capped frame rate in Lite detail, and no canvas in reduced motion.

## Editorial policy

The essay speaks through its scenes and interactions. Copy describes what a reader can see, hear, or change, then leaves room for interpretation. Avoid factual detours, defensive disclaimers, and abstract claims that the scene cannot carry.

## Deployment

`vite.config.ts` uses a relative base so the essay can be hosted below a subpath. Before a public launch, replace the relative social-preview URL in `index.html` with the final absolute deployment URL; Open Graph crawlers generally expect absolute image URLs.
