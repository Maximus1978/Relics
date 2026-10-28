# Architecture

## Selected direction and validation boundary

Use Tauri 2, React, strict TypeScript, Vite, SQLite, and SVG components. Share domain logic and reusable presentation primitives; provide platform-specific interactions/adapters. No first-iteration cloud backend. The journal is authoritative; counters and progression are rebuildable projections.

Official documentation reviewed on 2026-10-26 lists Windows/Android support for the [SQL plugin](https://v2.tauri.app/plugin/sql/), describes migration transactions and explicit permissions, and specifies Windows/mobile [build prerequisites](https://v2.tauri.app/start/prerequisites/). Local execution remained restricted, but [GitHub-hosted Windows CI](WINDOWS_CI.md) verifies dependency resolution, tests, frontend rendering/build and native Tauri release compilation. The owner accepted native Windows/SQLite behavior through HABITS-001B, merged at 8fc41b39d433fd1c9d26c71757580ae3a3567e77. The new Sanctuary presentation and Android runtime acceptance are separate. See [historical feasibility findings](TECHNOLOGY_FEASIBILITY.md).

## Boundaries and data flow

```text
Daily / Adventure presentation
    -> application use cases
    -> typed domain rules + journal repository port
    -> local SQLite adapter through Tauri
    -> authoritative journal
    -> deterministic projections -> presentation

Versioned World Pack -> validated presentation/content adapters
Closed discovery package -> constrained rule evaluator
Platform adapters -> file backup/restore, optional future widgets
```

Domain rules cannot depend on React, Tauri, SQL, or theme artwork. Application use cases coordinate validation and atomic writes. Persistence owns SQL and DTO mapping. Content is declarative/versioned and cannot execute arbitrary code. World-specific presentation reuses activity, discovery, and progression services.

## Existing scaffold

- `src/domain/activity.ts`: typed habits/activities, sphere IDs, date validation, local-day helper.
- `src/data/activityRepository.ts`: SQL plugin adapter and snapshot mapping.
- `src/App.tsx`: small Sanctuary composition/navigation root. `src/application/useRelicsModel.ts` reuses existing habit/logging state and repository callbacks separately from presentation.
- `src/components/`, `src/ui/sanctuary/`: shared validated habit controls, local-calendar helpers, shrine installation/wheel, relic inventory, Chronicle and native modal; scoped component styles and reusable design tokens.
- `src/domain/recentActivity.ts`: pure, read-only current-seven-local-calendar-day projection; `selectedDayActivity.ts` independently projects saved daily spheres/completed habit IDs. `application/useLocalDay.ts` refreshes the current calendar anchor at midnight/focus/visibility. Neither projection persists derived states. `ui/sanctuary/SphereGem.tsx` and `SanctuaryRune.tsx` isolate Sanctuary material/monogram presentation; see [state contract](SANCTUARY_STATES.md).
- `src/preview/sanctuaryPreview.ts`: browser-only fictional in-memory fixture; dynamically selected outside Tauri, explicitly labeled and reset on reload, with no persistent storage or SQLite access.
- `public/art/recovery/v1/`: versioned local WebP environment, transparent shrine/wheel/pendant bases and hash manifest; approximately 810KB total. Original environment PNG retained as source; other masters outside Git. Real labels/controls remain HTML/SVG. [Prompts/provenance](art/VISUAL_RECOVERY.md).
- `src-tauri/migrations/001_initial.sql` and `002_archive_habits.sql`: tables and additive habit archive field; `src-tauri/src/lib.rs` registers both migrations.
- `content/sanctuary/manifest.json`: public epoch metadata, not a complete validated World Pack.
- `tests/activity.test.ts`: date tests and real SQLite integrity scenarios via Node.

The current application hook still coordinates use cases directly with the concrete adapter. A repository port and pure application service should be extracted in a dedicated task when expanding behavior. Schedules, weighted contributions, game progression projections, audit events and World Pack validation are not implemented. The read-only recorded-day projection is present; native Windows backup/restore is owner-accepted and merged in PR #5 at 234c35a7be4306ba1fee082f01409122715e2846; STATE-001 preserves its service and capabilities.

## Intended directory structure

```text
README.md, AGENTS.md
docs/                     persistent specification and handoff
src/domain/               pure models, policies, projections
src/application/          future use cases and ports
src/data/                 SQLite adapter and mapping
src/platform/             future platform-specific adapters
src/ui/                   future reusable components and mode views
src/App.tsx               current small composition root
src-tauri/                native shell, capabilities, migrations
content/<world>/          public versioned world content
tests/                    synthetic domain/storage fixtures
private/                  ignored author-only package, not scanned
```

Future directories are design guidance, not a request to create empty frameworks now.

## Persistence, time, and corrections

Keep stable event, habit, epoch, recipe, and artifact IDs. Store the selected local day separately from UTC recording time and IANA timezone. Preserve historical contributions and names using snapshots. A future schedule change must not silently rewrite history.

Corrections/removals should append auditable changes or retain revisions/tombstones, with an atomic projection update. The scaffold currently deletes rows, a recorded gap. Deferred synchronization needs stable IDs, revisions, tombstones, and an explicit conflict policy; it does not need a backend now. See [data model](DATA_MODEL.md).

## Backup and security

BACKUP-001 implements native Windows JSON export/preview/full replacement in src-tauri/src/backup, using the existing SQL plugin pool and one pinned SQLx transaction. Four explicitly allowed main-window commands choose files through native Rust dialogs, never caller-provided paths. Synced atomic file publication, retained protective JSON before deletion, strict validation and migration-level compatibility are documented in [BACKUP](BACKUP.md). Additive migration 3 seeds defaults only once; live file identity/migrations 1–2 stay intact. Native tests use temporary databases, including rollback and process crash. Owner native dialog/offline acceptance remains separate; this is not synchronization.

Only local application content should receive SQL capabilities. Current SQL execute permission is broad; do not load remote pages into its privileged window. Do not log journal text or hidden content. Keep databases and secret packages outside Git. Node SQLite tests do not validate the Tauri bridge, Android lifecycle, or actual application storage locations.
