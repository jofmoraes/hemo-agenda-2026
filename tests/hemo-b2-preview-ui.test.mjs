import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {conflictIds,layoutDay,minutes,normalize,recommendationMatches,RECOMMENDATION_FILTERS} from '../public/schedule-utils.js';
import {auditProgramDataset,previewRequested,schedulePath,stageLabel,uncertainRole,talksForSession,typeLabel} from '../public/schedule-mode.js';

const text=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const preview=JSON.parse(text('public/preview-schedule.json'));
const production=JSON.parse(text('public/schedule.json'));
const js=text('public/b18.js').replace(/^import .*$/gm,'').replace(/\ninit\(\);\s*$/,'\ninit().then(()=>({st,render,openSession,commitPrefs,listCard}));');

function fakeDocument(){
 const nodes=new Map();
 const make=()=>({innerHTML:'',textContent:'',value:'',hidden:false,
  classList:{toggle(){},add(){}},setAttribute(){},addEventListener(){},showModal(){},close(){}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,make());return nodes.get(id)};
 return {get,document:{getElementById:get,querySelector:()=>make(),querySelectorAll:()=>[],
  addEventListener(){},body:make(),documentElement:make()}};
}
function storage(){
 const data=new Map();
 return {data,getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,v)};
}
async function start(search,store=storage(),width=390){
 const f=fakeDocument(),requests=[];
 const fetch=async(url,{cache}={})=>{requests.push({url,cache});return {ok:true,json:async()=>search.includes('preview=1')?preview:production}};
 const context={document:f.document,window:{location:{search},innerWidth:width,addEventListener(){}},
   navigator:{},localStorage:store,fetch,URL,conflictIds,layoutDay,minutes,normalize,recommendationMatches,RECOMMENDATION_FILTERS,
   auditProgramDataset,previewRequested,schedulePath,stageLabel,uncertainRole,talksForSession,typeLabel};
 const api=await vm.runInNewContext(js,context,{timeout:5000});
 return {...api,requests,get:f.get,store};
}
test('simulated DOM: explicit preview loads, renders unknowns/curation/talks and persists personal choices',async()=>{
 const app=await start('?preview=1');
 assert.equal(app.requests.length,1);
 assert.equal(app.requests[0].url,'/preview-schedule.json');
 assert.equal(app.st.sessions.length,121);
 assert.equal(app.st.talks.length,42);
 assert.equal(app.st.datasetStatus,'partial_preview');
 assert.equal(app.get('previewBanner').hidden,false);
 assert.match(app.get('previewCounts').textContent,/121 sessões candidatas/);
 assert.match(app.get('previewCounts').textContent,/66 salas a confirmar/);
 app.st.view='list';app.render();
 const unknown=app.st.sessions.find(s=>!s.stage);
 const card=app.listCard(unknown,new Set());
 assert.match(card,/A confirmar/);
 assert.match(card,/Sugestão Flora/);
 const parent=app.st.sessions.find(s=>app.st.talks.some(t=>t.parentSessionId===s.id));
 app.openSession(parent.id);
 assert.match(app.get('modalContent').innerHTML,/Palestras desta sessão/);
 assert.match(app.get('modalContent').innerHTML,/não é escolha de Flora/);
 assert.ok(app.commitPrefs(parent.id,{interest:'Alto interesse',attending:true}));
 app.render();
 assert.equal(app.get('mineCount').textContent,'1');
 assert.ok(app.store.data.has('hemo2026:flora:preferences:v1'));
 assert.ok(![...app.store.data.keys()].some(k=>/conahp|riw/i.test(k)));
 const again=await start('?preview=1',app.store);
 assert.ok(again.st.prefs.get(parent.id)?.attending);
});
test('simulated DOM: normal startup ignores preview data even after storing preview choices',async()=>{
 const app=await start('');
 assert.equal(app.requests.length,1);
 assert.equal(app.requests[0].url,'/schedule.json');
 assert.equal(app.st.sessions.length,0);
 assert.equal(app.st.datasetStatus,'pending_b2');
 assert.equal(app.get('previewBanner').hidden,true);
 assert.match(app.get('sessions').innerHTML,/Programação em preparação/);
});
test('UX1: mobile starts in list, desktop keeps agenda, and explicit view persists',async()=>{
 const mobile=await start('?preview=1',storage(),390);
 assert.equal(mobile.st.view,'list');
 const desktop=await start('?preview=1',storage(),1280);
 assert.equal(desktop.st.view,'grid');
 mobile.st.view='grid';mobile.st.viewExplicit=true;mobile.render();
 const again=await start('?preview=1',mobile.store,390);
 assert.equal(again.st.view,'grid');
 assert.equal(again.st.viewExplicit,true);
});
test('UX1-R1: old Alta and Essencial UI filters migrate without losing personal preferences',async()=>{
  const preserved=preview.sessions.find(s=>s.type!=='service');
  for(const legacyPriority of ['Alta','Essencial']){
    const store=storage();
    store.setItem('hemo2026:flora:ui:v1',JSON.stringify({b18ViewChoice:'grid',priority:legacyPriority}));
    store.setItem('hemo2026:flora:preferences:v1',JSON.stringify({version:1,items:[{sessionId:preserved.id,priority:'Essencial',interest:'Alto interesse',attending:true}]}));
    const app=await start('?preview=1',store,390);
    assert.equal(app.st.priority,'','legacy interface priority is cleared');
    assert.equal(app.st.interest,'');
    assert.equal(app.st.recommendation,'recommended');
    assert.equal(app.st.view,'list');
    assert.equal(app.st.prefs.get(preserved.id).priority,'Essencial');
    assert.equal(app.st.prefs.get(preserved.id).attending,true);
    assert.match(app.get('eventCount').textContent,/11 sessões em quarta/);
    app.st.recommendation='baixa';app.render();
    const persisted=JSON.parse(store.data.get('hemo2026:flora:ui:v1'));
    assert.equal(persisted.recommendation,'baixa');
    assert.equal(persisted.priority,'');
    const restored=await start('?preview=1',store,390);
    assert.equal(restored.st.recommendation,'baixa');
    assert.equal(restored.st.priority,'');
    assert.equal(restored.st.prefs.get(preserved.id).priority,'Essencial');
    restored.st.priority='Alta';restored.render();
    const intentionallyChosen=await start('?preview=1',store,390);
    assert.equal(intentionallyChosen.st.priority,'Alta');
  }
 });

