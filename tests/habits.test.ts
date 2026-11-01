import { createHabitMutationDriver } from '../.github/scripts/habit-sql-test-driver.mjs';
import { defaultContributions } from '../src/domain/contributions.ts';
import test, { type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { openActivityRepository, type SqlDatabase } from '../src/data/activityRepository.ts';
import { HabitStateError, HabitValidationError, validateHabitInput } from '../src/domain/habit.ts';
import { localDay, sampleHabits } from '../src/domain/activity.ts';

function sqliteAdapter(database: DatabaseSync): SqlDatabase {
  function bindings(query: string, values: unknown[]): Record<string, SQLInputValue> {
    const parameters = [...new Set(query.match(/\$\d+/g) ?? [])];
    assert.equal(parameters.length, values.length);
    return Object.fromEntries(parameters.map((parameter, index) => [parameter, values[index] as SQLInputValue]));
  }
  return {
    mutateHabit:createHabitMutationDriver(database),
    async execute(query, values = []) {
      const statement = database.prepare(query);
      const result = values.length ? statement.run(bindings(query, values)) : statement.run();
      return { rowsAffected: Number(result.changes) };
    },
    async select<Result>(query: string, values: unknown[] = []): Promise<Result> {
      const statement = database.prepare(query);
      return (values.length ? statement.all(bindings(query, values)) : statement.all()) as Result;
    },
  };
}

function fixture(context: TestContext, initialVersion: 1 | 2 = 2) {
  const temporaryRoot = resolve(tmpdir());
  const folder = mkdtempSync(join(temporaryRoot, 'relics-habits-'));
  const path = join(folder, 'habits.db');
  let database = new DatabaseSync(path);
  database.exec('PRAGMA foreign_keys = ON');
  database.exec(readFileSync(new URL('../src-tauri/migrations/001_initial.sql', import.meta.url), 'utf8'));
  database.exec('PRAGMA user_version = 1');
  function migrate() {
    if (Number(database.prepare('PRAGMA user_version').get()?.user_version) >= 2) return;
    database.exec('BEGIN');
    try {
      database.exec(readFileSync(new URL('../src-tauri/migrations/002_archive_habits.sql', import.meta.url), 'utf8'));
      database.exec('PRAGMA user_version = 2');
      database.exec('COMMIT');
    } catch (error) { database.exec('ROLLBACK'); throw error; }
  }
  function seedOnce() {
    if (database.prepare('PRAGMA user_version').get()?.user_version >= 3) return;
    database.exec(readFileSync(new URL('../src-tauri/migrations/003_seed_once.sql', import.meta.url), 'utf8'));
    database.exec('PRAGMA user_version = 3');
  }
  function weightsOnce(){if(Number(database.prepare('PRAGMA user_version').get()?.user_version)>=4)return;database.exec('BEGIN');try{database.exec(readFileSync(new URL('../src-tauri/migrations/004_habit_contributions.sql',import.meta.url),'utf8'));database.exec('PRAGMA user_version=4; COMMIT');}catch(error){database.exec('ROLLBACK');throw error;}}
  function rhythmOnce(){if(Number(database.prepare('PRAGMA user_version').get()?.user_version)>=5)return;database.exec(readFileSync(new URL('../src-tauri/migrations/005_habit_rhythm.sql',import.meta.url),'utf8'));database.exec('PRAGMA user_version=5');}
  if (initialVersion === 2) { migrate(); seedOnce(); weightsOnce(); rhythmOnce(); }
  context.after(() => {
    database.close();
    if (dirname(folder) !== temporaryRoot) throw new Error('Unexpected test cleanup directory.');
    rmSync(folder, { recursive: true, force: true });
  });
  return {
    get database() { return database; },
    migrate,
    open() { seedOnce(); weightsOnce(); rhythmOnce(); return openActivityRepository(sqliteAdapter(database)); },
    reopen() {
      database.close();
      database = new DatabaseSync(path);
      database.exec('PRAGMA foreign_keys = ON');
      migrate();
      seedOnce(); weightsOnce(); rhythmOnce();
      return openActivityRepository(sqliteAdapter(database));
    },
  };
}

test('creates a habit with one sphere using the production repository', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('Зарядка', ['body'], undefined, 'daily');
  assert.ok(habit.id);
  assert.deepEqual(habit.spheres, ['body']);
  assert.deepEqual((await repository.listHabits()).find(entry => entry.id === habit.id), habit);
});

