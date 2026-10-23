(()=>{'use strict';
const $=id=>document.getElementById(id), cv=$('canvas'),cx=cv.getContext('2d'), KEY='ashfall_pwa_v1';
const pick=(a,b)=>Math.floor(a+Math.random()*(b-a+1)), clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const uid=()=> 'af-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
const starter=()=>({id:uid(),name:'Pistolet usé',rar:'Commun',dmg:13,rate:1.8});
const fresh=()=>({version:1,credits:400,research:0,hpLv:0,dmgLv:0,runs:0,equipped:starter(),stash:[],insured:null,run:null,stats:{extractions:0,deaths:0}});
let data=fresh(), player=null, bullets=[],sparks=[],joy={x:0,y:0,pointer:null},keyState={},overlay='',last=0,drawTime=0,tickSave=0;
function msg(v){$('log').textContent=v}
function valid(d){return d&&d.version===1&&Number.isFinite(d.credits)&&Number.isFinite(d.research)&&Array.isArray(d.stash)&&d.equipped&&typeof d.equipped.id==='string'&&(!d.run||Array.isArray(d.run.rooms))}
function persist(silent=true){if(data.run&&player)data.run.player={...player};try{localStorage.setItem(KEY,JSON.stringify(data));if(!silent)msg('Sauvegarde effectuée.');return true}catch(e){msg('Sauvegarde locale indisponible. Utilise l’export de secours.');return false}}
try{let d=JSON.parse(localStorage.getItem(KEY)||'null');if(valid(d))data=d}catch(e){}
function region(){if(!data.regions)data.regions={k17:{maxSector:0,bossDefeated:false,expeditions:0}};if(!data.regions.k17)data.regions.k17={maxSector:0,bossDefeated:false,expeditions:0};if(!Array.isArray(data.regions.k17.outposts))data.regions.k17.outposts=[];return data.regions.k17}
function isLarge(r=data.run){return !!(r&&r.rooms&&r.rooms.length===50)}
function isArena(id,r=data.run){return isLarge(r)?r.arenaIds.includes(id):id===4}
function isExit(id,r=data.run){return isLarge(r)?r.exitIds.includes(id):id===8}
function isBoss(id,r=data.run){return isLarge(r)?id===r.bossId:false}
function isGuarded(id,r=data.run){return isLarge(r)?(r.rooms[id].kind==='guarded'||isArena(id,r)||isBoss(id,r)):[4,5,6,7].includes(id)}
function value(w){return Math.max(20,Math.round(w.dmg*17*(w.rar==='Épique'?2.3:w.rar==='Rare'?1.5:1)))}
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
 for(let a of nodes)for(let b of nodes)if(b.id>a.id&&Math.abs(a.gx-b.gx)+Math.abs(a.gy-b.gy)===1&&!edges.some(e=>e.includes(a.id)&&e.includes(b.id))&&Math.random()<.15)edges.push([a.id,b.id]);
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
function enemiesFor(id){let r=data.run,room=r?.rooms[id];if(id===0||room?.kind==='outpost')return[];let arena=isArena(id,r),boss=isBoss(id,r),sec=sectorOf(room);let count=boss?3:arena?4:isExit(id,r)?2:pick(2,3);return Array.from({length:count},(_,k)=>{let type=(boss||arena)&&k===count-1?'sentinel':sec===0?(k%2?'ranged':'chaser'):sec===1?(k%3?'ranged':'drone'):sec===2?(k%2?'brute':'ranged'):(k%2?'sentinel':'drone');let hp=(type==='sentinel'?(boss?250:125):type==='brute'?125:type==='drone'?65:type==='ranged'?60:75)*(1+sec*.12);return{id:uid(),type,x:pick(78,275),y:pick(85,255),hp,max:hp,cd:Math.random()+.6,wind:0,aim:0}})}
function spawnReinforcement(room,count){let n=room.enemies.length;for(let k=0;k<count;k++){let type=k%2===0?'ranged':'chaser',hp=type==='ranged'?60:75;room.enemies.push({id:uid(),type,x:k%2?292:67,y:85+35*(k%3),hp,max:hp,cd:1,wind:0,aim:0})}}

function createRun(){let m=makeLargeMap();region().expeditions++;return {...m,current:0,visited:[0],bag:[],equipped:data.equipped,insuredId:data.insured,earnedCredits:0,xp:0,xpTotal:0,runLevel:1,runPerks:{},pendingLevels:0,objectives:[],exitTime:0,exitStarted:false,exitWave:0,player:{x:180,y:310,hp:maxHp(),max:maxHp(),inv:0,fire:0,dash:0,dx:0,dy:0}}}
function setPlayer(){player=data.run?.player||null}

// Progression temporaire : aucun champ de sauvegarde permanent modifié.
const PERKS=[{id:'rapid',name:'Tir rapide',desc:'+12 % cadence de tir',icon:'⚡'},
 {id:'power',name:'Munitions renforcées',desc:'+10 % dégâts',icon:'✦'},
 {id:'speed',name:'Semelles tactiques',desc:'+9 % vitesse',icon:'➤'},
 {id:'magnet',name:'Collecteur magnétique',desc:'+22 % portée du ramassage',icon:'◈'},
 {id:'vital',name:'Patch médical',desc:'+15 PV max et soin +15',icon:'♥'},
 {id:'cool',name:'Condensateur DASH',desc:'-10 % recharge du DASH',icon:'⇢'}];
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
function perkCount(id){let r=runProgress();return r?.runPerks[id]||0}
function levelOptions(){let r=runProgress();if(!Array.isArray(r.levelChoices)||r.levelChoices.length!==3){
  const options=[...PERKS].sort(()=>Math.random()-.5).slice(0,3);r.levelChoices=options.map(o=>o.id)}return r.levelChoices.map(id=>PERKS.find(p=>p.id===id)).filter(Boolean)}
function openLevelChoice(){let r=runProgress();if(!r||r.pendingLevels<=0)return;
 overlay='level';let opts=levelOptions();$('overlay').innerHTML='<h3>✦ NIVEAU '+r.runLevel+' — CHOISIS UN BONUS</h3><p class="muted">Amélioration temporaire, active uniquement jusqu’à la fin de cette expédition. Le combat est en pause.</p>'+opts.map(o=>'<button class="perk-option" data-op="choosePerk" data-perk="'+o.id+'"><b>'+o.icon+' '+o.name+'</b><small>'+o.desc+' · Possédé : '+perkCount(o.id)+'</small></button>').join('');$('overlay').hidden=false;persist();}
function choosePerk(id){let r=runProgress();if(!r||r.pendingLevels<=0||!r.levelChoices?.includes(id))return;
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
  const dist=Math.hypot(player.x-d.x,player.y-d.y);const magnet=1+.22*perkCount('magnet');const range=(d.kind==='xp'?104:68)*magnet;
  if(dist<range&&d.bounce<=0&&hasLineOfSight(d.x,d.y,player.x,player.y,room)){const speed=d.kind==='xp'?340:250;const t=Math.min(1,speed*dt/Math.max(1,dist));let tx=d.x+(player.x-d.x)*t,ty=d.y+(player.y-d.y)*t;if(!collidesSolid(tx,ty,6,room)){d.x=tx;d.y=ty}}
  if(Math.hypot(player.x-d.x,player.y-d.y)<18&&d.bounce<=0){
   if(d.kind==='xp'){collectXp(d.amount);d.got=true}
   else if(d.kind==='credits'){data.run.earnedCredits+=d.amount;d.got=true}
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

function enter(id,from){let r=data.run,room=r.rooms[id];r.current=id;room.seen=true;if(!r.visited.includes(id))r.visited.push(id);
if(isLarge(r)){let reg=region();reg.maxSector=Math.max(reg.maxSector,room.sector);}
environment(room);if(!room.spawned){room.spawned=true;room.enemies=enemiesFor(id);}
if(from!==null){let prev=r.rooms[from];let[a,b]=pos(from),[x,y]=pos(id);player.x=x>a?37:x<a?323:180;player.y=y>b?37:y<b?363:205}
if(isArena(id,r)&&!room.cleared){enforceArena()}
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
function action(){if(!data.run||overlay)return;enforceArena();let r=data.run,room=r.rooms[r.current],act=interaction();if(act==='outpost'){activateOutpost();return}if(act==='chest'){if(isGuarded(r.current,r)&&room.enemies.length){msg('🔒 COFFRE PROTÉGÉ : élimine les gardiens avant ouverture.');return}room.chest='opened';let g=makeWeapon(r.current===6?3:r.current===7?2:r.current===5?1:0);if(isArena(r.current,r)){g.rar='Épique';g.dmg=Math.max(43,g.dmg+16)}if(isGuarded(r.current,r)&&g.rar==='Commun'){g.rar='Rare';g.dmg+=8};lootSpawn(room,'weapon',180,118,g);lootSpawn(room,'credits',177,122,null,pick(25,55));msg(`✨ Coffre ouvert : ${g.rar} ${g.name} au sol ! Approche-toi pour ramasser.`)}else if(act==='exit'){r.exitStarted=true;r.exitTime=12;r.exitWave=1;spawnReinforcement(room,2);msg('EXTRACTION : 12 s de contrôle ! Renforts annoncés, zone contestable.')}else msg('Approche-toi d’un coffre ou d’un terminal.');persist();render()}
function finish(won){let r=data.run;if(!r)return;let equipped=r.equipped,oldHome=null;let objects=[equipped,...r.bag].filter(Boolean);if(won){data.equipped=equipped;data.stash.push(...r.bag);data.credits+=r.earnedCredits+90;data.research+=r.objectives.length+Math.floor(r.visited.length/3);data.stats.extractions++;msg(`EXTRACTION ! ${r.bag.length} objet(s) rapporté(s), +${r.earnedCredits+90} crédits · ${r.xpTotal||r.xp||0} XP récoltée.`)}else{let insured=objects.find(w=>w.id===r.insuredId);data.equipped=insured||starter();data.research+=Math.min(2,Math.floor(r.visited.length/3));data.stats.deaths++;msg(insured?'Mort : l’objet assuré a été récupéré.':'Mort : équipement perdu.')}data.runs++;data.insured=null;data.run=null;player=null;bullets=[];closeOverlay();persist();render()}
function itemRow(w,i,source){const safe=x=>String(x).replace(/[<>&"']/g,'');return `<div class="item"><b style="color:${tint(w)}">${safe(w.name)}</b><div class="muted">${safe(w.rar)} · ${w.dmg} dégâts · ${w.rate}/s · valeur ${value(w)} ¤ ${data.run&&w.id===data.run.insuredId?'· 🛡️ ASSURÉ':''}</div><div class="line"><button data-op="${source==='stash'?'equipHome':'equipBag'}" data-idx="${i}">Équiper</button><button data-op="${source==='stash'?'sell':'drop'}" data-idx="${i}">${source==='stash'?'Vendre':'Abandonner'}</button></div></div>`}
function uniqueCheck(){let seen=new Set(),items=[data.equipped,...data.stash];if(data.run)items=[data.run.equipped,...data.run.bag];for(let w of items){if(!w)continue;if(seen.has(w.id))return false;seen.add(w.id)}return true}
function equipHome(i){let w=data.stash[i];if(!w)return;let old=data.equipped;data.stash.splice(i,1);data.equipped=w;if(old)data.stash.push(old);data.insured=null;persist();render();msg(`${w.name} équipé. Assurance à renouveler.`)}
function equipBag(i){let r=data.run,w=r.bag[i];if(!w)return;let old=r.equipped;r.bag.splice(i,1);r.equipped=w;if(old){r.bag.push(old)}if(!uniqueCheck())msg('Erreur d’inventaire détectée.');else msg(`${w.name} équipé. Assurance non transférée.`);persist();render();openOverlay('bag')}
function drop(i){let r=data.run,w=r.bag[i];if(!w)return;if(w.id===r.insuredId&&!confirm('Abandonner cet objet annulera son assurance. Confirmer ?'))return;if(w.id===r.insuredId)r.insuredId=null;r.bag.splice(i,1);persist();render();openOverlay('bag');msg(`${w.name} abandonné.`)}
function sell(i){let w=data.stash[i];if(!w)return;data.stash.splice(i,1);let gain=Math.round(value(w)*.55);data.credits+=gain;persist();render();msg(`${w.name} vendu : +${gain} crédits.`)}
function buy(){if(data.credits<330)return;data.credits-=330;data.stash.push({id:uid(),name:'Pistolet renforcé',rar:'Commun',dmg:21,rate:2});persist();render();msg('Pistolet renforcé acheté et rangé.')}
function upgrade(t){let lv=t==='hp'?data.hpLv:data.dmgLv,cost=3+lv*3;if(lv>=8||data.research<cost)return;data.research-=cost;if(t==='hp')data.hpLv++;else data.dmgLv++;persist();render()}
function insure(){if(!data.equipped||data.insured===data.equipped.id||data.credits<premium())return;data.credits-=premium();data.insured=data.equipped.id;persist();render();msg('Objet assuré pour la prochaine expédition.')}
function render(){let r=data.run;$('home').hidden=!!r;$('game').hidden=!r;$('phase').textContent=r?'EXPÉDITION':'REFUGE';$('credits').textContent=data.credits;$('research').textContent=data.research;$('runs').textContent=data.runs;if(!r){if($('xpDisplay'))$('xpDisplay').style.display='none';$('hpLevel').textContent='Nv. '+data.hpLv;$('dmgLevel').textContent='Nv. '+data.dmgLv;$('upHp').textContent=`+15 PV · ${3+data.hpLv*3} ✦`;$('upDmg').textContent=`+3 DGT · ${3+data.dmgLv*3} ✦`;$('upHp').disabled=data.hpLv>=8||data.research<3+data.hpLv*3;$('upDmg').disabled=data.dmgLv>=8||data.research<3+data.dmgLv*3;$('equipped').textContent=data.equipped?`${data.equipped.name} · ${data.equipped.dmg} dégâts`:'Aucune';$('insurance').textContent=data.insured===data.equipped?.id?'✓ Assuré':'Un seul objet';$('insure').textContent=`Assurer · ${premium()} ¤`;$('insure').disabled=data.insured===data.equipped.id||data.credits<premium();$('stash').innerHTML=data.stash.length?data.stash.map((g,i)=>itemRow(g,i,'stash')).join(''):'<p class="muted">Réserve vide.</p>';$('buy').disabled=data.credits<330;$('log').dataset.region=region().maxSector;
 const sel=$('startSector');if(sel){let enabled=[0,...region().outposts];sel.innerHTML=enabled.map(i=>`<option value="${i}">${i===0?'Entrée de K-17':'Avant-poste du secteur '+(i+1)}</option>`).join('');if(enabled.includes(Number(data.chosenSector)))sel.value=String(data.chosenSector);else sel.value='0'}
 const status=$('regionStatus');if(status)status.textContent='K-17 · secteurs '+(region().maxSector+1)+'/4 · avant-postes '+region().outposts.length+'/3 · Gardien '+(region().bossDefeated?'vaincu':'à découvrir')+' · Helix '+(data.unlockHelix?'débloquée (non jouable)':'verrouillée');return}let room=r.rooms[r.current];$('roomTitle').textContent=isBoss(r.current,r)?'⚠ BOSS K-17':isArena(r.current,r)?'ARÈNE':isExit(r.current,r)?'EXTRACTION':room.kind==='secret'?'SALLE SECRÈTE':room.kind==='outpost'?'📡 AVANT-POSTE':`K-17 · ${r.current+1}/50 · ${SECTORS[sectorOf(room)].name}`;$('hpText').textContent=`${Math.ceil(player.hp)}/${player.max}`;$('hpFill').style.width=`${clamp(player.hp/player.max*100,0,100)}%`;runProgress();$('bagCount').textContent=`Sac ${r.bag.length}/6 · Nv.${r.runLevel}`;const xp=$('xpDisplay');if(xp){xp.textContent=`✦ Nv.${r.runLevel} · ${Math.floor(r.xp)}/${xpThreshold(r.runLevel)} XP`;xp.style.display='block';$('xpFill').style.width=(100*clamp(r.xp/xpThreshold(r.runLevel),0,1))+'%'}const dashButton=$('dodge');if(dashButton){let cooldown=player.dashCooldown||0;dashButton.textContent=cooldown>.05?`${cooldown.toFixed(1)}s`:'DASH';dashButton.classList.toggle('cooling',cooldown>.05)}$('hint').textContent=locked()?'⚠ ARÈNE/BOSS · PORTES VERROUILLÉES':r.exitStarted?`EXTRACTION ${Math.max(0,Math.ceil(r.exitTime))}s · ${room.enemies.some(e=>length(e,{x:180,y:195})<105)?'CONTESTÉE':'DÉFENDS'}`:interaction()?'ACTION disponible':room.cleared?'✓ SALLE SÉCURISÉE · portes ouvertes':`🔒 FINIS LA SALLE POUR AVANCER · retour libre`}
function closeOverlay(){if(overlay==='level'&&data.run?.pendingLevels>0)return;overlay='';$('overlay').hidden=true;$('overlay').innerHTML=''}
function openOverlay(mode){if(!data.run)return;overlay=mode;let r=data.run,html='<button class="close" data-op="close">✕ Fermer</button>';if(mode==='bag'){html+='<h3>INVENTAIRE</h3><p class="muted">Arme : '+r.equipped.name+' · '+r.equipped.dmg+' dégâts'+(r.equipped.id===r.insuredId?' · ASSURÉE':'')+'</p>'+ (r.bag.length?r.bag.map((w,i)=>itemRow(w,i,'bag')).join(''):'<p>Sac vide.</p>')+'<p class="muted">L’objet remplacé rejoint le sac. Les trouvailles ne sont jamais assurées automatiquement.</p>'}else if(mode==='map'){let coords=r.rooms.filter(z=>Number.isFinite(z.gx));if(coords.length){let minx=Math.min(...coords.map(z=>z.gx)),miny=Math.min(...coords.map(z=>z.gy)),maxx=Math.max(...coords.map(z=>z.gx)),maxy=Math.max(...coords.map(z=>z.gy));let width=maxx-minx+1,height=maxy-miny+1,cell=Math.max(12,Math.min(26,Math.floor(310/Math.max(width,height))));let tiles=r.rooms.filter(z=>z.seen).map(z=>`<div style="position:absolute;left:${(z.gx-minx)*cell}px;top:${(z.gy-miny)*cell}px;width:${cell-2}px;height:${cell-2}px;background:${z.id===r.current?'#dfac58':isBoss(z.id,r)?'#a45770':isArena(z.id,r)?'#945d36':isExit(z.id,r)?'#3d9b8b':z.kind==='outpost'?'#5092c4':'#35576b'};border:1px solid #97a4b6;border-radius:3px;color:white;font-size:9px;text-align:center;line-height:${cell-3}px">${z.id===r.current?'●':isBoss(z.id,r)?'B':isArena(z.id,r)?'A':isExit(z.id,r)?'E':z.kind==='outpost'?'P':''}</div>`).join('');html+='<h3>CARTE K-17 — 50 SALLES</h3><div style="overflow:auto;max-width:100%"><div style="position:relative;width:'+(width*cell)+'px;height:'+(height*cell)+'px;min-height:150px;background:#101a26">'+tiles+'</div></div><p class="muted">'+r.visited.length+'/50 découvertes · secteurs débloqués : '+(region().maxSector+1)+'/4 · B boss · A arène · E extraction · P avant-poste. Les salles se régénèrent à chaque nouvelle expédition.</p>';}else html+='<h3>ANCIENNE EXPÉDITION</h3><div class="cellmap">'+r.rooms.map((z,i)=>`<div class="${i===r.current?'here':z.seen?'known':''}">${z.seen?i+1:'?'}</div>`).join('')+'</div>';}else html+='<h3>PAUSE</h3><p>La partie est suspendue. La sauvegarde inclut l’expédition.</p><button data-op="resume">Reprendre</button><button data-op="retreat">Abandonner l’expédition (mort)</button>';$('overlay').innerHTML=html;$('overlay').hidden=false;persist()}
function tool(title,html){$('toolsTitle').textContent=title;$('toolsBody').innerHTML=html;$('tools').hidden=false}
function backup(){persist();const code=btoa(unescape(encodeURIComponent(JSON.stringify(data))));tool('EXPORT / IMPORT',`<p>Le code inclut le refuge et l’expédition en cours. Conserve-le dans Notes ou Fichiers.</p><textarea id="exportCode" readonly></textarea><button id="copyCode">Copier le code</button><p>Restaurer une sauvegarde :</p><textarea id="importCode" placeholder="Colle ici une sauvegarde..."></textarea><button id="restoreCode">Restaurer</button>`);$('exportCode').value=code;$('copyCode').onclick=async()=>{try{await navigator.clipboard.writeText($('exportCode').value);msg('Code copié.')}catch(e){$('exportCode').select();msg('Sélectionne le texte pour le copier.')}};$('restoreCode').onclick=()=>{try{const decoded=JSON.parse(decodeURIComponent(escape(atob($('importCode').value.trim()))));if(!valid(decoded))throw Error('format');if(!confirm('Remplacer toute la progression actuelle ?'))return;data=decoded;setPlayer();if(data.run&&isArena(data.run.current,data.run))enforceArena();bullets=[];closeOverlay();runProgress();persist();render();if(data.run?.pendingLevels>0)openLevelChoice();$('tools').hidden=true;msg('Sauvegarde restaurée.')}catch(e){msg('Code invalide ou incompatible.')}}}
$('startSector').addEventListener('change',e=>{data.chosenSector=Number(e.target.value);persist()});$('upHp').onclick=()=>upgrade('hp');$('upDmg').onclick=()=>upgrade('dmg');$('insure').onclick=insure;$('buy').onclick=buy;$('start').onclick=start;$('action').onclick=action;
$('bagBtn').onclick=()=>openOverlay('bag');$('mapBtn').onclick=()=>openOverlay('map');$('pauseBtn').onclick=()=>openOverlay('pause');
// Le clic synthetique iOS peut etre annule quand un autre doigt tient le joystick.
// Le DASH est donc declenche par pointerdown, independamment du pointer du joystick.
const dashButton=$('dodge');
let lastDashPointerAt=-Infinity;
dashButton.addEventListener('pointerdown', e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 e.preventDefault();
 lastDashPointerAt=performance.now();
 performDash();
});
// Accessibilite clavier et solution de secours sans double-activation au toucher.
dashButton.addEventListener('click', e=>{
 if(performance.now()-lastDashPointerAt<650){e.preventDefault();return}
 performDash();
});
$('overlay').addEventListener('click',e=>{let b=e.target.closest('[data-op]');if(!b)return;let op=b.dataset.op,idx=Number(b.dataset.idx);if(op==='choosePerk')choosePerk(b.dataset.perk);else if(op==='close'||op==='resume')closeOverlay();else if(op==='equipBag')equipBag(idx);else if(op==='drop')drop(idx);else if(op==='retreat'){if(confirm('Abandonner ? Tout le matériel non assuré sera perdu.'))finish(false)}});
$('stash').addEventListener('click',e=>{let b=e.target.closest('[data-op]');if(!b)return;let i=Number(b.dataset.idx);if(b.dataset.op==='equipHome')equipHome(i);else if(b.dataset.op==='sell')sell(i)});
$('saveBtn').onclick=()=>persist(false);$('backupBtn').onclick=backup;$('toolsClose').onclick=()=>$('tools').hidden=true;$('rulesBtn').onclick=()=>tool('RÈGLES',`<p>Déplace-toi en glissant sur la partie gauche du terrain. Les tirs sont automatiques ; ta précision diminue lorsque tu bouges.</p><p>Traverse librement les portes vertes. Une porte orange ⚠ ARÈNE annonce un combat obligatoire dès l’entrée ; trois vagues, coffre épique garanti en cas de victoire.</p><p>Approche des coffres ou terminaux avant de toucher ACTION. SAC et CARTE mettent le combat en pause.</p><p>DASH : impulsion de 95 pixels dans la direction du joystick (ou dernière direction), recharge 2,2 secondes. Les blocs solides arrêtent le joueur, les ennemis et les tirs (y compris pendant le dash). Les quatre secteurs possèdent désormais des ennemis, décors et dangers différents (laser et chaleur télégraphiés). K-17 comporte 50 salles irrégulières, trois sorties, trois avant-postes activables et quatre arènes. Les secteurs découverts restent débloqués mais la carte se régénère à chaque nouvelle expédition. Le boss principal débloque Helix pour une version future.</p><p>Extrais-toi depuis une salle d’extraction. À la mort, un seul objet assuré avant le départ peut être conservé. Les objets trouvés ne sont jamais assurés.</p><p>Les sauvegardes locales peuvent être effacées par iOS : exporte régulièrement une copie.</p>`);
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
 player.dashCooldown=Math.max(1.05,2.2*Math.pow(.90,perkCount('cool')));
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
function draw(){let r=data.run;if(!r)return;let room=r.rooms[r.current];let sec=sectorOf(room),theme=SECTORS[sec];cx.fillStyle=isArena(r.current,r)||isBoss(r.current,r)?'#282631':isExit(r.current,r)?'#1a3436':theme.bg;cx.fillRect(0,0,360,400);cx.lineWidth=1;cx.strokeStyle=theme.grid;for(let x=20;x<360;x+=40){cx.beginPath();cx.moveTo(x,20);cx.lineTo(x,380);cx.stroke()}for(let y=20;y<400;y+=40){cx.beginPath();cx.moveTo(20,y);cx.lineTo(340,y);cx.stroke()}
// Micro-textures déterministes : ambiance pixel-art sans assets externes, ne changent jamais les hitbox.
cx.save();for(let j=0;j<23;j++){let x=27+(j*83+(r.current*19))%302,y=45+(j*137+r.current*11)%302;cx.fillStyle=j%3===0?theme.accent:'#83939a';cx.globalAlpha=j%3===0?.14:.08;cx.fillRect(x,y,j%4===0?11:4,j%4===0?3:4)}cx.restore();
// Identité visuelle des secteurs et dangers annoncés.
cx.save();cx.globalAlpha=.75;
if(sec===0){cx.fillStyle='#55665b';for(let [x,y,w,h] of roomObstacles(room)){cx.fillRect(x,y,w,h);cx.strokeStyle='#9bab89';cx.strokeRect(x,y,w,h)}}
if(sec===1){cx.fillStyle='#254f6c';for(let x of [55,290]){cx.fillRect(x,44,16,43);cx.fillRect(x,275,16,54)}cx.strokeStyle=room.hazardOn?'#7fe8ff':'#418baa';cx.lineWidth=room.hazardOn?7:2;cx.beginPath();cx.moveTo(room.hazardX||180,42);cx.lineTo(room.hazardX||180,356);cx.stroke();cx.fillStyle='#bfeeff';cx.font='10px sans-serif';cx.fillText(room.hazardOn?'⚠ LASER ACTIF':'LASER EN CHARGE',180,54)}
if(sec===2){for(let x of [65,290]){cx.fillStyle='#624432';cx.fillRect(x-20,62,35,37);cx.fillRect(x-20,276,35,37)}cx.beginPath();cx.arc(room.hazardX||240,205,42,0,Math.PI*2);cx.fillStyle=room.hazardOn?'#ff773977':'#b16d2f33';cx.fill();cx.strokeStyle=room.hazardOn?'#ffc178':'#a7784c';cx.lineWidth=3;cx.stroke();cx.fillStyle='#ffd6a8';cx.font='10px sans-serif';cx.fillText(room.hazardOn?'⚠ CHALEUR':'ÉVENT EN CHARGE',180,53)}
if(sec===3){cx.strokeStyle='#b478a9';cx.lineWidth=3;for(let x of [47,313]){cx.strokeRect(x-11,72,22,35);cx.strokeRect(x-11,273,22,35)}}
cx.restore();cx.font='bold 10px sans-serif';cx.fillStyle=theme.accent;cx.textAlign='left';cx.fillText('SECTEUR '+(sec+1)+' · '+theme.name,27,32);
cx.fillStyle='#495864';cx.fillRect(0,0,360,20);cx.fillRect(0,380,360,20);cx.fillRect(0,0,20,400);cx.fillRect(340,0,20,400);for(let d of doors(r.current)){let[x,y,w,h]=doorRect(d.side);const arenaEntry=(isArena(d.to,r)||isBoss(d.to,r))&&!r.rooms[d.to].cleared;cx.fillStyle=!canPassDoor(d.to)?'#d76b63':arenaEntry?'#d9933f':'#55b8a3';cx.fillRect(x,y,w,h);if(!canPassDoor(d.to)){cx.strokeStyle='#ffaaa4';cx.lineWidth=2;cx.strokeRect(x+2,y+2,w-4,h-4)}if(arenaEntry){cx.strokeStyle='#ffe0a2';cx.lineWidth=3;cx.strokeRect(x+2,y+2,w-4,h-4)}cx.fillStyle='#122832';if(d.side==='top'||d.side==='bottom')cx.fillRect(x+6,y,w-12,h);else cx.fillRect(x,y+6,w,h-12);if(arenaEntry){cx.font='bold 10px sans-serif';cx.textAlign='center';cx.fillStyle='#fff2d0';let tx=d.side==='left'?39:d.side==='right'?319:180,ty=d.side==='top'?42:d.side==='bottom'?365:204;cx.fillText(isBoss(d.to,r)?'☠ BOSS':'⚠ ARÈNE',tx,ty)}}
if(room.chest==='closed'){cx.fillStyle='#b98b4d';cx.fillRect(159,91,42,35);cx.fillStyle='#f0c878';cx.fillRect(177,91,7,35);cx.font='10px sans-serif';cx.textAlign='center';cx.fillText(isGuarded(r.current,r)?room.enemies.length?'🔒 GARDÉ':'DÉVERROUILLÉ':'COFFRE',180,79)}if(isArena(r.current,r)){cx.fillStyle=room.cleared?'#90e8b5':'#ffd388';cx.font='bold 12px sans-serif';cx.textAlign='center';cx.fillText(room.cleared?'ARÈNE TERMINÉE':`VAGUE ${room.arenaWave||1}/3`,180,68);if(room.cleared&&room.chest==='closed'){cx.fillStyle='#d4a561';cx.fillText('COFFRE ÉPIQUE À OUVRIR',180,152)}}if(isBoss(r.current,r)){cx.fillStyle='#f1ad76';cx.textAlign='center';cx.font='bold 12px sans-serif';cx.fillText(room.cleared?'GARDIEN VAINCU · HELIX DÉBLOQUÉ':'☠ GARDIEN K-17',180,70)}if(room.kind==='outpost'){cx.strokeStyle='#81cafd';cx.lineWidth=3;cx.strokeRect(145,159,70,70);cx.fillStyle='#b8e9ff';cx.textAlign='center';cx.font='bold 11px sans-serif';cx.fillText('📡 AVANT-POSTE',180,192);cx.font='9px sans-serif';cx.fillText(region().outposts.includes(room.sector)?'ACTIVÉ':'ACTION POUR ACTIVER',180,208)}if(isExit(r.current,r)){cx.strokeStyle='#6ddfc3';cx.lineWidth=4;cx.beginPath();cx.arc(180,195,39,0,7);cx.stroke();cx.fillStyle='#c1f9e8';cx.font='bold 11px sans-serif';cx.textAlign='center';cx.fillText('EXTRACTION',180,199)}
lootDraw(room);for(let e of room.enemies){if(e.wind>0){cx.strokeStyle=(e.type==='chaser'||e.type==='brute')?'#ff6666':'#ffc45d';cx.lineWidth=3;cx.beginPath();cx.moveTo(e.x,e.y);cx.lineTo(e.x+Math.cos(e.aim)*125,e.y+Math.sin(e.aim)*125);cx.stroke();cx.beginPath();cx.arc(e.x,e.y,19,0,7);cx.stroke()}cx.fillStyle=e.type==='ranged'?'#edb65b':e.type==='drone'?'#68c9f4':e.type==='brute'?'#e98d4d':e.type==='sentinel'?'#b18aff':'#e37681';cx.beginPath();cx.arc(e.x,e.y,e.type==='ranged'?12:14,0,7);cx.fill();cx.fillStyle='#d3d6d9';cx.fillRect(e.x-7,e.y-6,5,5);cx.fillRect(e.x+3,e.y-6,5,5);cx.fillStyle='#172332';cx.fillRect(e.x-9,e.y+7,18,4);cx.fillStyle='#081722';cx.fillRect(e.x-15,e.y-22,30,4);cx.fillStyle='#79e0a1';cx.fillRect(e.x-15,e.y-22,30*Math.max(0,e.hp/e.max),4)}for(let b of bullets){cx.fillStyle=b.enemy?'#ff9285':'#c1fae4';cx.beginPath();cx.arc(b.x,b.y,4,0,7);cx.fill()}if((player.dashFlash||0)>0){cx.strokeStyle='#a5faff';cx.lineWidth=5;cx.beginPath();cx.arc(player.x,player.y,18+25*player.dashFlash/.22,0,Math.PI*2);cx.stroke()}if(player.inv<=0||Math.floor(player.inv*14)%2===0){cx.fillStyle='#8ce0c9';cx.beginPath();cx.arc(player.x,player.y,12,0,7);cx.fill();cx.fillStyle='#244b5c';cx.fillRect(player.x-7,player.y-9,14,11);cx.fillStyle='#e9d4a5';cx.fillRect(player.x-4,player.y-8,8,5);cx.fillStyle='#d0edf0';cx.fillRect(player.x-9,player.y-3,5,7);cx.fillStyle='#31485d';cx.fillRect(player.x-7,player.y+7,5,7);cx.fillRect(player.x+2,player.y+7,5,7)}cx.strokeStyle='#558898';cx.lineWidth=2;cx.beginPath();cx.arc(75,315,42,0,7);cx.stroke();cx.fillStyle='#4e8390a9';cx.beginPath();cx.arc(75+joy.x*26,315+joy.y*26,19,0,7);cx.fill()}
function hurt(amount){if(player.inv>0)return;player.hp-=amount;player.inv=.65;if(player.hp<=0)finish(false)}
function transition(){if(locked())return false;let r=data.run,id=r.current;for(let d of doors(id)){let s=d.side,hit=s==='top'?player.y<=23&&Math.abs(player.x-180)<30:s==='bottom'?player.y>=377&&Math.abs(player.x-180)<30:s==='left'?player.x<=23&&Math.abs(player.y-203)<32:player.x>=337&&Math.abs(player.y-203)<32;if(hit){if(!canPassDoor(d.to)){if(!locked()){msg('🔒 Nouvelle salle bloquée : termine le combat pour avancer. Retour libre.');}return false}enter(d.to,id);return true}}return false}
function objective(name){let r=data.run;if(!r.objectives.includes(name))r.objectives.push(name)}
function update(dt){if(!data.run||overlay)return;enforceArena();let r=data.run,room=r.rooms[r.current];environment(room);let sec=sectorOf(room);room.envPhase+=dt; if(!room.cleared&&room.kind!=='outpost'&&!isExit(r.current,r)&&r.current!==0&&(sec===1||sec===2)){room.hazardCooldown-=dt;if(room.hazardCooldown<=0){room.hazardOn=!room.hazardOn;room.hazardCooldown=room.hazardOn?1.15:2.9;if(!room.hazardOn)room.hazardX=sec===1?pick(105,255):pick(105,255)}if(room.hazardOn){let hit=sec===1?Math.abs(player.x-room.hazardX)<14&&player.y>50&&player.y<350:Math.hypot(player.x-room.hazardX,player.y-205)<42;if(hit){if(!room.hazardTick||room.hazardTick<=0){hurt(sec===1?11:15);room.hazardTick=.65}}}room.hazardTick=Math.max(0,(room.hazardTick||0)-dt)}player.inv=Math.max(0,player.inv-dt);player.fire=Math.max(0,player.fire-dt);player.dash=0;player.dashCooldown=Math.max(0,(player.dashCooldown||0)-dt);player.dashFlash=Math.max(0,(player.dashFlash||0)-dt);
let vx=joy.x+(keyState.ArrowRight||keyState.d?1:0)-(keyState.ArrowLeft||keyState.a?1:0),vy=joy.y+(keyState.ArrowDown||keyState.s?1:0)-(keyState.ArrowUp||keyState.w?1:0),mag=Math.hypot(vx,vy);if(mag>1){vx/=mag;vy/=mag}player.dx=vx;player.dy=vy;if(mag>.15){player.facingX=vx;player.facingY=vy}advanceSolid(player,vx*150*(1+.09*perkCount('speed'))*dt,vy*150*(1+.09*perkCount('speed'))*dt,12,room);if(transition())return;
if(room.activated&&isArena(r.current,r)&&room.enemies.length===0&&!room.cleared){room.arenaWave=(room.arenaWave||1)+1;if(room.arenaWave<=3){spawnReinforcement(room,room.arenaWave===2?3:4);if(room.arenaWave===3)room.enemies.push({...enemiesFor(r.current)[3],id:uid(),hp:160,max:160,x:180,y:105});player.inv=Math.max(player.inv,.7);msg(`⚠ ARÈNE : vague ${room.arenaWave}/3 !`)}else{room.cleared=true;room.chest='closed';r.earnedCredits+=pick(250,400);objective('arène');objective('arène-recherche-1');objective('arène-recherche-2');msg('🏆 VICTOIRE : coffre ÉPIQUE débloqué ! Approche du coffre et utilise ACTION.')}persist()}if(isBoss(r.current,r)&&room.spawned&&room.enemies.length===0&&!room.cleared){room.cleared=true;region().bossDefeated=true;data.unlockHelix=true;r.earnedCredits+=800;objective('boss-k17');objective('boss-recherche');msg('🏆 GARDIEN K-17 VAINCU ! HELIX DÉBLOQUÉ (future région).');persist()}if(!room.cleared&&room.spawned&&room.enemies.length===0&&!isArena(r.current,r)&&!isBoss(r.current,r)){room.cleared=true;if(room.kind!=='start'&&room.kind!=='outpost'){r.earnedCredits+=35;objective('combat-'+r.current)}msg('✓ Salle sécurisée : nouvelles portes ouvertes !');persist()}
if(room.enemies.length&&player.fire<=0){let target=room.enemies.reduce((a,b)=>length(player,a)<length(player,b)?a:b);let spread=mag>.15?(Math.random()-.5)*.46:(Math.random()-.5)*.09,ang=Math.atan2(target.y-player.y,target.x-player.x)+spread;bullets.push({x:player.x,y:player.y,vx:Math.cos(ang)*300,vy:Math.sin(ang)*300,enemy:false,dmg:damage()*(1+.10*perkCount('power')),ttl:1.5});player.fire=1/(r.equipped.rate*(1+.12*perkCount('rapid')))}
for(let e of room.enemies){let d=length(e,player),angle=Math.atan2(player.y-e.y,player.x-e.x);e.wind=e.wind||0;
if(e.wind>0){e.wind-=dt;if(e.wind<=0){if(e.type==='chaser'||e.type==='brute'){let reach=length(e,player);if(reach<(e.type==='brute'?125:115)&&Math.abs(Math.atan2(Math.sin(angle-e.aim),Math.cos(angle-e.aim)))<.48)hurt(e.type==='brute'?25:18)}else{let count=e.type==='sentinel'?3:1;for(let j=0;j<count;j++){let a=e.aim+(j-(count-1)/2)*.18;bullets.push({x:e.x,y:e.y,vx:Math.cos(a)*(e.type==='sentinel'?190:e.type==='drone'?215:175),vy:Math.sin(a)*(e.type==='sentinel'?190:e.type==='drone'?215:175),enemy:true,dmg:e.type==='sentinel'?22:e.type==='drone'?16:14,ttl:3})}}e.cd=e.type==='sentinel'?2.5:e.type==='drone'?1.45:e.type==='brute'?2.1:e.type==='ranged'?1.8:1.5}}
else{if(d>(e.type==='ranged'?140:e.type==='drone'?160:e.type==='sentinel'?155:e.type==='brute'?36:36)){advanceSolid(e,Math.cos(angle)*dt*(e.type==='sentinel'?32:e.type==='brute'?37:e.type==='drone'?67:e.type==='ranged'?47:80),Math.sin(angle)*dt*(e.type==='sentinel'?32:e.type==='brute'?37:e.type==='drone'?67:e.type==='ranged'?47:80),14,room)}e.cd-=dt;if(e.cd<=0&&d<(e.type==='chaser'?135:300)){e.aim=angle;e.wind=e.type==='chaser'?.8:e.type==='brute'?1.15:e.type==='sentinel'?1.2:e.type==='drone'?.6:.7}}
}

for(let b of bullets){
 let ox=b.x,oy=b.y,dx=b.vx*dt,dy=b.vy*dt;
 let steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/5));
 for(let i=0;i<steps;i++){
  b.x+=dx/steps;b.y+=dy/steps;
  if(collidesSolid(b.x,b.y,4,room)){b.ttl=0;break}
 }
 if(b.ttl<=0)continue;
 b.ttl-=dt;if(b.enemy){if(length(b,player)<16){hurt(b.dmg);b.ttl=0}}else{for(let e of room.enemies){if(length(b,e)<15){e.hp-=b.dmg;b.ttl=0;if(e.hp<=0&&!e.lootDropped){e.lootDropped=true;lootSpawn(room,'xp',e.x,e.y,null,pick(2,5));lootSpawn(room,'credits',e.x,e.y,null,pick(8,20));if(Math.random()<.1){lootSpawn(room,'weapon',e.x,e.y,makeWeapon(sectorOf(room)))}}break}}}}
room.enemies=room.enemies.filter(e=>e.hp>0);lootUpdate(room,dt);bullets=bullets.filter(b=>b.ttl>0&&b.x>-10&&b.x<370&&b.y>-10&&b.y<410);
if(r.exitStarted){let contested=room.enemies.some(e=>length(e,{x:180,y:195})<105);if(!contested)r.exitTime-=dt;if(r.exitWave===1&&r.exitTime<=6){r.exitWave=2;spawnReinforcement(room,2);msg('⚠ DEUXIÈME VAGUE : défends le terminal !')}if(r.exitTime<=0){finish(true);return}}
drawTime+=dt;if(drawTime>.12){drawTime=0;render()}tickSave+=dt;if(tickSave>4){tickSave=0;persist()}}
function down(e){if(!data.run||overlay)return;let rect=cv.getBoundingClientRect(),x=(e.clientX-rect.left)*360/rect.width,y=(e.clientY-rect.top)*400/rect.height;if(x>200||y<240)return;joy.pointer=e.pointerId;move(e);cv.setPointerCapture(e.pointerId)}
function move(e){if(e.pointerId!==joy.pointer)return;let rect=cv.getBoundingClientRect(),x=(e.clientX-rect.left)*360/rect.width,y=(e.clientY-rect.top)*400/rect.height,dx=x-75,dy=y-315,mag=Math.hypot(dx,dy);joy.x=mag>42?dx/mag:dx/42;joy.y=mag>42?dy/mag:dy/42}
function up(e){if(joy.pointer===e.pointerId){joy={x:0,y:0,pointer:null}}}
cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
window.addEventListener('keydown',e=>{if(e.target.tagName==='TEXTAREA')return;keyState[e.key]=true;if(e.key===' '){e.preventDefault();action()}});window.addEventListener('keyup',e=>keyState[e.key]=false);
document.addEventListener('visibilitychange',()=>{if(document.hidden){persist();if(data.run&&!overlay)openOverlay('pause')}});
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
if(data.run){runProgress();data.run.exitWave=data.run.exitWave||(data.run.exitStarted?1:0);setPlayer();if(isArena(data.run.current,data.run))enforceArena();else{let cr=data.run.rooms[data.run.current];if(cr&&cr.spawned&&!isBoss(data.run.current,data.run))autoSecure(cr)}if(!player||!data.run.rooms[data.run.current]){data.run=null;data.equipped=data.equipped||starter();msg('Ancienne expédition incompatible : refuge récupéré.')}else{openOverlay('pause');msg('Expédition retrouvée : appuie sur Reprendre.')}}
if(!data.equipped&&!data.run)data.equipped=starter();region();render();if(data.run?.pendingLevels>0)openLevelChoice();function frame(t){let dt=Math.min(.033,(t-last)/1000||.016);last=t;update(dt);if(data.run)draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();
