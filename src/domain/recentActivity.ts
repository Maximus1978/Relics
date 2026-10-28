import { localDay, spheres, validateDay, type Activity, type SphereId } from './activity.ts';

export function recentActivity(entries: readonly Activity[], asOf = localDay()) {
  validateDay(asOf, asOf);
  const start = new Date(`${asOf}T12:00:00`);
  start.setDate(start.getDate() - 6);
  const startOn = localDay(start);
  const days = Object.fromEntries(Object.keys(spheres).map(sphere => [sphere, new Set<string>()])) as Record<SphereId, Set<string>>;
  for (const entry of entries) {
    if (entry.occurredOn < startOn || entry.occurredOn > asOf) continue;
    try { validateDay(entry.occurredOn, asOf); } catch { continue; }
    for (const sphere of entry.spheres) {
      if (Object.hasOwn(spheres, sphere)) days[sphere].add(entry.occurredOn);
    }
  }
  const counts = Object.fromEntries((Object.keys(spheres) as SphereId[]).map(sphere => [sphere, days[sphere].size])) as Record<SphereId, number>;
  return { startOn, endOn: asOf, counts, represented: Object.values(counts).filter(count => count > 0).length };
}
