# Game design

## Status and approved core loop

Sanctuary Gate A is owner-approved and the implemented functionality has been manually verified by the owner in Windows. This acceptance covers the present UI/tracker milestone, not absent game systems. The latest owner decision authorizes finalizing and merging PR #4; remaining artistic differences are future improvements.

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

Approved future habit identity: a small curated icon gallery, with icon choice independent of sphere contributions. Plan a primary sphere plus optional weighted secondary contributions. An icon must not determine contributions or silently change them. Current implementation stores an unweighted sphere set and derives decorative color from the first sphere; it has no independently stored icon or explicit primary-sphere field.

Weights describe how a habit contributes across spheres. Optional intensity describes one activity occurrence. They are different concepts and fields. Weight ranges, defaults, normalization, primary-sphere semantics and intensity effects require explicit decisions before coding. Do not retroactively reinterpret old snapshots.

Use a shared base frame for ordinary relics. Reserve unique silhouettes and individually authored art for rare/legendary artifacts. The current common frame is an accepted foundation, not a release defect or evidence of earned rarity.

## Implemented journal versus future activity details

Implemented: create/edit/archive/restore habits; multiple unweighted spheres; today/backdated logging; one completion per habit/local date; historical name/sphere snapshots; SQLite persistence. Archiving retains history and prevents new logs until restoration. Cancellation currently physically deletes a record; auditable corrections are a future task.

Approved future activity details: optional intensity and note attached to an activity, not to habit creation. Add them through versioned additive migrations, retaining IDs, old records and unknown/NULL legacy values. Do not rewrite applied migrations. Notes/reflections can be omitted without consequences.

Future modeling must accommodate repeated sessions and quantified activities. Occurrence identity, quantities/units, duplicate detection and migration of the unique habit/day constraint remain unresolved. The current one-completion-per-day rule does not change in this milestone.

Daily/scheduled/flexible recurrence, explicit planned rest and confirmed inactivity remain future requirements. Missing records remain unknown.

## Three independent visual states

| State | Meaning | Approved behavior | Current implementation |
| --- | --- | --- | --- |
| Selected-day activity | Is this habit recorded on the selected local date? | Illuminated or subdued; missing is unrecorded, not confirmed failure | Explicit completion/check state; richer illumination is future work |
| Recent Resonance | Recent participation/current energy | Gradual visual energy may fade gently, never a punishment | Actual Resonance calculation is not implemented |
| Permanent Mastery | Earned practice and artifact evolution | Does not decay with inactivity; survives dimmed daily/recent states | Actual Mastery progression/evolution is not implemented |

These states must not overwrite or impersonate each other. A subdued relic can retain all permanent evolution. A backdated selection does not imply resetting Mastery or reanchoring current Resonance. Current seven-day rings are read-only counts of distinct recorded dates per historical sphere snapshot; the center counts represented spheres. They are neither Resonance nor a health/balance grade.

The Sanctuary center should eventually use a unique original runic monogram instead of the present generic compass rose. This is an approved future art/UI task, not a change in this documentation release.

## Progression, resources and discovery rules

Lifetime history, discoveries and milestones survive epochs; a world's presentation/development journey can differ and later live in the museum. Mastery is accumulated practice; Resonance is recent participation; harmony describes diversity rather than personal worth.

Keep formulas pure, deterministic and versioned, with an explicit evaluation time. Exact units, thresholds, windows/fading, weight normalization, essence yields/caps and safeguards against repetitive grinding remain provisional. Decide correction/backdate behavior and idempotent grant accounting before tying permanent discoveries to editable activity history.

Initial recipe evaluation remains a bounded vocabulary of authored two- or three-element conditions/effects. No arbitrary scripts in content. Stable discovery IDs and content/rules versions prevent duplicate grants. Artifacts may unlock cosmetics, additional recipes, optional experiences and collection content; effects cannot create obligations or destroy earned practice.

## Adventure Mode scope — approved future work, not implemented

Each area has explicit small tasks in [ROADMAP](ROADMAP.md): alchemy UI, essence/material inventory, rune discovery, crafting and artifact customization, authored unique artifacts, awakening/optional experiences, collection browsing/filtering, world selection, voluntary epoch transitions, museum, reflections and microquests.

World roster: Sanctuary first, followed by planned Clockwork, Wasteland and Verdant. Versioned declarative [World Packs](WORLD_PACKS.md) reuse common journal/progression/discovery services; no new tracker per world. Releases/dates for later worlds are not promised.

Epoch change is voluntary, with a common lifetime journal and preserved previous-world museum records. No automatic expiry or forced reset. Optional quests/reflections can be ignored without consequences.

## Decisions still required

Before their respective tasks: progression math/anti-grind policy; primary/secondary weight semantics; intensity scale/effect; repeated/quantified events; renewable resource costs; historical corrections and discovery grants; epoch transfer and museum retention. [Open questions](OPEN_QUESTIONS.md) tracks these. Approved principles constrain the eventual answers; they do not silently choose formulas.

Private discovery names, actual recipes, unlock conditions and undiscovered art remain separate. Use synthetic fixtures for public rules tests. Do not access or invent a secret catalog during routine development.
