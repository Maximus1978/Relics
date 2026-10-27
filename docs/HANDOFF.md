# Project handoff

Updated 2026-10-27. Active task: HABITS-001B — edit/archive/restore habits without losing historical activities. Deliver a focused PR and Windows artifact; do not merge automatically or start another task.

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

Publication, TypeScript/Vite/browser checks, native Windows build and artifact evidence are pending the existing Windows workflow. Record actual CI URLs/SHAs and download hashes here after completion; do not claim a native UI runtime pass from compilation alone. The pipeline/dependencies remain unchanged.

## Next step and boundaries

Complete the current PR/CI delivery, then have the owner/product reviewer execute [HABITS-001B acceptance](HABITS_001B.md): rename Guitar to Гитара with Разум + Восстановление, archive Чтение, inspect archive/history, restart offline, restore and log an unused past date. Review before merging. Do not start WIN-LOG-001 or another feature automatically.

The current work does not launch the executable against owner data. Browser preview has no native SQLite bridge. The unsigned Windows x64 artifact requires WebView2. Older-executable downgrade compatibility after migration is unverified. [Task details](HABITS_001B.md) and [data model](DATA_MODEL.md) explain evidence limits.

## Persistent context

AGENTS.md and docs/ remain the source of truth. Calm offline-first life balance, five canonical spheres, immutable historical snapshots and no penalties for absence. One task at a time; ask early about consequential uncertainty. Russian reports, English technical documentation. private/ stays excluded and unread. Historical local EPERM/TLS/credential restrictions remain; use the GitHub integration and existing CI without requiring owner toolchain repair.
