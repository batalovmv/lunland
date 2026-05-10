// LUNLAND · cozy interactions + SPA router

const SERVER_IP = '89.248.193.202:32251';

/* ===================================================================
   GLOBAL (mounted once) — petals, header, mobile menu, delegated
   handlers for copy-IP, lightbox, scroll header
   =================================================================== */

/* ---------- petals (cherry blossom rain) ---------- */
function spawnPetals(host, count = 26) {
  if (!host) return;
  host.innerHTML = '';
  const variants = 4;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const v = 1 + Math.floor(Math.random() * variants);
    p.className = `petal petal-${v}`;
    p.style.left = `${Math.random() * 100}%`;
    const dur = 10 + Math.random() * 14;
    p.style.setProperty('--dur', `${dur}s`);
    p.style.setProperty('--sway', `${(Math.random() * 260 - 130).toFixed(0)}px`);
    p.style.setProperty('--rot', `${(Math.random() * 720 + 360).toFixed(0)}deg`);
    p.style.animationDelay = `${-Math.random() * dur}s`;
    const scale = 0.5 + Math.random() * 1.3;
    p.style.transform = `scale(${scale})`;
    frag.appendChild(p);
  }
  host.appendChild(frag);
}

/* ---------- sparkles inside hero ---------- */
function spawnSparkles(host, count = 10) {
  if (!host) return;
  host.querySelectorAll(':scope > .sparkle').forEach((s) => s.remove());
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = ['✦', '✧', '✨', '⋆'][Math.floor(Math.random() * 4)];
    s.style.left = `${5 + Math.random() * 90}%`;
    s.style.top = `${10 + Math.random() * 70}%`;
    s.style.setProperty('--dur', `${2 + Math.random() * 3}s`);
    s.style.animationDelay = `${-Math.random() * 4}s`;
    s.style.fontSize = `${10 + Math.random() * 16}px`;
    frag.appendChild(s);
  }
  host.appendChild(frag);
}

/* ---------- heart burst on copy ---------- */
function burstHearts(x, y) {
  if (x == null || y == null) return;
  const COUNT = 9;
  const symbols = ['♡', '♥', '✿', '✦', '❀'];
  for (let i = 0; i < COUNT; i++) {
    const h = document.createElement('span');
    h.className = 'burst-heart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = `${x}px`;
    h.style.top = `${y}px`;
    const angle = (Math.PI * 2 * i) / COUNT + Math.random() * 0.6 - 0.3;
    const dist = 50 + Math.random() * 70;
    h.style.setProperty('--tx', `${(Math.cos(angle) * dist).toFixed(0)}px`);
    h.style.setProperty('--ty', `${(Math.sin(angle) * dist - 30).toFixed(0)}px`);
    h.style.setProperty('--rot', `${(Math.random() * 360 - 180).toFixed(0)}deg`);
    h.style.setProperty('--scale', `${0.6 + Math.random() * 0.9}`);
    h.style.fontSize = `${14 + Math.random() * 14}px`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1200);
  }
}

/* ---------- copy IP ---------- */
function copyIP() {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(SERVER_IP).then(showToast).catch(fallbackCopy);
  }
  fallbackCopy();
}
function fallbackCopy() {
  const ta = document.createElement('textarea');
  ta.value = SERVER_IP;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast(); } catch (_) {}
  ta.remove();
}

let toastTimer = null;
function showToast() {
  const t = document.querySelector('[data-toast]');
  if (!t) return;
  t.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2400);
}

/* ---------- magnetic & tilt ---------- */
function bindMagnetic(el) {
  if (matchMedia('(hover: none)').matches) return;
  if (el.dataset.magneticBound) return;
  el.dataset.magneticBound = '1';
  const STRENGTH = 14;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x / r.width) * STRENGTH}px, ${(y / r.height) * STRENGTH}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}

