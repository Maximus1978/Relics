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

## Gate A evidence and remaining differences

[Windows run 40619945699](https://github.com/Maximus1978/Relics/actions/runs/40619945699) passed on feature source 1ab9c34f8ac7f657af2b6de8b37bc53556ccc9e1 / PR merge source afef95ec0928b717c3ad5afd566c9f00ca9f7bc8: npm ci, all 31 tests, TypeScript/Vite, 40 browser checks, locked native dependencies and Tauri Windows release compilation. Documentation-only evidence thereafter leaves runtime source unchanged.

[Browser ZIP](https://github.com/Maximus1978/Relics/actions/runs/40619945699/artifacts/12787540029) contains all five target viewport captures plus create/edit/validation/menu/archive/journal-header captures, result JSON and rendered DOM. All five target sizes and management states were inspected. [Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40619945699/artifacts/12786548417) contains the unsigned executable and exact build/checksum metadata. Downloads were checked against artifact digests; executable checksum and source SHAs matched. HANDOFF records all hashes and local evidence paths. Artifacts expire 2026-11-11. No native executable was launched here.

The actual revised composition now has the rail, 2+3 shrine arrangement, primary circle, inventory and visible Chronicle entry. Current source uses one shared arch and pendant silhouette; central star and gem facets remain simpler than the target. The original panorama differs in architecture/crop. Small auxiliary labels/compact typography, complete expanded-journal/mobile-form visuals and native text-scaling/contrast/offline acceptance require Gate B after owner Gate A review. Real recorded-day counts replace fake concept scores. Do not declare 90% fidelity achieved without owner judgment. Stop for Gate A; do not merge.
