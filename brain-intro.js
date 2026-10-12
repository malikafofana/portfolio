(() => {
 'use strict';
 const target=document.querySelector('.hero-visual'),reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
 if(!target||!window.BrainVolume||reduced.matches||window.scrollY>30)return;
 const root=document.documentElement,overlay=document.createElement('div'),visual=document.createElement('div'),canvas=document.createElement('canvas');
 overlay.className='brain-intro';overlay.setAttribute('aria-hidden','true');visual.className='brain-intro-visual';canvas.className='brain-volume';
 visual.appendChild(canvas);overlay.appendChild(visual);document.body.appendChild(overlay);root.classList.add('brain-intro-playing');
 let cancelled=false,move=null,stop=()=>{};
 function cleanup(){if(cancelled)return;cancelled=true;stop();move?.cancel();overlay.remove();root.classList.remove('brain-intro-playing');window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onResize);reduced.removeEventListener('change',cleanup);}
 const initialWidth=window.innerWidth;
 function onScroll(){if(window.scrollY>30)cleanup();}
 function onResize(){if(window.innerWidth!==initialWidth)cleanup();}
 async function dock(){
  if(cancelled)return;
  if(typeof visual.animate!=='function'){cleanup();return;}
  if(document.fonts)await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,500))]);
  if(cancelled)return;
  const from=visual.getBoundingClientRect(),to=target.getBoundingClientRect();
  const x=to.left+to.width/2-(from.left+from.width/2),y=to.top+to.height/2-(from.top+from.height/2);
  overlay.classList.add('is-docking');
  move=visual.animate([{transform:'translate(-50%,-50%)'},{transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${to.width/from.width})`}],{duration:1000,easing:'cubic-bezier(.65,0,.2,1)',fill:'both'});
  try{await move.finished;}catch{}cleanup();
 }
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onResize);reduced.addEventListener('change',cleanup);
 stop=window.BrainVolume.mount(canvas,{assemble:true,onAssembled:dock});setTimeout(cleanup,5500);
})();
