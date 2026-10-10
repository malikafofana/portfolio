(() => {
  'use strict';
  const journey = document.getElementById('cerveau');
  if (!journey) return;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactHeight = window.matchMedia('(max-height: 520px)');
  const map = document.getElementById('neural-map');
  const path = document.getElementById('neural-route');
  const signal = document.getElementById('neural-signal');
  const panel = document.getElementById('neural-panel');
  const nodes = [...document.querySelectorAll('[data-neuron]')];
  const previous = document.querySelector('.neural-prev');
  const next = document.querySelector('.neural-next');
  const compass = document.getElementById('neural-compass');
  const location = document.getElementById('neural-location');
  const chapters = [
    {fr: {kicker:'Comprendre',title:'La curiosité comme point de départ.',description:'D’Abidjan à aivancity, mon parcours relie raisonnement scientifique, intelligence artificielle et développement logiciel. Comprendre un besoin est le premier pas vers une solution utile.',proof:'Master 1 en IA & Data · Major de promotion',tags:['Curiosité','Rigueur','Créativité'],link:'Découvrir mon histoire'},en:{kicker:'Understand',title:'Curiosity is where it begins.',description:'From Abidjan to aivancity, my journey connects scientific reasoning, artificial intelligence and software development. Understanding a need is the first step towards a useful solution.',proof:'Master’s student in AI & Data · Top of my class',tags:['Curiosity','Rigor','Creativity'],link:'Discover my story'},href:'#histoire'},
    {fr:{kicker:'Apprendre',title:'Des données aux modèles.',description:'Concevoir, entraîner, adapter et évaluer des modèles. Machine Learning, Deep Learning, transfert d’apprentissage et fine tuning font partie de mon approche, aux côtés des LLM, du NLP et du RAG.',proof:'Alzheimer MRI · JurisIA · Pipeline vocal',tags:['Machine Learning','Deep Learning','Fine tuning','NLP'],link:'Explorer mes compétences'},en:{kicker:'Learn',title:'From data to models.',description:'Designing, training, adapting and evaluating models. My approach includes Machine Learning, Deep Learning, transfer learning and fine tuning, alongside LLMs, NLP and RAG.',proof:'Alzheimer MRI · JurisIA · Speech pipeline',tags:['Machine Learning','Deep Learning','Fine tuning','NLP'],link:'Explore my skills'},href:'#competences'},
    {fr:{kicker:'Relier',title:'Faire circuler la donnée.',description:'Connecter des sources, automatiser la collecte et structurer des informations fiables. De l’activité des clients télécoms aux données cliniques, je transforme les données en outils d’analyse et de pilotage.',proof:'Orange Côte d’Ivoire · Veltis · Kaufman & Broad',tags:['Data Engineering','APIs','SQL','Data Quality'],link:'Voir mes expériences data'},en:{kicker:'Connect',title:'Make data flow.',description:'Connecting sources, automating collection and structuring reliable information. From telecom customer activity to clinical data, I turn data into tools for analysis and decision-making.',proof:'Orange Côte d’Ivoire · Veltis · Kaufman & Broad',tags:['Data Engineering','APIs','SQL','Data Quality'],link:'See my data experience'},href:'#t-veltis'},
    {fr:{kicker:'Construire',title:'L’idée prend forme dans le code.',description:'Je développe des interfaces, des APIs et des applications qui répondent à des besoins concrets. Développement full stack, outils de recrutement, OCR et blockchain se croisent dans mes expériences.',proof:'Kaydan Technology · Orange · Sursaut Technologie',tags:['TypeScript','Next.js','React','OCR','Hyperledger'],link:'Explorer mon travail logiciel'},en:{kicker:'Build',title:'Ideas take shape in code.',description:'I develop interfaces, APIs and applications that address real needs. Full stack development, recruitment tools, OCR and blockchain come together across my experience.',proof:'Kaydan Technology · Orange · Sursaut Technologie',tags:['TypeScript','Next.js','React','OCR','Hyperledger'],link:'Explore my software work'},href:'#t-kaydan'},
    {fr:{kicker:'Créer',title:'Du besoin au produit.',description:'Avec HolyConnect, je suis fondatrice, Product Manager et développeuse full stack. Vision, expérience utilisateur, application web et mobile, fonctionnalités IA, tests et amélioration continue : je porte le cycle produit.',proof:'HolyConnect · Web & mobile',tags:['Product Management','UX/UI','Capacitor','Firebase'],link:'Découvrir HolyConnect'},en:{kicker:'Create',title:'From a need to a product.',description:'At HolyConnect, I am the founder, Product Manager and full stack developer. Vision, user experience, web and mobile development, AI features, testing and continuous improvement: I own the product cycle.',proof:'HolyConnect · Web & mobile',tags:['Product Management','UX/UI','Capacitor','Firebase'],link:'Discover HolyConnect'},href:'#t-holyconnect'},
    {fr:{kicker:'Explorer',title:'L’IA, la data et le vivant.',description:'Je souhaite contribuer à l’innovation et à la recherche, avec un intérêt pour les sciences du vivant. Mon projet académique sur les IRM d’Alzheimer nourrit cette ambition, jusqu’à un futur doctorat.',proof:'Recherche appliquée · Sciences du vivant',tags:['Expérimentation','Évaluation','R&D'],link:'Entrer dans mon laboratoire'},en:{kicker:'Explore',title:'AI, data and life sciences.',description:'I want to contribute to innovation and research, with an interest in life sciences. My academic Alzheimer MRI project informs this ambition, looking ahead to a future doctorate.',proof:'Applied research · Life sciences',tags:['Experiments','Evaluation','R&D'],link:'Enter my public lab'},href:'#laboratoire'}
  ];
  let active = 0;
  let frame = 0;
  let length = 0;
  let stops = [];
  const positions = [[150,100],[350,130],[145,245],[355,290],[165,390],[345,405]];
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'fr';
  const scrollDriven = () => !media.matches && !compactHeight.matches;
  const text = (id,value) => { document.getElementById(id).textContent = value; };

  function preparePath() {
    if (typeof path.getTotalLength !== 'function') return;
    length = path.getTotalLength();
    let from = 0;
    stops = positions.map(([x,y],index) => {
      if (index === 0) return 0;
      if (index === positions.length-1) return length;
      let best = from, distance = Infinity;
      for (let d = from; d <= length; d += length/1200) {
        const point = path.getPointAtLength(d);
        const current = (point.x-x)**2+(point.y-y)**2;
        if (current < distance) { distance = current; best = d; }
      }
      from = best;
      return best;
    });
  }

  function drawSignal(logicalProgress) {
    const lower = Math.min(4,Math.floor(logicalProgress));
    const fraction = logicalProgress-lower;
    const distance = stops.length ? stops[lower]+(stops[lower+1]-stops[lower])*fraction : logicalProgress/5*length;
    journey.style.setProperty('--neural-progress',length ? distance/length : logicalProgress/5);
    if (!length) return;
    const point = path.getPointAtLength(distance);
    signal.setAttribute('cx',point.x);
    signal.setAttribute('cy',point.y);
  }

  function select(index,animate=true) {
    active = Math.max(0,Math.min(chapters.length-1,index));
    const chapter = chapters[active][language()];
    text('neural-number',String(active+1).padStart(2,'0'));
    text('neural-kicker',chapter.kicker);
    text('neural-chapter-title',chapter.title);
    text('neural-description',chapter.description);
    text('neural-proof',chapter.proof);
    const tags = document.getElementById('neural-tags');
    tags.replaceChildren(...chapter.tags.map(value => { const tag=document.createElement('span'); tag.textContent=value; return tag; }));
    const link = document.getElementById('neural-chapter-link');
    link.href = chapters[active].href;
    link.firstElementChild.textContent = chapter.link;
    nodes.forEach((node,i)=>node.setAttribute('aria-pressed',String(i===active)));
    previous.disabled=active===0;
    next.disabled=active===chapters.length-1;
    if (animate && !media.matches) {
      panel.classList.remove('is-changing');
      void panel.offsetWidth;
      panel.classList.add('is-changing');
    }
  }

  function go(index) {
    index=Math.max(0,Math.min(chapters.length-1,index));
    select(index);
    drawSignal(index);
    if (scrollDriven()) {
      const rect=journey.getBoundingClientRect();
      const range=Math.max(0,journey.offsetHeight-window.innerHeight);
      const offset=index===5 ? range-1 : range*index/5;
      window.scrollTo({top:rect.top+window.scrollY+offset,behavior:'smooth'});
    }
  }

  function update() {
    frame=0;
    const rect=journey.getBoundingClientRect();
    const range=Math.max(1,journey.offsetHeight-window.innerHeight);
    const ratio=Math.max(0,Math.min(1,-rect.top/range));
    if (scrollDriven()) {
      const index=Math.round(ratio*5);
      if (index!==active) select(index);
      drawSignal(ratio*5);
    }
    const pageRange=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    document.documentElement.style.setProperty('--page-progress',`${Math.min(100,window.scrollY/pageRange*100)}%`);
    compass.classList.toggle('is-visible',rect.bottom<window.innerHeight*.45);
    const sections=['histoire','competences','parcours','laboratoire','certifications','contact'];
    let sectionIndex=0;
    sections.forEach((id,i)=>{const section=document.getElementById(id);if(section && section.getBoundingClientRect().top<window.innerHeight*.5) sectionIndex=i;});
    const labels=language()==='en' ? ['My story','Skills','Experience','Public lab','Learning','Contact'] : ['Mon histoire','Compétences','Expériences','Laboratoire','Formation','Contact'];
    location.textContent=labels[sectionIndex];
    document.querySelectorAll('[data-compass-node]').forEach((node,i)=>node.classList.toggle('is-active',i===sectionIndex));
  }
  function schedule() { if(!frame) frame=requestAnimationFrame(update); }

  function translate() {
    const lang=language();
    document.querySelectorAll('[data-neural-fr]').forEach(el=>{ el.textContent=el.getAttribute(`data-neural-${lang}`); });
    previous.setAttribute('aria-label',lang==='en'?'Previous connection':'Connexion précédente');
    next.setAttribute('aria-label',lang==='en'?'Next connection':'Connexion suivante');
    compass.setAttribute('aria-label',lang==='en'?'Journey navigation':'Repère dans le parcours');
    document.querySelector('.neural-filters').setAttribute('aria-label',lang==='en'?'Filter projects':'Filtrer les projets');
    select(active,false);
    schedule();
  }

  nodes.forEach((node,i)=>{
    node.addEventListener('click',()=>go(i));
    node.addEventListener('keydown',event=>{
      let target=null;
      if(event.key==='ArrowRight'||event.key==='ArrowDown') target=(i+1)%nodes.length;
      if(event.key==='ArrowLeft'||event.key==='ArrowUp') target=(i+nodes.length-1)%nodes.length;
      if(event.key==='Home') target=0;
      if(event.key==='End') target=nodes.length-1;
      if(target!==null) { event.preventDefault(); nodes[target].focus({preventScroll:true}); go(target); }
    });
  });
  previous.addEventListener('click',()=>go(active-1));
  next.addEventListener('click',()=>go(active+1));
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  media.addEventListener('change',()=>{drawSignal(active);schedule();});
  compactHeight.addEventListener('change',schedule);
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    map.addEventListener('pointermove',event=>{
      if(media.matches) return;
      const r=map.getBoundingClientRect();
      map.style.setProperty('--map-ry',`${(event.clientX-r.left-r.width/2)/r.width*8}deg`);
      map.style.setProperty('--map-rx',`${-(event.clientY-r.top-r.height/2)/r.height*6}deg`);
    });
    map.addEventListener('pointerleave',()=>{map.style.setProperty('--map-ry','0deg');map.style.setProperty('--map-rx','0deg');});
  }
  document.querySelectorAll('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{
    const category=button.dataset.projectFilter;
    document.querySelectorAll('[data-project-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    document.querySelectorAll('[data-project-category]').forEach(card=>{card.hidden=category!=='all' && card.dataset.projectCategory!==category;});
    schedule();
  }));

  // The intro follows real document/font readiness; the timeout is a safety ceiling.
  if(!media.matches && document.readyState!=='complete') {
    const loader=document.createElement('div');
    loader.className='neural-loader';loader.setAttribute('aria-hidden','true');
    loader.innerHTML='<svg viewBox="0 0 120 120"><path d="M55 15C25 5 12 32 24 48C4 60 18 93 38 95C37 113 55 116 55 100ZM65 15C95 5 108 32 96 48C116 60 102 93 82 95C83 113 65 116 65 100Z"/><path class="loader-pulse" d="M32 35L82 30L40 65L85 78L50 95"/></svg><p>Malika Fofana</p><small>Connexion à mon univers</small>';
    document.body.appendChild(loader);
    let complete=false;
    const finish=()=>{
      if(complete) return;
      complete=true;
      loader.classList.add('is-done');
      document.body.classList.add('neural-arrived');
      setTimeout(()=>loader.remove(),650);
    };
    const pageReady=new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
    const fontsReady=document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.allSettled([pageReady,fontsReady]).then(finish);
    setTimeout(finish,4000);
  }
  preparePath();
  document.documentElement.classList.add('neural-ready');
  translate();
  drawSignal(0);
  update();
})();
