# Roadmap

## Execution rule and current release

DOC-GAME-002 is complete: approved product decisions consolidated, owner-accepted STATE-001 released by regular merge of PR #6 at be2cd4e9fd5ecb90a34aae22e578e2c6f19939a9, with only Markdown changes after the tested implementation. The owner tested STATE-001 on Windows and accepted its functionality/current visual direction, four-state rune, independent daily stones and responsive technical layers. Preserve this implementation; art imperfections are non-blocking. HANDOFF records actual merge/evidence.

One task at a time. Active task: PROGRESS-001 REVISION, documentation-only. Owner accepted NAV-CHRONICLE-001 on Windows; PR #10 merged at 8503670a31b8adc74bac61b6a84826e6772664eb, matching freshly fetched master on 2026-10-30. Earlier NAV review/active statements are superseded. Contributions/trends/Chronicle are accepted and implemented, not queued features. Preserve history, backups, central rune and CI. [Canonical proposal](PROGRESS_001.md) and [Russian owner review](PROGRESS_001_REVIEW_RU.md). Do not implement or auto-merge this task.

Latest owner sequence: PROGRESS-001 → UI-COLLAPSE-001 → HABIT-RHYTHM-001 → HABIT-SIGILS-001 (including HABIT-ICONS-001) → PROGRESS-002A → PROGRESS-002B → ARCHIVE-CLEANUP-001 → AUDIO-001. This supersedes the now-completed WEIGHTS/trends/NAV queue; it is recommended scheduling, not authorization. Android remains deferred until Windows core mechanics validate and owner schedules it.

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

The PROGRESS-001 REVISION priority override above is authoritative; accepted completed prerequisites below are release history, and future scope is retained. Android remains an approved compatibility milestone after Windows core-mechanics validation. Every row below is a separately authorized future task, not work to begin now.

