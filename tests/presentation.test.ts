import test from 'node:test';
import assert from 'node:assert/strict';
import { yesterday } from '../src/ui/dates.ts';
import { createSanctuaryPreview } from '../src/preview/sanctuaryPreview.ts';

test('Yesterday is the previous local calendar day across year, leap and daylight-saving boundaries', () => {
  assert.equal(yesterday(new Date(2026, 0, 1, 0, 15)), '2025-12-31');
  assert.equal(yesterday(new Date(2024, 2, 1, 0, 15)), '2024-02-29');
  assert.equal(yesterday(new Date(2026, 2, 9, 0, 15)), '2026-03-08');
  assert.equal(yesterday(new Date(2026, 10, 2, 0, 15)), '2026-11-01');
});

test('browser demonstration isolates its sessions and discards mutations when recreated', async () => {
  const first = await createSanctuaryPreview();
  const second = await createSanctuaryPreview();
  const original = await second.listHabits('all');
  const journal = await second.list();
  await first.updateHabit('demo-guitar', 'Другая гитара', ['body']);
  await first.archiveHabit('demo-read');
  await first.createHabit('Только в демонстрации', ['mind'], undefined, 'daily');
  await first.log((await first.listHabits()).find(habit => habit.id === 'demo-guitar')!, '2000-01-01');
  await first.remove((await first.list())[0].id);
  const exported = await second.listHabits('all');
  exported[0].name = 'Outside mutation';
  exported[0].spheres.length = 0;
  assert.deepEqual(await second.listHabits('all'), original);
  assert.deepEqual(await second.list(), journal);
  const reopened = await createSanctuaryPreview();
  assert.deepEqual(await reopened.listHabits('all'), original);
  assert.equal((await reopened.list()).length, 2);
  assert.ok((await reopened.listHabits()).every(habit => habit.id.startsWith('demo-')));
});
