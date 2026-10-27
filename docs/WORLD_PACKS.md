# World Packs

## Contract

A versioned declarative World Pack changes presentation and narrative interpretation while reusing journal, progression, epoch, and discovery systems. Its metadata includes `schemaVersion`, `contentVersion`, stable `id`, supported domain/rules compatibility, localization, visual tokens, icon/gem mappings, asset references, and validated component identifiers. Exact executable schema remains a future task.

The public Sanctuary manifest currently contains only basic metadata and pending systems. It is not yet a full pack loader, schema validator, or packaged catalog.

## Shared mechanics and different meanings

| World | Presentation direction | Interpretation |
| --- | --- | --- |
| Sanctuary | Original gothic stone, aged metal, runes, gemstones | Alchemy and enchanted artifacts |
| Clockwork | Steampunk engineering | Blueprints and mechanical inventions |
| Wasteland | Exploration and restoration | Scavenging and technology repair |
| Verdant | Magical gardens | Cultivation and botanical discoveries |

Sanctuary is the first world. Others are possible directions with no release commitment. A new world primarily requires content and presentation components, not rewritten tracking or progression logic.

## Visual composition

Common artifacts use SVG layers and constrained parameters for metal, gemstone, frame, ornaments, and restrained glow. Rare/legendary artwork is individually authored. A finite curated catalog carries the meaningful differences. Do not copy proprietary Diablo artwork. Final art licensing/provenance must be recorded with delivered assets.

World-specific components are registered in application code using a known identifier. Packs may select a registered component and validated parameters; they cannot inject arbitrary scripts. Platform-specific layouts remain possible.

## Public and closed packages

Keep public world metadata separate from undiscovered definitions, recipe conditions, microquests, and transformations. Routine logs and reports contain no spoiler names. The closed package is currently absent and is excluded from Git and default builds. See [content policy](CONTENT_POLICY.md).

Persist content versions and stable IDs with discoveries. Validate duplicate IDs, missing asset references, supported condition/effect vocabulary, recipe arity of two or three, and compatibility before activation. Migrate content deliberately; never silently remove an earned discovery because artwork or a pack version changed.

## Epoch lifecycle

Activating another epoch is an explicit user choice. Preserve the previous journey for the museum and keep a common lifetime journal. Content retention and museum snapshot format are open decisions. No automatic season expiry, forced world switch, or deletion of lifetime progress.
