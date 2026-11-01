import type { FrequencySegment, ArchivePause } from './habitRhythm.ts';
import { defaultContributions } from './contributions.ts';
import type { ContributionProfile } from './contributions.ts';
export const spheres = {
  body: 'Тело',
  mind: 'Разум',
  relationships: 'Отношения',
  work: 'Дело',
  recovery: 'Восстановление',
} as const;

export type SphereId = keyof typeof spheres;
export type Habit = { id: string; name: string; spheres: SphereId[]; archivedAt: string | null; contributionProfile: ContributionProfile; frequencySegments?: FrequencySegment[]; archivePauses?: ArchivePause[] };
export type Activity = {
  id: string;
  habitId: string;
  habitName: string;
  spheres: SphereId[];
  occurredOn: string;
  recordedAt: string;
  timezone: string;
  contributionSnapshot: ContributionProfile | null;
};

const originalSamples: Omit<Habit,'contributionProfile'>[] = [
  { id: 'walk', name: 'Прогулка', spheres: ['body', 'recovery'], archivedAt: null },
  { id: 'read', name: 'Чтение', spheres: ['mind'], archivedAt: null },
  { id: 'connect', name: 'Разговор с близким', spheres: ['relationships'], archivedAt: null },
];
export const sampleHabits: Habit[]=originalSamples.map(habit=>({...habit,contributionProfile:defaultContributions(habit.spheres,'legacy-default')}));

export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function validateDay(day: string, today = localDay()): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day.startsWith('0000')) {
    throw new Error('Выберите корректную дату.');
  }
  const parsed = new Date(`${day}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) {
    throw new Error('Такой даты не существует.');
  }
  if (day > today) throw new Error('Выполненное действие нельзя отметить на будущую дату.');
}
