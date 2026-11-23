(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  $('#header-vehicles').onclick = () => {
    setTab(1);
    location.assign('vehicles.html');
  };
  const state = { tour: '', vehicle: '', stops: [], date: '', flexible: false };
  let saved = {};
  // Saved booking details are a convenience; browsers may disable session storage.
  try {
    saved = JSON.parse(sessionStorage.getItem('heavenly-v3-trip') || '{}');
  } catch {}
  const store = () => {
    try {
      sessionStorage.setItem(
        'heavenly-v3-trip',
        JSON.stringify({
          ...state,
          fields: Object.fromEntries(
            [
              'name',
              'phone',
              'pickup',
              'dropoff',
              'people',
              'notes',
              'service-request',
              'accommodation',
            ].map((id) => [id, $('#' + id).value]),
          ),
        }),
      );
    } catch {}
  };
  document.querySelectorAll('a[href^="#"]').forEach((link) =>
    link.addEventListener('click', (e) => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      const fold = target.closest('details');
      if (fold) fold.open = true;
      e.preventDefault();
      history.pushState(null, '', link.hash);
      const distance = Math.abs(target.getBoundingClientRect().top);
      target.scrollIntoView({
        behavior: distance > innerHeight * 2 || !motion() ? 'instant' : 'smooth',
      });
    }),
  );
  const option = (value, text) => new Option(text, value);
  tours.forEach((t, i) => {
    $('#tour-select').add(option(i, t.name));
    const card = document.querySelector(`[data-package-index="${i}"]`);
    card.querySelector('.package-plan').onclick = (event) => {
      event.preventDefault();
      chooseTour(String(i));
      setTab(0);
      location.assign('vehicles.html?package=tour-' + (i + 1));
    };
  });
  const customCard = document.createElement('article');
  customCard.id = 'custom-trip-card';
  customCard.className = 'tour-mini package-card custom-trip-card';
  customCard.setAttribute('aria-labelledby', 'custom-trip-card-title');
  // Reuse trip photos for the collage rather than adding a duplicate image asset.
  const collageImages = TOUR_IMAGES.slice(0, 4)
    .map((image) => `<img src="assets/${image}" alt="" loading="lazy" width="900" height="1000">`)
    .join('');
  customCard.innerHTML = `
    <div class="package-visual">
      <div class="custom-trip-collage" aria-hidden="true">${collageImages}</div>
      <span class="package-image-caption">YOUR ROUTE / YOUR PACE</span>
    </div>
    <div class="package-copy">
      <div class="package-number">
        <span>MAKE IT YOURS</span>
        <strong>+</strong>
        <span>YOUR TRIP</span>
      </div>
      <p class="package-type">CUSTOM TEMPLE TRIP</p>
      <h3 id="custom-trip-card-title">Customize your trip</h3>
      <p class="custom-trip-card-note">
        Start with every stop selected, then remove any you do not want.
      </p>
      <div class="package-actions">
        <button
          type="button"
          class="button primary"
          id="build-custom-plan"
          aria-controls="custom-plan-fold"
          aria-expanded="false"
        >
          Build my custom plan
        </button>
        <span>Choose your temple stops. Travel at your own pace.</span>
      </div>
    </div>
  `;
  $('#tour-rail').append(customCard);
  const customPlan = $('#custom-plan-fold'),
    customPlanSlot = $('#custom-plan-slot');
  // The card is the only planner entry point; reveal the shared form when requested.
  if (customPlan && customPlanSlot) customPlanSlot.append(customPlan);
  customCard.querySelector('#build-custom-plan').onclick = () => {
    ensureTempleContext();
    state.tour = 'custom';
    // Custom requests start with every supported stop selected; visitors can remove any.
    state.stops = STOPS.map((_, i) => i);
    $('#tour-select').value = 'custom';
    render();
    updateInclusions();
    setTab(0);
    if (customPlan) {
      customPlan.hidden = false;
      customCard.querySelector('#build-custom-plan').setAttribute('aria-expanded', 'true');
    }
    $('#stops-details').open = true;
    $('#custom-trip').scrollIntoView({ behavior: motion() ? 'smooth' : 'instant', block: 'start' });
    requestAnimationFrame(() => $('#stops-details summary').focus({ preventScroll: true }));
  };
  $('#tour-select').add(option('custom', 'Build a custom trip'));
  const inclusions = document.createElement('details');
  inclusions.id = 'tour-inclusions';
  inclusions.className = 'tour-inclusions';
  inclusions.hidden = true;
  inclusions.innerHTML = '<summary>What this tour includes</summary><ul></ul>';
  $('#tour-description').after(inclusions);
  $('#tour-select').addEventListener('change', updateInclusions);
  function updateInclusions() {
    inclusions.hidden = state.tour === '' || state.tour === 'custom';
    inclusions.querySelector('ul').replaceChildren();
    if (!inclusions.hidden)
      tours[Number(state.tour)].includes.forEach((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        inclusions.querySelector('ul').append(li);
      });
  }

  VEHICLES.forEach((v, i) => {
    $('#vehicle-select').add(option(i, v.name));
    const el = document.createElement('article');
    el.className = 'vehicle-option';
    el.innerHTML = `
      <span class="mono">${v.tag}</span>
      <svg
        class="vehicle-art"
        viewBox="0 0 300 130"
        aria-hidden="true"
      >
        <path
          d="M30 86V65Q30 54 44 51L${i > 1 ? '64 25H230L253 52' : '91 27H190L222 52'}Q269 55 273 73V96H30Z"
          fill="#e8d9b8"
          stroke="#183c31"
          stroke-width="2"
        />
        <path
          d="M${i > 1 ? '75 36H218V57H68' : '99 36H182L205 58H78'}Z"
          fill="#fafafa"
          stroke="#183c31"
          stroke-width="2"
        />
        <path d="M150 35V60M33 75H267" fill="none" stroke="#183c31" stroke-width="2" />
        <circle cx="78" cy="96" r="19" fill="#183c31" />
        <circle cx="225" cy="96" r="19" fill="#183c31" />
        <circle cx="78" cy="96" r="8" fill="#fafafa" />
        <circle cx="225" cy="96" r="8" fill="#fafafa" />
      </svg>
      <h3>${v.name}</h3>
      <p>${v.description}</p>
      <button class="button primary" type="button">Discuss this vehicle ↗</button>
    `;
    el.querySelector('button').onclick = () => {
      ensureTempleContext();
      state.vehicle = String(i);
      $('#vehicle-select').value = i;
      render();
      openContact();
    };
    $('#vehicle-grid').append(el);
  });
  STOPS.forEach(([name, region], i) => {
    const label = document.createElement('label');
    label.className = 'stop-option';
    label.innerHTML = `
      <input type="checkbox" value="${i}">
      <span>
        <strong>${name}</strong>
        <small>${region}</small>
      </span>
    `;
    label.querySelector('input').onchange = (e) => {
      if (state.tour === '') {
        state.tour = 'custom';
        $('#tour-select').value = 'custom';
      }
      state.stops = e.target.checked
        ? [...new Set([...state.stops, i])]
        : state.stops.filter((n) => n !== i);
      render();
    };
    $('#stops-options').append(label);
  });
  function ensureTempleContext() {
    const request = $('#service-request');
    if (
      !['Temple tour', 'Group package', 'Custom multi-day South India tour'].includes(request.value)
    ) {
      request.value = 'Temple tour';
      request.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  function chooseTour(value) {
    ensureTempleContext();
    state.tour = value;
    state.stops = value === 'custom' || value === '' ? [] : [...ROUTES[Number(value)]];
    $('#tour-select').value = value;
    render();
    updateInclusions();
  }
  function dateLabel() {
    return state.flexible
      ? 'Flexible / to be discussed'
      : state.date
        ? new Date(state.date + 'T12:00:00').toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Not decided yet';
  }
  function tourLabel() {
    return state.tour === 'custom'
      ? 'Custom temple route'
      : state.tour === ''
        ? 'Help me choose a route'
        : tours[Number(state.tour)].name;
  }
  function render() {
    const chosen = state.tour !== '';
    $('#stops-summary').textContent = state.stops.length
      ? `${state.stops.length} temple stop${state.stops.length === 1 ? '' : 's'} selected`
      : 'Choose the temple stops you want to visit';
    $('#stops-options')
      .querySelectorAll('input')
      .forEach((c, i) => (c.checked = state.stops.includes(i)));
    $('#tour-description').hidden = !chosen;
    $('#tour-description').textContent =
      state.tour === 'custom'
        ? 'Choose the temple stops you want to visit. Our team will help arrange the route.'
        : chosen
          ? tours[Number(state.tour)].description
          : '';
    $('#reset-route').hidden = !chosen || state.tour === 'custom';
    $('#route-ready').hidden = !chosen;
    $('#stops-step').classList.toggle('pending', !chosen);
    $('#route-error').hidden = true;
    $('#summary-tour').textContent = tourLabel();
    $('#summary-vehicle').textContent =
      state.vehicle === '' ? 'Help me choose' : VEHICLES[Number(state.vehicle)].name;
    $('#summary-date').textContent = dateLabel();
    $('#summary-stops').textContent = state.stops.map((i) => STOPS[i][0]).join(' → ');
    $('#pricing-helper').textContent = chosen
      ? 'Your route is ready. Share your travel needs with our team.'
      : 'Choose a route or ask us to help plan your trip.';
    store();
  }
  $('#tour-select').onchange = (e) => chooseTour(e.target.value);
  $('#vehicle-select').onchange = (e) => {
    state.vehicle = e.target.value;
    render();
  };
  $('#reset-route').onclick = () => chooseTour(state.tour);
  const now = new Date(),
    localDate = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $('#travel-date').min = localDate;
  $('#travel-date').onchange = (e) => {
    state.date = e.target.value;
    render();
  };
  $('#flexible-date').onchange = (e) => {
    state.flexible = e.target.checked;
    $('#travel-date').disabled = state.flexible;
    render();
  };
  function setTab(index, focus = false) {
    ['trip', 'vehicles'].forEach((name, i) => {
      const tab = $('#' + name + '-tab'),
        panel = $('#' + name + '-panel');
      tab.setAttribute('aria-selected', i === index);
      tab.tabIndex = i === index ? 0 : -1;
      panel.hidden = i !== index;
      if (i === index && focus) tab.focus();
    });
  }
  document.querySelectorAll('[role=tab]').forEach((tab, i) => {
    tab.onclick = () => setTab(i);
    tab.onkeydown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        setTab(e.key === 'Home' ? 0 : e.key === 'End' ? 1 : 1 - i, true);
      }
    };
  });
  let returnFocus;
  function openDialog(id) {
    const dialog = $(id);
    returnFocus = document.activeElement;
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function closeDialog(id) {
    const d = $(id);
    if (id === '#reel-dialog') $('#journey-film').pause();
    if (d.open) d.close();
  }
  document.querySelectorAll('dialog').forEach((d) => {
    d.addEventListener('close', () => {
      const anotherOpen = !!document.querySelector('dialog[open]');
      document.body.classList.toggle('modal-open', anotherOpen);
      if (!anotherOpen) returnFocus?.focus({ preventScroll: true });
      if (d.id === 'reel-dialog') $('#journey-film').pause();
    });
    d.addEventListener('click', (e) => {
      if (e.target === d && d.id !== 'contact-dialog') d.close();
    });
  });
  function openContact() {
    render();
    openDialog('#contact-dialog');
  }
  document.querySelectorAll('[data-contact]').forEach((b) => (b.onclick = openContact));
  $('#contact-close').onclick = () => closeDialog('#contact-dialog');
  $('#request-plan').onclick = () => {
    ensureTempleContext();
    if (!state.stops.length) {
      $('#route-error').hidden = false;
      $('#stops-details').open = true;
      $('#stops-details summary').focus();
      return;
    }
    if (!$('#travel-date').reportValidity()) return;
    openContact();
  };
  $('#edit-plan').onclick = () => {
    returnFocus = $('#tour-select');
    closeDialog('#contact-dialog');
    setTab(0);
    if (customPlan) customPlan.hidden = false;
    customCard.querySelector('#build-custom-plan').setAttribute('aria-expanded', 'true');
    $('#custom-trip').scrollIntoView();
    $('#tour-select').focus({ preventScroll: true });
  };
  [
    'name',
    'phone',
    'pickup',
    'dropoff',
    'people',
    'notes',
    'service-request',
    'accommodation',
  ].forEach((id) => {
    $('#' + id).addEventListener('input', store);
    if (saved.fields && typeof saved.fields[id] === 'string') $('#' + id).value = saved.fields[id];
  });
  function stepPeople(delta) {
    const input = $('#people');
    input.value = Math.min(
      200,
      Math.max(Number(input.min) || 1, (Number(input.value) || Number(input.min) || 1) + delta),
    );
    store();
  }
  $('#people-minus').onclick = () => stepPeople(-1);
  $('#people-plus').onclick = () => stepPeople(1);
  $('#enquiry-form').onsubmit = (e) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    const nonTemple =
        $('#service-request').value.includes('flights') ||
        $('#service-request').value === 'Hotel & accommodation',
      flight = $('#service-request').value.includes('flights');
    const nl = String.fromCharCode(10),
      lines = [
        'Hello Heavenly Tours & Travels, I need help planning a trip.',
        `Name: ${$('#name').value.trim()}`,
        $('#phone').value.trim() ? `Phone: ${$('#phone').value.trim()}` : '',
        `Service requested: ${$('#service-request').selectedOptions[0].text}`,
        nonTemple ? '' : `Route: ${tourLabel()}`,
        nonTemple
          ? ''
          : `Vehicle: ${state.vehicle === '' ? 'Please help me choose' : VEHICLES[Number(state.vehicle)].name}`,
        `People: ${$('#people').value}`,
        `Accommodation: ${$('#accommodation').value}`,
        `Date: ${nonTemple ? 'Please see additional requests or discuss with me' : dateLabel()}`,
        `${nonTemple ? (flight ? 'Departure' : 'Hotel destination') : 'Pickup'}: ${$('#pickup').value.trim()}`,
        `${nonTemple ? (flight ? 'Destination' : 'Preferred hotel') : 'Drop-off'}: ${$('#dropoff').value.trim() || (nonTemple ? 'Not decided yet' : $('#pickup').value.trim())}`,
        nonTemple
          ? ''
          : `Temple stops: ${state.stops.map((i) => STOPS[i][0]).join(' → ') || 'Please help me plan'}`,
        $('#notes').value.trim() ? `Additional requests: ${$('#notes').value.trim()}` : '',
      ];
    const a = document.createElement('a');
    a.href =
      'https://wa.me/919700181493?text=' + encodeURIComponent(lines.filter(Boolean).join(nl));
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.append(a);
    a.click();
    a.remove();
    $('#form-status').textContent = 'Your message is ready in WhatsApp. Check it and tap Send.';
    store();
  };
  const serviceRequest = $('#service-request');
  function setGroupMode() {
    const group = serviceRequest.value === 'Group package';
    $('#people').min = '2';
    $('#group-size-note').hidden = !group;
    window.dispatchEvent(new CustomEvent('heavenly:service', { detail: serviceRequest.value }));
    if (Number($('#people').value) < 2) $('#people').value = '2';
    const flight = serviceRequest.value.includes('flights'),
      hotel = serviceRequest.value === 'Hotel & accommodation';
    $('.trip-summary').hidden = flight || hotel;
    const pickupLabel = flight
      ? 'City or airport you leave from'
      : hotel
        ? 'City for your hotel'
        : 'Pickup place';
    $('#pickup').placeholder = pickupLabel + '*';
    document.querySelector('label[for="pickup"]').textContent = pickupLabel + ', required';
    $('#dropoff').placeholder = flight
      ? 'City or airport you are going to'
      : hotel
        ? 'Hotel name, if you have one'
        : 'Drop-off (leave empty for the same place)';
    document.querySelector('label[for="dropoff"]').textContent = flight
      ? 'Destination city or airport, optional'
      : hotel
        ? 'Preferred hotel, optional'
        : 'Drop-off location, optional';
    $('#notes').placeholder = flight
      ? 'Travel dates, airline name if you have one, and anything else you need…'
      : hotel
        ? 'Travel dates, number of rooms, and anything else you need…'
        : 'Anything else? Older travellers, luggage, hotel help, preferred language…';
    store();
  }
  serviceRequest.addEventListener('change', setGroupMode);
  setGroupMode();
  document.querySelectorAll('#faq-list .faq-item').forEach((article) => {
    const button = article.querySelector('button');
    const answer = article.querySelector('.faq-answer');
    button.onclick = () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      answer.getAnimations().forEach((animation) => animation.cancel());
      answer.hidden = !open;
      if (open && motion()) {
        answer.animate(
          [
            { opacity: 0, transform: 'translateY(-8px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 300, easing: 'ease-out' },
        );
      }
    };
  });
  document.querySelectorAll('.pink-steps,.pink-fan,.pink-circles,.pink-diamonds').forEach((el) => {
    for (let i = 0; i < (el.classList.contains('pink-circles') ? 5 : 9); i++) {
      const shape = document.createElement('i');
      shape.style.setProperty('--i', i);
      el.append(shape);
    }
  });
  window.heavenlyMotionPaused = false;
  function motion() {
    return !matchMedia('(prefers-reduced-motion: reduce)').matches && !window.heavenlyMotionPaused;
  }
  window.heavenlyMotionAllowed = motion;
  $('#credits-open').onclick = () => openDialog('#credits-dialog');
  $('#credits-close').onclick = () => closeDialog('#credits-dialog');
  $('#motion-toggle').onclick = (e) => {
    window.heavenlyMotionPaused = !window.heavenlyMotionPaused;
    document.documentElement.classList.toggle('motion-paused', window.heavenlyMotionPaused);
    e.currentTarget.setAttribute('aria-pressed', window.heavenlyMotionPaused);
    e.currentTarget.textContent = window.heavenlyMotionPaused
      ? 'Resume decorative motion'
      : 'Pause decorative motion';
    window.dispatchEvent(new Event('motionchange'));
    updateVideos();
  };
  $('#showreel-open').onclick = () => {
    const v = $('#journey-film');
    if (!v.src) {
      v.poster = v.dataset.poster;
      v.src = v.dataset.src;
    }
    openDialog('#reel-dialog');
    v.play().catch(() => {});
  };
  $('#reel-close').onclick = () => closeDialog('#reel-dialog');
  const videos = [...document.querySelectorAll('[data-lazy-video]')];
  function updateVideos() {
    videos.forEach((v) => {
      const visible =
        v.getBoundingClientRect().bottom > 0 && v.getBoundingClientRect().top < innerHeight;
      // Load only while onscreen, visible, motion-enabled, and not data-saving.
      if (visible && motion() && !document.hidden && !navigator.connection?.saveData) {
        if (!v.src) v.src = v.dataset.lazyVideo;
        v.play().catch(() => {});
      } else v.pause();
    });
  }
  const observer = new IntersectionObserver(updateVideos);
  videos.forEach((v) => observer.observe(v));
  document.addEventListener('visibilitychange', updateVideos);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    updateVideos();
    window.dispatchEvent(new Event('motionchange'));
  });
  window.HeavenlyTrip = {
    get: () => ({
      service: $('#service-request').value,
      vehicle: state.vehicle,
      tour: state.tour,
      tourName: state.tour === '' ? '' : tourLabel(),
      people: $('#people').value,
      date: state.date,
      pickup: $('#pickup').value,
      name: $('#name').value,
      accommodation: $('#accommodation').value,
    }),
    setService: (value) => {
      if ([...$('#service-request').options].some((o) => o.value === value)) {
        $('#service-request').value = value;
        $('#service-request').dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
    setVehicle: (index) => {
      if (Number.isInteger(index) && index >= 0 && index < VEHICLES.length) {
        state.vehicle = String(index);
        $('#vehicle-select').value = String(index);
        render();
      }
    },
    setFiveDay: () => {
      $('#service-request').value = 'Custom multi-day South India tour';
      $('#service-request').dispatchEvent(new Event('change', { bubbles: true }));
      chooseTour('custom');
      // These indexes are the stops included in the existing five-day itinerary.
      state.stops = [0, 1, 2, 3, 4, 5, 7, 9, 10];
      render();
    },
  };
  if (saved.tour === 'custom' || /^[0-4]$/.test(String(saved.tour))) {
    state.tour = String(saved.tour);
    state.stops = Array.isArray(saved.stops)
      ? [...new Set(saved.stops.filter((n) => Number.isInteger(n) && n >= 0 && n < STOPS.length))]
      : [];
    $('#tour-select').value = state.tour;
  }
  if (/^[0-3]$/.test(String(saved.vehicle))) {
    state.vehicle = String(saved.vehicle);
    $('#vehicle-select').value = state.vehicle;
  }
  if (
    typeof saved.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(saved.date) &&
    saved.date >= localDate
  ) {
    state.date = saved.date;
    $('#travel-date').value = state.date;
  }
  state.flexible = saved.flexible === true;
  $('#flexible-date').checked = state.flexible;
  $('#travel-date').disabled = state.flexible;
  render();
  updateInclusions();
})();
