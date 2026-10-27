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

Documentation has been reconciled with the supplied foundation brief. Source remains a small scaffold: three demo habits, date selection, idempotent daily logging, journal, and cancellation through a SQLite adapter. One habit covers two spheres. Browser preview explicitly does not persist records. Native Windows launch and visual rendering are still unverified.

BUILD-WIN-001 is BLOCKED by execution-environment restrictions. npm installation succeeded initially and package-lock.json now locks JavaScript dependencies. The three existing tests and TypeScript check passed. Clean reinstall, Vite build, Cargo dependency resolution and native launch did not pass verification; Cargo.lock is still absent. The ignored dependency tree needs a clean npm ci outside this runner. See the [Windows build report and exact launch instructions](docs/BUILD_WINDOWS.md). Audit revisions, schedules, weights, backup/restore, progression, and gameplay remain future work.

## Development commands

Run in ordinary Windows PowerShell from this repository, after checking the prerequisites in the Windows build guide:

```sh
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run tauri -- dev
```

Windows requires Rust, MSVC Build Tools, and WebView2. Android setup is a separate task requiring JDK, Android SDK/NDK, Rust targets, and a device/emulator. Once configured: `npm run tauri android init`, then `npm run tauri android dev`. Consult [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and [SQL plugin documentation](https://v2.tauri.app/plugin/sql/).

For browser-only preview, run `npm.cmd run dev` and open http://localhost:1420; persistence is unavailable there. Stop that server before starting Tauri dev. One task at a time: finish the blocked BUILD-WIN-001 before starting WIN-LOG-001, Android setup or features. Read [HANDOFF](docs/HANDOFF.md) for the current boundary.

## Data and content

Each device has its own SQLite database; shared schema does not imply device synchronization. JSON backup/restore is required but not implemented. The scaffold is not ready for irreplaceable personal data.

Images are preserved as art references, not runtime assets or final UX. private/ is an empty ignored slot for separately authorized content. No secret recipes have been invented or imported. origin is configured for https://github.com/Maximus1978/Relics; the owner published the original two commits. See git history and [HANDOFF](docs/HANDOFF.md) for subsequent task/publication status.
