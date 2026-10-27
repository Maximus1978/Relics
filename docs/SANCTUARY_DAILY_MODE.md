# SANCTUARY-UI-001 — first visual Daily Mode

## Scope and baseline

The owner accepted HABITS-001B; GitHub confirms PR #3 merged at 8fc41b39d433fd1c9d26c71757580ae3a3567e77, the master used for this task. This is presentation work only. Domain rules, SQLite adapter, migrations, application identity, snapshots and the Windows workflow are unchanged. Only its browser verification script is expanded for useful visual/interaction evidence.

## Visual language

Owner correction after the first visual delivery: the supplied desktop/mobile prototype screens are the quality bar for atmosphere and detail, not merely palette inspiration. The current flat cathedral, thin rings and gradient rectangles need revision. Judge actual rendered screens against layered gothic architecture, stone/aged-metal material, dimensional gemstone facets, engraved ornament, controlled cold ambient/warm candle lighting and integrated panel frames. Successful compilation does not establish this visual acceptance. Preserve usable Daily Mode and the unchanged data/gameplay scope; do not import prototype scores or inactive navigation. Asset-format clarification is pending because the original brief named CSS/authored SVG and painterly environmental detail may need original raster artwork.

Original CSS/SVG artwork: charcoal stone, restrained antique metal, architectural Sanctuary illustration and faceted medallions. Georgia/system serif supplies display typography; Segoe UI/system sans supplies controls and Cyrillic UI. The design uses shipped CSS/SVG and installed system fonts, with no remote asset requests or new UI libraries/dependencies. No protected game assets are used.

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

Responsive columns become single cards on narrow screens; the sphere gallery wraps to three columns on small phones. A compact header at 1000px keeps the first complete card within an 800px-tall browser content area when the demo-only banner is excluded; this is not native runtime evidence. Interactive targets retain 44px height. Focus outlines, skip link, native checkboxes/date input/disclosures and Russian accessible names remain. No required animation; reduced motion removes smooth scrolling/transitions. No fake counters, progression, quests or nonfunctional navigation.

Token contrast spot checks: primary text on the base panel 13.70:1; muted text on the darkest red card tint 6.19:1; gold-button ink on the darker gradient endpoint 6.15:1. These checks do not replace native font/high-contrast or screen-reader review.

## Safe browser demonstration

Outside Tauri only, a dynamically imported in-memory fixture supplies explicitly fictional sample habits and journal entries. A visible banner says changes are not saved and disappear on reload. The native SQLite adapter is not opened, localStorage/IndexedDB are not used, and no personal database is read. Demo success messages explicitly qualify the in-memory effect. Recreating the preview resets its data; the preview cannot establish persistence or native runtime correctness.

The fixture implements the existing repository shape solely to exercise the same view/form callbacks. It reuses current validation, but is not a second persistent backend or a new domain service. Native methods and SQL remain unchanged.

## Verification and delivery

Local and Windows CI npm test: 25/25 passed, including all 23 existing SQLite/domain tests plus local-calendar Yesterday and isolated/resetting preview tests. [Windows CI run 40583750205](https://github.com/Maximus1978/Relics/actions/runs/40583750205) completed successfully: npm ci, tests, TypeScript, Vite, 34 browser checks, locked Cargo fetch, actual native Tauri release compilation and artifact upload. Node v22.23.4 and Rust/Cargo 1.99.1 were used.

- [PR #4](https://github.com/Maximus1978/Relics/pull/4), feature/sanctuary-ui-001 → master, remains open/unmerged for visual review.
- Tested feature source: cbd98965e851c6d30f20718a5ee5ea378cf978ee. Tested PR merge source: ac3a89594df9f4ea2c9a0e338f7bd84b98d51cdc.
- [Windows ZIP](https://github.com/Maximus1978/Relics/actions/runs/40583750205/artifacts/12772035041): relics-windows-x64-ac3a89594df9f4ea2c9a0e338f7bd84b98d51cdc, 4,290,103 bytes. Local delivery: outputs/Relics-Sanctuary-UI-001-windows-x64.zip outside the repository. SHA256 c170731c4116d335d88353f37ad8049b20b411d814bd5f00b2d1287fc7ba66ad.
- relics.exe: 12,163,072 bytes; SHA256 e4eaed849d443609a4c33cde4a09a179de65c24206052dbc34c1fb612a7339a0. Downloaded ZIP digest matched GitHub; executable digest matched its manifest; build-info.json confirmed both source SHAs and nativeUiRuntimeVerified=false.
- [Browser screenshots/evidence](https://github.com/Maximus1978/Relics/actions/runs/40583750205/artifacts/12771015646): desktop, 390px mobile and expanded journal PNGs, rendered DOM and result.json with all 34 passing checks and zero reported runtime exceptions. All three screenshots were inspected. Browser ZIP SHA256 3c9a3b0d87d09ef543cddebe5e695d975ba97753af27b8f05d4d7bf34611c08d matched its downloaded digest. Copies are delivered outside the repo as outputs/Relics-Sanctuary-desktop.png, Relics-Sanctuary-mobile.png and Relics-Sanctuary-journal.png.
- GitHub artifact retention ends 2026-11-10. Screenshots use explicitly fictional in-memory data, not the owner's database.

Later evidence/formatting commits use [skip ci]. Executable source, tests, migrations and workflow remain identical to the tested feature commit; the verification driver only loses an extra blank line at EOF. The executable was not launched here; native WebView2 appearance, accessibility and offline restart acceptance remain manual.

The browser verifier uses the hosted runner's Edge and built-in Node WebSocket/DevTools protocol, with no added dependency. It checks rendering, preview labeling, keyboard/validation/focus, completion/date shortcuts, edits, archive confirmation/cancellation/restore, journal snapshots/cancellation, reload reset, responsive overflow/44px controls, text enlargement and reduced motion. It captures desktop, narrow-screen and expanded-journal PNGs. [Protocol reference](https://chromedevtools.github.io/devtools-protocol/) documents the automation interface. This is browser-only evidence.

## Owner visual review

Close the previous app, extract the new Windows ZIP separately and run relics.exe; no compiler is required. Review at the actual native 1000×800 window, resized widths and text scaling. Check all five symbols, readability and quiet lighting; log today, yesterday and another past date, edit a habit, archive/cancel/restore, expand/cancel in the journal and restart offline. Existing history should remain. Native Windows/WebView2 focus, font rendering and persistence still require this acceptance. The unsigned x64/WebView2 limitations remain. Do not merge automatically or start another feature; await visual review.
