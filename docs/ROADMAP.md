# Roadmap

## Execution rule and current release

Current authorized task is SANCTUARY-STATE-001 on feature/sanctuary-state-001 from verified master 234c35a7be4306ba1fee082f01409122715e2846. BACKUP-001 is owner-accepted and PR #5 is merged. Selected-day gemstones and a current-seven-day Sanctuary monogram are delivered for owner review; see [state contract](SANCTUARY_STATES.md) and [handoff](HANDOFF.md). No automatic merge or next task.

One task at a time. Every later row is a queue, not authorization. Preserve existing data, native backups and Windows CI. Stop for owner visual/native acceptance after this delivery.

## Accepted foundation

| Milestone | Evidence |
| --- | --- |
| DOC-001 | Persistent specification and one-task process established |
| BUILD-WIN-001 | Windows CI, reproducible locks and native launch; PR #1 merge ae7c71db54a12583fd9a0e995fb461ca6635846e; owner verified offline activity persistence |
| HABITS-001A | Custom multisphere habits; PR #2 merge 544d813f26f5b6a4be39d36a81bc4bb7c1feba3e; owner accepted |
| HABITS-001B | Edit/archive/restore with preserved history; PR #3 merge 8fc41b39d433fd1c9d26c71757580ae3a3567e77; owner accepted |
| SANCTUARY-UI-001 | Owner-approved five-shrine/central-circle shell, pendant inventory and modal management; [PR #4](https://github.com/Maximus1978/Relics/pull/4); [runtime run 40619945699](https://github.com/Maximus1978/Relics/actions/runs/40619945699) passed 31 tests, TypeScript/Vite, 40 browser checks and native Tauri build |

Earlier rejected visual iterations are historical, not outstanding blockers. Final release-head CI and actual merge result are recorded in PR #4 checks/timeline. [HANDOFF](HANDOFF.md) distinguishes accepted implementation from the queue below.

## Accepted data safety: BACKUP-001

Deliver one bounded Windows vertical slice: explicit local export and restore of a versioned backup containing current habit definitions, sphere sets, archive state, activities and historical snapshots/metadata. Preserve IDs and dates. Validate format/version/relationships before any write; use atomic restore with safe rollback. Invalid, unsupported or interrupted restore must leave the original data intact. Verify a clean-database round trip and reopening with temporary databases, plus compatibility with existing records.

The owner has now authorized full replacement only, with validated summary and explicit confirmation, plus recoverable safety JSON before mutation. Format v1/migration level 3 and native dialog/transaction design are documented in BACKUP.md (D041–D043). Scope remains existing persisted data; no progression or secret catalog is invented for backup. Further formats, scheduling or encryption need separate tasks. BACKUP-001 was accepted and merged; its native service and format are unchanged by STATE-001.

## Ordered implementation priorities

The owner's priority order is authoritative. The early Android checkpoint is cross-platform risk reduction, inserted before complex migrations/game systems become large. Every row below is a separately authorized future task, not work to begin now.

| Priority | Small task | Acceptance boundary / dependency |
| --- | --- | --- |
| Accepted | BACKUP-001 | Owner-accepted local export/full replacement/safety recovery; PR #5 merge 234c35a7be4306ba1fee082f01409122715e2846 |
| Delivered; owner review pending | SANCTUARY-STATE-001 | [PR #6](https://github.com/Maximus1978/Relics/pull/6), [Windows run 40743447439](https://github.com/Maximus1978/Relics/actions/runs/40743447439) PASS on b272011d39a97f3d6b73aaf3261391464649eddf: 38 Node / 92 browser / 16 native tests, TypeScript/Vite and Windows EXE. Selected-day gems, original recent-period monogram, no schema/gameplay expansion; do not merge automatically |
| 2 | SANCTUARY-STATE-002 | Specify and review independent daily / gradual Resonance / permanent Mastery visual layers; synthetic developer fixtures only until real projections exist; no invented runtime energy |
| Early platform gate | ANDROID-001 | Android toolchain/CI shell build and device launch with existing SQLite/UI; no new gameplay |
| Early platform gate | ANDROID-LOG-001 | Existing logging/backdating, management, migration/reopen and lifecycle compatibility on Android; after ANDROID-001 and before the complete game loop |
| 3 | HABIT-ICONS-001 | Small curated icon picker and independent persisted habit icon identity; safe migration/defaults and existing history intact |
| 3 | WEIGHTS-001A | Decide primary-sphere semantics, optional secondary weights, defaults/normalization and snapshot/version compatibility; review contract before storage changes |
| 3 | WEIGHTS-001B | Persist/edit the approved contribution model through additive migration; preserve historical meaning, separate from icon and activity intensity; after WEIGHTS-001A |
| 4 | ACTIVITY-DETAILS-001A | Optional per-activity note with additive migration and legacy compatibility; not a habit field |
| 4 | ACTIVITY-DETAILS-001B | Optional per-activity intensity after scale/effect agreement; distinct from contribution weights; no forced entry |
| 4 | ACTIVITY-MODEL-001 | Small design/compatibility task for repeated sessions and quantities/units/identity; do not remove current uniqueness until a separately approved implementation |
| 5 | PROGRESS-001 | Agree/version pure Mastery, Resonance and thematic essence contracts, evaluation time, no-absence-loss and anti-grind/correction policies; use synthetic examples |
| 5 | PROGRESS-002 | Implement tested Mastery/Resonance projections and durable evolution semantics without losing history; integrate real visual layers from STATE-002 |
| 6 prerequisite | AUDIT-001 | Auditable corrections and explicit consequences for resource/discovery grants before permanent rewards depend on mutable history |
| 6 prerequisite | WORLD-001 | Validate versioned declarative pack schema/loader, compatibility, safe component/effect vocabulary and public/closed boundary |
| 6 | ESSENCE-001 | Minimal thematic essence/material inventory and idempotent activity-derived accounting; approved yields/correction policy, no permanent-progress spending |
| 6 | DISCOVERY-001 | Bounded authored 2–3-element rule evaluation, stable versioned discovery grants and duplicate/correction tests using synthetic fixtures |
| 6 | ALCHEMY-UI-001 | Small working ingredient-selection/experiment/result UI after ESSENCE-001 and DISCOVERY-001; backed by real inventory/rules, never a fake screen |
| 6 | SANCTUARY-001 | Separately authorized spoiler-safe catalog integration; close one minimal real activity → essence → experiment → authored discovery → optional experience loop |
| 7 | COLLECTION-001 | Browse/filter earned collection content with honest empty/locked states and no undiscovered spoilers |
| 7 | RUNE-001 | Authored rune discovery/collection and approved effects; bounded rules, not random infinite loot |
| 7 | CRAFT-001 | Minimal crafting UI/service with approved renewable-resource costs and non-destructive transactions |
| 7 | CUSTOMIZE-001 | Artifact customization separate from habit identity/contributions, with persisted reversible cosmetic choices |
| 7 | ARTIFACT-001 | Small individually authored rare/legendary artifact set, unique shapes/art and versioned effect/content validation |
| 7 | AWAKEN-001 | Artifact awakening / optional new experiences; no compulsory quest or daily requirement |
| 7 | REFLECTION-001 | Optional reflection capture independent of required logging, safely persisted |
| 7 | MICROQUEST-001 | Optional authored microquests/experiences that can be ignored without penalty |
| 8 | WORLD-SELECT-001 | Honest world selection for Sanctuary, Clockwork, Wasteland and Verdant; only installed/compatible worlds selectable |
| 8 | EPOCH-001 | Voluntary transition, explicit lifetime preservation, museum snapshot and safe backdate/transfer policy |
| 8 | MUSEUM-001 | Browse previous-world journeys while retaining the common lifetime journal and compatible historical assets |

Dependencies may require a smaller split within the same priority. No formula, cost, real secret recipe or release date is approved merely by this table. Minimum loop work in priority 6 is distinct from the expanded collection/crafting/awakening scope in priority 7.

## Deferred independent work and accepted art backlog

SCHEDULE-001 covers flexible recurrence, planned rest and explicit inactivity, separately from repeated-event modeling. Further backup formats, notifications, widgets, cloud sync or optional AI integration need separate task cards and are not in the next-task queue.

Future art polish: optional alternate shrine silhouettes, refined gem optics, auxiliary/compact typography and fuller state/mobile visual capture. Shared base frames are appropriate for ordinary relics; reserve unique silhouettes/art for authored rare/legendary discoveries. The unique runic monogram is delivered for owner review in STATE-001. None blocks the accepted Sanctuary release.

The current seven-day observations are not implemented Resonance/Mastery. Notes, intensity, weights, repeated events, real progression, inventory, alchemy, rune/crafting/collection systems, optional experiences and world transitions are all unimplemented unless an accepted task above explicitly says otherwise. Preserve the versioned declarative World Pack architecture and finite authored discoveries.
