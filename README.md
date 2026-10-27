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

Documentation has been reconciled with the supplied foundation brief. Source remains a small unverified scaffold: three demo habits, date selection, idempotent daily logging, journal, and cancellation through a SQLite adapter. One habit covers two spheres. Browser preview explicitly does not persist records.

Three domain/Node SQLite tests passed during foundation creation. Web, Windows, and Android builds have not passed verification: dependencies were unavailable and expanded access was rejected. No dependency lockfiles exist yet. Audit revisions, schedules, weights, backup/restore, progression, and gameplay remain future work.

## Development commands

Run in a suitably configured environment within a separately selected build task:

```sh
npm install
npm test
npm run build
npm run tauri dev
```

Windows requires Rust, MSVC Build Tools, and WebView2. Android setup is a separate task requiring JDK, Android SDK/NDK, Rust targets, and a device/emulator. Once configured: `npm run tauri android init`, then `npm run tauri android dev`. Consult [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and [SQL plugin documentation](https://v2.tauri.app/plugin/sql/).

One task at a time: next queued task BUILD-WIN-001 verifies the Windows scaffold build. Do not combine it with Android setup or feature development. Read [HANDOFF](docs/HANDOFF.md) for its boundary.

## Data and content

Each device has its own SQLite database; shared schema does not imply device synchronization. JSON backup/restore is required but not implemented. The scaffold is not ready for irreplaceable personal data.

Images are preserved as art references, not runtime assets or final UX. private/ is an empty ignored slot for separately authorized content. No secret recipes have been invented or imported. This is a local Git working directory; see git history and [HANDOFF](docs/HANDOFF.md) for commit/publication status. origin is configured for https://github.com/Maximus1978/Relics, but upload is blocked on GitHub authentication.
