import { useId } from 'react';
import './rune.css';

/** Original Sanctuary seal: a split vaulted enclosure around an interlocked S.
 * World-specific art only; its light is observation, never earned progression.
 */
export default function SanctuaryRune({ represented }: { represented: number }) {
  const id = `sanctuary-${useId().replaceAll(':', '')}`;
  const state = represented === 0 ? 'subdued' : represented === 5 ? 'full' : represented >= 3 ? 'diverse' : 'partial';
  return <svg className="sanctuary-rune" data-state={state} data-represented={represented} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-metal`} x1=".15" y1="0" x2=".85" y2="1"><stop stopColor="#f9e1a0" /><stop offset=".21" stopColor="#96703b" /><stop offset=".4" stopColor="#ffe3a5" /><stop offset=".56" stopColor="#a16b2f" /><stop offset=".78" stopColor="#e0b775" /><stop offset="1" stopColor="#4b3a24" /></linearGradient>
      <radialGradient id={`${id}-aura`}><stop stopColor="#ffca69" stopOpacity=".55" /><stop offset=".5" stopColor="#df9034" stopOpacity=".14" /><stop offset="1" stopColor="#d17e26" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-edge`} x2=".15" y2="1"><stop stopColor="#fff2c8" /><stop offset=".5" stopColor="#d7a358" /><stop offset="1" stopColor="#6c4829" /></linearGradient>
    </defs>
    <ellipse className="sanctuary-rune__aura" cx="50" cy="50" rx="36" ry="43" fill={`url(#${id}-aura)`} />
    <g className="sanctuary-rune__tracery" fill="none" stroke="#ad8d55" strokeWidth=".25">
      <circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="27.5" />
      <path d="M50 22 76 63 24 63Z M50 78 24 37 76 37Z M26 42q24-19 48 0M26 58q24 19 48 0" />
      <path d="m50 22 2 3-2 3-2-3Zm24 13-3 2 3 2 3-2ZM27 62l-3 2 3 2 3-2Z" />
    </g>
    <g className="sanctuary-rune__metal" fill={`url(#${id}-metal)`} stroke={`url(#${id}-edge)`} strokeWidth=".5" strokeLinejoin="miter">
      <path d="M49 21C48 32 37 37 35 49C35 61 46 66 49 77L47 65C42 58 39 55 39 49C39 39 48 34 49 21Z" />
      <path d="M51 21C52 32 63 37 65 49C65 61 54 66 51 77L53 65C58 58 61 55 61 49C61 39 52 34 51 21Z" />
      <path d="M50 24 46 36 54 44 44 55 51 65 50 77 55 64 48 55 58 44 49 35Z" />
      <path d="m39 39-7 5 6-1 3 2-1-4ZM61 57l7-5-6 1-3-2 1 4Z" />
    </g>
    <g className="sanctuary-rune__engraving" fill="none" stroke="#ffecb5" strokeWidth=".35">
      <path d="m49 29-1 7 8 8-10 11 7 10-2 7M44 36q-14 13-2 27M56 36q14 13 2 27" />
      <path d="M46 31 43 30 44 34M54 66l3 3-1-4M38 45l-2 6 3 7M62 45l2 6-3 7M48 38l-1 2m3 0-1 2m1 15-1 2m3 0-1 2" />
      <path d="M43 40q-6 5-4 12m18-12q6 5 4 12M44 59l3 5m9-5-3 5" stroke="#6c4522" strokeWidth=".28" />
    </g>
    <path className="sanctuary-rune__inlay" d="m50 46 1.8 4-1.8 4-1.8-4Z" fill="#fff0bf" stroke="#eac785" strokeWidth=".45" />
    <g className="sanctuary-rune__embers" fill="#ffe2a0"><circle cx="36" cy="28" r=".35" /><circle cx="64" cy="26" r=".22" /><circle cx="30" cy="61" r=".3" /><circle cx="68" cy="67" r=".35" /><circle cx="38" cy="72" r=".22" /></g>
  </svg>;
}
