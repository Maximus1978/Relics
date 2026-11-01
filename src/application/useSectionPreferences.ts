import { useEffect, useState } from 'react';
import { defaultSectionPreferences, readSectionPreferences, writeSectionPreferences, type SectionPreferences } from '../ui/sectionPreferences';
export function useSectionPreferences() {
  const [preferences, setPreferences] = useState(() => {
    try { return readSectionPreferences(window.localStorage); }
    catch { return defaultSectionPreferences(); }
  });
  useEffect(() => {
    try { writeSectionPreferences(window.localStorage, preferences); }
    catch { /* Access to the storage getter itself may be denied. */ }
  }, [preferences]);
  function setExpanded(section: keyof SectionPreferences, expanded: boolean) {
    setPreferences(current => ({ ...current, [section]: expanded }));
  }
  return { preferences, setExpanded };
}
