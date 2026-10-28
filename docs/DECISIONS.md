# Decision log

Updated 2026-10-27. `accepted`: owner requirement; `provisional`: reversible scaffold choice; `open`: unresolved; `superseded`: retained for traceability. New choices must state scope and evidence.

| ID | Status | Decision |
| --- | --- | --- |
| D001 | accepted | Offline first; local SQLite source of truth; no required account/server. |
| D002 | accepted | Windows 11 + Android; Tauri 2, React, TypeScript, Vite, SQLite, SVG visual system. Windows native/SQLite baseline is owner-accepted through HABITS-001B; Android verification remains separate. |
| D003 | accepted | Body, Mind, Bonds, Work, Recovery; stable IDs remain body, mind, relationships, work, recovery. Configurable multisphere weights required. |
| D004 | accepted | Today/backdating, editing/removal, optional notes/reflection; no punishment for absence. |
| D005 | superseded | Earlier foundation described Resonance as cross-sphere coherence. The supplied brief clarifies this; use D020. |
| D006 | accepted | Finite authored catalog and surprise; validated 2–3-element recipes, free basic experimentation, constrained effects. |
| D007 | accepted | Diary, microquests, and reflections optional. |
| D008 | accepted | Voluntary epochs, museum, independent lifetime/season projections, retained lifetime history. |
| D009 | accepted | Original dark gothic Sanctuary first; concepts are art references, not final UX. |
| D010 | accepted | Secret names, conditions, and definitions separate from routine context; local source access cannot guarantee secrecy. |
| D011 | provisional | Scaffold has one completion per habit/day; idempotent duplicate handling; no future completions. Repeated sessions remain open. |
| D012 | provisional | Snapshots plus local day, UTC recording time, IANA timezone; later weights/revisions require migration. |
| D013 | provisional | Tauri SQL plugin adapter; owner accepted the Windows baseline through HABITS-001B. Browser preview is labeled fictional in-memory data, never a localStorage replacement for native persistence. New UI native acceptance remains separate. |
| D014 | provisional | Existing cancellation physically deletes rows. This is an audit/sync gap to replace in AUDIT-001; no implied compliance. |
| D015 | open | Formula units, time windows, weight normalization, thresholds, bonuses. |
| D016 | open | Essence inventory, advanced crafting costs, correction effects on discoveries. |
| D017 | open | Real authored recipes unavailable; closed slot remains empty. |
| D018 | open | Epoch resource transfer, historical corrections, museum snapshot/content retention. |
| D019 | open | Detailed recurrence, quantities, diary model, backup/import and sync conflict policies. |
| D020 | accepted | Resonance = recent participation/current sphere energy; may fade. Mastery/earned permanent achievements never decay due to absence. Balance describes diversity, not personal worth. |
| D021 | accepted | Separate calm Daily Mode and optional rich Adventure Mode; full collections/crafting access on Android. |
| D022 | accepted | Habit create/edit/archive/restore; daily/scheduled/flexible recurrence; planned rest and confirmed inactivity distinct from unknown. |
| D023 | accepted | Journal is authoritative; audit meaningful changes where practical; JSON backup/restore required for reliable long-term use. |
| D024 | accepted | Versioned declarative World Packs; reusable SVG common artifacts, authored rare artwork; no arbitrary pack code. |
| D025 | accepted | Communicate progress in Russian; English identifiers and technical documentation; Russian localized UI may remain. Canonical specification lives under docs/. |
| D026 | accepted | One task at a time. No automatic next task, parallel feature work, or replacement work after a blocker. |
| D027 | provisional | BUILD-WIN-001 recovery uses read-only GitHub-hosted Windows CI and a reviewable PR; Node 22.23.4/Rust 1.99.1 pin versions observed on the first run. Native build success does not imply native UI runtime acceptance. |
| D028 | accepted | HABITS-001A creates habits with unweighted canonical sphere sets using the existing SQLite schema. Preserve migration 1, sample IDs, one completion per habit/day and activity snapshots; defer editing/archive/schedules/weights. |
| D029 | accepted | HABITS-001B edits names/unweighted sphere sets and archives/restores any habit with additive migration 2. Keep migration 1, IDs, database/app identity and historical snapshots unchanged. Only active database rows can supply new activity snapshots, enforced atomically in the repository. Archive confirmation explains preserved history; sample seeding never reactivates records. Cancellation/audit remains D014. Deliver a PR for review; do not merge automatically. |
| D030 | accepted | SANCTUARY-UI-001 introduces original CSS/SVG Daily Mode, five labeled gemstone identities, reusable decorative medallions, date shortcuts and expandable history. No earned tiers/scores, domain/SQLite or progression changes. Browser visual testing uses labeled in-memory fixtures that reset on reload and never open SQLite; native acceptance remains separate. Deliver an unmerged PR and Windows artifact for visual review. |
| D031 | accepted | The supplied prototype screens define the minimum atmosphere/material/detail quality for Sanctuary. Similar colors and successful CI are insufficient; compare actual desktop/mobile renders and obtain owner visual acceptance. The owner explicitly approved original raster environment art alongside CSS/SVG controls on 2026-10-27. Bundle it locally for offline operation, preserve original-art provenance and the small functional scope; no embedded UI/game results in the artwork. |
| D032 | accepted | SANCTUARY-UI-001 VISUAL RECOVERY follows the supplied VISUAL_CONTRACT v0.2: original desktop composition/materials/proportions are authoritative (~90% perceptual fidelity). Same PR #4, no master merge. Gate A actual composition/art/screenshots requires owner review before extensive Gate B polish. Previous visual candidates are rejected regardless of green CI. Original local optimized raster structures/frames plus semantic HTML/SVG are authorized. |
| D033 | accepted | Recovery adds only a pure read-only distinct-day observation over current local day and previous six calendar days, using activity snapshots, including archived history. Multisphere snapshots contribute once per date to every sphere; center reports represented spheres. No DB writes, goals, health score, invented Mastery/Resonance, intensity/note fields or new gameplay. The logging-date selector does not reanchor this recent-current-period projection. |

