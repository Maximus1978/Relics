# NAV-CHRONICLE-001 — dedicated history view

## Scope and prerequisite release

Owner accepted SPHERE-TRENDS-001 including rolling seven days on Windows. Verified PR #9 head317756f09eab239f5f1a9c7bdb5277be8362599b, mergeability and Windows run40943769883 SUCCESS. Compare to tested6a1e539d showed four Markdown files only. Regular merge39af6b782385ba202c177cc3e99467c208f99d9d verified with parents293e7d20/317756f0; local master synchronized and feature-nav-chronicle-001 created. Current feature is an unmerged review candidate. No next task authorized.

## Architecture and behavior

App owns one lightweight primary view state and one existing useRelicsModel instance. Sidebar/mobile use the same destination, aria-current, view announcement and destination-heading focus; the main landmark and skip link follow the active view. Archive retains the existing inventory filter/restore workflow, backup remains available from either view. Brand returns Sanctuary. No routing dependency, route URLs or browser-history contract; initial view after restart remains Sanctuary.

The existing Chronicle component is refactored, not duplicated. It mounts only on its own destination, never hidden below Sanctuary. Sanctuary ends after unchanged LifeRhythm. Its inactive subtree is hidden/inert (not accessible/focusable/displayed) to preserve existing selected date,1/4/8 period/mode/filters without changing chart code or duplicating repository initialization. Only one primary view is displayed. Shared model continues updating hidden visual projections; return shows current journal truth. No second store/subscription.

Chronicle groups copied activity arrays by occurredOn, newest dates first, then recordedAt/id descending to match repository ordering. Historical names/spheres come exclusively from each event snapshot, including renamed/archived definitions; selected logging date/current habit labels do not rebase history. Semantic headings/time/lists, canonical icons and labels/colors, existing metal/dark panels; no new artwork or hero. Header count and per-date counts use Russian plural forms.

Cancellation uses the same repository/domain behavior, no extra confirmation or undo. Entry disappears after shared refresh; other event snapshots stay unchanged; adjacent action or heading receives focus. Active Chronicle owns accessible busy/success/error feedback. Sanctuary rune/gems and contribution chart update from the same activity array. Existing native restore also refreshes that model; a post-restore list failure now sets the shared restart/recovery error so it stays visible after the backup dialog closes. Loading and repository errors do not masquerade as an empty personal history. All-archived history remains visible; no native placeholders.

No repository, SQLite migration/schema4, backupv1/v2, contribution/rune/chart calculation, app/DB identity, lockfile, permission, dependency, art or gameplay changes. Physical cancellation deletion is unchanged; audit/undo remains separate future work.

## Automated evidence map