test('creates Гитара with Mind and Recovery, trimming the name', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('  Гитара  ', ['mind', 'recovery'], undefined, 'daily');
  assert.equal(habit.name, 'Гитара');
  assert.deepEqual(habit.spheres, ['mind', 'recovery']);
  assert.deepEqual((await repository.listHabits()).at(-1), habit);
});

test('rejects empty and whitespace-only names without inserting rows', async context => {
  const database = fixture(context);
  const repository = await database.open();
  for (const name of ['', '   ', '\t\n']) {
    await assert.rejects(repository.createHabit(name, ['mind'], undefined, 'daily'),
      error => error instanceof HabitValidationError && error.field === 'name');
  }
  assert.equal((await repository.listHabits()).length, sampleHabits.length);
});

test('rejects empty sphere selection without inserting a habit', async context => {
  const database = fixture(context);
  const repository = await database.open();
  await assert.rejects(repository.createHabit('Гитара', [], undefined, 'daily'),
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
  const habit = await repository.createHabit('Гитара', ['mind', 'recovery'], undefined, 'daily');
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
  await repository.createHabit('Гитара', ['mind', 'recovery'], undefined, 'daily');
  repository = await database.reopen();
  assert.deepEqual(await repository.list(), before);
  assert.equal((await repository.listHabits()).length, 4);
});

test('repeated startup neither duplicates samples nor overwrites existing definitions or custom habits', async context => {
  const database = fixture(context);
  let repository = await database.open();
  const custom = await repository.createHabit('Прогулка', ['mind'], undefined, 'daily');
  database.database.prepare('UPDATE habits SET name = ?, spheres_json = ?, contribution_profile_json = ? WHERE id = ?')
    .run('Сохранённое название', '["recovery"]', JSON.stringify(defaultContributions(['recovery'])), 'walk');
  for (let restart = 0; restart < 3; restart++) repository = await database.reopen();
  const habits = await repository.listHabits();
  assert.equal(habits.length, 4);
  for (const sample of sampleHabits) assert.equal(habits.filter(habit => habit.id === sample.id).length, 1);
  assert.deepEqual(habits.find(habit => habit.id === custom.id), custom);
  assert.deepEqual(habits.find(habit => habit.id === 'walk'), {
    id: 'walk', name: 'Сохранённое название', spheres: ['recovery'], archivedAt: null, contributionProfile:defaultContributions(['recovery']),frequencySegments:[],archivePauses:[],
  });
});

test('logging keeps the saved name and sphere snapshot after later database definition changes', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('Гитара', ['mind', 'recovery'], undefined, 'daily');
  await repository.log(habit, '2000-01-01');
  database.database.prepare('UPDATE habits SET name = ?, spheres_json = ?, contribution_profile_json = ? WHERE id = ?')
    .run('Другое название', '["body"]', JSON.stringify(defaultContributions(['body'])), habit.id);
  const [entry] = await repository.list();
  assert.equal(entry.habitName, 'Гитара');
  assert.deepEqual(entry.spheres, ['mind', 'recovery']);
});

test('renaming Guitar to Гитара persists after reopening without changing its ID or spheres', async context => {
  const database = fixture(context);
  let repository = await database.open();
  const habit = await repository.createHabit('Guitar', ['mind', 'recovery'], undefined, 'daily');
  await repository.updateHabit(habit.id, '  Гитара  ', habit.spheres);
  repository = await database.reopen();
  assert.deepEqual((await repository.listHabits()).find(saved => saved.id === habit.id), { ...habit, name: 'Гитара' });
});

