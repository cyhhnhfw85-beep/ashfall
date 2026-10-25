/* ASHFALL Graphics P2.3 — hood and conditional pack precision corrections.
 * Strictly visual: no gameplay, physics, combat rules, DOM persistence or balance edits.
 * Keeps drawNomadGameplay() available as fallback through the existing game hook.
 */
(function(root){'use strict';
 const ROOT='assets/visual2/hero/';
 const HERO=['torso-front','torso-side','torso-back','leg-left','leg-right','pack','pack-side'];
 const WEAPON_IDS=['carbine_k17','cendre','impulse','ion','nomade9','pistol_reinforced','pistol_rescue','pistol_used','precision','prototype','reliquat','rifle_industrial','rifle_recovery','smg_sector','spectre','vektor'];
 const images=Object.create(null),states=Object.create(null),tintCache=Object.create(null);
 let enabled=true;

 const heroKeys=HERO.map(x=>'hero:'+x);
 const weaponKeys=WEAPON_IDS.map(x=>'weapon:'+x);
 for(const key of heroKeys.concat(weaponKeys)){
  const image=new Image();
  image.decoding='async';
  states[key]='loading';
  image.onload=()=>states[key]='ready';
  image.onerror=()=>states[key]='failed';
  image.src=key.startsWith('hero:')?ROOT+key.slice(5)+'.png':'assets/weapons_framed/'+key.slice(7)+'.png';
  images[key]=image;
 }
 const ready=k=>states[k]==='ready'&&images[k]?.naturalWidth>0;
 const rarColor=r=>r==='Légendaire'?'#d6a15b':r==='Épique'?'#ad8bd5':r==='Rare'?'#70b9d4':r==='Inhabituel'?'#96bba9':'#767d80';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const line=(ctx,a,b,c,w,alpha)=>{ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();ctx.restore();};

 function tintedCanvas(key,color){
  const id=key+'|'+color;
  if(tintCache[id]) return tintCache[id];
  if(!ready(key)) return null;
  const src=images[key];
  const c=document.createElement('canvas');
  c.width=src.naturalWidth; c.height=src.naturalHeight;
  const cx=c.getContext('2d');
  cx.drawImage(src,0,0);
  cx.globalCompositeOperation='source-in';
  cx.fillStyle=color;
  cx.fillRect(0,0,c.width,c.height);
  tintCache[id]=c;
  return c;
 }

 function drawSprite(ctx,key,x,y,w,h,opts){
  opts=opts||{};
  const img=images[key];
  if(!img) return;
  const outline=tintedCanvas(key,opts.outlineColor||'rgba(8,14,18,0.96)');
  if(outline){
   const radius=opts.outlineRadius==null?1.2:opts.outlineRadius;
   const outlineAlpha=opts.outlineAlpha==null?.26:opts.outlineAlpha;
   const offsets=[[-radius,0],[radius,0],[0,-radius],[0,radius],[-radius*.75,-radius*.75],[radius*.75,-radius*.75],[-radius*.75,radius*.75],[radius*.75,radius*.75]];
   ctx.save();ctx.globalAlpha=outlineAlpha;
   for(const [ox,oy] of offsets){ctx.drawImage(outline,x+ox,y+oy,w,h);} 
   ctx.restore();
  }
  ctx.drawImage(img,x,y,w,h);
 }

 function visualPose(o){
  const dx=Number(o.dx)||0,dy=Number(o.dy)||0,moving=Math.hypot(dx,dy)>.13;
  const fx=Number.isFinite(o.fx)?o.fx:1,fy=Number.isFinite(o.fy)?o.fy:0;
  const moveAngle=moving?Math.atan2(dy,dx):Math.atan2(fy,fx);
  const stepAngle=Math.round(moveAngle/(Math.PI/4))*(Math.PI/4);
  const absX=Math.abs(fx),absY=Math.abs(fy);
  let torso='torso-front';
  if(fy<-.58&&absY>=absX*.72) torso='torso-back';
  else if(absX>.76&&absX>=absY*.72) torso='torso-side';
  return {torso,flip:fx<0&&torso==='torso-side',moving,fx,fy,aimAngle:Math.atan2(fy*.66,fx||0.001),moveAngle:stepAngle};
 }

 function drawPeekPack(ctx,fx){
  const key='hero:pack-side';
  if(!ready(key)) return;
  ctx.save();
  if(fx<0) ctx.scale(-1,1);
  ctx.globalAlpha=.56;
  ctx.beginPath();
  ctx.rect(-24.2,-27.3,15.1,19.0);
  ctx.clip();
  drawSprite(ctx,key,-23.5,-32.2,19.2,31.8,{outlineAlpha:.12,outlineRadius:.9});
  ctx.restore();
 }

 function drawSidePack(ctx,flip){
  const key='hero:pack-side';
  if(!ready(key)) return;
  ctx.save();
  if(flip) ctx.scale(-1,1);
  drawSprite(ctx,key,-16.2,-32.2,19.2,31.8,{outlineAlpha:.14,outlineRadius:1.0});
  ctx.restore();
 }

 // Front backpack edge is a genuine attachment, not a floating accessory.
 function drawFrontPackStrap(ctx,flip){
  ctx.save();
  if(flip) ctx.scale(-1,1);
  ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-21.0,-22.2);ctx.quadraticCurveTo(-17.8,-23.4,-12.5,-17.3);
  ctx.lineWidth=3;ctx.strokeStyle='rgba(18,23,28,.96)';ctx.stroke();
  ctx.beginPath();ctx.moveTo(-21.0,-22.2);ctx.quadraticCurveTo(-17.8,-23.4,-12.5,-17.3);
  ctx.lineWidth=1.15;ctx.strokeStyle='rgba(99,110,105,.85)';ctx.stroke();
  ctx.restore();
 }

 // Cosmetic seam attaching the side pouch to the shoulder. Not drawn when no bag is equipped.
 function drawSidePackStrap(ctx,flip){
  ctx.save();
  if(flip) ctx.scale(-1,1);
  ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(-11.5,-26.2);ctx.quadraticCurveTo(-7.8,-29.0,-3.8,-23.0);
  ctx.lineWidth=3.0;ctx.strokeStyle='rgba(19,26,31,.96)';ctx.stroke();
  ctx.beginPath();ctx.moveTo(-11.5,-26.2);ctx.quadraticCurveTo(-7.8,-29.0,-3.8,-23.0);
  ctx.lineWidth=1.25;ctx.strokeStyle='rgba(91,103,104,.92)';ctx.stroke();
  ctx.restore();
 }

 function drawArmorDetails(ctx,armor,p,bootColor,armorColor){
  ctx.save();
  ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.globalAlpha=.96;
  line(ctx,[-14,-20],[-17,-15],armorColor,1.3,.95);
  line(ctx,[14,-20],[17,-15],armorColor,1.3,.95);
  line(ctx,[-8,-6],[8,-6],'rgba(196,161,109,.55)',1.1,.85);
  if(armor){
   if(armor.model==='armor-bastion'||armor.model==='helmet-guard'){
    ctx.fillStyle='rgba(53,64,76,.88)';
    ctx.fillRect(-10.5,-15.5,21,4.8);
    ctx.strokeStyle=armorColor; ctx.lineWidth=1.1; ctx.strokeRect(-10.5,-15.5,21,4.8);
   }else if(armor.model==='armor-regenerator'||armor.model==='helmet-vital'){
    ctx.fillStyle='rgba(105,154,131,.92)';
    ctx.fillRect(-1.6,-15.6,3.2,6.5);ctx.fillRect(-3.6,-13.5,7.2,2.8);
   }else if(armor.model==='armor-predator'){
    line(ctx,[-4,-10],[0,-14],armorColor,1.4,.92); line(ctx,[1,-10],[5,-14],armorColor,1.4,.92);
   }else{
    line(ctx,[-10,-16],[-6,-13],armorColor,1.05,.72); line(ctx,[10,-16],[6,-13],armorColor,1.05,.72);
   }
  }
  line(ctx,[-10,15],[-7,20],bootColor,1.15,.8);
  line(ctx,[10,15],[7,20],bootColor,1.15,.8);
  ctx.restore();
 }

 function drawWeaponRig(ctx,weaponId,p,o){
  const short=/^(pistol_)/.test(weaponId)||weaponId==='nomade9'||weaponId==='spectre'||weaponId==='vektor';
  const length=short?24:34;
  const height=short?13.5:17.5;
  const fx=p.fx, fy=p.fy;
  const aim=p.aimAngle;
  const torso=p.torso;
  const pivotX=(torso==='torso-side'?(fx>0?5:-5):0) + fx*4.8;
  const pivotY=torso==='torso-back'?-18:-14.5 + fy*2.6;
  const rearShoulder=[-11.5,4.5], frontShoulder=[-8.5,-4.5];
  const rearHand=[1.5,3.7], frontHand=[short?7.8:11.4,1.1];
  const sleeveColor='#2f3943', gloveColor='#1d2328';
  const upperBehind=fy<-.24;
  const shoulderLift=clamp(-fy,-1,1)*1.4;

  const drawArm=(shoulder,elbow,hand,front)=>{
   ctx.save();
   ctx.strokeStyle='rgba(6,12,16,.85)'; ctx.lineWidth=front?5.8:5.2; ctx.lineCap='round'; ctx.lineJoin='round';
   ctx.beginPath(); ctx.moveTo(shoulder[0],shoulder[1]-shoulderLift); ctx.quadraticCurveTo(elbow[0],elbow[1],hand[0],hand[1]); ctx.stroke();
   ctx.strokeStyle=sleeveColor; ctx.lineWidth=front?4.4:4.1;
   ctx.beginPath(); ctx.moveTo(shoulder[0],shoulder[1]-shoulderLift); ctx.quadraticCurveTo(elbow[0],elbow[1],hand[0],hand[1]); ctx.stroke();
   ctx.fillStyle=gloveColor;
   ctx.beginPath(); ctx.ellipse(hand[0],hand[1],2.8,2.2,.1,0,Math.PI*2); ctx.fill();
   ctx.restore();
  };

  const drawWeapon = ()=>{
   const key='weapon:'+weaponId;
   const outline=tintedCanvas(key,'rgba(6,11,15,0.95)');
   if(outline){
    ctx.save();ctx.globalAlpha=.34;
    for(const [ox,oy] of [[-1,0],[1,0],[0,-1],[0,1],[-.7,-.7],[.7,.7]]) ctx.drawImage(outline,-length*.33+ox,-height*.51+oy,length,height);
    ctx.restore();
   }
   ctx.drawImage(images[key],-length*.33,-height*.51,length,height);
   ctx.fillStyle='rgba(196,161,109,.92)';
   ctx.fillRect(length*.01,-.5,1.8,2.6);
   if(!short){ctx.fillRect(length*.2,-1.2,2.2,2.2);} 
  };

  ctx.save();
  ctx.translate(pivotX,pivotY);
  ctx.rotate(aim);
  const rearElbow=[-5.8,6.5], frontElbow=[1.5,-4.5];
  if(upperBehind){ ctx.globalAlpha=.95; drawArm(rearShoulder,rearElbow,rearHand,false); drawWeapon(); drawArm(frontShoulder,frontElbow,frontHand,true); }
  else { drawArm(rearShoulder,rearElbow,rearHand,false); drawWeapon(); drawArm(frontShoulder,frontElbow,frontHand,true); }
  ctx.restore();
 }

 function draw(ctx,o){
  if(!enabled||!o||!o.weaponArtId) return false;
  const p=visualPose(o), weaponKey='weapon:'+o.weaponArtId;
  const armor=o.armor||null, boots=o.boots||null, bag=o.bag||null;
  const keys=['hero:'+p.torso,'hero:leg-left','hero:leg-right',weaponKey];
  if(bag){ keys.push('hero:pack'); keys.push('hero:pack-side'); }
  if(keys.some(k=>!ready(k))) return false;

  const step=p.moving?Math.sin(o.time*10.8):0;
  const bob=p.moving?Math.abs(step)*.78:.06;
  const stride=p.moving?step*2.9:0;
  const vx=Math.cos(p.moveAngle), vy=Math.sin(p.moveAngle);
  const armorColor=rarColor(armor?.rar), bootColor=rarColor(boots?.rar), bagColor=rarColor(bag?.rar);
  const back=p.torso==='torso-back';

  ctx.save();
  try{
   ctx.fillStyle='rgba(3,10,15,.42)';
   ctx.beginPath(); ctx.ellipse(o.x,o.y+19,16.2,5.8,0,0,Math.PI*2); ctx.fill();
   ctx.fillStyle='rgba(9,20,28,.18)';
   ctx.beginPath(); ctx.ellipse(o.x,o.y+17,12.8,3.7,0,0,Math.PI*2); ctx.fill();

   ctx.translate(o.x,o.y-bob);
   ctx.save();
   ctx.translate(-8.6,-4); ctx.rotate(p.moving?step*.06:0);
   drawSprite(ctx,'hero:leg-left',-12.2+vx*stride,-1.4+vy*stride*.55,25,39,{outlineRadius:1.1,outlineAlpha:.22});
   ctx.restore();

   ctx.save();
   ctx.translate(8.6,-4); ctx.rotate(p.moving?-step*.06:0);
   drawSprite(ctx,'hero:leg-right',-12.6-vx*stride,-1.4-vy*stride*.55,25,39,{outlineRadius:1.1,outlineAlpha:.22});
   ctx.restore();

   ctx.fillStyle='rgba(39,45,51,.98)';
   ctx.beginPath();
   ctx.moveTo(-11,-7.5); ctx.lineTo(11,-7.5); ctx.lineTo(8,-1.4); ctx.lineTo(-8,-1.4); ctx.closePath();
   ctx.fill();
   ctx.strokeStyle='rgba(196,161,109,.48)'; ctx.lineWidth=1.0; ctx.stroke();
   ctx.fillStyle='#b89663'; ctx.fillRect(-1.7,-5.9,3.4,2.2);

   if(bag && p.torso==='torso-side') drawSidePack(ctx,p.flip);
   if(bag && !back && p.torso==='torso-front') drawPeekPack(ctx,p.fx);

   ctx.save();
   const bodyLean=clamp(Math.sin(p.aimAngle)*.04,-.04,.04); ctx.rotate(bodyLean);
   if(p.flip) ctx.scale(-1,1);
   if(back) drawSprite(ctx,'hero:torso-back',-20.4,-42.6,40.8,41.2,{outlineRadius:1.25,outlineAlpha:.22});
   else if(p.torso==='torso-side') drawSprite(ctx,'hero:torso-side',-19.5,-41.5,39,40,{outlineRadius:1.2,outlineAlpha:.22});
   else drawSprite(ctx,'hero:torso-front',-22,-40.5,44,38.4,{outlineRadius:1.25,outlineAlpha:.22});
   ctx.restore();

   if(bag && p.torso==='torso-front') drawFrontPackStrap(ctx,p.fx<0);
   if(bag && p.torso==='torso-side') drawSidePackStrap(ctx,p.flip);

   drawArmorDetails(ctx,armor,p,bootColor,armorColor);

   if(back && bag){
    drawSprite(ctx,'hero:pack',-16.7,-35.0,33.6,31.4,{outlineRadius:1.1,outlineAlpha:.18});
    ctx.strokeStyle=bagColor; ctx.lineWidth=1.05; ctx.strokeRect(-7.8,-21.4,15.6,11.2);
   }
   if(bag && bag.model==='bag-securizer'){
    ctx.strokeStyle='#79bfc5'; ctx.lineWidth=1.0;
    ctx.beginPath(); ctx.arc(back?0:(p.fx>0?-11.2:11.2),-15.4,3.1,0,Math.PI*2); ctx.stroke();
   }

   drawWeaponRig(ctx,o.weaponArtId,p,o);

   if(o.module?.model==='module-tesla'){
    ctx.fillStyle='#64a9b5'; ctx.fillRect(-10.4,-16.2,2.4,4.4);
   }else if(o.module?.model==='module-aegis'&&o.shieldReady){
    ctx.fillStyle='#7ab9c4'; ctx.beginPath(); ctx.arc(-10.1,-16.2,1.95,0,Math.PI*2); ctx.fill();
   }else if(o.module?.model==='module-medic'){
    ctx.fillStyle='#709d84'; ctx.fillRect(-11.1,-16.2,3,3);
   }
   if(o.artifact){ ctx.fillStyle=rarColor(o.artifact.rar); ctx.fillRect(7.3,-10.5,2.2,2.2); }

   return true;
  } finally { ctx.restore(); }
 }

 root.AshNomad2=Object.freeze({draw,visualPose,status:()=>({...states}),setEnabled:v=>{enabled=!!v;},isEnabled:()=>enabled});
})(window);
