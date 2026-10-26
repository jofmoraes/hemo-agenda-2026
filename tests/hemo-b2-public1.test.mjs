import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root=new URL('../',import.meta.url);
const read=(path)=>fs.readFileSync(new URL(path,root));

test('PUBLIC1: public PWA opens the partial preview without changing production data',()=>{
 const manifest=JSON.parse(read('public/manifest.webmanifest').toString('utf8'));
 assert.equal(manifest.id,'/?app=hemo2026-public1');
 assert.equal(manifest.start_url,'/?preview=1');
 assert.equal(manifest.scope,'/');
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.background_color,'#3f4145');
 assert.equal(manifest.theme_color,'#3f4145');
 assert.match(manifest.description,/Prévia pública e parcial/);
 assert.equal(manifest.icons.length,2);
 for(const [size,icon] of [[192,manifest.icons[0]],[512,manifest.icons[1]]]){
  assert.equal(icon.purpose,'any maskable');
  const png=read(`public/${icon.src.slice(1)}`);
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),size);
  assert.equal(png.readUInt32BE(20),size);
 }
 const production=JSON.parse(read('public/schedule.json').toString('utf8'));
 assert.equal(production.status,'pending_b2');
 assert.deepEqual(production.sessions,[]);
 const source=read('docs/evidence/hemo-b2-public1/icon-source.svg').toString('utf8');
 assert.match(source,/#3f4145/);
 assert.match(source,/#f3eadc/);
 assert.match(source,/#ad5d2d/);
 assert.match(source,/#14865b/);
 assert.doesNotMatch(source,/#47234d|#4b2350/i);
});

test('PUBLIC1: root redirect requires no preview query and cannot loop',()=>{
 const config=JSON.parse(read('vercel.json').toString('utf8'));
 assert.equal(config.redirects.length,1);
 const redirect=config.redirects[0];
 assert.equal(redirect.source,'/');
 assert.equal(redirect.destination,'/?preview=1');
 assert.equal(redirect.permanent,false);
 assert.deepEqual(redirect.missing,[{type:'query',key:'preview'}]);
});

test('PUBLIC1: first paint and cache use the public HEMO release identity',()=>{
 const html=read('public/index.html').toString('utf8');
 assert.match(html,/theme-color" content="#3f4145"/);
 assert.match(html,/apple-mobile-web-app-status-bar-style" content="black-translucent"/);
 assert.match(html,/Carregando agenda/);
 assert.match(html,/28 a 31 de outubro · Rio de Janeiro/);
 assert.match(html,/preload" href="\/logo-hemo\.svg"/);
 assert.match(html,/href="\/\?preview=0" id="exitPreview"/);
 const sw=read('public/service-worker.js').toString('utf8');
 assert.match(sw,/const CACHE='hemo2026:public:b2public1-v1'/);
 assert.doesNotMatch(sw,/hemo2026:public:b2ux2-v1|hemo2026:public:b2w2-v1/);
 assert.doesNotMatch(sw,/localStorage|sessionStorage/);
});
