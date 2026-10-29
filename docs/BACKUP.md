# BACKUP-001 — local backup and full-replacement restore

## Status and scope

Native Windows utility, offline and user-controlled. Export/restore use real native dialogs, not command-line operations. Browser demonstration shows an unavailable explanation and never pretends to save/restore files. No cloud, scheduler, encryption, merge/conflict resolution, Android backup UI or new activity/game fields.

BACKUP-001 was owner-accepted and merged in PR #5. WEIGHTS-001B extends it in [PR #8](https://github.com/Maximus1978/Relics/pull/8); see [current evidence](WEIGHTS_001B.md). The old v1 foundation evidence below is historical. Native automated test/build evidence and owner manual acceptance are distinct; see HANDOFF for exact tested commit/run/results. Do not merge PR #8 automatically.

[Windows run 40717100257](https://github.com/Maximus1978/Relics/actions/runs/40717100257) passed on 7f76aea1da3b8daecc808e921c5797f09314e657: 31 Node/SQLite tests, TypeScript/Vite, 42 browser checks, Tauri Windows release compilation and 16 native tests. The crash helper is run as a child, intentionally ignored standalone. [Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40717100257/artifacts/12829521933). Native manual acceptance remains pending; later documentation-only evidence leaves source/tests/locks unchanged.

## Format and compatibility

UTF-8 human-readable JSON, format identifier relics-backup, new exports use formatVersion 2/databaseSchemaVersion4, with strict import of existing formatVersion 1/schema 3, exportedAt RFC 3339 with offset, appVersion nonempty version string. All envelope/data/record properties are required, including archivedAt as null or a timestamp. V2 adds required habit contributionProfile and required nullable activity contributionSnapshot, with strict version 1/origin/user-or-legacy-default/all-five values. Unknown fields/versions are rejected, not discarded. V1 was the first delivered backup format; the earlier schema-2 envelope was a proposal, never a supported export.

Legacy v1/schema 3 synthetic example, still supported for IMPORT (new exports/safety files are v2/schema 4):

```json
{
  "format": "relics-backup",
  "formatVersion": 1,
  "exportedAt": "2026-10-28T00:00:00Z",
  "appVersion": "0.1.0",
  "databaseSchemaVersion": 3,
  "data": { "habits": [], "activities": [] }
}
```

Schema level 3 is the additive one-time seeding migration; habit/activity columns stay unchanged from level 2. Applied migrations 1/2 are untouched. The native SQL plugin's own migration ledger is administrative state and is not copied from a backup; the destination keeps its correctly migrated ledger.

| JSON collection | Fields, all preserved |
| --- | --- |
| data.habits | id, name, spheres (ordered canonical ID array), archivedAt (null or original RFC 3339 timestamp), contributionProfile (v2 required) |
| data.activities | id, habitId, habitName (historical snapshot), spheres (historical snapshot array), occurredOn (original local YYYY-MM-DD), recordedAt (original timestamp string), timezone (original IANA ID), contributionSnapshot (v2 required, explicit null for legacy history) |

Arrays retain exported database row order. IDs, text, sphere order and timestamp/zone representations are preserved, never normalized or recomputed. Historical name/spheres may differ from current habit definitions and are intentionally not reconciled. Derived counters, UI state, schema internals, paths, credentials and closed catalog content are excluded. No real secret recipes are imported/exported.

Current candidate accepts strict v1/schema 3 import and v2/schema 4. V1 adapts habit definitions to marked 5 defaults but leaves event snapshots unknown; metadata/IDs are preserved. New exports and protective copies use v2 only; no lossy downgrade. Future schema/format support must be explicitly implemented and tested through additive migrations/version adapters. Newer files cannot be interpreted as v1 by dropping unknown content.

Validation: strict JSON/field types; known versions; nonblank IDs/names; canonical nonempty sphere sets without duplicates; valid Gregorian local dates (years 0001–9999); RFC 3339 timestamps; recognized IANA timezones; unique IDs; existing habit/day uniqueness; activity-to-habit references; valid nullable archive timestamps. Historical restore validates calendar validity without comparing dates to the receiving computer's current clock; normal new activity logging still rejects future dates. No missing record is interpreted as inactivity/failure.

Limits: 32 MiB file/serialized output, 20,000 habits, 100,000 activities, 256 characters per ID, 4096 per name/snapshot name, 128 per timezone and 64 per app-version string. No NUL characters or silent truncation. Exceeding a limit rejects export/import with a clear error. JSON parser recursion limits also reject excessively nested input.

## Export

Open Резервная копия → Создать копию. Native Windows Save dialog suggests Relics-backup-YYYY-MM-DD.json using the current local date. A single SQLx read transaction captures a consistent two-table snapshot; export does not modify the database.

Write pretty JSON to a temporary file in the chosen destination directory, flush/sync it, then publish through tempfile's atomic persist operation. Success appears only after publication. Pre-publication failure does not delete a pre-existing destination or claim success; dialog cancellation is quiet. The final path must end in .json. File bytes never pass through the renderer or logs. Aggregate byte/row bounds are checked inside the snapshot transaction before fetching full rows; serialized output is checked again.

Backups are NOT encrypted. Store them privately; do not attach them to PRs, CI artifacts, chats or public repositories. Export requires a local regular file destination on a filesystem supporting the publication operation. Hardware/filesystem failures or cloud-folder behavior cannot be turned into an absolute durability guarantee.

## Preview, confirmation and safety recovery

Выбрать копию opens a native JSON picker. The native service reads a bounded regular file and validates it completely before a database transaction. Only a summary/token reaches React: export date, habit count, archived count, activity count and supported format/schema. The validated bytes are retained as a typed snapshot in native memory, so editing the file after preview cannot change what is confirmed.

The preview explicitly says ALL current habits and journal entries will be replaced, with no merge. Отмена/closing clears the pending snapshot and does not touch SQLite. Заменить данные и восстановить is the explicit destructive confirmation. Tokens are single-use; stale/unknown tokens fail, and restarting clears unconfirmed previews.

Before any DELETE, capture the current database and successfully publish a recoverable JSON file named Relics-before-restore-<UTC time>-<UUID>.json under:

**%APPDATA%\\local.relics.app\\recovery** on Windows (Tauri app_config_dir/recovery).

The actual safety path is shown after success. Safety files are published without overwriting an existing path, synced and read back/compared with the complete current snapshot before any deletion. Safety creation/validation/write failure aborts replacement. Safety copies are retained even if subsequent SQL fails; they are not automatically pruned. They use v2 including every weight/origin/null and can be selected through Выбрать копию to undo a replacement. No safety copy is stored in Git/logs/CI. Keep this directory private as well.

## Atomicity, connection lifecycle and security

The pinned SQL plugin 2.6.0 exposes DbInstances/DbPool. Ordinary bridge commands use a shared connection pool; separate frontend BEGIN/DELETE/INSERT/COMMIT calls would not pin a connection. Native code obtains the existing sqlite:relics.db pool from plugin state. Restore holds the plugin map's exclusive lock, waits out in-flight plugin operations, then acquires one connection, enables foreign_keys and synchronous=FULL and opens one SQLx BEGIN IMMEDIATE transaction.

Read safety snapshot under that transaction; publish it before deleting anything. Delete activities then habits; use bound INSERTs for every field; run foreign_key_check; commit once. SQLx transaction ownership/Drop handles rollback on early error or cancellation. The write lock covers the replacement, including the safety snapshot, so the snapshot and replaced pre-state match. Rust tests inject post-delete failure, mid-insert SQLite trigger failure, unavailable safety storage and abrupt child-process termination before commit.

The live SQLite file and migration ledger are never swapped/replaced. Existing cached connections keep the same file identity and see committed data on subsequent queries. React refreshes habits/history after commit; it does not reopen the repository or rerun seeds. If refresh fails after a confirmed commit, the error explicitly says restoration completed and asks for restart, disables further repository mutations and never claims rollback.

Only four backup IPC commands are allowed for the local main window. They accept no caller-supplied paths, SQL or record arrays: native dialogs choose paths; restore accepts only a validated-preview token. Rust errors are static, avoiding journal text/raw SQL/path leakage to logs. No unrestricted filesystem or dialog plugin permissions are granted to JavaScript. Existing SQL bridge permissions are unchanged. New Rust dependencies are limited to native dialogs, atomic file publication, validation and direct use of the already-present SQLx/Tokio/Serde/Chrono stack.

Close other running copies before a manual restore. This is a full replacement in the current instance, not cross-process synchronization. Each SQLite transaction remains all-or-nothing; filesystem/hardware failure cannot guarantee whether a commit acknowledgement is received. A retained safety snapshot supports recovery if commit status is uncertain.

## One-time startup samples

Migration 003_seed_once.sql inserts missing original samples with INSERT OR IGNORE exactly once, under the plugin migrator. It does not update existing names, spheres or archive state. Routine repository opening no longer inserts samples. The destination's migration ledger remains intact during restore; empty/subset backups therefore stay empty/subset after offline restart. No new gameplay table, DB name or application identifier is introduced.

## Manual Windows acceptance — no CLI

1. Close all existing Relics windows. Extract the PR's Windows ZIP into a separate application folder and run relics.exe on Windows x64 with WebView2. The database identity/location is unchanged. Do not delete or rename the personal database to test a fresh install.
2. Open Резервная копия and Создать копию. Save A in a private local folder. Wait for success and note counts. Canceling the native Save dialog must show no error.
3. Optionally open A in a local text editor: check the format/version, habit IDs/archives and historical activity names/spheres/dates/timezones. Do not publish the file.
4. Choose A, inspect supported status/date/counts and replacement warning, then Cancel. Confirm the application data did not change. Cancel the native Open dialog too.
5. To test replacement, optionally create a clearly synthetic temporary habit/record AFTER exporting A. Choose A again and confirm replacement only when its summary is the desired state. The extra test data should disappear. Wait for success and retain the displayed protective JSON path.
6. Check archived habits/restore, multisphere definitions, October 26–27 history if present, old snapshots, previous-day logging and duplicate protection. Close/reopen offline; restored IDs/records/archives must remain and no absent sample should reappear.
7. To undo the test, choose the protective JSON in the recovery directory, review its summary and explicitly confirm. This creates another protective snapshot first.
8. To test invalid input, create a separate malformed JSON with a local text editor. Selecting it must report an error without preview/replacement or data changes. Never edit the sole valid A file for an error test.
9. Fresh-database acceptance is covered by native temporary-database tests. Optional manual repetition must use an isolated Windows account or Sandbox with its own application data, never removal of the owner's database.

Automated rollback/crash/disk-failure tests use synthetic temporary files only; do not simulate these failures against personal data. Native picker behavior, storage permissions and offline runtime acceptance still require owner review.

## Sources reviewed

- [SQL plugin 2.6.0 pool state](https://github.com/tauri-apps/plugins-workspace/blob/sql-v2.6.0/plugins/sql/src/lib.rs) and [connection/commands](https://github.com/tauri-apps/plugins-workspace/blob/sql-v2.6.0/plugins/sql/src/commands.rs).
- [SQLx 0.8.6 pool/transactions](https://docs.rs/sqlx/0.8.6/sqlx/struct.Pool.html).
- [Tauri native dialogs](https://v2.tauri.app/plugin/dialog/) and [application command permissions](https://docs.rs/tauri-build/latest/tauri_build/struct.AppManifest.html).
- [tempfile atomic persist API](https://docs.rs/tempfile/latest/tempfile/struct.NamedTempFile.html).

## WEIGHTS-001B — v2 implementation candidate, v1 import retained

The previous accepted executable remains v1/schema 3; PR #8 upgrades the candidate to schema 4/new v2 exports. WEIGHTS-001A itself applied no migration/parser/export change; its approved contract is now implemented by WEIGHTS-001B. [Full proposed compatibility matrix and safety plan](WEIGHTS_001A.md#5-proposed-backup-v2-and-compatibility-matrix) is a WEIGHTS-001B review prerequisite.

Weighted storage would require format v2/schema 4, version-dispatched strict Rust DTOs, required habit contributionProfile and required nullable event contributionSnapshot. Preserve all existing fields/order/metadata/limits. Retain strict v1 input: adapt imported habit sphere sets to marked 5 defaults for future logs; keep old event numeric snapshots null. Never add/drop unknown fields in v1 parsing or borrow destination weights. Unknown versions/malformed profiles fail before mutation.

New export and protective pre-restore safety copies must include every weight/origin/null in v2. No lossy v1 export/downgrade. Preview explains v1 conversion and full replacement, with numeric/default/legacy counts. Validating/syncing/read-verifying the weighted pre-state safety copy precedes any DELETE; native pinned-transaction rollback/crash/undo tests must preserve new fields too. Include profile bytes in size preflight. Existing native dialogs, tokens, archive behavior, migration ledger and no-reseed guarantees remain. The old executable is v1-only, not a v2 reader; Windows round-trip/offline acceptance is required separately.

Actual backup tests in WEIGHTS-001B include strict TS/Rust conformance, v1 full replacement with NULL historical snapshots, weighted v2 protective undo/reopen, original rollback/crash/preview/token checks and new JSON-byte size preflight. Gate B1 passed before UI integration. [WEIGHTS_001B](WEIGHTS_001B.md) records final Windows CI, artifact and native acceptance. Existing migration files and application database identity remain unchanged; no owner data was used in automated tests.
