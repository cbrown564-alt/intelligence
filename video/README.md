# Mobile companion video

The companion is a silent 48-second, 9:16 visual story that follows one signal from matter into a machine interface. It supplies the causal first half of the webpage's argument; the webpage lets the audience change the encounter.

## Narrative arc

1. A shoreline fills the frame. Individual grains lift from the beach and flow into a tilted silicon wafer.
2. A fabrication gantry moves three lasers across the wafer. Circuit paths appear only where the scan points pass.
3. Electricity travels along the etched paths and branches out of the chip.
4. Those branches become a firing human brain, followed by a complete DNA double helix.
5. DNA releases into a winged insect swarm. The swarm follows visible pheromone trails and carries molecular structures through the field.
6. The molecules enter a machine receptor and leave as electrical signals.
7. The receptor emits one light filament. It passes through deterministic versions of the webpage's ribbon, spiral, and procedural city.
8. Those systems recede instead of accumulating. The film ends on the filament and a central bead, matching the webpage hero.

Every scene overlaps the next. The causal object remains visible during each handoff: sand enters the wafer, lasers leave circuits, circuits carry current, current becomes neural activity, DNA releases the swarm, molecules enter the receptor, and signals become structures.

## Reused systems

- Music uses the same pinned, multi-frequency ribbon model as `src/sections/FormsChapter.tsx`.
- Pattern uses the same golden-angle phyllotaxis model as the Forms chapter.
- Animal intelligence adapts the Forms chapter's boid vocabulary into authored, deterministic insect motion.
- The city ports the grid, radial falloff, and FBM height field from `src/sections/ShapeshiftChapter.tsx` and imports the shared noise implementation from `src/lib/noise.ts`.

## Preview and render

```powershell
npm run video:studio
npm run video:typecheck
npm run video:poster
npm run video:handoff
npm run video:render
npm run video:delivery
```

- `renders/shape-of-intelligence-mobile.mp4`: 1080 × 1920 master, H.264, CRF 18.
- `renders/shape-of-intelligence-mobile-delivery.mp4`: 720 × 1280 delivery encode, H.264, CRF 26.
- `renders/shape-of-intelligence-mobile-poster.png`: laser fabrication poster.
- `renders/shape-of-intelligence-handoff.png`: exact final handoff frame.

Both MP4 scripts use a 60-frame GOP, producing a keyframe every two seconds at 30 fps. The current verified renders are 48 seconds with no audio stream. The master is 24,878,180 bytes at 4.15 Mbps; the delivery encode is 5,130,920 bytes at 0.86 Mbps. Remotion's bundled encoder reports `yuvj420p` for both files despite the requested `yuv420p` setting; treat that as a known encoder-output fact when choosing a publication pipeline.

## Accessibility and player safety

- `shape-of-intelligence.en.srt` contains the on-screen copy as timed captions.
- `transcript.md` supplies the copy and the visual information carried by each causal handoff.
- Indispensable copy is inset 220 px from the top or bottom of the 1920 px master, outside common player chrome.
- The silent cut contains the complete meaning. A sound-on version remains optional and must deepen, not replace, the visual and textual argument.

## Motion decisions

- All positions are deterministic and frame-based.
- Sand particles keep their identities while moving from beach to wafer.
- Laser scan points and electrical dash motion show where energy is acting.
- Brain firing, DNA rotation, wings, pheromone flow, receptor activity, musical tension, pattern growth, and building height each use a subject-specific motion model.
- Text names causes and relationships; it does not compensate for an ambiguous picture.
- The final systems dissolve into one line rather than combining into an artificial mind.
- The master remains silent for autoplay-muted mobile contexts.
