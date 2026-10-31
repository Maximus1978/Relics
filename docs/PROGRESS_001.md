# PROGRESS-001 REVISION — habit forging and independent medal states

## 1. Authority, baseline and review gates

Status as of 2026-10-31: **documentation proposal; no runtime implementation**. The owner's PROGRESS-001 REVISION brief supersedes conflicting earlier progression proposals. [PR #10](https://github.com/Maximus1978/Relics/pull/10) is merged; current master verified as 8503670a31b8adc74bac61b6a84826e6772664eb (parents 39af6b78 and db1d2f7). Owner reports native NAV-CHRONICLE-001 acceptance. Its earlier review holds are historical.

| Status | Scope |
| --- | --- |
| Implemented / owner accepted | Habit management, one completion per habit/local day, backdating, immutable name/sphere/contribution snapshots, schema 4, v1-import/v2-export/recovery, binary Sanctuary rune, snapshot trends 1/4/8, dedicated Chronicle |
| Approved direction, not implemented | Five independent habit dimensions; intended daily/three-weekly/weekly rhythm; six materials; manual icon independent of spheres; layered card states; collapsible inventory/analytics |
| Proposed for owner review | Cycle calendar, interruption allowance, protected checkpoints, thresholds, phase cutoffs, Resonance curve, frequency boundaries, deterministic history correction, legacy enrollment, archive pause representation, migrations/backup sequence |
| Deferred | Actual engine, medal/icon assets, card redesign, collapse controls, frequency persistence, numeric Balance, rewards, Vacation implementation, audio, Adventure/Android |

The 2026-10-31 product review supersedes the original daily 7/7 requirement, correction-retention receipts and immediate-fade Resonance proposals. The revised numerical candidates remain awaiting final owner approval; no implementation is authorized. Inactivity is distinct from correcting the evidence used to derive ordinary medals.

No runtime code, schema, tests, artwork, dependencies or secret content changes in this task. All examples below are synthetic design oracles, not executed application behavior. [Russian review package](PROGRESS_001_REVIEW_RU.md). The numbers below must NOT be treated as approved merely because this PR is merged: explicit owner decisions P01–P09 in section 12 gate the dependent implementations.

## 2. Domain separation

| Dimension | Meaning and source | Can change due to absence? |
| --- | --- | --- |
| Habit definition | Stable ID; editable name, manually chosen icon, sphere membership, independent subjective 1–10 profile and intended frequency | Definition changes only by explicit edit |
| Mastery | Material and acquired detail phase reconstructed from authoritative practice history | Never loses material/engraving through inactivity; actual history corrections can change the reconstructed result |
| Forging | Unfinished practice-cycle credit toward next material/phase milestone | Candidate interruption policy affects unfinished tail; correction replay can change reached stages |
| Resonance | Temporary recent participation relative to intended rhythm, evaluated at explicit local today | Gentle fading only; never changes material or selected-date truth |
| Selected-day completion | Is an actual saved event present for selectedDate? | Independent date-specific binary observation |

Contribution units remain subjective benefit, not time, exertion or XP. Neither larger units, more selected spheres nor changing an icon multiplies practice credit. All five canonical IDs remain body/mind/relationships/work/recovery. The central Sanctuary rune and selected-date gemstones keep their accepted independent temporal calculations and fixed art. Habit Resonance is NOT the rune's seven-day coverage.

No engine can infer whether unrecorded real-life practice occurred. Internal shortfall below means insufficient logged evidence for a proposed forging cycle, never a diagnosis of failure. Ordinary activity logging stays useful and one action, even before a rhythm is configured. No catch-up queue, mandatory login, streak warning or automatic recommendation.

## 3. One cycle clock, two Forging models (P01/P02)

### Proposed cycle contract — revised eligibility

Use complete Monday–Sunday local-calendar weeks for all three rhythms. Intended frequency remains daily/three-per-week/weekly, without booked weekdays. Proposed **eligibility minima** are at least6 distinct recorded habit-days out of 7 for Daily,3 distinct days for Three/week,1 distinct day for Weekly. Daily 7/7 is welcome but NOT necessary. Each qualified cycle contributes exactly **one practice-cycle unit**:6 and7 daily days give the same1; extra days, repeated records or subjective sphere values never multiply it. Counts are observations, not health norms.

