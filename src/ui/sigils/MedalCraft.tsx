import type { CraftStage, MedalMaterial, surfaces } from './medalDesign';

type Props = {
  material: MedalMaterial;
  stage: CraftStage;
  surface: typeof surfaces[MedalMaterial];
  metal: string;
  bevel: string;
};

const turns = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, index) => offset + index * 360 / count);

function Repeat({ angles, children }: { angles: number[]; children: React.ReactNode }) {
  return angles.map(angle => <g key={angle} transform={'rotate(' + angle + ' 100 100)'}>{children}</g>);
}

function Setting({ metal, bevel, jewel }: { metal: string; bevel: string; jewel?: boolean }) {
  return (
    <>
      <path d="M100 5 106 16 117 25 109 31 100 43 91 31 83 25 94 16Z"
        fill={metal} stroke="#1d1515" strokeWidth="2" />
      <path d="M100 8 104 20 114 25 103 28 100 39 96 27 86 25 96 20Z"
        fill={bevel} stroke="#f7ddb2" strokeOpacity=".65" />
      <path d="m100 11 3 11 8 3-10 2-1 11-4-12 4-3Z"
        fill={jewel ? '#52c0ec' : '#1d171c'} opacity={jewel ? 1 : .44} />
      <path d="m100 11 1 13 10 1-10 2-1 11" fill="none"
        stroke={jewel ? '#dbf8ff' : '#fff2c6'} strokeWidth="1.1" />
    </>
  );
}

function Leaves({ fill, tint }: { fill: string; tint: string }) {
  return (
    <Repeat angles={turns(20, 9)}>
      <path d="M99 36c-9-1-13-5-15-11 8 1 14 4 16 10 2-5 7-9 14-10-2 6-7 10-15 11Z"
        fill={fill} stroke="#3c2b1c" strokeWidth="1.15" />
      <path d="m86 27 13 8 12-8" fill="none" stroke={tint} opacity=".75" strokeWidth=".8" />
    </Repeat>
  );
}

