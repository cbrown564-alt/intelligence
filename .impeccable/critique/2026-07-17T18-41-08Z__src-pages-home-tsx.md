---
target: webpage and MP4
total_score: 30
p0_count: 0
p1_count: 3
timestamp: 2026-07-17T18-41-08Z
slug: src-pages-home-tsx
---
Method: dual-agent (A: `/root/design_review` · B: `/root/evidence_review`)

# Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Active chapter and preference states are visible; changing Motion can displace the current mobile heading. |
| 2 | Match system / real world | 3 | Clear prose overall, weakened by “Detail lite,” instance-count labels, and the film’s machine-mind ending. |
| 3 | User control and freedom | 3 | Strong chapter navigation and motion control; richer canvas play remains pointer-led. |
| 4 | Consistency and standards | 4 | Typography, colour, navigation, and controls are unusually cohesive. |
| 5 | Error prevention | 3 | Native controls and sensible defaults; video delivery constraints are not encoded or tested. |
| 6 | Recognition rather than recall | 3 | Chapters remain visible; Greek indices and tiny canvas instructions demand interpretation. |
| 7 | Flexibility and efficiency | 3 | Direct links, compact navigation, and reduced motion are strong; Forms has no efficient route through it. |
| 8 | Aesthetic and minimalist design | 3 | Strong hierarchy; Forms over-expands and reduced mode loses too much art direction. |
| 9 | Error recovery | 3 | Static fallbacks and retry actions are explicit, though retry reloads the whole page. |
| 10 | Help and documentation | 2 | Inline cues exist, but interaction settings, transcripts, and delivery context need explanation. |
| **Total** |  | **30/40** | **Good foundation; important narrative and parity fixes remain.** |

# Anti-pattern verdict

The full concept passes the AI-slop test. Petrona, the mineral palette, causal simulations, and confident black fields create an authored science-gallery identity. The reduced-motion presentation slips toward the saturated editorial-typographic lane: oversized serif headlines, sparse abstract diagrams, tracked uppercase labels, and very little visual matter in the hero. The film’s final composite similarly drifts from specific causal specimen into a familiar particles/DNA/data-mind collage.

The deterministic detector returned exit code 0 with `[]`: zero findings, no rules, no false positives. This clean result does not cover narrative contradiction, reduced-motion parity, runtime scroll continuity, player safe zones, or encoding metadata.

No detector overlay exists. The native overlay path could not perform mutable injection; browser and standalone Playwright evidence supplied the visual/runtime fallback.

# Overall impression

The visual system is already distinctive enough to deserve protection. The largest opportunity is intellectual: the webpage argues that interfaces reveal and hide, while the film ends by asserting that a mind inhabits alien senses. One particle and one defensible thesis should connect both media.

# What is working

1. **Recognisable visual identity.** Petrona, Atkinson Hyperlegible Next, sand/violet/sea, disciplined tracking, and near-black fields create the intended dark science gallery across desktop and mobile.
2. **Substantive progressive enhancement.** Native controls, visible focus, persistent motion preferences, static chapter fallbacks, error boundaries, compact navigation, and a 66 KB gzip entry are structural strengths.
3. **Causal, subject-specific film motion.** Sand keeps identity while entering the wafer, lasers reveal circuits at scan points, electricity branches into neural activity, DNA hands off to a swarm, and molecules enter a receptor. The 00:06–00:32 sequence is especially coherent.

# Priority issues

## [P1] The two media leave the audience with different theses

The webpage concludes that each interface changes what comes into view (`src/sections/Finale.tsx:109–125`). The film ends at 43.4–48.0 seconds with “A mind can inhabit senses we do not have” (`video/ShapeOfIntelligenceVideo.tsx:84`), pressing against the non-goal in `PRODUCT.md` against claims of machine consciousness.

**Fix:** replace the last three beats with “We translate that language into signal” → “Then build new interfaces with it” → “New senses bring a different machine into view.”

## [P1] Reduced motion becomes a lower-status experience

When motion is reduced, the hero mounts no static specimen (`src/sections/Hero.tsx:25–34`) and the chapters converge on one preview shell (`src/components/ChapterPreview.tsx:12–29`). The argument remains readable, but the designed encounter collapses into serif typography and sparse diagrams.

