import Database from '@tauri-apps/plugin-sql';
import { sampleHabits, validateDay, type Activity, type Habit, type SphereId } from '../domain/activity';

type ActivityRow = {
  id: string;
  habit_id: string;
  habit_name_snapshot: string;
  spheres_snapshot_json: string;
  occurred_on: string;
  recorded_at: string;
  timezone: string;
};

export async function openActivityRepository() {
  const database = await Database.load('sqlite:relics.db');
  for (const habit of sampleHabits) {
    await database.execute(
      'INSERT OR IGNORE INTO habits (id, name, spheres_json) VALUES ($1, $2, $3)',
      [habit.id, habit.name, JSON.stringify(habit.spheres)],
    );
  }
  return {
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
      await database.execute(
        `INSERT INTO activities
          (id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT(habit_id, occurred_on) DO NOTHING`,
        [crypto.randomUUID(), habit.id, habit.name, JSON.stringify(habit.spheres), day,
          new Date().toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone],
      );
    },
    async remove(id: string): Promise<void> {
      await database.execute('DELETE FROM activities WHERE id = $1', [id]);
    },
  };
}
