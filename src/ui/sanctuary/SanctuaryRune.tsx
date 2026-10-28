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
      <path d="M49 21C47 35 36 34 32 48L38 45C37 59 46 65 49 77L44 57 40 49C39 38 47 39 49 21Z" />
      <path d="M51 21C53 35 64 34 68 48L62 45C63 59 54 65 51 77L56 57 60 49C61 38 53 39 51 21Z" />
      <path d="m50 23-7 13 11 9-12 11 9 10-1 13 7-15-10-9 12-11-11-9Z" />
      <path d="m36 39-5 5 5 2 4-3ZM64 56l5-5-5-2-4 3Z" />
    </g>
    <g className="sanctuary-rune__engraving" fill="none" stroke="#ffecb5" strokeWidth=".35">
      <path d="m49 28-3 8 11 8-12 11 9 10-3 8M44 38q-10 5-4 16l5 9M56 38q10 5 4 16l-5 9" />
      <path d="M46 31 43 30 44 34M54 66l3 3-1-4" />
    </g>
    <path className="sanctuary-rune__inlay" d="m50 44 3 6-3 6-3-6Z" fill="#fff0bf" stroke="#eac785" strokeWidth=".45" />
    <g className="sanctuary-rune__embers" fill="#ffe2a0"><circle cx="36" cy="28" r=".35" /><circle cx="64" cy="26" r=".22" /><circle cx="30" cy="61" r=".3" /><circle cx="68" cy="67" r=".35" /><circle cx="38" cy="72" r=".22" /></g>
  </svg>;
}
