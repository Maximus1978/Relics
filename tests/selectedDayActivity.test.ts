import test from 'node:test';
import assert from 'node:assert/strict';
import { selectedDayActivity } from '../src/domain/selectedDayActivity.ts';
import { recentActivity } from '../src/domain/recentActivity.ts';
import type { Activity, SphereId } from '../src/domain/activity.ts';

function entry(id: string, day: string, spheres: SphereId[]): Activity {
  return { id, habitId: `habit-${id}`, habitName: 'Saved historical name', spheres, occurredOn: day, recordedAt: '2026-10-28T22:00:00Z', timezone: 'Pacific/Auckland', contributionSnapshot:null };
}
const dark = { body: false, mind: false, relationships: false, work: false, recovery: false };

test('an unrecorded selected day is subdued, without evaluating failure or changing history', () => {
  const entries = [entry('a', '2026-10-27', ['mind'])];
  const before = structuredClone(entries);
  const selected = selectedDayActivity(entries, '2026-10-28');
  assert.deepEqual(selected.illuminated, dark);
  assert.equal(selected.completedHabitIds.size, 0);
  assert.deepEqual(entries, before);
});

test('one saved snapshot illuminates its sphere and only its completed habit', () => {
  const selected = selectedDayActivity([entry('a', '2026-10-27', ['mind'])], '2026-10-27');
  assert.deepEqual(selected.illuminated, { ...dark, mind: true });
  assert.deepEqual([...selected.completedHabitIds], ['habit-a']);
});

test('multisphere and overlapping activities illuminate every sphere once', () => {
  const selected = selectedDayActivity([
    entry('a', '2026-10-27', ['body', 'recovery']), entry('b', '2026-10-27', ['mind', 'recovery']),
    entry('c', '2026-10-27', ['relationships', 'work']),
  ], '2026-10-27');
  assert.deepEqual(selected.illuminated, { body: true, mind: true, relationships: true, work: true, recovery: true });
  assert.equal(selected.completedHabitIds.size, 3);
});

test('cancellation immediately recomputes the remaining recorded contributions', () => {
  const entries = [entry('a', '2026-10-27', ['body', 'recovery']), entry('b', '2026-10-27', ['recovery'])];
  assert.equal(selectedDayActivity(entries, '2026-10-27').illuminated.body, true);
  const remaining = entries.filter(item => item.id !== 'a');
  assert.deepEqual(selectedDayActivity(remaining, '2026-10-27').illuminated, { ...dark, recovery: true });
  assert.deepEqual(selectedDayActivity([], '2026-10-27').illuminated, dark);
});

test('backdated state uses occurredOn, independent of recording timestamp/timezone and the current seven-day anchor', () => {
  const entries = [entry('old', '2000-01-01', ['work']), entry('recent', '2026-10-27', ['mind'])];
  const observation = recentActivity(entries, '2026-10-28');
  assert.deepEqual(selectedDayActivity(entries, '2000-01-01').illuminated, { ...dark, work: true });
  assert.deepEqual(selectedDayActivity(entries, '2026-10-27').illuminated, { ...dark, mind: true });
  assert.deepEqual(selectedDayActivity(entries, '2026-10-28').illuminated, dark);
  assert.deepEqual(recentActivity(entries, '2026-10-28'), observation);
  assert.equal(observation.counts.work, 0);
  assert.equal(observation.counts.mind, 1);
});

test('historical snapshots survive edited or archived definitions; projection never looks up a current habit', () => {
  const archivedSnapshot = entry('archived', '2026-10-26', ['relationships', 'recovery']);
  const renamedSnapshot = entry('renamed', '2026-10-27', ['mind']);
  assert.deepEqual(selectedDayActivity([archivedSnapshot, renamedSnapshot], '2026-10-26').illuminated,
    { ...dark, relationships: true, recovery: true });
  assert.equal(selectedDayActivity([archivedSnapshot, renamedSnapshot], '2026-10-27').illuminated.mind, true);
  assert.equal(recentActivity([archivedSnapshot, renamedSnapshot], '2026-10-28').represented, 3);
});

test('empty/invalid date input cannot crash the presentation or fabricate activity', () => {
  const entries = [entry('a', '2026-02-30', ['mind'])];
  for (const day of ['', 'invalid', '0000-01-01', '2026-02-30']) {
    assert.deepEqual(selectedDayActivity(entries, day).illuminated, dark);
    assert.equal(selectedDayActivity(entries, day).completedHabitIds.size, 0);
  }
});
