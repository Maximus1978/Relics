import { icons, type MedalIconId } from '../ui/sigils/medalDesign.ts';

export const defaultHabitIcon: MedalIconId = 'sigil';

export function validateHabitIcon(value: unknown): MedalIconId {
  if (typeof value !== 'string' || !Object.hasOwn(icons, value)) {
    throw new Error('Выберите значок из галереи.');
  }
  return value as MedalIconId;
}
