import test from 'node:test';
import assert from 'node:assert/strict';
import { projectSphereContributions, completeWeekWindow, addCalendarDays, startOfWeek } from '../src/domain/sphereContributions.ts';
import { defaultContributions } from '../src/domain/contributions.ts';
import { medallionIllumination } from '../src/domain/medallionIllumination.ts';
import { type Activity, type SphereId } from '../src/domain/activity.ts';
import { chartValue, formatContribution, weekLabel } from '../src/ui/sanctuary/contributionPresentation.ts';
const bounds = { startDay: '2026-09-28', endDayExclusive: '2026-10-26', asOfDay: '2026-10-28', weekStartsOn: 1, trendWeeks: 4 };
function event(id: string, day = '2026-10-20', values: Partial<Record<SphereId, number>> = { mind: 7, recovery: 3 }, origin: 'user' | 'legacy-default' = 'user'): Activity {
    const selected = Object.keys(values) as SphereId[];
    const profile = defaultContributions(selected, origin);
    Object.assign(profile.values, values);
    return { id, habitId: id, habitName: id, spheres: selected, occurredOn: day, recordedAt: '2026-10-28T12:00:00Z', timezone: 'America/Los_Angeles', contributionSnapshot: profile };
}
const project = (entries: Activity[], opts = {}) => projectSphereContributions(entries, { ...bounds, ...opts });
test('T01 exact additive same-day oracle and independent shares', () => {
    const p = project([event('guitar'), event('practice', '2026-10-20', { body: 8, mind: 2 })]);
    assert.deepEqual(p.period.unitsBySphere, { body: 8, mind: 9, relationships: 0, work: 0, recovery: 3 });
    assert.equal(p.period.totalUnits, 20);
    assert.deepEqual(Object.values(p.period.shares).map(v => v!.numerator / v!.denominator * 100), [40, 45, 0, 0, 15]);
    assert.equal(p.daily.find(d => d.startDay === '2026-10-20')!.numericSelectedEventCount.mind, 2);
    assert.equal(p.weeks[3].totalUnits, 20);
    assert.equal(chartValue(p.weeks[3], 'mind', 'shares'), 45);
});
test('T01 all-five maximum adds numeric 350 but rune remains binary 35', () => {
    const entries = Array.from({ length: 7 }, (_, i) => event('all' + i, addCalendarDays('2026-10-19', i), { body: 10, mind: 10, relationships: 10, work: 10, recovery: 10 }));
    assert.equal(project(entries).period.totalUnits, 350);
    const before = medallionIllumination(entries, '2026-10-25', '2026-10-25');
    const after = medallionIllumination(entries.map(e => ({ ...e, contributionSnapshot: defaultContributions(e.spheres, 'legacy-default') })), '2026-10-25', '2026-10-25');
    assert.deepEqual(before, after);
});
test('T02 mixed user/default/unknown counted without fabricating legacy values', () => {
    const old = { ...event('old'), contributionSnapshot: null };
    const p = project([event('u'), event('d', '2026-10-21', { mind: 5 }, 'legacy-default'), old]).period;
    assert.equal(p.recordedEventCount, 3);
    assert.equal(p.includedEventCount, 2);
    assert.equal(p.userOriginCount, 1);
    assert.equal(p.defaultOriginCount, 1);
    assert.equal(p.excludedLegacyCount, 1);
    assert.equal(p.unitsBySphere.mind, 12);
    assert.equal(p.legacySelectedEventCount.mind, 1);
    assert.equal(p.legacySelectedEventCount.recovery, 1);
    assert.equal(p.numericSelectedEventCount.mind, 2);
});
test('T02 unknown-only, empty weeks and known zero retain distinct evidence', () => {
    const p = project([{ ...event('old'), contributionSnapshot: null }]);
    assert.equal(p.period.recordedEventCount, 1);
    assert.equal(p.period.totalUnits, 0);
    assert.equal(p.period.hasNumericEvidence, false);
    assert.deepEqual(Object.values(p.period.shares), [null, null, null, null, null]);
    assert.equal(chartValue(p.period, 'body', 'units'), null);
    const known = project([event('known')]).period;
    assert.deepEqual(known.shares.body, { numerator: 0, denominator: 10 });
    assert.equal(chartValue(known, 'body', 'units'), 0);
    const empty = project([]);
    assert.equal(empty.weeks.length, 4);
    assert.equal(empty.daily.length, 28);
    assert.ok(empty.weeks.every(w => !w.hasNumericEvidence));
    assert.equal(formatContribution(null, 'shares'), 'Нет числовых данных');
});
test('T03 deterministic reordered input, canonical map keys, identical repeated IDs once', () => {
    const entries = [event('a'), event('b', '2026-10-01', { work: 3 }), event('c', '2026-10-05', { body: 4 })];
    const copy = structuredClone(entries[0]);
    copy.contributionSnapshot!.values = Object.fromEntries(Object.entries(copy.contributionSnapshot!.values).reverse()) as typeof copy.contributionSnapshot.values;
    assert.deepEqual(project([...entries, copy]), project([...entries].reverse()));
    const saved = JSON.stringify(entries);
    project(entries);
    assert.equal(JSON.stringify(entries), saved);
});
test('T03 conflicting IDs and duplicate habit/day rejected in either order', () => {
    const a = event('a'), conflict = { ...event('a'), habitName: 'different' };
    for (const entries of [[a, conflict], [conflict, a], [a, { ...event('b'), habitId: 'a' }]])
        assert.throws(() => project(entries), /Conflicting|Duplicate/);
    assert.throws(() => project([{ ...a, spheres: ['mind', 'mind'] }]), /sphere/);
    assert.throws(() => project([{ ...a, contributionSnapshot: undefined } as unknown as Activity]));
    assert.throws(() => project([{ ...a, occurredOn: '2026-02-30' }]));
});
test('T04 complete Monday 4/8 weeks exclude current partial week and selected date', () => {
    assert.deepEqual(completeWeekWindow('2026-10-28', 4), { startDay: '2026-09-28', endDayExclusive: '2026-10-26' });
    assert.deepEqual(completeWeekWindow('2026-10-26', 8), { startDay: '2026-08-31', endDayExclusive: '2026-10-26' });
    assert.equal(project([event('partial', '2026-10-26'), event('sunday', '2026-10-25')]).period.recordedEventCount, 1);
    const eight = project([event('older', '2026-09-01')], { ...completeWeekWindow('2026-10-28', 8), trendWeeks: 8 });
    assert.equal(eight.weeks.length, 8);
    assert.equal(eight.period.recordedEventCount, 1);
});
test('T04 Gregorian leap, year and DST calendar boundaries independent of timezone metadata', () => {
    assert.equal(addCalendarDays('2024-02-28', 1), '2024-02-29');
    assert.equal(addCalendarDays('2024-02-29', 1), '2024-03-01');
    assert.equal(addCalendarDays('2025-12-31', 1), '2026-01-01');
    assert.equal(startOfWeek('2026-01-01', 1), '2025-12-29');
    assert.equal(startOfWeek('2026-01-04', 7), '2026-01-04');
    for (const [asOfDay, start] of [['2024-03-11', '2024-02-12'], ['2024-11-04', '2024-10-07'], ['2025-01-06', '2024-12-09']])
        assert.equal(completeWeekWindow(asOfDay, 4).startDay, start);
    const e = event('zone', '2024-03-10');
    const opts = { ...completeWeekWindow('2024-03-11', 4), asOfDay: '2024-03-11' };
    assert.deepEqual(project([e], opts), project([{ ...e, timezone: 'Pacific/Auckland', recordedAt: '2026-10-29T05:00:00Z' }], opts));
    const leap = project([event('leap', '2024-02-29')], { ...completeWeekWindow('2024-03-04', 4), asOfDay: '2024-03-04' });
    assert.equal(leap.daily.length, 28);
    assert.equal(leap.period.recordedEventCount, 1);
});
test('T04 separate period and trend windows honor half-open union input', () => {
    const p = project([event('trendOnly', '2026-10-20'), event('periodOnly', '2026-10-27')], { startDay: '2026-10-26', endDayExclusive: '2026-10-28' });
    assert.equal(p.period.recordedEventCount, 1);
    assert.equal(p.weeks.reduce((n, w) => n + w.recordedEventCount, 0), 1);
    for (const opts of [{ trendWeeks: 3 }, { trendWeeks: 9 }, { trendWeeks: 4.5 }, { weekStartsOn: 0 }, { weekStartsOn: 8 }, { startDay: '2026-10-27' }, { asOfDay: '2023-02-29' }])
        assert.throws(() => project([], opts));
});
test('T05 saved snapshots unchanged by edits, backdated adds/cancels reproject', () => {
    const original = event('guitar');
    const events = [original];
    const before = project(events);
    const currentDefinition = { name: 'Renamed', contributionProfile: defaultContributions(['body']) };
    currentDefinition.contributionProfile.values.body = 10;
    assert.deepEqual(project(events), before);
    const backdated = event('backdated', '2026-10-01', { work: 4 });
    assert.equal(project([...events, backdated]).period.totalUnits, before.period.totalUnits + 4);
    assert.deepEqual(project([...events, backdated].filter(e => e.id !== 'backdated')), before);
    assert.equal(original.contributionSnapshot!.values.mind, 7);
});
test('presentation uses all-sphere denominator, explicit gaps, dates and rounding only at display', () => {
    const bucket = project([event('a', '2026-10-20', { body: 1, mind: 1, recovery: 1 })]).weeks[3];
    assert.ok(Math.abs(chartValue(bucket, 'body', 'shares')! - 100 / 3) < 1e-12);
    assert.equal(formatContribution(chartValue(bucket, 'body', 'shares'), 'shares'), '33,3 %');
    assert.equal(weekLabel(bucket), '19.10–25.10.2026');
    assert.equal(chartValue(project([]).weeks[0], 'body', 'shares'), null);
});
