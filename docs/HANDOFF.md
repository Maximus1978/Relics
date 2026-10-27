# Project handoff

Updated 2026-10-27. BUILD-WIN-001 Recovery: **PASS for GitHub-hosted CI compilation/artifact delivery**. Native Windows UI runtime verification remains pending. No further task has started.

## Verified delivery

- [PR #1](https://github.com/Maximus1978/Relics/pull/1), branch ci/windows-build. It remains open for review; master is unchanged.
- [Successful Actions run 40544697531](https://github.com/Maximus1978/Relics/actions/runs/40544697531), state completed / success.
- Tested PR head 24d5f5bb670e417bcaabfbe1d41fc6f12acfad66; tested PR merge source cfdffaf4e91e84074af3361eb191fcdb90d8a4d5.
- npm ci, all three existing tests, TypeScript, Vite, browser rendering, cargo fetch --locked, Tauri release compilation and Windows artifact upload passed.
- [Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40544697531/artifacts/12753125929), 4,278,056 bytes, contains relics.exe, both lockfiles, build/source metadata, checksum and launch note.
- [Browser screenshot/evidence](https://github.com/Maximus1978/Relics/actions/runs/40544697531/artifacts/12752462096) verifies browser-only rendering, not native Tauri/SQLite.
- The ZIP and extracted EXE hashes were checked. No executable was launched during this CI-only task.

Read [WINDOWS_CI.md](WINDOWS_CI.md) for exact versions, triggers, download steps, source hashes and limits. The owner can extract the artifact and run relics.exe without Node, Rust, build tools, administrator compilation or local environment repair. Windows x64/WebView2 are runtime prerequisites. It is unsigned, not an installer.

## Infrastructure and minimal fixes

The workflow runs on pushes to master, PRs targeting master, and workflow_dispatch on windows-latest. Official actions are SHA-pinned; token permission is contents:read, checkout credentials are not persisted, and no personal token/public site is involved.

.node-version pins Node 22.23.4. rust-toolchain.toml pins stable Rust 1.99.1 MSVC. Cargo.lock was recovered from the actual CI artifact, then its root package was updated for the required direct serde_json dependency while preserving all resolved crate versions/checksums. The successful run validated the graph with --locked.

Run 1 exposed missing required Windows icons; transparent 32x32 build-only PNG/ICO resources fixed that defect. Run 2 exposed missing direct serde_json required by tauri::generate_context!; adding the already-transitive crate fixed compilation. No product source behavior, UI design, game system, Android code, schema or secret content changed.

.github/scripts/check-browser-render.ps1 uses hosted Edge without extra npm dependencies. It checks rendered headings/sections/date input and saves a screenshot separately from native output.

## Git and documentation status

All executable/workflow changes were published via the GitHub repository integration using forward-only commits with expected-parent checks. No restricted credential-helper retries, force pushes, resets or history rewrites were used.

The local workspace tracks ci/windows-build. The original master baseline is 3e93834babd6b4d1650be2cfe4c74d5b6f640542. Evidence-only documentation after the successful run may be committed with [skip ci] to avoid rebuilding an unchanged executable. That documentation commit is distinct from the tested build head above; it does not alter source, locks, toolchain pins, scripts or workflow.

Review/merge PR #1 to enable master/manual triggers on the default branch. The PR's existing run/artifacts are already usable before merge. No automatic merge was performed.

## Remaining verification and next step

CI compilation is accepted; native runtime is not. Next recommended task: launch the downloaded executable on Windows and inspect its native UI/database initialization, then capture its window. Do not claim browser rendering proves native persistence. Do not start WIN-LOG-001, Android, game mechanics or other implementation automatically.

## Historical context

The earlier local attempt was blocked by npm child-process EPERM, Cargo Schannel TLS and credential-helper invocation restrictions. [BUILD_WINDOWS.md](BUILD_WINDOWS.md) preserves those diagnostics and optional developer commands; they are no longer required owner steps for obtaining a build.

The persistent vision and scope remain in PRODUCT_VISION.md, GAME_DESIGN.md and UX_PRINCIPLES.md. One task at a time; ask clarifying questions before uncertain decisions/dependent work. Communicate in Russian, keep technical documentation/identifiers English. private/ remains outside ordinary context and Git. No secret catalog was read.
