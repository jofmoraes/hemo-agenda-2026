import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {auditProgramDataset,previewRequested,schedulePath,stageLabel,uncertainRole,talksForSession} from '../public/schedule-mode.js';
import {auditSchedule} from '../public/schedule-utils.js';

const json=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const text=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const preview=json('public/preview-schedule.json');
const production=json('public/schedule.json');
const candidates=json('data/b2-indexed-candidates.json');
const baseline=json('tests/fixtures/b2-baseline-ids.json');
const overrides=json('data/b2-preview-curation-overrides.json');

test('only ?preview=1 enables partial preview URL; default remains production',()=>{
 assert.equal(previewRequested(''),false);
 assert.equal(previewRequested('?preview=true'),false);
 assert.equal(previewRequested('?preview=0'),false);
 assert.equal(previewRequested('?preview=1'),true);
 assert.equal(previewRequested('?day=29&preview=1'),true);
 assert.equal(schedulePath(''),'/schedule.json');
 assert.equal(schedulePath('?preview=1'),'/preview-schedule.json');
});
test('all three dataset states have disjoint contracts',()=>{
 assert.equal(production.status,'pending_b2');
 assert.deepEqual(auditProgramDataset(production),[]);
 assert.ok(auditProgramDataset(production,{preview:true}).length>0);
 assert.equal(preview.status,'partial_preview');
 assert.deepEqual(auditProgramDataset(preview,{preview:true}),[]);
 assert.ok(auditProgramDataset(preview).length>0);
 const verified={...production,status:'verified',checkedAt:'2026-10-24T00:00:00Z',sessions:[preview.sessions[0]]};
 assert.deepEqual(auditProgramDataset(verified),[]);
 assert.ok(auditProgramDataset(verified,{preview:true}).length>0);
 assert.ok(auditProgramDataset({...preview,status:'verified'}).length>0);
 assert.ok(auditProgramDataset({...production,sessions:[preview.sessions[0]]}).length>0);
});
test('snapshot includes exact 121 stable sessions and 42 children, no edited B2 inventory',()=>{
 assert.equal(preview.sessions.length,121);assert.equal(preview.talks.length,42);
 assert.equal(candidates.sessions.length,121);assert.equal(candidates.talks.length,42);
 assert.deepEqual(preview.sessions.map(s=>s.id),candidates.sessions.map(s=>s.id));
 assert.deepEqual(preview.talks.map(t=>t.id),candidates.talks.map(t=>t.id));
 const ids=new Set(preview.sessions.map(s=>s.id)),talks=new Set(preview.talks.map(t=>t.id));
 assert.equal(ids.size,121);assert.equal(talks.size,42);
 for(const id of baseline.sessions)assert.ok(ids.has(id));
 for(const id of baseline.talks)assert.ok(talks.has(id));
 assert.deepEqual(auditSchedule(preview.sessions).errors,[]);
});
test('four days, available-not-total counts, missing venues explicit',()=>{
 assert.deepEqual(preview.days,['2026-10-28','2026-10-29','2026-10-30','2026-10-31']);
 const dates={'28':33,'29':34,'30':34,'31':20};
 for(const [dd,n] of Object.entries(dates)){
  assert.equal(preview.sessions.filter(s=>s.day==='2026-10-'+dd).length,n);
  assert.equal(preview.coverage.knownSessions[dd],n);
 }
 assert.equal(preview.coverage.availableSessions,121);
 assert.equal(preview.coverage.availableTalks,42);
 assert.equal(preview.coverage.completenessVerified,false);
 assert.equal(preview.coverage.missingStage,66);
 assert.equal(preview.sessions.filter(s=>stageLabel(s)==='A confirmar').length,66);
 assert.equal(stageLabel({stage:''}),'A confirmar');
 assert.equal(stageLabel({stage:'Sala 202C'}),'Sala 202C');
 assert.equal(uncertainRole('Moderador(a) - papel a confirmar para cada pessoa na lista'),true);
 assert.equal(uncertainRole('Palestrante'),false);
});
test('42 child talks appear under correct parent and never duplicate session count',()=>{
 const sessions=new Map(preview.sessions.map(s=>[s.id,s]));
 for(const t of preview.talks){
  const parent=sessions.get(t.parentSessionId);assert.ok(parent);
  assert.ok(t.start>=parent.start&&t.end<=parent.end);
  assert.ok(talksForSession(preview.talks,parent.id).some(x=>x.id===t.id));
 }
 assert.ok(talksForSession(preview.talks,'unknown').length===0);
});
test('curation remains system proposal, never personal interest or priority',()=>{
 const mineFields=['attending','interest','preference','priority','comment','questions','notes'];
 for(const s of preview.sessions){
  for(const k of mineFields)assert.equal(Object.hasOwn(s,k),false);
  assert.equal(s.recommendation.targetProfile,'Flora');
  assert.ok(s.recommendation.rationale.length>12);
  assert.ok(['alta','media','baixa'].includes(s.recommendation.level));
  assert.ok(['baixa','media'].includes(s.recommendation.confidence));
 }
 assert.equal(preview.curationOverridesApplied,12);
 for(const o of overrides.entries){
  const s=preview.sessions.find(x=>x.id===o.sessionId);
  assert.equal(s.recommendation.rationale,o.rationale);
  assert.deepEqual(s.curationEvidence.talkIds,o.talkIds);
 }
 assert.equal(preview.sessions.filter(s=>s.recommendation.level==='alta').length,28);
});
test('preview has persistent banner, explicit unknowns and opt-in browser path',()=>{
 const html=text('public/index.html'),js=text('public/b18.js'),css=text('public/b18.css');
 assert.ok(html.includes('id="previewBanner"')&&html.includes('Programação parcial em conferência'));
 assert.match(css,/\.preview-banner\{position:sticky/);
 assert.ok(js.includes('schedulePath(window.location.search)'));
 assert.ok(js.includes('stageLabel(s)'));
 assert.ok(js.includes('talksForSession(st.talks,s.id)'));
 assert.ok(js.includes('proposedSuggestion(s)'));
 assert.ok(js.includes('Confiança:')||js.includes('confiança'));
 assert.ok(js.includes("hemo2026:flora:preferences:v1"));
 assert.ok(js.includes('HEMO_2026_FLORA_BACKUP'));
});
test('PWA isolates optional preview cache and keeps production schedule separate',()=>{
 const sw=text('public/service-worker.js');
 assert.ok(sw.includes('/preview-schedule.json'));
 assert.ok(sw.includes('/schedule-mode.js'));
 assert.ok(sw.includes("startsWith('hemo2026:')"));
 assert.ok(!sw.match(/ASSETS=\[[^\]]*preview-schedule\.json/));
 assert.equal(production.sessions.length,0);
 assert.equal(production.status,'pending_b2');
});
test('preview file exactly rebuilds from inventory and evidence overrides',()=>{
 const script=fileURLToPath(new URL('../scripts/build-preview.mjs',import.meta.url));
 const r=spawnSync(process.execPath,[script,'--check'],{encoding:'utf8'});
 assert.equal(r.status,0,r.stderr||r.stdout);
 assert.match(r.stdout,/PASS/);
});
test('tampered preview, count, identities, child link and choices are rejected',()=>{
 assert.ok(auditProgramDataset({...preview,status:'verified'},{preview:true}).length>0);
 assert.ok(auditProgramDataset({...preview,coverage:{...preview.coverage,completenessVerified:true}},{preview:true}).length>0);
 assert.ok(auditProgramDataset({...preview,coverage:{...preview.coverage,missingStage:0}},{preview:true}).length>0);
 const copy=structuredClone(preview);copy.sessions[0].attending=true;
 assert.ok(auditProgramDataset(copy,{preview:true}).some(x=>x.includes('Preferências pessoais')));
 const orphan=structuredClone(preview);orphan.talks[0].parentSessionId='h26-fake';
 assert.ok(auditProgramDataset(orphan,{preview:true}).some(x=>x.includes('órfã')));
 const duplicate=structuredClone(preview);duplicate.sessions[1].id=duplicate.sessions[0].id;
 assert.ok(auditProgramDataset(duplicate,{preview:true}).some(x=>x.includes('duplicado')));
});
