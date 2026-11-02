// TEST-ONLY pinned Node SQLite driver. Native production executes the SAME embedded SQL plan under SQLx.
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const plans=JSON.parse(readFileSync(new URL('../../src-tauri/sql/habit_mutations.json',import.meta.url),'utf8'));
export function createHabitMutationDriver(db,today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}) {
 return async input=>{
  const day=today(),date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+((8-date.getUTCDay())%7||7));
  const change=input.rhythmChange??{kind:'keep'};
  const values={id:input.id,name:input.name??null,spheres:input.spheres?JSON.stringify(input.spheres):null,profile:input.contributionProfile?JSON.stringify(input.contributionProfile):null,change:change.kind,frequency:change.kind==='set'?change.frequency:'',today:day,nextMonday:date.toISOString().slice(0,10),now:new Date().toISOString(),segmentId:randomUUID(),pauseId:randomUUID()};
  db.exec('PRAGMA foreign_keys=ON; BEGIN IMMEDIATE');
  try{for(const step of plans[input.kind]){const statement=db.prepare(step.sql),params=step.params.map(name=>values[name]);if(step.check==='valid'){if(statement.get(...params).ok!==1)throw Error('Дата компьютера раньше сохранённой истории. Проверьте дату.');}else{const result=statement.run(...params);if(step.check==='changed'&&!Number(result.changes))throw Error('Привычка не найдена.');}}const frequencySegments=db.prepare('SELECT * FROM habit_frequency_segments WHERE habit_id=? ORDER BY effective_on,id').all(input.id).map(s=>({id:s.id,habitId:s.habit_id,frequency:s.frequency,effectiveOn:s.effective_on,createdOn:s.created_on,version:s.version}));const archivePauses=db.prepare('SELECT * FROM habit_archive_pauses WHERE habit_id=? ORDER BY start_on,id').all(input.id).map(p=>({id:p.id,habitId:p.habit_id,startOn:p.start_on,endExclusiveOn:p.end_exclusive_on,reason:p.reason,provenance:p.provenance}));db.exec('COMMIT');return {frequencySegments,archivePauses};}catch(e){db.exec('ROLLBACK');throw e;}
 };
}
