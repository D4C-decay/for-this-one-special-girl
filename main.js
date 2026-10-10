/* =========================================================================
   For This One Special Girl — main.js
   Corazón de "Te amo" en canvas + contador, carta, razones, secreto,
   música, compartir, lluvia de corazones y botón esquivo.
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
      songUrl: '',
      songLabel: 'Nuestra canción',
      languages: [{ code: 'es', text: 'Te amo' }],
      letter: '',
      reasons: [],
      secret: ''
    },
    window.LOVE_CONFIG || {}
  );

  const params = new URLSearchParams(location.search);
  const TO = params.get('to') || CFG.to;
  const FROM = params.get('from') || CFG.from;

  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  document.title = CFG.title;
  const titleEl = $('#title');
  if (titleEl) titleEl.textContent = CFG.title;
  const toLabel = $('#to-label');
  if (toLabel) toLabel.textContent = 'Para ' + TO;

  /* ---------------------------------------------------------------- estilos
     Keyframes de respaldo (por si el CSS no los trae). Inocuo si ya existen. */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ftsg-float-up{0%{transform:translateY(0) scale(.6);opacity:0}
      15%{opacity:.9}100%{transform:translateY(-115vh) scale(1.05);opacity:0}}
    @keyframes ftsg-fall{0%{transform:translateY(-10vh) rotate(0);opacity:1}
      100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
    @keyframes ftsg-beat{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    #floaters{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0}
    .ftsg-floater{position:absolute;bottom:-8vh;pointer-events:none;user-select:none;
      filter:drop-shadow(0 0 8px rgba(255,45,85,.55))}
    .ftsg-rain{position:fixed;top:0;pointer-events:none;z-index:60;user-select:none}
    .love-btn{transition:transform .25s ease, left .25s ease, top .25s ease}
    .love-btn.love-btn--fixed{position:fixed;z-index:75}
  `;
  document.head.appendChild(style);

  /* ------------------------------------------------------- corazón (canvas) */
  const canvas = $('#heart-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let W = 0;
  let H = 0;
  let DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    if (!canvas) return;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);

  // Puntos del corazón paramétrico (x=16sin^3 t, y=13cos t-5cos2t-2cos3t-cos4t)
  function heartPoints(n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      pts.push({ x, y });
    }
    return pts;
  }

  const WORDS = CFG.languages.length ? CFG.languages : [{ text: 'Te amo' }];
  const N = 260; // resolución de la curva
  const pts = heartPoints(N);
  const WORD_EVERY = 11; // una palabra cada N puntos => ~23 palabras
  let progress = 0;
  let wordIdx = 0;
  let lastStamp = 0;
  let beat = 0;

  function drawHeart(ts) {
    if (!ctx) return;
    const dt = Math.min((ts - lastStamp) / 1000 || 0, 0.05);
    lastStamp = ts;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + H * 0.03;
    const scale = Math.min(W, H) / 46; // encaja el corazón (~40u de alto)
    const pulse = reduceMotion ? 1 : 1 + Math.sin(beat) * 0.015;
    beat += 0.05;

    if (!reduceMotion && progress < 1) {
      progress = Math.min(1, progress + dt * 0.16);
    } else if (reduceMotion) {
      progress = 1;
    }

    const upto = Math.floor(progress * N);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= upto; i++) {
      if (i % WORD_EVERY !== 0) continue;
      const p = pts[i];
      const p2 = pts[(i + 1) % N];
      const x = cx + p.x * scale * pulse;
      const y = cy - p.y * scale * pulse;
      const ang = Math.atan2(-(p2.y - p.y), p2.x - p.x);
      const w = WORDS[wordIdx];
      wordIdx = (wordIdx + 1) % WORDS.length;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.font = '600 ' + Math.max(11, scale * 0.92) + 'px Quicksand, sans-serif';
      const grad = ctx.createLinearGradient(0, -8, 0, 8);
      grad.addColorStop(0, '#ffd7e4');
      grad.addColorStop(0.5, '#ff5f86');
      grad.addColorStop(1, '#ff2d55');
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(255,45,85,0.75)';
      ctx.shadowBlur = 14;
      ctx.fillText(w.text, 0, 0);
      ctx.restore();
    }

    // cabeza luminosa
    if (progress < 1 && upto > 0) {
      const hp = pts[upto % N];
      ctx.beginPath();
      ctx.arc(cx + hp.x * scale * pulse, cy - hp.y * scale * pulse, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(255,45,85,1)';
      ctx.shadowBlur = 22;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(drawHeart);
  }

  /* ----------------------------------------------- efecto máquina de escribir */
  function typingLoop() {
    const el = $('#typing');
    if (!el) return;
    let li = 0;
    let ci = 0;
    let deleting = false;

    function step() {
      const word = WORDS[li].text;
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 60 : 130;
      if (!deleting && ci === word.length) {
        deleting = true;
        delay = 1400;
      } else if (deleting && ci === 0) {
        deleting = false;
        li = (li + 1) % WORDS.length;
        delay = 350;
      }
      setTimeout(step, delay);
    }
    step();
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
      s.style.animation = `ftsg-float-up ${dur}s linear ${Math.random() * dur}s infinite`;
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
      s.style.animation = `ftsg-fall ${dur}s ease-in forwards`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), dur * 1000 + 50);
    }
  }

  /* ------------------------------------------------------------- contador */
  function renderCounter() {
    const el = $('#counter');
    if (!el) return;
    const since = new Date(CFG.since).getTime();
    const now = Date.now();
    let diff = Math.max(0, now - since);
    const dayMs = 86400000;
    const days = Math.floor(diff / dayMs);
    diff -= days * dayMs;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    const units = [
      ['Días', days],
      ['Horas', hours],
      ['Min', mins],
      ['Seg', secs]
    ];
    el.innerHTML = units
      .map(
        ([label, val]) =>
          `<span class="counter__unit"><b>${val}</b><small>${label}</small></span>`
      )
      .join('');
  }

  /* --------------------------------------------------------------- razones */
  function renderReasons() {
    const ul = $('#reasons');
    if (!ul || !CFG.reasons.length) return;
    CFG.reasons.forEach((r) => {
      const li = document.createElement('li');
      li.textContent = r;
      li.tabIndex = 0;
      const flip = () => li.classList.toggle('flipped');
      li.addEventListener('click', flip);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
      });
      ul.appendChild(li);
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

    // mantener pulsado en el panel
    const panel = $('#secret-panel');
    let holdTimer = null;
    const start = () => { holdTimer = setTimeout(revealSecret, 1200); };
    const stop = () => { clearTimeout(holdTimer); };
    if (panel) {
      panel.addEventListener('pointerdown', start);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => panel.addEventListener(ev, stop));
    }

    // sacudida (móvil)
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

  /* ---------------------------------------------------------------- música */
  function setupMusic() {
    const audio = $('#bg-audio');
    const btn = $('#music-btn');
    if (!audio || !btn) return;
    if (!CFG.songUrl) { btn.hidden = true; return; }
    audio.src = CFG.songUrl;
    audio.volume = 0.6;
    btn.hidden = false;
    btn.setAttribute('aria-label', CFG.songLabel);
    btn.addEventListener('click', () => {
      if (audio.paused) { audio.play().then(() => btn.classList.add('playing')).catch(() => {}); }
      else { audio.pause(); btn.classList.remove('playing'); }
    });
  }

  /* -------------------------------------------------------------- compartir */
  function setupShare() {
    const btn = $('#share-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const url = new URL(location.href);
      url.searchParams.set('to', TO);
      url.searchParams.set('from', FROM);
      const data = { title: CFG.title, text: `Un detalle para ${TO}`, url: url.toString() };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(url.toString()); btn.textContent = '✓'; setTimeout(() => (btn.textContent = '↗'), 1500); }
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
      const x = pad + Math.random() * (window.innerWidth - w - pad * 2);
      const y = pad + Math.random() * (window.innerHeight - h - pad * 2);
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
      heartRain(24);
    });
    const shrug = () => {
      if (escapes < maxEscapes) {
        escapes = maxEscapes;
        btn.textContent = 'Está bien… yo también te amo ❤';
      }
    };
    setTimeout(shrug, 25000);
  }

  /* ----------------------------------------------------------- revelado */
  function setupOpen() {
    const btn = $('#open-btn');
    const ids = ['#counter-panel', '#reasons-panel', '#letter-panel', '#secret-panel', '#love-panel'];
    if (!btn) return;
    btn.addEventListener('click', () => {
      btn.style.display = 'none';
      ids.forEach((id, i) => {
        setTimeout(() => {
          const el = $(id);
          if (el) el.hidden = false;
        }, i * 600);
      });
      const audio = $('#bg-audio');
      if (audio && CFG.songUrl) audio.play().then(() => $('#music-btn')?.classList.add('playing')).catch(() => {});
      heartRain(12);
    });
  }

  /* -------------------------------------------------------------- lluvia */
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('#envelope')) return;
    heartRain(6);
  });

  /* ------------------------------------------------------------------ init */
  function init() {
    resize();
    if (canvas) requestAnimationFrame(drawHeart);
    typingLoop();
    spawnFloaters();
    renderReasons();
    setupLetter();
    setupSecret();
    setupMusic();
    setupShare();
    setupLoveButton();
    setupOpen();
    if ($('#counter')) { renderCounter(); setInterval(renderCounter, 1000); }
    window.addEventListener('resize', () => {
      const c = $('#counter');
      if (c && !c.childElementCount) renderCounter();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
