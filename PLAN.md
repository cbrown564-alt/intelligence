# The Shape of Intelligence — Cross-media plan

Last updated: 17 July 2026

## Purpose

Unify the webpage and companion film around one argument without losing the qualities that already make them distinctive.

The chosen direction is **one material, different encounters**:

- The film gives a signal its physical and causal origin.
- The webpage lets the audience encounter and transform that signal.
- Each chapter shows both a capability and a blind spot of its form.
- One continuous material connects the work, while each chapter has a distinct foreground composition.

This is the canonical plan for the cross-media work. [PRODUCT.md](PRODUCT.md) owns the product promise and success criteria. [DESIGN.md](DESIGN.md) owns the visual, interaction, and motion rules. [README.md](README.md) and [video/README.md](video/README.md) own current implementation and operating instructions. Update those documents when this plan changes their durable facts.

## Why this direction

The webpage and film currently share a title, palette, and visual systems but reach different conclusions:

- The webpage argues that the form of an encounter changes what intelligence brings into view.
- The film progresses from matter toward a single artificial sensorium and implies an ascending synthetic mind.

The webpage has the clearer and more defensible thesis. The film has the stronger causal sequence. Joining those strengths produces a better division of labour than making either medium repeat the other.

The project should therefore make this promise:

> Follow one signal from matter into a machine, then change the encounter and discover what each form reveals and hides.

This wording is a working editorial statement, not approved final copy.

## Decisions

### 1. One thesis

The governing claim is:

> Intelligence appears different through different forms of encounter. Every form reveals something and obscures something else.

The work must not imply that current AI is conscious, that intelligence progresses toward one ideal form, or that a synthetic sensorium is inherently an ascent.

### 2. One continuous material

Use one identifiable particle, filament, or signal as the cross-media handoff:

1. The film follows its causal history through matter, fabrication, electricity, biology, chemistry, and signal.
2. Its final image isolates that signal rather than accumulating every previous system.
3. The signal enters or visually matches the webpage hero.
4. The webpage transforms it through Shape, Touch, Forms, Scent, Shapeshift, and Vision.

The material is continuity, not a second story. It should become quieter wherever prose or chapter artwork needs to lead.

### 3. Capability and blind spot

Every chapter must answer two questions through prose, composition, or interaction:

1. What does this form make perceptible or possible?
2. What does it hide, distort, discard, or misread?

At least one chapter should let the audience experience a controlled misreading or failed interpretation. Failure must clarify the thesis rather than operate as arbitrary difficulty.

### 4. Shared background, distinct foregrounds

Keep the matter current as the connecting layer. Do not let it determine every chapter's primary image.

Each foreground should have a recognisably different composition and behaviour:

- **Shape:** a bounded object whose contour changes what can be inferred.
- **Touch:** a wide force field that can scatter, resist, and reform.
- **Forms:** three contrasting instruments, not five similarly weighted demonstrations.
- **Scent:** a lateral chemical path with diffusion, ambiguity, and possible misreading.
- **Shapeshift:** a horizon-scale procedural structure rather than another particle cluster.
- **Vision:** a quiet synthesis in which the final claim, not particle density, leads.

These are functional distinctions, not instructions to import unrelated visual styles. The mineral, scientific, uncanny gallery identity remains.

### 5. Equivalent meaning, appropriate experience

- Reduced motion removes motion, not art direction or meaning.
- Sound may deepen the film but must never carry indispensable information.
- Pointer interaction remains optional to understanding.
- Discrete interactions should gain keyboard-equivalent controls where those controls create a coherent experience; do not expose continuous particle noise through excessive live announcements.
- Film copy must remain legible outside player chrome, and an accessible transcript must be supplied.

## What to preserve

Do not rebuild strengths that already work:

- The Petrona and Atkinson Hyperlegible Next pairing.
- The ink, sand, violet, and sea colour roles.
- Progressive enhancement and semantic chapter fallbacks.
- Lazy-loaded chapter engines and the JavaScript budget.
- Reduced-motion prevention of animation-engine imports.
- Visibility gating, DPR limits, and low-power rendering.
- Deterministic, frame-based film animation.
- The film's causal handoffs from sand through signal.
- Native controls, visible focus, and mobile chapter navigation.