| Priority | Small task | Acceptance boundary / dependency |
| --- | --- | --- |
| Accepted | BACKUP-001 | Owner-accepted local export/full replacement/safety recovery; PR #5 merge 234c35a7be4306ba1fee082f01409122715e2846 |
| Accepted and merged; DOC-GAME-002 complete | SANCTUARY-STATE-001 | [PR #6](https://github.com/Maximus1978/Relics/pull/6). Clean independent RGBA frame/rune/stone, separate SVG signs and lighting, reference-only source board, alpha/overlay/stable-geometry proof and central-track scaling at 1920/2560. Temporal rules, schema, history and backups unchanged. Owner Windows functionality/current visuals accepted; exact CI/artifacts and actual authorized release state in HANDOFF |
| Accepted; PR #7 merged | WEIGHTS-001A | Define independent subjective 1–10 profile, legacy defaults/provenance, immutable event snapshots, additive storage and v1→v2 backup contract, reference UX and pure projection; no code. [Plan/test matrix](WEIGHTS_001A.md) |
| Owner accepted and merged PR #8 | WEIGHTS-001B | [PR #8](https://github.com/Maximus1978/Relics/pull/8): persistence/migration004, shared Create/Edit, atomic snapshots and native v1/v2 safety accepted on Windows; regular merge 293e7d20. Historical automated evidence in WEIGHTS_001B.md |
| Owner accepted and merged PR #9 | SPHERE-TRENDS-001 | Snapshot-only pure projection, absolute/relative modes, rolling7 days including today plus4/8 completed Monday weeks, interactive legend, table and default/excluded disclosure below inventory; no rune/schema/backup/navigation changes. [Contract/evidence](SPHERE_TRENDS_001.md). [PR #9](https://github.com/Maximus1978/Relics/pull/9), [Updated Windows CI](https://github.com/Maximus1978/Relics/actions/runs/40943769883) SUCCESS:73 Node/208 browser/22 native plus native EXE. Owner accepted on Windows; regular merge 39af6b78 |
| Owner accepted and merged PR #10 | NAV-CHRONICLE-001 | Dedicated Chronicle/snapshots/shared navigation delivered; owner Windows accepted, regular merge 8503670a31b8adc74bac61b6a84826e6772664eb verified. [Historical evidence](NAV_CHRONICLE_001.md):75 Node/282 browser/22 native and actual EXE; no current pending acceptance |
| Deferred until Windows core mechanics validated | ANDROID-001 | Approved shell/toolchain/device compatibility milestone retained; after contributions/trends Windows acceptance and owner scheduling, not an immediate prerequisite. No gameplay expansion |
| Deferred; after ANDROID-001 | ANDROID-LOG-001 | After ANDROID-001: existing create/edit/archive, logging/backdating, migration/reopen and lifecycle persistence; preserve history, report device evidence |
| Consolidated into PROGRESS-001 / PROGRESS-002B | SANCTUARY-STATE-002 | Independent ordinary-medal material/phase, recent light, selected-day check and interaction contract now in PROGRESS_001.md. Keep this traceable art/state requirement; existing central rune unchanged |
| Scoped within HABIT-SIGILS-001 | HABIT-ICONS-001 | Curated manual icon/default identity, independent from spheres/units/frequency/material; migration/backup and fixed center registration. No assets in current task |
| 4 | ACTIVITY-DETAILS-001A | Optional per-activity note with additive migration and legacy compatibility; not a habit field |
| 4 | ACTIVITY-DETAILS-001B | Optional per-activity intensity after scale/effect agreement; distinct from contribution weights; no forced entry |
| 4 | ACTIVITY-MODEL-001 | Small design/compatibility task for repeated sessions and quantities/units/identity; do not remove current uniqueness until a separately approved implementation |
| 5 specification gate | BALANCE-001 | Specify contextual sphere diversity, evaluation window, contribution weighting, anti-grinding and missing-data/life context; cover one-all-five-habit 35/35 case. No formulas/KPIs implemented. Required before numeric Balance or Balance-derived rewards |
| Current documentation review | PROGRESS-001 | [Revised canonical spec](PROGRESS_001.md): two Forging models, exact cycle/threshold/correction examples, layered medal/reference contract, minimal history/backup design and P01–P09 gates; numerical choices proposed, no runtime changes |
| Superseded split, scope retained | PROGRESS-002 | Replaced by separately reviewed pure engine PROGRESS-002A and data/visual integration PROGRESS-002B below; no large combined implementation |
| 6 prerequisite | AUDIT-001 | Auditable corrections and explicit consequences for resource/discovery grants before permanent rewards depend on mutable history |
| 6 prerequisite | WORLD-001 | Validate versioned declarative pack schema/loader, compatibility, safe component/effect vocabulary and public/closed boundary |
| 6 | ESSENCE-001 | Minimal thematic essence/material inventory and idempotent activity-derived accounting; approved yields/correction policy, no permanent-progress spending |
| 6 | DISCOVERY-001 | Bounded authored 2–3-element rule evaluation, stable versioned discovery grants and duplicate/correction tests using synthetic fixtures |
| 6 | ALCHEMY-UI-001 | Small working ingredient-selection/experiment/result UI after ESSENCE-001 and DISCOVERY-001; backed by real inventory/rules, never a fake screen |
| 6 | SANCTUARY-001 | Separately authorized spoiler-safe catalog integration; close one minimal real activity → essence → experiment → authored discovery → optional experience loop |
| 7 specification | BLESSINGS-001 | After approved progression/discovery contracts: define bounded optional temporary effect origins, duration/expiry, stacking, chance/safeguards and correction policy. Review before code; no XP multiplier, fake records or artificial Balance |
| 7 optional follow-up | BLESSINGS-002 | After BLESSINGS-001 approval and required origin/content services: implement one approved cosmetic temporary effect with expiry and persistence tests; defer hints/encounters to separate approved increments |
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

HABIT-RHYTHM-001 now covers the initial daily/three-per-week/weekly count intention. SCHEDULE-001 retains later explicit planned rest/inactivity and any separately approved weekday calendar; no weekday editor in MVP. The earlier vague flexible-frequency scope is superseded: spontaneous “Whenever I feel like it” habit frequency is explicitly deferred to a separate experience mechanism, not an obligation to log every moment. Further backup formats, notifications, widgets, cloud sync or optional AI integration need separate task cards and are not in the next-task queue.

Future art polish: optional alternate shrine silhouettes, refined gem optics, auxiliary/compact typography and fuller state/mobile visual capture. Shared base frames are appropriate for ordinary relics; reserve unique silhouettes/art for authored rare/legendary discoveries. The unique runic monogram and current visual direction were owner-accepted in STATE-001. None blocks the accepted Sanctuary release.

The current seven-day observations are not implemented Resonance/Mastery. Notes, intensity, repeated events, real progression, inventory, alchemy, rune/crafting/collection systems, optional experiences and world transitions are all unimplemented unless an accepted task above explicitly says otherwise. Preserve the versioned declarative World Pack architecture and finite authored discoveries.

## Accepted additional scope — future, independently testable tasks

These are approved directions, not implemented functionality or permission to begin. The immediate sequence is the PROGRESS-001 REVISION queue at the top; earlier WEIGHTS/trends/NAV milestones are accepted. Android waits for validated Windows mechanics; later scheduling still requires a new owner task.

| Task | Small acceptance boundary | Dependency / open contract |
| --- | --- | --- |
| HABIT-SIGILS-001 | Expanded owner-approved future scope: canonical six-material/three-phase ordinary medal family, manual curated HABIT-ICONS-001, compact card toggle/menu and planned «Печати привычек» label; first visual acceptance, then small persistence/backup/card increments | PROGRESS-001 P03/P09 and data contract; no live fake tiers before engine, no assets created now |
| LIFE-RHYTHM-001 | Vacation specification: manual one-day/interval/until-ended mode, optional logging, truthful stones/rune, restful aura and possible brief cosmetic afterglow; review timezone/expiry/persistence/defaults | Approved principles; open details, before implementation |
| LIFE-RHYTHM-002 | Persist approved manual mode and explicit start/end controls; additive migration/backup compatibility if needed; restart/end/cancel tests | LIFE-RHYTHM-001; no automatic activity, Recovery or Mastery |
| LIFE-RHYTHM-003 | Approved restful aura/afterglow using persisted mode; prove selected-day and seven-day states unaffected, accessible/reduced-motion alternative | LIFE-RHYTHM-002 and approved duration/art contract; optional permanent memories/discoveries remain later authored work |
| RHYTHM-INSIGHTS-001 | Opt-in contextual sustained-pattern suggestion spec, schedules/vacation/missing-data uncertainty, dismiss/snooze/disable, no autonomous switch; review synthetic cases | Approved principle; open observation/consent policy, after schedule/rhythm contracts; no single-missing-day inference |
| RHYTHM-INSIGHTS-002 | One approved suggestion and preference lifecycle with no-record/vacation/disabled regression tests | RHYTHM-INSIGHTS-001 and required schedule/rhythm data |
| AUDIO-001 | Specify local offline sound/event vocabulary, accessibility, mute/volume, preferences, default behavior and restrained playback; cover habit/gems/rune/discovery/alchemy/world themes | Approved scope; exact assets/defaults/persistence open, no sound generation now |
| AUDIO-002 | Small sound service/preferences and approved gentle UI/completion/gem/rune sounds; verify mute/volume/offline/restrained concurrency | AUDIO-001 and licensed/original local assets; safe persistence decision |
| AUDIO-003 | Add approved alchemy/discovery cues and distinct thematic World Pack sound mappings | AUDIO-002, actual discovery/alchemy features and validated World Pack audio contract |

HABIT-ICONS-001 remains the curated manual gallery/independent identity task. WEIGHTS-001A/B now use independent subjective 1–10 values, not primary/secondary normalized allocation; primary visual identity is a separate deferred choice, and per-activity intensity stays out of scope. They are not absorbed into a large Vacation/Adventure bundle.

## Non-blocking artwork backlog — accepted scope, not release criteria

| Task | Boundary / dependency |
| --- | --- |
| SHRINE-GEMS-001 | Enlarge shrine sphere gems/icons for readability; preserve shrine hierarchy, canonical identities and truthful selected-day states; actual desktop/narrow checks |
| SIGIL-FRAME-001 | Consistency polish for the reusable ordinary Habit Sigil frame; no invented rarity or unique reward shape |
| GEM-POLISH-001 | One reviewed gemstone-optics refinement with fixed geometry/state semantics; actual comparison before accepting |
| LIGHT-POLISH-001 | One bounded lighting/ornament refinement, preserve accepted four-state object and temporal behavior |
| ARTIFACT-001 (existing) | Unique authored silhouettes belong only to real earned/discovered artifacts, after content/rule identity exists |

Icon gallery/contribution identity are tracked above rather than duplicated. Existing optional shrine-silhouette, compact-typography and fuller mobile art capture remain non-blocking refinements. Do not restart accepted Sanctuary Gate A or STATE-001.

## Unimplemented scope and decision status

Accepted principles do not select numeric mechanics. Mastery/Resonance progression, numeric Balance, Blessings, vacation/insights, sound, notes/intensity/schedules, authored inventory/discovery/hidden recipes, rune collection, alchemy/crafting/customization, unique artifacts/awakening, optional reflections/microquests, Collection, World Pack selection, voluntary epochs and Museum are future tasks unless explicitly accepted as implemented above.

Keep Sanctuary, Clockwork, Wasteland and Verdant and versioned declarative packs. No fake gameplay screens, empty reward systems or exposed secret recipes. BALANCE-001 precedes numeric Balance KPIs/rewards; exact mechanics remain open in OPEN_QUESTIONS. Work Sprint Mode is outside this specification.

## PROGRESS-001 REVISION — small implementation gates, not authorization

| Order | Task | Scope and dependency |
| --- | --- | --- |
| 1 | PROGRESS-001 | Current documentation-only owner review; proposals P01–P09 must be decided explicitly before affected code |
| 2 | UI-COLLAPSE-001 | Independent inventory/analytics collapse, device-local preferences, visible essential actions, accessibility, chart/date/filter state retained; no SQLite just for preferences |
| 3 | HABIT-RHYTHM-001 | Approved frequency/effective dates and known archive intervals; atomic save; additive migration and strict older-backup import/export/recovery gates before editor release |
| 4 | HABIT-SIGILS-001 / HABIT-ICONS-001 | Owner visual gate on canonical registered medals/manual glyphs; small identity/persistence/backup/card increments, no invented live progression |
| 5 | PROGRESS-002A | Pure deterministic frequency-aware Mastery/Forging/Resonance and correction replay/candidate receipts; synthetic tests, no persistence/UI changes |
| 6 | PROGRESS-002B | Native idempotent permanent receipt/backup integration first; real material/phase/light/check states second; Windows owner acceptance |
| 7 | ARCHIVE-CLEANUP-001 | Hide unwanted archived habits, retain journal/analytics/FK and archived logging guard; genuine zero-history hard deletion only if separately approved |
| 8 | AUDIO-001 | Existing sound/world-theme specification scope retained; no audio assets or playback authorized now |

[Exact algorithms, examples, dependencies and P-T01–P-T20 future test matrix](PROGRESS_001.md). The previous0/7/21/50/120/250 milestones are provisional historical candidates, not runtime requirements. New0/3/9/18/36/72 cycles, phase checkpoints and interruption/Resonance formulas are recommendations for owner approval, not accepted values. No contribution multiplier, reward probability, essence yield or scientific automaticity threshold.

Preserve Vacation Mode/cosmetic afterglow, contextual opt-in Life Rhythm insights, Balance, essences, Alchemy, Blessings, authored unique Artifacts, Collection, Museum, voluntary epochs and optional Android. The versioned declarative World Packs remain Sanctuary, Clockwork, Wasteland and Verdant. Spontaneous experiences/microquests remain optional future authored opportunities; no sixth sphere, random infinite loot or duty to record every small activity. UI-COLLAPSE-001 is the next single recommended task after this review, never started automatically.
