import { useId } from 'react';
import type { SphereId } from '../domain/activity';
import { SphereSymbol } from './SphereIcon';

type Props = {
  sphere: SphereId;
  gemstoneAccent?: string;
  frameColor?: string;
  ornamented?: boolean;
  illuminated?: boolean;
};

export default function SphereMedallion({ sphere, gemstoneAccent, frameColor = '#b59a67', ornamented = true, illuminated = false }: Props) {
  const identifier = useId().replaceAll(':', '');
  return <svg className="medallion" data-sphere={sphere} viewBox="0 0 100 100" aria-hidden="true" focusable="false"
    style={gemstoneAccent ? { color: gemstoneAccent } : undefined}>
    <defs>
      <linearGradient id={`${identifier}-metal`} x2=".8" y2="1">
        <stop stopColor="#ead4a6" /><stop offset=".35" stopColor={frameColor} /><stop offset=".68" stopColor="#433b30" /><stop offset="1" stopColor={frameColor} />
      </linearGradient>
      <radialGradient id={`${identifier}-gem`} cx=".35" cy=".22" r=".85">
        <stop stopColor="currentColor" stopOpacity=".54" /><stop offset=".65" stopColor="currentColor" stopOpacity=".12" /><stop offset="1" stopColor="#0c1013" />
      </radialGradient>
      <radialGradient id={`${identifier}-light`}><stop stopColor="currentColor" stopOpacity=".16" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></radialGradient>
    </defs>
    {illuminated && <circle cx="50" cy="50" r="50" fill={`url(#${identifier}-light)`} />}
    <circle cx="50" cy="50" r="39" fill="#101417" stroke={`url(#${identifier}-metal)`} strokeWidth="2.4" />
    <circle cx="50" cy="50" r="35" fill="none" stroke={frameColor} strokeOpacity=".42" strokeWidth=".7" />
    {ornamented && <g fill="#191b1a" stroke={`url(#${identifier}-metal)`} strokeWidth="1.1">
      <path d="m50 3 5 9-5 10-5-10Z M50 78l5 10-5 9-5-9Z M3 50l9-5 10 5-10 5Z M78 50l10-5 9 5-9 5Z" />
      <path d="m21 21 9 2-7 7Z M79 21l-2 9-7-7Z M21 79l2-9 7 7Z M79 79l-9-2 7-7Z" />
    </g>}
    <path d="m50 20 22 9 9 21-9 22-22 9-22-9-9-22 9-21Z" fill={`url(#${identifier}-gem)`} stroke="currentColor" strokeOpacity=".58" strokeWidth=".9" />
    <path d="m28 29 22 7 22-7-7 21 7 22-22-7-22 7 7-22Z M50 20v16M19 50h16m30 0h16M50 65v16" fill="none" stroke="currentColor" strokeOpacity=".17" strokeWidth=".8" />
    <g transform="translate(28 28) scale(1.8333)" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><SphereSymbol sphere={sphere} /></g>
    <path d="m47 12 3-5 3 5-3 4Z" fill="currentColor" />
  </svg>;
}
