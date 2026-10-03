/* ===================== HOLYCONNECT SMART STORE LINK ===================== */
/* Phone preview -> App Store on iOS, Google Play on Android, website otherwise. */
const holyconnectPhone = document.getElementById('holyconnect-phone');
if (holyconnectPhone){
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); /* modern iPadOS reports as Mac */
  const isAndroid = /Android/.test(ua);

  let holyconnectUrl = 'https://holyconnect.app';
  if (isIOS) holyconnectUrl = 'https://apps.apple.com/app/holyconnect/id6791257222';
  else if (isAndroid) holyconnectUrl = 'https://play.google.com/store/apps/details?id=app.holyconnect.mobile';

  holyconnectPhone.href = holyconnectUrl;
}

/* ===================== COPY EMAIL TO CLIPBOARD ===================== */
const emailLink = document.getElementById('email-link');
const toastEl = document.getElementById('toast');
let toastTimer = null;

function showToast(message){
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

if (emailLink){
  emailLink.addEventListener('click', (e) => {
    const address = 'malika.fofana@aivancity.education';
    if (navigator.clipboard && navigator.clipboard.writeText){
      e.preventDefault();
      navigator.clipboard.writeText(address).then(() => {
        const dict = (typeof I18N !== 'undefined' && typeof document !== 'undefined')
          ? I18N[document.documentElement.getAttribute('lang') || 'fr']
          : null;
        showToast(dict && dict.contact ? dict.contact.copied : 'Adresse copiée !');
      }).catch(() => { window.location.href = emailLink.href; });
    }
    /* if clipboard API unavailable, default mailto: behavior proceeds */
  });
}

/* ===================== CONTACT FORM ===================== */
/* Paste your Cloudflare Worker URL here once deployed, e.g.:
   'https://portfolio-contact.YOURNAME.workers.dev'
   (see cloudflare-worker/worker.js for the deploy steps). */
const CONTACT_ENDPOINT = '/api/contact';

const contactForm = document.getElementById('contact-form');
if (contactForm){
  const cfSubmit = document.getElementById('cf-submit');
  const cfStatus = document.getElementById('cf-status');
  const cfCompany = document.getElementById('cf-company'); /* honeypot */

  const getDict = () => (typeof I18N !== 'undefined')
    ? I18N[document.documentElement.getAttribute('lang') || 'fr']
    : null;

  const setStatus = (message, kind) => {
    if (!cfStatus) return;
    cfStatus.textContent = message;
    cfStatus.classList.remove('success', 'error');
    if (kind) cfStatus.classList.add(kind);
    cfStatus.classList.add('show');
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dict = getDict();
    const f = dict && dict.contact && dict.contact.form ? dict.contact.form : {};

    /* silent bot trap: if the honeypot field got filled, pretend success and stop */
    if (cfCompany && cfCompany.value){
      setStatus(f.success || 'Message envoyé !', 'success');
      contactForm.reset();
      return;
    }

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message){
      setStatus(f.missing || 'Merci de remplir tous les champs.', 'error');
      return;
    }

    cfSubmit.classList.add('loading');
    cfSubmit.disabled = true;
    setStatus(f.sending || 'Envoi en cours…', null);

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (!res.ok) throw new Error('request failed');
      setStatus(f.success || 'Message envoyé, merci !', 'success');
      contactForm.reset();
    } catch (err) {
      setStatus(f.error || "Une erreur est survenue, réessayez ou écrivez-moi directement par email.", 'error');
    } finally {
      cfSubmit.classList.remove('loading');
      cfSubmit.disabled = false;
    }
  });
}

/* ===================== HERO NAME LETTER-BY-LETTER REVEAL ===================== */
const scriptEl = document.querySelector('.hero-name .script');
if (scriptEl){
  const text = scriptEl.textContent;
  scriptEl.textContent = '';
  const baseDelay = 0.35;
  [...text].forEach((ch, i) => {
    if (ch === ' '){
      scriptEl.appendChild(document.createTextNode(' '));
      return;
    }
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch;
    span.style.animationDelay = (baseDelay + i * 0.035) + 's';
    scriptEl.appendChild(span);
  });
}

