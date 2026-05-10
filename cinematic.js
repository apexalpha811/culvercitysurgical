/* =========================================================
   Cinematic interactions:
   scroll reveals, scroll progress, cursor spotlight, magnetic
   buttons, card tilt + glow follow, word-by-word hero reveal,
   animated stat counters, hero parallax, particles, marquee.
   ========================================================= */
(function () {
  const root = document.documentElement;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll progress bar ---------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  let rafScroll = 0;
  function onScroll() {
    if (rafScroll) return;
    rafScroll = requestAnimationFrame(() => {
      rafScroll = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const s = max > 0 ? doc.scrollTop / max : 0;
      progress.style.transform = `scaleX(${s})`;
      root.style.setProperty('--scroll-y', doc.scrollTop + 'px');
      const hero = document.querySelector('.hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const localY = Math.max(-rect.height, Math.min(rect.height, -rect.top));
        root.style.setProperty('--scroll-y', localY + 'px');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Spotlight + grain + ambience layers ---------- */
  const sp = document.createElement('div');
  sp.className = 'spotlight';
  document.body.appendChild(sp);

  const gr = document.createElement('div');
  gr.className = 'grain';
  document.body.appendChild(gr);

  const amb = document.createElement('div');
  amb.className = 'ambience';
  document.body.appendChild(amb);

  /* Particle pre-population */
  function buildParticles(n = 40) {
    amb.innerHTML = '';
    if (root.dataset.ambience !== 'particles') return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = (Math.random() * 100) + '%';
      const dur = 10 + Math.random() * 18;
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = (-Math.random() * dur) + 's';
      p.style.opacity = 0.3 + Math.random() * 0.7;
      p.style.transform = `scale(${0.6 + Math.random() * 1.4})`;
      amb.appendChild(p);
    }
  }
  // Observe data-ambience changes (driven by tweaks panel)
  new MutationObserver(() => buildParticles()).observe(root, { attributes: true, attributeFilter: ['data-ambience'] });
  buildParticles();

  let mx = -1000, my = -1000;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    sp.style.setProperty('--mx', mx + 'px');
    sp.style.setProperty('--my', my + 'px');
    if (!sp.classList.contains('active')) sp.classList.add('active');
  }, { passive: true });

  /* ---------- 3. Scroll reveals ---------- */
  const revealTargets = [
    '.section-head', '.feat-card', '.spec-card', '.benefit-item',
    '.stat', '.testimonial', '.gallery-grid > *', '.faq-item',
    '.split > *', '.cta-wrap', '.split-actions', '.hero-actions',
    '.contact-row > *', '.feature .feature-img', '.feature .feature-copy',
  ];
  const all = document.querySelectorAll(revealTargets.join(','));
  all.forEach((el, i) => {
    el.classList.add('reveal');
    const sibIdx = [...(el.parentElement?.children || [])].indexOf(el);
    el.style.setProperty('--reveal-delay', `${(sibIdx % 6) * 70}ms`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  all.forEach(el => io.observe(el));

  /* ---------- 4. Hero word-by-word reveal ---------- */
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1 && !prefersReduce) {
    const html = heroH1.innerHTML;
    // Wrap words while preserving inner spans like .script
    const wrapWords = (node, ctx) => {
      const out = document.createDocumentFragment();
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { out.appendChild(document.createTextNode(p)); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.style.setProperty('--i', ctx.i++);
            span.textContent = p;
            out.appendChild(span);
          });
        } else if (child.nodeType === 1) {
          const clone = child.cloneNode(false);
          clone.appendChild(wrapWords(child, ctx));
          out.appendChild(clone);
        } else {
          out.appendChild(child.cloneNode(true));
        }
      });
      return out;
    };
    const ctx = { i: 0 };
    const wrapped = wrapWords(heroH1, ctx);
    heroH1.innerHTML = '';
    heroH1.appendChild(wrapped);
    heroH1.classList.add('word-reveal');
    requestAnimationFrame(() => heroH1.classList.add('go'));
  }

  /* ---------- 5. Magnetic buttons ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (root.dataset.magnetic === 'off') return;
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ---------- 6. Card tilt + glow follow ---------- */
  function setCardMouse(card, e) {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    if (root.dataset.cardhover === 'tilt') {
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
  }
  document.querySelectorAll('.spec-card, .feat-card').forEach(card => {
    card.addEventListener('mousemove', e => setCardMouse(card, e));
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- 7. Animated counters ---------- */
  function animateCount(el) {
    const targetStr = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const num = parseFloat(targetStr);
    if (Number.isNaN(num)) return;
    const dur = 1600;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const v = num * easeOut(t);
      const display = Number.isInteger(num)
        ? Math.round(v).toLocaleString()
        : v.toFixed(1);
      el.textContent = display + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- 8. Marquee duplicator ---------- */
  const track = document.querySelector('.marquee-track');
  if (track && !track.dataset.dup) {
    track.innerHTML += track.innerHTML;
    track.dataset.dup = '1';
  }
})();
