import type { Activity, Habit } from './activity.ts';
import { archivePauseAt, calendarDay, validateFrequencyHistory, type ArchivePause, type Frequency, type FrequencySegment } from './habitRhythm.ts';
import { startOfWeek } from './sphereContributions.ts';

export type ProgressRules = Readonly<{ id: string; version: number }>;
export const masteryV1Rules = Object.freeze({ id: 'mastery', version: 1 });

const minimumDays = { daily: 6, three_per_week: 3, weekly: 1 } as const;
const intendedDays = { daily: 7, three_per_week: 3, weekly: 1 } as const;
const materials = [
  { material: 'stone', at: [0, 1, 2] },
  { material: 'copper', at: [3, 5, 7] },
  { material: 'bronze', at: [9, 12, 15] },
  { material: 'silver', at: [18, 24, 30] },
  { material: 'gold', at: [36, 48, 60] },
  { material: 'platinum', at: [72, 84, 96] },
] as const;
const stages = [1, 2, 3] as const;
const checkpoints = materials.flatMap(({ material, at }) =>
  at.map((threshold, index) => ({ material, phase: stages[index], threshold })));

export type WeekOutcome =
  | 'qualified'
  | 'shortfall'
  | 'current-week'
  | 'initial-partial'
  | 'unconfigured'
  | 'archive'
  | 'legacy_unknown';

export type ForgingState = {
  frontier: number;
  protectedCheckpoint: number;
  consecutiveShortfalls: number;
};

export type ProgressWeek = ForgingState & {
  startsOn: string;
  outcome: WeekOutcome;
  frequency: Frequency | null;
  recordedDays: number;
};

type Options = {
  today: string;
  rules: ProgressRules;
  includeWeeks?: boolean;
};
type ProgressHabit = Pick<Habit, 'id' | 'archivedAt' | 'frequencySegments' | 'archivePauses'>;

export class ProgressInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProgressInputError';
  }
}

const millisecondsPerDay = 86_400_000;
// UTC is a coordinate system for already local date labels. No wall clock is read.
const dayNumber = (date: string) => Date.parse(date + 'T00:00:00Z') / millisecondsPerDay;
const dayLabel = (day: number) => new Date(day * millisecondsPerDay).toISOString().slice(0, 10);
const compare = (left: string, right: string) => left < right ? -1 : left > right ? 1 : 0;

function requireId(id: string, kind: string) {
  if (typeof id !== 'string' || !id.trim() || id.length > 256 || id.includes('\0')) {
    throw new ProgressInputError('Invalid ' + kind + ' ID.');
  }
}

function requireDay(day: string, kind: string) {
  try { calendarDay(day); } catch { throw new ProgressInputError('Invalid ' + kind + ' calendar date.'); }
}

function validateOptions(options: Options) {
  if (options.rules?.id !== masteryV1Rules.id || options.rules.version !== masteryV1Rules.version) {
    throw new ProgressInputError('Unsupported progression rules ID or version.');
  }
  requireDay(options.today, 'evaluation');
}

function orderedSegments(habit: ProgressHabit) {
  const segments = [...(habit.frequencySegments ?? [])].sort((a, b) => compare(a.effectiveOn, b.effectiveOn));
  try { validateFrequencyHistory(segments, habit.id); }
  catch { throw new ProgressInputError('Invalid frequency history or schema 6 effective date.'); }
  return segments;
}

