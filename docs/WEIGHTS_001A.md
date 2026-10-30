# Implementation status after owner acceptance

Owner accepted native WEIGHTS-001B; PR #8 merged normally at 293e7d20b2cfcb1802059699b72381a33cc6bf23. Profile/migration004/editor/backup contracts below are implemented; the original proposal wording is retained as specification history. SPHERE-TRENDS-001 now implements section7 and T01–T05 in a separate unmerged review candidate: [contract and evidence](SPHERE_TRENDS_001.md). No automatic merge or continuation.

# WEIGHTS-001A — subjective sphere contributions

## Status, source and approval boundary

Owner/reviewer-approved specification (PR #7 merged at 6e122e7221c33d909ff2f4ecdbfba75b210f5b08). Original documentation-only proposal was based on verified master c2375e7543649ce80e25151bf79c0376c985ad9d. Product semantics below are owner-approved requirements. The owner approved this contract for WEIGHTS-001B. The originally proposed storage/backup/editor now has an unmerged implementation in PR #8; the projection/graphs remain future work. See [WEIGHTS_001B](WEIGHTS_001B.md) for actual gates/results and manual acceptance. SPHERE-TRENDS-001 later implements projection/graphs. No real personal data, secret catalog or migration is touched here.

Owner priority: WEIGHTS-001A → WEIGHTS-001B → SPHERE-TRENDS-001 → NAV-CHRONICLE-001. Android remains in the roadmap but is deferred until core mechanics are validated on Windows. This supersedes the earlier immediate NAV → Android ordering.

## 1. Accepted meaning and domain invariants

Contribution is the user's subjective assessment of how beneficial or meaningful a habit is for a sphere. It is not objective health, exertion, energy, time, intensity or scientific balance. Never call it a percentage allocation, measured benefit, Balance grade, XP, rarity or reward probability.

Canonical order/IDs: body (Тело), mind (Разум), relationships (Отношения), work (Дело), recovery (Восстановление). Select one to five spheres. Every selected value is an independent integer 1–10; 1 means small subjective contribution, 10 very significant. Newly selected spheres start at 5. Unselected spheres have 0 and no active editor. Do not normalize; no total of 10/100, allocation budget or primary/secondary multiplier. An event can total 1–50; selecting all five at 10 is valid, not a special achievement.

Habit definitions own the profile; an activity receives its own immutable snapshot at creation, including for backdated logging. Later habit edits do not change prior activity names, spheres or contribution profiles. The current one-completion-per-habit/day rule, archive/restore and cancellation behavior stay unchanged. Normal completion asks no extra question.

Icon identity/medallion artwork remain unchanged and independent. Explicit primary-sphere appearance is deferred; no numeric maximum silently chooses a new primary/icon/color in this milestone. Earlier primary/secondary normalization proposals are superseded for contribution math. Notes/intensity/duration/quantities/repeated sessions/AI estimates/recommendations/Balance/rewards/presets are outside this MVP.

## 2. Proposed value contract: known zero versus unknown

JSON ContributionProfileV1:

```json
{
  "version": 1,
  "origin": "user",
  "values": {
    "body": 0,
    "mind": 7,
    "relationships": 0,
    "work": 0,
    "recovery": 3
  }
}
```

Exactly version/origin/values, and exactly all five canonical keys in values. Reject unknown/missing/duplicate keys, unsupported versions/origins, null inner values, booleans, strings, non-finite/fractional/out-of-range numbers, an all-zero profile and any mismatch between positive keys and the corresponding spheres array. Serialize in canonical key order, but retain existing spheres array order and IDs. Origin is either user or legacy-default. A legacy-default profile must have 5 for every selected sphere and 0 elsewhere.

| Representation | Meaning | Numeric treatment |
| --- | --- | --- |
| Non-null profile, value 0 | Explicitly unselected sphere in a known profile | Known zero; never a selected value |
| Non-null profile, value 1–10, origin=user | Saved current-form subjective profile | Include; count as user-defined |
| Non-null profile, origin=legacy-default | Future log using disclosed 5 defaults from an old unweighted definition | Include; count separately as default-origin |
| SQL NULL / backup JSON null for activity snapshot | Legacy activity had no numeric profile | Unknown; exclude from numeric units/shares, retain binary spheres/history and count exclusion |
| Malformed/unsupported non-null profile | Corrupt/unsupported data, not legitimate absence | Error, not zero or automatic legacy conversion |

User origin means a person saved the displayed profile, including leaving a displayed 5 unchanged. It is not proof of objective measurement. The whole profile has one origin; saving the habit form makes its resulting future profile user-origin. This never relabels previous default-origin snapshots.

## 3. Legacy policy — owner clarification accepted

Upgrade all existing habit definitions, active and archived, to an explicit legacy-default profile: each currently selected sphere 5, others 0. This is a marked default for future records, not fabricated old measurements. Keep IDs, names, sphere order and archivedAt byte-equivalent.

All pre-upgrade activities keep a NULL numeric snapshot; do not backfill 5, 0, current weights or estimates. New entries from a defaulted old habit snapshot the actual default profile and remain separately identifiable. The owner explicitly chose to INCLUDE these future default-origin entries in numerical trends with an origin count/label. Do not exclude them until confirmation or pretend they were explicitly calibrated.

Opening/closing/canceling Edit does not change origin or data. Saving the visible valid profile (even unchanged) confirms user-origin only for the definition and subsequently created activities. Logging needs no confirmation step. Restoring an archived habit preserves its last profile/origin and never reactivates samples through seeding.

Backdated entries created after upgrade use the definition at recording time, not an inferred historical configuration. Cancel/re-add uses the current profile on re-creation; do not silently change existing snapshots. The existing physical-deletion audit gap remains AUDIT-001.

## 4. Proposed additive SQLite migration 004

Reserve next migration 004_habit_contributions.sql only if version 4 is still free when WEIGHTS-001B starts; reverify latest master/migrations first. Never edit 001–003, DB name sqlite:relics.db, application identifier, IDs, uniqueness or snapshot columns.

Proposed columns, both TEXT with SQL NULL default and a CHECK allowing only NULL or syntactically valid JSON objects:

```sql
ALTER TABLE habits ADD COLUMN contribution_profile_json TEXT
  CHECK (contribution_profile_json IS NULL OR
    CASE WHEN json_valid(contribution_profile_json)
      THEN json_type(contribution_profile_json) = 'object' ELSE 0 END);
ALTER TABLE activities ADD COLUMN contribution_snapshot_json TEXT
  CHECK (contribution_snapshot_json IS NULL OR
    CASE WHEN json_valid(contribution_snapshot_json)
      THEN json_type(contribution_snapshot_json) = 'object' ELSE 0 END);
```

This approved Markdown snippet specifies the shape; migration 004 is now implemented in PR #8 with additional database validation triggers. This document itself does not apply SQL. In the same migration transaction, construct the five-key legacy-default habit profiles from each row's existing spheres_json; do not update activities. Every migrated habit must end with a valid non-null profile. Nullable physical storage permits additive upgrade; normal create/update/restore paths must never leave a habit NULL. A NULL/malformed habit after completed migration is an integrity error, not a silent 5 fallback. Empty databases stay empty; migration 003's ledger/seeding rules are retained. Fresh sample habits inserted by 003 get marked defaults via 004 once, not routine startup reseeding.

Coarse SQL CHECKs are not a full semantic validator. Implement a shared specified contract in TypeScript and native Rust backup parsing, including selected-set equivalence/origin rules. Validate migrated/generated data before committing the migration; malformed legacy sphere JSON/IDs must stop upgrade without partial changes. Tests must prove atomic DDL/backfill/ledger behavior in the actual plugin, not assume it.

Habit create is one validated bound INSERT. Edit name + sphere set + full profile in one bound UPDATE, check affected row count, and preserve archived_at. Never save one slider at a time or update activities. Validation failure/cancel leaves old definition intact. Archive/restore changes only archived_at.

Extend the existing repository INSERT ... SELECT FROM habits WHERE id=? AND archived_at IS NULL so name, sphere set and contribution profile come from the same persisted row in one statement. Do not trust a cached Habit argument or SELECT-then-INSERT across pooled calls. Preserve duplicate-day DO NOTHING. Duplicate retries must not rewrite the first snapshot. A concurrent edit yields either coherent old or coherent new definition, never mixed fields. Archived/missing habits reject logging at repository level.

Native backup uses the existing pinned SQLx transaction/exclusive plugin guard; no renderer-level BEGIN loop, file swap or new arbitrary filesystem access. Close old application instances during upgrade/restore; backward writing from old binaries to schema 4 is unsupported. Add a clear version compatibility check and test/document downgrade limits rather than promise an old v1 binary understands weights.

## 5. Proposed backup v2 and compatibility matrix

Keep current v1/schema 3 parsing EXACTLY strict. New ordinary exports and protective recovery copies use format=relics-backup, formatVersion=2, databaseSchemaVersion=4 (or the actual separately approved next schema version). Preserve all current envelope/record fields, ordering, timestamps and limits; add required habit contributionProfile (non-null V1 object), activity contributionSnapshot (V1 object or required explicit null). Profile version 1 is independent of backup version 2. Missing snapshot key in v2 is invalid, not equivalent to explicit null.

| Source → upgraded application | Contract |
| --- | --- |
| v1/schema 3 → schema 4 | Parse unchanged strict v1 DTO, validate, then typed adapter: habit defaults from each imported habit's own spheres; activities null. Preserve imported IDs/archives/name/sphere snapshots, dates/metadata; never borrow destination profiles |
| v2/schema 4 → schema 4 | Validate all fields/profiles; preserve values/origins/null exactly. Activity profiles match their own historical sphere snapshots, not today's habit definition |
| Future/unknown format/profile/schema; malformed v1/v2 | Reject before mutation; no field stripping, guessing or truncation |
| v2 → old v1-only binary | Unsupported; explicit upgrade message, no downgrade export that discards weights |

Dispatch by version without first converting the full input into a generic object that silently collapses duplicate members; strict decoding must still inspect original JSON bytes. Use version-dispatched strict DTOs; current Rust deny_unknown_fields cannot be extended by casually adding fields to the v1 record. Reject duplicate object members and unsupported data. Use deterministic validation parity fixtures for TS and Rust. Do not export v1 from weighted storage or silently omit numeric fields.

Preview includes source/target format/schema, total habits/archives/activities, weighted/user/default/legacy-null counts and any v1 conversion explanation. Clearly warn that restore FULLY REPLACES current data and v1 input contains no historical numeric values. Choosing an older backup is explicit replacement of current history, not field-merging. Do not silently preserve destination weights or masquerade as lossless numeric v1 import.

Before any DELETE, capture and sync/read-verify current weighted pre-state as recoverable v2 safety JSON under the existing recovery directory; safety must include every value/origin/null. Abort if safety fails. Confirmed replacement retains the migration ledger, uses one BEGIN IMMEDIATE/pinned connection, bound inserts, foreign-key check and atomic commit; SQL failure/crash rolls back all rows and new fields. Cancel/stale token changes nothing. Cached connections refresh after commit; no reseeding. Recovery from the v2 safety file must fully restore pre-replacement profiles/snapshots and archive state.

Include new JSON column bytes in the existing prefetch/export 32MiB bounds and retain row/string limits; no data trimming. Windows native round-trip, dialog/preview, rollback/crash, protective restore and offline reopen are release gates for WEIGHTS-001B. All tests use temporary data, never the owner's real DB/backups.

## 6. UX contract tied to owner reference

Reference: owner attachment 2026-10-28_14-44-28.jpg under the existing Visual Handoff states/Create habit directory. It guides the compact dark Sanctuary form: dark panels, fine aged-metal borders, restrained gold labels/buttons and canonical colored line sphere icons. Existing medallion art stays; no artwork generation or replacement.

Use existing create/edit dialog and form. Name remains required with existing validation/storage limits. The pictured optional description, character counters/limits, icon picker and decorative new running-person medallion are NOT new requirements and must not ship in WEIGHTS-001B. Keep existing name limits rather than inventing 40 characters.

Five rows in canonical order: checkbox + icon + sphere label + immediate numeric value + native discrete range control, min=1 max=10 step=1, with numeric entry/stepper alternative for accessible adjustment. One shared state controls slider and numeric input; do not duplicate contributions. Numeric text may be temporarily blank while editing but Save rejects it; do not coerce blank/invalid to 0, clamp silently or round fractions.

Selecting a previously unselected sphere assigns 5. Deselect sets stored draft value to 0; reselect starts at 5 (no hidden retained number). Unselected row shows «Не выбрана — вклад 0» or a dash with accessible explanation; its range/number controls are disabled or removed from the tab order, never an enabled 1 as shown in the concept. All five can be selected with independent 10s. Keep selected/default/origin states understandable without color alone.

Hint: «Ваша личная оценка вклада привычки в выбранную сферу: от 1 до 10. Значения независимы, их не нужно складывать до 10 или 100». End labels: «Небольшой вклад» / «Очень значимый вклад». Units, not percentages. For old definitions show «Значения по умолчанию: 5. Изменения повлияют только на новые записи». Describe snapshots: «История сохранит прежние значения».

Checkbox labels, range and numeric control labels identify the sphere and units; use fieldset/legend and described hint/errors. Space toggles selection; arrows adjust native slider by 1, Home/End select 1/10; number entry/stepper and keyboard arrows have the same validation. Visible focus, sufficient hit areas/contrast, screen-reader value/min/max and reduced-motion behavior are required. Avoid a live announcement on every drag event; native value semantics and a polite save result suffice.

Save validates name, selected count and all values/profile; focus first invalid field, keep draft on persistence failure, show inline Russian error and permit retry. Cancel/Escape follows existing busy/focus-return/modal behavior and writes nothing. Disable repeat Save while busy. Create and Edit use the same controls/state/validator. Normal logging remains one action with no intensity/contribution popup.

At desktop and narrow widths keep numeric feedback beside the sphere and allow control wrapping without horizontal scroll; scroll dialog body while keeping Save/Cancel reachable. Compare real renders to reference without adding absent product features.

## 7. Future pure deterministic analytics contract — proposal

Future function: projectSphereContributions(events, {startDay, endDayExclusive, asOfDay, weekStartsOn, trendWeeks}). Inputs are validated saved journal snapshots and explicit Gregorian local-date boundaries; trendWeeks is an integer 4–8. No live habit join, wall clock, AI, random source or timezone conversion from recordedAt. Period grouping uses occurredOn, including backdated records; use calendar arithmetic across leap days/DST, not fixed 24-hour timestamps. Proposed default weekStartsOn=1 (ISO Monday; allowed 1–7); caller passes it explicitly. Validate real date strings and startDay<endDayExclusive. Period aggregates cover the supplied half-open range; the trend subseries separately covers the requested complete weeks before asOfDay. The caller supplies the saved journal events for the union of those windows; the pure function does not fetch or imply unseen history. Full-week trends use the last N complete weeks ending at start of the current week determined by an explicit asOfDay; any partial current week is separately labeled, never compared as a complete week.

For known-profile events in the half-open period: units[sphere,day] = sum of event.snapshot.values[sphere]. Weekly/period units are sums of daily units. Multiple distinct habit records on a day add; do not deduplicate numeric units by sphere/day. Only the separate binary rune deduplicates sphere/day. Equal repeated event IDs count once; conflicting rows with the same ID or duplicate habit/day violate the input contract and fail rather than produce order-dependent results. Return stable sphere/date ordering; input order cannot affect results.

Include origin=user AND legacy-default. Return per bucket and whole period:
- unitsBySphere and totalUnits (integers, before display rounding).
- recordedEventCount, includedEventCount, userOriginCount, defaultOriginCount, excludedLegacyCount.
- per-sphere numericSelectedEventCount and legacySelectedEventCount.
- hasNumericEvidence; missing calendar buckets retain counts=0 and are not described as failed days.
- share per sphere as exact numerator=units[s], denominator=sum(all units); derive displayed percentages only when denominator>0. For zero denominator return null/«Нет числовых данных», never five 0% grades or equal 20% guesses.

Legacy NULL events remain in recorded/binary history and excludedLegacyCount, not summed as zero/5. A period containing only old activity yields zero known summed units with hasNumericEvidence=false, null shares and positive excluded counts: it does not mean no real activity occurred. Default-origin future entries are included and disclosed as owner-approved defaults, not explicitly calibrated measurements. No destination/current-habit profile may fill gaps.

Synthetic arithmetic oracle: guitar {mind:7,recovery:3} plus practice {body:8,mind:2}, each on the same day, gives body8/mind9/relationships0/work0/recovery3, total20; relative shares40/45/0/0/15%. These are shares of RECORDED SUBJECTIVE UNITS, not editing percentages or scientific balance. An all-five value10 event totals50; seven such events total350 units but still only35 binary sphere-days.

Backdated addition/cancellation and habit edits require reprojection from journal snapshots; editing a habit alone never changes totals. Compare equal-length completed windows, exposing counts/defaults/unknown exclusions and subjective scale changes. No interpolation of legacy weights, missing-day imputation, reward/rarity hooks, health grading or graph implementation here. SPHERE-TRENDS-001 implements/tests the projection and visual output later, after persistence is accepted. Contribution values cannot directly affect artifacts/reward probabilities without separate gameplay approval.

## 8. WEIGHTS-001B implementation task — queued, separate PR

Entry gate: owner review of this contract, reverify latest master and next migration number. Changes remain limited to contributions, existing habit form/logging and native backups; no trends UI/primary-icon feature/progression. Internal steps within this one feature task:

1. Add pure profile validation/serialization and matching TS/Rust conformance fixtures.
2. Add/register migration 004; prove old rows/archives/history/default origin and atomic restart-safe upgrade. Preserve 001–003.
3. Extend domain/repository mappings, atomic habit writes and one-statement event snapshots; preserve archive/duplicate/backdating/cancellation behavior.
4. Upgrade native backup version dispatcher, v1 adapter, v2 export/preview/safety/restore and bounds together. Do not release weighted writes without working v2 safety/restore.
5. Extend shared Create/Edit form per reference/accessibility contract, reusing existing medallion/sphere art; preserve one-action completion and truthful rune.
6. Run existing+new temporary SQLite/native backup tests, TS/Vite, browser checks and successful Windows CI; produce downloadable EXE. Update documentation with actual evidence and open focused PR.
7. Owner Windows acceptance: upgrade with synthetic legacy fixture; adjust guitar Mind7/Recovery3, save/log a previous date, edit to Mind4, prove older event remains7, archive/reopen offline/restore; v1 import and full v2/safety round-trip in isolated temporary DB/account. Preserve owner data. Stop for review; no automatic merge or SPHERE-TRENDS-001.

## 9. Required WEIGHTS-001B / future analytics test matrix

This matrix was planned by WEIGHTS-001A. [WEIGHTS_001B](WEIGHTS_001B.md#w01w26-evidence-map) maps W01–W26 to actual automated evidence and pending owner native checks. T01–T05 are still future, not implemented.

| ID | Layer / fixture | Required outcome |
| --- | --- | --- |
| W01 | Domain: one sphere, all five, endpoints 1/10/default 5 | Valid; independent totals, max 50, no normalization |
| W02 | Domain: empty name/selection, selected0/11/-1/1.5/string/bool/null/NaN | Reject with correct field; stored state unchanged |
| W03 | JSON: unknown/duplicate/missing key, unsupported version/origin, mismatch to own sphere set, all-zero | Reject; never interpret as legacy or truncate |
| W04 | Origin: legacy-default with selected values other than5 | Reject; only explicit form save can produce user-origin |
| W05 | Existing schema1/2/3 temporary databases including archived sample and Oct26–27 records | Migrate through4; original IDs/names/order/archives/activity snapshots remain; old numeric snapshots null |
| W06 | Fresh install, empty/subset-restored DB, restart repeatedly | Defaults seeded once only; no restored/archived sample reactivation |
| W07 | Inject migration failure during backfill/invalid legacy data | DDL/backfill/ledger roll back; restart can retry safely |
| W08 | Create/edit/reopen; invalid edit/canceled form/failed SQL | Full valid profile persists atomically; old state preserved on failure/cancel |
| W09 | Legacy default habit logs before/after first valid Edit Save | Before: included legacy-default 5; after: user-origin; old event origin untouched |
| W10 | Rename/sphere/value edits after logging | All old name/sphere/profile/origin snapshots unchanged |
| W11 | Backdated creation and cancel/re-add after edit | Recording-time profile; re-created event gets current profile; no implicit backfill |
| W12 | Duplicate retry and concurrent habit edit/log | First record unchanged; coherent old/new snapshot, never mixed fields |
| W13 | Archived habit rejects new log; restore/reopen | Same profile/origin retained, history intact; logging reenabled |
| W14 | v1/schema 3 strict backup including empty/archived/legacy-history fixtures | Restore accepted; imported defaults only on definitions, history null; no destination-profile borrowing |
| W15 | v2 round-trip, mixed user/default/null, historical spheres differ from current habit | Full equality of all fields/metadata/origins/null after reopen |
| W16 | v2 required-null versus missing, profile mismatch, extra fields, future version/schema | Reject before mutation; never silently discard |
| W17 | v1 extra contribution fields / duplicate JSON members | Strict reject; v1 parser not weakened |
| W18 | Native full replacement and v2 protective backup of weighted destination, then undo | Pre-state including all weights recoverable; no merge; retained migration ledger |
| W19 | Safety write/readback failure, post-delete/mid-insert SQL failure, crash before commit | No partial new/old state or weight loss; existing rollback guarantees retained |
| W20 | Cancel picker/preview, stale token, modified source after preview | No mutation; typed validated cached snapshot wins |
| W21 | Size/row/string bounds including new JSON bytes and malformed JSON | Clear rejection; no truncated export/restore |
| W22 | UI select/deselect/reselect, all five; slider↔number synchronization | 5 on selection, 0/disabled off, reselect5; no percentages/intensity field |
| W23 | Keyboard/screen reader/errors/busy/retry/cancel/focus return | Accessible values and exact selection, no save on cancel or duplicate submission |
| W24 | Desktop/narrow actual comparison to supplied concept | Compact layout, reachable controls, existing art unchanged; no description/icon-picker scope creep |
| W25 | Existing 50 Node/150 browser/16 native safety tests and binary rune scenarios | Retain applicable baseline coverage; weighted magnitudes/origins do not alter rune coverage/states |
| W26 | Native Windows offline upgrade/reopen/archive/backup dialogs | Owner acceptance + successful CI EXE; no owner-DB automation |
| T01 | Future pure projection: arithmetic oracle and all-five 10 maximum | Exact integer totals/shares; no normalization or binary dedup in units |
| T02 | Future projection: legacy-only/mixed/default-origin/zero events | Exclusion/default counts and null no-data shares; future defaults included |
| T03 | Future projection: reordered identical input, duplicate/conflicting IDs, duplicate habit/day | Deterministic equality or explicit integrity error; no inflated totals |
| T04 | Future grouping: local dates, DST/leap/year boundaries, 4–8 complete weeks, partial current week | Calendar-correct half-open buckets; no hidden now/timezone shift |
| T05 | Future edits/backdated add/cancel and provenance/count labels | Rebuild from snapshots, no legacy imputation; no health/reward interpretation |

T01–T05 are gates for SPHERE-TRENDS-001, not a request to implement analytics in WEIGHTS-001B. All delivered check counts/results must be actual, not copied from this plan.
