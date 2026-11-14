/* Quiet section reveals; native page scrolling and no pinned/overlapping layouts. */
(() => {
  'use strict';
  const reduce = () =>
    window.heavenlyMotionAllowed?.() === false ||
    matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [
    ...document.querySelectorAll(
      '.heritage-section-heading,.complete-pilgrimage>*,.pricing-intro,.pricing-main,.faq-heading,.faq-item,.final-inner',
    ),
  ];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.04, rootMargin: '0px 0px 35px 0px' },
  );
  if (!reduce())
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('will-reveal');
        observer.observe(el);
      }
    });
  function showAll() {
    if (reduce()) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      observer.disconnect();
    }
  }
  window.addEventListener('motionchange', showAll);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', showAll);
  const header = document.querySelector('.site-header');
  let scrolled = false;
  function updateHeader() {
    const next = scrollY > 30;
    if (next !== scrolled) {
      scrolled = next;
      header.dataset.scrolled = String(next);
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
