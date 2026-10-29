import { spheres, validateDay, type Activity, type SphereId } from './activity.ts';
import { contributionSphereIds, validateContributionProfile, type ContributionValues } from './contributions.ts';
export class ProjectionIntegrityError extends Error {
}
export const emptySphereValues = (): ContributionValues => ({ body: 0, mind: 0, relationships: 0, work: 0, recovery: 0 });
export function calendarDay(day: string): void { validateDay(day, day); }
export function addCalendarDays(day: string, count: number): string {
    calendarDay(day);
    if (!Number.isInteger(count))
        throw new ProjectionIntegrityError('Invalid calendar offset');
    const date = new Date(day + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate() + count);
    const result = date.toISOString().slice(0, 10);
    calendarDay(result);
    return result;
}
export function startOfWeek(day: string, weekStartsOn: number): string {
    calendarDay(day);
    if (!Number.isInteger(weekStartsOn) || weekStartsOn < 1 || weekStartsOn > 7)
        throw new ProjectionIntegrityError('Invalid week start');
    const weekday = new Date(day + 'T12:00:00Z').getUTCDay() || 7;
    return addCalendarDays(day, -((weekday - weekStartsOn + 7) % 7));
}
export function completeWeekWindow(asOfDay: string, trendWeeks: number, weekStartsOn = 1) {
    if (!Number.isInteger(trendWeeks) || trendWeeks < 4 || trendWeeks > 8)
        throw new ProjectionIntegrityError('Expected 4–8 complete weeks');
    const endDayExclusive = startOfWeek(asOfDay, weekStartsOn);
    return { startDay: addCalendarDays(endDayExclusive, -7 * trendWeeks), endDayExclusive };
}
export type ContributionBucket = {
    startDay: string;
    endDayExclusive: string;
    unitsBySphere: ContributionValues;
    totalUnits: number;
    recordedEventCount: number;
    includedEventCount: number;
    userOriginCount: number;
    defaultOriginCount: number;
    excludedLegacyCount: number;
    numericSelectedEventCount: ContributionValues;
    legacySelectedEventCount: ContributionValues;
    hasNumericEvidence: boolean;
    shares: Record<SphereId, {
        numerator: number;
        denominator: number;
    } | null>;
};
export type ProjectionOptions = {
    startDay: string;
    endDayExclusive: string;
    asOfDay: string;
    weekStartsOn: number;
    trendWeeks: number;
};
export type ContributionProjection = ReturnType<typeof projectSphereContributions>;
function aggregate(entries: readonly Activity[], startDay: string, endDayExclusive: string): ContributionBucket {
    const unitsBySphere = emptySphereValues(), numericSelectedEventCount = emptySphereValues(), legacySelectedEventCount = emptySphereValues();
    let includedEventCount = 0, userOriginCount = 0, defaultOriginCount = 0, excludedLegacyCount = 0;
    for (const entry of entries) {
        const profile = entry.contributionSnapshot;
        if (profile === null) {
            excludedLegacyCount++;
            for (const sphere of entry.spheres)
                legacySelectedEventCount[sphere]++;
            continue;
        }
        includedEventCount++;
        if (profile.origin === 'user')
            userOriginCount++;
        else
            defaultOriginCount++;
        for (const sphere of contributionSphereIds) {
            unitsBySphere[sphere] += profile.values[sphere];
            if (profile.values[sphere] > 0)
                numericSelectedEventCount[sphere]++;
        }
    }
    const totalUnits = Object.values(unitsBySphere).reduce((a, b) => a + b, 0);
    if (!Number.isSafeInteger(totalUnits))
        throw new ProjectionIntegrityError('Contribution total exceeds safe integer precision');
    return { startDay, endDayExclusive, unitsBySphere, totalUnits, recordedEventCount: entries.length, includedEventCount, userOriginCount, defaultOriginCount, excludedLegacyCount, numericSelectedEventCount, legacySelectedEventCount, hasNumericEvidence: totalUnits > 0,
        shares: Object.fromEntries(contributionSphereIds.map(s => [s, totalUnits > 0 ? { numerator: unitsBySphere[s], denominator: totalUnits } : null])) as ContributionBucket['shares'] };
}
/** Explicit Gregorian date inputs; no clock, DB, habit definitions or elapsed-hour arithmetic. */
export function projectSphereContributions(events: readonly Activity[], options: ProjectionOptions) {
    const { startDay, endDayExclusive, asOfDay, trendWeeks, weekStartsOn } = options;
    calendarDay(startDay);
    calendarDay(endDayExclusive);
    calendarDay(asOfDay);
    if (startDay >= endDayExclusive)
        throw new ProjectionIntegrityError('Invalid half-open period');
    const trend = completeWeekWindow(asOfDay, trendWeeks, weekStartsOn);
    const ids = new Map<string, string>(), completions = new Map<string, string>();
    const unique: Activity[] = [];
    for (const entry of events) {
        if (typeof entry.id !== 'string' || !entry.id || typeof entry.habitId !== 'string' || !entry.habitId || typeof entry.habitName !== 'string' || typeof entry.recordedAt !== 'string' || typeof entry.timezone !== 'string')
            throw new ProjectionIntegrityError('Invalid event identity');
        calendarDay(entry.occurredOn);
        if (!Array.isArray(entry.spheres) || !entry.spheres.length || new Set(entry.spheres).size !== entry.spheres.length || entry.spheres.some(s => !Object.hasOwn(spheres, s)))
            throw new ProjectionIntegrityError('Invalid sphere snapshot');
        if (entry.contributionSnapshot !== null)
            validateContributionProfile(entry.contributionSnapshot, entry.spheres);
        const signature = JSON.stringify([entry.habitId, entry.habitName, entry.spheres, entry.occurredOn, entry.recordedAt, entry.timezone,
            entry.contributionSnapshot === null ? null : validateContributionProfile(entry.contributionSnapshot, entry.spheres)]);
        const prior = ids.get(entry.id);
        if (prior !== undefined) {
            if (prior !== signature)
                throw new ProjectionIntegrityError('Conflicting event ID');
            continue;
        }
        const completionKey = JSON.stringify([entry.habitId, entry.occurredOn]);
        if (completions.has(completionKey))
            throw new ProjectionIntegrityError('Duplicate habit/day');
        ids.set(entry.id, signature);
        completions.set(completionKey, entry.id);
        unique.push(entry);
    }
    unique.sort((a, b) => a.occurredOn.localeCompare(b.occurredOn) || a.id.localeCompare(b.id));
    const byDay = new Map<string, Activity[]>();
    for (const entry of unique) {
        const list = byDay.get(entry.occurredOn) ?? [];
        list.push(entry);
        byDay.set(entry.occurredOn, list);
    }
    const daily: ContributionBucket[] = [];
    for (let day = startDay; day < endDayExclusive; day = addCalendarDays(day, 1))
        daily.push(aggregate(byDay.get(day) ?? [], day, addCalendarDays(day, 1)));
    const weeks: ContributionBucket[] = [];
    for (let day = trend.startDay; day < trend.endDayExclusive; day = addCalendarDays(day, 7)) {
        const end = addCalendarDays(day, 7), weekEntries: Activity[] = [];
        for (let d = day; d < end; d = addCalendarDays(d, 1))
            weekEntries.push(...(byDay.get(d) ?? []));
        weeks.push(aggregate(weekEntries, day, end));
    }
    return { asOfDay, weekStartsOn, trendWindow: trend, period: aggregate(unique.filter(e => e.occurredOn >= startDay && e.occurredOn < endDayExclusive), startDay, endDayExclusive), daily, weeks };
}
