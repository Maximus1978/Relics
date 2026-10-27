import { sampleHabits, validateDay, type Activity, type Habit, type SphereId } from '../domain/activity.ts';
import { HabitStateError, validateHabitInput } from '../domain/habit.ts';

export type SqlDatabase = {
  execute(query: string, values?: unknown[]): Promise<{ rowsAffected: number }>;
  select<Result>(query: string, values?: unknown[]): Promise<Result>;
};

type HabitRow = { id: string; name: string; spheres_json: string; archived_at: string | null };

type ActivityRow = {
  id: string;
  habit_id: string;
  habit_name_snapshot: string;
  spheres_snapshot_json: string;
  occurred_on: string;
  recorded_at: string;
  timezone: string;
};

export async function openActivityRepository(connection?: SqlDatabase) {
  const database = connection ?? await (await import('@tauri-apps/plugin-sql')).default.load('sqlite:relics.db');
  for (const habit of sampleHabits) {
    await database.execute(
      'INSERT OR IGNORE INTO habits (id, name, spheres_json) VALUES ($1, $2, $3)',
      [habit.id, habit.name, JSON.stringify(habit.spheres)],
    );
  }
  return {
    async listHabits(status: 'active' | 'archived' | 'all' = 'active'): Promise<Habit[]> {
      const filter = status === 'active' ? ' WHERE archived_at IS NULL'
        : status === 'archived' ? ' WHERE archived_at IS NOT NULL' : '';
      const rows = await database.select<HabitRow[]>(
        `SELECT id, name, spheres_json, archived_at FROM habits${filter} ORDER BY rowid`,
      );
      return rows.map(row => ({
        id: row.id, name: row.name, spheres: JSON.parse(row.spheres_json) as SphereId[], archivedAt: row.archived_at,
      }));
    },
    async createHabit(name: string, selectedSpheres: readonly string[]): Promise<Habit> {
      const input = validateHabitInput(name, selectedSpheres);
      const habit: Habit = { id: crypto.randomUUID(), ...input, archivedAt: null };
      await database.execute(
        'INSERT INTO habits (id, name, spheres_json) VALUES ($1, $2, $3)',
        [habit.id, habit.name, JSON.stringify(habit.spheres)],
      );
      return habit;
    },
    async updateHabit(id: string, name: string, selectedSpheres: readonly string[]): Promise<void> {
      const input = validateHabitInput(name, selectedSpheres);
      const result = await database.execute(
        'UPDATE habits SET name = $1, spheres_json = $2 WHERE id = $3',
        [input.name, JSON.stringify(input.spheres), id],
      );
      if (!result.rowsAffected) throw new HabitStateError('Привычка не найдена. Обновите список.');
    },
    async archiveHabit(id: string): Promise<void> {
      const result = await database.execute(
        'UPDATE habits SET archived_at = COALESCE(archived_at, $1) WHERE id = $2',
        [new Date().toISOString(), id],
      );
      if (!result.rowsAffected) throw new HabitStateError('Привычка не найдена. Обновите список.');
    },
    async restoreHabit(id: string): Promise<void> {
      const result = await database.execute('UPDATE habits SET archived_at = NULL WHERE id = $1', [id]);
      if (!result.rowsAffected) throw new HabitStateError('Привычка не найдена. Обновите список.');
    },
    async list(): Promise<Activity[]> {
      const rows = await database.select<ActivityRow[]>(
        'SELECT * FROM activities ORDER BY occurred_on DESC, recorded_at DESC, id DESC',
      );
      return rows.map(row => ({
        id: row.id, habitId: row.habit_id, habitName: row.habit_name_snapshot,
        spheres: JSON.parse(row.spheres_snapshot_json) as SphereId[],
        occurredOn: row.occurred_on, recordedAt: row.recorded_at, timezone: row.timezone,
      }));
    },
    async log(habit: Habit, day: string): Promise<void> {
      validateDay(day);
      const result = await database.execute(
        `INSERT INTO activities
          (id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone)
         SELECT $1, id, name, spheres_json, $2, $3, $4 FROM habits
         WHERE id = $5 AND archived_at IS NULL
         ON CONFLICT(habit_id, occurred_on) DO NOTHING`,
        [crypto.randomUUID(), day, new Date().toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone, habit.id],
      );
      if (!result.rowsAffected) {
        const [state] = await database.select<{ archived_at: string | null; completed: number }[]>(
          `SELECT archived_at, EXISTS(SELECT 1 FROM activities WHERE habit_id = habits.id AND occurred_on = $1) AS completed
           FROM habits WHERE id = $2`, [day, habit.id],
        );
        if (!state) throw new HabitStateError('Привычка не найдена. Обновите список.');
        if (state.archived_at !== null) {
          throw new HabitStateError('Привычка находится в архиве. Восстановите её перед отметкой.');
        }
        if (!state.completed) throw new HabitStateError('Состояние привычки изменилось. Повторите отметку.');
      }
    },
    async remove(id: string): Promise<void> {
      await database.execute('DELETE FROM activities WHERE id = $1', [id]);
    },
  };
}