## Scope boundaries

This plan does not authorize:

- A seventh chapter or a broader explanation of AI internals.
- Claims about machine consciousness.
- A wholesale visual rebrand.
- Photography or additional media merely to create variation.
- Mandatory audio.
- Interaction that becomes the only route to the argument.
- Production or publication before the promotion checks below pass.

## Work plan

### Phase 0 — Confirm the baseline

Goal: distinguish verified defects from proposals before changing the experience.

- Run the documented clean-install check.
- Reproduce the mobile reading-position loss when Motion or Graphics changes.
- Record the current film duration, size, bitrate, pixel format, keyframe interval, and available outputs.
- Confirm current hero, chapter, and ending copy from source rather than screenshots.
- Inspect keyboard behaviour for each real control and each meaningful discrete interaction.
- Capture representative desktop, 390 px, 320 px, and reduced-motion screenshots.

Exit criteria:

- A short baseline record lists confirmed failures, unconfirmed review claims, and passing checks.
- No proposal is presented as an existing defect without direct evidence.

### Phase 1 — Align the argument

Goal: make the film and webpage state one claim before changing their larger compositions.

- Rewrite the film's final three copy beats to move from translation, to interface, to changed perception.
- Remove or revise language implying a single ascending mind.
- Introduce the webpage's governing question early enough that the chapters read as evidence rather than a delayed reveal.
- Draft one capability and one blind spot for every chapter.
- Choose the chapter in which a misreading will be experienced.
- Review all new language against the project's non-goals and editorial policy.

Working film direction:

1. “We translate that language into signal.”
2. “Then build new interfaces with it.”
3. “New senses bring a different machine into view.”

These lines require editorial review in context; they are not locked copy.

Exit criteria:

- A reader can summarise the same central claim after either medium.
- The final film claim does not depend on consciousness or ascent.
- Every chapter has an approved capability/blind-spot pair.
- The planned misreading is precise, bounded, and recoverable.

### Phase 2 — Repair confirmed continuity and delivery defects

Goal: remove inexpensive obstacles before deeper art-direction work.

- Preserve the active chapter heading below the masthead when Motion or Graphics changes layout height.
- Add a 390 px regression test for preference changes and reading position.
- Rename implementation-facing labels such as “Detail full/lite” using audience language such as “Graphics standard/low-power.”
- Replace instance counts and unexplained technical labels where they do not help the encounter.
- Place indispensable film text inside player-safe bounds.
- Add an SRT or equivalent caption asset and a readable transcript, even if the master remains silent.
- Keep the current film as a master and create a lighter delivery encode.
- Shorten keyframe spacing if testing confirms poor seeking.
- Add semantic assertions for thesis-critical copy so screenshot thresholds cannot conceal editorial drift.

Exit criteria:

- Preference changes preserve reading position at mobile widths.
- Controls use audience-facing language.
- Essential film copy remains unobscured in the intended player.
- Transcript and delivery encode exist and are documented.
- Tests fail when governing copy unintentionally drifts.

### Phase 3 — Prove one representative chapter

Goal: test the capability/blind-spot structure and visual differentiation before applying it everywhere.

Use **Scent** as the default representative slice because diffusion and interpretation naturally support capability, ambiguity, and misreading. Change this choice only if source inspection shows another chapter can answer the question with materially less work.

The slice must include:

- Complete semantic copy.
- A distinct static composition.
- The optional interactive enhancement.
- A clear capability.
- A legible blind spot or misreading.
- A recovery or reinterpretation path.
- Reduced-motion parity.
- Mobile, keyboard, pointer, and no-WebGL behaviour.

Questions the slice must answer:

- Does an experienced limitation make the thesis clearer without becoming didactic?
- Can the matter current remain present without making the foreground look like another particle field?
- Does the static version retain the same idea and art-direction quality?
- Is the interaction understandable without instructional clutter?

Exit criteria:

- The complete chapter loop works in semantic, reduced-motion, and enhanced modes.
- Direct visual review shows meaningful foreground distinction from adjacent chapters.
- Relevant automated checks pass.
- The result justifies extracting a reusable capability/blind-spot pattern.

### Phase 4 — Recompose Forms and Vision

Goal: improve pacing at the two points where accumulation is currently most visible.