**Fix:** author a real static hero specimen and genuinely distinct still compositions. Remove movement, not art direction.

## [P1] Forms breaks the six-chapter pacing

Forms contains five instruments (`src/sections/FormsChapter.tsx:563–619`), each with a 34rem desktop minimum height (`src/index.css:699–710`). It becomes a product-demo corridor and delays Scent, Shapeshift, and the conclusion.

**Fix:** let two or three instruments carry the argument and move the remainder into an optional atlas.

## [P2] The film loses its causal object in the final act

After roughly 38 seconds, receptor signal, ribbons, phyllotaxis, city, DNA, insects, branches, and a final particle organism accumulate (`video/scenes/AlienScene.tsx:120–170`).

**Fix:** keep one carrier—a chemical signal or light filament—visible through every handoff. Recover about two seconds from the shoreline opening and spend them on the thesis.

## [P2] Changing Motion can move the reader’s current heading beneath the masthead

At 390×844, switching Motion off while on Forms left the H2 at 26.9px while the fixed masthead ended at 64px; the chapter top was −77.9px.

**Fix:** preserve the active chapter anchor across preference-driven layout changes and add a mobile Playwright regression test.

## [P2] Essential film copy is not delivery-safe

Copy sits 92px from the top or 96px from the bottom, with the wordmark 34px from the bottom (`video/ShapeOfIntelligenceVideo.tsx:43–46, 87–100`). The silent film has no alternative narrative channel.

**Fix:** keep indispensable copy within a platform-tested 10–12% safe zone and provide an SRT plus transcript.

## [P2] The mobile master needs delivery variants

The MP4 is 24,049,324 bytes at about 4.01 Mbps with keyframes every 8.33 seconds. ffprobe reports `yuvj420p` full range and `bt470bg` metadata despite a requested `yuv420p` render.

**Fix:** preserve the current master, then render a lighter 720×1280 delivery MP4, a 12-second cut, shorter GOP, and verified colour metadata.

## [P2] The finale is busier than its own design brief

The full-motion conclusion combines the 900-mote finale canvas, the persistent matter current, and two large H2 blocks. It remains readable but competes with the conclusion that should own the scene.

**Fix:** suppress the persistent current during Vision and reduce the finale field behind the copy.

# Persona red flags

**Jordan, first-time reader:** the opening presents two implementation preferences, six chapter links, poetic copy, and “Enter the field” without explaining what Detail changes. The film then ends on “a mind,” inviting a literal consciousness reading.

**Sam, reduced-motion/keyboard reader:** navigation, semantics, and focus are strong, but reduced motion removes the hero specimen and repeats one fallback cadence. Sam receives equivalent facts, not an equivalent designed encounter.

**Casey, distracted mobile reader:** the bottom chapter bar is excellent thumb-zone design. The top masthead and bottom navigation consume significant height, Motion changes can disturb place, and silent-film copy competes with native player chrome.

# Minor observations

- The desktop masthead title’s measured height is below the project’s 44px touch-target contract.
- “Procedural field · 1,600 instances” sounds like a developer demo, not a gallery label.
- `ChapterHead` repeats the same translate reveal on every heading and lede.
- `.chapter-preview:nth-child(even)` is likely ineffective because each preview is the sole child of its wrapper.
- The committed Scent screenshot contains copy that no longer matches `src/content/chapters.ts`; thesis-critical prose needs semantic assertions, not screenshot-only coverage.

# Questions to consider

- What single sentence must both media leave in the audience’s head?
- Are all five Forms instruments essential evidence, or are they demonstrating implementation range?
- Is the film a prelude, a summary, or a separate essay?
- If a reduced-motion reader saw only their version, would they describe it as a dark science gallery?
- Is the protagonist sand, signal, interface, or mind? The strongest version chooses one.

# Cross-media thesis

Make one material particle the literal baton between media. The film becomes its causal origin story, then ends as that particle enters the webpage hero field. The webpage becomes the laboratory where the audience touches its six transformations. Cinema supplies causality; interaction supplies agency.

**Motion verdict:** needs revision before public promotion. Subject-specific motion and runtime gating are unusually strong; final-object continuity, reduced-motion parity, player-safe copy, and preference continuity are not yet at the same level.
