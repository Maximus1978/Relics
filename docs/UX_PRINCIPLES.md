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

The owner visually approved Gate A and manually verified the implemented Windows functionality. Remaining artistic differences are accepted for this milestone and tracked as optional improvements; they do not block its authorized merge/release. This does not mark absent progression or Adventure features complete.

SANCTUARY-UI-001 recovery integrates one local painterly environment, dimensional stone/brass shrine structures, a prominent central circle and collectible pendant inventory. Body/Ruby/dumbbell, Mind/Sapphire/brain, Bonds/Garnet/heart, Work/Topaz/briefcase and Recovery/Emerald/leaf are category identities. Rings describe distinct recorded days during the latest seven local calendar days; the center counts represented spheres. Neither measures personal worth or progress toward an obligation. Today/Yesterday/calendar controls share the existing logging date; one-click completion has an explicit saved state. Create/edit uses a modal/full-screen sheet, management a small disclosure, history an expandable Chronicle. Navigation exposes only implemented sections.

Browser-only preview uses clearly labeled fictional in-memory data, resets on reload and never opens native SQLite. Native storage status and demo status are distinct. [Design, checks and acceptance](SANCTUARY_DAILY_MODE.md) distinguish CI/browser evidence from the owner's subsequent native acceptance.

## Independent visual states and future identity rules

| Visual layer | User meaning | Must remain independent from |
| --- | --- | --- |
| Selected-day activity | Illuminated/subdued according to the selected date's record | Current-period Resonance and permanent evolution |
| Recent Resonance | Gradual current visual energy; gentle fading without punishment | Selected-day completion and permanent Mastery |
| Permanent Mastery | Earned artifact evolution retained through inactivity | Missing daily entries or faded recent energy |

Subdued means no recorded activity for that selected date, never confirmed failure. A relic retains earned structure/evolution when daily illumination or recent glow is quiet. Do not invent Resonance values before real projections exist. The present seven-day recorded-date counts are descriptive observations, not an implemented progression model. SANCTUARY-STATE-001 implements selected-day gemstones and an original Sanctuary runic monogram for owner review. Shrine and wheel stones follow the selected local date; the rune follows current-seven-day sphere coverage. Both timeframes are labeled. Light never indicates a reward or diagnosis. [Exact state/material contract](SANCTUARY_STATES.md). Real Resonance and permanent evolution remain future work.

A small curated habit icon gallery is planned independently of sphere selection. Choosing an icon must not silently change sphere contributions. The future primary sphere/weighted secondary editor must distinguish contribution weights from optional per-activity intensity. Shared ordinary-relic frames are intentional; authored rare/legendary artifacts receive unique shapes and art.

Habit creation defines identity and contributions. Logging records an actual occurrence. Optional note/intensity belong to that occurrence and must persist through an additive migration before controls ship. No fake fields, required journaling or change to the current one-completion-per-day rule here.

Adventure Mode invites player-driven experiments and optional experiences. Discoveries may reward diversity, unexpected combinations, returning interests and exploration without communicating an optimal XP-grinding route, compulsory checklist or required login. Cosmetics, recipes and collection unlocks are opportunities, not obligations. Basic experiments never spend permanent Mastery/progress.

## Reference policy

The owner-supplied VISUAL_CONTRACT v0.2 makes the original desktop panorama authoritative for SANCTUARY-UI-001 recovery composition, hierarchy, object proportions, materials and density (~90% perceptual fidelity). The Android collage governs future mobile aesthetics; no Android build is authorized here. Sample statistics, recipes and unsupported controls are not behavior specifications. See [reference inventory](visual-references/README.md). Sphere names in some concepts differ from the canonical model.

The references remain a quality guide for future art, while the owner has accepted the current Sanctuary milestone's differences. Keep Daily Mode fast/readable; do not reopen an accepted release gate solely for optional polish. Native owner acceptance and build/render checks are distinct evidence.
