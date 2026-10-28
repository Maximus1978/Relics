# World Packs

## Approved contract; implementation status

A versioned declarative World Pack changes presentation and narrative interpretation while reusing common journal, progression, epoch and discovery services. Public metadata includes schemaVersion, contentVersion, stable ID, supported domain/rules compatibility, localization, visual tokens, icon/gem mappings, asset references and validated component identifiers. Executable schema/validator/loader remain future WORLD-001 work.

The public Sanctuary manifest is basic metadata and pending-system information, not a complete pack loader or secret catalog. The accepted Sanctuary UI uses original bundled raster art plus real HTML/CSS/SVG; its acceptance does not mean Adventure Mode is implemented.

## Approved world roster

| World | Presentation direction | Shared mechanics interpreted as |
| --- | --- | --- |
| Sanctuary | Original gothic stone, aged metal, runes, gemstones | Alchemy and enchanted artifacts |
| Clockwork | Steampunk engineering | Blueprints and mechanical inventions |
| Wasteland | Exploration and restoration | Scavenging and technology repair |
| Verdant | Magical gardens | Cultivation and botanical discoveries |

These four worlds remain the product roster, not merely substitute suggestions. Sanctuary is first. Later pack delivery dates/assets are undecided; they are not currently selectable/implemented worlds. New worlds reuse tracking/progression logic rather than rewriting it.

## Independent identity, appearance and effects

Habit icon selection comes from a small curated gallery independent of sphere contributions. The future explicit primary sphere and optional weighted secondaries belong to domain data, not arbitrary pack logic. Activity intensity is a separate per-event attribute. Packs can style approved identities but cannot change historical snapshots, contribution semantics or grant rules through art.

Ordinary relics share a reusable base frame. Rare/legendary artifacts reserve unique silhouettes and individually authored artwork; finite curated content provides meaningful discovery. Exact material/gem polish is presentation, not proof of earned rarity. Raster layers may supply dimensional decoration; labels, rings, forms and accessibility remain real HTML/SVG. Record licensing/original-art provenance; do not copy proprietary game assets.

Separate selected-day illumination, gradual recent Resonance and permanent Mastery evolution. A subdued daily/recent state must not erase earned art/evolution. Sanctuary's center is planned to receive an original runic monogram instead of the current generic compass. Packs select registered application components and validated parameters, never injected scripts.

## Discovery and Adventure content — future

World Packs must be able to describe approved thematic essences/materials, rune definitions, authored recipes/discoveries, cosmetic variants/customization, unique artifacts, awakening/optional experiences, collection categories and optional reflections/microquests using a constrained vocabulary. This is an approved future capability, not an existing schema or permission to invent catalog contents.

The intended loop is real activities → Mastery/essences → player experiments → authored discoveries → optional experiences. Effects can unlock cosmetics, additional recipes, experiences or collection content, with idempotent versioned grants. Basic experimentation never spends permanent progress. Renewable inventory costs, yields, caps and correction behavior require decisions before implementation.

Distinct tasks for alchemy UI, inventory, rules, runes, crafting/customization, artifacts/awakening, collection and optional content are in [ROADMAP](ROADMAP.md). No arbitrary executable pack code, infinite random loot, compulsory tasks or daily-login incentives.

## Public and closed packages

Keep public metadata separate from undiscovered names, recipe conditions, microquests, transformations and hidden art. Routine logs/tests/reports must not expose real secret content. Use synthetic fixtures for validator/rule tests. The closed catalog is absent and excluded from Git/default builds; do not access private/ for this documentation task. See [content policy](CONTENT_POLICY.md).

Persist stable IDs plus content/rules versions with discoveries. Validate duplicate IDs, missing assets, supported conditions/effects, bounded recipe arity and compatibility before activation. Never silently remove earned discoveries because an asset/pack changed. Public backups must not accidentally disclose a closed catalog; earned references and pack compatibility need explicit backup/version policy.

## World selection, epochs and museum — future

WORLD-SELECT-001 exposes installed compatible worlds honestly. EPOCH-001 makes transition voluntary and explains lifetime preservation. MUSEUM-001 retains and browses previous-world journeys alongside a common life journal. No automatic season expiry, forced reset or deletion of lifetime achievements.

Resource transfer, backdated edits across closed epochs, museum snapshot format and historical asset retention/version compatibility remain open implementation decisions. Preserve stable record identities and the ability to read historical packs. Do not infer these choices from concept illustrations.