The asymmetry is intentional: the high-frequency Daily intention allows one unrecorded day per complete week for ordinary interruptions, without asking the user to recreate evidence or maintain perfection. Applying a one-day discount to3/week would silently turn it into2/week, while discounting Weekly would allow an empty week to qualify. Those lower-frequency rhythms retain their meaningful count. Daily's6-day eligibility does not redefine its intended recency interval: Daily Resonance still uses an expected one-day interval. This is a game-design allowance, not a scientific compliance rate. The 6/3/1 numbers await final owner approval (P01).

A cycle is evaluable only after its Sunday has ended relative to explicit today, all seven days share one applicable frequency segment, the habit is enrolled, and no day is excluded by a known archive/vacation pause. Current/initial partial/mixed/paused weeks are neutral: no unit, no shortfall, no grace reset/consumption. Even if six dates are already recorded this week, its unit is not finalized before the week closes. No prorating. Re-evaluate closed cycles on corrections/backdates/reopening/restore. Local YYYY-MM-DD arithmetic, not elapsed168 hours, handles DST/leap/year boundaries.

An eligible closed cycle below6/3/1 gives no unit. Proposed interruption allowance remains: first under-target cycle holds unfinished credit; second consecutive eligible under-target cycle clears only the model's unprotected tail. A successful cycle clears the shortfall run; neutral cycles leave it unchanged. Missing evidence never proves real-life failure. No red streak/overdue/catch-up warning. Both compared models use this same revised eligibility and tolerance.

| Model | After two consecutive eligible shortfalls | Protection from inactivity | Tradeoff |
| --- | --- | --- | --- |
| A: successful cycles, material checkpoints only | Reset unfinished credit to the last material starting threshold | Preserve material and previously reached phase appearance in chronological replay | Repeating work behind an unchanged phase can make visible craft/progress disagree |
| B: successful cycles plus protected phase checkpoints — recommended | Reset only credit above the most recent phase/material checkpoint | Preserve material and every phase reached in chronological replay | More derived phase boundaries, but smaller lost tail and clear visible checkpoint |

Model B remains the preferred candidate, not an approved reset formula. Checkpoints protect against **inactivity in an unchanged history**, not against an actual correction to that history. Both models are reconstructed without persistent ordinary attainment receipts. No XP currency, punitive debt, removal of events or extra reward. If tolerance is rejected, review policy before engine code rather than silently introduce a third model.

### Recommended deterministic fold (Model B, still proposed)

Inputs: validated authoritative journal, effective frequency history, known pause intervals, explicit today, rulesVersion. **No stored milestone receipts/high-water input.** Sort closed cycles by start date; validate event identities and reduce to distinct(habitId, occurredOn). Start frontier F=0, protected checkpoint P=0, consecutive shortfalls S=0. F is the current crafting path, not a lifetime event total; the ordinary material/phase are determined by checkpoints reached during the replay.

1. Neutral cycle: unchanged F/P/S.
2. Qualified eligible cycle: F=F+1, S=0; if F reaches a material/phase boundary, advance derived P to that boundary.
3. First under-target cycle: S=1, hold F/P.
4. Second: S=2, F=P. Further shortfalls leave F=P; next success increments F and clears S.
5. After any actual add/cancel/correct/restore change, replay the same rules from authoritative inputs. Re-derive P/material/phase; do not inject former results to preserve a now-unsupported achievement. Identical inputs/today/version yield identical results regardless of previous render, launch, cache or mutation sequence.

With unchanged past events/frequency and only advancing today, more empty closed cycles can clear only F-P: P never falls and material/phase stay earned. Correcting evidence can make a previous cycle unqualified and legitimately lower P/material/phase. Backdated valid evidence can restore them. This distinction is required by the review; ordinary correction affects neither Unique Artifact/discovery persistence nor their separately gated correction rules.

Projection is read-only and has no grant side effects. Reopening offline can evaluate all newly closed cycles; no required daily launch. Re-crossing a threshold is a reconstructed ordinary visual state, not an opportunity to mint currency/rewards. A versioned rebuildable cache, if later justified for measured performance, cannot override input truth and needs no durability contract of an attainment ledger. Rules upgrades require an explicit reviewed version transition.

### Exact worked realistic interruptions

Q/U mean sufficient/insufficient recorded evidence in a complete eligible cycle, not judgments. Examples use Monday enrollment and no pauses/edits unless stated.

