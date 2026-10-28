import test from 'node:test';
import assert from 'node:assert/strict';
import { medallionIllumination } from '../src/domain/medallionIllumination.ts';
import { spheres, type Activity, type SphereId } from '../src/domain/activity.ts';

const all = Object.keys(spheres) as SphereId[];
const today = '2026-10-28';
const week = ['2026-10-22','2026-10-23','2026-10-24','2026-10-25','2026-10-26','2026-10-27',today];
function entry(day: string, contributions: SphereId[]): Activity {
  return { id: crypto.randomUUID(), habitId: 'synthetic', habitName: 'Historical snapshot', spheres: contributions,
    occurredOn: day, recordedAt: '2026-10-28T20:00:00Z', timezone: 'America/Los_Angeles', contributionSnapshot:null };
}

test('DORMANT means zero recent sphere-days, including when only older history exists', () => {
  for (const entries of [[], [entry('2000-01-01', all)]]) {
    const result = medallionIllumination(entries, today, today);
    assert.equal(result.state, 'dormant');
    assert.equal(result.sphereDays, 0);
  }
});

test('partial weekly coverage is AWAKENING even if every sphere appears across different dates', () => {
  const entries = all.map((sphere, index) => entry(week[index], [sphere]));
  const result = medallionIllumination(entries, today, today);
  assert.equal(result.sphereDays, 5);
  assert.equal(result.recent.represented, 5);
  assert.equal(result.state, 'awakening');
});

test('HARMONY requires all five selected-day spheres inside the current inclusive window', () => {
  const entries = [entry(week[0], all), entry(today, all)];
  assert.equal(medallionIllumination(entries, week[0], today).state, 'harmony');
  assert.equal(medallionIllumination(entries, today, today).state, 'harmony');
  assert.equal(medallionIllumination(entries, week[1], today).state, 'awakening');
});

test('RADIANCE requires all 35 distinct combinations and takes precedence over HARMONY', () => {
  const entries = week.map(day => entry(day, all));
  const result = medallionIllumination(entries, today, today);
  assert.equal(result.sphereDays, 35);
  assert.equal(result.state, 'radiance');
  const incomplete = [...entries.slice(0,-1), entry(today, all.slice(0,4))];
  assert.equal(medallionIllumination(incomplete, today, today).sphereDays, 34);
  assert.equal(medallionIllumination(incomplete, today, today).state, 'awakening');
  assert.equal(medallionIllumination(incomplete, week[0], today).state, 'harmony');
});

test('multisphere snapshots contribute to every saved sphere without using current habit definitions', () => {
  const entries = [entry(today, ['body','recovery']), entry(today, ['mind','relationships','work'])];
  assert.equal(medallionIllumination(entries, today, today).state, 'harmony');
  assert.equal(medallionIllumination(entries, today, today).sphereDays, 5);
});

test('duplicate records and repeated contributions for the same sphere/day cannot inflate coverage', () => {
  const entries = Array.from({length: 35}, () => entry(today, ['mind','mind','recovery']));
  const before = structuredClone(entries);
  const result = medallionIllumination(entries, today, today);
  assert.equal(result.sphereDays, 2);
  assert.equal(result.state, 'awakening');
  assert.deepEqual(entries, before);
});

test('backdated additions and cancellation recompute HARMONY/RADIANCE without persisted visual state', () => {
  const sixDays = week.slice(1).map(day => entry(day, all));
  const before = medallionIllumination(sixDays, today, today);
  assert.equal(before.state, 'harmony');
  assert.equal(before.sphereDays, 30);
  const backdated = entry(week[0], all);
  assert.equal(medallionIllumination([...sixDays, backdated], today, today).state, 'radiance');
  assert.equal(medallionIllumination(sixDays, today, today).state, 'harmony');
  assert.equal(medallionIllumination([], today, today).state, 'dormant');
});

test('selecting old/future dates never reanchors coverage or grants HARMONY outside the current window', () => {
  const entries = [entry(today, ['mind']), entry('2000-01-01', all), entry('2026-10-29', all)];
  const current = medallionIllumination(entries, today, today);
  for (const selected of ['2000-01-01','2026-10-21','2026-10-29','']) {
    const result = medallionIllumination(entries, selected, today);
    assert.equal(result.state, 'awakening');
    assert.equal(result.sphereDays, 1);
    assert.deepEqual(result.recent, current.recent);
    assert.equal(result.selectedInWindow, false);
  }
});

test('DORMANT never suppresses gemstones for a recorded historical selected date', () => {
  const result = medallionIllumination([entry('2000-01-01',['body','recovery'])], '2000-01-01', today);
  assert.equal(result.state,'dormant');
  assert.equal(result.sphereDays,0);
  assert.equal(result.selected.illuminated.body,true);
  assert.equal(result.selected.illuminated.recovery,true);
  assert.equal(result.selected.illuminated.mind,false);
});

test('RADIANCE never activates gemstones for an empty historical selected date', () => {
  const result = medallionIllumination(week.map(day=>entry(day,all)), '2000-01-01', today);
  assert.equal(result.state,'radiance');
  assert.equal(result.sphereDays,35);
  assert.equal(result.selectedInWindow,false);
  assert.ok(Object.values(result.selected.illuminated).every(value=>!value));
});
