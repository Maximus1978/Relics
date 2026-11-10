import { spheres, validateDay, type Activity, type SphereId } from './activity.ts';

/** Read-only saved snapshots; missing records say nothing about real-world inactivity. */
export function selectedDayActivity(entries: readonly Activity[], day: string) {
  const illuminated = Object.fromEntries(Object.keys(spheres).map(sphere => [sphere, false])) as Record<SphereId, boolean>;
  const activityIdsByHabit = new Map<string, string>();
  // A date input may briefly be empty/invalid while the person edits it.
  try { validateDay(day, day); } catch { return { day, illuminated, activityIdsByHabit }; }
  for (const entry of entries) {
    if (entry.occurredOn !== day) continue;
    activityIdsByHabit.set(entry.habitId, entry.id);
    for (const sphere of entry.spheres) {
      if (Object.hasOwn(spheres, sphere)) illuminated[sphere] = true;
    }
  }
  return { day, illuminated, activityIdsByHabit };
}

export type SelectedDayActivity = ReturnType<typeof selectedDayActivity>;
