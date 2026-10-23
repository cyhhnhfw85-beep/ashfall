(()=>{'use strict';
const $=id=>document.getElementById(id), cv=$('canvas'),cx=cv.getContext('2d'), KEY='ashfall_pwa_v1';
const pick=(a,b)=>Math.floor(a+Math.random()*(b-a+1)), clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const uid=()=> 'af-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
const starter=()=>({id:uid(),name:'Pistolet usé',rar:'Commun',dmg:13,rate:1.8});
const fresh=()=>({version:1,credits:400,research:0,hpLv:0,dmgLv:0,runs:0,equipped:starter(),stash:[],insured:null,run:null,stats:{extractions:0,deaths:0}});
let data=fresh(), player=null, bullets=[],sparks=[],joy={x:0,y:0,pointer:null,cx:0,cy:0},keyState={},overlay='',last=0,drawTime=0,tickSave=0;
function msg(v){$('log').textContent=v}
function valid(d){return d&&d.version===1&&Number.isFinite(d.credits)&&Number.isFinite(d.research)&&Array.isArray(d.stash)&&((d.equipped&&typeof d.equipped.id==='string')||(d.run&&d.run.equipped&&typeof d.run.equipped.id==='string'))&&(!d.run||(Array.isArray(d.run.rooms)&&d.run.rooms.length>0&&Number.isInteger(d.run.current)&&d.run.rooms[d.run.current]&&d.run.player))}
// Two verified snapshots protect against incomplete or invalid primary saves.
const RECOVERY_KEY=KEY+'_recovery', SAVE_STATUS_KEY=KEY+'_lastok';
let persistenceWarning=false;
function readSnapshot(k){try{const raw=localStorage.getItem(k);if(!raw)return null;const obj=JSON.parse(raw);return valid(obj)?obj:null}catch(e){return null}}
function hasActiveRun(d){return !!(d&&d.run&&Array.isArray(d.run.rooms)&&d.run.rooms.length&&d.run.player)}
function persist(silent=true){
 if(data.run&&player)data.run.player={...player};
 try{
  const serialized=JSON.stringify(data);
  if(!valid(JSON.parse(serialized)))throw Error('invalid snapshot');
  // Commit the current state first; a completed run is authoritative too.
  localStorage.setItem(KEY,serialized);
  if(!readSnapshot(KEY))throw Error('save verification failed');
  // Recovery mirrors the last verified state, never a stale unfinished run.
  try{localStorage.setItem(RECOVERY_KEY,serialized)}catch(_){}
  try{localStorage.setItem(SAVE_STATUS_KEY,String(Date.now()))}catch(_){}
  persistenceWarning=false;
  if(!silent)msg('✓ Sauvegarde locale vérifiée.');return true;
 }catch(e){persistenceWarning=true;msg('⚠ Sauvegarde impossible : exporte ton code de secours dès maintenant.');return false}
}
try{
 const main=readSnapshot(KEY),recovery=readSnapshot(RECOVERY_KEY);
 // A valid primary state always wins, including run:null after death/extraction.
 // Only use recovery when the primary is absent or corrupt.
 if(main)data=main;
 else if(recovery)data=recovery;
}catch(e){}

function region(){if(!data.regions)data.regions={k17:{maxSector:0,bossDefeated:false,expeditions:0}};if(!data.regions.k17)data.regions.k17={maxSector:0,bossDefeated:false,expeditions:0};if(!Array.isArray(data.regions.k17.outposts))data.regions.k17.outposts=[];return data.regions.k17}
function isLarge(r=data.run){return !!(r&&r.rooms&&r.rooms.length===50)}
function isArena(id,r=data.run){return isLarge(r)?r.arenaIds.includes(id):id===4}
function isExit(id,r=data.run){return isLarge(r)?r.exitIds.includes(id):id===8}
function isBoss(id,r=data.run){return isLarge(r)?id===r.bossId:false}
function isGuarded(id,r=data.run){return isLarge(r)?(r.rooms[id].kind==='guarded'||isArena(id,r)||isBoss(id,r)):[4,5,6,7].includes(id)}
function value(w){return Math.max(20,Math.round(w.dmg*17*(w.rar==='Épique'?2.3:w.rar==='Rare'?1.5:1)))}
// Prix de récupération indépendants du prix théorique des armes : les stats élevées
// ne peuvent plus transformer le butin en source disproportionnée de crédits.
const SALVAGE_BANDS={Commun:[25,50],Inhabituel:[50,100],Rare:[100,200],'Épique':[200,350],'Légendaire':[400,650],Mythique:[500,750]};
function salvagePrice(w){
 if(!w)return 0;
 const [lo,hi]=SALVAGE_BANDS[w.rar]||SALVAGE_BANDS.Commun;
 const dmg=Number.isFinite(Number(w.dmg))?Math.max(0,Number(w.dmg)):0;
 const rate=Number.isFinite(Number(w.rate))?Math.max(0,Number(w.rate)):0;
 const score=Math.min(1,Math.max(0,(dmg-12)/55*.72+(rate-1)/3*.28));
 let amount=Math.round((lo+(hi-lo)*score)/5)*5;
 // Pièces achetées : au plus 25 % du coût historique si connu.
 if(Number.isFinite(w.purchasePrice)&&w.purchasePrice>0)amount=Math.min(amount,Math.floor(w.purchasePrice*.25));
 // Compatibilité des anciens achats non étiquetés (0.8.9.2–0.8.9.4).
 // Leur éventuel prix du catalogue empêche un aller-retour profitable.
 if(!Number.isFinite(w.purchasePrice)){
  const catalog=typeof MERCHANT_CATALOG!=='undefined'?MERCHANT_CATALOG.find(x=>x.name===w.name&&x.rar===w.rar&&x.dmg===w.dmg&&x.rate===w.rate):null;
  if(catalog)amount=Math.min(amount,Math.floor(merchantPrice(catalog)*.25));
 }
 return Math.max(0,Math.floor(amount));
}
function premium(){return Math.max(20,Math.ceil(value(data.equipped)*.12))}
function price(){return Math.round(value(data.equipped)*.55)}
function tint(w){return ({'Commun':'#d9e2e9','Inhabituel':'#60de98','Rare':'#5aa9ff','Épique':'#c184ff','Légendaire':'#ffbd4c','Mythique':'#ff667c'})[w.rar]||'#d9e2e9'}
function makeWeapon(level=0){let r=Math.random(),rar=r<.075?'Épique':r<.32?'Rare':'Commun';return{id:uid(),name:['Nomade','Vektor','Spectre','Ion','Cendre'][pick(0,4)]+'-'+pick(1,9),rar,dmg:pick(15,23)+level*2+(rar==='Rare'?8:rar==='Épique'?17:0),rate:Math.round((1.3+Math.random()*1.4)*10)/10}}
const maxHp=()=>100+data.hpLv*15;
const damage=()=>data.run.equipped.dmg+data.dmgLv*3;
function pos(i){let room=data.run?.rooms?.[i];return room&&Number.isFinite(room.gx)?[room.gx,room.gy]:[i%3,Math.floor(i/3)]}
function adjacent(i){let [x,y]=pos(i),r=data.run;if(isLarge(r))return r.rooms.filter(z=>Math.abs(z.gx-x)+Math.abs(z.gy-y)===1).map(z=>z.id);let out=[];if(x>0)out.push(i-1);if(x<2)out.push(i+1);if(y>0)out.push(i-3);if(y<2)out.push(i+3);return out}
function graph(){let seen=new Set([0]),edges=[],front=[0];while(front.length){let i=front[pick(0,front.length-1)],next=adjacent(i).filter(n=>!seen.has(n));if(!next.length){front=front.filter(x=>x!==i);continue}let n=next[pick(0,next.length-1)];edges.push([i,n]);seen.add(n);front.push(n)}return edges}
function doors(i){let [x,y]=pos(i);return adjacent(i).filter(n=>data.run.edges.some(e=>e.includes(i)&&e.includes(n))).map(n=>{let[a,b]=pos(n);return{to:n,side:a>x?'right':a<x?'left':b>y?'bottom':'top'}})}
function makeLargeMap(){
 let nodes=[{id:0,gx:0,gy:0}],occupied=new Set(['0,0']),edges=[];
 // Randomized growing tree with branching, nonrectangular footprint.
 while(nodes.length<50){let parent=nodes[pick(0,nodes.length-1)],directions=[[1,0],[-1,0],[0,1],[0,-1]].sort(()=>Math.random()-.5),added=false;
 for(let [dx,dy] of directions){let x=parent.gx+dx,y=parent.gy+dy,key=x+','+y;if(occupied.has(key)||Math.abs(x)>8||Math.abs(y)>8)continue;let id=nodes.length;nodes.push({id,gx:x,gy:y});occupied.add(key);edges.push([parent.id,id]);added=true;break}
 if(!added&&nodes.length<50&&nodes.length>25){ // retry other parents; dense positions are allowed
 }
 }
 for(let a of nodes)for(let b of nodes)if(b.id>a.id&&Math.abs(a.gx-b.gx)+Math.abs(a.gy-b.gy)===1&&!edges.some(e=>e.includes(a.id)&&e.includes(b.id))&&Math.random()<.0555)edges.push([a.id,b.id]);
 let distance=Array(50).fill(Infinity);distance[0]=0;let queue=[0];for(let i=0;i<queue.length;i++){let id=queue[i];for(let e of edges){let nxt=e[0]===id?e[1]:e[1]===id?e[0]:-1;if(nxt>=0&&distance[nxt]===Infinity){distance[nxt]=distance[id]+1;queue.push(nxt)}}}
 let sorted=nodes.slice(1).sort((a,b)=>distance[b.id]-distance[a.id]);let bossId=sorted[0].id;
 let candidates=nodes.slice(1).filter(z=>z.id!==bossId&&distance[z.id]>=3);
 function take(count,criterion=()=>true){let opts=candidates.filter(z=>criterion(z));let result=[];while(result.length<count&&opts.length){let i=pick(0,opts.length-1),o=opts.splice(i,1)[0];candidates=candidates.filter(v=>v.id!==o.id);result.push(o.id)}return result}
 let exitIds=take(3,z=>distance[z.id]>=4);let arenaIds=take(4,z=>distance[z.id]>=3);let secrets=take(4);let guarded=take(7);
 let maxDepth=Math.max(...distance.filter(Number.isFinite));let rooms=nodes.map(n=>({...n,depth:distance[n.id],sector:Math.min(3,Math.floor(distance[n.id]/(maxDepth+1)*4)),kind:n.id===0?'start':n.id===bossId?'boss':exitIds.includes(n.id)?'exit':arenaIds.includes(n.id)?'arena':secrets.includes(n.id)?'secret':guarded.includes(n.id)?'guarded':'standard',seen:n.id===0,spawned:false,enemies:[],chest:n.id===0||exitIds.includes(n.id)||n.id===bossId?'none':arenaIds.includes(n.id)?'none':Math.random()<.63?'closed':'none',activated:false,cleared:false,arenaWave:0,arenaReward:false}));
 // One non-combat forward outpost per advanced sector. Generated anew every expedition.
 let outpostIds=[];
 for(let sector=1;sector<=3;sector++){
  let eligible=rooms.filter(z=>z.sector===sector&&z.kind==='standard'&&z.id!==bossId).sort((a,b)=>a.depth-b.depth);
  if(!eligible.length)eligible=rooms.filter(z=>z.sector===sector&&z.id!==bossId&&!exitIds.includes(z.id)&&!arenaIds.includes(z.id));
  if(!eligible.length&&sector===3){eligible=rooms.filter(z=>z.sector===2&&z.kind==='standard').sort((a,b)=>b.depth-a.depth);if(eligible.length)eligible[0].sector=3}
  if(eligible.length){let z=eligible[0];z.kind='outpost';z.chest='none';outpostIds.push(z.id)}
 }
 return {rooms,edges,arenaIds,exitIds,bossId,outpostIds};
}
const SECTORS=[{name:'PÉRIPHÉRIE',bg:'#202f31',grid:'#354846',accent:'#83d9b0',enemy:'mutant',hazard:'Débris et mutants rapides'},{name:'LABORATOIRES',bg:'#152d3c',grid:'#26516a',accent:'#60cef4',enemy:'drone',hazard:'Rayons de sécurité'},{name:'FONDERIE',bg:'#372921',grid:'#65402b',accent:'#ffae62',enemy:'brute',hazard:'Évents thermiques'},{name:'CITADELLE',bg:'#292334',grid:'#50374e',accent:'#e898de',enemy:'sentinel',hazard:'Défenses renforcées'}];
function sectorOf(room){return clamp(room?.sector||0,0,3)}
function environment(room){if(!room)return;let sec=sectorOf(room);if(room.envPhase===undefined)room.envPhase=0;if(room.hazardCooldown===undefined)room.hazardCooldown=2.5;if(room.hazardOn===undefined)room.hazardOn=false;if(room.hazardX===undefined)room.hazardX=sec===1?180:sec===2?240:180;}
// Les ennemis ne peuvent pas apparaitre dans une hitbox solide.
// La geometrie utilisee ici est celle du moteur de collisions joueur/projectiles.
function spawnSafe(room,others=[],preferred=null){
 const allowed=(x,y)=>x>=42&&x<=318&&y>=48&&y<=345&&!collidesSolid(x,y,17,room)&&
   !others.some(e=>Math.hypot(e.x-x,e.y-y)<35)&&
   !(player&&data.run&&data.run.rooms[data.run.current]===room&&Math.hypot(player.x-x,player.y-y)<43);
 if(preferred&&allowed(preferred.x,preferred.y))return preferred;
 for(let attempt=0;attempt<100;attempt++){
  const x=pick(49,311),y=pick(52,310);
  if(allowed(x,y))return {x,y};
 }
 // Grille de secours deterministe : pas de spawn dans les obstacles si le hasard echoue.
 for(let y=60;y<=310;y+=25)for(let x=55;x<=305;x+=25)if(allowed(x,y))return {x,y};
 return null;
}
function sanitizeEnemyPositions(room){
 if(!room||!Array.isArray(room.enemies))return false;
 let changed=false,placed=[];
 for(const e of room.enemies){
  if(!Number.isFinite(e.x)||!Number.isFinite(e.y)||collidesSolid(e.x,e.y,14,room)){
   const pos=spawnSafe(room,placed);
   if(pos){e.x=pos.x;e.y=pos.y;e.wind=0;changed=true;}
  }
  placed.push(e);
 }
 return changed;
}
function enemiesFor(id){let r=data.run,room=r?.rooms[id];if(id===0||room?.kind==='outpost')return[];let arena=isArena(id,r),boss=isBoss(id,r),sec=sectorOf(room);let count=boss?3:arena?4:isExit(id,r)?2:pick(2,3);const enemies=[];
 for(let k=0;k<count;k++){
  let type=(boss||arena)&&k===count-1?'sentinel':sec===0?(k%2?'ranged':'chaser'):sec===1?(k%3?'ranged':'drone'):sec===2?(k%2?'brute':'ranged'):(k%2?'sentinel':'drone');
  let hp=(type==='sentinel'?(boss?250:125):type==='brute'?125:type==='drone'?65:type==='ranged'?60:75)*(1+sec*.12);
  const pos=spawnSafe(room,enemies);
  if(pos)enemies.push({id:uid(),type,...pos,hp,max:hp,cd:Math.random()+.6,wind:0,aim:0});
 }
 return enemies;
}
function spawnReinforcement(room,count){for(let k=0;k<count;k++){
 const type=k%2===0?'ranged':'chaser',hp=type==='ranged'?60:75;
 const pos=spawnSafe(room,room.enemies,{x:k%2?292:67,y:85+35*(k%3)});
 if(pos)room.enemies.push({id:uid(),type,...pos,hp,max:hp,cd:1,wind:0,aim:0});
}}

function createRun(){let m=makeLargeMap();region().expeditions++;return {...m,current:0,visited:[0],bag:[],equipped:data.equipped,insuredId:data.insured,earnedCredits:0,economy:{enemy:0,chest:0,room:0,arena:0,boss:0},xp:0,xpTotal:0,runLevel:1,runPerks:{},pendingLevels:0,objectives:[],exitTime:0,exitStarted:false,exitWave:0,player:{x:180,y:310,hp:maxHp(),max:maxHp(),inv:0,fire:0,dash:0,dx:0,dy:0}}}
function setPlayer(){player=data.run?.player||null}

// Progression temporaire : aucun champ de sauvegarde permanent modifié.
const PERKS=[{id:'rapid',name:'Tir rapide',desc:'+8 %, +6 %, +4 % (max 3)',icon:'⚡'},
 {id:'power',name:'Munitions renforcées',desc:'+8 %, +6 %, +4 % (max 3)',icon:'✦'},
 {id:'speed',name:'Semelles tactiques',desc:'+7 % vitesse (max 3)',icon:'➤'},
 {id:'magnet',name:'Collecteur magnétique',desc:'+25 % portée (max 2)',icon:'◈'},
 {id:'vital',name:'Patch médical',desc:'+15 PV max et soin (max 3)',icon:'♥'},
 ];
function runProgress(){let r=data.run;if(!r)return null;
 if(!Number.isFinite(r.runLevel))r.runLevel=1;
 if(!Number.isFinite(r.xp))r.xp=0;
 if(!Number.isFinite(r.xpTotal))r.xpTotal=r.xp;
 if(!r.runPerks||typeof r.runPerks!=='object')r.runPerks={};
 if(!Number.isFinite(r.pendingLevels))r.pendingLevels=0;
 return r;
}
function xpThreshold(lv){return Math.round(10+lv*7+lv*lv*1.5)}
function collectXp(amount){let r=runProgress();if(!r)return;
 r.xp+=amount;r.xpTotal+=amount;
 let safety=0;while(r.xp>=xpThreshold(r.runLevel)&&safety++<50){r.xp-=xpThreshold(r.runLevel);r.runLevel++;r.pendingLevels++}
 if(r.pendingLevels>0&&overlay!=='level')openLevelChoice();
}
const PERK_CAPS={rapid:3,power:3,speed:3,magnet:2,vital:3};
function perkCount(id){let r=runProgress();return Math.min(PERK_CAPS[id]||3,Math.max(0,Number(r?.runPerks[id])||0))}
function perkBonus(id){let n=perkCount(id);if(id==='rapid'||id==='power')return [0,.08,.14,.18][n];if(id==='speed')return .07*n;if(id==='magnet')return .25*n;if(id==='cool')return .08*n;return 0}
function levelOptions(){let r=runProgress();const available=PERKS.filter(p=>perkCount(p.id)<PERK_CAPS[p.id]);
 if(!available.length){r.pendingLevels=0;r.levelChoices=null;return []}
 const previous=Array.isArray(r.levelChoices)?r.levelChoices.filter(id=>available.some(p=>p.id===id)):[];
 if(!previous.length||previous.length>3){r.levelChoices=[...available].sort(()=>Math.random()-.5).slice(0,3).map(o=>o.id)}
 else r.levelChoices=previous;
 return r.levelChoices.map(id=>PERKS.find(p=>p.id===id)).filter(Boolean)}
const PERK_STYLE={rapid:['OFFENSIF','perk-attack'],power:['DÉGÂTS','perk-damage'],speed:['MOBILITÉ','perk-mobility'],magnet:['COLLECTE','perk-utility'],vital:['SURVIE','perk-defense']};
function perkDescription(id,next){
 if(id==='rapid')return '+'+[0,8,14,18][next]+' % cadence totale';
 if(id==='power')return '+'+[0,8,14,18][next]+' % dégâts totaux';
 if(id==='speed')return '+'+(next*7)+' % vitesse totale';
 if(id==='magnet')return '+'+(next*25)+' % portée de collecte';
 if(id==='vital')return '+'+(next*15)+' PV max cumulés · soin +15 PV';
 return '';
}
function openLevelChoice(){let r=runProgress();if(!r||r.pendingLevels<=0)return;
 overlay='level';let opts=levelOptions();if(!opts.length){overlay='';$('overlay').hidden=true;persist();return}
 $('overlay').innerHTML='<div class="perk-screen"><div class="perk-top"><span class="perk-chip">✦ NIVEAU '+r.runLevel+'</span><span class="perk-duration">BONUS D’EXPÉDITION</span></div><h2>CHOISIS TON ÉVOLUTION</h2><p class="perk-intro">Une amélioration pour renforcer ton survivant. Combat en pause.</p><div class="perk-list">'+opts.map(o=>{let n=perkCount(o.id),cap=PERK_CAPS[o.id],sty=PERK_STYLE[o.id]||['ÉVOLUTION','perk-utility'];return '<button type="button" class="perk-card '+sty[1]+'" data-op="choosePerk" data-perk="'+o.id+'"><span class="perk-symbol">'+o.icon+'</span><span class="perk-copy"><span class="perk-category">'+sty[0]+'</span><strong>'+o.name+'</strong><span class="perk-effect">'+perkDescription(o.id,n+1)+'</span><span class="perk-level">NIVEAU '+(n+1)+' / '+cap+' <span class="perk-pips">'+Array.from({length:cap},(_,i)=>i<n+1?'◆':'◇').join(' ')+'</span></span></span><span class="perk-chevron">›</span></button>'}).join('')+'</div><p class="perk-footer">Ce choix reste actif jusqu’à la fin de l’expédition.</p></div>';
 $('overlay').hidden=false;persist();}
function choosePerk(id){let r=runProgress();if(!r||r.pendingLevels<=0||!r.levelChoices?.includes(id)||perkCount(id)>=PERK_CAPS[id])return;
 r.runPerks[id]=(r.runPerks[id]||0)+1;
 if(id==='vital'){player.max+=15;player.hp=Math.min(player.max,player.hp+15)}
 r.pendingLevels--;r.levelChoices=null;persist();closeOverlay();msg('✦ Amélioration temporaire obtenue : '+PERKS.find(p=>p.id===id).name);
 if(r.pendingLevels>0)openLevelChoice();else render();}
function hasLineOfSight(ax,ay,bx,by,room){let dist=Math.hypot(bx-ax,by-ay),steps=Math.ceil(dist/7);for(let i=1;i<steps;i++){let t=i/steps;if(collidesSolid(ax+(bx-ax)*t,ay+(by-ay)*t,4,room))return false}return true}
function lootIntegrity(){let r=data.run;if(!r)return true;let ids=new Set();for(let w of [r.equipped,...r.bag,...r.rooms.flatMap(z=>ground(z).filter(d=>d.kind==='weapon').map(d=>d.item))]){
 if(!w||!w.id)continue;if(ids.has(w.id))return false;ids.add(w.id)}return true}

// Butin propre à chaque salle : persiste avec l'expédition, jamais téléporté au sac.
function ground(room){if(!Array.isArray(room.drops))room.drops=[];return room.drops}
function lootSpawn(room,kind,x,y,item=null,amount=1){
 const drops=ground(room);let theta=Math.random()*Math.PI*2,rad=10+Math.random()*17;
 let px=clamp(x+Math.cos(theta)*rad,32,328),py=clamp(y+Math.sin(theta)*rad,40,358);
 // Éviter de laisser un objet à l'intérieur d'un décor solide.
 if(collidesSolid(px,py,8,room)){px=clamp(x,32,328);py=clamp(y,40,358)}
 drops.push({id:uid(),kind,item,amount,x:px,y:py,age:0,bounce:.32,got:false});
}
function lootUpdate(room,dt){
 const drops=ground(room);for(const d of drops){d.age=(d.age||0)+dt;d.bounce=Math.max(0,(d.bounce||0)-dt);
  const dist=Math.hypot(player.x-d.x,player.y-d.y);const magnet=1+perkBonus('magnet');const range=(d.kind==='xp'?104:68)*magnet;
  if(dist<range&&d.bounce<=0&&hasLineOfSight(d.x,d.y,player.x,player.y,room)){const speed=d.kind==='xp'?340:250;const t=Math.min(1,speed*dt/Math.max(1,dist));let tx=d.x+(player.x-d.x)*t,ty=d.y+(player.y-d.y)*t;if(!collidesSolid(tx,ty,6,room)){d.x=tx;d.y=ty}}
  if(Math.hypot(player.x-d.x,player.y-d.y)<18&&d.bounce<=0){
   if(d.kind==='xp'){collectXp(d.amount);d.got=true}
   else if(d.kind==='credits'){data.run.earnedCredits+=d.amount;data.run.economy??={enemy:0,chest:0,room:0,arena:0,boss:0};data.run.economy[d.source==='chest'?'chest':'enemy']=(data.run.economy[d.source==='chest'?'chest':'enemy']||0)+d.amount;d.got=true}
   else if(d.kind==='weapon'){
    if(data.run.bag.length<6){data.run.bag.push(d.item);msg('✦ '+d.item.rar+' : '+d.item.name+' ramassé !');d.got=true}
    else if(!d.warned){d.warned=true;msg('🎒 Sac plein : arme au sol conservée. Libère une place dans SAC.')}
   }
  }
 }
 room.drops=drops.filter(d=>!d.got);
}
function lootDraw(room){
 const now=performance.now()/1000;
 for(const d of ground(room)){
  const isXp=d.kind==='xp',isCredit=d.kind==='credits',col=isXp?'#74eced':isCredit?'#ffcb6e':tint(d.item||{});
  const bob=Math.sin(now*4+d.x*.04)*2-(d.bounce||0)*22;
  cx.save();cx.globalAlpha=.15;cx.fillStyle=col;cx.beginPath();cx.ellipse(d.x,d.y+5,isXp?10:19,isXp?7:12,0,0,Math.PI*2);cx.fill();cx.restore();
  if(d.kind==='weapon'&&['Épique','Légendaire','Mythique'].includes(d.item?.rar)){
    cx.save();cx.globalAlpha=.17+.07*Math.sin(now*4);cx.fillStyle=col;cx.fillRect(d.x-4,Math.max(24,d.y-45),8,43);cx.restore();
  }
  cx.fillStyle=col;cx.strokeStyle='#0c1522';cx.lineWidth=2;cx.beginPath();
  if(isXp){cx.moveTo(d.x,d.y-6+bob);cx.lineTo(d.x+6,d.y+bob);cx.lineTo(d.x,d.y+6+bob);cx.lineTo(d.x-6,d.y+bob)}
  else if(isCredit){cx.arc(d.x,d.y+bob,6,0,Math.PI*2)}
  else{cx.moveTo(d.x,d.y-11+bob);cx.lineTo(d.x+10,d.y+bob);cx.lineTo(d.x,d.y+11+bob);cx.lineTo(d.x-10,d.y+bob)}
  cx.closePath();cx.fill();cx.stroke();
 }
}

function cancelExtraction(r,reason){
 if(!r)return;
 const wasActive=!!r.exitStarted;
 r.exitStarted=false;r.exitCharge=0;r.exitTime=12;r.exitWave=0;
 if(wasActive&&reason)msg('↩ Extraction annulée : '+reason+'. Retourne au cercle pour recommencer.');
 if(wasActive)persist();
}
function enter(id,from){let r=data.run,room=r.rooms[id];
 // Une extraction n'a jamais le droit de survivre à un changement de salle.
 if(r.exitStarted||r.exitCharge)cancelExtraction(r,from===null?'':'tu as quitté la salle');
 r.current=id;room.seen=true;if(!r.visited.includes(id))r.visited.push(id);
if(isLarge(r)){let reg=region();reg.maxSector=Math.max(reg.maxSector,room.sector);}
environment(room);if(!room.spawned){room.spawned=true;room.enemies=enemiesFor(id);}
if(from!==null){let prev=r.rooms[from];let[a,b]=pos(from),[x,y]=pos(id);player.x=x>a?37:x<a?323:180;player.y=y>b?37:y<b?363:205}
sanitizeEnemyPositions(room);if(isArena(id,r)&&!room.cleared){enforceArena()}
else if(autoSecure(room)){persist()}
if(isBoss(id,r)&&!room.cleared){room.activated=true;msg('⚠ BOSS K-17 : portes scellées !')}
player.inv=.65;bullets=[];closeOverlay();persist();render();if(!isArena(id,r)&&!isBoss(id,r))msg(isExit(id,r)?'Terminal d’extraction détecté.':`K-17 · salle ${id+1}/50 · secteur ${room.sector+1}`)}
function start(){if(data.run){setPlayer();runProgress();if(data.run.pendingLevels>0)openLevelChoice();render();return}
 const selector=$('startSector');let sector=selector?Number(selector.value):0;
 data.run=createRun();data.equipped=null;data.insured=null;setPlayer();
 let target=sector>0&&region().outposts.includes(sector)?data.run.outpostIds.find(i=>data.run.rooms[i].sector===sector):0;
 if(!Number.isInteger(target))target=0;
 enter(target,null);msg(target?'Insertion par avant-poste du secteur '+(sector+1)+'. Carte régénérée.':'Expédition lancée. Explore et trouve une extraction.');}
function activateOutpost(){let r=data.run,room=r.rooms[r.current];if(room.kind!=='outpost'||Math.hypot(player.x-180,player.y-195)>=72)return false;
 const reg=region();if(!reg.outposts.includes(room.sector)){reg.outposts.push(room.sector);reg.outposts.sort((a,b)=>a-b);msg('📡 AVANT-POSTE SECTEUR '+(room.sector+1)+' ACTIVÉ ! Départ disponible au refuge.')}else msg('Avant-poste déjà activé.');
 room.activated=true;persist();render();return true;}
function enforceArena(){let r=data.run;if(!r||!isArena(r.current,r))return false;let room=r.rooms[r.current];if(!room||room.cleared)return false;if(room.activated&&room.arenaWave>=1)return false;room.activated=true;room.arenaWave=1;if(!room.spawned){room.spawned=true;room.enemies=enemiesFor(r.current)}if(!room.enemies?.length)room.enemies=enemiesFor(r.current);msg('⚠ ARÈNE : portes scellées automatiquement ! Vague 1/3.');persist();return true}
function locked(){let r=data.run;return !!(r&&((isArena(r.current,r)||isBoss(r.current,r))&&!r.rooms[r.current].cleared))}
function autoSecure(room){if(room&&!room.cleared&&room.spawned&&room.enemies.length===0&&room.kind!=='arena'&&room.kind!=='boss'){room.cleared=true;return true}return false}
function canPassDoor(to){let r=data.run;if(!r||locked())return false;let room=r.rooms[r.current];return !!(room.cleared||r.visited.includes(to)||r.rooms[to].seen)}

function interaction(){let r=data.run;if(!r)return null;let room=r.rooms[r.current];if(room.chest==='closed'&&Math.hypot(player.x-180,player.y-110)<62)return'chest';if(isExit(r.current,r)&&!r.exitStarted&&Math.hypot(player.x-180,player.y-195)<66)return'exit';if(room.kind==='outpost'&&Math.hypot(player.x-180,player.y-195)<72)return'outpost';return null}
function action(){if(!data.run||overlay)return;enforceArena();let r=data.run,room=r.rooms[r.current],act=interaction();if(act==='outpost'){activateOutpost();return}if(act==='chest'){if(isGuarded(r.current,r)&&room.enemies.length){msg('🔒 COFFRE PROTÉGÉ : élimine les gardiens avant ouverture.');return}room.chest='opened';let g=makeWeapon(r.current===6?3:r.current===7?2:r.current===5?1:0);if(isArena(r.current,r)){g.rar='Épique';g.dmg=Math.max(43,g.dmg+16)}if(isGuarded(r.current,r)&&g.rar==='Commun'){g.rar='Rare';g.dmg+=8};lootSpawn(room,'weapon',180,118,g);lootSpawn(room,'credits',177,122,null,pick(12,24));ground(room)[ground(room).length-1].source='chest';msg(`✨ Coffre ouvert : ${g.rar} ${g.name} au sol ! Approche-toi pour ramasser.`)}else if(act==='exit'){r.exitStarted=true;r.exitTime=12;r.exitWave=1;spawnReinforcement(room,2);msg('EXTRACTION : 12 s de contrôle ! Renforts annoncés, zone contestable.')}else msg('Approche-toi d’un coffre ou d’un terminal.');persist();render()}
function finish(won){let r=data.run;if(!r)return;let equipped=r.equipped,oldHome=null;let objects=[equipped,...r.bag].filter(Boolean);if(won){data.equipped=equipped;data.stash.push(...r.bag);data.credits+=r.earnedCredits+60;data.lastEconomy={...r.economy,total:r.earnedCredits+60,extraction:60,run:data.runs+1};data.research+=r.objectives.length+Math.floor(r.visited.length/3);data.stats.extractions++;msg(`EXTRACTION ! ${r.bag.length} objet(s) rapporté(s), +${r.earnedCredits+60} crédits · ${r.xpTotal||r.xp||0} XP récoltée.`)}else{let insured=objects.find(w=>w.id===r.insuredId);data.equipped=insured||starter();data.research+=Math.min(2,Math.floor(r.visited.length/3));data.stats.deaths++;msg(insured?'Mort : l’objet assuré a été récupéré.':'Mort : équipement perdu.')}data.runs++;data.insured=null;data.run=null;ensureMerchant();player=null;bullets=[];closeOverlay();persist();render()}
function uiSafe(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function uiWeaponCard(w,i,source,eq){let own=data.run?data.run.equipped:data.equipped;let delta=own&&w!==own?Number(w.dmg)-Number(own.dmg):0;let rate=own&&w!==own?(Number(w.rate)-Number(own.rate)):0;let insured=data.run?w.id===data.run.insuredId:w.id===data.insured;
return `<article class="ui-weapon" style="--item-rarity:${tint(w)}"><div class="ui-weapon-head"><span class="ui-weapon-icon">${weaponArt(w)}</span><div><b>${uiSafe(w.name)}</b><small>${uiSafe(w.rar)} ${insured?'· 🛡 Assurée':''}</small></div>${eq?'<span class="ui-tag">ÉQUIPÉE</span>':''}</div><div class="ui-weapon-stats"><span>⚔ ${Number(w.dmg)||0} dégâts</span><span>◉ ${Number(w.rate)||0} tirs/s</span><span>¤ ${source==='stash'?salvagePrice(w):value(w)} ${source==='stash'?'revente':'valeur'}</span></div>${!eq&&own?`<div class="ui-compare">Comparé à l'arme équipée : <strong class="${delta>=0?'ui-up':'ui-down'}">${delta>=0?'+':''}${delta} dégâts</strong> · <strong class="${rate>=0?'ui-up':'ui-down'}">${rate>=0?'+':''}${rate.toFixed(1)} tirs/s</strong></div>`:''}${!eq?`<div class="ui-weapon-actions"><button data-op="${source==='stash'?'equipHome':'equipBag'}" data-idx="${i}">ÉQUIPER</button><button class="ui-secondary" data-op="${source==='stash'?'sell':'drop'}" data-idx="${i}">${source==='stash'?'VENDRE':'ABANDONNER'}</button></div>`:''}</article>`;}
function uiMission(){let r=data.run;if(!r)return '';let z=r.rooms[r.current];if(isBoss(r.current,r))return '⚠ BOSS — Vaincre le Gardien K-17';if(isArena(r.current,r))return '⚔ ARÈNE — Terminer les vagues';if(isExit(r.current,r))return r.exitStarted?'⏳ Reste dans le cercle jusqu’à la fin':'↥ Reste dans le cercle 3 s pour lancer l’extraction';if(z.enemies&&z.enemies.length)return '⚔ Sécurise la salle pour ouvrir les nouvelles portes';if(z.kind==='outpost')return '📡 Approche du terminal pour activer l’avant-poste';return '✓ Salle sécurisée — Explore les sorties';}
function hudStatus(){let r=data.run;if(!r)return '';let room=r.rooms[r.current];if(!room)return '';if(r.exitStarted&&inExtractionCircle){let contested=room.enemies.some(e=>length(e,{x:180,y:195})<105);return `Extraction ${Math.max(0,Math.ceil(r.exitTime))} s${contested?' · contestée':''}`;}if(locked())return 'Portes verrouillées';if(isExit(r.current,r)&&!r.exitStarted)return `Cercle prêt · ${Math.round(Math.min(100,(r.exitCharge||0)/3*100))} %`;if(interaction()==='chest'&&!room.cleared)return 'Coffre protégé';if(isArena(r.current,r)&&room.enemies.length)return `Arène · vague ${room.arenaWave||1}/3`;if(room.cleared)return 'Portes ouvertes';return ''; }
function uiActionName(){if(!data.run)return 'ACTION';let act=interaction();return act==='chest'?'OUVRIR':act==='outpost'?'ACTIVER':act==='exit'?'EXTRAIRE':'ACTION';}
// Représentations SVG locales : aucun asset externe, aucune modification des sauvegardes.
function weaponArt(w){
 const n=String(w?.name||'').toLowerCase();
 const kind=/pistolet|secours/.test(n)?'pistol':/smg|vektor|mitrail/.test(n)?'smg':/nomade|précision|viseur/.test(n)?'marksman':/lanceur|impulsion|prototype|reliquat/.test(n)?'energy':/fusil|industriel/.test(n)?'rifle':'carbine';
 const rarity=String(w?.rar||'Commun');
 const accent=({'Commun':'#b4c3d1','Inhabituel':'#65d59a','Rare':'#60adff','Épique':'#ba83fb','Légendaire':'#f4bb64','Mythique':'#ff7b92'})[rarity]||'#b4c3d1';
 const paths={
 pistol:'<path d="M11 26h32v-8h11v12H38l-8 23H18l7-23H11z"/><path d="M15 22h26M26 35l-5 12" class="etch"/>',
 smg:'<path d="M6 23h15v-7h27v6h9v11H39l-5 20H21l5-20H6z"/><path d="M12 18h24M30 23v9M44 22v11" class="etch"/>',
 marksman:'<path d="M4 24h12v-5h36v9H39l-6 17H22l5-17H4z"/><path d="M20 14h21v5H20zM9 21v9M16 36h22M45 29h16" class="etch"/>',
 energy:'<path d="M6 22h13l7-8h25l9 12-9 13H26l-7-8H6z"/><path d="M27 20h18l7 6-7 6H27l-5-6z" class="core"/><path d="M29 39l-4 13h13l3-13"/>',
 rifle:'<path d="M4 25h13v-5h34v6h9v8H42l-6 18H25l6-18H4z"/><path d="M16 16h32v4H16zM19 34h9M49 34v7" class="etch"/>',
 carbine:'<path d="M5 25h16v-7h30v7h8v9H40l-6 17H23l6-17H5z"/><path d="M11 21h26M24 16h18M48 25v9" class="etch"/>'
 };
 return `<svg class="weapon-art weapon-${kind}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="--weapon-accent:${accent}"><path d="M5 53h54" fill="none" stroke="${accent}" opacity=".18" stroke-width="2"/><g fill="#455767" stroke="#a5b6bc" stroke-width="2" stroke-linejoin="round">${paths[kind]}</g><path d="M11 27h41" stroke="${accent}" stroke-width="3" opacity=".9"/><circle cx="48" cy="26" r="3" fill="${accent}"/><path d="M9 38h12" stroke="${accent}" stroke-width="2" opacity=".6"/></svg>`;
}
function itemRow(w,i,source){return uiWeaponCard(w,i,source,false)}
function uniqueCheck(){let seen=new Set(),items=[data.equipped,...data.stash];if(data.run)items=[data.run.equipped,...data.run.bag];for(let w of items){if(!w)continue;if(seen.has(w.id))return false;seen.add(w.id)}return true}
function equipHome(i){let w=data.stash[i];if(!w)return;let old=data.equipped;data.stash.splice(i,1);data.equipped=w;if(old)data.stash.push(old);data.insured=null;persist();render();msg(`${w.name} équipé. Assurance à renouveler.`)}
function equipBag(i){let r=data.run,w=r.bag[i];if(!w)return;let old=r.equipped;r.bag.splice(i,1);r.equipped=w;if(old){r.bag.push(old)}if(!uniqueCheck())msg('Erreur d’inventaire détectée.');else msg(`${w.name} équipé. Assurance non transférée.`);persist();render();openOverlay('bag')}
function drop(i){let r=data.run,w=r.bag[i];if(!w)return;if(w.id===r.insuredId&&!confirm('Abandonner cet objet annulera son assurance. Confirmer ?'))return;if(w.id===r.insuredId)r.insuredId=null;r.bag.splice(i,1);persist();render();openOverlay('bag');msg(`${w.name} abandonné.`)}
function sell(i){if(data.run)return;let w=data.stash[i];if(!w)return;if(w.id===data.insured){msg("Objet assuré : vente refusée.");return}let gain=salvagePrice(w);if(!confirm(`Vendre définitivement ${w.name} pour ${gain} crédits ?`))return;data.stash.splice(i,1);data.credits+=gain;persist();render();msg(`${w.name} vendu : +${gain} crédits.`)}
// Marchand évolutif — stock sauvegardé, jamais régénéré sur simple ouverture.
const MERCHANT_CATALOG=[
 {name:'Pistolet de secours',rar:'Commun',dmg:17,rate:2.1},
 {name:'Pistolet renforcé',rar:'Commun',dmg:21,rate:2},
 {name:'Fusil de récupération',rar:'Inhabituel',dmg:26,rate:1.5},
 {name:'Carabine K-17',rar:'Inhabituel',dmg:23,rate:2.2},
 {name:'Viseur de précision',rar:'Rare',dmg:35,rate:1.15},
 {name:'SMG de secteur',rar:'Rare',dmg:18,rate:3.8},
 {name:'Fusil industriel',rar:'Rare',dmg:32,rate:1.75},
 {name:'Lanceur à impulsion',rar:'Épique',dmg:44,rate:1.3},
 {name:'Prototype balistique',rar:'Épique',dmg:29,rate:2.8},
 {name:'Reliquat de citadelle',rar:'Légendaire',dmg:48,rate:2.2}
];
const MERCHANT_RANK={Commun:0,Inhabituel:1,Rare:2,'Épique':3,'Légendaire':4,Mythique:5};
function merchantTier(){let reg=region();return Math.min(4,Math.max(0,Number(reg.maxSector)||0)+(reg.bossDefeated?1:0))}
function merchantPrice(w){let rk=MERCHANT_RANK[w.rar]||0;return Math.max(100,Math.round((Number(w.dmg)*10+Number(w.rate)*60)*(1+rk*.58)/10)*10)}
function ensureMerchant(){
 if(!data.merchant||!Array.isArray(data.merchant.stock))data.merchant={stock:[],cycle:0,lastRefreshRun:data.runs,highestTier:merchantTier()};
 const m=data.merchant, tier=merchantTier();
 if(!m.stock.length||data.runs-m.lastRefreshRun>=2||tier>m.highestTier){
  const pool=MERCHANT_CATALOG.filter(w=>(MERCHANT_RANK[w.rar]||0)<=Math.min(4,1+tier));
  // Deterministic rotation by cycle avoids rerolling offers by closing the menu.
  const selected=[];
  for(let i=0;i<7;i++){
    const entry=pool[(i*3+m.cycle*2+Math.floor(i/3))%pool.length];
    selected.push({...entry,offerId:'offer-'+m.cycle+'-'+i,price:merchantPrice(entry),sold:false});
  }
  m.stock=selected;m.lastRefreshRun=data.runs;m.highestTier=tier;m.cycle++;
 }
 return m;
}
let merchantTab='buy';
function merchantOpen(tab='buy'){
 if(data.run){msg('Retourne au refuge pour commercer.');return}
 merchantTab=tab;ensureMerchant();merchantRender();
}
function merchantRender(){
 const m=ensureMerchant(), tabs=['buy','sell','info'];
 let html=`<div class="merchant-shop"><div class="merchant-callout"><p class="ui-help">¤ ${data.credits} crédits · stock renouvelé après 2 expéditions ou un nouveau secteur débloqué. Les achats vont dans la réserve.</p><div class="merchant-meta-row"><span>Arrivage ${m.cycle}</span><span>${m.stock.filter(x=>!x.sold).length}/7 offres restantes</span></div></div><div class="merchant-tabs">${tabs.map((t,i)=>`<button data-merchant-tab="${t}" class="${merchantTab===t?'active':''}">${['Acheter','Vendre','Arrivages'][i]}</button>`).join('')}</div>`;
 if(merchantTab==='buy'){
  html+=m.stock.map((w,i)=>{
   const delta=w.dmg-(data.equipped?.dmg||0),speed=w.rate-(data.equipped?.rate||0);
   return `<article class="ui-weapon merchant-offer" style="--item-rarity:${tint(w)}"><div class="ui-weapon-head"><span class="ui-weapon-icon">${weaponArt(w)}</span><div><small class="rarity">${uiSafe(w.rar)}</small><b>${uiSafe(w.name)}</b></div></div><div class="ui-weapon-stats"><span>⚔ ${w.dmg} dégâts</span><span>◉ ${w.rate} tirs/s</span></div><div class="ui-compare">Face à l'arme équipée : <strong class="${delta>=0?'ui-up':'ui-down'}">${delta>=0?'+':''}${delta} dégâts</strong> · <strong class="${speed>=0?'ui-up':'ui-down'}">${speed>=0?'+':''}${speed.toFixed(1)} tirs/s</strong></div><button data-merchant-buy="${i}" ${w.sold||data.credits<w.price?'disabled':''}>${w.sold?'VENDU':data.credits<w.price?'CRÉDITS INSUFFISANTS · ':'ACHETER · '}${w.sold?'':w.price+' ¤'}</button></article>`;
  }).join('');
 }else if(merchantTab==='sell'){
  html+='<p class="ui-help">Valeur de récupération réduite selon la rareté. Les objets achetés sont repris au maximum à 25 % de leur prix. Vente définitive avec confirmation ; équipement assuré protégé.</p>';
  html+=data.stash.length?data.stash.map((w,i)=>`<article class="ui-weapon merchant-offer" style="--item-rarity:${tint(w)}"><div class="ui-weapon-head"><span class="ui-weapon-icon">${weaponArt(w)}</span><div><small class="rarity">${uiSafe(w.rar)}</small><b>${uiSafe(w.name)}</b></div></div><div class="ui-weapon-stats"><span>⚔ ${Number(w.dmg)||0} dégâts</span><span>◉ ${Number(w.rate)||0} tirs/s</span></div><button data-merchant-sell="${i}" ${w.id===data.insured?'disabled':''}>${w.id===data.insured?'🛡 ASSURÉE':'VENDRE · '+salvagePrice(w)+' ¤'}</button></article>`).join(''):'<p class="ui-empty">Réserve vide : rapporte des équipements en t’extrayant.</p>';
 }else{
  html+=`<div class="merchant-info-card ui-empty"><b>Arrivage ${m.cycle}</b><p>Offres restantes : ${m.stock.filter(x=>!x.sold).length}/7</p><p>Prochain renouvellement après ${Math.max(0,2-(data.runs-m.lastRefreshRun))} expédition(s) terminée(s), ou au déblocage d'un secteur.</p><p>Plus tu explores K-17, plus les équipements rares deviennent accessibles. Les objets légendaires restent exceptionnellement coûteux.</p></div>`;
 }
 html+='</div>';
 const host=$('merchantPageContent');
 if(host){host.innerHTML=html; if($('merchantCreditsMirror'))$('merchantCreditsMirror').textContent=data.credits; if($('merchantReserveCount'))$('merchantReserveCount').textContent=data.stash.length; if($('merchantOffersCount'))$('merchantOffersCount').textContent=m.stock.filter(x=>!x.sold).length; if($('merchantRefreshHint'))$('merchantRefreshHint').textContent=`Arrivage ${m.cycle} · prochain renouvellement dans ${Math.max(0,2-(data.runs-m.lastRefreshRun))} expédition(s), ou au déblocage d’un nouveau secteur.`; }
 else tool('¤ LE COMPTOIR — MARCHAND',html);
}
let selectedInventoryId=null;
let inventoryPage=0;
let inventorySortMode="default";
const INVENTORY_PAGE_SIZE=20;
function renderInventorySelection(){
 const host=$('inventorySelection');if(!host)return;
 const i=data.stash.findIndex(w=>w.id===selectedInventoryId);
 if(i<0){host.hidden=true;host.innerHTML='';return}
 const w=data.stash[i], delta=w.dmg-(data.equipped?.dmg||0), rate=w.rate-(data.equipped?.rate||0);
 host.hidden=false;
 host.innerHTML=`<span class="inventory-detail-label">ARME SÉLECTIONNÉE</span><div class="inventory-selected-head"><span class="inventory-selected-art">${weaponArt(w)}</span><div><b>${uiSafe(w.name)}</b><span style="color:${tint(w)}">${uiSafe(w.rar)}</span></div></div><p>${Number(w.dmg)||0} dégâts · ${Number(w.rate)||0} tirs/s · ${salvagePrice(w)} ¤ revente</p><p>Face à l’arme active : <strong class="${delta>=0?'ui-up':'ui-down'}">${delta>=0?'+':''}${delta} dégâts</strong> · <strong class="${rate>=0?'ui-up':'ui-down'}">${rate>=0?'+':''}${rate.toFixed(1)} tirs/s</strong></p><div class="inventory-selected-actions"><button type="button" data-grid-equip="${i}">ÉQUIPER</button><button type="button" data-grid-sell="${i}" class="ui-secondary">VENDRE · ${salvagePrice(w)} ¤</button></div>`;
}
function renderRefugeCharacter(){
 const stats=data.stats||{};
 if($('activeWeaponArt'))$('activeWeaponArt').innerHTML=weaponArt(data.equipped);
 if($('characterEquippedSlotArt'))$('characterEquippedSlotArt').innerHTML=weaponArt(data.equipped);
 if($('characterHeldWeaponArt'))$('characterHeldWeaponArt').innerHTML=weaponArt(data.equipped);
 if($('characterWeaponBadge'))$('characterWeaponBadge').textContent=data.equipped?`${data.equipped.rar} · ${data.equipped.name}`:'Aucune arme';
 if($('characterPowerBadge'))$('characterPowerBadge').textContent=data.equipped?`${data.equipped.dmg+data.dmgLv*3} DGT · ${data.equipped.rate} tirs/s`:'Puissance nulle';
 if($('characterInsuranceBadge'))$('characterInsuranceBadge').textContent=data.insured===data.equipped?.id?'🛡 Objet assuré':'⚠ Sans assurance';
 if($('charExtractions'))$('charExtractions').textContent=stats.extractions||0;
 if($('charDeaths'))$('charDeaths').textContent=stats.deaths||0;
 if($('charStashCount'))$('charStashCount').textContent=data.stash.length;
 if($('charRunCount'))$('charRunCount').textContent=data.runs;
 if($('loadoutWeaponName'))$('loadoutWeaponName').textContent=data.equipped?data.equipped.name:'Aucune';
 if($('loadoutWeaponStats'))$('loadoutWeaponStats').textContent=data.equipped?`${data.equipped.rar} · ${data.equipped.dmg} dégâts · ${data.equipped.rate} tirs/s`:'Pas d’arme équipée';
 if($('loadoutInsuranceState'))$('loadoutInsuranceState').textContent=data.insured===data.equipped?.id?'Active':'Inactive';
 if($('loadoutInsuranceHint'))$('loadoutInsuranceHint').textContent=data.insured===data.equipped?.id?'Objet protégé pour la prochaine sortie':`Prime : ${premium()} ¤`;
 if($('loadoutHpLevel'))$('loadoutHpLevel').textContent=`Niveau ${data.hpLv}`;
 if($('loadoutHpBonus'))$('loadoutHpBonus').textContent=`+${data.hpLv*15} PV permanents`;
 if($('loadoutDmgLevel'))$('loadoutDmgLevel').textContent=`Niveau ${data.dmgLv}`;
 if($('loadoutDmgBonus'))$('loadoutDmgBonus').textContent=`+${data.dmgLv*3} dégâts permanents`;
 if($('inventoryEquippedLabel'))$('inventoryEquippedLabel').textContent=data.equipped?`${data.equipped.name} · ${data.equipped.rar}`:'Aucune arme';
 const preview=$('characterReservePreview');
 if(preview){
  if(data.stash.length && !data.stash.some(w=>w.id===selectedInventoryId)) selectedInventoryId=data.stash[0].id;
  const pages=Math.max(1,Math.ceil(data.stash.length/INVENTORY_PAGE_SIZE));
  inventoryPage=Math.max(0,Math.min(inventoryPage,pages-1));
  const rarityOrder={Commun:0,Inhabituel:1,Rare:2,'Épique':3,'Légendaire':4,Mythique:5};
  const ranked=data.stash.map((w,i)=>({w,i}));
  const sortable={rarity:w=>rarityOrder[w.rar]||0,damage:w=>Number(w.dmg)||0,rate:w=>Number(w.rate)||0,value:w=>salvagePrice(w)};
  if(sortable[inventorySortMode])ranked.sort((a,b)=>sortable[inventorySortMode](b.w)-sortable[inventorySortMode](a.w)||a.i-b.i);
  const offset=inventoryPage*INVENTORY_PAGE_SIZE,items=ranked.slice(offset,offset+INVENTORY_PAGE_SIZE);
  const cards=items.map(({w,i})=>`<button type="button" class="inventory-cell ${w.id===selectedInventoryId?'inventory-active':''}" data-inventory-index="${i}" aria-pressed="${w.id===selectedInventoryId}" aria-label="Voir ${uiSafe(w.name)}" style="--item-rarity:${tint(w)}"><span class="inventory-symbol">${weaponArt(w)}</span><span class="inventory-name">${uiSafe(w.name)}</span><span class="inventory-rarity">${uiSafe(w.rar)}</span></button>`).join('');
  preview.innerHTML=cards+Array.from({length:Math.max(0,8-items.length)},()=>'<span class="inventory-cell inventory-empty" aria-hidden="true"></span>').join('');
  const controls=$('inventoryPages');if(controls){controls.hidden=pages<=1;controls.innerHTML=pages>1?`<button type="button" data-inventory-page="prev" ${inventoryPage===0?'disabled':''}>← Précédent</button><span>${inventoryPage+1} / ${pages} · ${data.stash.length} armes</span><button type="button" data-inventory-page="next" ${inventoryPage===pages-1?'disabled':''}>Suivant →</button>`:'';}
  renderInventorySelection();
 }

}
function renderRefugeProgress(){
 const reg=region();
 if($('progressSectorCount'))$('progressSectorCount').textContent=`${reg.maxSector+1}/4`;
 if($('progressOutpostCount'))$('progressOutpostCount').textContent=`${reg.outposts.length}/3`;
 if($('progressBossState'))$('progressBossState').textContent=reg.bossDefeated?'Vaincu':'À découvrir';
 if($('progressObjectiveHint'))$('progressObjectiveHint').textContent=reg.bossDefeated?'Le Gardien est vaincu. Continue à améliorer ton refuge et ton équipement.':(reg.outposts.length<3?'Active de nouveaux avant-postes pour sécuriser tes points d’insertion.':'Explore plus profondément pour atteindre le Gardien.');
 const names=['PÉRIPHÉRIE','LABORATOIRES','FONDERIE','CITADELLE'];
 document.querySelectorAll('[data-sector-card]').forEach(card=>{
   const i=Number(card.dataset.sectorCard);
   const unlocked=i<=reg.maxSector;
   const outpost=reg.outposts.includes(i);
   card.classList.toggle('unlocked',unlocked);
   card.classList.toggle('locked',!unlocked);
   card.classList.toggle('outpost',outpost);
   card.classList.toggle('current',i===reg.maxSector);
   const state=card.querySelector('[data-sector-state]');
   if(state)state.textContent=!unlocked?'Zone verrouillée':outpost?`Avant-poste actif · ${names[i]}`:(i===reg.maxSector?(reg.bossDefeated&&i===3?'Secteur nettoyé':'Secteur accessible'):'Secteur sécurisé');
 });
}
function merchantBuy(i){
 if(data.run)return;const w=ensureMerchant().stock[i];
 if(!w||w.sold||!Number.isFinite(w.price)||data.credits<w.price)return;
 if(!confirm(`Acheter ${w.name} (${w.rar}) pour ${w.price} crédits ?`))return;
 // Atomic state transition, persisted together: money, stock, item ownership.
 const item={id:uid(),name:w.name,rar:w.rar,dmg:w.dmg,rate:w.rate,purchasePrice:w.price,origin:"merchant"};
 data.credits-=w.price;data.stash.push(item);w.sold=true;
 persist();render();merchantRender();msg(`${item.name} acheté et placé dans la réserve.`);
}
function merchantSell(i){
 if(data.run)return;const w=data.stash[i];if(!w)return;
 if(w.id===data.insured){msg('Cet objet est assuré. Annule d’abord son assurance.');return}
 const price=salvagePrice(w);
 if(!confirm(`Vendre définitivement ${w.name} pour ${price} crédits ?`))return;
 data.stash.splice(i,1);data.credits+=price;persist();render();merchantRender();msg(`${w.name} vendu · +${price} crédits.`);
}

function upgrade(t){let lv=t==='hp'?data.hpLv:data.dmgLv,cost=4+lv*4;if(lv>=8||data.research<cost)return;data.research-=cost;if(t==='hp')data.hpLv++;else data.dmgLv++;persist();render()}
function insure(){if(!data.equipped||data.insured===data.equipped.id||data.credits<premium())return;data.credits-=premium();data.insured=data.equipped.id;persist();render();msg('Objet assuré pour la prochaine expédition.')}
function render(){let r=data.run;document.body.classList.toggle('ashfall-expedition',!!r);$('home').hidden=!!r;$('game').hidden=!r;$('phase').textContent=r?'EXPÉDITION':'REFUGE';$('credits').textContent=data.credits;$('research').textContent=data.research;$('runs').textContent=data.runs;if(!r){if($('xpDisplay'))$('xpDisplay').style.display='none';$('hpLevel').textContent='Nv. '+data.hpLv;$('dmgLevel').textContent='Nv. '+data.dmgLv;$('upHp').textContent=`+15 PV · ${4+data.hpLv*4} ✦`;$('upDmg').textContent=`+3 DGT · ${4+data.dmgLv*4} ✦`;$('upHp').disabled=data.hpLv>=8||data.research<4+data.hpLv*4;$('upDmg').disabled=data.dmgLv>=8||data.research<4+data.dmgLv*4;$('equipped').textContent=data.equipped?`${data.equipped.name} · ${data.equipped.rar} · ${data.equipped.dmg} dégâts · ${data.equipped.rate} tirs/s`:'Aucune';$('insurance').textContent=data.insured===data.equipped?.id?'🛡 ASSURÉE':'⚠ Non assurée';$('insure').textContent=`Assurer · ${premium()} ¤`;$('insure').disabled=data.insured===data.equipped.id||data.credits<premium();$('stash').innerHTML='<p class="ui-help">Armes stockées au refuge · appuie sur ÉQUIPER pour changer d’arme.</p>'+(data.stash.length?data.stash.map((g,i)=>itemRow(g,i,'stash')).join(''):'<p class="ui-empty">Réserve vide : extrais des armes pour remplir ton stock.</p>');if($('merchantLaunch'))$('merchantLaunch').textContent='¤ OUVRIR LE COMPTOIR · '+data.credits+' crédits';$('log').dataset.region=region().maxSector;
 const sel=$('startSector');if(sel){let enabled=[0,...region().outposts];sel.innerHTML=enabled.map(i=>`<option value="${i}">${i===0?'Entrée de K-17':'Avant-poste du secteur '+(i+1)}</option>`).join('');if(enabled.includes(Number(data.chosenSector)))sel.value=String(data.chosenSector);else sel.value='0'}
 const status=$('regionStatus');if(status)status.textContent='K-17 · secteurs '+(region().maxSector+1)+'/4 · avant-postes '+region().outposts.length+'/3 · Gardien '+(region().bossDefeated?'vaincu':'à découvrir')+' · Helix '+(data.unlockHelix?'débloquée (non jouable)':'verrouillée');if($('statusChipSector'))$('statusChipSector').textContent='Secteurs '+(region().maxSector+1)+'/4';if($('statusChipOutpost'))$('statusChipOutpost').textContent='Avant-postes '+region().outposts.length+'/3';if($('statusChipBoss'))$('statusChipBoss').textContent='Gardien '+(region().bossDefeated?'vaincu':'à découvrir');renderRefugeCharacter();renderRefugeProgress();if(refugeActivePage==='merchant')merchantRender();return}let room=r.rooms[r.current];if($('uiMission'))$('uiMission').textContent=uiMission();$('roomTitle').textContent=isBoss(r.current,r)?'⚠ BOSS K-17':isArena(r.current,r)?'ARÈNE':isExit(r.current,r)?'EXTRACTION':room.kind==='secret'?'SALLE SECRÈTE':room.kind==='outpost'?'📡 AVANT-POSTE':`K-17 · ${r.current+1}/50 · ${SECTORS[sectorOf(room)].name}`;$('hpText').textContent=`${Math.ceil(player.hp)}/${player.max}`;$('hpFill').style.width=`${clamp(player.hp/player.max*100,0,100)}%`;runProgress();$('bagCount').textContent=`Sac ${r.bag.length}/6 · Nv.${r.runLevel}`;const xp=$('xpDisplay');if(xp){xp.textContent=`✦ Nv.${r.runLevel} · ${Math.floor(r.xp)}/${xpThreshold(r.runLevel)} XP`;xp.style.display='block';$('xpFill').style.width=(100*clamp(r.xp/xpThreshold(r.runLevel),0,1))+'%'}const statusHint=hudStatus();$('hint').textContent=statusHint;$('hint').hidden=!statusHint}
function closeOverlay(){if(overlay==='level'&&data.run?.pendingLevels>0)return;overlay='';$('overlay').hidden=true;$('overlay').innerHTML=''}
function openOverlay(mode){if(!data.run)return;overlay=mode;let r=data.run,html='<button class="close" data-op="close">✕ Fermer</button>';if(mode==='bag'){html+=`<h3>🎒 SAC D’EXPÉDITION <span class="ui-tag">${r.bag.length}/6 places</span></h3><p class="muted">Arme équipée et objets transportés. La rareté est indiquée par une couleur.</p><div class="ui-group-label">ARME ÉQUIPÉE</div>${uiWeaponCard(r.equipped,-1,'bag',true)}<div class="ui-group-label">OBJETS TRANSPORTÉS</div>${r.bag.length?r.bag.map((w,i)=>uiWeaponCard(w,i,'bag',false)).join(''):'<p class="ui-empty">Ton sac est vide. Ramasse les armes au sol pour les ajouter ici.</p>'}<p class="ui-help">💡 Équiper une autre arme replace l’ancienne dans le sac. L’assurance reste attachée à son objet d’origine.</p>`;
}else if(mode==='map'){let coords=r.rooms.filter(z=>Number.isFinite(z.gx));if(coords.length){let minx=Math.min(...coords.map(z=>z.gx)),miny=Math.min(...coords.map(z=>z.gy)),maxx=Math.max(...coords.map(z=>z.gx)),maxy=Math.max(...coords.map(z=>z.gy));let width=maxx-minx+1,height=maxy-miny+1,cell=Math.max(12,Math.min(26,Math.floor(310/Math.max(width,height))));let tiles=r.rooms.filter(z=>z.seen).map(z=>`<div style="position:absolute;left:${(z.gx-minx)*cell}px;top:${(z.gy-miny)*cell}px;width:${cell-2}px;height:${cell-2}px;background:${z.id===r.current?'#dfac58':isBoss(z.id,r)?'#a45770':isArena(z.id,r)?'#945d36':isExit(z.id,r)?'#3d9b8b':z.kind==='outpost'?'#5092c4':'#35576b'};border:1px solid #97a4b6;border-radius:3px;color:white;font-size:9px;text-align:center;line-height:${cell-3}px">${z.id===r.current?'●':isBoss(z.id,r)?'B':isArena(z.id,r)?'A':isExit(z.id,r)?'E':z.kind==='outpost'?'P':''}</div>`).join('');html+='<h3>🗺 CARTE TACTIQUE — K-17</h3><p class="muted">🟡 Position actuelle · seuls les lieux explorés sont affichés.</p><div style="overflow:auto;max-width:100%"><div style="position:relative;width:'+(width*cell)+'px;height:'+(height*cell)+'px;min-height:150px;background:#101a26">'+tiles+'</div></div><p class="muted">'+r.visited.length+'/50 découvertes · secteurs débloqués : '+(region().maxSector+1)+'/4 · B boss · A arène · E extraction · P avant-poste. Les salles se régénèrent à chaque nouvelle expédition.</p>';}else html+='<h3>ANCIENNE EXPÉDITION</h3><div class="cellmap">'+r.rooms.map((z,i)=>`<div class="${i===r.current?'here':z.seen?'known':''}">${z.seen?i+1:'?'}</div>`).join('')+'</div>';}else html+='<h3>PAUSE</h3><p>La partie est suspendue. La sauvegarde inclut l’expédition.</p><button data-op="resume">Reprendre</button><button data-op="retreat">Abandonner l’expédition (mort)</button>';$('overlay').innerHTML=html;$('overlay').hidden=false;persist()}
function tool(title,html){$('toolsTitle').textContent=title;$('toolsBody').innerHTML=html;$('tools').hidden=false}
function backup(){persist();const code=btoa(unescape(encodeURIComponent(JSON.stringify(data))));tool('EXPORT / IMPORT',`<p>Le code inclut le refuge et l’expédition en cours. Conserve-le dans Notes ou Fichiers.</p><textarea id="exportCode" readonly></textarea><button id="copyCode">Copier le code</button><p>Restaurer une sauvegarde :</p><textarea id="importCode" placeholder="Colle ici une sauvegarde..."></textarea><button id="restoreCode">Restaurer</button>`);$('exportCode').value=code;$('copyCode').onclick=async()=>{try{await navigator.clipboard.writeText($('exportCode').value);msg('Code copié.')}catch(e){$('exportCode').select();msg('Sélectionne le texte pour le copier.')}};$('restoreCode').onclick=()=>{try{const decoded=JSON.parse(decodeURIComponent(escape(atob($('importCode').value.trim()))));if(!valid(decoded))throw Error('format');if(!confirm('Remplacer toute la progression actuelle ?'))return;data=decoded;setPlayer();if(data.run&&isArena(data.run.current,data.run))enforceArena();bullets=[];closeOverlay();runProgress();persist();render();if(data.run?.pendingLevels>0)openLevelChoice();$('tools').hidden=true;msg('Sauvegarde restaurée.')}catch(e){msg('Code invalide ou incompatible.')}}}
$('startSector').addEventListener('change',e=>{data.chosenSector=Number(e.target.value);persist()});$('upHp').onclick=()=>upgrade('hp');$('upDmg').onclick=()=>upgrade('dmg');$('insure').onclick=insure;$('merchantLaunch').onclick=()=>merchantOpen();$('start').onclick=start;
$('bagBtn').onclick=()=>openOverlay('bag');$('mapBtn').onclick=()=>openOverlay('map');$('pauseBtn').onclick=()=>openOverlay('pause');
// Le clic synthetique iOS peut etre annule quand un autre doigt tient le joystick.
$('overlay').addEventListener('click',e=>{let b=e.target.closest('[data-op]');if(!b)return;let op=b.dataset.op,idx=Number(b.dataset.idx);if(op==='choosePerk')choosePerk(b.dataset.perk);else if(op==='close'||op==='resume')closeOverlay();else if(op==='equipBag')equipBag(idx);else if(op==='drop')drop(idx);else if(op==='retreat'){if(confirm('Abandonner ? Tout le matériel non assuré sera perdu.'))finish(false)}});
function merchantClickHandler(e){let b=e.target.closest('[data-merchant-tab],[data-merchant-buy],[data-merchant-sell]');if(!b)return;if(b.hasAttribute('data-merchant-tab')){merchantTab=b.dataset.merchantTab;merchantRender()}else if(b.hasAttribute('data-merchant-buy'))merchantBuy(Number(b.dataset.merchantBuy));else if(b.hasAttribute('data-merchant-sell'))merchantSell(Number(b.dataset.merchantSell));}
$('toolsBody').addEventListener('click',merchantClickHandler);if($('merchantPageContent'))$('merchantPageContent').addEventListener('click',merchantClickHandler);
$('characterReservePreview').addEventListener('click',e=>{
 const cell=e.target.closest('[data-inventory-index]');if(!cell)return;
 const i=Number(cell.dataset.inventoryIndex),w=data.stash[i],host=$('inventorySelection');if(!w||!host)return;
 selectedInventoryId=w.id;renderRefugeCharacter();
});
$('inventorySort').addEventListener('change',e=>{inventorySortMode=e.target.value;inventoryPage=0;renderRefugeCharacter();});
$('inventoryPages').addEventListener('click',e=>{const b=e.target.closest('[data-inventory-page]');if(!b)return;inventoryPage+=b.dataset.inventoryPage==='next'?1:-1;renderRefugeCharacter();});
$('inventorySelection').addEventListener('click',e=>{
 const b=e.target.closest('[data-grid-equip],[data-grid-sell]');if(!b)return;
 if(b.hasAttribute('data-grid-equip'))equipHome(Number(b.dataset.gridEquip));
 else sell(Number(b.dataset.gridSell));
});
$('stash').addEventListener('click',e=>{let b=e.target.closest('[data-op]');if(!b)return;let i=Number(b.dataset.idx);if(b.dataset.op==='equipHome')equipHome(i);else if(b.dataset.op==='sell')sell(i)});
$('saveBtn').onclick=()=>persist(false);$('backupBtn').onclick=backup;$('toolsClose').onclick=()=>$('tools').hidden=true;$('rulesBtn').onclick=()=>tool('RÈGLES',`<p>Utilise le joystick semi-mobile en bas au centre pour te déplacer. Les tirs sont automatiques ; ta précision diminue lorsque tu bouges.</p><p>Traverse librement les portes vertes. Une porte orange ⚠ ARÈNE annonce un combat obligatoire dès l’entrée ; trois vagues, coffre épique garanti en cas de victoire.</p><p>Les coffres s’ouvrent automatiquement après avoir sécurisé la salle. Les avant-postes s’activent par proximité. SAC et CARTE mettent le combat en pause.</p><p>Reste 3 secondes dans le cercle lumineux pour lancer une extraction. Une fois activée, reste dans le cercle pendant tout le compte à rebours : en sortir annule l’extraction. Les blocs solides arrêtent le joueur, les ennemis et les tirs (y compris pendant le dash). Les quatre secteurs possèdent désormais des ennemis, décors et dangers différents (laser et chaleur télégraphiés). K-17 comporte 50 salles irrégulières, trois sorties, trois avant-postes activables et quatre arènes. Les secteurs découverts restent débloqués mais la carte se régénère à chaque nouvelle expédition. Le boss principal débloque Helix pour une version future.</p><p>Extrais-toi depuis une salle d’extraction. À la mort, un seul objet assuré avant le départ peut être conservé. Les objets trouvés ne sont jamais assurés.</p><p>Les sauvegardes locales peuvent être effacées par iOS : exporte régulièrement une copie.</p>`);
// DASH : impulsion immédiate et indépendante du tick d'animation.
// Conserve la direction du joystick au moment du clic et une direction de secours.
function performDash(){
 if(!data.run||overlay||!player)return;
 if((player.dashCooldown||0)>0){msg('DASH en recharge · '+(player.dashCooldown).toFixed(1)+' s');return}
 let vx=joy.x+(keyState.ArrowRight||keyState.d?1:0)-(keyState.ArrowLeft||keyState.a?1:0);
 let vy=joy.y+(keyState.ArrowDown||keyState.s?1:0)-(keyState.ArrowUp||keyState.w?1:0);
 let mag=Math.hypot(vx,vy);
 if(mag<.15){vx=player.dx||player.facingX||0;vy=player.dy||player.facingY||-1;mag=Math.hypot(vx,vy)}
 if(mag<.01){vx=0;vy=-1;mag=1}
 vx/=mag;vy/=mag;
 player.facingX=vx;player.facingY=vy;
 let room=data.run.rooms[data.run.current];
 let ox=player.x,oy=player.y;
 advanceSolid(player,vx*95,vy*95,12,room);
 let distance=Math.hypot(player.x-ox,player.y-oy);
 player.dashCooldown=Math.max(1.05,2.2*Math.max(.76,1-perkBonus('cool')));
 player.dashFlash=.22;
 player.inv=Math.max(player.inv,.35);
 msg(distance<8?'DASH bloqué par un obstacle !':'DASH · '+Math.round(distance)+' px · recharge 2,2 s');
 render();persist();
}
function doorRect(side){return side==='top'?[145,0,70,20]:side==='bottom'?[145,380,70,20]:side==='left'?[0,165,20,75]:[340,165,20,75]}
// Obstacles solides : géométrie partagée entre rendu, joueur, ennemis et projectiles.
// Coordonnées en pixels dans le canvas logique 360 x 400.
function roomObstacles(room){
 const sec=sectorOf(room);
 if(sec===0)return [[42,54,36,17],[268,290,37,25],[62,268,20,30]];
 if(sec===1)return [[55,44,16,43],[55,275,16,54],[290,44,16,43],[290,275,16,54]];
 if(sec===2)return [[45,62,35,37],[45,276,35,37],[270,62,35,37],[270,276,35,37]];
 return [[36,72,22,35],[36,273,22,35],[302,72,22,35],[302,273,22,35]];
}
function collidesSolid(x,y,radius,room){
 return roomObstacles(room).some(([rx,ry,w,h])=>{
  let nx=Math.max(rx,Math.min(x,rx+w)),ny=Math.max(ry,Math.min(y,ry+h));
  return (x-nx)**2+(y-ny)**2<radius**2;
 });
}
function advanceSolid(entity,dx,dy,radius,room){
 // Pas de déplacement par axe : collision fiable y compris pendant le DASH.
 let steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/5));
 for(let i=0;i<steps;i++){
  let nx=clamp(entity.x+dx/steps,radius,360-radius);
  if(!collidesSolid(nx,entity.y,radius,room))entity.x=nx;
  let ny=clamp(entity.y+dy/steps,radius,400-radius);
  if(!collidesSolid(entity.x,ny,radius,room))entity.y=ny;
 }
}

// 0.8.7: sprites pixel-art proceduraux, sans assets externes ni changement des hitbox.
function px(x,y,w,h,color){cx.fillStyle=color;cx.fillRect(Math.round(x),Math.round(y),w,h)}
function pixelActor(x,y,kind,phase=0,facingX=1,facingY=0){
 const t=Math.sin(phase*10),step=t>0?2:-2;
 cx.save();cx.translate(Math.round(x),Math.round(y));cx.imageSmoothingEnabled=false;
 if(kind==='player'){
  // Ombre, jambes articulées, sac et casque avec visière orientée vers la cible.
  px(-10,12,20,4,'#081c24');px(-7,7,5,7+step,'#34535f');px(2,7,5,7-step,'#34535f');
  px(-11,-7,22,16,'#183b47');px(-7,-9,14,17,'#79c9ae');px(-5,-12,10,5,'#c4e9d5');
  px(-7,-13,14,3,'#284f5b');px(-5,-8,10,5,'#243b54');px(-10,-5,4,10,'#aacbb8');px(7,-5,4,10,'#aacbb8');
  px(-9,0,3,8,'#596c49');px(8,0,3,8,'#596c49');
  let ax=Math.abs(facingX)>Math.abs(facingY)?(facingX>=0?10:-20):0,ay=Math.abs(facingY)>=Math.abs(facingX)?(facingY>=0?9:-17):-2;
  px(ax,ay,13,5,'#152734');px(ax+2,ay+1,10,2,'#bed4db');
 }else if(kind==='drone'){
  px(-15,-2,30,5,'#305b7a');px(-15,-6,5,13,'#83c7ee');px(10,-6,5,13,'#83c7ee');
  px(-10,-9,20,18,'#2e6484');px(-7,-6,14,11,'#79c6ec');px(-4,-4,8,5,'#0b263d');px(-2,-4,4,3,'#ecf6ff');
  px(-13,9+step,5,3,'#6ba2cc');px(8,9-step,5,3,'#6ba2cc');
 }else if(kind==='brute'||kind==='sentinel'||kind==='boss'){
  let armor=kind==='sentinel'?'#8d71c4':kind==='boss'?'#ba577a':'#a5714b';
  px(-14,10,11,6+step,'#403a48');px(3,10,11,6-step,'#403a48');
  px(-18,-8,36,21,'#252e3b');px(-14,-10,28,22,armor);px(-10,-13,20,9,'#3f4456');
  px(-8,-8,16,7,'#161a30');px(-6,-6,5,3,'#ffddaa');px(2,-6,5,3,'#ffddaa');
  px(-17,0,7,12,'#42435c');px(10,0,7,12,'#42435c');px(-4,3,8,4,'#f3b08c');
 }else if(kind==='ranged'){
  px(-8,9,5,6+step,'#514840');px(3,9,5,6-step,'#514840');
  px(-10,-6,20,19,'#8b724b');px(-9,-11,18,9,'#d7ad66');px(-6,-6,12,7,'#202b35');
  px(-4,-4,3,3,'#ffe4a4');px(2,-4,3,3,'#ffe4a4');px(9,-1,11,4,'#45484d');
 }else{
  px(-7,9,5,6+step,'#60494c');px(2,9,5,6-step,'#60494c');
  px(-10,-5,20,17,'#784b54');px(-7,-10,14,12,'#ae7781');
  px(-5,-5,4,3,'#f8b9a6');px(2,-5,4,3,'#f8b9a6');px(-12,-1,4,9,'#91636b');px(8,-1,4,9,'#91636b');
 }
 cx.restore();
}
function drawPixelFloor(room,sec,theme){
 // Dalles, coutures, usure et lumières fixes; pas de nouvel obstacle invisible.
 cx.save();cx.globalAlpha=.45;
 for(let yy=20;yy<380;yy+=40)for(let xx=20;xx<340;xx+=40){
  let hash=((xx*17+yy*31+room.id*97)>>>0)%11;
  if(hash<4){px(xx+5,yy+5,25,2,theme.grid);px(xx+5,yy+5,2,12,theme.grid)}
  if(hash===7){px(xx+23,yy+28,8,2,theme.accent);px(xx+27,yy+25,2,6,theme.accent)}
  if(hash===9){px(xx+7,yy+24,3,3,'#71828b');px(xx+15,yy+29,4,2,'#71828b')}
 }
 cx.restore();
 if(sec===0){for(let i=0;i<5;i++){let x=40+(i*59+room.id*11)%255,y=55+(i*71+room.id*13)%260;px(x,y,15,3,'#445b4e');px(x+3,y+3,3,7,'#516a55')}}
 if(sec===1){for(let i=0;i<4;i++){let x=42+(i*82+room.id*7)%256;px(x,62,22,4,'#316781');px(x+3,66,5,3,'#5bb5c9')}}
 if(sec===2){for(let i=0;i<6;i++){let x=41+(i*55+room.id*9)%260,y=61+(i*47)%245;px(x,y,7,3,'#845641');px(x+3,y-4,2,4,'#e59c57')}}
 if(sec===3){for(let i=0;i<5;i++){let x=47+(i*61+room.id*7)%245;px(x,46,15,3,'#70446e');px(x+4,49,4,5,'#8b5c9b')}}
}

function draw(){let r=data.run;if(!r)return;let room=r.rooms[r.current];let sec=sectorOf(room),theme=SECTORS[sec];cx.fillStyle=isArena(r.current,r)||isBoss(r.current,r)?'#282631':isExit(r.current,r)?'#1a3436':theme.bg;cx.fillRect(0,0,360,400);cx.lineWidth=1;cx.strokeStyle=theme.grid;for(let x=20;x<360;x+=40){cx.beginPath();cx.moveTo(x,20);cx.lineTo(x,380);cx.stroke()}for(let y=20;y<400;y+=40){cx.beginPath();cx.moveTo(20,y);cx.lineTo(340,y);cx.stroke()}
// Micro-textures déterministes : ambiance pixel-art sans assets externes, ne changent jamais les hitbox.
cx.save();for(let j=0;j<23;j++){let x=27+(j*83+(r.current*19))%302,y=45+(j*137+r.current*11)%302;cx.fillStyle=j%3===0?theme.accent:'#83939a';cx.globalAlpha=j%3===0?.14:.08;cx.fillRect(x,y,j%4===0?11:4,j%4===0?3:4)}cx.restore();drawPixelFloor(room,sec,theme);
// Identité visuelle des secteurs et dangers annoncés.
cx.save();cx.globalAlpha=.75;
if(sec===0){cx.fillStyle='#55665b';for(let [x,y,w,h] of roomObstacles(room)){cx.fillRect(x,y,w,h);cx.strokeStyle='#9bab89';cx.strokeRect(x,y,w,h)}}
if(sec===1){cx.fillStyle='#254f6c';for(let x of [55,290]){cx.fillRect(x,44,16,43);cx.fillRect(x,275,16,54)}if(!room.cleared){cx.strokeStyle=room.hazardOn?'#7fe8ff':'#418baa';cx.lineWidth=room.hazardOn?7:2;cx.beginPath();cx.moveTo(room.hazardX||180,42);cx.lineTo(room.hazardX||180,356);cx.stroke();cx.fillStyle='#bfeeff';cx.font='10px sans-serif';cx.fillText(room.hazardOn?'⚠ LASER ACTIF':'LASER EN CHARGE',180,54)}}
if(sec===2){for(let x of [65,290]){cx.fillStyle='#624432';cx.fillRect(x-20,62,35,37);cx.fillRect(x-20,276,35,37)}if(!room.cleared){cx.beginPath();cx.arc(room.hazardX||240,205,42,0,Math.PI*2);cx.fillStyle=room.hazardOn?'#ff773977':'#b16d2f33';cx.fill();cx.strokeStyle=room.hazardOn?'#ffc178':'#a7784c';cx.lineWidth=3;cx.stroke();cx.fillStyle='#ffd6a8';cx.font='10px sans-serif';cx.fillText(room.hazardOn?'⚠ CHALEUR':'ÉVENT EN CHARGE',180,53)}}
if(sec===3){cx.strokeStyle='#b478a9';cx.lineWidth=3;for(let x of [47,313]){cx.strokeRect(x-11,72,22,35);cx.strokeRect(x-11,273,22,35)}}
cx.restore();cx.font='bold 10px sans-serif';cx.fillStyle=theme.accent;cx.textAlign='left';cx.fillText('SECTEUR '+(sec+1)+' · '+theme.name,27,32);
cx.fillStyle='#495864';cx.fillRect(0,0,360,20);cx.fillRect(0,380,360,20);cx.fillRect(0,0,20,400);cx.fillRect(340,0,20,400);for(let d of doors(r.current)){let[x,y,w,h]=doorRect(d.side);const arenaEntry=(isArena(d.to,r)||isBoss(d.to,r))&&!r.rooms[d.to].cleared;cx.fillStyle=!canPassDoor(d.to)?'#d76b63':arenaEntry?'#d9933f':'#55b8a3';cx.fillRect(x,y,w,h);if(!canPassDoor(d.to)){cx.strokeStyle='#ffaaa4';cx.lineWidth=2;cx.strokeRect(x+2,y+2,w-4,h-4)}if(arenaEntry){cx.strokeStyle='#ffe0a2';cx.lineWidth=3;cx.strokeRect(x+2,y+2,w-4,h-4)}cx.fillStyle='#122832';if(d.side==='top'||d.side==='bottom')cx.fillRect(x+6,y,w-12,h);else cx.fillRect(x,y+6,w,h-12);if(arenaEntry){cx.font='bold 10px sans-serif';cx.textAlign='center';cx.fillStyle='#fff2d0';let tx=d.side==='left'?39:d.side==='right'?319:180,ty=d.side==='top'?42:d.side==='bottom'?365:204;cx.fillText(isBoss(d.to,r)?'☠ BOSS':'⚠ ARÈNE',tx,ty)}}
if((room.chestFx||0)>0){cx.save();cx.globalAlpha=Math.min(1,room.chestFx);cx.strokeStyle='#f7d58b';cx.lineWidth=5;cx.beginPath();cx.arc(180,110,25+(1.15-room.chestFx)*38,0,Math.PI*2);cx.stroke();cx.restore()}if(room.chest==='closed'){cx.fillStyle='#b98b4d';cx.fillRect(159,91,42,35);cx.fillStyle='#f0c878';cx.fillRect(177,91,7,35);px(162,94,36,3,'#674e39');px(163,121,34,3,'#674e39');px(169,103,4,14,'#d4a36a');cx.font='10px sans-serif';cx.textAlign='center';cx.fillText(isGuarded(r.current,r)?room.enemies.length?'🔒 GARDÉ':'DÉVERROUILLÉ':'COFFRE',180,79)}if(isArena(r.current,r)){cx.fillStyle=room.cleared?'#90e8b5':'#ffd388';cx.font='bold 12px sans-serif';cx.textAlign='center';cx.fillText(room.cleared?'ARÈNE TERMINÉE':`VAGUE ${room.arenaWave||1}/3`,180,68);if(room.cleared&&room.chest==='closed'){cx.fillStyle='#d4a561';cx.fillText('COFFRE ÉPIQUE À OUVRIR',180,152)}}if(isBoss(r.current,r)){cx.fillStyle='#f1ad76';cx.textAlign='center';cx.font='bold 12px sans-serif';cx.fillText(room.cleared?'GARDIEN VAINCU · HELIX DÉBLOQUÉ':'☠ GARDIEN K-17',180,70)}if(room.kind==='outpost'){cx.strokeStyle='#81cafd';cx.lineWidth=3;cx.strokeRect(145,159,70,70);cx.fillStyle='#b8e9ff';cx.textAlign='center';cx.font='bold 11px sans-serif';cx.fillText('📡 AVANT-POSTE',180,192);cx.font='9px sans-serif';cx.fillText(region().outposts.includes(room.sector)?'ACTIVÉ':'APPROCHE POUR ACTIVER',180,208)}if(isExit(r.current,r)){cx.strokeStyle='#6ddfc3';cx.lineWidth=4;cx.beginPath();cx.arc(180,195,39,0,7);cx.stroke();cx.fillStyle='#c1f9e8';cx.font='bold 11px sans-serif';cx.textAlign='center';cx.fillText(r.exitStarted?'RESTE DANS LE CERCLE':'RESTE DANS LE CERCLE',180,199);if(!r.exitStarted){cx.strokeStyle='#ffca72';cx.lineWidth=7;cx.beginPath();cx.arc(180,195,44,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,(r.exitCharge||0)/3));cx.stroke();cx.fillText(Math.round(Math.min(100,(r.exitCharge||0)/3*100))+' %',180,214)}}
lootDraw(room);for(let e of room.enemies){if(e.wind>0){cx.strokeStyle=(e.type==='chaser'||e.type==='brute')?'#ff6666':'#ffc45d';cx.lineWidth=3;cx.beginPath();cx.moveTo(e.x,e.y);cx.lineTo(e.x+Math.cos(e.aim)*125,e.y+Math.sin(e.aim)*125);cx.stroke();cx.beginPath();cx.arc(e.x,e.y,19,0,7);cx.stroke()}pixelActor(e.x,e.y,e.type,performance.now()/1000+(e.x*.04));cx.fillStyle='#081722';cx.fillRect(e.x-15,e.y-22,30,4);cx.fillStyle='#79e0a1';cx.fillRect(e.x-15,e.y-22,30*Math.max(0,e.hp/e.max),4)}for(let b of bullets){cx.fillStyle=b.enemy?'#ff9285':'#c1fae4';cx.beginPath();cx.arc(b.x,b.y,4,0,7);cx.fill()}if((player.dashFlash||0)>0){cx.strokeStyle='#a5faff';cx.lineWidth=5;cx.beginPath();cx.arc(player.x,player.y,18+25*player.dashFlash/.22,0,Math.PI*2);cx.stroke()}if(player.inv<=0||Math.floor(player.inv*14)%2===0){pixelActor(player.x,player.y,'player',performance.now()/1000,player.facingX||1,player.facingY||0)}}
function hurt(amount){if(player.inv>0)return;window.dispatchEvent(new CustomEvent('ashfall-fx',{detail:{kind:'damage',x:player.x,y:player.y}}));player.hp-=amount;player.inv=.65;if(player.hp<=0)finish(false)}
function transition(){if(locked())return false;let r=data.run,id=r.current;for(let d of doors(id)){let s=d.side,hit=s==='top'?player.y<=23&&Math.abs(player.x-180)<30:s==='bottom'?player.y>=377&&Math.abs(player.x-180)<30:s==='left'?player.x<=23&&Math.abs(player.y-203)<32:player.x>=337&&Math.abs(player.y-203)<32;if(hit){if(!canPassDoor(d.to)){if(!locked()){msg('🔒 Nouvelle salle bloquée : termine le combat pour avancer. Retour libre.');}return false}enter(d.to,id);return true}}return false}
function objective(name){let r=data.run;if(!r.objectives.includes(name))r.objectives.push(name)}
function update(dt){if(!data.run||overlay)return;enforceArena();let r=data.run,room=r.rooms[r.current];environment(room);if(room.cleared){room.hazardOn=false;for(let i=bullets.length-1;i>=0;i--)if(bullets[i].enemy)bullets.splice(i,1)}if(sanitizeEnemyPositions(room))persist();let sec=sectorOf(room);room.envPhase+=dt; if(!room.cleared&&room.kind!=='outpost'&&!isExit(r.current,r)&&r.current!==0&&(sec===1||sec===2)){room.hazardCooldown-=dt;if(room.hazardCooldown<=0){room.hazardOn=!room.hazardOn;room.hazardCooldown=room.hazardOn?1.15:2.9;if(!room.hazardOn)room.hazardX=sec===1?pick(105,255):pick(105,255)}if(room.hazardOn){let hit=sec===1?Math.abs(player.x-room.hazardX)<14&&player.y>50&&player.y<350:Math.hypot(player.x-room.hazardX,player.y-205)<42;if(hit){if(!room.hazardTick||room.hazardTick<=0){hurt(sec===1?11:15);room.hazardTick=.65}}}room.hazardTick=Math.max(0,(room.hazardTick||0)-dt)}player.inv=Math.max(0,player.inv-dt);player.fire=Math.max(0,player.fire-dt);player.dash=0;player.dashCooldown=Math.max(0,(player.dashCooldown||0)-dt);player.dashFlash=Math.max(0,(player.dashFlash||0)-dt);
let vx=joy.x+(keyState.ArrowRight||keyState.d?1:0)-(keyState.ArrowLeft||keyState.a?1:0),vy=joy.y+(keyState.ArrowDown||keyState.s?1:0)-(keyState.ArrowUp||keyState.w?1:0),mag=Math.hypot(vx,vy);if(mag>1){vx/=mag;vy/=mag}player.dx=vx;player.dy=vy;if(mag>.15){player.facingX=vx;player.facingY=vy}advanceSolid(player,vx*150*(1+perkBonus('speed'))*dt,vy*150*(1+perkBonus('speed'))*dt,12,room);if(transition())return;
if(room.activated&&isArena(r.current,r)&&room.enemies.length===0&&!room.cleared){room.arenaWave=(room.arenaWave||1)+1;if(room.arenaWave<=3){spawnReinforcement(room,room.arenaWave===2?3:4);if(room.arenaWave===3){const elite=enemiesFor(r.current)[3];const pos=spawnSafe(room,room.enemies,{x:180,y:105});if(elite&&pos)room.enemies.push({...elite,id:uid(),hp:160,max:160,...pos});}player.inv=Math.max(player.inv,.7);msg(`⚠ ARÈNE : vague ${room.arenaWave}/3 !`)}else{room.cleared=true;room.chest='closed';r.economy??={enemy:0,chest:0,room:0,arena:0,boss:0};const arenaReward=pick(150,250);r.earnedCredits+=arenaReward;r.economy.arena+=arenaReward;objective('arène');objective('arène-recherche-1');objective('arène-recherche-2');msg('🏆 VICTOIRE : coffre épique en cours d’ouverture !')}persist()}if(isBoss(r.current,r)&&room.spawned&&room.enemies.length===0&&!room.cleared){room.cleared=true;region().bossDefeated=true;data.unlockHelix=true;r.economy??={enemy:0,chest:0,room:0,arena:0,boss:0};r.earnedCredits+=450;r.economy.boss+=450;objective('boss-k17');objective('boss-recherche');msg('🏆 GARDIEN K-17 VAINCU ! HELIX DÉBLOQUÉ (future région).');persist()}if(!room.cleared&&room.spawned&&room.enemies.length===0&&!isArena(r.current,r)&&!isBoss(r.current,r)){room.cleared=true;if(room.kind!=='start'&&room.kind!=='outpost'){r.economy??={enemy:0,chest:0,room:0,arena:0,boss:0};r.earnedCredits+=20;r.economy.room+=20;objective('combat-'+r.current)}msg('✓ Salle sécurisée : nouvelles portes ouvertes !');persist()}
if(room.enemies.length&&player.fire<=0){let target=room.enemies.reduce((a,b)=>length(player,a)<length(player,b)?a:b);let spread=mag>.15?(Math.random()-.5)*.46:(Math.random()-.5)*.09,ang=Math.atan2(target.y-player.y,target.x-player.x)+spread;bullets.push({x:player.x,y:player.y,vx:Math.cos(ang)*300,vy:Math.sin(ang)*300,enemy:false,dmg:damage()*(1+perkBonus('power')),ttl:1.5});player.fire=1/(r.equipped.rate*(1+perkBonus('rapid')))}
for(let e of room.enemies){let d=length(e,player),angle=Math.atan2(player.y-e.y,player.x-e.x);e.wind=e.wind||0;
if(e.wind>0){e.wind-=dt;if(e.wind<=0){if(e.type==='chaser'||e.type==='brute'){let reach=length(e,player);if(reach<(e.type==='brute'?125:115)&&Math.abs(Math.atan2(Math.sin(angle-e.aim),Math.cos(angle-e.aim)))<.48)hurt(e.type==='brute'?25:18)}else{let count=e.type==='sentinel'?3:1;for(let j=0;j<count;j++){let a=e.aim+(j-(count-1)/2)*.18;bullets.push({x:e.x,y:e.y,vx:Math.cos(a)*(e.type==='sentinel'?190:e.type==='drone'?215:175),vy:Math.sin(a)*(e.type==='sentinel'?190:e.type==='drone'?215:175),enemy:true,dmg:e.type==='sentinel'?22:e.type==='drone'?16:14,ttl:3})}}e.cd=e.type==='sentinel'?2.5:e.type==='drone'?1.45:e.type==='brute'?2.1:e.type==='ranged'?1.8:1.5}}
else{if(d>(e.type==='ranged'?140:e.type==='drone'?160:e.type==='sentinel'?155:e.type==='brute'?36:36)){advanceSolid(e,Math.cos(angle)*dt*(e.type==='sentinel'?32:e.type==='brute'?37:e.type==='drone'?67:e.type==='ranged'?47:80),Math.sin(angle)*dt*(e.type==='sentinel'?32:e.type==='brute'?37:e.type==='drone'?67:e.type==='ranged'?47:80),14,room)}e.cd-=dt;if(e.cd<=0&&d<(e.type==='chaser'?135:300)){e.aim=angle;e.wind=e.type==='chaser'?.8:e.type==='brute'?1.15:e.type==='sentinel'?1.2:e.type==='drone'?.6:.7}}
}

for(let b of bullets){
 let ox=b.x,oy=b.y,dx=b.vx*dt,dy=b.vy*dt;
 let steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/5));
 for(let i=0;i<steps;i++){
  b.x+=dx/steps;b.y+=dy/steps;
  if(collidesSolid(b.x,b.y,4,room)){window.dispatchEvent(new CustomEvent('ashfall-fx',{detail:{kind:'impact',x:b.x,y:b.y,enemy:b.enemy}}));b.ttl=0;break}
 }
 if(b.ttl<=0)continue;
 b.ttl-=dt;if(b.enemy){if(length(b,player)<16){hurt(b.dmg);b.ttl=0}}else{for(let e of room.enemies){if(length(b,e)<15){e.hp-=b.dmg;window.dispatchEvent(new CustomEvent('ashfall-fx',{detail:{kind:e.hp<=0?'death':'impact',x:e.x,y:e.y}}));b.ttl=0;if(e.hp<=0&&!e.lootDropped){e.lootDropped=true;lootSpawn(room,'xp',e.x,e.y,null,pick(2,5));lootSpawn(room,'credits',e.x,e.y,null,pick(4,10));if(Math.random()<.055){lootSpawn(room,'weapon',e.x,e.y,makeWeapon(sectorOf(room)))}}break}}}}
