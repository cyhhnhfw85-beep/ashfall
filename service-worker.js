const CACHE='ashfall-08926-refuge-ui';
const FILES=['./','./index.html','./game.css?v=08926','./game.js?v=08926','./immersion.js?v=08926','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('ashfall-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).then(resp=>{if(resp.ok){let cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return resp}).catch(()=>caches.match(e.request)))});
