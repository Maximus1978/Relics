# Project handoff

## Active task and delivery boundary

Exactly one active task: BACKUP-001, native Windows local JSON export and full-replacement restore. [PR #5](https://github.com/Maximus1978/Relics/pull/5), branch feature/backup-001, baseline master 5fdc02dc1777c6b5793bababda918beac195856b. Sanctuary Gate A and prior Windows tracker behavior were accepted by the owner; PR #4 is merged.

Full replacement (not merging), native file dialogs, strict validation, preview, explicit confirmation, recoverable safety JSON and atomic replacement are explicitly authorized in the supplied BACKUP-001 brief. The previous roadmap question about replace-versus-merge is resolved. No owner database/private content was accessed. No new gameplay/activity fields, cancellation change, Android backup UI, sync, encryption or automatic backup was implemented.

Deliver this PR for native acceptance; do NOT merge automatically or begin another task. The next queued task after BACKUP-001 acceptance is SANCTUARY-STATE-001, not started.

## Implementation

[Format, compatibility, limits, technical analysis and exact manual steps](BACKUP.md) are canonical. The backup utility is discoverable in the existing Sanctuary rail/mobile navigation. Browser mode shows an unavailable explanation and no persistent file actions. All native bytes/paths are selected/handled inside Rust; React receives summaries and a single-use preview token, not backup records.

Export uses one SQLx read transaction on the SQL plugin's existing sqlite:relics.db pool. Aggregate size/count budgets precede row loading. Synced same-directory temporary publication avoids incomplete successful files. Errors/cancellation never claim success.

Import parses/validates at most 32 MiB, rejects unknown versions/fields, validates IDs/references/spheres/calendar dates/timestamps/IANA zones/archive state/uniqueness and never silently discards data. Preview shows export time/counts/version support and explicit replacement wording.

Restore holds an exclusive plugin pool-state guard, acquires one connection, enables foreign_keys and synchronous=FULL, then owns one BEGIN IMMEDIATE SQLx transaction. Read the current snapshot, publish a non-overwriting protective JSON, sync/read-back/compare it, then delete activities/habits, bind all inserts, check foreign keys and commit once. Any failure before commit rolls back; SQLx owns transaction cancellation. No frontend pooled BEGIN loop, live DB file swap or changed file identity. Existing cached connections remain valid; UI reloads records after commit. Post-commit refresh failure reports the commit honestly, disables further repository mutations and requests restart.

Protective files remain in app_config_dir/recovery, Windows %APPDATA%\\local.relics.app\\recovery, using the same restorable JSON format. No pruning or repository/log/artifact copy. No safety snapshot success means no replacement.

## Schema and dependency compatibility

Migrations 001/002 are byte-identical to baseline. Additive migration 003_seed_once.sql only inserts missing original sample IDs via INSERT OR IGNORE once; it adds no gameplay tables/columns. Routine JS repository opening no longer seeds. Restore does not touch the SQL plugin migration ledger, so empty/subset restored datasets remain unchanged after offline restart. Backup format v1 supports migration level 3; the earlier schema-2 envelope was only a proposal. IDs, historical strings/sphere order/local dates/timestamp strings/zones and archive timestamps are preserved.

Native identity local.relics.app and sqlite:relics.db location remain unchanged. Four explicit main-window backup commands accept no arbitrary frontend paths/SQL/data. No unrestricted JS fs/dialog permission was added; inherited SQL bridge permissions remain unchanged.

Cargo.lock is resolved by the initial Windows run and committed; final workflow returns to locked resolution and adds native release tests to the existing pipeline. No existing package version was upgraded: additions are the necessary native dialog/atomic-file/IANA-validation dependencies and their transitive support; existing SQLx/Serde/Chrono/Tokio/UUID crates are directly reused. npm dependencies/lock are unchanged.

## Actual verification and final candidate

Local Node suite: 31/31 passed after moving seed initialization into the test migration fixture. Rust source formatted with the installed direct rustfmt executable; whitespace and browser script syntax checked. Local cargo/rustup execution cannot write its toolchain temp directory, so no local native test/build success is claimed.

[First Windows run 40712606293](https://github.com/Maximus1978/Relics/actions/runs/40712606293) on 7ee70986090d45d20e3ad4f41706888dfaefeb43 passed npm ci, 31 tests, TypeScript/Vite, 42 browser checks, actual Tauri Windows release build and 14 native tests. The ignored crash-helper entry is intentionally invoked as a child by the passing process-termination test, not omitted crash coverage. A native dependency lock artifact was downloaded; ZIP digest matched deb0ab3af9733aa1bdc109f07f5f17dfa4fdf52b6a66c3589d4f1267e7ad69e4.

The final candidate additionally strengthens protective snapshot retention/read-back and snapshot size budgets, disables stale UI mutations on refresh failure and adds protection against overwriting safety files plus concurrent-snapshot coverage. It must pass the same Windows pipeline using the committed lock. The exact final tested head, run URL, native test counts, browser evidence and downloadable EXE are authoritative in PR #5 checks/description and the task report. Do not describe the first run as verification of later code.

Native tests use synthetic TempDir databases/files only: full export/fresh restore/reopen equality, archive and snapshots, malformed/unsupported/missing/unknown fields, bad references/duplicates/types/spheres/dates/zones, file/record limits, preview cancellation/single-use tokens, safety failure/no-overwrite, after-delete and mid-insert rollback, v1/v2 migrations/empty restart, consistent read across concurrent commit and actual abrupt child-process exit/recovery. No personal data goes to CI.

## Manual acceptance, limits and next task

Owner native Windows acceptance remains pending for BACKUP-001. CI does not exercise real file-picker interaction in the running Tauri UI or the owner's filesystem permissions. Follow BACKUP.md: export A privately; cancel preview; optionally add synthetic test data; confirm full replacement only after reviewing A; verify history/archives/backdating and offline reopen; use retained recovery JSON to undo if desired. Never remove the owner's database to test a fresh installation; native temporary-DB tests cover that scenario.

Backups/recovery JSON are unencrypted; retain privately. Unsigned Windows x64/WebView2 requirements remain. Close other app copies before restore; this is not cross-process synchronization. Hardware/filesystem failure cannot guarantee commit acknowledgement; a protective snapshot is retained before changes. Strict limits or unrecognized legacy metadata cause rejection without deleting data. Future formats/schemas require explicit adapters, never silent coercion.

Do not merge PR #5 or begin SANCTUARY-STATE-001 automatically. Preserve all approved game decisions in GAME_DESIGN/DECISIONS; none is implemented as part of backup safety work. Russian reports, English technical docs, one task at a time.
