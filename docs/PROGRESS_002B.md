# PROGRESS-002B — Mastery v1 in Sanctuary

The owner approved P01–P07 on 2026-11-10. The runtime rule ID is `mastery`, version 1. The same deterministic replay is used by the standalone [simulator](PROGRESS_002A.md) and the production inventory.

| Material | Stage 1 | Stage 2 | Stage 3 |
| --- | ---: | ---: | ---: |
| Stone | 0 | 1 | 2 |
| Copper | 3 | 5 | 7 |
| Bronze | 9 | 12 | 15 |
| Silver | 18 | 24 | 30 |
| Gold | 36 | 48 | 60 |
| Platinum | 72 | 84 | 96 |

Complete Monday weeks qualify with 6 Daily, 3 Three/week or 1 Weekly distinct recorded days. Each qualified week adds one cycle. The first eligible shortfall holds Forging and the second resets only the unfinished tail. Earned checkpoints survive inactivity. Correction of an actual event can change the replay. Initial partial weeks, open weeks, unconfigured history and archive-intersecting weeks are neutral. A configured rhythm change takes effect under the existing Monday rule.

## Integration

The application computes a single habit-ID map from loaded habits and the journal. React memoizes it by those inputs and actual local today. Existing successful mutation and backup refresh paths replace the inputs. The local calendar hook updates at midnight, focus or visibility change. Selecting another logging date only changes the checkmark and the pre-existing selected-day observations.

The approved HabitMedal receives the material, phase, chosen icon and Resonance. The fixed geometry and engravings are independent of light. Active cards show numeric phase-local Forging, a small track, and an accessible next-stage description. Platinum phase 3 shows a completed state. Unconfigured habits show Stone stage 1 and an invitation to choose a rhythm. Archived habits retain their earned rank with a quiet medal and a separate restore action.

The collection projection rejects contradictory history. In that case the inventory shows a visible error, keeps each chosen glyph as a plain symbol and leaves logging and Chronicle usable. It does not show a starter rank for invalid data. No progression writes, data migrations or backup format changes are needed. Reopening recomputes from committed inputs.

## Verification and Windows acceptance

- The existing Node suite verifies all 18 checkpoints, correction replay, shortfalls, independent Resonance, archive history and 30,000 events over 625 weeks. Rust verifies native SQLite and backup v4 safety.
- The Edge suite uses the real Sanctuary and repository with synthetic SQLite behind a mocked native IPC boundary. It verifies all 18 material/phase states, full/half/zero light, independent historical checks, failed and successful cancellation, re-recording, definition edits, resume across dates, archive/restore, legacy enrollment, post-restore replay and visible invalid-history handling.
- The browser artifact contains `mastery-six-tiers.png`, `mastery-all-stages.png`, `mastery-forging-legacy.png`, `mastery-historical-zero.png`, `mastery-archive.png` `mastery-narrow.png` and the half/zero Resonance captures of the same Silver medal. They contain synthetic histories only.

Download the Windows x64 ZIP from the implementation PR. Extract and run `relics.exe` with WebView2. Use a test habit or a disposable profile for historical corrections. An unconfigured habit should show the chosen icon and a rhythm prompt. A configured habit should show the rank and phase-local progress from eligible recorded history. Check a historical date with a saved event and verify that the checkmark changes independently of material and light. Close and reopen offline, select the same date, and compare. Verify archive retains the rank without active light and Restore returns the habit to the active inventory. Re-recording after cancellation creates a new journal event.

The downloaded EXE is unsigned. New or legacy-unconfigured habits cannot acquire past cycles by enrolling today. Native owner visual acceptance remains separate from CI and isolated testing. Other progression and reward systems remain deferred.
