/* A detailed cortical image assembled into place, with animated neural signals. */
(() => {
 'use strict';
 const source=new Image();source.decoding='async';
 const assetURL=new URL('assets/brain-natural.webp',document.currentScript.src).href;
 const ready=new Promise((resolve,reject)=>{source.onload=resolve;source.onerror=reject;});source.src=assetURL;
 let surface=null,synapses=[],pieces=[],cloud=[],cloudEdges=[];
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 function prepare(){
  if(surface)return;
  surface=document.createElement('canvas');surface.width=512;surface.height=512;
  const ctx=surface.getContext('2d');ctx.drawImage(source,0,0,512,512);
  const pixels=ctx.getImageData(0,0,512,512).data;
  let seed=29;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<512;y+=16)for(let x=0;x<512;x+=16){
   let alpha=0;for(let j=y;j<Math.min(y+16,512);j+=4)for(let i=x;i<Math.min(x+16,512);i+=4)alpha+=pixels[(j*512+i)*4+3];
   if(!alpha)continue;
   pieces.push({x,y,dx:(rand()-.5)*680,dy:(rand()-.5)*620,rotation:(rand()-.5)*1.7,delay:rand()*.3});
  }
  for(let y=85;y<400;y+=7)for(let x=55;x<460;x+=7){
   const p=(y*512+x)*4;
   if(pixels[p+3]>220&&pixels[p]>165&&pixels[p+1]>145&&pixels[p+2]>185&&rand()>.7&&synapses.length<55)synapses.push({x,y,phase:rand()*Math.PI*2});
  }
  for(let y=80;y<445;y+=17)for(let x=48;x<470;x+=17){
   if(pixels[(y*512+x)*4+3]<180)continue;
   cloud.push({x:30.72+x*.88,y:30.72+y*.88,z:(rand()-.5)*150});
  }
  cloud.forEach((p,i)=>{for(let j=0;j<i;j++){const q=cloud[j];if(Math.hypot(p.x-q.x,p.y-q.y)<24)cloudEdges.push([i,j]);}});

 }
 const orbits=[{angle:-.38,rx:237,ry:105,color:'#35aaff'},{angle:.7,rx:225,ry:102,color:'#fb477b'},{angle:1.23,rx:214,ry:110,color:'#9475ff'}];
 const network=[[441,151],[478,135],[499,173],[461,194],[493,216],[438,229],[476,258],[417,278],[466,303]];
 const links=[[0,1],[0,3],[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[4,6],[5,6],[5,7],[6,7],[6,8],[7,8]];
 function orbitPoint(orbit,t){
  const x=orbit.rx*Math.cos(t),y=orbit.ry*Math.sin(t),c=Math.cos(orbit.angle),s=Math.sin(orbit.angle);
  return {x:256+x*c-y*s,y:245+x*s+y*c};
 }
 function glowDot(ctx,x,y,r,color,alpha){
  ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=4;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 }
 function fibers(ctx,time,assembly,front){
  const reveal=smooth((assembly-.25)/.75);if(!reveal)return;
  ctx.save();
  orbits.forEach((orbit,index)=>{
   ctx.strokeStyle=orbit.color;ctx.lineWidth=front?.65:.8;ctx.globalAlpha=reveal*(front?.3:.5);ctx.beginPath();
   const start=front?Math.PI:0,end=front?Math.PI*2:Math.PI;
   for(let step=0;step<=90;step++){const t=start+(end-start)*step/90,p=orbitPoint(orbit,t);if(step===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
   ctx.stroke();
   for(let n=0;n<5;n++){
    const t=(n/5*Math.PI*2+time*(.00012+index*.000035)+index)%(Math.PI*2);
    if((t>=Math.PI)!==front)continue;
    const p=orbitPoint(orbit,t);glowDot(ctx,p.x,p.y,n===0?2:1.2,orbit.color,reveal*(n===0?.95:.6));
   }
  });
  if(!front){
   ctx.strokeStyle='#6495ff';ctx.lineWidth=.65;ctx.globalAlpha=reveal*.5;
   links.forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(...network[a]);ctx.lineTo(...network[b]);ctx.stroke();});
   network.forEach(([x,y],i)=>glowDot(ctx,x,y,1.6+(i%3)*.45,i%3?'#58b9ff':'#f67ab0',reveal*(.6+.25*Math.sin(time*.001+i))));
   // Small peripheral synapses echo the orbiting neural cloud in the reference.
   [[52,177],[68,135],[83,341],[98,368],[403,60],[421,84],[360,43],[471,334]].forEach(([x,y],i)=>glowDot(ctx,x,y,1.1,i<4?'#52b7ff':'#ff5985',reveal*(.45+.3*Math.sin(time*.0008+i))));
  }
  ctx.restore();
 }
 function paint(ctx,time,assembly){
  ctx.clearRect(0,0,512,512);
  fibers(ctx,time,assembly,false);
  ctx.save();ctx.translate(30.72,30.72);ctx.scale(.88,.88);
  if(assembly>=1)ctx.drawImage(surface,0,0);
  else{
   for(const p of pieces){
    const t=smooth((assembly-p.delay)/.7),loose=1-t;
    ctx.save();ctx.globalAlpha=smooth(t*3);ctx.translate(p.x+8+p.dx*loose,p.y+8+p.dy*loose);ctx.rotate(p.rotation*loose);
    ctx.drawImage(surface,p.x,p.y,16,16,-8,-8,16,16);ctx.restore();
   }
  }
  if(assembly>.92){
   for(const p of synapses){
    const pulse=Math.pow((Math.sin(time*.0015+p.phase)+1)*.5,3);
    ctx.globalAlpha=pulse*.85;ctx.fillStyle=p.x<256?'#94dfff':'#ffc6e2';ctx.shadowColor=p.x<256?'#419bff':'#ff3675';ctx.shadowBlur=7;
    ctx.beginPath();ctx.arc(p.x,p.y,.7+pulse*.6,0,Math.PI*2);ctx.fill();
   }
   ctx.globalAlpha=1;ctx.shadowBlur=0;
  }
  ctx.restore();
  fibers(ctx,time,assembly,true);
 }
 function paintPassage(ctx,time,depth){
  // The cortex dissolves before magnification; independent depths replace the flat surface.
  paint(ctx,time,1);
  ctx.save();ctx.globalCompositeOperation='destination-in';ctx.globalAlpha=1-smooth((depth-.03)/.46);ctx.fillStyle='#fff';ctx.fillRect(0,0,512,512);ctx.restore();
  const alpha=smooth(depth/.18);
  const points=cloud.map(p=>{const distance=620-depth*535+p.z,scale=620/Math.max(48,distance);const x=256+(p.x-256)*scale,y=245+(p.y-245)*scale,fade=1-smooth((Math.hypot(x-256,y-245)-175)/78);return {x,y,scale,fade,visible:distance>48&&fade>.001};});
  ctx.save();ctx.lineWidth=.65;
  for(const [a,b]of cloudEdges){const p=points[a],q=points[b];if(!p.visible||!q.visible)continue;ctx.strokeStyle=cloud[a].x<256?`rgba(97,155,255,${alpha*.3*Math.min(p.fade,q.fade)})`:`rgba(255,113,150,${alpha*.3*Math.min(p.fade,q.fade)})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
  for(let i=0;i<points.length;i++){const p=points[i];if(!p.visible)continue;ctx.fillStyle=cloud[i].x<256?`rgba(173,211,255,${alpha*.8*p.fade})`:`rgba(255,177,200,${alpha*.8*p.fade})`;ctx.beginPath();ctx.arc(p.x,p.y,Math.min(3, .8*p.scale),0,Math.PI*2);ctx.fill();}
  ctx.restore();
 }
 function mount(canvas,{assemble=false,onAssembled=()=>{}}={}){
  const ctx=canvas.getContext('2d');if(!ctx)return()=>{};
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=512*dpr;canvas.height=512*dpr;ctx.scale(dpr,dpr);
  let start=0,frame=0,last=-100,done=false,visible=true,stopped=false,loaded=false;
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)restart();else{cancelAnimationFrame(frame);frame=0;}}):null;
  observer?.observe(canvas);
  function draw(now){
   frame=0;if(stopped||document.hidden||!visible)return;frame=requestAnimationFrame(draw);
   const depthChanging=(canvas.brainDepth||0)>.001&&(canvas.brainDepth||0)<.999;
   if(!depthChanging&&now-last<33)return;last=now;
   const assembly=assemble&&!reduced.matches?Math.min(1,(now-start)/2200):1;
   const depth=reduced.matches?0:(canvas.brainDepth||0);
   if(assembly>=1&&depth>0)paintPassage(ctx,now,depth);else paint(ctx,reduced.matches?0:now,assembly);
   canvas.parentElement?.classList.add('has-brain-volume');
   if(assembly===1&&!done){done=true;onAssembled();}
   if(reduced.matches){cancelAnimationFrame(frame);frame=0;}
  }
  const restart=()=>{if(loaded&&!frame&&!stopped&&visible&&!document.hidden)frame=requestAnimationFrame(draw);};reduced.addEventListener('change',restart);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else restart();};document.addEventListener('visibilitychange',visibility);
  ready.then(()=>{if(stopped)return;prepare();loaded=true;start=performance.now();restart();}).catch(()=>{canvas.remove();onAssembled();});
  return()=>{stopped=true;cancelAnimationFrame(frame);observer?.disconnect();reduced.removeEventListener('change',restart);document.removeEventListener('visibilitychange',visibility);};
 }
 window.BrainVolume={mount,setDepth(host,value){const canvas=host.querySelector('.brain-volume');if(canvas)canvas.brainDepth=clamp(value);}};
 for(const host of document.querySelectorAll('.hero-visual .brain-wrap,#brain-exit-visual')){
  const canvas=document.createElement('canvas');canvas.className='brain-volume';canvas.setAttribute('aria-hidden','true');host.appendChild(canvas);mount(canvas);
 }
})();
