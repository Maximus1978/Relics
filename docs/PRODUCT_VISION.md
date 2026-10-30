# Product vision

Relics is a long-lived personal life-balance application with RPG progression, collection, experimentation, crafting, and evolving worlds. Its primary audience is the owner using it in real life. Commercial distribution is a possible future decision.

The application serves life. Success means a person can record meaningful experiences, trust their history, explore when curious, and return comfortably after an absence. Maximizing productivity, logins, streaks, or time in the application is not a product goal.

## Product invariants

- Offline operation without a required account, cloud service, or ChatGPT connection.
- Windows 11 and Android, with shared domain logic and platform-specific interactions.
- Five spheres: Body, Mind, Bonds, Work, Recovery. A habit may select one to five spheres with independent subjective contribution units 1–10 (default 5), 0 when unselected; no normalization, intensity or objective health measurement. Persistence/editor/backup compatibility are owner-accepted in WEIGHTS-001B (PR #8); read-only trends including rolling7 days are owner-accepted in SPHERE-TRENDS-001 (PR #9).
- Instant and backdated logging; correction and removal; optional notes and emotional reflection.
- Habit creation, editing, archiving, restoration, and daily, scheduled, or flexible recurrence.
- Unrecorded days remain unknown. Confirmed inactivity and planned rest are explicit states, not inferred from missing entries.
- Lifetime history, discoveries, and milestones persist across voluntary epochs. The museum preserves previous journeys.
- Mastery represents accumulated practice. Resonance represents recent participation and visual energy. Balance describes diversity of attention, not personal worth or health.
- Authored discoveries and a finite, controlled catalog preserve surprise. Alchemy supports meaningful experimentation.
- Microquests, journaling, and Adventure Mode remain optional.

## Psychological principles

Curiosity, exploration, and positive reinforcement guide engagement. Interruptions never destroy accumulated achievements. A person can enjoy life without opening the app. Returning after a long absence requires no catch-up work. No punitive XP, daily-login rewards, destructive streak resets, coercive reminders, or manipulative retention loops.

Recent Resonance may naturally fade as a descriptive signal. That must not erase Mastery, earned discoveries, lifetime history, or milestones, and must not become a warning or obligation.

## First world and scope

Sanctuary is an original dark gothic fantasy world with restrained magical effects, gemstones, illustrated medallions, aged metal, and dark stone. VISUAL_CONTRACT v0.2 and the desktop TARGET guided its composition/materials. The owner has approved Gate A and manually verified implemented functionality in Windows; remaining artistic differences are future improvements, not release blockers. Invented concept scores, recipes and future controls are not behavior specifications. Proprietary game assets must not be reproduced. Planned worlds remain Sanctuary, Clockwork, Wasteland and Verdant with shared versioned declarative packs.

The foundation precedes full game development. The owner accepted native habit management, multisphere logging, backdating and SQLite persistence through HABITS-001B and has now accepted Sanctuary's revised UI/implemented Windows functionality. The intended game loop is real activity → Mastery/thematic essences → player experiments → authored discoveries → optional experiences. Native Windows backup/restore is now owner-accepted and merged in PR #5. The owner has also accepted STATE-001 on Windows: the central rune, its four light states, independent selected-day gemstones and responsive technical layers. DOC-GAME-002 releases that unchanged implementation and records future decisions; remaining art differences do not block it. Habit icon/contribution identity, activity details, progression and Adventure systems remain future individual tasks; see ROADMAP.md. No automatic continuation.

## Source and precedence

The owner's original request, attached desktop/mobile concepts, and subsequently supplied “RELICS — Project Foundation & Architecture” brief define this foundation. The owner additionally requires one task at a time. The latest explicit brief clarifies Resonance and documentation language/layout.

The referenced ChatGPT conversation is 6adfce6e-f670-83e8-9727-caf679f5d617. Retrieved user messages emphasize personal surprise, authored uniqueness, Alchemy-like experimentation, and manageable engineering. Assistant replies were inaccessible content references. Unknown formulas and secret recipes are not reconstructed.

## DOC-GAME-002: accepted product decisions, future unless stated otherwise

Habit Sigils represent user-defined interests/habits in a shared ordinary medallion frame; future Mastery may evolve them. They are not unique rewards. Unique Artifacts are earned/discovered, have stable identities and authored designs, live in Collection and may open bounded optional opportunities. Chronicle stores real activities and optional reflections; Museum preserves earned artifacts, discovery stories and completed epochs without replacing Chronicle or Collection. Renaming «Ваши реликвии» to «Печати привычек» is planned, not applied.

Sanctuary is a focused RPG dashboard. NAV-CHRONICLE-001 will move full history into the existing Chronicle navigation destination, retaining backdating, cancellation and snapshots; a compact recent-activity indication is optional. No navigation changes are part of this documentation release.

Mastery is permanent accumulated experience; Resonance is recent participation/visual energy that may gently fade. Balance is context-sensitive sphere diversity, never perfect daily completion or a health score. The implemented descriptive four-state rune is independent of Mastery/Resonance. Seven logs of one all-five-sphere habit can legitimately produce 35/35 coverage; that alone proves neither healthy balance nor entitlement to powerful rewards. BALANCE-001 must specify context, weights and anti-grinding before numeric KPIs.

Blessings are approved future optional temporary effects from approved discoveries, progression or meaningful patterns: cosmetic illumination, authored hints, optional encounters/micro-adventures and bounded cosmetic discovery opportunities. They never fabricate activities, inflate measured Balance or erase permanent achievements. No +5% XP or unchecked random multipliers is approved.

Vacation Mode is approved future manual freedom from ordinary obligations: one day, an interval or until manually ended, with a restful Sanctuary aura and possible brief cosmetic afterglow. Actual daily gemstones and current-seven-day history remain truthful; no automatic Recovery records or Mastery. Vacation is not a physiological recovery claim. Optional memories/discoveries are later possibilities. Opt-in rhythm suggestions are a separate task: sustained contextual patterns, uncertain missing data, dismiss/snooze/disable, no autonomous mode switches.

Restrained offline sound with mute/volume controls and accessible alternatives is planned, not implemented. Accepted Adventure scope and the four World Packs remain intact. [GAME_DESIGN](GAME_DESIGN.md) distinguishes approved principles from open mechanics; [ROADMAP](ROADMAP.md) keeps tasks small. The later owner priority override is WEIGHTS-001A → WEIGHTS-001B → SPHERE-TRENDS-001 → NAV-CHRONICLE-001; Android is deferred until Windows core mechanics are validated. All earlier roadmap scope is retained.
