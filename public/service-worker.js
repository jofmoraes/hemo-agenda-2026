// Only this app's public assets and HEMO cache namespace are managed.
const CACHE='hemo2026:public:b2ux2-v1';
const SHELL=['/','/index.html','/b18.css','/b18.js','/schedule.json','/schedule-utils.js','/schedule-mode.js','/logo-hemo.svg','/icon-192.png','/icon-512.png','/manifest.webmanifest'];
const CODE=new Set(['/','/index.html','/b18.css','/b18.js','/schedule-utils.js','/schedule-mode.js','/manifest.webmanifest']);
const DATA=new Set(['/schedule.json','/preview-schedule.json']);

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys()
    .then(names=>Promise.all(names.filter(name=>name.startsWith('hemo2026:')&&name!==CACHE).map(name=>caches.delete(name))))
    .then(()=>self.clients.claim())
));

function unavailableResponse(){
  return new Response('Offline resource unavailable',{status:503,statusText:'Service Unavailable',headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
}

async function networkFirst(request,fallback=''){
  try{
    const response=await fetch(request);
    if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}
    return response;
  }catch{
    const cached=await caches.match(request);
    if(cached)return cached;
    if(fallback){const fallbackResponse=await caches.match(fallback);if(fallbackResponse)return fallbackResponse;}
    return unavailableResponse();
  }
}

async function dataFirst(request){
  try{
    const response=await fetch(request);
    if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}
    return response;
  }catch{return caches.match(request);}
}

self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
  if(request.mode==='navigate'){event.respondWith(networkFirst(request,'/index.html'));return;}
  if(DATA.has(url.pathname)){event.respondWith(dataFirst(request));return;}
  if(CODE.has(url.pathname)){event.respondWith(networkFirst(request));return;}
  if(SHELL.includes(url.pathname))event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));return response})));
});
