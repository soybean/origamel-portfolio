// origamel — portfolio JS

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Active nav link based on scroll position ---
  const sections = document.querySelectorAll('.section, .footer[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  if (navAnchors.length && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }


  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const items = Array.from(document.querySelectorAll('.gallery__item'));
  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    lightboxImg.src = items[index].querySelector('img').src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function go(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    lightboxImg.src = items[currentIndex].querySelector('img').src;
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));

  lightbox.querySelector('.lightbox__close').addEventListener('click', close);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => go(-1));
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => go(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

});
