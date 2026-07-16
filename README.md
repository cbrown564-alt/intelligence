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

`npm run check` runs ESLint, the semantic/source contract tests, the production build, and the initial JavaScript budget. The entry bundle must remain below 150 KB gzip. Visual and responsive behavior should also be exercised in a real browser at desktop and 390 px mobile widths.

## Architecture

- `src/pages/Home.tsx` owns the essay shell, active chapter state, and near-viewport dynamic imports.
- `src/content/chapters.ts` owns the semantic preview shown before an interactive chapter loads or whenever motion is reduced.
- `src/components/ExperiencePreferences.tsx` owns persistent motion and rendering-detail preferences.
- `src/components/MatterCurrent.tsx` owns the continuous scroll and touch-responsive transformation shared by all eight chapters.
- `src/components/LazyChapter.tsx` keeps chapter engines out of the initial route and mounts them near the viewport.
- `src/lib/canvas.ts` owns DPR, pointer, resize, visibility, and cleanup behavior for 2D canvases.
- `src/sections/*` owns the optional chapter-specific interaction layer.
- `src/components/References.tsx` owns factual notes and external sources.

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

Factual, medical, and attributed claims require a visible source. Medical research must be described as research evidence rather than a diagnosis or deployed capability. Quotation marks are reserved for verified wording.

The current references cover silicon production, experimental breath-sensor research, and bacterial chemotaxis. Add new references in `src/components/References.tsx` and link them with `Footnote`.

## Deployment

`vite.config.ts` uses a relative base so the essay can be hosted below a subpath. Before a public launch, replace the relative social-preview URL in `index.html` with the final absolute deployment URL; Open Graph crawlers generally expect absolute image URLs.
