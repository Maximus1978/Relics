# Project handoff

Updated 2026-10-27. Exactly one active task: SANCTUARY-UI-001 VISUAL RECOVERY, Gate A (composition/artwork), same [PR #4](https://github.com/Maximus1978/Relics/pull/4), branch feature/sanctuary-ui-001.

## Current authority and gate

The owner rejected the previous presentation, including the painterly backdrop iteration. The supplied Relics_Sanctuary_Visual_Handoff/Relics_Visual_Handoff packet and VISUAL_CONTRACT v0.2 supersede its composition. All 17 supplied reference/board/state PNGs were inspected. The original desktop TARGET sets the approximately 90% perceptual fidelity target; conceptual fake scores/future fields must not be copied.

Develop and show Gate A actual composition/artwork with viewport screenshots and side-by-side comparison, then stop for owner review before extensive Gate B polish. Green CI is not visual acceptance. Do not merge PR #4 or push to master. No next feature is authorized.

## Baseline and implementation

Master is accepted HABITS-001B 8fc41b39d433fd1c9d26c71757580ae3a3567e77. Remote PR #4 was verified open/unmerged at recovery start, head 55e2cffa7c415eef0a41cab91cab60298f1b5c35.

The revised shell has a desktop rail, local cathedral scenery, five dimensional architectural shrines surrounding a central wheel, collectible pendant inventory and compact Chronicle entry. Mobile uses circle/compact sphere observations, vertical inventory and functional navigation. Real React text/actions/forms are separate from decorative raster artwork. Create/edit uses a native modal/full-screen sheet. Application state, reusable presentation components and CSS tokens are separated; the old global override layer is removed.

A small pure observation projection counts distinct dates per snapshot sphere during the latest seven local calendar days, plus number of represented spheres. It is descriptive, has no persistence, and does not score unknown dates. [Design](SANCTUARY_DAILY_MODE.md) and [asset provenance](art/VISUAL_RECOVERY.md) contain the details.

## Preserved data and scope

SQLite repository/schema/migrations, stable IDs, native identity/database, habit/activity rules, dependencies/locks and Windows workflow remain unchanged. No private content or owner database was accessed. All existing habit management, backdating, historical snapshots and cancellation use the same repository. Browser demo is fictional/in-memory and resets on reload.

## Verified technical result; Gate A visual decision pending

Tested feature source: 1ab9c34f8ac7f657af2b6de8b37bc53556ccc9e1. Tested PR merge source: afef95ec0928b717c3ad5afd566c9f00ca9f7bc8. [Windows run 40619945699](https://github.com/Maximus1978/Relics/actions/runs/40619945699) completed successfully: npm ci, 31/31 tests (25 existing plus six observation tests), TypeScript, Vite, 40 browser checks, pinned stable Rust MSVC, locked Cargo fetch and actual Tauri release compilation. Node 22.23.4 / Rust 1.99.1. Later documentation-only evidence uses [skip ci]; runtime code/art/tests are identical to this tested feature source. Local 31 tests, script syntax, whitespace and four art manifest byte/hash checks also passed.

Actual browser screenshots at 1440×900, 1280×800, 1000×800, 390×844 and 320×844 were opened and inspected. This caught CSS import-order/responsive issues missed by the first assertions; fixed in the tested source, with explicit compact rail/mobile background assertions. Full Chronicle summary is required at 1440×900; complete first inventory row at 1280/1000 follows the written contract. The final screenshots also show the Chronicle summary at both smaller desktop sizes. Tests cover keyboard/validation/focus return, completion/yesterday/backdating, edit/archive/cancel/restore, historical snapshots/cancellation, preview reload, overflow, 44px actions and reduced motion. Runtime exceptions: zero. Root text enlargement check establishes overflow only, not complete native text-scaling acceptance.

[Browser evidence ZIP](https://github.com/Maximus1978/Relics/actions/runs/40619945699/artifacts/12787540029): 9,818,388 bytes; downloaded SHA256 7cce4b539d91c4b56b5e3bf25bb63d667c1d9b837f7a8dfb6850fdc9f3e43834 matched GitHub. Outside Git: outputs/Relics-Visual-Recovery-Gate-A/ contains the screenshots/result/DOM; outputs/Relics-Visual-Recovery-Gate-A-comparison.png compares original target, supplied rejected screenshot and actual revised browser at preserved proportions. outputs/Relics-Visual-Recovery-Gate-A-states.png is a contact sheet of existing state captures. These are fictional browser data, not native screenshots. The journal viewport capture shows the expanded entry/header; complete expanded-journal and mobile-form visual evidence remain Gate B.

[Windows executable ZIP](https://github.com/Maximus1978/Relics/actions/runs/40619945699/artifacts/12786548417): 8,116,888 bytes; local outputs/Relics-Visual-Recovery-Gate-A-windows-x64.zip. ZIP SHA256 607bb573c0d1a277deb2589ea4e29d5c1ffd4f6af55bd8630f174dabc4b4feb1 matched GitHub. relics.exe: 15,989,760 bytes, SHA256 5a3f046ddcf4bbd3ce409332bd8fb76441b4424de0b028c55b6061fe7e004779 matched its manifest. build-info.json confirmed both exact SHAs, Windows, nativeUiRuntimeVerified=false and signed=false. Artifact expiry: 2026-11-11. Close the old Relics, extract this ZIP separately and run relics.exe on Windows x64 with WebView2; no compiler installation is needed. This executable was not launched against owner data here.

The previous painterly build run 40603575817 on source 59481e388c37d665ef4eb1c5f595215788ec5d01 passed technically but was visually rejected. Its executable/screenshots are historical.

## Next queued step

Owner Gate A visual review is next; stop here. Do not start extensive Gate B polish or another task automatically. Remaining perceptual differences: one reusable arch and pendant base rather than diverse authored silhouettes; the central star/gem optics are simpler than the target; auxiliary ring labels and compact typography need owner/native readability review. The panorama is original art with different architecture/crop. Real-data labels and functional navigation replace fictional game scores and future controls. Do not claim a numerical fidelity score or owner visual acceptance.

After owner Gate A feedback, Gate B may refine state materials/typography and capture complete expanded-journal/mobile forms, followed by native visual/accessibility/offline-restart acceptance. Native runtime is unverified for this revision. Unsigned Windows x64/WebView2 constraints remain. Master stays 8fc41b39d433fd1c9d26c71757580ae3a3567e77 and PR #4 remains open/unmerged.

Russian reports; English technical documentation. One task at a time. Publish only to the existing feature branch/PR through GitHub integration, expected-parent checks and non-force updates. Keep databases/secrets/logs/build outputs and screenshot evidence outside Git.
