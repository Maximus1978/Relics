import { useId } from 'react';
import { MedalCraft } from './MedalCraft';
import { icons, resolveMedal, stageLabels, surfaces, type CraftStage, type MedalIconId, type MedalMaterial } from './medalDesign';
import './medal.css';

type Props = {
  material: MedalMaterial;
  stage: CraftStage;
  iconId: MedalIconId;
  resonance?: number;
  className?: string;
};

export const medalViewport = { x: 64, y: 64, width: 72, height: 72 } as const;
const stoneBlank = 'M100 20 122 24 137 23 153 34 166 45 174 64 179 81 177 98 182 116 174 133 169 149 150 165 136 174 118 176 100 182 82 177 64 175 51 164 35 152 26 132 22 117 23 100 19 82 25 63 35 47 47 36 64 26 81 26Z';
const castBlank = 'M100 19 121 23 137 27 150 35 165 48 174 63 179 81 181 100 177 122 172 137 160 154 144 167 122 177 100 181 78 177 58 168 43 157 30 139 23 120 19 100 22 81 27 64 37 47 51 34 64 27 80 22Z';

export function HabitMedal(props: Props) {
  const { material, stage, iconId, resonance } = resolveMedal(props);
  const surface = surfaces[material];
  const uid = useId();
  const id = (name: string) => uid + '-' + name;
  const fill = (name: string) => 'url(#' + id(name) + ')';
  const blank = material === 'stone' ? stoneBlank : castBlank;
  const angular = material === 'stone' || material === 'bronze';
  const { rim, face, icon } = surface;
  return (
    <svg className={['habit-medal', props.className].filter(Boolean).join(' ')}
      viewBox="0 0 200 200" role="img" aria-labelledby={id('title')}
      data-material={material} data-stage={stage} data-icon={iconId} data-resonance={resonance}>
      <title id={id('title')}>{surface.label} · {stageLabels[stage - 1]} · {icons[iconId].label}</title>
      <defs>
        <linearGradient id={id('rim')} x2=".8" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor={rim[0]} /><stop offset=".29" stopColor={rim[1]} />
          <stop offset=".53" stopColor={rim[2]} /><stop offset=".79" stopColor={rim[3]} />
          <stop offset="1" stopColor={rim[1]} />
        </linearGradient>
        <linearGradient id={id('bevel')} x1="0" y1="1" x2=".85" y2="0">
          <stop stopColor={rim[2]} /><stop offset=".44" stopColor={rim[0]} />
          <stop offset=".65" stopColor={rim[3]} /><stop offset="1" stopColor={rim[1]} />
        </linearGradient>
        <radialGradient id={id('face')} cx=".38" cy=".31" r=".71">
          <stop stopColor={face[0]} /><stop offset=".65" stopColor={face[1]} /><stop offset="1" stopColor={face[2]} />
        </radialGradient>
        <linearGradient id={id('icon')} x2="0" y2="1">
          <stop stopColor={icon[0]} /><stop offset=".45" stopColor={icon[1]} /><stop offset="1" stopColor={icon[2]} />
        </linearGradient>
        <radialGradient id={id('aura')}>
          <stop offset=".54" stopColor={surface.light} stopOpacity="0" />
          <stop offset=".77" stopColor={surface.light} stopOpacity=".42" />
          <stop offset="1" stopColor={surface.light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('inner-light')} cx=".42" cy=".38">
          <stop stopColor={surface.light} stopOpacity=".31" />
          <stop offset="1" stopColor={surface.light} stopOpacity="0" />
        </radialGradient>
        <clipPath id={id('surface')}><circle cx="100" cy="100" r="79" /></clipPath>
        <filter id={id('grain')} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={material === 'stone' ? '.31' : '.66'} numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <circle data-layer="halo" cx="100" cy="100" r="100" fill={fill('aura')} opacity={resonance * .85} />
      <g data-layer="craft">
        {angular ? <path d={blank} fill={fill('rim')} stroke="#151213" strokeWidth="3" />
          : <circle cx="100" cy="100" r="80" fill={fill('rim')} stroke="#171419" strokeWidth="3" />}
        {angular ? <path d={blank} fill="none" stroke={fill('bevel')} strokeWidth="2" />
          : <circle cx="100" cy="100" r="78" fill="none" stroke={fill('bevel')} strokeWidth="3" />}
        <circle cx="100" cy="100" r="72" fill={fill('face')} stroke={rim[2]} strokeWidth="2" />
        <circle cx="100" cy="100" r="63" fill={fill('face')} stroke={fill('bevel')} strokeWidth={material === 'stone' ? 2 : 3} />
        <rect x="20" y="20" width="160" height="160" fill="#777" filter={fill('grain')}
          clipPath={fill('surface')} opacity={material === 'stone' ? '.25' : '.14'} style={{ mixBlendMode: 'overlay' }} />
        <circle cx="100" cy="100" r="59" fill="none" stroke="#170e0c" strokeOpacity=".65" />
        <MedalCraft material={material} stage={stage} surface={surface} metal={fill('rim')} bevel={fill('bevel')} />
      </g>
      <g data-layer="resonance" opacity={resonance}>
        <circle cx="100" cy="100" r="59" fill={fill('inner-light')} />
        <circle cx="100" cy="100" r="74" fill="none" stroke={surface.light} strokeWidth="2" opacity=".55" />
      </g>
      <svg data-layer="icon" {...medalViewport} viewBox="0 0 48 48" aria-hidden="true">
        <path d={icons[iconId].path} className="medal-icon-shadow" transform="translate(0 1.15)" />
        <path d={icons[iconId].path} className="medal-icon-face" stroke={fill('icon')} />
      </svg>
    </svg>
  );
}
