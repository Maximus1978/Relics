import { validateFrequency, type Frequency, type FrequencySegment, type ArchivePause, type RhythmChange } from '../domain/habitRhythm.ts';
import { defaultContributions, parseContributionProfile, validateContributionProfile, type ContributionProfile } from '../domain/contributions.ts';
import { validateDay, type Activity, type Habit, type SphereId } from '../domain/activity.ts';
import { HabitStateError, validateHabitInput } from '../domain/habit.ts';
export type MutationReceipt={frequencySegments:FrequencySegment[];archivePauses:ArchivePause[]};
export type HabitMutation = {kind:'create'|'update';id:string;name:string;spheres:readonly SphereId[];contributionProfile:ContributionProfile;rhythmChange:RhythmChange}|{kind:'archive'|'restore';id:string};
export type SqlDatabase = {
    mutateHabit?: (input:HabitMutation)=>Promise<MutationReceipt>;
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
    const mutate = async(input:HabitMutation) => {
        try {if(connection){if(!connection.mutateHabit)throw new Error('Pinned mutation adapter is required');return await connection.mutateHabit(input);}else return await (await import('@tauri-apps/api/core')).invoke<MutationReceipt>('mutate_habit',{input});}
        catch(error){if(error instanceof HabitStateError)throw error;throw new HabitStateError(typeof error==='string'?error:error instanceof Error?error.message:'Не удалось сохранить привычку и историю ритма.');}
    };
    const tables=await database.select<{name:string}[]>("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('habit_frequency_segments','habit_archive_pauses')");
    if(tables.length!==2)throw new HabitStateError('Версия базы не поддерживается. Обновите Relics.');
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
        if (schema?.version !== 5)
            throw new HabitStateError('Версия базы не поддерживается. Обновите Relics.');
    }
    return {
        async listHabits(status: 'active' | 'archived' | 'all' = 'active'): Promise<Habit[]> {
            const filter = status === 'active' ? ' WHERE archived_at IS NULL'
                : status === 'archived' ? ' WHERE archived_at IS NOT NULL' : '';
            const rows = await database.select<HabitRow[]>(`SELECT id, name, spheres_json, archived_at, contribution_profile_json FROM habits${filter} ORDER BY rowid`);
            const segmentRows=await database.select<{id:string;habit_id:string;frequency:Frequency;effective_on:string;created_on:string;version:1}[]>('SELECT * FROM habit_frequency_segments ORDER BY habit_id,effective_on,id');
            const pauseRows=await database.select<{id:string;habit_id:string;start_on:string|null;end_exclusive_on:string|null;reason:'archive';provenance:'recorded'|'legacy_unknown'}[]>('SELECT * FROM habit_archive_pauses ORDER BY habit_id,start_on,id');
            return rows.map(row => ({
                id: row.id, name: row.name, spheres: JSON.parse(row.spheres_json) as SphereId[], archivedAt: row.archived_at,
                contributionProfile: parseContributionProfile(row.contribution_profile_json, JSON.parse(row.spheres_json)),
                frequencySegments:segmentRows.filter(s=>s.habit_id===row.id).map(s=>({id:s.id,habitId:s.habit_id,frequency:s.frequency,effectiveOn:s.effective_on,createdOn:s.created_on,version:s.version})),
                archivePauses:pauseRows.filter(p=>p.habit_id===row.id).map(p=>({id:p.id,habitId:p.habit_id,startOn:p.start_on,endExclusiveOn:p.end_exclusive_on,reason:p.reason,provenance:p.provenance})),
            }));
        },
        async createHabit(name: string, selectedSpheres: readonly string[], profile?: ContributionProfile, frequency?: Frequency): Promise<Habit> {
            const input = validateHabitInput(name, selectedSpheres);
            const contributionProfile = validateContributionProfile(profile ?? defaultContributions(input.spheres), input.spheres);
            const habit: Habit = { id: crypto.randomUUID(), ...input, archivedAt: null, contributionProfile };
            const chosen=validateFrequency(frequency);
            const history=await mutate({kind:'create',id:habit.id,name:habit.name,spheres:habit.spheres,contributionProfile,rhythmChange:{kind:'set',frequency:chosen}});
            return {...habit,...history};
        },
        async updateHabit(id: string, name: string, selectedSpheres: readonly string[], profile?: ContributionProfile, rhythmChange:RhythmChange={kind:'keep'}): Promise<void> {
            const input = validateHabitInput(name, selectedSpheres);
            const contributionProfile = validateContributionProfile(profile ?? defaultContributions(input.spheres), input.spheres);
            if(rhythmChange.kind==='set')validateFrequency(rhythmChange.frequency);
            await mutate({kind:'update',id,name:input.name,spheres:input.spheres,contributionProfile,rhythmChange});
        },
        async archiveHabit(id: string): Promise<void> { await mutate({kind:'archive',id}); },
        async restoreHabit(id: string): Promise<void> { await mutate({kind:'restore',id}); },
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
