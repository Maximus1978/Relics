import { spheres, type SphereId } from './activity.ts';

export type HabitInput = { name: string; spheres: SphereId[] };

export class HabitValidationError extends Error {
  field: 'name' | 'spheres';

  constructor(field: 'name' | 'spheres', message: string) {
    super(message);
    this.name = 'HabitValidationError';
    this.field = field;
  }
}

export function validateHabitInput(name: string, selectedSpheres: readonly string[]): HabitInput {
  const normalizedName = name.trim();
  if (!normalizedName) throw new HabitValidationError('name', 'Укажите название привычки.');
  if (!selectedSpheres.length) {
    throw new HabitValidationError('spheres', 'Выберите хотя бы одну сферу.');
  }
  if (selectedSpheres.some(sphere => !Object.hasOwn(spheres, sphere))) {
    throw new HabitValidationError('spheres', 'Выберите только доступные сферы.');
  }
  return {
    name: normalizedName,
    spheres: (Object.keys(spheres) as SphereId[]).filter(sphere => selectedSpheres.includes(sphere)),
  };
}
