(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Smooth scrolling uses the same Lenis engine family as the reference.
  if (!reducedMotion && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.08, duration: 1.2, smoothWheel: true, anchors: true });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const updateNavbar = () => navbar?.classList.toggle('scrolled', window.scrollY > 20);
  updateNavbar(); window.addEventListener('scroll', updateNavbar, { passive: true });
  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open'); menuToggle?.classList.remove('open'); menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Reference-style in-view counters, with reduced-motion support.
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target; countObserver.unobserve(el);
      const end = Number(el.dataset.count || 0);
      if (reducedMotion) { el.textContent = String(end); return; }
      const duration = 1500; const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.1 });
  counters.forEach(el => countObserver.observe(el));

  const projectData = {
    eyezen: { title:'EYEZEN', category:'FEATURED PROJECT / ADAPTIVE ILLUMINATION', description:'Intelligent Eye Fatigue Regulation Through Adaptive Illumination Control. EYEZEN explores an adaptive lighting approach using ambient illumination and occupancy sensing for study and work environments. It is a student prototype in development, not a clinically validated product.', focus:'Ambient-light sensing, occupancy awareness and adaptive illumination concept development.', tools:'BH1750 light sensor · PIR / IR sensing concepts · Raspberry Pi / microcontroller control · LED dimming concept', image:'assets/02_Projects/EYEZEN/phase-2.jpeg', gallery:['assets/02_Projects/EYEZEN/phase-2.jpeg','assets/02_Projects/EYEZEN/main.jpg','assets/02_Projects/EYEZEN/circuit.jpg','assets/02_Projects/EYEZEN/3d-model.jpg','assets/02_Projects/EYEZEN/initial-prototype.jpg','assets/02_Projects/EYEZEN/phase-1.jpeg'] },
    ecg: { title:'Smart ECG', category:'BIOMEDICAL IoT / PORTABLE MONITORING', description:'A portable ECG monitoring prototype that captures an ECG signal and displays a waveform locally, with network access for viewing. The project combines a biomedical sensor front end with a compact microcontroller and display.', focus:'Signal acquisition, local waveform display and connected monitoring prototype.', tools:'ESP32-C3 · AD8232 ECG module · OLED display · Wi-Fi', image:'assets/02_Projects/Smart-ECG/main-prototype.jpeg', gallery:['assets/02_Projects/Smart-ECG/main-prototype.jpeg','assets/02_Projects/Smart-ECG/circuit.jpeg'] },
    glaucoma: { title:'Congenital Glaucoma Wearable', category:'WEARABLE / EYE-HEALTH CONCEPT', description:'A spectacle-style wearable concept exploring optical sensing and motion-aware monitoring for eye-health applications. This is a prototype concept, not a diagnostic or clinically validated device.', focus:'Wearable form factor, optical sensing concept and embedded monitoring.', tools:'ESP32 · IR emitter / detector concept · OLED · Optional motion sensing', image:'assets/02_Projects/Glaucoma-Wearable/main-prototype.jpeg', gallery:['assets/02_Projects/Glaucoma-Wearable/main-prototype.jpeg'] },
    tmj: { title:'TMJ Pain Reliever', category:'SECOND-YEAR PROJECT / THERAPEUTIC DEVICE CONCEPT', description:'A biomedical therapeutic-device project focused on exploring a practical approach to TMJ pain relief and user comfort, developed as a second-year project.', focus:'Biomedical device concept, user comfort and prototype development.', tools:'Biomedical design · Prototype iteration · Therapeutic-device concepts', image:'assets/02_Projects/TMJ-Pain-Reliever/main-prototype.jpeg', gallery:['assets/02_Projects/TMJ-Pain-Reliever/main-prototype.jpeg','assets/02_Projects/TMJ-Pain-Reliever/model-reference.jpg','assets/02_Projects/TMJ-Pain-Reliever/region-of-cause.jpg','assets/02_Projects/TMJ-Pain-Reliever/output-trail.jpg'] },
    habot: { title:'HABOT', category:'INTERACTIVE SYSTEM / HEALTHCARE ASSISTANT', description:'A rule-based healthcare assistant prototype built around a display-based interaction flow and locally stored responses. The project explores simple, structured interactions in a healthcare-oriented context.', focus:'Rule-based response flow, display interaction and local data access.', tools:'Arduino UNO · TFT display · SD card · Rule-based logic', image:'assets/02_Projects/HABOT/main.jpg', gallery:['assets/02_Projects/HABOT/main.jpg','assets/02_Projects/HABOT/habot-1.jpg','assets/02_Projects/HABOT/habot-2.jpg','assets/02_Projects/HABOT/circuit.jpeg'] }
  };
  const modal = document.getElementById('projectModal');
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); };
  const openProject = key => {
    const d = projectData[key]; if (!d) return;
    document.getElementById('modalTitle').textContent = d.title;
    document.getElementById('modalCategory').textContent = d.category;
    document.getElementById('modalDescription').textContent = d.description;
    document.getElementById('modalFocus').textContent = d.focus;
    document.getElementById('modalTools').textContent = d.tools;
    const mainImg = document.getElementById('modalImage'); mainImg.src = d.image; mainImg.alt = d.title;
    const gallery = document.getElementById('modalGallery'); gallery.replaceChildren();
    d.gallery.forEach((src, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.classList.toggle('active', i === 0); button.setAttribute('aria-label', `View ${d.title} image ${i + 1}`);
      const img = document.createElement('img'); img.src = src; img.alt = ''; button.appendChild(img);
      button.addEventListener('click', () => { mainImg.src = src; gallery.querySelectorAll('button').forEach(b => b.classList.remove('active')); button.classList.add('active'); }); gallery.appendChild(button);
    });
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
  };
  document.querySelectorAll('[data-project]').forEach(el => {
    el.addEventListener('click', e => { if (e.target.closest('.project-open') || !e.target.closest('.project-open')) openProject(el.dataset.project); });
    el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); openProject(el.dataset.project); } });
  });
  modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();