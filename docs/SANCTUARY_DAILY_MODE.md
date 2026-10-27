# SANCTUARY-UI-001 — first visual Daily Mode

## Scope and baseline

The owner accepted HABITS-001B; GitHub confirms PR #3 merged at 8fc41b39d433fd1c9d26c71757580ae3a3567e77, the master used for this task. This is presentation work only. Domain rules, SQLite adapter, migrations, application identity, snapshots and the Windows workflow are unchanged. Only its browser verification script is expanded for useful visual/interaction evidence.

## Visual language

Original CSS/SVG artwork: charcoal stone, restrained antique metal, architectural Sanctuary illustration and faceted medallions. Georgia/system serif supplies display typography; Segoe UI/system sans supplies controls and Cyrillic UI. No fonts, artwork, remote resources, libraries or runtime dependencies are downloaded. No protected game assets are used.

| Token / identity | Presentation |
| --- | --- |
| Surface / raised surface | #181e20 / #20282a |
| Primary ink / muted text | #eee7d8 / #b5b6ad |
| Antique gold | #d7bc83 |
| Body / Ruby | Dumbbell; muted red #e4958c |
| Mind / Sapphire | Brain; blue #92bce8 |
| Bonds / Garnet | Heart; rose #e0a0b4 |
| Work / Topaz | Briefcase; amber #e2bd79 |
| Recovery / Emerald | Leaf; green #93c9a8 |

Stable domain ID relationships still means Bonds / Отношения. SphereVisuals is presentation metadata, not a progression model. SphereMedallion reuses SphereSymbol and accepts a gemstone accent, frame color, ornaments and static illumination. These are drawing options, never earned tiers or unlocks. The five emblems identify categories only. Labels/shapes accompany color in the overview, cards, journal and form.

## Daily hierarchy and interaction

Brand/local status → Sanctuary header/art → five sphere categories → date and habit collection → expandable journal. Native data comes from the existing SQLite repository. Active cards retain one-click completion and an explicit Отмечено/check state. A small contextual disclosure preserves edit/archive/restore. Existing forms, validation, confirmation, focus return and journal cancellation are retained and styled.

Today and Yesterday update the same selected local-day state as the calendar input. Yesterday uses local calendar arithmetic, including month/year/leap/DST boundaries. Arbitrary past dates and the existing future-date/domain validation remain. The journal is initially collapsed, available through a keyboard-accessible summary with its real record count; expanded rows use original snapshots and cancellation.

Responsive columns become single cards on narrow screens; the sphere gallery wraps to three columns on small phones. Interactive targets retain 44px height. Focus outlines, skip link, native checkboxes/date input/disclosures and Russian accessible names remain. No required animation; reduced motion removes smooth scrolling/transitions. No fake counters, progression, quests or nonfunctional navigation.

## Safe browser demonstration

Outside Tauri only, a dynamically imported in-memory fixture supplies explicitly fictional sample habits and journal entries. A visible banner says changes are not saved and disappear on reload. The native SQLite adapter is not opened, localStorage/IndexedDB are not used, and no personal database is read. Demo success messages explicitly qualify the in-memory effect. Recreating the preview resets its data; the preview cannot establish persistence or native runtime correctness.

The fixture implements the existing repository shape solely to exercise the same view/form callbacks. It reuses current validation, but is not a second persistent backend or a new domain service. Native methods and SQL remain unchanged.

## Verification and delivery

Local npm test: 25/25 passed, including all 23 existing SQLite/domain tests plus local-calendar Yesterday and isolated/resetting preview tests. CI execution, screenshots, TypeScript/Vite and Windows executable evidence are pending; record actual results after running the existing pipeline.

The browser verifier uses the hosted runner's Edge and built-in Node WebSocket/DevTools protocol, with no added dependency. It checks rendering, preview labeling, keyboard/validation/focus, completion/date shortcuts, edits, archive confirmation/cancellation/restore, journal snapshots/cancellation, reload reset, responsive overflow/44px controls, text enlargement and reduced motion. It captures desktop, narrow-screen and expanded-journal PNGs. [Protocol reference](https://chromedevtools.github.io/devtools-protocol/) documents the automation interface. This is browser-only evidence.

## Owner visual review

Close the previous app, extract the new Windows ZIP separately and run relics.exe; no compiler is required. Review at the actual native 1000×800 window, resized widths and text scaling. Check all five symbols, readability and quiet lighting; log today, yesterday and another past date, edit a habit, archive/cancel/restore, expand/cancel in the journal and restart offline. Existing history should remain. Native Windows/WebView2 focus, font rendering and persistence still require this acceptance. The unsigned x64/WebView2 limitations remain. Do not merge automatically or start another feature; await visual review.
