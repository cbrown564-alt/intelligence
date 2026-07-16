---
target: repository home experience
total_score: 20
p0_count: 0
p1_count: 4
timestamp: 2026-07-16T17-31-11Z
slug: src-pages-home-tsx
---
# Repository critique: The Shape of Intelligence

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2/4 | Desktop chapter state exists, but hero cues and interaction feedback are unreliable. |
| 2 | Match between system and real world | 3/4 | Strong metaphors and language, weakened by unsupported claims. |
| 3 | User control and freedom | 2/4 | No pause, reduced-motion control, or mobile chapter navigation. |
| 4 | Consistency and standards | 3/4 | Coherent visuals; interaction affordances vary and are often implicit. |
| 5 | Error prevention | 2/4 | Few destructive actions, but no capability checks or graceful downgrade. |
| 6 | Recognition rather than recall | 2/4 | Canvas actions rely on subtle captions; desktop nav labels hide until hover. |
| 7 | Flexibility and efficiency | 1/4 | No skip, quality, pause, or keyboard path through interactive material. |
| 8 | Aesthetic and minimalist design | 3/4 | High craft; repeated editorial scaffolding and constant effects reduce contrast. |
| 9 | Error recovery | 1/4 | No canvas, WebGL, audio, or animation fallback experience. |
| 10 | Help and documentation | 1/4 | No source notes, contextual help, or project documentation. |
| **Total** |  | **20/40** | **Acceptable; significant improvements needed.** |

## Anti-patterns verdict

The project does not look generically generated at first glance: its live simulations are specific, technically ambitious, and tied to its thesis. Its editorial frame is much more familiar. Fraunces, Space Grotesk, IBM Plex Mono, repeated numbered kickers, ruled separators, and the uniform six-tile Forms grid match a saturated AI-era visual essay pattern. The deterministic scan found two overused-font warnings in `src/index.css` for Space Grotesk and Fraunces.

The right correction is not to remove the simulations or quiet the palette. Keep those. Replace the repeated editorial scaffold with chapter compositions shaped by each idea.

## Overall impression

This is a striking prototype with a clear point of view. The biggest opportunity is to make the spectacle optional without making the meaning optional. The opening is partly broken, motion has no accessible alternative, factual claims have no sources, and the page eagerly ships a 916.7 KB JavaScript chunk.

## What is working

- The interactions reinforce the thesis. Sand, flocking, wave, network, and morphing-city scenes make emergence and form tangible.
- The color and motion language is coherent across chapters with different mechanics.
- The shared 2D canvas helper handles DPR, resize, pointer state, intersection gating, and cleanup; Three.js resources are also disposed.

## Priority issues

### P1 — The hero intro is partly invisible

GSAP is scoped to the WebGL mount, but `.hero-line` and `.hero-fade` are sibling elements. GSAP reports that the targets are missing. Because the supporting elements also carry `opacity-0`, the kicker, explanation, and scroll cue remain hidden.

Fix: scope GSAP to a section ref or move the content inside the scoped wrapper. Default content must be readable before animation. Add a browser test that asserts hero copy visibility.

### P1 — No non-motion, non-canvas route through the ideas

All 11 canvases lack an accessible name or fallback text. The active stylesheet has no reduced-motion override. Desktop chapter navigation disappears below 768 px, leaving mobile readers in an approximately 11,636 px document without a chapter index. Several 40%-opacity text styles do not reach WCAG AA contrast.

Fix: define an accessible chapter contract with semantic copy, a poster, a description, reduced-motion behavior, a compact mobile chapter menu, and a global motion control. Mark decorative canvases hidden and describe meaningful ones in adjacent DOM content.

### P1 — Every chapter pays its runtime cost up front

The production build emits a 916.71 KB JavaScript chunk (266.84 KB gzip) and Vite warns about its size. Every chapter, Three.js, GSAP, and ScrollTrigger enter the initial route. Most 2D loops are visibility-gated, but parsing, mounting, allocation, and the hero's permanent loop still happen.

Fix: lazy-import chapters near the viewport, start with poster frames, hydrate after intent/visibility/device checks, pause the hero when hidden, and define measurable JS and frame-rate budgets.

### P1 — Factual and medical claims lack provenance

The essay presents claims about cancer detection from breath, the antiquity of smell, silicon manufacture, and a line attributed “after Demis Hassabis” without notes or sources.

Fix: move chapter copy to structured content with sources, add unobtrusive footnotes and references, verify quotations, and obtain domain review for the medical language.

### P2 — The scaffold is larger than the product

Fifty-three generic UI component files make up most of the 73-file source tree even though the essay does not import them. They create dependency, install, and lint surface area. The build passes, but a scoped lint run reports ten errors. There is no test script, the README is still the Vite template, the package is named `my-app`, and `App.css` is stale.

Fix: remove unused components and dependencies, replace template documentation, rename the package, remove stale CSS, and add smoke, accessibility, visual, and performance tests.

### P2 — The editorial frame is more generic than the imagery

The deterministic scan flags Space Grotesk and Fraunces. Repeated numbered chapter headers and the uniform Forms grid flatten otherwise distinctive content.

Fix: keep the simulations and palette, but vary chapter composition according to subject, move numbering into navigation, reconsider the reflex font stack, and redesign Forms as an instrument rack rather than six equal cards.

## Persona red flags

### Jordan, first-time reader

The opening explanation and scroll cue are invisible, so the first action is less clear than the source implies. Interactive chapters use short captions such as “drag through it” without explaining what keyboard or non-pointer readers should do. Unsupported factual claims weaken trust once noticed.

### Sam, accessibility-dependent reader

The canvases expose no accessible meaning, the page has no reduced-motion implementation, low-opacity supporting copy is difficult to read, and the mobile navigation is removed. The decorative disabled-looking button in the Slop chapter remains keyboard-focusable despite not being a real action.

### Casey, mobile reader

The one-column layout itself is strong, but the long page has no chapter index, the experience is heavy for slow connections, and there is no way to choose a lighter rendering mode or return to a chapter quickly.

## Minor observations

- Browser logs show `THREE.Clock` deprecation warnings.
- The build uses a production inspection plugin and `emptyOutDir: false` with environment-specific commentary.
- The single route does not need React Router unless chapter routes are planned.
- Social metadata, canonical URL, and preview image are absent despite the essay's shareable format.
- The grain overlay and several continuous animations have no reduced-motion treatment.

## Questions to consider

- Is the main promise an authored argument about intelligence, or a showcase of generative interactions? Which one should still work when every canvas is static?
- Which two chapter interactions would you keep if performance constraints forced you to cut the rest?
- Can every factual claim be sourced without breaking the visual rhythm?
- What would make the frame feel as original as the simulations?