/* ===================== CERTIFICATION FLIP CARDS ===================== */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

/* ===================== SYMBOL TOOLTIPS ===================== */
const symbolTip = document.getElementById('symbol-tip');
document.querySelectorAll('.symbol').forEach(sym => {
  sym.addEventListener('mouseenter', () => {
    const key = sym.getAttribute('data-tip');
    const lang = document.documentElement.getAttribute('lang') || 'fr';
    const dict = (typeof I18N !== 'undefined') ? I18N[lang] : null;
    const text = dict && dict.symbols ? dict.symbols[key] : null;
    if (!text || !symbolTip) return;
    symbolTip.textContent = text;
    symbolTip.style.maxWidth = Math.min(260, window.innerWidth - 32) + 'px';
    const rect = sym.getBoundingClientRect();
    symbolTip.style.left = Math.max(12, Math.min(rect.left, window.innerWidth - 236)) + 'px';
    /* measure the tip first so we can flip it above the symbol if there's no room below */
    symbolTip.style.visibility = 'hidden';
    symbolTip.style.top = '0px';
    symbolTip.classList.add('show');
    const tipHeight = symbolTip.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom - 14;
    const top = spaceBelow >= tipHeight ? (rect.bottom + 10) : Math.max(8, rect.top - tipHeight - 10);
    symbolTip.style.top = top + 'px';
    symbolTip.style.visibility = '';
  });
  sym.addEventListener('mouseleave', () => {
    if (symbolTip) symbolTip.classList.remove('show');
  });
});

/* ===================== NAV SCROLL STATE ===================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===================== MOBILE NAV TOGGLE ===================== */
const navToggle = document.getElementById('navToggle');
const navDropdownEl = document.getElementById('navDropdown');
if (navToggle && navDropdownEl){
  const closeNav = () => {
    nav.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  const openNav = () => {
    nav.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  };
  navToggle.addEventListener('click', () => {
    if (nav.classList.contains('nav-open')) closeNav(); else openNav();
  });
  navDropdownEl.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target)) closeNav();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeNav();
  });
}

/* ===================== SCROLL REVEAL (both directions, re-animates) ===================== */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('in', entry.isIntersecting);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

/* stagger timeline entries slightly by index */
document.querySelectorAll('.t-entry').forEach((el, i) => {
  el.style.transitionDelay = (i % 2) * 0.08 + 's';
});

/* fine-grained staggered reveal for grid items (skill groups, cert cards) — re-animates both ways */
const staggerGroups = [
  document.querySelectorAll('.skill-group'),
  document.querySelectorAll('.cert-card'),
  document.querySelectorAll('.value-card'),
  document.querySelectorAll('.contact-links a')
];
const ioItems = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('in', entry.isIntersecting);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
staggerGroups.forEach(group => {
  group.forEach((el, i) => {
    el.classList.add('reveal-item');
    el.style.transitionDelay = Math.min(i * 0.06, 0.36) + 's';
    ioItems.observe(el);
  });
});

/* ===================== TIMELINE TRAVELER ===================== */
const timelineEl = document.getElementById('timeline');
const lineProgressEl = document.getElementById('t-line-progress');
const travelerEl = document.getElementById('t-traveler');
const timelineDots = document.querySelectorAll('.t-dot');

function updateTimelineProgress(){
  if (!timelineEl) return;
  const rect = timelineEl.getBoundingClientRect();
  const total = timelineEl.offsetHeight;
  const triggerY = window.innerHeight * 0.5;
  let progressPx = triggerY - rect.top;
  progressPx = Math.max(0, Math.min(total, progressPx));

  lineProgressEl.style.height = progressPx + 'px';
  travelerEl.style.top = progressPx + 'px';
  travelerEl.classList.toggle('at-red', (progressPx / total) > 0.5);

  timelineDots.forEach(dot => {
    const dotRect = dot.getBoundingClientRect();
    const dotOffset = (dotRect.top + dotRect.height / 2) - rect.top;
    dot.classList.toggle('passed', dotOffset <= progressPx);
  });
}