| Practice / sequence | Recorded evidence | Model B result |
| --- | --- | --- |
| Daily English, weeks 1–3 |6/7 each week | Q, Q, Q: F1,2,3; Copper phase 1 at week 3; no 7/7 requirement |
| Daily extra day |7/7 instead of 6/7 | Same1 unit, no multiplier |
| Gym three/week, weeks 1–3 | Mon/Wed/Sat or any3 distinct days each | Same F1,2,3; Copper at week 3; no fixed appointment requirement |
| Cycling once/week, weeks 1–3 | Any1 recorded day each | Same F1,2,3 |
| One daily interruption after F4/P3 | English6/7 | Qualified: F5/P5, S0; Copper phase 2 reached |
| One gym/weekly interruption after F4/P3 | Gym2/3 or cycling0/1 | First U holds F4/P3, S1; next Q gives F5/P5 |
| Two daily days unrecorded | Daily 5/7 | First U holds unfinished credit; no per-missing-day deductions |
| Unrecorded days cross week boundary | Miss Sunday in weekA and Monday in weekB; other6 each | Both weeks 6/7 qualify; the model counts weeks, not a punitive uninterrupted daily streak |
| Multiple missed opportunities in one week | Daily 4/7 or gym1/3 | One U cycle; F held on first U; Weekly still needs1 actual day |
| Two consecutive under-target weeks | F4/P3, then Daily 5/7 and5/7 (or gym2/3,2/3) | F4 then3; only 1 unprotected unit lost, material preserved |
| Difference between models | Phase 2 earned at 5, F6, then two U cycles | A resets F3 with phase 2 appearance still derived; B resets F5 at its protected phase checkpoint |
| Extended inactivity | F13/P12, six eligible empty weeks | F13,12,12,12,12,12; Bronze phase 2 remains; no growing debt |
| Return | Next three qualified weeks after that gap | F13,14,15; phase 3 at 15, no catch-up task |
| Current partial week | Six daily dates already logged but Sunday not ended | Neutral now; evaluate6/7 only after closure |

The candidate allows recurrent6/7 Daily weeks to advance. Recovery/vacation is not inferred from missing records; future explicit Vacation neutralizes affected weeks without fake completions. Actual history correction follows P05, not the inactivity guarantee.

## 4. Thresholds, calendar fairness and detail phases (P03)

The earlier candidate 0/7/21/50/120/250 is not an approved rule and its counter was undefined. If it meant raw occurrences, minimum times (without gaps, rounded up) would be:

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
| Copper |3|3 weeks /18–21 recorded days|3 weeks /9 days|3 weeks /3 days|
| Bronze |9|9 weeks /54–63 days|9 weeks /27 days|9 weeks /9 days|
| Silver |18|18 weeks /108–126 days|18 weeks /54 days|18 weeks /18 days|
| Gold |36|36 weeks /216–252 days|36 weeks /108 days|36 weeks /36 days|
| Platinum |72|72 weeks /432–504 days|72 weeks /216 days|72 weeks /72 days|

Real enrollment off Monday adds up to6 neutral initial days; no earned unit from a partial week. Daily ranges are6–7 recorded days per qualified week; Gym/Weekly minima stay3/1. Counts are recorded practice days, not weighted sphere units. Changing3/week toweekly never retroactively lowers prior targets.

### Three deterministic acquired phases per material

| Material | Phase 1/2/3 frontier checkpoints | Reference craft direction |
| --- | --- | --- |
| Stone |0 /1 /2|Rough → shaped → engraved stone|
| Copper |3 /5 /7|Simple forging → refined edge → first ornament|
| Bronze |9 /12 /15|Structure → carved accents → motifs|
| Silver |18 /24 /30|Clean form → deeper engraving → refined ornament|
| Gold |36 /48 /60|Engraving → precise relief → finished gold|
| Platinum |72 /84 /96|Advanced craft → intricate detail → refined brilliance|

Phase 3 remains until the next material threshold; Platinum phase 3 at 96 is the terminal ordinary-medal craft state, not a seventh material or rarity tier. The twelve-cycle post-Platinum phase spacing is another provisional pacing choice. MasteryTier and earnedPhase are attained states derived by chronological replay; Forging is the unprotected tail to the next checkpoint. Acquired engravings do not disappear through inactivity, tail resets or Resonance fading. Actual history correction can reconstruct a different material/phase (P05); no former result is stored as overriding evidence. Model B protects each phase checkpoint. The owner prefers three phases but has not approved these cutoff numbers.

These are six material treatments of one recognizable ordinary medal family. Controlled additive ornament can evolve by tier/phase; it is not six random unrelated reward objects. Each frame/material variant shares center-icon registration. Ordinary craftsmanship stays visually subordinate to truly authored unique Artifacts.

