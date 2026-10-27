# Technology and feasibility findings

Reviewed 2026-10-26 during DOC-001. Documentation/source review only; no fresh dependency or platform build attempt.

## Documentation evidence

| Topic | Evidence and implication |
| --- | --- |
| SQLite on both targets | Official [SQL plugin](https://v2.tauri.app/plugin/sql/) lists Windows and Android support. Current documentation states a minimum Rust version of 1.90; check the resolved plugin version during build verification. |
| Migrations/permissions | The plugin documents transactional migrations and explicit SQL permissions. The scaffold registers migration 1 and local-window SQL access. |
| Windows build | Official [prerequisites](https://v2.tauri.app/start/prerequisites/) describe MSVC, WebView2, and Rust. A discoverable command does not verify the toolchain. |
| Android build | Prerequisites describe JDK, Android SDK/NDK and Rust mobile targets. Build/start/lifecycle acceptance is a separate task. |

## Workspace evidence from the previous task

Node 22.15.0 and npm 10.9.2 were present. Rust commands were discoverable, but cargo fmt could not start cargo metadata due to access denial. npm install failed with ENOTCACHED for @tauri-apps/api; expanded-access execution was rejected. npm run build then lacked TypeScript. No lockfiles were produced.

Three Node tests passed using single-process test isolation: calendar validation, local day, and real temporary SQLite with duplicate protection, historical snapshots, restart and cancellation. These do not verify application compilation, Tauri IPC, Windows persistence, or Android lifecycle.

## Architectural limits

- Tauri shares web UI/domain logic; native integrations and platform UX still need work. Material You is not implied by the stack.
- Native Android home-screen widgets require a future native-adapter feasibility task; current widget support is not claimed.
- Device databases remain independent until sync exists; UUIDs alone cannot resolve conflicts.
- JSON export/import requires tested file adapters and a validated versioned backup format.
- Local packaging prevents accidental spoilers, not deliberate source/binary inspection.
- Dependency ranges remain provisional until successful resolution and reviewed lockfiles. Actual build/start evidence is required for runtime validation.

Next queued task BUILD-WIN-001 should obtain a reproducible Windows build or report one concrete blocker. Android and features stay queued.
