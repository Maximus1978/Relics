# HABITS-001A: create habits with multiple spheres

## Scope and behavior

The + Добавить привычку action opens an inline form with a required name and native checkbox selection of Body, Mind, Bonds, Work and Recovery. Russian labels and decorative line icons accompany each sphere. Save validates input; Cancel/Escape discards the form. Keyboard focus moves into the name field, to an invalid field when needed, and back to the add action after closing.

Names are trimmed and cannot be empty. At least one canonical sphere is required; unknown sphere IDs are rejected. Duplicate selections are normalized to canonical order. Names are not unique identifiers: separate habits may have the same display name, preserving the existing database contract. Numeric weights and habit editing/deletion/schedules are out of scope.

## Persistence and compatibility

The existing habits table already stores id, name and spheres_json, so no schema migration is needed. Migration 1, database filename and application identifier are unchanged. A new habit receives a UUID and is inserted through parameterized SQL. The interface adds it only after SQLite confirms the write.

Startup seeds only the original stable IDs with INSERT OR IGNORE, then reads the actual habit list from SQLite in insertion order. It does not overwrite existing definitions or replace custom habits. Native rendering no longer iterates sampleHabits. Browser-only preview can show the form but cannot load/save the native database; no localStorage fallback or simulated saved habit is introduced.

The existing date selector/logging handles new habits. One completion per habit/day remains enforced by the existing unique constraint. Activity records retain name/sphere snapshots, local occurrence date, UTC recording time and timezone. Existing records are not rewritten by creation or startup.

## Automated evidence

Nine new tests exercise the production repository against temporary real SQLite files through an injected database adapter, without importing the native bridge. Together with the original three tests, all 12 passed locally.

Coverage: one sphere; multiple spheres with Гитара/Mind/Recovery; empty or whitespace-only names; empty selection; unknown/duplicate sphere IDs; reopening habit plus backdated activity; unchanged October 26/27 legacy records; repeated seeding without duplicates or overwrites; retained activity snapshots after a definition changes in a fixture.

The adapter binds Node SQLite's named $1 parameters to the same queries used by the native SQLx plugin. It is not a second implementation of the application's persistence rules. Temporary test databases never read the owner's real database.

## Manual native acceptance

Use the Windows executable artifact for the tested PR commit; no local compilation is required. Close the previous executable before opening the new build with the same application identifier/database.

1. Confirm the three samples and previously recorded activities are present.
2. Open + Добавить привычку, enter Гитара, select Разум and Восстановление, then save.
3. Confirm the habit and both sphere labels appear in the list.
4. Select a previous date and record Гитара; repeating the action must not create another habit/day entry.
5. Close the application, disconnect the network and reopen it. Confirm the habit, sphere assignments, activity and old October 26/27 records remain.
6. Check empty-name/empty-selection validation, Cancel/Escape, keyboard navigation and visible focus.

Owner feedback already confirms native offline persistence for the preceding integrated foundation. Native interaction with this new form still requires the above acceptance; Node SQLite tests and browser rendering do not prove the Tauri bridge or keyboard behavior in a real window.

## Delivery state

Local tests: 12 passed. TypeScript/Vite/native Windows CI verification and the new downloadable artifact are pending publication. Do not reuse the previous foundation artifact as evidence for HABITS-001A. The existing Windows workflow and dependency lockfiles remain unchanged.
