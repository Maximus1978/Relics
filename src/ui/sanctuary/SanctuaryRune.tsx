import { useId, type CSSProperties } from 'react';
import type { MedallionIllumination } from '../../domain/medallionIllumination';
import { spheres, type SphereId } from '../../domain/activity';
import './rune.css';

const gems: Record<SphereId, { x: number; y: number; color: string; channels: string[] }> = {
  body: { x:250, y:100, color:'#fc394c', channels:['0 .65 1 1','0 .01 .35 1','0 .04 .4 1'] },
  mind: { x:400, y:204, color:'#29a5ff', channels:['0 .02 .35 1','0 .25 .65 1','0 .85 1 1'] },
  relationships: { x:365, y:386, color:'#f04acb', channels:['0 .65 1 1','0 .01 .35 1','0 .4 .9 1'] },
  work: { x:134, y:386, color:'#ffc253', channels:['0 .7 1 1','0 .36 .85 1','0 .02 .3 1'] },
  recovery: { x:90, y:204, color:'#36efa0', channels:['0 .01 .35 1','0 .6 1 1','0 .24 .7 1'] },
};
const order = Object.keys(spheres) as SphereId[];
const runeRegion = 'M250 138 266 187 293 216 311 233 315 251 372 265 313 279 306 307 279 332 250 390 221 332 194 307 188 279 130 265 188 251 193 232 222 207 236 186Z';

/** The first, dormant medallion in the owner's PNG is the single canonical object.
 * All geometry, texture, engravings and signs come from that identical source.
 * Masks only select light regions; no state selects another illustration.
 */
export default function SanctuaryRune({ illumination }: { illumination: MedallionIllumination }) {
  const id = `sanctuary-${useId().replaceAll(':','')}`;
  const state = illumination.state;
  const core = state === 'dormant' ? 0 : state === 'awakening' ? .35 + .24 * illumination.sphereDays / 35 : state === 'harmony' ? .76 : 1;
  return <svg className="sanctuary-medallion sanctuary-rune" data-state={state} data-sphere-days={illumination.sphereDays} data-represented={illumination.recent.represented}
    style={{'--core-light':core} as CSSProperties} viewBox="0 0 500 500" aria-hidden="true" focusable="false">
    <defs>
      <image id={`${id}-canonical`} href="/art/medallion/v1/reference-source.png" x="-20" y="-10" width="2172" height="724" preserveAspectRatio="none" />
      <radialGradient id={`${id}-edge`}><stop offset=".9" stopColor="white" /><stop offset="1" stopColor="black" /></radialGradient>
      <mask id={`${id}-object`}><circle cx="250" cy="250" r="248" fill={`url(#${id}-edge)`} /></mask>
      <clipPath id={`${id}-rune`}><path d={runeRegion} /></clipPath>
      <mask id={`${id}-frame`}>
        <circle cx="250" cy="250" r="192" fill="none" stroke="white" strokeWidth="112" />
        <path d={runeRegion} fill="black" />
        {order.map(sphere=><circle key={sphere} cx={gems[sphere].x} cy={gems[sphere].y} r="47" fill="black" />)}
      </mask>
      <filter id={`${id}-gold`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  .32 .60 .08 0 -.05" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncR type="gamma" amplitude="1.65" exponent=".65" offset="0" /><feFuncG type="gamma" amplitude="1.65" exponent=".65" offset="0" /><feFuncB type="gamma" amplitude="1.65" exponent=".65" offset="0" /><feFuncA type="gamma" amplitude="2.6" exponent=".7" offset="0" /></feComponentTransfer>
        <feComponentTransfer><feFuncR type="table" tableValues="0 .4 .85 1 1" /><feFuncG type="table" tableValues="0 .2 .5 .83 1" /><feFuncB type="table" tableValues="0 .04 .12 .35 .78" /></feComponentTransfer>
      </filter>
      <radialGradient id={`${id}-halo`}><stop offset=".82" stopColor="#efad47" stopOpacity="0" /><stop offset=".94" stopColor="#efa63b" stopOpacity=".16" /><stop offset="1" stopColor="#efa63b" stopOpacity="0" /></radialGradient>
      {order.map(sphere=>{
        const gem = gems[sphere];
        return <g key={sphere}>
          <clipPath id={`${id}-gem-${sphere}`}><path d={`M${gem.x} ${gem.y-47} ${gem.x+33} ${gem.y-33} ${gem.x+46} ${gem.y} ${gem.x+32} ${gem.y+33} ${gem.x} ${gem.y+46} ${gem.x-32} ${gem.y+33} ${gem.x-46} ${gem.y} ${gem.x-33} ${gem.y-33}Z`} /></clipPath>
          <filter id={`${id}-light-${sphere}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer><feFuncR type="gamma" amplitude="1.4" exponent=".8" offset="0" /><feFuncG type="gamma" amplitude="1.4" exponent=".8" offset="0" /><feFuncB type="gamma" amplitude="1.4" exponent=".8" offset="0" /></feComponentTransfer>
            <feComponentTransfer><feFuncR type="table" tableValues={gem.channels[0]} /><feFuncG type="table" tableValues={gem.channels[1]} /><feFuncB type="table" tableValues={gem.channels[2]} /></feComponentTransfer>
          </filter>
        </g>;
      })}
    </defs>
    <g mask={`url(#${id}-object)`}>
      <use className="medallion-base" href={`#${id}-canonical`} />
      <g className="medallion-frame-light"><use href={`#${id}-canonical`} mask={`url(#${id}-frame)`} filter={`url(#${id}-gold)`} /></g>
      <g className="medallion-core-light"><g clipPath={`url(#${id}-rune)`}><use href={`#${id}-canonical`} filter={`url(#${id}-gold)`} /></g></g>
      {order.map(sphere=><g className="wheel-gem" key={sphere} data-sphere={sphere} data-state={illumination.selected.illuminated[sphere] ? 'illuminated':'subdued'} style={{'--gem-glow':gems[sphere].color} as CSSProperties}>
        <g className="medallion-gem-light"><g clipPath={`url(#${id}-gem-${sphere})`}><use href={`#${id}-canonical`} filter={`url(#${id}-light-${sphere})`} /></g></g>
      </g>)}
    </g>
    <circle className="medallion-halo" cx="250" cy="250" r="249" fill={`url(#${id}-halo)`} mask={`url(#${id}-frame)`} />
  </svg>;
}