function orderedPauses(habit: ProgressHabit) {
  const pauses = [...(habit.archivePauses ?? [])].sort((a, b) => compare(a.startOn ?? '', b.startOn ?? ''));
  const ids = new Set<string>();
  let lastEnd = -Infinity;
  for (const pause of pauses) {
    requireId(pause.id, 'archive pause');
    if (pause.habitId !== habit.id || pause.reason !== 'archive' || ids.has(pause.id)) {
      throw new ProgressInputError('Invalid archive pause identity.');
    }
    if (pause.startOn === null) {
      if (pause.provenance !== 'legacy_unknown') throw new ProgressInputError('Unknown archive start needs legacy provenance.');
    } else {
      if (pause.provenance !== 'recorded') throw new ProgressInputError('Known archive start needs recorded provenance.');
      requireDay(pause.startOn, 'archive start');
    }
    if (pause.endExclusiveOn !== null) requireDay(pause.endExclusiveOn, 'archive end');
    const start = pause.startOn === null ? -Infinity : dayNumber(pause.startOn);
    const end = pause.endExclusiveOn === null ? Infinity : dayNumber(pause.endExclusiveOn);
    if (start < lastEnd || end <= start || (start === -Infinity && ids.size > 0)) {
      throw new ProgressInputError('Archive pauses overlap or have invalid bounds.');
    }
    lastEnd = end;
    ids.add(pause.id);
  }
  if ((habit.archivedAt !== null) !== (lastEnd === Infinity)) {
    throw new ProgressInputError('Current archive state does not match its pause history.');
  }
  return pauses;
}

function eventDays(activities: readonly Activity[], habitIds: ReadonlySet<string>, today: string) {
  const ids = new Set<string>();
  const days = new Map<string, Set<string>>();
  for (const event of activities) {
    requireId(event.id, 'activity');
    requireDay(event.occurredOn, 'activity');
    if (!habitIds.has(event.habitId) || ids.has(event.id)) {
      throw new ProgressInputError('Duplicate activity ID or activity outside the supplied habits.');
    }
    ids.add(event.id);
    if (event.occurredOn > today) continue;
    const observed = days.get(event.habitId) ?? new Set<string>();
    observed.add(event.occurredOn);
    days.set(event.habitId, observed);
  }
  return days;
}

function computeResonance(
  today: number, lastDay: number | undefined, enrollment: number,
  frequency: Frequency | null, archive: ReturnType<typeof archivePauseAt>, unknownEnd: number,
): number {
  if (frequency === null || archive !== 'none' || lastDay === undefined || lastDay < Math.max(enrollment, unknownEnd)) {
    return 0;
  }
  // Multiplying by the intended practices/week avoids rounding the 7/3-day grace period.
  const elapsed = (today - lastDay) * intendedDays[frequency];
  return Math.min(1, Math.max(0, (21 - elapsed) / 14));
}

type WeekEvidence = {
  current: boolean;
  atStart: FrequencySegment | undefined;
  atEnd: FrequencySegment | undefined;
  pause: ArchivePause | undefined;
  recordedDays: number;
};

function classifyProgressWeek({ current, atStart, atEnd, pause, recordedDays }: WeekEvidence): WeekOutcome {
  if (current) return 'current-week';
  if (pause) return pause.provenance === 'legacy_unknown' ? 'legacy_unknown' : 'archive';
  if (!atEnd) return 'unconfigured';
  if (!atStart) return 'initial-partial';
  return recordedDays >= minimumDays[atStart.frequency] ? 'qualified' : 'shortfall';
}

