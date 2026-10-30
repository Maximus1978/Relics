# PROGRESS-001 REVISION — habit forging and independent medal states

## 1. Authority, baseline and review gates

Status as of 2026-10-30: **documentation proposal; no runtime implementation**. The owner's PROGRESS-001 REVISION brief supersedes conflicting earlier progression proposals. [PR #10](https://github.com/Maximus1978/Relics/pull/10) is merged; current master verified as 8503670a31b8adc74bac61b6a84826e6772664eb (parents 39af6b78 and db1d2f7). Owner reports native NAV-CHRONICLE-001 acceptance. Its earlier review holds are historical.

| Status | Scope |
| --- | --- |
| Implemented / owner accepted | Habit management, one completion per habit/local day, backdating, immutable name/sphere/contribution snapshots, schema 4, v1-import/v2-export/recovery, binary Sanctuary rune, snapshot trends 1/4/8, dedicated Chronicle |
| Approved direction, not implemented | Five independent habit dimensions; intended daily/three-weekly/weekly rhythm; six materials; manual icon independent of spheres; layered card states; collapsible inventory/analytics |
| Proposed for owner review | Cycle calendar, interruption allowance, protected checkpoints, thresholds, phase cutoffs, Resonance curve, frequency boundaries, correction/award retention, legacy enrollment, archive pause representation, migrations/backup sequence |
| Deferred | Actual engine, medal/icon assets, card redesign, collapse controls, frequency persistence, numeric Balance, rewards, Vacation implementation, audio, Adventure/Android |

No runtime code, schema, tests, artwork, dependencies or secret content changes in this task. All examples below are synthetic design oracles, not executed application behavior. [Russian review package](PROGRESS_001_REVIEW_RU.md). The numbers below must NOT be treated as approved merely because this PR is merged: explicit owner decisions P01–P09 in section 12 gate the dependent implementations.

## 2. Domain separation

| Dimension | Meaning and source | Can change due to absence? |
| --- | --- | --- |
| Habit definition | Stable ID; editable name, manually chosen icon, sphere membership, independent subjective 1–10 profile and intended frequency | Definition changes only by explicit edit |
| Mastery | Permanently earned material and acquired detail phase; proposed durable milestone receipts | Never loses material/earned engraving merely through absence |
| Forging | Unfinished practice-cycle credit toward next permanent milestone | Proposed grace/checkpoint policy below; no loss of journal or earned stage |
| Resonance | Temporary recent participation relative to intended rhythm, evaluated at explicit local today | Gentle fading only; never changes material or selected-date truth |
| Selected-day completion | Is an actual saved event present for selectedDate? | Independent date-specific binary observation |

Contribution units remain subjective benefit, not time, exertion or XP. Neither larger units, more selected spheres nor changing an icon multiplies practice credit. All five canonical IDs remain body/mind/relationships/work/recovery. The central Sanctuary rune and selected-date gemstones keep their accepted independent temporal calculations and fixed art. Habit Resonance is NOT the rune's seven-day coverage.

No engine can infer whether unrecorded real-life practice occurred. Internal shortfall below means insufficient logged evidence for a proposed forging cycle, never a diagnosis of failure. Ordinary activity logging stays useful and one action, even before a rhythm is configured. No catch-up queue, mandatory login, streak warning or automatic recommendation.

## 3. One cycle clock, two Forging models (P01/P02)

### Proposed cycle contract

Use complete Monday–Sunday local-calendar weeks for all three rhythms. Frequency is a count intention, not booked weekdays: target distinct recorded habit-days per eligible complete week is 7 (daily),3 (three times/week),1 (weekly). Do not prorate or round partial weeks. Each successful cycle contributes **one practice-cycle unit**, capped at 1 regardless of extra events/spheres/units. A target is not a health norm.

A cycle is evaluable only after its Sunday has ended relative to explicit today, all seven days share one applicable frequency segment, the habit is enrolled, and no day is excluded by a known archive/vacation pause. Current/initial partial/mixed/paused weeks are neutral: no unit, no shortfall, no grace reset/consumption. Re-evaluate closed cycles on backdated edits, cancellation, reopening and restore. Local YYYY-MM-DD arithmetic, not elapsed 168 hours, handles DST/leap/year boundaries.

A closed eligible cycle with fewer than its target distinct recorded days gives no unit. **One such cycle is tolerated**: hold unfinished credit. A second consecutive eligible shortfall interrupts the unfinished run. A successful cycle clears the shortfall run; neutral cycles leave it unchanged. This is a proposal, not a deployed deadline system. Six daily entries do not secretly count as seven; repeated6/7 weeks do not advance this candidate. That deliberate tradeoff requires owner review; show no red missed-week indicator. Both models use exactly this same cycle/tolerance rule.

| Model | After two consecutive eligible shortfalls | Permanent achievements | Tradeoff |
| --- | --- | --- | --- |
| A: successful cycles, material checkpoints only | Reset unfinished credit to the earned material's starting threshold | Retain earned material and already acquired phase appearance | Simple counter, but repeated work can be required behind an unchanged earned engraving; visible/current progress may disagree |
| B: successful cycles plus protected phase checkpoints — recommended | Reset only credit above the most recently acquired phase/material checkpoint | Retain earned material and every acquired phase | Slightly more milestone receipts; smaller lost tail and clearer correspondence between earned detail and protected practice |

