# Roadmap

## Execution rule

One task at a time. A milestone is a queue, not permission to implement its contents in one turn. Each task names one outcome, allowed changes, exclusions, and acceptance evidence. Complete or explicitly record a blocker, then hand off. Do not automatically start the next task, including after a blocker.

## Completed task: DOC-001 — align the foundation with the supplied brief

Scope: review requirements, consolidate canonical English documentation under `docs/`, record model/world requirements and implementation gaps, correct Resonance semantics, and preserve useful existing work.

Done when: required files exist, local document links resolve, sources and provisional choices are explicit, one-task rules are permanent, and the handoff states actual verification limits. No application code, migrations, dependency installation, gameplay implementation, or secret-catalog access belongs to this task.

Status: completed. Documentation checks passed; see HANDOFF.md. No implementation task is active.

## Completed CI recovery: BUILD-WIN-001 — Windows scaffold build in CI

Outcome: a reproducibly built Windows scaffold or one concrete diagnosed environment blocker. Scope: resolve dependencies, obtain lockfiles, typecheck/build, and perform the minimum Windows Tauri build/start check. Fix only issues preventing that result. Do not add product features or configure Android in the same task. Record exact evidence and stop.

The local attempt was BLOCKED by EPERM/TLS restrictions. GitHub-hosted recovery now passes: [run 40544697531](https://github.com/Maximus1978/Relics/actions/runs/40544697531) succeeded on tested head 24d5f5bb670e417bcaabfbe1d41fc6f12acfad66. Locked dependencies, all three tests, TypeScript, Vite, browser rendering and the actual Tauri release build passed; a downloadable Windows artifact exists. [PR #1](https://github.com/Maximus1978/Relics/pull/1) was merged into master at ae7c71db54a12583fd9a0e995fb461ca6635846e on the owner's instruction. See [CI evidence and artifact retrieval](WINDOWS_CI.md). Native UI launch/inspection remains pending; the next recommended step is to inspect the downloaded executable before WIN-LOG-001. No later task has begun.

## Subsequent queue

| Order | Task | Acceptance focus |
| --- | --- | --- |
| 1 | WIN-LOG-001 | Offline logging/backdating, duplicate protection, restart persistence and cancellation in Windows |
| 2 | ANDROID-001 | Android toolchain and shell build/start, without feature expansion |
| 3 | ANDROID-LOG-001 | Same journal behavior, background/resume, touch/text on Android |
| 4 | AUDIT-001 | Auditable activity edits/removal with migration and correction tests |
| 5 | BACKUP-001 | JSON backup/restore, validation, atomicity, clean-database round trip |
| 6 | HABITS-001 | Create/edit/archive/restore, stable IDs and historical snapshots |
| 7 | WEIGHTS-001 | Decide and implement configurable multisphere contribution weights |
| 8 | SCHEDULE-001 | Daily/scheduled/flexible recurrence, rest, unknown versus confirmed inactivity |
| 9 | PROGRESS-001 | Decide and test pure deterministic lifetime/epoch progression and recent Resonance |
| 10 | WORLD-001 | Validated versioned World Pack and SVG component foundation |
| 11 | DISCOVERY-001 | Constrained 2–3-element recipe evaluation and idempotent discovery persistence using synthetic content |
| 12 | SANCTUARY-001 | Separately authorized curated content and spoiler-aware integration |
| 13 | EPOCH-001 | Voluntary transition, museum, retained lifetime journal and non-destructive tests |

Each queued item must be narrowed if it cannot fit one reviewable task. Optional diary, microquests, detailed Adventure Mode, advanced crafting, new worlds, notifications, widgets, sync, and ChatGPT integration need separate task cards. There is no required cloud backend in the foundation.

## Vertical slice acceptance boundary

The existing three-habit demo defines “log, close, return”: today/past date, multiple spheres, no duplicate, journal, restart without network, cancellation. Domain/SQLite tests passed previously; native Windows/Android acceptance has not. See [acceptance scenarios](ACCEPTANCE.md). Scheduling, weights, corrections audit, derived progression, and backups are explicitly missing, not implied by the demo.
