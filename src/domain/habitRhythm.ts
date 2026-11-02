import { validateDay } from './activity.ts';
export const frequencies = { daily: 'Каждый день', three_per_week: '3 раза в неделю', weekly: 'Раз в неделю' } as const;
export type Frequency = keyof typeof frequencies;
export type FrequencySegment = { id: string; habitId: string; frequency: Frequency; effectiveOn: string; createdOn: string; version: 1 };
export type RhythmChange = { kind: 'keep' } | { kind: 'set'; frequency: Frequency } | { kind: 'cancel_pending' };
export class RhythmError extends Error {
  constructor(message: string) { super(message); this.name = 'RhythmError'; }
}
export function calendarDay(day: string): void {
  try { validateDay(day, day); } catch { throw new RhythmError('Проверьте календарную дату ритма.'); }
}
export function validateFrequency(value: unknown): Frequency {
  if (typeof value !== 'string' || !Object.hasOwn(frequencies, value)) throw new RhythmError('Выберите ритм привычки.');
  return value as Frequency;
}
export function nextMonday(today: string): string {
  calendarDay(today);
  const date = new Date(today + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + ((8 - date.getUTCDay()) % 7 || 7));
  const result = date.toISOString().slice(0, 10); calendarDay(result); return result;
}
function identity(value: string): void {
  if (!value || !value.trim() || value.length > 256 || value.includes('\0')) throw new RhythmError('Некорректный идентификатор ритма.');
}
export function validateFrequencyHistory(segments: readonly FrequencySegment[], habitId: string): void {
  let previous: FrequencySegment | undefined; const ids = new Set<string>();
  for (const segment of segments) {
    identity(segment.id); identity(segment.habitId); validateFrequency(segment.frequency);
    calendarDay(segment.effectiveOn); calendarDay(segment.createdOn);
    if (segment.version !== 1 || segment.habitId !== habitId || ids.has(segment.id)) throw new RhythmError('Некорректная история ритма.');
    if (previous ? segment.effectiveOn <= previous.effectiveOn || segment.createdOn < previous.effectiveOn || segment.effectiveOn !== nextMonday(segment.createdOn) : segment.effectiveOn !== segment.createdOn) throw new RhythmError('Нарушен порядок или дата начала ритма.');
    ids.add(segment.id); previous = segment;
  }
}
export function frequencyAt(segments: readonly FrequencySegment[], occurredOn: string): FrequencySegment | null {
  calendarDay(occurredOn);
  return [...segments].reverse().find(segment => segment.effectiveOn <= occurredOn) ?? null;
}
export function rhythmStatus(segments: readonly FrequencySegment[], today: string) {
  calendarDay(today);
  const pending = segments.filter(segment => segment.effectiveOn > today);
  return { current: frequencyAt(segments, today), pending: pending[0] ?? null, clockConflict: pending.length > 1 || segments.some(segment => segment.createdOn > today) };
}
/** Pure mutation plan; callers persist the complete result in one pinned transaction. */
export function changeFrequency(segments: readonly FrequencySegment[], habitId: string, change: RhythmChange, today: string, newId: string): FrequencySegment[] {
  validateFrequencyHistory(segments, habitId); calendarDay(today);
  const status = rhythmStatus(segments, today);
  if (change.kind === 'keep') return [...segments];
  if (status.clockConflict) throw new RhythmError('Дата компьютера раньше сохранённой истории. Проверьте дату и повторите.');
  const applied = segments.filter(segment => segment.effectiveOn <= today);
  if (change.kind === 'cancel_pending') return applied;
  const frequency = validateFrequency(change.frequency);
  if (status.current?.frequency === frequency) return applied;
  identity(newId);
  const result = [...applied, { id: status.pending?.id ?? newId, habitId, frequency, effectiveOn: applied.length ? nextMonday(today) : today, createdOn: today, version: 1 as const }];
  validateFrequencyHistory(result, habitId); return result;
}

export type ArchivePause = { id: string; habitId: string; startOn: string | null; endExclusiveOn: string | null; reason: 'archive'; provenance: 'recorded' | 'legacy_unknown' };
/** Metadata-only classification for future consumers,not a progression projection. Unknown periods are neutral. */
export function archivePauseAt(pauses: readonly ArchivePause[], day: string): 'none' | 'archive' | 'legacy_unknown' {
 calendarDay(day);const pause=pauses.find(p=>(p.startOn===null||p.startOn<=day)&&(p.endExclusiveOn===null||day<p.endExclusiveOn));
 return pause ? pause.provenance==='legacy_unknown'?'legacy_unknown':'archive' : 'none';
}
