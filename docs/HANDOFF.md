# Project handoff

Updated 2026-10-27. Active task: BUILD-WIN-001 Recovery — establish and actually verify a GitHub-hosted Windows CI build, using the repository integration and PR workflow. Infrastructure only; no product/Android/private-content work. Do not retry the restricted local Git credential helper.

Read [WINDOWS_CI.md](WINDOWS_CI.md) for the workflow and artifact retrieval. The integration published commit 744aa07c1afcfd34a5dfd810d308e430c835982a on ci/windows-build and opened [PR #1](https://github.com/Maximus1978/Relics/pull/1), without changing master. [Run 40540560435](https://github.com/Maximus1978/Relics/actions/runs/40540560435) passed npm ci, all three tests, TypeScript, Vite, and headless Edge rendering. Browser artifact 12750141800 exists; the inspected screenshot shows the existing Sanctuary tracker. The first native compilation failed because src-tauri/icons/icon.ico was missing. Transparent 32x32 build-only placeholders address that confirmed blocker; the corrected workflow still needs a successful rerun. The local/remote master started at 3e93834babd6b4d1650be2cfe4c74d5b6f640542; preserve that history. The previous local-runner blockers below are historical evidence.

## Task scope and result

The owner authorized dependency installation, existing tests/typecheck/frontend build, native Windows build/start, actual UI inspection/screenshot if possible, launch documentation, and non-force Git delivery. No feature, activity-rule, UI-design, Android, or secret-content change was authorized or made.

Read [BUILD_WINDOWS.md](BUILD_WINDOWS.md) for the exact environment, command outcomes and ordinary Windows PowerShell recovery instructions.

- Initial npm install succeeded and created package-lock.json. The JavaScript graph is locked; native Rust dependencies are not.
- All three existing domain/real SQLite tests passed again.
- TypeScript noEmit check passed after successful installation.
- npm ci failed on esbuild postinstall child-process creation. A foreground retry after stopping the dev server failed with spawnSync node.exe EPERM.
- Vite production build failed before module transformation in Windows realpath optimization: spawn EPERM. The Tauri build stopped in the same frontend hook; native compilation was not reached.
- Cargo lockfile generation failed on crates.io TLS: Schannel SEC_E_NO_CREDENTIALS. No Cargo.lock was fabricated. CURL_SSL_BACKEND=openssl did not change Cargo's TLS backend.
- Windows 11 build 22631, MSVC Build Tools 2022, WebView2 155.0.4283.62, Node 22.15.0/npm 10.9.2, Rust/Cargo 1.87 were detected. Current SQL plugin documentation requires Rust at least 1.90; no toolchain was upgraded or crate versions downgraded.
- The Vite dev server reported ready, but browser navigation returned ERR_HTTP_RESPONSE_CODE_FAILURE. No rendered application UI or screenshot is verified. The temporary server was stopped.
- A final dependency restore also failed on postinstall EPERM. Treat ignored node_modules as incomplete; run a fresh npm ci outside the restricted runner.
- No native executable/window was produced. Overall result remains BLOCKED even though tests/typecheck passed.

## Changes and verification boundary

Changed deliverables: package-lock.json, README.md, docs/BUILD_WINDOWS.md, docs/HANDOFF.md, docs/ROADMAP.md. Product source, package.json dependency declarations, native source, database schema, artwork, and activity behavior are unchanged.

Build logs/caches are workspace intermediates outside the repository. node_modules, dist, target, personal databases, logs, environment files and private/ are excluded from Git. No private catalog was read.

## Git delivery

The owner previously published 28a9291 and 9e7259e manually to master. At task start the tree was clean, master tracked origin/master, and a live remote check confirmed origin/master at 9e7259e2ab0ee763e73f1b6b2ea9b8be4ec8ab1e.

The BUILD-WIN-001 report and npm lockfile are prepared for a descriptive local commit and safe non-force push to the existing origin. Push preflight failed with exit 128: Git's sh.exe could not create its signal pipe (Win32 error 5), so the configured credential helper could not supply authentication. A subsequent read-only remote check still returned 9e7259e2ab0ee763e73f1b6b2ea9b8be4ec8ab1e for master. Preserve the local commit; consult the final report/Git history for its SHA and final push result. The exact ordinary-PowerShell recovery command is in BUILD_WINDOWS.md. Never rewrite history or force-push.

Documentation checks passed for 19 Markdown files and 28 local links. The npm lockfile format is v3 with 85 pinned version/integrity/resolved entries and root declarations matching package.json. No application dependency or product source declaration changed.

## Exactly one next action

Resume BUILD-WIN-001 in ordinary Windows PowerShell with working child-process creation, crates.io TLS and a compatible Rust toolchain. Run clean npm install from the lock, tests/typecheck/frontend build, generate/review Cargo.lock, build/start Tauri, and inspect/capture the real Windows window. Further source/compiler issues may only become visible after these blockers are removed.

WIN-LOG-001 is the next queued task only after Windows build/visual acceptance passes. Do not start activity acceptance, Android work, gameplay, backup, or another feature now.

## Persistent context

Read AGENTS.md, README.md and the relevant docs before changes. One task at a time. Ask clarifying questions before decisions/dependent work whenever uncertainty affects the task. Progress reports are Russian; technical documentation/identifiers are English.

DOC-001 consolidated the foundation under docs/, corrected recent Resonance semantics, and documented weights, schedules, audit history, World Packs, backup and optional game systems. These are requirements, not implemented features. Original concepts are unchanged visual references. Actual old assistant responses/secret recipes were unavailable and were not reconstructed.

The runtime remains three demo habits, including two spheres on one habit, dated idempotent logging, SQLite journal and physical cancellation. Browser preview has no persistence. Weights, editable habits/schedules, audit revisions, diary, day observations, backup, progression, world loader, discoveries and epoch switching remain unimplemented. private/ is an empty ignored authored-content slot; routine work must not access it.
