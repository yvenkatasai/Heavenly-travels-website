/* Floating trip navigation. Icons are original; links keep the existing flow. */
(() => {
  'use strict';
  const vehiclePage = /\/vehicles(?:\.html)?\/?$/.test(location.pathname);
  const nav = document.createElement('nav');
  nav.className = 'mobile-trip-nav';
  nav.setAttribute('aria-label', 'Trip shortcuts');
  const svg = (path) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
  const temple = svg(
    '<path d="M4 21h16M7 21V10h10v11M9 10V7h6v3M10 7V4h4v3M12 2v2M10 21v-5h4v5M5 13h14"/>',
  );
  const car = svg(
    '<path d="M4 17h16V11l-2-6H6l-2 6v6ZM4 11h16M5 17v3h3v-3m8 0v3h3v-3M7 14h2m6 0h2"/>',
  );
  const calendar = svg(
    '<rect x="4" y="5" width="16" height="16" rx="1"/><path d="M8 3v4m8-4v4M4 10h16M8 14h3m-3 3h7"/>',
  );
  nav.innerHTML = `
    <a href="${vehiclePage ? 'index.html' : ''}#package-types" data-shortcut="packages">
      ${temple}
      <span class="shortcut-label">Trips</span>
    </a>
    <button type="button" id="quick-vehicles" data-shortcut="vehicles">
      ${car}
      <span class="shortcut-label">Vehicles</span>
    </button>
    <a href="${vehiclePage ? 'index.html' : ''}#custom-trip" data-shortcut="plan">
      ${calendar}
      <span class="shortcut-label">Plan trip</span>
    </a>
  `;
  document.body.append(nav);
  document.body.classList.add('has-heritage-shortcuts');
  document.getElementById('quick-vehicles').onclick = () => {
    if (vehiclePage) {
      document.getElementById('vehicle-selection')?.scrollIntoView({ behavior: 'instant' });
    } else location.assign('/vehicles');
  };
  let selected,
    frame = 0;
  function select(value) {
    if (value === selected) return;
    selected = value;
    nav.querySelectorAll('[data-shortcut]').forEach((item) => {
      const active = item.dataset.shortcut === value;
      item.classList.toggle('is-current', active);
      if (active) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
  }
  function onScreen(id, line) {
    const el = document.getElementById(id);
    if (!el || el.hidden || el.closest('details:not([open])')) return false;
    const rect = el.getBoundingClientRect();
    return rect.height > 0 && rect.top <= line && rect.bottom > line;
  }
  function update() {
    frame = 0;
    if (document.body.classList.contains('modal-open')) return;
    if (vehiclePage) {
      select('vehicles');
      return;
    }
    const line = Math.min(innerHeight * 0.35, 220);
    if (onScreen('vehicles-panel', line) || onScreen('vehicle-selection', line)) {
      select('vehicles');
      return;
    }
    if (onScreen('custom-trip', line)) {
      select('plan');
      return;
    }
    select(
      ['package-types', 'pilgrimage', 'journeys', 'day-packages'].some((id) => onScreen(id, line))
        ? 'packages'
        : null,
    );
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('hashchange', schedule);
  addEventListener('popstate', schedule);
  document.addEventListener('click', schedule);
  document.addEventListener('toggle', schedule, true);
  const root = document.getElementById('main-content');
  if (root) new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
  schedule();
})();
