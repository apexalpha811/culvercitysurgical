/* =========================================================
   Tweaks panel — vanilla. Honors __activate_edit_mode protocol
   from the host. Persists via __edit_mode_set_keys which the
   host rewrites into the EDITMODE-BEGIN/END block on disk.
   ========================================================= */
(function () {
  const root = document.documentElement;
  const defaults = window.__TWEAK_DEFAULTS || {};
  const state = Object.assign({
    theme: "default",
    spotlight: true,
    grain: false,
    reveals: true,
    revealStyle: "lift",
    magnetic: true,
    cardHover: "lift",
    parallax: 0.4,
    speed: 1,
    marquee: true,
    ambience: "none",
  }, defaults);

  // Apply state to the DOM
  function apply() {
    root.dataset.theme = state.theme;
    root.dataset.spotlight = state.spotlight ? "on" : "off";
    root.dataset.grain = state.grain ? "on" : "off";
    root.dataset.reveals = state.reveals ? "on" : "off";
    root.dataset.revealStyle = state.revealStyle;
    root.dataset.magnetic = state.magnetic ? "on" : "off";
    root.dataset.cardhover = state.cardHover;
    root.dataset.marquee = state.marquee ? "on" : "off";
    root.dataset.ambience = state.ambience;
    root.style.setProperty('--parallax', String(state.parallax));
    root.style.setProperty('--anim-speed', String(state.speed));
  }
  apply();

  function persist(patch) {
    Object.assign(state, patch);
    apply();
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
    } catch (e) {}
  }

  /* ---------- BUILD PANEL ---------- */
  const panel = document.createElement('aside');
  panel.className = 'tw-panel';
  panel.dataset.open = 'false';
  panel.setAttribute('aria-label', 'Tweaks panel');
  panel.innerHTML = `
    <div class="tw-head">
      <h4>Tweaks</h4>
      <button class="tw-close" type="button" aria-label="Close">✕</button>
    </div>
    <div class="tw-body"></div>
    <div class="tw-foot">
      <button type="button" data-act="reset">Reset</button>
      <button type="button" data-act="random">Surprise me</button>
    </div>
  `;
  document.body.appendChild(panel);
  const body = panel.querySelector('.tw-body');

  /* ---------- HELPERS ---------- */
  function row(label, sub, content) {
    const r = document.createElement('div');
    r.className = 'tw-row';
    r.innerHTML = `
      <div class="lab"><span>${label}</span><span class="val" data-val></span></div>
      ${sub ? `<div class="sub">${sub}</div>` : ''}
    `;
    r.appendChild(content);
    return r;
  }
  function setVal(rowEl, txt) {
    const v = rowEl.querySelector('[data-val]');
    if (v) v.textContent = txt;
  }
  function seg(key, options) {
    const wrap = document.createElement('div');
    wrap.className = 'tw-seg';
    options.forEach(o => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = o.label;
      b.setAttribute('aria-pressed', String(state[key] === o.value));
      b.addEventListener('click', () => {
        persist({ [key]: o.value });
        wrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
      });
      wrap.appendChild(b);
    });
    return wrap;
  }
  function toggle(key) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tw-switch';
    b.setAttribute('aria-pressed', String(!!state[key]));
    b.addEventListener('click', () => {
      const next = !state[key];
      persist({ [key]: next });
      b.setAttribute('aria-pressed', String(next));
    });
    return b;
  }
  function slider(key, min, max, step, formatter) {
    const wrap = document.createElement('div');
    const i = document.createElement('input');
    i.type = 'range';
    i.className = 'tw-slider';
    i.min = min; i.max = max; i.step = step;
    i.value = state[key];
    i.addEventListener('input', () => {
      const v = parseFloat(i.value);
      persist({ [key]: v });
      const r = wrap.closest('.tw-row');
      if (r) setVal(r, formatter ? formatter(v) : v);
    });
    wrap.appendChild(i);
    return wrap;
  }
  function swatches(key, opts) {
    const wrap = document.createElement('div');
    wrap.className = 'tw-swatches';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tw-sw';
      b.style.background = o.color;
      b.title = o.label;
      b.setAttribute('aria-pressed', String(state[key] === o.value));
      b.addEventListener('click', () => {
        persist({ [key]: o.value });
        wrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  /* ---------- SECTIONS ---------- */
  // Theme swatches
  body.appendChild(row(
    'Theme', null,
    swatches('theme', [
      { value: 'default', label: 'Teal',     color: 'linear-gradient(135deg,#4bbec6,#1e4c4f)' },
      { value: 'midnight', label: 'Midnight', color: 'linear-gradient(135deg,#0e1418,#65d9e1)' },
      { value: 'lapis',    label: 'Lapis',    color: 'linear-gradient(135deg,#2a6fdb,#0e2451)' },
      { value: 'rose',     label: 'Rose',     color: 'linear-gradient(135deg,#e07a8a,#7a2f3d)' },
      { value: 'forest',   label: 'Forest',   color: 'linear-gradient(135deg,#4a9b6c,#1d4a2f)' },
    ])
  ));

  // Ambience
  body.appendChild(row(
    'Ambience', 'Background atmosphere.',
    seg('ambience', [
      { value: 'none',      label: 'Off' },
      { value: 'aurora',    label: 'Aurora' },
      { value: 'grid',      label: 'Grid' },
      { value: 'particles', label: 'Particles' },
    ])
  ));

  // Card hover
  body.appendChild(row(
    'Card hover', null,
    seg('cardHover', [
      { value: 'lift', label: 'Lift' },
      { value: 'tilt', label: 'Tilt' },
      { value: 'glow', label: 'Glow' },
      { value: 'off',  label: 'Off' },
    ])
  ));

  // Reveal style
  body.appendChild(row(
    'Reveal style', null,
    seg('revealStyle', [
      { value: 'lift',  label: 'Lift' },
      { value: 'slide', label: 'Slide' },
      { value: 'scale', label: 'Scale' },
      { value: 'fade',  label: 'Fade' },
    ])
  ));

  // Switches
  function switchRow(label, key, sub) {
    const r = row(label, sub, toggle(key));
    return r;
  }
  body.appendChild(switchRow('Scroll reveals',  'reveals', null));
  body.appendChild(switchRow('Cursor spotlight','spotlight', null));
  body.appendChild(switchRow('Film grain',      'grain', null));
  body.appendChild(switchRow('Magnetic buttons','magnetic', null));
  body.appendChild(switchRow('Specialty marquee','marquee', null));

  // Sliders
  const parRow = row('Hero parallax', null, slider('parallax', 0, 1, 0.05, v => v.toFixed(2)));
  setVal(parRow, state.parallax.toFixed(2));
  body.appendChild(parRow);

  const spdRow = row('Animation speed', null, slider('speed', 0.5, 2, 0.05, v => v.toFixed(2) + '×'));
  setVal(spdRow, state.speed.toFixed(2) + '×');
  body.appendChild(spdRow);

  /* ---------- FOOT BUTTONS ---------- */
  panel.querySelector('[data-act="reset"]').addEventListener('click', () => {
    const reset = {
      theme: "default", spotlight: true, grain: false, reveals: true,
      revealStyle: "lift", magnetic: true, cardHover: "lift", parallax: 0.4,
      speed: 1, marquee: true, ambience: "none"
    };
    Object.assign(state, reset);
    apply();
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: reset }, '*'); } catch (e) {}
    rebuild();
  });
  panel.querySelector('[data-act="random"]').addEventListener('click', () => {
    const themes = ['default','midnight','lapis','rose','forest'];
    const amb = ['none','aurora','grid','particles'];
    const card = ['lift','tilt','glow'];
    const reveal = ['lift','slide','scale','fade'];
    const pick = a => a[Math.floor(Math.random()*a.length)];
    const patch = {
      theme: pick(themes), ambience: pick(amb), cardHover: pick(card),
      revealStyle: pick(reveal),
      grain: Math.random() < 0.4,
      magnetic: Math.random() < 0.85,
      spotlight: Math.random() < 0.8,
      parallax: parseFloat((Math.random() * 0.8).toFixed(2)),
      speed: parseFloat((0.8 + Math.random() * 0.6).toFixed(2)),
    };
    Object.assign(state, patch);
    apply();
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch (e) {}
    rebuild();
  });

  function rebuild() {
    // Re-render to reflect new state in UI
    body.innerHTML = '';
    // Re-call by closing & rebuilding panel? Simpler: location of section adds is local — re-attach
    // We'll just reload the controls by replaying construction. Easiest: full reload of UI bits.
    // For simplicity, rebuild by reloading the page state via reassigning innerHTML and re-running setup chunk:
    const sections = panel.cloneNode(true);
    panel.replaceWith(sections);
    location.reload(); // Simplest reliable approach to reflect everything
  }

  /* ---------- DRAG ---------- */
  const head = panel.querySelector('.tw-head');
  let drag = null;
  head.addEventListener('mousedown', e => {
    if (e.target.closest('.tw-close')) return;
    const r = panel.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!drag) return;
    panel.style.left = (e.clientX - drag.dx) + 'px';
    panel.style.top = (e.clientY - drag.dy) + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  });
  window.addEventListener('mouseup', () => { drag = null; });

  /* ---------- EDIT MODE PROTOCOL ---------- */
  window.addEventListener('message', e => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode')   panel.dataset.open = 'true';
    if (d.type === '__deactivate_edit_mode') panel.dataset.open = 'false';
  });
  panel.querySelector('.tw-close').addEventListener('click', () => {
    panel.dataset.open = 'false';
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
  });
  // Announce availability after listener is set
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
})();
