# SANCTUARY-UI-001 — painterly Daily Mode

## Scope and owner direction

Started from accepted HABITS-001B master 8fc41b39d433fd1c9d26c71757580ae3a3567e77. The original desktop/mobile prototype screens set the minimum target for atmosphere, material depth and authored detail, not just color. The first flat/vector proposals were not visually accepted.

On 2026-10-27 the owner explicitly approved original raster environment artwork plus CSS/SVG controls. That asset-format question is resolved; do not ask again. This remains the same task and PR #4. No gameplay, progression, statistics, museum, secret content, Android build or data-rule expansion.

## Implemented presentation

One original painted environment sits behind the layout: layered gothic cathedral architecture, carved/aged stone, bridge and terraces, vegetation, distant mountains/mist and restrained warm windows against cool ambient light. It is bundled at public/art/sanctuary-environment-v1.png, 1672×941 and 3,049,722 bytes. No external image request or runtime image generation is required. The selected built-in imagegen output was copied byte-for-byte into the repo, with no resize/conversion/crop/repaint of the file. [Full final prompt, method, hash and provenance](art/SANCTUARY_ENVIRONMENT.md).

The screen uses a single image, with CSS crop/fade/glazing for desktop and narrow widths. It does not repeat the cathedral in a separate hero image. The raster contains no interface labels, scores or controls. All actual text, input, icons, state, medallions and management remain React/CSS/SVG.

Authored SVG metal settings add bands, engraving, prongs, faceted glass/reflections and symbol inlays. Panel frames use fixed 120×120 source dimensions for stable nine-slicing; authored stone grain tiles at 256px. No new libraries, fonts or dependencies were added. Georgia/system serif supplies headings; Segoe UI/system sans supplies controls/Cyrillic. The earlier vector engraving is retained as historical authored source but is not loaded by the current screen.

| Sphere / gemstone | Symbol and color |
| --- | --- |
| Body / Ruby | Dumbbell; muted red |
| Mind / Sapphire | Brain; blue |
| Bonds / Garnet | Heart; rose; stable domain ID relationships |
| Work / Topaz | Briefcase; amber |
| Recovery / Emerald | Leaf; green |

These identities and ornamental frame options are decorative categories, never earned tiers or unlocks. Names and shapes accompany color in the overview, cards, form and journal.

## Daily Mode remains functional

Brand/local status → Sanctuary → five categories → selected date/active habits → expandable journal. Active habit cards keep one-click completion and explicit check/Отмечено state. The existing shared validated form, edit/archive/restore disclosure, archive confirmation, errors and focus return remain. Historical activity snapshots and cancellation use the unchanged repository.

Today/Yesterday/calendar share the same selected local-day state and existing domain validation. Yesterday uses local calendar arithmetic. The journal starts collapsed; its count is real, and expanded rows retain historical name/sphere snapshots and cancellation.

Responsive cards become one column and the category gallery wraps on narrow screens. Visible actions retain 44px target height. Tab/Enter/Escape, skip link, native inputs/disclosures, screen-reader names, focus outlines, reduced-motion handling and text enlargement remain. A browser check verifies the first card fits a 1000×800 content area when demo-only banner height is excluded. This does not assert native runtime acceptance.

## Data and preview safety

Domain, SQLite adapter, migrations/schema, IDs, database/app identity, dependency locks and Windows workflow remain unchanged. No personal database or private/ content was read. Browser preview is explicitly fictional, interactive only in memory, resets on reload and never opens SQLite or persistent browser storage.

Windows compilation and browser interaction evidence must not be described as native UI/persistence verification. The owner accepted the previous native tracker baseline; this redesigned presentation still needs its own native visual/offline review. Visual quality is an owner acceptance decision and cannot be inferred from green CI alone.

## Verification and delivery

Local and Windows CI tests passed 25/25, including all 23 unchanged SQLite/domain tests. [Windows run 40603575817](https://github.com/Maximus1978/Relics/actions/runs/40603575817) completed successfully: npm ci, TypeScript, Vite, 36 browser checks, locked Cargo fetch, actual native Tauri release compilation and artifact uploads. Node v22.23.4 and Rust/Cargo 1.99.1 were used.

- [PR #4](https://github.com/Maximus1978/Relics/pull/4) remains open/unmerged for owner visual/native review.
- Tested feature source: 59481e388c37d665ef4eb1c5f595215788ec5d01. Tested PR merge source: e304fb2677b6aaf3495b9d2c3002e8ab00409c65. A subsequent documentation-only evidence commit uses [skip ci]; runtime source/art/tests/browser scripts stay identical to this tested source.
- [Painterly Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40603575817/artifacts/12780441428), 7,305,764 bytes. Local copy: outputs/Relics-Sanctuary-UI-001-painterly-windows-x64.zip outside the repo. ZIP SHA256 db7905d43b22ba25c6ede8e5184919ff05b22b21e39ca8fc0f61bf582728d0ea.
- relics.exe: 15,178,240 bytes; SHA256 5a202681dbd94b58a2be85ed33f209e8d16a70af57a93109bb6ae40cf728e2b8. Downloaded ZIP digest matched GitHub, EXE matched its manifest, and build-info.json confirmed both exact source SHAs above. nativeUiRuntimeVerified=false and signed=false.
- [Browser evidence](https://github.com/Maximus1978/Relics/actions/runs/40603575817/artifacts/12778999481), 5,627,253 bytes. Downloaded digest verified: a2829c1f7c0b74e585df1bc3505d407d45aa61bc83ef21dc7af37fc5d6410fbd. All four screenshots were inspected against the references. Local copies: outputs/Relics-Sanctuary-painterly-desktop.png, Relics-Sanctuary-painterly-1000.png, Relics-Sanctuary-painterly-mobile.png and Relics-Sanctuary-painterly-journal.png.
- GitHub artifact retention ends 2026-11-10. No native executable was launched against owner data by this task; native appearance/accessibility/offline restart acceptance remains manual.

Browser evidence includes desktop 1280px, desktop 1000px, 390px narrow layout and expanded journal PNGs, rendered DOM and result.json. Checks include the single local high-resolution environment, five sphere emblems, keyboard/forms/validation/focus, completion/date shortcuts/backdating, edit/archive/cancel/restore, old journal snapshots/cancellation, preview reset, 320–1280px overflow, 44px actions, enlarged text and reduced motion.

## Historical iterations

- First flat presentation: run 40583750205, source cbd98965e851c6d30f20718a5ee5ea378cf978ee.
- More detailed SVG proposal: run 40586705022, source 857c9dcd5233c6ca17ee5e78354235dce0216553.
- Those earlier executables/screenshots do not contain the current painted environment.

## Owner visual/native review, before merging

Close the previous Relics instance, extract the new Windows ZIP separately and run relics.exe; no compiler/toolchain installation is needed. Review the standard window, resized widths and text scaling. Check architecture/material richness against both prototype references, readable text/focus and quick logging. Log today/yesterday/another past date; create/edit/archive/cancel/restore a habit; expand/cancel journal; close/reopen offline and confirm existing history.

No automatic merge or next task. Unsigned Windows x64/WebView2 limitations remain. Await owner/product visual acceptance after delivery.