let timelineRaf = null;
window.addEventListener('scroll', () => {
  if (timelineRaf) return;
  timelineRaf = requestAnimationFrame(() => { updateTimelineProgress(); timelineRaf = null; });
}, { passive: true });
window.addEventListener('resize', updateTimelineProgress);
updateTimelineProgress();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================== HERO PARALLAX (brain drifts as you scroll past) ===================== */
const heroVisualEl = document.querySelector('.hero-visual');
if (heroVisualEl && !prefersReducedMotion){
  let parallaxRaf = null;
  const updateParallax = () => {
    const y = Math.min(window.scrollY, window.innerHeight * 1.2);
    heroVisualEl.style.setProperty('--parallax-y', (y * 0.18) + 'px');
    heroVisualEl.style.setProperty('--parallax-r', (y * 0.012) + 'deg');
    parallaxRaf = null;
  };
  window.addEventListener('scroll', () => {
    if (parallaxRaf) return;
    parallaxRaf = requestAnimationFrame(updateParallax);
  }, { passive: true });
}

/* ===================== PARTICLE NEURAL CANVAS ===================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, DPR;
let particles = [];
let mouse = { x: null, y: null, active: false };
let scrollFade = 1;

function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  initParticles();
}

function initParticles(){
  const density = prefersReducedMotion ? 0 : Math.min(90, Math.floor((W * H) / 16000));
  particles = [];
  for (let i = 0; i < density; i++){
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.6
    });
  }
}

function colorForX(x){
  /* blue on the left, red on the right, blended in the middle */
  const t = Math.min(Math.max(x / W, 0), 1);
  const r = Math.round(61 + (255 - 61) * t);
  const g = Math.round(107 + (59 - 107) * t);
  const b = Math.round(255 + (82 - 255) * t);
  return `${r},${g},${b}`;
}

function step(){
  ctx.clearRect(0, 0, W, H);

  const heroH = window.innerHeight * 1.05;
  const fade = Math.max(0, 1 - (window.scrollY / heroH));
  if (fade <= 0.01){
    requestAnimationFrame(step);
    return;
  }

  for (let i = 0; i < particles.length; i++){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (mouse.active){
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 140){
        const force = (140 - dist) / 140 * 0.55;
        p.x += (dx / (dist || 1)) * force;
        p.y += (dy / (dist || 1)) * force;
      }
    }

    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
  }

  /* connecting lines */
  for (let i = 0; i < particles.length; i++){
    for (let j = i + 1; j < particles.length; j++){
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130){
        const alpha = (1 - dist / 130) * 0.35 * fade;
        ctx.strokeStyle = `rgba(${colorForX((a.x+b.x)/2)},${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  /* particle dots */
  for (let i = 0; i < particles.length; i++){
    const p = particles[i];
    ctx.beginPath();
    ctx.fillStyle = `rgba(${colorForX(p.x)},${0.85 * fade})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(step);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
});
window.addEventListener('mouseleave', () => { mouse.active = false; });
window.addEventListener('resize', resize);

resize();
requestAnimationFrame(step);

/* ===================== DELIGHT: TILT, MAGNETIC, RIPPLE ===================== */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* subtle 3D tilt on timeline cards */
if (finePointer && !prefersReducedMotion){
  document.querySelectorAll('.t-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* magnetic pull for the main CTA */
if (finePointer && !prefersReducedMotion){
  document.querySelectorAll('.nav-cta').forEach(el => {
    el.classList.add('magnetic');
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${(x * 0.28).toFixed(1)}px, ${(y * 0.28).toFixed(1)}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* click ripple feedback */
function addRipple(e, el){
  if (prefersReducedMotion) return;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.4;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-el';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  el.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
document.querySelectorAll('.nav-cta, .browser-mock, .contact-links a').forEach(el => {
  el.classList.add('ripple-wrap');
  el.addEventListener('click', (e) => addRipple(e, el));
});
