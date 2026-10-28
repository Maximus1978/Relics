import { useId, type CSSProperties } from 'react';
import type { MedallionIllumination } from '../../domain/medallionIllumination';
import { spheres, type SphereId } from '../../domain/activity';
import { SphereSymbol } from '../../components/SphereIcon';
import { medallionAnchors, medallionLayers } from './medallionLayers';
import './rune.css';

const order = Object.keys(spheres) as SphereId[];
const colors: Record<SphereId,{color:string;channels:string[]}> = {
  body:{color:'#fc394c',channels:['0 .65 1 1','0 .01 .35 1','0 .04 .4 1']},
  mind:{color:'#29a5ff',channels:['0 .02 .35 1','0 .25 .65 1','0 .85 1 1']},
  relationships:{color:'#f04acb',channels:['0 .65 1 1','0 .01 .35 1','0 .4 .9 1']},
  work:{color:'#ffc253',channels:['0 .7 1 1','0 .36 .85 1','0 .02 .3 1']},
  recovery:{color:'#36efa0',channels:['0 .01 .35 1','0 .6 1 1','0 .24 .7 1']},
};

/** Normalize imperceptible generator alpha dust while retaining antialiased edges. */
function CleanAlpha() {
  return <feComponentTransfer><feFuncA type="table" tableValues="0 0 .08 .16 .24 .32 .40 .48 .56 .64 .72 .80 .88 1 1 1" /></feComponentTransfer>;
}

/** Genuine independent transparent layers; the reference board is never sampled. */
export default function SanctuaryRune({ illumination }: { illumination: MedallionIllumination }) {
  const id = `sanctuary-${useId().replaceAll(':','')}`;
  const state = illumination.state;
  const core = state === 'dormant' ? 0 : state === 'awakening' ? .35 + .24 * illumination.sphereDays / 35 : state === 'harmony' ? .76 : 1;
  const frame=medallionLayers.frame, rune=medallionLayers.rune;
  return <svg className="sanctuary-medallion sanctuary-rune" data-state={state} data-sphere-days={illumination.sphereDays} data-represented={illumination.recent.represented}
    style={{'--core-light':core} as CSSProperties} viewBox="0 0 500 500" aria-hidden="true" focusable="false">
    <defs>
      <image id={`${id}-frame`} href={frame.href} x={frame.x} y={frame.y} width={frame.width} height={frame.height} preserveAspectRatio="none" />
      <image id={`${id}-rune`} href={rune.href} x={rune.x} y={rune.y} width={rune.width} height={rune.height} preserveAspectRatio="none" />
      <image id={`${id}-gem`} href={medallionLayers.gem.href} x={-medallionLayers.gem.size/2} y={-medallionLayers.gem.size/2} width={medallionLayers.gem.size} height={medallionLayers.gem.size} />
      <filter id={`${id}-clean`}><CleanAlpha /></filter>
      <filter id={`${id}-stone`} colorInterpolationFilters="sRGB"><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncR type="linear" slope=".64" /><feFuncG type="linear" slope=".72" /><feFuncB type="linear" slope=".76" /></feComponentTransfer><CleanAlpha /></filter>
      <filter id={`${id}-gold`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncR type="gamma" amplitude="1.65" exponent=".65" offset="0" /><feFuncG type="gamma" amplitude="1.65" exponent=".65" offset="0" /><feFuncB type="gamma" amplitude="1.65" exponent=".65" offset="0" /></feComponentTransfer>
        <feComponentTransfer><feFuncR type="table" tableValues="0 .4 .85 1 1" /><feFuncG type="table" tableValues="0 .2 .5 .83 1" /><feFuncB type="table" tableValues="0 .04 .12 .35 .78" /></feComponentTransfer>
        <CleanAlpha />
      </filter>
      <filter id={`${id}-engraving`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .76  0 0 0 0 .38  .32 .60 .08 0 -.32" />
        <feComposite in2="SourceAlpha" operator="in" /><CleanAlpha />
      </filter>
      <radialGradient id={`${id}-halo`}><stop offset=".88" stopColor="#efa63b" stopOpacity="0" /><stop offset=".96" stopColor="#efa63b" stopOpacity=".14" /><stop offset="1" stopColor="#efa63b" stopOpacity="0" /></radialGradient>
      {order.map(sphere=><filter key={sphere} id={`${id}-light-${sphere}`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncR type="gamma" amplitude="1.4" exponent=".8" offset="0" /><feFuncG type="gamma" amplitude="1.4" exponent=".8" offset="0" /><feFuncB type="gamma" amplitude="1.4" exponent=".8" offset="0" /></feComponentTransfer>
        <feComponentTransfer><feFuncR type="table" tableValues={colors[sphere].channels[0]} /><feFuncG type="table" tableValues={colors[sphere].channels[1]} /><feFuncB type="table" tableValues={colors[sphere].channels[2]} /></feComponentTransfer><CleanAlpha />
      </filter>)}
    </defs>
    <g className="medallion-tracery" data-layer="tracery" fill="none" stroke="#a58a57" strokeWidth=".6">
      <circle cx="250" cy="250" r="174" /><path d="M250 99 408 208 138 383 91 208 359 383 250 99M91 208l317 0-49 175-221 0Z M151 164l190 198M349 164 159 362" />
    </g>
    {order.map(sphere=>{
      const anchor=medallionAnchors[sphere];
      return <g className="wheel-gem" key={sphere} data-layer={`stone-${sphere}`} data-sphere={sphere} data-state={illumination.selected.illuminated[sphere]?'illuminated':'subdued'} style={{'--gem-glow':colors[sphere].color} as CSSProperties} transform={`translate(${anchor.x} ${anchor.y})`}>
        <use className="medallion-stone-base" href={`#${id}-gem`} filter={`url(#${id}-stone)`} />
        <g className="medallion-gem-light"><use href={`#${id}-gem`} filter={`url(#${id}-light-${sphere})`} /></g>
      </g>;
    })}
    <g className="medallion-metal-base" data-layer="frame"><use href={`#${id}-frame`} filter={`url(#${id}-clean)`} /></g>
    <g className="medallion-metal-base" data-layer="rune"><use href={`#${id}-rune`} filter={`url(#${id}-clean)`} /></g>
    <g className="medallion-frame-light" data-layer="frame-light"><use href={`#${id}-frame`} filter={`url(#${id}-gold)`} /></g>
    <g className="medallion-engraved-light" data-layer="engraved-light"><use href={`#${id}-frame`} filter={`url(#${id}-engraving)`} /></g>
    <g className="medallion-core-light" data-layer="core-light"><use href={`#${id}-rune`} filter={`url(#${id}-gold)`} /></g>
    {order.map(sphere=>{
      const anchor=medallionAnchors[sphere];
      return <g key={sphere} data-layer={`sign-${sphere}`} data-sphere={sphere} data-state={illumination.selected.illuminated[sphere]?'illuminated':'subdued'} className="medallion-sign" transform={`translate(${anchor.x-23} ${anchor.y-23}) scale(${46/24})`} fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"><SphereSymbol sphere={sphere} /></g>;
    })}
    <circle className="medallion-halo" data-layer="outer-halo" cx="250" cy="250" r="249" fill={`url(#${id}-halo)`} />
  </svg>;
}
