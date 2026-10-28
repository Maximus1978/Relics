import { useId } from 'react';
import { SphereSymbol } from '../../components/SphereIcon';
import type { SphereId } from '../../domain/activity';
import { sanctuaryArt } from './art';

export default function RelicArt({ sphere }: { sphere: SphereId }) {
  const identifier = useId().replaceAll(':', '');
  return <span className="relic-art" data-sphere={sphere} aria-hidden="true">
    <svg viewBox="0 0 100 100" focusable="false">
      <defs><radialGradient id={`${identifier}-stone`} cx=".3" cy=".25" r=".8"><stop stopColor="#f2fff3" stopOpacity=".7" /><stop offset=".15" stopColor="currentColor" /><stop offset=".65" stopColor="currentColor" stopOpacity=".35" /><stop offset="1" stopColor="#050c12" /></radialGradient></defs>
      <circle cx="50" cy="53" r="22" fill={`url(#${identifier}-stone)`} stroke="currentColor" strokeOpacity=".7" />
      <path d="m50 31 16 7 6 15-6 16-16 6-15-6-7-16 7-15Z M35 38l15 6 16-6-6 15 6 16-16-6-15 6 6-16Z" fill="none" stroke="currentColor" strokeOpacity=".3" />
      <g transform="translate(35 38) scale(1.25)" fill="none" stroke="#f7ead0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><SphereSymbol sphere={sphere} /></g>
    </svg>
    <img src={sanctuaryArt.relic} width="384" height="384" alt="" />
  </span>;
}
