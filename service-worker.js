const CACHE='ashfall-0902-graphics-p2';
const FILES=['./','./index.html','./game.css?v=0902g2','./identity-tokens.css?v=0902g2','./identity-components.css?v=0902g2','./identity-integrated.css?v=0902g2','./loot-phase.css?v=0902g2','./progression-phase.css?v=0902g2','./equipment-phase.css?v=0902g2','./longterm-phase.css?v=0902g2','./home-simplified.css?v=0902g2','./refuge-ui-clean.css?v=0902g2','./equipment2.css?v=0902g2','./graphics-p1.css?v=0902g2','./assets/hud/nomad-badge.png','./assets/visual2/hero/torso-front.png','./assets/visual2/hero/torso-side.png','./assets/visual2/hero/torso-back.png','./assets/visual2/hero/leg-left.png','./assets/visual2/hero/leg-right.png','./assets/visual2/hero/pack.png','./assets/visual2/manifest.json','./assets/weapons_framed/carbine_k17.png','./assets/weapons_framed/cendre.png','./assets/weapons_framed/impulse.png','./assets/weapons_framed/ion.png','./assets/weapons_framed/nomade9.png','./assets/weapons_framed/pistol_reinforced.png','./assets/weapons_framed/pistol_rescue.png','./assets/weapons_framed/pistol_used.png','./assets/weapons_framed/precision.png','./assets/weapons_framed/prototype.png','./assets/weapons_framed/reliquat.png','./assets/weapons_framed/rifle_industrial.png','./assets/weapons_framed/rifle_recovery.png','./assets/weapons_framed/smg_sector.png','./assets/weapons_framed/spectre.png','./assets/weapons_framed/vektor.png','./assets/chest_common.webp','./assets/chest_common_charging.webp','./assets/chest_common_open.webp','./assets/chest_rare.webp','./assets/chest_rare_charging.webp','./assets/chest_rare_open.webp','./assets/chest_epic.webp','./assets/chest_epic_charging.webp','./assets/chest_epic_open.webp','./assets/nomade/pistol_complete.png','./assets/nomade/rifle_complete.png','./identity.js?v=0902g2','./equipment2-core.js?v=0902g2','./nomad2-renderer.js?v=0902g2','./game.js?v=0902g2','./immersion.js?v=0902g2','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
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
