import type { Activity } from '../domain/activity.ts';
/** Group historical event snapshots, without current habit joins. */
export function chronicleGroups(activities: readonly Activity[]) {
    const groups = new Map<string, Activity[]>();
    const sorted = [...activities].sort((a, b) => b.occurredOn.localeCompare(a.occurredOn) || b.recordedAt.localeCompare(a.recordedAt) || b.id.localeCompare(a.id));
    for (const activity of sorted) {
        const entries = groups.get(activity.occurredOn) ?? [];
        entries.push(activity);
        groups.set(activity.occurredOn, entries);
    }
    return [...groups].map(([day, entries]) => ({ day, entries }));
}
export function chronicleDay(day: string): string {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(day + 'T12:00:00Z')).replace(/\s*г\.$/, '');
}
export function recordCountLabel(count: number): string {
    const forms: Record<string, string> = { one: 'запись', few: 'записи', many: 'записей', other: 'записи' };
    return count + ' ' + forms[new Intl.PluralRules('ru').select(count)];
}