Neither removes event records, historical analytics or earned art. No negative XP. Model B fits the reference's three acquired detail phases and reduces the emotional cost of interruptions. The owner has **not** approved either reset policy. If reset is rejected, return to a separate policy review before engine code; do not silently replace it with a third model.

### Recommended deterministic fold (Model B, still proposed)

Inputs: validated journal, effective frequency segments, known pause intervals, already earned milestone receipts, explicit today, rulesVersion. Sort closed cycles by start date; sort/validate event identities, reduce to distinct(habitId,occurredOn). Per habit fold state is frontier F, protected checkpoint P, consecutive shortfalls S; initial values 0. F is advancement along the current crafting path, NOT a monotonic lifetime event total. A separate lifetime event count is already derivable and is not XP.

1. Neutral cycle: no changes.
2. Successful eligible cycle: F = F+1, S=0. Each reached phase/material threshold becomes a proposed receipt and advances P to that threshold.
3. First shortfall: S=1, hold F/P.
4. Second shortfall: S=2, set F=P. Further shortfalls leave F=P; the next success increments F and clears S.
5. For correction replay, persisted permanent receipts are injected at their historical award cycle end, never at the beginning of history. After folding that boundary cycle, set P=max(P,receiptCheckpoint) and F=max(F,P), leaving S based on the corrected cycles; never seed this checkpoint into earlier cycles. Retain it even if the corrected journal no longer supplies the original evidence; return an explicit retained-after-correction flag. No duplicate credit for re-crossing that checkpoint. Derive pending new milestones only when a newly evaluated frontier exceeds retained checkpoints.

The pure projector emits candidate receipts but never writes them or awards items. Application/native code later persists validated new receipts atomically against the journal/frequency input revision, then refreshes. Read-only rendering cannot mint awards. Catch-up offline evaluation uses closed historical cycles, never fake completion rows. Algorithm/threshold upgrades need an explicit version transition, not silent re-awarding.

### Exact worked interruption examples

Letters Q/U denote logged-evidence-qualified/under-target complete eligible cycles, not judgments about the user. Weeks are one-based from a Monday enrollment with no pauses, edits or corrections.

| Practice / sequence | Recorded evidence | Model B result |
| --- | --- | --- |
| Daily English, weeks1–3 |7 distinct days each week | F=1,2,3; Copper phase 1 at end week 3 |
| Gym three/week, weeks1–3 | Mon/Wed/Sat,3 distinct days each | Same F=1,2,3; Copper at week 3; no booked weekday obligation |
| Cycling once/week, weeks1–3 | One day each, possibly different weekdays | Same F=1,2,3; Copper at week 3 |
| One missed opportunity, after F=4/P=3 | English6/7, gym2/3 or cycling0/1 in week 5 | U: hold F=4/P=3,S=1; no material loss; next Q gives F=5 and protected Copper phase 2 |
| Multiple missed opportunities in one week | English4/7 or gym1/3 | One U cycle, not one penalty per absent day; F held; weekly habit has only one intended opportunity |
| Two consecutive under-target weeks | At F=4/P=3, week 5 U, week 6 U | F4 then3; lose only 1 unprotected unit; keep Copper phase 1; model A also3 here |
| Difference between models | Earned Copper phase 2 at 5, then F=6; two U cycles | A resets F to3 while retaining acquired phase 2 art; B resets F to5; model B keeps the actual checkpoint |
| Extended inactivity | At F=13/P=12, six eligible empty weeks | First holds13; second resets12; remainder stay12. Bronze phase 2 remains. No growing debt |
| Return after that absence | Next two complete qualified weeks | F13 then14; no catch-up task; third qualified week reaches Bronze phase 3 at 15 |
| Continued shortfall | Daily6/7 every complete week, starting Stone | No qualified cycle, no advancement; still no confirmed-life-failure inference. This strict eligibility is a review question, not a disguised automaticity claim |

All proposed resets affect only unfinished Forging, never earned material/phase or history. Explicit Vacation Mode will neutralize paused weeks, not synthesize successful weeks. It remains unimplemented; do not use undocumented absence as vacation.

## 4. Thresholds, calendar fairness and detail phases (P03)

The earlier candidate0/7/21/50/120/250 is not an approved rule and its counter was undefined. If it meant raw occurrences, minimum times (without gaps, rounded up) would be:

| Material | Old candidate events | Daily days | Three/week weeks | Weekly weeks |
| --- | --- | --- | --- | --- |
| Stone |0|0|0|0|
| Copper |7|7|3|7|
| Bronze |21|21|7|21|
| Silver |50|50|17|50|
| Gold |120|120|40|120|
| Platinum |250|250|84|250|

If the same old numbers meant common weekly cycles instead, daily and weekly Platinum would both take250 qualified weeks (~4.8 years). Neither interpretation is silently adopted.

**Recommendation for review:** cumulative crafting frontier thresholds0/3/9/18/36/72 successful weekly cycles. Same successful calendar duration for every intended rhythm; effort differs appropriately. They are game pacing proposals, not scientifically validated habit formation, and pauses/shortfalls can extend them. Monday enrollment, continuously qualified/no reset is assumed:

