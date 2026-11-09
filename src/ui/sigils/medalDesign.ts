export const materials = ['stone', 'copper', 'bronze', 'silver', 'gold', 'platinum'] as const;
export type MedalMaterial = typeof materials[number];
export type CraftStage = 1 | 2 | 3;

type Surface = {
  label: string;
  craft: string;
  rim: [string, string, string, string];
  face: [string, string, string];
  engraving: string;
  icon: [string, string, string];
  light: string;
};

export const surfaces = {
  stone: {
    label: 'Камень', craft: 'Сколы, насечки и резьба по камню',
    rim: ['#c8b79f', '#746b5b', '#3d3934', '#968069'],
    face: ['#6b6257', '#3d3933', '#262622'], engraving: '#b5a385',
    icon: ['#eee0c7', '#baa889', '#7b6a57'], light: '#ffce9a',
  },
  copper: {
    label: 'Медь', craft: 'Ковка, заклёпки и чеканка',
    rim: ['#ffe0a8', '#b56942', '#5d2922', '#d48a57'],
    face: ['#82482f', '#4a2a23', '#2f1d1a'], engraving: '#f2aa75',
    icon: ['#ffd4a5', '#e79a65', '#9a4f38'], light: '#ffad78',
  },
  bronze: {
    label: 'Бронза', craft: 'Литые рёбра, рельеф и узор',
    rim: ['#f9d89d', '#a37c42', '#4a3723', '#b28f56'],
    face: ['#71603d', '#413727', '#2c271c'], engraving: '#d8b77b',
    icon: ['#ffdfaa', '#c8a265', '#8b6b3d'], light: '#ffd598',
  },
  silver: {
    label: 'Серебро', craft: 'Точная оправа, завитки и филигрань',
    rim: ['#fff5e9', '#a2a8ad', '#424b55', '#c1baba'],
    face: ['#5e6871', '#343942', '#252730'], engraving: '#d8dce1',
    icon: ['#fff7e9', '#c3c9d1', '#788291'], light: '#cfe3ff',
  },
  gold: {
    label: 'Золото', craft: 'Гранёная оправа, лавры и гравировка',
    rim: ['#ffefb6', '#daa345', '#664419', '#e5b955'],
    face: ['#83612e', '#49371d', '#30271a'], engraving: '#ffe194',
    icon: ['#fff1b2', '#e8b754', '#aa742c'], light: '#ffdf83',
  },
  platinum: {
    label: 'Платина', craft: 'Двойная оправа, инкрустация и ажур',
    rim: ['#fff7dc', '#b4bac2', '#48576a', '#d9c8a5'],
    face: ['#6e7681', '#393d49', '#232936'], engraving: '#efdeba',
    icon: ['#fff4d5', '#cbd3de', '#858c9e'], light: '#9fddff',
  },
} satisfies Record<MedalMaterial, Surface>;

export const stageLabels = ['Основа', 'Отделка', 'Мастерская работа'] as const;

export const icons = {
  sigil: { label: 'Печать', path: 'M24 5 39 24 24 43 9 24Z M24 12 31 24 24 36 17 24Z M24 5v7m0 24v7' },
  walk: { label: 'Прогулка', path: 'M27 9a4 4 0 1 1-8 0 4 4 0 1 1 8 0ZM23 16l-4 12-9 11m9-11 9 3 5 10M23 16l7 7 8 1M23 16l-9 4-4 7' },
  strength: { label: 'Тренировка', path: 'M16 24h16M8 18v12m8-16v20m16-20v20m8-16v12M5 24h3m32 0h3' },
  book: { label: 'Чтение', path: 'M24 15c-6-5-12-5-18-3v24c6-2 12-2 18 3 6-5 12-5 18-3V12c-6-2-12-2-18 3v24M11 19c3-1 6 0 9 2m-9 5c3-1 6 0 9 2m8-7c3-2 6-3 9-2m-9 9c3-2 6-3 9-2' },
  language: { label: 'Языки', path: 'M6 9h31v20H23l-9 7v-7H6Zm8 14 4-9 4 9m-7-2h6m5-5h6m-6 6h6m-9 14h12l7 5V20' },
  music: { label: 'Музыка', path: 'M20 31V11l18-5v21M20 17l18-5M20 31a7 5-18 1 1-14 4 7 5-18 0 1 14-4Zm18-4a7 5-18 1 1-14 4 7 5-18 0 1 14-4Z' },
  bicycle: { label: 'Велосипед', path: 'M19 31a7 7 0 1 1-14 0 7 7 0 1 1 14 0Zm24 0a7 7 0 1 1-14 0 7 7 0 1 1 14 0ZM12 31l9-15 7 15H12m16 0 6-17h5m-21 2h7' },
  conversation: { label: 'Разговор', path: 'M6 10h26v18H19l-8 6v-6H6Zm7 9h12m9-3h8v18h-5v7l-8-7h-6v-3' },
  work: { label: 'Работа', path: 'M6 15h36v23H6Zm12 0V9h12v6M6 23l18 5 18-5m-22 3v4h8v-4' },
  sleep: { label: 'Отдых', path: 'M31 8A16 16 0 1 0 40 31 16 16 0 0 1 31 8Zm6 3v9m-4-4h8' },
  meditation: { label: 'Медитация', path: 'M24 38C13 34 12 22 24 10c12 12 11 24 0 28Zm0 0C12 40 6 33 5 22c7 0 11 3 14 8m5 8c12 2 18-5 19-16-7 0-11 3-14 8' },
  creativity: { label: 'Творчество', path: 'm14 31 18-19 5 5-18 19-8 3Zm15-16 5 5M36 6v5m-2-2h5M15 10v8m-4-4h8m19 14v8m-4-4h8' },
} as const;
export type MedalIconId = keyof typeof icons;

export function resolveMedal({
  material, stage, iconId, resonance,
}: { material?: unknown; stage?: unknown; iconId?: unknown; resonance?: unknown }): { material: MedalMaterial; stage: CraftStage; iconId: MedalIconId; resonance: number } {
  return {
    material: typeof material === 'string' && Object.hasOwn(surfaces, material)
      ? material as MedalMaterial : 'stone',
    stage: stage === 2 || stage === 3 ? stage : 1,
    iconId: typeof iconId === 'string' && Object.hasOwn(icons, iconId)
      ? iconId as MedalIconId : 'sigil',
    resonance: typeof resonance === 'number' && Number.isFinite(resonance)
      ? Math.min(1, Math.max(0, resonance)) : 0,
  };
}
