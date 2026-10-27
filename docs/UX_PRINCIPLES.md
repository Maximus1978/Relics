# UX principles

## Daily Mode

A calm, compact tracker with recognizable line icons, clear names, and quick logging. Show the selected local date, all contributing spheres, and an unambiguous saved state. Avoid animation or adventure-screen prerequisites for a completion. Android prioritizes short interactions; Windows supports keyboard navigation and visible focus.

Past dates are easy to choose. Corrections and removal are discoverable. Empty days remain unknown; planned rest and confirmed inactivity require explicit input. Recurrence must accommodate flexible activities without daily expectations.

## Adventure Mode

Collections, alchemy, crafting, balance visualization, and the museum provide a richer optional experience. Android retains access to all these capabilities. Both modes share the same journal and progression; no duplicate source of truth.

## Emotional safety

No shame messages, streak destruction, loss of earned achievements from absence, compulsory quests, or manipulative return loops. Resonance fading is a quiet description of recent activity, not an alarm. Balance is not a diagnosis or a grade. Optional notes may be empty. Return after an absence should be welcoming and require no catch-up.

## Trust and accessibility

Confirm persistence only after storage succeeds. Keep retry possible after failure. Browser-only previews must identify their storage limitation. Use labels and shape alongside color, readable typography, a target of at least 44 CSS pixels for touch actions, text scaling, safe areas, visible focus, and reduced-motion support. Verify contrast and interactions on actual target platforms.

Sanctuary's dark stone, metal, gemstones, and restrained magic support hierarchy and readability. Decorative backgrounds must not obscure controls. Epoch switching explicitly explains lifetime preservation and the museum before the user confirms.

## Implemented Sanctuary Daily Mode

SANCTUARY-UI-001 applies original CSS/SVG stone/metal surfaces, a decorative architectural header and five labeled gemstone emblems. Body/Ruby/dumbbell, Mind/Sapphire/brain, Bonds/Garnet/heart, Work/Topaz/briefcase and Recovery/Emerald/leaf are category identities, not earned progress. Compact habit cards prioritize one-click logging with an explicit completed state. Today/Yesterday/calendar share the existing local date; management remains in a small disclosure and history in an expandable journal. No gameplay navigation, scores or decorative interruptions are introduced.

Browser-only preview uses clearly labeled fictional in-memory data, resets on reload and never opens native SQLite. Native storage status and demo status are distinct. [Design, checks and acceptance](SANCTUARY_DAILY_MODE.md) record actual evidence separately from native owner review.

## Reference policy

The desktop panorama and Android collage are art-direction references. Screen composition, navigation, sample statistics, recipe examples, gemstone assignments, and textual feature promises are not approved specifications. See [reference inventory](visual-references/README.md). Sphere names in some concepts differ from the canonical model.

The owner's visual correction makes the references a minimum quality target for atmosphere and material/detail richness. Do not reduce them to a color palette or substitute flat geometric scaffolding for the intended environment. Keep Daily Mode fast and readable while increasing authored depth; distinguish actual owner visual acceptance from build/render checks.
