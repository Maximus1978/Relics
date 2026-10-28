import type { SphereId } from '../../domain/activity.ts';

export const medallionLayers = {
  frame: { href:'/art/medallion/v2/frame.png', x:7, y:14, width:486, height:493 },
  rune: { href:'/art/medallion/v2/rune.png', x:47, y:116, width:407, height:298 },
  gem: { href:'/art/medallion/v2/gem.png', size:92 },
} as const;

// Measured bezel-hole centers in the independently constructed frame master.
const masterCenters: Record<SphereId, [number,number]> = {
  body:[627,218], mind:[1034,493], relationships:[909,939], work:[337,939], recovery:[217,493],
};
export const medallionAnchors = Object.fromEntries(Object.entries(masterCenters).map(([sphere,[x,y]]) => [sphere, {
  x:medallionLayers.frame.x+x*medallionLayers.frame.width/1254,
  y:medallionLayers.frame.y+y*medallionLayers.frame.height/1254,
}])) as Record<SphereId,{x:number;y:number}>;

// Reference-only icon-color centroids, in the reference's x=20/y=10/500-square viewport.
// Registration checks do not claim pixel-identical surface ornament or material.
export const medallionReferenceAnchors: Record<SphereId,{x:number;y:number}> = {
  body:{x:248.76,y:99.56}, mind:{x:408.63,y:205.86}, relationships:{x:362.77,y:380.55},
  work:{x:139.42,y:386.63}, recovery:{x:89.78,y:211.07},
};
