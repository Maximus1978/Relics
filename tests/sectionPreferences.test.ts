import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultSectionPreferences, readSectionPreferences, writeSectionPreferences, sectionPreferencesKey } from '../src/ui/sectionPreferences.ts';
function memory(value: string | null = null) {
  const records = new Map<string, string>(value === null ? [] : [[sectionPreferencesKey, value]]);
  return { records, getItem: (key: string) => records.get(key) ?? null, setItem: (key: string, item: string) => { records.set(key, item); } };
}
test('Device section preferences start expanded and preserve all four independent combinations across reader reopening', () => {
  const store = memory();
  assert.deepEqual(readSectionPreferences(store), defaultSectionPreferences());
  for (const inventoryExpanded of [false, true]) for (const rhythmExpanded of [false, true]) {
    const preferences = { inventoryExpanded, rhythmExpanded };
    writeSectionPreferences(store, preferences);
    assert.deepEqual(readSectionPreferences(store), preferences);
    assert.deepEqual(Object.keys(JSON.parse(store.records.get(sectionPreferencesKey)!)).sort(), ['inventoryExpanded', 'rhythmExpanded', 'version']);
  }
});
test('Malformed, unknown-version and partially valid preferences safely fall back to both expanded', () => {
  for (const value of ['{', 'null', '[]', '42', 'false', '{}',
    '{"version":2,"inventoryExpanded":false,"rhythmExpanded":false}',
    '{"version":1,"inventoryExpanded":false}',
    '{"version":1,"inventoryExpanded":"false","rhythmExpanded":false}',
    '{"version":1,"inventoryExpanded":false,"rhythmExpanded":null}',
    '{"version":1,"inventoryExpanded":false,"rhythmExpanded":false,"day":"2026-10-26"}']) {
    assert.deepEqual(readSectionPreferences(memory(value)), defaultSectionPreferences(), value);
  }
});
test('Unavailable reads and full or denied writes do not block session controls', () => {
  const denied = { getItem: () => { throw new Error('Denied'); }, setItem: () => { throw new Error('Quota'); } };
  assert.deepEqual(readSectionPreferences(denied), defaultSectionPreferences());
  assert.doesNotThrow(() => writeSectionPreferences(denied, { inventoryExpanded: false, rhythmExpanded: true }));
});
test('Only section booleans are persisted; unrelated local preferences remain untouched', () => {
  const store = memory(); store.records.set('unrelated', 'preserve');
  writeSectionPreferences(store, { inventoryExpanded: false, rhythmExpanded: true });
  assert.equal(store.records.get('unrelated'), 'preserve');
  assert.equal(store.records.size, 2);
  assert.deepEqual(JSON.parse(store.records.get(sectionPreferencesKey)!), { version: 1, inventoryExpanded: false, rhythmExpanded: true });
});
