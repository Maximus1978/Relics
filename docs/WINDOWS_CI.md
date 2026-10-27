# Windows CI build

BUILD-WIN-001 CI recovery: **PASS**, verified 2026-10-27. [Run 40544697531](https://github.com/Maximus1978/Relics/actions/runs/40544697531) completed successfully, including native release compilation and Windows artifact upload. Native UI runtime verification remains pending.

## Workflow and permissions

`.github/workflows/windows-build.yml` runs on pushes to master, pull requests targeting master, and manual workflow_dispatch. Pull-request validation allows review without changing master. It uses windows-latest, Node.js 22.23.4 from .node-version and the stable Rust 1.99.1 x86_64-pc-windows-msvc toolchain from rust-toolchain.toml; both versions were observed on the first real run. Official checkout/setup-node/upload-artifact actions are pinned to verified commit SHAs.

The workflow token has contents:read only; checkout does not persist credentials. No personal token, account secret, deployment, administrator action on the owner's computer, or user-installed build tools are required. Rust setup uses rustup already present on the hosted Windows runner. A regular PR contains the infrastructure changes; no automatic merge or force-push is needed.

## Steps

1. npm ci from the existing JavaScript lockfile.
2. Existing tests, strict TypeScript check, and production Vite build.
3. Local headless Edge verification of the production browser UI, with DOM and screenshot artifacts. No new browser-test dependency is installed.
4. Stable MSVC Rust setup, Cargo.lock generation only if missing, and locked native dependency fetch.
5. Actual Tauri release compilation with bundling disabled and Cargo --locked.
6. Package/upload the executable, both dependency locks, build metadata, and executable SHA-256.

Cargo.lock was recovered from run 40543659592's native-lock artifact, verified byte for byte, and then updated only to register the now-required direct serde_json dependency already present transitively in that generated graph. Existing crate versions/checksums were preserved. CI validates the committed graph with cargo fetch --locked and builds with --locked. If the lock is ever absent, the workflow bootstraps and preserves it as an artifact. Node/Rust are pinned; the windows-latest runner image still evolves. Actual versions/source SHA are recorded in build-info.json. The workflow never writes locks back to the repository or gives itself repository-write access.

## Obtain the application without local compilation

Open the repository's Actions tab, select **Windows build**, open a successful run for the intended commit, then download **relics-windows-x64-<source SHA>** from Artifacts. Sign in to GitHub if download access requires it. Extract the ZIP and run relics.exe. No Node, npm, Rust, or MSVC installation is needed to run the downloaded build.

The executable is unsigned and targets Windows x64. WebView2 must already be available. This is an application ZIP, not an installer; bundling remains disabled to preserve the existing scaffold. Windows may show unsigned/unrecognized-publisher warnings. The artifact does not prove the native window renders or SQLite opens successfully. Do not disable Windows security protections to run it.

The **relics-browser-preview-<source SHA>** artifact contains browser-preview.png, rendered DOM, and browser/server logs. This verifies browser-only rendering; native SQLite is unavailable in that mode. It is not a public preview site and not a screenshot of a native Tauri window. Artifacts expire after 14 days; rerun the workflow to generate a fresh build.

For a PR run, source SHA is GitHub's tested merge commit; build-info.json separately records the PR head SHA. Report both the actual run URL and tested source when evaluating artifacts.

## Acceptance boundary

CI recovery passes only after a real run reports successful tests/frontend/native compilation and exposes the Windows artifact. A committed YAML file alone does not pass. Native UI launch/inspection remains a separate pending verification; do not proceed to product development automatically.

## Verified result

- Actual run state: completed / success.
- Tested PR head: 24d5f5bb670e417bcaabfbe1d41fc6f12acfad66.
- Tested GitHub PR merge source: cfdffaf4e91e84074af3361eb191fcdb90d8a4d5.
- Three existing tests passed; npm ci, TypeScript, Vite, browser rendering, cargo fetch --locked, and Tauri release compilation all succeeded.
- [Windows ZIP artifact 12753125929](https://github.com/Maximus1978/Relics/actions/runs/40544697531/artifacts/12753125929): 4,278,056 bytes, contains relics.exe, Cargo.lock, package-lock.json, build-info.json, executable-sha256.json and LAUNCH.txt.
- ZIP SHA-256: 9c472182e19b6e0689a4f7501363beca95224c6b8596d0e9c9603240531ae944.
- EXE SHA-256: c970d37fdc6cdf0070b1ce686f7dad994b2f0d53e75aa5da86a1869ae65162c2.
- [Browser evidence artifact 12752462096](https://github.com/Maximus1978/Relics/actions/runs/40544697531/artifacts/12752462096): screenshot, rendered DOM and logs; browser-only, no native persistence.
- Downloaded archive and executable digests were verified without launching the application. The artifacts expire on 2026-11-10.

Two earlier runs document confirmed scaffold defects: [run 1](https://github.com/Maximus1978/Relics/actions/runs/40540560435) failed for missing required icon.ico; [run 2](https://github.com/Maximus1978/Relics/actions/runs/40543659592) passed icons and failed for missing direct serde_json. Only transparent build resources and that required dependency were added; no app behavior or design changed.

[PR #1](https://github.com/Maximus1978/Relics/pull/1) remains open for review; master has not been modified. Merge the PR to make master push/manual triggers available on the default branch. Final evidence-only documentation may be committed with [skip ci]; the tested executable/workflow source remains the exact head SHA above. Such a report commit does not imply a newly compiled binary.

The next recommended verification is to download/extract the ZIP and launch relics.exe on Windows to inspect the native UI. No local compilation, product development, or further task was started.