For Forms:

- Reduce the primary sequence from five instruments to three.
- Keep three examples that differ in input, behaviour, and conclusion.
- Move worthwhile secondary studies into an optional atlas only if they still serve the argument.
- Compose the instruments with varied scale and spatial roles rather than equal repeated tiles.
- Keep music only if its audible and silent states both make sense.

For Vision:

- Reduce or suppress the persistent matter current.
- Lower the density of the finale composition.
- Let the chapter gather the preceding capability/blind-spot pairs.
- Give the final sentence sufficient stillness and space.
- Avoid replacing one ascending sensorium with a visually different form of total synthesis.

Exit criteria:

- Forms advances the argument without becoming a demonstration corridor.
- Its three encounters are distinguishable in purpose as well as appearance.
- Vision feels like a conclusion rather than the largest simulation.
- The final claim remains clear with motion disabled.

### Phase 5 — Recompose the film handoff

Goal: turn the film from a parallel summary into the causal first half of the encounter.

- Preserve the successful sand-to-signal chain.
- Recover time from the opening if the final reframing needs more room.
- Keep one signal or filament alive through the final act.
- Allow it to pass through later systems without leaving all of them accumulated on screen.
- End with a composition that can hand directly to the webpage hero.
- Prototype the handoff with matched still frames before building complex transition machinery.
- Create an optional sound-on version using material-specific sound; preserve a silent version whose meaning remains complete.
- Decide required aspect ratios from actual destinations. Do not create 1:1 or 16:9 versions without a named use.

Exit criteria:

- The final twelve seconds communicate the same thesis as the webpage.
- One causal object remains identifiable.
- The last film frame and first webpage composition form an intentional handoff.
- The film remains intelligible when silent.
- Each rendered format has a named destination and has been visually checked there.

### Phase 6 — Spread the proven chapter pattern

Goal: apply the successful representative pattern without making every chapter structurally identical.

- Extract only the reusable editorial questions, state handling, and accessibility behaviour.
- Apply capability and blind spot to the remaining chapters.
- Give each chapter a subject-specific foreground composition and interaction.
- Test important exceptions rather than forcing the same interaction model everywhere.
- Remove speculative shared infrastructure if it does not simplify at least two real chapters.

Exit criteria:

- Every chapter answers the two governing questions.
- Chapters remain recognisably related but visually and behaviourally distinct.
- The shared matter current supports rather than overwhelms the foregrounds.
- Reduced-motion and fallback experiences retain full meaning and deliberate composition.

### Phase 7 — Promotion check

Goal: determine whether the unified work is ready for its intended public destination.

Run the repository's documented full check from a clean install and directly inspect the experience in its real media.

Required evidence:

- Build, lint, source contracts, semantic checks, bundle budget, and Playwright checks pass.
- Initial JavaScript remains below 150 KB gzip.
- The hero message is present on first paint and with motion disabled.
- No chapter engine is imported in reduced-motion mode.
- Every chapter is reachable and readable at 320 px and at 200% zoom.
- Preference changes preserve reading position.
- Keyboard focus is visible and all real controls are operable.
- No essential meaning depends on pointer interaction, WebGL, motion, or audio.
- Website and film have been visually inspected at every intended destination and aspect ratio.
- Film transcript and delivery assets are present.
- Governing copy is consistent across source, rendered site, transcript, and film.
- Performance is stable on a representative mid-range mobile device or an explicitly documented proxy.

Use completion terms precisely:

- **Implemented:** the change exists in the working tree.
- **Verified:** automated or direct checks passed.
- **Validated:** representative readers or domain reviewers support the intended interpretation.
- **Promoted:** the work has crossed the named publication boundary.

## Verification approach

During iteration, run the narrowest relevant check. Before claiming broad completion, run `npm run check` from the documented environment.

Visual and experiential checks must include:

- Desktop, tablet, 390 px, and 320 px layouts.
- 200% zoom equivalent.
- Default motion, reduced motion, and low-power graphics.
- First paint, lazy loading, engine failure, and retry.
- Keyboard-only navigation.
- Pointer and touch interaction where supported.
- Hidden-tab and off-screen animation pausing.
- Film playback muted, sound-on when available, and with player chrome visible.
- The exact final film frame and webpage opening handoff.

