import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const sw=readFileSync(new URL('../public/service-worker.js',import.meta.url),'utf8');

function harness({fetchImpl=async request=>new Response(`network:${request.url||request}`,{status:200})}={}){
 const listeners=new Map(),deleted=[],cacheData=new Map();
 const makeCache=name=>({
  name,
  addAll:async paths=>{for(const path of paths)cacheData.set(`${name}:${path}`,`cached:${path}`)},
  put:async(request,response)=>{cacheData.set(`${name}:${request.url||request}`,response)},
  match:async request=>cacheData.get(`${name}:${request.url||request}`)
 });
 const caches={
  open:async name=>{if(!cacheData.has(`__cache:${name}`))cacheData.set(`__cache:${name}`,makeCache(name));return cacheData.get(`__cache:${name}`)},
  keys:async()=>[...new Set([...cacheData.keys()].filter(key=>key.startsWith('__cache:')).map(key=>key.slice(8)))],
  delete:async name=>{deleted.push(name);for(const key of [...cacheData.keys()])if(key===`__cache:${name}`||key.startsWith(`${name}:`))cacheData.delete(key);return true},
  match:async request=>{for(const name of await caches.keys()){const hit=cacheData.get(`${name}:${request.url||request}`);if(hit)return hit}return undefined}
 };
 const self={location:{origin:'https://hemo.test'},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(type,handler)=>listeners.set(type,handler)};
 vm.runInNewContext(sw,{self,caches,fetch:fetchImpl,Response,URL,console});
 const dispatch=async(type,extra={})=>{let pending;listeners.get(type)({...extra,waitUntil:promise=>{pending=promise},respondWith:promise=>{pending=promise}});return pending};
 return {caches,cacheData,deleted,dispatch};
}

test('UX2: rotates only HEMO caches after a browser was controlled by the previous SW',async()=>{
 const h=harness();
 await h.caches.open('hemo2026:public:b2w2-v1');
 await h.caches.open('conahp:public:legacy');
 await h.caches.open('riw:public:legacy');
 await h.dispatch('install');
 await h.dispatch('activate');
 const names=await h.caches.keys();
 assert.ok(names.includes('hemo2026:public:b2ux2-v1'));
 assert.ok(!names.includes('hemo2026:public:b2w2-v1'));
 assert.ok(names.includes('conahp:public:legacy'));
 assert.ok(names.includes('riw:public:legacy'));
 assert.deepEqual(h.deleted,['hemo2026:public:b2w2-v1']);
 assert.doesNotMatch(sw,/localStorage|sessionStorage/);
});

test('UX2: code assets are network-first with safe cached fallback and preview stays opt-in',async()=>{
 const h=harness();
 assert.match(sw,/const CACHE='hemo2026:public:b2ux2-v1'/);
 assert.match(sw,/const CODE=new Set/);
 assert.match(sw,/function networkFirst/);
 assert.doesNotMatch(sw,/const SHELL=\[[^\]]*preview-schedule\.json/);
 const request={method:'GET',mode:'cors',url:'https://hemo.test/b18.js'};
 const response=await h.dispatch('fetch',{request});
 assert.match(await response.text(),/network:https:\/\/hemo\.test\/b18\.js/);
});

test('UX2-R1: offline code uses its own cache and never falls back to HTML',async()=>{
 const h=harness({fetchImpl:async()=>{throw new Error('offline')}});
 const cache=await h.caches.open('hemo2026:public:b2ux2-v1');
 await cache.put({url:'https://hemo.test/b18.js'},new Response('cached-js',{status:200,headers:{'Content-Type':'text/javascript'}}));
 const response=await h.dispatch('fetch',{request:{method:'GET',mode:'cors',url:'https://hemo.test/b18.js'}});
 assert.equal(response.status,200);
 assert.equal(await response.text(),'cached-js');
 assert.match(response.headers.get('Content-Type'),/javascript/);
});

test('UX2-R1: offline code cache miss returns 503 and is not cached',async()=>{
 const h=harness({fetchImpl:async()=>{throw new Error('offline')}});
 const response=await h.dispatch('fetch',{request:{method:'GET',mode:'cors',url:'https://hemo.test/b18.css'}});
 assert.equal(response.status,503);
 assert.match(response.headers.get('Content-Type'),/text\/plain/);
 assert.doesNotMatch(await response.text(),/<html/i);
 const cache=await h.caches.open('hemo2026:public:b2ux2-v1');
 assert.equal(await cache.match({url:'https://hemo.test/b18.css'}),undefined);
});

test('UX2-R1: offline navigation may use the cached HTML shell',async()=>{
 const h=harness({fetchImpl:async()=>{throw new Error('offline')}});
 const cache=await h.caches.open('hemo2026:public:b2ux2-v1');
 await cache.put('/index.html',new Response('<!doctype html><title>cached shell</title>',{status:200,headers:{'Content-Type':'text/html'}}));
 const response=await h.dispatch('fetch',{request:{method:'GET',mode:'navigate',url:'https://hemo.test/?preview=1'}});
 assert.equal(response.status,200);
 assert.match(response.headers.get('Content-Type'),/text\/html/);
 assert.match(await response.text(),/cached shell/);
});
