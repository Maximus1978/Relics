# Game design

## Activity loop

Real experience → dated journal entry → weighted sphere contributions → derived progression → optional exploration, collection, and experimentation. Daily logging does not require entering the adventure experience.

| Stable sphere ID | English term | Russian display label | Meaning |
| --- | --- | --- | --- |
| body | Body | Тело | Movement and physical care |
| mind | Mind | Разум | Learning, meditation, reflection |
| relationships | Bonds | Отношения | Family, friendship, connection |
| work | Work | Дело | Professional work, projects, creativity |
| recovery | Recovery | Восстановление | Rest, nature, recreation, enjoyment |

Keep `relationships` as the existing stable ID; Bonds is its English product term. Each sphere requires a recognizable line icon, visual identity, and gemstone; specific gemstone assignments are still open.

## Habits and journal

Habits support creation, editing, archiving, restoration, and daily, scheduled, or flexible recurrence. Contributions can cover multiple spheres with configurable weights. Weight normalization, recurrence semantics, and retrospective schedule changes require decisions before implementation.

Log today or an earlier local calendar date, then edit or remove mistakes. Notes and emotional reflections are optional. Planned rest, explicit inactivity, and unknown/unrecorded days have different meanings. An empty day is never automatically a failure.

The existing scaffold supports one completion per habit/day. This is a temporary constraint, not a final restriction on repeated sessions, quantities, or flexible activities. Existing cancellation physically deletes a row; auditable corrections remain required work.

## Independent progression systems

| System | Meaning | Persistence |
| --- | --- | --- |
| Lifetime | Activity history, discoveries, milestones, long-term statistics | Survives every epoch transition |
| Season / epoch | The current world's visual development journey | Previous journey preserved in the museum |
| Mastery | Accumulated practice and artifact development | No loss from absence; exact lifetime/epoch projections remain open |
| Resonance | Recent participation and current visual energy of a sphere | May fade naturally without destroying permanent achievements |
| Balance / harmony | Diversity of life areas receiving attention over time | Descriptive invitation, never a human-worth or health score |

Resonance is not the measure of cross-sphere combinations. Combinations belong to balance, discovery, and crafting rules. Keep formulas deterministic and versioned; inject the evaluation date/time. Exact windows, units, thresholds, and bonuses are undecided. Show no invented percentages in the scaffold.

## Alchemy and crafting

Real activity supplies thematic elements or essences. Initial recipe evaluation supports combinations of two or three elements and authored, validated rules. Basic experimentation must not consume accumulated practice or permanent progress. Resource inventory and any advanced crafting costs remain open.

Use a constrained declarative rules engine with a small vocabulary of conditions and effects. Do not execute scripts supplied by artifact definitions. Persist discovery IDs with content/rules versions; repeated evaluation must not duplicate grants. Define correction behavior before attaching permanent rewards to mutable activity history.

Common artifacts use reusable SVG layers: metals, gemstones, frames, ornaments, and glow. Rare/legendary pieces may use individually authored illustrations and curated presentation. Effects may unlock cosmetics, collection content, or optional experiences. Finite authored content provides meaning; infinite randomized visual combinations are not the uniqueness strategy.

## Epochs, optional experiences, and secrecy

Epoch changes are voluntary. Familiar habits can develop visually again in another world, while lifetime achievements and the common journal persist. The museum preserves previous journeys. No expiry timer or forced reset.

Microquests and reflections can be ignored without consequences. Future ChatGPT assistance is optional. Hidden definitions, conditions, and names stay outside routine development output; see [content policy](CONTENT_POLICY.md). No real recipes have been imported.
