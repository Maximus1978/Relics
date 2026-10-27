import type { SphereId } from '../domain/activity';

const paths: Record<SphereId, string> = {
  body: 'M3 9v6m3-8v10m0-5h12m0-5v10m3-8v6',
  mind: 'M12 6v15M12 6C9 4 6 3 3 4v15c3-1 6 0 9 2 3-2 6-3 9-2V4c-3-1-6 0-9 2Z',
  relationships: 'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1C0 9 5 15 12 21c7-6 12-12 8-16Z',
  work: 'M8 7V4h8v3M3 11h18M10 11v3h4v-3M4 7h16v13H4Z',
  recovery: 'M5 20C1 10 8 5 21 3c0 13-6 19-16 17Zm0 0L16 9',
};

export default function SphereIcon({ sphere }: { sphere: SphereId }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={paths[sphere]} /></svg>;
}