### Visible Forging progress within the current phase (P03/P09 candidate)

Show a compact thin progress track plus readable text on the habit card or its existing detail area, not a new currency/reward panel. Let P be the latest derived phase/material checkpoint, N the next checkpoint and F current frontier. Display u=F-P, required=N-P and fraction u/required, with a localized example: «Ковка этапа:2 из 6 циклов». Use native progress semantics or equivalent accessible label/value; text conveys the same information without color/animation. Keep the earned material/phase and selected-date check separate. No fictional live tier in production before the engine exists.

Example Silver phase 1 P18, next24: F20 =>2/6; next qualified week F21=>3/6. First under-target closed week holds2/6; a second clears the tail to0/6 while Silver phase 1 remains. At24 the phase changes and the next local track starts0/6 toward30. A genuine history correction may change both material and progress: label the refreshed state neutrally, never pretend it was caused by absence. At terminal Platinum phase 3 F>=96, show «Этап завершён» instead of a fake next rank/currency; cap ordinary visual advancement there.

To give immediate one-click feedback between weekly units, the saved check updates after persistence; optional compact supporting text can show «На этой неделе записано:5 дней; цикл ещё не закрыт» with actual bounds. It is provisional recorded evidence, not a credited cycle, deadline or separate spendable resource. Current partial weeks remain neutral even with6 dates. Hide this optional detail if space is tight; phase u/required must stay discoverable in the existing card/detail context, keyboard/screen-reader readable. This lightweight indicator follows current Sanctuary metal/dark-panel styling; no new artwork or implementation here.

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
| Archive / restore | Stop logging at repository level; preserve all definitions, frequency/pause history and journal; pauses described below; restoration does not auto-seed/reactivate others |
| Backup restore | Atomically replace all supported authoritative inputs, then reconstruct ordinary state; cannot infer missing old rhythm from modern settings |

### Worked boundary and correction example

Synthetic habit H enrolls daily Monday2026-11-02. Weeks starting Nov2,9,16 with7 days each give F3/Copper. Nov23 week has7 days, F4. User schedulesweekly on Nov25, then changes that pending choice tothree-per-week on Nov26: exactly one segment starts MondayNov30, older daily segment remains. Nov30/Dec2/Dec5 entries qualify that week and give F5/Copper phase 2; no daily reinterpretation.

On Dec8, record a backdated Nov24 entry after canceling the old entry. The new name/icon choice/spheres/contribution profile are today's definition (icon is not an activity snapshot in the minimal proposal); occurredOn Nov24 still evaluates under Daily. Its original cancellation may turn Nov23 week into6/7; re-recording returns7/7. Replays change incomplete evidence/Forging deterministically. The revised Daily eligibility is 6/7, so deleting one of seven Nov23-week dates still qualifies: F5/phase 2 remains. If that week originally had exactly six dates (including Nov24), cancellation leaves5/7 and makes it unqualified: replay holds F3 that week, then Nov30's qualified cycle gives F4/Copper phase 1 rather than F5/phase 2. Re-recording Nov24 restores6/7 and F5/phase 2. More extensive corrections to the original three qualifying weeks can legitimately remove Copper altogether. No receipt overrides the corrected evidence, and repeated evaluation has no grant effect.

A weekly switch instead would permit one occurrence from Nov30 onward, still only 1 cycle unit/week; earlier Nov23 requires7. No old contribution snapshots are recomputed from current values.

### Archive pauses and future Vacation compatibility

Current archivedAt alone cannot reconstruct past archive periods. Smallest adequate proposal adds nonoverlapping per-habit pause intervals with local startOn/endExclusiveOn(nullable while open), stable ID and reason=archive; future explicit vacation can use a separately approved interval adapter. Archive atomically opens today's pause and sets existing archivedAt; restore closes the pause at local today and clears archivedAt. A same-day archive/restore leaves no excluded calendar day; remove/ignore a zero-length interval. Any cycle intersecting a positive pause is neutral, no partial credit. Schedule changes during a pause apply on their scheduled boundary; no cycle can earn until fully evaluable again.

Legacy already-archived habits get an open interval starting explicit upgrade local today, with provenance=legacy-current-archive (not guessed previous vacations/archives). They have no rhythm credit before later explicit enrollment anyway. Historic archive gaps not captured by old schema stay unknown. Active legacy habits get no invented pause. Future pause/correction/effective-date validation must cover clock going backward: reject an end before start and ask for clock correction, never silently corrupt the interval. Explicit pause neutralization is a proposal awaiting approval, not current vacation behavior.

