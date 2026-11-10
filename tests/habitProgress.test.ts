import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { defaultContributions } from '../src/domain/contributions.ts';
import { changeFrequency, type ArchivePause, type Frequency } from '../src/domain/habitRhythm.ts';
import { experimentalProgressRules as rules, ProgressInputError, projectHabitProgress, projectHabitsProgress } from '../src/domain/habitProgress.ts';
import { activity, date, habit, monday, practice, segment } from './fixtures/habitProgress.ts';

const allSpheres = ['body', 'mind', 'relationships', 'work', 'recovery'] as const;
const project = (counts: number[], frequency: Frequency = 'weekly', today = date(counts.length * 7)) =>
  projectHabitProgress({ habit: habit(frequency), activities: practice(counts), today, rules, includeWeeks: true });

test('Daily 6/7 and 7/7 each add one cycle; 5/7 is a shortfall', () => {
  const result = project([6, 7, 5], 'daily');
  assert.deepEqual(result.weeks!.map(week => [week.outcome, week.recordedDays, week.frontier, week.consecutiveShortfalls]),
    [['qualified', 6, 1, 0], ['qualified', 7, 2, 0], ['shortfall', 5, 2, 1], ['current-week', 0, 2, 1]]);
});

test('Three per week requires 3 distinct days; weekly requires 1', () => {
  const three = project([3, 2], 'three_per_week');
  const weekly = project([7, 0]);
  assert.deepEqual(three.weeks!.slice(0, 2).map(week => [week.outcome, week.frontier]), [['qualified', 1], ['shortfall', 1]]);
  assert.deepEqual(weekly.weeks!.slice(0, 2).map(week => [week.outcome, week.frontier]), [['qualified', 1], ['shortfall', 1]]);
});

test('Duplicate days, five spheres and contribution values add no cycle credit', () => {
  const activities = practice([2]);
  activities.push({ ...activities[0], id: 'same-day', spheres: [...allSpheres], contributionSnapshot: defaultContributions(allSpheres) });
  const result = projectHabitProgress({ habit: habit('three_per_week'), activities, today: date(7), rules, includeWeeks: true });
  assert.equal(result.weeks![0].recordedDays, 2);
  assert.equal(result.weeks![0].outcome, 'shortfall');
  assert.equal(result.forging.frontier, 0);
});

test('Two consecutive shortfalls clear only the unfinished tail; return resumes from the checkpoint', () => {
  const result = project([...Array(13).fill(1), 0, 0, 0, 0, 1, 1, 1]);
  assert.deepEqual(result.weeks!.slice(12, 20).map(w => [w.frontier, w.protectedCheckpoint, w.consecutiveShortfalls]),
    [[13, 12, 0], [13, 12, 1], [12, 12, 2], [12, 12, 2], [12, 12, 2], [13, 12, 0], [14, 12, 0], [15, 15, 0]]);
  assert.deepEqual(result.mastery, { material: 'bronze', phase: 3 });
  assert.deepEqual(project([...Array(13).fill(1), ...Array(100).fill(0)]).mastery, { material: 'bronze', phase: 2 });
});

test('All 18 material and phase thresholds are inclusive', () => {
  const thresholds = [[0, 1, 2], [3, 5, 7], [9, 12, 15], [18, 24, 30], [36, 48, 60], [72, 84, 96]];
  const materials = ['stone', 'copper', 'bronze', 'silver', 'gold', 'platinum'];
  let previous = { material: 'stone', phase: 1 };
  for (const [tier, steps] of thresholds.entries()) {
    for (const [index, threshold] of steps.entries()) {
      if (threshold > 0) assert.deepEqual(project(Array(threshold - 1).fill(1)).mastery, previous);
      previous = { material: materials[tier], phase: index + 1 };
      const result = project(Array(threshold).fill(1));
      assert.deepEqual(result.mastery, previous);
      assert.equal(result.forging.protectedCheckpoint, threshold);
    }
  }
});

test('Phase-local progress restarts at the next checkpoint and Platinum ends the track', () => {
  assert.deepEqual(project(Array(20).fill(1)).forging.nextPhase, { completed: 2, required: 6, threshold: 24 });
  assert.equal(project(Array(21).fill(1)).forging.unfinished, 3);
  assert.deepEqual(project(Array(24).fill(1)).forging.nextPhase, { completed: 0, required: 6, threshold: 30 });
  for (const count of [96, 97, 120]) {
    const result = project(Array(count).fill(1));
    assert.deepEqual(result.mastery, { material: 'platinum', phase: 3 });
    assert.equal(result.forging.frontier, count);
    assert.equal(result.forging.protectedCheckpoint, 96);
    assert.equal(result.forging.unfinished, 0);
    assert.equal(result.forging.nextPhase, null);
  }
});

