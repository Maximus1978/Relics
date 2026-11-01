# HABIT-RHYTHM-001 — frequency history and archive lifecycle

Status: implementation candidate for owner review, not merged. Only frequency persistence/editor and lifecycle data are implemented; no Mastery, Forging, Resonance, medal, reward or Vacation engine. P01–P09 remain proposed except the bounded behavior explicitly authorized here. Source baseline: UI-COLLAPSE-001 PR #12 normally merged at de1b2f9e954a6a74071a817f6ef81cdf22226276 after verifying reviewed head1250d9f and successful Windows run41255208180. Collapse is owner-accepted functionally; native offline restart remains separately unconfirmed.

## Operational contract

- Stable habit identity; frequencies daily / three_per_week / weekly, Russian Каждый день / 3 раза в неделю / Раз в неделю. Intent only, no fixed weekdays or required daily login.
- Existing habits have an empty frequency history and remain usable. No inferred Daily or retroactive schedule. New habits require an explicit choice. First enrollment starts on actual local current date.
- Later changes take effect next Monday **strictly after today**, including edits made on Monday. Current rule remains effective until then. Current/pending rules and exact date are visible in Edit.
- Repeated changes to the same pending date replace that segment with its stable ID. Cancel pending, then Save, removes only the unapplied segment. Cancel/Escape the dialog saves nothing. Choosing the current frequency also cancels a pending alternative. Applied historical segments remain unchanged.
- Activity occurrence date selects the applicable frequency segment. A new backdated entry still snapshots today's saved name/spheres/contribution definition. Earlier snapshots never change.
- Selected Sanctuary logging date does not supply the enrollment/change date. Native code obtains local today; the client cannot pass a date or raw transaction SQL to the mutation command.
- Initial/current partial weeks are neutral design input for future progression; no practice units, penalties or progression projections are calculated here.
- Clock rollback before recorded change/pause dates rejects incompatible writes atomically; correct the system date. Restoring backups never rebases dates to the receiving computer.

## Schema5: additive migration005

Migrations001–004 are byte-identical to the merged base. SQLite/app identity remains sqlite:relics.db / local.relics.app. Existing habits/events/IDs/metadata/snapshots and one completion per habit/day remain intact.

| Table | Fields and meaning |
| --- | --- |
| habit_frequency_segments | id PK, habit_id FK RESTRICT, frequency enum, effective_on local date, created_on local decision date, version=1; UNIQUE(habit_id,effective_on) and lookup index |
| habit_archive_pauses | id PK, habit_id FK RESTRICT, nullable start_on, nullable end_exclusive_on, reason=archive, provenance=recorded or legacy_unknown |

Calendar checks reject invalid Gregorian dates; SQL enforces enum/uniqueness/FKs and archive non-overlap. Native validation additionally checks segment order/scheduling, IDs/references, version, pause order and agreement between archived_at and exactly one open interval. created_on is minimal scheduling provenance: first effective_on=created_on; subsequent effective_on=nextMonday(created_on),created_on>=previous effective_on. Unconfigured means no segment, not another enum value.

Owner-approved legacy policy: already archived habits get start_on=NULL,end_exclusive_on=NULL,provenance=legacy_unknown. Restoration records the actual local exclusive end and keeps the unknown start. Never derive it from archived_at/upgrade date. Unknown interval is neutral for future Forging/Resonance: neither practice credit nor undocumented-inactivity penalty. No future engine is implemented.

Archive atomically sets archived_at and opens a recorded interval; restore clears the flag and closes the interval. Known same-day [day,day) interval is removed as empty; a legacy unknown-start interval is retained even on same-day restoration. Repeated archive/restore is idempotent. Archived habits still reject completion at repository level.

## Native transaction and security boundary

mutate_habit is a main-window-only, narrowly permitted semantic Tauri command accepting create/update/archive/restore with definition and rhythmChange. It accepts no SQL,path or effective date. Actual local date and recording instant are native-owned. Existing DbInstances write lock serializes this operation against SQL-plugin commands and backup replacement. One acquired connection enables and verifies foreign_keys=ON,opens BEGIN IMMEDIATE,validates schema5,runs bound statements,validates the resulting histories and commits once. Failure rolls back definition and children together. The receipt returns the saved histories from that transaction,avoiding a misleading post-commit read failure.

src-tauri/sql/habit_mutations.json is one embedded parameterized mutation plan. Rust SQLx executes it in production; the test-only Node SQLite adapter executes the same statements. Existing event INSERT...SELECT remains a single atomic snapshot from the active persisted definition. No additional runtime dependency.

## Backupv3 compatibility

New exports and protective safety copies: relics-backup formatVersion3,databaseSchemaVersion5. Existing habit/event fields unchanged; data additionally requires frequencySegments and archivePauses. Segment JSON uses id,habitId,frequency,effectiveOn,createdOn,version; pause JSON uses id,habitId,startOn,endExclusiveOn,reason,provenance. Nullable pause keys are required even when null.

Strict imports:
- v1/schema3: retain IDs/names/spheres/archive/events; default5 profiles for future entries,old event contributions null; rhythms empty; archived habits receive legacy_unknown open interval.
- v2/schema4: retain all contribution values/origins/null snapshots unchanged; rhythms empty; same explicit unknown archive adaptation.
- v3/schema5: preserve all histories exactly,including pending rules and unknown starts/actual ends.

