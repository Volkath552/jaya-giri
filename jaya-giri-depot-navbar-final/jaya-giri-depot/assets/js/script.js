const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const header = document.querySelector('.site-header');

const setHeaderOffset = () => {
  const h = header?.offsetHeight || 0;
  document.documentElement.style.setProperty('--header-height', `${h}px`);
};
setHeaderOffset();
window.addEventListener('resize', setHeaderOffset, { passive: true });

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka menu');
    });
  });
}

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Smooth scroll + active navbar label that follows the visible section.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;

    // Logo always returns to the very top of the page.
    if (id === '#home') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', '#home');
      return;
    }

    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();

    const headerHeight = header?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    history.pushState(null, '', id);
  });
});

const navLinks = [...document.querySelectorAll('[data-section-link]')];
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.sectionLink))
  .filter(Boolean);

const activeObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navLinks.forEach((link) => {
    const isActive = link.dataset.sectionLink === visible.target.id;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, {
  rootMargin: `-${header?.offsetHeight || 76}px 0px -45% 0px`,
  threshold: [0.15, 0.35, 0.55]
});

sections.forEach((section) => activeObserver.observe(section));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
