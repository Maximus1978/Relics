# Data model

## Implemented TypeScript contract

`src/domain/activity.ts` currently defines `SphereId`, `Habit`, and `Activity`. `Habit` has `id`, `name`, an unweighted `spheres` array and nullable `archivedAt`. `Activity` has `id`, `habitId`, snapshot `habitName`/`spheres`, `occurredOn`, `recordedAt`, and `timezone`. These are scaffold types, not the complete target domain.

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

## HABITS-001B additions

Migration `002_archive_habits.sql`, version 2, adds nullable `habits.archived_at` and an archive index. Migration 1 stays byte-for-byte unchanged. Existing rows default to active; the native SQL plugin registers both migrations. Archive/restore only changes this flag; definition edits only change name/spheres. No operation rewrites activities. Startup seeding never updates existing IDs, including archived samples.

Repository queries distinguish active (default), archived and all habits. Logging atomically selects the current definition only from an active database row, rather than trusting UI state or stale objects. Conflict handling keeps one completion per habit/day; archived/missing habits are rejected. Names and sphere sets are snapshotted from SQLite at insertion. Parameter order follows SQLite binding occurrence order. Activity cancellation is unchanged. See [HABITS-001B](HABITS_001B.md) for tests and native acceptance limits.

## BACKUP-001 additions

BACKUP-001 introduces format v1 / migration level 3 with strict native validation and full replacement, not merging. [Backup contract, all fields, limits and recovery](BACKUP.md). Migration 003 only moves sample seeding to a one-time INSERT OR IGNORE; no user-data columns or gameplay tables change. Applied migrations 1/2 are untouched. Routine repository opening no longer seeds, so restored empty/subset datasets remain stable across restart. The plugin migration ledger is retained, not imported from JSON. Native SQLx transactions, historical snapshot preservation and temporary-database failure/reopen tests complement Node repository tests. Current cancellation semantics are unchanged. Progression/audit content is not invented for backup.

## Required model evolution, not implemented

| Entity / type | Responsibility |
| --- | --- |
| SphereContribution | Stable sphereId and configurable weight; normalization policy still open |
| HabitSchedule | Daily/scheduled/flexible recurrence; schedule versions; definition editing/archive/restore delivered separately in HABITS-001B |
| Activity + ActivityRevision / JournalEvent | Stable identity, local day, optional instant, recordedAt, timezone, historical contribution snapshot, correction/deletion audit |
| DayObservation | Explicit unknown, confirmed inactivity, or planned rest; missing data never implies failure |
| DiaryEntry | Optional note/reflection independent of required logging |
| Epoch | Stable epochId, worldId, start/end, optional museum snapshot; lifetime records retained |
| Discovery | Stable discovery/recipe/artifact IDs, first discovery time, content/rules versions, idempotent grant |
| ProgressProjection | Rebuildable lifetime/epoch Mastery, recent Resonance, Balance; evaluation time and rules version |
| WorldPack / ArtifactDefinition / RecipeDefinition | Versioned declarative content, with spoiler-aware packaging |
| BackupEnvelope evolution | v1 currently covers habits/activities; future persisted audit/discovery/epoch fields need explicit version adapters |

These types describe requirements; create executable types incrementally with their use cases. The epoch transition must preserve the original activity and recording metadata. Whether backdated activities affect closed epoch projections is an open policy.

## Future sync readiness

The current UUID activity IDs are useful but not sufficient. Plan revision IDs, deletion tombstones, origin metadata if needed, and conflict resolution before adding sync. Do not infer causal order from wall clocks alone. Habit/day uniqueness is a provisional single-completion rule, not a final cross-device merge policy.

## Migration and integrity rules

Use monotonic migration versions and preserve existing records. After an applied migration, evolve the schema using a new migration rather than rewriting the old one. Confirm actual deployment status before treating an unbuilt scaffold schema as deployed.

Test migration from an earlier database, weighted snapshots, scheduling boundaries, correction audit, rollback, uniqueness, and effective foreign-key enforcement when these behaviors are introduced. Export/import must preserve IDs, corrections, discoveries, and epoch boundaries; reject invalid input before replacing data. Schema design alone does not count as a tested restore feature.

## DOC-GAME-002 — accepted semantic boundaries, no schema changes

Habit Sigil is the user-facing identity of the existing Habit, not a new earned-artifact record or a schema rename. The current name/sphere/archive fields and historical activity snapshots remain unchanged. Future icon identity is independent of contributions; primary/secondary weights and per-activity intensity require separate contracts/additive migrations.

Unique Artifacts require stable authored definition identities and earned/discovered instance/grant references with provenance/versioning; they are not inferred from ordinary habit IDs or art. This is future ARTIFACT-001/discovery work. Collection is an earned-content view, Chronicle is real activity/reflection history, and Museum is retained artifact/story/epoch context. Navigation separation must preserve existing IDs/dates/snapshots/cancellation behavior.

The descriptive rune is a rebuildable projection, not stored progression. One all-five-sphere habit logged for seven days legitimately produces 35 distinct sphere-days; no automatic Balance diagnosis or large reward follows. BALANCE-001 must approve evaluation/context/weight/anti-grinding policy before numeric projections or Balance-linked grants.

Future vacation storage must support explicitly manual one-day/interval/until-ended intent, reopening and timezone/end semantics without synthetic activity rows or Mastery. Exact representation is open under LIFE-RHYTHM-001. Vacation is neither automatic Recovery nor evidence of physiological rest. Afterglow is cosmetic. Optional insights require explicit opt-in/preferences and dismissal/snooze/disable semantics; no autonomous mode mutation.

Future temporary Blessings need approved origin/identity/lifecycle/correction/version rules before persistence. Expiry must not erase permanent earned artifacts or mutate activities/Balance. Audio preferences require a reviewed mute/volume/default/persistence contract; no pack may override user choice.

These are modeling requirements, not implemented entities/columns/tables. Future additions require versioned additive migrations and explicit backup-format adapters preserving old records and IDs; no migration, backup format or one-completion-per-day change is made in DOC-GAME-002.
