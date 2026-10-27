# Project handoff

Updated 2026-10-27. Active task: SANCTUARY-UI-001 raster-art integration in the existing [PR #4](https://github.com/Maximus1978/Relics/pull/4), open/unmerged. The owner explicitly approved original raster environment artwork plus CSS/SVG controls. Replace the vector environment, compare actual renders with both prototype references, verify CI and provide a new executable. Previous SVG evidence below is historical until this delivery is verified. No further asset-format confirmation is required. Do not merge automatically or start another task.

## Owner correction and visual bar

The owner requires the atmosphere and authored detail of the supplied desktop/mobile prototype screens or better. Both reference images were reopened and compared with the actual browser render. The first flat SVG/palette delivery is not visually accepted. Material/architectural depth, engraved aged metal, dimensional gemstones and controlled lighting are acceptance criteria; green tests/builds alone cannot close the visual task.

The initial brief says “Use CSS, authored SVG, and reusable design tokens.” An asynchronous question asks whether original painterly raster environment artwork may complement the CSS/SVG controls. It remains unanswered. No raster artwork was generated/imported. Treat the current SVG proposal as concrete intermediate work, not proof of visual parity.

## Baseline and unchanged behavior

HABITS-001B was accepted/merged at 8fc41b39d433fd1c9d26c71757580ae3a3567e77, still the master baseline. Continue the existing feature/sanctuary-ui-001 branch/PR, not another feature.

Habit creation/edit/archive/restore, multisphere definitions, local dates, activity snapshots/cancellation and SQLite persistence remain intact. Domain, SQL adapter, schema/migrations, native identity/database, dependencies and Windows workflow are unchanged. No owner database or private content was accessed. Browser fixtures are explicitly fictional and in-memory only.

## Current SVG proposal

- Original authored gothic landscape engraving with architectural tracery, slate/masonry, mountains, bridge, trees, fog and warm windows.
- Engraved nine-slice panel frames, fixed stone grain and shrine arches; physical-looking button bevels.
- More layered medallions with aged-metal bands, prongs, engraved ornament, faceted glass, reflections and readable sphere inlays.
- Both supplied references now have a permanent minimum-quality rule in AGENTS.md, UX_PRINCIPLES and the reference inventory.
- Existing calm Daily Mode layout/actions and accessibility remain. No fake scores, game progression, unsupported navigation or new data functionality.

The environment still looks like vector illustration. The owner has not accepted its detail as equal to the painterly prototype. The unresolved raster-format option is the next decision, followed by another rendered comparison.

## Verified technical evidence

[Windows CI run 40586705022](https://github.com/Maximus1978/Relics/actions/runs/40586705022) completed / success: npm ci, 25/25 tests, TypeScript, Vite, 35 browser/interaction/responsive checks, locked Cargo fetch, actual Tauri release compilation and uploads.

Tested feature source: 857c9dcd5233c6ca17ee5e78354235dce0216553. PR merge source: 98e16b4d4fbbd11e79a61f62e038b747d53cd3eb. A later documentation-only evidence commit uses [skip ci]; executable source/tests/art/browser scripts remain identical to that tested source.

Browser checks include local decorative asset loading, five emblems, first-card fit at 1000x800 excluding the demo-only banner, keyboard/focus/validation, one-click and backdated logging, edit/archive/cancel/restore, history snapshots/cancellation, reset on reload, 320–1280px overflow, 44px actions, text enlargement and reduced motion. Reported runtime exceptions: zero. Desktop/mobile/journal screenshots were inspected. This is browser evidence, not native WebView2/persistence verification.

## Intermediate downloads

- [SVG proposal Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40586705022/artifacts/12772378768), 4,295,929 bytes; local outputs/Relics-Sanctuary-UI-001-svg-revision-windows-x64.zip.
- ZIP SHA256: 367653de3d31d243daaf825dce7512be3d98ba2f5c3971ac90e5c1473e41a9a4. EXE SHA256: 25e36083851dbe299f759b788ba803aed87127bb500fea5d62ac4a264f875864. Downloaded ZIP/EXE hashes and build-info SHAs were verified; nativeUiRuntimeVerified=false. The executable was not launched here.
- [Browser evidence](https://github.com/Maximus1978/Relics/actions/runs/40586705022/artifacts/12771686945), 2,740,662 bytes; downloaded ZIP digest matched GitHub. Local screenshots: outputs/Relics-Sanctuary-reference-revision.png and Relics-Sanctuary-reference-revision-mobile.png.
- Artifacts expire 2026-11-10. Prior run 40583750205/executable describes the superseded flat presentation. These intermediate files are outside the repository.
- Close the old app, extract the selected ZIP separately and run relics.exe. No compiler setup is required. Unsigned Windows x64/WebView2 limitations remain.

## Next action, not another task

Resolve the pending asset-format question with the owner, then continue only this visual revision and compare actual renders against the original prototype. If original raster art is approved, integrate it as bundled decorative art while keeping interactive controls in CSS/SVG and preserving offline behavior. If CSS/SVG only is required, discuss the remaining painterly-material quality gap explicitly. Do not claim visual parity without evidence/owner review.

No merge, public deployment, gameplay, Android, secret content or new feature work is authorized. After the visual revision is accepted, await the owner's next task.

## Persistent context

AGENTS.md and docs/ remain authoritative. Russian reports; English technical documentation. One task at a time; ask before consequential uncertain choices. Preserve calm offline-first life balance, canonical five spheres, historical snapshots and no penalties for absence. private/ stays unread/excluded. Publication uses GitHub integration and CI rather than the restricted local credential helper; never force-push or rewrite history.
