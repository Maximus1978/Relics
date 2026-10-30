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

The native tracker supports SQLite-backed habit creation/edit/archive/restore, multiple spheres, dated logging and historical snapshots. Sanctuary Gate A is owner-approved and its implemented functionality has been manually verified in Windows: five dimensional shrines, central circle, relic inventory, date controls and Chronicle. Remaining artistic differences are accepted for this milestone. [PR #4](https://github.com/Maximus1978/Relics/pull/4) is the owner-authorized release; its checks/merge timeline record the final head and integration. Browser preview uses clearly labeled fictional in-memory data and resets on reload. See [handoff](docs/HANDOFF.md), [design/acceptance](docs/SANCTUARY_DAILY_MODE.md) and [small-task roadmap](docs/ROADMAP.md). New game decisions are documented future work; BACKUP-001 is owner-accepted and merged in PR #5 at 234c35a7be4306ba1fee082f01409122715e2846. SANCTUARY-STATE-001 functionality, four-state rune, independent daily stones and responsive transparent layers are owner-accepted after Windows testing. DOC-GAME-002 consolidates decisions and releases PR #6 without changing the implementation; [contract](docs/SANCTUARY_STATES.md).

BUILD-WIN-001 CI recovery is **PASS**: the [successful Windows run](https://github.com/Maximus1978/Relics/actions/runs/40544697531) installed locked dependencies, passed all three tests/TypeScript/Vite/browser checks, and compiled the actual Tauri release executable. [Download the Windows application ZIP](https://github.com/Maximus1978/Relics/actions/runs/40544697531/artifacts/12753125929), extract it and run relics.exe; no Node/Rust/build tools are needed for the owner. The build is unsigned and requires Windows x64 with WebView2. The owner subsequently confirmed native launch and offline activity persistence for that foundation. [PR #1](https://github.com/Maximus1978/Relics/pull/1) was merged into master at ae7c71db54a12583fd9a0e995fb461ca6635846e on the owner's explicit instruction; the workflow and minimal compilation fixes are now on the default branch. [CI documentation](docs/WINDOWS_CI.md) records exact source SHAs, artifacts and limitations. Audit revisions, schedules, progression and gameplay remain future work; subjective contributions were accepted in PR #8, with read-only trends now a separate review candidate.

## Development commands

The owner can obtain the application through Actions artifacts once CI succeeds; see [artifact retrieval](docs/WINDOWS_CI.md). The following commands are optional developer instructions for ordinary Windows PowerShell, not required user setup:

```sh
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run tauri -- dev
```

Windows requires Rust, MSVC Build Tools, and WebView2. Android setup is a separate task requiring JDK, Android SDK/NDK, Rust targets, and a device/emulator. Once configured: `npm run tauri android init`, then `npm run tauri android dev`. Consult [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and [SQL plugin documentation](https://v2.tauri.app/plugin/sql/).

For browser-only preview, run `npm.cmd run dev` and open http://localhost:1420; the fictional demonstration has no persistent storage, and native backup actions are unavailable. Stop that server before Tauri dev. BACKUP-001 adds a Windows Резервная копия utility with native export/validated preview/confirmed full replacement and protective recovery copies; [format, limits and manual acceptance](docs/BACKUP.md). The owner accepted and merged BACKUP-001. No next task starts automatically; read [HANDOFF](docs/HANDOFF.md).

## Data and content

Each device has its own SQLite database; shared schema does not imply device synchronization. Native Windows JSON backup/restore is implemented and owner-accepted; [format and recovery limitations](docs/BACKUP.md). Keep private backups of valuable history.

Supplied concept boards remain visual references; original offline runtime art is bundled under public/art/recovery/v1. State rendering follows the supplied style guide; the owner accepted STATE-001's functionality and current visual direction; remaining art imperfections are non-blocking backlog items. private/ is an empty ignored slot for separately authorized content. No secret recipes have been invented or imported. origin is configured for https://github.com/Maximus1978/Relics; the owner published the original two commits. See git history and [HANDOFF](docs/HANDOFF.md) for subsequent task/publication status.

## HABITS-001A delivery

[PR #2](https://github.com/Maximus1978/Relics/pull/2) implemented custom habit creation with multiple canonical spheres and database-loaded lists. [CI run 40565215658](https://github.com/Maximus1978/Relics/actions/runs/40565215658) passed all 12 tests, TypeScript, Vite and native Windows compilation on 97b97edb12c9d92752010a44a7f3a413fe4bbeac. The owner accepted native/offline behavior and merged it at 544d813f26f5b6a4be39d36a81bc4bb7c1feba3e. Its artifact predates edit/archive/restore. [HABITS-001B](docs/HABITS_001B.md) records the separate lifecycle change and current acceptance instructions.

DOC-GAME-002 records the distinction between Habit Sigils (planned label: «Печати привычек»), earned Unique Artifacts, Chronicle and Museum. Progression, Balance KPIs, Blessings, Vacation Mode and audio remain unimplemented. The owner subsequently reprioritized WEIGHTS-001A specification → WEIGHTS-001B implementation → SPHERE-TRENDS-001 → NAV-CHRONICLE-001; Android is deferred until Windows core-mechanics validation. Contribution persistence/editor and v2 backups are owner-accepted and merged in [PR #8](https://github.com/Maximus1978/Relics/pull/8); analytics is a separate unmerged [PR #9](https://github.com/Maximus1978/Relics/pull/9) review candidate; [review contract](docs/WEIGHTS_001A.md); see [ROADMAP](docs/ROADMAP.md) and [HANDOFF](docs/HANDOFF.md). No automatic continuation.

WEIGHTS-001B: shared Create/Edit subjective 1–10 controls, additive migration 004, immutable event profiles and strict v1-import/v2-export/native recovery were owner-accepted on Windows and PR #8 merged at 293e7d20 after the approved PR #7 merge. [Evidence, compatibility and Windows acceptance](docs/WEIGHTS_001B.md). Close older binaries before the schema 4 upgrade and keep a private pre-upgrade backup.

SPHERE-TRENDS-001 review candidate: [Life Rhythm contract and verification](docs/SPHERE_TRENDS_001.md). Owner accepted WEIGHTS-001B and PR #8 merged at293e7d20. New analytics uses immutable recorded profiles,4/8 completed weeks, absolute units/shares and transparent legacy/default counts. No schema, backup, rune or navigation changes; separate PR remains unmerged for acceptance.
