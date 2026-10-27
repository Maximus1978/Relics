# Windows CI build

BUILD-WIN-001 recovery moves compilation to GitHub-hosted Windows. First run 40540560435 passed all frontend checks and browser rendering, then exposed the scaffold's missing required Windows icon. Transparent technical icon placeholders address only that compilation defect. The corrected workflow is being verified; no successful native result is claimed yet.

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

If Cargo.lock is not yet committed, the run bootstraps it and includes the exact generated file in a separate native-lock artifact and the successful build artifact. Later reproducibility should use that reviewed lockfile. Node/Rust are pinned; the windows-latest runner image still evolves, and actual toolchain versions/source SHA are recorded in build-info.json. The workflow never writes locks back to the repository or gives itself repository-write access.

## Obtain the application without local compilation

Open the repository's Actions tab, select **Windows build**, open a successful run for the intended commit, then download **relics-windows-x64-<source SHA>** from Artifacts. Sign in to GitHub if download access requires it. Extract the ZIP and run relics.exe. No Node, npm, Rust, or MSVC installation is needed to run the downloaded build.

The executable is unsigned and targets Windows x64. WebView2 must already be available. This is an application ZIP, not an installer; bundling remains disabled to preserve the existing scaffold. Windows may show unsigned/unrecognized-publisher warnings. The artifact does not prove the native window renders or SQLite opens successfully. Do not disable Windows security protections to run it.

The **relics-browser-preview-<source SHA>** artifact contains browser-preview.png, rendered DOM, and browser/server logs. This verifies browser-only rendering; native SQLite is unavailable in that mode. It is not a public preview site and not a screenshot of a native Tauri window. Artifacts expire after 14 days; rerun the workflow to generate a fresh build.

For a PR run, source SHA is GitHub's tested merge commit; build-info.json separately records the PR head SHA. Report both the actual run URL and tested source when evaluating artifacts.

## Acceptance boundary

CI recovery passes only after a real run reports successful tests/frontend/native compilation and exposes the Windows artifact. A committed YAML file alone does not pass. Native UI launch/inspection remains a separate pending verification; do not proceed to product development automatically.