room.enemies=room.enemies.filter(e=>e.hp>0);
// À la fin d’un combat, supprimer immédiatement les tirs hostiles et désarmer les dangers de salle.
// Une arène non terminée garde ses vagues : le nettoyage ne valide jamais une salle prématurément.
if(room.enemies.length===0){
 for(let i=bullets.length-1;i>=0;i--)if(bullets[i].enemy)bullets.splice(i,1);
 if(!isArena(r.current,r)||room.arenaWave>=3)room.hazardOn=false;
}
// Après sécurisation, ouverture automatique des coffres (y compris la récompense d'arène).
if(room.chest==='closed'&&room.enemies.length===0&&!locked()&&(room.cleared||room.spawned)){
 room.chest='opened';room.chestFx=1.15;
 const g=makeWeapon(r.current===6?3:r.current===7?2:r.current===5?1:0);
 if(isArena(r.current,r)){g.rar='Épique';g.dmg=Math.max(43,g.dmg+16)}
 if(isGuarded(r.current,r)&&g.rar==='Commun'){g.rar='Rare';g.dmg+=8}
 lootSpawn(room,'weapon',180,118,g);lootSpawn(room,'credits',177,122,null,pick(12,24));
 ground(room)[ground(room).length-1].source='chest';msg('✨ Coffre ouvert automatiquement · '+g.name+' !');persist();
}
room.chestFx=Math.max(0,(room.chestFx||0)-dt);
if(room.kind==='outpost'&&!room.activated&&Math.hypot(player.x-180,player.y-195)<55)activateOutpost();
// Zone stricte : quitter le cercle interrompt même le compte à rebours final.
const inExtractionCircle=isExit(r.current,r)&&Math.hypot(player.x-180,player.y-195)<39;
if(r.exitStarted&&!inExtractionCircle)cancelExtraction(r,'zone de contrôle quittée');
if(isExit(r.current,r)&&!r.exitStarted){
 const inside=inExtractionCircle;
 r.exitCharge=inside?Math.min(3,(r.exitCharge||0)+dt):0;
 if(r.exitCharge>=3){r.exitStarted=true;r.exitTime=12;r.exitWave=1;spawnReinforcement(room,2);msg('📡 Extraction lancée : reste dans le cercle 12 secondes !');persist();}
}
lootUpdate(room,dt);bullets=bullets.filter(b=>b.ttl>0&&b.x>-10&&b.x<370&&b.y>-10&&b.y<410);
if(r.exitStarted&&inExtractionCircle){let contested=room.enemies.some(e=>length(e,{x:180,y:195})<105);if(!contested)r.exitTime-=dt;if(r.exitWave===1&&r.exitTime<=6){r.exitWave=2;spawnReinforcement(room,2);msg('⚠ DEUXIÈME VAGUE : défends le terminal !')}if(r.exitTime<=0){finish(true);return}}
drawTime+=dt;if(drawTime>.12){drawTime=0;render()}tickSave+=dt;if(tickSave>4){tickSave=0;persist()}}
// Joystick semi-mobile, limité à 36 px autour du centre inférieur.
const joystickZone=$('joystickZone'),joyBase=$('joyBase'),joyKnob=$('joyKnob');
function joystickPosition(e){const r=joystickZone.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function joystickPaint(){const dx=joy.cx-joystickZone.clientWidth/2,dy=joy.cy-joystickZone.clientHeight/2;joyBase.style.transform=`translate(${dx}px,${dy}px)`;joyKnob.style.transform=`translate(${joy.x*25}px,${joy.y*25}px)`;}
function down(e){if(!data.run||overlay||joy.pointer!==null||(e.pointerType==='mouse'&&e.button!==0))return;const p=joystickPosition(e),w=joystickZone.clientWidth,h=joystickZone.clientHeight;const ox=p.x-w/2,oy=p.y-h/2,mag=Math.hypot(ox,oy),maxShift=34,ratio=mag>maxShift?maxShift/mag:1;joy={x:0,y:0,pointer:e.pointerId,cx:w/2+ox*ratio,cy:h/2+oy*ratio};joystickPaint();try{joystickZone.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();}
function move(e){if(joy.pointer!==e.pointerId)return;const p=joystickPosition(e),dx=p.x-joy.cx,dy=p.y-joy.cy,mag=Math.hypot(dx,dy),radius=42;joy.x=mag>radius?dx/mag:dx/radius;joy.y=mag>radius?dy/mag:dy/radius;joystickPaint();e.preventDefault();}
function up(e){if(joy.pointer!==e.pointerId)return;joy={x:0,y:0,pointer:null,cx:0,cy:0};joyBase.style.transform='translate(0,0)';joyKnob.style.transform='translate(0,0)';e.preventDefault();}
joystickZone.addEventListener('pointerdown',down);joystickZone.addEventListener('pointermove',move);joystickZone.addEventListener('pointerup',up);joystickZone.addEventListener('pointercancel',up);joystickZone.addEventListener('lostpointercapture',up);
window.addEventListener('keydown',e=>{if(e.target.tagName==='TEXTAREA')return;keyState[e.key]=true;});window.addEventListener('keyup',e=>keyState[e.key]=false);
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(data.run&&!overlay)openOverlay('pause');persist(false)}});
window.addEventListener('pagehide',()=>persist());
window.addEventListener('freeze',()=>persist());
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
if(data.run){runProgress();data.run.exitWave=data.run.exitWave||(data.run.exitStarted?1:0);setPlayer();if(data.run.exitStarted&&(!isExit(data.run.current,data.run)||Math.hypot(player.x-180,player.y-195)>=39))cancelExtraction(data.run,'zone quittée');sanitizeEnemyPositions(data.run.rooms[data.run.current]);if(isArena(data.run.current,data.run))enforceArena();else{let cr=data.run.rooms[data.run.current];if(cr&&cr.spawned&&!isBoss(data.run.current,data.run))autoSecure(cr)}if(!player||!data.run.rooms[data.run.current]){data.run=null;data.equipped=data.equipped||starter();msg('Ancienne expédition incompatible : refuge récupéré.')}else{openOverlay('pause');msg('Expédition retrouvée : appuie sur Reprendre.')}}

