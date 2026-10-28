import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Compare actual mounted SVG construction, ignoring lighting/state/unique IDs.
 * Coordinates, paths, masks, images and element order must all remain fixed.
 */
export function medallionGeometryProof({ evaluate, output }) {
  const captures = [];
  return {
    async capture(state) {
      const geometry = await evaluate(`(() => {
        const svg = document.querySelector('.sanctuary-medallion');
        const attributes = ['viewBox','d','points','x','y','x1','x2','y1','y2','cx','cy','r','rx','ry','width','height','transform','href','preserveAspectRatio','clipPathUnits','maskUnits'];
        return [svg, ...svg.querySelectorAll('*')].filter(node => !node.closest('filter') && !['stop','linearGradient','radialGradient'].includes(node.tagName)).map(node => ({ tag:node.tagName, attributes:Object.fromEntries(attributes.filter(name => node.hasAttribute(name)).map(name => [name,node.getAttribute(name).replace(/#[^)]*(canonical|rune|frame|gem)/g,'#$1')])) }));
      })()`);
      const serialized = JSON.stringify(geometry);
      const sha256 = createHash('sha256').update(serialized).digest('hex');
      if (captures.length) assert.deepEqual(geometry, captures[0].geometry, `Fixed medallion geometry in ${state}`);
      captures.push({state,sha256,geometry});
      await writeFile(join(output, `geometry-${state}.json`), JSON.stringify({state,sha256,geometry},null,2));
    },
    async finish() {
      assert.deepEqual(captures.map(item => item.state), ['dormant','awakening','harmony','radiance']);
      assert.equal(new Set(captures.map(item => item.sha256)).size,1);
      await writeFile(join(output,'medallion-geometry-proof.json'),JSON.stringify({result:'identical',method:'Actual rendered SVG structure and geometric attributes; lighting attributes excluded',states:captures.map(({state,sha256})=>({state,sha256})),canonicalGeometry:captures[0].geometry},null,2));
    },
  };
}