| Material | Threshold cycles | Daily English | Gym3/week | Cycling1/week |
| --- | --- | --- | --- | --- |
| Stone |0|At enrollment|At enrollment|At enrollment|
| Copper |3|3 weeks /21 recorded days|3 weeks /9 days|3 weeks /3 days|
| Bronze |9|9 weeks /63 days|9 weeks /27 days|9 weeks /9 days|
| Silver |18|18 weeks /126 days|18 weeks /54 days|18 weeks /18 days|
| Gold |36|36 weeks /252 days|36 weeks /108 days|36 weeks /36 days|
| Platinum |72|72 weeks /504 days|72 weeks /216 days|72 weeks /72 days|

Real enrollment off Monday adds up to6 neutral initial days; no earned unit from a partial week. Counts in this table are eligible practice days, not weighted sphere units. Changing3/week toweekly never retroactively lowers prior targets.

### Three deterministic acquired phases per material

| Material | Phase 1/2/3 frontier checkpoints | Reference craft direction |
| --- | --- | --- |
| Stone |0 /1 /2|Rough → shaped → engraved stone|
| Copper |3 /5 /7|Simple forging → refined edge → first ornament|
| Bronze |9 /12 /15|Structure → carved accents → motifs|
| Silver |18 /24 /30|Clean form → deeper engraving → refined ornament|
| Gold |36 /48 /60|Engraving → precise relief → finished gold|
| Platinum |72 /84 /96|Advanced craft → intricate detail → refined brilliance|

Phase 3 remains until the next material threshold; Platinum phase 3 at 96 is the terminal ordinary-medal craft state, not a seventh material or rarity tier. The twelve-cycle post-Platinum phase spacing is another provisional pacing choice. MasteryTier and earnedPhase are durable attained milestones; Forging is the unprotected tail to the next checkpoint. Acquired engravings do not disappear when the tail resets or Resonance fades. Model B protects each phase checkpoint. The owner prefers three phases but has not approved these cutoff numbers.

These are six material treatments of one recognizable ordinary medal family. Controlled additive ornament can evolve by tier/phase; it is not six random unrelated reward objects. Each frame/material variant shares center-icon registration. Ordinary craftsmanship stays visually subordinate to truly authored unique Artifacts.

## 5. Effective frequency history and lifecycle (P04/P05)

### Minimal proposed definition history

A frequency segment contains id, habitId, rule(daily|three-per-week|weekly), effectiveOn(local date), rulesVersion. It is not a duplicate Habit. Current/effective rhythm is derived by greatest effectiveOn <= occurredOn, never by current selected frequency. Entry name/sphere/profile snapshots still follow the **current persisted habit definition at record creation**, including for backdated entries. Rhythm history answers a different question: what intended rhythm applies to the occurrence date? No event-frequency snapshot is required for this proposal.

Legacy habits start with no rhythm segment (unconfigured), not a fabricated Daily rule. Logging/archive/restore/chart/rune work unchanged. A one-time explicit rhythm enrollment applies from local today; any initial partial week is neutral. Existing events before enrollment remain real history, with no inferred rhythm/Mastery credit. Whether optional explicit historical enrollment should ever be offered is deferred, not part of MVP.

Later frequency edits take effect **next Monday strictly after actual local today**. UI explains current rhythm and pending date. No retroactive effective-date editor. Preserve applied segments; edits targeting the same future effectiveOn replace the one pending row atomically with stable segment ID. Two edits the same day do not create two segments, grant units or move the boundary. New weeks with different effective dates append rows, preserving previous rules. A pending change may be canceled before it starts; applied history is immutable. Name/icon/sphere-only edits never schedule rhythm changes.

At an effective change boundary, retain F/P/material/phase, clear S, and evaluate only future complete cycles using the new rule. Do not give a boundary bonus or reset earned credit. This recommends continuation (not restart) because legitimate reduced frequency is not a transgression; checkpoint/reset policy still applies to later shortfalls. Frequency switches cannot produce more than one unit per calendar week, reprice old cycles or generate multiple grants. Choosing a sustainably easier rhythm is allowed. A person can always self-report invented activity, so anti-exploit limits should not become surveillance/cooldown punishment.

| Edge case | Deterministic proposed result |
| --- | --- |
| Several changes | Ordered effective segments; each occurrence joins its actual-date segment; closed earlier cycles retain original targets |
| Two edits on one day | One next-Monday pending row, last validated save wins; atomic update; no applied-row overwrite |
| Cancel and re-record same old habit/day | Current physical cancellation remains; new event ID and current name/sphere/profile snapshot; same occurredOn rhythm lookup; one eligible habit-day, never double credit |
| New backdate before a frequency change | Current definition snapshots, old effective rhythm for that date; does not reclassify earlier stored snapshot fields |
| Backdate before enrollment | Journal/analytics/rune show actual occurrence; no invented earlier rhythm or cycle credit |
| Offline restart / missed evaluation | Rebuild closed cycles with explicit local today; persist each eligible new achievement once; no network/required daily launch |
| Archive / restore | Stop logging at repository level; preserve all definitions, segments, receipts and history; pauses described below; restoration does not auto-seed/reactivate others |
| Backup restore | Atomically replace all supported input histories/receipts, then recompute; cannot infer missing old rhythm/awards from modern settings |

