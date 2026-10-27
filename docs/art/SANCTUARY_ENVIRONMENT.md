# Sanctuary environment v1 — asset provenance

Approved scope: on 2026-10-27 the owner selected “Да: оригинальный растровый арт + CSS/SVG”. This permits original raster environment art alongside existing CSS/SVG controls for SANCTUARY-UI-001.

- Generator: built-in image_gen tool via the imagegen skill; no CLI/API fallback or external asset download.
- Intent: generate a new environment, not an edit/crop of the supplied prototype screenshots. References guide atmosphere/material quality; their widgets and numbers are not part of this asset.
- Asset: public/art/sanctuary-environment-v1.png, 1672×941, 3,049,722 bytes.
- SHA256: e3a600959a5ae893ef5f952cd1e9944f78856fed109a9ab55a70f4b68c2f8700.
- Original selected generation copied byte-for-byte into the project; no resizing, cropping, repainting or format conversion was performed.
- Runtime: one decorative image behind the view; local bundled URL, no remote fetch or image-generation runtime. Cropping, legibility glaze and fading are CSS presentation. Actual controls, text, sphere symbols and state are React/CSS/SVG.
- The earlier sanctuary-engraving.svg is retained as historical authored source; the current screen no longer loads it.
- The image was inspected for atmosphere, detail and absence of embedded UI/text/logos. Owner visual acceptance remains separate from technical tests.

## Final prompt (verbatim)

```text
Use case: stylized-concept.
Asset type: a production decorative environment painting for the offline Relics / Sanctuary dark-fantasy application, not a screenshot or mockup.
Primary request: create an ORIGINAL richly detailed, cinematic gothic sanctuary landscape with the material depth and finish of premium dark fantasy RPG environment art. Painterly realism, exquisite weathered stone, oxidized metal details, ivy and damp rock; NOT flat vector art or low-poly rendering.
Scene: an ancient mountain sanctuary rising from a rocky ravine. Elaborate cathedral architecture on the CENTER-RIGHT: layered lancet towers, intricate carved tracery, flying buttresses, worn reliefs, tiny glowing amber windows, one welcoming warmly lit doorway. A worn arched stone bridge crosses the ravine toward terraces and narrow stairs. Gnarled trees and ruined stonework frame the left foreground, with moss and ferns. Distant jagged mountains, fine drifting mist, a pale partially clouded moon. Calm refuge and wonder, not a threatening battle scene.
Composition: panoramic LANDSCAPE 16:9, ideally 2048x1152. The scene will sit behind a real interactive interface. Put the architectural focal point around 65% across and 35% down, with enough of the building in the upper-middle area to remain recognizable when cropped on narrow screens. Keep the left 35% atmospheric, dark and relatively quiet for readable overlaid headings; do not leave a blank black rectangle. Lower 35%: subdued stone, terrace, roots and shadow suitable for darker interface panels. Layer foreground, midground and distant mountains with convincing perspective and depth.
Lighting: cool charcoal, slate blue and moonlit gray-green ambient light against restrained antique-gold candle/window illumination. Realistic reflected light, beautiful local texture and controlled highlights, deep blacks with readable detail. Warm light must feel inviting, no neon, no oversaturation, no washed-out fog.
Output intent: fully painted finished environment asset, richly authored realism and crisp material detail across the scene, original architecture and composition. No people, monsters, weapons, combat, gore, logos, letters, numbers, watermarks, UI, cards, borders, icons, gemstones, meters, or embedded text. Do not reproduce any proprietary game architecture or identifiable franchise design.
```
