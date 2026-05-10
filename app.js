// LUNLAND · cozy interactions

const SERVER_IP = '89.248.193.202:32251';

/* ---------- petals (cherry blossom rain) ---------- */
function spawnPetals(host, count = 26) {
  if (!host) return;
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

/* ---------- sparkle stars (floating in hero) ---------- */
function spawnSparkles(host, count = 8) {
  if (!host) return;
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

/* ---------- heart burst (on copy) ---------- */
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

/* ---------- magnetic button ---------- */
function bindMagnetic(el) {
  if (matchMedia('(hover: none)').matches) return;
  const STRENGTH = 14;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x / r.width) * STRENGTH}px, ${(y / r.height) * STRENGTH}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}

/* ---------- tilt-on-hover for tier cards ---------- */
function setupTilt(selector = '.tier-card') {
  if (matchMedia('(hover: none)').matches) return;
  document.querySelectorAll(selector).forEach((card) => {
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
  });
}

/* ---------- scroll-reveal header (home only) ---------- */
function setupScrollHeader() {
  if (!document.body.classList.contains('page-home')) return;
  const apply = () => {
    document.body.classList.toggle('is-scrolled', window.scrollY > 220);
  };
  apply();
  window.addEventListener('scroll', apply, { passive: true });
}

/* ---------- scroll reveal (sections fade in) ---------- */
function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  items.forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty('--delay', delay);
  });
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
}

/* ---------- mobile menu ---------- */
function setupMobileMenu() {
  const btn = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ---------- step lightbox (kak-zajti) ---------- */
const STEP_DATA = {
  1: {
    title: 'Выбери версию 1.21.11',
    desc: 'Открой Minecraft Launcher и в списке версий выбери 1.21.11 (Java Edition). Если её нет — нажми «+» / «Создать» и установи новую.'
  },
  2: {
    title: 'NeoForge или Fabric — по желанию',
    desc: 'Если хочешь общаться голосом — установи NeoForge (или Fabric) под 1.21.11 и добавь Voice-chat mod. Без них сервер тоже работает, просто без голоса.'
  },
  3: {
    title: 'Запусти Minecraft',
    desc: 'Жми «Играть» (или PLAY) в лаунчере и подожди, пока загрузятся ресурсы. На слабых ПК — до минуты.'
  },
  4: {
    title: 'Открой «Сетевая игра»',
    desc: 'В главном меню Minecraft выбери «Сетевая игра» — это вторая кнопка сверху, под «Одиночная игра».'
  },
  5: {
    title: 'Нажми «Добавить сервер»',
    desc: 'В нижней части экрана со списком серверов нажми кнопку «Добавить» (или «Добавить сервер»).'
  },
  6: {
    title: 'Введи имя и IP сервера',
    desc: 'Имя — любое, например «LUNLAND ♡». В поле «Адрес» вставь IP: 89.248.193.202:32251 и нажми «Готово».'
  },
  7: {
    title: 'Ура! Ты в LUNLAND ♡',
    desc: 'Сервер появится в списке — клик по нему, и ты на спавне в вишнёвой роще. Не забудь купить проходку и указать ник в Discord/админу.'
  }
};

function setupLightbox() {
  const lb = document.querySelector('[data-lightbox]');
  if (!lb) return;
  const stepEl = lb.querySelector('[data-lightbox-step]');
  const titleEl = lb.querySelector('[data-lightbox-title]');
  const descEl = lb.querySelector('[data-lightbox-desc]');
  const imgEl = lb.querySelector('[data-lightbox-img]');

  const open = (step) => {
    const data = STEP_DATA[step];
    if (!data) return;
    stepEl.textContent = String(step).padStart(2, '0');
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    imgEl.innerHTML = '';
    const tmpl = document.getElementById(`step-svg-${step}`);
    if (tmpl) {
      const node = tmpl.content.cloneNode(true);
      imgEl.appendChild(node);
    }
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-step]').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      open(Number(btn.dataset.step));
    })
  );
  lb.querySelector('[data-lightbox-close]').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('is-open')) close(); });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  spawnPetals(document.getElementById('petals'), 26);
  spawnSparkles(document.querySelector('.hero'), 10);

  document.querySelectorAll('[data-copy-ip]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const x = e.clientX || (el.getBoundingClientRect().left + el.offsetWidth / 2);
      const y = e.clientY || (el.getBoundingClientRect().top + el.offsetHeight / 2);
      copyIP();
      burstHearts(x, y);
    })
  );

  document.querySelectorAll('.magnetic').forEach(bindMagnetic);
  setupTilt('.tier-card');
  setupTilt('.feature-card');
  setupReveal();
  setupMobileMenu();
  setupScrollHeader();
  setupLightbox();
});