### Worked boundary and correction example

Synthetic habit H enrolls daily Monday2026-11-02. Weeks starting Nov2,9,16 with7 days each give F3/Copper. Nov23 week has7 days, F4. User schedulesweekly on Nov25, then changes that pending choice tothree-per-week on Nov26: exactly one segment starts MondayNov30, older daily segment remains. Nov30/Dec2/Dec5 entries qualify that week and give F5/Copper phase 2; no daily reinterpretation.

On Dec8, record a backdated Nov24 entry after canceling the old entry. The new name/icon choice/spheres/contribution profile are today's definition (icon is not an activity snapshot in the minimal proposal); occurredOn Nov24 still evaluates under Daily. Its original cancellation may turn Nov23 week into6/7; re-recording returns7/7. Replays change incomplete evidence/Forging deterministically. If Copper phase 2 was already earned, the recommendation retains its receipt/art and flags corrected evidence, rather than stripping it. If it was never earned, a corrected qualifying week can produce one new award after atomic validation. Restoring the canceled event does not grant Copper phase 2 twice.

A weekly switch instead would permit one occurrence from Nov30 onward, still only 1 cycle unit/week; earlier Nov23 requires7. No old contribution snapshots are recomputed from current values.

### Archive pauses and future Vacation compatibility

Current archivedAt alone cannot reconstruct past archive periods. Smallest adequate proposal adds nonoverlapping per-habit pause intervals with local startOn/endExclusiveOn(nullable while open), stable ID and reason=archive; future explicit vacation can use a separately approved interval adapter. Archive atomically opens today's pause and sets existing archivedAt; restore closes the pause at local today and clears archivedAt. A same-day archive/restore leaves no excluded calendar day; remove/ignore a zero-length interval. Any cycle intersecting a positive pause is neutral, no partial credit. Schedule changes during a pause apply on their scheduled boundary; no cycle can earn until fully evaluable again.

Legacy already-archived habits get an open interval starting explicit upgrade local today, with provenance=legacy-current-archive (not guessed previous vacations/archives). They have no rhythm credit before later explicit enrollment anyway. Historic archive gaps not captured by old schema stay unknown. Active legacy habits get no invented pause. Future pause/correction/effective-date validation must cover clock going backward: reject an end before start and ask for clock correction, never silently corrupt the interval. Explicit pause neutralization is a proposal awaiting approval, not current vacation behavior.

## 6. Resonance proposal (P06)

Use one modest frequency-relative recency function; no phase/tier/unit multiplier. At explicit actual local today, choose effective current rhythm target f in{7,3,1}. Let expectedGap=7/f calendar days and age be nonnegative calendar-day distance from the latest actual recorded participation date since enrollment (even in an unfinished/under-target cycle), at/before today (not the logging selectedDate).

Proposed energy R = max(0, 1 - age/(2*expectedGap)); no participation =>0; pause => quiet cosmetic paused state, not fabricated energy. This yields daily age0/1/2 =1/.5/0; three-weekly age0/2/5 =1/(4/7)/0; weekly age0/7/14 =1/.5/0. Latest record, not number of same-day events, controls recency. Future repeated sessions do not stack R. Do not show this internal normalized parameter as a health percentage or Balance grade.

At a frequency boundary the current cadence may change the current light without changing earlier rule history or material. Archiving suppresses optional active halo; restoration derives R from real dated participation and new current time (no automatic refill). Selected historical completion remains a separate checkmark. Travel/timezone changes use stored local occurrence strings, not re-dating old events; actual today is supplied explicitly. Afterglow and true vacation visuals are separately approved future layers, not a second invented Resonance source.

This curve, two-gap horizon and handling during pauses are **unapproved**. The projector must expose its inputs/version and keep current-window binary rune untouched. No actual Resonance UI should be integrated until its rule is approved and tested.

## 7. Visual contract and interaction composition

Reference: owner board codex-clipboard-b3816081-6934-4e0e-8e7f-e14705dcfec3.png, provided2026-10-30; [reference contract](art/HABIT_MEDALS.md). Read the written revision above picture labels: grayscale preview examples do **not** authorize full-medal grayscale. Green saved confirmation remains green even on a subdued card. No new assets created/copied here. The accepted central medallion/shrines/environment remain unchanged.

~~~mermaid
flowchart TD
  H[Stable habit identity] --> I[Manual icon with fixed center registration]
  J[Journal + effective rhythms + pauses + explicit today] --> E[Versioned pure cycle projection]
  E --> F[Unfinished Forging tail]
  E --> A[Atomic permanent milestone receipts]
  A --> M[Material + acquired phase geometry]
  J --> R[Recent habit Resonance light]
  D[Selected date + saved event] --> C[Green completed checkmark]
  U[Hover / keyboard / press / reduced motion] --> X[Interaction emphasis]
  M --> V[Layered ordinary habit card]
  I --> V
  R --> V
  C --> V
  X --> V
  J --> S[Existing rune / stones / charts unchanged]
