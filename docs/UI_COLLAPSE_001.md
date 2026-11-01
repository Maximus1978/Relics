# UI-COLLAPSE-001 — independent Sanctuary disclosures

## Baseline and scope

Owner authorized normal merge of reviewed PROGRESS-001 [PR #11](https://github.com/Maximus1978/Relics/pull/11). Verified head c43c0974953c458ef28d6f4e6c4fa7d6d22cc368,mergeable,16 Markdown-only files. Regular merge5b7229d58c040c7ebd44d0fe423f92bdc82c57e2 verified on master with parents8503670/c43c097. feature-ui-collapse-001 begins there. P01–P09 are accepted as a proposed review contract,NOT final implementation parameters. No progression implemented.

Only two sections gain independent persistent controls: existing «Ваши реликвии» inventory (existing archive variant retained) and «Жизненный ритм». No rename,medal replacement,dashboard redesign,new navigation,SQLite migration,backup-format change or new dependency.

## Implementation

App owns one useSectionPreferences instance. Versioned device key relics.ui.sections.v1 contains exactly version1 and inventoryExpanded/rhythmExpanded booleans;default bothtrue. Strict shape/version/type validation rejects corrupt/partial/unknown fields to both expanded. Getter/read/parse errors safely default;write denial/quota leaves current session controls functional and defaults on a later restart if nothing could be stored. Do not claim persistence when storage is denied. Preference writes never contain journal,date,period,mode,filters,paths or backups.

A shared native SectionToggle button exposes dynamic localized name,title,aria-expanded and stable aria-controls. Before hiding content it moves any focus inside that body to the toggle,including programmatic click with internal focus. Enter/Space use native button activation;44px target,visible focus and reduced-motion chevron. Hidden content stays mounted under hidden+inert with explicit display:none;not keyboard/AX reachable. Neither collapse operation writes activities or drops existing component state.

Inventory heading,Add Habit,archive access and status/error feedback remain outside the hidden body. Collapsed description shows actual active-habit count from the loaded all-habit model,including when viewing archives;loading gets a neutral loading message. Creating while collapsed works and updates the count without changing expansion preference. No force-expand on archive/navigation;restore existing behavior by explicitly expanding the same inventory region. Selected logging date is unchanged by collapse or navigation.

Existing Life Rhythm disclosure inspected before change: native details/summary kept its child controls mounted but had no persistent controlled preference. Replace only the outer disclosure with the same layout and explicit semantic button/header/body. Native inner numerical-table details remains and retains its open state. Period1/4/8,units/shares and series visibility remain LifeRhythm session state;never added to persistence. The existing uPlot ResizeObserver is reused. active=false tears down its draw/observer resources while collapsed;opening recreates it from retained control values using the current measured host width,then observes resize. This avoids zero-width or blank drawing after hidden resize without modifying contribution math.

Navigation keeps the existing one model/repository and hidden/inert Sanctuary subtree. Device settings survive real document reloads in browser tests;native offline process restart is the owner's acceptance gate below. Same app identifier/origin is required;settings are per-device/per-origin,excluded from journal backup and left untouched by restore. Browser demo still resets all synthetic journal data;only these two UI booleans persist. Chart/date controls survive collapse/navigation,not app restart;their restart persistence is deliberately out of scope.

## Actual local verification

- 79 Node/temporary-SQLite tests PASS,0 failures: existing75 plus4 preference tests. All four combinations round-trip through a fresh reader,strict invalid variants fallback,denied read/write handling and only-this-key persistence.
- TypeScript and Vite build PASS;no package/lock changes.
- 354 real headless Edge browser checks PASS,runtimeErrors=[]. All existing editor,SQLite/mock-IPC backup/Chronicle integration,rune4-state/geometry/backdate and analytics tests retained. Synthetic isolated profile/data only.
- 22 real Rust/native temporary-database safety tests PASS,0 failures;one standalone crash helper intentionally ignored and run by its passing parent. No owner journal opened and no native app launched against it.
- Windows hosted CI/native EXE delivery pending at initial publication;final run/head/artifact receipt belongs in HANDOFF after verified success.

New browser helper check-section-collapse.mjs uses actual clicks/Enter/Space,storage and reload:all four states,Chronicle/offline navigation,collapsed Add/create/count/archive,retained date/1/4/8 period/shares/hiddenWork/table expansion,internal focus rescue,AX-hidden bodies,default/corrupt/unsupported/denied/full storage,explicit non-persistence of analytics controls,and real nontransparent chart pixels/host width after collapse and resizing1920/1280/390/320. No production test hooks or injected CSS. Proof section-collapse-proof.json states nativeOfflineRestartVerified=false rather than confusing browser reload with native restart.

## Actual screenshot evidence

Browser artifact includes collapse-both-expanded.png,collapse-inventory.png,collapse-rhythm.png,collapse-both.png and collapse-narrow-windows.png. Actual captures inspected:accepted Sanctuary/shrines/rune/background/card art preserved;native controls/count and analytics chart/table stay readable,no horizontal overflow. These are screenshots of a running synthetic preview,not flattened mockups or owner data. Narrow full-page captures naturally include the fixed navigation at its actual viewport position;normal scrolling works. Other existing screenshot/geometry evidence remains in the same artifact.

## Native Windows owner acceptance — no build tools

1. Close older Relics windows;download the new PR's verified Windows x64 ZIP from the run linked in HANDOFF,extract and run relics.exe. Unsigned x64/WebView2;no Node/Rust installation required.
2. On a profile with no saved section preference both sections should be expanded. Existing prefs from this version are intentionally retained on subsequent launches.
3. Try all four expanded/collapsed combinations. Headers,inventory count,Add Habit and archive access stay visible. Create a habit only if desired;personal journal edits are not required to check collapse. Expand archive inventory when you want its restore controls.
4. Choose an existing historical logging date,select analytics1/4/8,units/shares and hide a series;collapse/reopen and visit Chronicle/back. Check date and chart controls remain;resize while analytics is collapsed,then expand and inspect actual lines/width. Confirm normal keyboard Tab/Enter/Space and focus ring,no hidden focus targets.
5. Leave one region collapsed and the other expanded. Close app,disconnect network,reopen the SAME extracted build and verify those two settings survive. Repeat with both collapsed if useful. This native offline restart is still pending owner verification;browser reload is not proof of it.
6. Full app restart intentionally resets ordinary date/chart controls to existing defaults;only two expansion booleans are persistent. Backup export/restore formats remain unchanged;device section preferences are not imported from another computer's journal backup.

## Limits and next task

No native UI/offline-restart acceptance claimed by automation. Preference storage can be denied/cleared by the system;then default expanded and session toggles remain available. No guaranteed cross-profile persistence or synchronization. No gameplay,rhythm editor,medal design,audio or Android. Implementation PR remains OPEN/UNMERGED for owner acceptance. Next queued HABIT-RHYTHM-001 requires a new owner instruction and resolution of its P01–P09 dependencies;not begun.

Browser fixture maintenance:the existing backdated analytics test now chooses Friday of the last complete Monday week with a Sunday-safe offset. This changes only the test date,not any application calendar math;it prevents hosted UTC Sunday runs from inserting into the excluded current week.
