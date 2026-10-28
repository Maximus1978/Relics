# Project handoff

## Current task: DOC-GAME-002 — approved decisions and STATE-001 release

Owner instruction dated 2026-10-28: STATE-001 functionality/current visual direction were tested and accepted on Windows, including the central rune, four illumination states, independent selected-day stones and responsive transparent technical layers. Remaining art defects are non-blocking future work. This explicit instruction supersedes prior PR #6 no-merge/review holds.

Scope: Markdown-only product consolidation and regular merge of existing PR #6, then record actual merge/master state. No feature, artwork, schema, workflow or dependency changes. Source branch starts at 986bab5c2aa98dab8b11916f58b9f5b398b72f42; base master 234c35a7be4306ba1fee082f01409122715e2846. Changes after the successful tested runtime 81cc6e7897f03eafbaccd0f178eff992727a7a28 were verified Markdown-only. Release status: documentation review before owner-authorized merge; actual result will be recorded afterward.

## Consolidated product boundaries

Accepted principles, future implementation: focused Sanctuary/full Chronicle destination; Habit Sigils versus Unique Artifacts; Collection/Chronicle/Museum responsibilities; permanent Mastery versus recent Resonance versus contextual Balance; optional temporary Blessings; manual Vacation Mode and separate opt-in rhythm suggestions; restrained offline sound; non-blocking art refinements. D049–D057 record these without rewriting prior decisions. An all-five-sphere habit can produce 35/35 descriptive coverage after seven logs; that is not proof of healthy Balance or an automatic strong reward.

No numeric Balance/progression formula, Blessing chance/stacking/expiry, vacation afterglow duration or audio defaults are chosen. See OPEN_QUESTIONS and small roadmap contracts. No secret names/recipes are accessed, invented or exposed. Adventure Mode and versioned World Packs remain future scope: Sanctuary, Clockwork, Wasteland, Verdant.

## Next single task — queued, not started

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

Stop after DOC-GAME-002 release. NAV-CHRONICLE-001 is the next single functional task, then early Android compatibility. Neither is started.