test('sphere edits persist after reopening', async context => {
  const database = fixture(context);
  let repository = await database.open();
  const habit = await repository.createHabit('Гитара', ['mind'], undefined, 'daily');
  await repository.updateHabit(habit.id, habit.name, ['recovery', 'mind']);
  repository = await database.reopen();
  assert.deepEqual((await repository.listHabits()).find(saved => saved.id === habit.id)?.spheres, ['mind', 'recovery']);
});

test('editing preserves old snapshots and future logging reads the database rather than a stale definition', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('Guitar', ['mind'], undefined, 'daily');
  await repository.log(habit, '2000-01-01');
  const [original] = await repository.list();
  await repository.updateHabit(habit.id, 'Гитара', ['mind', 'recovery']);
  await repository.log(habit, '2000-01-02');
  const entries = await repository.list();
  assert.deepEqual(entries.find(entry => entry.id === original.id), original);
  assert.equal(entries[0].habitName, 'Гитара');
  assert.deepEqual(entries[0].spheres, ['mind', 'recovery']);
});

test('archiving hides active habits, retains them in management and preserves every activity', async context => {
  const database = fixture(context);
  let repository = await database.open();
  const habit = await repository.createHabit('Гитара', ['mind', 'recovery'], undefined, 'daily');
  await repository.log(habit, '2000-01-01');
  const history = await repository.list();
  await repository.archiveHabit(habit.id);
  const [archived] = await repository.listHabits('archived');
  assert.ok(archived.archivedAt);
  await repository.archiveHabit(habit.id);
  repository = await database.reopen();
  assert.ok(!(await repository.listHabits()).some(saved => saved.id === habit.id));
  assert.deepEqual(await repository.listHabits('archived'), [archived]);
  assert.deepEqual(await repository.list(), history);
  assert.equal((await repository.listHabits('all')).length, 4);
});

test('archived habits reject backdated and duplicate logging through stale objects', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = (await repository.listHabits())[0];
  await repository.log(habit, '2000-01-01');
  const history = await repository.list();
  await repository.archiveHabit(habit.id);
  for (const day of ['2000-01-01', '2000-01-02']) {
    await assert.rejects(repository.log(habit, day), HabitStateError);
  }
  assert.deepEqual(await repository.list(), history);
});

test('restoration retains the last edited definition and re-enables logging after reopening', async context => {
  const database = fixture(context);
  let repository = await database.open();
  const habit = await repository.createHabit('Guitar', ['mind'], undefined, 'daily');
  await repository.archiveHabit(habit.id);
  await repository.updateHabit(habit.id, 'Гитара', ['mind', 'recovery']);
  assert.equal((await repository.listHabits('archived'))[0].name, 'Гитара');
  await repository.restoreHabit(habit.id);
  await repository.restoreHabit(habit.id);
  repository = await database.reopen();
  assert.deepEqual((await repository.listHabits()).find(saved => saved.id === habit.id), {
    ...habit, name: 'Гитара', spheres: ['mind', 'recovery'], contributionProfile:defaultContributions(['mind','recovery']),
  });
  assert.deepEqual(await repository.listHabits('archived'), []);
  await repository.log(habit, '2000-01-01');
  assert.equal((await repository.list())[0].habitName, 'Гитара');
});

test('all original samples can stay archived across repeated startup without duplicate seeds', async context => {
  const database = fixture(context);
  let repository = await database.open();
  for (const habit of sampleHabits) await repository.archiveHabit(habit.id);
  const archived = await repository.listHabits('archived');
  for (let restart = 0; restart < 3; restart++) repository = await database.reopen();
  assert.deepEqual(await repository.listHabits(), []);
  assert.deepEqual(await repository.listHabits('all'), archived);
  assert.equal(archived.length, 3);
});

