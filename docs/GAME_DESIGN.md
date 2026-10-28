# Game design

## Status and approved core loop

Sanctuary Gate A is owner-approved and the implemented functionality has been manually verified by the owner in Windows. This acceptance covers the present UI/tracker milestone, not absent game systems. DOC-GAME-002 additionally records owner acceptance of STATE-001's functionality and visual direction after Windows testing and authorizes releasing PR #6. Remaining artistic differences are non-blocking future improvements; no feature changes occur in this release.

Approved intended loop, not yet implemented end to end:

**Real activities → permanent Mastery and thematic essences → player-driven experiments → authored discoveries → optional new experiences.**

Daily logging remains useful without Adventure Mode. Discoveries are curated and meaningful, not infinite random loot. Basic experimentation never consumes permanent practice, Mastery, earned artifact evolution or discoveries. Whether some advanced crafting consumes renewable materials is undecided. Opportunities invite experiences rather than create compulsory tasks. Diversity, unexpected combinations, returning to interests and trying new experiences may support authored discovery conditions; exact conditions stay outside public documentation. There is no mandatory daily login, punitive streak system or optimal XP-grinding build.

## Five spheres and habit identity

| Stable ID | English | Russian | Meaning |
| --- | --- | --- | --- |
| body | Body | Тело | Movement and physical care |
| mind | Mind | Разум | Learning, meditation, reflection |
| relationships | Bonds | Отношения | Family, friendship, connection |
| work | Work | Дело | Professional work, projects, creativity |
| recovery | Recovery | Восстановление | Rest, nature, recreation, enjoyment |

Keep canonical IDs. Current sphere symbols/gems are category identities; they are not earned ranks.

Approved future habit identity: a small curated icon gallery, with icon choice independent of sphere contributions. WEIGHTS-001A supersedes primary/secondary allocation math with equal-status independent subjective 1–10 sphere values; primary visual identity remains a separate deferred choice. An icon must not determine contributions or silently change them. Current implementation stores an unweighted sphere set and derives decorative color from the first sphere; it has no independently stored icon or explicit primary-sphere field.

Weights describe how a habit contributes across spheres. Optional intensity describes one activity occurrence. They are different concepts and fields. Owner-approved contribution ranges/defaults/no-normalization and legacy semantics are now specified in [WEIGHTS_001A](WEIGHTS_001A.md); primary visual identity and per-activity intensity effects remain separate future decisions. Do not retroactively reinterpret old snapshots.

Use a shared base frame for ordinary Habit Sigils. Reserve unique silhouettes and individually authored art for rare/legendary artifacts. The current common frame is an accepted foundation, not a release defect or evidence of earned rarity.

## Implemented journal versus future activity details

Implemented: create/edit/archive/restore habits; multiple unweighted spheres; today/backdated logging; one completion per habit/local date; historical name/sphere snapshots; SQLite persistence. Archiving retains history and prevents new logs until restoration. Cancellation currently physically deletes a record; auditable corrections are a future task.

Approved future activity details: optional intensity and note attached to an activity, not to habit creation. Add them through versioned additive migrations, retaining IDs, old records and unknown/NULL legacy values. Do not rewrite applied migrations. Notes/reflections can be omitted without consequences.

Future modeling must accommodate repeated sessions and quantified activities. Occurrence identity, quantities/units, duplicate detection and migration of the unique habit/day constraint remain unresolved. The current one-completion-per-day rule does not change in this milestone.

Daily/scheduled/flexible recurrence, explicit planned rest and confirmed inactivity remain future requirements. Missing records remain unknown.

## Three independent visual states

| State | Meaning | Approved behavior | Current implementation |
| --- | --- | --- | --- |
| Selected-day activity | Is this habit recorded on the selected local date? | Illuminated or subdued; missing is unrecorded, not confirmed failure | Implemented selected-day gemstones and habit illumination, owner-accepted in STATE-001 |
| Recent Resonance | Recent participation/current energy | Gradual visual energy may fade gently, never a punishment | Actual Resonance calculation is not implemented |
| Permanent Mastery | Earned practice and artifact evolution | Does not decay with inactivity; survives dimmed daily/recent states | Actual Mastery progression/evolution is not implemented |

