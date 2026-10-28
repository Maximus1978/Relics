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

export default function SphereMedallion({ sphere, gemstoneAccent, frameColor = '#b99a60', ornamented = true, illuminated = false }: Props) {
  const identifier = useId().replaceAll(':', '');
  const metal = `url(#${identifier}-metal)`;
  const darkMetal = `url(#${identifier}-dark-metal)`;
  return <svg className="medallion" data-sphere={sphere} viewBox="0 0 100 100" aria-hidden="true" focusable="false"
    style={gemstoneAccent ? { color: gemstoneAccent } : undefined}>
    <defs>
      <linearGradient id={`${identifier}-metal`} x1=".12" y1="0" x2=".83" y2="1">
        <stop stopColor="#fff0c2" /><stop offset=".12" stopColor={frameColor} /><stop offset=".29" stopColor="#50412d" />
        <stop offset=".46" stopColor="#e1c18b" /><stop offset=".59" stopColor="#6c5636" /><stop offset=".77" stopColor="#2d2924" /><stop offset="1" stopColor="#bb9861" />
      </linearGradient>
      <linearGradient id={`${identifier}-dark-metal`} x2=".5" y2="1">
        <stop stopColor="#6b6250" /><stop offset=".24" stopColor="#292c29" /><stop offset=".7" stopColor="#111817" /><stop offset="1" stopColor="#554b38" />
      </linearGradient>
      <radialGradient id={`${identifier}-gem`} cx=".33" cy=".2" r=".85">
        <stop stopColor="#e6fff4" stopOpacity=".72" /><stop offset=".16" stopColor="currentColor" />
        <stop offset=".47" stopColor="currentColor" stopOpacity=".63" /><stop offset=".78" stopColor="currentColor" stopOpacity=".23" /><stop offset="1" stopColor="#040b10" />
      </radialGradient>
      <linearGradient id={`${identifier}-glass`} x2=".65" y2="1">
        <stop stopColor="#f5fff9" stopOpacity=".6" /><stop offset=".44" stopColor="#f5fff9" stopOpacity=".03" /><stop offset="1" stopColor="currentColor" stopOpacity=".35" />
      </linearGradient>
      <radialGradient id={`${identifier}-light`}><stop stopColor="currentColor" stopOpacity=".32" /><stop offset=".66" stopColor="currentColor" stopOpacity=".08" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></radialGradient>
      <filter id={`${identifier}-shadow`} x="-.3" y="-.3" width="1.6" height="1.6">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity=".85" />
      </filter>
    </defs>
    {illuminated && <circle cx="50" cy="50" r="50" fill={`url(#${identifier}-light)`} />}
    <g filter={`url(#${identifier}-shadow)`}>
      <circle cx="50" cy="50" r="39" fill={darkMetal} stroke={metal} strokeWidth="2.8" />
      <circle cx="50" cy="50" r="35.5" fill="none" stroke="#070b0b" strokeWidth="2" />
      <circle cx="50" cy="50" r="33.5" fill="#080e11" stroke={metal} strokeWidth="1.4" />
      <path d="M19 45a32 32 0 0 1 26-26M55 81a32 32 0 0 0 26-26" fill="none" stroke="#f4dfae" strokeOpacity=".45" strokeWidth=".7" />
      {ornamented && <g fill={darkMetal} stroke={metal} strokeWidth=".85" strokeLinejoin="round">
        <path d="M50 2 56 12 53 21 50 25 47 21 44 12Z M50 75l3 4 3 9-6 10-6-10 3-9Z M2 50l10-6 9 3 4 3-4 3-9 3Z M75 50l4-3 9-3 10 6-10 6-9-3Z" />
        <path d="M19 18q11 0 15 8l-8 7q-9-6-7-15Zm62 0q2 9-7 15l-8-7q4-8 15-8ZM19 82q-2-9 7-15l8 7q-4 8-15 8Zm62 0q-11 0-15-8l8-7q9 6 7 15Z" />
        <path d="M24 22q-2 8 8 7m-8-7 6 7M76 22q2 8-8 7m8-7-6 7M24 78q-2-8 8-7m-8 7 6-7M76 78q2-8-8-7m8 7-6-7" fill="none" />
        <path d="M12 39q6-1 10-8M61 12q1 6 8 10M88 61q-6 1-10 8M39 88q-1-6-8-10" fill="none" strokeWidth="1.8" />
      </g>}
      <g fill="none" stroke={metal} strokeWidth=".75">
        <path d="m28 18 2 4 4-2m32 0 4 2 2-4M82 28l-4 2 2 4m0 32-2 4 4 2M72 82l-2-4-4 2m-32 0-4-2-2 4M18 72l4-2-2-4m0-32 2-4-4-2" />
        <path d="M37 14l2 5m22 62 2 5M14 63l5-2m62-22 5-2M63 14l-2 5M39 81l-2 5M14 37l5 2m62 22 5 2" />
      </g>
      <path d="m50 21 21 8 8 21-8 21-21 8-21-8-8-21 8-21Z" fill="#070e14" stroke={metal} strokeWidth="1.6" />
      <path d="m50 23 19 8 8 19-8 19-19 8-19-8-8-19 8-19Z" fill={`url(#${identifier}-gem)`} />
      <g stroke="currentColor" strokeOpacity=".25" strokeWidth=".45">
        <path d="m31 31 19 6 19-6-6 19 6 19-19-6-19 6 6-19Z" fill={`url(#${identifier}-glass)`} />
        <path d="M50 23v14L31 31ZM77 50H63l6-19ZM50 77V63l19 6ZM23 50h14l-6 19Z" fill="#000" fillOpacity=".34" />
        <path d="m50 23 19 8-19 6-19-6ZM23 50l8-19 6 19-6 19Z" fill="#effff4" fillOpacity=".11" />
      </g>
      <path d="M33 32q7-8 16-6M27 43l-1 6" fill="none" stroke="#f2fff8" strokeOpacity=".65" strokeWidth="1" strokeLinecap="round" />
      <g fill={metal} stroke="#e2c48e" strokeWidth=".4">
        <path d="m48 18 2-4 2 4-2 9Z M82 48l4 2-4 2-9-2Z M52 82l-2 4-2-4 2-9Z M18 52l-4-2 4-2 9 2Z" />
      </g>
      <g transform="translate(33 33) scale(1.4167)" fill="none" stroke="#03080a" strokeWidth="2.8" strokeOpacity=".72" strokeLinecap="round" strokeLinejoin="round"><SphereSymbol sphere={sphere} /></g>
      <g transform="translate(33 32.5) scale(1.4167)" fill="none" stroke="#f5ead0" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"><SphereSymbol sphere={sphere} /></g>
      <path d="m50 5 2 7-2 4-2-4Z" fill="currentColor" stroke="#f6deb1" strokeWidth=".45" />
    </g>
  </svg>;
}
