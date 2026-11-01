import test from 'node:test';
import assert from 'node:assert/strict';
import { changeFrequency, frequencyAt, nextMonday, rhythmStatus, validateFrequency, validateFrequencyHistory } from '../src/domain/habitRhythm.ts';
test('Frequency enums are bounded and next Monday is strict calendar arithmetic across weekday/year/leap/DST boundaries', () => {
 for (const f of ['daily','three_per_week','weekly']) assert.equal(validateFrequency(f), f);
 for (const f of [null,'','three-per-week','whenever',3]) assert.throws(()=>validateFrequency(f));
 for (const [today,next] of [['2026-11-01','2026-11-02'],['2026-11-02','2026-11-09'],['2026-12-31','2027-01-04'],['2024-02-29','2024-03-04'],['2026-03-08','2026-03-09'],['2026-10-31','2026-11-02']]) assert.equal(nextMonday(today),next);
 assert.throws(()=>nextMonday('2025-02-29')); assert.throws(()=>nextMonday('9999-12-31'));
});
test('Legacy unconfigured, actual-day enrollment, pending replacement/cancellation and historical lookup retain identity', () => {
 assert.equal(frequencyAt([], '2026-10-26'),null);
 const initial=changeFrequency([], 'habit', {kind:'set',frequency:'weekly'},'2026-10-28','first');
 assert.equal(initial[0].effectiveOn,'2026-10-28');assert.equal(frequencyAt(initial,'2026-10-27'),null);
 const pending=changeFrequency(initial,'habit',{kind:'set',frequency:'daily'},'2026-10-29','pending');
 assert.equal(pending[1].effectiveOn,'2026-11-02');assert.equal(rhythmStatus(pending,'2026-11-01').current?.frequency,'weekly');
 const replaced=changeFrequency(pending,'habit',{kind:'set',frequency:'three_per_week'},'2026-10-30','unused');
 assert.equal(replaced.length,2);assert.equal(replaced[1].id,'pending');assert.deepEqual(replaced[0],initial[0]);
 assert.equal(frequencyAt(replaced,'2026-11-01')?.frequency,'weekly');assert.equal(frequencyAt(replaced,'2026-11-02')?.frequency,'three_per_week');
 assert.deepEqual(changeFrequency(replaced,'habit',{kind:'cancel_pending'},'2026-11-01','unused'),initial);
 const after=changeFrequency(replaced,'habit',{kind:'set',frequency:'daily'},'2026-11-02','third');
 assert.equal(after[2].effectiveOn,'2026-11-09');assert.equal(after[1].frequency,'three_per_week');
 assert.deepEqual(changeFrequency(replaced,'habit',{kind:'keep'},'2026-10-31','unused'),replaced);
 assert.throws(()=>changeFrequency(replaced,'habit',{kind:'set',frequency:'daily'},'2026-10-26','unused'));
});
test('Invalid or reordered histories cannot silently overwrite applied rules',()=>{
 const first=changeFrequency([], 'habit',{kind:'set',frequency:'daily'},'2026-10-28','first');
 const second=changeFrequency(first,'habit',{kind:'set',frequency:'weekly'},'2026-10-29','second');
 for(const bad of [[...second].reverse(),[{...first[0],version:2}], [{...first[0],habitId:'other'}],[first[0],{...second[1],effectiveOn:'2026-11-03'}]])assert.throws(()=>validateFrequencyHistory(bad as typeof first,'habit'));
 assert.deepEqual(first[0],{id:'first',habitId:'habit',frequency:'daily',effectiveOn:'2026-10-28',createdOn:'2026-10-28',version:1});
});
