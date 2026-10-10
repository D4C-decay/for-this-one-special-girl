/* =========================================================================
   For This One Special Girl — main.js
   Mariposas que siguen el cursor (canvas) + corazón latiendo + contador,
   carta, razones (voltear / mazo / rasca), secreto, canción en YouTube,
   compartir, lluvia de corazones, botón esquivo y jardín de tulipanes.
   Vanilla JS. Sin dependencias.
   ========================================================================= */
(() => {
  'use strict';

  const CFG = Object.assign(
    {
      title: 'For This One Special Girl',
      to: 'Mi amor',
      from: 'Tuyo',
      since: '2024-10-27T00:00:00',
      song: {},
      languages: [{ code: 'es', text: 'Te amo' }],
      letter: '',
      reasons: { flip: [], deck: [], scratch: [] },
      reasonFinal: '…y mil razones más ❤',
      secret: ''
    },
    window.LOVE_CONFIG || {}
  );

  const params = new URLSearchParams(location.search);
  const TO = params.get('to') || CFG.to;
  const FROM = params.get('from') || CFG.from;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
  }

  function setupText() {
    document.title = CFG.title;
    const titleEl = $('#title');
    if (titleEl) titleEl.textContent = CFG.title;
    const toLabel = $('#to-label');
    if (toLabel) toLabel.textContent = 'Para ' + TO;
    const dedication = $('#dedication-to');
    if (dedication) dedication.textContent = TO;
  }

  /* ---------------------------------------------------------------- estilos
     Keyframes de respaldo (por si el CSS no los trae). Inocuo si ya existen. */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ftsg-float-up{0%{transform:translateY(0) scale(.6);opacity:0}
      15%{opacity:.9}100%{transform:translateY(-115vh) scale(1.05);opacity:0}}
    @keyframes ftsg-fall{0%{transform:translateY(-10vh) rotate(0);opacity:1}
      100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
    #floaters{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:1}
    .ftsg-floater{position:absolute;bottom:-8vh;pointer-events:none;user-select:none;
      filter:drop-shadow(0 0 8px rgba(255,45,85,.55))}
    .ftsg-rain{position:fixed;top:0;pointer-events:none;z-index:60;user-select:none}
    .love-btn{transition:transform .25s ease, left .25s ease, top .25s ease}
    .love-btn.love-btn--fixed{position:fixed;z-index:75}
  `;
  document.head.appendChild(style);

  /* -------------------------------------------------------- mariposas (canvas) */
  const sky = $('#sky-canvas');
  const sctx = sky ? sky.getContext('2d') : null;
  let SW = 0;
  let SH = 0;
  const SDPR = Math.min(window.devicePixelRatio || 1, 2);

  function resizeSky() {
    if (!sky || !sctx) return;
    SW = window.innerWidth;
    SH = window.innerHeight;
    sky.width = Math.floor(SW * SDPR);
    sky.height = Math.floor(SH * SDPR);
    sky.style.width = SW + 'px';
    sky.style.height = SH + 'px';
    sctx.setTransform(SDPR, 0, 0, SDPR, 0, 0);
  }
  window.addEventListener('resize', resizeSky);

  const pointer = { x: 0, y: 0, active: false, down: false };
  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  });
  window.addEventListener('pointerdown', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.down = true;
  });
  window.addEventListener('pointerup', () => { pointer.down = false; });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (t) { pointer.x = t.clientX; pointer.y = t.clientY; pointer.active = true; }
  }, { passive: true });

  const HUES = [340, 350, 325, 300, 275, 15];

  class Butterfly {
    constructor(i) {
      const a = Math.random() * Math.PI * 2;
      const r = 90 + Math.random() * 240;
      this.x = window.innerWidth / 2 + Math.cos(a) * r;
      this.y = window.innerHeight / 2 + Math.sin(a) * r;
      this.vx = 0;
      this.vy = 0;
      this.angle = a;
      this.orbit = 40 + Math.random() * 150;
      this.speed = (0.3 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1);
      this.flap = Math.random() * Math.PI * 2;
      this.flapSpeed = 6 + Math.random() * 3;
      this.hue = HUES[i % HUES.length] + (Math.random() * 20 - 10);
      this.size = 10 + Math.random() * 10;
      this.wander = Math.random() * Math.PI * 2;
      this.heading = a;
    }
    update(dt) {
      this.wander += dt * 1.5;
      let tx;
      let ty;
      if (pointer.active) {
        this.angle += this.speed * dt;
        tx = pointer.x + Math.cos(this.angle) * this.orbit;
        ty = pointer.y + Math.sin(this.angle) * this.orbit;
      } else {
        tx = window.innerWidth / 2 + Math.cos(this.wander) * (SW * 0.26);
        ty = window.innerHeight / 2 + Math.sin(this.wander * 0.8) * (SH * 0.26);
      }
      const k = 2.2;
      this.vx += (tx - this.x) * k * dt;
      this.vy += (ty - this.y) * k * dt;
      this.vx *= 0.9;
      this.vy *= 0.9;
      if (pointer.down) {
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        this.vx += (dx / d) * 900 * dt;
        this.vy += (dy / d) * 900 * dt;
      }
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.flap += this.flapSpeed * dt;
      this.heading = Math.atan2(this.vy, this.vx);
    }
    draw() {
      if (!sctx) return;
      const s = this.size;
      const wing = 0.25 + 0.75 * Math.abs(Math.sin(this.flap));
      sctx.save();
      sctx.translate(this.x, this.y);
      sctx.rotate(this.heading + Math.PI / 2);
      sctx.globalAlpha = 0.9;
      sctx.shadowColor = 'hsla(' + this.hue + ',90%,65%,0.9)';
      sctx.shadowBlur = 12;
      const grad = sctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, 'hsla(' + this.hue + ',95%,80%,1)');
      grad.addColorStop(1, 'hsla(' + (this.hue - 15) + ',85%,55%,1)');
      sctx.fillStyle = grad;
      for (const dir of [-1, 1]) {
        sctx.beginPath();
        sctx.moveTo(0, 0);
        sctx.bezierCurveTo(dir * s * 0.7 * wing, -s * 0.9, dir * s * 1.25 * wing, -s * 0.5, 0, s * 0.05);
        sctx.bezierCurveTo(dir * s * 0.9 * wing, s * 0.1, dir * s * 0.4 * wing, s * 0.2, 0, s * 0.2);
        sctx.closePath();
        sctx.fill();
        sctx.beginPath();
        sctx.moveTo(0, s * 0.1);
        sctx.bezierCurveTo(dir * s * 0.6 * wing, s * 0.5, dir * s * 0.9 * wing, s, 0, s * 0.55);
        sctx.closePath();
        sctx.fill();
      }
      sctx.shadowBlur = 0;
      sctx.fillStyle = '#2a0a14';
      sctx.beginPath();
      sctx.ellipse(0, s * 0.1, s * 0.09, s * 0.5, 0, 0, Math.PI * 2);
      sctx.fill();
      sctx.strokeStyle = '#2a0a14';
      sctx.lineWidth = 1;
      sctx.beginPath();
      sctx.moveTo(0, -s * 0.35);
      sctx.quadraticCurveTo(-s * 0.2, -s * 0.8, -s * 0.3, -s * 0.9);
      sctx.moveTo(0, -s * 0.35);
      sctx.quadraticCurveTo(s * 0.2, -s * 0.8, s * 0.3, -s * 0.9);
      sctx.stroke();
      sctx.restore();
    }
  }

  let butterflies = [];
  function initButterflies() {
    const n = isTouch ? 6 : 10;
    butterflies = [];
    for (let i = 0; i < n; i++) butterflies.push(new Butterfly(i));
  }

  let lastSky = 0;
  function skyLoop(ts) {
    if (!sctx) return;
    const dt = Math.min((ts - lastSky) / 1000 || 0, 0.05);
    lastSky = ts;
    sctx.clearRect(0, 0, SW, SH);
    for (const b of butterflies) { b.update(dt); b.draw(); }
    requestAnimationFrame(skyLoop);
  }

  /* ----------------------------------------------- efecto máquina de escribir */
  function typingLoop() {
    const el = $('#typing');
    if (!el) return;
    const WORDS = CFG.languages.length ? CFG.languages : [{ text: 'Te amo' }];
    let li = 0;
    let ci = 0;
    let deleting = false;
    (function step() {
      const word = WORDS[li].text;
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 60 : 130;
      if (!deleting && ci === word.length) { deleting = true; delay = 1400; }
      else if (deleting && ci === 0) { deleting = false; li = (li + 1) % WORDS.length; delay = 350; }
      setTimeout(step, delay);
    })();
  }

  /* ---------------------------------------------------- corazones flotantes */
  function spawnFloaters() {
    const host = $('#floaters');
    if (!host || reduceMotion) return;
    const glyphs = ['❤', '♥', '❥', '💗', '💖'];
    const count = isTouch ? 12 : 20;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'ftsg-floater';
      s.textContent = glyphs[(i * 7) % glyphs.length];
      const size = 14 + Math.random() * 26;
      s.style.left = Math.random() * 100 + 'vw';
      s.style.fontSize = size + 'px';
      s.style.opacity = 0.25 + Math.random() * 0.5;
      const dur = 9 + Math.random() * 12;
      s.style.animation = 'ftsg-float-up ' + dur + 's linear ' + (Math.random() * dur) + 's infinite';
      host.appendChild(s);
    }
  }

  /* ----------------------------------------------------- lluvia de corazones */
  function heartRain(n = 14) {
    if (reduceMotion) n = 4;
    const glyphs = ['❤', '💖', '💗', '💕', '♥'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'ftsg-rain';
      s.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.fontSize = 16 + Math.random() * 26 + 'px';
      const dur = 1.6 + Math.random() * 1.6;
      s.style.animation = 'ftsg-fall ' + dur + 's ease-in forwards';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), dur * 1000 + 50);
    }
  }

  /* ------------------------------------------------------------- contador */
  function renderCounter() {
    const el = $('#counter');
    if (!el) return;
    let diff = Math.max(0, Date.now() - new Date(CFG.since).getTime());
    const dayMs = 86400000;
    const days = Math.floor(diff / dayMs);
    diff -= days * dayMs;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    const units = [['Días', days], ['Horas', hours], ['Min', mins], ['Seg', secs]];
    el.innerHTML = units
      .map(([label, val]) => '<span class="counter__unit"><b>' + val + '</b><small>' + label + '</small></span>')
      .join('');
  }

  /* ------------------------------------------------ razones 1: voltear */
  function renderFlipReasons() {
    const ul = $('#reasons');
    if (!ul) return;
    const list = (CFG.reasons && CFG.reasons.flip) || [];
    const icons = ['❤', '🌸', '✨', '🦋', '🌹', '💫', '🌟', '💖'];
    const hints = ['Descúbrelo', 'Ábreme', 'Toca aquí'];
    list.forEach((r, i) => {
      const li = document.createElement('li');
      li.className = 'reason-card';
      li.tabIndex = 0;
      li.innerHTML =
        '<div class="reason-card__inner">' +
          '<div class="reason-card__front">' +
            '<span class="reason-icon">' + icons[i % icons.length] + '</span>' +
            '<span class="reason-number">Razón ' + (i + 1) + '</span>' +
            '<span class="reason-hint">' + hints[i % hints.length] + '</span>' +
          '</div>' +
          '<div class="reason-card__back">' +
            '<span class="reason-text">' + escapeHtml(r) + '</span>' +
            '<span class="reason-stamp">❤</span>' +
          '</div>' +
        '</div>';
      const flip = () => li.classList.toggle('is-flipped');
      li.addEventListener('click', flip);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
      });
      ul.appendChild(li);
    });
  }

  /* --------------------------------------------- razones 2: mazo deslizable */
  function setupDeck() {
    const stack = $('#deck-stack');
    if (!stack) return;
    const list = ((CFG.reasons && CFG.reasons.deck) || []).slice();
    if (!list.length) return;
    list.push(CFG.reasonFinal || '…y mil razones más ❤');

    const dots = $('#deck-dots');
    const prevBtn = $('#deck-prev');
    const nextBtn = $('#deck-next');
    const n = list.length;

    const cards = list.map((text, i) => {
      const el = document.createElement('article');
      el.className = 'deck__card';
      const last = i === n - 1;
      el.innerHTML =
        '<span class="deck__badge">' + (last ? '∞' : 'Razón ' + (i + 1)) + '</span>' +
        '<p class="deck__text">' + escapeHtml(text) + '</p>';
      stack.appendChild(el);
      return el;
    });

    let top = 0;
    let busy = false;

    function layout() {
      cards.forEach((el, i) => {
        const d = (i - top + n) % n;
        el.style.transition = '';
        if (d > 3) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.transform = 'translateY(24px) scale(0.9)';
          el.style.zIndex = '0';
        } else {
          el.style.opacity = d === 0 ? '1' : d === 1 ? '0.92' : '0.78';
          el.style.pointerEvents = d === 0 ? 'auto' : 'none';
          el.style.zIndex = String(100 - d);
          el.style.transform =
            'translateY(' + d * 16 + 'px) scale(' + (1 - d * 0.055) + ') rotate(' + (d % 2 ? 2.5 : -2.5) * d + 'deg)';
        }
      });
      if (dots) {
        dots.innerHTML = '';
        cards.forEach((_, i) => {
          const s = document.createElement('span');
          s.className = 'deck__dot' + (i === top ? ' active' : '');
          dots.appendChild(s);
        });
      }
    }

    function flyAway(dir, nextTop) {
      if (busy) return;
      busy = true;
      const el = cards[top];
      el.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1), opacity .45s ease';
      el.style.transform = 'translateX(' + dir * 150 + '%) rotate(' + dir * 20 + 'deg)';
      el.style.opacity = '0';
      setTimeout(() => { top = nextTop; layout(); busy = false; }, 460);
    }
    const next = () => flyAway(-1, (top + 1) % n);
    const prev = () => flyAway(1, (top - 1 + n) % n);
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    let drag = false;
    let startX = 0;
    let dx = 0;
    stack.addEventListener('pointerdown', (e) => {
      if (busy) return;
      drag = true;
      startX = e.clientX;
      dx = 0;
      cards[top].style.transition = 'none';
      if (stack.setPointerCapture) stack.setPointerCapture(e.pointerId);
    });
    stack.addEventListener('pointermove', (e) => {
      if (!drag) return;
      dx = e.clientX - startX;
      cards[top].style.transform = 'translateX(' + dx + 'px) rotate(' + dx * 0.04 + 'deg)';
    });
    function endDrag() {
      if (!drag) return;
      drag = false;
      if (dx < -80) next();
      else if (dx > 80) prev();
      else { cards[top].style.transition = ''; layout(); }
    }
    stack.addEventListener('pointerup', endDrag);
    stack.addEventListener('pointercancel', endDrag);
    stack.addEventListener('pointerleave', endDrag);

    layout();
  }

  /* ------------------------------------------------ razones 3: rasca y gana */
  function setupScratch() {
    const host = $('#scratch');
    if (!host) return;
    const list = (CFG.reasons && CFG.reasons.scratch) || [];
    if (!list.length) return;

    list.forEach((text, i) => {
      const li = document.createElement('li');
      li.className = 'scratch-card';
      li.innerHTML =
        '<div class="scratch-card__text">' +
          '<span class="scratch-card__num">' + (i + 1) + '</span>' +
          escapeHtml(text) +
        '</div>' +
        '<canvas class="scratch-card__cover" aria-hidden="true"></canvas>';
      host.appendChild(li);

      if (reduceMotion) { li.classList.add('is-revealed'); return; }

      const canvas = li.querySelector('canvas');
      const c = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let ready = false;

      function paint() {
        const r = li.getBoundingClientRect();
        if (!r.width) return;
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        canvas.style.width = r.width + 'px';
        canvas.style.height = r.height + 'px';
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.globalCompositeOperation = 'source-over';
        const g = c.createLinearGradient(0, 0, r.width, r.height);
        g.addColorStop(0, '#ff2d55');
        g.addColorStop(1, '#ff8fa3');
        c.fillStyle = g;
        c.fillRect(0, 0, r.width, r.height);
        c.fillStyle = 'rgba(255,255,255,.95)';
        c.font = '700 15px Quicksand, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('Rasca aquí ✨', r.width / 2, r.height / 2);
        c.globalCompositeOperation = 'destination-out';
        ready = true;
      }
      requestAnimationFrame(paint);
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(() => {
          if (!li.classList.contains('is-revealed')) paint();
        }).observe(li);
      }

      let scratching = false;
      let ops = 0;
      const dot = (x, y) => { c.beginPath(); c.arc(x, y, 22, 0, Math.PI * 2); c.fill(); };
      const check = () => {
        const r = canvas.getBoundingClientRect();
        if (!r.width) return;
        let clear = 0;
        const samples = 60;
        for (let s = 0; s < samples; s++) {
          const x = Math.random() * r.width;
          const y = Math.random() * r.height;
          const px = Math.min(Math.floor(x * dpr), canvas.width - 1);
          const py = Math.min(Math.floor(y * dpr), canvas.height - 1);
          const d = c.getImageData(px, py, 1, 1).data;
          if (d[3] < 120) clear++;
        }
        if (clear / samples > 0.45) { li.classList.add('is-revealed'); scratching = false; }
      };
      canvas.addEventListener('pointerdown', (e) => {
        if (!ready) return;
        scratching = true;
        if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
        const r = canvas.getBoundingClientRect();
        dot(e.clientX - r.left, e.clientY - r.top);
        if (++ops % 5 === 0) check();
      });
      canvas.addEventListener('pointermove', (e) => {
        if (!scratching || !ready) return;
        const r = canvas.getBoundingClientRect();
        dot(e.clientX - r.left, e.clientY - r.top);
        if (++ops % 5 === 0) check();
      });
      ['pointerup', 'pointercancel'].forEach((ev) =>
        canvas.addEventListener(ev, () => { if (scratching) { scratching = false; check(); } })
      );
    });
  }

  /* ---------------------------------------------------------------- carta */
  function typeLetter() {
    const el = $('#letter');
    if (!el) return;
    el.hidden = false;
    el.textContent = '';
    const text = CFG.letter || '';
    let i = 0;
    (function step() {
      el.textContent = text.slice(0, i++);
      if (i <= text.length) setTimeout(step, 22);
    })();
  }
  function setupLetter() {
    const env = $('#envelope');
    if (!env) return;
    const open = () => {
      if (env.classList.contains('open')) return;
      env.classList.add('open');
      setTimeout(typeLetter, 500);
    };
    env.addEventListener('click', open);
    env.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }

  /* --------------------------------------------------------- mensaje secreto */
  function revealSecret() {
    const ov = $('#secret-overlay');
    const txt = $('#secret-text');
    if (!ov) return;
    if (txt) txt.textContent = CFG.secret || '';
    ov.hidden = false;
    ov.classList.add('show');
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    heartRain(18);
  }
  function setupSecret() {
    const ov = $('#secret-overlay');
    const close = $('#secret-close');
    if (close) close.addEventListener('click', () => { if (ov) { ov.hidden = true; ov.classList.remove('show'); } });
    if (ov) ov.addEventListener('click', (e) => { if (e.target === ov) ov.hidden = true; });

    const panel = $('#secret-panel');
    let holdTimer = null;
    const start = () => { holdTimer = setTimeout(revealSecret, 1200); };
    const stop = () => { clearTimeout(holdTimer); };
    if (panel) {
      panel.addEventListener('pointerdown', start);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => panel.addEventListener(ev, stop));
    }

    let last = { x: 0, y: 0, z: 0 };
    let lastShake = 0;
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => {
        const a = e.accelerationIncludingGravity;
        if (!a) return;
        const d = Math.abs(a.x - last.x) + Math.abs(a.y - last.y) + Math.abs(a.z - last.z);
        last = { x: a.x, y: a.y, z: a.z };
        const now = Date.now();
        if (d > 24 && now - lastShake > 1200) { lastShake = now; revealSecret(); }
      });
    }
  }

  /* -------------------------------------------------------- canción (YouTube) */
  function setupSong() {
    const link = $('#song-link');
    if (!link) return;
    const s = CFG.song || {};
    if (s.youtubeUrl) link.href = s.youtubeUrl;
    else link.style.display = 'none';
    const meta = $('#song-meta');
    if (meta) meta.textContent = s.title ? s.title + (s.artist ? ' — ' + s.artist : '') : '';
  }

  /* -------------------------------------------------------------- compartir */
  function setupShare() {
    const btn = $('#share-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const url = new URL(location.href);
      url.searchParams.set('to', TO);
      url.searchParams.set('from', FROM);
      const data = { title: CFG.title, text: 'Un detalle para ' + TO, url: url.toString() };
      try {
        if (navigator.share) await navigator.share(data);
        else {
          await navigator.clipboard.writeText(url.toString());
          btn.textContent = '✓';
          setTimeout(() => { btn.textContent = '↗'; }, 1500);
        }
      } catch (_) { /* cancelado */ }
    });
  }

  /* -------------------------------------------------------- botón esquivo */
  function setupLoveButton() {
    const btn = $('#love-btn');
    if (!btn) return;
    let escapes = 0;
    const maxEscapes = 5;
    const dodge = () => {
      if (escapes >= maxEscapes) return;
      escapes++;
      const pad = 16;
      const w = btn.offsetWidth || 140;
      const h = btn.offsetHeight || 52;
      const x = pad + Math.random() * Math.max(1, window.innerWidth - w - pad * 2);
      const y = pad + Math.random() * Math.max(1, window.innerHeight - h - pad * 2);
      btn.classList.add('love-btn--fixed');
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
    };
    document.addEventListener('pointermove', (e) => {
      if (isTouch || escapes >= maxEscapes) return;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 120) dodge();
    });
    btn.addEventListener('click', () => {
      if (escapes < maxEscapes) { dodge(); return; }
      btn.textContent = 'Yo también te amo ❤';
      btn.classList.add('surrendered');
      heartRain(28);
    });
    setTimeout(() => {
      if (escapes < maxEscapes) {
        escapes = maxEscapes;
        btn.textContent = 'Está bien… yo también te amo ❤';
        btn.classList.add('surrendered');
      }
    }, 25000);
  }

  /* ------------------------------------------- jardín de tulipanes (footer) */
  function setupGarden() {
    const host = $('#garden-flowers');
    if (!host) return;
    const colors = ['#ff2d55', '#ff6b9d', '#ffd166', '#ffffff', '#c084fc', '#fb7185', '#f97316'];
    const count = window.innerWidth < 540 ? 6 : 9;
    for (let i = 0; i < count; i++) {
      const t = document.createElement('div');
      t.className = 'tulip';
      t.style.setProperty('--tulip-color', colors[i % colors.length]);
      t.style.setProperty('--sway-delay', (Math.random() * 3).toFixed(2) + 's');
      t.style.setProperty('--bloom-delay', (Math.random() * 0.6).toFixed(2) + 's');
      t.innerHTML =
        '<div class="tulip__head">' +
          '<span class="petal petal--c"></span>' +
          '<span class="petal petal--l"></span>' +
          '<span class="petal petal--r"></span>' +
        '</div>' +
        '<div class="tulip__stem"></div>' +
        '<span class="tulip__leaf tulip__leaf--l"></span>' +
        '<span class="tulip__leaf tulip__leaf--r"></span>';
      host.appendChild(t);
    }

    const tulips = $$('.tulip');
    if (isTouch || reduceMotion) {
      if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add('is-open'); });
        }, { threshold: 0.35 });
        tulips.forEach((t) => io.observe(t));
      } else {
        tulips.forEach((t) => t.classList.add('is-open'));
      }
    } else {
      const radius = 150;
      window.addEventListener('pointermove', () => {
        tulips.forEach((t) => {
          const r = t.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height * 0.32;
          const d = Math.hypot(pointer.x - cx, pointer.y - cy);
          t.classList.toggle('is-open', d < radius);
        });
      });
    }
  }

  /* ----------------------------------------------------------- revelado */
  function setupOpen() {
    const btn = $('#open-btn');
    const ids = ['#counter-panel', '#reasons-panel', '#letter-panel', '#secret-panel', '#love-panel', '#song-panel'];
    if (!btn) return;
    btn.addEventListener('click', () => {
      btn.style.display = 'none';
      ids.forEach((id, i) => {
        setTimeout(() => {
          const el = $(id);
          if (el) el.hidden = false;
        }, i * 600);
      });
      heartRain(12);
    });
  }

  /* -------------------------------------------------------------- lluvia */
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('#envelope') || e.target.closest('canvas')) return;
    heartRain(6);
  });

  /* ------------------------------------------------------------------ init */
  function init() {
    resizeSky();
    setupText();
    typingLoop();
    spawnFloaters();
    renderFlipReasons();
    setupDeck();
    setupScratch();
    setupLetter();
    setupSecret();
    setupSong();
    setupShare();
    setupLoveButton();
    setupGarden();
    setupOpen();
    if ($('#counter')) { renderCounter(); setInterval(renderCounter, 1000); }
    initButterflies();
    if (sctx) {
      if (reduceMotion) { for (const b of butterflies) b.draw(); }
      else requestAnimationFrame(skyLoop);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