test('Valid midweek enrollment and current week stay neutral, even with sufficient dates', () => {
  const definition = habit('daily', date(1));
  const activities = [...practice([7, 6]), activity(date(-2))];
  const evaluate = (today: string) => projectHabitProgress({ habit: definition, activities, today, rules, includeWeeks: true });
  assert.deepEqual(evaluate(date(13)).weeks!.map(w => [w.outcome, w.recordedDays]),
    [['unconfigured', 1], ['initial-partial', 7], ['current-week', 6]]);
  assert.equal(evaluate(date(13)).forging.frontier, 0);
  assert.equal(evaluate(date(14)).forging.frontier, 1);
});

test('Schema 6 rejects later midweek effective dates separately from neutral valid weeks', () => {
  const definition = habit();
  definition.frequencySegments!.push(segment(definition.id, 'daily', date(9), date(3)));
  assert.throws(() => projectHabitProgress({ habit: definition, activities: [], today: date(14), rules }),
    error => error instanceof ProgressInputError && /effective date/.test(error.message));
});

test('Frequency history evaluates old weeks at their own minima, and clears S only when the boundary is effective', () => {
  const definition = habit('daily');
  definition.frequencySegments!.push(segment(definition.id, 'three_per_week', date(14), date(10)),
    segment(definition.id, 'weekly', date(28), date(24)));
  const activities = practice([6, 5, 3, 2, 1]);
  const evaluate = (today: string) => projectHabitProgress({ habit: definition, activities, today, rules, includeWeeks: true });
  const result = evaluate(date(35));
  assert.deepEqual(result.weeks!.slice(0, 5).map(w => [w.frequency, w.outcome, w.frontier]), [
    ['daily', 'qualified', 1], ['daily', 'shortfall', 1], ['three_per_week', 'qualified', 2],
    ['three_per_week', 'shortfall', 2], ['weekly', 'qualified', 3],
  ]);
  assert.equal(evaluate(date(14)).forging.consecutiveShortfalls, 0);
  const original = project([6, 5], 'daily', date(14));
  assert.equal(original.forging.consecutiveShortfalls, 1);
  assert.deepEqual(result.mastery, { material: 'copper', phase: 1 });
});

test('Replacing a pending change still yields one effective row and one weekly unit', () => {
  const definition = habit('daily');
  const weekly = changeFrequency(definition.frequencySegments!, definition.id, { kind: 'set', frequency: 'weekly' }, date(3), 'pending');
  definition.frequencySegments = changeFrequency(weekly, definition.id, { kind: 'set', frequency: 'three_per_week' }, date(4), 'replacement');
  assert.equal(definition.frequencySegments.length, 2);
  assert.equal(definition.frequencySegments[1].id, 'pending');
  const result = projectHabitProgress({ habit: definition, activities: practice([6, 7]), today: date(14), rules, includeWeeks: true });
  assert.equal(result.forging.frontier, 2);
  assert.equal(result.weeks![1].frequency, 'three_per_week');
});

test('A known intersecting archive week is neutral and leaves S unchanged', () => {
  const definition = habit();
  const pause: ArchivePause = { id: 'known', habitId: definition.id, startOn: date(36), endExclusiveOn: date(37), reason: 'archive', provenance: 'recorded' };
  definition.archivePauses = [pause];
  const result = projectHabitProgress({ habit: definition, activities: practice([1, 1, 1, 1, 0, 1, 0]), today: date(49), rules, includeWeeks: true });
  assert.deepEqual(result.weeks!.slice(4, 7).map(w => [w.outcome, w.frontier, w.consecutiveShortfalls]),
    [['shortfall', 4, 1], ['archive', 4, 1], ['shortfall', 3, 2]]);
  const archived = projectHabitProgress({ habit: { ...definition, archivedAt: date(36) + 'T12:00:00Z', archivePauses: [{ ...pause, endExclusiveOn: null }] },
    activities: practice([1, 1, 1, 1, 0, 1]), today: date(37), rules });
  assert.equal(archived.archive, 'archive');
  assert.equal(archived.resonance, 0);
  assert.equal(archived.forging.frontier, 4);
});