test('October 26–27 records survive edits, archive, restore and offline reopen unchanged', async context => {
  const database = fixture(context);
  let repository = await database.open();
  for (const day of ['2026-10-26', '2026-10-27']) {
    database.database.prepare(`INSERT INTO activities
      (id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(`legacy-${day}`, 'read', 'Чтение', '["mind"]', day, `${day}T18:00:00Z`, 'America/Los_Angeles');
  }
  const history = await repository.list();
  await repository.updateHabit('read', 'Книги', ['mind', 'recovery']);
  await repository.archiveHabit('read');
  repository = await database.reopen();
  assert.deepEqual(await repository.list(), history);
  await repository.restoreHabit('read');
  repository = await database.reopen();
  assert.deepEqual(await repository.list(), history);
});

test('invalid edits and unknown IDs cannot change saved definitions or history', async context => {
  const database = fixture(context);
  const repository = await database.open();
  const habit = await repository.createHabit('Гитара', ['mind', 'recovery'], undefined, 'daily');
  await repository.log(habit, '2000-01-01');
  const before = await repository.listHabits('all');
  const history = await repository.list();
  for (const [name, selected] of [['   ', ['mind']], ['Гитара', []], ['Гитара', ['custom']]] as const) {
    await assert.rejects(repository.updateHabit(habit.id, name, selected), HabitValidationError);
  }
  await assert.rejects(repository.updateHabit('missing', 'Test', ['mind']), HabitStateError);
  await assert.rejects(repository.archiveHabit('missing'), HabitStateError);
  await assert.rejects(repository.restoreHabit('missing'), HabitStateError);
  await assert.rejects(repository.log({ ...habit, id: 'missing' }, '2000-01-02'), HabitStateError);
  assert.deepEqual(await repository.listHabits('all'), before);
  assert.deepEqual(await repository.list(), history);
});

test('migration 2 upgrades a populated v1 database and remains safe across restarts', async context => {
  const database = fixture(context, 1);
  database.database.prepare('INSERT INTO habits (id, name, spheres_json) VALUES (?, ?, ?)')
    .run('legacy-guitar', 'Guitar', '["mind","recovery"]');
  for (const day of ['2026-10-26', '2026-10-27']) {
    database.database.prepare('INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(`legacy-${day}`, 'legacy-guitar', 'Guitar', '["mind","recovery"]', day, `${day}T18:00:00Z`, 'America/Los_Angeles');
  }
  const habitsBefore = database.database.prepare('SELECT * FROM habits').all();
  const historyBefore = database.database.prepare('SELECT id,habit_id,habit_name_snapshot,spheres_snapshot_json,occurred_on,recorded_at,timezone FROM activities ORDER BY id').all();
  database.migrate();
  assert.deepEqual(database.database.prepare('SELECT id, name, spheres_json FROM habits').all(), habitsBefore);
  assert.equal(database.database.prepare('SELECT archived_at FROM habits').get()?.archived_at, null);
  let repository = await database.open();
  await repository.archiveHabit('read');
  for (let restart = 0; restart < 3; restart++) repository = await database.reopen();
  assert.deepEqual(database.database.prepare('SELECT id,habit_id,habit_name_snapshot,spheres_snapshot_json,occurred_on,recorded_at,timezone FROM activities ORDER BY id').all(), historyBefore);
  assert.equal((await repository.listHabits('all')).length, 4);
  assert.equal((await repository.listHabits('archived'))[0].id, 'read');
  assert.equal(database.database.prepare('PRAGMA table_info(habits)').all().filter(column => column.name === 'archived_at').length, 1);
  assert.deepEqual(database.database.prepare('PRAGMA integrity_check').get()?.integrity_check, 'ok');
});

test('atomic logging guard blocks an archive immediately before insertion', async context => {
  const database = fixture(context);
  const connection = sqliteAdapter(database.database);
  const repository = await openActivityRepository({
    select: connection.select,
    async execute(query, values) {
      if (query.startsWith('INSERT INTO activities')) {
        await connection.execute('UPDATE habits SET archived_at = $1 WHERE id = $2', ['2000-01-01T00:00:00Z', 'read']);
      }
      return connection.execute(query, values);
    },
  });
  const habit = (await repository.listHabits()).find(saved => saved.id === 'read')!;
  await assert.rejects(repository.log(habit, '2000-01-01'), HabitStateError);
  assert.deepEqual(await repository.list(), []);
});