## 6. Resonance proposal with a full expected-interval grace (P06)

Use intended rhythm f in{7,3,1}, expectedGap g=7/f local-calendar days, and age a>=0 since the latest actual recorded participation since enrollment at/before explicit actual today. A record in an unfinished/under-target week still counts as recent participation. Daily eligibility6/7 is an allowance for cycle qualification, not a redefinition of its daily intended interval; Daily g=1, Three/week g=7/3, Weekly g=7.

**Full illumination through the normal expected interval**: R=1 for0<=a<=g. Only after it, fade linearly over a further2g: R=max(0,1-(a-g)/(2g)) for a>g. Thus a=g remains1, a=2g gives.5, a>=3g gives0. No record =>0. No intensity, Mastery, Forging or sphere-value multiplier.

| Intended rhythm | Full through | Half at | Zero from | Calendar-day examples |
| --- | --- | --- | --- | --- |
| Daily | Day 1 | Day 2 | Day 3 |0→100%,1→100%,2→50%,3→0%|
| Three/week |7/3 days (~2.33) |14/3 days (~4.67) |Day 7 | Day 2→100%, day 3→6/7 (~85.7%), day 4→9/14 (~64.3%), day 5→3/7 (~42.9%), day 7→0% |
| Weekly |Day 7 |Day 14 |Day 21 |0→100%,7→100%,14→50%,21→0%|

Actual age uses integer calendar-day differences; fractional boundaries explain the formula, not fractional occurrence dates or a rounding of 7/3 to2/3 days. Percentages here are design parameters only, not scientific life/psychological measurement, forgetting rate, a user Balance score or gameplay currency. Formula/horizon remain proposed pending P06 approval.

SelectedDate changes never reanchor this clock or alter R; the selected-day check stays truthful independently. Frequency changes can alter current g/light without repricing previous cycles or material. Multiple entries on one day do not stack light. Pause/archive suppress optional active halo as previously proposed; restore derives recency from real dated participation and actual today, never an automatic refill. Future Vacation/afterglow policy remains separately reviewed; it cannot fabricate participation or change the binary central rune. Store occurrence dates unchanged across travel/timezone; supply explicit today. Reduced motion keeps state legible with no required animation.

## 7. Visual contract and interaction composition

Reference: owner board codex-clipboard-b3816081-6934-4e0e-8e7f-e14705dcfec3.png, provided2026-10-30; [reference contract](art/HABIT_MEDALS.md). Read the written revision above picture labels: grayscale preview examples do **not** authorize full-medal grayscale. Green saved confirmation remains green even on a subdued card. No new assets created/copied here. The accepted central medallion/shrines/environment remain unchanged.

~~~mermaid
flowchart TD
  H[Stable habit identity] --> I[Manual icon with fixed center registration]
  J[Journal + effective rhythms + pauses + explicit today] --> E[Versioned pure cycle projection]
  E --> F[Unfinished Forging tail]
  E --> M[Journal-derived material + acquired phase geometry]
  F --> T[Visible progress within current phase]
  T --> V[Layered ordinary habit card]
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

All diagram arrows describe proposed computation/presentation; ordinary material has no receipt-write arrow. No implementation is delivered by this PR. For the existing central rune only illumination varies; future ordinary medal geometry evolves by permanent tier/phase. Do not conflate those separate objects.

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

Current native baseline remains schema 4, migrations001–004, exportv 2/importv 1+v2. Preserve sqlite:relics.db, local.relics.app, IDs, daily uniqueness, archivedAt, every event snapshot and applied migrations. The review removes the ordinary milestone-receipt proposal, not any existing database fields (none were implemented). No persistent XP, Mastery high-water mark or material checkpoint is required for the deterministic MVP.

| Future increment | Smallest proposed additions | Backup evolution proposal |
| --- | --- | --- |
| HABIT-RHYTHM-001, candidate 005 | Effective frequency segments keyed by stable habit/date/rules version, known archive pause intervals; validated FK/indexes, one pending version, no overlaps | Candidatev3/schema 5 with all frequency/pause history; strictv1/v2 adapters create no guessed pre-enrollment rhythm |
| HABIT-SIGILS-001 / HABIT-ICONS-001, candidate 006 | Manual habit iconId and user/default provenance; no duplicate habits or event-icon snapshots | Candidatev4/schema 6 includes icon plus earlier histories; safe generic legacy default |
| PROGRESS-002A | Pure reconstruction of material/phase, F/P/S, Resonance and phase-local indicator from journal/effective rhythms/known pauses/today/rulesVersion | No migration/format change for derived state |
| PROGRESS-002B | Integrate actual projector into existing shared model/card, refresh after committed mutations, truthful error/pending state | No candidate 007 orv5 solely for ordinary medal receipts; evolve format only if a separately justified authoritative field is added |

