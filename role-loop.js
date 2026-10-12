(() => {
 'use strict';
 const el=document.querySelector('[data-role-loop]');
 if(!el)return;
 const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
 let timer=0,index=0,count=0,erasing=false,visible=true,words=[];
 const text=document.createElement('span'),cursor=document.createElement('span');
 text.setAttribute('aria-hidden','true');cursor.setAttribute('aria-hidden','true');cursor.className='role-cursor';
 function wait(delay){clearTimeout(timer);if(visible&&!document.hidden&&!reduced.matches)timer=setTimeout(step,delay);}
 function step(){
  if(!visible||document.hidden||reduced.matches)return;
  const word=words[index];
  count+=erasing?-1:1;text.textContent=word.slice(0,count);
  if(!erasing&&count===word.length){erasing=true;wait(2300);}
  else if(erasing&&count===0){erasing=false;index=(index+1)%words.length;wait(300);}
  else wait(erasing?40:70);
 }
 function reset(){
  clearTimeout(timer);words=[document.documentElement.lang==='en'?'AI & Data Engineer':'Ingénieure IA & Data','Software Developer'];
  el.setAttribute('aria-label',words.join(', '));index=0;count=0;erasing=false;
  el.replaceChildren(text,cursor);text.textContent=reduced.matches?words.join(' · '):'';wait(700);
 }
 document.addEventListener('portfolio-language',reset);
 reduced.addEventListener('change',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else wait(100);});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wait(100);else clearTimeout(timer);}).observe(el);
 reset();
})();
