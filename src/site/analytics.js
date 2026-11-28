(() => {
  'use strict';
  const id = document.querySelector('meta[name="ga-measurement-id"]')?.content;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const key = 'heavenly-analytics-consent-v1';
  let consent = null;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (
      saved &&
      ['accepted', 'declined'].includes(saved.choice) &&
      Date.now() - saved.at < 180 * 86400000
    )
      consent = saved.choice;
  } catch {}
  let loaded = false;
  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.origin;
  const cleanLocation = new URL(canonical).origin + new URL(canonical).pathname;
  let referrer = '';
  try {
    if (document.referrer) referrer = new URL(document.referrer).origin;
  } catch {}
  const deniedAds = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  function gtag() {
    window.dataLayer.push(arguments);
  }
  function start() {
    window[`ga-disable-${id}`] = false;
    if (loaded) {
      gtag('consent', 'update', { ...deniedAds, analytics_storage: 'granted' });
      return;
    }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('consent', 'default', { ...deniedAds, analytics_storage: 'denied' });
    gtag('consent', 'update', { ...deniedAds, analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', id, {
      send_page_view: false,
      page_location: cleanLocation,
      page_referrer: referrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ads_data_redaction: true,
      cookie_domain: 'none',
      cookie_expires: 2592000,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    gtag('event', 'page_view', {
      page_location: cleanLocation,
      page_referrer: referrer,
      page_title: document.title,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(script);
  }
  function removeAnalyticsCookies() {
    for (const item of document.cookie.split(';')) {
      const name = item.split('=')[0].trim();
      if (!name.startsWith('_ga')) continue;
      for (const domain of ['', `;domain=${location.hostname}`, `;domain=.${location.hostname}`]) {
        document.cookie = `${name}=;Max-Age=0;path=/${domain};SameSite=Lax;Secure`;
      }
    }
  }
  const banner = document.createElement('section');
  banner.className = 'analytics-consent';
  banner.setAttribute('aria-label', 'Cookie choices');
  const text = document.createElement('p');
  text.textContent =
    'Allow optional cookies to help us understand how people use our website? We use Google Analytics to count visits, WhatsApp clicks and calls. Your trip details are not shared.';
  const actions = document.createElement('div');
  const privacy = document.createElement('a');
  privacy.href = '/privacy';
  privacy.textContent = 'Read privacy information';
  function choose(choice) {
    consent = choice;
    try {
      localStorage.setItem(key, JSON.stringify({ choice, at: Date.now() }));
    } catch {}
    banner.hidden = true;
    if (choice === 'accepted') start();
    else {
      window[`ga-disable-${id}`] = true;
      if (loaded) gtag('consent', 'update', { ...deniedAds, analytics_storage: 'denied' });
      removeAnalyticsCookies();
    }
  }
  for (const [label, choice] of [
    ['Allow cookies', 'accepted'],
    ['Reject optional cookies', 'declined'],
  ]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.onclick = () => choose(choice);
    actions.append(button);
  }
  banner.append(text, actions, privacy);
  banner.hidden = consent !== null;
  document.body.append(banner);
  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('button').focus();
    });
  });
  // Only the contact method is measured; never pass href, query strings or form values to Google.
  document.addEventListener(
    'click',
    (event) => {
      if (consent !== 'accepted') return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor) return;
      let method;
      try {
        const url = new URL(anchor.href);
        if (url.protocol === 'tel:') method = 'phone';
        else if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com')
          method = 'whatsapp';
      } catch {}
      if (method)
        gtag('event', `${method}_click`, {
          contact_method: method,
          page_location: cleanLocation,
          page_referrer: referrer,
          transport_type: 'beacon',
        });
    },
    true,
  );
  if (consent === 'accepted') start();
})();