Numbers are proposals, not allocated migrations: verify actual free slots before implementation. Keep strict TS/native validation aligned for enums, Gregorian dates, stable references, nonoverlapping intervals and applied history. Multi-row habit definition/profile/icon/pending-frequency updates use one pinned native transaction; pooled frontend BEGIN/COMMIT calls cannot guarantee it. Existing atomic active-habit INSERT...SELECT snapshots and cancellation remain; after successful mutation, refresh the shared journal and reconstruct in memory. Read-only calculation performs no write/grant. A crash between event commit and screen refresh is repaired by reconstructing committed inputs on restart, without an award reconciliation ledger. Invalid inputs fail visibly; never quietly substitute a prior cached rank.

### Ordinary material after actual correction (P05)

For initial MVP prefer deterministic reconstruction from the authoritative journal, effective frequency history, pauses and explicit rules version/today. Derived checkpoints are remembered **within a chronological replay**, so additional empty weeks never reduce attained material/phase. They are not stored as uncorrectable independent facts. Deleting/changing evidence can make an earlier qualified cycle unqualified, so replay can legitimately lower Forging, phase or material; adding valid backdated evidence can restore/raise it. Do not preserve unsupported ordinary achievements with milestone receipts or inject an old UI/cache result. Same inputs yield the same result after offline restart, any add/cancel order and backup restoration.

Example: three initial Weekly weeks give F3/Copper. Without changing history, even20 empty weeks retain Copper. Cancel the sole event in one of the original three weeks: only two cycles qualify, so reconstructed state is F2/Stone phase 3 (week location may affect S, but not this result). Restore that actual dated event and Copper returns. Likewise removing one Daily record from 7 leaves6 and still qualifies, while6→5 does not. Present a neutral explanation such as «Прогресс пересчитан после изменения истории», never a warning attributing the change to absence. Normal cancellation behavior is not redesigned in this documentation task; future presentation must make correction consequences understandable.

No persistent ordinary attainment receipt is needed for these requirements. If later performance requires a cache, justify it with measurements, key it by authoritative-input digest/rules/today and make it discardable/rebuildable; no new durable grant semantics or schema by convenience. Unique Artifact/discovery persistence and correction policy remain their separately gated decisions below, untouched by this ordinary medal choice. AUDIT-001 still precedes consumable resource/discovery rewards depending on mutable history.

A restore replaces its authoritative input set exactly, never unions hidden ordinary progress with the destination. Recompute after commit; an old backup may yield a different material because its journal/rhythms differ. Preview still explains full replacement and retains protective current-state recovery. Never infer old frequency or contribution values from current definitions.

### Backup compatibility gates

1. Each new authoritative field/collection (frequency, pause, icon) receives native DTO/validator, consistent export, strict version adapter, preview and protective recovery coverage before release. Unknown newer formats/schema/rules fail before mutation; no dropping fields or lossy downgrade.
2. Preserve strictv1/schema 3 andv2/schema 4 import plus each actually shipped intermediate version. Legacy numeric snapshots remainNULL; default5 provenance, stable IDs, names, spheres, dates, archives and exact snapshots survive. Old files do not invent past rhythm. Rebuilt ordinary F/P/material are not importable overrides.
3. Consistent snapshot export; synced/atomically published/read-verified target-version safety JSON before deletion; pinned native full-replacement transaction covers all authoritative tables in FK-safe order. Validate all imported input before mutation; retain current preview confirmation/single-use tokens.
4. Synthetic migration/retry/rollback/crash failpoints cover history/icon writes, safety publication, each DELETE/INSERT family and COMMIT; reopen is entirely old or new state. After restart, derived result matches a fresh replay of the committed input; there is no separate medal ledger to become half-updated. Empty/subset restore must not reseed.
5. Failed migration leaves ledger/schema/data retryable together. Recovery captures every supported input and undoes replacement; no silent truncation or unsupported-version guessing. Close older binaries before upgrade, no downgrade guarantee.
6. Real temporary Node SQLite and Rust/SQLx native backup/crash tests; label mock browser IPC as such. Owner Windows acceptance remains separate; never test on owner's journal.



