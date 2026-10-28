(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const site = window.PSA_SITE || {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fill = (selector, html) => document.querySelectorAll(selector).forEach(el => { el.innerHTML = html; });

  /* ---------- Shared figures and data-driven blocks ---------- */
  document.querySelectorAll('[data-site]').forEach(el => { el.textContent = site[el.dataset.site] ?? el.textContent; });
  document.querySelectorAll('[data-site-href]').forEach(el => {
    const [key, scheme = ''] = el.dataset.siteHref.split(':').reverse();
    const value = site[key];
    if (value) el.href = scheme === 'mailto' ? `mailto:${value}` : scheme === 'tel' ? `tel:${value.replace(/[^\d+]/g, '')}` : value;
  });

  fill('[data-render="pipeline"]', `
    <table class="pipeline">
      <thead><tr><th scope="col">#</th><th scope="col">State</th><th scope="col">Capacity</th></tr></thead>
      <tbody>${(window.PSA_PIPELINE || []).map(r => `<tr><td>${esc(r.range)}</td><td>${esc(r.state)}</td><td>${esc(r.capacity)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td colspan="2">Total pipeline</td><td>${esc(site.pipelineMW)} MW</td></tr></tfoot>
    </table>`);

  fill('[data-render="phases"]', `<ol class="phases">${(window.PSA_PHASES || []).map(p => `
    <li class="reveal${p.done ? ' done' : ''}"><span class="phase-when">${esc(p.when)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('')}</ol>`);

  const team = window.PSA_TEAM || { directors: [], management: [] };
  const initials = name => name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const portrait = (p, cls) => p.photo
    ? `<img class="${cls}" src="${esc(p.photo)}" alt="${esc(p.name)}">`
    : `<div class="${cls} initials" aria-hidden="true">${esc(initials(p.name))}</div>`;
  fill('[data-render="directors"]', team.directors.map(p => `
    <article class="leader reveal">
      ${portrait(p, 'leader-photo')}
      <div><span class="label">${esc(p.role)}</span><h3>${esc(p.name)}</h3>
      ${p.org ? `<p class="muted">${esc(p.org)}</p>` : ''}${p.bio ? `<p>${esc(p.bio)}</p>` : ''}</div>
    </article>`).join(''));
  fill('[data-render="management"]', team.management.map(p => `
    <article class="member reveal">${portrait(p, 'member-photo')}<h3>${esc(p.name)}</h3><p>${esc(p.role)}</p></article>`).join(''));

  /* ---------- Nav ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  /* ---------- Cursor ball: a dot on the pointer and a ring that trails it ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    const at = { x: -100, y: -100 }, trail = { x: -100, y: -100 };
    addEventListener('mousemove', e => {
      at.x = e.clientX; at.y = e.clientY;
      document.body.classList.add('has-cursor');
      dot.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
    }, { passive: true });
    (function follow() {
      trail.x = lerp(trail.x, at.x, 0.14);
      trail.y = lerp(trail.y, at.y, 0.14);
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener('mouseover', e => {
      document.body.classList.toggle('cursor-big', !!e.target.closest('a, button, .tile, .card, .chips li'));
    });
    document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));
    document.documentElement.addEventListener('mouseenter', () => document.body.classList.add('has-cursor'));
  }

  /* ---------- Fields of solar panels lit by a moving light ---------- */
  // `.panel-field` follows the pointer across its section; `.panel-art` is the smaller card
  // artwork, lit by a slow drifting sun only.
  const pointer = { x: 0, y: 0, active: false };
  addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = e.pointerType === 'mouse'; }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { pointer.active = false; });

  document.querySelectorAll('.panel-field, .panel-art').forEach(canvas => {
    const art = canvas.classList.contains('panel-art');
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const CW = art ? 22 : 34, CH = art ? 13 : 20, GAP = art ? 4 : 6;
    let cells = [], w = 0, h = 0, visible = false, running = false, t = Math.random() * 10;
    const radius = () => art ? Math.max(w, h) * 0.55 : Math.min(300, Math.max(180, w * 0.22));
    const light = { x: 0, y: 0 };

    function layout() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = host.clientWidth; h = host.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      for (let y = 0, row = 0; y < h + CH; y += CH + GAP, row++) {
        // Every third row is a walkway, the way real arrays are laid out
        if (row % 3 === 2) continue;
        for (let x = 0; x < w + CW; x += CW + GAP) cells.push({ x, y, seed: Math.random() * Math.PI * 2 });
      }
      light.x = w * 0.7; light.y = h * 0.35;
    }

    function frame() {
      t += 0.008;
      const r = host.getBoundingClientRect();
      const inside = !art && pointer.active && pointer.y >= r.top && pointer.y <= r.bottom && pointer.x >= r.left && pointer.x <= r.right;
      // With no pointer over it the light drifts like a slow sun, so the field never sits dead.
      const tx = inside ? pointer.x - r.left : w * (0.62 + 0.28 * Math.cos(t * 0.6));
      const ty = inside ? pointer.y - r.top : h * (0.38 + 0.2 * Math.sin(t * 0.9));
      light.x = lerp(light.x, tx, 0.08);
      light.y = lerp(light.y, ty, 0.08);
      const R = radius();

      ctx.clearRect(0, 0, w, h);
      for (const c of cells) {
        const d = Math.hypot(c.x + CW / 2 - light.x, c.y + CH / 2 - light.y);
        const glow = Math.max(0, 1 - d / R) ** 2;
        const base = 0.16 + 0.05 * Math.sin(t * 3 + c.seed);
        ctx.fillStyle = `rgba(${lerp(74, 124, glow) | 0}, ${lerp(104, 197, glow) | 0}, ${lerp(156, 192, glow) | 0}, ${base + glow * 0.7})`;
        ctx.fillRect(c.x, c.y, CW, CH);
        if (glow > 0.05) {
          // Cell lines only show close to the light, like glass catching sun
          ctx.strokeStyle = `rgba(214, 242, 238, ${glow * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(c.x + CW / 3, c.y); ctx.lineTo(c.x + CW / 3, c.y + CH);
          ctx.moveTo(c.x + 2 * CW / 3, c.y); ctx.lineTo(c.x + 2 * CW / 3, c.y + CH);
          ctx.moveTo(c.x, c.y + CH / 2); ctx.lineTo(c.x + CW, c.y + CH / 2);
          ctx.stroke();
        }
      }
      const g = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, R * 1.2);
      g.addColorStop(0, 'rgba(124, 197, 192, .18)');
      g.addColorStop(1, 'rgba(124, 197, 192, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function loop() {
      if (!visible || reduceMotion) { running = false; return; }
      frame();
      requestAnimationFrame(loop);
    }
    const start = () => { if (!running && !reduceMotion) { running = true; requestAnimationFrame(loop); } };

    layout();
    frame();
    let resizeTimer;
    addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { layout(); frame(); }, 150); });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }).observe(host);
  });

  /* ---------- Scroll reveal and counters ---------- */
  // Numbers ship in the HTML at their real value, so search engines, link previews and a
  // failed script all show them. Only figures still off screen are rewound to count up.
  const format = (n, decimals) => n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  function countUp(el) {
    const target = parseFloat(el.dataset.count), decimals = (el.dataset.count.split('.')[1] || '').length;
    const begin = performance.now(), dur = 1500;
    (function step(now) {
      const p = Math.min(1, (now - begin) / dur);
      el.textContent = format(target * (1 - (1 - p) ** 3), decimals);
      if (p < 1) requestAnimationFrame(step); else el.textContent = format(target, decimals);
    })(begin);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion');
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) { el.classList.add('in'); el.querySelectorAll('[data-count]').forEach(countUp); return; }
    el.querySelectorAll('[data-count]').forEach(n => { n.textContent = format(0, (n.dataset.count.split('.')[1] || '').length); });
    io.observe(el);
  });
})();