export function MedalCraft({ material, stage, surface, metal, bevel }: Props) {
  const { engraving: ink, rim } = surface;
  switch (material) {
    case 'stone':
      return (
        <>
          <Repeat angles={turns(11, 4)}>
            <path d="m84 29 10-4 9 1 10 3 4 6-11 3-12-3-9 4-7-3Z" fill={metal} stroke="#342b27" strokeWidth="2" />
            <path d="m85 30 9-4 9 1 9 3m-17 1 8-1 8 4" fill="none" stroke={ink} strokeWidth="1.3" />
            <path d="m104 34 7 5-4 4 5 7m-25-9-4 5 2 5" fill="none" stroke="#282323" strokeWidth="1.5" />
          </Repeat>
          <path d="M57 39 64 52 58 61 67 74 61 84M156 56l-6 13 7 10-11 9M38 132l12-7 8 7-2 12 9 9m56 8 7-10-7-13 6-9"
            fill="none" stroke="#211e1c" strokeWidth="2.4" />
          <path d="m66 52 9 4 1 7 9 7m66 44-10 6 3 8-11 12m-87-37 10 5 1 8 10 6m43 31 2-11 7-4"
            fill="none" stroke="#271f1e" strokeWidth="3.2" />
          <path d="m66 52 9 4 1 7 9 7m66 44-10 6 3 8-11 12m-87-37 10 5 1 8 10 6m43 31 2-11 7-4"
            fill="none" stroke={ink} opacity=".57" strokeWidth=".8" transform="translate(-1 1)" />
          {stage >= 2 && <Repeat angles={turns(8)}>
            <path d="m100 17 10 13-10 13-10-13Z" fill={bevel} stroke="#3e352f" strokeWidth="2" />
            <path d="m100 19 1 12-10-1 9 11" fill="none" stroke={ink} strokeWidth="1.4" />
          </Repeat>}
          {stage === 3 && <>
            <circle cx="100" cy="100" r="56" fill="none" stroke="#302720" strokeWidth="7" />
            <circle cx="100" cy="100" r="58" fill="none" stroke={ink} strokeWidth="2.3" strokeDasharray="21 8 4 8" />
            <circle cx="100" cy="100" r="49" fill="none" stroke={rim[3]} strokeWidth="1.5" opacity=".85" />
            <Repeat angles={turns(12, 15)}>
              <path d="m96 52 4-6 4 6m-4-6v10m-5 0h10" stroke="#241c1b" strokeWidth="3" fill="none" />
              <path d="m96 52 4-6 4 6m-4-6v10m-5 0h10" stroke={ink} strokeWidth="1.65" fill="none" />
            </Repeat>
          </>}
        </>
      );
    case 'copper':
      return (
        <>
          <circle cx="100" cy="100" r="74" fill="none" stroke="#42231b" strokeWidth="4" />
          <circle cx="100" cy="100" r="75" fill="none" stroke={ink} strokeWidth="1" opacity=".77" />
          <Repeat angles={turns(18, 10)}>
            <ellipse cx="100" cy="43" rx="4.5" ry="2.8" fill="#3f211a" opacity=".36" />
            <path d="M95 39q5-4 10 0m-8 5 3-2 4 2" stroke={ink} opacity=".48" fill="none" />
            <path d="m92 27 3-2 3 1m5 1 4-2 4 2" stroke={rim[2]} opacity=".8" fill="none" />
          </Repeat>
          {stage >= 2 && <Repeat angles={turns(16, 11.25)}>
            <circle cx="100" cy="30" r="3.4" fill={bevel} stroke="#50261c" strokeWidth="1.2" />
            <circle cx="99.3" cy="29.3" r="1.1" fill={rim[0]} opacity=".8" />
          </Repeat>}
          {stage === 3 && <>
            <Repeat angles={turns(4)}><Setting metal={metal} bevel={bevel} /></Repeat>
            <Repeat angles={turns(12, 15)}>
              <path d="M93 49q-3-6 2-8 6-2 6 4-1 4-4 1m4-1q2-5 7-3" fill="none" stroke={ink} strokeWidth="1.3" />
            </Repeat>
          </>}
        </>
      );
    case 'bronze':
      return (
        <>
          <Repeat angles={turns(12)}>
            <path d="m88 26 12-7 12 7-4 12-8 5-8-5Z" fill={metal} stroke="#38291d" strokeWidth="2" />
            <path d="m90 27 10-6 10 6-10 4v10" fill="none" stroke={ink} strokeWidth="1.8" />
            <path d="m100 31 10-4-4 10-6 4Z" fill="#231a16" opacity=".34" />
          </Repeat>
          <Repeat angles={turns(8, 22.5)}>
            <path d="m89 45 11-6 11 6-11 10Z" fill="#382c21" stroke={ink} strokeWidth="1" opacity=".8" />
            <path d="m94 45 6-3 6 3-6 5Z" fill={bevel} />
          </Repeat>
          {stage >= 2 && <Repeat angles={turns(4)}><Setting metal={metal} bevel={bevel} /></Repeat>}
          {stage === 3 && <>
            <Repeat angles={turns(16, 11.25)}>
              <path d="M92 50q-3-8 1-11 1 6 7 10 5-4 7-10 4 4 1 11-4 5-8 6-4-1-8-6Z"
                fill={metal} stroke={ink} strokeWidth="1" />
              <path d="m100 49-1 6 3-1" stroke={rim[2]} fill="none" />
            </Repeat>
            <circle cx="100" cy="100" r="46" fill="none" stroke={ink} strokeDasharray="3 4" opacity=".75" />
          </>}
        </>
      );
    case 'silver':
      return (
        <>
          <circle cx="100" cy="100" r="74" fill="none" stroke={bevel} strokeWidth="2" />
          <Repeat angles={turns(8, 22.5)}>
            <path d="M83 41c-3-9 8-15 17-13 8-2 19 4 16 13-5-7-11-8-16-5-5-3-11-2-17 5Z"
              fill={metal} stroke="#303841" strokeWidth="1.6" />
            <path d="M83 41q5-13 17-12 11-1 16 12" fill="none" stroke={ink} strokeWidth="1.1" />
          </Repeat>
          {stage >= 2 && <Repeat angles={turns(8)}>
            <path d="M86 50c-1-8 8-11 12-6 2 3-1 6-3 5-3-1-1-4 1-3m6-2c4-5 13-2 12 6m-12-6c-2 3 1 6 3 5 3-1 1-4-1-3"
              fill="none" stroke={ink} strokeWidth="2" />
          </Repeat>}
          {stage === 3 && <>
            <Repeat angles={turns(4)}><Setting metal={metal} bevel={bevel} /></Repeat>
            <Repeat angles={turns(16, 11.25)}>
              <path d="M93 57c5-2 2-9 7-10 5 1 2 8 7 10-3 0-5-1-7-4-2 3-4 4-7 4Z"
                fill={bevel} stroke="#424a56" strokeWidth="1.3" />
            </Repeat>
          </>}
        </>
      );
    case 'gold':
      return (
        <>
          <circle cx="100" cy="100" r="76" fill="none" stroke="#f0c664" strokeWidth="1.3" />
          <circle cx="100" cy="100" r="68" fill="none" stroke={bevel} strokeWidth="3" />
          <Repeat angles={turns(8, 22.5)}>
            <path d="m100 25 8 9-8 8-8-8Z" fill={bevel} stroke="#714f22" />
            <path d="m100 26 1 8 6 0-7 6" fill="none" stroke={ink} />
          </Repeat>
          <Repeat angles={turns(4)}><Setting metal={metal} bevel={bevel} /></Repeat>
          {stage >= 2 && <Leaves fill={bevel} tint={ink} />}
          {stage === 3 && <>
            <Repeat angles={turns(8, 22.5)}>
              <path d="m100 14 5 11 9 4-9 2-5 10-4-10-9-2 9-4Z" fill={bevel} stroke="#936021" />
              <path d="m100 15 1 13 10 1-11 2-1 8" fill="none" stroke="#fff1b2" />
            </Repeat>
            <Repeat angles={turns(16)}>
              <path d="m95 50 5-5 5 5-5 8Zm5-5v13" fill="none" stroke={ink} strokeWidth="1.1" />
            </Repeat>
          </>}
        </>
      );
    case 'platinum':
      return (
        <>
          <circle cx="100" cy="100" r="77" fill="none" stroke="#e6d0a1" strokeWidth="1.7" />
          <circle cx="100" cy="100" r="68" fill="none" stroke="#7a9eb6" strokeWidth="2.6" />
          <Repeat angles={turns(8, 22.5)}>
            <path d="M76 32q15-15 24 1 9-16 24-1-13-3-24 16-11-19-24-16Z" fill={metal} stroke="#394352" strokeWidth="1.5" />
            <path d="M76 32q14-11 24 12 10-23 24-12" fill="none" stroke={ink} strokeWidth="1.25" />
          </Repeat>
          <Repeat angles={turns(4)}><Setting metal={metal} bevel={bevel} jewel /></Repeat>
          {stage >= 2 && <Repeat angles={turns(8, 22.5)}>
            <path d="m100 13 4 11 10 4-10 4-4 11-4-11-10-4 10-4Z" fill={bevel} stroke="#505e6e" />
            <path d="m100 19 1 8 6 1-7 3-1 7-2-9Z" fill="#79b9da" stroke="#e5f1e9" strokeWidth=".7" />
          </Repeat>}
          {stage === 3 && <>
            <Repeat angles={turns(16, 11.25)}>
              <path d="M92 53q-2-8 5-11l3 5 3-5q7 3 5 11-4 4-8 1-4 3-8-1Z" fill={bevel} stroke="#54647b" />
              <path d="m96 49 4 3 4-3m-4 3v7" fill="none" stroke={ink} strokeWidth="1.15" />
              <circle cx="100" cy="59" r="1.5" fill="#acdcf6" />
            </Repeat>
            <circle cx="100" cy="100" r="45" fill="none" stroke="#eed8b0" strokeDasharray="1 3" />
          </>}
        </>
      );
  }
}
