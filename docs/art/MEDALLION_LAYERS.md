# Sanctuary independent technical layers, v2

The owner rejected the complete-render crop because it retained an unwanted backdrop and was too small on wide desktops. This revision reconstructs the supplied medallion as independently reusable transparent assets, not four state illustrations. It remains in unmerged PR #6.

## Assets and provenance

The built-in image_gen tool generated three original RGBA PNG layers with transparent_background=true, using the owner's four-panel design as a reference. Exact prompts are archived in [MEDALLION_LAYER_PROMPTS.json](MEDALLION_LAYER_PROMPTS.json). The generated files were copied unchanged; registration, low-alpha cleanup, tint and illumination are SVG operations.

- public/art/medallion/v2/frame.png: metal ring, engravings and five empty gemstone settings; transparent center and sockets.
- public/art/medallion/v2/rune.png: one fixed pointed rune with transparent internal gaps, separate from the ring.
- public/art/medallion/v2/gem.png: neutral faceted stone master, reused at five fixed positions.
- SphereSymbol SVG paths: separate sphere signs, not painted into the stones.
- Dynamic layers: stone tint/emission, rune core, engraved-line highlights, frame lighting and outer halo.

All PNG masters are 1254 x 1254; exact byte sizes and SHA256 are in public/art/medallion/v2/manifest.json. Source registration is in src/ui/sanctuary/medallionLayers.ts. The common viewBox is 500 x 500. No state changes asset URLs, transforms, rune silhouette, frame construction or gemstone positions. No remote assets, new packages or generated state swaps.

The exact owner reference is retained unchanged at docs/visual-references/sanctuary-medallion-source.png (SHA256 6168a44f2e36eae80dabdeedec1f1bea6a19bd009be4c7569b43d6e2a330a4e1). It is used only for developer comparison, outside public/ and the runtime bundle. v1/reference-source.png is removed from runtime.

## Genuine transparency and comparison

CI reads raw alpha, tests four transparent corners and frame/rune holes, and rasterizes the actual mounted SVG to verify four interior cavities are exactly zero-alpha. The frame master has one alpha=1/255 residue at a socket probe; the shared SVG CleanAlpha filter removes near-zero generation residue while retaining antialiasing. There is no opaque CSS background disc.

Developer-only evidence includes layer-gallery.png / .html with each asset on white, checkerboard and magenta, plus composition-neutral.png and separate signs-layer.png. reference-overlay.png / reference-comparison.html compare the original first medallion, actual neutral assembly and registered overlay. They are diagnostic artifacts, not new product screens.

The five actual sign centers align within 4.35/500 units of manually measured reference centers. This is an anchor registration check, not a whole-contour or pixel identity claim. The reconstruction follows the reference construction and pointed rune direction; detailed ornament, facets and lighting differ. Owner visual acceptance remains pending. Do not describe generated reconstruction as an exact extraction of original pixels.

Four actual state screenshots retain distinct light. Four normalized SVG exports are byte-identical after removing lighting metadata. See medallion-geometry-proof.json for asset hashes and geometry proof; layer-alpha-audit.json for actual alpha and registration measurements.

## Responsive layout

At viewport widths >=1500px, the medallion fills its central grid track without the previous 270px cap. The installation height grows naturally, and shrines retain proportional height. Verified wheel/track widths: 446.15625 at 1920 x 1080, 623.0625 at 2560 x 1440. Existing 1440, 1280, 1000, 390 and 320 layouts remain checked. No horizontal overflow or installation overlap was reported.

Daily gemstone and current-seven-day rune semantics are unchanged; see [SANCTUARY_STATES](../SANCTUARY_STATES.md). No database, backup, habit or game-progression changes. Final source/run and Windows artifact are in [HANDOFF](../HANDOFF.md).
