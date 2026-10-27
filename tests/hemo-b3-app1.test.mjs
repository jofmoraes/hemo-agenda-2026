import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditWorksCatalog,filterWorks,paginateWorks} from '../public/works-utils.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const catalog=JSON.parse(read('public/works-catalog.json'));
const production=JSON.parse(read('public/schedule.json'));

test('B3 APP1: catálogo compacto possui 1.987 IDs únicos e sem campos brutos',()=>{
 assert.deepEqual(auditWorksCatalog(catalog),[]);
 assert.equal(catalog.works.length,1987);
 assert.equal(new Set(catalog.works.map(work=>work.id)).size,1987);
 assert.equal(catalog.source.completenessVerified,false);
 assert.equal(catalog.counts.gshIncluded,27);
 assert.equal(catalog.counts.byModality['Painel'],1430);
 assert.equal(catalog.counts.byModality['Visita Guiada'],447);
 assert.equal(catalog.counts.byModality['Apresentação Oral'],110);
 assert.ok(catalog.works.every(work=>!Object.keys(work).some(key=>['raw','detail','listMetaText','sanitizedHTML','summary','keywords','resources'].includes(key))));
});

test('B3 APP1: GSH usa uma única categoria e mantém leads fora do filtro',()=>{
 const gsh=catalog.works.filter(work=>work.gsh);
 assert.equal(gsh.length,27);
 assert.equal(gsh.filter(work=>work.gsh.status==='AUTHORSHIP_CONFIRMED').length,7);
 assert.equal(gsh.filter(work=>work.gsh.status==='INSTITUTION_CONFIRMED').length,14);
 assert.equal(gsh.filter(work=>work.gsh.status==='TITLE_RELATED_PENDING_AFFILIATION').length,6);
 assert.equal(catalog.works.find(work=>work.id==='3566').gsh,null);
 for(const id of ['4264','4097','5894','5626','4067'])assert.equal(catalog.works.find(work=>work.id===id).gsh,null);
 assert.equal(catalog.gshReview.institutionalDisclosure117IsNotIndividualCatalog,true);
});

test('B3 APP1: filtros e paginação são limitados ao catálogo carregado',()=>{
 const byId=new Map(catalog.works.map(work=>[work.id,work]));
 assert.equal(filterWorks(catalog.works,{search:'3939'}).length,1);
 assert.equal(filterWorks(catalog.works,{gshOnly:true}).length,27);
 assert.equal(filterWorks(catalog.works,{day:'2026-10-30',modality:'Apresentação Oral'}).length,69);
 const saved=new Map([['3939',{workId:'3939',interest:'Alto interesse'}]]);
 assert.equal(filterWorks(catalog.works,{savedOnly:true},saved).length,1);
 assert.equal(paginateWorks(catalog.works,1,30).items.length,30);
 assert.equal(paginateWorks(catalog.works,67,30).items.length,7);
 assert.equal(byId.get('3855').time,null);
 assert.equal(byId.get('3855').timeStatus,'anomaly_pending');
 assert.ok(catalog.works.filter(work=>work.modality!=='Apresentação Oral').every(work=>work.time===null));
});

test('B3 APP1: aba, busca, backup separado e programação original preservados',()=>{
 const html=read('public/index.html');
 const js=read('public/b18.js');
 assert.match(html,/data-tab="works"[^>]*>Trabalhos científicos/);
 assert.match(html,/id="worksGshFilter"/);
 assert.match(html,/id="worksSearch"/);
 assert.match(html,/id="worksPagination"/);
 assert.match(js,/hemo2026:flora:works-preferences:v1/);
 assert.match(js,/hemo2026:flora:works-ui:v1/);
 assert.match(js,/works:\[\.\.\.st\.worksPrefs\.values\(\)\]/);
 const sw=read('public/service-worker.js');
 assert.match(sw,/hemo2026:public:b3final1-v1/);
 assert.match(sw,/works-catalog\.json/);
 assert.equal(production.status,'pending_b2');
 assert.deepEqual(production.sessions,[]);
 assert.deepEqual(production.works,[]);
});

test('B3 APP1: preferências de trabalhos usam envelope versionado e sobrevivem à recarga',()=>{
 const source=read('public/b18.js');
 assert.match(source,/WORKS_PREF_KEY='hemo2026:flora:works-preferences:v1'/);
 assert.match(source,/data\.version===1&&Array\.isArray\(data\.items\)/);
 assert.match(source,/localStorage\.setItem\(WORKS_PREF_KEY,JSON\.stringify\(\{version:1,items:/);
});
