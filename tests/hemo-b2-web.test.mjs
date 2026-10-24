import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditSchedule, minutes, overlap, conflictIds, layoutDay} from '../public/schedule-utils.js';

const json=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const data=json('data/b2-indexed-candidates.json');
const baseline=json('tests/fixtures/b2-baseline-ids.json');
const curation=json('data/b2-flora-conflicts.json');
const publicAgenda=json('public/schedule.json');
const byId=new Map(data.sessions.map(s=>[s.id,s]));

test('W1 candidate counts are tracked per day but never called total congress coverage',()=>{
 assert.equal(data.kind,'HEMO_B2_INDEXED_CANDIDATES');
 assert.equal(data.status,'PARTIAL_NOT_PUBLISHABLE');
 assert.equal(data.coverage.completenessVerified,false);
 assert.deepEqual(data.days,['2026-10-28','2026-10-29','2026-10-30','2026-10-31']);
 const expected={'28':[33,11],'29':[34,12],'30':[34,11],'31':[20,8]};
 for(const [dd,[sessions,talks]] of Object.entries(expected)){
  assert.equal(data.sessions.filter(s=>s.day==='2026-10-'+dd).length,sessions);
  assert.equal(data.talks.filter(t=>byId.get(t.parentSessionId)?.day==='2026-10-'+dd).length,talks);
  assert.equal(data.coverage.knownSessions[dd],sessions);
 }
 assert.equal(data.sessions.length,121);
 assert.equal(data.talks.length,42);
 assert.equal(data.coverage.knownTalks,42);
 assert.equal(publicAgenda.status,'pending_b2');
 assert.equal(publicAgenda.sessions.length,0);
});

test('original B2 identifiers survive incremental source reconciliation',()=>{
 const ids=new Set(data.sessions.map(s=>s.id));
 const tid=new Set(data.talks.map(t=>t.id));
 assert.equal(ids.size,data.sessions.length);
 assert.equal(tid.size,data.talks.length);
 assert.equal(baseline.sessions.length,49);
 assert.equal(baseline.talks.length,17);
 for(const id of baseline.sessions)assert.ok(ids.has(id),'missing baseline session '+id);
 for(const id of baseline.talks)assert.ok(tid.has(id),'missing baseline talk '+id);
});

test('strict schema, dates, duration, subordinate containment, source and lack of duplicates',()=>{
 assert.deepEqual(auditSchedule(data.sessions).errors,[]);
 for(const s of data.sessions){
  assert.match(s.id,/^h26-/);
  assert.ok(/^https:\/\/hemo\.org\.br\//.test(s.sourceUrl),'official source '+s.id);
  assert.ok(Number.isFinite(Date.parse(s.verifiedAt)));
  assert.ok(s.evidence?.checkedAt);
  assert.ok(minutes(s.start)<minutes(s.end));
  assert.equal(s.evidence.missingFields.includes('stage'),!Boolean(s.stage));
 }
 for(const t of data.talks){
  const s=byId.get(t.parentSessionId);
  assert.ok(s,'orphan child '+t.id);
  assert.ok(minutes(s.start)<=minutes(t.start));
  assert.ok(minutes(t.end)<=minutes(s.end));
  assert.ok(minutes(t.start)<minutes(t.end));
  assert.ok(/^https:\/\/hemo\.org\.br\//.test(t.sourceUrl));
 }
});

test('document 28 October afternoon including opening, and remaining room gaps',()=>{
 const d28=data.sessions.filter(s=>s.day==='2026-10-28');
 assert.ok(d28.some(s=>s.start==='18:15'&&s.end==='19:30'&&s.title.includes('Abertura')));
 assert.ok(d28.some(s=>s.start==='16:30'&&s.title.includes('Trabalhos')));
 const empty=data.sessions.filter(s=>!s.stage);
 assert.equal(empty.length,66);
 for(const s of empty)assert.ok(s.evidence.missingFields.includes('stage'));
 assert.ok(data.sessions.some(s=>s.type==='treinamento'&&s.accessNote));
 assert.ok(data.sessions.some(s=>s.type==='forum_restrito'&&s.accessNote.includes('fechada')));
});

test('proposal is individualized, explained and never contains Flora user preferences',()=>{
 const tally={alta:0,media:0,baixa:0};
 for(const s of data.sessions){
  assert.equal(s.recommendation.targetProfile,'Flora');
  assert.ok(s.recommendation.rationale.length>=20);
  assert.ok(['media','baixa'].includes(s.recommendation.confidence));
  assert.ok(s.recommendation.score>=0&&s.recommendation.score<=100);
  tally[s.recommendation.level]++;
  for(const privateField of ['interest','attending','preference','comment','questions'])
   assert.equal(s[privateField],undefined);
 }
 assert.deepEqual(tally,{alta:28,media:9,baixa:84});
});

test('proposed overlap groups are real simultaneous alternatives, not attendance',()=>{
 assert.equal(curation.status,'CANDIDATES_ONLY_NOT_PERSONAL_CHOICES');
 assert.equal(curation.conflicts.length,6);
 for(const group of curation.conflicts){
  assert.ok(group.alternatives.length>=2);
  const items=group.alternatives.map(a=>byId.get(a.sessionId));
  assert.ok(items.every(Boolean));
  assert.ok(items.every(s=>s.day===group.day&&s.recommendation.level==='alta'));
  assert.ok(items.every(s=>items.some(o=>overlap(s,o))));
 }
 assert.equal(conflictIds(data.sessions,new Map()).size,0);
 for(const day of data.days)
  assert.ok(layoutDay(data.sessions.filter(s=>s.day===day)).some(item=>item.lanes>1));
});

test('HEMO references and backup/publication isolation',()=>{
 assert.equal(data.timezone,'America/Sao_Paulo');
 assert.equal(data.coverage.completenessVerified,false);
 assert.ok(!data.sessions.some(s=>/conahp|riw2026|c26-s\d/i.test(JSON.stringify(s))));
 const publicJson=JSON.stringify(publicAgenda);
 assert.ok(!/conahp|riw2026|c26-s\d/i.test(publicJson));
 assert.equal(publicAgenda.sessions.length,0);
});
