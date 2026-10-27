# Closed authored content policy

Public world metadata and shared mechanics live in content/ and GAME_DESIGN.md. Hidden names, recipe conditions, unlock rules, undiscovered artwork, microquests and transformations must not appear in public manifests or routine summaries.

The closed layer is private/, ignored by Git and not imported by the current application. It is an empty slot: actual authored recipes were not retrieved from the old conversation. Do not invent previously agreed secrets or promote illustrated recipe examples into canon.

Routine development uses synthetic fixtures. Do not scan ignored files, read private/, print catalog details, or include secret conditions in tests/snapshots/logs. A separate explicit authored-content task may import the package with minimum disclosure.

That task should define schema/content versions, stable IDs, compatibility, validation and a separate backup. Validate with synthetic fixtures first; include closed content only by explicit packaging configuration. Routine reports state validation success without revealing names or conditions. Git ignore rules do not provide backup.

In an offline app, anyone inspecting source or packaged data can potentially recover recipes. Separation prevents accidental spoilers, not deliberate reverse engineering. ChatGPT integration may assist authoring later, but is never required for application operation.
