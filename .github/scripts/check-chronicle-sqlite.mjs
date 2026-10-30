import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';

/** Browser/UI integration via a mock native IPC boundary and REAL temporary SQLite.
 * It does not replace Rust backup safety tests and never opens an owner's database.
 */
export async function checkChronicleSqlite({send,evaluate,until,click,viewport,bindIpc,output}) {
 const parent=resolve(tmpdir()),directory=mkdtempSync(join(parent,'relics-nav-ui-'));
 const db=new DatabaseSync(join(directory,'synthetic.db'));db.exec('PRAGMA foreign_keys=ON');
 for(const file of ['001_initial.sql','002_archive_habits.sql','003_seed_once.sql','004_habit_contributions.sql'])db.exec(readFileSync(new URL('../../src-tauri/migrations/'+file,import.meta.url),'utf8'));
 const today=await evaluate('document.querySelector("input[type=date]").max');
 const profile=(values,origin='user')=>JSON.stringify({version:1,origin,values:{body:0,mind:0,relationships:0,work:0,recovery:0,...values}});
 const insert=db.prepare('INSERT INTO activities(id,habit_id,habit_name_snapshot,spheres_snapshot_json,occurred_on,recorded_at,timezone,contribution_snapshot_json) VALUES(?,?,?,?,?,?,?,?)');
 insert.run('bridge-26','read','Чтение до переименования','["mind"]','2026-10-26','2026-10-29T12:00:00Z','Synthetic',null);
 insert.run('bridge-27','walk','Старая прогулка','["body","recovery"]','2026-10-27','2026-10-29T12:00:00Z','Synthetic',null);
 insert.run('bridge-current','walk','Прогулка сегодня','["body","recovery"]',today,today+'T12:00:00Z','Synthetic',profile({body:5,recovery:5},'legacy-default'));
 db.prepare('UPDATE habits SET name=?,spheres_json=?,contribution_profile_json=?,archived_at=? WHERE id=?').run('Нынешнее имя','["body"]',profile({body:5}),'2026-10-29T12:00:00Z','read');
 let loads=0,failDelete=false,failLoad=false,failRefresh=false,restored=false,restores=0;
 let releaseLoad;const opening=new Promise(resolve=>releaseLoad=resolve);
 const summary={exportedAt:today+'T12:00:00Z',habits:1,archivedHabits:0,activities:1,formatVersion:2,databaseSchemaVersion:4,targetSchemaVersion:4,userEntries:1,defaultEntries:0,legacyEntries:0};
 const bind=(q,values=[])=>Object.fromEntries([...new Set(q.match(/\$\d+/g)??[])].map((name,i)=>[name,values[i]]));
 const commands=[];
 await bindIpc(async(cmd,args={})=>{
  commands.push(cmd);
  if(cmd==='plugin:sql|load'){loads++;await opening;if(failLoad)throw Error('Synthetic unavailable database');assert.equal(args.db,'sqlite:relics.db');return args.db;}
  if(cmd==='plugin:sql|select'){assert.equal(args.db,'sqlite:relics.db');if(restored&&failRefresh)throw Error('Synthetic refresh failure');return db.prepare(args.query).all(bind(args.query,args.values));}
  if(cmd==='plugin:sql|execute'){assert.equal(args.db,'sqlite:relics.db');if(failDelete&&args.query.startsWith('DELETE'))throw Error('Synthetic delete failure');const result=db.prepare(args.query).run(bind(args.query,args.values));return [Number(result.changes),Number(result.lastInsertRowid)];}
  if(cmd==='cancel_backup')return null;
  if(cmd==='preview_backup')return {token:'synthetic-preview-token',summary};
  if(cmd==='restore_backup'){
   assert.equal(args.token,'synthetic-preview-token');restores++;
   db.exec('BEGIN');try {db.exec('DELETE FROM activities; DELETE FROM habits');db.prepare('INSERT INTO habits(id,name,spheres_json,contribution_profile_json) VALUES(?,?,?,?)').run('restored','Текущее имя после импорта','["work"]',profile({work:7}));insert.run('restored-event','restored','Дело после восстановления','["work"]',today,today+'T12:00:00Z','Synthetic',profile({work:7}));db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
   restored=true;return {summary,safetyFile:'synthetic-recovery-v2.json'};
  }
  throw Error('Unexpected test IPC '+cmd);
 });
 const script=await send('Page.addScriptToEvaluateOnNewDocument',{source:
  'window.isTauri=true;let id=0;const pending=new Map();window.__TAURI_INTERNALS__={invoke:(cmd,args)=>new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});window.__chronicleTestIpc(JSON.stringify({id:next,cmd,args}));})};window.__chronicleTestResolve=(id,ok,value)=>{const request=pending.get(id);if(!request)return;pending.delete(id);if(ok)request.resolve(value);else request.reject(new Error(value));};'
 });
 async function go(view){await click('.app-rail [data-nav='+view+']');await until('document.activeElement.id==='+JSON.stringify(view==='chronicle'?'journal-title':'sanctuary-title'),'SQLite-backed navigation to '+view);}
 async function enter(){for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Enter',code:'Enter',windowsVirtualKeyCode:13,...(type==='keyDown'?{text:'\r',unmodifiedText:'\r'}:{})});}
 async function restore(){await click('.app-rail button[data-backup]');await until('!!document.querySelector(".backup-dialog")','Existing backup dialog opens from Chronicle');await click('.backup-dialog .form-actions:first-of-type button:nth-child(2)');await until('!!document.querySelector(".backup-replacement")','Restore preview retains explicit replacement warning');await click('.backup-dialog section .button-primary');}
 try {
  await viewport(1440,900);await send('Page.navigate',{url:'http://127.0.0.1:1420'});await until('!!document.querySelector(".rail-status")','Test-only native bridge loads existing application');
  await go('chronicle');await until('document.querySelector(".chronicle-empty")?.textContent.includes("Загружаем")','Chronicle shows loading rather than fabricated empty history');
  releaseLoad();await until('document.querySelectorAll(".entry").length===3','Real temporary SQLite supplies the complete historical journal');
  assert.equal(await evaluate('document.querySelector("[data-activity-id=bridge-26] h3").textContent'),'Чтение до переименования');
  assert.equal(await evaluate('document.querySelector("[data-activity-id=bridge-26] .sphere-tags span").dataset.sphere'),'mind');
  await go('sanctuary');const beforeRune=Number(await evaluate('document.querySelector(".sanctuary-medallion").dataset.sphereDays'));
  await evaluate('document.querySelector(".rhythm-period select").focus()');for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Home',code:'Home',windowsVirtualKeyCode:36});
  await until('document.querySelector(".rhythm-legend [data-sphere=body] output").textContent==="5"','Actual SQLite event snapshots feed Life Rhythm before cancellation');
  await go('chronicle');failDelete=true;
  await click('[data-activity-id=bridge-current] button');await until('!!document.querySelector(".chronicle-feedback [role=alert]")','Cancellation failure is visible in the active Chronicle');assert.equal(db.prepare('SELECT COUNT(*) AS n FROM activities').get().n,3);
  failDelete=false;const other=db.prepare('SELECT * FROM activities WHERE id<>? ORDER BY id').all('bridge-current');
  await click('[data-activity-id=bridge-current] button');await until('document.querySelectorAll(".entry").length===2&&document.querySelector(".chronicle-feedback [role=status]").textContent.includes("отменена")','Retry cancels in SQLite and exposes success feedback');assert.deepEqual(db.prepare('SELECT * FROM activities ORDER BY id').all(),other);
  await go('sanctuary');assert.equal(Number(await evaluate('document.querySelector(".sanctuary-medallion").dataset.sphereDays')),beforeRune-2);assert.ok(await evaluate('[...document.querySelectorAll(".wheel-gem")].every(g=>g.dataset.state==="subdued")'));
  await until('document.querySelector(".rhythm-quality strong").textContent==="2"&&!!document.querySelector(".rhythm-empty")','Cancellation recomputes retained chart quality/unknown snapshots');
  await go('chronicle');await restore();await until('document.querySelector(".backup-dialog [role=status]").textContent.includes("завершено")','Restore IPC succeeds before refreshing shared model');
  await click('.backup-dialog>.form-actions:last-child button');await until('document.querySelectorAll(".entry").length===1&&document.querySelector(".entry h3").textContent==="Дело после восстановления"','Backup restore refreshes the mounted Chronicle from real SQLite');
  await until('document.querySelector(".chronicle-feedback [role=status]").textContent.includes("восстановлены")','Restore feedback remains accessible after closing modal');assert.equal(loads,1,'No duplicate repository load per primary view');
  await go('sanctuary');await until('document.querySelector(".rhythm-legend [data-sphere=work] output").textContent==="7"','Restored snapshots refresh Sanctuary analytics too');await go('chronicle');
  failRefresh=true;await restore();await until('document.querySelector(".backup-dialog [role=alert]")?.textContent.includes("экран не обновился")','Restore refresh failure offers explicit recovery instruction');
  await click('.backup-dialog>.form-actions:last-child button');await until('document.querySelector(".chronicle-feedback [role=alert]")?.textContent.includes("экран не обновился")','Refresh failure remains visible after backup modal closes');
  failRefresh=false;failLoad=true;await send('Page.reload');await until('!!document.querySelector(".rail-status")','Reload keeps the isolated native test bridge');await go('chronicle');await until('document.querySelector(".chronicle-feedback [role=alert]")?.textContent.includes("Не удалось открыть")&&!document.querySelector(".entry")','Repository opening errors do not masquerade as empty history');
  await writeFile(join(output,'chronicle-sqlite-bridge-proof.json'),JSON.stringify({syntheticTemporarySqlite:true,mockedNativeIpc:true,nativeBackupImplementationVerifiedHere:false,nativeUiRuntimeVerified:false,repositoryLoadsBeforeErrorReload:1,restores,checks:'load/error/cancel/immutable other rows/full restore/shared refresh/error after close',commands:[...new Set(commands)]},null,2));
 } finally {
  releaseLoad();await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:script.identifier});await send('Page.navigate',{url:'http://127.0.0.1:1420'});await until('!!document.querySelector(".preview-notice")&&document.querySelectorAll(".relic-item").length===6','Restore ordinary preview after mock-IPC integration tests');await bindIpc(null);db.close();assert.equal(dirname(directory),parent);assert.ok(basename(directory).startsWith('relics-nav-ui-'));rmSync(directory,{recursive:true,force:true});
 }
}
