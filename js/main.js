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
          history.replaceState(null, '', '#' + id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --- Gallery filters ---
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const allItems = Array.from(document.querySelectorAll('.gallery__item'));

  function getVisibleItems() {
    return allItems.filter(item => !item.classList.contains('hidden'));
  }

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        allItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- Newsletter inline submit ---
  const nlForm = document.querySelector('.newsletter');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const msg = nlForm.querySelector('.newsletter__msg');
      const btn = nlForm.querySelector('.newsletter__btn');
      const email = nlForm.querySelector('input[name="email"]');

      btn.disabled = true;
      btn.textContent = 'Subscribing\u2026';
      msg.textContent = '';
      msg.className = 'newsletter__msg';

      fetch(nlForm.action, {
        method: 'POST',
        body: new URLSearchParams({ email: email.value }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        if (res.ok || res.status === 303) {
          msg.textContent = 'Thanks for subscribing!';
          msg.classList.add('newsletter__msg--success');
          email.value = '';
        } else {
          msg.textContent = 'Something went wrong. Please try again.';
          msg.classList.add('newsletter__msg--error');
        }
      }).catch(() => {
        msg.textContent = 'Something went wrong. Please try again.';
        msg.classList.add('newsletter__msg--error');
      }).finally(() => {
        btn.disabled = false;
        btn.textContent = 'Subscribe';
      });
    });
  }

  // --- Back to top ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  let currentIndex = 0;

  function open(index) {
    const visible = getVisibleItems();
    currentIndex = index;
    lightboxImg.src = visible[index].querySelector('img').src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function go(dir) {
    const visible = getVisibleItems();
    currentIndex = (currentIndex + dir + visible.length) % visible.length;
    lightboxImg.src = visible[currentIndex].querySelector('img').src;
  }

  allItems.forEach(item => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      if (idx !== -1) open(idx);
    });
  });

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
