(() => {
  'use strict';
  const dialog = document.getElementById('services-dialog'),
    openButton = document.getElementById('services-open');
  let lastFocus = null;
  function openServices() {
    if (dialog.open) return;
    lastFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
  }
  function closeServices() {
    if (dialog.open) dialog.close();
  }
  openButton.addEventListener('click', openServices);
  document.getElementById('services-secondary')?.addEventListener('click', openServices);
  document.getElementById('services-close').addEventListener('click', closeServices);
  dialog.addEventListener('close', () => {
    const anotherOpen = !!document.querySelector('dialog[open]');
    document.body.classList.toggle('modal-open', anotherOpen);
    if (!anotherOpen) lastFocus?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        closeServices();
    }
  });
  document.querySelectorAll('[data-enquiry]').forEach((button) =>
    button.addEventListener('click', () => {
      const kind = button.dataset.enquiry;
      const select = document.getElementById('service-request');
      select.value = kind;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      if (dialog.open) closeServices();
      requestAnimationFrame(() => {
        document.querySelector('.site-header [data-contact]').click();
      });
    }),
  );
  const cards = [...document.querySelectorAll('.package-card')],
    motion = matchMedia('(prefers-reduced-motion: reduce)');
  const allowed = () => !motion.matches && window.heavenlyMotionAllowed?.() !== false;
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('package-revealed');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12, rootMargin: '0px 0px -20px 0px' },
  );
  if (allowed())
    cards.forEach((card) => {
      card.classList.add('package-reveal-ready');
      observer.observe(card);
    });
  function revealAll() {
    if (!allowed()) {
      cards.forEach((card) => card.classList.add('package-revealed'));
      observer.disconnect();
    }
  }
  window.addEventListener('motionchange', revealAll);
  motion.addEventListener('change', revealAll);
  // A bounded image mask; scroll is native and frames run only when it changes.
  const stage = document.querySelector('.signature-mask-stage'),
    mask = document.querySelector('.signature-mask-image');
  let pending = 0;
  function updateMask() {
    pending = 0;
    if (!stage || !mask) return;
    if (!allowed()) {
      mask.style.clipPath = 'none';
      return;
    }
    const top = stage.getBoundingClientRect().top;
    if (top > innerHeight + 100 || top < -stage.offsetHeight) return;
    const p = Math.max(0, Math.min(1, (innerHeight - top) / (innerHeight * 0.9)));
    mask.style.clipPath = `inset(${(1 - p) * 10}% ${(1 - p) * 29}% round ${(1 - p) * 230}px)`;
  }
  function scheduleMask() {
    if (!pending) pending = requestAnimationFrame(updateMask);
  }
  addEventListener('scroll', scheduleMask, { passive: true });
  addEventListener('resize', scheduleMask, { passive: true });
  addEventListener('motionchange', scheduleMask);
  motion.addEventListener('change', scheduleMask);
  updateMask();
})();
