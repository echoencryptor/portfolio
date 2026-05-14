// ============ NAV: scrolled state + mobile menu + active links ============
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'certifications', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
  if (!hamburger || !mobileMenu) return;
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  const icon = hamburger.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-bars', !open);
    icon.classList.toggle('fa-xmark', open);
  }
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
}

function updateNavState() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);

  const y = window.scrollY + 130;
  let current = 'home';
  sections.forEach(section => {
    if (section.offsetTop <= y) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateNavState, { passive: true });
updateNavState();

// ============ TYPEWRITER ============
const phrases = [
  'IT professional',
  'Oracle Fusion ERP trainee',
  'Cybersecurity builder',
  'Python + SQL practitioner',
  'ML detection explorer'
];
const typed = document.getElementById('typed');
let pIdx = 0;
let cIdx = 0;
let deleting = false;

function tick() {
  if (!typed) return;
  const current = phrases[pIdx];

  if (!deleting) {
    cIdx += 1;
    typed.textContent = current.slice(0, cIdx);
    if (cIdx === current.length) {
      deleting = true;
      window.setTimeout(tick, 1500);
      return;
    }
  } else {
    cIdx -= 1;
    typed.textContent = current.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }

  window.setTimeout(tick, deleting ? 34 : 64);
}

tick();

// ============ INTERSECTION OBSERVER REVEAL ============
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('in');
    entry.target.querySelectorAll('.skill-card').forEach(card => {
      const fill = card.querySelector('.skill-fill');
      const pct = card.dataset.skill;
      if (fill && pct) fill.style.width = `${pct}%`;
    });
    io.unobserve(entry.target);
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

// ============ MATRIX BACKGROUND ============
(function matrix() {
  const canvas = document.getElementById('matrix-canvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  const chars = '01ABCDEFabcdef{}<>/$#SQLERPIDSML'.split('');
  const size = 14;
  let width;
  let height;
  let drops;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const cols = Math.ceil(width / size);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  }

  function draw() {
    ctx.fillStyle = 'rgba(7, 9, 13, 0.09)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${size}px JetBrains Mono, monospace`;

    drops.forEach((drop, index) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = index * size;
      const y = drop * size;
      ctx.fillStyle = Math.random() < 0.02 ? '#ffb454' : 'rgba(45, 252, 143, 0.78)';
      ctx.fillText(char, x, y);
      if (y > height && Math.random() > 0.975) drops[index] = 0;
      drops[index] += 1;
    });

    window.requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
})();

// ============ FOOTER YEAR ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
