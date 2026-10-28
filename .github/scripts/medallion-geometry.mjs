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
      const stableSvg = await evaluate(`(() => {
        const clone = document.querySelector('.sanctuary-medallion').cloneNode(true);
        clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
        clone.removeAttribute('style');
        for (const node of [clone,...clone.querySelectorAll('*')]) {
          for (const name of ['data-state','data-sphere-days','data-represented']) node.removeAttribute(name);
        }
        clone.querySelector('image').setAttribute('href','canonical-source.png');
        const style=document.createElementNS('http://www.w3.org/2000/svg','style');
        style.textContent='.medallion-halo,.medallion-frame-light,.medallion-core-light,.medallion-gem-light{opacity:0}';
        clone.prepend(style);
        return new XMLSerializer().serializeToString(clone);
      })()`);
      const stableSvgSha256 = createHash('sha256').update(stableSvg).digest('hex');
      if (captures.length) assert.deepEqual(geometry, captures[0].geometry, `Fixed medallion geometry in ${state}`);
      if (captures.length) assert.equal(stableSvg,captures[0].stableSvg,`Identical normalized SVG in ${state}`);
      captures.push({state,sha256,geometry,stableSvg,stableSvgSha256});
      await writeFile(join(output, `geometry-${state}.json`), JSON.stringify({state,sha256,geometry},null,2));
      await writeFile(join(output, `geometry-${state}.svg`),stableSvg);
    },
    async finish() {
      assert.deepEqual(captures.map(item => item.state), ['dormant','awakening','harmony','radiance']);
      assert.equal(new Set(captures.map(item => item.sha256)).size,1);
      const source=Buffer.from(await (await fetch('http://127.0.0.1:1420/art/medallion/v1/reference-source.png')).arrayBuffer());
      const sourceSha256=createHash('sha256').update(source).digest('hex');
      assert.equal(sourceSha256,'6168a44f2e36eae80dabdeedec1f1bea6a19bd009be4c7569b43d6e2a330a4e1');
      await writeFile(join(output,'canonical-source.png'),source);
      await writeFile(join(output,'medallion-geometry-proof.json'),JSON.stringify({result:'identical',sourceSha256,method:'Actual SVG geometry plus four byte-identical normalized SVG exports; only light-state attributes removed. Source is the unchanged owner image, first medallion only.',states:captures.map(({state,sha256,stableSvgSha256})=>({state,sha256,stableSvgSha256})),canonicalGeometry:captures[0].geometry},null,2));
    },
  };
}
