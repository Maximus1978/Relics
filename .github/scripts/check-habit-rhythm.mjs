import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';
import {createHabitMutationDriver} from './habit-sql-test-driver.mjs';

/** Actual browser + real synthetic SQLite through mocked native IPC. Rust is tested separately. */
export async function checkHabitRhythm({send,evaluate,until,click,viewport,screenshot,bindIpc,output}){
 const parent=resolve(tmpdir()),directory=mkdtempSync(join(parent,'relics-rhythm-ui-')),path=join(directory,'synthetic.db');
 let db=new DatabaseSync(path);db.exec('PRAGMA foreign_keys=ON');
 for(const f of ['001_initial.sql','002_archive_habits.sql','003_seed_once.sql','004_habit_contributions.sql','005_habit_rhythm.sql'])db.exec(readFileSync(new URL('../../src-tauri/migrations/'+f,import.meta.url),'utf8'));
 const today=await evaluate('document.querySelector("input[type=date]").max');
 const date=new Date(today+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+((8-date.getUTCDay())%7||7));const monday=date.toISOString().slice(0,10);
 db.prepare('INSERT INTO activities(id,habit_id,habit_name_snapshot,spheres_snapshot_json,occurred_on,recorded_at,timezone,contribution_snapshot_json) VALUES(?,?,?,?,?,?,?,?)').run('old-26','read','Чтение 26 октября','["mind"]','2026-10-26','2026-10-26T12:00:00Z','Synthetic',null);
 const old=db.prepare('SELECT * FROM activities WHERE id=?').get('old-26');
 let mutate=createHabitMutationDriver(db,()=>today);
 const bindings=(q,values=[])=>Object.fromEntries([...new Set(q.match(/\$\d+/g)??[])].map((n,i)=>[n,values[i]]));
 await bindIpc(async(cmd,args={})=>{
  if(cmd==='plugin:sql|load')return args.db;
  if(cmd==='plugin:sql|select')return db.prepare(args.query).all(bindings(args.query,args.values));
  if(cmd==='plugin:sql|execute'){const r=db.prepare(args.query).run(bindings(args.query,args.values));return [Number(r.changes),Number(r.lastInsertRowid)];}
  if(cmd==='mutate_habit')return mutate(args.input);
  throw Error('Unexpected rhythm test IPC '+cmd);
 });
 const script=await send('Page.addScriptToEvaluateOnNewDocument',{source:'window.isTauri=true;let id=0;const pending=new Map();window.__TAURI_INTERNALS__={invoke:(cmd,args)=>new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});window.__chronicleTestIpc(JSON.stringify({id:next,cmd,args}));})};window.__chronicleTestResolve=(id,ok,value)=>{const request=pending.get(id);if(!request)return;pending.delete(id);if(ok)request.resolve(value);else request.reject(new Error(value));};'});
 async function select(value){await evaluate('document.querySelector("#habit-frequency").value='+JSON.stringify(value)+';document.querySelector("#habit-frequency").dispatchEvent(new Event("change",{bubbles:true}))');}
 async function edit(id){if(!await evaluate('document.querySelector('+JSON.stringify('[data-habit-id="'+id+'"] .habit-actions')+').open'))await click('[data-habit-id="'+id+'"] .habit-actions summary');await click('[data-habit-id="'+id+'"] .habit-action-options button:first-child');await until('!!document.querySelector("#habit-frequency")','Existing shared Edit form exposes frequency');}
 async function save(){await click('.creation-form button[type=submit]');await until('!document.querySelector(".creation-form")&&!document.querySelector(".inventory-heading .button-primary").disabled','Atomic definition/rhythm save and list refresh complete');}
 async function cancel(){await click('.creation-form .form-actions button[type=button]');await until('!document.querySelector(".creation-form")','Cancel closes draft without persistence');}
 const created=[];
 try{
  await viewport(1440,1100);await send('Page.navigate',{url:'http://127.0.0.1:1420'});await until('document.querySelectorAll(".relic-item").length===3&&!document.querySelector(".preview-notice")','Synthetic SQLite legacy database opens in actual application UI');
  await edit('read');await until('document.querySelector("[data-current-rhythm]").textContent.includes("не настроен")&&document.querySelector("#habit-frequency").value===""','Legacy habit is explicitly unconfigured');
  await screenshot('habit-rhythm-legacy.png');await save();assert.equal(db.prepare('SELECT COUNT(*) n FROM habit_frequency_segments').get().n,0);
  await click('.date-shortcuts button:nth-child(2)');
  for(const [frequency,name] of [['daily','Ежедневная практика'],['three_per_week','Гитара — трижды в неделю'],['weekly','Недельная прогулка']]){
   await click('.inventory-heading .button-primary');await until('document.activeElement.id==="habit-name"','Create form opens with name input focused');await send('Input.insertText',{text:name});await click('#sphere-mind');
   if(frequency==='daily'){
    await click('.creation-form button[type=submit]');await until('document.activeElement.id==="habit-frequency"&&document.querySelector("#habit-validation-error").textContent.includes("ритм")','New habit requires explicit rhythm and focuses accessible selector');
    const ax=await send('Accessibility.getFullAXTree');assert.ok(ax.nodes.some(n=>n.role?.value==='combobox'&&n.name?.value.includes('Ритм')));
   }
   await select(frequency);await screenshot('habit-rhythm-create-'+frequency+'.png');await save();
   const habit=db.prepare('SELECT * FROM habits WHERE name=?').get(name),segments=db.prepare('SELECT * FROM habit_frequency_segments WHERE habit_id=?').all(habit.id);
   assert.equal(segments.length,1);assert.equal(segments[0].effective_on,today);assert.equal(segments[0].frequency,frequency);created.push(habit.id);
  }
  const id=created[2];await edit(id);await select('daily');await until('document.querySelector(".rhythm-draft").textContent.includes('+JSON.stringify(monday)+')','Pending preview uses next Monday after actual today, not selected backdate');await save();
  let segments=db.prepare('SELECT * FROM habit_frequency_segments WHERE habit_id=? ORDER BY effective_on').all(id);assert.equal(segments.length,2);const pendingId=segments[1].id;assert.equal(segments[0].frequency,'weekly');assert.equal(segments[1].effective_on,monday);
  await edit(id);await until('document.querySelector("[data-current-rhythm]").textContent.includes("Раз в неделю")&&document.querySelector("[data-pending-rhythm]").textContent.includes('+JSON.stringify(monday)+')','Current and pending rules have separate readable labels and exact date');
  await screenshot('habit-rhythm-edit-pending.png');await viewport(390,844);assert.ok(await evaluate('document.querySelector(".world-dialog").scrollWidth<=innerWidth'));await screenshot('habit-rhythm-edit-narrow.png');await viewport(1440,1100);
  await click('[data-cancel-pending]');await cancel();assert.equal(db.prepare('SELECT COUNT(*) n FROM habit_frequency_segments WHERE habit_id=?').get(id).n,2);
  await edit(id);await select('three_per_week');await save();segments=db.prepare('SELECT * FROM habit_frequency_segments WHERE habit_id=? ORDER BY effective_on').all(id);assert.equal(segments.length,2);assert.equal(segments[1].id,pendingId);assert.equal(segments[1].frequency,'three_per_week');
  await edit(id);await click('[data-cancel-pending]');await save();assert.equal(db.prepare('SELECT COUNT(*) n FROM habit_frequency_segments WHERE habit_id=?').get(id).n,1);
  await edit('read');await select('weekly');await save();assert.equal(db.prepare('SELECT effective_on FROM habit_frequency_segments WHERE habit_id=?').get('read').effective_on,today);
  const completedSelector='[data-habit-id="'+created[1]+'"] .completion-button';await click(completedSelector);await until('document.querySelector('+JSON.stringify(completedSelector)+').disabled','Backdated completion remains one click after enrollment');
  const logged=db.prepare('SELECT * FROM activities WHERE habit_id=?').get(created[1]);assert.ok(logged.occurred_on<today);assert.ok(logged.contribution_snapshot_json);
  assert.deepEqual(db.prepare('SELECT * FROM activities WHERE id=?').get('old-26'),old);
  db.close();db=new DatabaseSync(path);db.exec('PRAGMA foreign_keys=ON');mutate=createHabitMutationDriver(db,()=>today);
  await send('Page.reload');await until('document.querySelectorAll(".relic-item").length===6','Closing and reopening synthetic SQLite plus app reload preserves three new definitions');
  await edit(id);await until('document.querySelector("[data-current-rhythm]").textContent.includes("Раз в неделю")&&!document.querySelector("[data-pending-rhythm]")','Canceled pending rule remains canceled after database reopening');await cancel();
  await click('.app-rail [data-nav=chronicle]');await until('[...document.querySelectorAll(".entry h3")].some(e=>e.textContent==="Чтение 26 октября")','Unconfigured legacy activity remains visible unchanged in Chronicle');
  assert.deepEqual(db.prepare('SELECT * FROM activities WHERE id=?').get('old-26'),old);assert.deepEqual(db.prepare('SELECT * FROM activities WHERE id=?').get(logged.id),logged);
  await writeFile(join(output,'habit-rhythm-proof.json'),JSON.stringify({syntheticTemporarySqlite:true,mockedNativeIpc:true,nativeUiRuntimeVerified:false,ownerJournalTouched:false,today,nextMonday:monday,createdFrequencies:['daily','three_per_week','weekly'],checks:'required selector/legacy keep/enrollment actual today/current+pending/replace stable ID/cancel draft and saved/reopen/backdated snapshots/narrow/AX',nativeRecoveryTests:'separate Rust suite'},null,2));
 }finally{
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:script.identifier});await send('Page.navigate',{url:'http://127.0.0.1:1420'});await until('!!document.querySelector(".preview-notice")&&document.querySelectorAll(".relic-item").length===6','Return to ordinary in-memory preview after rhythm SQLite tests');await bindIpc(null);db.close();assert.equal(dirname(directory),parent);assert.ok(basename(directory).startsWith('relics-rhythm-ui-'));rmSync(directory,{recursive:true,force:true});
 }
}
