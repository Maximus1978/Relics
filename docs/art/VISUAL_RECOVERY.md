# Visual recovery original artwork v1

Generated with the built-in image_gen.imagegen tool, transparent_background=true for shrine/wheel/relic. No CLI, API key, borrowed game asset, external download, prototype crop or flattened interface was used. Runtime controls/text are semantic React HTML/SVG.

Selected PNG originals are preserved in outputs/Relics_Visual_Recovery_Art_Masters outside the repository. Pillow performed only deterministic RGBA conversion, proportional LANCZOS downsampling and WebP quality90/method6 encoding, as explicitly requested for WebView2 optimization. No repainting or creative image editing was performed. The existing environment PNG remains versioned as its source; its optimized derivative is used at runtime.

| Runtime file (public/art/recovery/v1) | Size | Dimensions |
| --- | --- | --- |
| environment.webp | 453010 bytes | 1672×941 |
| shrine.webp | 181352 bytes | 512×1024 |
| wheel.webp | 132350 bytes | 640×640 |
| relic.webp | 43476 bytes | 384×384 |

Total 810188 bytes. Versioned manifest.json records SHA256 of runtime files and original masters. Foreground alpha was verified; shrine center and outside, wheel center and outside, pendant center and outside are transparent.

## Shrine exact prompt

Use case: stylized-concept. Production game UI decorative asset, NOT a whole screen.
Create a SINGLE original ornate gothic SHRINE / alcove frame, perfectly front-facing and symmetric, isolated on genuine transparent background, portrait 1:2 composition. Highly detailed painterly realism comparable to premium dark gothic RPG interface art: layered weathered stone, dark carved pilasters with small hooded stone reliefs, aged brass ribs, pointed cathedral arch, rich engraved tracery, subtle bevel highlights, a small empty gemstone mounting at the crown, three worn stone steps and sparse moss at the base. Believable dimensional relief and material depth, cool slate ambient and restrained antique-gold highlights.
CRITICAL: The INNER OPENING must be genuinely transparent, EMPTY and large, from about x=23% to77%, y=28% to87%. It will contain real HTML icons, a heading and a dynamic SVG ring. Do not draw anything in the inner opening: no back panel, central symbol, letters, numbers, rings, buttons or gemstones. Keep the outer background transparent as well. Leave generous clear center.
Composition: complete top crest to bottom steps visible with small transparent padding, no cast shadow outside the object, no scene/background, no adjacent frames, no tabletop, no explanatory labels, no fantasy UI screenshot. One versatile neutral dark-stone and antique-brass architecture that can be reused for five colored sphere shrines. Sharp authored ornament, rich highlights, not flat vector lines, not cartoon, not plastic, no proprietary game assets or logos.

Selected source: exec-cb43bb6f-ee5b-42f5-941b-18fd5cbd3d7e.png.

## Wheel exact prompt

Use case: stylized-concept. Production decorative game UI asset, not a screenshot.
Create one completely original antique-brass magical BALANCE WHEEL armature, front-facing, perfectly circular, isolated on genuine transparent background, square composition. Rich painterly physical material quality: massive engraved outer ring with layered beveled metal, precise concentric tracks, filigree, tiny geometric etchings (NOT lettering), small sculpted prongs and a subtle eight-point compass star in the center. Cool dark tarnished brass with restrained polished-gold edge highlights, very dimensional relief and natural patina, not flat line art.
The ring should occupy x=6..94%, y=6..94%. Keep most of the central disk transparent so that the environment shows through and dynamic SVG orbit lines can be placed above it. Five EMPTY small jewel mounting bezels spaced on the rim: one at top, two around upper-left/right, two around lower-left/right. The empty mounts must be neutral metal or transparent, with NO colored gems, icons or numbers: the real application will add the five colored sphere symbols and jewels as scalable SVG.
No words, letters, numerals, labels, clocks, UI panels, game scores, hands, background, scene, frame around the image, opaque black backdrop or shadows outside the object. Preserve actual alpha transparency inside and outside. Authored Gothic RPG artifact quality, not a proprietary design, no logos.

Selected source: exec-9a5fe039-b7f3-4a87-84ff-fb7a6dee453d.png.

## Relic base exact prompt

Use case: stylized-concept. Single original decorative relic base for a dark Gothic RPG inventory UI. Genuine transparent background, square composition, front facing. A precious-looking but weathered antique-brass and dark-silver TALISMAN frame, with a small suspension loop above, layered metal leaf scrolls and pointed cardinal prongs, finely carved beveled relief, believable rich metal shading/patina, subtle wear and restrained warm rim light. Its silhouette should feel like a collectible pendant, not a generic circle button.
Keep the CENTRAL gemstone opening genuinely transparent and empty: a circular area about 50% of the whole image diameter centered at x50% y53%. The real application will draw a colored faceted gem and a life-sphere symbol in it. Do NOT put any central emblem, symbol, gem, lettering, numbers, stats, text, UI panel or button in this image.
Complete frame must be visible with small transparent margins. Main frame approx 76% of canvas width; top loop and lower pointed flourish stay inside canvas. No opaque black backdrop, no scene, no external cast shadow, no logos or proprietary designs. Highly detailed painterly object quality; physical facets and sculptural metal relief, not flat vector art.

Selected source: exec-70ba4658-3b7d-4fb2-b2b6-b22900ada431.png.

## Existing environment

[Original exact prompt/provenance](SANCTUARY_ENVIRONMENT.md). Original PNG SHA256 e3a600959a5ae893ef5f952cd1e9944f78856fed109a9ab55a70f4b68c2f8700. Only its optimized derivative is newly introduced here.