~~~

The diagram's persistence arrows are planned architecture, not code delivered by this PR. For the existing central rune only illumination varies; future ordinary medal geometry evolves by permanent tier/phase. Do not conflate those separate objects.

| Layer | Parameters | Invariant |
| --- | --- | --- |
| A Permanent base | tier 6 × acquiredPhase 3, material texture/controlled ornament | Earned geometry/engravings persist; true metal readable even when subdued |
| Identity | curated iconId; shared bounding box, stroke/alignment | Manually chosen, material-appropriate stroke/relief, never sphere-colored or sphere-replaced |
| B Resonance | continuous light R0..1, inner/rim/halo intensity | No silhouette/material/engraving changes; no fake score |
| C Selected-day | recorded/not-recorded + pending persistence | Saved => green corner check and accessible state; unrecorded => no check, subdued but identifiable metal |
| D Interaction | rest/hover/focus/pressed, disabled/archive, reduced motion | Focus ring visible; hover never a check; immediate pressed feedback; no animation required |

Test composition with fixtures only until real engine exists: all 6 materials ×3 phases ×3 representative Resonance values(0,.5,1) ×2 completion states ×4 interaction states =432 ordinary active combinations, plus archive/disabled/pending/error and reduced-motion variants. No bitmap per combination: parameterized CSS/SVG/light layers and registered base assets. Focus/hover must not grayscale the material, overwrite completed green check, imply rarity or activate daily sphere stones. Visually inspect a representative contact sheet plus DOM/state/accessibility assertions over the full matrix in HABIT-SIGILS/PROGRESS-002B; no synthetic data may masquerade as live progression.

## 8. Compact cards, manual icons and collapse contracts

### Habit cards (future HABIT-SIGILS-001 / PROGRESS-002B)

Plan label «Печати привычек» (existing accepted label direction, owner may approve a different final label before implementation). Each card contains canonical ordinary medal, manually chosen center icon, name, compact canonical sphere indicators, saved green corner check, separate management menu. Keep current Create/Edit contribution controls and historical date support.

Use a native primary button occupying the card's main surface, with a **sibling** management button/menu, never nested interactive elements. Accessible name contains habit name/date and action; aria-pressed reflects only persisted completion. Space/Enter and one synthesized click activate, not parallel pointerup/touchend/click handlers. Pending operation disables duplicate activation and explains busy state. A saved record appears completed only after successful storage. Error preserves prior state and offers retry. Menu use must not toggle the underlying action; focus returns to its trigger.

On recorded cards the primary action is discoverably «Отменить отметку» in accessible name and visible focus/hover/helper copy; a persistent compact label/hint explains «Нажмите ещё раз, чтобы отменить отметку». Explicit same-card re-toggle is the simple correction path. Cancellation persists before removing the check. It uses existing physical cancellation; **no promised post-delete Undo, tombstone or new confirmation**. Unintended toggle can be corrected by recording again (new ID/current snapshots, disclosed; it is not byte-identical undo). Owner must approve this discoverability in visual acceptance. Archived cards expose restore/menu, never logging; domain guard remains authoritative even with stale UI. Do not destroy data by clicking a decorative or management area.

### HABIT-ICONS-001 scoped inside HABIT-SIGILS-001

One curated line-icon library, proposed IDs: generic-sigil(default), walk, strength, book, language, guitar, bicycle, conversation, work, sleep, meditation, creativity. Exact glyph set/art pending visual gate; do not generate assets here. Every material uses the same normalized center box/stroke grammar; no random icon generation. New habits explicitly start generic until manually chosen; existing active/archived habits get generic-sigil with legacy-default provenance, not sphere-derived inference. Owner can change name/icon/spheres/profile/rhythm on the same stable habit ID. Spheres/sliders never change preview icon. No activity icon snapshot is added merely for this gallery; Chronicle remains historical name/sphere/profile truth and current established presentation. Historical icon appearance, if ever desired, needs a separately approved schema/backup task.

### UI-COLLAPSE-001 standalone

Inventory and Life Rhythm independently expanded/collapsed, kept across navigation; prefer versioned local UI preferences e.g. relics.ui.sections.v1 with two booleans, default expanded. No SQLite migration just for preferences. Use current Tauri webview origin storage, never owner journal data; browser demo preference storage must not imply journal persistence. Storage denial/corruption/version mismatch falls back expanded without blocking tracking; native offline restart acceptance required. Keep heading, counts, Add Habit/archive access and both toggle buttons visible when collapsed; current archive management remains reachable. Use native button aria-expanded/aria-controls, semantic heading, remove hidden content from focus/AX; if collapsing programmatically with focus inside move focus to toggle first. Do not reset selectedDate/chart period/mode/series filters or unmount chart state. Pause expensive drawing when hidden and resize existing chart on expansion. No persistence of analytics choices is implicitly added. Five shrines and central rune are outside both regions. Preferences are device-local, excluded from journal backup and unchanged on restore; document this small limitation. This is only a plan, not an authorized implementation.

## 9. Data, migrations, backup and safety proposal (P07/P08)

