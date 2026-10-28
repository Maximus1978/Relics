import type { SphereId } from '../domain/activity';

const paths: Record<SphereId, string> = {
  body: 'M3 9v6m3-8v10m0-5h12m0-5v10m3-8v6',
  mind: 'M12 5c-1-4-6-3-6 1-4 0-5 5-2 7-2 4 1 7 4 6 1 3 4 2 4-1V5Zm0 0c1-4 6-3 6 1 4 0 5 5 2 7 2 4-1 7-4 6-1 3-4 2-4-1M6 6v4m-2 3h4v3m10-10v4m2 3h-4v3',
  relationships: 'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1C0 9 5 15 12 21c7-6 12-12 8-16Z',
  work: 'M8 7V4h8v3M3 11h18M10 11v3h4v-3M4 7h16v13H4Z',
  recovery: 'M5 20C1 10 8 5 21 3c0 13-6 19-16 17Zm0 0L16 9',
};

export default function SphereIcon({ sphere }: { sphere: SphereId }) {
  return <svg className="line-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><SphereSymbol sphere={sphere} /></svg>;
}

export function SphereSymbol({ sphere }: { sphere: SphereId }) {
  return <path d={paths[sphere]} />;
}
