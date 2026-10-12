(() => {
 'use strict';
 const canvas=document.getElementById('brain-world'),ctx=canvas.getContext('2d');
 if(!ctx)return;
 const motion=window.matchMedia('(prefers-reduced-motion:reduce)');
 const hero=document.querySelector('.hero'),brain=document.querySelector('.hero-visual');
 const entryScene=document.getElementById('brain-entry-scroll');
 const exitScene=document.getElementById('brain-exit-scroll');
 const exitVisual=document.getElementById('brain-exit-visual');
 let entranceBounds=null;
 let width=window.innerWidth,height=window.innerHeight,dpr=1,scroll=window.scrollY,target=scroll,last=0,raf=0,paused=motion.matches;
 let cells=[],edges=[],markers=[],docHeight=0;

 const anatomyRegions=[
  {id:'hippocampus',anchor:'histoire',point:[350,280],fr:['Hippocampe','Participe à la formation des souvenirs et à l’apprentissage.'],en:['Hippocampus','Helps form memories and supports learning.']},
  {id:'frontal',anchor:'competences',point:[170,170],fr:['Lobe frontal','Raisonnement, apprentissage et résolution de problèmes.'],en:['Frontal lobe','Reasoning, learning and problem-solving.']},
  {id:'occipital',anchor:'t-bash',point:[550,215],fr:['Lobe occipital','Traite les informations visuelles reçues des yeux.'],en:['Occipital lobe','Processes visual information received from the eyes.']},
  {id:'parietal',anchor:'t-orange',point:[350,130],fr:['Lobe pariétal','Intègre des informations sensorielles et contribue à la perception de l’espace.'],en:['Parietal lobe','Integrates sensory information and contributes to spatial perception.']},
  {id:'temporal',anchor:'t-groupeimage',point:[340,290],fr:['Lobe temporal','Participe au traitement des sons et à la compréhension du langage.'],en:['Temporal lobe','Helps process sounds and understand language.']},
  {id:'callosum',anchor:'t-veltis',point:[335,185],fr:['Corps calleux','Permet l’échange d’informations entre les deux hémisphères.'],en:['Corpus callosum','Enables information exchange between the two hemispheres.']},
  {id:'cerebellum',anchor:'t-kaydan',point:[550,385],fr:['Cervelet','Contribue à l’équilibre et à la coordination des mouvements.'],en:['Cerebellum','Contributes to balance and movement coordination.']}
 ];
 let emittedRegion="",emittedContext="";
 const anatomy=document.getElementById('brain-anatomy');
 const anatomyTitle=document.getElementById('anatomy-region-title');
 const anatomyFunction=document.getElementById('anatomy-region-function');
 function updateAnatomy(){
  const lang=document.documentElement.lang==='en'?'en':'fr';
  const stops=anatomyRegions.map(region=>document.getElementById(region.anchor).getBoundingClientRect().top+window.scrollY-height*.35);
  let index=-1;stops.forEach((position,i)=>{if(scroll>=position)index=i;});
  const region=anatomyRegions[Math.max(0,index)];
  document.querySelectorAll('[data-anatomy-region]').forEach(el=>el.classList.toggle('is-active',index>=0&&el.dataset.anatomyRegion===region.id));
  if(emittedRegion!==region.id){emittedRegion=region.id;document.documentElement.dataset.brainRegion=region.id;document.dispatchEvent(new CustomEvent('brain-region'));}
  anatomyTitle.textContent=index<0?(lang==='fr'?'Le cerveau':'The brain'):region[lang][0];
  anatomyFunction.textContent=index<0?(lang==='fr'?'Des régions reliées, un parcours continu.':'Connected regions, one continuous journey.'):region[lang][1];
  let focus=[350,250],zoom=1;
  if(index>=0){
   const next=anatomyRegions[Math.min(index+1,anatomyRegions.length-1)];
   const start=stops[index],end=stops[index+1]??docHeight;
   const fraction=Math.max(0,Math.min(1,(scroll-start)/Math.max(1,end-start)));
   const blend=fraction*fraction*(3-2*fraction);
   focus=region.point.map((value,i)=>value+(next.point[i]-value)*blend);
   zoom=width>680?1.15:1.03;
  }
  if(motion.matches){focus=[350,250];zoom=1;}
  const scale=width>680?Math.max(760,Math.min(1750,width*1.15))/700:1000/700;
  anatomy.style.setProperty('--anatomy-x',`${(350-focus[0])*scale*.55}px`);
  anatomy.style.setProperty('--anatomy-y',`${(250-focus[1])*scale*.55}px`);
  anatomy.style.setProperty('--anatomy-zoom',zoom);
 }

 const route=z=>({x:140*Math.sin(z/1700),y:90*Math.sin(z/1300)});
 function random(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
 function build(){
  const rand=random(91);cells=[];edges=[];docHeight=document.documentElement.scrollHeight;
  const max=docHeight*1.8+2200;
  for(let z=-400;z<max;z+=230){
   const start=cells.length,center=route(z);
   for(let i=0;i<16;i++){
    const angle=i/16*Math.PI*2+rand()*.35,r=180+rand()*360;
    cells.push({x:center.x+Math.cos(angle)*r,y:center.y+Math.sin(angle)*r*.8,z:z+(rand()-.5)*240,size:1+rand()*2,color:rand(),phase:rand()*6.28});
   }
   for(let i=0;i<16;i++){
    edges.push([start+i,start+(i+1)%16]);
    if(start>=16){edges.push([start+i,start-16+i]);if(i%3===0)edges.push([start+i,start-16+(i+3)%16]);}
   }
  }
  // Anatomical entry silhouette, followed by deeper connected fibers.
  const contour=new Path2D(document.querySelector('.brain-shape').getAttribute('d'));
  const start=cells.length;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  for(let i=0;i<340;i++){
   let x,y;do{x=rand()*512;y=rand()*512;}while(!ctx.isPointInPath(contour,x,y));
   cells.push({x:(x-256)*1.6,y:(y-256)*1.6,z:rand()*130-65,size:1+rand()*1.6,color:x/512,phase:rand()*6.28});
  }
  ctx.restore();
  for(let i=start;i<cells.length;i++){
   let near=[];
   for(let j=start;j<i;j++){const a=cells[i],b=cells[j],d=(a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2;if(d<17000)near.push([d,j]);}
   near.sort((a,b)=>a[0]-b[0]);near.slice(0,3).forEach(([,j])=>edges.push([i,j]));
  }
  markers=[hero,document.getElementById('histoire'),document.getElementById('competences'),...document.querySelectorAll('.t-entry'),document.getElementById('certifications'),document.getElementById('contact')].filter(Boolean);
 }
 function resize(){brain.style.transform="";brain.style.opacity="";entranceBounds=null;width=window.innerWidth;height=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);build();measureEntrance();request();}

 function measureEntrance(){
  const rect=brain.getBoundingClientRect();
  entranceBounds={x:rect.left+rect.width/2,y:rect.top+rect.height/2-hero.getBoundingClientRect().top,width:rect.width,transform:getComputedStyle(brain).transform};
 }
 const blend=(a,b,value)=>{const t=Math.max(0,Math.min(1,(value-a)/(b-a)));return t*t*(3-2*t);};
 function updateEntrance(){
  if(!entranceBounds)measureEntrance();
  const range=Math.max(1,entryScene.offsetHeight-height),p=Math.max(0,Math.min(1,scroll/range));
  if(motion.matches){brain.style.transform='';brain.style.opacity='';hero.querySelector('.hero-inner').style.opacity='';canvas.style.opacity='1';document.getElementById('mind-scene').style.opacity='1';window.BrainVolume?.setDepth(brain,0);return;}
  const center=blend(0,.4,p),dive=blend(.2,.95,p),scale=1+dive*1.5;
  const x=(width/2-entranceBounds.x)*center,y=(height/2-entranceBounds.y)*center;
  const base=entranceBounds.transform==='none'?'':entranceBounds.transform;
  brain.style.transform=`${base} translate(${x}px,${y}px) scale(${scale})`; 
  brain.style.opacity=String(1-blend(.72,1,p));
  window.BrainVolume?.setDepth(brain,dive);
  const copy=hero.querySelector('.hero-inner');copy.style.opacity=String(1-blend(0,.24,p));copy.style.pointerEvents=p>.24?'none':'';
  canvas.style.opacity=String(blend(.38,.9,p));
  document.getElementById('mind-scene').style.opacity=String(blend(.85,1,p));
 }
 function updateExit(){
  const start=exitScene.getBoundingClientRect().top+window.scrollY;
  const p=Math.max(0,Math.min(1,(scroll-start)/Math.max(1,exitScene.offsetHeight-height)));
  const retreat=blend(.05,.85,p),depth=1-retreat;
  exitVisual.style.transform=`translate(-50%,-50%) scale(${motion.matches?1:1+depth*1.5})`;
  exitVisual.style.opacity=String(motion.matches?1:blend(.02,.22,p));
  window.BrainVolume?.setDepth(exitVisual,motion.matches?0:depth);
  exitScene.querySelector('.brain-exit-copy').style.opacity=String(motion.matches?1:blend(.82,1,p));
  if(scroll>=start){
   document.getElementById('mind-scene').style.opacity=String(1-blend(0,.18,p));
   canvas.style.opacity=String(1-blend(.12,.62,p));
   document.getElementById('anatomy-caption').style.opacity=String(1-blend(0,.18,p));
  }else{document.getElementById('anatomy-caption').style.opacity='';}
 }

 function project(cell,camera,center){
  const depth=cell.z-camera;if(depth<75||depth>2700)return null;
  const f=Math.min(width,height)*1.12,scale=f/depth;
  const x=width/2+(cell.x-center.x)*scale,y=height/2+(cell.y-center.y)*scale;
  if(x< -180||x>width+180||y< -180||y>height+180)return null;
  return{x,y,scale,alpha:Math.min(1,(depth-75)/180)*Math.min(1,(2700-depth)/700)};
 }
 const readingZones=[...document.querySelectorAll('#histoire,#competences,.t-card,#certifications,#contact')];
 function readingFocus(){
  let focus=0;
  for(const zone of readingZones){
   const rect=zone.getBoundingClientRect();
   const visible=Math.max(0,Math.min(rect.bottom,height*.9)-Math.max(rect.top,height*.1));
   const amount=blend(0,Math.min(height*.36,Math.max(80,rect.height*.65)),visible);
   focus=Math.max(focus,amount);
  }
  return focus;
 }
 function densityWeight(index,focus){
  if(index%5<3)return 1;
  const offset=(index%5)*.07;
  return 1-blend(.08+offset,.58+offset,focus);
 }
 function draw(time=0){
  ctx.clearRect(0,0,width,height);
  const reading=readingFocus();
  const readingOpacity=1-reading*.84;
  ctx.globalAlpha=readingOpacity;
  const exitStart=exitScene.getBoundingClientRect().top+window.scrollY;
  const exitProgress=Math.max(0,Math.min(1,(scroll-exitStart)/Math.max(1,exitScene.offsetHeight-height)));
  const camera=scroll<exitStart?-1650+scroll*1.8:-1650+exitStart*1.8-blend(0,1,exitProgress)*2600,center=route(camera+500);
  const projected=cells.map(cell=>project(cell,camera,center));
  ctx.lineWidth=.65;
  for(let edgeIndex=0;edgeIndex<edges.length;edgeIndex++){
   const weight=densityWeight(edgeIndex,reading);if(weight===0)continue;
   ctx.globalAlpha=readingOpacity*weight;
   const [a,b]=edges[edgeIndex];
   const p=projected[a],q=projected[b];if(!p||!q)continue;
   const red=cells[a].color>.65,alpha=Math.min(p.alpha,q.alpha)*.24;
   ctx.strokeStyle=red?`rgba(255,138,152,${alpha})`:`rgba(124,157,255,${alpha})`;
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
   if(!paused&&reading<.75&&a%13===0){const t=(time*.00022+cells[a].phase)%1;ctx.fillStyle=red?'rgba(255,138,152,.85)':'rgba(180,202,255,.85)';ctx.beginPath();ctx.arc(p.x+(q.x-p.x)*t,p.y+(q.y-p.y)*t,1.1,0,Math.PI*2);ctx.fill();}
  }
  for(let i=0;i<cells.length;i++){
   const weight=densityWeight(i,reading);if(weight===0)continue;
   ctx.globalAlpha=readingOpacity*weight;
   const p=projected[i];if(!p)continue;const cell=cells[i],r=Math.max(.6,Math.min(5,cell.size*p.scale));
   ctx.fillStyle=cell.color>.7?`rgba(255,138,152,${p.alpha*.75})`:`rgba(190,208,255,${p.alpha*.8})`;
   ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
   if(r>1.5){ctx.fillStyle=`rgba(77,122,255,${p.alpha*.035})`;ctx.beginPath();ctx.arc(p.x,p.y,r*5,0,Math.PI*2);ctx.fill();}
  }
  ctx.globalAlpha=1;
  updateAnatomy();
  const total=Math.max(1,docHeight-height);document.documentElement.style.setProperty('--world-progress',Math.min(1,scroll/total));
  updateEntrance();updateExit();
  let current=markers[0],index=0;
  markers.forEach((el,i)=>{if(el.getBoundingClientRect().top<height*.55){current=el;index=i;}});
  const context=current.id||'histoire';
  const thoughtPhase=Math.floor(Math.max(0,height*.55-current.getBoundingClientRect().top)/Math.max(1,height*.65));
  document.documentElement.dataset.brainContext=context;document.documentElement.dataset.brainThoughtPhase=String(thoughtPhase);
  const contextKey=context+'-'+thoughtPhase;
  if(contextKey!==emittedContext){emittedContext=contextKey;document.dispatchEvent(new CustomEvent('brain-context'));}
  document.querySelectorAll('.t-entry').forEach(el=>el.classList.toggle('journey-current',el===current));
 }
 let previousFrame=0;
 function frame(time){raf=0;if(document.hidden){previousFrame=0;return;}
  const elapsed=previousFrame?Math.min(64,time-previousFrame):16.67;previousFrame=time;
  scroll=paused?target:scroll+(target-scroll)*(1-Math.exp(-elapsed/75));if(Math.abs(scroll-target)<.1)scroll=target;
  const exitStart=exitScene.getBoundingClientRect().top+window.scrollY;
  const inTransition=scroll<entryScene.offsetHeight-height||(scroll>=exitStart&&scroll<=exitStart+exitScene.offsetHeight-height);
  const interval=inTransition?0:(width<700?28:16);if(time-last>=interval){draw(time);last=time;}
  if(!paused||Math.abs(scroll-target)>.1)raf=requestAnimationFrame(frame);
 }
 function request(){if(!raf)raf=requestAnimationFrame(frame);}
 const interfaceText={
  fr:{entry:'Voyage dans mon cerveau',skip:'Aller au contenu',bridge1:'Comprendre. Apprendre. Construire.',bridge2:'La prochaine connexion commence ensemble.',metaphor:'Les régions servent de fil narratif. Le trajet visuel est une interprétation artistique.',source:'Repères scientifiques : NIH',exit:'La prochaine connexion dans mon cerveau, c’est notre collaboration.',pause:'Mettre les animations en pause',resume:'Activer les animations'},
  en:{entry:'A journey through my brain',skip:'Skip to content',bridge1:'Understand. Learn. Build.',bridge2:'The next connection starts together.',metaphor:'The regions provide a narrative thread. The visual route is an artistic interpretation.',source:'Scientific references: NIH',exit:'The next connection in my brain is our collaboration.',pause:'Pause animations',resume:'Enable animations'}
 };
 function translateJourney(){
  const lang=document.documentElement.lang==='en'?'en':'fr',dict=interfaceText[lang];
  document.querySelectorAll('[data-journey-i18n]').forEach(el=>{el.textContent=dict[el.dataset.journeyI18n];});
  document.querySelectorAll('[data-journey-fr]').forEach(el=>{el.textContent=el.getAttribute('data-journey-'+lang);});
  const labels=lang==='en'?['Scroll down','Open HolyConnect','Download HolyConnect on the App Store','Download HolyConnect on Google Play']:['Défiler vers le bas','Ouvrir HolyConnect','Télécharger HolyConnect sur l’App Store','Télécharger HolyConnect sur Google Play'];
  ['.scroll-cue','#holyconnect-phone','.store-badge[href*="apple"]','.store-badge[href*="google"]'].forEach((selector,i)=>{const el=document.querySelector(selector);if(el)el.setAttribute('aria-label',labels[i]);});
  exitScene.setAttribute('aria-label',lang==='en'?'Leaving the brain':'Sortie du cerveau');
  const tip=document.getElementById('symbol-tip');if(tip)tip.classList.remove('show');
  updateAnatomy();request();
 }
 motion.addEventListener('change',()=>{paused=motion.matches;resize();request();});
 window.addEventListener('scroll',()=>{target=window.scrollY;request();},{passive:true});
 window.addEventListener('resize',()=>{
  if(window.innerWidth===width&&window.matchMedia('(pointer:coarse)').matches)return;
  resize();
 });
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)request();});
 window.addEventListener('load',resize,{once:true});
 if(document.fonts)document.fonts.ready.then(resize);
 document.addEventListener('portfolio-language',translateJourney);
 new MutationObserver(translateJourney).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 translateJourney();resize();draw();request();
})();