D020–D026 record the supplied “RELICS — Project Foundation & Architecture” brief and the owner's one-task instruction. Existing source and migration remain unchanged during DOC-001. Previously recorded platform/dependency blockers remain historical facts, not freshly verified failures.

D029 is implemented in [HABITS-001B PR #3](https://github.com/Maximus1978/Relics/pull/3). All 23 tests, TypeScript/Vite/browser checks and native Windows compilation passed in [run 40577256811](https://github.com/Maximus1978/Relics/actions/runs/40577256811) on fd97f6596dc400aebf37f28890a73e4bcc23df36. [Evidence and manual acceptance](HABITS_001B.md) separate tested SQL/repository behavior from pending native migration/UI/offline review. This delivery does not authorize merging or starting another task.

D030 is delivered for visual review in [PR #4](https://github.com/Maximus1978/Relics/pull/4). [Windows run 40583750205](https://github.com/Maximus1978/Relics/actions/runs/40583750205) passed 25 tests, 34 browser checks, TypeScript/Vite and native release compilation on cbd98965e851c6d30f20718a5ee5ea378cf978ee. [Screenshots, executable hashes and acceptance boundary](SANCTUARY_DAILY_MODE.md) are recorded. The PR remains unmerged; native visual/offline acceptance is the next step.

D031's earlier raster extension passed technically in [run 40603575817](https://github.com/Maximus1978/Relics/actions/runs/40603575817) on 59481e388c37d665ef4eb1c5f595215788ec5d01, but its visual presentation was rejected. D032–D033 supersede its composition. [Current design and evidence](SANCTUARY_DAILY_MODE.md) and HANDOFF distinguish Gate A screenshots from owner visual/native acceptance. No merge or next task is authorized.
