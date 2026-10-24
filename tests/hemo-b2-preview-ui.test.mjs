import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {conflictIds,layoutDay,minutes,normalize} from '../public/schedule-utils.js';
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
async function start(search,store=storage()){
 const f=fakeDocument(),requests=[];
 const fetch=async(url,{cache}={})=>{requests.push({url,cache});return {ok:true,json:async()=>search.includes('preview=1')?preview:production}};
 const context={document:f.document,window:{location:{search},innerWidth:390,addEventListener(){}},
   navigator:{},localStorage:store,fetch,URL,conflictIds,layoutDay,minutes,normalize,
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
