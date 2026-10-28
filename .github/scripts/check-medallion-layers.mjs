import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Developer-only technical proof. These galleries are not application screens. */
export async function checkMedallionLayers({output,evaluate,send,viewport,screenshot}) {
  const manifest=JSON.parse(await readFile('public/art/medallion/v2/manifest.json','utf8'));
  const urls={};
  for (const asset of manifest.assets) {
    const bytes=await readFile(`public/art/medallion/v2/${asset.file}`);
    urls[`/art/medallion/v2/${asset.file}`]=`data:image/png;base64,${bytes.toString('base64')}`;
    await writeFile(join(output,asset.file),bytes);
  }
  const reference=await readFile('docs/visual-references/sanctuary-medallion-source.png');
  const referenceUrl=`data:image/png;base64,${reference.toString('base64')}`;
  await writeFile(join(output,'reference-board.png'),reference);
  const audit=await evaluate(String.raw`(async()=>{
    const urls=${JSON.stringify(urls)};
    const load=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(src.startsWith('blob:')?'Technical SVG could not decode':'Technical PNG could not decode'));img.src=src;});
    const probes={frame:[[627,627],[627,218],[1034,493],[909,939],[337,939],[217,493]],rune:[[560,500],[690,500],[560,740],[690,740]]};
    const assets=[];
    for (const [path,src] of Object.entries(urls)) {
      const img=await load(src);const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
      const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let clear=0,visible=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]>=240)visible++;}
      const key=path.split('/').pop().split('.')[0];const point=(x,y)=>data[(y*canvas.width+x)*4+3];
      assets.push({key,width:canvas.width,height:canvas.height,clear,visible,corners:[point(0,0),point(canvas.width-1,0),point(0,canvas.height-1),point(canvas.width-1,canvas.height-1)],holes:(probes[key]??[]).map(([x,y])=>({x,y,alpha:point(x,y)}))});
    }
    const svg=document.querySelector('.sanctuary-medallion');
    const inverse=svg.getScreenCTM().inverse();
    const anchors=[...svg.querySelectorAll('.medallion-sign')].map(node=>{const point=new DOMPoint(12,12).matrixTransform(inverse.multiply(node.getScreenCTM()));return {sphere:node.dataset.sphere,x:point.x,y:point.y};});
    const imageHrefs=[...svg.querySelectorAll('image')].map(node=>node.getAttribute('href'));
    const clone=svg.cloneNode(true);clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','500');clone.setAttribute('height','500');
    for(const node of clone.querySelectorAll('image'))node.setAttribute('href',urls[node.getAttribute('href')]);
    const css=document.createElementNS('http://www.w3.org/2000/svg','style');
    css.textContent=[...document.styleSheets].flatMap(sheet=>[...sheet.cssRules]).map(rule=>rule.cssText).filter(text=>/^(?:\.(?:sanctuary-medallion|medallion-|wheel-gem)|\[data-sphere)/.test(text)).join('\n');clone.prepend(css);
    const xml=new XMLSerializer().serializeToString(clone);
    const parseError=new DOMParser().parseFromString(xml,'image/svg+xml').querySelector('parsererror');
    if(parseError)throw new Error(parseError.textContent.slice(0,500));
    const blob=URL.createObjectURL(new Blob([xml],{type:'image/svg+xml'}));
    const rendered=await load(blob);const canvas=document.createElement('canvas');canvas.width=500;canvas.height=500;const ctx=canvas.getContext('2d');ctx.drawImage(rendered,0,0,500,500);URL.revokeObjectURL(blob);
    const data=ctx.getImageData(0,0,500,500).data;
    const cavities=[[229,235],[271,235],[229,292],[271,292]].map(([x,y])=>({x,y,alpha:data[(y*500+x)*4+3]}));
    const neutral=canvas.toDataURL('image/png');
    // The glyph-only diagnostic is built from the actual shared SVG paths.
    const signs=svg.cloneNode(true);signs.setAttribute('xmlns','http://www.w3.org/2000/svg');signs.setAttribute('width','500');signs.setAttribute('height','500');
    for(const node of [...signs.children])if(node.tagName!=='defs'&&!node.dataset.layer?.startsWith('sign-'))node.remove();
    signs.querySelectorAll('defs image').forEach(node=>node.remove());
    signs.querySelectorAll('.medallion-sign').forEach(node=>node.setAttribute('style','color:#9c7846'));
    const signBlob=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(signs)],{type:'image/svg+xml'}));
    const signImg=await load(signBlob);ctx.clearRect(0,0,500,500);ctx.drawImage(signImg,0,0,500,500);URL.revokeObjectURL(signBlob);
    return {assets,cavities,imageHrefs,anchors,backdropPseudo:getComputedStyle(document.querySelector('.balance-wheel'),'::before').content,neutral,signs:canvas.toDataURL('image/png')};
  })()`);
  assert.equal(audit.imageHrefs.length,3,'Three independent layer sources, no complete render');
  assert.ok(audit.imageHrefs.every(path=>path.startsWith('/art/medallion/v2/')));
  assert.equal(audit.backdropPseudo,'none','No opaque CSS background disc');
  for(const asset of audit.assets) {
    assert.ok(asset.clear>asset.width*asset.height*.2,`${asset.key} has genuine exterior transparency`);
    assert.ok(asset.visible>50000,`${asset.key} retains solid material`);
    assert.deepEqual(asset.corners,[0,0,0,0]);
    assert.ok(asset.holes.every(point=>point.alpha<=2),`${asset.key} interior holes are transparent`);
  }
  assert.ok(audit.cavities.every(point=>point.alpha===0),'Actual composed SVG interior cavities are zero-alpha');
  const referenceAnchors={body:[248.76,99.56],mind:[408.63,205.86],relationships:[362.77,380.55],work:[139.42,386.63],recovery:[89.78,211.07]};
  audit.registration=audit.anchors.map(point=>({...point,reference:referenceAnchors[point.sphere],error:Math.hypot(point.x-referenceAnchors[point.sphere][0],point.y-referenceAnchors[point.sphere][1])}));
  assert.ok(audit.registration.every(point=>point.error<=5),'Actual composed signs align within 5/500 units of measured reference anchors');
  await writeFile(join(output,'composition-neutral.png'),Buffer.from(audit.neutral.split(',')[1],'base64'));
  await writeFile(join(output,'signs-layer.png'),Buffer.from(audit.signs.split(',')[1],'base64'));
  const cleanAudit={...audit};delete cleanAudit.neutral;delete cleanAudit.signs;
  await writeFile(join(output,'layer-alpha-audit.json'),JSON.stringify(cleanAudit,null,2));

  const css=`body{margin:0;background:#e7e9ed;color:#202630;font:16px system-ui;padding:18px}h1{font-size:24px;margin:0 0 8px}p{margin:6px 0 14px}section{display:grid;gap:12px}article{background:white;border:1px solid #adb4bd;padding:8px;min-width:0}h2{font-size:15px;margin:0 0 6px}.tile{position:relative;aspect-ratio:1;overflow:hidden}.tile>img,.tile>svg,.tile>.ref{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.tile>.ref>svg{width:100%;height:100%}.checker{background:conic-gradient(#e2e5ea 25%,#fff 0 50%,#e2e5ea 0 75%,#fff 0) 0 0/24px 24px}.magenta{background:#b600b6}.white{background:#fff}.ref{opacity:.55}.assembly{opacity:.6}a{color:#254c97}`;
  const sourceSvg=`<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><image href="reference-board.png" x="-20" y="-10" width="2172" height="724" preserveAspectRatio="none"/></svg>`;
  const comparison=`<!doctype html><html><meta charset="utf-8"><title>Sanctuary reference registration</title><style>${css}section{grid-template-columns:repeat(3,1fr)}</style><h1>Reference / independent-layer assembly / registered overlay</h1><p>Technical QA, not a product screen. The original is reference-only; transparent assembly is the actual neutral SVG render. Overlay exposes differences; anchor checks do not claim pixel-identical ornament.</p><section><article><h2>Owner reference (first medallion)</h2><div class="tile">${sourceSvg}</div></article><article><h2>Independent layers on transparency grid</h2><div class="tile checker"><img src="composition-neutral.png"></div></article><article><h2>Registered overlay: reference 55%, assembly 60%</h2><div class="tile checker"><div class="ref">${sourceSvg}</div><img class="assembly" src="composition-neutral.png"></div></article></section><p><a href="layer-alpha-audit.json">Measured alpha</a> · <a href="medallion-geometry-proof.json">Stable four-state geometry</a></p></html>`;
  const gallery=`<!doctype html><html><meta charset="utf-8"><title>Sanctuary technical layers</title><style>${css}section{grid-template-columns:repeat(4,1fr)}.tile{max-height:310px}</style><h1>Independent technical layers — transparency validation</h1><p>Generated frame / rune / neutral stone; separate actual SVG signs. No reference background or full-medallion texture is used.</p><section>${['white','checker','magenta'].flatMap(bg=>['frame','rune','gem','signs-layer'].map(key=>`<article><h2>${key} · ${bg}</h2><div class="tile ${bg}"><img src="${key}.png"></div></article>`)).join('')}</section></html>`;
  await writeFile(join(output,'reference-comparison.html'),comparison);
  await writeFile(join(output,'layer-gallery.html'),gallery);
  const replacements={'reference-board.png':referenceUrl,'composition-neutral.png':audit.neutral,'signs-layer.png':audit.signs,...Object.fromEntries(Object.entries(urls).map(([path,url])=>[path.split('/').pop(),url]))};
  async function captureReport(html,file,width,height) {
    let inlined=html;
    for(const [name,url]of Object.entries(replacements))inlined=inlined.replaceAll(`="${name}"`,`="${url}"`);
    await viewport(width,height);
    await evaluate(`(()=>{const panel=document.createElement('iframe');panel.id='technical-layer-report';panel.style='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:99999';panel.srcdoc=${JSON.stringify(inlined)};document.body.append(panel);})()`);
    for(let attempt=0;attempt<40;attempt++) {
      if(await evaluate(`(()=>{const d=document.querySelector('#technical-layer-report')?.contentDocument;return d?.body?.textContent.length>50&&[...d.images].every(img=>img.complete&&img.naturalWidth>0);})()`))break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    await screenshot(file);
    await evaluate(`document.querySelector('#technical-layer-report').remove()`);
  }
  await captureReport(gallery,'layer-gallery.png',1600,1200);
  await captureReport(comparison,'reference-overlay.png',1600,900);
  await viewport(1440,900);
  await evaluate('window.scrollTo(0,0)');
}
