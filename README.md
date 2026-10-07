# The Shape of Intelligence

An interactive visual essay about what different interfaces reveal and obscure when people encounter machine intelligence.

The written argument is the product. WebGL, canvas, audio, and scroll motion are progressive enhancements: readers must still receive the complete essay when motion is reduced, data saving is enabled, WebGL is unavailable, or an interaction cannot be used.

## Requirements

- Node.js 24 LTS (Cloudflare configuration requires Node.js 22.18 or later)
- npm 10 or later (the committed `package-lock.json` is canonical)
- Google Chrome for the committed desktop and mobile visual checks

## Commands

```powershell
npm ci
npm run dev
npm run check
npm run video:studio
npm run video:render
npm run video:delivery
npm run video:handoff
```

`npm run check` runs ESLint, the semantic/source contract tests, the production build, the initial JavaScript budget, and Playwright checks at 1280 px, 390 px, and 320 px widths. The suite also exercises the layout at a 200% equivalent viewport. The entry bundle must remain below 150 KB gzip.

The mobile companion video lives in `video/`. It is a separate 48-second, 9:16 Remotion composition so its rendering dependencies do not enter the website bundle. The film follows one signal to a line-and-bead handoff that matches the webpage hero. See `video/README.md` for its visual, accessibility, and delivery contract.

## Architecture

- `src/pages/Home.tsx` owns the essay shell, active chapter state, and near-viewport dynamic imports.
- `src/content/chapters.ts` owns the semantic preview shown before an interactive chapter loads or whenever motion is reduced.
- `src/components/ChapterArtwork.tsx` owns the five subject-specific static studies used by reduced motion and loading states.
- `src/components/ChapterTradeoff.tsx` renders the capability and blind spot shared by semantic and enhanced chapters.
- `src/components/EnhancementBoundary.tsx` keeps the semantic chapter available and offers recovery when a lazy interactive module fails.
- `src/components/ExperiencePreferences.tsx` owns persistent motion and rendering-detail preferences.
- `src/components/MatterCurrent.tsx` owns the continuous scroll and touch-responsive transformation shared by all six chapters.
- `src/components/LazyChapter.tsx` keeps chapter engines out of the initial route and mounts them near the viewport.
- `src/lib/canvas.ts` owns DPR, pointer, resize, visibility, and cleanup behavior for 2D canvases.
- `src/sections/*` owns the optional chapter-specific interaction layer.

Scent is the representative failure-and-recovery chapter: one receptor merges two crossing traces, and a native comparison control reveals the second channel. Forms contains three primary instruments—Rhythm, Pattern, and Flock. Vision uses a sparse comparison ledger rather than a larger simulation.

The Hero's Three.js engine is also dynamically imported, so readable opening copy and a static poster arrive before WebGL.

## Accessibility contract

Every chapter must provide:

1. A unique heading.
2. A readable summary and explanation in the DOM.
3. A stable static composition before the interactive module loads.
4. A reduced-motion path that never imports the animated engine.
5. Pointer interaction that is optional rather than the only route to meaning.
6. WCAG AA text contrast and visible keyboard focus.
7. A capability and blind spot expressed in semantic text.

Meaningful discrete actions use native buttons, including the Scent recovery and each Forms instrument. Continuous canvas disturbance remains optional and is not announced as a stream of particle updates.

Canvas elements are hidden from the accessibility tree because their meaning is supplied by adjacent semantic text. Controls remain native buttons and links with 44 px minimum targets.

## Performance policy

- Dynamic-import every chapter engine.
- Keep no more than the near-viewport chapters active.
- Pause animation when a canvas or browser tab is hidden.
- Cap DPR and simulation size in low-power Graphics mode.
- Keep initial JavaScript below 150 KB gzip.
- Treat new continuous animation loops as a budget decision, not a default.
- The matter current is the single deliberate exception: 210 particles with standard Graphics, 92 particles at a capped frame rate with low-power Graphics, and no canvas in reduced motion.

## Editorial policy

The essay speaks through its scenes and interactions. Copy describes what a reader can see, hear, or change, then leaves room for interpretation. Avoid factual detours, defensive disclaimers, and abstract claims that the scene cannot carry.

## Deployment

The Cloudflare migration branch targets the isolated `intelligence-migration-preview` Worker in the configured Cloudflare account. It does not attach a production domain. `cf` and the Cloudflare Vite plugin are pinned while their configuration API is in beta.

Run `npm ci` and `npm run check` before deployment. `npm run deploy` performs the TypeScript build and 150 KB initial-bundle check, then uploads the prebuilt Cloudflare output. Running `cf deploy` directly bypasses the package's TypeScript and bundle-budget checks. Static files are generated in `.cloudflare/output/v0/workers/default/assets`; source documents and companion-film renders are not published.

`public/_headers` marks this preview as `noindex, nofollow`. Remove that preview policy only when the production URL is agreed. The existing Vercel application remains the production host until cutover is approved and verified. Windows screenshot baselines require their original platform for exact comparisons.

The GitHub verification workflow runs the full `npm run check` command on
Windows with Chrome so the committed Windows screenshot baselines are checked
on their original platform. Failed runs retain visual diagnostics for review;
the workflow does not deploy or update screenshot baselines automatically.

`vite.config.ts` uses a relative base so the essay can be hosted below a subpath. Before a public launch, replace the relative social-preview URL in `index.html` with the final absolute deployment URL; Open Graph crawlers generally expect absolute image URLs.