// Initial training: self-contained guide. The flag is intentionally separate from ashfall_pwa_v1.
const TUTORIAL_KEY='ashfall_tutorial_v1';
const tutorialSteps=[
 {title:'Bienvenue dans ASHFALL',scene:'🏚️  🎮',desc:'Tu es un survivant dans K-17. Chaque expédition consiste à explorer des salles, récupérer du butin, puis ressortir vivant.',tip:'Ta première mission : apprendre les commandes. Rien de ce tutoriel ne met ton équipement en danger.'},
 {title:'Bouger et tirer',scene:'🕹️  🔫',desc:'Pose le pouce dans la zone gauche pour placer le joystick, puis glisse. Relâche pour choisir un nouveau centre. Ton personnage tire automatiquement sur les ennemis à portée : pas besoin d’appuyer sur un bouton de tir.',tip:'Bouger réduit la précision : ralentir un instant peut aider à viser.'},
 {title:'Déplacement simplifié',scene:'🕹️',desc:'Le joystick est en bas au centre. Pose ton doigt dans sa zone et déplace-toi. Les tirs sont automatiques et il n’y a plus de bouton DASH.',tip:'Bouge pour éviter les attaques annoncées.'},
 {title:'Portes rouges et vertes',scene:'🔒  🚪',desc:'Les portes rouges vers des salles inconnues s’ouvrent après sécurisation de la salle. Tu peux généralement revenir par les portes vertes déjà visitées.',tip:'Exception : une arène ou un boss verrouille toutes les sorties jusqu’à la victoire.'},
 {title:'Ramasse XP et équipement',scene:'💎  ✨  🎒',desc:'Les ennemis et les coffres laissent tomber de l’XP, des crédits et parfois des armes. Approche-toi pour les aspirer et les ramasser.',tip:'Les couleurs montrent la rareté. Si ton sac est plein, une arme reste au sol : reviens après avoir libéré une place.'},
 {title:'Niveaux et bouton ACTION',scene:'⭐  🔘',desc:'L’XP fait monter ton niveau d’expédition : choisis un bonus temporaire parmi trois. Les coffres s’ouvrent après élimination des ennemis et les avant-postes s’activent par proximité.',tip:'Tes bonus de niveau disparaissent à la fin de l’expédition. Tes talents achetés au refuge restent.'},
 {title:'Extraire pour tout garder',scene:'📡  🏃',desc:'Trouve une salle d’extraction puis reste 3 secondes dans le cercle lumineux pour la lancer. Reste ensuite dans le cercle jusqu’à la fin du compte à rebours pour rentrer avec ton butin. En sortir annule la procédure.',tip:'Si tu meurs, tu perds ton matériel non assuré. Avant de partir, tu peux assurer UN objet équipé au refuge.'}
];
let tutorialIndex=0;
function tutorialShow(index=0){if(data.run)return;tutorialIndex=clamp(index,0,tutorialSteps.length-1);$('tutorialModal').hidden=false;tutorialRender();}
function tutorialClose(){try{localStorage.setItem(TUTORIAL_KEY,'seen')}catch(e){}$('tutorialModal').hidden=true;}
function tutorialRender(){const s=tutorialSteps[tutorialIndex];$('tutorialTitle').textContent=s.title;$('tutorialDesc').textContent=s.desc;$('tutorialTip').textContent=s.tip;$('tutorialScene').textContent=s.scene;$('tutorialProgress').innerHTML=`<div style="width:${(tutorialIndex+1)/tutorialSteps.length*100}%"></div>`;$('tutorialPrev').disabled=tutorialIndex===0;$('tutorialNext').textContent=tutorialIndex===tutorialSteps.length-1?'▶ Jouer maintenant':'Suivant →';}
$('tutorialLaunch').addEventListener('click',()=>tutorialShow(0));
$('tutorialPrev').addEventListener('click',()=>{tutorialIndex=Math.max(0,tutorialIndex-1);tutorialRender()});
$('tutorialNext').addEventListener('click',()=>{if(tutorialIndex<tutorialSteps.length-1){tutorialIndex++;tutorialRender()}else{tutorialClose();start()}});
$('tutorialSkip').addEventListener('click',tutorialClose);