Current native baseline is schema 4, migrations001–004 registered, backup export v2/import v1+v2. Keep sqlite:relics.db, local.relics.app, existing IDs, uniqueness, archivedAt, all event snapshots and applied SQL byte-identical. Do not modify existing contribution/rune/trends/Chronicle. Confirm next free migration number immediately before each implementation; numbers below are proposed only, no SQL files created.

| Future increment | Smallest proposed additions | Backup evolution proposal |
| --- | --- | --- |
| HABIT-RHYTHM-001, candidate005 | habit_frequency_segments(id,habit_id,rule,effective_on,rules_version), unique(habit_id,effective_on); habit_pause_intervals(id,habit_id,start_on,end_exclusive_on,reason,provenance). FK/indexes/validation; missing segment means unconfigured | v3/schema 5 requires ordered segment/pause collections, even empty; v1/v2 adapt with no fabricated rhythms, no old-history credit; bootstrap known current archive only using explicit import/upgrade today |
| HABIT-SIGILS-001 / HABIT-ICONS-001, candidate006 | habits.icon_id plus icon_origin(user or legacy-default); no full habit duplication or event-icon snapshots | v4/schema 6 requires icon fields plus v3 histories; old imports get generic-sigil/default provenance; do not drop unknown future icon IDs silently |
| PROGRESS-002A | Pure deterministic projector/tests only; returns proposed receipts; no DB until separately reviewed integration | No format change for a pure calculation alone |
| PROGRESS-002B, candidate007 | habit_milestone_receipts(habit_id,milestone_key,rules_version,earned_cycle_end,recorded_at,basis_digest), unique permanent identity(habit_id,milestone_key); sparse acquired milestones only | v5/schema 7 includes receipts and all prior fields; old imports have no invented earned grants; atomic recomputation may only use documented enrollment history |

Rows denote anticipated schema/format evolution, not deployed promises or a reservation over other migrations. If icon persistence needs a split PR, keep the same single approved contract and avoid shipping art without persistence/backup readiness. Strict native and TS validation must agree; parameterized SQL, allowed rule/icon enums, Gregorian local dates, unique stable IDs, sorted/no overlapping intervals, FK/reference checks, at most one pending frequency segment, valid receipt order/versions. End dates exclusive; null means open interval. Validate applied boundary/history consistency, no event rewrite. No arbitrary SQL/pack scripting.

Habit definition/profile/name/icon and pending-rhythm change save in one pinned native transaction once multi-row updates are necessary. Do not rely on separate frontend BEGIN/COMMIT calls against pooled SQL plugin connections. Single event INSERT...SELECT retains its current atomic snapshots/active guard; event creation plus milestone reconciliation must either share one transaction/revision or have an idempotent durable reconciliation boundary, so a crash between them cannot duplicate or omit an award permanently. Recommendation: native coordinator under existing pool lock, one pinned transaction for mutations+receipt reconciliation; offline restart reconciles pending absent receipts. Pure UI never writes earned state. Review transaction latency with long synthetic histories; optional rebuildable projection caches must be input/version keyed, never authoritative counters.

### Permanent attainment versus corrected evidence (P05)

Pure journal replay alone cannot preserve a previously earned tier after physical deletion of its supporting event. A tiny **milestone receipt set is necessary** for the no-degradation design, not a per-event XP ledger. Store only material/phase attainment with earliest earned-cycle boundary and basis digest; no running XP total, per-click rewards or duplicated aggregate counters. Inject receipts at their award boundary in replay as in section 3. Preserve them after absence and ordinary correction, flag provenance/evidence differences; never edit past journal to justify an award. A newly backdated record can legitimately qualify a previous cycle and first award the next milestone, but reevaluation/re-recording must not award an already earned identity twice.

A backup replacement restores exactly its own journal/segments/receipts, not a hidden union with the destination. Restoring an older backup without awards can omit newer awards, with explicit preview warning and protective current-state copy; that is user-confirmed replacement, not inactivity loss. No fabricated receipts imported from today's definitions. Correction retention and historical-award timing are explicit owner-review gates, not an already approved gaming loophole. AUDIT-001 remains required before consumable resources/artifacts depend on mutable history.

### Backup compatibility gates

1. Every new persisted collection/field gets a versioned native DTO/validator, export, typed import adapter, preview counts and protective-copy coverage **before release**. No drop-on-import or lossy old-format export. Unknown newer schema/format/rules/content fails before mutation.
2. Keep strict supported v1/schema 3 and v2/schema 4 imports. Test chained v1→latest/v2→latest and each new intermediate format. Null old contribution snapshots stay null; habit5/default provenance remains; archived records/IDs/dates/snapshot bytes survive. Old events do not acquire invented frequency/contribution facts.
3. Export under consistent transaction; current target-version safety JSON atomically published, flushed/synced/read-verified before replacement; native pinned full-replacement transaction includes every new table and receipts, FK-safe order. Validate the entire restore snapshot before deleting anything; clear previews/single-use token as currently.
4. Failpoint rollback/crash tests at migration, history writes, safety-file publication, each DELETE/INSERT family, receipt write and COMMIT; reopen must contain all-old or all-new complete state, never half journal/half rhythm. Restored subsets/empty data do not trigger startup reseeding. Recompute projections only after successful commit; errors remain visible in both primary views.
5. Migration failures leave ledger/schema/data retryable together. Recovery copy captures all supported fields and can undo replacement. Limits updated/tested explicitly, no silent truncation. Earlier binaries cannot consume new formats/schema; close them before upgrade, no downgrade promise.
6. Synthetic temporary Node SQLite plus real Rust/SQLx native migration/backup/reopen/crash tests; browser integration tests are labeled mock IPC when applicable; Windows owner acceptance remains separate. Never operate on owner's journal for testing.

