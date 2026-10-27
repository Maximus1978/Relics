# Architecture

## Selected direction and validation boundary

Use Tauri 2, React, strict TypeScript, Vite, SQLite, and SVG components. Share domain logic and reusable presentation primitives; provide platform-specific interactions/adapters. No first-iteration cloud backend. The journal is authoritative; counters and progression are rebuildable projections.

Official documentation reviewed on 2026-10-26 lists Windows/Android support for the [SQL plugin](https://v2.tauri.app/plugin/sql/), describes migration transactions and explicit permissions, and specifies Windows/mobile [build prerequisites](https://v2.tauri.app/start/prerequisites/). This supports the proposed direction. Local execution remained restricted, but [GitHub-hosted Windows CI](WINDOWS_CI.md) now verifies dependency resolution, tests, frontend rendering/build, and native Tauri release compilation. Native UI/SQLite runtime acceptance is still pending. See [historical feasibility findings](TECHNOLOGY_FEASIBILITY.md).

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
- `src/App.tsx`: demonstration logging, date selection, journal, cancellation.
- `src-tauri/migrations/001_initial.sql`: initial tables; `src-tauri/src/lib.rs` registers the migration.
- `content/sanctuary/manifest.json`: public epoch metadata, not a complete validated World Pack.
- `tests/activity.test.ts`: date tests and real SQLite integrity scenarios via Node.

The current screen still coordinates use cases directly with the concrete adapter. A repository port and pure application service should be extracted in a dedicated task when expanding behavior. Schedules, weighted contributions, projections, audit events, backup/restore, and World Pack validation are not implemented.

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

JSON backup/restore is required before trusting the app with long-term personal data. Define schema versions, validate the entire import, preserve stable IDs/history, apply atomically, and test restoration to a clean database. Backup is not device synchronization. File selection and export require platform-specific adapters; their runtime behavior is not verified yet.

Only local application content should receive SQL capabilities. Current SQL execute permission is broad; do not load remote pages into its privileged window. Do not log journal text or hidden content. Keep databases and secret packages outside Git. Node SQLite tests do not validate the Tauri bridge, Android lifecycle, or actual application storage locations.
