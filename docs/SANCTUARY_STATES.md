# SANCTUARY-STATE-001 — corrected central medallion

## Authoritative contract

This correction stays in [PR #6](https://github.com/Maximus1978/Relics/pull/6), feature/sanctuary-state-001. The owner's supplied four-panel medallion design and subsequent Temporal State Resolution supersede the rejected S-shaped rune and represented-sphere light bands. No automatic merge or next task. Preserve the accepted dashboard, habits, historical snapshots, SQLite schema/identity and native backups.

## Independent time signals

Gemstones always describe saved activity snapshots on the selected local logging date, even outside the current window. The rune/core/frame/engraving/halo describe the actual local current date and preceding six calendar days. Date selection never reanchors that window. Both timeframes have visible and accessible labels.

| Rune state | Condition, in precedence order | Light |
| --- | --- | --- |
| RADIANCE | All 35 distinct sphere/day combinations in the current seven-day window | Maximum core, engraved lines, metal settings/frame and outer halo |
| HARMONY | Otherwise all five spheres on the selected date, and that date is inside the current window | Stronger core and subtle halo; no whole-frame illumination |
| AWAKENING | Otherwise at least one current-window sphere/day | Gradual core illumination scaled by observed coverage |
| DORMANT | Zero current-window sphere/days | Subdued core/frame/engravings/halo |

**DORMANT and RADIANCE never override individual gemstones.** The owner explicitly resolved both conflicts: a dormant current week can coexist with illuminated historical-date stones; a radiant current week can coexist with all stones subdued on an empty historical date. Radiant settings may glow, but must not activate or color the inactive stone faces. This supersedes reference captions implying otherwise.

`medallionIllumination.ts` combines the existing pure recentActivity and selectedDayActivity projections. Weekly counts are summed across distinct date sets per sphere, not activity rows; duplicates and repeated sphere contributions cannot inflate coverage. Multisphere activities count each historical snapshot sphere. Current definitions/archive flags cannot rewrite contributions. Backdated additions and existing cancellation recompute these projections after successful repository refresh. No derived state is persisted.

The selected-date HARMONY condition is the explicit correction requirement; RADIANCE takes precedence regardless of selection. Clearing/invalid input cannot fabricate HARMONY. The existing local-day hook refreshes midnight/focus/visibility without changing the deliberately selected logging day.

## One canonical object, no redesign

The owner has no separate art layers and explicitly requested transfer from the supplied image. The **first dormant medallion** of that exact PNG is the sole canonical object in every state. It is bundled unchanged under public/art/medallion/v1/reference-source.png, SHA256 6168a44f2e36eae80dabdeedec1f1bea6a19bd009be4c7569b43d6e2a330a4e1. The rejected S artwork and prior central pendant frames are no longer used for the central object.

One fixed SVG image viewport selects that first object. Other panels and captions never render. The frame, texture, engravings, rune silhouette/internal paths and five signs are the same source pixels. Static masks select rune/engraving/frame regions and five independent stone faces. State modifies only opacity, gamma/saturation, colored emission and halo; image href/coordinates, geometry, mask paths, gemstone positions and proportions never change. No new rune illustration, new screen, generated variant, canvas, font, library or remote art request. Shrine/habit frames retain their existing approved design and selected-day rules.

[Exact source, masks and provenance](art/MEDALLION_CANONICAL.md). Filters preserve the source's metallic tonal detail. The outer halo excludes inactive gemstone faces. All light is static with small bounded shadows; no animated particles, pulsing, spinning or heavy animated filters. One local PNG is decoded/cached, not four runtime illustrations. The 2,736,506-byte source is intentionally unmodified for identity verification; the browser proof verifies its actual served bytes.

## Verification and delivery

48 Node/temporary-SQLite tests include all previous 38 tests, eight corrected state scenarios and both owner-resolved temporal conflicts. Browser scenarios use actual controls in the explicitly fictional in-memory demo: no forced visual classes or owner records. They fill the current week, cancel/re-add backdated records, verify archived/edited snapshots and capture DORMANT/AWAKENING/HARMONY/RADIANCE plus the two conflicting-date cases, desktop and narrow views.

`medallion-geometry.mjs` compares the actual mounted SVG structure and all geometric attributes across the four states. It also exports four normalized SVGs after removing only light-state metadata; they must be byte-identical. Source artwork is copied to the evidence ZIP for standalone SVG inspection and its checksum must match the owner's PNG. Actual screenshots retain different lighting; normalized geometry SVGs intentionally show the common unlit construction. Neither proves native Tauri runtime acceptance.

Run the unchanged Windows pipeline: locked install, Node tests, TypeScript, Vite, browser checks/proof, actual Tauri EXE build and all 16 native backup safety tests. [HANDOFF](HANDOFF.md) records the exact latest tested source/run, artifacts and limitations. Final [run 40752865133](https://github.com/Maximus1978/Relics/actions/runs/40752865133) SUCCESS on ed08e3e8ea49b64be5dc0693fc0631ef52c0cf51: 48 Node tests, TypeScript/Vite, 142 browser checks, actual Tauri Windows build and 16 native safety tests. Downloaded screenshots/SVG proof and EXE ZIP hashes were verified. Historical green builds of the rejected design are not correction acceptance. The updated PR stays unmerged; stop for owner visual/native review.

## UX boundary

Missing records remain unknown. No failed-day inference, punitive streak, required seven-day maximum, fake Mastery/Resonance/Balance score, new habit field, database migration, rewards or Android-native work. Internal sphere-day counts support deterministic art/testing; the interface does not present 35 as a target. Permanent achievement/evolution and real game progression remain unimplemented independent systems.