function replayHabit(habit: ProgressHabit, dates: ReadonlySet<string> | undefined, options: Options) {
  const segments = orderedSegments(habit);
  const pauses = orderedPauses(habit);
  const today = dayNumber(options.today);
  const currentWeek = dayNumber(startOfWeek(options.today, 1));
  const effectiveDays = segments.map(segment => dayNumber(segment.effectiveOn));
  const enrollment = effectiveDays[0] ?? Infinity;
  const observed = [...(dates ?? [])].sort(compare);
  const observedDays = observed.map(dayNumber);
  const earliest = Math.min(enrollment, observedDays[0] ?? Infinity);
  const pauseStarts = pauses.map(pause => pause.startOn === null ? -Infinity : dayNumber(pause.startOn));
  const pauseEnds = pauses.map(pause => pause.endExclusiveOn === null ? Infinity : dayNumber(pause.endExclusiveOn));
  const weeks: ProgressWeek[] | undefined = options.includeWeeks ? [] : undefined;
  let frontier = 0;
  let phaseIndex = 0;
  let consecutiveShortfalls = 0;
  let segmentIndex = -1;
  let pauseIndex = 0;
  let eventIndex = 0;

  if (earliest <= today) {
    const start = dayNumber(startOfWeek(dayLabel(earliest), 1));
    for (let week = start; week <= currentWeek; week += 7) {
      const previousSegment = segmentIndex;
      while (effectiveDays[segmentIndex + 1] <= week) segmentIndex++;
      const atStart = segments[segmentIndex];
      const end = Math.min(week + 7, today + 1);
      while (effectiveDays[segmentIndex + 1] < end) segmentIndex++;
      const atEnd = segments[segmentIndex];
      if (segmentIndex !== previousSegment) consecutiveShortfalls = 0;

      const firstEvent = eventIndex;
      while (observedDays[eventIndex] < end) eventIndex++;
      const recordedDays = eventIndex - firstEvent;
      while (pauseEnds[pauseIndex] <= week) pauseIndex++;
      const pause = pauseStarts[pauseIndex] < end ? pauses[pauseIndex] : undefined;
      const outcome = classifyProgressWeek({ current: week === currentWeek, atStart, atEnd, pause, recordedDays });

      if (outcome === 'qualified') {
        frontier++;
        consecutiveShortfalls = 0;
        if (frontier === checkpoints[phaseIndex + 1]?.threshold) phaseIndex++;
      } else if (outcome === 'shortfall') {
        consecutiveShortfalls = Math.min(2, consecutiveShortfalls + 1);
        if (consecutiveShortfalls === 2) frontier = checkpoints[phaseIndex].threshold;
      }

      weeks?.push({
        startsOn: dayLabel(week),
        outcome,
        frequency: atEnd?.frequency ?? null,
        recordedDays,
        frontier,
        protectedCheckpoint: checkpoints[phaseIndex].threshold,
        consecutiveShortfalls,
      });
    }
  }

  const { material, phase, threshold: protectedCheckpoint } = checkpoints[phaseIndex];
  const next = checkpoints[phaseIndex + 1];
  const currentFrequency = segments[segmentIndex]?.frequency ?? null;
  const nextPhase = currentFrequency && next ? {
    completed: frontier - protectedCheckpoint,
    required: next.threshold - protectedCheckpoint,
    threshold: next.threshold,
    material: next.material,
    phase: next.phase,
  } : null;
  const archive = archivePauseAt(pauses, options.today);
  const unknownEnd = pauses[0]?.provenance === 'legacy_unknown' ? pauseEnds[0] : -Infinity;
  return {
    habitId: habit.id,
    rules: masteryV1Rules,
    today: options.today,
    currentFrequency,
    archive,
    mastery: { material, phase },
    forging: { frontier, protectedCheckpoint, consecutiveShortfalls, unfinished: nextPhase?.completed ?? 0, nextPhase },
    resonance: computeResonance(today, observedDays.at(-1), enrollment, currentFrequency, archive, unknownEnd),
    weeks,
  };
}

export type HabitProgress = ReturnType<typeof replayHabit>;

export function projectHabitsProgress(options: Options & {
  habits: readonly ProgressHabit[];
  activities: readonly Activity[];
}): HabitProgress[] {
  validateOptions(options);
  const habits = [...options.habits].sort((left, right) => compare(left.id, right.id));
  const ids = new Set<string>();
  for (const habit of habits) {
    requireId(habit.id, 'habit');
    if (ids.has(habit.id)) throw new ProgressInputError('Duplicate habit ID.');
    ids.add(habit.id);
  }
  const days = eventDays(options.activities, ids, options.today);
  return habits.map(habit => replayHabit(habit, days.get(habit.id), options));
}

export function projectHabitProgress(options: Options & {
  habit: ProgressHabit;
  activities: readonly Activity[];
}): HabitProgress {
  return projectHabitsProgress({ ...options, habits: [options.habit] })[0];
}
