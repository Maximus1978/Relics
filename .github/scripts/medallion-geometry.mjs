import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
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
        for (const image of clone.querySelectorAll('image')) image.setAttribute('href',image.getAttribute('href').split('/').pop());
        const style=document.createElementNS('http://www.w3.org/2000/svg','style');
        style.textContent='svg{color:#c7bfad}.medallion-tracery{opacity:.3}.medallion-halo,.medallion-frame-light,.medallion-core-light,.medallion-gem-light,.medallion-engraved-light{opacity:0}';
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
      const manifest=JSON.parse(await readFile('public/art/medallion/v2/manifest.json','utf8'));
      for (const asset of manifest.assets) {
        const bytes=Buffer.from(await (await fetch(`http://127.0.0.1:1420/art/medallion/v2/${asset.file}`)).arrayBuffer());
        assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
        await writeFile(join(output,asset.file),bytes);
      }
      await writeFile(join(output,'medallion-geometry-proof.json'),JSON.stringify({result:'identical',referenceRuntime:false,assets:manifest.assets,method:'Actual independent asset/SVG geometry and four byte-identical normalized SVG exports. Lighting metadata excluded; no reference-board pixels in runtime.',states:captures.map(({state,sha256,stableSvgSha256})=>({state,sha256,stableSvgSha256})),canonicalGeometry:captures[0].geometry},null,2));
    },
  };
}
