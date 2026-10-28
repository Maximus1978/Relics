# Project handoff

## Active owner correction: genuine technical layers and large-screen scaling

The owner rejected the cropped-render solution: its source backdrop remains visible and a medallion capped at 270px is undersized on a 2560px desktop. Continue the same unmerged PR #6 from d8d3116befa85dd4f4c97535429cf5d43c3fa0c1. Build independent clean art layers (frame/settings, rune, gemstone material, SVG signs and separate light layers), with true transparency outside metal/stone and through interior gaps. Do not use the reference board or a cropped complete medallion in runtime. Reconstruct the supplied design rather than inventing a new silhouette. Inspect each asset over light/contrast backdrops, then compare the assembled object with the original through a registered overlay. Preserve the existing temporal state rules, history and backup behavior.

Make the medallion use its central grid track on large desktops, with proportional installation sizing; verify actual layouts at 1920 and 2560 in addition to existing compact/narrow sizes. Deliver asset/provenance/alpha and reference-comparison evidence plus the existing Windows CI/EXE in PR #6. Do not merge or begin another task. Previous rendering/geometry hashes below describe a rejected complete-render crop and are not proof that the requested independent layers exist.

## Current correction and boundary

SANCTUARY-STATE-001 continues in existing PR #6 / feature/sanctuary-state-001. The owner rejected the S-shaped rune and represented-sphere bands. Use the supplied canonical medallion and approved Temporal State Resolution. Do not merge or start another task. Baseline master remains 234c35a7be4306ba1fee082f01409122715e2846; history is preserved.

## Corrected implementation

See [state contract](SANCTUARY_STATES.md), [canonical art](art/MEDALLION_CANONICAL.md), decisions D046–D047. Priority: 35 distinct current-window sphere/days = RADIANCE; otherwise all five selected-day spheres inside that window = HARMONY; otherwise positive coverage = AWAKENING, zero = DORMANT. The window remains anchored to actual local today and six preceding dates. Duplicates cannot inflate coverage; backdating/cancellation recompute saved historical snapshots.

Gemstones exclusively follow selectedDate. DORMANT never suppresses recorded historical stones; RADIANCE never activates stones on an empty historical date. Settings may glow around a dark face. Visible/accessibility labels distinguish both periods. No missing-day failure, target, reward, game score or persisted visual state.

The first dormant medallion of the exact supplied PNG is the sole canonical object. One fixed image viewport/masks preserve its rune silhouette/internal detail, frame/engravings, gemstone placement and proportions. Other panels/captions never render. Only opacity, gamma/color, emission and halo vary. The rejected S artwork is removed from the center; no new illustration or screen is invented. The served source checksum must match the owner attachment.

No changes to SQLite/migrations/repository, native backup code/capabilities, identifiers, dependency locks or Windows workflow. No owner database/private content accessed. No new fields, progression or Android-native work.

## Final verified correction

Runtime/test source: ed08e3e8ea49b64be5dc0693fc0631ef52c0cf51; synthetic PR merge source 5e29740589e8d6a8eb5be7466737bb6f82830b2d. [Windows run 40752865133](https://github.com/Maximus1978/Relics/actions/runs/40752865133) completed SUCCESS: locked npm ci, all 48 Node/temporary-SQLite tests, TypeScript, Vite, 142 actual browser checks with zero reported runtime errors, actual locked Tauri Windows release compilation and all 16 native backup safety tests. One standalone crash helper is intentionally ignored because a passing parent test executes it as a child. Node 22.23.4 / Rust 1.99.1. Documentation-only receipt commits use [skip ci]; runtime/tests/locks/workflow remain identical to this source.

The 48 Node tests preserve all previous 38 and add eight corrected-state cases plus both owner-resolved date conflicts. Browser scenarios use actual controls to fill all seven days, verify historical snapshots/archives, cancel/re-add a backdated entry and test both conflicts. No injected visual classes or real owner data. The four final captures were compared with the supplied design; the first canonical medallion is preserved and only lighting changes.

[Final browser evidence](https://github.com/Maximus1978/Relics/actions/runs/40752865133/artifacts/12844711840): 30,738,344 bytes, downloaded SHA256 44ec9dedd2415f88b8dfa527986d558fcf67b4353bf957af8f87848a57ed98c9 matched GitHub. Four actual SVG attribute hashes match bc6b52ac1df144ebae3cea7599f086f2eb5b996fa319ec0eeb813ab92da016f3. Four normalized SVG exports are byte-identical: 1bb4e689cfca0a4f9154eee35ec5b5784cb5c158efecce0a645b485fedfa8959. Each exported SVG hash was checked after download, and the actual served PNG matches the exact owner attachment. Actual lighting screenshots remain distinct. Native runtime inspection is separate.

[Corrected Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40752865133/artifacts/12844312769): 11,186,696 bytes, downloaded SHA256 99af051204265985059684f05f80cda78c6fa09ebe51f7a55ba8d8da96f7df1d matched GitHub. EXE 19,767,296 bytes, SHA256 7a3d369f6ac2cfa7808a30560141e7a73c75881eec31d7c8c1739c2e9ec99b61 matched the manifest. build-info confirms both source SHAs, signed=false and nativeUiRuntimeVerified=false. Local ZIP and extracted files: outputs/Relics-STATE-corrected-windows-x64[.zip], outside Git. Artifacts expire 2026-11-11.

Local evidence outside Git: outputs/Relics-STATE-correction-browser.zip and extracted folder. Actual captures: medallion-dormant.png, medallion-awakening.png, medallion-harmony.png, medallion-radiance.png; conflict captures medallion-dormant-historical-gems.png / medallion-radiance-historical-empty.png; desktop and narrow screenshots. Proof: medallion-geometry-proof.json, geometry-{state}.svg/.json, canonical-source.png. Normalized SVG exports deliberately remove lighting metadata; actual screenshots retain distinct illumination.

Hosted CI verifies full builds because local child-process execution is restricted. No manual environment repair is required from the owner. Native compilation and actual native UI inspection are separate; no executable is launched against the owner's data here.

## Delivery and owner acceptance

The corrected PR, exact successful source/run, four actual state screenshots, SVG proof and Windows EXE ZIP are delivered for review. Close the previous app and extract/run the new unsigned Windows x64 executable with WebView2 for owner visual/functional review. Use synthetic test entries for logging/cancellation; verify historical date selection. Backups remain available; do not replace personal data merely for visual inspection. Browser evidence does not establish native SQLite/Android acceptance.

Stop for owner acceptance. SANCTUARY-STATE-002 and all following tasks remain unstarted.
