# Active owner addendum: recent seven-day analytics

Add «1 неделя (последние 7 дней)» to the existing PR #9 selector, including actual local today and six prior calendar days, with daily points/table rows. Keep the existing default4 and completed4/8-week modes, snapshot/provenance/empty rules, rune/schema/backups unchanged. Update docs, verify and publish on the same unmerged PR; no next task. Local verification PASS:73 Node/SQLite tests, TypeScript/Vite and208 browser checks with zero runtime errors. Actual seven-day desktop/narrow screenshots inspected. Windows CI for this update pending.

# Current delivery: SPHERE-TRENDS-001 — unmerged owner review

[PR #9](https://github.com/Maximus1978/Relics/pull/9), feature-sphere-trends-001, starts from verified master 293e7d20b2cfcb1802059699b72381a33cc6bf23. Owner accepted native WEIGHTS-001B; PR #8 expected head c3754f8 and successful Windows CI 40790775136 were verified, differences since tested 1f957faa Markdown-only, then merged normally. This supersedes earlier pending PR #8 acceptance/merge holds.

## Verified source and checks

Exact tested implementation/scripts/tests: 53ebd643e297f4249784c7a7d90138d4d4c83478. Synthetic PR merge build source: d52ce0c3fce5e4e86e78bd1cf782c3d40620edad. [Windows run 40809834288](https://github.com/Maximus1978/Relics/actions/runs/40809834288): SUCCESS. Logs confirm locked npm ci, 71 Node/temporary SQLite tests (0 failures), TypeScript/Vite, 202 actual browser checks with runtimeErrors=[], native Tauri Windows release compilation and 22 native backup safety tests PASS. One standalone crash helper intentionally ignored; its passing parent runs it as a child. Node 22.23.4/Rust 1.99.1. Local equivalents also passed. No owner DB/private catalog accessed.

## Downloaded and verified artifacts

[Windows x64 ZIP](https://github.com/Maximus1978/Relics/actions/runs/40809834288/artifacts/12870331947): 11,896,361 bytes, SHA256 aea2b5a508aa20c036fb6899d69b4d86e24c8fea4108e94a89578a8309e1e725 matched GitHub. relics.exe 20,629,504 bytes, SHA256 ccaa8d2ec62af1c960780644ff6236a40e27d15bf30e0eb90fc3c2156573bd0d matched included manifest. build-info source/head match both SHAs above; signed=false/nativeUiRuntimeVerified=false. Extract ZIP and run relics.exe on Windows x64 with WebView2, no build tools. Artifact expires 2026-11-12 UTC.

[Actual browser screenshot ZIP](https://github.com/Maximus1978/Relics/actions/runs/40809834288/artifacts/12870280727): 59,599,335 bytes, SHA256 8f2d87c563419eb9734853b07aeb4d0b0b4a0ea589153408589ded16202b667e matched GitHub. Inspected actual four-week/relative/mixed/empty/legacy/narrow 8-week captures against owner analytics render. rhythm-four-weeks-inventory.png proves placement below original habit cards; rhythm-distribution.png, rhythm-mixed-quality-table.png, rhythm-empty.png, rhythm-legacy-only.png, rhythm-eight-weeks.png and rhythm-eight-weeks-narrow.png cover required states. Existing medallion/rune/art/geometry and editor checks retained.

Archives/extracted evidence are outside Git at ../Relics-SPHERE-TRENDS-001-{browser,windows-x64}[.zip]. Owner-facing copies (Windows ZIP, 11 screenshots, result.json, manifests and Russian acceptance notes): C:/Users/maxim/OneDrive/Documents/ChatGPT/Relics App/deliveries/SPHERE-TRENDS-001-53ebd643. No personal data or test DB included. Final documentation-only receipt uses [skip ci] and leaves tested runtime/locks/art/scripts unchanged.

## Implemented scope and limits

Pure snapshot-only calendar projection: independent units, exact all-five-denominator shares, user/default/unknown counters, duplicate/conflicting event validation, complete Monday 4/8 weeks, no clock/DB/habit joins. Expandable Sanctuary panel below inventory and before existing Chronicle; uPlot 1.6.32 plus native mode/period/filter controls and accessible full table. Hidden lines do not change math; no-numeric weeks are gaps/null, old unknown entries remain counted/excluded, default 5 entries included with provenance. [Detailed contract/T01–T05 map](SPHERE_TRENDS_001.md).

Preserved schema 4/migrations 001–004/native backup v1/v2, identifiers, original art/rune/shrines/gems/sigils/sidebar, habit logging/archive/history and Chronicle navigation. No numerical Balance, recommendations, progression/rewards or Android. Browser fixtures are explicitly fictional and in-memory; only browser preview can select the synthetic fixture, native uses actual SQLite journal snapshots. Current incomplete week is excluded, so an owner with only this week's logs may truthfully see an empty complete-week graph. narrow 8-week chart labels alternate weeks; table retains all dates. Rounded shares can differ from 100% by 0.1; underlying exact ratios sum to 100.

Native UI/visual/functional acceptance remains for the owner. Close old binary, launch extracted new EXE, verify 4/8 weeks/units/shares/filter/table against known past journal snapshots, check backdated add/cancel and immutable historical totals after habit edits, then offline reopen. Do not fabricate events in owner history for screenshots; use an isolated synthetic environment when needed. Build unsigned; no installer or native UI launch claimed here.

PR #9 stays OPEN/UNMERGED. Next queued task after owner acceptance is NAV-CHRONICLE-001; not begun. Android remains deferred and all approved roadmap tasks retained. Stop after delivery.

## Historical preparation and earlier delivery receipts

Statements below about pending PR #8 acceptance or unfinished analytics are historical and superseded by this receipt.

# Active task: SPHERE-TRENDS-001

Owner accepted WEIGHTS-001B in native Windows. Verified PR #8 head c3754f8373a5ac6e708182999f179773f6155c4e, successful Windows run40790775136 and Markdown-only difference from tested1f957faa. Merged normally at293e7d20b2cfcb1802059699b72381a33cc6bf23; verified master parents and created feature-sphere-trends-001 from that master.

Scope: pure snapshot-only deterministic weekly projection, compact expandable analytics below inventory, absolute/share modes, 4/8 complete Monday weeks, accessible filtering/table and provenance/unknown disclosures. Preserve rune/art/habits/Chronicle/schema4/backupv2. Synthetic tests/screenshots, Windows CI/EXE and focused PR; do not merge automatically or begin NAV-CHRONICLE-001. Implementation candidate ready for focused PR: locked npm ci,71 Node/temporary SQLite tests, TypeScript/Vite,22 native backup tests and202 actual browser checks PASS locally;runtimeErrors=[]. Actual four/eight-week, share, mixed/empty/legacy and narrow screenshots inspected. No hosted success/native UI acceptance claimed; Windows CI/EXE delivery pending.

## Historical WEIGHTS-001B delivery receipt (owner accepted and merged above)

# Project handoff

## Current delivery: WEIGHTS-001B, unmerged owner review

[PR #8](https://github.com/Maximus1978/Relics/pull/8), branch feature-weights-001b. Owner/reviewer approved WEIGHTS-001A; PR #7 expected head 554ba3ce3185e759742fc1a208f4a4789208c8ad was verified Markdown-only/mergeable and merged normally at 6e122e7221c33d909ff2f4ecdbfba75b210f5b08. Implementation starts from that verified master. Do not merge PR #8 or start SPHERE-TRENDS-001.

## Gate order and actual evidence

Gate B1 passed BEFORE UI integration and is separately committed at 240fb1e895c9a8bd8ef14b63ba8adef5d8d144dc: 59 Node/temporary-SQLite tests, 22 native safety tests,0 failed,1 intentionally ignored child crash helper executed by its passing parent. Includes actual SQLx migration/ledger rollback, v1 replacement, weighted v2 safety undo, restart/crash and size bounds. Only then did B2 integrate shared Create/Edit controls and native backup summaries.

Current full-test source: 1f957faa863af755a6b5eb435cdbffe56ae98069. Windows [run 40790775136](https://github.com/Maximus1978/Relics/actions/runs/40790775136): SUCCESS: 59 Node/temporary-SQLite tests, TypeScript/Vite, 174 actual browser checks with runtimeErrors=[], actual Tauri Windows release compilation and 22 native tests PASS (one intentional standalone crash helper ignored). Synthetic PR merge source 1caccfa7df56627c54db5a333a8e428fa5636794.. The browser stage passed with zero reported runtime errors; the actual Create/Edit screenshots were downloaded and visually inspected against the supplied concept. Local B2 test baseline: 59 Node, 22 native and 172 browser checks; CI adds Space/accessibility assertions. No manual native UI acceptance is claimed.

[Browser/screenshot artifact](https://github.com/Maximus1978/Relics/actions/runs/40790775136/artifacts/12861866097): 51,234,695 bytes; downloaded SHA256 21b7eb97c2b6505b1fe1eef6bb446a7c3e5825580102dd49e3a9400b6f9fbe29 matches GitHub. Local evidence outside Git: ../Relics-WEIGHTS-001B-browser[.zip]. Screenshot names: weights-create-{one,two,five}.png, weights-edit-{one,two,five}.png, validation and narrow variants. The accepted art/rune geometry remains unchanged. [Windows EXE ZIP](https://github.com/Maximus1978/Relics/actions/runs/40790775136/artifacts/12861303313): 11,866,783 bytes, downloaded SHA256 75ad2885c8f2dbbc5fd368fd066521533ff373d9dfc21b5f6925da8541aff87e matched GitHub. EXE 20,600,832 bytes, SHA256 1c736b1df5cc709b413c271b09f74e74dce4acace59585480ea3f62e0f9ddcbe matched its manifest. build-info confirms source/head above, Node 22.23.4 / Rust 1.99.1, unsigned/nativeUiRuntimeVerified=false. Local ZIP/extracted files outside Git: ../Relics-WEIGHTS-001B-windows-x64[.zip]. Documentation-only receipt commits leave all tested runtime/assets/scripts/locks/workflow unchanged.

## Implemented candidate and compatibility

[WEIGHTS_001B](WEIGHTS_001B.md) maps all W01–W26 to automated tests or clearly pending manual gates and lists no-build-tools Windows acceptance. Subjective independent 1–10/default 5/unselected 0 profiles, atomic edits and immutable recording-time snapshots are implemented. Values are not intensity/time/health or Balance.

Migration004 preserves 001–003, IDs, archives, name/sphere/date snapshots, DB/app identity and daily uniqueness. Old habit definitions get legacy-default 5; old activity numeric snapshots remain NULL. New default-origin events preserve provenance; Edit Save confirms only future profiles. Do not use current definitions to recalculate history. Binary rune/daily stones ignore numeric magnitudes.

New exports/protective copies are strict v2/schema 4; existing v1/schema 3 import is retained via a strict typed adapter. Preview explains conversion/full replacement; complete weighted pre-state safety is verified before deletion. Recovery/rollback/crash tests include all values/origins/null. Old binaries/v2 downgrade are unsupported; close old windows and keep a private v1 backup before upgrade. No owner DB, personal backup or private catalog was accessed or used in tests.

## Boundaries and next task

PR #8 remains open and unmerged. Owner native Windows UI/dialog/offline upgrade/accessibility acceptance is pending. The build is unsigned and requires Windows x64/WebView2. No new medallion artwork, icon gallery, description, graph, progression/Balance/reward, intensity/duration/repeated sessions, Android or Chronicle navigation changes. Tests and screenshots use synthetic data only; browser preview remains in-memory and resets.

Next queued task after owner acceptance: SPHERE-TRENDS-001, not begun. Then NAV-CHRONICLE-001. Android remains deferred until Windows mechanics validation; all other approved tasks remain in ROADMAP. Stop after WEIGHTS-001B delivery.

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

[New Windows x64 EXE ZIP](https://github.com/Maximus1978/Relics/actions/runs/40764405205/artifacts/12849154157): 11,806,625 bytes; downloaded SHA256 78ea47ee7fbb2fc3edd5daba619a60df459b61ba92b14bd0a25b1575a083ba07 matches GitHub. EXE 20,387,328 bytes; SHA256 4f9a6970aa0036c13650f64b62f4a56d70078226dd64bd7c40458a9c98385585 matches executable-sha256.json. build-info confirms exact tested head and synthetic merge above, Node 22.23.4 / Rust 1.99.1, signed=false and nativeUiRuntimeVerified=false. Artifact expires 2026-11-11. Local ZIP/extracted files: outputs/Relics-technical-layers-windows-x64[.zip], outside Git.

## Release evidence and historical limits

Documentation-only receipt commits use [skip ci]; they do not change the tested runtime/scripts/assets/locks/workflow. The owner has now tested and accepted STATE-001 on Windows (D049). Documentation-only release updates supersede earlier review holds. Green build and geometry checks were not treated as that acceptance. The previous run 40752865133 verified a now-rejected complete-render crop; its EXE must not be used to review this correction. Initial layered run 40763788453 failed only in the new diagnostic script's escaping; fixed in the exact tested head above.

Existing download instructions: close the older app, download the new Windows x64 ZIP linked above, extract separately and run relics.exe on Windows with WebView2. It is unsigned. No executable was launched against owner data here. The owner reports Windows functionality/current visuals accepted; CI's nativeUiRuntimeVerified=false is an unchanged build-time manifest flag, not a claim that the later manual test did not occur. Browser evidence uses fictional nonpersistent demo data.

DOC-GAME-002 stopped after release. Its previous NAV/Android order is superseded by the active WEIGHTS-001A owner override above.
