# Project handoff

Updated 2026-10-27. Active task: SANCTUARY-UI-001, first visual Sanctuary Daily Mode. Do not merge automatically or start another feature.

## Verified baseline and scope

GitHub confirms HABITS-001B PR #3 accepted/merged at 8fc41b39d433fd1c9d26c71757580ae3a3567e77, matching master at preparation. Local work starts from that exact integrated baseline on feature/sanctuary-ui-001.

Only presentation and browser verification change. Keep existing habit creation/edit/archive/restore, date validation/logging, snapshots, cancellation and native SQLite behavior. Do not alter the domain, SQL adapter, migrations, IDs, database/app identity, dependencies or Windows workflow. No private content is read or included.

## Implementation

- Original CSS/SVG Sanctuary: charcoal stone, antique metal, restrained light, an authored architectural header and typography using installed system fonts.
- Five reusable line symbols and medallions: Body/Ruby/dumbbell, Mind/Sapphire/brain, Bonds/Garnet/heart, Work/Topaz/briefcase, Recovery/Emerald/leaf. Labels accompany shapes/colors. Decorative options do not represent earned progression.
- Compact habit cards prioritize one-click completion and an explicit check/Отмечено state. Existing contextual actions, validated form, archive confirmation and focus return remain.
- Today/Yesterday/calendar share the same selected local day. Expandable journal uses historical snapshots and existing cancellation. No score, XP, fake navigation, crafting or unlocks.
- Browser-only fictional in-memory demonstration with an explicit no-storage/reload-reset banner. Native builds still open the existing SQLite adapter. No localStorage/IndexedDB or personal data access.
- Browser verification now uses Edge/Node's built-in DevTools connection to exercise keyboard, actions, responsive layout and screenshots without adding a dependency.

## Verification and publication

Local npm test: 25/25 passed, including the existing 23 real SQLite/domain tests plus Yesterday calendar boundaries and demo isolation/reset. Node syntax check and git diff --check passed. TypeScript, Vite, Windows CI, screenshots and executable artifact are pending and must be recorded from actual execution. Do not report compilation as native runtime acceptance.

See [design, boundaries and owner acceptance](SANCTUARY_DAILY_MODE.md). The existing local EPERM/TLS restrictions are historical; use GitHub integration/CI rather than requiring owner build-tool installation. Native UI was not launched against personal data.

## Next step

Finish the focused PR/Windows artifact delivery, then stop for owner/product visual review. Review the actual Windows window, resized layouts, keyboard focus and text; log today/yesterday/past date, edit, archive/cancel/restore, expand/cancel journal and restart offline. Preserve all existing records. No automatic merge or next development task.

## Persistent context

AGENTS.md and docs/ remain authoritative. Calm offline-first life balance, canonical five spheres, immutable historical snapshots and no punishment for absence. Russian reports; English technical documentation. One task at a time; ask early about consequential uncertainty. private/ stays unread/excluded. Unsigned Windows x64/WebView2 limitations remain; browser demonstration is not native persistence verification.