// 0.8.9.8 — Navigation du refuge dans la même portée que l'état du jeu.
let refugeActivePage='home';
function refugeNavigate(tab){
 if(data.run || !['home','character','merchant','progress'].includes(tab))return;
 refugeActivePage=tab;
 document.querySelectorAll('[data-refuge-page]').forEach(p=>{p.hidden=p.dataset.refugePage!==tab});
 document.querySelectorAll('.refuge-tab').forEach(b=>{
  const active=b.dataset.refugeTab===tab;
  b.classList.toggle('active',active);
  b.setAttribute('aria-current',active?'page':'false');
 });
 const tools=$('tools'); if(tools&&!tools.hidden)tools.hidden=true;
 if(tab==='merchant')merchantOpen();
 if(tab==='progress'){
  const target=$('refuge-progress-mirror'),source=$('regionStatus');
  if(target&&source)target.textContent=source.textContent;
  renderRefugeProgress();
 }
 if(tab==='character')renderRefugeCharacter();
 $('home').scrollIntoView({block:'start',behavior:'instant'});
}
document.querySelectorAll('[data-refuge-tab]').forEach(b=>b.addEventListener('click',()=>refugeNavigate(b.dataset.refugeTab)));
$('toolsClose').addEventListener('click',()=>{if(refugeActivePage==='merchant')refugeNavigate('home')});

if(!data.equipped&&!data.run)data.equipped=starter();region();render();if(!data.run&&data.runs===0){try{if(!localStorage.getItem(TUTORIAL_KEY))tutorialShow(0)}catch(e){}}if(data.run?.pendingLevels>0)openLevelChoice();function frame(t){let dt=Math.min(.033,(t-last)/1000||.016);last=t;update(dt);if(data.run)draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();
