# UX principles

## Daily Mode

A calm, compact tracker with recognizable line icons, clear names, and quick logging. Show the selected local date, all contributing spheres, and an unambiguous saved state. Avoid animation or adventure-screen prerequisites for a completion. Android prioritizes short interactions; Windows supports keyboard navigation and visible focus.

Past dates are easy to choose. Corrections and removal are discoverable. Empty days remain unknown; planned rest and confirmed inactivity require explicit input. Recurrence must accommodate flexible activities without daily expectations.

## Adventure Mode

Collections, alchemy, crafting, balance visualization, and the museum provide a richer optional experience. Android retains access to all these capabilities. Both modes share the same journal and progression; no duplicate source of truth.

## Emotional safety

No shame messages, streak destruction, loss of earned achievements from absence, compulsory quests, or manipulative return loops. Resonance fading is a quiet description of recent activity, not an alarm. Balance is not a diagnosis or a grade. Optional notes may be empty. Return after an absence should be welcoming and require no catch-up.

## Trust and accessibility

Confirm persistence only after storage succeeds. Keep retry possible after failure. Browser-only previews must identify their storage limitation. Use labels and shape alongside color, readable typography, a target of at least 44 CSS pixels for touch actions, text scaling, safe areas, visible focus, and reduced-motion support. Verify contrast and interactions on actual target platforms.

Sanctuary's dark stone, metal, gemstones, and restrained magic support hierarchy and readability. Decorative backgrounds must not obscure controls. Epoch switching explicitly explains lifetime preservation and the museum before the user confirms.

## Implemented Sanctuary Daily Mode

The owner visually approved Gate A and manually verified the implemented Windows functionality. Remaining artistic differences are accepted for this milestone and tracked as optional improvements; they do not block its authorized merge/release. This does not mark absent progression or Adventure features complete.

