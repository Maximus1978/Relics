import { defaultContributions, parseContributionProfile, validateContributionProfile, type ContributionProfile } from '../domain/contributions.ts';
import { validateDay, type Activity, type Habit, type SphereId } from '../domain/activity.ts';
import { HabitStateError, validateHabitInput } from '../domain/habit.ts';
export type SqlDatabase = {
    execute(query: string, values?: unknown[]): Promise<{
        rowsAffected: number;
    }>;
    select<Result>(query: string, values?: unknown[]): Promise<Result>;
};
type HabitRow = {
    id: string;
    name: string;
    spheres_json: string;
    archived_at: string | null;
    contribution_profile_json: string;
};
type ActivityRow = {
    id: string;
    habit_id: string;
    habit_name_snapshot: string;
    spheres_snapshot_json: string;
    occurred_on: string;
    recorded_at: string;
    timezone: string;
    contribution_snapshot_json: string | null;
};
export async function openActivityRepository(connection?: SqlDatabase) {
    const database = connection ?? await (await import('@tauri-apps/plugin-sql')).default.load('sqlite:relics.db');
    const columns = await database.select<{
        name: string;
    }[]>('PRAGMA table_info(habits)');
    if (!columns.some(column => column.name === 'contribution_profile_json'))
        throw new HabitStateError('Версия базы не поддерживается. Закройте старые окна и обновите Relics.');
    const ledger = await database.select<{
        name: string;
    }[]>("SELECT name FROM sqlite_master WHERE name='_sqlx_migrations'");
    if (ledger.length) {
        const [schema] = await database.select<{
            version: number;
        }[]>("SELECT MAX(version) AS version FROM _sqlx_migrations WHERE success=1");
        if (schema?.version !== 4)
            throw new HabitStateError('Версия базы не поддерживается. Обновите Relics.');
    }
    return {
        async listHabits(status: 'active' | 'archived' | 'all' = 'active'): Promise<Habit[]> {
            const filter = status === 'active' ? ' WHERE archived_at IS NULL'
                : status === 'archived' ? ' WHERE archived_at IS NOT NULL' : '';
            const rows = await database.select<HabitRow[]>(`SELECT id, name, spheres_json, archived_at, contribution_profile_json FROM habits${filter} ORDER BY rowid`);
            return rows.map(row => ({
                id: row.id, name: row.name, spheres: JSON.parse(row.spheres_json) as SphereId[], archivedAt: row.archived_at,
                contributionProfile: parseContributionProfile(row.contribution_profile_json, JSON.parse(row.spheres_json)),
            }));
        },
        async createHabit(name: string, selectedSpheres: readonly string[], profile?: ContributionProfile): Promise<Habit> {
            const input = validateHabitInput(name, selectedSpheres);
            const contributionProfile = validateContributionProfile(profile ?? defaultContributions(input.spheres), input.spheres);
            const habit: Habit = { id: crypto.randomUUID(), ...input, archivedAt: null, contributionProfile };
            await database.execute('INSERT INTO habits (id, name, spheres_json, contribution_profile_json) VALUES ($1, $2, $3, $4)', [habit.id, habit.name, JSON.stringify(habit.spheres), JSON.stringify(contributionProfile)]);
            return habit;
        },
        async updateHabit(id: string, name: string, selectedSpheres: readonly string[], profile?: ContributionProfile): Promise<void> {
            const input = validateHabitInput(name, selectedSpheres);
            const contributionProfile = validateContributionProfile(profile ?? defaultContributions(input.spheres), input.spheres);
            const result = await database.execute('UPDATE habits SET name = $1, spheres_json = $2, contribution_profile_json = $3 WHERE id = $4', [input.name, JSON.stringify(input.spheres), JSON.stringify(contributionProfile), id]);
            if (!result.rowsAffected)
                throw new HabitStateError('Привычка не найдена. Обновите список.');
        },
        async archiveHabit(id: string): Promise<void> {
            const result = await database.execute('UPDATE habits SET archived_at = COALESCE(archived_at, $1) WHERE id = $2', [new Date().toISOString(), id]);
            if (!result.rowsAffected)
                throw new HabitStateError('Привычка не найдена. Обновите список.');
        },
        async restoreHabit(id: string): Promise<void> {
            const result = await database.execute('UPDATE habits SET archived_at = NULL WHERE id = $1', [id]);
            if (!result.rowsAffected)
                throw new HabitStateError('Привычка не найдена. Обновите список.');
        },
        async list(): Promise<Activity[]> {
            const rows = await database.select<ActivityRow[]>('SELECT * FROM activities ORDER BY occurred_on DESC, recorded_at DESC, id DESC');
            return rows.map(row => ({
                id: row.id, habitId: row.habit_id, habitName: row.habit_name_snapshot,
                spheres: JSON.parse(row.spheres_snapshot_json) as SphereId[],
                occurredOn: row.occurred_on, recordedAt: row.recorded_at, timezone: row.timezone,
                contributionSnapshot: row.contribution_snapshot_json === null ? null : parseContributionProfile(row.contribution_snapshot_json, JSON.parse(row.spheres_snapshot_json)),
            }));
        },
        async log(habit: Habit, day: string): Promise<void> {
            validateDay(day);
            const result = await database.execute(`INSERT INTO activities
          (id, habit_id, habit_name_snapshot, spheres_snapshot_json, occurred_on, recorded_at, timezone, contribution_snapshot_json)
         SELECT $1, id, name, spheres_json, $2, $3, $4, contribution_profile_json FROM habits
         WHERE id = $5 AND archived_at IS NULL AND contribution_profile_json IS NOT NULL
         ON CONFLICT(habit_id, occurred_on) DO NOTHING`, [crypto.randomUUID(), day, new Date().toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone, habit.id]);
            if (!result.rowsAffected) {
                const [state] = await database.select<{
                    archived_at: string | null;
                    completed: number;
                }[]>(`SELECT archived_at, EXISTS(SELECT 1 FROM activities WHERE habit_id = habits.id AND occurred_on = $1) AS completed
           FROM habits WHERE id = $2`, [day, habit.id]);
                if (!state)
                    throw new HabitStateError('Привычка не найдена. Обновите список.');
                if (state.archived_at !== null) {
                    throw new HabitStateError('Привычка находится в архиве. Восстановите её перед отметкой.');
                }
                if (!state.completed)
                    throw new HabitStateError('Состояние привычки изменилось. Повторите отметку.');
            }
        },
        async remove(id: string): Promise<void> {
            await database.execute('DELETE FROM activities WHERE id = $1', [id]);
        },
    };
}
