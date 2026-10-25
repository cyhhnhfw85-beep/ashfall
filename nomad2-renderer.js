/* ASHFALL Graphics P2 — visual-only compositing of the user-approved Nomade art.
 * Reads only supplied state. No physics, combat rules, RNG, DOM, or persistence.
 * Every asset is independent and can fall back to the original game.js renderer. */
(function(root){'use strict';
 const ROOT='assets/visual2/hero/';
 const HERO=['torso-front','torso-side','torso-back','leg-left','leg-right','pack'];
 const WEAPON_IDS=['carbine_k17','cendre','impulse','ion','nomade9','pistol_reinforced','pistol_rescue','pistol_used','precision','prototype','reliquat','rifle_industrial','rifle_recovery','smg_sector','spectre','vektor'];
 const images=Object.create(null),states=Object.create(null);
 let enabled=true;
 for(const key of HERO.map(x=>'hero:'+x).concat(WEAPON_IDS.map(x=>'weapon:'+x))){
  const image=new Image();image.decoding='async';states[key]='loading';
  image.onload=()=>states[key]='ready';image.onerror=()=>states[key]='failed';
  image.src=key.startsWith('hero:')?ROOT+key.slice(5)+'.png':'assets/weapons_framed/'+key.slice(7)+'.png';images[key]=image;
 }
 const ready=k=>states[k]==='ready'&&images[k]?.naturalWidth>0;
 const rarColor=r=>r==='Légendaire'?'#d6a15b':r==='Épique'?'#ad8bd5':r==='Rare'?'#70b9d4':r==='Inhabituel'?'#96bba9':'#767d80';
 const line=(ctx,a,b,c,w)=>{ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();};
 const drawItem=(ctx,id,x,y,w,h)=>ctx.drawImage(images['hero:'+id],x,y,w,h);
 function visualPose(o){
  const dx=Number(o.dx)||0,dy=Number(o.dy)||0,moving=Math.hypot(dx,dy)>.13;
  const fx=Number.isFinite(o.fx)?o.fx:1,fy=Number.isFinite(o.fy)?o.fy:0;
  let angle=moving?Math.atan2(dy,dx):Math.atan2(fy,fx);
  angle=Math.round(angle/(Math.PI/4))*(Math.PI/4);
  const torso=fy<-.46?'torso-back':Math.abs(fx)>.67?'torso-side':'torso-front';
  return {torso,flip:fx<0&&torso==='torso-side',angle,moving,fx,fy};
 }
 function draw(ctx,o){
  if(!enabled||!o||!o.weaponArtId)return false;
  const p=visualPose(o),w=o.weaponArtId;
  const armor=o.armor||null,boots=o.boots||null,bag=o.bag||null;
  const keys=['hero:'+p.torso,'hero:leg-left','hero:leg-right','weapon:'+w];
  if(bag)keys.push('hero:pack');
  // Return before touching the canvas if any required asset is still unavailable.
  if(keys.some(k=>!ready(k)))return false;
  const fx=p.fx,fy=p.fy,angle=Math.atan2(fy*.62,fx);
  const step=p.moving?Math.sin(o.time*10.8):0;
  const bob=p.moving?Math.abs(step)*.85:0;
  const vx=Math.cos(p.angle),vy=Math.sin(p.angle);
  const armorColor=rarColor(armor?.rar),bootColor=rarColor(boots?.rar),bagColor=rarColor(bag?.rar);
  const back=p.torso==='torso-back';
  const ray=(x,y)=>[x,y];
  ctx.save();
  try{
   // Actual hitbox remains centered at x,y and is never derived from these images.
   ctx.fillStyle='rgba(2,9,15,.45)';ctx.beginPath();ctx.ellipse(o.x,o.y+19,15.5,5.3,0,0,Math.PI*2);ctx.fill();
   ctx.translate(o.x,o.y-bob);
   // Eight motion orientations: independent legs swing around their hips.
   const lstep=p.moving?step*3.1:0;
   const lxd=vx*lstep,lyd=vy*lstep*.62;
   ctx.save();ctx.translate(-8,-3);ctx.rotate(p.moving?step*.065:0);
   drawItem(ctx,'leg-left',-10+lxd,-1+lyd,23,36);
   if(boots){line(ctx,[-6+lxd,27+lyd],[2+lxd,27+lyd],bootColor,1.4);line(ctx,[-6+lxd,12+lyd],[0+lxd,12+lyd],bootColor,.9);}
   ctx.restore();
   ctx.save();ctx.translate(7,-3);ctx.rotate(p.moving?-step*.065:0);
   drawItem(ctx,'leg-right',-11-lxd,-1-lyd,23,36);
   if(boots){line(ctx,[-4-lxd,27-lyd],[5-lxd,27-lyd],bootColor,1.4);line(ctx,[-3-lxd,12-lyd],[4-lxd,12-lyd],bootColor,.9);}
   ctx.restore();
   // Torso, waist and shoulder remain upright: no full-character planar rotation.
   // Backpack is its own layer, and only exists when the actual bag slot is filled.
   if(bag&&!back){
    ctx.save();ctx.globalAlpha=.83;drawItem(ctx,'pack',-17,-32,34,29);ctx.restore();
   }
   ctx.save();
   const lean=Math.max(-.045,Math.min(.045,Math.sin(angle)*.045));ctx.rotate(lean);
   if(p.flip){ctx.scale(-1,1);}
   if(back)drawItem(ctx,'torso-back',-19,-42,38,39);
   else if(p.torso==='torso-side')drawItem(ctx,'torso-side',-18.5,-40.5,37,37);
   else drawItem(ctx,'torso-front',-20.5,-39.5,41,36);
   ctx.restore();
   // Belt blends independent torso and legs; hand-drawn armor seams reflect actual gear.
   ctx.fillStyle='#2e3237';ctx.beginPath();ctx.moveTo(-10,-6);ctx.lineTo(10,-6);ctx.lineTo(7,-2);ctx.lineTo(-7,-2);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#8b745a';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(-5,-5);ctx.lineTo(5,-5);ctx.stroke();
   ctx.fillStyle='#a68b66';ctx.fillRect(-1.5,-5.2,3,2);
   if(armor){
    ctx.strokeStyle=armorColor;ctx.lineWidth=1.4;ctx.globalAlpha=.9;
    ctx.beginPath();ctx.moveTo(-13,-22);ctx.lineTo(-17,-18);ctx.moveTo(12,-22);ctx.lineTo(17,-18);ctx.stroke();
    ctx.globalAlpha=1;
    if(armor.model==='armor-bastion'||armor.model==='helmet-guard'){
     ctx.fillStyle='#343f4b';ctx.fillRect(-10,-15,20,4);ctx.strokeStyle=armorColor;ctx.strokeRect(-10,-15,20,4);
    }else if(armor.model==='armor-regenerator'||armor.model==='helmet-vital'){
     ctx.fillStyle='#6ea88e';ctx.fillRect(-1.5,-15,3,6);ctx.fillRect(-3,-13.5,6,3);
    }else if(armor.model==='armor-predator'){
     line(ctx,[-4,-10],[0,-14],armorColor,1.3);line(ctx,[1,-10],[5,-14],armorColor,1.3);
    }
   }
   if(back&&bag){
    // Distinct visible bag only when equipped; covers the back plate.
    drawItem(ctx,'pack',-17,-35,34,35);
    ctx.strokeStyle=bagColor;ctx.lineWidth=1.2;ctx.strokeRect(-8,-23,16,13);
   }
   if(bag&&bag.model==='bag-securizer'){
    ctx.strokeStyle='#79bfc5';ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(back?0:(fx>0?-12:12),-15,3,0,Math.PI*2);ctx.stroke();
   }
   // Arm/weapon subassembly rotates CONTINUOUSLY, independently from leg directions.
   // Gun comes from the *actual equipped weapon's existing transparent PNG*.
   const short=/^(pistol_)/.test(w)||w==='nomade9'||w==='spectre'||w==='vektor';
   const sizeW=short?26:36,sizeH=short?16:22;
   const handX=fx*7,handY=-15+fy*.62*5;
   const upperBehind=fy<-.32;
   const weaponAndHands=()=>{
    ctx.save();ctx.translate(handX,handY);ctx.rotate(angle);
    // Uniform dark tactical gloves follow the gun, rather than being baked into a single pose.
    ctx.strokeStyle='#202c34';ctx.lineWidth=5.4;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-7,9);ctx.lineTo(-2,2);ctx.moveTo(6,10);ctx.lineTo(12,1);ctx.stroke();
    ctx.drawImage(images['weapon:'+w],-sizeW*.36,-sizeH*.53,sizeW,sizeH);
    ctx.fillStyle='#323d43';ctx.strokeStyle='#8b745a';ctx.lineWidth=.8;
    for(const [hx,hy] of [[0,3],[sizeW*.16,2]]){ctx.beginPath();ctx.ellipse(hx,hy,2.9,2.2,.25,0,Math.PI*2);ctx.fill();ctx.stroke();}
    ctx.restore();
   };
   // Visual gun layered in front or behind the hood depending on real aim.
   // Hood is already inside torso image; for northward aim reduce front occlusion.
   if(upperBehind){ctx.globalAlpha=.93;weaponAndHands();ctx.globalAlpha=1;}
   else weaponAndHands();
   // E2 electronic ornaments are tied to their equipped items, no permanent fake shield.
   if(o.module?.model==='module-tesla'){
    ctx.fillStyle='#64a9b5';ctx.fillRect(-10,-16,2.3,4);
   }else if(o.module?.model==='module-aegis'&&o.shieldReady){
    ctx.fillStyle='#7ab9c4';ctx.beginPath();ctx.arc(-10,-16,1.9,0,Math.PI*2);ctx.fill();
   }else if(o.module?.model==='module-medic'){
    ctx.fillStyle='#709d84';ctx.fillRect(-11,-16,3,3);
   }
   if(o.artifact){ctx.fillStyle=rarColor(o.artifact.rar);ctx.fillRect(7,-10,2.1,2.1);}
   // Existing game damage blink / particle VFX are preserved in game.js.
   return true;
  }finally{ctx.restore();}
 }
 root.AshNomad2=Object.freeze({draw,visualPose,status:()=>({...states}),setEnabled:v=>{enabled=!!v;},isEnabled:()=>enabled});
})(window);
