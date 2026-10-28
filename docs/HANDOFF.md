# Project handoff

## Active task: BACKUP-001

The owner explicitly authorized reliable native Windows JSON export and full-replacement restore. Baseline master verified at 5fdc02dc1777c6b5793bababda918beac195856b; feature/backup-001 is dedicated to this task. Validate before mutation, preview and explicit confirmation, durable recoverable safety JSON before replacement, one native SQLite transaction using the SQL plugin's existing pool, refresh after commit. Preserve IDs/history/identity, move sample seeding to one-time additive migration, and test only synthetic temporary databases. Native dialogs/file access stay inside narrow Rust commands; browser demo must not simulate persistent backup. No private/ or owner database access. Deliver an unmerged PR, green Windows CI/native tests/build, executable and manual acceptance steps; do not merge or begin another task. Earlier release notes below are historical.

## Current task and owner acceptance

Task: accept/finalize SANCTUARY-UI-001, record the latest game decisions/roadmap, and merge [PR #4](https://github.com/Maximus1978/Relics/pull/4) using a normal merge commit after successful final-head Windows CI. Work stays on feature/sanctuary-ui-001 until that merge. No new feature implementation is authorized.

**Gate A is APPROVED.** The owner visually accepted the revised Sanctuary RPG interface and manually verified the implemented functionality in Windows. Remaining artistic differences are accepted for this milestone and are future improvements, not release blockers. Earlier pending-review/no-merge instructions are superseded by this explicit owner decision (D034). This is not a claim that absent game systems or every specialist accessibility scenario have been implemented/tested.

The next single task after merge is **BACKUP-001**, queued and NOT started. Stop after merge verification; do not automatically begin backup, Gate B polish, Android or gameplay work.

## Verified baseline and release procedure

At release-task start, PR #4 was open/unmerged, head 67bc34db5fb84b24e0220a4ef01b103135589a56; master was 8fc41b39d433fd1c9d26c71757580ae3a3567e77. That head differs from tested runtime 1ab9c34f8ac7f657af2b6de8b37bc53556ccc9e1 only in documentation. Remote state was read from GitHub; local working tree was clean.

[Runtime Windows run 40619945699](https://github.com/Maximus1978/Relics/actions/runs/40619945699), PR merge source afef95ec0928b717c3ad5afd566c9f00ca9f7bc8, completed successfully: npm ci, 31/31 tests, TypeScript, Vite, 40 browser checks, pinned Rust MSVC, locked Cargo fetch and actual Tauri Windows release compilation. Node 22.23.4 / Rust 1.99.1. Zero browser runtime exceptions. Actual viewport renders at 1440×900, 1280×800, 1000×800, 390×844 and 320×844 were inspected. Browser data are fictional/in-memory; the owner's subsequent Windows verification is separate native evidence.

This release task changes documentation only. Publish the new documentation commit on the existing PR branch WITHOUT skipping CI. Require Windows CI success on that exact final head before merging with expected-head protection, merge_method=merge and no force/history rewrite. Verify PR merged=true, the returned commit's parents/tree, master ref and local fast-forward state. Final-head CI URL and actual merge SHA are recorded in PR #4 checks/merge timeline and the task report; do not substitute an old run or predict a merge SHA in advance. A push-triggered master build may run after merge; it is distinct from the verified pre-merge run.

## Accepted implementation

The revised shell includes a desktop rail, local cathedral panorama, five dimensional shrines around a central wheel (2+3), pendant inventory, compact Chronicle and modal/full-screen habit management. Reusable presentation/tokens are separate from the application hook. Original local decorative WebP assets total 810,188 bytes, with [exact generation prompts/provenance](art/VISUAL_RECOVERY.md).

The read-only projection counts distinct recorded dates per historical sphere snapshot across the current local day and preceding six days. It includes archived history and does not depend on current habit definitions or the selected logging date. Center = represented spheres; rings = observed dates. These are not actual Mastery/Resonance or health scores.

SQLite repository/schema/migrations, canonical IDs, app/database identities, habit/activity rules, dependencies/locks and Windows workflow are unchanged in this documentation task. No private content or owner database was accessed. Existing one-completion-per-habit/day, create/edit/archive/restore, backdating, historical snapshots and cancellation remain intact.

## Preserved artifacts and technical limits

[Runtime browser ZIP](https://github.com/Maximus1978/Relics/actions/runs/40619945699/artifacts/12787540029): 9,818,388 bytes; SHA256 7cce4b539d91c4b56b5e3bf25bb63d667c1d9b837f7a8dfb6850fdc9f3e43834.
[Runtime Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40619945699/artifacts/12786548417): 8,116,888 bytes; SHA256 607bb573c0d1a277deb2589ea4e29d5c1ffd4f6af55bd8630f174dabc4b4feb1.
relics.exe: 15,989,760 bytes; SHA256 5a3f046ddcf4bbd3ce409332bd8fb76441b4424de0b028c55b6061fe7e004779.
Downloads/checksums and build-info source SHAs were verified in the UI task. Retention ends 2026-11-11; newer release-head artifacts appear in the final PR check.

Outside Git: outputs/Relics-Visual-Recovery-Gate-A/ screenshots/result/DOM, comparison and state contact sheet, and Windows ZIP. The CI artifact's nativeUiRuntimeVerified=false reflects its producer's limits; the owner subsequently supplied manual Windows acceptance in this task. The agent did not operate on the owner's database. Unsigned Windows x64/WebView2 requirements remain.

Browser checks are regression evidence, not complete accessibility certification. Full expanded-journal/mobile-form capture and typography/gem polish are optional future work, not blockers reopening Gate A.

## Newly approved product direction

- Three independent states: selected-day activity illumination/subdued; gradual recent Resonance without punishment; permanent Mastery/artifact evolution that never decays through inactivity. Unknown days are not confirmed failure. Future Sanctuary center uses an original runic monogram.
- Curated habit icons independent of contributions. Plan primary sphere and optional weighted secondaries; contribution weights differ from per-activity intensity. Shared ordinary frames are intentional; unique rare/legendary silhouettes/art are authored.
- Optional activity intensity/note through additive migrations, retaining old records. Future repeated/quantified modeling is separate; current uniqueness stays.
- Real activities → Mastery/thematic essences → player experiments → authored discoveries → optional experiences. No permanent-progress spending for basic experiments, infinite random loot, compulsory tasks/logins or optimal XP grinding.
- Explicit future Adventure tasks, versioned declarative World Packs and Sanctuary/Clockwork/Wasteland/Verdant are preserved. No actual secret recipes/names/conditions are exposed or invented.

[Game design](GAME_DESIGN.md), [UX](UX_PRINCIPLES.md), [decisions D034–D040](DECISIONS.md), [World Packs](WORLD_PACKS.md) and [ordered small tasks](ROADMAP.md) are authoritative. All new mechanics remain unimplemented.

## Next single task and unresolved choices

BACKUP-001: a reliable bounded local export/restore slice for existing SQLite data, with versioned validation, preserved snapshots/IDs, atomic safety and temporary-database reopen/round-trip tests. Resolve backup format/adapters and replacement-versus-merge confirmation before dependent work. Do not begin now.

Subsequent priorities: activity/Resonance visual-state contract; icon/contribution identity; optional activity details; actual progression; minimal alchemy/discovery loop; collection/artifact experiences; world transitions/museum. Early Android build/lifecycle compatibility is explicitly queued before the game loop grows large.

Open before their implementation: backup replacement/merge policy, weight defaults/normalization and primary semantics, intensity scale/effects, progression windows/thresholds/yields and anti-grind rules, reward corrections, repeated-event identity/units, renewable crafting costs, epoch transfer/backdating and museum compatibility. These do not block documentation acceptance or this UI release. See OPEN_QUESTIONS.md.

Russian reports; English technical docs. One task at a time. Keep secrets/databases/logs/build outputs out of Git; no private/ access or force push. Future merges require their own applicable owner authorization.