### Future unique rewards: idempotency before integration

Ordinary reconstructed material is not a Unique Artifact. Before ESSENCE/DISCOVERY rewards, specify stable grant identity: lifetime scope + stable habit/experience source + authored definition/reward slot. Keep rulesVersion/contentVersion/basis evidence metadata separate from unique semantic identity so reevaluation/version changes cannot re-grant by changing a hash. One-time authored discovery uses unique(lifetimeScope,discoveryDefinitionId); repeatable renewable rewards need separately approved occurrence/slot identity and correction policy. Grant identity must not be a new canceled/re-recorded activity UUID alone. Atomic eligibility+unique insert protects restart/retry/concurrent evaluation; never include real secret recipes in public tests. No artifact rewards/yields are approved here.

## 10. Explicit old versus revised model

| Topic | Earlier state/proposal | Revised contract |
| --- | --- | --- |
| Progress measure | Undefined raw event/XP thresholds0/7/21/50/120/250; progression absent | Rhythm-aware weekly cycles with6/3/1 eligibility; recommended0/3/9/18/36/72, pending approval |
| Permanence | General no-loss Mastery; initial proposal added correction-retention receipts | Inactivity preserves derived checkpoints; actual correction may change material; deterministic replay, no ordinary receipt ledger |
| Recent activity | Generic participation; initial immediate two-gap fade | Full expected-interval grace, then two-interval fade; no rune reinterpretation |
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
| PROGRESS-002A | Approved pure cycle/forging/Resonance reconstruction from authoritative inputs, including corrections | Deterministic synthetic tests; no UI/DB writes; depends on numerical/correction approval and rhythm contract |
| PROGRESS-002B | Real material/phase, phase-local Forging indicator, grace/fade and saved-check integration; preserve authoritative-input backups | Data-integrity gate before presentation;432 combination checks/representative visuals + Windows acceptance |
| ARCHIVE-CLEANUP-001 | Hide unwanted archived definitions while retaining refs/snapshots/analytics; optional zero-history delete separate approval | No new logs for archived/hidden; no destructive deletion in this task |
| AUDIO-001 | Sound/event/world-theme/settings/accessibility specification only | Review defaults/assets/playback/persistence; no sound assets or playback here |

PROGRESS-002A can be reviewed separately without shipping partially migrated progression. HABIT-SIGILS must not rely on invented tier values in production before actual engine. Retain ACTIVITY-DETAILS/MODEL, BALANCE, AUDIT, vacation/afterglow/insights, audio followups, essences, alchemy, authored discoveries/Artifacts, Collection, Museum, World Packs/voluntary epochs, optional reflections/microquests and optional Android. [Roadmap](ROADMAP.md) preserves all small tasks. World roster Sanctuary/Clockwork/Wasteland/Verdant is unchanged. No automatic reward formula, sixth sphere or 'log every little moment' experience system.

### Future implementation tests (design matrix; NOT executed here)