### Future unique rewards: idempotency before integration

Ordinary material receipts are not unique Artifacts. Before ESSENCE/DISCOVERY rewards, specify stable grant identity: lifetime scope + stable habit/experience source + authored definition/reward slot. Keep rulesVersion/contentVersion/basis evidence metadata separate from unique semantic identity so reevaluation/version changes cannot re-grant by changing a hash. One-time authored discovery uses unique(lifetimeScope,discoveryDefinitionId); repeatable renewable rewards need separately approved occurrence/slot identity and correction policy. Grant identity must not be a new canceled/re-recorded activity UUID alone. Atomic eligibility+unique insert protects restart/retry/concurrent evaluation; never include real secret recipes in public tests. No artifact rewards/yields are approved here.

## 10. Explicit old versus revised model

| Topic | Earlier state/proposal | Revised contract |
| --- | --- | --- |
| Progress measure | Undefined raw event/XP thresholds0/7/21/50/120/250; progression absent | Rhythm-aware eligible weekly cycles; recommended0/3/9/18/36/72, pending approval |
| Permanence | General no-loss Mastery; no attainment storage contract | Material/earned phase protected; unfinished tail distinct; sparse receipts proposed for corrections |
| Recent activity | Generic recent participation; current seven-day rune already implemented | Frequency-relative habit Resonance proposal, no rune reinterpretation |
| Visual identity | Current first-sphere symbol/common card base | Future manual icon, six controlled materials/three phases; no sphere-color center or full grayscale |
| Selected-day | Current large logging button/illumination | Future green confirmation and full-card primary button, independent menu/focus/glow |
| Rhythm edits | No implemented rhythm | Minimal effective-date history; future-only boundaries; current snapshots never rewrite |
| Lifecycle | archivedAt/current archive, v1/v2 safety; no rhythm pauses | Known archive intervals proposed, future vacation neutralization; versioned full backup evolution |
| Navigation | Older docs still say Chronicle queued | Owner accepted NAV; PR #10 merged8503670; Sanctuary/history separation implemented |
| Spontaneous life | Flexible recurrence vaguely listed | 'Whenever I feel like it' deferred as habit frequency; optional discoveries/experiences separate |

Earlier D015/D019 unresolved scope is refined, not erased; D020 permanence and D046–D048 central-rune art/time remain intact. Earlier PROGRESS-002 monolith/STATE-002/icon-only/naming-only backlog is mapped into small reviewed tasks below, not silently deleted. Independent subjective contributions remain implemented and reward-neutral.

## 11. Implementation sequence and proposed acceptance matrix

One task at a time; dependencies are not authorization. Recommended sequence:

| Task | Scope / gate | Independent deliverable |
| --- | --- | --- |
| PROGRESS-001 (this PR) | Documentation only; owner resolves P01–P09 before affected implementation | One unmerged documentation PR, consistency/link checks, Russian review |
| UI-COLLAPSE-001 | Two independent accessible regions, device-local preferences | Browser/native reopen/navigation/focus/no-reset checks; no SQLite migration |
| HABIT-RHYTHM-001 | Approved enum/effective history/archive pauses, same habit editor, native atomic writes, versioned backup | Data/rollback/crash gates before UI release; no progression score yet |
| HABIT-SIGILS-001 | Canonical frame/material phases + nested HABIT-ICONS-001 curated manual identity + compact card contract | First owner visual gate on layered reference comparison; then small persistence/backup/card PR(s). No fake live progression |
| PROGRESS-002A | Approved pure cycle/forging/Resonance projection and correction receipt input/output | Deterministic synthetic tests; no UI/DB writes; depends on numerical/correction approval and rhythm contract |
| PROGRESS-002B | Real native receipt reconciliation/backup then actual medal/card integration | Data-integrity gate before presentation;432 combination checks/representative visuals + Windows acceptance |
| ARCHIVE-CLEANUP-001 | Hide unwanted archived definitions while retaining refs/snapshots/analytics; optional zero-history delete separate approval | No new logs for archived/hidden; no destructive deletion in this task |
| AUDIO-001 | Sound/event/world-theme/settings/accessibility specification only | Review defaults/assets/playback/persistence; no sound assets or playback here |

PROGRESS-002A can be reviewed separately without shipping partially migrated progression. HABIT-SIGILS must not rely on invented tier values in production before actual engine. Retain ACTIVITY-DETAILS/MODEL, BALANCE, AUDIT, vacation/afterglow/insights, audio followups, essences, alchemy, authored discoveries/Artifacts, Collection, Museum, World Packs/voluntary epochs, optional reflections/microquests and optional Android. [Roadmap](ROADMAP.md) preserves all small tasks. World roster Sanctuary/Clockwork/Wasteland/Verdant is unchanged. No automatic reward formula, sixth sphere or 'log every little moment' experience system.

