import test from 'node:test';
import assert from 'node:assert/strict';
import { chronicleGroups, chronicleDay } from '../src/ui/chronicleGroups.ts';
import { defaultContributions } from '../src/domain/contributions.ts';
import type { Activity } from '../src/domain/activity.ts';
function row(id: string, day: string, time: string): Activity { return { id, habitId: 'archived', habitName: 'Historical name', spheres: ['mind', 'recovery'], occurredOn: day, recordedAt: time, timezone: 'Pacific/Auckland', contributionSnapshot: defaultContributions(['mind', 'recovery']) }; }
test('Chronicle groups newest dates first, orders within dates and preserves immutable historical fields', () => {
    const a = row('a', '2026-10-26', '2026-10-29T10:00:00Z'), b = row('b', '2026-10-28', '2026-10-29T09:00:00Z'), c = row('c', '2026-10-28', '2026-10-29T11:00:00Z');
    const input = [a, b, c], before = structuredClone(input), groups = chronicleGroups(input);
    assert.deepEqual(groups.map(g => g.day), ['2026-10-28', '2026-10-26']);
    assert.deepEqual(groups[0].entries.map(e => e.id), ['c', 'b']);
    assert.deepEqual(input, before);
    assert.equal(groups[1].entries[0], a);
    assert.equal(groups[0].entries[0].habitName, 'Historical name');
    assert.deepEqual(groups[0].entries[0].spheres, ['mind', 'recovery']);
    assert.deepEqual(chronicleGroups([...input].reverse()), groups);
});
test('Chronicle handles empty and archived-only snapshots and formats the event date without timezone reanchoring', () => {
    assert.deepEqual(chronicleGroups([]), []);
    assert.equal(chronicleGroups([row('old', '2024-02-29', '2026-10-29T12:00:00Z')])[0].day, '2024-02-29');
    assert.equal(chronicleDay('2026-10-28'), '28 октября 2026');
    assert.equal(chronicleDay('2024-02-29'), '29 февраля 2024');
    assert.equal(chronicleDay('2026-01-01'), '1 января 2026');
});
