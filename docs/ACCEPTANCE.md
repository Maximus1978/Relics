# Logging slice acceptance

These scenarios describe the existing scaffold. Run only the subset belonging to the selected task; Windows acceptance and Android acceptance are separate queued tasks.

## Automated evidence

Existing npm test scenarios cover strict calendar validation, a local calendar helper, multiple sphere snapshots, initial SQLite migration, duplicate protection, snapshots after habit definition changes, cancellation and persistence after reopening SQLite. They use Node SQLite, not the native bridge. npm run build still needs successful dependency installation.

## Per-platform scenarios

1. Disconnect the network. Start with a clean test database; demo habits appear without an account.
2. Record today twice: exactly one habit/day entry.
3. Select yesterday and record the habit with two spheres; verify the date and both sphere labels.
4. Fully close and reopen offline: records remain.
5. Cancel yesterday's entry and restart: it stays removed.
6. Reject empty, impossible and future dates. Check local calendar behavior near midnight and across timezone changes.
7. In the separate Windows task, check keyboard/focus and text scaling. In the separate Android task, check touch, small screen, safe area, and background/resume.
8. On a disposable test database, simulate storage failure: no false success; retry after restoring access.
9. Return after an absence: no penalty, debt, destructive reset, or catch-up demand.

Never use personal data for corruption/failure testing. Record platform, date, commands and observations in HANDOFF.md.

## Later feature acceptance

With their individual implementations, add focused tests for corrections audit/backdating, habit schedules/rest/day states, weighted contributions, lifetime versus epoch projections, non-destructive transitions, deterministic recipe evaluation, idempotent discovery grants, migration integrity, and JSON backup/restore. These systems are not covered by the current three tests.
