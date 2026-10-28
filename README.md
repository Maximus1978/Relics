# Relics

A personal life-balance application with authored RPG exploration. Offline first, Windows 11 and Android, Tauri 2 + React + TypeScript + Vite + SQLite.

## Start here

1. [Agent instructions](AGENTS.md): permanent invariants and one-task workflow.
2. [Product vision](docs/PRODUCT_VISION.md), [game design](docs/GAME_DESIGN.md), [UX principles](docs/UX_PRINCIPLES.md).
3. [Architecture](docs/ARCHITECTURE.md), [data model](docs/DATA_MODEL.md), [World Packs](docs/WORLD_PACKS.md).
4. [Roadmap](docs/ROADMAP.md), [decisions](docs/DECISIONS.md), [open questions](docs/OPEN_QUESTIONS.md).
5. [Foundation review](docs/FOUNDATION_REVIEW.md), [technology findings](docs/TECHNOLOGY_FEASIBILITY.md), [current handoff](docs/HANDOFF.md).
6. [Public Sanctuary manifest](content/sanctuary/manifest.json), [visual references](docs/visual-references/README.md), [content policy](docs/CONTENT_POLICY.md).

## Current state

The native tracker supports SQLite-backed habit creation, editing, archive/restore, multiple spheres, dated logging and historical snapshots. HABITS-001B is accepted and merged at 8fc41b39d433fd1c9d26c71757580ae3a3567e77. SANCTUARY-UI-001 visual recovery is in Gate A review in unmerged PR #4: five dimensional shrines around a central circle, relic inventory, Today/Yesterday/calendar and expandable Chronicle. The preceding visual candidates were rejected. Browser preview uses clearly labeled fictional in-memory data, discards changes on reload and never accesses native records. See [current handoff](docs/HANDOFF.md) and [visual design/acceptance](docs/SANCTUARY_DAILY_MODE.md) for verified evidence and the latest executable. Owner Gate A review precedes extensive Gate B polish; do not merge automatically.

BUILD-WIN-001 CI recovery is **PASS**: the [successful Windows run](https://github.com/Maximus1978/Relics/actions/runs/40544697531) installed locked dependencies, passed all three tests/TypeScript/Vite/browser checks, and compiled the actual Tauri release executable. [Download the Windows application ZIP](https://github.com/Maximus1978/Relics/actions/runs/40544697531/artifacts/12753125929), extract it and run relics.exe; no Node/Rust/build tools are needed for the owner. The build is unsigned and requires Windows x64 with WebView2. The owner subsequently confirmed native launch and offline activity persistence for that foundation. [PR #1](https://github.com/Maximus1978/Relics/pull/1) was merged into master at ae7c71db54a12583fd9a0e995fb461ca6635846e on the owner's explicit instruction; the workflow and minimal compilation fixes are now on the default branch. [CI documentation](docs/WINDOWS_CI.md) records exact source SHAs, artifacts and limitations. Audit revisions, schedules, weights, backup/restore, progression and gameplay remain future work.

## Development commands

The owner can obtain the application through Actions artifacts once CI succeeds; see [artifact retrieval](docs/WINDOWS_CI.md). The following commands are optional developer instructions for ordinary Windows PowerShell, not required user setup:

```sh
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run tauri -- dev
```

Windows requires Rust, MSVC Build Tools, and WebView2. Android setup is a separate task requiring JDK, Android SDK/NDK, Rust targets, and a device/emulator. Once configured: `npm run tauri android init`, then `npm run tauri android dev`. Consult [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and [SQL plugin documentation](https://v2.tauri.app/plugin/sql/).

For browser-only preview, run `npm.cmd run dev` and open http://localhost:1420; the labeled fictional demonstration is interactive but has no persistent storage. Stop that server before starting Tauri dev. One task at a time: SANCTUARY-UI-001 awaits visual/native review; no Android or game feature should start automatically. Read [HANDOFF](docs/HANDOFF.md) for the current boundary.

## Data and content

Each device has its own SQLite database; shared schema does not imply device synchronization. JSON backup/restore is required but not implemented. The scaffold is not ready for irreplaceable personal data.

Images are preserved as art references, not runtime assets or final UX. private/ is an empty ignored slot for separately authorized content. No secret recipes have been invented or imported. origin is configured for https://github.com/Maximus1978/Relics; the owner published the original two commits. See git history and [HANDOFF](docs/HANDOFF.md) for subsequent task/publication status.

## HABITS-001A delivery

[PR #2](https://github.com/Maximus1978/Relics/pull/2) implemented custom habit creation with multiple canonical spheres and database-loaded lists. [CI run 40565215658](https://github.com/Maximus1978/Relics/actions/runs/40565215658) passed all 12 tests, TypeScript, Vite and native Windows compilation on 97b97edb12c9d92752010a44a7f3a413fe4bbeac. The owner accepted native/offline behavior and merged it at 544d813f26f5b6a4be39d36a81bc4bb7c1feba3e. Its artifact predates edit/archive/restore. [HABITS-001B](docs/HABITS_001B.md) records the separate lifecycle change and current acceptance instructions.
