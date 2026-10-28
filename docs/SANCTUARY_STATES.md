# SANCTUARY-STATE-001 — living gemstones and Sanctuary rune

## Scope and reference

The owner accepted BACKUP-001 and merged PR #5 at 234c35a7be4306ba1fee082f01409122715e2846. This task preserves that native service, SQLite/migrations, app identity, existing activity/habit rules and the approved Sanctuary composition. No new product fields, game rewards, XP, Mastery/Resonance mechanics or Android-native work.

The supplied **Dark Fantasy Rune UI Style Guide.png** in the visual handoff's states folder is the state/material reference: faceted colored stones, detailed shared metal frames, recognizable subdued signs, engraved gothic seal and restrained light. It is an art reference, not a generated app screenshot or a prescription for unrelated screen changes. Actual browser captures and the owner's native acceptance are separate evidence.

## State contract

| Layer | Source | Presentation |
| --- | --- | --- |
| Shrine gemstones | Any activity snapshot for its sphere on the selected local logging date | Colored, faceted, illuminated if present; dark/desaturated with a recognizable tinted sign otherwise |
| Five wheel gemstones | Exactly the same selected-day projection | Same gemstone/frame/identity as shrine; never a separate recent-activity indicator |
| Ordinary habit pendant | Activity for its stable habit ID on the selected date, including archived view | Subdued or illuminated; existing saved confirmation retained; name/actions are never dimmed |
| Existing rings | Distinct recorded dates per historical snapshot sphere, today and six preceding local calendar dates | Original count/7 observation; not a required completion target |
| Central Sanctuary monogram | Number of represented spheres in that same current seven-day window | Static metal/light bands: 0 subdued, 1–2 partial, 3–4 diverse, 5 full; no reward or retained advancement |

Missing records mean unknown, never confirmed inactivity or failure. An empty selected day can correctly have dark surrounding stones and a lit recent-period monogram. Labels below the installation and accessible wheel/shrine descriptions explicitly distinguish the periods. Clearing an editable date input gives a safe subdued preview; the existing repository still validates logging dates.

`selectedDayActivity.ts` is pure and read-only. It uses occurredOn and saved spheres, never current habit definitions, UTC conversion or recordedAt. Multisphere entries illuminate every saved sphere. Edits/archives do not rewrite history; cancellation uses the existing removal semantics and recomputes state immediately after successful refresh. An ordinary pendant still uses the definition's first sphere for its current visual identity; independent icon/primary-sphere selection is future work. All assigned spheres remain labeled.

`recentActivity.ts` is unchanged and independent of the date selector. A small local-calendar hook refreshes current-day observations at midnight and on window focus/visibility, including after sleep. The selected logging day remains a deliberate user choice; Today selects the new local day. No derived visual state is written to SQLite or backup JSON.

## Art and performance

SphereGem shares the existing original raster pendant frame (public/art/recovery/v1/relic.webp) with authored SVG depth, eight facets, bezel highlights and actual line symbols. Subdued treatment affects decorative material only, not shrine architecture, headings, rings or buttons. Canonical identities remain ruby/body, sapphire/mind, garnet/bonds, topaz/work, emerald/recovery. Ordinary relics all share one base frame; no rarity or unique earned artifact.

SanctuaryRune is original repo-authored SVG: twin split gothic vaults enclosing an interlocked angular S, metallic bevel/engraving, fine circular tracery and a small inlay. It replaces the center compass paths and is isolated as Sanctuary presentation for future World Pack replacement. It is not copied from a game or extracted from the reference image. No full-screen images, new raster combinations, fonts, dependencies or remote asset requests are introduced. Existing frame provenance remains in [VISUAL_RECOVERY](art/VISUAL_RECOVERY.md).

Light is static: no timers for particles, rotation, pulsing, animated filters or large blur layers. Repeated gems reuse cached local art. Small CSS drop shadows and SVG gradients provide depth. Existing reduced-motion handling remains; no compulsory animation. WebView2 GPU/contrast and native keyboard review remain owner acceptance items, not inferred from compilation.

## Verification and owner review

Node tests cover empty/single/multisphere/all-sphere days, cancellation overlap, backdating/date switching independent of the seven-day anchor, archive/edited historical snapshots, invalid date input and immutability. Existing real temporary-SQLite habit/history tests remain. No owner database or private content is accessed.

The browser CI scenario uses actual controls and the existing explicitly fictional, reset-on-reload demo. It captures fully subdued/partial/all-five desktop and narrow layouts plus rune close-ups at zero/partial/diverse/full recent coverage. It checks old-date logging, immediate cancellation, edited/archived snapshots and unchanged recent values when the selector moves. It does not inject visual classes, fabricate rendered screenshots or imply native storage verification. Existing browser management/accessibility/backup-unavailable checks remain.

Run existing Windows workflow: npm ci, Node tests, TypeScript, Vite, browser evidence, locked Tauri Windows executable, all native backup safety tests. Exact tested SHA/run/artifacts and actual results belong in [HANDOFF](HANDOFF.md) after execution. This implementation is under verification, not yet owner-approved. Deliver an unmerged PR and EXE ZIP, then stop.

Owner review: compare the actual screenshots with the supplied state render; close the old app and run the new extracted EXE. On a date with no records check dark stones with readable actions; record a multisphere habit and verify all associated shrine/socket gems; cancel through Chronicle and verify refresh. Switch to a past date while observing that rings/rune retain the current seven-day period. Check archived history and backup access without replacing personal data solely for this visual task. No following task starts automatically.
