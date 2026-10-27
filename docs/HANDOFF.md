# Project handoff

Updated 2026-10-27. HABITS-001A: implementation, automated persistence tests and Windows build delivery verified. Native manual acceptance of the new form remains pending. No further task has started.

## Current delivery

- [PR #2](https://github.com/Maximus1978/Relics/pull/2), feature/habits-001a, remains open for review; master is unchanged.
- [Windows CI run 40565215658](https://github.com/Maximus1978/Relics/actions/runs/40565215658): completed / success.
- Tested feature head: 97b97edb12c9d92752010a44a7f3a413fe4bbeac. Tested PR merge source: 7383e0815e65cc7858b338c6f04c8af0cd4eac08.
- All 12 tests passed locally and in CI. npm ci, TypeScript, Vite, basic browser rendering, locked Cargo fetch, native Tauri release compilation and artifact upload all passed.
- [HABITS-001A Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40565215658/artifacts/12762772475), 4,280,480 bytes; contains relics.exe, dependency locks, metadata, checksum and launch note.
- ZIP/EXE hashes were verified after download. The new executable was not launched in this task.
- [Task contract, checksums and manual acceptance](HABITS_001A.md).

The previous BUILD-WIN executable does not contain this feature. The owner can close the old version, extract the new ZIP and run relics.exe without compilation/tool installation. Application identifier/database location are unchanged, so the existing local data stays in use. Windows x64/WebView2 and unsigned-build limitations remain.

## What changed

A visible + Добавить привычку action opens an inline form with a required name, the five canonical sphere checkboxes/line icons, Save and Cancel/Escape. Validation trims names and rejects empty names, empty selections and unknown spheres. Keyboard focus moves into the form, to invalid fields, and back to the add action. Saving is serialized with existing logging; a failed write retains form input and shows an error.

The repository now lists and creates habits. Native UI renders the actual SQLite list, not sampleHabits. UUIDs identify new habits; names remain non-unique display values. The original three sample IDs are seeded with INSERT OR IGNORE, without updates/duplicates. Browser-only preview can display the form but cannot load/save native habits or activities.

Existing schema/migration 1, database filename, native identifier, pipeline, dependency declarations/locks and native source are unchanged. Activity logging retains selected past dates, one completion per habit/day and immutable name/sphere snapshots. No editing/archive/delete of habits, weights, schedules, progression, crafting, Android or visual redesign was implemented.

## Evidence boundary

Nine new tests use the production repository/queries against temporary real SQLite through an injected database port, alongside three existing tests. Coverage includes one/multiple spheres, Гитара/Mind/Recovery, invalid input, habit plus backdated activity after reopening, unchanged October 26/27 legacy records, repeated startup seeding, preserved definitions/custom habits, duplicate completion protection and historical snapshots.

No personal database was opened, altered or used by tests. Native Tauri bridge/form interaction and keyboard behavior were not automated. The owner explicitly reported successful baseline Windows launch, close/offline restart and persistence of October 26/27 records before this task. That feedback applies to the integrated foundation, not yet to this new form.

## Git and next step

Work started from integrated master 688ce28a306e754eda0c9f1c8f6d7c012b0379cb, following merged BUILD-WIN PR #1. Changes were published through the GitHub integration with expected-parent checks and no force-push/history rewrite. Local workspace tracks feature/habits-001a.

A documentation-only evidence commit may follow the tested source using [skip ci]; executable source/tests/workflow/data behavior remain the tested head above. Consult PR/Git history for that report commit separately. No merge of PR #2 was performed.

Next recommended step: review PR #2 and test Гитара with Разум + Восстановление, a previous-day completion, and offline restart using the new artifact. Check that old activities remain. Await the owner's next task; do not automatically begin habit editing, archiving, schedules, WIN-LOG or another milestone.

## Persistent context

AGENTS.md, PRODUCT_VISION.md, GAME_DESIGN.md, UX_PRINCIPLES.md, DATA_MODEL.md and DECISIONS.md remain the source of truth. One task at a time; ask clarifying questions before uncertain decisions/dependent work. Reports are Russian, technical documentation/identifiers English. private/ stays excluded and unread. Historical local EPERM/TLS/credential-helper restrictions are documented in BUILD_WINDOWS.md; the owner is not required to repair them to obtain CI artifacts.
