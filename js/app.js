const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuToggle.textContent = isOpen ? '×' : '☰';
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.textContent = '☰';
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const modelFilters = [...document.querySelectorAll('.filter')];
const modelCards = [...document.querySelectorAll('.model-card')];
modelFilters.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.modelFilter;
    modelFilters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    modelCards.forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.type.split(' ').includes(filter);
    });
  });
});

const moreCars = document.getElementById('moreCars');
const extraCars = [...document.querySelectorAll('.extra-car')];
moreCars.addEventListener('click', () => {
  const showExtras = moreCars.getAttribute('aria-expanded') !== 'true';
  extraCars.forEach(card => { card.hidden = !showExtras; });
  moreCars.setAttribute('aria-expanded', String(showExtras));
  moreCars.innerHTML = showExtras ? 'Show Less <span>−</span>' : 'Read More <span>＋</span>';
});

const galleryFilters = [...document.querySelectorAll('.gallery-filter')];
const galleryItems = [...document.querySelectorAll('.gallery-item')];
galleryFilters.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.galleryFilter;
    galleryFilters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    galleryItems.forEach(item => {
      item.hidden = filter !== 'all' && !item.dataset.tags.split(' ').includes(filter);
    });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxSource = document.getElementById('lightboxSource');
const lightboxClose = document.getElementById('lightboxClose');
let lastGalleryButton = null;

function closeLightbox() {
  if (!lightbox.classList.contains('visible')) return;
  lightbox.classList.remove('visible');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (lastGalleryButton) lastGalleryButton.focus();
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const image = item.querySelector('img');
    lastGalleryButton = item;
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = item.dataset.caption;
    lightboxSource.href = item.dataset.source;
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    lightboxClose.focus();
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeLightbox();
});

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      mainNav.querySelectorAll('a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
