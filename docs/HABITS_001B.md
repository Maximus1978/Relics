# HABITS-001B — edit, archive and restore

## Scope and baseline

Started from master 544d813f26f5b6a4be39d36a81bc4bb7c1feba3e. GitHub confirms HABITS-001A PR #2 merged at that commit. The owner accepted native creation, multiple spheres, backdating and offline restart persistence. This task implements only definition editing and reversible archiving. No gameplay, schedules, weights, new dependencies or pipeline changes.

## Behavior

- Each habit has a keyboard-accessible Действия disclosure with Изменить and В архив…; archived habits offer Изменить and Восстановить.
- Creation and editing share the required-name/five-sphere form, validation, Save/Cancel/Escape and focus handling. Errors retain inputs. Multiple spheres remain unweighted.
- Archiving requires an explicit confirmation that history stays and restoration is possible. Отмена receives initial focus; Escape cancels. Archive and edit never delete activities.
- Active habits are the default. Архив привычек switches to management without completion controls. Restoring returns the last saved definition to the active list. All archived habits may also be edited.
- Name/sphere edits affect subsequent recordings, including backdated recordings created later. Existing recordings retain their original snapshots, dates, IDs and metadata.
- SQL logging selects the current active definition atomically, rejecting archived or missing IDs even if the caller holds a stale habit object. A duplicate active habit/day remains idempotent. Activity cancellation still physically removes the selected activity; audit history is future work.

## Migration and safety

Version 2 adds nullable archived_at and an index. Version 1 is untouched. The native migrator registers both versions. Database filename sqlite:relics.db, application identifier, sample IDs and journal schema remain unchanged. INSERT OR IGNORE seeding does not overwrite edited/archived samples. Every mutation uses parameterized SQL; definition and status updates each use one statement. No real owner database was accessed, migrated or used in testing.

Tests use temporary real SQLite files and production repository queries. The Node adapter binds arguments in placeholder-occurrence order, matching positional bridge calls. A test-only PRAGMA user_version marker applies the actual migration SQL once in a transaction; it does not simulate the native plugin's migration bookkeeping. Native plugin migration/restart acceptance remains manual.

## Verification

Local npm test: 23/23 passed, including the existing 12 tests. New coverage: rename and sphere persistence; immutable old and refreshed future snapshots; active/archive lists and reopen; archived duplicate/backdated logging rejection; restore/re-enable; every sample stays archived across restarts; unchanged October 26–27 legacy records; invalid edits/missing IDs; populated v1 migration/restarts/integrity; archive immediately before the atomic insert.

TypeScript, Vite, browser rendering and native release compilation will be verified by the existing Windows workflow. CI status and artifact evidence are pending and will be recorded after execution. Browser rendering alone cannot establish native database or interaction acceptance.

## Owner acceptance, before merging

1. Close the old Relics application. Extract the new Windows ZIP into a separate folder; run relics.exe. No compiler or local dependency installation is required. Windows x64/WebView2 and unsigned-executable limitations remain.
2. Open Guitar → Действия → Изменить, rename to Гитара and keep Разум + Восстановление. Save. Check a previous journal row still shows its original snapshot; record another available past date to check the new definition.
3. Open Чтение → Действия → В архив…; first cancel to check no change, then confirm. It disappears from active habits; its journal remains.
4. Open Архив привычек. Check Чтение appears and has no completion action. Close Relics and reopen offline. Check Гитара, its spheres, archived Чтение and the October 26–27 history persist.
5. Restore Чтение. Return to Активные привычки; verify its definition/history and log an unused past date. Reopen once more to check persistence.
6. Check Tab/Enter/Space/Escape navigation, visible focus and empty-name/empty-selection errors. Review the PR and accept visually/functionally before any merge.

The executable is not launched against personal data by this task. Keep the upgraded database with this version; downgrade compatibility with the older migrator has not been verified. Review/owner acceptance is the next step; no further feature work is started.
