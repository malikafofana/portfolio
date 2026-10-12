(() => {
 'use strict';
 const scene=document.getElementById('mind-scene'),catalogue=window.MIND_REFERENCES;
 if(!scene||!catalogue)return;
 const compact=window.matchMedia('(max-width:680px)');
 const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
 let rendered='',cycle=0;
 function render(){
  const root=document.documentElement,context=root.dataset.brainContext||'histoire';
  const region=root.dataset.brainRegion||'hippocampus',phase=Number(root.dataset.brainThoughtPhase||0);
  const lang=root.lang==='en'?'en':'fr';
  const key=compact.matches+'-'+context+'-'+region+'-'+phase+'-'+cycle+'-'+lang;if(key===rendered)return;rendered=key;
  const raw=catalogue.contexts[context]||catalogue.regions[region]||catalogue.regions.hippocampus;
  const seen=new Set(),pool=raw.filter(item=>{const signature=JSON.stringify(item);if(seen.has(signature))return false;seen.add(signature);return true;});
  const base=(phase*3+cycle*3)%Math.max(1,pool.length);
  const selected=Array.from({length:Math.min(4,pool.length)},(_,i)=>pool[(base+i)%pool.length]);
  selected.forEach((item,index)=>{
   let lane=scene.children[index];
   if(!lane){lane=document.createElement('div');lane.className='mind-lane mind-lane-'+index;lane.appendChild(document.createElement('div'));scene.appendChild(lane);}
   const el=lane.firstElementChild;el.replaceChildren();el.className='mind-item mind-'+item.type+' mind-slot-'+index;
   if(item.text){const pre=document.createElement('pre');pre.textContent=item.text;el.appendChild(pre);}
   else if(item.type==='book'){
    const cover=document.createElement('div');cover.className='mind-book-cover';
    const author=document.createElement('span');author.className='mind-book-author';author.textContent=item[lang][0];
    const title=document.createElement('strong');title.textContent=item[lang][1];
    const year=document.createElement('small');year.textContent=item[lang][2];cover.append(author,title,year);el.appendChild(cover);
   }else if(item.type==='fact'){
    const year=document.createElement('strong');year.className='mind-history-year';year.textContent=item[lang][0];
    const event=document.createElement('p');event.textContent=item[lang][1];
    const author=document.createElement('small');author.textContent=item[lang][2];el.append(year,event,author);
   }else{
    const text=document.createElement('p');text.textContent=item[lang][0];
    const author=document.createElement('small');author.textContent=item[lang][1];el.append(text,author);
   }
  });
  fitLanes();
 }
 function fitLanes(){
  scene.querySelectorAll(".mind-lane").forEach(lane=>{
   const item=lane.firstElementChild;
   const fit=Math.min(1,lane.clientWidth*.8/Math.max(1,item.offsetWidth),lane.clientHeight*.8/Math.max(1,item.offsetHeight));
   item.style.setProperty("--fit",fit);
   item.style.setProperty("--travel-x",Math.max(0,lane.clientWidth-item.offsetWidth*fit-2)+"px");
   item.style.setProperty("--travel-y",Math.max(0,lane.clientHeight-item.offsetHeight*fit-2)+"px");
  });
 }

 // Keep animation nodes alive; update their content only after scrolling settles.
 let updateTimer=0,swapTimer=0;
 function scheduleContent(){
  clearTimeout(updateTimer);clearTimeout(swapTimer);
  scene.classList.remove('is-changing');
  updateTimer=setTimeout(()=>{
   const root=document.documentElement;
   const key=compact.matches+'-'+(root.dataset.brainContext||'histoire')+'-'+(root.dataset.brainRegion||'hippocampus')+'-'+Number(root.dataset.brainThoughtPhase||0)+'-'+cycle+'-'+(root.lang==='en'?'en':'fr');
   if(key===rendered)return;
   scene.classList.add('is-changing');
   swapTimer=setTimeout(()=>{render();scene.classList.remove('is-changing');},reduced.matches?0:180);
  },180);
 }
 window.addEventListener('scroll',scheduleContent,{passive:true});
 let viewportWidth=window.innerWidth;
 window.addEventListener('resize',()=>{
  if(window.innerWidth===viewportWidth&&window.matchMedia('(pointer:coarse)').matches)return;
  viewportWidth=window.innerWidth;fitLanes();scheduleContent();
 },{passive:true});
 if(document.fonts)document.fonts.ready.then(fitLanes);
 ['brain-context','brain-region','portfolio-language'].forEach(event=>document.addEventListener(event,scheduleContent));
 new MutationObserver(scheduleContent).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 setInterval(()=>{if(document.hidden||reduced.matches)return;cycle++;scheduleContent();},24000);
 render();
})();