SANCTUARY-UI-001 recovery integrates one local painterly environment, dimensional stone/brass shrine structures, a prominent central circle and collectible pendant inventory. Body/Ruby/dumbbell, Mind/Sapphire/brain, Bonds/Garnet/heart, Work/Topaz/briefcase and Recovery/Emerald/leaf are category identities. Rings describe distinct recorded days during the latest seven local calendar days; the center uses the accepted four descriptive rune states (see SANCTUARY_STATES.md). Neither measures personal worth or progress toward an obligation. Today/Yesterday/calendar controls share the existing logging date; one-click completion has an explicit saved state. Create/edit uses a modal/full-screen sheet, management a small disclosure, history a dedicated Chronicle destination (owner-accepted PR #10). Navigation exposes only implemented sections.

Browser-only preview uses clearly labeled fictional in-memory data, resets on reload and never opens native SQLite. Native storage status and demo status are distinct. [Design, checks and acceptance](SANCTUARY_DAILY_MODE.md) distinguish CI/browser evidence from the owner's subsequent native acceptance.

## Independent visual states and future identity rules

| Visual layer | User meaning | Must remain independent from |
| --- | --- | --- |
| Selected-day activity | Illuminated/subdued according to the selected date's record | Current-period Resonance and permanent evolution |
| Recent Resonance | Gradual current visual energy; gentle fading without punishment | Selected-day completion and permanent Mastery |
| Permanent Mastery | Earned artifact evolution retained through inactivity | Missing daily entries or faded recent energy |

Subdued means no recorded activity for that selected date, never confirmed failure. A relic retains earned structure/evolution when daily illumination or recent glow is quiet. Do not invent Resonance values before real projections exist. The present seven-day recorded-date counts are descriptive observations, not an implemented progression model. SANCTUARY-STATE-001 implements selected-day gemstones and the owner-supplied canonical Sanctuary rune accepted by the owner after Windows testing. Shrine and wheel stones follow the selected local date; the rune follows current-seven-day sphere coverage. Both timeframes are labeled. DORMANT and RADIANCE never override selected-day stone states; current-week light can coexist with different historical-day stones. HARMONY/RADIANCE are descriptive light effects, never compulsory goals. Light never indicates a reward or diagnosis. [Exact state/material contract](SANCTUARY_STATES.md). Real Resonance and permanent evolution remain future work.

A small curated habit icon gallery is planned independently of sphere selection. Choosing an icon must not silently change sphere contributions. The WEIGHTS-001A editor uses independent subjective 1–10 values, not a primary/secondary percentage allocation; manual icon identity stays separate from both contribution and optional per-activity intensity. Shared ordinary-relic frames are intentional; authored rare/legendary artifacts receive unique shapes and art.

Habit creation defines identity and contributions. Logging records an actual occurrence. Optional note/intensity belong to that occurrence and must persist through an additive migration before controls ship. No fake fields, required journaling or change to the current one-completion-per-day rule here.

Adventure Mode invites player-driven experiments and optional experiences. Discoveries may reward diversity, unexpected combinations, returning interests and exploration without communicating an optimal XP-grinding route, compulsory checklist or required login. Cosmetics, recipes and collection unlocks are opportunities, not obligations. Basic experiments never spend permanent Mastery/progress.

## Reference policy

The owner-supplied VISUAL_CONTRACT v0.2 makes the original desktop panorama authoritative for SANCTUARY-UI-001 recovery composition, hierarchy, object proportions, materials and density (~90% perceptual fidelity). The Android collage governs future mobile aesthetics; no Android build is authorized here. Sample statistics, recipes and unsupported controls are not behavior specifications. See [reference inventory](visual-references/README.md). Sphere names in some concepts differ from the canonical model.

The references remain a quality guide for future art, while the owner has accepted the current Sanctuary milestone's differences. Keep Daily Mode fast/readable; do not reopen an accepted release gate solely for optional polish. Native owner acceptance and build/render checks are distinct evidence.

## DOC-GAME-002 — accepted future interaction principles

Sanctuary stays a focused RPG dashboard; owner-accepted NAV-CHRONICLE-001 now places full snapshot history at the existing Chronicle destination. PR #10 merged8503670. Backdating/cancellation/shared state remain; no expanded Chronicle below Sanctuary. This documentation task makes no runtime changes.

Use «Печати привычек» for the future user-habit inventory label. Habit Sigils share an ordinary frame and are not earned Unique Artifacts. Collection displays earned/discovered items; Museum preserves artifacts/stories/completed epochs; Chronicle remains real activity/reflection history. Do not present decorative habit cards as rare rewards.

Balance is contextual diversity, not perfect daily completion. A full current rune, including coverage from a single multisphere habit, makes no health claim and earns no automatic powerful bonus. Numeric Balance remains gated by BALANCE-001; Mastery, Resonance and the descriptive rune stay distinct.

Vacation is manually activated and does not require tracking. Its restful aura/possible brief afterglow must not color inactive stones as recorded or change actual weekly rune state. No automatic Recovery/Mastery; no implied physiological recovery. Rhythm suggestions are separately opt-in, based on sustained contextual patterns and uncertainty, dismissible/snoozable/disableable, and never switch modes autonomously.

Blessings offer optional temporary opportunities without fabricated records, artificial Balance or loss of achievements. Exact chance/duration/stacking require review; no unchecked random multipliers or compulsory experiences.

Audio is future work: gentle local effects, accessible visual equivalents, mute and volume controls, restrained playback for completion/gems/rune/discovery/alchemy and world themes. No repetitive attention-seeking loop. Remaining art defects are accepted non-blocking backlog; larger shrine signs and further optics do not restart the accepted release gate.

## WEIGHTS-001A/B — owner-accepted contribution controls

Use the owner's Sanctuary creation image 2026-10-28_14-44-28.jpg for compact dark panels/aged-gold hierarchy, five selectable sphere rows and immediate numerical feedback. Preserve current medallion artwork and canonical line icons/colors. The pictured description, icon picker and character counters do not expand scope. [Detailed interaction/accessibility contract](WEIGHTS_001A.md#6-ux-contract-tied-to-owner-reference).

Each selected row has independent native discrete slider 1–10/step 1 plus accessible numeric adjustment; new selection starts5. Unselected rows have0 and disabled/hidden controls outside tab order; never an active1. Reselect starts5. Allow all five; no percentages, normalization, intensity or health score. Hint explains personal subjective units. Existing defaults are labeled, and history preservation is explained.

Create/Edit share state/validation; immediate values, keyboard arrows/Home/End, number entry, visible focus, explicit per-sphere labels and native screen-reader values. Keep drafts after invalid input/save error, focus first error, offer retry; Cancel/Escape writes nothing and restores focus. Existing busy/save behavior stays. Name rules stay as implemented; no new description/icon-picker/medallion-art work. Reachable Save/Cancel and no horizontal overflow at narrow widths are future acceptance checks.

Saving a visible old default profile confirms only future records; normal completion stays one action with no extra contribution input. Future analytics may display relative shares of recorded subjective units, clearly labeled and separated from this editor; never objective life-balance percentages. Unknown legacy history and known0 remain distinct, with default/excluded counts.

PR #8 implements these Create/Edit controls with existing medallion art and native discrete ranges/numeric alternatives. Actual screenshots include one/two/five selected spheres and narrow layouts; keyboard Arrow/Home/End/Space and accessibility-tree tests are part of the browser suite. Cancel preserves data, normal completion stays one-click, and backup preview explicitly explains v1→v2 conversion/full replacement. Owner accepted native WEIGHTS-001B and PR #8 merged293e7d20; [historical evidence](WEIGHTS_001B.md).

## SPHERE-TRENDS-001 — owner-accepted analytics

Life Rhythm is an expandable read-only panel below the existing habit inventory. Preserve shrines/rune/gems/sigils/rail/art and existing Chronicle navigation. Use dark stone, fine gold borders, canonical colors plus distinguishable dash patterns. Native pressed mode buttons, rolling7-day/complete4/8-week selector, real checkbox filters, visible focus and an expandable full numerical table provide keyboard/screen-reader access; the decorative canvas is aria-hidden.

Units are personal subjective assessments; shares describe recorded units, never quality of life. Empty numeric weeks are gaps/null, not zero measurements or inferred failure. Disclose all/included/default/unknown counts; old missing snapshots remain excluded and marked incomplete. Filters do not change denominators or underlying records. Complete4/8-week modes exclude the current incomplete week with explicit bounds; accepted rolling7-day mode includes actual local today. No recommendations, targets, 20% ideals or notifications. Browser evidence uses opt-in synthetic in-memory repository snapshots, never owner data.

## NAV-CHRONICLE-001 — owner accepted and merged

Sanctuary ends after Life Rhythm. Chronicle is a genuine navigation destination with a focused Жизненная хроника heading, history explanation/count, descending date groups, snapshot names and all canonical sphere icons/labels, plus existing cancellation. Desktop/mobile share one current-page state. Focus moves to the destination heading; skip link and main landmark identify the visible view. No history panel is mounted beneath Sanctuary; inactive Sanctuary is hidden/inert to retain existing chart/date choices without duplicating storage.

Use existing dark stone/metal, gold trim, readable type and calm rows; no hero/new art/navigation design. Loading, repository failure, empty history and post-cancellation empty states are distinct and neutral. Show action success/errors in the active Chronicle, preserve adjacent cancel focus, and retain other snapshots. Backup restore refreshes the same model; a failed refresh explicitly instructs restart instead of silently presenting old rows. No diary, filters, new dates, undo or tracking rules. [Contract/manual acceptance](NAV_CHRONICLE_001.md).

## PROGRESS-001 REVISION — future card/medal interaction contract

[Canonical proposed contract](PROGRESS_001.md#7-visual-contract-and-interaction-composition) and [art comparison](art/HABIT_MEDALS.md). Future material/phase geometry is permanent; habit Resonance only lights it, selected-date completion adds a green corner check, and hover/focus/press independently emphasize interaction. Preserve copper/bronze/gold identity when subdued; full grayscale contradicts the written brief even where a reference caption suggests it. A saved low-energy card still has a green check. Hover/focus never confirms activity, changes material or alters actual spheres. Center icon is manual/material-appropriate, sphere indicators separate.

Plan one native primary button across the card surface and a sibling management menu, no nested controls or duplicate touch/click handlers. Persist before changing completed state; errors retain saved truth and retry. Discoverable repeat activation explicitly cancels a saved mark, with clear action text/accessible label and focus support. This is current physical cancellation, not promised historical Undo: re-recording has a new event ID/current snapshots. Archive logging guards remain. Name/icon/sphere/profile/rhythm edits keep identity; no new input on ordinary completion. Final label/glyphs/correction discoverability need owner visual review.

Inventory and analytics independently collapse with persistent device-local booleans, without a SQLite migration just for UI preferences. Keep headings/essential actions accessible, real aria-expanded/controls, hidden content out of focus/AX, safe focus restoration and expanded fallback on unavailable preference storage. Retain selected date/chart period/mode/filters across collapse/navigation; resize chart on expand. Five shrines/central rune stay outside. These controls are planned UI-COLLAPSE-001, not implemented now.

Daily/three-weekly/weekly describe intended counts, not obligations or fixed weekdays. Proposed full-week credit/tolerated interruption/checkpoints/Resonance remain review gates P01–P09; do not show punitive streaks or false failure. Legacy history without rhythm remains unknown for progression, not zero accomplishment. Explicit future vacation suspends expectations without synthetic events. Spontaneous micro-experiences are optional separate discovery content, never an expectation to record every moment.

PROGRESS-001 review2026-10-31: plan a lightweight phase-local Forging track plus text(e.g.2 of6 cycles, next qualified week3 of6), with keyboard/screen-reader discovery, no fake currency, and truthful saved daily check separate from weekly credit. Partial current week stays neutral. P01 candidate now acceptsDaily6/7; P06 holds full light for expected interval before fade. Explain any ordinary material change caused by actual history correction neutrally; absence alone cannot cause it. P01–P09 still await final approval; existing materials/manual icon/no-grayscale/interaction and collapse contracts remain intact.

## UI-COLLAPSE-001 implementation candidate

Two explicit semantic toggle buttons independently control existing inventory and Life Rhythm. Both default expanded;only two versioned device-local booleans persist. Hidden/inert bodies retain component data/state but leave keyboard/AX;focus inside moves to toggle before hiding. Header/title,count,Add Habit/archive and inventory feedback remain available. Date/analytics controls survive collapse/navigation;uPlot drawing pauses and remeasures on expand. No rename,medal redesign or persistent analytics settings. Corrupt/denied storage falls back safely without blocking use;native offline restart remains owner acceptance. [Contract/evidence](UI_COLLAPSE_001.md). PROGRESS-001 is merged as proposed mechanics only;no progression implemented.
