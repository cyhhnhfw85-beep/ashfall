/* ASHFALL Immersion add-on v0.8.9.65: non-invasive, compatible with existing game.js */
(()=>{'use strict';
const stage=document.getElementById('stage'),canvas=document.getElementById('canvas'),log=document.getElementById('log');
if(!stage||!canvas||!log)return;
const store='ashfall_immersion_preferences_v1';
let prefs={sound:false,particles:true,reduced:false};try{prefs={...prefs,...JSON.parse(localStorage.getItem(store)||'{}')}}catch(_){}
function save(){try{localStorage.setItem(store,JSON.stringify(prefs))}catch(_){}}
const panel=document.createElement('div');panel.id='immersion-panel';panel.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:5px;flex-wrap:wrap;padding:6px 8px;background:#101e2b;border:1px solid #355362;border-radius:9px;margin:7px 0;color:#cfe5e8;font:11px system-ui,sans-serif';
const label=document.createElement('span');label.textContent='✨ Immersion';label.style.cssText='font-weight:700;letter-spacing:.04em';panel.append(label);
const buttons={};for(const [key,title] of [['sound','Son'],['particles','Effets'],['reduced','Réduit']]){const b=document.createElement('button');b.type='button';b.style.cssText='padding:7px 9px;min-height:32px;font-size:11px;background:#203849;color:#dbecef;border:1px solid #456271;border-radius:8px;touch-action:manipulation';b.addEventListener('click',()=>{prefs[key]=!prefs[key];if(key==='reduced'&&prefs.reduced)prefs.particles=false;save();refresh();if(key==='sound'&&prefs.sound)tone(560,.075,'sine',.05)});buttons[key]=b;panel.append(b)}
function refresh(){window.__ashfallFxPreferences=prefs;for(const [k,b] of Object.entries(buttons)){b.textContent=(k==='reduced'?'Effets réduits':k==='particles'?'Particules':'Son')+' '+(prefs[k]?'✓':'✕');b.style.borderColor=prefs[k]?'#59baa6':'#456271'}}refresh();stage.insertAdjacentElement('afterend',panel);
const fx=document.createElement('canvas');fx.setAttribute('aria-hidden','true');fx.width=360;fx.height=400;fx.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;image-rendering:pixelated';
const wrapper=document.createElement('div');wrapper.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1';stage.append(wrapper);wrapper.append(fx);const g=fx.getContext('2d');
let context=null;function tone(freq,dur,type='triangle',vol=.035){if(!prefs.sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;context=context||new AC();if(context.state==='suspended')context.resume();const o=context.createOscillator(),v=context.createGain();o.type=type;o.frequency.setValueAtTime(freq,context.currentTime);v.gain.setValueAtTime(vol,context.currentTime);v.gain.exponentialRampToValueAtTime(.001,context.currentTime+dur);o.connect(v);v.connect(context.destination);o.start();o.stop(context.currentTime+dur)}catch(_){}}
let fxSeed=0x1cbf5e83;function fxRandom(){fxSeed^=fxSeed<<13;fxSeed^=fxSeed>>>17;fxSeed^=fxSeed<<5;return (fxSeed>>>0)/4294967296;}
let flecks=[];function burst(color,count,where='center'){if(!prefs.particles||prefs.reduced)return;const x=where==='top'?180:180,y=where==='top'?52:205;for(let i=0;i<count&&flecks.length<55;i++){const a=fxRandom()*Math.PI*2,v=25+fxRandom()*65;flecks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,ttl:.45+fxRandom()*.32,life:.8,c:color})}}
function react(message){if(/ramass|crédits|coffre ouvert|butin|épique|légendaire|mythique/i.test(message)){tone(660,.08,'triangle');burst('#ffca72',12)}else if(/salle sécurisée|VICTOIRE|VAINCU|EXTRACTION !/i.test(message)){tone(490,.13);setTimeout(()=>tone(730,.16),95);burst('#69efd0',20)}else if(/portes scellées|BOSS|ARÈNE/i.test(message)){tone(180,.22,'sawtooth',.025);burst('#fb747a',12,'top')}else if(/niveau|amélioration|AVANT-POSTE/i.test(message)){tone(810,.15);burst('#8fd8fc',13)}}
let lastMessage=log.textContent||'';const observer=new MutationObserver(()=>{const t=log.textContent||'';if(t&&t!==lastMessage){lastMessage=t;react(t)}});observer.observe(log,{subtree:true,childList:true,characterData:true});
let lastShotSound=0;
window.addEventListener('ashfall-fx',e=>{const d=e.detail||{};
 if(d.kind==='shot'){
  if(prefs.sound){const now=performance.now();if(now-lastShotSound>95){lastShotSound=now;
   const presets={pistol:[250,.070,'triangle',.025],smg:[215,.042,'square',.009],rifle:[188,.078,'triangle',.022],precision:[135,.13,'sawtooth',.018],energy:[540,.087,'sine',.024]};
   const a=presets[d.weapon]||presets.rifle;tone(...a);
  }}return;
 }
 if(d.kind==='enemy-shot'){if(prefs.sound&&fxRandom()<.33)tone(170,.04,'square',.006);return;}
 if(!Number.isFinite(d.x)||!Number.isFinite(d.y))return;if(d.kind==='damage')tone(190,.095,'sawtooth',.028);else if(d.kind==='death')tone(95,.18,'triangle',.028);else if(d.kind==='impact')tone(270,.035,'square',.012);if(!prefs.particles||prefs.reduced)return;const colors={damage:'#ff8d82',impact:'#f7d49a',death:'#ba8fff'},c=colors[d.kind]||'#b3ebed';const n=d.kind==='death'?18:d.kind==='damage'?12:5;for(let i=0;i<n&&flecks.length<70;i++){let a=fxRandom()*Math.PI*2,v=35+fxRandom()*88;const cam=window.__ashfallCamera||{x:0,y:0,zoom:1};flecks.push({x:(d.x-cam.x)*cam.zoom,y:(d.y-cam.y)*cam.zoom,vx:Math.cos(a)*v,vy:Math.sin(a)*v,ttl:.25+fxRandom()*.3,life:.55,c})}});
let last=0;function frame(t){const dt=Math.min(.05,(t-last)/1000||.016);last=t;g.clearRect(0,0,360,400);if(!prefs.reduced&&prefs.particles&&!document.getElementById('game').hidden){const tm=t*.001;g.globalAlpha=.065+Math.sin(tm*1.8)*.015;g.fillStyle='#9acbe1';g.fillRect(23,23,4,352);g.fillRect(333,23,4,352);g.globalAlpha=1;}if(prefs.particles&&!prefs.reduced){flecks=flecks.filter(p=>p.ttl>0);for(const p of flecks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=75*dt;p.ttl-=dt;g.globalAlpha=Math.max(0,p.ttl/p.life);g.fillStyle=p.c;g.fillRect(Math.round(p.x),Math.round(p.y),3,3)}g.globalAlpha=1}else flecks=[];requestAnimationFrame(frame)}requestAnimationFrame(frame);
// Sound is opt-in; browser autoplay rules respected. Never touch player inventory, collision, run state or save key.
})();
