import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
export async function checkChronicleNavigation({send,evaluate,until,click,viewport,screenshot,output}) {
 async function go(view,mobile=false){await click((mobile?'.mobile-navigation':'.app-rail')+' [data-nav='+view+']');await until('document.activeElement.id==='+JSON.stringify(view==='chronicle'?'journal-title':view==='archive'?'habits-title':'sanctuary-title'),'Navigation focuses '+view);}
 async function press(key,code,windowsVirtualKeyCode){for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key,code,windowsVirtualKeyCode,...(key==='Enter'&&type==='keyDown'?{text:'\r',unmodifiedText:'\r'}:{})});}
 await send('Page.navigate',{url:'http://127.0.0.1:1420'});await viewport(1440,900);
 await until('document.querySelectorAll(".relic-item").length===6&&!document.querySelector("#chronicle")','Sanctuary does not mount a full Chronicle');
 assert.ok(await evaluate('document.querySelector(".sanctuary-view").lastElementChild.id==="life-rhythm"'));
 await screenshot('chronicle-sanctuary-dashboard.png');
 // Keep chart controls and logging date across primary view switches, without changing chart code.
 await evaluate('document.querySelector(".rhythm-period select").focus()');await press('Home','Home',36);await click('[data-mode=shares]');await click('.rhythm-legend [data-sphere=work] input');
 const savedDay=await evaluate('document.querySelector("input[type=date]").value');
 await evaluate('document.querySelector(".app-rail [data-nav=sanctuary]").focus()');await press('Tab','Tab',9);await until('document.activeElement.dataset.nav==="chronicle"','Keyboard reaches Chronicle destination');await press('Enter','Enter',13);
 await until('document.activeElement.id==="journal-title"&&document.querySelectorAll(".entry").length===2','Keyboard opens a distinct full history view');
 assert.ok(await evaluate('document.querySelector(".sanctuary-view").hidden&&document.querySelector(".sanctuary-view").inert'));
 assert.ok(await evaluate('[...document.querySelectorAll(".app-rail [aria-current=page],.mobile-navigation [aria-current=page]")].every(b=>b.dataset.nav==="chronicle")'));
 assert.equal(await evaluate('document.querySelector(".skip-link").getAttribute("href")'),'#journal-title');
 await evaluate('document.querySelector(".skip-link").focus()');await press('Enter','Enter',13);await until('document.activeElement.id==="journal-title"','Chronicle skip link reaches its own heading');
 await send('Network.enable');await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await go('sanctuary');await go('chronicle');await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
 const ax=await send('Accessibility.getFullAXTree');assert.ok(ax.nodes.some(n=>n.role?.value==='heading'&&n.name?.value==='Жизненная хроника'));assert.ok(!ax.nodes.some(n=>n.name?.value==='Дата отметки'));
 const history=await evaluate('[...document.querySelectorAll(".entry")].map(e=>({date:e.querySelector("time").dateTime,name:e.querySelector("h3").textContent,spheres:[...e.querySelectorAll(".sphere-tags span")].map(s=>s.dataset.sphere)}))');
 assert.equal(history.length,2);assert.ok(history[0].date>=history[1].date);assert.equal(await evaluate('document.querySelectorAll(".chronicle-date-group").length'),2);
 for(const [width,height] of [[1440,900],[1280,800],[390,844],[320,844]]) {await viewport(width,height);await until('document.documentElement.scrollWidth<=innerWidth','Chronicle has no horizontal overflow at '+width);await screenshot('chronicle-'+width+'x'+height+'.png');}
 await viewport(1440,900);await go('sanctuary');
 assert.equal(await evaluate('document.querySelector("input[type=date]").value'),savedDay);assert.equal(await evaluate('document.querySelector(".rhythm-period select").value'),'1');assert.equal(await evaluate('document.querySelector("[data-mode=shares]").getAttribute("aria-pressed")'),'true');assert.equal(await evaluate('document.querySelector(".rhythm-legend [data-sphere=work] input").checked'),false);
 await until('!document.querySelector("#chronicle")','Chronicle unmounts on return instead of hiding below Sanctuary');
 // Archive/rename a real preview habit; historical names/spheres must survive.
 await click('[data-habit-id=demo-read] .habit-actions summary');await click('[data-habit-id=demo-read] .habit-action-options button:first-child');await evaluate('document.querySelector("#habit-name").select()');await send('Input.insertText',{text:'Новое имя'});await click('#sphere-mind');await click('#sphere-body');await click('.creation-form button[type=submit]');
 await until('!document.querySelector(".creation-form")','Definition edit completes before archive');
 await click('[data-habit-id=demo-read] .habit-actions summary');await click('[data-habit-id=demo-read] .habit-action-options button:nth-child(2)');await click('.archive-confirmation .form-actions button:last-child');await until('!document.querySelector("[data-habit-id=demo-read]")','Archived definition leaves active inventory');
 await go('chronicle');await until('[...document.querySelectorAll(".entry h3")].some(h=>h.textContent==="Чтение")','Archived renamed habit history retains its original name');
 assert.ok(await evaluate('[...document.querySelectorAll(".entry")].find(e=>e.querySelector("h3").textContent==="Чтение").querySelector(".sphere-tags span").dataset.sphere==="mind"'));
 await screenshot('chronicle-archived-history.png');
 await go('archive');await until('document.querySelector("[data-habit-id=demo-read] h4")?.textContent==="Новое имя"','Archive destination retains existing management view');
 await go('sanctuary');await click('[data-habit-id=demo-walk] .habit-actions summary');await click('[data-habit-id=demo-walk] .habit-action-options button:nth-child(2)');await click('.archive-confirmation .form-actions button:last-child');await until('!document.querySelector("[data-habit-id=demo-walk]")','All habits with recorded events can be archived');
 await go('chronicle');await until('document.querySelectorAll(".entry").length===2','History containing only archived habits remains complete');await screenshot('chronicle-archived-only.png');
 await click('.app-rail button[data-backup]');await until('!!document.querySelector(".backup-unavailable")','Backup access remains available from Chronicle');await press('Escape','Escape',27);
 await viewport(390,844);await go('sanctuary',true);await go('chronicle',true);await until('document.querySelector(".mobile-navigation [data-nav=chronicle]").getAttribute("aria-current")==="page"','Mobile and desktop navigation share the same active view');await screenshot('chronicle-mobile-archived.png');
 await viewport(1440,900);
 // Cancel all synthetic events via the actual view, including last-event empty state.
 while(await evaluate('document.querySelectorAll(".entry").length>0')) {const before=await evaluate('document.querySelectorAll(".entry").length');await click('.entry button');await until('document.querySelectorAll(".entry").length==='+String(before-1),'Chronicle cancellation refreshes its complete list');}
 await until('document.querySelector(".chronicle-empty")?.textContent.includes("пока нет")&&document.querySelector(".chronicle-feedback [role=status]").textContent.includes("отменена")','Empty history and cancellation feedback remain visible in Chronicle');await screenshot('chronicle-empty.png');
 await go('sanctuary');await until('document.querySelector(".sanctuary-medallion").dataset.state==="dormant"&&[...document.querySelectorAll(".wheel-gem")].every(g=>g.dataset.state==="subdued")','Chronicle cancellations recompute Sanctuary rune and selected-day gemstones');
 await until('document.querySelector(".rhythm-quality strong").textContent==="0"','Chronicle cancellations refresh retained Life Rhythm data');
 await send('Page.navigate',{url:'http://127.0.0.1:1420'});await until('document.querySelectorAll(".relic-item").length===6','Navigation checks restore ordinary synthetic preview');
 await writeFile(join(output,'chronicle-navigation-proof.json'),JSON.stringify({source:'Actual controls, synthetic in-memory preview',nativeUiRuntimeVerified:false,historyGroups:2,screenshots:['chronicle-sanctuary-dashboard.png','chronicle-1440x900.png','chronicle-1280x800.png','chronicle-390x844.png','chronicle-archived-history.png','chronicle-empty.png']},null,2));
}