test('UX1-R1: Minha agenda shows saved Baixa sessions and preserves Flora filter on return',async()=>{
  const low=preview.sessions.find(s=>s.day==='2026-10-31'&&s.recommendation?.level==='baixa'&&s.type!=='service');
  assert.ok(low,'preview must contain a day 31 Baixa session');
  const store=storage();
  store.setItem('hemo2026:flora:preferences:v1',JSON.stringify({version:1,items:[{sessionId:low.id,attending:true,interest:'Talvez'}]}));
  const app=await start('?preview=1',store,390);
  app.st.day='2026-10-31';app.render();
  assert.equal(app.st.recommendation,'recommended');
  assert.match(app.get('eventCount').textContent,/6 sessões em sábado/);
  app.st.tab='mine';app.render();
  assert.match(app.get('sessions').innerHTML,new RegExp(low.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(app.get('eventCount').textContent,/1 sessão em sábado/);
  assert.equal(app.st.prefs.get(low.id).attending,true);
  app.st.tab='program';app.render();
  assert.equal(app.st.recommendation,'recommended');
  assert.doesNotMatch(app.get('sessions').innerHTML,new RegExp(low.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  const restored=await start('?preview=1',store,390);
  assert.equal(restored.st.day,'2026-10-31');
  assert.equal(restored.st.recommendation,'recommended');
  assert.equal(restored.st.prefs.get(low.id).attending,true);
 });
