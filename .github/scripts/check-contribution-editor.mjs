import assert from 'node:assert/strict';

export async function checkContributionEditor({send,evaluate,until,click,viewport,screenshot}){
 const ids=['body','mind','relationships','work','recovery'];
 const checkbox=s=>'#sphere-'+s;
 const number=s=>'#contribution-number-'+s;
 const range=s=>'#contribution-range-'+s;
 async function press(key,code,virtualKey){
  await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:virtualKey});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:virtualKey});
 }
 async function value(s,text){
  await evaluate(`document.querySelector(${JSON.stringify(number(s))}).focus();document.querySelector(${JSON.stringify(number(s))}).select()`);
  await send('Input.insertText',{text});
 }
 async function chosen(expected,label){
  await until(`[...document.querySelectorAll('.creation-form input[type=checkbox]')].filter(i=>i.checked).length===${expected}`,label);
 }
 await send('Page.reload');await viewport(1440,1000);
 await until('document.querySelectorAll(".relic-item").length===6','Contribution editor uses a fresh fictional preview');
 await click('.inventory-heading .button-primary');await send('Input.insertText',{text:'Вклад — проверка'});
 await click(checkbox('mind'));await chosen(1,'One sphere selection is supported');
 await until('document.querySelector("#contribution-number-mind").value==="5"','A newly selected sphere starts at5');
 assert.ok(await evaluate('["body","relationships","work","recovery"].every(s=>document.querySelector("#contribution-number-"+s).disabled&&document.querySelector("#contribution-number-"+s).value==="0"&&document.querySelector("#contribution-range-"+s).disabled)'));
 await until('document.querySelector(".habit-editor__art").getBoundingClientRect().bottom<=document.querySelector(".creation-form legend").getBoundingClientRect().top','Existing medallion art does not overlap sphere section');
 await evaluate('document.querySelector("#sphere-mind").focus()');
 await press(' ','Space',32);await until('document.querySelector("#contribution-number-mind").disabled','Space unselects sphere and disables numeric control');
 await press(' ','Space',32);await until('document.querySelector("#contribution-number-mind").value==="5"&&!document.querySelector("#contribution-number-mind").disabled','Space selects sphere with default5');
 await screenshot('weights-create-one.png');
 await value('mind','7');
 await evaluate(`document.querySelector(${JSON.stringify(range('mind'))}).focus()`);
 await press('ArrowRight','ArrowRight',39);await until('document.querySelector("#contribution-number-mind").value==="8"','Keyboard range step synchronizes numeric feedback');
 await press('Home','Home',36);await until('document.querySelector("#contribution-number-mind").value==="1"','Home reaches contribution minimum');
 await press('End','End',35);await until('document.querySelector("#contribution-number-mind").value==="10"','End reaches contribution maximum');
 await value('mind','7');await click(checkbox('recovery'));await value('recovery','3');await chosen(2,'Two independent sphere values are supported');
 const accessibility=await send('Accessibility.getFullAXTree');
 assert.ok(accessibility.nodes.some(node=>node.role?.value==='slider'&&node.name?.value.includes('Разум')&&Number(node.value?.value)===7),'Screen-reader tree exposes named slider and current numeric value');
 assert.ok(accessibility.nodes.some(node=>node.role?.value==='spinbutton'&&node.name?.value.includes('Разум')),'Accessible numeric alternative is exposed');
 await screenshot('weights-create-two.png');
 await viewport(390,844);assert.ok(await evaluate('document.querySelector(".world-dialog").scrollWidth<=innerWidth'));
 await screenshot('weights-create-two-narrow.png');
 await evaluate('document.querySelector(".creation-form .form-actions").scrollIntoView({block:"end"})');
 assert.ok(await evaluate('document.querySelector(".creation-form .form-actions").getBoundingClientRect().bottom<=innerHeight'));
 await screenshot('weights-create-actions-narrow.png');
 await viewport(1440,1000);await evaluate('document.querySelector(".world-dialog").scrollTop=0');
 for(const s of ids){if(!await evaluate(`document.querySelector(${JSON.stringify(checkbox(s))}).checked`))await click(checkbox(s));await value(s,'10');}
 await chosen(5,'All five spheres can be selected together');
 assert.equal(await evaluate('[...document.querySelectorAll(".contribution-number")].reduce((sum,i)=>sum+Number(i.value),0)'),50);
 await screenshot('weights-create-five.png');
 await value('mind','11');await click('.creation-form button[type=submit]');
 await until('document.querySelector("#habit-validation-error")&&document.activeElement.id==="contribution-number-mind"','Out-of-range numeric input is rejected and focused');
 await screenshot('weights-validation.png');await value('mind','10');
 await click(checkbox('recovery'));await until('document.querySelector("#contribution-number-recovery").disabled&&document.querySelector("#contribution-number-recovery").value==="0"','Unselected sphere has zero and disabled editor');
 await click(checkbox('recovery'));await until('document.querySelector("#contribution-number-recovery").value==="5"','Reselect resets contribution to5');
 for(const s of ['body','relationships','work'])await click(checkbox(s));
 await value('mind','7');await value('recovery','3');await click('.creation-form button[type=submit]');
 await until('!document.querySelector(".creation-form")&&[...document.querySelectorAll(".relic-item h4")].some(h=>h.textContent==="Вклад — проверка")','Valid contribution habit saves without an extra logging step');
 const card=await evaluate('[...document.querySelectorAll(".relic-item")].find(c=>c.querySelector("h4").textContent==="Вклад — проверка").dataset.habitId');
 async function edit(){await click(`[data-habit-id="${card}"] .habit-actions summary`);await click(`[data-habit-id="${card}"] .habit-action-options button:first-child`);await until('document.querySelector("#habit-name")?.value==="Вклад — проверка"','Edit opens saved contribution profile');}
 await edit();await until('document.querySelector("#contribution-number-mind").value==="7"&&document.querySelector("#contribution-number-recovery").value==="3"','Edit restores exact independent saved values');
 await screenshot('weights-edit-two.png');await click(checkbox('recovery'));await screenshot('weights-edit-one.png');
 for(const s of ids){if(!await evaluate(`document.querySelector(${JSON.stringify(checkbox(s))}).checked`))await click(checkbox(s));}
 await chosen(5,'Edit supports all five spheres');await screenshot('weights-edit-five.png');
 await press('Escape','Escape',27);await until('!document.querySelector(".creation-form")','Cancel edits without persisting draft contributions');
 await edit();await until('document.querySelector("#contribution-number-mind").value==="7"&&document.querySelector("#contribution-number-recovery").value==="3"&&[...document.querySelectorAll(".creation-form input[type=checkbox]")].filter(i=>i.checked).length===2','Canceled edit preserves the saved contribution profile');
 await press('Escape','Escape',27);await until('!document.querySelector(".creation-form")','Close contribution editor');
 await click(`[data-habit-id="${card}"] .completion-button`);
 await until(`document.querySelector('[data-habit-id="${card}"] .completion-button').disabled`,'Ordinary weighted habit completion remains one click');
 await send('Page.reload');await until('document.querySelectorAll(".relic-item").length===6','Contribution preview resets and never persists real data');
 await viewport(1440,900);
}
