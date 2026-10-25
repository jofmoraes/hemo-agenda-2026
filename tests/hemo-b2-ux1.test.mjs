import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterSessions,recommendationMatches} from '../public/schedule-utils.js';
import {previewRequested,schedulePath} from '../public/schedule-mode.js';

const json=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const text=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const preview=json('public/preview-schedule.json');

test('UX1: Sugestão Flora separa todas, recomendadas e cada nível nos totais previstos',()=>{
 const levels=['alta','media','baixa'];
 const expected={
  '2026-10-28':{alta:10,media:1,baixa:22},
  '2026-10-29':{alta:5,media:5,baixa:24},
  '2026-10-30':{alta:8,media:2,baixa:24},
  '2026-10-31':{alta:5,media:1,baixa:14}
 };
 for(const [day,counts] of Object.entries(expected)){
  for(const level of levels)assert.equal(filterSessions(preview.sessions,{day,recommendation:level}).length,counts[level],`${day} ${level}`);
  assert.equal(filterSessions(preview.sessions,{day,recommendation:'recommended'}).length,counts.alta+counts.media,`${day} recomendadas`);
 }
 assert.equal(filterSessions(preview.sessions,{recommendation:'recommended'}).length,37);
 assert.deepEqual(Object.fromEntries(levels.map(level=>[level,filterSessions(preview.sessions,{recommendation:level}).length])),{alta:28,media:9,baixa:84});
 assert.equal(filterSessions(preview.sessions,{recommendation:''}).length,121);
});

test('UX1: recomendação não lê nem grava decisões pessoais',()=>{
 const session=preview.sessions.find(s=>s.recommendation.level==='alta');
 const prefs=new Map([[session.id,{sessionId:session.id,interest:'Não vou',priority:'Essencial',attending:true}]]);
 const before=JSON.stringify([...prefs]);
 assert.equal(recommendationMatches(session,'recommended'),true);
 assert.equal(filterSessions([session],{recommendation:'recommended'},prefs).length,1);
 assert.equal(JSON.stringify([...prefs]),before);
 assert.equal(filterSessions([session],{recommendation:'alta'},prefs).length,1);
 assert.equal(filterSessions([session],{recommendation:'media'},prefs).length,0);
 assert.equal(filterSessions([session],{priority:'Essencial'},new Map()).length,0);
});

test('UX1: interface nomeia os filtros e mantém a prévia opt-in, HTML seguro e namespace HEMO',()=>{
 const html=text('public/index.html'),js=text('public/b18.js'),css=text('public/b18.css');
 assert.match(html,/<span>Sugestão Flora<\/span>/);
 assert.match(html,/id="recommendationFilter"/);
 assert.match(html,/legend>Minha prioridade/);
 assert.match(js,/recommendationMatches\(s,st\.recommendation\)/);
 assert.match(js,/data-clear-recommendation/);
 assert.match(css,/--calendar-min-width/);
 assert.match(css,/\.calendar-main\{[^}]*overflow-x:auto/);
 assert.ok(js.includes('hemo2026:flora:preferences:v1'));
 assert.ok(js.includes('HEMO_2026_FLORA_BACKUP'));
 assert.equal(preview.sessions.length,121);
 assert.equal(preview.talks.length,42);
 assert.equal(preview.coverage.missingStage,66);
 assert.equal(preview.curationOverridesApplied,12);
 assert.equal(previewRequested(''),false);
 assert.equal(previewRequested('?preview=1'),true);
 assert.equal(schedulePath(''),'/schedule.json');
 assert.equal(schedulePath('?preview=1'),'/preview-schedule.json');
});
