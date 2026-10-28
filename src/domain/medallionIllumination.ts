import { localDay, type Activity } from './activity.ts';
import { recentActivity } from './recentActivity.ts';
import { selectedDayActivity } from './selectedDayActivity.ts';

export type MedallionState = 'dormant' | 'awakening' | 'harmony' | 'radiance';

/** Observed sphere/day combinations, never a score, goal, streak or earned tier. */
export function medallionIllumination(entries: readonly Activity[], selectedDay: string, asOf = localDay()) {
  const recent = recentActivity(entries, asOf);
  const selected = selectedDayActivity(entries, selectedDay);
  const sphereDays = Object.values(recent.counts).reduce((total, count) => total + count, 0);
  const selectedInWindow = selectedDay >= recent.startOn && selectedDay <= recent.endOn;
  const selectedHasAllSpheres = Object.values(selected.illuminated).every(Boolean);
  const state: MedallionState = sphereDays === 35 ? 'radiance'
    : selectedInWindow && selectedHasAllSpheres ? 'harmony'
    : sphereDays > 0 ? 'awakening' : 'dormant';
  return { state, sphereDays, selectedInWindow, recent, selected };
}

export type MedallionIllumination = ReturnType<typeof medallionIllumination>;
