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

## One immutable layered object

The owner rejected the former source-board crop and its retained backdrop. Runtime now builds one medallion from independently generated transparent frame/settings, pointed rune and neutral gemstone masters, separate SVG signs, core/frame/engraved-line lighting and halo. The original board is reference-only under docs/visual-references/, never a runtime texture. State changes only illumination/color/opacity; transforms, paths and sources stay fixed.

See [MEDALLION_LAYERS](art/MEDALLION_LAYERS.md) for exact prompts, provenance, source registration and limitations. This is a reconstruction, not pixel-identical ornament extraction. No opaque CSS disc remains. Wide desktops fill the central track: 446px at 1920 and 623px at 2560; existing compact/narrow layouts remain verified.

## Verification and delivery

50 Node/temporary-SQLite tests preserve all 48 previous cases and add asset identity/registration checks. Actual browser controls exercise all four states, multisphere and duplicate coverage, backdated additions/cancellations and both owner-resolved date conflicts, without forced visual classes or owner records.

Technical evidence includes independent layers on white/checker/magenta, raw/composed alpha audit, original/assembly/registered overlay, actual state screenshots and four byte-identical normalized SVG geometry exports. Anchor errors stay below 4.35/500 units; this does not imply identical ornament/material. Browser runtimeErrors is empty. Windows compilation and 16 native backup safety tests run in the existing pipeline. Native owner launch/visual acceptance is separate.

See [HANDOFF](HANDOFF.md) for the exact latest source/run/artifacts. Previous green builds of the rejected crop remain historical and do not establish acceptance. PR #6 remains unmerged.

## UX boundary

Missing records remain unknown. No failed-day inference, punitive streak, required seven-day maximum, fake Mastery/Resonance/Balance score, new habit field, database migration, rewards or Android-native work. Internal sphere-day counts support deterministic art/testing; the interface does not present 35 as a target. Permanent achievement/evolution and real game progression remain unimplemented independent systems.
