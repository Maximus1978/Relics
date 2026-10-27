# Project handoff

Updated 2026-10-27. HABITS-001B implementation/CI delivery is complete; owner/product acceptance is pending. [PR #3](https://github.com/Maximus1978/Relics/pull/3) stays open. Do not merge automatically or start another task.

## Verified baseline

GitHub PR #2 is merged; preparation verified master equals 544d813f26f5b6a4be39d36a81bc4bb7c1feba3e. The owner accepted HABITS-001A native Windows creation, multiple spheres, backdating and offline persistence, including October 26–27 records. Work starts from that exact integrated baseline on feature/habits-001b.

## Current implementation

- Shared creation/edit form with required name and one or more canonical sphere checkboxes/line icons, Save/Cancel/Escape, validation and focus handling.
- Small Действия disclosure per row; edit, archive with explicit preserved-history confirmation, separate Архив привычек view and restore. Archived definitions can also be edited.
- Additive migration 2 adds nullable archived_at/index. Migration 1, IDs, database sqlite:relics.db, application identifier and journal schema stay unchanged.
- Edits update only the definition. Archive/restore updates only status. Startup INSERT OR IGNORE never reactivates archived samples.
- New logging atomically selects the active persisted definition, including its current snapshots; archived/missing IDs are rejected even with stale caller state. Existing activity snapshots/metadata remain untouched.
- One completion per habit/day and existing physical activity cancellation are preserved. Audit improvements remain AUDIT-001.

## Verification and publication

Local npm test: 23/23 passed, including all existing tests plus rename/sphere persistence, unchanged history, archive/restore, archived logging guards, repeated sample seeding, October 26–27 compatibility, invalid edits and v1 migration/restarts/integrity.

Tests use temporary real SQLite files with production repository queries. Migration tests execute the real additive SQL with a test-only version marker, not the native SQL plugin's bookkeeping. Native plugin upgrade, UI interaction, keyboard behavior and offline lifecycle acceptance remain owner/reviewer checks. No personal database was opened or used for testing.

[Windows CI run 40577256811](https://github.com/Maximus1978/Relics/actions/runs/40577256811): completed / success. npm ci, 23/23 tests, TypeScript, Vite, basic browser rendering, locked Cargo dependencies, actual native Tauri release compilation and artifact upload passed. The browser screenshot was inspected. The existing pipeline/dependencies remain unchanged.

Tested feature head: fd97f6596dc400aebf37f28890a73e4bcc23df36. Tested PR merge source: 2dfe87302c238bcc8b7547d373d5ab33d0c36f90. A documentation-only evidence commit follows using [skip ci]; all executable source/tests/migrations/workflow remain identical to this tested head. Do not treat compilation as native UI runtime acceptance.

[Download the new Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40577256811/artifacts/12768437065), 4,281,632 bytes, available until 2026-11-10. The local copy is outputs/Relics-HABITS-001B-windows-x64.zip outside the repository. It contains relics.exe, dependency locks, build-info.json, executable checksum and launch note. Metadata confirmed the exact tested SHAs; ZIP/executable hashes were checked after download. ZIP SHA256: b036352eac7d6f6aee93274585cae77da7f5e9c2d004e8a2f5796f150130c776. EXE SHA256: 26b747b7564c642004f71b1201336878050a41bb4faa0a2f1274250731e7cc23. The executable was not launched here.

GitHub publication used the repository integration with expected-parent checks and no force-push/history rewrite. The local workspace tracks feature/habits-001b. The reviewed file list contains only feature source/tests, migration 2 and documentation; no private content, personal databases, credentials, logs or build artifacts were committed.

## Next step and boundaries

Next queued step: the owner/product reviewer executes [HABITS-001B acceptance](HABITS_001B.md): rename Guitar to Гитара with Разум + Восстановление, archive Чтение, inspect archive/history, restart offline, restore and log an unused past date. Close the old application, extract the new ZIP separately and run relics.exe; no local compilation/toolchain setup is required. Review before merging. Do not start WIN-LOG-001 or another feature automatically.

The current work does not launch the executable against owner data. Browser preview has no native SQLite bridge. The unsigned Windows x64 artifact requires WebView2. Older-executable downgrade compatibility after migration is unverified. [Task details](HABITS_001B.md) and [data model](DATA_MODEL.md) explain evidence limits.

## Persistent context

AGENTS.md and docs/ remain the source of truth. Calm offline-first life balance, five canonical spheres, immutable historical snapshots and no penalties for absence. One task at a time; ask early about consequential uncertainty. Russian reports, English technical documentation. private/ stays excluded and unread. Historical local EPERM/TLS/credential restrictions remain; use the GitHub integration and existing CI without requiring owner toolchain repair.