function bindTilt(card) {
  if (matchMedia('(hover: none)').matches) return;
  if (card.dataset.tiltBound) return;
  card.dataset.tiltBound = '1';
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty('--tilt-x', `${(py * -5).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${(px * 5).toFixed(2)}deg`);
    card.style.setProperty('--shimmer-x', `${((e.clientX - r.left) / r.width * 100).toFixed(0)}%`);
    card.style.setProperty('--shimmer-y', `${((e.clientY - r.top) / r.height * 100).toFixed(0)}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  });
}

/* ---------- scroll-reveal ---------- */
let revealObserver = null;
function setupReveal() {
  const items = document.querySelectorAll('.reveal:not(.is-visible)');
  items.forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty('--delay', delay);
  });
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  items.forEach((el) => revealObserver.observe(el));
}

/* ---------- mobile menu ---------- */
function setupMobileMenu() {
  const btn = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!btn || !nav || btn.dataset.menuBound) return;
  btn.dataset.menuBound = '1';
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

/* ---------- nav pill ---------- */
let navPillActive = null;
function setupNavPill() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  const links = nav.querySelectorAll('a');
  if (!links.length) return;
  if (matchMedia('(hover: none)').matches) return;
  let pill = nav.querySelector('.nav-pill');
  if (!pill) {
    pill = document.createElement('span');
    pill.className = 'nav-pill';
    nav.prepend(pill);
  }
  const moveTo = (el) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    nav.style.setProperty('--pill-x', `${(r.left - nr.left).toFixed(2)}px`);
    nav.style.setProperty('--pill-w', `${r.width.toFixed(2)}px`);
  };
  navPillActive = nav.querySelector('a.is-active') || links[0];
  requestAnimationFrame(() => moveTo(navPillActive));

  if (nav.dataset.pillBound) return;
  nav.dataset.pillBound = '1';

  links.forEach((a) => {
    a.addEventListener('mouseenter', () => {
      nav.classList.add('is-hovering');
      nav.querySelectorAll('a.pill-hover').forEach((x) => x.classList.remove('pill-hover'));
      a.classList.add('pill-hover');
      moveTo(a);
    });
  });
  nav.addEventListener('mouseleave', () => {
    nav.classList.remove('is-hovering');
    nav.querySelectorAll('a.pill-hover').forEach((x) => x.classList.remove('pill-hover'));
    moveTo(navPillActive);
  });
  window.addEventListener('resize', () => {
    moveTo(nav.querySelector('.pill-hover') || navPillActive);
  }, { passive: true });
}

/* ---------- fake live online ---------- */
let onlineInterval = null;
function setupFakeOnline() {
  if (onlineInterval) clearInterval(onlineInterval);
  const tick = () => {
    const els = document.querySelectorAll('[data-online]');
    if (!els.length) return;
    const n = 18 + Math.floor(Math.random() * 28);
    els.forEach((el) => (el.textContent = String(n)));
  };
  tick();
  onlineInterval = setInterval(tick, 4500);
}

/* ---------- lightbox (kak-zajti) ---------- */
const STEP_DATA = {
  1: { title: 'Выбираем нужную версию в лаунчере', desc: 'Открой Minecraft Launcher и в списке версий выбери 1.21.11 (Java Edition). Если её нет — нажми «+» / «Создать» и установи новую.' },
  2: { title: 'NeoForge / Fabric — по желанию', desc: 'Для голосового чата установи NeoForge (или Fabric) под 1.21.11 и Voice-chat mod. Без них сервер тоже работает — просто без голоса.' },
  3: { title: 'Запускаем игру', desc: 'Жми «Играть» в лаунчере и подожди, пока загрузятся ресурсы. На слабых ПК — до минуты.' },
  4: { title: 'Выбираем «Сетевая игра»', desc: 'В главном меню Minecraft — вторая кнопка сверху, под «Одиночная игра».' },
  5: { title: 'Нажимаем кнопку «Добавить»', desc: 'В нижней части экрана со списком серверов нажми «Добавить» (или «Добавить сервер»).' },
  6: { title: 'Вписываем имя и IP сервера', desc: 'Имя — любое, например «LUNLAND ♡». В поле «Адрес» вставь IP: 89.248.193.202:32251 и нажми «Готово».' },
  7: { title: 'Ура! У тебя всё получилось!', desc: 'Сервер появится в списке — клик по нему, и ты на спавне в вишнёвой роще. Не забудь купить проходку и указать ник.' }
};

function openLightbox(step) {
  const lb = document.querySelector('[data-lightbox]');
  if (!lb) return;
  const data = STEP_DATA[step];
  if (!data) return;
  lb.querySelector('[data-lightbox-step]').textContent = String(step).padStart(2, '0');
  lb.querySelector('[data-lightbox-title]').textContent = data.title;
  lb.querySelector('[data-lightbox-desc]').textContent = data.desc;
  const imgEl = lb.querySelector('[data-lightbox-img]');
  imgEl.innerHTML = '';
  const tmpl = document.getElementById(`step-svg-${step}`);
  if (tmpl) imgEl.appendChild(tmpl.content.cloneNode(true));
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.querySelector('[data-lightbox]');
  if (!lb) return;
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ===================================================================
   PER-PAGE INIT — runs once on initial load and on every SPA swap
   =================================================================== */
function initPage() {
  const hero = document.querySelector('.hero');
  if (hero) spawnSparkles(hero, 10);
  document.querySelectorAll('.magnetic').forEach(bindMagnetic);
  document.querySelectorAll('.tier-card, .feature-card').forEach(bindTilt);
  setupReveal();
  setupFakeOnline();
  setupNavPill();
}

/* ===================================================================
   ROUTER — SPA navigation with View Transitions API
   =================================================================== */
const pageCache = new Map();

function isInternalNav(href) {
  if (!href) return false;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  try {
    const u = new URL(href, location.href);
    if (u.origin !== location.origin) return false;
    return /\.html?($|\?|#)/i.test(u.pathname) || u.pathname === '/' || u.pathname.endsWith('/');
  } catch { return false; }
}

async function fetchPage(href) {
  if (pageCache.has(href)) return pageCache.get(href);
  const html = await fetch(href, { credentials: 'same-origin' }).then((r) => r.text());
  pageCache.set(href, html);
  return html;
}

function setActiveNav(url) {
  const pathLeaf = url.pathname.split('/').pop() || 'index.html';
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  nav.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const leaf = href.split('/').pop();
    a.classList.toggle('is-active', leaf === pathLeaf || (pathLeaf === '' && leaf === 'index.html'));
  });
}

async function swapTo(url, { push } = { push: true }) {
  let html;
  try {
    html = await fetchPage(url.href);
  } catch (e) {
    location.href = url.href;
    return;
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Pre-transition: switch nav active immediately so old/new view
  // snapshots both render the same active button (no crossfade ghost).
  setActiveNav(url);

  const doSwap = () => {
    document.title = doc.title;

    const newPage = doc.body.dataset.page || '';
    if (newPage) document.body.dataset.page = newPage;
    else delete document.body.dataset.page;
    document.body.classList.toggle('page-home', doc.body.classList.contains('page-home'));
    document.body.classList.toggle('page-inner', doc.body.classList.contains('page-inner'));

    const newMain = doc.querySelector('main');
    const oldMain = document.querySelector('main');
    if (newMain && oldMain) oldMain.replaceWith(newMain);

    if (push) history.pushState({ url: url.href }, '', url.href);
    window.scrollTo(0, 0);
  };

  if (document.startViewTransition) {
    await document.startViewTransition(() => {
      doSwap();
      initPage();
    }).finished.catch(() => {});
  } else {
    document.body.classList.add('page-leaving');
    await new Promise((r) => setTimeout(r, 240));
    doSwap();
    initPage();
    document.body.classList.remove('page-leaving');
  }
}

function setupRouter() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (!isInternalNav(href)) return;
    const url = new URL(href, location.href);
    if (url.pathname === location.pathname && !url.hash) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    // Instant visual feedback: switch active pill *now*, before fetch
    setActiveNav(url);
    swapTo(url, { push: true });
  });

  window.addEventListener('popstate', () => {
    const url = new URL(location.href);
    setActiveNav(url);
    swapTo(url, { push: false });
  });
}

/* ===================================================================
   DELEGATED CLICK HANDLERS (work after SPA swap automatically)
   =================================================================== */
function setupGlobalDelegation() {
  document.addEventListener('click', (e) => {
    // copy IP
    const copyBtn = e.target.closest('[data-copy-ip]');
    if (copyBtn) {
      e.preventDefault();
      const x = e.clientX || (copyBtn.getBoundingClientRect().left + copyBtn.offsetWidth / 2);
      const y = e.clientY || (copyBtn.getBoundingClientRect().top + copyBtn.offsetHeight / 2);
      copyIP();
      burstHearts(x, y);
      return;
    }
    // lightbox open
    const stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      e.preventDefault();
      openLightbox(Number(stepBtn.dataset.step));
      return;
    }
    // lightbox close
    const closeBtn = e.target.closest('[data-lightbox-close]');
    if (closeBtn) { closeLightbox(); return; }
    // backdrop click
    if (e.target.matches('.lightbox.is-open')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lb = document.querySelector('.lightbox.is-open');
      if (lb) closeLightbox();
    }
  });
}

/* ===================================================================
   BOOT
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 26);
  setupGlobalDelegation();
  setupMobileMenu();
  setupRouter();
  initPage();
});
