// HEMO B1: run with node --test tests/hemo-b1.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {minutes,overlap,conflictIds,filterSessions,auditSchedule,layoutDay} from '../public/schedule-utils.js';
const read=(name)=>fs.readFileSync(new URL('../public/'+name,import.meta.url));
const source=read('b18.js').toString('utf8');
const base={track:'Hemoterapia',type:'cientifica',stage:'Sala 1',participants:[],description:'',sourceUrl:'https://hemo.org.br/',verifiedAt:'2026-10-23T20:00:00Z'};
const s=(id,day,start,end,other={})=>({id,day,start,end,title:id,...base,...other});
const x=[
 s('h26-aaa','2026-10-28','09:00','10:00'),
 s('h26-bbb','2026-10-28','09:30','10:30',{stage:'Sala 2'}),
 s('h26-ccc','2026-10-29','08:00','09:00'),
 s('h26-ddd','2026-10-30','10:00','11:00'),
 s('h26-eee','2026-10-31','11:00','12:00')
];
test('four dates, pending B2, timezone, no synthetic production events',()=>{
 const dataset=JSON.parse(read('schedule.json').toString('utf8'));
 assert.deepEqual(dataset.days,['2026-10-28','2026-10-29','2026-10-30','2026-10-31']);
 assert.equal(dataset.timezone,'America/Sao_Paulo');
 assert.equal(dataset.status,'pending_b2');assert.deepEqual(dataset.sessions,[]);
 assert.deepEqual(dataset.talks,[]);assert.deepEqual(dataset.works,[]);assert.deepEqual(dataset.exhibitors,[]);
 const local=new Intl.DateTimeFormat('en-CA',{timeZone:dataset.timezone,hour:'2-digit',hourCycle:'h23'}).format(new Date('2026-10-28T13:00:00Z'));
 assert.equal(local,'10');assert.equal(minutes('23:59'),1439);assert.equal(minutes('24:00'),null);
});
test('valid schema, date boundaries, duplicates and bad sources',()=>{
 assert.equal(auditSchedule(x).errors.length,0);
 assert.equal(auditSchedule([...x,x[0]]).errors.some(e=>e.includes('duplicado')),true);
 assert.ok(auditSchedule([s('h26-bad','2026-10-27','09:00','10:00')]).errors.length);
 assert.ok(auditSchedule([s('h26-bad','2026-10-28','23:55','00:10')]).errors.length);
 assert.ok(auditSchedule([s('h26-bad','2026-10-28','09:00','10:00',{sourceUrl:''})]).errors.length);
});
test('concurrent grid and conflicts only between selected events',()=>{
 assert.equal(overlap(x[0],x[1]),true);assert.equal(overlap(x[0],x[2]),false);
 const lanes=layoutDay(x.slice(0,2));assert.equal(lanes[0].lanes,2);assert.equal(lanes[1].lanes,2);assert.notEqual(lanes[0].lane,lanes[1].lane);
 assert.equal(conflictIds(x,new Map([['h26-aaa',{attending:true}]])).size,0);
 assert.equal(conflictIds(x,new Map([['h26-aaa',{attending:true}],['h26-bbb',{attending:true}]])).size,2);
});
test('filters by day, interest, type, search, time, attended',()=>{
 const p=new Map([['h26-aaa',{interest:'Alto interesse',attending:true}]]);
 assert.equal(filterSessions(x,{day:'2026-10-31'}).length,1);
 assert.equal(filterSessions(x,{type:'cientifica'}).length,5);
 assert.equal(filterSessions(x,{search:'hemoterapia'}).length,5);
 assert.equal(filterSessions(x,{timeFrom:'10:30'}).length,2);
 assert.equal(filterSessions(x,{attending:true},p).length,1);
 assert.equal(filterSessions(x,{interests:['Alto interesse']},p).length,1);
});
test('HEMO storage parsing and backup reject other event IDs',()=>{
 const part=source.slice(source.indexOf('function cleanItem('),source.indexOf('function getUi('));
 assert.ok(part.includes('function readItems'));
 const {cleanItem,readItems}=vm.runInNewContext(`const validId=id=>/^h26-[a-z0-9][a-z0-9._-]{2,90}$/i.test(id);const STATES=['Não analisado','Alto interesse','Talvez','Não vou'];${part};({cleanItem,readItems})`);
 const rec={sessionId:'h26-aaa',interest:'Alto interesse',attending:true,comment:'nota'};
 assert.equal(readItems({version:1,items:[rec]}).get('h26-aaa').comment,'nota');
 assert.throws(()=>cleanItem({sessionId:'c26-s001',attending:true}));
 assert.throws(()=>readItems({version:18,items:[rec]}));
 assert.throws(()=>readItems({version:1,items:[{...rec,questions:42}]}));
 assert.ok(source.includes("hemo2026:flora:preferences:v1"));
 assert.ok(source.includes("HEMO_2026_FLORA_BACKUP"));
 assert.ok(source.includes("data.kind!==BACKUP_KIND"));
});
test('PWA identity, HTML first paint, manifest, icons and cache isolation',()=>{
 for(const name of ['index.html','b18.js','b18.css','schedule-utils.js','schedule.json','manifest.webmanifest','service-worker.js']){
  assert.doesNotMatch(read(name).toString('utf8'),/conahp|riw2026|c26-s\\d|2026-10-14|2026-10-15/i,name);
 }
 const html=read('index.html').toString('utf8');
 for(const d of ['2026-10-28','2026-10-29','2026-10-30','2026-10-31'])assert.ok(html.includes(d));
 assert.ok(html.includes('#startup .loading-logo'));assert.ok(html.includes('Carregando agenda'));
 assert.ok(html.includes('logo-hemo.svg'));
 const m=JSON.parse(read('manifest.webmanifest').toString('utf8'));assert.equal(m.display,'standalone');assert.equal(m.icons.length,2);
 for(const [size,icon] of [[192,m.icons[0]],[512,m.icons[1]]]){
  const png=read(icon.src.slice(1));assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
 }
 const worker=read('service-worker.js').toString('utf8');assert.match(worker,/startsWith\\('hemo2026:'\\)/);assert.doesNotMatch(worker,/names\\.filter\\(n=>n!==CACHE\\)/);
});
