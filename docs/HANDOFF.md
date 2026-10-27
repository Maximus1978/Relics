# Project handoff

Updated 2026-10-27. SANCTUARY-UI-001 painterly integration/CI delivery is complete; owner visual/native acceptance is pending. [PR #4](https://github.com/Maximus1978/Relics/pull/4) remains open/unmerged. Do not merge automatically or begin another task.

## Resolved owner direction

The owner requires the atmosphere/material/detail of both supplied prototype screens or better. A shared palette or green CI is not visual acceptance. Both reference images were reopened and the actual renders compared against them.

The owner explicitly selected “Да: оригинальный растровый арт + CSS/SVG” on 2026-10-27. Original raster environment artwork is authorized; do not ask the asset-format question again. The earlier flat/vector-only proposals are superseded. Owner acceptance of this new visual candidate is still pending.

## Baseline and preserved scope

Accepted HABITS-001B master is 8fc41b39d433fd1c9d26c71757580ae3a3567e77. Work continues on feature/sanctuary-ui-001 / PR #4.

Habit creation/edit/archive/restore, multisphere definitions, today/backdating, snapshots, cancellation and SQLite persistence use unchanged rules/repository. Domain, SQL adapter, migrations/schema, original IDs, native identity/database, dependencies/locks and Windows workflow were compared to the baseline and remain unchanged. No private/ content or owner database was accessed. Browser demonstration is explicitly fictional/in-memory, not a native persistence test.

## Implemented presentation

- One original painted environment with detailed gothic architecture, worn stone, bridge/terraces, vegetation, mountains/mist and warm windows. CSS crop/glaze/fade protects UI readability; the cathedral is not duplicated in a separate hero.
- Interactive controls/text/state remain React/CSS/SVG. Five canonical sphere labels/icons/gemstones, dimensional metal/gem settings, engraved panel frames, stone grain at 256px and beveled controls.
- Frame source has fixed 120×120 dimensions to preserve ornament at different panel heights. No new library/font/dependency.
- Existing fast completion, date shortcuts/calendar, validated forms, contextual management, explicit archive confirmation and expandable historical journal remain. No fake progress, unsupported navigation or gameplay.

## Asset provenance

The built-in imagegen tool generated a new environment; no CLI/API fallback, external asset download or prototype crop was used. The selected original PNG was copied byte-for-byte into public/art/sanctuary-environment-v1.png (1672×941; 3,049,722 bytes). SHA256 e3a600959a5ae893ef5f952cd1e9944f78856fed109a9ab55a70f4b68c2f8700. Runtime uses a bundled local URL and no generation/network service.

[Exact final prompt, method and provenance](art/SANCTUARY_ENVIRONMENT.md). The preceding SVG engraving is retained as historical authored source but is no longer loaded by the screen. No secret artifact content was invented or imported.

## Current verification

Tested feature source: 59481e388c37d665ef4eb1c5f595215788ec5d01. PR merge source: e304fb2677b6aaf3495b9d2c3002e8ab00409c65. [Windows run 40603575817](https://github.com/Maximus1978/Relics/actions/runs/40603575817) completed / success: npm ci, 25/25 tests (including all 23 unchanged SQLite/domain tests), TypeScript, Vite, 36 browser checks, locked Cargo fetch, actual native Tauri release compilation and uploads. A subsequent documentation-only evidence commit uses [skip ci]; runtime source/art/tests/browser scripts remain identical to this tested head.

[Browser evidence](https://github.com/Maximus1978/Relics/actions/runs/40603575817/artifacts/12778999481), 5,627,253 bytes. Downloaded ZIP digest matched GitHub: a2829c1f7c0b74e585df1bc3505d407d45aa61bc83ef21dc7af37fc5d6410fbd. Desktop 1280, desktop 1000, 390px narrow screen and expanded journal were inspected. Checks include local high-resolution asset/single-scene loading, keyboard/focus/validation, completion/date shortcuts/backdating, management/journal actions, original snapshots, preview reset, 320–1280px overflow, 44px actions, enlarged text and reduced motion. Reported runtime exceptions: zero.

Local screenshots outside the repo: outputs/Relics-Sanctuary-painterly-desktop.png, Relics-Sanctuary-painterly-1000.png, Relics-Sanctuary-painterly-mobile.png and Relics-Sanctuary-painterly-journal.png. These show fictional browser data and do not establish native runtime correctness.

## Executable delivery

[Download the new Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40603575817/artifacts/12780441428), 7,305,764 bytes. Local copy: outputs/Relics-Sanctuary-UI-001-painterly-windows-x64.zip outside Git. It contains relics.exe, locks, build metadata, checksum and launch note. ZIP SHA256 db7905d43b22ba25c6ede8e5184919ff05b22b21e39ca8fc0f61bf582728d0ea; EXE SHA256 5a202681dbd94b58a2be85ed33f209e8d16a70af57a93109bb6ae40cf728e2b8. Downloaded ZIP matched GitHub's digest, EXE matched its manifest and build-info.json confirmed the exact feature/merge SHAs, unsigned output and nativeUiRuntimeVerified=false. Artifact retention ends 2026-11-10.

Git publication uses expected-parent checks and no force push/history rewrite. The local workspace tracks feature/sanctuary-ui-001. The approved runtime PNG is intentionally versioned; owner databases, private content, credentials, logs, EXE/ZIP/build outputs and screenshots are excluded from commits.

## Next queued step and limits

Owner/product visual and native review is next. Close the old Relics, extract the new ZIP separately and run relics.exe without compiler installation. Compare the atmosphere/detail with both original references and check native WebView2 appearance, keyboard/readability, today/yesterday/past-date logging, create/edit/archive/cancel/restore, journal cancellation and offline restart with old history. Await instructions after that review; do not start another development task.

The new executable has not been launched here. Unsigned Windows x64/WebView2 limitations remain. Do not deploy publicly, work on Android/gameplay, access secret content, merge automatically or begin another task.

## Persistent context

AGENTS.md and docs/ are authoritative. Russian reports; English technical documentation. One task at a time. Preserve calm offline-first life balance, canonical five spheres, immutable historical snapshots and no punishment for absence. GitHub integration/CI avoids the restricted local credential helper; no force-push/history rewrite. Store databases/secrets/build outputs outside Git.
