# TODO-001 — Episodic Tasks

Status **proposed for owner review**. This contract follows [D096](DECISIONS.md#hybrid-alchemy-planning) and starts from the accepted Mastery v1 release. TODO-002 implements the standalone experience after approval. TODO-ALCHEMY-001 is a separate economy integration.

## 1. Product scope

A task is a personal, one-off intention such as sending a letter or visiting a friend. It works fully offline with no account, game screen or resource inventory. Creating, planning, rescheduling and archiving intentions produce no journal events or sphere contribution. A completion records that the user says the task happened. It can carry optional subjective sphere contributions.

The Windows MVP offers create, edit, complete, correct the completion date, reopen, archive and restore. Users can complete multiple distinct tasks on the same day. There is no recurrence, due-date enforcement, priority score, reminder service, automatic habit conversion, hard deletion or reward claim in this slice. Task completion never enters habit Mastery, Forging or Resonance. Sanctuary’s shrine counts, daily gemstones and seven-day rune keep their existing habit inputs. Future use of Todo in Balance or Adventure requires separate approval.

## 2. Windows UX

Use a dedicated sidebar destination «Задачи» with «Открытые», «Завершённые» and «Архив». Keep «Добавить задачу» visible on the active view and preserve current Sanctuary navigation and artwork. Show the title, an optional local due date and optional sphere indicators on each row. Use the existing dark stone surfaces, restrained gold, native controls and visible focus. Keep past due dates readable with neutral wording («Срок прошёл» if a status is needed). Undated tasks remain usable and have no deadline. Show dated open tasks by due date, with undated tasks afterward and a stable tie-break. Show completed tasks by recorded completion day, latest first. Archive order uses archive timestamp and task ID as a tie-break.

| User action | Flow and effect |
| --- | --- |
| Add | Enter a required title and optionally a date and sphere contributions. Save adds an open task. Escape or Cancel discards the draft. |
| Edit | Open the row menu and choose «Изменить». Editing an open or completed task updates the plan. For a completed task, explain that the existing Chronicle record retains its recorded title and contributions. |
| Complete | Activate «Выполнить» to record today in one action. Offer «Отметить за другую дату» for an explicit past date. Display the actual completion date in the completed row. The due date and Sanctuary date selector never choose the actual date. |
| Correct a date | «Исправить дату выполнения» opens the saved date for edit. Saving replaces the effective date while keeping the recorded title and sphere values. The prior version remains in the local revision history. |
| Reopen | «Вернуть в открытые» asks once whether to remove the current completion from Chronicle and Life Rhythm. The confirmed correction reopens the same task. The next completion records a fresh snapshot under the same occurrence identity. |
| Archive | «В архив» hides the row from open/completed views. For a completed task, explain that Chronicle keeps the completion. An open task produces no event. |
| Restore | «Восстановить» returns an archived task to its previous open/completed state. Restore it first to edit, complete, correct or reopen it. |

Reuse the contribution editor interactions with zero to five selections. Selecting a sphere exposes an integer control from 1 to 10, default 5, with visible numeric value and keyboard adjustment. Deselection removes its active control and sets its value to zero in a nonempty profile. Having no selections is an explicit choice. Keep due date and sphere configuration optional and out of ordinary quick completion. Hint for the editor: «Вклад показывает, насколько полезно это действие для вас в каждой выбранной сфере».

Use a semantic heading and landmarks, labeled buttons and inputs, accessible menus/date fields, inline validation tied to the field, screen-reader success/error feedback and a reachable primary action at narrow widths and increased Windows text scaling. Return focus to the invoking row or a neighboring row if it moves. Keep the previous saved state visible during writes. Preserve a failed dialog’s draft, distinguish failed writes from committed writes followed by refresh failure, and reload the shared model before allowing another mutation if saved state is uncertain.

## 3. Lifecycle and event identity

- A stable Task UUID identifies both the editable plan and its one logical completion occurrence. Public domain identity is the tagged pair `(todo, taskId)`. Real separate instances use separate tasks. Due date, completion date, title, storage revision and rules version never allocate a new occurrence.
- Status is derived from the latest completion revision. No revision, or latest revision being `reopened`, means open. Latest `completed` or `date_corrected` means completed. Archive is independent and preserves the underlying status.
- First completion appends an immutable snapshot from the current persisted plan. A date correction appends a revision with the same snapshot and a newly chosen local date. Reopening appends a tombstone and removes the completion from current projections. Re-completion appends a new snapshot using the then-current plan, even when the same date is chosen.
- A completed task rejects a second distinct completion command until reopened. Simultaneous commands or a duplicate request cannot yield two effective records. Archive and restore produce no completion revision and do not alter earlier revisions.
- Use a per-task version for optimistic concurrency across all edits and transitions. Each completion/reopen/date-correction intent carries a stable request UUID. Store it with the revision and a canonical request signature over the task ID, command, expected version and explicit date or today intent. Resolve the today intent only on the first successful write. Check for the same committed request before the version guard, then acknowledge the earlier operation without writes and refresh current state. A reused UUID with changed parameters rejects. A stale fresh request fails and refreshes; the UI does not silently repeat it. A canceled dialog writes nothing.

## 4. SQLite and native commands

Schema 6 and backup v4 are the verified baseline. Use an additive migration, candidate **007**, registering it only after checking availability from the latest master at implementation. Leave migrations 001–006, existing IDs, habit/day uniqueness, the SQLite filename and Tauri application identifier intact. No habit conversion or synthetic seed tasks.

| Store | Proposed fields and constraints |
| --- | --- |
| `todo_tasks` | `id` primary key UUID, nonblank trimmed `title`, nullable `due_on` Gregorian local date, nullable `contribution_profile_json`, `created_at` and `updated_at` RFC 3339 UTC, nullable `archived_at`, positive integer `row_version`. Derive selected spheres from positive keys so the plan has one canonical profile. |
| `todo_completion_revisions` | Primary key `(task_id, revision_no)`, foreign key to `todo_tasks` with deletion restricted, unique `operation_id`, canonical request signature, operation kind, `recorded_at` UTC. For completion/date correction, require `occurred_on` local date, recognized `timezone`, `title_snapshot` and a nullable contribution snapshot. Reopen has no effective payload. Keep contiguous revision numbers and validate allowed transitions. |

Profiles reuse the version 1 five-value shape with `origin: 'user'`, canonical sphere IDs `body`, `mind`, `relationships`, `work`, `recovery`, integer selected values 1–10, zero elsewhere and no normalization. At least one positive value is required for a non-null profile. Todo null means **intentionally no spheres**. An old habit’s null snapshot remains **unknown historical values**. Reuse validation primitives with source-specific constraints. Reuse existing safety bounds for text and timestamps where applicable. Validate real Gregorian dates on both sides of the native boundary: due dates may be past or future, and actual event dates may be backdated, including before task creation, but may not exceed trusted native local today at recording. Restore validates historical date syntax without comparing it to the receiving clock. Store the entered local date verbatim and the local timezone in effect when the date is recorded; editing the plan and changing device timezone never rebucket old events.

Keep projections pure. Perform each mutation as parameterized writes on one pinned native SQLite transaction. Read and compare the saved plan, expected version, archive flag and effective revision inside that transaction. The task version change and revision insert commit together. Use SQLite constraints for IDs, uniqueness, foreign keys and required payload shape. Native validation also enforces legal transitions, date-correction snapshot equality and field/profile integrity. Index archive/list access if needed, plus latest event lookup through the revision primary key; verify real query plans before adding indexes. Reads for the three views must refresh from the same committed inputs after a command or backup restore. A success toast confirms storage only after the transaction has committed.

## 5. Chronicle and Life Rhythm

Project only the latest effective completion per task into a typed `todo` event, separate from `habit` activities. Chronicle combines both sources, groups by stored local date, and uses recorded-at and stable source/ID ordering within a day. Show the snapshotted title, labeled task source («Задача»), date and optional sphere values, including tasks recorded without spheres. The Chronicle task actions use the same correction/reopen commands as the Todo list; an archived task links to its archived details and must be restored before correction. Habit cancellation continues through its existing repository.

Life Rhythm reads the same effective snapshots. Preserve the rolling seven local days including today and the 4/8 complete Monday–Sunday week modes. Weighted Todo and weighted habit events add units to the same sphere sums, and shares use all included units as denominator, independent of series visibility. A completed task with no profile adds no units. Disclose Todo entries without spheres separately from legacy habit entries with unknown values. Retain known-default and user-origin counts. Show the total number of completed task events and the count included numerically so the source and data coverage are understandable. Empty numeric buckets remain gaps, including buckets containing only sphere-less tasks. Date correction moves the contribution between buckets; reopening retracts it; re-completion contributes once. The chart stores no derived totals. Progression reads the original habit-only stream even when the Chronicle and trends use both.

## 6. Native backup

Candidate **format v5 / schema 7** extends the strict `relics-backup` envelope with required `todoTasks` and `todoCompletionRevisions` arrays. Include all archived plans, request identities, snapshots, replaced revisions and tombstones. Omit rebuilt projections and UI state. Explicit v1–v4 readers retain existing adapters and supply empty Todo arrays. Old-format restore therefore removes current Todo records from the live database as part of full replacement, with an explicit preview warning and all of them retained in the protective v5 copy. No v4 downgrade export. Unsupported versions and unknown fields in supported formats reject before mutation.

The native importer validates IDs, date/timestamp formats, bounds, foreign keys, revision continuity, state transitions, correction invariants and request uniqueness for the entire payload. Keep the existing 32 MiB envelope limit and add explicit bounded task/revision counts and byte preflight, with final bounds selected during implementation tests. Preview shows active, completed, archived and revision counts and explains replacement. The native dialog/token flow stays in place. Publish and read-verify the complete protective copy before replacement. In the pinned native restore transaction, delete Todo revisions before plans, insert plans before revisions and verify all foreign keys before commit. A declined dialog, invalid input, failed protective export, mid-restore error or terminated process leaves the prior database recoverable as appropriate for the existing atomic restore guarantees. Verify it in a disposable Windows profile, including restore of the protective copy and offline reopening.

## 7. Future renewable components

Expose a typed effective occurrence to future consumers with a stable source-qualified identity. TODO-ALCHEMY-001 may use this identity after the award policy, [AUDIT-001](ROADMAP.md), ESSENCE-001 and the Alchemy contract are approved. Any eligible grant must deduplicate against a durable entitlement keyed by the logical occurrence and an approved grant slot. Revision, edited date, request retry, rule revision and reopen/re-complete cannot create a second entitlement for that slot, even after a component was consumed. Grant and inventory accounting require a single native transaction and backup continuity.

Duplicate protection within a task cannot establish real-world completion or stop a person from creating many lookalike tasks. Later review must choose authored eligibility, any caps/cooldowns, correction of an already-consumed grant, and how full/older backups interact with spent entitlements. Keep rewards disabled until those cases have a reviewed policy. No player debt or loss of permanent Mastery is implied by task correction or resource spending. This slice issues no components or rewards.

## 8. Lifecycle examples

| Scenario | Expected result |
| --- | --- |
| «Позвонить другу» is due 19 November. It is completed for 15 November with Bonds 8 and Recovery 3. | The due date stays 19 November. Chronicle shows 15 November. Life Rhythm adds 8 and 3 to the applicable 15 November buckets. Habit progression receives zero events. |
| The task is renamed and its planned Bonds value changes to 5. The completion is corrected to 16 November. | The projectable snapshot keeps the original title and the values 8 and 3. The effective record moves to 16 November and retains the same occurrence ID. |
| That completion is reopened, then marked again for 16 November. | Reopen hides the event and retracts its units. Re-complete shows one event with the updated title and planned 5 and 3. The same occurrence retains all revisions. |
| «Забрать посылку» is completed without spheres and then archived. | It stays in Chronicle, with no numeric contribution or legacy-unknown count. In «Архив», Restore returns it to «Завершённые». An archived open task restores to «Открытые» without producing an event. |
| A confirmed completion succeeds, the app exits before its reply, and the same intent is retried. | The existing operation is recovered. One effective record and one completion revision exist. A recovered older request never reverses a later correction. |

## 9. Acceptance and implementation sequence

Use temporary databases and synthetic records for automated browser and native checks. Owner acceptance uses the downloadable Windows x64 build and an isolated profile, with an offline close and reopen after writing and after restore.

| Check | Acceptance evidence |
| --- | --- |
| T01 | Create/edit with and without due date and with zero, one and five spheres. Validate title/date/unknown spheres/integer bounds. Keyboard, screen reader, narrow/zoom layout, focus and save/cancel/error states. |
| T02 | Complete in one action or with an explicit past date. Reject a future completion and a stale writer. Verify scheduled day, current day and Sanctuary selection are independent; test local midnight/timezone boundaries. |
| T03 | Rename and change a plan profile following completion. Verify immutable recorded facts. Correct the date, reopen, and re-complete with current profile under the same ID. No partially committed transition, concurrent duplicate or replay of a recovered request. |
| T04 | Archive and restore both open and completed tasks offline. Verify unavailable mutations on archived tasks, retained history for completed ones and no open-task history. |
| T05 | Chronicle shows one typed row per effective Todo occurrence; sphere-less items are visible. Fixtures with both event types verify rolling7 and complete4/8 weeks, totals, shares, empty gaps, quality counters, and boundary movement after corrections. Existing habit grouping, cancellation, progression, Resonance and rune tests still pass. |
| T06 | Schema 6 upgrade preserves the old records across restart. Strict v1–v4 import and v5 round-trip, including tombstones and request IDs. Reject unsupported fields, inconsistent histories, duplicate IDs and invalid references. Verify preview and confirmed full replacement, protective undo, rollback, crash recovery and native offline restart. |
| T07 | Windows build, browser evidence and native UI acceptance are reported separately. Actual native walkthrough covers create, completed/archived status, Chronicle corrections, Life Rhythm and verified offline reopen, with keyboard and focus checks. |

1. **TODO-002A — persistence gate.** Implement and test lifecycle commands, concurrency, migration, strict native backup adapters and recovery before exposing writable Todo UI. Cover T02–T04 persistence and T06 in isolation.
2. **TODO-002B — Windows task list and Chronicle.** Implement accessible standalone navigation, lifecycle flows and typed effective history. Verify T01–T04, Chronicle portion of T05 and matching browser/Windows evidence.
3. **TODO-002C — Life Rhythm and Windows release gate.** Integrate the shared projection, verify T05 regressions and data explanations, and finish T07 and the owner’s native acceptance of the whole Todo experience. Publish a Windows artifact for approval.
4. **TODO-ALCHEMY-001 — separate candidate.** Review and implement component entitlements only after its listed dependencies and the economy rules are approved.

Owner review covers explicit backdating, correction/reopen behavior, the Windows navigation/copy and the combined Life Rhythm view. Migration and backup numbering must be rechecked when TODO-002A begins.
