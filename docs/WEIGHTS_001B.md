# WEIGHTS-001B — implementation and Windows acceptance

## Scope and release status

[PR #8](https://github.com/Maximus1978/Relics/pull/8) is an unmerged implementation candidate. WEIGHTS-001A was owner/reviewer-approved; [PR #7](https://github.com/Maximus1978/Relics/pull/7) merged normally at 6e122e7221c33d909ff2f4ecdbfba75b210f5b08. This branch starts from that verified master; no outdated-base implementation. No automatic merge or SPHERE-TRENDS-001.

B1 was completed and tested BEFORE UI integration, recorded at 240fb1e895c9a8bd8ef14b63ba8adef5d8d144dc: 59 Node/temporary SQLite tests and 22 native safety tests PASS, one intentionally ignored child crash helper executed by its passing parent. B2 then integrated shared Create/Edit controls and native-backup summaries. Full Windows CI/tested source/artifacts: [Windows run 40790775136](https://github.com/Maximus1978/Relics/actions/runs/40790775136) SUCCESS on 1f957faa863af755a6b5eb435cdbffe56ae98069 (synthetic merge 1caccfa7df56627c54db5a333a8e428fa5636794): 59 Node/temporary-SQLite tests, TypeScript/Vite,174 browser checks/zero runtime errors, native Windows Tauri release compilation and 22 native safety tests passed; one intentional crash helper runs via its parent. [Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40790775136/artifacts/12861303313) and [actual screenshots](https://github.com/Maximus1978/Relics/actions/runs/40790775136/artifacts/12861866097) downloaded and checksummed; detailed hashes are in HANDOFF. Documentation-only receipt commits preserve this tested runtime.. The prior accepted executable is not this feature's evidence.

## Implemented behavior

Contribution profiles have version 1, origin=user|legacy-default, exactly five canonical integer values. Selected spheres1–10, unselected 0, new selection5, no normalization. Create/Edit show units and subjective explanation; no effort, duration, objective health/Balance, reward/rarity or graph field. Default-origin confirmation and history-preservation copy are explicit. Name validation stays as before. Existing medallion files and binary rune projections are unchanged.

Migration004 adds contribution_profile_json to habits and contribution_snapshot_json to activities without modifying001–003. Active/archived old definitions get marked 5 defaults. Old events keep SQL NULL. Native/TS validators and shared conformance vectors reject malformed/unsupported/mismatched/duplicate profiles. Database triggers also reject inconsistent current definitions/non-null event snapshots; they preserve the explicit NULL legacy-history path.

Habit writes are atomic; activity INSERT...SELECT copies the current saved name/spheres/profile together. Duplicate retries preserve the first record. Edits/archive/restore never rewrite past values or reactivate samples. Backdating snapshots the definition at recording time. Canceled/re-created records use the current definition; physical deletion remains the accepted AUDIT-001 gap.

## Backup compatibility and data safety

| Case | Result / requirement |
| --- | --- |
| Existing v1/schema 3 import | Strict original DTO, then default-origin habit profiles and NULL activity numeric snapshots; original IDs/archive/name/sphere/date/time metadata preserved |
| New v2/schema 4 export/import | Required non-null habit contributionProfile; required nullable activity contributionSnapshot. Preserve all values/origins/known zeros/unknown history |
| Restore v1 over weighted destination | Full replacement with explicit conversion warning; complete weighted v2 protective copy saved/verified before deletion |
| Undo replacement using safety file | Weighted pre-state, default/user origins, NULLs and archive state round-trip exactly after reopen |
| Invalid/unknown fields, profile versions, omitted-null keys, mismatched historical profiles | Reject before mutation; do not strip/truncate or normalize |
| Safety failure, post-delete/mid-insert SQL failure or crash before commit | Existing pinned SQLx transaction rolls back. Protective v2 data remains recoverable |
| Older executable / v2 downgrade | Unsupported. Never export lossy v1 from weighted storage. Close older windows before upgrading/restoring |

No arbitrary paths or extra permissions added to backup IPC. File publication/readback verification, cached validated preview tokens, explicit full-replacement confirmation, original limits and migration-ledger/no-reseed behavior remain. Profile bytes count toward size checks before fetch and during serialization. Automated tests use synthetic temporary DB/files only.

## W01–W26 evidence map

The accepted specification remains [WEIGHTS_001A](WEIGHTS_001A.md). T01–T05 trends are NOT implemented.

| Scenario | Automated evidence | Native owner acceptance |
| --- | --- | --- |
| W01 | contributions.test: all31 selections/endpoints/max50, no normalization | Verify one/two/five controls |
| W02 | Strict ranges/types/empty name/sphere tests; existing invalid-edit regressions | Invalid form/retry remains readable |
| W03–W04 | Shared TS/Rust raw-JSON vectors; exact key/type/version/origin/set validation | No extra action |
| W05 | SQLite schema1/2/3 upgrades plus native SQLx old-history/archived fixtures; Oct26–27 retained | Native upgrade in isolated account |
| W06 | Existing startup/archive tests and native empty/subset restore/reopen | No resurrected samples after offline restart |
| W07 | Native actual Migrator failure proves columns/backfill/ledger rollback; Node retry test | Never inject into owner DB |
| W08 | Production-repository create/edit/reopen and invalid-update assertions | Save/cancel/reopen profile |
| W09 | Legacy-default future log then user-defined profile; prior origin unchanged | Default explanation then Edit Save |
| W10 | Historical name/sphere/profile snapshot tests after later edits | Old events retained |
| W11 | Backdated creation/cancel/re-add uses recording-time profile | Backdated one-click log |
| W12 | Same-statement snapshot with edit immediately before insertion; duplicate retry preserved | No manual race required |
| W13 | Archive rejects logging, restore/reopen retains profiles/history; archived samples remain archived | Archive/restore habit |
| W14 | Native strict v1 adapter/full replacement with old timestamps/archives/NULL history | Native v1 picker/preview warning |
| W15 | Weighted v2 round-trip with user/default/NULL history and historical sphere differences | Export/reopen/import isolated fixture |
| W16–W17 | Required-null, strict v1/v2, malformed/future/extra/duplicate JSON rejection tests | Invalid file leaves data unchanged |
| W18 | v1 replacement and full v2 protective restore after reopen | Validate protective copy/undo |
| W19 | Weighted rollback, safety-failure and actual child-process crash tests | Automated only |
| W20 | Existing preview cancel/token/cached-byte tests retained | Cancel both picker and preview |
| W21 | New JSON-byte preflight/integrity tests plus existing row/file/text bounds | No truncation |
| W22 | Actual browser selection/default0/5, reselection and number↔range/max50 tests | Adjust1–10 |
| W23 | Actual keyboard Arrow/Home/End/Space, accessibility tree, validation focus/Cancel and existing modal checks | Screen reader/device review remains owner task |
| W24 | Actual one/two/five Create/Edit and narrow screenshots; medallion/legend overlap/layout assertions | Compare with supplied concept |
| W25 | All prior50 Node, prior16 native and prior150 browser checks retained with schema-aware fixtures; binary rune source unchanged | Existing Sanctuary behavior |
| W26 | Local native backend tests and full Windows CI compilation; downloadable EXE below | ACTUAL WINDOWS UI/OFFLINE ACCEPTANCE PENDING |

## Actual screenshots

Browser artifact contains weights-create-one.png, weights-create-two.png, weights-create-five.png, weights-edit-one.png, weights-edit-two.png, weights-edit-five.png, weights-validation.png, weights-create-two-narrow.png and weights-create-actions-narrow.png. They use actual controls in the fictional in-memory preview and do not prove SQLite/native runtime. Source artwork was reused, not generated/replaced.

## Manual Windows acceptance without build tools

1. Keep a current accepted v1 backup in a private folder. Close all old Relics windows. Extract this PR's unsigned Windows x64 ZIP separately and run relics.exe with WebView2. Do not downgrade the executable against an upgraded DB.
2. Prefer an isolated Windows account/Sandbox and synthetic journal for replacement/upgrade exercises. Never remove the owner's DB or force crashes/disk failures in personal history.
3. Check old habits/archives and existing Oct26–27 entries if present. Old habit profiles should say values are defaults; history is retained without invented numbers.
4. Create Гитара with Mind7 / Recovery3. Save, log a past date with one click, close/reopen offline. Edit Mind to4; verify the saved habit has4 after reopening and older history has not been rewritten (snapshot details are backend-tested; optionally inspect a private v2 export locally to compare the older event snapshot7 with current habit profile4; no new analytics/details screen is implemented).
5. Exercise one and all-five selected spheres, deselect/reselect5, number and keyboard adjustment. Empty/out-of-range input cannot save; Cancel/Escape preserves saved values. Art/rune/daily illumination should remain familiar.
6. Archive/restore the habit, reopen offline, then log another valid day. Archived habits must reject new logs; existing history remains.
7. In the isolated dataset export v2, preview/cancel, restore v2, then preview strict v1 with its conversion/full-replacement warning. Confirm only when intentional. Check the shown protective v2 path and restore it to undo replacement. Cancel native pickers too. Do not publish backups.
8. Final owner review covers native picker/permissions, Windows form/accessibility and offline migration/reopen. Report actual manual result before merging PR #8.

## Known limits

Unsigned Windows x64/WebView2 build, no installer/signature/Android validation. Current one-completion-per-day and physical cancellation remain. Values are subjective, not measured health/effort or numeric Balance. Trend projection/charts, per-event intensity, rewards and new icon art are absent. Browser demo resets on reload; native DB is the source of truth. No executable has been launched against the owner's journal here. Stop after this delivery.
