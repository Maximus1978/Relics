# Data model

## Implemented TypeScript contract

`src/domain/activity.ts` currently defines `SphereId`, `Habit`, and `Activity`. `Habit` has `id`, `name`, and an unweighted `spheres` array. `Activity` has `id`, `habitId`, snapshot `habitName`/`spheres`, `occurredOn`, `recordedAt`, and `timezone`. These are scaffold types, not the complete target domain.

## Implemented SQLite schema

Migration `src-tauri/migrations/001_initial.sql`, version 1:

| Table | Stored data | Constraints |
| --- | --- | --- |
| habits | id, name, spheres_json | Primary key; nonempty name; valid nonempty JSON |
| activities | id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone | Primary key; declared habit reference; unique habit/day; JSON/date-shape checks |

An index orders activities by day/time. Calendar validity and future-date rejection are checked in the domain. The SQL date check validates shape only. JSON checks do not fully validate sphere membership or contribution weights. A declared SQLite foreign key requires per-connection enforcement; the current bridge has not been verified for this. Tests currently exercise real Node SQLite, not native plugin connections.

One INSERT is atomic. Duplicate habit/day insertion does nothing. Demo habits use INSERT OR IGNORE. Snapshot fields preserve past meaning when habit definitions change. Cancellation currently deletes an activity; this is insufficient for audit and synchronization.

## HABITS-001A additions

The repository now creates habits with a UUID, trimmed nonempty name and one or more canonical sphere IDs, and lists persisted habits by SQLite rowid insertion order. The UI loads that list instead of rendering a hardcoded array. Sphere sets are unweighted and stored in the existing JSON column; no schema change or rewrite of migration 1 is needed. Names remain non-unique display values.

Startup inserts only missing sample IDs and never updates definitions. Tests use the same repository methods/queries with a real Node SQLite adapter, including reopen compatibility with legacy activity rows. [HABITS_001A.md](HABITS_001A.md) records behavior, coverage and the native acceptance boundary.

## Required model evolution, not implemented

| Entity / type | Responsibility |
| --- | --- |
| SphereContribution | Stable sphereId and configurable weight; normalization policy still open |
| Habit + HabitSchedule | Editable definition, archivedAt, restoration; daily/scheduled/flexible recurrence; schedule versions |
| Activity + ActivityRevision / JournalEvent | Stable identity, local day, optional instant, recordedAt, timezone, historical contribution snapshot, correction/deletion audit |
| DayObservation | Explicit unknown, confirmed inactivity, or planned rest; missing data never implies failure |
| DiaryEntry | Optional note/reflection independent of required logging |
| Epoch | Stable epochId, worldId, start/end, optional museum snapshot; lifetime records retained |
| Discovery | Stable discovery/recipe/artifact IDs, first discovery time, content/rules versions, idempotent grant |
| ProgressProjection | Rebuildable lifetime/epoch Mastery, recent Resonance, Balance; evaluation time and rules version |
| WorldPack / ArtifactDefinition / RecipeDefinition | Versioned declarative content, with spoiler-aware packaging |
| BackupEnvelope | Schema/version, export metadata, validated entities and audit history |

These types describe requirements; create executable types incrementally with their use cases. The epoch transition must preserve the original activity and recording metadata. Whether backdated activities affect closed epoch projections is an open policy.

## Future sync readiness

The current UUID activity IDs are useful but not sufficient. Plan revision IDs, deletion tombstones, origin metadata if needed, and conflict resolution before adding sync. Do not infer causal order from wall clocks alone. Habit/day uniqueness is a provisional single-completion rule, not a final cross-device merge policy.

## Migration and integrity rules

Use monotonic migration versions and preserve existing records. After an applied migration, evolve the schema using a new migration rather than rewriting the old one. Confirm actual deployment status before treating an unbuilt scaffold schema as deployed.

Test migration from an earlier database, weighted snapshots, scheduling boundaries, correction audit, rollback, uniqueness, and effective foreign-key enforcement when these behaviors are introduced. Export/import must preserve IDs, corrections, discoveries, and epoch boundaries; reject invalid input before replacing data. Schema design alone does not count as a tested restore feature.
