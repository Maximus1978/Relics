/** Device-local UI state only; never journal data or a backup payload. */
export const sectionPreferencesKey = 'relics.ui.sections.v1';
export type SectionPreferences = { inventoryExpanded: boolean; rhythmExpanded: boolean };
type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem'>;
export function defaultSectionPreferences(): SectionPreferences {
  return { inventoryExpanded: true, rhythmExpanded: true };
}
export function readSectionPreferences(storage: PreferenceStorage): SectionPreferences {
  try {
    const value: unknown = JSON.parse(storage.getItem(sectionPreferencesKey) ?? 'null');
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return defaultSectionPreferences();
    const record = value as Record<string, unknown>;
    if (Object.keys(record).length !== 3 || record.version !== 1 ||
        typeof record.inventoryExpanded !== 'boolean' || typeof record.rhythmExpanded !== 'boolean') return defaultSectionPreferences();
    return { inventoryExpanded: record.inventoryExpanded, rhythmExpanded: record.rhythmExpanded };
  } catch { return defaultSectionPreferences(); }
}
export function writeSectionPreferences(storage: PreferenceStorage, preferences: SectionPreferences): void {
  try {
    storage.setItem(sectionPreferencesKey, JSON.stringify({ version: 1, ...preferences }));
  } catch { /* Session controls still work when device preference storage is blocked/full. */ }
}
