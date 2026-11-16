import type { Activity, Habit } from '../domain/activity.ts';
import { masteryV1Rules, projectHabitsProgress, type HabitProgress } from '../domain/habitProgress.ts';

export type InventoryMastery =
  | { available: true; byHabit: ReadonlyMap<string, HabitProgress> }
  | { available: false };

export function projectInventoryMastery(habits: readonly Habit[], activities: readonly Activity[], today: string): InventoryMastery {
  try {
    const progress = projectHabitsProgress({ habits, activities, today, rules: masteryV1Rules });
    return { available: true, byHabit: new Map(progress.map(result => [result.habitId, result])) };
  } catch {
    // A corrupt history must not disable journal access or appear as a valid starter medal.
    return { available: false };
  }
}