test('Unknown legacy start remains neutral and restoration does not refill light', () => {
  const definition = habit();
  const pause: ArchivePause = { id: 'legacy', habitId: definition.id, startOn: null, endExclusiveOn: date(10), reason: 'archive', provenance: 'legacy_unknown' };
  definition.archivePauses = [pause];
  const activities = practice([1, 1]);
  const evaluate = (today: string, events = activities) => projectHabitProgress({ habit: definition, activities: events, today, rules, includeWeeks: true });
  assert.equal(evaluate(date(9)).archive, 'legacy_unknown');
  const restored = evaluate(date(14));
  assert.equal(restored.archive, 'none');
  assert.equal(restored.resonance, 0);
  assert.equal(restored.forging.frontier, 0);
  assert.deepEqual(restored.weeks!.slice(0, 2).map(w => w.outcome), ['legacy_unknown', 'legacy_unknown']);
  assert.equal(evaluate(date(14), [...activities, activity(date(10))]).resonance, 1);
  const neverConfigured = habit(null);
  const open = projectHabitProgress({ habit: { ...neverConfigured, archivedAt: date(10) + 'T12:00:00Z', archivePauses: [{ ...pause, endExclusiveOn: null }] },
    activities, today: date(14), rules, includeWeeks: true });
  assert.equal(open.archive, 'legacy_unknown');
  assert.equal(open.currentFrequency, null);
  assert.equal(open.resonance, 0);
  assert.equal(open.forging.nextPhase, null);
});

test('Correction replay preserves Daily 6/7, removes 5/7 credit and restores it on re-record', () => {
  const definition = habit('daily');
  const activities = practice([7, 6, 6]);
  const evaluate = (events: typeof activities) => projectHabitProgress({ habit: definition, activities: events, today: date(21), rules });
  assert.equal(evaluate(activities).mastery.material, 'copper');
  const six = activities.filter(event => event.occurredOn !== date(0));
  assert.equal(evaluate(six).mastery.material, 'copper');
  const five = six.filter(event => event.occurredOn !== date(1));
  assert.equal(evaluate(five).mastery.material, 'stone');
  assert.equal(evaluate([...five, activity(date(1), definition.id, 'backdated-new-id')]).mastery.material, 'copper');
});

test('Canceling one Weekly event can remove Copper; earlier backdates and future dates add no evidence', () => {
  const definition = habit();
  const activities = practice([1, 1, 1]);
  const evaluate = (events: typeof activities) => projectHabitProgress({ habit: definition, activities: events, today: date(21), rules });
  assert.equal(evaluate(activities).mastery.material, 'copper');
  assert.equal(evaluate([activity(date(-2)), ...activities.slice(1), activity(date(30))]).mastery.material, 'stone');
  assert.equal(evaluate([activity(date(0), definition.id, 're-record'), ...activities.slice(1)]).mastery.material, 'copper');
});

test('Resonance uses actual today, excludes pre-enrollment activity, and is independent of phase and selected date', () => {
  const options = { habit: habit(), activities: [activity(monday)], today: date(14), rules };
  const historicalSelection = { ...options, selectedDate: monday };
  assert.equal(projectHabitProgress(historicalSelection).resonance, 0.5);
  const correction = projectHabitProgress({ ...options, activities: [...options.activities, activity(date(14))] });
  assert.equal(correction.resonance, 1);
  assert.deepEqual(correction.mastery, projectHabitProgress(options).mastery);
  assert.equal(projectHabitProgress({ ...options, activities: [activity(date(-1))] }).resonance, 0);
  assert.equal(projectHabitProgress({ ...options, habit: habit(null) }).resonance, 0);
});

test('Daily, Three per week and Weekly honor grace and fade on whole calendar days', () => {
  const expected = {
    daily: [[0, 1], [1, 1], [2, .5], [3, 0]],
    three_per_week: [[0, 1], [2, 1], [3, 6/7], [4, 9/14], [5, 3/7], [6, 3/14], [7, 0]],
    weekly: [[0, 1], [7, 1], [14, .5], [21, 0]],
  } as const;
  for (const frequency of Object.keys(expected) as Frequency[]) {
    for (const [age, value] of expected[frequency]) {
      const result = projectHabitProgress({ habit: habit(frequency), activities: [activity(monday)], today: date(age), rules });
      assert.equal(result.resonance, value);
    }
  }
});

test('Weeks and recency use calendar days over leap day, DST and a year boundary', () => {
  const result = projectHabitProgress({ habit: habit('weekly', '2023-12-25'), today: '2024-03-11', rules, includeWeeks: true,
    activities: ['2023-12-31', '2024-01-01', '2024-02-29', '2024-03-10'].map(day => activity(day)) });
  assert.equal(result.weeks!.filter(w => w.outcome === 'qualified').length, 4);
  assert.equal(result.weeks!.find(w => w.startsOn === '2024-02-26')!.recordedDays, 1);
  assert.equal(result.weeks!.at(-2)!.startsOn, '2024-03-04');
  assert.equal(result.resonance, 1);
  const daily = projectHabitProgress({ habit: habit('daily', '2024-03-04'), today: '2024-03-11', rules, activities: [activity('2024-03-09')] });
  assert.equal(daily.resonance, 0.5);
});

