# Decision log

Updated 2026-10-26. `accepted`: owner requirement; `provisional`: reversible scaffold choice; `open`: unresolved; `superseded`: retained for traceability. New choices must state scope and evidence.

| ID | Status | Decision |
| --- | --- | --- |
| D001 | accepted | Offline first; local SQLite source of truth; no required account/server. |
| D002 | accepted | Windows 11 + Android; Tauri 2, React, TypeScript, Vite, SQLite, SVG visual system. Runtime feasibility remains unverified. |
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
| D013 | provisional | Tauri SQL plugin adapter; browser preview does not substitute localStorage. No native verification yet. |
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

D020–D026 record the supplied “RELICS — Project Foundation & Architecture” brief and the owner's one-task instruction. Existing source and migration remain unchanged during DOC-001. Previously recorded platform/dependency blockers remain historical facts, not freshly verified failures.
