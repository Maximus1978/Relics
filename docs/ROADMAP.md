# Roadmap

## Execution rule

One task at a time. A milestone is a queue, not permission to implement its contents in one turn. Each task names one outcome, allowed changes, exclusions, and acceptance evidence. Complete or explicitly record a blocker, then hand off. Do not automatically start the next task, including after a blocker.

## Completed task: DOC-001 — align the foundation with the supplied brief

Scope: review requirements, consolidate canonical English documentation under `docs/`, record model/world requirements and implementation gaps, correct Resonance semantics, and preserve useful existing work.

Done when: required files exist, local document links resolve, sources and provisional choices are explicit, one-task rules are permanent, and the handoff states actual verification limits. No application code, migrations, dependency installation, gameplay implementation, or secret-catalog access belongs to this task.

Status: completed. Documentation checks passed; see HANDOFF.md for the current task.

## Completed CI recovery: BUILD-WIN-001 — Windows scaffold build in CI

Outcome: a reproducibly built Windows scaffold or one concrete diagnosed environment blocker. Scope: resolve dependencies, obtain lockfiles, typecheck/build, and perform the minimum Windows Tauri build/start check. Fix only issues preventing that result. Do not add product features or configure Android in the same task. Record exact evidence and stop.

The local attempt was BLOCKED by EPERM/TLS restrictions. GitHub-hosted recovery now passes: [run 40544697531](https://github.com/Maximus1978/Relics/actions/runs/40544697531) succeeded on tested head 24d5f5bb670e417bcaabfbe1d41fc6f12acfad66. Locked dependencies, all three tests, TypeScript, Vite, browser rendering and the actual Tauri release build passed; a downloadable Windows artifact exists. [PR #1](https://github.com/Maximus1978/Relics/pull/1) was merged into master at ae7c71db54a12583fd9a0e995fb461ca6635846e on the owner's instruction. See [CI evidence and artifact retrieval](WINDOWS_CI.md). The owner subsequently confirmed native launch and offline persistence of October 26/27 activity records. HABITS-001A is a separately authorized feature task; this baseline feedback does not establish the new form's native acceptance.

## Subsequent queue

HABITS-001A is accepted and merged in [PR #2](https://github.com/Maximus1978/Relics/pull/2) at 544d813f26f5b6a4be39d36a81bc4bb7c1feba3e. The owner verified native custom creation, multiple spheres, backdated activities and offline SQLite persistence. Historical build evidence: [run 40565215658](https://github.com/Maximus1978/Relics/actions/runs/40565215658), 12 tests and TypeScript/Vite/native Windows build passed.

## Accepted baseline: HABITS-001B

The owner accepted habit editing/archive/restore and merged [PR #3](https://github.com/Maximus1978/Relics/pull/3) at 8fc41b39d433fd1c9d26c71757580ae3a3567e77. Its 23 tests and TypeScript/Vite/native Windows build passed in [run 40577256811](https://github.com/Maximus1978/Relics/actions/runs/40577256811). [Historical delivery evidence](HABITS_001B.md) remains available.

## Active: SANCTUARY-UI-001 Visual Recovery — Gate A

The owner rejected the previous visual presentation, including the painterly backdrop iteration. Continue the same PR #4 without merging. The supplied VISUAL_CONTRACT v0.2 and original desktop TARGET now govern composition/art quality (~90% perceptual fidelity, with honest data/accessibility adaptations). Build actual five-shrine/central-circle RPG shell and inventory, provide 1440×900 / 1280×800 / 1000×800 / 390×844 / 320px screenshots and target/rejected/revised comparison, then stop for owner Gate A review before extensive Gate B polish. See [current handoff](HANDOFF.md). No later task is started.

## Historical technical delivery: SANCTUARY-UI-001 (visual acceptance rejected)

The owner requires the spirit/detail of the supplied prototypes or better and explicitly approved original raster environment art plus CSS/SVG controls. [PR #4](https://github.com/Maximus1978/Relics/pull/4) now delivers a bundled painterly Sanctuary, engraved materials and gemstone optics with preserved data behavior. [Windows run 40603575817](https://github.com/Maximus1978/Relics/actions/runs/40603575817) passed on 59481e388c37d665ef4eb1c5f595215788ec5d01: 25 tests, 36 browser checks, TypeScript/Vite and native release compilation. The [new Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40603575817/artifacts/12780441428) and [four screenshot/evidence views](https://github.com/Maximus1978/Relics/actions/runs/40603575817/artifacts/12778999481) were downloaded/verified and screenshots inspected. Later documentation-only evidence leaves runtime code unchanged. [Design, prompt/provenance, hashes and acceptance](SANCTUARY_DAILY_MODE.md). The SVG-only iterations are historical. Next queued step: owner/product visual and native offline review; no automatic merge or next feature. Green CI alone does not establish owner visual acceptance.

Original Sanctuary Daily Mode presentation, reusable sphere symbols/medallions, compact habit cards, Today/Yesterday/calendar, accessible expandable history and preserved management. Domain rules, SQLite, migrations, identity and gameplay are unchanged. Browser-only demo uses explicitly fictional ephemeral data. [PR #4](https://github.com/Maximus1978/Relics/pull/4) remains open/unmerged. [Windows run 40583750205](https://github.com/Maximus1978/Relics/actions/runs/40583750205) passed on cbd98965e851c6d30f20718a5ee5ea378cf978ee: 25/25 tests, TypeScript/Vite, 34 browser/keyboard/responsive checks and native Tauri release build. [Windows executable](https://github.com/Maximus1978/Relics/actions/runs/40583750205/artifacts/12772035041) and [desktop/mobile/journal screenshots](https://github.com/Maximus1978/Relics/actions/runs/40583750205/artifacts/12771015646) were downloaded/verified and screenshots inspected. A later documentation-only commit leaves the tested code unchanged. [Design, evidence and acceptance](SANCTUARY_DAILY_MODE.md). Next queued step: owner/product visual and native offline review, then await instructions. Do not merge automatically or begin another task.

| Order | Task | Acceptance focus |
| --- | --- | --- |
| 1 | WIN-LOG-001 | Offline logging/backdating, duplicate protection, restart persistence and cancellation in Windows |
| 2 | ANDROID-001 | Android toolchain and shell build/start, without feature expansion |
| 3 | ANDROID-LOG-001 | Same journal behavior, background/resume, touch/text on Android |
| 4 | AUDIT-001 | Auditable activity edits/removal with migration and correction tests |
| 5 | BACKUP-001 | JSON backup/restore, validation, atomicity, clean-database round trip |
| 6 | HABITS-001 | Creation accepted in HABITS-001A; edit/archive/restore isolated in HABITS-001B; further changes require authorization |
| 7 | WEIGHTS-001 | Decide and implement configurable multisphere contribution weights |
| 8 | SCHEDULE-001 | Daily/scheduled/flexible recurrence, rest, unknown versus confirmed inactivity |
| 9 | PROGRESS-001 | Decide and test pure deterministic lifetime/epoch progression and recent Resonance |
| 10 | WORLD-001 | Validated versioned World Pack and SVG component foundation |
| 11 | DISCOVERY-001 | Constrained 2–3-element recipe evaluation and idempotent discovery persistence using synthetic content |
| 12 | SANCTUARY-001 | Separately authorized curated content and spoiler-aware integration |
| 13 | EPOCH-001 | Voluntary transition, museum, retained lifetime journal and non-destructive tests |

Each queued item must be narrowed if it cannot fit one reviewable task. Optional diary, microquests, detailed Adventure Mode, advanced crafting, new worlds, notifications, widgets, sync, and ChatGPT integration need separate task cards. There is no required cloud backend in the foundation.

## Vertical slice acceptance boundary

The initial three-habit demo defines “log, close, return”: today/past date, multiple spheres, no duplicate, journal, restart without network, cancellation. The owner accepted native Windows HABITS-001B; Android and the new Sanctuary presentation acceptance are separate. See [acceptance scenarios](ACCEPTANCE.md). Scheduling, weights, corrections audit, derived progression, and backups are explicitly missing.