These states must not overwrite or impersonate each other. A subdued relic can retain all permanent evolution. A backdated selection does not imply resetting Mastery or reanchoring current Resonance. Current seven-day rings count distinct recorded dates per historical sphere snapshot. The center uses the accepted descriptive four-state rune in [SANCTUARY_STATES](SANCTUARY_STATES.md): DORMANT / AWAKENING / HARMONY / RADIANCE. Selected-day stones remain independent of current-window coverage. These observations are neither Mastery/Resonance progression nor a health/Balance grade.

STATE-001 delivered the accepted unique pointed Sanctuary rune and fixed transparent technical layers. Keep its geometry, illumination precedence and temporal rules unchanged; do not reopen that accepted milestone for later polish.

## Progression, resources and discovery rules

Lifetime history, discoveries and milestones survive epochs; a world's presentation/development journey can differ and later live in the museum. Mastery is accumulated practice; Resonance is recent participation; harmony describes diversity rather than personal worth.

Keep formulas pure, deterministic and versioned, with an explicit evaluation time. Exact units, thresholds, windows/fading, future reward interpretation of subjective contributions, essence yields/caps and safeguards against repetitive grinding remain provisional. Decide correction/backdate behavior and idempotent grant accounting before tying permanent discoveries to editable activity history.

Initial recipe evaluation remains a bounded vocabulary of authored two- or three-element conditions/effects. No arbitrary scripts in content. Stable discovery IDs and content/rules versions prevent duplicate grants. Artifacts may unlock cosmetics, additional recipes, optional experiences and collection content; effects cannot create obligations or destroy earned practice.

## Adventure Mode scope — approved future work, not implemented

Each area has explicit small tasks in [ROADMAP](ROADMAP.md): alchemy UI, essence/material inventory, rune discovery, crafting and artifact customization, authored unique artifacts, awakening/optional experiences, collection browsing/filtering, world selection, voluntary epoch transitions, museum, reflections and microquests.

World roster: Sanctuary first, followed by planned Clockwork, Wasteland and Verdant. Versioned declarative [World Packs](WORLD_PACKS.md) reuse common journal/progression/discovery services; no new tracker per world. Releases/dates for later worlds are not promised.

Epoch change is voluntary, with a common lifetime journal and preserved previous-world museum records. No automatic expiry or forced reset. Optional quests/reflections can be ignored without consequences.

## Decisions still required

Before their respective tasks: progression math/anti-grind policy; independent contribution implementation review; primary visual identity and intensity scale/effect; repeated/quantified events; renewable resource costs; historical corrections and discovery grants; epoch transfer and museum retention. [Open questions](OPEN_QUESTIONS.md) tracks these. Approved principles constrain the eventual answers; they do not silently choose formulas.

Private discovery names, actual recipes, unlock conditions and undiscovered art remain separate. Use synthetic fixtures for public rules tests. Do not access or invent a secret catalog during routine development.

## Habit Sigils, artifacts and destinations — accepted distinction

| Concept | Responsibility | Implementation status |
| --- | --- | --- |
| Habit Sigil | User-defined habit, reusable ordinary medallion frame; future Mastery evolution | Existing habit cards implement tracking, not unique rewards. «Печати привычек» is a queued label change from «Ваши реликвии» |
| Unique Artifact | Earned/discovered stable identity and authored design; optional bounded unlocks | Future ARTIFACT-001 / discovery / Collection work |
| Chronicle | Real activities and optional reflections; historical names/contributions | Activities/snapshots are implemented. Full destination separation and reflections are future |
| Collection | Browse earned artifacts and discovered collection content | Future COLLECTION-001; not a synonym for habit cards |
| Museum | Preserve earned artifacts, discovery stories and completed epochs | Future MUSEUM-001; does not replace Chronicle or Collection |

NAV-CHRONICLE-001 will place full activity history at the existing left-navigation destination and remove the expanded dashboard Chronicle. Backdating/cancellation/snapshots remain; compact recent activity may be retained if useful. This remains queued after WEIGHTS-001B and SPHERE-TRENDS-001 under the later priority override, not an implemented refactor.

## Balance boundary — accepted principle, mechanics open

