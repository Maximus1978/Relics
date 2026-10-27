import test, { type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { openActivityRepository, type SqlDatabase } from '../src/data/activityRepository.ts';
import { HabitValidationError, validateHabitInput } from '../src/domain/habit.ts';
import { localDay, sampleHabits } from '../src/domain/activity.ts';

function sqliteAdapter(database: DatabaseSync): SqlDatabase {
  function bindings(values: unknown[]): Record<string, SQLInputValue> {
    return Object.fromEntries(values.map((value, index) => [`$${index + 1}`, value as SQLInputValue]));
  }
  return {
    async execute(query, values = []) {
      const statement = database.prepare(query);
      const result = values.length ? statement.run(bindings(values)) : statement.run();
      return { rowsAffected: Number(result.changes) };
    },
    async select<Result>(query: string, values: unknown[] = []): Promise<Result> {
      const statement = database.prepare(query);
      return (values.length ? statement.all(bindings(values)) : statement.all()) as Result;
    },
  };
}

function fixture(context: TestContext) {
  const temporaryRoot = resolve(tmpdir());
  const folder = mkdtempSync(join(temporaryRoot, 'relics-habits-'));
  const path = join(folder, 'habits.db');
  let database = new DatabaseSync(path);
  database.exec('PRAGMA foreign_keys = ON');
  database.exec(readFileSync(new URL('../src-tauri/migrations/001_initial.sql', import.meta.url), 'utf8'));
  context.after(() => {
    database.close();
    if (dirname(folder) !== temporaryRoot) throw new Error('Unexpected test cleanup directory.');
    rmSync(folder, { recursive: true, force: true });
  });
  return {
    get database() { return database; },
    open() { return openActivityRepository(sqliteAdapter(database)); },
    reopen() {
      database.close();
      database = new DatabaseSync(path);
      database.exec('PRAGMA foreign_keys = ON');
      return openActivityRepository(sqliteAdapter(database));
    },
  };
}

test('creates a habit with one sphere using the production repository', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('Зарядка', ['body']);
  assert.ok(habit.id);
  assert.deepEqual(habit.spheres, ['body']);
  assert.deepEqual((await repository.listHabits()).find(entry => entry.id === habit.id), habit);
});

test('creates Гитара with Mind and Recovery, trimming the name', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('  Гитара  ', ['mind', 'recovery']);
  assert.equal(habit.name, 'Гитара');
  assert.deepEqual(habit.spheres, ['mind', 'recovery']);
  assert.deepEqual((await repository.listHabits()).at(-1), habit);
});

test('rejects empty and whitespace-only names without inserting rows', async context => {
  const database = fixture(context);
  const repository = await database.open();
  for (const name of ['', '   ', '\t\n']) {
    await assert.rejects(repository.createHabit(name, ['mind']),
      error => error instanceof HabitValidationError && error.field === 'name');
  }
  assert.equal((await repository.listHabits()).length, sampleHabits.length);
});

test('rejects empty sphere selection without inserting a habit', async context => {
  const database = fixture(context);
  const repository = await database.open();
  await assert.rejects(repository.createHabit('Гитара', []),
    error => error instanceof HabitValidationError && error.field === 'spheres');
  assert.equal((await repository.listHabits()).length, sampleHabits.length);
});

test('rejects unknown spheres and normalizes duplicate selections to canonical order', () => {
  assert.throws(() => validateHabitInput('Гитара', ['custom']), HabitValidationError);
  assert.deepEqual(validateHabitInput('Гитара', ['recovery', 'mind', 'mind']), {
    name: 'Гитара', spheres: ['mind', 'recovery'],
  });
});

test('habit and backdated activity survive reopening with snapshots and no duplicate completion', async context => {
  const database = fixture(context);
  let repository = await database.open();
  const habit = await repository.createHabit('Гитара', ['mind', 'recovery']);
  const previousDay = new Date();
  previousDay.setDate(previousDay.getDate() - 1);
  const day = localDay(previousDay);
  await repository.log(habit, day);
  await repository.log(habit, day);
  const originalEntries = await repository.list();
  assert.equal(originalEntries.length, 1);
  repository = await database.reopen();
  assert.deepEqual((await repository.listHabits()).find(entry => entry.id === habit.id), habit);
  assert.deepEqual(await repository.list(), originalEntries);
  assert.equal(originalEntries[0].occurredOn, day);
  assert.equal(originalEntries[0].habitName, 'Гитара');
  assert.deepEqual(originalEntries[0].spheres, ['mind', 'recovery']);
});

test('existing October 26 and 27 records remain unchanged when creating and reopening', async context => {
  const database = fixture(context);
  let repository = await database.open();
  for (const day of ['2026-10-26', '2026-10-27']) {
    database.database.prepare(`INSERT INTO activities
      (id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(`legacy-${day}`, 'walk', 'Прогулка раньше',
      '["body","recovery"]', day, `${day}T18:00:00Z`, 'America/Los_Angeles');
  }
  const before = await repository.list();
  await repository.createHabit('Гитара', ['mind', 'recovery']);
  repository = await database.reopen();
  assert.deepEqual(await repository.list(), before);
  assert.equal((await repository.listHabits()).length, 4);
});

test('repeated startup neither duplicates samples nor overwrites existing definitions or custom habits', async context => {
  const database = fixture(context);
  let repository = await database.open();
  const custom = await repository.createHabit('Прогулка', ['mind']);
  database.database.prepare('UPDATE habits SET name = ?, spheres_json = ? WHERE id = ?')
    .run('Сохранённое название', '["recovery"]', 'walk');
  for (let restart = 0; restart < 3; restart++) repository = await database.reopen();
  const habits = await repository.listHabits();
  assert.equal(habits.length, 4);
  for (const sample of sampleHabits) assert.equal(habits.filter(habit => habit.id === sample.id).length, 1);
  assert.deepEqual(habits.find(habit => habit.id === custom.id), custom);
  assert.deepEqual(habits.find(habit => habit.id === 'walk'), {
    id: 'walk', name: 'Сохранённое название', spheres: ['recovery'],
  });
});

test('logging keeps the saved name and sphere snapshot after later database definition changes', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('Гитара', ['mind', 'recovery']);
  await repository.log(habit, '2000-01-01');
  database.database.prepare('UPDATE habits SET name = ?, spheres_json = ? WHERE id = ?')
    .run('Другое название', '["body"]', habit.id);
  const [entry] = await repository.list();
  assert.equal(entry.habitName, 'Гитара');
  assert.deepEqual(entry.spheres, ['mind', 'recovery']);
});
