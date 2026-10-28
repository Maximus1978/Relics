# SANCTUARY-UI-001 — visual recovery

## Authority and review gates

The owner rejected both preceding stacked/vector and painterly-backdrop presentations. Their green builds are historical technical evidence, not visual acceptance. The original desktop TARGET in the owner-supplied Relics_Visual_Handoff packet is authoritative for composition, density, object proportions and artistic quality. VISUAL_CONTRACT v0.2 defines approximately 90% perceptual fidelity; fictional concept labels and game scores are not behavior requirements. All 17 reference/board/state PNGs were inspected.

Gate A: actual React composition/art, screenshots at 1440×900, 1280×800, 1000×800, 390×844 and 320px, with target/rejected/revised comparison. Stop for owner visual review before extensive Gate B polish.
Gate B, only after Gate A review: further integration/state polish and native visual/functional acceptance. CI compilation may already run during Gate A; this does not approve either gate. Keep PR #4 open. Never merge master without owner instruction.

## Composition and assets

A 180px desktop game rail frames one local cathedral panorama. Five substantial dimensional shrine arches flank a central magical wheel (two left, three right). Labels, dynamic rings and wheel geometry remain real HTML/SVG. The inventory directly below presents pendant-like relics; a compact Chronicle summary remains accessible in the desktop viewport. At narrower desktop widths the rail contracts; mobile uses a central circle, compact labeled sphere observations, vertical inventory and functional bottom navigation.

Habit creation/editing uses the existing validation in a native modal dialog, full-screen on mobile. The shared actions menu, reversible archive confirmation, archived view/restore and historical journal remain functional. No intensity/note fields are added. Navigation exposes only Sanctuary, Chronicle and Archive.

Components and styles are separated under src/ui/sanctuary, with application state extracted to src/application/useRelicsModel.ts. Tokens and focused styles replace the previous large sanctuary.css override layer. Original detailed architecture, engraved brass wheel and pendant base were generated with the built-in imagegen tool. Local WebP derivatives total 810,188 bytes, with true alpha for the three foreground objects. No remote asset request, runtime generation, new library/font or dependency is required. [Exact prompts and provenance](art/VISUAL_RECOVERY.md). public/art/recovery/v1/manifest.json records dimensions, bytes and SHA256. Masters are retained outside Git.

## Honest observations

src/domain/recentActivity.ts is a pure read-only projection: inclusive current local day and preceding six local calendar days, independent of the date selected for logging. Each activity snapshot contributes its recorded date once to each of its spheres. Multiple activities on one date count once per sphere; archived/deleted definitions are irrelevant because historical snapshots are authoritative. Old/future/impossible dates are excluded.

Each ring labels observed days as count/7, not a daily goal. The circle reports number of spheres represented, not a health/balance score. Quiet/unknown dates are not failures. No XP, Mastery, Resonance, bonuses, rarity or achievements are invented.

## Preserved boundary

SQL/repository, schema/migrations, original IDs, application/database identities, activity rules, dependencies/locks and Windows build workflow remain unchanged. No private content or owner database was accessed. Existing creation/edit/archive/restore/logging/backdating/snapshots/cancellation behavior is reused.

Browser preview uses explicitly fictional in-memory data and resets on reload. Browser screenshots are actual rendered UI, never generated mockups, and never establish native SQLite/offline acceptance. [Handoff](HANDOFF.md) records exact current verification; owner review decides visual acceptance. Historical painterly build: run 40603575817 on source 59481e388c37d665ef4eb1c5f595215788ec5d01.
