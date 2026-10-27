import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { localDay, validateDay } from '../src/domain/activity.ts';

test('calendar validation accepts past and leap day, rejects future and impossible dates', () => {
  assert.doesNotThrow(() => validateDay('2024-02-29', '2026-10-26'));
  assert.doesNotThrow(() => validateDay('2026-10-26', '2026-10-26'));
  for (const invalid of ['', '2025-02-29', '2026-04-31', '2026-13-01', '0000-01-01', '2026-10-27']) {
    assert.throws(() => validateDay(invalid, '2026-10-26'));
  }
});

test('today uses local calendar fields rather than UTC serialization', () => {
  const local = new Date(2026, 9, 25, 23, 59);
  assert.equal(localDay(local), '2026-10-25');
});

test('SQLite persists multiple spheres, deduplicates, preserves snapshots and supports cancellation', () => {
  const folder = mkdtempSync(join(tmpdir(), 'relics-test-'));
  const path = join(folder, 'activity.db');
  let database = new DatabaseSync(path);
  try {
    database.exec(readFileSync(new URL('../src-tauri/migrations/001_initial.sql', import.meta.url), 'utf8'));
    database.prepare('INSERT INTO habits VALUES (?, ?, ?)').run('test-habit', 'Test habit', '["body","recovery"]');
    const insert = database.prepare(`INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(habit_id, occurred_on) DO NOTHING`);
    insert.run('first', 'test-habit', 'Test habit', '["body","recovery"]', '2026-10-25', '2026-10-26T02:00:00Z', 'America/Los_Angeles');
    insert.run('duplicate', 'test-habit', 'Test habit', '["body"]', '2026-10-25', '2026-10-26T02:01:00Z', 'America/Los_Angeles');
    database.exec("UPDATE habits SET name = 'Changed', spheres_json = '[\"mind\"]'");
    database.close();
    database = new DatabaseSync(path);
    const rows = database.prepare('SELECT * FROM activities').all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].habit_name_snapshot, 'Test habit');
    assert.deepEqual(JSON.parse(String(rows[0].spheres_snapshot_json)), ['body', 'recovery']);
    assert.equal(rows[0].occurred_on, '2026-10-25');
    database.prepare('DELETE FROM activities WHERE id = ?').run('first');
    database.close();
    database = new DatabaseSync(path);
    assert.equal(database.prepare('SELECT count(*) AS total FROM activities').get()?.total, 0);
  } finally {
    database.close();
    rmSync(folder, { recursive: true, force: true });
  }
});
