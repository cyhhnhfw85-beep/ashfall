const CACHE='ashfall-08978b-free-chest-sector';
const FILES=['./','./index.html','./game.css?v=08978b','./identity-tokens.css?v=08978b','./identity-components.css?v=08978b','./identity-integrated.css?v=08978b','./loot-phase.css?v=08978b','./progression-phase.css?v=08978b','./equipment-phase.css?v=08978b','./longterm-phase.css?v=08978b','./home-simplified.css?v=08978b','./refuge-ui-clean.css?v=08978b','./assets/chest_common.webp','./assets/chest_common_charging.webp','./assets/chest_common_open.webp','./assets/chest_rare.webp','./assets/chest_rare_charging.webp','./assets/chest_rare_open.webp','./assets/chest_epic.webp','./assets/chest_epic_charging.webp','./assets/chest_epic_open.webp','./assets/nomade/pistol_complete.png','./assets/nomade/rifle_complete.png','./identity.js?v=08978b','./game.js?v=08978b','./immersion.js?v=08978b','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
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
