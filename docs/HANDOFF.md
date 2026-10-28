# Project handoff

## Active implementation: WEIGHTS-001B, Gate B1

WEIGHTS-001A owner-approved; PR #7 merged at 6e122e7221c33d909ff2f4ecdbfba75b210f5b08. Feature branch feature-weights-001b starts from that verified master. Implement profiles/migration004/snapshots and v2/v1 native backup with temporary-data rollback/crash verification first; Gate B1 PASS before UI integration: 59 Node/temporary-SQLite tests and22 native tests passed (one intentional child crash helper ignored standalone), including actual SQLx migration rollback, strict TS/Rust vectors, v1 replacement/weighted v2 safety undo, failure/crash/reopen and JSON byte limits. UI integration is now authorized by this verified gate. Deliver separate unmerged PR with Windows CI/EXE/screenshots, preserve rune/art/history/offline behavior and stop. No trend/progression/Android work and no owner-DB testing.

## Delivered for owner review: WEIGHTS-001A

Verified latest origin/master: c2375e7543649ce80e25151bf79c0376c985ad9d (DOC-GAME-002 complete, PR #6 regular merge be2cd4e9fd5ecb90a34aae22e578e2c6f19939a9). Branch docs-weights-001a; [documentation PR #7](https://github.com/Maximus1978/Relics/pull/7) is open and unmerged. Only Markdown changes; no migrations, application/native code, tests, artwork, dependencies or owner data changes.

Owner-approved: independent subjective contribution 1–10 per selected sphere, default 5, unselected 0, no normalization, one-to-five spheres, no extra completion input, immutable recording-time activity profiles and unchanged binary rune. Owner clarification: old definitions get marked 5 defaults for future logs; those future entries are included in numeric trends with origin/count disclosure. Old activities remain unknown, never fabricated zeros or fives. See D058–D063.

[WEIGHTS_001A](WEIGHTS_001A.md) is the implementation-ready REVIEW PROPOSAL: versioned profile/origin, next additive 004 migration, atomic habit writes/event snapshot, strict backup v2/schema 4 with v1/schema 3 import and weighted safety/rollback, reference-based Create/Edit accessibility, pure future day/week/share/4–8-week projection, explicit WEIGHTS-001B task and W01–W26/T01–T05 matrix. Engineering proposal approval is pending; no proposed functionality is implemented here.

Reference 2026-10-28_14-44-28.jpg supplies Sanctuary rows/controls/visual language. Show units, not percentages; inactive rows0, no active editor. Existing medallion art stays. Pictured description/icon picker/counters and effort fields are not scope. No graphs, intensity/duration/repeated sessions/AI/Balance grades/Mastery/essences/rarity/probabilities.

## Priority override and next single task — do not start

Owner explicitly overrides the prior NAV → early Android sequence:
1. WEIGHTS-001A: specification/UX review, this documentation PR; do not auto-merge.
2. WEIGHTS-001B: separate persistence/editor/backup PR and native Windows acceptance after specification approval.
3. SPHERE-TRENDS-001: real snapshot-based absolute/relative trends after WEIGHTS-001B acceptance.
4. NAV-CHRONICLE-001: dedicated Chronicle view.

Android is deferred until core mechanics are validated on Windows. All earlier approved roadmap features remain. Review concrete storage/projection details (Q21/Q22); primary visual identity/rewards/actual progression stay separate. Next single implementation task: WEIGHTS-001B, NOT started. Stop for owner review.

## Documentation checks and publication

Required docs plus linked full contract, consistency notes in README/AGENTS/product vision/World Packs and backup-evolution note are updated. Preserve previous decision IDs; append D058–D063. Review completed: 13 Markdown files only; relative links/anchors valid; all previous decision rows and roadmap task IDs retained; D001–D063/Q01–Q22 unique; 26 WEIGHTS-001B and 5 future trend cases documented, not run. No runtime tests/build/EXE are claimed for documentation-only WEIGHTS-001A. The last accepted Windows build remains run 40764405205 on 81cc6e7897f03eafbaccd0f178eff992727a7a28 (50 Node/150 browser/16 native tests), not execution of the new planned weight cases.

## Historical DOC-GAME-002 release receipt

The following receipt is retained as history. Its former immediate NAV/Android queue is superseded above by D062; it cannot authorize another task.

## Completed: DOC-GAME-002 — approved decisions and STATE-001 release

Owner instruction dated 2026-10-28: STATE-001 functionality/current visual direction were tested and accepted on Windows, including the central rune, four illumination states, independent selected-day stones and responsive transparent technical layers. Remaining art defects are non-blocking future work. This explicit instruction supersedes prior PR #6 no-merge/review holds.

Scope: Markdown-only product consolidation and regular merge of existing PR #6, then record actual merge/master state. No feature, artwork, schema, workflow or dependency changes. Source branch starts at 986bab5c2aa98dab8b11916f58b9f5b398b72f42; base master 234c35a7be4306ba1fee082f01409122715e2846. Changes after the successful tested runtime 81cc6e7897f03eafbaccd0f178eff992727a7a28 were verified Markdown-only. Release status: PR #6 merged by regular merge at be2cd4e9fd5ecb90a34aae22e578e2c6f19939a9 on 2026-10-28; GitHub reports merged=true and state=closed. Parents are accepted baseline 234c35a7be4306ba1fee082f01409122715e2846 and reviewed documentation head 9163d74d4bbe20808be076bb36a47d9414de9957. Local master was synchronized to this merge.

## Final release verification

Before merge, the existing Windows run 40764405205 was confirmed SUCCESS and all changes since its tested code/art head were Markdown-only. After merge, the master tree matched reviewed release tree 114bd97a236b49ca68f252db931161f0e4cf8d44. Runtime/art/tests/native code/locks/workflow remained byte-for-byte unchanged; no new executable or rerun was required. Documentation links, D001–D057/Q01–Q20 and retained Adventure task scope were checked. This subsequent master receipt updates Markdown only with [skip ci] and preserves the merge in history.

## Consolidated product boundaries

Accepted principles, future implementation: focused Sanctuary/full Chronicle destination; Habit Sigils versus Unique Artifacts; Collection/Chronicle/Museum responsibilities; permanent Mastery versus recent Resonance versus contextual Balance; optional temporary Blessings; manual Vacation Mode and separate opt-in rhythm suggestions; restrained offline sound; non-blocking art refinements. D049–D057 record these without rewriting prior decisions. An all-five-sphere habit can produce 35/35 descriptive coverage after seven logs; that is not proof of healthy Balance or an automatic strong reward.

No numeric Balance/progression formula, Blessing chance/stacking/expiry, vacation afterglow duration or audio defaults are chosen. See OPEN_QUESTIONS and small roadmap contracts. No secret names/recipes are accessed, invented or exposed. Adventure Mode and versioned World Packs remain future scope: Sanctuary, Clockwork, Wasteland, Verdant.

## Historical next-task order — superseded by D062

NAV-CHRONICLE-001: move full history to existing left Chronicle destination, remove expanded dashboard history, preserve historical snapshots/backdating/cancellation; optional compact recent-activity hint. Then ANDROID-001 / ANDROID-LOG-001 early compatibility checkpoint before complex gameplay grows. Do not automatically start any of them.

BALANCE-001 is required before numeric Balance KPIs; LIFE-RHYTHM-001, RHYTHM-INSIGHTS-001, BLESSINGS-001 and AUDIO-001 are specification gates with smaller follow-up tasks. Remaining icon/contribution/progression/alchemy/artifact/Collection/world/epoch/Museum tasks are preserved in ROADMAP.

## Implemented correction

One immutable medallion is assembled from independent transparent RGBA frame/settings, rune and neutral stone masters, separate actual SVG sphere signs and core/engraved/frame/halo lighting. The original owner board moved to docs/visual-references/ and is never a runtime texture. There is no opaque CSS backdrop disc or four-image state swap. [Layer provenance and exact generation prompts](art/MEDALLION_LAYERS.md), [state contract](SANCTUARY_STATES.md), decision D048.

At >=1500px, the wheel fills its central track and installation height grows proportionally. Actual 1920 x 1080 wheel/track width 446.15625px; 2560 x 1440 width 623.0625px, replacing the former 270px cap. Compact/narrow layouts remain checked.

Temporal behavior is unchanged: selectedDate exclusively controls gemstones. Rune priority is 35 distinct current-window sphere/days RADIANCE; otherwise all five selected-day spheres within that window HARMONY; otherwise positive current coverage AWAKENING, zero DORMANT. The current window remains today plus six prior local dates. DORMANT/RADIANCE never override selected-date stones. Both date periods remain labeled.

No SQLite/migrations/repository/native backup/capability/identifier/lock/workflow changes. No owner database/private content accessed. No gameplay, new habit fields or Android work.

## Verified source and evidence

Tested source: 81cc6e7897f03eafbaccd0f178eff992727a7a28. Synthetic PR merge source: 75a82e33452d24a62dca71e6d5c8c65f327de18f.
[Windows run 40764405205](https://github.com/Maximus1978/Relics/actions/runs/40764405205): SUCCESS. Actual locked Tauri Windows release compilation PASS; all 16 native backup safety tests PASS, zero failed, one standalone crash helper intentionally ignored because its passing parent executes it as a child.
Locked npm ci, all 50 Node/temporary-SQLite tests, TypeScript and Vite PASS. 150 actual browser checks PASS with runtimeErrors=[]; separate technical alpha/registration audit PASS. Hosted CI is authoritative because local build child-process restrictions remain. No local environment repair required.

[Browser evidence ZIP](https://github.com/Maximus1978/Relics/actions/runs/40764405205/artifacts/12848009882): 47,733,270 bytes, downloaded SHA256 dd515873d71b44a2af1324260ca0255266df7e7a3e4089b3455f5e8feb9ab389 matches GitHub. Expires 2026-11-11.

- layer-gallery.png / .html: independent frame/rune/stone/signs over white/checker/magenta.
- reference-overlay.png / reference-comparison.html: reference, actual neutral assembly, registered overlay.
- layer-alpha-audit.json: actual raw alpha and four exactly-zero composed interior probes. All corners transparent; no opaque CSS disc; 3 independent sources.
- Sign center maximum registration error 4.35/500 units. This checks anchors, not pixel-identical ornament. Independent reconstruction has material/facet/ornament differences from the owner reference; the owner has accepted current Windows visuals/functionality; these detail differences are non-blocking backlog.
- medallion-{dormant,awakening,harmony,radiance}.png and both historical-date conflict screenshots: actual controls and fictional in-memory fixtures, no forced visual classes.
- medallion-geometry-proof.json / geometry-{state}.svg: actual geometry hash a3a7b6d33feb9caaa1ba09f5aab6c3c4ee02321f72e8e2dce272584479aab7a8 matches in all four states. Four normalized SVG files are byte-identical, SHA256 9c6011f7cb6c8bb12ea03ca9aaea41f76e8452acc16ee36145fbdc4c0938985f; verified after download along with the three PNG checksums.
- wide-medallion-layout.json and actual 1920/2560/narrow views: no overflow/overlap; wheel fills track.

Local ZIP/extracted evidence: outputs/Relics-technical-layers-browser[.zip], outside Git. Original generated masters were copied unchanged to public/art/medallion/v2/.

[New Windows x64 EXE ZIP](https://github.com/Maximus1978/Relics/actions/runs/40764405205/artifacts/12849154157): 11,806,625 bytes; downloaded SHA256 78ea47ee7fbb2fc3edd5daba619a60df459b61ba92b14bd0a25b1575a083ba07 matches GitHub. EXE 20,387,328 bytes; SHA256 4f9a6970aa0036c13650f64b62f4a56d70078226dd64bd7c40458a9c98385585 matches executable-sha256.json. build-info confirms exact tested head and synthetic merge above, Node22.23.4/Rust1.99.1, signed=false and nativeUiRuntimeVerified=false. Artifact expires 2026-11-11. Local ZIP/extracted files: outputs/Relics-technical-layers-windows-x64[.zip], outside Git.

## Release evidence and historical limits

Documentation-only receipt commits use [skip ci]; they do not change the tested runtime/scripts/assets/locks/workflow. The owner has now tested and accepted STATE-001 on Windows (D049). Documentation-only release updates supersede earlier review holds. Green build and geometry checks were not treated as that acceptance. The previous run 40752865133 verified a now-rejected complete-render crop; its EXE must not be used to review this correction. Initial layered run 40763788453 failed only in the new diagnostic script's escaping; fixed in the exact tested head above.

Existing download instructions: close the older app, download the new Windows x64 ZIP linked above, extract separately and run relics.exe on Windows with WebView2. It is unsigned. No executable was launched against owner data here. The owner reports Windows functionality/current visuals accepted; CI's nativeUiRuntimeVerified=false is an unchanged build-time manifest flag, not a claim that the later manual test did not occur. Browser evidence uses fictional nonpersistent demo data.

DOC-GAME-002 stopped after release. Its previous NAV/Android order is superseded by the active WEIGHTS-001A owner override above.
