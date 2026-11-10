import type { Activity, Habit } from '../../src/domain/activity.ts';
import type { Frequency, FrequencySegment } from '../../src/domain/habitRhythm.ts';
import { addCalendarDays } from '../../src/domain/sphereContributions.ts';

export const monday = '2024-01-01';
export const date = (offset: number) => addCalendarDays(monday, offset);

export function segment(habitId: string, frequency: Frequency, effectiveOn: string, createdOn = effectiveOn): FrequencySegment {
  return { id: habitId + ':' + effectiveOn, habitId, frequency, effectiveOn, createdOn, version: 1 };
}

export function habit(frequency: Frequency | null = 'weekly', startsOn = monday, id = 'review-habit') {
  const definition: Pick<Habit, 'id' | 'archivedAt' | 'frequencySegments' | 'archivePauses'> = {
    id, archivedAt: null, frequencySegments: frequency ? [segment(id, frequency, startsOn)] : [], archivePauses: [],
  };
  return definition;
}

export function activity(occurredOn: string, habitId = 'review-habit', id = habitId + ':' + occurredOn): Activity {
  return { id, habitId, habitName: 'Synthetic practice', spheres: ['mind'], occurredOn,
    recordedAt: occurredOn + 'T20:00:00Z', timezone: 'Etc/UTC', contributionSnapshot: null };
}

export function practice(counts: readonly number[], habitId = 'review-habit'): Activity[] {
  return counts.flatMap((count, week) => Array.from({ length: count }, (_, day) => activity(date(week * 7 + day), habitId)));
}
