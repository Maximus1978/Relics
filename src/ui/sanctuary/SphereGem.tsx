import { useId } from 'react';
import type { SphereId } from '../../domain/activity';
import { SphereSymbol } from '../../components/SphereIcon';
import { sanctuaryArt } from './art';
import './gemstones.css';

/** One ordinary frame/material for every sphere and state; no rarity/evolution. */
export default function SphereGem({ sphere, illuminated, className = '' }: { sphere: SphereId; illuminated: boolean; className?: string }) {
  const id = `gem-${useId().replaceAll(':', '')}`;
  return <span className={`sphere-gem ${className}`} data-sphere={sphere} data-state={illuminated ? 'illuminated' : 'subdued'} aria-hidden="true">
    <svg className="sphere-gem__stone" viewBox="0 0 100 100" focusable="false">
      <defs>
        <radialGradient id={`${id}-depth`} cx=".36" cy=".22" r=".85"><stop className="gem-highlight" /><stop offset=".26" stopColor="var(--gem-color)" /><stop offset=".7" stopColor="var(--gem-deep)" /><stop offset="1" stopColor="#020609" /></radialGradient>
        <linearGradient id={`${id}-bevel`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e8d8a8" /><stop offset=".25" stopColor="#816a45" /><stop offset=".52" stopColor="#302d25" /><stop offset=".76" stopColor="#c2a26a" /><stop offset="1" stopColor="#4e4230" /></linearGradient>
      </defs>
      <circle cx="50" cy="52" r="25.5" fill="#050a0d" stroke={`url(#${id}-bevel)`} strokeWidth="1.8" />
      <path d="M50 27 68 34 75 52 68 70 50 77 32 70 25 52 32 34Z" fill={`url(#${id}-depth)`} stroke="var(--gem-color)" strokeWidth=".65" />
      <g className="sphere-gem__facets" stroke="var(--gem-color)" strokeWidth=".4" strokeLinejoin="round">
        <path d="M32 34 50 27 43 40 34 47Z" fill="#eaffff" fillOpacity=".28" />
        <path d="M50 27 68 34 62 44 43 40Z" fill="#ffffff" fillOpacity=".12" />
        <path d="M68 34 75 52 62 58 62 44Z" fill="#ffffff" fillOpacity=".08" />
        <path d="M75 52 68 70 62 58Z" fill="#000b15" fillOpacity=".5" />
        <path d="M68 70 50 77 56 65 62 58Z" fill="#ffffff" fillOpacity=".16" />
        <path d="M50 77 32 70 39 59 56 65Z" fill="#01070c" fillOpacity=".4" />
        <path d="M32 70 25 52 34 47 39 59Z" fill="#eaffff" fillOpacity=".09" />
        <path d="M25 52 32 34 34 47Z" fill="#ffffff" fillOpacity=".22" />
        <path d="M43 40 62 44 62 58 56 65 39 59 34 47Z" fill="none" opacity=".45" />
      </g>
      <path d="m34 36 12-5m-16 17 3-8m21 32 10-5" fill="none" stroke="#e8ffff" strokeWidth=".6" opacity=".5" />
    </svg>
    <img className="sphere-gem__frame" src={sanctuaryArt.relic} width="384" height="384" alt="" />
    <svg className="sphere-gem__sign" viewBox="0 0 100 100" focusable="false"><g transform="translate(35 37) scale(1.25)" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><SphereSymbol sphere={sphere} /></g></svg>
  </span>;
}