Balance means context-sensitive diversity of attention, not perfect completion. BALANCE-001 is a specification gate before any numeric Balance KPI. A habit contributing to all five spheres, logged on each of seven days, legitimately produces 35 distinct sphere-days for the present rune. It is not proof of healthy life balance and cannot automatically justify disproportionate rewards.

Future progression must consider contribution weights, anti-grinding and life context, with missing-data uncertainty. No percentage, score, threshold for health or new reward formula is approved here. The descriptive rune remains independent from actual Mastery and Resonance.

## Blessings — accepted future scope, exact mechanics open

BLESSINGS-001 first specifies temporary, optional effects originating from approved discoveries/progression or meaningful experience patterns. Possible bounded effects are special artifact/world illumination, extra authored alchemy hints, optional encounters/micro-adventures and cosmetic discovery opportunities. They cannot fabricate activity history, artificially raise measured Balance or erase permanent achievements.

No automatic sphere completion, +5% XP effect, unchecked random reward multiplier or mandatory task is approved. Duration/expiry, stacking, chance, source validation and safeguards require separate approval before implementation. Permanent earned identities survive temporary-effect expiry.

## Life rhythm — accepted future scope

LIFE-RHYTHM-001 specifies a manually enabled vacation/day-off mode lasting one day, a defined interval or until manually ended. Tracking is optional during it. A distinctive restful Sanctuary aura can carry a brief cosmetic afterglow afterward. The five gemstones still show actual selected-day records; the seven-day rune continues showing real history. Do not add Recovery records, Mastery or sphere completion automatically. Vacation is freedom from ordinary obligations, not guaranteed physiological recovery.

Optional permanent memories or authored vacation discoveries may be considered later; none are granted now. Time boundaries, persistence and afterglow duration are open. Implement the eventual mode through separately reviewed small tasks, preserving records and the accepted rune.

RHYTHM-INSIGHTS-001 is separate: opt-in, non-punitive suggestions about sustained patterns, not a single missing day. Respect schedules, vacations and unknown unrecorded activity. Users may dismiss, snooze and disable suggestions; no autonomous mode change. No Work Sprint Mode design is authorized.

## Sound — accepted future scope

AUDIO-001 specifies restrained local offline sound, accessible alternatives and mute/volume preferences. Cover gentle interactions, habit completion/gem activation, rune transitions, authored discoveries/alchemy and distinct World Pack themes. Avoid pressure, repetitive attention-grabbing loops and excessive simultaneous playback. Exact assets, defaults, event priorities and persistence are open; smaller implementation tasks follow the specification.

## Accepted artwork backlog

Non-blocking future tasks: larger readable shrine gemstones/icons; a curated manual sigil icon gallery; icon identity separate from independent contributions and deferred primary visual identity; consistent ordinary frame; unique authored silhouettes only for real earned artifacts; refined gemstone optics, lighting and ornament. They do not reopen STATE-001 or authorize new artwork now.

## WEIGHTS-001A — accepted subjective model; implementation proposed

[Full contract, WEIGHTS-001B plan and test matrix](WEIGHTS_001A.md). A contribution is the user's subjective assessment of benefit/meaning to a life sphere, not exertion, time, intensity, scientific health or Balance quality. Select 1–5 canonical spheres; selected values are independent integers 1–10, newly selected default 5, unselected 0. No normalization, percentage budget or total-of 10/100 requirement; maximum event total 50.

Habit profiles are definition data, with immutable activity snapshots created at logging time (also for backdated entries). Editing never rebases prior values. Existing binary 7-day rune ignores magnitudes, keeps actual-day stones/current-week window and all current states unchanged. No contribution → Mastery/essence/rarity/probability coupling is approved; rewards need separate gameplay approval.

Owner clarification: existing unweighted definitions receive marked 5 defaults for future logs, including archived definitions. Old activities remain numerically unknown. Future default-origin events ARE included in numeric trends with separate counts, not labeled explicitly calibrated. Explicit form Save confirms the future definition; it cannot relabel history. Known0 in a valid snapshot is not the same as absent legacy data.

No new input on normal completion, new medallion/icon art, intensity/duration/quantity/repeated-session controls, AI estimation, recommendations, Balance grade or rewards. WEIGHTS-001A changes documentation only. The storage/backup/projection proposal awaits review; WEIGHTS-001B and SPHERE-TRENDS-001 do not start automatically.
