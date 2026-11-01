# Relics agent instructions

Read README.md, docs/PRODUCT_VISION.md, docs/ROADMAP.md, docs/DECISIONS.md, and docs/HANDOFF.md before changes. Read the relevant design document for the active task. The canonical specification is under docs/; do not recreate competing root copies.

## One task at a time

- Identify exactly one active task and its acceptance criteria before editing. Record it in docs/HANDOFF.md.
- Ask the owner clarifying questions early whenever uncertainty affects the task. Ask before making the uncertain decision or starting dependent work; do not silently substitute assumptions. Keep questions concise and explain what the answer determines. Continue only already-defined work within the same task while awaiting an answer.
- Work only within that task. A roadmap or broad foundation brief is context, not authorization to implement every feature in it at once.
- Keep future implementation work queued. Do not start the next task automatically when the active task finishes or becomes blocked.
- When blocked, record evidence and the next prerequisite; do not switch to another feature to fill time.
- Conclude with the task outcome, checks, remaining limits, and one next queued task. Update the handoff and relevant decisions.

## Product and engineering invariants

- Report to the owner in Russian. Keep code identifiers and technical documentation in English; localized product copy may be Russian.
- Preserve offline first, Windows 11 + Android, Tauri 2 + React + TypeScript + Vite + SQLite, and the SVG visual direction.
- Keep stable sphere IDs: body, mind, relationships, work, recovery. Bonds is the English term for relationships. Subjective sphere contributions are independent integers 1–10 for selected spheres, 0 otherwise, new selection default 5, no normalization or intensity/health claim. See docs/WEIGHTS_001A.md and docs/WEIGHTS_001B.md. Contribution persistence/editor/backup are owner-accepted in Windows and PR #8 merged at 293e7d20. SPHERE-TRENDS-001 (including rolling7 days) is owner-accepted on Windows; PR #9 merged at 39af6b78. NAV-CHRONICLE-001 is owner-accepted on Windows and PR #10 merged8503670a31b8adc74bac61b6a84826e6772664eb. PROGRESS-001 reviewed head c43c097 was merged normally in PR #11 at5b7229d58c040c7ebd44d0fe423f92bdc82c57e2 as a proposed contract,P01–P09 not final. UI-COLLAPSE-001 owner-accepted functionally and PR12 merged de1b2f9;native offline restart separately unconfirmed. Active HABIT-RHYTHM-001 implements only frequency/editor/history/archive metadata and005/v3,not progression;separate unmerged review PR. Preserve snapshot-only math and binary rune independence.
- Permanent achievements never decay due to absence. Recent Resonance may fade descriptively; do not turn it into a penalty. No forced streaks, deadlines, catch-up, daily-login rewards, or mandatory quests.
- Keep lifetime progress separate from epoch presentation/progress. The journal is authoritative. Preserve history across voluntary world changes.
- Distinguish implemented behavior from requirements and proposals. Never report an unverified build or an unimplemented feature as complete.
- Maintain pure domain rules, deterministic calculations, versioned migrations/content, stable IDs, and minimal dependencies. Add tests with the relevant behavior; do not fabricate tests for absent systems.
- Treat concept statistics, recipe examples, layouts, and feature promises as references. Do not reproduce proprietary Diablo artwork.
- The owner's supplied prototype screens set the minimum visual target for atmosphere, material depth and authored detail. Compare actual renders with both references; a similar palette or a green build is not visual acceptance. Do not replace the intended rich environment with flat placeholders and call the design finished. Preserve quick, accessible Daily Mode while meeting that quality bar.
- Sanctuary Gate A, BACKUP-001 and SANCTUARY-STATE-001 are owner-accepted in Windows. DOC-GAME-002 authorizes documentation consolidation and regular merge of PR #6 after verifying unchanged tested runtime/art. Preserve the accepted four-state central rune and selected-day gemstones; do not reopen visual gates for non-blocking polish. HANDOFF records actual release state. The completed WEIGHTS/trends/NAV queue is superseded by PROGRESS-001 REVISION: docs review → UI-COLLAPSE-001 → HABIT-RHYTHM-001 → HABIT-SIGILS-001/icons → PROGRESS-002A/B → ARCHIVE-CLEANUP-001 → AUDIO-001. Android is deferred until core mechanics are validated on Windows; keep all approved tasks. Begin no next task automatically.
- The central medallion must use clean independent frame/rune/stone masters and separate signs/light layers. Never restore a complete-render crop or opaque backdrop. Compare against the reference-only original, validate interior alpha and unchanged four-state geometry, and check scaling at 1920/2560 plus narrow sizes. See docs/art/MEDALLION_LAYERS.md.
- The owner approved original bundled raster environment artwork for Sanctuary alongside CSS/SVG controls. Preserve offline assets and document provenance; do not rasterize interactive controls, embed fake game results or add remote artwork dependencies.

## Spoiler boundary

- Do not read, search, print, or summarize private/ during routine work. Do not run searches including ignored files from the repository root.
- Access closed content only for an explicit owner task about authored content, with minimal disclosure.
- Keep hidden names, recipes, conditions, and undiscovered artwork out of documentation, logs, tests, snapshots, and default builds. Use synthetic fixtures.
- No real closed catalog has been imported. See docs/CONTENT_POLICY.md.
- Do not commit personal databases, notes, logs, or closed content. Do not create commits/branches or publish without the applicable user instruction.

## Progression specification and current task boundary

Read docs/HABIT_RHYTHM_001.md for the active frequency task. Gate A data/native recovery tests must pass before UI integration. Three enum values daily/three_per_week/weekly;legacy unconfigured;first enrollment actual native local today;later next Monday strictly after today;stable IDs/applied history and cancellable replaceable pending rule. Approved legacy archive start NULL with legacy_unknown provenance and actual local restore end,neutral for future progression. Preserve migrations001–004,all snapshots,identity,one/day,rune/trends/Chronicle/collapse. Additive005/strictv3 andv1/v2 adapters,one pinned FK-enabled semantic native transaction. P01–P09 remain proposed gameplay;no progression or new art. Do not merge this task PR or begin HABIT-SIGILS-001 automatically.
