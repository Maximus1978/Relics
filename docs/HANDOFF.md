# Project handoff

Updated 2026-10-27. Active task: SANCTUARY-UI-001 visual revision in the existing [PR #4](https://github.com/Maximus1978/Relics/pull/4). The owner requests the atmosphere and detail of the supplied prototype screens or better. The first delivery's flat architecture, simple rings and panel gradients do not meet that visual target. Rework presentation only, compare actual screenshots with both references, rerun CI and supply a replacement executable. Prior verification/artifacts below describe the earlier presentation until replaced. Do not merge automatically or start another task.

## Verified baseline and scope

GitHub confirms HABITS-001B PR #3 accepted/merged at 8fc41b39d433fd1c9d26c71757580ae3a3567e77, matching master at preparation. Work started from that exact integrated baseline on feature/sanctuary-ui-001.

Only presentation and browser verification changed. Existing habit creation/edit/archive/restore, date validation/logging, snapshots, cancellation and native SQLite behavior are preserved. Domain, SQL adapter, migrations, IDs, database/app identity, dependency files and Windows workflow were compared against the baseline and remain unchanged. No private content or personal database was accessed.

## Implementation

- Original CSS/SVG Sanctuary: charcoal stone, antique metal, restrained light, architectural header and installed system fonts.
- Five labeled line symbols/medallions: Body/Ruby/dumbbell, Mind/Sapphire/brain, Bonds/Garnet/heart, Work/Topaz/briefcase, Recovery/Emerald/leaf. Drawing options are decorative, not earned progression.
- Compact cards prioritize one-click completion with explicit check/Отмечено state. Existing contextual actions, validated form, archive confirmation and focus return remain.
- Today/Yesterday/calendar share the same selected local day. Expandable journal uses historical snapshots and existing cancellation. No fake scores, XP, navigation, crafting or unlocks.
- Browser-only fictional in-memory demo clearly states no saving/reset on reload. Native builds retain the existing SQLite adapter. No localStorage/IndexedDB or personal data access.
- Browser scripts use the runner's Edge and Node's built-in DevTools connection; no extra dependency. A compact desktop header keeps the first card within the tested 1000x800 content area when demo-only banner height is excluded.

## Verification

Local and CI npm test: 25/25 passed, including all 23 unchanged SQLite/domain tests plus Yesterday calendar boundaries and demo isolation/reset. TypeScript, Vite, npm ci, locked Cargo fetch, actual native Tauri release compilation and upload passed in [Windows CI run 40583750205](https://github.com/Maximus1978/Relics/actions/runs/40583750205), completed / success.

34 browser checks passed: labeled synthetic data, five emblems, 1000x800 first-card budget, Tab/Enter/Escape/focus/validation, one-click completion, date shortcuts/backdating, edits, history snapshots, archive/cancel/restore, journal cancellation, reload reset, overflow at 320/390/768/1000/1280px, 44px controls, 200% text enlargement and reduced motion. No reported runtime exceptions. Desktop, narrow-screen and expanded-journal screenshots were inspected. Token contrast spot checks are recorded in the design document; this is not a complete accessibility audit.

Tested feature source: cbd98965e851c6d30f20718a5ee5ea378cf978ee. Tested PR merge source: ac3a89594df9f4ea2c9a0e338f7bd84b98d51cdc. Later evidence/formatting commits use [skip ci]; executable source/tests/migrations/workflow remain identical to the tested commit. The verification driver only loses an extra EOF blank line; its logic is unchanged.

## Artifacts and publication

- [Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40583750205/artifacts/12772035041), 4,290,103 bytes. Local copy: outputs/Relics-Sanctuary-UI-001-windows-x64.zip outside the repository.
- ZIP SHA256: c170731c4116d335d88353f37ad8049b20b411d814bd5f00b2d1287fc7ba66ad. EXE SHA256: e4eaed849d443609a4c33cde4a09a179de65c24206052dbc34c1fb612a7339a0. ZIP digest matches GitHub, EXE matches its manifest; build-info.json confirms both tested SHAs and nativeUiRuntimeVerified=false.
- [Browser evidence ZIP](https://github.com/Maximus1978/Relics/actions/runs/40583750205/artifacts/12771015646), 1,723,544 bytes, digest verified. Local PNG copies: outputs/Relics-Sanctuary-desktop.png, Relics-Sanctuary-mobile.png and Relics-Sanctuary-journal.png outside the repository.
- GitHub retention ends 2026-11-10. ZIP contains relics.exe, locks, build metadata, checksum and launch note; no local build tools are required.
- Publication used the GitHub integration with expected-parent checks and no force-push/history rewrite. Local workspace tracks feature/sanctuary-ui-001. Commit review excludes private content, databases, credentials, logs, screenshots and binary/build artifacts.

## Next queued step and limitations

Owner/product visual/native acceptance is next: close the old app, extract the new Windows ZIP separately and run relics.exe. Review the actual standard window, resized layouts, focus/text; log today/yesterday/another past date, edit, archive/cancel/restore, expand/cancel journal and restart offline. Keep existing history. See [design and detailed acceptance](SANCTUARY_DAILY_MODE.md).

The new executable was not launched here. Browser demo/interaction evidence cannot establish native WebView2 appearance, accessibility or offline persistence. The previous native baseline is owner-accepted; the redesigned UI needs its own review. Unsigned Windows x64/WebView2 limitations remain. No public deployment, Android work or gameplay was started. Do not merge automatically or begin another task.

## Persistent context

AGENTS.md and docs/ remain authoritative. Calm offline-first life balance, canonical five spheres, immutable historical snapshots and no punishment for absence. Russian reports; English technical documentation. One task at a time; ask early about consequential uncertainty. private/ stays unread/excluded. Historical local EPERM/TLS/credential restrictions remain; the owner need not repair the toolchain to receive CI builds.
