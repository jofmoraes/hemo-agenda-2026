import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditSchedule,conflictIds,layoutDay,overlap,minutes} from '../public/schedule-utils.js';
const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const d=read('data/b2-indexed-candidates.json');
test('B2 stays staged and public schedule is pending',()=>{
 const p=read('public/schedule.json');
 assert.equal(p.status,'pending_b2');assert.equal(p.sessions.length,0);
 assert.equal(d.status,'PARTIAL_NOT_PUBLISHABLE');assert.equal(d.coverage.completenessVerified,false);
});
test('four days, stable unique HEMO ids, durations and official provenance',()=>{
 const days=['2026-10-28','2026-10-29','2026-10-30','2026-10-31'];
 assert.deepEqual(d.days,days);assert.equal(d.timezone,'America/Sao_Paulo');
 assert.equal(new Set(d.sessions.map(s=>s.id)).size,d.sessions.length);
 const audit=auditSchedule(d.sessions);assert.deepEqual(audit.errors,[]);
 assert.ok(days.every(day=>d.sessions.some(s=>s.day===day)));
 for(const s of d.sessions){
  assert.match(s.id,/^h26-/);assert.match(s.sourceUrl,/^https:\/\/hemo\.org\.br\//);
  assert.ok(minutes(s.start)<minutes(s.end));assert.ok(s.evidence.checkedAt);
  assert.ok(s.evidence.missingFields.includes('stage')===!Boolean(s.stage));
  assert.ok(s.type&&s.title&&s.track);
 }
});
test('curation is explained and never saved as personal preferences',()=>{
 for(const s of d.sessions){
  assert.ok(s.recommendation);
  assert.equal(s.recommendation.targetProfile,'Flora');
  assert.ok(s.recommendation.rationale.length>15);
  assert.ok(['alta','media','baixa'].includes(s.recommendation.level));
  assert.ok(['media','baixa'].includes(s.recommendation.confidence));
  for(const field of ['interest','attending','preference','comment','questions'])assert.equal(s[field],undefined);
 }
});
test('talks are distinct children with validated parent and times',()=>{
 const parents=new Map(d.sessions.map(s=>[s.id,s]));
 assert.equal(new Set(d.talks.map(t=>t.id)).size,d.talks.length);
 for(const t of d.talks){
  const p=parents.get(t.parentSessionId);assert.ok(p,t.id);
  assert.ok(minutes(t.start)>=minutes(p.start));assert.ok(minutes(t.end)<=minutes(p.end));
  assert.ok(minutes(t.start)<minutes(t.end));assert.ok(t.sourceUrl.includes('hemo.org.br'));
 }
});
test('counts per day, simultaneous slots, no false selection conflicts',()=>{
 const sums=Object.fromEntries(d.days.map(day=>[day,d.sessions.filter(s=>s.day===day).length]));
 assert.deepEqual(sums,Object.fromEntries(Object.entries(d.coverage.knownSessions).map(([k,v])=>['2026-10-'+k,v])));
 assert.ok(d.days.every(day=>d.sessions.filter(s=>s.day===day).some((s,i,ss)=>ss.some(t=>overlap(s,t)))));
 assert.ok(layoutDay(d.sessions.filter(s=>s.day===d.days[0])).some(x=>x.lanes>1));
 assert.equal(conflictIds(d.sessions,new Map()).size,0);
});
test('access limitations, missing venue and exclusivity are flagged',()=>{
 assert.ok(d.sessions.some(s=>s.evidence.missingFields.includes('stage')));
 assert.ok(d.sessions.some(s=>s.type==='cafe_corporativo'&&s.accessNote));
 assert.ok(d.sessions.some(s=>s.type==='forum_restrito'&&s.accessNote.includes('fechada')));
 assert.equal(d.coverage.completenessVerified,false);
});
