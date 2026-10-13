const projectData = {
 eyezen:{title:'EYEZEN',category:'01 / FEATURED MEDTECH PROJECT',description:'Intelligent Eye Fatigue Regulation Through Adaptive Illumination Control. EYEZEN explores a smart lighting system that responds to ambient illumination and occupancy to support more comfortable study and work environments.',focus:'Adaptive illumination, ambient-light sensing, occupancy detection and glare-aware lighting control.',tools:'BH1750 · PIR / IR sensors · Raspberry Pi / microcontrollers · AC dimming concept',image:'assets/02_Projects/EYEZEN/main.jpg',gallery:['assets/02_Projects/EYEZEN/main.jpg','assets/02_Projects/EYEZEN/initial-prototype.jpg','assets/02_Projects/EYEZEN/phase-1.jpeg','assets/02_Projects/EYEZEN/phase-2.jpeg','assets/02_Projects/EYEZEN/circuit.jpg','assets/02_Projects/EYEZEN/3d-model.jpg']},
 ecg:{title:'Smart ECG',category:'02 / BIOMEDICAL IOT',description:'A portable ECG monitoring prototype that captures an ECG signal and displays the waveform locally, with network access for viewing. The project combines a biomedical sensor front end with a compact microcontroller and display.',focus:'Signal acquisition, local waveform display and connected monitoring prototype.',tools:'ESP32-C3 · AD8232 ECG module · OLED display · Wi-Fi',image:'assets/02_Projects/Smart-ECG/main-prototype.jpeg',gallery:['assets/02_Projects/Smart-ECG/main-prototype.jpeg','assets/02_Projects/Smart-ECG/circuit.jpeg']},
 glaucoma:{title:'Congenital Glaucoma Wearable',category:'03 / WEARABLE CONCEPT',description:'A spectacle-style wearable concept exploring optical sensing and motion-aware monitoring for eye-health applications. This is a prototype concept, not a diagnostic or clinically validated device.',focus:'Wearable form factor, optical sensing concept and embedded monitoring.',tools:'ESP32 · IR emitter / detector concept · OLED · Optional motion sensing',image:'assets/02_Projects/Glaucoma-Wearable/main-prototype.jpeg',gallery:['assets/02_Projects/Glaucoma-Wearable/main-prototype.jpeg']},
 tmj:{title:'TMJ Pain Reliever',category:'04 / SECOND-YEAR PROJECT',description:'A biomedical therapeutic-device project focused on exploring a practical approach to TMJ pain relief and user comfort, developed as a second-year project.',focus:'Biomedical device concept, user comfort and prototype development.',tools:'Biomedical design · Prototype iteration · Therapeutic-device concepts',image:'assets/02_Projects/TMJ-Pain-Reliever/main-prototype.jpeg',gallery:['assets/02_Projects/TMJ-Pain-Reliever/main-prototype.jpeg','assets/02_Projects/TMJ-Pain-Reliever/model-reference.jpg','assets/02_Projects/TMJ-Pain-Reliever/region-of-cause.jpg','assets/02_Projects/TMJ-Pain-Reliever/output-trail.jpg']},
 habot:{title:'HABOT',category:'05 / INTERACTIVE SYSTEM',description:'A rule-based healthcare assistant prototype built around a display-based interaction flow and locally stored responses. The project explores simple, structured interactions in a healthcare-oriented context.',focus:'Rule-based response flow, display interaction and local data access.',tools:'Arduino UNO · TFT display · SD card · Rule-based logic',image:'assets/02_Projects/HABOT/main.jpg',gallery:['assets/02_Projects/HABOT/main.jpg','assets/02_Projects/HABOT/habot-1.jpg','assets/02_Projects/HABOT/habot-2.jpg','assets/02_Projects/HABOT/circuit.jpeg']}
};
const modal=document.getElementById('projectModal');const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''};
document.querySelectorAll('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{const d=projectData[btn.dataset.project];if(!d)return;document.getElementById('modalTitle').textContent=d.title;document.getElementById('modalCategory').textContent=d.category;document.getElementById('modalDescription').textContent=d.description;document.getElementById('modalFocus').textContent=d.focus;document.getElementById('modalTools').textContent=d.tools;const mainImg=document.getElementById('modalImage');mainImg.src=d.image;mainImg.alt=d.title;const gallery=document.getElementById('modalGallery');gallery.innerHTML='';d.gallery.forEach((src,i)=>{const b=document.createElement('button');if(i===0)b.classList.add('active');b.setAttribute('aria-label',`View ${d.title} image ${i+1}`);const img=document.createElement('img');img.src=src;img.alt='';b.appendChild(img);b.addEventListener('click',()=>{mainImg.src=src;gallery.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active')});gallery.appendChild(b)});modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}));
modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const toggle=document.getElementById('menuToggle');const nav=document.getElementById('nav');toggle.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
// Lenis adds the soft, weighted scroll feel. Native scrolling remains the fallback.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;
if (!reducedMotion && window.Lenis) {
  lenis = new Lenis({
    duration: 1.08,
    easing: t => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.15,
    anchors: true
  });
  const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
// Stagger content as it enters the viewport without blocking the page.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.setProperty('--reveal-index', i % 4);
  revealObserver.observe(el);
});
// Keep the glass navigation calm and responsive to scroll position.
const topbar = document.querySelector('.topbar');
const updateTopbar = () => topbar?.classList.toggle('scrolled', window.scrollY > 24);
updateTopbar();
window.addEventListener('scroll', updateTopbar, { passive: true });
// Gentle cursor tilt on large screens only; disabled on touch and reduced-motion devices.
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.project-card, .experience-card, .recognition-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 1.6).toFixed(2)}deg) rotateY(${(x * 1.6).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}


// Dashboard: count-up metrics and a real local clock.
const dashboard = document.getElementById('dashboard');
if (dashboard && 'IntersectionObserver' in window) {
  const metricObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      dashboard.classList.add('in-view');
      dashboard.querySelectorAll('.count-up').forEach(el => {
        if (el.dataset.counted === 'true') return;
        el.dataset.counted = 'true';
        const target = Number(el.dataset.count || 0);
        const duration = 1100;
        const start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(target * eased)).padStart(2, '0');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      metricObserver.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  metricObserver.observe(dashboard);
}
const clockEl = document.getElementById('liveClock');
const dateEl = document.getElementById('liveDate');
const updateClock = () => {
  const now = new Date();
  if (clockEl) clockEl.textContent = new Intl.DateTimeFormat(undefined, {hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);
  if (dateEl) dateEl.textContent = new Intl.DateTimeFormat(undefined, {day:'2-digit',month:'short',year:'numeric'}).format(now).toUpperCase();
};
updateClock();
window.setInterval(updateClock, 1000);


// Kinetic interaction layer: reading progress, cursor aura and gentle hero parallax.
const progressBar = document.getElementById('readingProgress');
let progressQueued = false;
const paintProgress = () => {
  if (!progressBar) return;
  const root = document.documentElement;
  const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / maxScroll))})`;
  progressQueued = false;
};
window.addEventListener('scroll', () => {
  if (!progressQueued) { progressQueued = true; requestAnimationFrame(paintProgress); }
}, { passive: true });
paintProgress();

const aura = document.getElementById('cursorAura');
const finePointer = window.matchMedia('(pointer:fine)').matches;
if (aura && finePointer && !reducedMotion) {
  let px = window.innerWidth / 2, py = window.innerHeight / 2;
  let ax = px, ay = py;
  window.addEventListener('pointermove', e => {
    px = e.clientX; py = e.clientY;
    aura.classList.add('is-visible');
  }, { passive: true });
  const followCursor = () => {
    ax += (px - ax) * .19; ay += (py - ay) * .19;
    aura.style.left = `${ax}px`; aura.style.top = `${ay}px`;
    requestAnimationFrame(followCursor);
  };
  requestAnimationFrame(followCursor);
  document.querySelectorAll('a,button,.project-card').forEach(el => {
    el.addEventListener('pointerenter', () => aura.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => aura.classList.remove('is-hover'));
  });
  document.addEventListener('pointerleave', () => aura.classList.remove('is-visible'));
}

const heroVisual = document.querySelector('.hero-visual');
const profileFrame = document.querySelector('.profile-frame');
if (heroVisual && profileFrame && finePointer && !reducedMotion) {
  heroVisual.addEventListener('pointermove', e => {
    const r = heroVisual.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - .5;
    const dy = (e.clientY - r.top) / r.height - .5;
    profileFrame.style.transform = `translate3d(${dx * 10}px,${dy * 9}px,0) rotateX(${-dy * 2.4}deg) rotateY(${dx * 3.2}deg)`;
  });
  heroVisual.addEventListener('pointerleave', () => { profileFrame.style.transform = ''; });
}
