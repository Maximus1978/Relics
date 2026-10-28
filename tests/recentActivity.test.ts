import test from 'node:test';
import assert from 'node:assert/strict';
import { recentActivity } from '../src/domain/recentActivity.ts';
import type { Activity, SphereId } from '../src/domain/activity.ts';

function entry(day: string, contributions: SphereId[], habitName = 'Historical name'): Activity {
  return { id: crypto.randomUUID(), habitId: 'archived-or-edited', habitName, spheres: contributions, occurredOn: day, recordedAt: '2026-10-27T12:00:00Z', timezone: 'America/Los_Angeles', contributionSnapshot:null };
}

test('empty history has descriptive zero counts and no fabricated observations', () => {
  assert.deepEqual(recentActivity([], '2026-10-27'), { startOn: '2026-10-21', endOn: '2026-10-27', counts: { body: 0, mind: 0, relationships: 0, work: 0, recovery: 0 }, represented: 0 });
});

test('counts distinct days per snapshot sphere, not sessions or habit definitions', () => {
  const entries = [entry('2026-10-27', ['mind', 'recovery']), entry('2026-10-27', ['mind']), entry('2026-10-26', ['mind', 'work'])];
  const before = structuredClone(entries);
  assert.deepEqual(recentActivity(entries, '2026-10-27').counts, { body: 0, mind: 2, relationships: 0, work: 1, recovery: 1 });
  assert.equal(recentActivity(entries, '2026-10-27').represented, 3);
  assert.deepEqual(entries, before);
});

test('inclusive seven-day bounds exclude old and future activity dates regardless of recording time', () => {
  const observed = recentActivity([entry('2026-10-20', ['body']), entry('2026-10-21', ['mind']), entry('2026-10-27', ['work']), entry('2026-10-28', ['relationships'])], '2026-10-27');
  assert.deepEqual(observed.counts, { body: 0, mind: 1, relationships: 0, work: 1, recovery: 0 });
});

test('historical October 26–27 snapshots contribute even when habit names differ or definitions are unavailable', () => {
  const observed = recentActivity([entry('2026-10-26', ['body', 'recovery'], 'Old name'), entry('2026-10-27', ['mind'], 'Before rename')], '2026-10-27');
  assert.equal(observed.represented, 3);
  assert.equal(observed.counts.recovery, 1);
});

test('calendar windows cross year, leap and daylight-saving boundaries without 24-hour arithmetic', () => {
  for (const [anchor, start] of [['2026-01-03', '2025-12-28'], ['2024-03-03', '2024-02-26'], ['2026-03-10', '2026-03-04'], ['2026-11-03', '2026-10-28']]) {
    assert.equal(recentActivity([], anchor).startOn, start);
  }
});

test('impossible source dates are not observations and invalid window anchors are rejected', () => {
  assert.equal(recentActivity([entry('2026-02-29', ['mind'])], '2026-03-01').represented, 0);
  assert.throws(() => recentActivity([], '2026-02-30'));
});
