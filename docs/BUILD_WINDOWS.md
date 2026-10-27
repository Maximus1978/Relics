# Windows build and visual preview

Task BUILD-WIN-001, checked 2026-10-27. Overall status: **BLOCKED**. The native Windows application has not been built, launched, or visually verified. A frontend typecheck is not native acceptance.

## Verified environment

| Component | Observed version/state |
| --- | --- |
| Windows | 11, build 22631, x86_64; tools report NT version 10.0.22631 |
| Node / npm | 22.15.0 / 10.9.2 |
| Rust / Cargo | 1.87.0 / 1.87.0, stable-x86_64-pc-windows-msvc |
| MSVC | Visual Studio Build Tools 2022, 17.13.5, C++ tools installed |
| WebView2 | 155.0.4283.62 |
| Tauri JavaScript CLI / API | 2.12.4 / 2.12.4 in the resolved npm tree |
| SQL JavaScript plugin | 2.6.0 |
| Vite / TypeScript | 6.4.5 / 5.8.3 |

`tauri info` detected WebView2, MSVC, Rust, Cargo and rustup. Native crate versions could not be resolved. The current [SQL plugin documentation](https://v2.tauri.app/plugin/sql/) states Rust 1.90 or newer; installed Rust 1.87 must be updated or compatibility explicitly resolved before native acceptance. No compiler was upgraded or dependencies downgraded in this task. See also [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).

## Actual command results

| Check | Actual result |
| --- | --- |
| Repository | Clean starting tree, master tracking origin/master; local and remote started at 9e7259e |
| `npm install` with workspace cache | Initially succeeded: 25 packages added, audit reported zero vulnerabilities; created package-lock.json |
| `npm ci` | Blocked by `spawn EPERM` in esbuild's postinstall |
| `npm ci --foreground-scripts` after stopping preview | Blocked by `spawnSync C:\Program Files\nodejs\node.exe EPERM` during esbuild binary validation |
| `npm test` | PASS: all three existing date/domain/real SQLite tests |
| `node node_modules/typescript/bin/tsc --noEmit` | PASS after the successful dependency installation |
| `npm run build` | TypeScript phase passed; Vite failed before transforming modules: `[commonjs--resolver] spawn EPERM`, in Windows realpath optimization |
| `npm run tauri -- info` | PASS for environment inspection; unresolved native package versions are not build verification |
| `cargo generate-lockfile --manifest-path src-tauri/Cargo.toml` | Blocked downloading index.crates.io/config.json: Schannel `SEC_E_NO_CREDENTIALS` (0x8009030E); no Cargo.lock generated |
| Cargo retry with `CURL_SSL_BACKEND=openssl` | Same Schannel failure; this Cargo binary did not switch TLS backend |
| Tauri build invocation | Failed in beforeBuildCommand (`npm run build`) with the same Vite EPERM; native compilation was not reached |
| Browser dev server | Reported ready on port 1420, but browser navigation failed with `net::ERR_HTTP_RESPONSE_CODE_FAILURE`; readiness did not establish rendered UI |
| Native window / screenshot | BLOCKED: no executable/window to inspect; no application screenshot claimed |

An additional clean-install attempt while the preview held Rollup's native module failed with a file-lock EPERM. The preview was then stopped through its tool session. The later foreground installation still failed on child-process creation, confirming that the file lock was not the only blocker. A final restore attempt also encountered postinstall EPERM; treat the ignored node_modules tree as incomplete and run a fresh npm ci outside this restricted runner.

No product source, schema, theme, or activity behavior was changed to work around execution restrictions. No private content or user database was accessed. No native Rust dependency lock or successful reproducible application build is claimed.

## Launch from ordinary Windows PowerShell

These are recovery/launch instructions, not commands proven successful in the restricted runner. Administrator elevation is not inherently required. Start in the repository directory; do not paste the steps in reverse order.

```powershell
Set-Location 'C:\Users\maxim\Documents\Codex\2026-10-26\referenced-chatgpt-conversation-this-is-an\outputs\Relics'
node --version
npm.cmd --version
rustc --version
cargo --version
```

If Rust is older than the current SQL plugin requirement, update the installed stable toolchain as an explicit owner action, then verify its version:

```powershell
rustup update stable
rustc --version
```

With Vite/Relics processes stopped, install exactly the npm lockfile and validate:

```powershell
npm.cmd ci
npm.cmd test
npx.cmd --no-install tsc --noEmit
npm.cmd run build
```

Use npm.cmd/npx.cmd in Windows PowerShell for unambiguous CLI argument forwarding. npm test uses Node's single-process test mode; Node 22.15 emits experimental warnings for type stripping and SQLite. No new test framework is required.

### Browser preview

```powershell
npm.cmd run dev
```

Open http://localhost:1420 and keep the terminal running. Stop with Ctrl+C before reinstalling dependencies or starting Tauri dev, which starts its own Vite process. The existing script binds all interfaces; use the preview locally and do not treat it as a hosted release.

Expected existing UI: Sanctuary heading, selected-date control, three sample habits including one covering two spheres, and the lifetime-journal section. A browser-only notice explains that persistence requires Tauri. Logging buttons are disabled outside the native shell; there is no localStorage substitute. No progression or artwork redesign was added. These are expectations from source, not a verified visual result.

### Native Windows development window

From the repository directory, with the separate browser-preview server stopped:

```powershell
cargo generate-lockfile --manifest-path src-tauri/Cargo.toml
npm.cmd run tauri -- dev
```

The first command needs working crates.io TLS access and generates the missing Rust lockfile. Review and retain src-tauri/Cargo.lock after successful native resolution. Until then, only the JavaScript dependency graph is locked. Keep the Tauri terminal open. Confirm the UI appears and there is no local-database error before marking launch PASS; do not perform the full WIN-LOG-001 activity acceptance as part of this task.

### Debug executable for a production-asset preview

```powershell
npm.cmd run tauri -- build --debug --no-bundle
.\src-tauri\target\debug\relics.exe
```

The Tauri build hook performs the frontend build. bundle.active is false, so an installer is not part of this scaffold. Further compile/runtime issues may emerge after the environment blockers are removed; native acceptance remains incomplete until that build and actual window inspection succeed.

## Completion and delivery boundary

To finish BUILD-WIN-001: run clean install, frontend build and native build outside the restricted runner; generate Cargo.lock; inspect the actual Windows UI and capture its window; record evidence. The next queued feature task remains WIN-LOG-001, but must not start while BUILD-WIN-001 is blocked.

This task's Git delivery must preserve master history and exclude node_modules, dist, target, databases, logs and private/. Verify remote master against the local commit after a successful non-force push; if authentication is unavailable, retain the local commit and report the manual recovery command.

Push preflight in this runner failed: sh.exe could not create its signal pipe (Win32 error 5), and Git then reported that it could not read a username with terminal prompts disabled. This is a credential-helper invocation restriction, not proof that the owner's refreshed GitHub login is invalid. Remote master was still 9e7259e2ab0ee763e73f1b6b2ea9b8be4ec8ab1e when checked. After reviewing the local commit, run from ordinary Windows PowerShell:

```powershell
git -C 'C:\Users\maxim\Documents\Codex\2026-10-26\referenced-chatgpt-conversation-this-is-an\outputs\Relics' -c http.sslBackend=openssl push origin master
```

This is a normal non-force push. No commits should be recreated or branches reset to recover authentication.
