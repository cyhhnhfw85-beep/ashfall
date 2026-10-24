/* ASHFALL Équipements 2.0 — isolé du moteur historique (aucune dépendance DOM).
   Les règles legacy restent pilotées par game.js tant qu'une ancienne expédition est active. */
(function(root){'use strict';
 const SLOTS=['weapon','armor','boots','module','bag','artifact'];
 const WEIGHTS=[['weapon',54],['armor',13],['boots',10],['module',10],['bag',9],['artifact',4]];
 const LEVEL_BONUS=[0,1,2,3];
 const CATALOG=[
  {id:'armor-bastion',slot:'armor',name:'Bastion',effect:'resist',base:.055,desc:'Réduit les dégâts subis'},
  {id:'armor-predator',slot:'armor',name:'Prédateur',effect:'killDamage',base:.055,desc:'Dégâts accrus après élimination'},
  {id:'armor-regenerator',slot:'armor',name:'Régénérateur',effect:'regen',base:.28,desc:'Régénération hors pression'},
  {id:'boots-scout',slot:'boots',name:'Éclaireur',effect:'speed',base:.055,desc:'Accélère les déplacements'},
  {id:'boots-spectre',slot:'boots',name:'Spectre',effect:'killSpeed',base:.10,desc:'Accélération après élimination'},
  {id:'boots-anchor',slot:'boots',name:'Ancrage',effect:'resist',base:.025,desc:'Stabilité : réduit légèrement les dégâts subis'},
  {id:'module-tesla',slot:'module',name:'Tesla',effect:'tesla',base:8,desc:'Impulsion électrique automatique'},
  {id:'module-aegis',slot:'module',name:'Égide',effect:'shield',base:10,desc:'Bouclier périodique automatique'},
  {id:'module-medic',slot:'module',name:'Médic',effect:'medic',base:8,desc:'Soin conditionnel automatique'},
  {id:'bag-prospector',slot:'bag',name:'Prospecteur',effect:'credits',base:.02,desc:'Petit bonus de crédits extraits'},
  {id:'bag-reclaimer',slot:'bag',name:'Récupérateur',effect:'components',base:1,desc:'Composant bonus à l’extraction longue'},
  {id:'bag-securizer',slot:'bag',name:'Sécurisateur',effect:'secure',base:1,desc:'Sécurise un objet après des salles nettoyées'},
  {id:'artifact-resonance',slot:'artifact',name:'Résonance',effect:'resonance',base:.13,desc:'Renforce les impulsions électriques'},
  {id:'artifact-vitality',slot:'artifact',name:'Vitalité',effect:'healing',base:.10,desc:'Amplifie les soins'},
  {id:'artifact-frenzy',slot:'artifact',name:'Frénésie',effect:'frenzy',base:.045,desc:'Renforce les enchaînements offensifs'}
 ];
 const LEGACY=[
  {id:'helmet-scout',slot:'boots',name:'Éclaireur héritage',effect:'speed',base:.06},
  {id:'helmet-guard',slot:'armor',name:'Bastion héritage',effect:'resist',base:.10},
  {id:'helmet-vital',slot:'armor',name:'Endurance héritage',effect:'maxHp',base:20},
  {id:'module-rate',slot:'module',name:'Stabilisateur de tir',effect:'rate',base:.08},
  {id:'module-power',slot:'module',name:'Amplificateur balistique',effect:'damage',base:.06},
  {id:'module-xp',slot:'module',name:'Analyseur tactique',effect:'xp',base:.12}
 ];
 const CATALOG_ALL=[...CATALOG,...LEGACY];
 const RANK={Commun:0,Inhabituel:1,Rare:2,'Épique':3,'Légendaire':4,Mythique:5};
 const SAFE_ID=s=>String(s||'').replace(/[^a-zA-Z0-9-_]/g,'').slice(0,120);
 const copy=x=>JSON.parse(JSON.stringify(x));
 const ids=()=>('e2-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12));
 const model=x=>CATALOG_ALL.find(m=>m.id===x?.model)||null;
 const rarity=x=>RANK[x?.rar]??0;
 const emptySlots=()=>Object.fromEntries(SLOTS.map(k=>[k,null]));
 const hasStats=x=>x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.slot==='string'&&SLOTS.includes(x.slot);
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const rarityFactor=x=>1+.12*Math.max(0,rarity(x)-1)+.09*Math.max(0,(x.level||1)-1);
 const buff=x=>{const m=model(x);if(!m)return {};return {[m.effect]:(m.base||0)*(x.origin==='legacy-conversion'?1:rarityFactor(x))*(1+.075*clamp(x.upgrade||0,0,5))*(x.optimized==='efficiency'?1.08:1)*(clamp(Number(x.quality)||100,94,106)/100)};};
 function normalizeWeapon(w){if(!w||typeof w!=='object')return null;return {...w,slot:'weapon',model:w.model||'weapon-legacy',level:clamp(Number(w.level)||1,1,4),upgrade:clamp(Number(w.upgrade)||0,0,5),optimized:w.optimized||null,investedComponents:Number(w.investedComponents)||0};}
 function eq2State(d){return d.eq2&&d.eq2.schema===2?d.eq2:null;}
 function gearItems(d){return eq2State(d)?.gear||[];}
 function owned(d){return [d.equipped,...(d.stash||[]),...gearItems(d)].filter(Boolean).map(w=>(!w.slot||w.slot==='weapon')?normalizeWeapon(w):w);}
 function validate(d){const s=eq2State(d);if(!s)return false;
  const items=owned(d);const allIds=items.map(x=>x.id);
  if(new Set(allIds).size!==allIds.length)return false;
  if(items.some(x=>!hasStats(x)))return false;
  if(Object.keys(s.slots||{}).some(k=>!SLOTS.includes(k)))return false;
  for(const [k,id] of Object.entries(s.slots||{})){if(id&&!items.some(x=>x.id===id&&x.slot===k))return false;}
  return Number.isSafeInteger(s.components)&&s.components>=0;
 }
 // La migration produit un NOUVEL objet; game.js n'écrit le résultat qu'après backup et validation.
 function migrate(d){if(eq2State(d))return copy(d);
  if(d.run)throw Error('legacy run cannot be migrated in place');
  const out=copy(d),legacy=out.loadout&&typeof out.loadout==='object'?out.loadout:{};
  const list=Array.isArray(legacy.owned)?[...new Set(legacy.owned)]:[];
  const gear=[];const keyToId=new Map();
  for(const key of list){const m=LEGACY.find(x=>x.id===key);if(!m)continue;const existing={id:ids(),slot:m.slot,model:m.id,name:m.name,rar:key==='helmet-guard'||key==='module-power'?'Épique':'Rare',level:1,upgrade:0,optimized:null,investedComponents:0,origin:'legacy-conversion',purchasePrice:0};gear.push(existing);keyToId.set(key,existing.id);}
  const slots=emptySlots();slots.weapon=out.equipped?.id||null;
  for(const key of [legacy.helmet,legacy.module]){const obj=gear.find(x=>x.id===keyToId.get(key));if(obj)slots[obj.slot]=obj.id;}
  let insuredComp=0;
  if(out.insured&&out.equipped?.id===out.insured){insuredComp=Math.max(20,Math.ceil((Math.max(20,Math.round((Number(out.equipped.dmg)||0)*17*(out.equipped.rar==='Épique'?2.3:out.equipped.rar==='Rare'?1.5:1))))*.12));out.credits+=insuredComp;}
  out.insured=null;
  out.eq2={schema:2,slots,gear,components:0,insuranceCompensation:{activeItemId:insuredComp?slots.weapon:null,credits:insuredComp,applied:true},migrationId:'eq2-v1',migratedAt:Date.now()};
  if(!validate(out))throw Error('post migration integrity check failed');
  return out;
 }
 function generate(slot,sector=0,rng=Math.random){
  if(!SLOTS.includes(slot))throw Error('unknown equipment slot');
  if(slot==='weapon')throw Error('weapons generated by legacy weapon engine');
  const list=CATALOG.filter(m=>m.slot===slot);const m=list[Math.floor(rng()*list.length)];
  const roll=rng();let rar=roll<.075?'Épique':roll<.32?'Rare':'Commun';
  if(slot==='artifact')rar=roll<.07?'Légendaire':roll<.4?'Épique':'Rare';
  const level=clamp(Math.floor(sector)+1,1,4);
  const statVariance=Math.round((rng()-.5)*12);
  return {id:ids(),slot,model:m.id,name:m.name,rar,level,upgrade:0,optimized:null,investedComponents:0,origin:'expedition',quality:clamp(100+statVariance,94,106),stats:{efficiency:clamp(100+statVariance,94,106),resilience:clamp(2+level+Math.floor(rng()*4),2,10),agility:clamp(1+Math.floor(rng()*4),1,5)}};
 }
 function rollDrop(sector,rng=Math.random){const n=rng()*100;let sum=0,slot='weapon';for(const [k,w] of WEIGHTS){sum+=w;if(n<sum){slot=k;break}}
  return slot==='weapon'?null:generate(slot,sector,rng);
 }
 function start(d,run){const s=eq2State(d);if(!s||!validate(d))throw Error('requires valid migrated save');
  const startOwned=SLOTS.map(slot=>owned(d).find(w=>w.id===s.slots[slot]&&w.slot===slot)).filter(Boolean).map(copy);
  const slots=copy(s.slots);run.eq2={version:1,slots,startingSlots:copy(slots),startingOwned:startOwned,loot:[],clearedIds:[],secure:{itemId:null,transfers:0,abandoned:false,activated:false},fx:{shieldReady:true,shieldCooldown:0,healCooldown:0,teslaCooldown:9,killWindow:0,regenCooldown:0},pendingDrop:null};
  if(!validateRun(run))throw Error('invalid run at startup');return run;
 }
 function validateRun(run){if(!run?.eq2)return false;const s=run.eq2;
  if(!Array.isArray(s.loot)||s.loot.length>8||new Set(s.loot.map(x=>x.id)).size!==s.loot.length)return false;
  if(s.loot.some(x=>!hasStats(x)))return false;
  const pool=[...s.startingOwned,...s.loot];if(new Set(pool.map(x=>x.id)).size!==pool.length)return false;
  if(SLOTS.some(slot=>s.slots[slot]&&!pool.some(x=>x.id===s.slots[slot]&&x.slot===slot)))return false;
  const id=s.secure.itemId;if(id&&!s.loot.some(x=>x.id===id))return false;
  if(s.secure.transfers>1||s.secure.transfers<0)return false;
  return true;
 }
 function runItem(run,id){const s=run?.eq2;return s?[...s.startingOwned,...s.loot].find(x=>x.id===id):null;}
 function active(run,slot){return runItem(run,run?.eq2?.slots?.[slot]);}
 function current(d,slot){return owned(d).find(x=>x.id===d.eq2?.slots?.[slot]&&x.slot===slot)||null;}
 function profile(run){const out={maxHp:0,speed:0,resist:0,rate:0,damage:0,xp:0,regen:0,killDamage:0,killSpeed:0,slowResist:0,credits:0,components:0,tesla:0,shield:0,medic:0,resonance:0,healing:0,frenzy:0,secure:0};
  for(const slot of SLOTS.slice(1)){const w=active(run,slot);if(!w)continue;for(const [k,v] of Object.entries(buff(w)))out[k]+=(v||0);if(w.stats){out.maxHp+=(Number(w.stats.resilience)||0)*(w.optimized==='resilience'?1.08:1);if(slot==='boots')out.speed+=(Number(w.stats.agility)||0)*(w.optimized==='agility'?1.08:1)*.002;}}
  for(const k of ['damage','resist','rate','speed','credits'])out[k]=Math.min(out[k],.22);
  return out;
 }
 function canEquip(run,itemId){if(!run?.eq2)return false;const room=run.rooms?.[run.current];return !!(room&&room.cleared&&(!room.enemies||!room.enemies.length)&&runItem(run,itemId));}
 function equip(run,itemId){if(!canEquip(run,itemId))return false;const w=runItem(run,itemId);if(w.slot==='bag'&&run.eq2.secure.itemId&&run.eq2.slots.bag!==w.id)return false;run.eq2.slots[w.slot]=w.id;if(!validateRun(run))throw Error('equip integrity');return true;}
 function canPickup(run,item){return !!(run?.eq2&&hasStats(item)&&!run.eq2.loot.some(x=>x.id===item.id)&&run.eq2.loot.length<8);}
 function pickup(run,item){if(!canPickup(run,item))return false;run.eq2.loot.push(item.slot==='weapon'?normalizeWeapon(item):copy(item));if(!validateRun(run)){run.eq2.loot.pop();return false;}return true;}
 function clearRoom(run,id){if(!run?.eq2)return;const s=run.eq2;const bag=active(run,'bag');if(bag?.model!=='bag-securizer')return;if(!s.clearedIds.includes(id))s.clearedIds.push(id);const threshold=bag?.model==='bag-securizer'?({Commun:8,Rare:7,'Épique':6,'Légendaire':5}[bag.rar]||8):Infinity;
  if(s.clearedIds.length>=threshold&&!s.secure.abandoned)s.secure.activated=true;
 }
 function secure(run,itemId){const s=run?.eq2;if(!s||!s.secure.activated||s.secure.abandoned||s.secure.itemId)return false;if(active(run,'bag')?.model!=='bag-securizer')return false;if(!s.loot.some(x=>x.id===itemId))return false;s.secure.itemId=itemId;return true;}
 function transfer(run,itemId){const s=run?.eq2;if(!s||!s.secure.itemId||s.secure.transfers!==0||s.secure.abandoned||!s.loot.some(x=>x.id===itemId)||s.secure.itemId===itemId)return false;s.secure.itemId=itemId;s.secure.transfers=1;return true;}
 function renounce(run){const s=run?.eq2;if(!s||!s.secure.itemId)return false;s.secure.itemId=null;s.secure.abandoned=true;return true;}
 function drop(run,itemId){const s=run?.eq2;if(!s||s.secure.itemId===itemId)return null;const i=s.loot.findIndex(x=>x.id===itemId);if(i<0)return null;const previous=copy(s.slots);const [item]=s.loot.splice(i,1);
  if(s.slots[item.slot]===item.id)s.slots[item.slot]=s.startingSlots[item.slot]||null;
  if(!validateRun(run)){s.loot.splice(i,0,item);s.slots=previous;return null;}return item;
 }
 function finalize(d,run,won){if(!run?.eq2)throw Error('missing equipment 2 run');if(!validateRun(run))throw Error('run integrity before finish');
  const s=run.eq2,acquired=won?s.loot.slice():s.loot.filter(w=>w.id===s.secure.itemId),lost=s.loot.filter(w=>!acquired.some(a=>a.id===w.id));
  const out=copy(d),curr=eq2State(out);if(!curr)throw Error('missing home state');
  if(!out.equipped)out.equipped=copy(s.startingOwned.find(w=>w.slot==='weapon')||null);
  const existingIds=new Set(owned(out).map(w=>w.id));for(const w of acquired){if(existingIds.has(w.id))throw Error('acquired item duplication');existingIds.add(w.id);if(w.slot==='weapon')out.stash.push(copy(w));else curr.gear.push(copy(w));}
  const selected=won?s.slots:s.startingSlots;
  const desired=copy(selected);
  for(const slot of SLOTS){if(desired[slot]&&!owned(out).some(w=>w.id===desired[slot]&&w.slot===slot))desired[slot]=s.startingSlots[slot]||null;}
  const activeWeapon=owned(out).find(w=>w.id===desired.weapon)||out.equipped;
  if(activeWeapon&&out.equipped?.id!==activeWeapon.id){out.stash=out.stash.filter(w=>w.id!==activeWeapon.id);if(out.equipped)out.stash.push(out.equipped);out.equipped=activeWeapon;}
  curr.slots=desired;
  const prospector=active(run,'bag')?.model==='bag-prospector'&&won;
  const gatherer=active(run,'bag')?.model==='bag-reclaimer'&&won;
  const creditsBonus=prospector?Math.min(80,Math.floor((run.earnedCredits||0)*.02)):0;
  const compsBonus=gatherer&&new Set(run.visited||[]).size>=15?1:0;
  curr.components+=compsBonus;
  if(!validate(out))throw Error('post extraction integrity');
  return {state:out,acquired,lost,creditsBonus,componentsBonus:compsBonus};
 }
 function rarityYield(w){const base={Commun:1,Inhabituel:1,Rare:2,'Épique':3,'Légendaire':5,Mythique:6}[w.rar]||1;return base+Math.max(0,(w.level||1)-1);}
 function upgradeCost(w){const n=w.upgrade||0;if(n>=5)return null;return {credits:70*(n+1)*(w.level||1),components:2+n+Math.max(0,(w.level||1)-1)};}
 function optimizeCost(w){return {credits:120*(w.level||1),components:4+(w.level||1)};}
 function applyUpgrade(d,id){const item=owned(d).find(x=>x.id===id);if(!item||!eq2State(d))return false;const cost=upgradeCost(item);if(!cost||d.credits<cost.credits||d.eq2.components<cost.components)return false;
  d.credits-=cost.credits;d.eq2.components-=cost.components;
  const target=item.slot==='weapon'?[d.equipped,...d.stash].find(x=>x?.id===id):d.eq2.gear.find(x=>x.id===id);
  target.upgrade=(target.upgrade||0)+1;target.investedComponents=(target.investedComponents||0)+cost.components;
  return true;
 }
 function applyOptimize(d,id,stat){const item=owned(d).find(x=>x.id===id);const allowed=item?.slot==='weapon'?['dmg','rate']:['efficiency','resilience','agility'];if(!allowed.includes(stat)||!eq2State(d))return false;const cost=optimizeCost(item);if(d.credits<cost.credits||d.eq2.components<cost.components)return false;
  const target=item.slot==='weapon'?[d.equipped,...d.stash].find(x=>x?.id===id):d.eq2.gear.find(x=>x.id===id);
  d.credits-=cost.credits;d.eq2.components-=cost.components;target.optimized=stat;return true;
 }
 function recycle(d,id){if(!eq2State(d)||id===d.eq2.slots.weapon||Object.values(d.eq2.slots).includes(id))return null;
  let pool,index,w;const idx=(d.stash||[]).findIndex(x=>x.id===id);
  if(idx>=0){pool=d.stash;index=idx;w=pool[idx];}else{pool=d.eq2.gear;index=pool.findIndex(x=>x.id===id);if(index<0)return null;w=pool[index];}
  const gain=rarityYield(w)+Math.floor((Number(w.investedComponents)||0)*.5);
  pool.splice(index,1);d.eq2.components+=gain;return gain;
 }
 function sell(d,id,weaponPrice){if(!eq2State(d)||Object.values(d.eq2.slots).includes(id))return null;
  let pool=(d.stash||[]),index=pool.findIndex(x=>x.id===id);let w;if(index>=0)w=pool[index];else{pool=d.eq2.gear;index=pool.findIndex(x=>x.id===id);if(index<0)return null;w=pool[index]}
  const gain=w.slot==='weapon'?weaponPrice(w):Math.min(220,Math.max(12,15*rarityYield(w)));
  pool.splice(index,1);d.credits+=gain;return gain;
 }
 root.AshEquipment2=Object.freeze({SLOTS,CATALOG,LEGACY,CATALOG_ALL,WEIGHTS,emptySlots,model,owned,gearItems,current,migrate,validate,start,validateRun,runItem,active,profile,generate,rollDrop,canEquip,equip,pickup,canPickup,clearRoom,secure,transfer,renounce,drop,finalize,rarityYield,upgradeCost,optimizeCost,applyUpgrade,applyOptimize,recycle,sell,normalizeWeapon});
})(typeof window!=='undefined'?window:globalThis);