| ID | Test oracle / required evidence | Task |
| --- | --- | --- |
| P-T01 | Same journal/segments/pauses/today/version produce identical fold under input permutations; duplicate IDs conflict explicitly | PROGRESS-002A |
| P-T02 | Daily 6/7 and7/7 qualify equally;5/7 does not; Three/week 3 qualifies/2 does not; Weekly 1 qualifies/0 does not. Cap1, weights/all-five cannot multiply | PROGRESS-002A |
| P-T03 | Initial/current/mixed/paused weeks neutral; leap/DST/year and explicit today stable; selectedDate never reanchors | RHYTHM/002A |
| P-T04 | RepeatedDaily6/7 and Sunday/Monday cross-week gaps qualify;5/7 under-target holds then resets only unprotected tail;extended gap/return examples section3 | PROGRESS-002A |
| P-T05 | All thresholds/phases including Platinum cap; every acquired material/engraving remains after absence | 002A/002B |
| P-T06 | Repeated/same-day pending edits produce one effective row; no past rewrite/multiple weekly credit; F/P continuation boundary | RHYTHM/002A |
| P-T07 | Cancel/re-record/backdate before enrollment/change; current snapshots vs occurrence-date frequency; deterministic state, not grant side effects | 002A/002B |
| P-T08 | Unchanged journal+20 empty weeks keeps Copper; deleting one of 3 original Weekly events recomputesStone; re-add restoresCopper; Daily 7→6 stays qualified,6→5 does not; no receipt/cache override | 002A/002B |
| P-T09 | Archive/restore intervals, same-day empty interval, legacy archived/no-history defaults, offline mid-gap and future vacation adapter | RHYTHM/002A |
| P-T10 | Grace boundaryg=100%,2g=50%,3g=0; Daily 0/1/2/3, Weekly 0/7/14/21, Three/weekg=7/3 and integer-day fractions; selectedDate/material/check independent | PROGRESS-002A |
| P-T11 | Additive old schema 4 upgrade/retry; invalid segment/overlap/date/FK/clock rejection; applied001–004 unchanged | RHYTHM/002B |
| P-T12 | Every supported v1/v2/new-format round trip, null legacy/default-origin/IDs/archive/snapshots/segments/pauses/icons preserved; derived rank matches fresh replay | All persistence increments |
| P-T13 | Full replacement/subset/empty/no reseed; native safety restore; rollback/crash at every mutation boundary gives all-old/all-new | All persistence increments |
| P-T14 | Event-commit/refresh crash and restore/restart yield same replayed state; reject unknown versions; no cache/high-water override or UI grant/write | PROGRESS-002B |
| P-T15 |6×3×3×2×4 active visual matrix plus archive/pending/error/reduced motion; no grayscale/no false hover check | SIGILS/002B |
| P-T16 | Manual default/edit icon independent of spheres/weights/rhythm; shared center registration/material stroke; rename stable ID | HABIT-SIGILS/ICONS |
| P-T17 | Card Space/Enter/touch once; sibling menu never logs; persistence error no green check; accessible re-toggle correction | SIGILS/002B |
| P-T18 | Historical-date completion, archived domain guard, menu focus, existing one/habit/day, unchanged rune/analytics/Chronicle | Every UI increment |
| P-T19 | Two independent collapse prefs across navigation/offline reopen, missing/blocked storage fallback; essential actions/AX/focus; chart resize/no state reset | UI-COLLAPSE |
| P-T20 | Stable one-time grant identities under correction/re-record/version/retry; no actual recipes or artifact grants in current scope | Before reward integrations |
| P-T21 | Phase-local progress2/6→3/6, checkpoint crossing resets local track, first shortfall holds/second resets tail, corrected history changes value truthfully; terminal state/text/AX/current-week neutral | 002A/002B |

## 12. Owner decisions required before dependent code

| ID | Proposed answer, NOT approval | Blocks |
| --- | --- | --- |
| P01 | Complete Monday weeks, minima6/3/1 with explicit Daily allowance; cap 1, no partial prorating or pre-enrollment inference; numbers await final approval | Rhythm/progression evaluation |
| P02 | Model B; first under-target cycle holds, second resets only above earned phase checkpoint | Forging engine/phase contract |
| P03 | Cumulative0/3/9/18/36/72,exact phase checkpoints incl Platinum84/96 and readable within-phase progress | Progression pacing and earned art mapping |
| P04 | First enrollment today; later changes next Monday, pending same-date replace, retain F/P and clear S at boundary | Frequency editor/effective history |
| P05 | Recommended initial MVP reconstructs from journal/effective rhythms/pauses; inactivity cannot lower material, but actual history corrections may. No persistent ordinary attainment receipts | Ordinary correction semantics and engine |
| P06 | Full light through expected gapg, linear fade over next2g (Weekly 7full/14half/21zero); pause quiet state; curve awaits final approval | Resonance engine/presentation |
| P07 | Known archive intervals neutralize whole intersected weeks; legacy current archive starts upgrade/import today; future explicit vacation uses neutral adapter | Archive/rhythm schema and lifecycle |
| P08 | Candidate rhythmv3/schema 5→iconv4/schema 6 with strict older imports; no 007/v5 solely for ordinary receipts, derived material reconstructs | Each persistence gate; reverify actual free numbers |
| P09 | Final «Печати привычек» label, glyph/default, accessible full-card re-toggle (no promised Undo) and lightweight phase-local progress text/track | HABIT-SIGILS owner visual acceptance |

Approval of the product direction alone does not resolve these numerical/edge-case gates. UI-COLLAPSE can be scheduled independently after this review without approving the progression formula; do not begin it automatically. Exact reward yields, Balance, vacation expiry/afterglow and sounds remain their own open questions. Stop after one documentation PR.