Do not treat a passing screenshot threshold as proof that thesis-critical wording is correct.

## Risks and responses

### The integration becomes another spectacle

**Risk:** The particle handoff and capability/blind-spot structure add more effects instead of clarity.

**Response:** Match the handoff first with still frames, keep Vision quiet, and require every new effect to carry a named part of the argument.

### Visual differentiation breaks the identity

**Risk:** Pursuing contrast creates six unrelated art directions.

**Response:** Preserve typography, colour roles, material continuity, and gallery tone. Differentiate composition and behaviour before adding new media or palettes.

### The blind spots become moralising or frustrating

**Risk:** Failure states lecture the reader or make controls feel broken.

**Response:** Use one recoverable representative slice first. Describe the consequence in concrete perceptual terms and test whether the experience remains legible without interaction.

### Reduced motion becomes a second, underfunded product

**Risk:** Bespoke static compositions multiply production and maintenance cost.

**Response:** Let the semantic layer and static artwork own meaning from the start; treat animation as an enhancement of those compositions rather than a separate design.

### Sound delays the core work

**Risk:** Scoring and sound design consume effort before the argument is fixed.

**Response:** Complete the silent editorial cut first. Add sound only after the causal object and ending are stable.

### Review claims are mistaken for verified defects

**Risk:** The plan accumulates work based on plausible critique rather than observed behaviour.

**Response:** Phase 0 classifies every claim. Promotion requirements depend on reproduced evidence, source contracts, or direct inspection.

## Open decisions

Resolve these at the named phase, not before they become useful:

- **Phase 1:** final governing sentence and final film copy.
- **Phase 1:** the exact capability and blind spot for each chapter.
- **Phase 3:** whether Scent remains the best representative slice after source inspection.
- **Phase 4:** which three Forms instruments remain and whether secondary studies deserve an atlas.
- **Phase 5:** the precise visual identity of the cross-media signal.
- **Phase 5:** whether sound is commissioned and which destinations require additional aspect ratios.
- **Phase 7:** the publication destination, audience, and required device evidence.

## Deferred ideas

These may be reconsidered after the core plan succeeds:

- A narrated or autoplay-guided tour.
- Embedded film fragments inside individual chapters.
- Multiple simultaneous minds or divergent finale branches.
- New photographic or recorded media.
- Additional chapters or technical explanations.

They are not part of the current plan because they broaden the experience before the shared thesis has been proven.

## Next-session starting point

Start with **Phase 0 — Confirm the baseline**.

1. Read `PRODUCT.md`, `DESIGN.md`, this plan, and the two review artifacts.
2. Inspect the current working tree without reverting unrelated changes.
3. Run the documented checks and reproduce the mobile preference-position issue.
4. Create a concise baseline record in this file under **Progress record**.
5. Begin Phase 1 only after review claims have been classified as confirmed, disproved, or still untested.

Do not begin by redesigning all six chapters. Prove the editorial claim, repair confirmed low-cost defects, then build the representative Scent slice.

## Progress record

### 17 July 2026 — Phases 1–6 implemented; local promotion checks verified