Verified source a520f1e38595a9e020df5e8c868edadbe9d9e96b. [Windows run41104319143](https://github.com/Maximus1978/Relics/actions/runs/41104319143) SUCCESS:75 Node/temporary SQLite tests, TypeScript/Vite,282 actual browser checks (0 runtime errors), real Tauri Windows EXE and22 native safety tests PASS. Local equivalents and locked/offline native build also passed. [Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/41104319143/artifacts/13000757903) and [screenshots](https://github.com/Maximus1978/Relics/actions/runs/41104319143/artifacts/13000187101) downloaded/digest-verified; exact sizes/SHA256/manifests in HANDOFF. PR #10 remains unmerged; owner native UI acceptance pending.

1. Dashboard Chronicle absence and natural end after LifeRhythm: actual DOM and screenshot; initial layout assertion updated without dropping shrine/rune geometry tests.
2. Separate view/current-page/heading focus: real sidebar keyboard Tab/Enter, desktop/mobile destinations, view-aware skip link, main landmark, accessibility tree excluding inactive date picker.
3. Preserved Sanctuary: actual retained selected date, period1, shares mode and hidden-series choice after navigation; existing inventory/create/edit/archive tests retained.
4. Full history/date groups/snapshots: ordinary synthetic preview, pure deterministic grouping tests, edited/archived-habit historical names and spheres.1440x900/1280x800/390x844/320x844 no overflow.
5. Cancellation: actual controls, visible success/failure/retry, last-record empty state; existing four-state rune/gem/geometry proofs and contribution chart tests adapted to navigate, not bypassed.
6. Restore/load/error integration: check-chronicle-sqlite.mjs attaches a TEST-ONLY mock native IPC boundary to the normal compiled app and forwards actual production repository SQL into an isolated temporary Node SQLite database migrated through004. It verifies loading, one repository load across navigation, immutable non-cancelled rows, failed-delete retry, actual SQL full replacement followed by mounted Chronicle refresh, chart/rune refresh, post-restore refresh error after modal close and initial repository failure. The mock restore service verifies UI/model integration, NOT Rust backup implementation/native dialogs; existing22 native safety tests separately verify real backup/migration/crash/rollback. Proof explicitly marks mockedNativeIpc=true/nativeUiRuntimeVerified=false. No production hooks or owner data.
7. Offline browser navigation tested with Network offline after assets load. No URL navigation/network is needed to change views; native offline reopen remains owner acceptance.
8. Existing Node/SQLite contribution/migration/snapshot and native v1/v2 safety coverage retained. Source diff must show no migrations, repository, chart/projection, assets, locks or workflow changes.

## Actual visual evidence

Browser artifact includes chronicle-sanctuary-dashboard.png (no history panel), chronicle-1440x900.png, chronicle-1280x800.png, chronicle-390x844.png, chronicle-320x844.png, chronicle-archived-history.png, chronicle-archived-only.png, chronicle-mobile-archived.png and chronicle-empty.png. Inspected against accepted Sanctuary materials/layout. These captures use explicitly fictional in-memory preview data. chronicle-navigation-proof.json and chronicle-sqlite-bridge-proof.json distinguish ordinary rendered preview, temporary-SQLite/mock-IPC integration and pending actual native UI verification.

## Windows owner acceptance — no compilation commands

1. Close the older app. Download the new Windows x64 ZIP from the successful run in HANDOFF, extract separately and run relics.exe with WebView2. Unsigned build; no compiler/admin setup required. Keep a private backup of valuable history through the existing utility.
2. Sanctuary: confirm original heading/date/shrines/rune/gems/habits and Life Rhythm1/4/8. Dashboard ends after analytics; no full Chronicle panel.
3. Activate Хроника by sidebar, keyboard Tab/Enter, or bottom navigation at narrow width. It is a distinct screen; heading receives focus and correct navigation is highlighted. Header count matches saved journal; date groups newest first.
4. Check existing October26–27/history records and renamed/archived interests. Displayed historical names/spheres/dates remain original; changing Sanctuary selected logging date does not change journal dates. All records remain available.
5. Return to Sanctuary; check selected date/chart settings retained. Open archive and restore an intended test habit; return to Chronicle and verify history remains. No automatic sample reactivation.
6. In an isolated synthetic dataset, cancel a recorded event: row/count/status update. Return to Sanctuary and verify selected-day gems, current-week rune and1-week contribution data refresh; other historical snapshots unchanged. Cancel the last synthetic event to see neutral empty state. No new confirmation.
7. From Chronicle open Backup. In an isolated synthetic Windows dataset/profile, preview and confirm an existing v1/v2 backup full replacement; do not replace the owner's valuable journal merely to test. After closing dialog, Chronicle shows imported rows/count and status, Sanctuary recalculates too. Existing protective backup/rollback guarantees remain. Browser mock-IPC coverage does not substitute for this native-dialog acceptance.
8. Resize to1440x900,1280x800 and390x844; read sphere labels, use cancellation and mobile navigation; no horizontal overflow. Close/reopen offline and confirm saved history/archives/profiles remain. Restart begins Sanctuary; view state itself is not persisted.

## Limits and stop condition

No diary/reflections/emotions/search/filters/calendar heatmap/event-date editing/undo/audit/progression/Android. Real native UI acceptance pending; hosted compile alone does not claim it. Keep this PR unmerged. Next queued milestone is ANDROID-001 only when separately scheduled by owner; do not begin it or another feature automatically.
