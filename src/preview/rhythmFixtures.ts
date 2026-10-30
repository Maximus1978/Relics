// Explicitly opt-in browser-only synthetic repository snapshots for render verification.
// Never loaded by the native repository and never persisted.
import type { Activity, Habit } from '../domain/activity';
import { addCalendarDays, completeWeekWindow } from '../domain/sphereContributions.ts';
import { defaultContributions } from '../domain/contributions.ts';
export function rhythmFixtures(kind: string, today: string, habits: Habit[]): Activity[] | null {
    if (kind === 'empty')
        return [];
    if (kind !== 'mixed' && kind !== 'legacy')
        return null;
    const { startDay } = completeWeekWindow(today, 8, 1);
    const result: Activity[] = [];
    for (let w = 0; w < 8; w++)
        for (let h = 0; h < habits.length; h++) {
            const habit = habits[h], day = addCalendarDays(startDay, w * 7 + h % 5);
            const profile = defaultContributions(habit.spheres, h < 3 ? 'legacy-default' : 'user');
            if (profile.origin === 'user')
                for (const s of habit.spheres)
                    profile.values[s] = 1 + ((w * 3 + h * 2 + habit.spheres.indexOf(s) * 2) % 10);
            result.push({ id: 'rhythm-demo-' + w + '-' + h, habitId: habit.id, habitName: habit.name, spheres: [...habit.spheres], occurredOn: day, recordedAt: today + 'T12:00:00Z', timezone: 'Synthetic browser fixture', contributionSnapshot: kind === 'legacy' || (h === 2 && w % 2 === 0) ? null : profile });
        }
    return result;
}
