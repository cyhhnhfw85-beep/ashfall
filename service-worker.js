const CACHE='ashfall-0900b1-equipments-2';
const FILES=['./','./index.html','./game.css?v=0900b1','./identity-tokens.css?v=0900b1','./identity-components.css?v=0900b1','./identity-integrated.css?v=0900b1','./loot-phase.css?v=0900b1','./progression-phase.css?v=0900b1','./equipment-phase.css?v=0900b1','./longterm-phase.css?v=0900b1','./home-simplified.css?v=0900b1','./refuge-ui-clean.css?v=0900b1','./equipment2.css?v=0900b1','./assets/chest_common.webp','./assets/chest_common_charging.webp','./assets/chest_common_open.webp','./assets/chest_rare.webp','./assets/chest_rare_charging.webp','./assets/chest_rare_open.webp','./assets/chest_epic.webp','./assets/chest_epic_charging.webp','./assets/chest_epic_open.webp','./assets/nomade/pistol_complete.png','./assets/nomade/rifle_complete.png','./identity.js?v=0900b1','./equipment2-core.js?v=0900b1','./game.js?v=0900b1','./immersion.js?v=0900b1','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ashfall-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==location.origin)return;
 event.respondWith((async()=>{
  try{
   const fresh=await fetch(request,{cache:'no-store'});
   if(fresh.ok){
    const parsed=new URL(request.url);
    if(!parsed.searchParams.has('ashfall_check')&&!parsed.searchParams.has('ashfall_refresh')){
     const copy=fresh.clone();
     const key=request.mode==='navigate'?'./index.html':request;
     event.waitUntil(caches.open(CACHE).then(cache=>cache.put(key,copy)).catch(()=>{}));
    }
   }
   return fresh;
  }catch(err){
   return (await caches.match(request))||(request.mode==='navigate'?await caches.match('./index.html'):null)||Response.error();
  }
 })());
});
