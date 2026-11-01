import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
export async function checkLifeRhythm({send,evaluate,until,click,viewport,output}) {
 const read=()=>evaluate('document.querySelector(".rhythm-quality").textContent');
 async function capture(name,includeInventory=false) {
  await evaluate(includeInventory?'document.querySelector("#inventory").scrollIntoView({block:"start"})':'document.querySelector("#life-rhythm").scrollIntoView({block:"start"})');
  const image=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await writeFile(join(output,name),Buffer.from(image.data,'base64'));
 }
 async function load(kind) {await send('Page.navigate',{url:'http://127.0.0.1:1420/?rhythmFixture='+kind});await until('document.querySelectorAll(".relic-item").length===6&&!!document.querySelector(".rhythm-quality")','Synthetic '+kind+' journal is loaded through the real preview repository');}
 await viewport(1440,1150);await load('mixed');
 await until('!!document.querySelector(".rhythm-plot canvas")','Actual uPlot canvas renders snapshot series');
 const placement=await evaluate('(()=>{const i=document.querySelector("#inventory").getBoundingClientRect(),r=document.querySelector("#life-rhythm").getBoundingClientRect(),c=document.querySelector("#chronicle");return {below:r.top>=i.bottom,chronicle:c===null,shrines:document.querySelectorAll(".sphere-shrine").length};})()');
 assert.deepEqual(placement,{below:true,chronicle:true,shrines:5});
 assert.deepEqual(await evaluate('[...document.querySelectorAll(".rhythm-quality strong")].map(x=>Number(x.textContent))'),[24,22,10,2]);
 assert.deepEqual(await evaluate('[...document.querySelectorAll(".rhythm-legend output")].map(x=>x.textContent)'),['20','64','10','22','62']);
 await until('document.querySelector(".rhythm-explanation").textContent.includes("неполная")&&document.querySelector(".rhythm-explanation").textContent.includes("по умолчанию")','Mixed provenance and unknown exclusions are disclosed');
 await capture('rhythm-four-weeks-inventory.png',true);await capture('rhythm-four-weeks.png');
 await click('.rhythm-table>summary');
 assert.equal(await evaluate('document.querySelectorAll(".rhythm-table tbody tr").length'),4);
 await until('[...document.querySelectorAll(".rhythm-table tbody tr")].every(r=>r.children.length===7)','Accessible weekly table includes all five spheres and quality counts');
 await capture('rhythm-mixed-quality-table.png');
 await click('[data-mode=shares]');
 await until('document.querySelector("[data-mode=shares]").getAttribute("aria-pressed")==="true"','Distribution mode control works');
 const outputs=await evaluate('[...document.querySelectorAll(".rhythm-legend output")].map(x=>x.textContent)');
 assert.ok(outputs.every(t=>t.includes('%')));
 const before=await read();const canvasBefore=await evaluate('document.querySelector(".rhythm-plot canvas").toDataURL()');
 await click('.rhythm-legend [data-sphere=mind] input');
 await until('!document.querySelector(".rhythm-plot").dataset.visibleSeries.includes("Разум")','Legend removes the actual chart series');
 assert.equal(await read(),before);assert.deepEqual(await evaluate('[...document.querySelectorAll(".rhythm-legend output")].map(x=>x.textContent)'),outputs);
 assert.notEqual(await evaluate('document.querySelector(".rhythm-plot canvas").toDataURL()'),canvasBefore);
 await click('.rhythm-legend [data-sphere=mind] input');
 await until('document.querySelector(".rhythm-plot").dataset.visibleSeries.includes("Разум")','Legend restores chart series without changing denominator');
 await capture('rhythm-distribution.png');
 const ax=await send('Accessibility.getFullAXTree');assert.ok(ax.nodes.some(n=>n.role?.value==='checkbox'&&n.name?.value?.includes('Разум')));assert.ok(ax.nodes.some(n=>n.role?.value==='table'));
 await evaluate('document.querySelector(".rhythm-period select").focus()');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
 await until('document.querySelector(".rhythm-period select").value==="8"&&document.querySelectorAll(".rhythm-table tbody tr").length===8','Keyboard period selector switches to eight complete weeks');
 assert.deepEqual(await evaluate('[...document.querySelectorAll(".rhythm-quality strong")].map(x=>Number(x.textContent))'),[48,44,20,4]);
 await capture('rhythm-eight-weeks.png');
 await viewport(390,1100);await until('document.documentElement.scrollWidth<=innerWidth','Eight-week chart remains inside a narrow window');await capture('rhythm-eight-weeks-narrow.png');await viewport(1440,1150);
 // All-hidden mode is explicit, no changed data and fully keyboard reversible.
 for(const sphere of ['body','mind','relationships','work','recovery'])await click('.rhythm-legend [data-sphere='+sphere+'] input');
 await until('document.querySelector(".rhythm-empty")?.textContent.includes("Все линии скрыты")','Hiding all series presents a truthful reversible state');
 await evaluate('document.querySelector(".rhythm-legend [data-sphere=mind] input").focus()');
 for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:' ',code:'Space',windowsVirtualKeyCode:32});
 await until('document.querySelector(".rhythm-plot")?.dataset.visibleSeries==="Разум"','Space restores a single series');
 await load('mixed');
 const initial=await read();const date=await evaluate('document.querySelector(".rhythm-table tbody tr").lastElementChild?.textContent && document.querySelector("input[type=date]").max');
 await evaluate('(()=>{const input=document.querySelector("input[type=date]");const d=new Date(input.max+"T12:00:00");d.setDate(d.getDate()-((d.getDay()+6)%7)-3);const day=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(input,day);input.dispatchEvent(new Event("input",{bubbles:true}));input.dispatchEvent(new Event("change",{bubbles:true}));})()');
 assert.equal(await read(),initial,'Selected logging date does not reanchor analytics');
 await click('[data-habit-id=demo-guitar] .completion-button');
 await until('document.querySelector("[data-habit-id=demo-guitar] .completion-button").disabled','Backdated journal logging remains one click');
 await until('Number(document.querySelector(".rhythm-quality strong").textContent)===25','Backdated addition refreshes real snapshot aggregation');
 await click('[aria-label="Разделы Relics"] button:nth-child(2)');
 await until('!!document.querySelector("#chronicle")','Chronicle navigation opens distinct history view');
 const cancel=await evaluate('(()=>{const date=document.querySelector("input[type=date]").value;return [...document.querySelectorAll(".entry")].find(e=>e.querySelector("time").dateTime===date&&e.querySelector("h3").textContent==="Гитара").querySelector("button").getAttribute("aria-label");})()');
 await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 await evaluate('document.querySelector('+JSON.stringify('button[aria-label='+JSON.stringify(cancel)+']')+').focus()');
 for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Enter',code:'Enter',windowsVirtualKeyCode:13,...(type==='keyDown'?{text:'\r',unmodifiedText:'\r'}:{})});
 await click('.app-rail [data-nav=sanctuary]');await until('document.activeElement.id==="sanctuary-title"','Return to dashboard after Chronicle cancellation');
 await until('Number(document.querySelector(".rhythm-quality strong").textContent)===24','Cancellation restores previous aggregate');assert.equal(await read(),initial);
 for(const [width,height] of [[1280,900],[390,1100],[320,1000]]) {
  await viewport(width,height);await until('document.documentElement.scrollWidth<=innerWidth','Analytics has no horizontal overflow at '+width);
  await until('document.querySelector(".rhythm-plot canvas").getBoundingClientRect().right<=innerWidth','Canvas stays inside narrow layout at '+width);
  await capture('rhythm-narrow-'+width+'.png');
 }
 await viewport(1440,1000);await load('legacy');
 await until('document.querySelector(".rhythm-empty")?.textContent.includes("Старые записи")&&!document.querySelector(".rhythm-plot canvas")','Legacy-only history is unknown rather than five measured zeros');
 assert.deepEqual(await evaluate('[...document.querySelectorAll(".rhythm-quality strong")].map(x=>Number(x.textContent))'),[24,0,0,24]);await capture('rhythm-legacy-only.png');
 await load('empty');await click('[data-mode=shares]');
 await until('document.querySelector(".rhythm-empty")?.textContent.includes("Нет числовых данных")','Empty numeric history has no fabricated percentages');assert.deepEqual(await evaluate('[...document.querySelectorAll(".rhythm-legend output")].map(x=>x.textContent)'),['—','—','—','—','—']);await capture('rhythm-empty.png');
 // Owner addendum: rolling7-day view is daily and includes today's real preview snapshot.
 await evaluate('document.querySelector(".rhythm-period select").focus()');
 for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Home',code:'Home',windowsVirtualKeyCode:36});
 await until('document.querySelector(".rhythm-period select").value==="1"&&document.querySelectorAll(".rhythm-table tbody tr").length===7','One-week selector shows seven daily rows including today');
 const today=await evaluate('document.querySelector("input[type=date]").max');
 assert.equal(await evaluate('document.querySelector(".rhythm-table tbody tr:last-child th").textContent'),today);
 await until('document.querySelector(".rhythm-timeframe").textContent.includes("включая сегодня")','Rolling timeframe is labeled independently of completed weeks');
 await click('[data-habit-id=demo-guitar] .completion-button');
 await until('Number(document.querySelector(".rhythm-quality strong").textContent)===1&&!!document.querySelector(".rhythm-plot canvas")','Today completion immediately contributes in the seven-day view');
 assert.deepEqual(await evaluate('[...document.querySelectorAll(".rhythm-legend output")].map(e=>e.textContent)'),['0 %','50 %','0 %','0 %','50 %']);
 await click('[data-mode=units]');await until('document.querySelector(".rhythm-legend [data-sphere=mind] output").textContent==="5"','Daily absolute mode uses saved contribution units');
 await capture('rhythm-seven-days.png',true);
 await viewport(390,1100);await until('document.documentElement.scrollWidth<=innerWidth','Seven-day selector and chart fit narrow layout');await capture('rhythm-seven-days-narrow.png');await viewport(1440,1000);
 await evaluate('document.querySelector(".rhythm-period select").focus()');
 for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
 await until('document.querySelector(".rhythm-period select").value==="4"&&document.querySelectorAll(".rhythm-table tbody tr").length===4&&Number(document.querySelector(".rhythm-quality strong").textContent)===0','Returning to four complete weeks retains its original bounds');
 await click('#rhythm-toggle');await until('document.querySelector("#rhythm-body").hidden','Panel can collapse without changing the Chronicle');
 await click('#rhythm-toggle');await until('!document.querySelector("#rhythm-body").hidden','Original analytics preference restored for unrelated checks');
 await send('Page.navigate',{url:'http://127.0.0.1:1420'});await until('document.querySelectorAll(".relic-item").length===6','Original preview restored after analytics verification');
}
