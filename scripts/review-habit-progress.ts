import { experimentalProgressRules as rules, projectHabitProgress } from '../src/domain/habitProgress.ts';
import { activity, date, habit, practice } from '../tests/fixtures/habitProgress.ts';

const definition = habit();
const recorded = practice([1, 1, 1]);
const today = date(21);
const options = { habit: definition, today, rules, includeWeeks: true };
const removedDate = process.argv.find(value => value.startsWith('--remove='))?.slice('--remove='.length) ?? date(14);
if (!recorded.some(event => event.occurredOn === removedDate)) {
  throw new Error('Choose a synthetic recorded date: ' + recorded.map(event => event.occurredOn).join(', '));
}
const without = recorded.filter(event => event.occurredOn !== removedDate);
const evidence = {
  experimental: true,
  recordedDates: recorded.map(event => event.occurredOn),
  removedDate,
  frequencyHistory: definition.frequencySegments,
  before: projectHabitProgress({ ...options, activities: recorded }),
  removed: projectHabitProgress({ ...options, activities: without }),
  restored: projectHabitProgress({ ...options, activities: [...without, activity(removedDate, definition.id, 'synthetic-rerecord')] }),
  interruption: projectHabitProgress({
    ...options, today: date(20 * 7), activities: practice([...Array(13).fill(1), 0, 0, 0, 0, 1, 1, 1]),
  }),
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(evidence));
} else {
  console.log('EXPERIMENTAL RULES — synthetic histories; no owner approval of numerical rules');
  console.log('Rules:', rules.id, 'version', rules.version);
  console.log('Evaluation date:', today, '| recorded:', evidence.recordedDates.join(', '), '| correction:', removedDate);
  console.table(evidence.frequencyHistory);
  for (const [scenario, result] of Object.entries({
    original: evidence.before, canceled: evidence.removed, rerecorded: evidence.restored, interruptionAndReturn: evidence.interruption,
  })) {
    console.log(scenario, '| today:', result.today, '|', result.mastery.material, 'phase', result.mastery.phase, '| resonance:', result.resonance);
    console.log('F/P/S:', result.forging.frontier, result.forging.protectedCheckpoint, result.forging.consecutiveShortfalls,
      '| next phase:', result.forging.nextPhase ? result.forging.nextPhase.completed + '/' + result.forging.nextPhase.required : 'terminal');
    console.table(result.weeks);
  }
}