Reject unsupported version pairs,missing/unknown properties,bad enums/dates,duplicates,orphans,unsorted/conflicting rules,invalid boundaries/overlap or archive-flag disagreement **before replacement**. Do not import SQLx ledger/derived progression. Limits include100,000 segments and100,000 pauses plus existing file/row/string limits; no truncation.

Restore remains explicit full replacement,not merge. A synced/read-verified complete v3 safety copy is mandatory before mutation. Delete child histories before parent definitions,insert all data and verify FKs within one pinned SQLx transaction. Invalid input,safety-file failure,mid-insert failure or killed process preserves the original database. The v3 safety file can restore the previous complete dataset after importing v1/v2. UI preferences remain device-only and are not replaced. Older binaries do not understand schema5/v3: no downgrade compatibility claim.

## Gates and automated evidence

Gate A completed before UI integration:89 Node/temporary-SQLite tests and30 native Rust tests passed (0 failures;one standalone crash-helper test intentionally ignored in ordinary enumeration and executed by its passing parent). Migration005 conflict/failure rolls back new DDL and actual SQLx ledger to4,then retry/reopen succeeds. No owner's journal used.

| Acceptance / edge | Executed coverage |
| --- | --- |
| 1–3 Daily/Three/Weekly creation and reopen | habitRhythmSqlite R01; native_rhythm_enrollment_pending_replace_cancel_and_reopen_are_atomic; actual browser+SQLite Create/Edit |
| 4–5 Legacy unconfigured and preserved history | R02; migration_from_v1_and_archived_v2; browser legacy keep/enroll/Chronicle |
| 6–9 Stable ID,current/pending,next Monday,replacement,cancellation | R03; native enrollment test; browser pending date/stable-ID replacement/cancel draft/save/reopen |
| 10–11 Historical lookup and backdates | domain tests,R03/R04; unchanged name/sphere/contribution snapshots and date-based frequency lookup |
| 12 Archive lifecycle,unknown start,actual end,same-day/idempotence | R02/R05/R07; native_archive_unknown_start_actual_end_same_day_and_guarded_foreign_keys |
| 13 v3 round-trip/protective undo | native v3_histories_round_trip_old_v1_v2_import_and_native_protective_undo; full_export_restore_reopen |
| 14 Strict v1/v2 imports | native strict adapters,legacy null/default provenance,v3 recovery after old import |
| 15 Invalid input,migration/restore rollback,crash recovery | R06/R07; migration_five_failure_rolls_back_ddl_and_sqlx_ledger_then_retries; strict_v3_*; native_definition_rhythm_failure_*; v3_replacement_failure_*; dropping_process_mid_transaction_recovers_original_data |
| 16 Existing rune/trends/Chronicle/sliders/collapse | all retained Node/native/browser suites,including real SQLite IPC integration; unchanged rune/art/analytics math |
| 17 Offline native process restart | repository/native database reopen automated; actual Windows UI/offline process restart remains owner acceptance |

Calendar tests cover Sunday/Monday,strictly-next Monday,month/year/leap/DST boundaries and selected backdate independence. Foreign-key enforcement is tested on the real native connection initially configured with FK OFF,then mutation forces ON and an orphan insert fails. Browser checks use real temporary SQLite and mocked native IPC; they do not prove native WebView runtime or filesystem-dialog behavior.

## Manual Windows acceptance — no build tools

1. Close the previous executable. Keep a personal backup. Download the new Windows ZIP,extract it and run relics.exe on Windows11 with WebView2. Keep the app's existing data location.
2. Confirm old habits and October26–27 records remain. Edit an old habit: “Ритм не настроен”; Save without choosing keeps it unconfigured.
3. Create Daily,3/week and Weekly synthetic habits with existing contribution controls. Empty selection must focus the rhythm selector. Confirm one-click/backdated logging still works.
4. Select a past Sanctuary date,then explicitly enroll a legacy habit. Reopen Edit: enrollment is actual today,not the selected backdate.
5. Change Weekly→Daily. Confirm current Weekly and pending Daily with next Monday date. Re-edit pending to3/week,confirm one pending rule. Cancel dialog and verify unchanged; then “Отменить запланированную смену”+Save and verify cancellation.
6. Archive/restore a synthetic habit; verify history persists and archived completion remains blocked. Do not expect Mastery or Resonance behavior.
7. Export v3. Preview its summary and cancel first; then test full replacement with a safe synthetic file,confirm counts/history/pending rules and protective recovery. Old v1/v2 import intentionally has unconfigured rhythms; the v3 safety copy restores the previous histories. Never use destructive testing against the personal journal.
8. Close the process,disconnect internet,reopen same build. Verify definitions/contributions/current+pending rule and archive state persist; revisit Chronicle,trends,central rune and collapsed sections.
9. Advance naturally to the effective Monday and inspect the new current rule. Deterministic Sunday/Monday transitions are automated; changing the owner's clock is not required.

Unsigned EXE may prompt Windows; no installer/signing is included. Screenshots use synthetic data. Native visual/offline restart acceptance is pending; do not infer it from a green build or browser reload.

## Delivery record

Local and hosted results,exact tested SHA,PR/CI/artifact links and screenshots are recorded in HANDOFF.md after verification. Keep this PR unmerged. Next queued task HABIT-SIGILS-001 requires separate authorization.