### Future implementation tests (design matrix; NOT executed here)

| ID | Test oracle / required evidence | Task |
| --- | --- | --- |
| P-T01 | Same journal/segments/receipts/today/version produce identical fold under input permutations; duplicate IDs conflict explicitly | PROGRESS-002A |
| P-T02 | Daily7,three-weekly3,weekly1 distinct days give exactly1 per full cycle; excess/weights/all-five cannot multiply | PROGRESS-002A |
| P-T03 | Initial/current/mixed/paused weeks neutral; leap/DST/year and explicit today stable; selectedDate never reanchors | RHYTHM/002A |
| P-T04 | First shortfall holds; second clears only unprotected tail; extended gap no increasing debt; return examples section 3 | PROGRESS-002A |
| P-T05 | All thresholds/phases including Platinum cap; every acquired material/engraving remains after absence | 002A/002B |
| P-T06 | Repeated/same-day pending edits produce one effective row; no past rewrite/multiple weekly credit; F/P continuation boundary | RHYTHM/002A |
| P-T07 | Cancel/re-record/backdate before enrollment/change; current name/profile snapshots vs historical frequency join; no duplicate milestone | 002A/002B |
| P-T08 | Receipt at original award boundary, retained after correction; current evidence flag; no boosting early cycles by seeding final checkpoint | 002A/002B |
| P-T09 | Archive/restore intervals, same-day empty interval, legacy archived/no-history defaults, offline mid-gap and future vacation adapter | RHYTHM/002A |
| P-T10 | Resonance daily/three-weekly/weekly exact section 6 values, old selectedDate/paused/archive/current cadence; material/check independent | PROGRESS-002A |
| P-T11 | Additive old schema 4 upgrade/retry; invalid segment/overlap/date/FK/clock rejection; applied001–004 unchanged | RHYTHM/002B |
| P-T12 | Every supported v1/v2/new-format round trip, null legacy/default-origin/IDs/archive/snapshots/segments/icons/receipts preserved | All persistence increments |
| P-T13 | Full replacement/subset/empty/no reseed; native safety restore; rollback/crash at every mutation boundary gives all-old/all-new | All persistence increments |
| P-T14 | Native stale-input/concurrent reconcile/retry/restart one receipt; no UI evaluation side effects, reject unknown versions | PROGRESS-002B |
| P-T15 |6×3×3×2×4 active visual matrix plus archive/pending/error/reduced motion; no grayscale/no false hover check | SIGILS/002B |
| P-T16 | Manual default/edit icon independent of spheres/weights/rhythm; shared center registration/material stroke; rename stable ID | HABIT-SIGILS/ICONS |
| P-T17 | Card Space/Enter/touch once; sibling menu never logs; persistence error no green check; accessible re-toggle correction | SIGILS/002B |
| P-T18 | Historical-date completion, archived domain guard, menu focus, existing one/habit/day, unchanged rune/analytics/Chronicle | Every UI increment |
| P-T19 | Two independent collapse prefs across navigation/offline reopen, missing/blocked storage fallback; essential actions/AX/focus; chart resize/no state reset | UI-COLLAPSE |
| P-T20 | Stable one-time grant identities under correction/re-record/version/retry; no actual recipes or artifact grants in current scope | Before reward integrations |

## 12. Owner decisions required before dependent code

| ID | Proposed answer, NOT approval | Blocks |
| --- | --- | --- |
| P01 | Complete Monday weeks, targets7/3/1, one unit/week, no partial prorating; no inferred credit before explicit legacy enrollment | Rhythm/progression evaluation |
| P02 | Model B; first under-target cycle holds, second resets only above earned phase checkpoint | Forging engine/phase contract |
| P03 | Cumulative0/3/9/18/36/72 and exact phase checkpoints incl Platinum 84/96 | Progression pacing and earned art mapping |
| P04 | First enrollment today; later changes next Monday, pending same-date replace, retain F/P and clear S at boundary | Frequency editor/effective history |
| P05 | Retain earned receipt/art after ordinary cancellation/correction; replay receipt at award boundary, disclose retained evidence | Permanent receipt reconciliation; before rewards |
| P06 | Two expected-gap linear habit Resonance, pause quiet state, current-frequency recency | Resonance engine/presentation |
| P07 | Known archive intervals neutralize whole intersected weeks; legacy current archive starts upgrade/import today; future explicit vacation uses neutral adapter | Archive/rhythm schema and lifecycle |
| P08 | Proposed incremental backupv 3/schema 5→v4/schema 6→v5/schema 7 with strict old import and sparse receipts | Each persistence gate; reverify actual free numbers |
| P09 | Final inventory label «Печати привычек», proposed curated glyph set/default and accessible full-card re-toggle (no promised Undo) | HABIT-SIGILS owner visual acceptance |

Approval of the product direction alone does not resolve these numerical/edge-case gates. UI-COLLAPSE can be scheduled independently after this review without approving the progression formula; do not begin it automatically. Exact reward yields, Balance, vacation expiry/afterglow and sounds remain their own open questions. Stop after one documentation PR.
