# Design

## Voice

Mineral, scientific, uncanny.

The page should feel like a darkened science gallery containing live specimens—not a magazine layout and not a developer dashboard. Simulations are the imagery. Prose is calm enough to let them carry the wonder.

## Typography

- Petrona carries display text. Its irregular, mechanical serif shapes give the essay a specific voice without returning to the familiar Fraunces editorial pattern.
- Atkinson Hyperlegible Next carries body text, navigation, labels, and controls. It is chosen for legibility rather than as a shorthand for “technical.”
- Chapter labels do not repeat above every heading. Chapter numbers live in navigation, where sequence is useful.

Display tracking must not be tighter than `-0.04em`. Body prose should stay below 70 characters per line.

## Color

- Ink: `#07070b`
- Secondary ink: `#0b0b12`
- Paper: `#ede7da`
- Sand: `#e8b36a`
- Violet: `#b8adff`
- Sea: `#86e4ca`

Sand signals the central material metaphor and current navigation state. Violet signals transformation. Sea signals chemical and biological sensing. Supporting text uses paper at 70% opacity or higher on ink.

## Chapter contract

Each chapter has two layers:

1. Semantic layer: title, summary, explanation, source notes, and a static abstract composition.
2. Enhancement layer: a lazy-loaded canvas, WebGL, audio, or scroll interaction.

The semantic layer owns meaning. The enhancement layer may be absent, delayed, paused, or replaced without changing the argument.

## Material continuity

One small, persistent particle field connects the chapters. It does not introduce a second story. The same matter becomes:

- Shape: an orbital body.
- Touch: a force-carrying stream.
- Forms: a wave and signal.
- Scent: a widening chemical plume.
- Shapeshift: a procedural skyline.
- Vision: a coherent column of light.

Scroll supplies the transformation progress rather than merely triggering entrances. Pointer proximity bends the field; pressing creates a stronger disturbance; release lets it reform. The hero and conclusion lower the field's opacity because their central compositions and prose already own those scenes.

Reduced motion replaces the current with a quiet six-point material atlas. No canvas is created.

## Composition

Chapter art direction should follow its subject:

- Touch: a wide field that invites direct manipulation.
- Forms: an instrument rack with alternating visual and explanatory zones.
- Scent: a lateral plume moving from emitter to interpretation.
- Shapeshift: a horizon-scale procedural scene.
- Vision: a single centered conclusion and calm coda.

Do not restore identical card grids, repeated numbered heading markers, decorative monospace, or entrance motion on every section.

## Motion

- Motion communicates emergence, response, transformation, or degradation.
- Readers can turn motion off at any time.
- `prefers-reduced-motion` defaults the experience to reduced mode.
- Hidden canvases and hidden browser tabs do not render.
- Entry motion never controls whether text is visible.
- One low-cost persistent current may render alongside the near-viewport chapter canvas. Lite mode reduces its particle count and frame rate.

## Interaction

- All real controls are native buttons or links.
- Pointer-only canvas play is optional.
- Focus is visible and uses the sand color.
- Touch targets are at least 44 px.
- Mobile chapter navigation remains visible at the bottom of the screen.