- **Argument aligned:** the hero now asks what each form reveals and hides; all six chapters have source-owned capability/blind-spot copy; the film ends on translation, interfaces, and changed perception rather than an ascending mind.
- **Continuity and delivery repaired:** Motion and Graphics changes preserve the active mobile heading; controls say “Graphics standard/low power”; indispensable film copy is inset 220 px from the top or bottom; semantic tests pin governing copy across the webpage, film, SRT, and transcript.
- **Representative Scent loop implemented:** two traces cross, one receptor confidently merges them, and a keyboard-operable comparison control reveals the second channel. Semantic, reduced-motion, pointer-enhanced, keyboard, and Canvas 2D fallback paths carry the same consequence and recovery.
- **Forms and Vision recomposed:** Forms now contains three primary instruments—Rhythm, Pattern, and Flock—with distinct inputs and losses. Vision uses a sparse light field and five-line comparison ledger; the persistent matter current falls to 12% opacity there.
- **Pattern spread without identical chapters:** Shape names contour's boundary/history trade-off; Touch names force/rule; Forms names instrument/remainder; Scent names trace/source; Shapeshift names order/pieces; Vision compares those partial views.
- **Film handoff implemented:** the dense city/sensorium systems dissolve before the final claim. One horizontal filament and bead remain and match the webpage hero. Direct still-frame review covered the final film frame, the 45-second claim frame, the desktop enhanced chapters, and reduced-motion layouts at 1280, 390, and 320 px.
- **Accessible delivery assets implemented:** `video/shape-of-intelligence.en.srt`, `video/transcript.md`, a 1080 × 1920 master, a 720 × 1280 delivery MP4, a poster, and an exact handoff still are present and documented.
- **Verified from a clean install:** `npm ci`, `npm run check`, and `npm run video:typecheck` pass. The check includes lint, 9 semantic/source tests, production build, a 68.41 KB gzip initial bundle, and 18 applicable Playwright checks; 9 cases are intentionally skipped outside their named viewport. Production dependency audit reports 0 vulnerabilities; the full development tree still reports 10 findings (1 low, 4 moderate, 5 high).
- **Verified film metadata:** both renders are 48.0 seconds, 30 fps, H.264, silent, and keyframed every 2.0 seconds. The master is 1080 × 1920, 24,878,180 bytes, 4.15 Mbps; delivery is 720 × 1280, 5,130,920 bytes, 0.86 Mbps. Remotion still reports `yuvj420p` despite the requested `yuv420p`; this remains a publication-pipeline decision.
- **Not yet validated or promoted:** no publication destination or audience has been named; the website and film have not been inspected in a real destination/player; no representative physical mid-range mobile device has been tested; no reader/editor/domain validation has approved the intended interpretation. Optional sound-on work remains deferred because the silent cut is complete and no sound commission was authorized.
- Next true dependency: name the publication destination and representative device, then run the remaining Phase 7 destination, device, and editorial validation checks before promotion.

### 17 July 2026 — Phase 0 baseline confirmed

- Work mode: **full working prototype**. Local implementation and verification are in scope; publication, audience validation, commissioned sound, and destination-specific approval remain promotion work.
- `npm ci` succeeds from the committed lockfile. The first attempt exposed an environment lock from the repository's running Vite process; stopping that process and retrying completed a clean install.
- Baseline `npm run check`: lint, 7 semantic/source tests, production build, the 65.9 KB gzip initial bundle, and 14 Playwright checks pass; 3 checks are intentionally skipped by viewport. The 390 px Scent screenshot fails with 4% pixel drift, confirming that the committed image no longer represents source copy.
- Baseline `npm run video:typecheck` passes.
- Confirmed defect: changing Motion from on to off at `/#scent` on a 390 px viewport moves the active heading from the reading position to `-1445px`, above the 64px masthead. A focused Playwright regression now reproduces it.
- Source-confirmed gaps: controls say “Detail full/lite”; semantic/source tests do not pin the governing copy; the five-instrument Forms sequence conflicts with the three-instrument plan; Scent has optional pointer stirring but no experienced misreading or recovery; the film ends on “A mind can inhabit senses we do not have”; no caption or transcript asset exists.
- Film baseline: the current 48-second, 1080 × 1920 H.264 file is 24,049,324 bytes. The completed cross-media evidence pass records 4.01 Mbps, 8.33-second keyframe spacing, `yuvj420p`, and no audio stream. The MP4 and poster are the only current delivery outputs.
- Current source copy is confirmed in `src/sections/Hero.tsx`, `src/content/chapters.ts`, `src/sections/Finale.tsx`, and `video/ShapeOfIntelligenceVideo.tsx`; no screenshot is being treated as editorial authority.
- Representative reduced-motion screenshots already cover 1280 px, 390 px, and 320 px opening and Scent states. New visual checks will replace the stale Scent baseline only after the representative chapter is implemented and directly reviewed.
- Next executable action: align the governing question, film ending, and one capability/blind-spot pair per chapter before changing the chapter compositions.

### 17 July 2026 — Plan created

- Compared `review.html` and `cross-media-review.html`.
- Selected **one material, different encounters** as the working direction.
- Combined the first review's strongest creative ideas—experienced limitation, foreground contrast, sound as material—with the second review's cross-media baton, evidence, delivery, and sequencing.
- No product source was changed as part of this planning step.
- Phase 0 has not yet been run.