test('Collections preserve habit isolation, tolerate reordered input and never mutate frozen source data', () => {
  const one = habit('weekly', monday, 'a');
  one.frequencySegments!.push(segment('a', 'daily', date(7), date(3)));
  const two = habit(null, monday, 'b');
  two.archivePauses = [
    { id: 'a1', habitId: 'b', startOn: date(1), endExclusiveOn: date(2), reason: 'archive', provenance: 'recorded' },
    { id: 'a2', habitId: 'b', startOn: date(5), endExclusiveOn: date(8), reason: 'archive', provenance: 'recorded' },
  ];
  const events = Object.freeze([...practice([1, 6], 'a'), activity(date(4), 'b')].map(event => Object.freeze(event)));
  const input = { habits: Object.freeze([Object.freeze(one), Object.freeze(two)]), activities: events, today: date(14), rules, includeWeeks: true };
  const before = JSON.stringify(input);
  const baseline = projectHabitsProgress(input);
  const reversed = projectHabitsProgress({ ...input, habits: [
    { ...two, archivePauses: [...two.archivePauses].reverse() },
    { ...one, frequencySegments: [...one.frequencySegments!].reverse() },
  ], activities: [...events].reverse() });
  assert.deepEqual(reversed, baseline);
  assert.equal(JSON.stringify(input), before);
  assert.equal(baseline[0].forging.frontier, 2);
  assert.equal(baseline[1].forging.frontier, 0);
  assert.equal(baseline[1].currentFrequency, null);
});

test('Unsupported versions, bad dates, references and overlapping pauses fail explicitly', () => {
  const definition = habit();
  const input = { habit: definition, activities: [activity(monday)], today: date(7), rules };
  assert.throws(() => projectHabitProgress({ ...input, rules: { ...rules, version: 2 } }), /Unsupported/);
  assert.throws(() => projectHabitProgress({ ...input, rules: { ...rules, id: 'unknown' } }), /Unsupported/);
  assert.throws(() => projectHabitProgress({ ...input, today: '2023-02-29' }), /evaluation/);
  assert.throws(() => projectHabitProgress({ ...input, activities: [activity('2024-02-30')] }), /activity calendar/);
  assert.throws(() => projectHabitProgress({ ...input, activities: [activity(monday, 'wrong-habit')] }), /outside/);
  assert.throws(() => projectHabitProgress({ ...input, activities: [...input.activities, ...input.activities] }), /Duplicate/);
  assert.throws(() => projectHabitsProgress({ ...input, habits: [definition, definition] }), /Duplicate habit/);
  const pause: ArchivePause = { id: 'p', habitId: definition.id, startOn: date(1), endExclusiveOn: date(4), reason: 'archive', provenance: 'recorded' };
  const invalid = (archivePauses: ArchivePause[]) => projectHabitProgress({ ...input, habit: { ...definition, archivePauses } });
  assert.throws(() => invalid([pause, { ...pause, id: 'p2', startOn: date(2) }]), /overlap/);
  assert.throws(() => invalid([{ ...pause, startOn: null }]), /legacy provenance/);
  assert.throws(() => invalid([{ ...pause, endExclusiveOn: null }]), /archive state/);
});

test('Multi-year replay is deterministic with no stored aggregate or grant output', () => {
  const definitions = Array.from({ length: 8 }, (_, i) => habit('daily', monday, 'large-' + i));
  const activities = definitions.flatMap(definition => practice(Array(625).fill(6), definition.id));
  const input = { habits: definitions, activities, today: date(625 * 7), rules };
  const first = projectHabitsProgress(input);
  const second = projectHabitsProgress({ ...input, activities: [...activities].reverse(), habits: [...definitions].reverse() });
  assert.deepEqual(first, second);
  for (const result of first) {
    assert.deepEqual(result.mastery, { material: 'platinum', phase: 3 });
    assert.equal(result.forging.frontier, 625);
    assert.equal(result.forging.protectedCheckpoint, 96);
    assert.equal(result.weeks, undefined);
    assert.deepEqual(Object.keys(result).sort(), ['archive', 'currentFrequency', 'forging', 'habitId', 'mastery', 'resonance', 'rules', 'today', 'weeks']);
  }
});

test('Fresh offline Node processes in different time zones replay the same result', () => {
  const simulator = fileURLToPath(new URL('../scripts/review-habit-progress.ts', import.meta.url));
  const run = (TZ: string) => {
    const result = spawnSync(process.execPath, ['--permission', '--allow-fs-read=*', '--experimental-strip-types', simulator, '--json'], {
      encoding: 'utf8', env: { ...process.env, TZ }, timeout: 15000,
    });
    assert.equal(result.status, 0, result.error?.message ?? result.stderr);
    return JSON.parse(result.stdout);
  };
  const first = run('America/Los_Angeles');
  assert.deepEqual(run('Pacific/Auckland'), first);
  assert.equal(first.before.mastery.material, 'copper');
  assert.equal(first.removed.mastery.material, 'stone');
  assert.deepEqual(first.restored, first.before);
});
