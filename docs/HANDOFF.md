# Transfer handoff — owner-authorized PR13 release, then STOP

Owner update2026-11-01:functional HABIT-RHYTHM-001 acceptance on Windows CONFIRMED by the supplied next-task brief. A separate native offline process restart is NOT confirmed. Earlier pending-functional-acceptance/no-merge holds below are historical and superseded by the owner's explicit instruction to merge PR #13 normally into master.

Pre-merge checks:reviewed head2314cbf08692e3073baf029e90ac2618bd641b1d matches,PR13 mergeable,base master de1b2f9e954a6a74071a817f6ef81cdf22226276 unchanged. Windows run41262296440 SUCCESS corresponds to implementation4969d7afe193fc924c616554295a8c250b0e5378;only four Markdown files changed afterward. This transfer update adds only documentation and a reference-only board under docs/,no runtime/tests/dependencies/schema/backup/artwork imports. Verify final PR head and resulting merge commit before ending. The canonical merge receipt is [PR #13](https://github.com/Maximus1978/Relics/pull/13);do not infer a merge from this preparation note.

The owner requested STOP after the merge to change computers. HABIT-SIGILS-001A is queued,NOT started;no feature branch/component/art generation or showcase work in this release. [Full portable owner brief and mandatory iconId addendum](HABIT_SIGILS_001A_TASK.md),[reference PNG](art/references/HABIT_SIGILS_001A_OWNER_REFERENCE.png). Empty reusable center slot and live independently replaceable SVG icon in001A are mandatory;actual Create/Edit picker,persistence,neutral legacy default andbackupv4 belong to001B. 001C production-card integration,PROGRESS-002A/B and all other approved backlog remain later.

## Resume on the second computer
1. Clone or fast-forward the repository's master and confirm PR13 merged. No local-only source or required reference is needed from this computer.
2. Read AGENTS.md,docs/HANDOFF.md,docs/ROADMAP.md,docs/HABIT_SIGILS_001A_TASK.md,docs/PROGRESS_001.md anddocs/art/HABIT_MEDALS.md.
3. Use the checked-in reference board;keep the icon separate from every medal. Treat all18/showcase progression/light values as synthetic. Preserve schema5,backupv3,rhythm/history/rune/Chronicle/analytics/production inventory.
4. Wait for the owner's instruction to resume001A,then create its focused branch from latest master. Do not merge001A automatically or start001B/001C/progression.

## Historical HABIT-RHYTHM-001 delivery and verified evidence

# Current delivery: HABIT-RHYTHM-001 — ready for owner acceptance, PR unmerged

[PR #13](https://github.com/Maximus1978/Relics/pull/13),feature-habit-rhythm-001,OPEN/UNMERGED. Prerequisite PR #12 reviewed head1250d9f55041adc2f5e5ea39c310e9f1c30087c1 matched;mergeability,successful Windows run41255208180,and only five Markdown changes since tested4f0d26bf verified. Normal merge de1b2f9e954a6a74071a817f6ef81cdf22226276 verified on master. UI-COLLAPSE-001 owner-accepted functionally;native offline restart separately UNCONFIRMED. Deferred UX backlog awaits owner details,not invented.

## Tested source and successful Windows CI

Exact tested implementation/scripts/tests head:4969d7afe193fc924c616554295a8c250b0e5378. Synthetic PR merge source:98159d367bae48488fc05e6ead5690cea0b4f3bc. [Windows run41262296440](https://github.com/Maximus1978/Relics/actions/runs/41262296440) completed SUCCESS,job124717852206. Decoded hosted logs confirm locked npm ci,89 Node/temporary-SQLite tests(0 failures),TypeScript,Vite,385 actual Edge checks(runtimeErrors=[]),real Tauri Windows release EXE and30 native Rust safety/rhythm tests(0 failures;one standalone crash helper intentionally ignored but executed under its passing parent). Hosted Node22.23.4/Rust1.99.1. Equivalent local checks passed. Gate A migration/recovery tests passed BEFORE frequency UI integration;no partial persistence release. Final receipt commit changes Markdown only after the tested source.

## Downloaded artifacts and verified hashes

[Windows x64 ZIP](https://github.com/Maximus1978/Relics/actions/runs/41262296440/artifacts/13065204614):11,996,275 bytes,SHA256 a1b3a4feb4166808072cfa1aa1d98f9c51c195fa6df116b2c00ea0ba0e1c59c0 matched GitHub. EXE20,925,440 bytes,SHA256 e86a6a64cefe238ccc9dcd6b61a60c418f06131b52d3ec69f42bd235447d6b7e matched included executable-sha256.json. Downloaded build-info verifies tested head/source above,Windows,Node/Rust versions,signed=false,nativeUiRuntimeVerified=false. Unsigned x64:extract ZIP and run relics.exe with WebView2,no build tools. Expires2026-11-15 UTC.

[Browser screenshots/proof ZIP](https://github.com/Maximus1978/Relics/actions/runs/41262296440/artifacts/13065009240):78,838,513 bytes,SHA256 88dc35437cd6efca092d948be92e5d95ea0aa4d13386c26aaf7529fa6fca4eea matched GitHub. result.json confirms385 checks/zero runtime errors. habit-rhythm-proof.json confirms real synthetic temporary SQLite through mocked native IPC,three frequencies,current/pending/date,stable pending replacement,cancel draft/save,reopen,backdated snapshots,narrow layout and accessibility;ownerJournalTouched=false,nativeUiRuntimeVerified=false. Actual captures:habit-rhythm-create-daily.png,habit-rhythm-create-three_per_week.png,habit-rhythm-create-weekly.png,habit-rhythm-legacy.png,habit-rhythm-edit-pending.png,habit-rhythm-edit-narrow.png. Local/hosted captures inspected;existing Sanctuary artwork and medallion retained.

Archives/extracted evidence saved outside Git at ../Relics-HABIT-RHYTHM-001-{browser,windows-x64}[.zip]. No private content,personal journals/databases,logs or build artifacts committed. Git tree matched connector publication. Migrations001–004,app/DB identity,dependencies/locks and artwork unchanged.

## Implemented behavior and compatibility evidence

Three intent frequencies,daily/three_per_week/weekly;legacy stays unconfigured until explicit native-local-today enrollment. New habit requires a choice. Later changes start next Monday strictly after today;current/pending/exact date displayed;one pending segment replaced with stable ID or canceled before effective. Habit ID and applied history retained. Selected logging date does not redefine decision date. Existing activity names/spheres/contribution snapshots/dates and daily uniqueness preserved;new backdates snapshot current definition but use occurrence-date frequency lookup.

Additive005 stores authoritative frequency segments and archive pauses,not progression counters. Native main-window-only semantic command accepts no SQL/path/date,uses shared parameterized plan in one pinned FK-enabled BEGIN IMMEDIATE transaction,validates schema/history and returns transaction receipt. Tests cover native FK originallyOFF→ON,invalid edits and mid-transaction rollback,005 DDL/SQLx-ledger rollback→retry/reopen,calendar Sunday/Monday/year/leap/DST boundaries.

Owner-approved legacy archive policy implemented:startNULL/provenancelegacy_unknown,actual local restoration end only. Unknown interval neutral for future Forging/Resonance,no practice credit/inactivity penalty. Known same-day zero interval removed;unknown legacy retained. Archive state and pause mutation atomic;archived logging blocked.

Backupv3/schema5 export and protective files include all segments/pauses,current and pending rules and unknown origins. Strictv1/schema3 imports preserve IDs/old snapshots,default5 future profiles/null old contributions;strictv2/schema4 retains all weights/origins/nulls. Both old formats leave rhythm unconfigured and legacy archived startunknown. v3 round-trip and old-import→protective-v3 undo preserve complete histories after SQLite reopen. Malformed version/date/ordering/reference/overlap/archive-state input rejected before replacement;file failure,mid-insert rollback and killed-process recovery retain original data. No lossy downgrade.

## Owner Windows acceptance and limits

[Full contract,test matrix and exact Windows steps](HABIT_RHYTHM_001.md). Close old app,keep a personal backup,download/extract/run new EXE. Confirm old records;create all three rhythms;enroll a legacy habit while a past logging date is selected;edit Weekly→Daily and inspect next Monday/current/pending;replace/cancel pending;archive/restore a synthetic habit;verifyv3 export/recovery using safe synthetic data. Close process,disconnect network,reopen and confirm frequency/definition/history/archive/collapse persistence.

Native UI/visual/offline process-restart acceptance remains for owner;not inferred from CI compilation,browser app reload or database reopening. Existing sample habits deliberately remain unconfigured. Clock rollback before saved history safely rejects incompatible changes. Old binaries cannot consume schema5/v3;no downgrade guarantee. No Mastery,Forging,Resonance,medal/icon/art/XP/Android/Vacation/audio/new reward implementation;P01–P09 gameplay parameters remain proposed.

Keep PR #13 unmerged for owner review. Next single queued task:HABIT-SIGILS-001,NOT begun.

## Historical previous deliveries

# Current delivery: UI-COLLAPSE-001 — ready for owner acceptance, PR unmerged

[PR #12](https://github.com/Maximus1978/Relics/pull/12),feature-ui-collapse-001,OPEN/UNMERGED. Prerequisite PR #11 reviewed head c43c0974953c458ef28d6f4e6c4fa7d6d22cc368 was verified mergeable and documentation-only,then merged normally at5b7229d58c040c7ebd44d0fe423f92bdc82c57e2. P01–P09 remain proposed mechanics,NOT final implementation approval. No progression delivered.

## Verified source and successful Windows CI

Exact tested code/scripts/tests head:4f0d26bf1679d5445e8dc5284b63d69507d58e33. Synthetic PR merge build source:2f60f26c46e5e52bf32c91dd5dc406081787c23a. [Windows run41255208180](https://github.com/Maximus1978/Relics/actions/runs/41255208180) SUCCESS,job124696806879;decoded logs confirm locked npm ci,79 Node/temporary-SQLite tests(0 failed),TypeScript,Vite,354 actual Edge browser checks(runtimeErrors=[]),real Tauri Windows release EXE and22 native backup safety tests PASS(0 failed,one intentionally ignored standalone crash helper runs under its passing parent). Node22.23.4/Rust1.99.1. Equivalent local checks passed. This is native compilation/backup verification,NOT native UI/offline-restart acceptance.

## Downloaded artifacts and verified digests

[Windows x64 ZIP](https://github.com/Maximus1978/Relics/actions/runs/41255208180/artifacts/13062659539):11,897,389 bytes,SHA25653e942f0311eb9bbe272b8c67502de9376d08c8c5b3b43a7b5cb07819bae875d matched GitHub. EXE20,631,040 bytes,SHA256036388b377c8d7b484cb6bf8175c02ea1a9ee7dfa7afea8f45b9cfc80d1794f4 matched included manifest. build-info verifies head/source above,signed=false,nativeUiRuntimeVerified=false. Unsigned Windows x64 with WebView2:extract and run relics.exe,no build tools required. Artifact expires2026-11-15 UTC.

[Browser screenshots/proof ZIP](https://github.com/Maximus1978/Relics/actions/runs/41255208180/artifacts/13063290209):76,071,377 bytes,SHA256a74320954ce87335fe24c33618c186aff30bf5564e8fdb427ddd35dfae05151b matched GitHub. Downloaded result.json confirms354 checks/zero runtime errors;section-collapse-proof.json confirms all four combinations,only two stored booleans,browser app reload and offline navigation,explicit nativeOfflineRestartVerified=false. Five actual captures:collapse-both-expanded.png,collapse-inventory.png,collapse-rhythm.png,collapse-both.png,collapse-narrow-windows.png. Local equivalents plus hosted collapsed/narrow captures inspected against unchanged Sanctuary;all other existing rune/editor/analytics/Chronicle screenshots retained.

Archives/extracted evidence reside outside Git at ../Relics-UI-COLLAPSE-001-{browser,windows-x64}[.zip]. No real journal,backups,private content,logs or build artifacts committed. Final receipt changes Markdown only after tested head;no implementation changes after verification.

## Implemented behavior and manual acceptance

Two independently persisted disclosures,both expanded by default. Strict versioned localStorage holds only inventoryExpanded/rhythmExpanded;invalid/denied/full storage safely defaults or allows session-only operation. Hidden/inert bodies retain components but leave focus/AX;native toggle handles Enter/Space,44px focus,reduced motion and rescues internal focus. Inventory name/count/Add/archive/status remain visible and creating while collapsed works. Date/1/4/8/units-shares/filters/table state survive collapse/navigation;existing uPlot observer plus paused draw/recreate gives real nonblank correct-width charts after hidden resize1920/1280/390/320. Art,central rune,journal,schema4,v1/v2 backup,Chronicle and dependencies unchanged. Test-only Sunday-safe backdate fixture preserves valid complete-week regression checks on hosted UTC Sundays.

[Full contract and Windows steps](UI_COLLAPSE_001.md#native-windows-owner-acceptance--no-build-tools):close old app,download/extract/run new ZIP;try both toggles and collapsed Add/archive/count;verify chosen historical date/chart controls across collapse and Chronicle;resize while chart hidden and inspect reopened lines;leave one section collapsed,close,disconnect network,reopen same build and check persisted expansion. No personal journal changes required for UI acceptance. Only expansion prefs persist after process restart;ordinary date/chart controls retain existing restart defaults. Device UI prefs are excluded from journal backup and unchanged by restore.

Native visual/UI/offline process-restart acceptance remains pending for owner;do not label browser reload as native verification. Storage denial/clear/profile changes can reset expansion to defaults. No progression/rhythm editor/medal/gallery/audio/Android. Do not merge PR #12 automatically. Next single queued task:HABIT-RHYTHM-001,not begun;requires new authorization and relevant proposed-contract decisions.

## Historical preparation and prior receipts — superseded release holds below

# Current task: UI-COLLAPSE-001 — implementation candidate for owner acceptance

Owner authorized PROGRESS-001 [PR #11](https://github.com/Maximus1978/Relics/pull/11) normal merge. Verified reviewed head c43c0974953c458ef28d6f4e6c4fa7d6d22cc368,mergeability and16 Markdown-only files;merge5b7229d58c040c7ebd44d0fe423f92bdc82c57e2 with parents8503670/c43c097 matches master. feature-ui-collapse-001 starts there. PROGRESS-001 passed review only as a proposed mechanics contract;P01–P09 are NOT final owner-approved implementation parameters.

## Delivered scope and local evidence

Two independent accessible inventory/Life Rhythm toggles;versioned device-local storage contains only two booleans(default expanded),safe strict corrupt/denied/quota fallback. Hidden/inert content retains component state but cannot receive focus;toggle rescues internal focus. Inventory header/count/Add/archive/feedback always remain accessible. Existing date/1/4/8 mode/series/table choices retained across collapse/navigation;uPlot draw resources pause and recreate/resize on expansion. No renamed section,progression,SQLite/backup change,new dependency or art replacement. [Full contract,test map and Windows acceptance](UI_COLLAPSE_001.md).

Local PASS:79 Node/temporary-SQLite tests,TypeScript/Vite,354 actual Edge browser checks with runtimeErrors=[],22 real Rust native backup safety tests (one standalone crash helper intentionally ignored and executed by its passing parent). Existing rune geometry/states,habit management,backdates,Chronicle,SQLite/mock-IPC restore and real native backup suites retained. Synthetic databases/browser profile only;owner journal never opened. Existing backdate test fixture now uses Sunday-safe previous-complete-week Friday,not changed runtime calendar logic.

Actual five screenshots inspected:collapse-both-expanded.png,collapse-inventory.png,collapse-rhythm.png,collapse-both.png,collapse-narrow-windows.png. Existing Sanctuary art/rune/shrines unchanged;no clipping/overflow,real chart pixels checked after hidden resize1920/1280/390/320. section-collapse-proof.json explicitly distinguishes browser reload/offline navigation from native offline process restart,which remains owner acceptance. Only section expansion persists across app restart;date/analytics controls keep existing restart defaults. Device preferences are excluded from journal backup and do not change on restore.

Windows hosted CI/EXE pending at initial publication. Separate focused implementation PR remains OPEN/UNMERGED;final exact head/run/ZIP/digests go above historical receipts after success. Unsigned Windows x64/WebView2 limitation remains. Native UI/offline-restart acceptance is not inferred from frontend/browser or native compilation. No owner-data testing.

Next single queued task:HABIT-RHYTHM-001,only after owner acceptance/new authorization and resolution of its proposed-contract dependencies. Not begun. Do not merge this implementation PR or continue automatically.

## Historical previous deliveries — active-task/merge holds superseded above

# Current task: PROGRESS-001 REVIEW CORRECTIONS — documentation review

Updated2026-10-31 on the SAME [PR #11](https://github.com/Maximus1978/Relics/pull/11),docs-progress-001. Verified prior head dab611ff1e7fa483a3f922790f0fc64ee26651c4,PR OPEN/UNMERGED,current master8503670a31b8adc74bac61b6a84826e6772664eb. No merge or implementation authorized. The receipt below explicitly supersedes the original strict7/7,correction-retention receipt ledger and immediate-fade proposals; other accepted principles remain intact.

## Revised proposal

- P01 minima6/3/1 distinct habit-days per complete week;Daily6/7 and7/7 both give1 cycle. Explain Daily's one-day allowance without silently discounting3/week orWeekly. Current/initial partial weeks remain neutral;no extra-record or contribution multipliers. Numbers await final approval.
- P05 prefer deterministic ordinary material/phase/Forging reconstruction from authoritative journal,effective frequency history,known pauses and explicit today/rulesVersion. Inactivity cannot remove material;actual corrections can change it. No permanent ordinary attainment receipts,receipt migration007/backupv5 or prior-rank cache override. Artifact/discovery persistence and correction decisions untouched.
- P06 full light through expected gapg,then linear fade over2g:Weekly0/7full,14half,21zero;Daily0/1full,2half,3zero;Three/weekg=7/3. Independent material/Forging/checkmark;no forgetting-rate or psychological claim.
- P03/P09 lightweight phase-local progress track+accessible text,exampleSilver18→24 atF20=2/6,then3/6;no currency/reward. Six tiers/three phases,protected Forging checkpoints,manual icons,no grayscale,interaction layers and all prior small-task/world scope retained. P01–P09 still proposed,not implicitly finally approved.

[Canonical spec](PROGRESS_001.md),[Russian numerical review](PROGRESS_001_REVIEW_RU.md),[open decisions](OPEN_QUESTIONS.md) and related game/roadmap/data/architecture/UX documents agree;D079–D080 supersede prior conflicting D075/D076 proposals without deleting history. Diagram derives material with no receipt-write arrow. Future matrix is P-T01–P-T21,not executed application tests.

## Checks and delivery boundary

11 documentation Markdown files only. No application code,migrations,test scripts,artwork,dependencies,workflow,owner database or private content changes. git diff --check and local links/heading anchors/table validation checked before publication. Eleven one-off documentation arithmetic checks pass: eligibility boundaries,6/7 recurring practice,cross-week interruptions,checkpoint/return sequence,20-week absence versus actual cancellation/re-add,frequency-change backdate replay,all three grace/fade curves,phase-local progress and revised daily duration ranges. Future Artifact/discovery grant-policy body verified byte-for-byte unchanged against prior PR head. These checks verify document examples,not a shipped engine.

No runtime tests,new native build or EXE claimed for a documentation-only correction;existing NAV CI remains historical evidence. Publish a non-force follow-up commit to existing PR #11;leave it OPEN/UNMERGED. Next recommended UI-COLLAPSE-001 remains queued,not begun. Stop for owner review.

## Historical original PROGRESS proposal — corrected semantics superseded above

# Current task: PROGRESS-001 REVISION — documentation delivered for review

Verified2026-10-30: owner accepted NAV-CHRONICLE-001 on Windows. [PR #10](https://github.com/Maximus1978/Relics/pull/10) is merged at8503670a31b8adc74bac61b6a84826e6772664eb; freshly fetched origin/master matches, parents39af6b78/db1d2f7. Earlier NAV active/pending/unmerged statements below are historical and superseded. docs-progress-001 starts from that merge with a clean baseline.

## Current review package

- [Canonical PROGRESS-001 specification](PROGRESS_001.md): approved direction versus proposed mechanics versus implemented baseline/deferred scope; two Forging models, recommendation, concrete calendars/interruptions/return examples, threshold/phase durations, effective-frequency changes/backdates/corrections, independent visual layer diagram, minimal native storage/backup proposal and P-T01–P-T20 future test matrix.
- [Russian owner review](PROGRESS_001_REVIEW_RU.md): accepted principles, recommended rhythm/checkpoints, material pacing, data safety, visual composition, small milestones and explicit P01–P09 approvals. No numerical rule is approved by implication.
- [Art/reference contract](art/HABIT_MEDALS.md): supplied material/state board name/hash/provenance, three-phase six-material family, manual center icon, layered green confirmation/glow/focus; no full-medal grayscale. Original attachment remains a reference, no asset copied/generated/modified here. Existing Sanctuary/rune artwork unchanged.
- ROADMAP/GAME_DESIGN/PRODUCT_VISION/UX_PRINCIPLES/DATA_MODEL/DECISIONS/OPEN_QUESTIONS updated, plus README/AGENTS/architecture/reference inventory and NAV accepted-release status. Previous decisions retained with explicit supersession. All approved future systems/worlds preserved.

## Actual checks and limits

Documentation-only change list:16 Markdown files, no application code, SQL migrations, runtime/test scripts, artwork, packages/locks, workflow, database or private content. git diff --check passes. Relative local Markdown targets/heading anchors checked; no missing target/anchor. One-off design arithmetic/calendar checks pass: ten checks cover cycle examples, phase monotonicity, Nov/Dec boundaries, Resonance4/7,432 active combinations, preserved task/world list,20 future test scenarios and9 explicit decision gates. These are document sanity checks, not an implemented/tested progression engine. P-T01–P-T20 remain future acceptance requirements, not executed tests.

No new runtime/TypeScript/browser/Rust/Windows build is run or claimed for this documentation-only task. Existing successful [NAV Windows run41104319143](https://github.com/Maximus1978/Relics/actions/runs/41104319143), tested head a520f1e38595a9e020df5e8c868edadbe9d9e96b and its artifacts remain historical release evidence. No new EXE/screenshots are required or fabricated. Publication uses one docs-only PR, with [skip ci] to avoid an unrelated build. Owner journal never opened.

Recommendation only: complete weekly cycles with7/3/1 targets; Model B protects earned phase checkpoints; proposed material frontier0/3/9/18/36/72, three phases; legacy rhythm unconfigured until explicit enrollment, future-only effective edits, retained achievement receipts after correction; two-gap habit Resonance. Thresholds, tolerances, reset/checkpoint policy, effective dates, correction retention, pause treatment and new backup versions are **not owner-approved**. No numeric contribution multiplier or reward/recipe formula.

Next single recommended task after review: **UI-COLLAPSE-001**, independently collapsible inventory/Life Rhythm with device-local preferences and no SQLite just for UI preferences. Not begun. HABIT-RHYTHM-001, HABIT-SIGILS-001/icons, PROGRESS-002A/B, ARCHIVE-CLEANUP-001 and AUDIO-001 remain queued, not authorized implementations. No automatic merge; stop for owner review.

## Historical receipts — release holds below superseded above

# Current delivery: NAV-CHRONICLE-001 — owner review

[PR #10](https://github.com/Maximus1978/Relics/pull/10), feature-nav-chronicle-001, OPEN/UNMERGED. Owner accepted SPHERE-TRENDS-001 including rolling7 days; PR #9 was verified and merged normally at 39af6b782385ba202c177cc3e99467c208f99d9d before this branch began. Current master remains that accepted release; NAV is not merged.

## Exact verified source and results

Tested code/scripts/tests head: a520f1e38595a9e020df5e8c868edadbe9d9e96b. Synthetic PR merge source: e41131b1629c057b3f095a874ce70e55cea53665. [Windows run 41104319143](https://github.com/Maximus1978/Relics/actions/runs/41104319143) SUCCESS; logs confirm locked npm ci, 75 Node/temporary SQLite tests (0 failed), TypeScript/Vite, 282 real browser checks with runtimeErrors=[], actual native Tauri release compilation and 22 native safety tests PASS. One standalone crash helper is intentionally ignored and run by its passing parent. Node 22.23.4/Rust 1.99.1.

Local 75/282/TypeScript/Vite also PASS. During the GitHub status delay a locked/offline native Windows build completed successfully in 1m03s; real native 22 tests also passed locally. No actual app was launched against owner data. Final receipt modifies Markdown only with [skip ci]; tested application/art/locks/tests remain unchanged.

## Downloaded and checked artifacts

[Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/41104319143/artifacts/13000757903): 11,897,255 bytes; SHA256 7a958942fd7e3258c072a1fba42fe6d683bbcab80fa30cb2d0e1f502e9047f8c matches GitHub. EXE 20,631,040 bytes; SHA256 dbd6e973843882e2aa990e6f6d8ad7b4e84eab65528dca58665bf7cca5977064 matches manifest. build-info verifies head/source above, signed=false/nativeUiRuntimeVerified=false. Artifact expires 2026-11-13 UTC. Extract and run relics.exe on Windows x64 with WebView2; no build tools required.

[Actual screenshots/browser proof](https://github.com/Maximus1978/Relics/actions/runs/41104319143/artifacts/13000187101): 69,539,871 bytes; SHA256 72f0f650f9e2b8d65e06bc97f906e8719d507b5b046b8b1281624669308ad98b matches GitHub. Downloaded result.json confirms 282 checks/zero runtime errors. Actual required captures inspected: chronicle-sanctuary-dashboard.png, chronicle-1440x900.png, chronicle-1280x800.png, chronicle-390x844.png, chronicle-archived-history.png, chronicle-archived-only.png, chronicle-empty.png and mobile variant. Source is explicitly synthetic in-memory preview, not owner data. Existing rune/geometry/editor/analytics proofs retained.

chronicle-sqlite-bridge-proof.json separately confirms real temporary SQLite + mocked native IPC, one repository load before error reload, two mock replacements and cancel/restore/error refresh. It explicitly does NOT claim real Rust backup/native UI verification. Existing 22 Rust tests verify actual backup/migration/rollback/crash safety; owner must still accept real native dialogs/UI. Archive/snapshot IDs/names/spheres/dates preserved, no owner DB/private catalog accessed.

Local downloaded ZIP/extracted evidence is outside Git at ../Relics-NAV-CHRONICLE-001-{browser,windows-x64}[.zip]. CI artifact, not the optional local build, is the published owner candidate.

## Delivered behavior, manual acceptance and limits

One shared app model/repository and sidebar/mobile view state; date-grouped snapshot Chronicle only mounts on its destination. Sanctuary ends after unchanged LifeRhythm. Inactive Sanctuary is hidden/inert to retain selected day/chart1/4/8 mode/filter state. Current-page/heading/skip/announcement semantics, adjacent cancel focus and active-view status/error/loading/empty handling are implemented. Restore refreshes the same journal; a refresh failure remains visible after modal close. No schema/repository/backup protocol/rune/chart/art/dependency/workflow or deletion-semantic change.

[Full native Windows acceptance steps](NAV_CHRONICLE_001.md#windows-owner-acceptance--no-compilation-commands): close old app, extract new ZIP/run; inspect dashboard and dedicated Chronicle/date groups/counts/archived snapshots, keyboard/mobile/focus; cancel an intended synthetic record and inspect updated Sanctuary/rune/1-week chart; use isolated synthetic data for native v1/v2 restore/full replacement; resize1440x900/1280x800/390x844, close/reopen offline. Keep valuable personal backups private. Browser mock-IPC tests do not replace native dialog acceptance.

Known limits: unsigned x64/WebView2, native visual/functional owner acceptance pending, in-memory navigation starts Sanctuary on restart (no URL/history/persisted route). No new diary/filter/search/date edit/undo/audit/gameplay/Android. Next queued ANDROID-001 requires separate owner scheduling; not begun. Stop after delivery, do not merge PR #10 automatically.

## Historical implementation and earlier receipts

# Active task: NAV-CHRONICLE-001

Owner accepted SPHERE-TRENDS-001 including rolling7 days on Windows. PR #9 expected head317756f09eab239f5f1a9c7bdb5277be8362599b verified mergeable, Windows run40943769883 SUCCESS and only4 Markdown files since tested6a1e539d. Regular merge39af6b782385ba202c177cc3e99467c208f99d9d verified on master (parents293e7d20 and317756f0). Local master fast-forwarded; feature-nav-chronicle-001 starts there.

Only active scope: dedicated Chronicle through shared desktop/mobile view state, historical date groups, accessible focus/active/skip semantics, visible cancellation/loading/error feedback and shared repository/restore refresh. Preserve Sanctuary/art/analytics1/4/8/rune, schema4/backupv1/v2 and physical cancellation. Focused unmerged PR, actual screenshots/Windows CI/EXE/manual acceptance. No next feature, owner DB or private content. Implementation candidate:75 Node/SQLite tests, TypeScript/Vite and282 actual browser checks PASS locally with runtimeErrors=[]. Temporary SQLite/mock-IPC integration covers load/cancel/restore/error paths; native UI acceptance not claimed. Windows CI/EXE pending. Earlier PR #9 holds below are historical, superseded above.

## Historical delivery receipts

# Active owner addendum: recent seven-day analytics

Add «1 неделя (последние 7 дней)» to the existing PR #9 selector, including actual local today and six prior calendar days, with daily points/table rows. Keep the existing default4 and completed4/8-week modes, snapshot/provenance/empty rules, rune/schema/backups unchanged. Update docs, verify and publish on the same unmerged PR; no next task. Local verification PASS:73 Node/SQLite tests, TypeScript/Vite and208 browser checks with zero runtime errors. Actual seven-day desktop/narrow screenshots inspected. Hosted Windows CI now PASS; current source/artifacts below supersede the previous delivery.

## Verified seven-day update delivery

Tested implementation:6a1e539d220ddec4e6fc07c8a7bf7d4d9488f39c; synthetic PR merge build:31729d090ab478e130eb8b422d0c2c8caf23ca62. [Windows run40943769883](https://github.com/Maximus1978/Relics/actions/runs/40943769883) SUCCESS: locked npm ci,73 Node/SQLite tests, TypeScript/Vite,208 browser checks with runtimeErrors=[], native Tauri Windows release and22 native safety tests PASS (one intentionally ignored standalone crash helper runs under its passing parent).

[New Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40943769883/artifacts/12929011322): 11,896,662 bytes; downloaded SHA256 3af571b6b7f11f954d6eed48429ae386b726c5b7c00c80590a3598cc4cf88b2b matches GitHub. EXE 20,630,016 bytes; SHA256 373a1c95b6f4002ba4d90c0447feb0a1ee50e4fe6e820e9ecb154c1dd9db229d matches manifest; build-info confirms both source SHAs. Unsigned Windows x64/WebView2; extract and run relics.exe. Native UI acceptance remains for owner, no automated owner-DB launch.

[Browser screenshots/proof](https://github.com/Maximus1978/Relics/actions/runs/40943769883/artifacts/12928133238): 60,620,602 bytes; downloaded SHA256 b3562071aac645cbea76baa6d3a66360e42dcbaa6b2646707386d0852ae29065 matches GitHub. Actual rhythm-seven-days.png and rhythm-seven-days-narrow.png inspected,208 checks confirmed. Synthetic in-memory snapshots only. ZIP/extracted evidence outside Git: ../Relics-SPHERE-TRENDS-001-7days-{browser,windows-x64}[.zip]. Run40809834288 and its old EXE are historical and do not include this owner update.

PR #9 remains OPEN/UNMERGED. Documentation-only receipt follows tested code using [skip ci]; no runtime changes afterward. Next NAV-CHRONICLE-001 not begun.

# Historical previous delivery: SPHERE-TRENDS-001 — unmerged owner review

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
