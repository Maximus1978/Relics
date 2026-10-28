import type { SphereId } from '../domain/activity';

export const sphereVisuals: Record<SphereId, { gemstone: string; invitation: string }> = {
  body: { gemstone: 'Рубин', invitation: 'Движение и сила' },
  mind: { gemstone: 'Сапфир', invitation: 'Знание и любопытство' },
  relationships: { gemstone: 'Гранат', invitation: 'Тепло и близость' },
  work: { gemstone: 'Топаз', invitation: 'Созидание и смысл' },
  recovery: { gemstone: 'Изумруд', invitation: 'Отдых и тишина' },
};
