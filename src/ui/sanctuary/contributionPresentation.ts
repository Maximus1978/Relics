import type { ContributionBucket } from '../../domain/sphereContributions.ts';
import type { SphereId } from '../../domain/activity.ts';
import { addCalendarDays } from '../../domain/sphereContributions.ts';
export type ContributionMode = 'units' | 'shares';
export const chartColors: Record<SphereId, string> = { body: '#ef756d', mind: '#79b4f4', relationships: '#e882a5', work: '#e5b866', recovery: '#80d2a0' };
export const chartDashes = [[], [7, 3], [3, 3], [10, 3, 2, 3], [2, 4]];
export function chartValue(bucket: ContributionBucket, sphere: SphereId, mode: ContributionMode): number | null {
    if (!bucket.hasNumericEvidence)
        return null;
    return mode === 'units' ? bucket.unitsBySphere[sphere] : bucket.shares[sphere]!.numerator / bucket.shares[sphere]!.denominator * 100;
}
export function formatContribution(value: number | null, mode: ContributionMode): string {
    if (value === null)
        return 'Нет числовых данных';
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: mode === 'shares' ? 1 : 0 }).format(value) + (mode === 'shares' ? ' %' : '');
}
export const shortDay = (day: string) => day.slice(8, 10) + '.' + day.slice(5, 7);
export function weekLabel(bucket: ContributionBucket): string { const end = addCalendarDays(bucket.endDayExclusive, -1); return shortDay(bucket.startDay) + (bucket.startDay.slice(0, 4) !== end.slice(0, 4) ? '.' + bucket.startDay.slice(0, 4) : '') + '–' + shortDay(end) + '.' + end.slice(0, 4); }
