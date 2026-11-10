# PROGRESS-002A — experimental replay review

`progress-001-experimental` version 1 implements the numerical candidates for review. The owner subsequently approved these mechanics as Mastery v1, rules ID mastery version 1. PROGRESS-002B connects that replay to Sanctuary. The original experimental ID here identifies the historical review.

## Run the synthetic review

```powershell
node --experimental-strip-types scripts/review-habit-progress.ts
node --experimental-strip-types scripts/review-habit-progress.ts --remove=2024-01-08
node --experimental-strip-types scripts/review-habit-progress.ts --json
```

The report includes the recorded dates, frequency history, weekly classification, F/P/S, protected thresholds, mastery, phase-local progress and Resonance. It compares original, canceled and re-recorded journal evidence and shows a separate interruption and return. All inputs are synthetic.

| Scenario | Observed experimental result |
| --- | --- |
| Weekly Jan 1, 8 and 15, as of Jan 22 | Copper phase 1, F/P/S 3/3/0, next phase 0 of 2, Resonance 1 |
| Cancel Jan 8 and replay | Stone phase 3, F/P/S 2/2/0. The latest event is still Jan 15, so Resonance remains 1 |
| Record Jan 8 again with a new event ID | Identical projection to the original |
| Bronze F13/P12 followed by four eligible shortfalls | F13, 12, 12, 12. The Bronze phase 2 checkpoint stays protected |
| Three qualified return weeks | F13, 14, 15. Bronze phase 3 is acquired at 15 |
| 625 complete weeks, eight habits and 30,000 events | All eight projections reach Platinum phase 3, P96. Reversing both input lists produces equal results |

## Projection contract

`projectHabitProgress` and `projectHabitsProgress` consume the existing habit definition history and activity records, explicit actual local `today` and an ID/version. They return the same per-habit shape. Collection output is sorted by stable habit ID. Enable `includeWeeks` for review traces. Without it the result contains only summary state.

Closed Monday weeks use distinct recorded local dates. The 6/3/1 thresholds give one unit. Initial partial, open, unconfigured and archive-intersecting weeks are neutral. A known pause is half-open. An unknown legacy start remains neutral before actual restoration. A later segment effective on a non-Monday is invalid under the persisted schema 6 contract and is rejected before replay. First enrollment midweek is valid. A boundary clears S when effective, including the first day of an open week, without crediting that week.

F/P/S are the frontier, protected checkpoint and consecutive eligible shortfalls, capped at two. Two shortfalls return F to P. At Platinum phase 3, successful weeks can still increase the derived F counter. P remains 96 and both unfinished progress and the next-phase track are exhausted. This preserves the approved one-unit-per-qualified-week rule without inventing another tier or a spendable total.

Resonance uses the rhythm effective on `today` and the latest recorded local date since enrollment. Pre-enrollment records and dates within a legacy unknown interval give no light credit. Active archive intervals suppress light. Restoration derives it from eligible recorded evidence with elapsed calendar age. Future-dated events are structurally validated and excluded from the as-of view. Selected date, sphere units, names, icons and event recording timestamps have no effect.

## Deterministic evidence

The 21 focused cases in `tests/habitProgress.test.ts` cover the requested 30 checks in groups.

| Matrix | Evidence |
| --- | --- |
| 1–6 | Daily 6/7 and 7/7, Daily 5/7, Three/week 3 and 2, Weekly 1 and 0, one unit and distinct dates despite different IDs or contribution values |
| 7–14 | Hold/reset/return and long inactivity, all 18 checkpoints, terminal phase and numeric phase-local progress |
| 15–20 | Midweek enrollment, unclosed week, schema 6 rejection of later midweek changes, multiple effective segments, pending replacement, known and unknown archive pauses |
| 21–25 | Backdate/cancel/re-record, actual date independence, leap day/DST/year boundaries, all three grace/fade curves |
| 26–30 | Reordered and frozen inputs, fresh-process equality across time zones, writes denied in the simulator subprocess, unsupported rules, legacy/unconfigured safety and invalid history |
| Scale | 30,000 records across 625 weeks and eight habits, no stored aggregates |

002A originally kept the engine isolated. The approved production integration and Windows acceptance steps are in [PROGRESS-002B](PROGRESS_002B.md). Schema 6 and backup v4 still carry authoritative history only.
