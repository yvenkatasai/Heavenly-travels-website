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
  const visibleCards = new Set(),
    imageReadiness = new WeakMap();
  function prepareImages(card) {
    return Promise.all(
      [...card.querySelectorAll('.package-visual img')].map((image) => {
        if (!imageReadiness.has(image)) {
          const ready = new Promise((resolve) => {
            if (image.complete) return resolve();
            const finish = () => {
              image.removeEventListener('load', finish);
              image.removeEventListener('error', finish);
              resolve();
            };
            image.addEventListener('load', finish);
            image.addEventListener('error', finish);
            // Fully masked lazy images may not load until after their reveal has finished.
            image.loading = 'eager';
          }).then(() => image.decode().catch(() => {}));
          imageReadiness.set(image, ready);
        }
        return imageReadiness.get(image);
      }),
    );
  }
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        prepareImages(entry.target);
        imageObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '600px 0px' },
  );
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleCards.add(entry.target);
          prepareImages(entry.target).then(() => {
            if (!visibleCards.has(entry.target) || !allowed()) return;
            entry.target.classList.add('package-revealed');
            observer.unobserve(entry.target);
            visibleCards.delete(entry.target);
          });
        } else visibleCards.delete(entry.target);
      }),
    { threshold: 0.12, rootMargin: '0px 0px -20px 0px' },
  );
  if (allowed())
    cards.forEach((card) => {
      card.classList.add('package-reveal-ready');
      imageObserver.observe(card);
      observer.observe(card);
    });
  function revealAll() {
    if (!allowed()) {
      cards.forEach((card) => card.classList.add('package-revealed'));
      observer.disconnect();
      imageObserver.disconnect();
      visibleCards.clear();
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
